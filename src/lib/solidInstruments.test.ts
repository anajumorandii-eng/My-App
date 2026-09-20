import assert from 'node:assert/strict';
import test from 'node:test';
import { SOLID_CONFIGS, estadoInicial, type SolidConfigId } from './solidInstruments';

const IDS: SolidConfigId[] = ['bloco', 'prisma', 'piramide', 'revolucao', 'semelhanca'];

function leitura(id: SolidConfigId, valores: Record<string, number>, forma?: string) {
  const config = SOLID_CONFIGS[id];
  return Object.fromEntries(config.leituras({ ...estadoInicial(config).valores, ...valores }, forma ?? config.formas?.[0]?.id).map((l) => [l.label, l.value]));
}

test('os cinco instrumentos existem, com id igual à chave', () => {
  assert.deepEqual(Object.keys(SOLID_CONFIGS).sort(), [...IDS].sort());
  for (const id of IDS) assert.equal(SOLID_CONFIGS[id].id, id);
});

test('cada controle tem faixa válida, passo positivo e valor inicial dentro da faixa', () => {
  for (const id of IDS) {
    const ids = SOLID_CONFIGS[id].controles.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, `${id}: ids de controle repetidos`);
    for (const c of SOLID_CONFIGS[id].controles) {
      assert.ok(c.min < c.max, `${id}/${c.id}: faixa vazia`);
      assert.ok(c.passo > 0, `${id}/${c.id}: passo`);
      assert.ok(c.inicial >= c.min && c.inicial <= c.max, `${id}/${c.id}: inicial fora da faixa`);
    }
  }
});

test('todo instrumento marca exatamente uma leitura como a que a manipulação revela', () => {
  for (const id of IDS) {
    const config = SOLID_CONFIGS[id];
    for (const forma of config.formas?.map((f) => f.id) ?? [undefined]) {
      const pivots = config.leituras(estadoInicial(config).valores, forma).filter((l) => l.pivot);
      assert.equal(pivots.length, 1, `${id}/${forma ?? '-'}`);
    }
  }
});

test('bloco 3 x 4 x 12: diagonal da face 5, diagonal principal 13 e volume 144', () => {
  const l = leitura('bloco', { a: 3, b: 4, c: 12 });
  assert.equal(l['Volume'], '144');
  assert.equal(l['Diagonal da face a × b'], '5');
  assert.equal(l['Diagonal principal'], '13');
  assert.equal(l['Área total'], '192');
  const pivo = SOLID_CONFIGS.bloco.leituras(estadoInicial(SOLID_CONFIGS.bloco).valores).find((x) => x.pivot);
  assert.equal(pivo?.label, 'Diagonal principal');
});

test('prisma reto: mostra as áreas; inclinado: a aresta lateral passa da altura e o volume não muda', () => {
  const reto = leitura('prisma', { n: 6, l: 2, h: 5, s: 0 });
  assert.ok('Área lateral' in reto && 'Área total' in reto);
  assert.equal(reto['Volume'], '51,96');

  const inclinado = leitura('prisma', { n: 6, l: 2, h: 5, s: 3 });
  assert.equal(inclinado['Volume'], reto['Volume'], 'o volume depende da altura, não da inclinação');
  assert.equal(inclinado['Altura h'], '5');
  assert.equal(inclinado['Aresta lateral'], '5,83');
  assert.ok(!('Área lateral' in inclinado), 'área lateral do prisma oblíquo pede outra conta e não é mostrada');
});

test('pirâmide de base quadrada 6 e altura 4: apótema 5, volume 48; corte a meia altura: 6 e 42', () => {
  const inteira = leitura('piramide', { n: 4, l: 6, h: 4, t: 1 });
  assert.equal(inteira['Apótema da pirâmide'], '5');
  assert.equal(inteira['Volume'], '48');
  assert.equal(inteira['Prisma de mesma base e altura'], '144');

  const cortada = leitura('piramide', { n: 4, l: 6, h: 4, t: 0.5 });
  assert.equal(cortada['Pirâmide menor'], '6');
  assert.equal(cortada['Tronco'], '42');
});

test('sólidos de revolução: cilindro r=5 h=12, cone r=3 h=4, esfera r=3', () => {
  const cilindro = leitura('revolucao', { r: 5, h: 12 }, 'cilindro');
  assert.equal(cilindro['Volume'], '942,48');
  assert.equal(cilindro['Área total'], '534,07');

  const cone = leitura('revolucao', { r: 3, h: 4 }, 'cone');
  assert.equal(cone['Geratriz'], '5');
  assert.equal(cone['Volume'], '37,7');
  assert.equal(cone['Fração do cilindro de mesma base e altura'], '1/3');

  const esfera = leitura('revolucao', { r: 3, h: 4 }, 'esfera');
  assert.equal(esfera['Volume'], '113,1');
  assert.equal(esfera['Área da superfície'], '113,1');
  assert.ok(!('Geratriz' in esfera));
});

test('só a esfera dispensa a altura', () => {
  const config = SOLID_CONFIGS.revolucao;
  assert.deepEqual(config.controlesVisiveis?.('cilindro'), ['r', 'h']);
  assert.deepEqual(config.controlesVisiveis?.('cone'), ['r', 'h']);
  assert.deepEqual(config.controlesVisiveis?.('esfera'), ['r']);
});

test('semelhança de dois cubos, razão 2: comprimentos 2, áreas 4, volumes 8', () => {
  const l = leitura('semelhanca', { a: 2, k: 2 });
  assert.equal(l['Razão linear k'], '2');
  assert.equal(l['Razão de áreas k²'], '4');
  assert.equal(l['Razão de volumes k³'], '8');
  assert.equal(l['Volume do cubo menor'], '8');
  assert.equal(l['Volume do cubo maior'], '64');
});

test('o estado inicial de cada instrumento é o dos controles declarados', () => {
  for (const id of IDS) {
    const { valores } = estadoInicial(SOLID_CONFIGS[id]);
    assert.deepEqual(Object.keys(valores).sort(), SOLID_CONFIGS[id].controles.map((c) => c.id).sort());
  }
});
