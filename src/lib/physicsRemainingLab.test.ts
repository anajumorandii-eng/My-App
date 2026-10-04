import assert from 'node:assert/strict';
import test from 'node:test';
import { PHYSICS_REMAINING } from './physicsRemainingLab';

test('eco divide por dois o caminho percorrido pelo pulso', () => assert.equal(PHYSICS_REMAINING.echo.readouts(0.4)[1].value, '68 m'));
test('difração abre menos para uma fenda mais larga', () => assert.equal(PHYSICS_REMAINING.diffraction.readouts(2)[1].value, '30°'));
test('tubo fechado preserva apenas o harmônico escolhido', () => assert.equal(PHYSICS_REMAINING['tube-harmonics'].readouts(3)[1].value, '300 Hz'));
test('fóton mais frequente carrega mais energia', () => assert.equal(PHYSICS_REMAINING['quantum-photon'].readouts(6)[1].value, '2,48 eV'));
test('correia troca velocidade angular quando muda o raio', () => assert.equal(PHYSICS_REMAINING['circular-motion'].readouts(25)[1].value, '12 rad/s'));
test('gerador diminui a tensão terminal quando fornece corrente', () => assert.equal(PHYSICS_REMAINING.generator.readouts(3)[1].value, '18 V'));
test('receptor separa potência útil da perda interna', () => assert.equal(PHYSICS_REMAINING.receiver.readouts(5)[2].value, '50 W'));
test('onda em corda fixa volta invertida', () => assert.equal(PHYSICS_REMAINING['rope-boundary'].readouts(0)[1].value, 'invertido'));

test('luneta declara inversão angular e conserva focais e comprimento físicos', () => {
  const config = PHYSICS_REMAINING['optical-instruments'];
  assert.match(config.formula, /−/);
  for (const focal of [400, 1200, 1600]) {
    assert.equal(config.readouts(focal)[1].value, `${focal / 8}×`);
    assert.equal(config.readouts(focal)[2].value, `${focal + 8} mm`);
  }
});

test('absorção discrimina coincidência exata de energia e fotoelétrico usa limiar', () => {
  const config = PHYSICS_REMAINING['quantum-photon'];
  for (let frequency = 3; frequency <= 12; frequency++) {
    const readouts = config.readouts(frequency);
    assert.equal(readouts.find(item => item.label === 'Absorção no átomo')?.value,
      frequency === 6 ? 'E₀ → E₁: ΔE = hf' : frequency === 10 ? 'E₀ → E₂: ΔE = hf' : 'Sem absorção: hf ≠ ΔE');
    assert.equal(readouts.find(item => item.label === 'Fotoelétrico: Kₘáx')?.value,
      frequency >= 8 ? `${String(Math.round((0.4136 * frequency - 3) * 100) / 100).replace('.', ',')} eV` : 'Sem emissão: hf < φ');
  }
});

test('difração não confunde saturação angular com primeiro mínimo inexistente', () => {
  assert.equal(PHYSICS_REMAINING.diffraction.readouts(0.5)[1].value, 'Sem primeiro mínimo (a < λ)');
});
