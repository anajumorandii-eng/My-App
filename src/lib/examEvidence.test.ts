import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { examEvidenceCohorts, loadExamEvidenceCases, selectExamEvidence } from './examEvidence';
import { mockTopics } from '../data/mockData';
test('corpus substitui amostras das cinco bancas e preserva Unicamp e janela recente FUVEST', async () => {
  const cases = await loadExamEvidenceCases();
  assert.equal(cases.length, 2482); assert.equal(new Set(cases.map(item => item.id)).size, 2482);
  assert.equal(examEvidenceCohorts.length, 52);
  assert.equal(cases.filter(item=>item.cohortId.startsWith('unicamp-')).length,150);
  assert.ok(!examEvidenceCohorts.some(cohort=>['unesp-2025-v1','enem-2022-d2-cd5','famerp-2025-v1','unifesp-2025-v1'].includes(cohort.id)));
  const fuvest = examEvidenceCohorts.filter(cohort=>cohort.board==='FUVEST');
  assert.equal(fuvest.length,15); assert.ok(fuvest.every(cohort=>cohort.year>=2022&&cohort.year<=2026)); assert.ok(fuvest.every(cohort=>cohort.classification==='complete'));
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
    if(cohort.board==='UNICAMP')assert.ok(checks.find((item: { id: string }) => item.id === cohort.id).documents.every((item: { verified: boolean }) => item.verified));
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
