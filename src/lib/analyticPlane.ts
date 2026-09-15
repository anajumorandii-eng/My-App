/**
 * As configurações do instrumento de geometria analítica.
 *
 * Módulo puro pelo mesmo motivo de `curveFamilies.ts` e `opticalImage.ts`: a
 * conta que decide se a reta é secante ou tangente à circunferência é o que o
 * capítulo ensina, e precisa rodar em `node:test`. A prancha de lentes já
 * mostrou o preço de deixar a conta dentro do JSX — um erro de sinal atravessou
 * lint e testes porque nada avaliava a física, só a renderização.
 *
 * O que muda deste instrumento para o cartesiano: lá a estudante move dois
 * números por controles deslizantes; aqui ela **arrasta um ponto** pelo plano, e
 * as leituras respondem à posição. É a manipulação que o conteúdo pede — a
 * distância de um ponto a uma reta só vira intuição quando se vê o valor mudar
 * enquanto o ponto anda.
 */

export interface Ponto {
  x: number;
  y: number;
}

/** Reta na forma geral ax + by + c = 0. */
export interface Reta {
  a: number;
  b: number;
  c: number;
}

export interface Circulo {
  cx: number;
  cy: number;
  r: number;
}

export interface Leitura {
  label: string;
  value: string;
  /** Marca a leitura que muda de natureza, não só de número. */
  pivot?: boolean;
}

