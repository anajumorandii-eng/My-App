import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { google } from 'googleapis';
import { buildCalendarEventsQuery } from './serverCalendar';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const GEMINI_MODEL = 'gemini-3.1-pro-preview';
// All AI features use the model's deepest reasoning level — these are tutoring
// responses where answer quality matters more than shaving off latency.
const DEEP_THINKING_CONFIG = { thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH } };

// OAuth config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const REDIRECT_URI = `${APP_URL}/api/oauth/callback`;

function getOAuthClient() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// API routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Fetch events from Calendar
app.get('/api/calendar/events', async (req, res) => {
  const date = req.query.date;
  if (typeof date !== 'string') {
    return res.status(400).json({ error: 'A valid date in YYYY-MM-DD format is required' });
  }

  let query;
  try {
    query = buildCalendarEventsQuery(date);
  } catch {
    return res.status(400).json({ error: 'A valid date in YYYY-MM-DD format is required' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list(query);
    
    res.json({
      events: (response.data.items || []).map((event) => ({
        id: event.id || '',
        summary: event.summary || '',
        start: event.start || {},
        end: event.end || {},
        transparency: event.transparency || 'opaque',
        status: event.status || 'confirmed',
      })),
    });
  } catch (error) {
    console.error('Calendar Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Fetch files from Drive
app.get('/api/drive/files', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType, webViewLink, iconLink)',
      orderBy: 'modifiedTime desc'
    });
    
    res.json({ files: response.data.files || [] });
  } catch (error) {
    console.error('Drive Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// AI Routes
app.post('/api/ai/socratic', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }
  
  try {
    const { question, topic, history } = req.body;
    
    let prompt = `Você é o JUJU, um Tutor Socrático especializado no vestibular de Medicina.\n`;
    prompt += `Seu objetivo não é dar a resposta pronta, mas guiar o aluno através de perguntas reflexivas para que ele chegue à resposta sozinho.\n`;
    prompt += `Tópico: ${topic}\n`;
    prompt += `Dúvida do aluno: ${question}\n\n`;
    prompt += `Responda de forma concisa, direta, orientada a prova, em português do Brasil.\n`;
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });
    
    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/error-hypothesis', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { topic, subject, errorType, notes } = req.body;

    let prompt = `Você é o JUJU, um tutor especialista em diagnosticar erros de estudantes de vestibular de Medicina.\n`;
    prompt += `Um aluno registrou um erro com os seguintes dados:\n`;
    prompt += `Tópico: ${topic} (${subject})\n`;
    prompt += `Categoria do erro: ${errorType}\n`;
    prompt += `Relato do aluno sobre o que aconteceu: ${notes}\n\n`;
    prompt += `Gere uma hipótese curta e objetiva (2-3 frases) sobre a causa raiz provável desse erro, `;
    prompt += `e uma sugestão prática de como evitá-lo da próxima vez. Responda em português do Brasil, sem saudação.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/question-explanation', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { prompt: questionPrompt, subject, selectedAnswer, correctAnswer, isCorrect, baseExplanation } = req.body;

    let prompt = `Você é o JUJU, um tutor especialista em vestibular de Medicina.\n`;
    prompt += `Um aluno respondeu a seguinte questão de ${subject}:\n`;
    prompt += `"${questionPrompt}"\n\n`;
    prompt += `Resposta correta: ${correctAnswer}\n`;
    prompt += `Resposta escolhida pelo aluno: ${selectedAnswer}\n`;
    prompt += `O aluno acertou? ${isCorrect ? 'Sim' : 'Não'}\n`;
    prompt += `Explicação padrão já mostrada ao aluno: ${baseExplanation}\n\n`;
    prompt += `Gere uma explicação mais aprofundada e personalizada (4-6 frases) que vá além da explicação padrão: `;
    prompt += `explore o raciocínio conceitual, e se o aluno errou, aponte possivelmente onde o raciocínio dele desviou. `;
    prompt += `Responda em português do Brasil, direto ao ponto, sem saudação.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

const BACKLOG_EXERCISE_INSTRUCTIONS: Record<string, string> = {
  explain_steps: 'Apresente um problema típico desse tópico já resolvido, com os passos numerados, mas SEM explicar o porquê de cada passo — apenas a operação/ação de cada um. Termine pedindo explicitamente ao aluno: "Explique, com suas palavras, por que cada passo abaixo é válido e qual princípio ele usa."',
  fill_gap: 'Apresente um problema típico desse tópico com a resolução iniciada passo a passo, mas OMITA o último passo (ou um passo intermediário decisivo) da resolução. Termine com a pergunta direta: "Qual é o passo que falta aqui, e por quê?"',
  solve: 'Crie uma questão nova e direta desse tópico, no nível de vestibular de Medicina de alta concorrência (Fuvest, Unicamp, Unesp, Famerp, Unifesp), pedindo para o aluno resolver sozinho, mostrando o raciocínio completo.',
  solve_variant: 'Crie uma questão desse tópico diferente de uma questão-base típica — mude a representação (texto, gráfico descrito, tabela) ou combine com um subtópico próximo/relacionado — pedindo para o aluno resolver mostrando o raciocínio completo.',
  discursive: 'Crie uma questão discursiva no formato de 2ª fase de vestibular (Fuvest, Unicamp, Unesp, Famerp ou Unifesp), com enunciado completo, podendo ter sub-itens (a, b, c), pedindo resposta discursiva completa.',
};

app.post('/api/ai/backlog-exercise', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { topic, subject, mode } = req.body;
    const instruction = BACKLOG_EXERCISE_INSTRUCTIONS[mode] ?? BACKLOG_EXERCISE_INSTRUCTIONS.solve;

    let prompt = `Você é o JUJU, um tutor especialista em vestibular de Medicina.\n`;
    prompt += `Tópico: ${topic} (${subject}).\n\n`;
    prompt += `${instruction}\n\n`;
    prompt += `Mostre apenas o exercício em si (enunciado e, quando aplicável, a resolução parcial e a pergunta final) — não dê a resposta completa nem revele o que foi omitido. `;
    prompt += `Responda em português do Brasil, sem saudação.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/backlog-correction', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { topic, subject, exercise, studentAnswer, groundingAnswer } = req.body;

    let prompt = `Você é o JUJU, um corretor especialista em vestibular de Medicina.\n`;
    prompt += `Tópico: ${topic} (${subject}).\n\n`;
    prompt += `Exercício proposto ao aluno:\n"${exercise}"\n\n`;
    if (groundingAnswer) {
      prompt += `Informação de referência sobre a resposta correta (use isso para embasar sua correção):\n${groundingAnswer}\n\n`;
    } else {
      prompt += `Primeiro, resolva mentalmente o exercício para determinar a resposta ou abordagem correta antes de corrigir.\n\n`;
    }
    prompt += `Resposta do aluno:\n"${studentAnswer}"\n\n`;
    prompt += `Avalie a resposta do aluno: aponte o que está correto, o que está faltando ou errado, e dê uma avaliação qualitativa clara ao final (Fraco, Mediano ou Forte). `;
    prompt += `Seja específico e direto, como um corretor de banca faria. Responda em português do Brasil, sem saudação.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/discursive-feedback', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { board, subject, prompt: questionPrompt, modelAnswer, studentAnswer } = req.body;

    let prompt = `Você é o JUJU, um corretor especialista em questões discursivas de 2ª fase de vestibular de Medicina (banca: ${board}).\n`;
    prompt += `Questão de ${subject}:\n"${questionPrompt}"\n\n`;
    prompt += `Pontos-chave esperados na resposta:\n${(modelAnswer as string[]).map((m: string) => `- ${m}`).join('\n')}\n\n`;
    prompt += `Resposta do aluno:\n"${studentAnswer}"\n\n`;
    prompt += `Avalie a resposta do aluno comparando com os pontos-chave esperados. Aponte o que foi bem coberto, `;
    prompt += `o que está faltando ou incompleto, e erros conceituais se houver — como um corretor de banca faria. `;
    prompt += `Termine com uma avaliação qualitativa clara (Fraco, Mediano ou Forte). `;
    prompt += `Responda em português do Brasil, de forma direta e específica, sem saudação.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/podcast-script', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { title, subject, topic } = req.body;

    let prompt = `Você é o roteirista do Podcast JUJU, um podcast de revisão para vestibular de Medicina.\n`;
    prompt += `Escreva um roteiro de narração (150 a 250 palavras) sobre o episódio "${title}", `;
    prompt += `do tema ${topic} (${subject}).\n`;
    prompt += `O texto será lido em voz alta por um narrador, então escreva em prosa corrida, tom didático e envolvente, `;
    prompt += `como se estivesse explicando o assunto para o aluno durante um trajeto de carro. `;
    prompt += `Não use marcações, listas ou markdown — apenas o texto puro do roteiro, em português do Brasil.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/progress-insight', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { topics, overallAverage, strongest, weakest } = req.body;

    let prompt = `Você é o JUJU, um tutor especialista em vestibular de Medicina que analisa o progresso do aluno.\n`;
    prompt += `Domínio médio geral: ${overallAverage}/100.\n`;
    prompt += `Tópico mais forte: ${strongest} (o aluno já domina bem).\n`;
    prompt += `Tópico que mais precisa de atenção: ${weakest}.\n`;
    prompt += `Domínio por tópico: ${JSON.stringify(topics)}\n\n`;
    prompt += `Escreva um diagnóstico curto (3-5 frases) em tom direto e motivador, explicando o que esses números revelam `;
    prompt += `sobre o padrão de estudo do aluno e qual deve ser a prioridade dos próximos dias. `;
    prompt += `Responda em português do Brasil, sem saudação, sem markdown.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/review-tip', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { topic, subject, level, daysSinceReview } = req.body;

    let prompt = `Você é o JUJU, um tutor especialista em vestibular de Medicina.\n`;
    prompt += `Um aluno vai revisar agora o tópico "${topic}" (${subject}).\n`;
    prompt += `Domínio atual estimado: ${level}%. Dias desde a última revisão: ${daysSinceReview}.\n\n`;
    prompt += `Gere uma dica rápida de revisão (3-4 frases) relembrando os 2-3 conceitos-chave mais importantes desse tópico, `;
    prompt += `como um lembrete mental antes de praticar. Responda em português do Brasil, direto, sem saudação, sem markdown.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

app.post('/api/ai/method-example', async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: 'Gemini API not configured.' });
  }

  try {
    const { methodName, methodSummary, topic, subject } = req.body;

    let prompt = `Você é o JUJU, um tutor especialista em técnicas de estudo para vestibular de Medicina.\n`;
    prompt += `Técnica de estudo: ${methodName} — ${methodSummary}\n`;
    prompt += `Tópico do aluno para aplicar a técnica: ${topic} (${subject})\n\n`;
    prompt += `Escreva um exemplo curto e concreto (3-4 frases) mostrando exatamente como aplicar essa técnica nesse tópico específico, `;
    prompt += `como se fosse um passo a passo prático. Responda em português do Brasil, direto, sem saudação, sem markdown.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: DEEP_THINKING_CONFIG,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Falha ao processar solicitação de IA' });
  }
});

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
