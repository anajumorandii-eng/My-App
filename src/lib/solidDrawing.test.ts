import assert from 'node:assert/strict';
import test from 'node:test';
import { ALTURA, LARGURA, desenhar, type Forma } from './solidDrawing';
import { SOLID_CONFIGS, estadoInicial, type SolidConfigId } from './solidInstruments';

const IDS: SolidConfigId[] = ['bloco', 'prisma', 'piramide', 'revolucao', 'semelhanca'];

/** Todas as combinações dos extremos de cada controle, mais o valor inicial. */
function casos(id: SolidConfigId): Array<{ valores: Record<string, number>; forma?: string }> {
  const config = SOLID_CONFIGS[id];
  const inicial = estadoInicial(config).valores;
  const combinacoes: Array<Record<string, number>> = [{ ...inicial }];
  for (const controle of config.controles) {
    const proximas: Array<Record<string, number>> = [];
    for (const base of combinacoes) {
      for (const valor of [controle.min, controle.max]) proximas.push({ ...base, [controle.id]: valor });
    }
    combinacoes.push(...proximas);
  }
  const formas = config.formas?.map((forma) => forma.id) ?? [undefined];
  return formas.flatMap((forma) => combinacoes.map((valores) => ({ valores, forma })));
}

/** Menor e maior coordenada que a forma ocupa na tela, tinta e rótulo incluídos. */
function extensao(forma: Forma): { x: number[]; y: number[] } {
  if (forma.tipo === 'linha') return { x: [forma.a[0], forma.b[0]], y: [forma.a[1], forma.b[1]] };
  if (forma.tipo === 'poligono') return { x: forma.pontos.map((p) => p[0]), y: forma.pontos.map((p) => p[1]) };
  if (forma.tipo === 'elipse') return { x: [forma.c[0] - forma.rx, forma.c[0] + forma.rx], y: [forma.c[1] - forma.ry, forma.c[1] + forma.ry] };
  return { x: [forma.p[0]], y: [forma.p[1]] };
}

test('nenhuma forma sai do viewBox, em nenhum extremo dos controles', () => {
  for (const id of IDS) {
    for (const { valores, forma } of casos(id)) {
      for (const f of desenhar(id, valores, forma)) {
        const { x, y } = extensao(f);
        const contexto = `${id}/${forma ?? '-'} ${JSON.stringify(valores)} ${f.tipo}`;
        for (const v of x) assert.ok(v >= 0 && v <= LARGURA, `${contexto}: x=${v.toFixed(1)} fora de 0..${LARGURA}`);
        for (const v of y) assert.ok(v >= 0 && v <= ALTURA, `${contexto}: y=${v.toFixed(1)} fora de 0..${ALTURA}`);
      }
    }
  }
});

test('toda coordenada é um número finito', () => {
  for (const id of IDS) {
    for (const { valores, forma } of casos(id)) {
      for (const f of desenhar(id, valores, forma)) {
        const { x, y } = extensao(f);
        for (const v of [...x, ...y]) assert.ok(Number.isFinite(v), `${id}/${forma ?? '-'}: coordenada ${v}`);
      }
    }
  }
});

test('o bloco desenha a diagonal principal em destaque e a diagonal da face como apoio', () => {
  const estilos = new Set(desenhar('bloco', estadoInicial(SOLID_CONFIGS.bloco).valores).flatMap((f) => (f.tipo === 'rotulo' ? [] : [f.estilo])));
  assert.ok(estilos.has('destaque'), 'diagonal principal');
  assert.ok(estilos.has('apoio'), 'diagonal da face');
});

test('as escalas são fixas: aumentar a altura do bloco cresce o desenho', () => {
  const alturaNaTela = (c: number) => {
    const ys = desenhar('bloco', { a: 3, b: 4, c }, undefined).flatMap((f) => (f.tipo === 'linha' ? [f.a[1], f.b[1]] : []));
    return Math.max(...ys) - Math.min(...ys);
  };
  assert.ok(alturaNaTela(12) > alturaNaTela(6) * 1.5, 'com escala fixa, dobrar a altura tem que se ver');
});

