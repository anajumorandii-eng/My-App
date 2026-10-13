import type { Question, Topic } from '../types';

export interface ReviewedExamItem {
  number: number;
  topicId: string;
  subject: string;
  chapter: string;
  title: string;
  concept: string;
  steps: string[];
  trap: string;
  retrieval: string[];
  transfer: string;
  criteria: string[];
  difficulty: Question['difficulty'];
  options: Question['options'];
  pages: number[];
}

export interface OfficialExamSource {
  board: string;
  year: number;
  phase: string;
  version: string;
  examUrl: string;
  answerKeyUrl: string;
  media: { page: number; url: string; sha256: string }[];
}

/** Q/X has numbered pairs in four columns, unlike the FUVEST version table. */
export function readComvestQXAnswerKey(text: string): Map<number, string> {
  if (!/PROVAS\s+Q\s+(?:e|E)\s+X/.test(text)) throw new Error('Gabarito não corresponde às provas Q/X.');
  const answers = new Map<number, string>();
  for (const line of text.split('\n')) {
    if (!/^\s*\d{2}\s+[A-D*](?:\s+\d{2}\s+[A-D*]){3}\s*$/.test(line)) continue;
    for (const pair of line.matchAll(/(\d{2})\s+([A-D*])/g)) {
      const number = Number(pair[1]);
      if (answers.has(number)) throw new Error(`Número repetido no gabarito: ${number}.`);
      answers.set(number, pair[2].toLowerCase());
    }
  }
  if (answers.size !== 72 || Array.from({ length: 72 }, (_, i) => i + 1).some(n => !answers.has(n))) {
    throw new Error('Gabarito Q/X incompleto: esperadas as 72 questões numeradas.');
  }
  return answers;
}

export function buildReviewedExamQuestions(
  items: ReviewedExamItem[], answers: Map<number, string>, source: OfficialExamSource, topics: Topic[],
): Question[] {
  const catalog = new Map(topics.map(topic => [topic.id, topic]));
  const numbers = new Set<number>();
  const labels = ['Identificar dados', 'Escolher a estratégia', 'Aplicar o conceito', 'Justificar', 'Conferir'];
  if (items.length !== 72) throw new Error('A expansão deve conter as 72 fichas revisadas.');
  return items.map(item => {
    const topic = catalog.get(item.topicId);
    if (!Number.isInteger(item.number) || item.number < 1 || item.number > 72 || numbers.has(item.number)) {
      throw new Error(`Número inválido ou duplicado: ${item.number}.`);
    }
    numbers.add(item.number);
    if (!topic || topic.subject !== item.subject || !topic.chapters.includes(item.chapter)) {
      throw new Error(`Classificação fora do currículo: questão ${item.number}.`);
    }
    const answer = answers.get(item.number);
    if (!answer || answer === '*' || !item.options.some(option => option.id === answer)) {
      throw new Error(`Gabarito ausente, anulado ou inválido: questão ${item.number}.`);
    }
    if (item.options.map(option => option.id).join('') !== 'abcd' || item.options.some(option => !option.text.trim())) {
      throw new Error(`Alternativas incompletas: questão ${item.number}.`);
    }
    if (item.steps.length !== 5 || item.steps.some(step => !step.trim()) || item.retrieval.length !== 2 ||
        item.retrieval.some(question => !question.trim()) || item.criteria.length < 2 ||
        item.criteria.some(criterion => !criterion.trim()) || !item.transfer.trim() || !item.trap.trim() ||
        !item.title.trim() || !item.concept.trim() || !['easy', 'medium', 'hard'].includes(item.difficulty)) {
      throw new Error(`Comentário ou revisão incompletos: questão ${item.number}.`);
    }
    if (!item.pages.length || new Set(item.pages).size !== item.pages.length) {
      throw new Error(`Páginas ausentes ou repetidas: questão ${item.number}.`);
    }
    const originalPages = item.pages.map(page => {
      const media = source.media.find(candidate => candidate.page === page);
      if (!media) throw new Error(`Página ${page} não preservada: questão ${item.number}.`);
      return { page, url: media.url };
    });
    return {
      id: `unicamp_2026_q${String(item.number).padStart(2, '0')}`,
      topicId: item.topicId, subject: item.subject, chapter: item.chapter,
      prompt: `UNICAMP 2026 · 1ª fase · prova Q/X · questão ${item.number}.\nTema de estudo: ${item.title}.\nLeia o enunciado original, os textos e as figuras nas páginas abaixo. Responda apenas à questão ${item.number}.`,
      options: item.options, correctOptionId: answer, difficulty: item.difficulty, originalPages,
      sourceMaterial: { file: 'UNICAMP_2026_1a_fase_Q_X.pdf', page: item.pages[0], questionNumber: item.number },
      examSource: {
        board: source.board, year: source.year, sourceUrl: source.examUrl,
        answerKeyUrl: source.answerKeyUrl, phase: source.phase, version: source.version, questionNumber: item.number,
      },
      explanation: [
        `Gabarito oficial: ${answer.toUpperCase()} · ${source.board} ${source.year} · ${source.version} · questão ${item.number}.`,
        `Conceito e pré-requisitos\n${item.concept}`,
        `Resolução por etapas\n${item.steps.map((step, index) => `${index + 1}. ${labels[index]}: ${step}`).join('\n')}`,
        `Padrão de cobrança e pegadinha\n${item.trap}`,
        `Revisão ativa — responda sem consultar\n${item.retrieval.map((question, index) => `${index + 1}. ${question}`).join('\n')}`,
        `Transferência — ${item.transfer}\nCritérios de resposta:\n${item.criteria.map(criterion => `• ${criterion}`).join('\n')}`,
      ].join('\n\n'),
    };
  });
}
