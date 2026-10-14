import test from 'node:test';
import assert from 'node:assert/strict';
import { essayCorrectionQuestion } from './essayWorkspace';
import { emptyEssayPlan, essayPracticeBlock, essayMicroPractice } from '../data/essayWorkshop';
test('correção usa proposta e gênero sem exigir modelo ENEM de outra banca', () => {
  const question = essayCorrectionQuestion('Unicamp', 'Clube de leitura', { ...emptyEssayPlan, genre: 'Carta', proposal: 'Solicite um horário à direção.' });
  assert.ok(question.includes('Gênero solicitado: Carta'));
  assert.ok(question.includes('Solicite um horário à direção.'));
  assert.ok(question.includes('apenas se a proposta ou o critério fornecido a exigir'));
});
test('proposta não é duplicada no projeto e ENEM conserva tipo dissertativo', () => {
  const proposal = 'A'.repeat(6000);
  const question = essayCorrectionQuestion('ENEM', 'Leitura', { ...emptyEssayPlan, genre: 'Carta', proposal });
  assert.equal(question.split(proposal).length - 1, 1);
  assert.ok(question.length < 12000);
  assert.ok(question.includes('Gênero solicitado: Dissertativo-argumentativo'));
});
test('reescrita inclui versão original e ruptura para comparação, não inventa coletânea ausente', () => {
  const question = essayCorrectionQuestion('Fuvest', 'Leitura', emptyEssayPlan, { draft: 'Primeiro texto.', rupture: 'Falta explicar o mecanismo.' });
  assert.ok(question.includes('Primeiro texto.')); assert.ok(question.includes('Falta explicar o mecanismo.'));
  assert.ok(question.includes('A proposta completa e a coletânea não foram fornecidas'));
});
test('blocos cabem no orçamento e microtreinos contêm critérios e transferência', () => {
  for (const minutes of [20, 40, 60] as const) assert.equal(essayPracticeBlock(minutes).reduce((sum, item) => sum + item.minutes, 0), minutes);
  assert.equal(new Set(essayMicroPractice.map(item => item.id)).size, essayMicroPractice.length);
  for (const item of essayMicroPractice) { assert.ok(item.criteria.length >= 3); assert.ok(item.model && item.transfer && item.expected); }
});
