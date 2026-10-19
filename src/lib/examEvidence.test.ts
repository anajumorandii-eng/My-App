import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { examEvidenceCohorts, loadExamEvidenceCases, selectExamEvidence } from './examEvidence';
import { mockTopics } from '../data/mockData';
test('corpus substitui a amostra FUVEST por cinco edições completas e preserva outras bancas', async () => {
  const cases = await loadExamEvidenceCases();
  assert.equal(cases.length, 881); assert.equal(new Set(cases.map(item => item.id)).size, 881);
  assert.equal(examEvidenceCohorts.length, 22);
  const fuvest = examEvidenceCohorts.filter(cohort=>cohort.board==='FUVEST');
  assert.equal(fuvest.length,15); assert.ok(fuvest.every(cohort=>cohort.classification==='complete'));
  assert.equal(cases.filter(item=>item.cohortId.startsWith('fuvest-')).length,683);
  for (const item of cases) {
    assert.ok(mockTopics.some(topic => topic.id === item.topicId) || item.topicId.startsWith('fuvest-unmapped:'));
    assert.ok(examEvidenceCohorts.some(cohort => cohort.id === item.cohortId));
  }
  const checks = JSON.parse(readFileSync('docs/estudos-2026/prioridades/fontes-verificadas.json', 'utf8'));
  for (const cohort of examEvidenceCohorts) {
    assert.match(cohort.examSha256!, /^[a-f0-9]{64}$/);
    if(cohort.answerKeyUrl) assert.match(cohort.answerKeySha256!, /^[a-f0-9]{64}$/);
    else assert.equal(cohort.answerKeySha256,null);
    if(cohort.board!=='FUVEST')assert.ok(checks.find((item: { id: string }) => item.id === cohort.id).documents.every((item: { verified: boolean }) => item.verified));
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
