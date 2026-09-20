import assert from 'node:assert/strict';
import test from 'node:test';
import { MATRIX_CONFIGS } from './matrixLab';
test('sistema aceita a interseção (6,4)',()=>assert.equal(MATRIX_CONFIGS.sistemas.readouts(6)[2].value,'sim — (6, 4)'));
test('soma matricial mantém a posição',()=>assert.equal(MATRIX_CONFIGS.matrizes.readouts(5)[2].value,'7'));
test('produto usa linha por coluna',()=>assert.equal(MATRIX_CONFIGS.produto.readouts(1)[2].value,'19'));
test('determinante segue ad menos bc',()=>assert.equal(MATRIX_CONFIGS.determinante.readouts(4)[2].value,'−2'));
test('discussão distingue paralelas de coincidentes',()=>assert.equal(MATRIX_CONFIGS.discussao.readouts(3)[2].value,'nenhuma solução'));
