import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { mockTopics } from '../data/mockData';
import type { Question } from '../types';
import { buildReviewedExamQuestions, readComvestQXAnswerKey, type OfficialExamSource, type ReviewedExamItem } from './officialExamExpansion';

const keyText = readFileSync('gabaritos/UNICAMP/UNICAMP-2026_Provas_Q_e_X.txt', 'utf8');
const answers = readComvestQXAnswerKey(keyText);
const items = JSON.parse(readFileSync('scripts/data/unicamp-2026-qx.json', 'utf8')) as ReviewedExamItem[];
const source = JSON.parse(readFileSync('scripts/data/unicamp-2026-qx-source.json', 'utf8')) as OfficialExamSource & { answerKeyTextSha256: string };
const bank = JSON.parse(readFileSync('public/questions.json', 'utf8')) as Question[];

test('Unicamp 2026 contém as 72 questões Q/X com respostas por número e fontes distintas', () => {
  const actual = bank.filter(q => q.id.startsWith('unicamp_2026_q'));
  assert.equal(actual.length, 72);
  // `figures` é gravado depois, por scripts/extrair-figuras.py, a partir da
  // página; não faz parte do que a revisão da prova gera.
  const semFiguras = actual.map(({ figures: _figures, ...q }) => q);
  assert.deepEqual(semFiguras, buildReviewedExamQuestions(items, answers, source, mockTopics));
  for (const q of actual) {
    const n = q.examSource!.questionNumber!;
    assert.equal(q.correctOptionId, answers.get(n), `gabarito da questão ${n}`);
    assert.equal(q.examSource!.sourceUrl, source.examUrl);
    assert.equal(q.examSource!.answerKeyUrl, source.answerKeyUrl);
    assert.notEqual(q.examSource!.sourceUrl, q.examSource!.answerKeyUrl);
    assert.match(q.explanation, /Resolução por etapas/);
    assert.match(q.explanation, /Revisão ativa/);
    assert.match(q.explanation, /Exercício autoral/);
    assert.match(q.explanation, /Critérios de resposta/);
  }
  // The paired-source question asks about human and non-human agents, not society alone.
  assert.equal(actual.find(q => q.examSource?.questionNumber === 23)!.correctOptionId, 'd');
});

test('imagens publicadas são as páginas oficiais conferidas, incluindo textos e continuação', () => {
  assert.equal(createHash('sha256').update(keyText).digest('hex'), source.answerKeyTextSha256);
  for (const media of source.media) {
    assert.equal(createHash('sha256').update(readFileSync(`public${media.url}`)).digest('hex'), media.sha256);
  }
  const expected: Record<number, number[]> = {
    7: [4, 5], 12: [5, 6], 15: [6, 7], 24: [10, 11], 27: [11, 12],
    30: [12, 13], 33: [13, 14], 38: [15, 16], 41: [16, 17], 48: [18, 19],
    56: [20, 21], 60: [22, 23], 64: [23, 24],
  };
  for (const [number, pages] of Object.entries(expected)) {
    const question = bank.find(q => q.id === `unicamp_2026_q${number.padStart(2, '0')}`)!;
    assert.deepEqual(question.originalPages!.map(page => page.page), pages, `contexto da questão ${number}`);
  }
  // As alternativas da 13 são gráficos. Sem a página na tela, cada gráfico é
  // descrito no enunciado e a alternativa remete a essa descrição.
  const graphical = bank.find(q => q.id === 'unicamp_2026_q13')!;
  assert.ok(graphical.options.every(option => /descrito no enunciado/.test(option.text)));
  assert.match(graphical.prompt, /^a\) reta de 0 a 300 m/m);
  assert.match(graphical.prompt, /^d\) reta de 0 a cerca de 320 m/m);
});

test('gabarito rejeita versão trocada, numeração duplicada e tabela truncada', () => {
  assert.throws(() => readComvestQXAnswerKey(keyText.replace(/PROVAS Q e X/i, 'PROVAS R e Y')), /Q\/X/);
  assert.throws(() => readComvestQXAnswerKey(keyText.replace('72 D', '71 D')), /repetido/);
  assert.throws(() => readComvestQXAnswerKey(keyText.replace(/^18 D.*$/m, '')), /incompleto/);
  assert.equal(answers.get(9), 'c');
  assert.equal(answers.get(72), 'd');
});

test('importação recusa anulada, contexto sem mídia, alternativa vazia e currículo inválido', () => {
  const invalidKey = new Map(answers); invalidKey.set(1, '*');
  assert.throws(() => buildReviewedExamQuestions(items, invalidKey, source, mockTopics), /anulado/);
  const replace = (patch: Partial<ReviewedExamItem>) => [{ ...items[0], ...patch }, ...items.slice(1)];
  assert.throws(() => buildReviewedExamQuestions(replace({ pages: [99] }), answers, source, mockTopics), /não preservada/);
  assert.throws(() => buildReviewedExamQuestions(replace({ options: [{ id: 'a', text: '' }, ...items[0].options.slice(1)] }), answers, source, mockTopics), /incompletas/);
  assert.throws(() => buildReviewedExamQuestions(replace({ chapter: 'Capítulo inexistente' }), answers, source, mockTopics), /currículo/);
});
