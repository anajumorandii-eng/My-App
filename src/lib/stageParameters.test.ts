import test from 'node:test';
import assert from 'node:assert/strict';
import { challengeReached, changedReadouts, gridOf, natureOf, planStageParameters } from './stageParameters';
import { FAMILIES, type FamilyId } from './curveFamilies';
import { ELECTRIC, type ElectricId } from './electricLab';
import { KINEMATICS } from './kinematicsLab';

test('a grade inclui o inicial e os extremos, e não passa de 41 pontos', () => {
  const grid = gridOf({ min: -10, max: 10, step: 0.1, initial: 0.3 });
  assert.ok(grid.length <= 43);
  assert.ok(grid.includes(-10) && grid.includes(10) && grid.includes(0.3));
});

test('natureza ignora números, não palavras', () => {
  assert.equal(natureOf('3 A'), natureOf('1,5 A'));
  assert.notEqual(natureOf('duas'), natureOf('nenhuma'));
});

test('na quadrática, a estratégia leva à virada do número de raízes e o exercício pede outra natureza', () => {
  const family = FAMILIES.quadratica;
  const plan = planStageParameters(family.params, ([a, b]) => family.readouts(a, b));
  const pivot = (values: number[]) => family.readouts(values[0], values[1]).find((item) => item.pivot)!.value;
  assert.deepEqual(plan.presets.intuicao, [family.params[0].initial, family.params[1].initial]);
  assert.equal(plan.limit?.kind, 'virada');
  assert.notEqual(natureOf(pivot(plan.presets.estrategia)), natureOf(pivot(plan.presets.intuicao)));
  assert.ok(plan.challenge);
  assert.equal(plan.challenge!.match, 'natureza');
  assert.equal(challengeReached(plan.challenge, family.readouts(plan.presets.exercicio[0], plan.presets.exercicio[1])), false);
});

test('toda família cartesiana tem aplicação diferente do inicial e meta não cumprida de saída', () => {
  for (const id of Object.keys(FAMILIES) as FamilyId[]) {
    const family = FAMILIES[id];
    const read = ([a, b]: number[]) => family.readouts(a, b);
    const plan = planStageParameters(family.params, read);
    assert.notDeepEqual(plan.presets.aplicacao, plan.presets.intuicao, id);
    if (plan.challenge) assert.equal(challengeReached(plan.challenge, read(plan.presets.exercicio)), false, id);
  }
});

test('no resistor a leitura só muda de número: estratégia vai ao extremo e a meta é um valor exato', () => {
  for (const id of Object.keys(ELECTRIC) as ElectricId[]) {
    const config = ELECTRIC[id];
    const plan = planStageParameters([config.control], ([v]) => config.readouts(v));
    assert.notDeepEqual(plan.presets.aplicacao, plan.presets.intuicao, id);
    if (plan.challenge) assert.equal(challengeReached(plan.challenge, config.readouts(plan.presets.exercicio[0])), false, id);
  }
  const resistor = ELECTRIC.resistor;
  const plan = planStageParameters([resistor.control], ([v]) => resistor.readouts(v));
  assert.equal(plan.limit?.kind, 'extremo');
  assert.equal(plan.challenge?.match, 'exato');
  const alvo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find((r) => challengeReached(plan.challenge, resistor.readouts(r)));
  assert.ok(alvo !== undefined, 'a meta precisa ser alcançável com o próprio controle');
});

test('no MU, a aplicação muda ao menos uma leitura em relação ao início', () => {
  const mu = KINEMATICS.mu;
  const plan = planStageParameters([mu.control], ([v]) => mu.readouts(v));
  const before = mu.readouts(plan.presets.intuicao[0]);
  const after = mu.readouts(plan.presets.aplicacao[0]);
  assert.ok(changedReadouts(before, after).length > 0);
});
