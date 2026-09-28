import test from 'node:test';
import assert from 'node:assert/strict';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { CAPITULOS_TECNOLOGICOS, PALETAS_FIXAS, PALETAS_MATERIA, ambienteDaMateria, ambienteDoCapitulo, normalizar, rgbDe } from './visualAmbiente';

const capitulo = (id: string) => {
  const achado = interactiveSummaries.find((item) => item.id === id);
  assert.ok(achado, `capítulo ${id} não existe no currículo`);
  return achado;
};

test('todo capítulo do piloto tecnológico existe no currículo', () => {
  for (const id of CAPITULOS_TECNOLOGICOS) capitulo(id);
});

test('o conteúdo de cada capítulo do piloto escolhe a sua cor', () => {
  const nomes = Object.fromEntries([...CAPITULOS_TECNOLOGICOS].map((id) => [id, ambienteDoCapitulo(capitulo(id)).nome]));
  assert.deepEqual(nomes, {
    'summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento': 'ondas',
    // "Equivalência massa-energia" tem "energia" e cairia em mecânica se a
    // regra específica não viesse antes.
    'summary-fisica-equivalencia-massa-energia': 'energia nuclear',
    'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas': 'ondas',
    'summary-fisica-orbitas': 'espaço',
    'summary-fisica-o-movimento-circular': 'mecânica',
  });
});

test('sem regra de conteúdo, vale a paleta da matéria; sem matéria conhecida, a padrão', () => {
  assert.deepEqual(ambienteDoCapitulo({ id: 'x', subject: 'Física', topic: 'Análise dimensional' }), { paleta: PALETAS_MATERIA['Física'], origem: 'materia', nome: 'Física' });
  assert.equal(ambienteDoCapitulo({ id: 'x', subject: 'Redação', topic: 'Coesão' }).nome, 'padrão');
});

test('acento e caixa não mudam a regra', () => {
  assert.equal(normalizar('ÓRBITAS e Gravitação'), 'orbitas e gravitacao');
  assert.equal(ambienteDoCapitulo({ id: 'x', subject: 'Física', topic: 'Órbitas' }).nome, 'espaço');
});

test('toda paleta é hex válido, porque o canvas das partículas converte a cor', () => {
  for (const paleta of [...Object.values(PALETAS_MATERIA), ...Object.values(PALETAS_FIXAS)]) for (const cor of Object.values(paleta)) assert.match(cor, /^#[0-9a-f]{6}$/);
  assert.equal(rgbDe('#22d3ee'), '34, 211, 238');
});

test('a escolha da estudante vence a cor automática, e "só a matéria" ignora o conteúdo', () => {
  const orbitas = { id: 'summary-fisica-orbitas', subject: 'Física', topic: 'Órbitas' };
  assert.equal(ambienteDoCapitulo(orbitas, 'Solar').nome, 'Solar');
  assert.equal(ambienteDoCapitulo(orbitas, 'materia').nome, 'Física');
  assert.equal(ambienteDoCapitulo(orbitas).nome, 'espaço');
  assert.equal(ambienteDaMateria('').nome, 'padrão');
  assert.equal(ambienteDaMateria('Biologia').nome, 'Biologia');
});

test('regra de conteúdo não atravessa matéria', () => {
  // "Dinâmica" de populações é Biologia, não a mecânica da Física.
  assert.equal(ambienteDoCapitulo({ id: 'x', subject: 'Biologia', topic: 'Dinâmica de populações' }).nome, 'Biologia');
  assert.equal(ambienteDoCapitulo({ id: 'x', subject: 'Física', topic: 'Dinâmica' }).nome, 'mecânica');
});