export interface Marca {
  text: string;
  /** Ponto que a seta toca, em coordenadas do plano. */
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export type ConfigId =
  | 'dois-pontos' | 'ponto-reta' | 'circunferencia'
  | 'duas-retas' | 'reta-circunferencia' | 'complexo';

export interface AnalyticConfig {
  id: ConfigId;
  name: string;
  /** Pergunta que o arraste responde. Vira o subtítulo da prancha. */
  question: string;
  /** Meia-largura do plano desenhado, em unidades. */
  alcance: number;
  /** Onde o ponto arrastável começa. */
  inicial: Ponto;
  rotulo: string;
  /** Segundo ponto fixo, quando a configuração precisa de um. */
  fixo?: Ponto;
  reta?: Reta;
  reta2?: Reta;
  /**
   * Reta que depende do ponto arrastado.
   *
   * Existe porque duas configurações nasceram sem ela e ficaram sem sentido: as
   * leituras não usavam o ponto, então arrastar não mudava nada e a anotação
   * apontava para uma distância que o desenho não tinha. Instrumento cujo
   * arraste não altera a leitura não é instrumento — é figura.
   */
  retaDe?: (p: Ponto) => Reta;
  circulo?: Circulo;
  readouts(p: Ponto): Leitura[];
  annotations(p: Ponto): Marca[];
  insight: string;
}

/** Número em pt-BR, com o menos tipográfico do resto da prancha. */
export function num(v: number, casas = 2): string {
  if (!Number.isFinite(v)) return '—';
  return Number(v.toFixed(casas)).toLocaleString('pt-BR', { maximumFractionDigits: casas }).replace('-', '−');
}

export function distanciaEntrePontos(a: Ponto, b: Ponto): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function pontoMedio(a: Ponto, b: Ponto): Ponto {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Coeficiente angular, ou `null` na reta vertical — onde ele não existe. */
export function coeficienteAngular(a: Ponto, b: Ponto): number | null {
  if (Math.abs(a.x - b.x) < 1e-9) return null;
  return (b.y - a.y) / (b.x - a.x);
}

export function distanciaPontoReta(p: Ponto, r: Reta): number {
  return Math.abs(r.a * p.x + r.b * p.y + r.c) / Math.hypot(r.a, r.b);
}

/** Pé da perpendicular: é onde a distância é medida, e o desenho precisa dele. */
export function projecaoNaReta(p: Ponto, r: Reta): Ponto {
  const k = (r.a * p.x + r.b * p.y + r.c) / (r.a * r.a + r.b * r.b);
  return { x: p.x - r.a * k, y: p.y - r.b * k };
}

export type PosicaoNoCirculo = 'dentro' | 'sobre' | 'fora';

export function posicaoNoCirculo(p: Ponto, c: Circulo, tolerancia = 0.12): PosicaoNoCirculo {
  const d = Math.hypot(p.x - c.cx, p.y - c.cy);
  if (Math.abs(d - c.r) <= tolerancia) return 'sobre';
  return d < c.r ? 'dentro' : 'fora';
}

export type PosicaoDeRetas = 'concorrentes' | 'paralelas' | 'coincidentes';

export function posicaoDeRetas(r1: Reta, r2: Reta): PosicaoDeRetas {
  const det = r1.a * r2.b - r2.a * r1.b;
  if (Math.abs(det) > 1e-9) return 'concorrentes';
  // Determinante nulo: ou é a mesma reta escrita duas vezes, ou são paralelas
  // distintas. Comparar c proporcionalmente separa os dois casos.
  const escala = Math.abs(r1.a) > 1e-9 ? r2.a / r1.a : r2.b / r1.b;
  return Math.abs(r2.c - r1.c * escala) < 1e-9 ? 'coincidentes' : 'paralelas';
}

export function interseccao(r1: Reta, r2: Reta): Ponto | null {
  const det = r1.a * r2.b - r2.a * r1.b;
  if (Math.abs(det) < 1e-9) return null;
  return {
    x: (r1.b * r2.c - r2.b * r1.c) / det,
    y: (r2.a * r1.c - r1.a * r2.c) / det,
  };
}

export type PosicaoRetaCirculo = 'secante' | 'tangente' | 'externa';

/** A comparação é entre a distância do centro à reta e o raio. É só isso. */
export function posicaoRetaCirculo(r: Reta, c: Circulo, tolerancia = 0.12): PosicaoRetaCirculo {
  const d = distanciaPontoReta({ x: c.cx, y: c.cy }, r);
  if (Math.abs(d - c.r) <= tolerancia) return 'tangente';
  return d < c.r ? 'secante' : 'externa';
}

export function moduloEArgumento(p: Ponto): { modulo: number; argumento: number } {
  const graus = (Math.atan2(p.y, p.x) * 180) / Math.PI;
  return { modulo: Math.hypot(p.x, p.y), argumento: graus < 0 ? graus + 360 : graus };
}

/** Escreve a reta como equação legível, omitindo termo nulo e coeficiente 1. */
export function escreverReta(r: Reta): string {
  const termo = (v: number, letra: string, primeiro: boolean) => {
    if (Math.abs(v) < 1e-9) return '';
    const sinal = v > 0 ? (primeiro ? '' : ' + ') : primeiro ? '−' : ' − ';
    const mod = Math.abs(v);
    return `${sinal}${mod === 1 ? '' : num(mod)}${letra}`;
  };
  const ax = termo(r.a, 'x', true);
  const by = termo(r.b, 'y', ax === '');
  const cc = Math.abs(r.c) < 1e-9 ? '' : `${r.c > 0 ? (ax || by ? ' + ' : '') : ax || by ? ' − ' : '−'}${num(Math.abs(r.c))}`;
  return `${ax}${by}${cc} = 0`;
}

export const CONFIGS: Record<ConfigId, AnalyticConfig> = {
  'dois-pontos': {
    id: 'dois-pontos',
    name: 'Dois pontos no plano',
    question: 'O que dois pontos já determinam sozinhos?',
    alcance: 6,
    inicial: { x: 3, y: 2 },
    rotulo: 'B',
    fixo: { x: -3, y: -2 },
    readouts: (p) => {
      const a = { x: -3, y: -2 };
      const m = pontoMedio(a, p);
      const inclinacao = coeficienteAngular(a, p);
      return [
        { label: 'distância AB', value: num(distanciaEntrePontos(a, p)) },
        { label: 'ponto médio', value: `(${num(m.x)}; ${num(m.y)})` },
        {
          label: 'coeficiente angular',
          value: inclinacao === null ? 'não existe (reta vertical)' : num(inclinacao),
          pivot: true,
        },
      ];
    },
    annotations: (p) => {
      const a = { x: -3, y: -2 };
      const m = pontoMedio(a, p);
      return [
        { text: 'ponto médio', x: m.x, y: m.y, dx: 0.4, dy: -1.5 },
        { text: 'a distância é a hipotenusa', x: (a.x + p.x) / 2, y: (a.y + p.y) / 2, dx: 0.3, dy: 1.9 },
      ];
    },
    insight:
      'a distância entre dois pontos é Pitágoras aplicado ao triângulo que as diferenças de x e de y formam — não é fórmula nova. Arraste B até alinhá-lo verticalmente com A e veja o coeficiente angular deixar de existir.',
  },

  'ponto-reta': {
    id: 'ponto-reta',
    name: 'Distância de um ponto a uma reta',
    question: 'Por que a distância é medida na perpendicular, e não em qualquer direção?',
    alcance: 6,
    // Longe da reta de propósito: com o ponto inicial colado nela a
    // perpendicular saía com dois pixels e a prancha não demonstrava o que
    // promete. Aqui a distância começa perto de 4.
    inicial: { x: -1, y: 3.5 },
    rotulo: 'P',
    reta: { a: 1, b: -1, c: -1 },
    readouts: (p) => {
      const r: Reta = { a: 1, b: -1, c: -1 };
      const pe = projecaoNaReta(p, r);
      const valor = r.a * p.x + r.b * p.y + r.c;
      return [
        { label: 'reta', value: escreverReta(r) },
        { label: 'distância', value: num(distanciaPontoReta(p, r)), pivot: true },
        { label: 'pé da perpendicular', value: `(${num(pe.x)}; ${num(pe.y)})` },
        { label: 'lado da reta', value: Math.abs(valor) < 0.12 ? 'sobre ela' : valor > 0 ? 'abaixo' : 'acima' },
      ];
    },
    annotations: (p) => {
      const pe = projecaoNaReta(p, { a: 1, b: -1, c: -1 });
      return [{ text: 'pé da perpendicular', x: pe.x, y: pe.y, dx: 1.5, dy: -1.6 }];
    },
    insight:
      'qualquer outro segmento de P até a reta é hipotenusa de um triângulo que tem a perpendicular como cateto — e cateto é sempre menor. Por isso a menor distância é a perpendicular, e por isso a fórmula traz o módulo dividido pela norma.',
  },

  circunferencia: {
    id: 'circunferencia',
    name: 'Equação da circunferência',
    question: 'O que a equação diz sobre um ponto que não está sobre a curva?',
    alcance: 6,
    inicial: { x: 3.4, y: 1.2 },
    rotulo: 'P',
    circulo: { cx: 0.5, cy: -0.5, r: 3 },
    readouts: (p) => {
      const c: Circulo = { cx: 0.5, cy: -0.5, r: 3 };
      const d = Math.hypot(p.x - c.cx, p.y - c.cy);
      const pos = posicaoNoCirculo(p, c);
      return [
        { label: 'equação', value: '(x − 0,5)² + (y + 0,5)² = 9' },
        { label: 'distância ao centro', value: num(d) },
        { label: 'raio', value: num(c.r) },
        { label: 'posição', value: pos, pivot: true },
      ];
    },
    annotations: (p) => {
      const c = { x: 0.5, y: -0.5 };
      return [
        { text: 'centro', x: c.x, y: c.y, dx: -1.6, dy: -0.9 },
        { text: 'compare com o raio', x: (c.x + p.x) / 2, y: (c.y + p.y) / 2, dx: 0.4, dy: 1.6 },
      ];
    },
    insight:
      'a equação é a distância ao centro escrita sem a raiz. Substituir um ponto e comparar o resultado com r² responde de imediato se ele está dentro, sobre ou fora — não é preciso desenhar nada.',
  },

  'duas-retas': {
    id: 'duas-retas',
    name: 'Posições relativas entre duas retas',
    question: 'O que decide se duas retas se cruzam: os coeficientes ou os pontos?',
    alcance: 6,
    // Escolhido para que o cruzamento nasça dentro do quadro: em (3; 1) as
    // retas se encontravam em (9; 9), fora da vista, e a prancha abria já
    // parecendo que não havia ponto comum.
    inicial: { x: -2, y: 1 },
    rotulo: 'P',
    reta: { a: 1, b: -1, c: 0 },
    fixo: { x: 0, y: -3 },
    // r₂ é a reta que passa por A e por P: arrastar P gira r₂, e em algum lugar
    // dessa rotação ela fica paralela a r₁. Encontrar esse lugar é o exercício.
    retaDe: (p) => ({ a: p.y + 3, b: -p.x, c: -3 * p.x }),
    readouts: (p) => {
      const r1: Reta = { a: 1, b: -1, c: 0 };
      const r2: Reta = { a: p.y + 3, b: -p.x, c: -3 * p.x };
      const cruz = interseccao(r1, r2);
      return [
        { label: 'r₁ (fixa)', value: escreverReta(r1) },
        { label: 'r₂ (por A e P)', value: escreverReta(r2) },
        { label: 'posição', value: posicaoDeRetas(r1, r2), pivot: true },
        { label: 'ponto comum', value: cruz ? `(${num(cruz.x)}; ${num(cruz.y)})` : 'nenhum' },
      ];
    },
    annotations: (p) => {
      const cruz = interseccao({ a: 1, b: -1, c: 0 }, { a: p.y + 3, b: -p.x, c: -3 * p.x });
      // Três casos, e confundir dois deles é mentir sobre a geometria: sem
      // cruzamento é paralelismo; cruzamento fora da moldura continua sendo
      // cruzamento, e a primeira versão dizia "sem ponto comum" nesse caso.
      if (!cruz) return [{ text: 'paralelas: não se cruzam', x: p.x, y: p.y, dx: -1.4, dy: 1.6 }];
      if (Math.abs(cruz.x) > 5.4 || Math.abs(cruz.y) > 5.4) {
        return [{ text: 'cruzam fora do quadro', x: p.x, y: p.y, dx: -1.4, dy: 1.6 }];
      }
      return [{ text: 'o ponto comum', x: cruz.x, y: cruz.y, dx: 1.5, dy: 1.4 }];
    },
    insight:
      'o determinante dos coeficientes decide sozinho: diferente de zero, as retas se cruzam em um ponto; igual a zero, elas são paralelas. Arraste P até r₂ ficar paralela a r₁ e veja o ponto comum desaparecer.',
  },

  'reta-circunferencia': {
    id: 'reta-circunferencia',
    name: 'Reta e circunferência',
    question: 'Em quantos pontos uma reta pode cortar uma circunferência?',
    alcance: 6,
    inicial: { x: 2.6, y: 2.6 },
    rotulo: 'P',
    circulo: { cx: 0, cy: 0, r: 3 },
    // A reta passa por P com inclinação fixa: arrastar P a aproxima ou afasta
    // do centro, e é assim que a estudante encontra sozinha a posição tangente.
    retaDe: (p) => ({ a: 1, b: 1, c: -(p.x + p.y) }),
    readouts: (p) => {
      const c: Circulo = { cx: 0, cy: 0, r: 3 };
      const r: Reta = { a: 1, b: 1, c: -(p.x + p.y) };
      const d = distanciaPontoReta({ x: c.cx, y: c.cy }, r);
      const pos = posicaoRetaCirculo(r, c);
      return [
        { label: 'distância do centro à reta', value: num(d) },
        { label: 'raio', value: num(c.r) },
        { label: 'comparação', value: d < c.r ? 'd < r' : d > c.r ? 'd > r' : 'd = r' },
        { label: 'posição', value: pos, pivot: true },
        { label: 'pontos em comum', value: pos === 'secante' ? 'dois' : pos === 'tangente' ? 'um' : 'nenhum' },
      ];
    },
    annotations: (p) => {
      const pe = projecaoNaReta({ x: 0, y: 0 }, { a: 1, b: 1, c: -(p.x + p.y) });
      return [{ text: 'é esta distância', x: pe.x / 2, y: pe.y / 2, dx: -2.2, dy: 0.9 }];
    },
    insight:
      'não é preciso resolver o sistema para saber quantos pontos existem: basta comparar a distância do centro à reta com o raio. Arraste P até a leitura virar "tangente" e veja d e r se igualarem.',
  },

  complexo: {
    id: 'complexo',
    name: 'O plano de Argand',
    question: 'O que um número complexo é, visto como ponto?',
    alcance: 5,
    inicial: { x: 3, y: 2 },
    rotulo: 'z',
    readouts: (p) => {
      const { modulo, argumento } = moduloEArgumento(p);
      return [
        { label: 'forma algébrica', value: `${num(p.x)} ${p.y < 0 ? '−' : '+'} ${num(Math.abs(p.y))}i` },
        { label: 'módulo |z|', value: num(modulo), pivot: true },
        { label: 'argumento', value: `${num(argumento, 1)}°` },
        { label: 'conjugado', value: `${num(p.x)} ${p.y < 0 ? '+' : '−'} ${num(Math.abs(p.y))}i` },
      ];
    },
    annotations: (p) => [
      { text: 'módulo é a distância', x: p.x / 2, y: p.y / 2, dx: -1.6, dy: 0.8 },
      { text: 'conjugado', x: p.x, y: -p.y, dx: 0.5, dy: -0.9 },
    ],
    insight:
      'o módulo é a distância até a origem, e o conjugado é a reflexão no eixo real. Multiplicar por i gira o ponto 90° — a operação que parece abstrata na álgebra é um giro no plano.',
  },
};
