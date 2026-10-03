import assert from 'node:assert/strict';
import test from 'node:test';
import { MAGNETISM } from './magnetismLab';

test('aumenta o campo relativo ao aumentar a corrente no fio', () => assert.equal(MAGNETISM['fio-espira'].readouts(8)[1].value, '4 u.a.'));
test('zera a força de uma carga que segue paralela ao campo', () => assert.equal(MAGNETISM['carga-em-b'].readouts(0)[1].value, '0 N'));
test('liga variação do fluxo à fem induzida', () => {
  assert.equal(MAGNETISM.lenz.readouts(.5)[1].value, '4 V');
  assert.equal(MAGNETISM.lenz.readouts(1)[1].value, '2 V');
});
test('liga velocidade angular à fem máxima do gerador', () => assert.equal(MAGNETISM.gerador.readouts(10)[1].value, '4 V'));

test('Lenz distingue aumento, queda e fluxo constante com normal positiva à direita', async () => {
  const { lenzModel } = await import('./magnetismLab');
  assert.equal(lenzModel('approach', .5).deltaFlux, .2);
  assert.equal(lenzModel('approach', .5).emf, -4);
  assert.equal(lenzModel('approach', .5).frontPole, 'N');
  assert.equal(lenzModel('approach', .5).current, 'anti-horário');
  assert.equal(lenzModel('retreat', .5).emf, 4);
  assert.equal(lenzModel('retreat', .5).frontPole, 'S');
  assert.equal(lenzModel('retreat', .5).current, 'horário');
  assert.equal(lenzModel('stationary', .1).emf, 0);
  assert.equal(lenzModel('stationary', .1).deltaFlux, 0);
});
test('Lenz conserva 10 espiras e magnitude 2/Δt nos limites', async () => {
  const { lenzModel } = await import('./magnetismLab');
  for (const mode of ['approach', 'retreat'] as const) {
    assert.equal(Math.abs(lenzModel(mode, .1).emf), 20);
    assert.equal(Math.abs(lenzModel(mode, 2).emf), 1);
  }
});
