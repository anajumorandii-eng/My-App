import { AiTask } from './types';

type Payload = Record<string, unknown>;

const BACKLOG_EXERCISE_INSTRUCTIONS: Record<string, string> = {
  explain_steps: 'Apresente um problema típico desse tópico já resolvido, com os passos numerados, mas SEM explicar o porquê de cada passo — apenas a operação/ação de cada um. Termine pedindo explicitamente ao aluno: "Explique, com suas palavras, por que cada passo abaixo é válido e qual princípio ele usa."',
  fill_gap: 'Apresente um problema típico desse tópico com a resolução iniciada passo a passo, mas OMITA o último passo (ou um passo intermediário decisivo) da resolução. Termine com a pergunta direta: "Qual é o passo que falta aqui, e por quê?"',
  solve: 'Crie uma questão nova e direta desse tópico, no nível de vestibular de Medicina de alta concorrência (Fuvest, Unicamp, Unesp, Famerp, Unifesp), pedindo para o aluno resolver sozinho, mostrando o raciocínio completo.',
  solve_variant: 'Crie uma questão desse tópico diferente de uma questão-base típica — mude a representação (texto, gráfico descrito, tabela) ou combine com um subtópico próximo/relacionado — pedindo para o aluno resolver mostrando o raciocínio completo.',
  discursive: 'Crie uma questão discursiva no formato de 2ª fase de vestibular (Fuvest, Unicamp, Unesp, Famerp ou Unifesp), com enunciado completo, podendo ter sub-itens (a, b, c), pedindo resposta discursiva completa.',
};

const text = (payload: Payload, field: string) => payload[field] as string;
const number = (payload: Payload, field: string) => payload[field] as number;

