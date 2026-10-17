import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { examEvidenceCohorts, loadExamEvidenceCases, selectExamEvidence } from './examEvidence';
import { mockTopics } from '../data/mockData';
test('corpus rastreável possui 220 questões únicas e nove recortes com provas e gabaritos oficiais', async () => {
  const cases = await loadExamEvidenceCases();
  assert.equal(cases.length, 220); assert.equal(new Set(cases.map(item => item.id)).size, 220);
  assert.equal(examEvidenceCohorts.length, 9);
  for (const item of cases) {
    assert.ok(mockTopics.some(topic => topic.id === item.topicId));
    assert.ok(examEvidenceCohorts.some(cohort => cohort.id === item.cohortId));
  }
  const checks = JSON.parse(readFileSync('docs/estudos-2026/prioridades/fontes-verificadas.json', 'utf8'));
  for (const cohort of examEvidenceCohorts) {
    assert.match(cohort.examSha256, /^[a-f0-9]{64}$/); assert.match(cohort.answerKeySha256, /^[a-f0-9]{64}$/);
    assert.ok(checks.find((item: { id: string }) => item.id === cohort.id).documents.every((item: { verified: boolean }) => item.verified));
    const records = cases.filter(item => item.cohortId === cohort.id);
    assert.equal(records.length, cohort.subjects.reduce((sum, subject) => sum + subject.total, 0));
    assert.ok(records.every(item => !cohort.excludedNumbers.includes(item.number)));
  }
});
test('seleção inclui ligações secundárias e preserva os limites de banca', async () => {
  const cases = await loadExamEvidenceCases();
  const selected = selectExamEvidence(cases, ['bio_ecologia', 'bio_evolucao'], ['COMVEST'], 4);
  assert.ok(selected.some(item => item.cohortId === 'unicamp-2026-biologia-f2' && item.number === 11));
  assert.ok(selected.every(item => examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)!.board === 'UNICAMP'));
});
