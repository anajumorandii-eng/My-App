import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildAiPrompt } from './prompts';
import { STUDY_MATERIAL_QUALITY } from './studyMaterialQuality';
test('aprofundamentos e todos os níveis de revisão recebem o mesmo contrato pedagógico', () => {
  for (const guideMode of ['strategy', 'combined-strategy', 'literary-strategy', 'review-summary']) {
    for (const depth of ['quick', 'strategic', 'deep']) {
      const prompt = buildAiPrompt('review-tip', { guideMode, topic: 'Fisiologia', subject: 'Biologia', targetBoards: ['FUVEST'], reviewOptions: { depth } });
      assert.ok(prompt.includes(STUDY_MATERIAL_QUALITY));
      assert.match(prompt, /Treino independente/);
      assert.match(prompt, /study-visual/);
      assert.match(prompt, /cobertura real/);
    }
  }
});
test('geometria pede a própria figura, nunca um gráfico no lugar dela', () => {
  assert.match(STUDY_MATERIAL_QUALITY, /desenhe a própria figura com geometry/);
  assert.match(STUDY_MATERIAL_QUALITY, /nunca troque a figura por gráfico/);
});
test('cada matéria tem o tipo de figura do próprio objeto', () => {
  for (const type of ['circuit', 'timeline', 'pedigree', 'climate', 'arrow:true']) assert.ok(STUDY_MATERIAL_QUALITY.includes(type), type);
  assert.match(STUDY_MATERIAL_QUALITY, /Não desenhe mapas, anatomia/);
});
