import { poligonoRegular } from './solids';
import { SOLID_CONFIGS, type SolidConfigId } from './solidInstruments';

/**
 * Desenho dos sólidos como formas de tela, sem React, para poder conferir em
 * node:test que nada sai do viewBox. Cada sólido é gerado em coordenadas de
 * modelo (Y para cima) e depois enquadrado.
 *
 * A escala é fixa por instrumento — a do pior caso de todos os controles —
 * para que dobrar a altura se veja como dobro. Só a semelhança ajusta a escala
 * ao que está na tela, porque o que ela mostra é a razão entre dois cubos. Em
 * ambos os casos o desenho fica centrado no cartão.
 */
export const LARGURA = 320;
export const ALTURA = 300;
const MARGEM = 26;

type P = [number, number];
export type Estilo = 'aresta' | 'oculta' | 'destaque' | 'apoio' | 'menor' | 'base';
export type Forma =
  | { tipo: 'linha'; a: P; b: P; estilo: Estilo }
  | { tipo: 'poligono'; pontos: P[]; estilo: Estilo }
  | { tipo: 'elipse'; c: P; rx: number; ry: number; arco: 'frente' | 'costas' | 'inteira'; estilo: Estilo }
  | { tipo: 'rotulo'; p: P; texto: string };

const EPS = 1e-6;
// Perspectiva cavaleira do bloco: a profundidade sobe e vai para a direita.
const OBLIQUA = { x: 0.42, y: 0.3 };
// Vista de cima dos sólidos de base circular: a profundidade só sobe, e a base vira elipse.
const INCLINACAO = 0.34;

const cavaleira = (dx: number, x: number, y: number, z: number): P => [dx + x + z * OBLIQUA.x, y + z * OBLIQUA.y];
const deCima = (x: number, y: number, z: number): P => [x, y + z * INCLINACAO];
const linha = (a: P, b: P, estilo: Estilo): Forma => ({ tipo: 'linha', a, b, estilo });
const rotulo = (p: P, texto: string): Forma => ({ tipo: 'rotulo', p, texto });

function caixa(dx: number, a: number, b: number, c: number): Forma[] {
  const p = (x: number, y: number, z: number) => cavaleira(dx, x, y, z);
  const f00 = p(0, 0, 0), f10 = p(a, 0, 0), f11 = p(a, c, 0), f01 = p(0, c, 0);
  const b00 = p(0, 0, b), b10 = p(a, 0, b), b11 = p(a, c, b), b01 = p(0, c, b);
  return [
    linha(f00, f10, 'aresta'), linha(f10, f11, 'aresta'), linha(f11, f01, 'aresta'), linha(f01, f00, 'aresta'),
    linha(f01, b01, 'aresta'), linha(f11, b11, 'aresta'), linha(b01, b11, 'aresta'),
    linha(f10, b10, 'aresta'), linha(b10, b11, 'aresta'),
    linha(f00, b00, 'oculta'), linha(b00, b01, 'oculta'), linha(b00, b10, 'oculta'),
  ];
}

function bloco({ a, b, c }: Record<string, number>): Forma[] {
  const p = (x: number, y: number, z: number) => cavaleira(0, x, y, z);
  const meio = (u: P, v: P): P => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
  return [
    ...caixa(0, a, b, c),
    // A diagonal da face fica no piso do bloco; a principal atravessa o interior
    // e, com a aresta vertical, fecha o triângulo retângulo que o capítulo usa.
    linha(p(0, 0, 0), p(a, 0, b), 'apoio'),
    linha(p(0, 0, 0), p(a, c, b), 'destaque'),
    rotulo([a / 2, -0.75], 'a'),
    rotulo([p(a, 0, b / 2)[0] + 0.55, p(a, 0, b / 2)[1] - 0.25], 'b'),
    rotulo([-0.8, c / 2], 'c'),
    rotulo([meio(p(0, 0, 0), p(a, 0, b))[0], meio(p(0, 0, 0), p(a, 0, b))[1] - 0.7], 'd'),
    rotulo([meio(p(0, 0, 0), p(a, c, b))[0] - 0.7, meio(p(0, 0, 0), p(a, c, b))[1] + 0.2], 'D'),
  ];
}

function vertices(n: number, l: number): Array<{ x: number; z: number }> {
  const { raio } = poligonoRegular(n, l);
  return Array.from({ length: n }, (_, k) => {
    const t = -Math.PI / 2 + (2 * Math.PI * k) / n;
    return { x: raio * Math.cos(t), z: raio * Math.sin(t) };
  });
}

/**
 * A aresta da base de baixo fica escondida quando o ponto médio está atrás do
 * centro. A face de cima é vista de cima: `deCima` a mostra inteira, sem
 * nenhuma aresta escondida.
 */
function arestasDaBase(v: Array<{ x: number; z: number }>, y: number, dx = 0, escala = 1, faceDeCima = false): Forma[] {
  return v.map((q, k) => {
    const r = v[(k + 1) % v.length];
    const escondida = !faceDeCima && (q.z + r.z) / 2 > EPS;
    return linha(deCima(dx + q.x * escala, y, q.z * escala), deCima(dx + r.x * escala, y, r.z * escala), escondida ? 'oculta' : 'aresta');
  });
}

