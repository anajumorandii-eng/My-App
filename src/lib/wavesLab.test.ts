import assert from 'node:assert/strict';
import test from 'node:test';
import { WAVES } from './wavesLab';

test('equação da onda preserva a velocidade do meio', () => assert.equal(WAVES['wave-equation'].readouts(6)[1].value, '4 m'));
test('intensidade sonora obedece ao inverso do quadrado da distância', () => assert.equal(WAVES['sound-intensity'].readouts(2)[1].value, '0,2 W/m²'));
test('interferência destrutiva anula ondas de mesma amplitude', () => assert.equal(WAVES.interference.readouts(180)[1].value, '0 cm'));
test('harmônico de corda cresce proporcionalmente a n', () => assert.equal(WAVES['string-harmonics'].readouts(4)[1].value, '16 Hz'));
test('fonte que se aproxima aumenta a frequência percebida', () => assert.equal(WAVES.doppler.readouts(40)[1].value, '566,7 Hz'));

test('Doppler deriva círculos das posições passadas, na mesma escala do comprimento de onda', async () => {
  const { dopplerGeometry } = await import('./wavesLab');
  for (const speed of [0, 40, 80]) {
    const geometry = dopplerGeometry(speed);
    assert.equal(geometry.source.x, 150);
    assert.equal(geometry.observer.x, 265);
    assert.equal(geometry.frequencyHeard, 500 * 340 / (340 - speed));
    assert.equal(WAVES.doppler.readouts(speed)[2].value, `${((340 - speed) / 500).toFixed(2).replace('.', ',')} m`);
    assert.equal(WAVES.doppler.readouts(speed)[3].value, `${((340 + speed) / 500).toFixed(2).replace('.', ',')} m`);
    geometry.fronts.forEach((front, i) => {
      assert.equal(front.age, (i + 1) / 500);
      assert.equal(front.cx, 150 - speed * front.age * geometry.pixelsPerMeter);
      assert.equal(front.r, 340 * front.age * geometry.pixelsPerMeter);
      assert.ok(front.cx - front.r >= 0 && front.cx + front.r <= 320);
      assert.ok(front.cy - front.r >= 0 && front.cy + front.r <= 300);
      if (i) {
        const previous = geometry.fronts[i - 1];
        assert.ok(Math.abs((front.cx + front.r) - (previous.cx + previous.r) - geometry.wavelengthAhead * geometry.pixelsPerMeter) < 1e-10);
        assert.ok(Math.abs((previous.cx - previous.r) - (front.cx - front.r) - geometry.wavelengthBehind * geometry.pixelsPerMeter) < 1e-10);
      }
    });
    assert.ok(Math.abs(340 / geometry.wavelengthAhead - geometry.frequencyHeard) < 1e-10);
  }
});
