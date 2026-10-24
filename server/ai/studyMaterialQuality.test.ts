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
