import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import cases from '../data/boardIncidenceCases.json';

const evidence = (id: string) => cases.find(item => item.id === id)!;
test('análises de estratégias separam instruções, valores e unidades', () => {
  const item = evidence('enem-2024-natureza-matematica:138');
  assert.match(item.concept, /e 15 horas/);
  assert.match(item.concept, /de 71250/);
  assert.match(item.steps[1], /Divida 28500 por 57/);
});
test('notação científica e potências são exibidas com expoentes', () => {
  assert.match(evidence('enem-2024-natureza-matematica:108').steps[0], /10⁵/);
  assert.match(evidence('enem-2024-natureza-matematica:169').steps[1], /2⁽²⁰⁻¹⁾/);
});