/** Vértices de silhueta (os mais à esquerda e à direita) nunca ficam escondidos. */
function estaEscondido(q: { x: number; z: number }, v: Array<{ x: number; z: number }>): boolean {
  const minX = Math.min(...v.map((u) => u.x));
  const maxX = Math.max(...v.map((u) => u.x));
  return q.z > EPS && q.x > minX + EPS && q.x < maxX - EPS;
}

function prisma({ n, l, h, s }: Record<string, number>): Forma[] {
  const v = vertices(n, l);
  // A cota de altura é uma linha de dimensão à direita de todo o sólido, com
  // marcas nas pontas. No meio do prisma ela caía sobre a aresta vertical da
  // frente e a escondia. A altura é sempre a perpendicular ao plano da base,
  // inclusive no prisma inclinado.
  const xCota = Math.max(...v.map((q) => q.x)) + s + 0.9;
  const formas: Forma[] = [
    { tipo: 'poligono', pontos: v.map((q) => deCima(q.x + s, h, q.z)), estilo: 'base' },
    ...arestasDaBase(v, 0),
    ...arestasDaBase(v, h, s, 1, true),
    ...v.map((q) => linha(deCima(q.x, 0, q.z), deCima(q.x + s, h, q.z), estaEscondido(q, v) ? 'oculta' : 'aresta')),
    linha([xCota, h], [xCota, 0], 'apoio'),
    linha([xCota - 0.25, 0], [xCota + 0.25, 0], 'apoio'),
    linha([xCota - 0.25, h], [xCota + 0.25, h], 'apoio'),
    rotulo([xCota + 0.7, h / 2], 'h'),
  ];
  if (s > 0) formas.push(linha(deCima(v[0].x, 0, v[0].z), deCima(v[0].x + s, h, v[0].z), 'destaque'));
  return formas;
}

function piramide({ n, l, h, t }: Record<string, number>): Forma[] {
  const v = vertices(n, l);
  const apice = deCima(0, h, 0);
  const formas: Forma[] = [
    ...arestasDaBase(v, 0),
    ...v.map((q) => linha(apice, deCima(q.x, 0, q.z), estaEscondido(q, v) ? 'oculta' : 'aresta')),
  ];

  if (t < 1) {
    // O corte é paralelo à base e semelhante a ela, na razão t medida do ápice.
    const y = h * (1 - t);
    const corte = v.map((q) => deCima(q.x * t, y, q.z * t));
    formas.push({ tipo: 'poligono', pontos: corte, estilo: 'menor' });
    v.forEach((q, k) => {
      const r = v[(k + 1) % v.length];
      formas.push(linha(corte[k], corte[(k + 1) % v.length], (q.z + r.z) / 2 > EPS ? 'oculta' : 'destaque'));
    });
  }

  const arestaDaFrente = v
    .map((q, k) => ({ x: (q.x + v[(k + 1) % v.length].x) / 2, z: (q.z + v[(k + 1) % v.length].z) / 2 }))
    .reduce((a, b) => (b.z < a.z ? b : a));
  const pe = deCima(arestaDaFrente.x, 0, arestaDaFrente.z);
  formas.push(
    linha(apice, deCima(0, 0, 0), 'apoio'),
    linha(apice, pe, 'apoio'),
    rotulo([apice[0] + 0.45, h / 2 + 0.3], 'h'),
    rotulo([(apice[0] + pe[0]) / 2 + 0.5, (apice[1] + pe[1]) / 2 - 0.2], 'ap'),
  );
  return formas;
}

function revolucao({ r, h }: Record<string, number>, forma = 'cilindro'): Forma[] {
  const ry = r * INCLINACAO;
  const baseEm = (y: number): Forma[] => [
    { tipo: 'elipse', c: [0, y], rx: r, ry, arco: 'frente', estilo: 'aresta' },
    { tipo: 'elipse', c: [0, y], rx: r, ry, arco: 'costas', estilo: 'oculta' },
  ];

  if (forma === 'esfera') {
    return [
      { tipo: 'elipse', c: [0, r], rx: r, ry: r, arco: 'inteira', estilo: 'aresta' },
      ...baseEm(r),
      linha([0, r], [r, r], 'destaque'),
      rotulo([r / 2, r + 0.55], 'r'),
    ];
  }

  if (forma === 'cone') {
    return [
      ...baseEm(0),
      linha([-r, 0], [0, h], 'aresta'),
      linha([r, 0], [0, h], 'destaque'),
      linha([0, 0], [0, h], 'apoio'),
      linha([0, 0], [r, 0], 'destaque'),
      // Entre o raio e o arco da frente, para o rótulo ficar junto do que nomeia.
      rotulo([r / 2, -Math.max(0.5, ry * 0.55)], 'r'),
      rotulo([-0.55, h / 2], 'h'),
      rotulo([r / 2 + 0.6, h / 2 + 0.25], 'g'),
    ];
  }

  return [
    ...baseEm(0),
    { tipo: 'elipse', c: [0, h], rx: r, ry, arco: 'inteira', estilo: 'base' },
    linha([-r, 0], [-r, h], 'aresta'),
    linha([r, 0], [r, h], 'aresta'),
    linha([0, 0], [0, h], 'apoio'),
    linha([0, h], [r, h], 'destaque'),
    rotulo([r / 2, h + ry + 0.55], 'r'),
    rotulo([-0.55, h / 2], 'h'),
  ];
}

