import assert from 'node:assert/strict';
import test from 'node:test';
import { THERMO } from './thermoLab';
test('trabalho sob pressão constante usa P vezes delta V',()=>assert.equal(THERMO['gas-work'].readouts(4)[1].value,'12 J'));
test('primeira lei desconta trabalho do calor recebido',()=>assert.equal(THERMO['first-law'].readouts(5)[1].value,'7 J'));
test('ciclo calcula trabalho e rendimento',()=>assert.equal(THERMO.carnot.readouts(8)[2].value,'60%'));
