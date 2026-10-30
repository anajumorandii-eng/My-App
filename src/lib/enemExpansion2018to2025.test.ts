import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { mockTopics } from '../data/mockData';
import type { Question } from '../types';

const batch: Question[] = JSON.parse(readFileSync('scripts/data/enem-2018-2025/questions.json','utf8'));
const bank: Question[] = JSON.parse(readFileSync('public/questions.json','utf8'));

test('expansão ENEM cobre 2018–2025 e as quatro áreas com fichas publicadas e capítulos válidos', () => {
  assert.equal(batch.length, 64);
  assert.equal(bank.filter(q => q.id.startsWith('enem_expansao_')).length, 64);
  for (let year = 2018; year <= 2025; year++) {
    const own = batch.filter(q => q.examSource?.year === year);
    assert.equal(own.length, 8);
    for (const [min,max] of [[6,45],[46,90],[91,135],[136,180]]) {
      assert.equal(own.filter(q => q.examSource!.questionNumber! >= min && q.examSource!.questionNumber! <= max).length, 2);
    }
  }
  for (const q of batch) {
    const {figures:_publishedFigures,...published}=bank.find(x => x.id === q.id)!;
    const {figures:_batchFigures,...original}=q;
    assert.deepEqual(published, original);
    const topic = mockTopics.find(t => t.id === q.topicId)!;
    assert.equal(topic.subject, q.subject);
    assert.ok(topic.chapters.includes(q.chapter!));
    assert.equal(q.statementComplete, true);
    assert.equal(q.options.map(o => o.id).join(''), 'abcde');
    assert.ok(q.options.some(o => o.id === q.correctOptionId));
  }
});

test('dados decisivos e cálculos permanecem completos antes e depois da tentativa', () => {
  const byId = new Map(batch.map(q => [q.id,q]));
  const get = (year: number, n: number) => byId.get(`enem_expansao_${year}_q${String(n).padStart(2,'0')}`)!;
  assert.match(get(2024,136).prompt, /\| 50 \| 1 650,00 \|/);
  assert.match(get(2024,137).prompt, /\| Setembro \| 60 \|/);
  assert.match(get(2024,137).explanation, /46, 54, 60, 64, 64, 66/);
  assert.equal(get(2024,137).correctOptionId, 'e');
  assert.match(get(2023,52).prompt, /Paulo Freire construiu uma pedagogia da esperança/);
  assert.match(get(2023,138).explanation, /x ≥ 64/);
  assert.match(get(2020,160).explanation, /18 − 1 = 17 L/);
  assert.equal(get(2025,137).correctOptionId, 'e');
  assert.match(get(2025,137).explanation, /0,005\/0,001 = 5 L/);
  // Mesmo item em outra cor e transcrições numericamente inconsistentes foram descartados.
  assert.ok(!byId.has('enem_expansao_2022_q142'));
  assert.ok(!byId.has('enem_expansao_2020_q140'));
});
