import assert from 'node:assert/strict';
import test from 'node:test';
import { ALGEBRA_CONFIGS } from './algebraLab';
test('fatoração e expansão produzem o mesmo valor', () => assert.deepEqual(ALGEBRA_CONFIGS.fatoracao.readouts(3).slice(0, 2).map(x => x.value), ['5', '5']));
test('equação com radical descarta a raiz espúria', () => { assert.equal(ALGEBRA_CONFIGS.igualdades.readouts(1)[2].value, 'não — espúria'); assert.equal(ALGEBRA_CONFIGS.igualdades.readouts(6)[2].value, 'sim'); });
test('sinal do produto é positivo fora das raízes', () => assert.match(ALGEBRA_CONFIGS.desigualdades.readouts(4)[2].value, /> 0/));
test('modelagem linear encontra 23 e 24', () => assert.equal(ALGEBRA_CONFIGS['modelagem-linear'].readouts(23)[1].value, '47'));
test('redução de três passos dá receita máxima inteira do exemplo', () => assert.equal(ALGEBRA_CONFIGS['modelagem-quadratica'].readouts(3)[2].value, 'R$11020'));
