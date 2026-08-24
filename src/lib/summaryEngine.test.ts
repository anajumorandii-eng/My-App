import assert from 'node:assert/strict';
import test from 'node:test';
import type { InteractiveSummary, SummaryProgress } from '../types/summary';
import { evaluateRetrievalAnswer, filterSummaries, getReadingProgress, normalizeSummaryProgress, normalizeSummaryProgressMap } from './summaryEngine';

const summaries: InteractiveSummary[] = [
  {
    id: 'thermal', title: 'Calor e mudanças de estado', subject: 'Física', topic: 'Termologia', priority: 'muito-alta',
    boards: [{ board: 'Fuvest', phases: ['primeira', 'segunda'] }], prerequisites: [], overview: 'Energia térmica em trânsito.',
    sections: [
      { id: 'intuition', title: 'Intuição', stage: 'intuicao', depth: 'rapida', content: 'Calor não é temperatura.' },
      { id: 'mechanism', title: 'Mecanismo', stage: 'conceito', depth: 'aprofundamento', content: 'Q = mcΔT.' },
    ],
    retrieval: [{ id: 'r1', prompt: 'Explique calor sensível.', expectedElements: [
      { label: 'temperatura', keywords: ['temperatura', 'variação térmica'] },
      { label: 'sem mudança de fase', keywords: ['sem mudança de fase', 'não muda de estado'] },
    ], hint: 'Pense no que muda e no que permanece.', transferPrompt: 'Compare com calor latente.' }],
    sources: [{ label: 'Roteiro Termologia', kind: 'material-interno', materialId: 'pod_fis_04' }],
  },
  {
    id: 'cop30', title: 'COP30: acordos e limites', subject: 'Atualidades', topic: 'Clima', priority: 'alta',
    boards: [{ board: 'ENEM', phases: ['unica'] }], prerequisites: [], overview: 'Negociação climática.',
    sections: [{ id: 'event', title: 'Acontecimento', stage: 'intuicao', depth: 'rapida', content: 'A conferência ocorreu em Belém.' }],
    retrieval: [], sources: [{ label: 'UNFCCC', kind: 'fonte-oficial', url: 'https://unfccc.int/cop30', verifiedAt: '2026-08-24' }],
    currentAffairs: { axis: 'clima-energia-meio-ambiente', verifiedAt: '2026-08-24' },
  },
];

test('filtra resumos por texto, banca e fase sem perder a prioridade Fuvest', () => {
  assert.deepEqual(filterSummaries(summaries, { query: 'calor', board: 'Fuvest', phase: 'segunda' }).map((item) => item.id), ['thermal']);
  assert.deepEqual(filterSummaries(summaries, { subject: 'Atualidades', board: 'Fuvest' }), []);
});

test('calcula progresso apenas pelas seções realmente lidas', () => {
  assert.equal(getReadingProgress(summaries[0], { readSectionIds: ['intuition'], status: 'em-revisao', important: false, answers: [] }), 50);
});

test('avalia a tentativa preservando acertos e aponta somente o primeiro elemento ausente', () => {
  const result = evaluateRetrievalAnswer(summaries[0].retrieval[0], 'Há variação de temperatura durante o processo.');
  assert.deepEqual(result.matchedElements, ['temperatura']);
  assert.equal(result.firstMissingElement, 'sem mudança de fase');
  assert.equal(result.transferUnlocked, false);
});

test('normaliza progresso persistido e descarta estruturas inválidas', () => {
  const fallback: SummaryProgress = { readSectionIds: [], status: 'nao-iniciado', important: false, answers: [] };
  assert.deepEqual(normalizeSummaryProgress({ readSectionIds: ['a'], status: 'dominado', important: true, answers: [] }, fallback), { readSectionIds: ['a'], status: 'dominado', important: true, answers: [] });
  assert.deepEqual(normalizeSummaryProgress({ status: 'quebrado' }, fallback), fallback);
});

test('normaliza o mapa sincronizado e ignora entradas corrompidas sem perder as válidas', () => {
  assert.deepEqual(normalizeSummaryProgressMap({
    valido: { readSectionIds: ['a'], status: 'em-revisao', important: false, answers: [] },
    corrompido: { readSectionIds: 'a', status: 'dominado', important: true, answers: [] },
  }), { valido: { readSectionIds: ['a'], status: 'em-revisao', important: false, answers: [] } });
});

test('preserva a agenda por pergunta ao normalizar dados persistidos novos', () => {
  const normalized = normalizeSummaryProgress({
    readSectionIds: [], status: 'dificuldade', important: false, answers: [],
    reviews: { q1: { questionId: 'q1', nextReviewAt: '2026-08-25T12:00:00.000Z', intervalDays: 1, lastOutcome: 'incorreta' } },
  });
  assert.equal(normalized.reviews?.q1.nextReviewAt, '2026-08-25T12:00:00.000Z');
});
