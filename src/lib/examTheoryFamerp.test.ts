import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Question } from '../types.ts';
import { boardPriorities } from './boardPrep.ts';
import { famerpTheory } from '../data/examTheory/famerp.ts';

const bank = JSON.parse(readFileSync(new URL('../../public/questions.json', import.meta.url), 'utf8')) as Question[];
const priorityKeys = boardPriorities(bank, 'FAMERP').chapters.map((c) => `${c.topicId}::${c.chapter}`);

describe('teoria da Famerp', () => {
  it('todo capítulo que mais cai tem teoria', () => {
    const missing = priorityKeys.filter((k) => !famerpTheory[k]);
    assert.deepEqual(missing, [], 'importar um ano novo criou prioridade sem teoria');
  });

  it('não sobra teoria de capítulo que deixou de ser prioridade', () => {
    assert.deepEqual(Object.keys(famerpTheory).filter((k) => !priorityKeys.includes(k)), []);
  });

  it('cada capítulo traz conceito, exemplo resolvido e armadilhas com a correção', () => {
    for (const [key, t] of Object.entries(famerpTheory)) {
      assert.ok(t.howItFalls.length > 60, `${key}: como cai`);
      assert.ok(t.concepts.length >= 3, `${key}: conceitos`);
      assert.ok(t.example.steps.length >= 2, `${key}: resolução`);
      assert.ok(t.traps.length >= 2 && t.traps.every((x) => x.fix.length > 10), `${key}: armadilhas`);
    }
  });
});
