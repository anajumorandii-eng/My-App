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
