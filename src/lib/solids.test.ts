import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bloco, cilindro, cone, cortePiramide, esfera, formatar, piramide, poligonoRegular, prisma, semelhanca,
} from './solids';

function proximo(atual: number, esperado: number, mensagem?: string) {
  assert.ok(Math.abs(atual - esperado) < 1e-9, `${mensagem ?? ''} esperado ${esperado}, veio ${atual}`);
}

// Os exemplos resolvidos abaixo são os que os próprios capítulos trazem em
// "Pratique e confira": se o instrumento discordar do material, o material
// vence e este teste quebra.

test('bloco 3 x 4 x 12: volume, área total, diagonal da face e diagonal principal 13', () => {
  const b = bloco(3, 4, 12);
  proximo(b.volume, 144);
  proximo(b.areaTotal, 2 * (3 * 4 + 3 * 12 + 4 * 12));
  proximo(b.diagonalFace, 5);
  proximo(b.diagonalPrincipal, 13);
});

test('cubo de aresta 3: volume 27, área total 54 e diagonal 3 raiz de 3', () => {
  const cubo = bloco(3, 3, 3);
  proximo(cubo.volume, 27);
  proximo(cubo.areaTotal, 54);
  proximo(cubo.diagonalPrincipal, 3 * Math.sqrt(3));
});

test('polígono regular: quadrado, hexágono e triângulo de lado dado', () => {
  const quadrado = poligonoRegular(4, 6);
  proximo(quadrado.area, 36);
  proximo(quadrado.apotema, 3);
  proximo(quadrado.perimetro, 24);
  proximo(quadrado.raio, 3 * Math.sqrt(2));

  const hexagono = poligonoRegular(6, 2);
  proximo(hexagono.area, 6 * Math.sqrt(3));
  proximo(hexagono.apotema, Math.sqrt(3));
  proximo(hexagono.raio, 2, 'no hexágono regular o raio é o próprio lado');

  proximo(poligonoRegular(3, 2).area, Math.sqrt(3));
});

test('prisma reto de base hexagonal regular de lado 2 e altura 5', () => {
  const p = prisma(6, 2, 5);
  proximo(p.areaBase, 6 * Math.sqrt(3));
  proximo(p.areaLateral, 12 * 5);
  proximo(p.areaTotal, 60 + 12 * Math.sqrt(3));
  proximo(p.volume, 30 * Math.sqrt(3));
});

test('prisma: o volume é área da base vezes a altura, com qualquer número de lados', () => {
  for (const n of [3, 4, 5, 6, 7, 8]) {
    const p = prisma(n, 1.5, 4);
    proximo(p.volume, poligonoRegular(n, 1.5).area * 4, `n=${n}`);
  }
});

test('pirâmide regular de base quadrada de lado 6 e altura 4: apótema 5 e volume 48', () => {
  const p = piramide(4, 6, 4);
  proximo(p.areaBase, 36);
  proximo(p.apotema, 5);
  proximo(p.areaLateral, 60);
  proximo(p.areaTotal, 96);
  proximo(p.volume, 48);
});

test('pirâmide: o volume é exatamente um terço do prisma de mesma base e mesma altura', () => {
  for (const n of [3, 4, 5, 6]) {
    const pir = piramide(n, 2.3, 5.1);
    const pri = prisma(n, 2.3, 5.1);
    proximo(pir.volume * 3, pri.volume, `n=${n}`);
  }
});

test('cilindro de raio 5 e altura 12: volume 300 pi e área total 170 pi', () => {
  const c = cilindro(5, 12);
  proximo(c.volume, 300 * Math.PI);
  proximo(c.areaLateral, 120 * Math.PI);
  proximo(c.areaTotal, 170 * Math.PI);
});

test('cone de raio 3 e altura 4: geratriz 5, área total 24 pi e volume 12 pi', () => {
  const c = cone(3, 4);
  proximo(c.geratriz, 5);
  proximo(c.areaLateral, 15 * Math.PI);
  proximo(c.areaTotal, 24 * Math.PI);
  proximo(c.volume, 12 * Math.PI);
});

test('cone: o volume é um terço do cilindro de mesma base e mesma altura', () => {
  proximo(cone(2.5, 7).volume * 3, cilindro(2.5, 7).volume);
});

test('esfera de raio 3: volume 36 pi e área 36 pi', () => {
  const e = esfera(3);
  proximo(e.volume, 36 * Math.PI);
  proximo(e.areaTotal, 36 * Math.PI);
});

test('semelhança: comprimento k, área k ao quadrado, volume k ao cubo', () => {
  const s = semelhanca(1.5);
  proximo(s.comprimento, 1.5);
  proximo(s.area, 2.25);
  proximo(s.volume, 3.375);
});

test('dois cubos semelhantes na razão 3:2, o menor com 40 cm cúbicos: o maior tem 135', () => {
  proximo(40 * semelhanca(3 / 2).volume, 135);
});

test('corte paralelo à base: a pirâmide menor vale t ao cubo do volume e o tronco é o resto', () => {
  const meio = cortePiramide(48, 0.5);
  proximo(meio.menor, 6);
  proximo(meio.tronco, 42);
  proximo(meio.menor + meio.tronco, 48);

  assert.deepEqual(cortePiramide(48, 0), { menor: 0, tronco: 48 });
  assert.deepEqual(cortePiramide(48, 1), { menor: 48, tronco: 0 });
});

test('entrada fora do domínio é recusada em vez de devolver número sem sentido', () => {
  assert.throws(() => poligonoRegular(2, 1), RangeError);
  assert.throws(() => poligonoRegular(4.5, 1), RangeError);
  assert.throws(() => poligonoRegular(4, 0), RangeError);
  assert.throws(() => bloco(1, -1, 1), RangeError);
  assert.throws(() => cilindro(Number.NaN, 1), RangeError);
  assert.throws(() => cortePiramide(10, 1.2), RangeError);
});

test('formatar usa vírgula decimal e no máximo duas casas', () => {
  assert.equal(formatar(20 * Math.PI), '62,83');
  assert.equal(formatar(13), '13');
  assert.equal(formatar(0.5), '0,5');
});
