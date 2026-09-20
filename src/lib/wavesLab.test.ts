import assert from 'node:assert/strict';
import test from 'node:test';
import { WAVES } from './wavesLab';

test('equação da onda preserva a velocidade do meio', () => assert.equal(WAVES['wave-equation'].readouts(6)[1].value, '4 m'));
test('intensidade sonora obedece ao inverso do quadrado da distância', () => assert.equal(WAVES['sound-intensity'].readouts(2)[1].value, '0,2 W/m²'));
test('interferência destrutiva anula ondas de mesma amplitude', () => assert.equal(WAVES.interference.readouts(180)[1].value, '0 cm'));
test('harmônico de corda cresce proporcionalmente a n', () => assert.equal(WAVES['string-harmonics'].readouts(4)[1].value, '16 Hz'));
test('fonte que se aproxima aumenta a frequência percebida', () => assert.equal(WAVES.doppler.readouts(40)[1].value, '566,7 Hz'));
