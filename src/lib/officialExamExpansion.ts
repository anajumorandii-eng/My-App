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
  /** Enunciado transcrito da prova, conferido contra a página. Sem ele a
   * questão só remetia à imagem da página, que saiu da tela a pedido da Ana
   * Júlia; figura que o texto não carrega vira descrição entre colchetes. */
  statement?: string;
}

export interface OfficialExamSource {
  board: string;
  year: number;
  phase: string;
  version: string;
  excludedNumbers?: number[];
  examUrl: string;
  answerKeyUrl: string;
  media: { page: number; url: string; sha256: string }[];
}

export interface ReviewedOfficialSource extends OfficialExamSource {
  idPrefix: string;
  sourceFile: string;
  totalQuestions: number;
  firstNumber: number;
  optionIds: 'abcd' | 'abcde';
  selectedNumbers: number[];
}

/** Comvest's numbered column pairs belong to one version, not four versions. */
export function readComvestAnswerKey(text: string, version: string): Map<number, string> {
  if (!/^[A-Z]\/[A-Z]$/.test(version)) throw new Error('Versão da prova inválida.');
  const [first, second] = version.split('/');
  if (!new RegExp(`PROVAS\\s+${first}\\s+(?:e|E)\\s+${second}\\b`).test(text)) {
    throw new Error(`Gabarito não corresponde às provas ${version}.`);
  }
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
    throw new Error(`Gabarito ${version} incompleto: esperadas as 72 questões numeradas.`);
  }
  return answers;
}
export function readComvestQXAnswerKey(text: string): Map<number, string> {
  return readComvestAnswerKey(text, 'Q/X');
}

export function buildReviewedExamQuestions(
  items: ReviewedExamItem[], answers: Map<number, string>, source: OfficialExamSource, topics: Topic[],
): Question[] {
  if (!Number.isInteger(source.year) || !/^[A-Z]\/[A-Z]$/.test(source.version) ||
      !['UNICAMP','COMVEST'].includes(source.board.toUpperCase())) throw new Error('Identidade da fonte Unicamp inválida.');
  const excluded = new Set(source.excludedNumbers ?? []);
  if (items.length !== 72 - excluded.size) throw new Error(`A expansão deve conter ${72 - excluded.size} fichas revisadas.`);
  return buildReviewedOfficialQuestions(items, answers, {
    ...source, idPrefix: `unicamp_${source.year}`, sourceFile: `UNICAMP_${source.year}_1a_fase_${source.version.replace('/', '_')}.pdf`,
    totalQuestions: 72, firstNumber: 1, optionIds: 'abcd',
    selectedNumbers: Array.from({length:72}, (_, i) => i + 1).filter(n => !excluded.has(n)),
  }, topics);
}

export function buildReviewedOfficialQuestions(
  items: ReviewedExamItem[], answers: Map<number, string>, source: ReviewedOfficialSource, topics: Topic[],
): Question[] {
  const catalog = new Map(topics.map(topic => [topic.id, topic]));
  const numbers = new Set<number>();
  const labels = ['Identificar dados', 'Escolher a estratégia', 'Aplicar o conceito', 'Justificar', 'Conferir'];
  const lastNumber = source.firstNumber + source.totalQuestions - 1;
  const inRange = (n: number) => Number.isInteger(n) && n >= source.firstNumber && n <= lastNumber;
  if (!Number.isInteger(source.year) || !Number.isInteger(source.totalQuestions) || source.totalQuestions < 1 ||
      !Number.isInteger(source.firstNumber) || source.firstNumber < 1 || !/^[a-z0-9_]+$/.test(source.idPrefix) ||
      !source.sourceFile.endsWith('.pdf') || !source.board.trim() || !source.phase.trim() || !source.version.trim() ||
      !['abcd', 'abcde'].includes(source.optionIds)) throw new Error('Identidade da fonte oficial inválida.');
  if (answers.size !== source.totalQuestions || [...answers].some(([n, a]) => !inRange(n) ||
      (a !== '*' && (a.length !== 1 || !source.optionIds.includes(a))))) throw new Error('Gabarito incompleto ou fora da faixa oficial.');
  if (new Set(source.media.map(media => media.page)).size !== source.media.length || source.media.some(media =>
      !Number.isInteger(media.page) || media.page < 1 || !media.url.trim() || !/^[a-f0-9]{64}$/.test(media.sha256))) {
    throw new Error('Catálogo de páginas inválido.');
  }
  const excluded = new Set(source.excludedNumbers ?? []);
  if (excluded.size !== (source.excludedNumbers ?? []).length || [...excluded].some(number =>
      !inRange(number) || answers.get(number) !== '*')) {
    throw new Error('Exclusão exige questão anulada no gabarito oficial.');
  }
  const selected = new Set(source.selectedNumbers);
  if (!selected.size || selected.size !== source.selectedNumbers.length || items.length !== selected.size ||
      [...selected].some(n => !inRange(n) || excluded.has(n) || answers.get(n) === '*') ||
      [...answers].some(([n,a]) => a === '*' && !excluded.has(n))) throw new Error('Seleção inválida: item anulado ou anulação não registrada.');
  return items.map(item => {
    const topic = catalog.get(item.topicId);
    if (!inRange(item.number) || !selected.has(item.number) || numbers.has(item.number) || excluded.has(item.number)) {
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
    if (item.options.map(option => option.id).join('') !== source.optionIds || item.options.some(option => !option.text.trim())) {
      throw new Error(`Alternativas incompletas: questão ${item.number}.`);
    }
    if (item.steps.length !== 5 || item.steps.some(step => !step.trim()) || item.retrieval.length !== 2 ||
        item.retrieval.some(question => !question.trim()) || item.criteria.length < 2 ||
        item.criteria.some(criterion => !criterion.trim()) || !item.transfer.trim() || !item.trap.trim() ||
        !item.title.trim() || !item.concept.trim() || !['easy', 'medium', 'hard'].includes(item.difficulty)) {
      throw new Error(`Comentário ou revisão incompletos: questão ${item.number}.`);
    }
    if (!item.pages.length || new Set(item.pages).size !== item.pages.length || item.pages.some(page => !Number.isInteger(page) || page < 1)) {
      throw new Error(`Páginas ausentes ou repetidas: questão ${item.number}.`);
    }
    const originalPages = item.pages.map(page => {
      const media = source.media.find(candidate => candidate.page === page);
      if (!media) throw new Error(`Página ${page} não preservada: questão ${item.number}.`);
      return { page, url: media.url };
    });
    return {
      id: `${source.idPrefix}_q${String(item.number).padStart(2, '0')}`,
      topicId: item.topicId, subject: item.subject, chapter: item.chapter,
      prompt: item.statement?.trim() ||
        `${['UNICAMP','COMVEST'].includes(source.board.toUpperCase()) ? 'UNICAMP' : source.board} ${source.year} · ${source.phase} · prova ${source.version} · questão ${item.number}.\nTema de estudo: ${item.title}.\nLeia o enunciado original, os textos e as figuras nas páginas abaixo. Responda apenas à questão ${item.number}.`,
      options: item.options, correctOptionId: answer, difficulty: item.difficulty, originalPages,
      sourceMaterial: { file: source.sourceFile, page: item.pages[0], questionNumber: item.number },
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
