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