function semelhanca({ a, k }: Record<string, number>): Forma[] {
  const grande = a * k;
  const dx = a * (1 + OBLIQUA.x) + 1;
  return [
    ...caixa(0, a, a, a),
    ...caixa(dx, grande, grande, grande),
    rotulo([a / 2, -0.75], 'a'),
    rotulo([dx + grande / 2, -0.75], 'k·a'),
  ];
}

function gerar(id: SolidConfigId, valores: Record<string, number>, forma?: string): Forma[] {
  switch (id) {
    case 'bloco': return bloco(valores);
    case 'prisma': return prisma(valores);
    case 'piramide': return piramide(valores);
    case 'revolucao': return revolucao(valores, forma);
    case 'semelhanca': return semelhanca(valores);
  }
}

function limites(formas: Forma[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const ponto = (x: number, y: number) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); };
  for (const f of formas) {
    if (f.tipo === 'linha') { ponto(...f.a); ponto(...f.b); }
    else if (f.tipo === 'poligono') f.pontos.forEach((p) => ponto(...p));
    else if (f.tipo === 'elipse') { ponto(f.c[0] - f.rx, f.c[1] - f.ry); ponto(f.c[0] + f.rx, f.c[1] + f.ry); }
    else ponto(...f.p);
  }
  return { minX, maxX, minY, maxY };
}

const escalasMaximas = new Map<SolidConfigId, number>();

/** A escala que ainda cabe na tela no pior caso: todos os extremos dos controles combinados. */
function escalaMaxima(id: SolidConfigId): number {
  const guardada = escalasMaximas.get(id);
  if (guardada !== undefined) return guardada;

  const config = SOLID_CONFIGS[id];
  let maiorLargura = 0;
  let maiorAltura = 0;
  for (const forma of config.formas?.map((f) => f.id) ?? [undefined]) {
    for (let mascara = 0; mascara < 2 ** config.controles.length; mascara += 1) {
      const valores = Object.fromEntries(config.controles.map((c, i) => [c.id, mascara & (1 << i) ? c.max : c.min]));
      const { minX, maxX, minY, maxY } = limites(gerar(id, valores, forma));
      maiorLargura = Math.max(maiorLargura, maxX - minX);
      maiorAltura = Math.max(maiorAltura, maxY - minY);
    }
  }
  const escala = Math.min((LARGURA - 2 * MARGEM) / maiorLargura, (ALTURA - 2 * MARGEM) / maiorAltura);
  escalasMaximas.set(id, escala);
  return escala;
}

function enquadrar(formas: Forma[], escalaFixa: number | null): Forma[] {
  const { minX, maxX, minY, maxY } = limites(formas);
  const s = escalaFixa ?? Math.min((LARGURA - 2 * MARGEM) / (maxX - minX), (ALTURA - 2 * MARGEM) / (maxY - minY));
  const cx = (minX + maxX) / 2;
  // Centrado nos dois eixos, com escala fixa ou ajustada. Ancorá-lo no chão
  // deixava metade do cartão vazia em cima para os sólidos baixos.
  const ancora = ALTURA / 2 + ((minY + maxY) / 2) * s;
  const tx = (x: number) => LARGURA / 2 + (x - cx) * s;
  const ty = (y: number) => ancora - y * s;
  const pt = (p: P): P => [tx(p[0]), ty(p[1])];

  return formas.map((f): Forma => {
    if (f.tipo === 'linha') return { ...f, a: pt(f.a), b: pt(f.b) };
    if (f.tipo === 'poligono') return { ...f, pontos: f.pontos.map(pt) };
    if (f.tipo === 'elipse') return { ...f, c: pt(f.c), rx: f.rx * s, ry: f.ry * s };
    return { ...f, p: pt(f.p) };
  });
}

/**
 * Ordem de pintura: preenchimentos, arestas escondidas, visíveis, medidas de
 * apoio, destaques e rótulos. A aresta escondida de trás e a visível da frente
 * caem no mesmo x da tela em vários prismas; se a tracejada fosse pintada por
 * cima, a sólida pareceria escondida.
 */
function camada(f: Forma): number {
  if (f.tipo === 'rotulo') return 5;
  if (f.tipo === 'poligono' || f.estilo === 'base' || f.estilo === 'menor') return 0;
  return { oculta: 1, aresta: 2, apoio: 3, destaque: 4 }[f.estilo];
}

export function desenhar(id: SolidConfigId, valores: Record<string, number>, forma?: string): Forma[] {
  const formas = enquadrar(gerar(id, valores, forma), id === 'semelhanca' ? null : escalaMaxima(id));
  // A ordenação é estável: dentro de uma camada, vale a ordem em que foram geradas.
  return formas.sort((a, b) => camada(a) - camada(b));
}
