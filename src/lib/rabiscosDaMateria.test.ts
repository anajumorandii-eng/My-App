import test from 'node:test';
import assert from 'node:assert/strict';
import { CADERNOS, CADERNO_DO_CRIVO, cadernoDa } from './rabiscosDaMateria';
import { PALETAS_MATERIA } from './visualAmbiente';

test('toda matéria com cor própria tem o seu caderno', () => {
  for (const materia of Object.keys(PALETAS_MATERIA)) assert.ok(CADERNOS[materia], materia);
});

test('matéria desconhecida ou tela sem matéria cai no caderno do Crivo', () => {
  assert.equal(cadernoDa(undefined), CADERNO_DO_CRIVO);
  assert.equal(cadernoDa('Astrologia'), CADERNO_DO_CRIVO);
  assert.equal(cadernoDa('Física'), CADERNOS.Física);
});

test('nenhuma anotação passa de 34 caracteres: é o que cabe no lugar dela no ladrilho', () => {
  for (const [materia, caderno] of Object.entries({ ...CADERNOS, Crivo: CADERNO_DO_CRIVO })) {
    for (const anotacao of caderno.anotacoes) assert.ok(anotacao.length <= 34, `${materia}: "${anotacao}"`);
  }
});
