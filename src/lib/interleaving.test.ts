import assert from 'node:assert/strict';
import test from 'node:test';
import { interleaveBySubject } from './interleaving';

interface Item {
  id: string;
  subject: string;
}

function item(id: string, subject: string): Item {
  return { id, subject };
}

test('interleaveBySubject preserva listas de 2 itens ou menos sem alterar', () => {
  const list = [item('a', 'Física'), item('b', 'Física')];
  assert.deepEqual(interleaveBySubject(list), list);
});

test('interleaveBySubject alterna matérias em vez de deixar a mesma matéria em sequência', () => {
  const list = [
    item('f1', 'Física'),
    item('f2', 'Física'),
    item('f3', 'Física'),
    item('b1', 'Biologia'),
    item('p1', 'Português'),
  ];
  const result = interleaveBySubject(list);
  assert.equal(result.length, 5);
  for (let i = 1; i < result.length; i++) {
    if (result[i].subject === result[i - 1].subject) {
      // só é aceitável repetir a matéria se não havia mais nenhuma outra
      // matéria com itens disponíveis naquele ponto
      const remaining = result.slice(i);
      const otherSubjectsRemaining = remaining.some((r) => r.subject !== result[i].subject);
      assert.ok(!otherSubjectsRemaining, `repetiu ${result[i].subject} em sequência havendo alternativa`);
    }
  }
});

test('interleaveBySubject preserva a ordem relativa dentro de cada matéria', () => {
  const list = [
    item('f1', 'Física'),
    item('f2', 'Física'),
    item('b1', 'Biologia'),
    item('f3', 'Física'),
  ];
  const result = interleaveBySubject(list);
  const fisicaOrder = result.filter((r) => r.subject === 'Física').map((r) => r.id);
  assert.deepEqual(fisicaOrder, ['f1', 'f2', 'f3']);
});

test('interleaveBySubject mantém o primeiro item igual ao de maior prioridade (já ordenado)', () => {
  const list = [item('top', 'Física'), item('f2', 'Física'), item('b1', 'Biologia')];
  const result = interleaveBySubject(list);
  assert.equal(result[0].id, 'top');
});

test('interleaveBySubject não perde nem duplica itens', () => {
  const list = [
    item('f1', 'Física'),
    item('f2', 'Física'),
    item('m1', 'Matemática'),
    item('m2', 'Matemática'),
    item('m3', 'Matemática'),
    item('q1', 'Química'),
  ];
  const result = interleaveBySubject(list);
  assert.equal(result.length, list.length);
  assert.deepEqual(new Set(result.map((r) => r.id)), new Set(list.map((r) => r.id)));
});

test('interleaveBySubject com uma única matéria mantém a ordem original', () => {
  const list = [item('a', 'Física'), item('b', 'Física'), item('c', 'Física')];
  assert.deepEqual(interleaveBySubject(list), list);
});