test('as duas partes do corte da pirâmide só aparecem quando há corte', () => {
  const comPoligonoMenor = (t: number) => desenhar('piramide', { n: 4, l: 6, h: 4, t }, undefined).some((f) => f.tipo === 'poligono' && f.estilo === 'menor');
  assert.equal(comPoligonoMenor(1), false);
  assert.equal(comPoligonoMenor(0.5), true);
});

test('a esfera dispensa a altura: mudar h não muda o desenho', () => {
  const a = JSON.stringify(desenhar('revolucao', { r: 3, h: 2 }, 'esfera'));
  const b = JSON.stringify(desenhar('revolucao', { r: 3, h: 11 }, 'esfera'));
  assert.equal(a, b);
});

test('o prisma inclinado destaca a aresta lateral inclinada; o reto não tem essa aresta', () => {
  const destaques = (s: number) => desenhar('prisma', { n: 6, l: 2, h: 5, s }, undefined).filter((f) => f.tipo === 'linha' && f.estilo === 'destaque');
  assert.equal(destaques(0).length, 0);
  const [aresta] = destaques(3);
  assert.ok(aresta?.tipo === 'linha');
  if (aresta?.tipo === 'linha') assert.ok(Math.abs(aresta.a[0] - aresta.b[0]) > 10, 'a aresta lateral se inclina de verdade');
});

test('a cota de altura do prisma é vertical, mesmo inclinado, e fica fora do sólido', () => {
  for (const s of [0, 3]) {
    const formas = desenhar('prisma', { n: 6, l: 2, h: 5, s }, undefined);
    const cota = formas.find((f) => f.tipo === 'linha' && f.estilo === 'apoio');
    assert.ok(cota?.tipo === 'linha', `s=${s}`);
    if (cota?.tipo !== 'linha') continue;
    assert.ok(Math.abs(cota.a[0] - cota.b[0]) < 1e-9, `s=${s}: a cota é vertical`);
    // A cota não pode cair sobre uma aresta do sólido: ficaria escondida por ela.
    const xDoSolido = formas.flatMap((f) => (f.tipo === 'linha' && f.estilo !== 'apoio' ? [f.a[0], f.b[0]] : []));
    assert.ok(cota.a[0] > Math.max(...xDoSolido) + 5, `s=${s}: a cota fica à direita de todo o sólido`);
  }
});

test('a face de cima do prisma é vista de cima: nenhuma aresta dela é escondida', () => {
  // Hexágono reto com um vértice virado para quem olha: só 2 arestas da base
  // de baixo e 1 aresta lateral, as de trás, ficam escondidas.
  const escondidas = desenhar('prisma', { n: 6, l: 2, h: 5, s: 0 }, undefined).filter((f) => f.tipo === 'linha' && f.estilo === 'oculta');
  assert.equal(escondidas.length, 3);
});

test('aresta escondida é desenhada antes da visível, para nunca cobrir uma aresta da frente', () => {
  // No prisma hexagonal a aresta de trás e a da frente caem no mesmo x da
  // tela; a tracejada por cima deixava a sólida parecendo escondida.
  const camadas = { oculta: 1, aresta: 2, apoio: 3, destaque: 4 } as const;
  for (const id of IDS) {
    for (const { valores, forma } of casos(id).slice(0, 12)) {
      const ordem = desenhar(id, valores, forma).flatMap((f) => (f.tipo !== 'rotulo' && f.estilo in camadas ? [camadas[f.estilo as keyof typeof camadas]] : []));
      assert.deepEqual(ordem, [...ordem].sort((a, b) => a - b), `${id}/${forma ?? '-'}: linhas fora da ordem escondida, visível, apoio, destaque`);
    }
  }
});

test('o desenho fica centrado na vertical, sem grudar no chão', () => {
  const ys = desenhar('bloco', { a: 3, b: 3, c: 3 }, undefined).flatMap((f) => (f.tipo === 'linha' ? [f.a[1], f.b[1]] : []));
  const acima = Math.min(...ys);
  const abaixo = ALTURA - Math.max(...ys);
  assert.ok(Math.abs(acima - abaixo) < ALTURA * 0.08, `sobra ${acima.toFixed(0)} em cima e ${abaixo.toFixed(0)} embaixo`);
});