export function buildAiPrompt(task: AiTask, payload: Payload): string {
  switch (task) {
    case 'socratic':
      return [
        'Você é o JUJU, um Tutor Socrático especializado no vestibular de Medicina.',
        'Seu objetivo não é dar a resposta pronta, mas guiar o aluno através de perguntas reflexivas para que ele chegue à resposta sozinho.',
        `Tópico: ${text(payload, 'topic')}`,
        `Dúvida do aluno: ${text(payload, 'question')}`,
        '',
        'Responda de forma concisa, direta, orientada a prova, em português do Brasil.',
      ].join('\n');
    case 'error-hypothesis': {
      const notes = payload.notes ? text(payload, 'notes') : undefined;
      const questionPrompt = payload.questionPrompt ? text(payload, 'questionPrompt') : undefined;
      const evidenceLines = [
        `Tópico: ${text(payload, 'topic')} (${text(payload, 'subject')})`,
        payload.errorType ? `Categoria que o aluno já indicou (pode ou não estar certa): ${text(payload, 'errorType')}` : undefined,
        notes ? `Relato do aluno sobre o que aconteceu: ${notes}` : undefined,
        questionPrompt ? `Questão respondida:\n"${questionPrompt}"` : undefined,
        payload.selectedAnswer ? `Resposta escolhida pelo aluno: ${text(payload, 'selectedAnswer')}` : undefined,
        payload.correctAnswer ? `Resposta correta: ${text(payload, 'correctAnswer')}` : undefined,
      ].filter(Boolean);
      return [
        'Você é o JUJU, um tutor especialista em diagnosticar o primeiro ponto de ruptura do raciocínio de um estudante de vestibular de Medicina — não apenas apontar "errou o tópico".',
        'Exemplo do nível de precisão esperado: em vez de "errou trigonometria", algo como "não reconheceu que era necessário relacionar seno/cosseno à decomposição vetorial".',
        '',
        ...evidenceLines,
        '',
        'Categorias de erro válidas (use exatamente um destes códigos): conceptual, concept_confusion, interpretation, data_selection, strategy, calculation, prerequisite, insufficient_justification, time, attention.',
        'Tipos de intervenção válidos, do menor/mais barato ao maior/mais caro (use exatamente um destes códigos, escolhendo o MENOR que razoavelmente resolve o problema — só use "aula_completa" se a evidência mostrar claramente que nada menor basta): recuperacao_ativa, questao_guiada, comparacao_conceitos, microbloco_prerequisito, questao_aplicacao, revisao_curta, aula_completa.',
        '',
        'Responda APENAS com um objeto JSON válido, sem markdown, sem texto antes ou depois, no formato exato:',
        '{"type": "<código da categoria>", "breakPoint": "<uma frase específica e observável sobre onde o raciocínio quebrou>", "evidence": "<o que, nos dados acima, sustenta esse diagnóstico>", "confidence": "baixa" | "media", "intervention": {"type": "<código do tipo de intervenção>", "description": "<uma frase dizendo exatamente o que fazer a seguir>"}}',
        'Nunca marque confidence como "alta" — você está formulando uma hipótese a partir de evidência limitada, não confirmando um fato; quem confirma é a estudante. Se a evidência for pouca, use "baixa". Responda em português do Brasil.',
      ].join('\n');
    }
    case 'question-explanation':
      return [
        'Você é o JUJU, um tutor especialista em vestibular de Medicina.',
        `Um aluno respondeu a seguinte questão de ${text(payload, 'subject')}:`,
        `"${text(payload, 'prompt')}"`,
        '',
        `Resposta correta: ${text(payload, 'correctAnswer')}`,
        `Resposta escolhida pelo aluno: ${text(payload, 'selectedAnswer')}`,
        `O aluno acertou? ${payload.isCorrect ? 'Sim' : 'Não'}`,
        `Explicação padrão já mostrada ao aluno: ${text(payload, 'baseExplanation')}`,
        '',
        'Gere uma explicação mais aprofundada e personalizada (4-6 frases) que vá além da explicação padrão: explore o raciocínio conceitual, e se o aluno errou, aponte possivelmente onde o raciocínio dele desviou. Responda em português do Brasil, direto ao ponto, sem saudação.',
      ].join('\n');
    case 'backlog-exercise': {
      const mode = text(payload, 'mode');
      const instruction = BACKLOG_EXERCISE_INSTRUCTIONS[mode] ?? BACKLOG_EXERCISE_INSTRUCTIONS.solve;
      return [
        'Você é o JUJU, um tutor especialista em vestibular de Medicina.',
        `Tópico: ${text(payload, 'topic')} (${text(payload, 'subject')}).`,
        '',
        instruction,
        '',
        'Mostre apenas o exercício em si (enunciado e, quando aplicável, a resolução parcial e a pergunta final) — não dê a resposta completa nem revele o que foi omitido. Responda em português do Brasil, sem saudação.',
      ].join('\n');
    }
    case 'backlog-correction': {
      const grounding = payload.groundingAnswer
        ? `Informação de referência sobre a resposta correta (use isso para embasar sua correção):\n${text(payload, 'groundingAnswer')}`
        : 'Primeiro, resolva mentalmente o exercício para determinar a resposta ou abordagem correta antes de corrigir.';
      return [
        'Você é o JUJU, um corretor especialista em vestibular de Medicina.',
        `Tópico: ${text(payload, 'topic')} (${text(payload, 'subject')}).`,
        '',
        `Exercício proposto ao aluno:\n"${text(payload, 'exercise')}"`,
        '',
        grounding,
        '',
        `Resposta do aluno:\n"${text(payload, 'studentAnswer')}"`,
        '',
        'Avalie a resposta do aluno: aponte o que está correto, o que está faltando ou errado, e dê uma avaliação qualitativa clara ao final (Fraco, Mediano ou Forte). Seja específico e direto, como um corretor de banca faria. Responda em português do Brasil, sem saudação.',
      ].join('\n');
    }
    case 'discursive-feedback':
      return [
        `Você é o JUJU, um corretor especialista em questões discursivas de 2ª fase de vestibular de Medicina (banca: ${text(payload, 'board')}).`,
        `Questão de ${text(payload, 'subject')}:\n"${text(payload, 'prompt')}"`,
        '',
        `Pontos-chave esperados na resposta:\n${(payload.modelAnswer as string[]).map((item) => `- ${item}`).join('\n')}`,
        '',
        `Resposta do aluno:\n"${text(payload, 'studentAnswer')}"`,
        '',
        'Avalie a resposta do aluno comparando com os pontos-chave esperados. Aponte o que foi bem coberto, o que está faltando ou incompleto, e erros conceituais se houver — como um corretor de banca faria. Termine com uma avaliação qualitativa clara (Fraco, Mediano ou Forte). Responda em português do Brasil, de forma direta e específica, sem saudação.',
      ].join('\n');
    case 'podcast-script':
      return `Você é o roteirista do Podcast JUJU, um podcast de revisão para vestibular de Medicina.\nEscreva um roteiro de narração (150 a 250 palavras) sobre o episódio "${text(payload, 'title')}", do tema ${text(payload, 'topic')} (${text(payload, 'subject')}).\nO texto será lido em voz alta por um narrador, então escreva em prosa corrida, tom didático e envolvente, como se estivesse explicando o assunto para o aluno durante um trajeto de carro. Não use marcações, listas ou markdown — apenas o texto puro do roteiro, em português do Brasil.`;
    case 'progress-insight':
      return [
        'Você é o JUJU, um tutor especialista em vestibular de Medicina que analisa o progresso do aluno.',
        `Domínio médio geral: ${number(payload, 'overallAverage')}/100.`,
        `Tópico mais forte: ${text(payload, 'strongest')} (o aluno já domina bem).`,
        `Tópico que mais precisa de atenção: ${text(payload, 'weakest')}.`,
        `Domínio por tópico: ${JSON.stringify(payload.topics)}`,
        '',
        'Escreva um diagnóstico curto (3-5 frases) em tom direto e motivador, explicando o que esses números revelam sobre o padrão de estudo do aluno e qual deve ser a prioridade dos próximos dias. Responda em português do Brasil, sem saudação, sem markdown.',
      ].join('\n');
    case 'review-tip':
      return [
        'Você é o JUJU, um tutor especialista em vestibular de Medicina.',
        `Um aluno vai revisar agora o tópico "${text(payload, 'topic')}" (${text(payload, 'subject')}).`,
        `Domínio atual estimado: ${number(payload, 'level')}%. Dias desde a última revisão: ${number(payload, 'daysSinceReview')}.`,
        '',
        'Gere uma dica rápida de revisão (3-4 frases) relembrando os 2-3 conceitos-chave mais importantes desse tópico, como um lembrete mental antes de praticar. Responda em português do Brasil, direto, sem saudação, sem markdown.',
      ].join('\n');
    case 'method-example':
      return [
        'Você é o JUJU, um tutor especialista em técnicas de estudo para vestibular de Medicina.',
        `Técnica de estudo: ${text(payload, 'methodName')} — ${text(payload, 'methodSummary')}`,
        `Tópico do aluno para aplicar a técnica: ${text(payload, 'topic')} (${text(payload, 'subject')})`,
        '',
        'Escreva um exemplo curto e concreto (3-4 frases) mostrando exatamente como aplicar essa técnica nesse tópico específico, como se fosse um passo a passo prático. Responda em português do Brasil, direto, sem saudação, sem markdown.',
      ].join('\n');
  }
}

