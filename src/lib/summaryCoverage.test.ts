import assert from 'node:assert/strict';
import test from 'node:test';
import { summaryCurriculum } from '../data/summaryCurriculum';
import type { InteractiveSummary } from '../types/summary';
import { auditSummaryCoverage } from './summaryCoverage';

const expectedTopicCounts: Record<string, number> = {
  Biologia: 72,
  Física: 85,
  Geografia: 63,
  História: 49,
  'Língua Inglesa': 17,
  Redação: 58,
  Gramática: 26,
  Literatura: 37,
  'Entendimento de Texto': 12,
  Matemática: 83,
  Química: 48,
};

function summary(subject: string, topic: string, id: string): InteractiveSummary {
  return {
    id,
    title: topic,
    subject,
    topic,
    priority: 'media',
    boards: [],
    prerequisites: [],
    overview: 'Conteúdo completo.',
    sections: [
      { id: `${id}-rapida`, title: 'Rápida', stage: 'intuicao', depth: 'rapida', content: 'Rápida.' },
      { id: `${id}-profunda`, title: 'Profunda', stage: 'conceito', depth: 'aprofundamento', content: 'Profunda.' },
      { id: `${id}-prova`, title: 'Prova', stage: 'exercicio', depth: 'prova', content: 'Prova.' },
    ],
    retrieval: [],
    sources: [],
  };
}

test('congela as 11 matérias e os 550 tópicos da grade fornecida', () => {
  assert.equal(summaryCurriculum.length, 11);
  assert.equal(summaryCurriculum.flatMap((subject) => subject.topics).length, 550);
  assert.deepEqual(
    Object.fromEntries(summaryCurriculum.map((subject) => [subject.subject, subject.topics.length])),
    expectedTopicCounts,
  );
});

test('audita ausências, duplicatas, extras e matéria inválida sem adivinhar equivalências', () => {
  const first = summaryCurriculum[0].topics[0];
  const summaries = [
    summary(first.subject, first.title, 'primeiro'),
    summary(first.subject, first.title, 'duplicado'),
    summary('Astronomia', 'Estrelas', 'extra'),
  ];

  const audit = auditSummaryCoverage(summaryCurriculum, summaries);

  assert.deepEqual(audit.duplicates, [{ subject: first.subject, topic: first.title, summaryIds: ['primeiro', 'duplicado'] }]);
  assert.ok(audit.missing.some((item) => item.subject === 'Biologia' && item.topic === 'Dinâmica de Populações'));
  assert.deepEqual(audit.extras, [{ subject: 'Astronomia', topic: 'Estrelas', summaryId: 'extra' }]);
  assert.deepEqual(audit.invalidSubjects, ['Astronomia']);
});

test('não deixa tópicos de Biologia fora do catálogo publicado', async () => {
  const { interactiveSummaries } = await import('../data/interactiveSummaries');
  const audit = auditSummaryCoverage(summaryCurriculum, interactiveSummaries);
  assert.deepEqual(audit.missing.filter((item) => item.subject === 'Biologia'), []);
});
