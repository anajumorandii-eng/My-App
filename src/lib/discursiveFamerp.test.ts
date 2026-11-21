import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { famerp2026Discursive } from '../data/discursiveFamerp2026.ts';
import { famerp2025Discursive } from '../data/discursiveFamerp2025.ts';
import { famerp2024Discursive } from '../data/discursiveFamerp2024.ts';
import { discursiveQuestions } from '../data/discursiveQuestions.ts';

for (const [ano, banco] of [[2026, famerp2026Discursive], [2025, famerp2025Discursive], [2024, famerp2024Discursive]] as const)
describe(`discursivas Famerp ${ano}`, () => {
  const famerp2026Discursive = banco;
  it('traz as 20 questões, numeradas e no banco do Treino de 2ª Fase', () => {
    assert.equal(famerp2026Discursive.length, 20);
    const ids = famerp2026Discursive.map((q) => q.id);
    assert.equal(new Set(ids).size, 20);
    for (const id of ids) assert.ok(discursiveQuestions.some((q) => q.id === id), id);
  });
  it('distribui como o edital: 8 Biologia, 6 Química, 6 Física', () => {
    const n = (s: string) => famerp2026Discursive.filter((q) => q.subject === s).length;
    assert.deepEqual([n('Biologia'), n('Química'), n('Física')], [8, 6, 6]);
  });
  it('cada item pedido tem resposta e cada figura existe no disco', () => {
    for (const q of famerp2026Discursive) {
      assert.equal(q.modelAnswer.length, q.subItems?.length, q.id);
      for (const f of q.figures ?? []) assert.ok(existsSync(`public${f.url}`), f.url);
    }
  });
});
