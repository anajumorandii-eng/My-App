import assert from 'node:assert/strict';
import test from 'node:test';
import { topicIncidenceWeight } from './topicIncidence';

test('soma a incidência regional dos temas mapeados para o tópico', () => {
  const weight = topicIncidenceWeight({ id: 'bio_ecologia', subject: 'Biologia' });
  assert.ok(Math.abs(weight - 0.185) < 1e-9);
});

test('soma a incidência específica da banca por cima da regional quando informada', () => {
  const withoutBoard = topicIncidenceWeight({ id: 'bio_ecologia', subject: 'Biologia' });
  const withBoard = topicIncidenceWeight({ id: 'bio_ecologia', subject: 'Biologia' }, 'Fuvest');
  assert.ok(withBoard > withoutBoard);
  assert.ok(Math.abs(withBoard - (0.185 + 0.166)) < 1e-9);
});

test('retorna 0 para um tópico sem temas mapeados no relatório', () => {
  assert.equal(topicIncidenceWeight({ id: 'bio_botanica', subject: 'Biologia' }), 0);
});

test('resolve o alias de assunto (Português -> Língua Portuguesa)', () => {
  const weight = topicIncidenceWeight({ id: 'por_norma_culta', subject: 'Português' });
  assert.ok(weight > 0);
});

test('não quebra com uma banca sem entrada para o assunto', () => {
  const weight = topicIncidenceWeight({ id: 'bio_ecologia', subject: 'Biologia' }, 'Banca Inexistente');
  assert.ok(Math.abs(weight - 0.185) < 1e-9);
});

test('retorna 0 para um tópico desconhecido', () => {
  assert.equal(topicIncidenceWeight({ id: 'topico_inexistente', subject: 'Biologia' }), 0);
});
