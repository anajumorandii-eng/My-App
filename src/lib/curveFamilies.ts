/**
 * As famílias de curva do instrumento cartesiano.
 *
 * Módulo puro, sem React, pelo mesmo motivo de `visualStudy.ts`: a conta que
 * decide quantas raízes a parábola tem, ou qual o período da senoide, é o que
 * a prancha ensina — e precisa rodar em `node:test`, não só na tela.
 *
 * Por que instrumento e não cena desenhada: a auditoria do registro de pranchas
 * mostrou que 18 das 26 cenas alcançam exatamente um capítulo, porque o
 * currículo tem um capítulo por fenômeno. Um plano cartesiano com parâmetros
 * não tem esse teto — a mesma peça serve função afim, quadrática, exponencial,
 * logarítmica, modular, senoidal e polinomial, e em cada uma ela mostra o que
 * aquele capítulo cobra. Continua não sendo ilustração emprestada: o objeto do
 * capítulo de função quadrática É a parábola.
 */

export type FamilyId =
  | 'afim' | 'quadratica' | 'exponencial' | 'logaritmica'
  | 'senoidal' | 'modular' | 'polinomial';

export interface FamilyParam {
  /** Símbolo como aparece na expressão. */
  symbol: string;
  /** O que a estudante vê mudar ao mexer — é isto que ela lê no controle. */
  role: string;
  min: number;
  max: number;
  step: number;
  initial: number;
}

export interface Readout {
  label: string;
  value: string;
  /** Marca a leitura que muda de natureza, não só de número (nº de raízes). */
  pivot?: boolean;
}

export interface Family {
  id: FamilyId;
  name: string;
  /** Pergunta que a manipulação responde. Vira o subtítulo da prancha. */
  question: string;
  params: [FamilyParam, FamilyParam];
  /** Intervalo de x desenhado. */
  domain: { min: number; max: number };
  /** Intervalo de y enquadrado. */
  range: { min: number; max: number };
  expression(a: number, b: number): string;
  /** `null` onde a função não existe — a curva quebra em vez de inventar ponto. */
  f(x: number, a: number, b: number): number | null;
  readouts(a: number, b: number): Readout[];
  /** O que a manipulação ensina. Vira o fecho da prancha. */
  insight: string;
}

/** Número em pt-BR, sem casa decimal inútil. */
export function num(value: number, casas = 2): string {
  if (!Number.isFinite(value)) return '—';
  const arredondado = Number(value.toFixed(casas));
  // O toLocaleString devolve hífen ASCII; o resto da prancha escreve o menos
  // tipográfico, e os dois lado a lado numa mesma leitura ficam desalinhados.
  return arredondado.toLocaleString('pt-BR', { maximumFractionDigits: casas }).replace('-', '−');
}

/** Coeficiente dentro de expressão: omite o 1, vira "−" no −1. */
function coef(value: number): string {
  if (value === 1) return '';
  if (value === -1) return '−';
  return num(value);
}

/** Índice da base do logaritmo em subscrito: log₂, não log2. */
const SUBSCRITO = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
function sub(value: number): string {
  return String(Math.round(value)).split('').map((d) => SUBSCRITO[Number(d)] ?? d).join('');
}

/** Parcela com sinal, para montar "ax + b" sem "+ -3". */
function parcela(value: number, sufixo = ''): string {
  if (value === 0) return '';
  const sinal = value > 0 ? ' + ' : ' − ';
  const corpo = sufixo ? `${coef(Math.abs(value))}${sufixo}` : num(Math.abs(value));
  return `${sinal}${corpo}`;
}

export const FAMILIES: Record<FamilyId, Family> = {
  afim: {
    id: 'afim',
    name: 'Função afim',
    question: 'O que a inclinação decide, e o que o termo independente decide?',
    params: [
      { symbol: 'a', role: 'inclinação', min: -3, max: 3, step: 0.25, initial: 1 },
      { symbol: 'b', role: 'onde corta o eixo y', min: -4, max: 4, step: 0.5, initial: 1 },
    ],
    domain: { min: -6, max: 6 },
    range: { min: -6, max: 6 },
    expression: (a, b) => (a === 0 ? `f(x) = ${num(b)}` : `f(x) = ${coef(a)}x${parcela(b)}`),
    f: (x, a, b) => a * x + b,
    readouts: (a, b) => [
      {
        label: 'comportamento',
        value: a > 0 ? 'crescente' : a < 0 ? 'decrescente' : 'constante',
        pivot: true,
      },
      { label: 'corta o eixo y em', value: `(0, ${num(b)})` },
      {
        label: 'raiz',
        value: a === 0 ? (b === 0 ? 'toda reta' : 'nenhuma') : `x = ${num(-b / a)}`,
      },
    ],
    insight:
      'o sinal de a decide se cresce ou decresce, e b decide onde a reta corta o eixo y — a raiz não é um terceiro dado, é a consequência dos dois. Zere a inclinação e veja a raiz desaparecer.',
  },

  quadratica: {
    id: 'quadratica',
    name: 'Função quadrática',
    question: 'Por que a mesma parábola às vezes tem duas raízes, às vezes nenhuma?',
    params: [
      { symbol: 'a', role: 'concavidade e abertura', min: -2, max: 2, step: 0.25, initial: 1 },
      { symbol: 'c', role: 'altura do vértice', min: -5, max: 5, step: 0.5, initial: -3 },
    ],
    domain: { min: -6, max: 6 },
    range: { min: -8, max: 8 },
    expression: (a, c) => (a === 0 ? `f(x) = ${num(c)}` : `f(x) = ${coef(a)}x²${parcela(c)}`),
    f: (x, a, c) => a * x * x + c,
    readouts: (a, c) => {
      // Com b = 0, Δ = b² − 4ac = −4ac. Manter a conta explícita é o ponto.
      const delta = -4 * a * c;
      const raizes = a === 0 ? '—' : delta > 0 ? 'duas' : delta === 0 ? 'uma (dupla)' : 'nenhuma real';
      return [
        { label: 'concavidade', value: a > 0 ? 'para cima' : a < 0 ? 'para baixo' : 'degenerada' },
        { label: 'vértice', value: `(0, ${num(c)})` },
        { label: 'discriminante Δ = −4ac', value: num(delta) },
        { label: 'raízes reais', value: raizes, pivot: true },
      ];
    },
    insight:
      'raiz é onde a parábola cruza o eixo x, então ela só existe quando o vértice e a concavidade apontam para lados opostos. Mova o vértice através do zero e veja Δ trocar de sinal junto com o número de raízes.',
  },

  exponencial: {
    id: 'exponencial',
    name: 'Função exponencial',
    question: 'Por que crescimento exponencial não é crescimento rápido, e sim multiplicativo?',
    params: [
      { symbol: 'a', role: 'valor inicial', min: 0.5, max: 4, step: 0.25, initial: 1 },
      { symbol: 'b', role: 'fator de crescimento', min: 0.2, max: 3, step: 0.1, initial: 2 },
    ],
    domain: { min: -4, max: 4 },
    range: { min: -1, max: 9 },
    expression: (a, b) => `f(x) = ${coef(a) || ''}${a === 1 ? '' : ' · '}${num(b)}ˣ`,
    f: (x, a, b) => (b <= 0 ? null : a * Math.pow(b, x)),
    readouts: (a, b) => {
      const dobra = b > 1 ? Math.log(2) / Math.log(b) : null;
      return [
        { label: 'f(0)', value: num(a) },
        {
          label: 'comportamento',
          value: b > 1 ? 'crescente' : b === 1 ? 'constante' : 'decrescente',
          pivot: true,
        },
        { label: 'a cada passo', value: `× ${num(b)}` },
        { label: 'dobra em', value: dobra === null ? 'nunca dobra' : `${num(dobra)} passos` },
      ];
    },
    insight:
      'a cada passo de x a função multiplica por b, não soma — por isso o tempo de duplicação é sempre o mesmo, não importa de onde se comece. É a diferença entre juros compostos e juros simples.',
  },

  logaritmica: {
    id: 'logaritmica',
    name: 'Função logarítmica',
    question: 'Em que sentido o logaritmo desfaz a exponencial?',
    params: [
      { symbol: 'a', role: 'escala vertical', min: 0.5, max: 3, step: 0.25, initial: 1 },
      { symbol: 'b', role: 'base', min: 2, max: 10, step: 1, initial: 2 },
    ],
    domain: { min: -1, max: 9 },
    range: { min: -5, max: 5 },
    expression: (a, b) => `f(x) = ${coef(a)}${a === 1 ? '' : ' · '}log${sub(b)}(x)`,
    f: (x, a, b) => (x <= 0 || b <= 1 ? null : (a * Math.log(x)) / Math.log(b)),
    readouts: (a, b) => [
      { label: 'domínio', value: 'x > 0', pivot: true },
      { label: 'f(1)', value: '0, em qualquer base' },
      { label: `f(${num(b)})`, value: num(a) },
      { label: 'assíntota', value: 'vertical em x = 0' },
    ],
    insight:
      'o logaritmo responde "a que expoente elevo a base para chegar aqui" — por isso f(1) = 0 em toda base, e por isso a curva nunca alcança x = 0: não existe expoente que leve a base a zero.',
  },

  senoidal: {
    id: 'senoidal',
    name: 'Função trigonométrica',
    question: 'Amplitude e período mudam juntos ou são independentes?',
    params: [
      { symbol: 'a', role: 'amplitude', min: 0.5, max: 3, step: 0.25, initial: 1 },
      { symbol: 'b', role: 'frequência', min: 0.5, max: 3, step: 0.25, initial: 1 },
    ],
    domain: { min: -6.5, max: 6.5 },
    range: { min: -3.5, max: 3.5 },
    expression: (a, b) => `f(x) = ${coef(a)}${a === 1 ? '' : ' · '}sen(${coef(b)}x)`,
    f: (x, a, b) => a * Math.sin(b * x),
    readouts: (a, b) => [
      { label: 'amplitude', value: num(Math.abs(a)) },
      { label: 'período', value: b === 0 ? '—' : `${num((2 * Math.PI) / b)} ≈ 2π/${num(b)}`, pivot: true },
      { label: 'imagem', value: `[−${num(Math.abs(a))}, ${num(Math.abs(a))}]` },
    ],
    insight:
      'a estica na vertical e b comprime na horizontal — mexer em um não altera o outro. Amplitude e período são grandezas independentes, e é aí que a maioria dos erros de gráfico trigonométrico começa.',
  },

  modular: {
    id: 'modular',
    name: 'Função modular',
    question: 'O que o módulo faz com a parte negativa da função?',
    params: [
      { symbol: 'a', role: 'inclinação dos braços', min: -3, max: 3, step: 0.25, initial: 1 },
      { symbol: 'b', role: 'desloca o vértice', min: -4, max: 4, step: 0.5, initial: 0 },
    ],
    domain: { min: -6, max: 6 },
    range: { min: -1, max: 8 },
    expression: (a, b) => `f(x) = |${coef(a)}x${parcela(b)}|`,
    f: (x, a, b) => Math.abs(a * x + b),
    readouts: (a, b) => [
      { label: 'vértice', value: a === 0 ? '—' : `x = ${num(-b / a)}` },
      { label: 'imagem', value: 'f(x) ≥ 0', pivot: true },
      { label: 'abre em', value: 'dois ramos' },
    ],
    insight:
      'o módulo espelha para cima tudo que estava abaixo do eixo — e é exatamente por isso que resolver |ax + b| = k vira dois casos, um para cada ramo do V.',
  },

  polinomial: {
    id: 'polinomial',
    name: 'Função polinomial',
    question: 'Por que todo polinômio de grau ímpar tem pelo menos uma raiz real?',
    params: [
      { symbol: 'a', role: 'termo linear', min: -6, max: 6, step: 0.5, initial: -3 },
      { symbol: 'b', role: 'termo independente', min: -6, max: 6, step: 0.5, initial: 0 },
    ],
    domain: { min: -3.2, max: 3.2 },
    range: { min: -10, max: 10 },
    expression: (a, b) => `f(x) = x³${parcela(a, 'x')}${parcela(b)}`,
    f: (x, a, b) => x * x * x + a * x + b,
    readouts: (a, b) => {
      // Discriminante da cúbica deprimida x³ + ax + b.
      const delta = -4 * a * a * a - 27 * b * b;
      const raizes = delta > 0 ? 'três reais' : delta === 0 ? 'reais, com repetida' : 'uma real e duas complexas';
      return [
        { label: 'grau', value: '3 (ímpar)' },
        { label: 'discriminante Δ = −4a³ − 27b²', value: num(delta, 1) },
        { label: 'raízes', value: raizes, pivot: true },
        { label: 'extremos', value: 'vai de −∞ a +∞' },
      ];
    },
    insight:
      'grau ímpar leva a função de −∞ a +∞, então ela obrigatoriamente cruza o eixo x pelo menos uma vez. Mexa nos coeficientes: o número de raízes muda entre uma e três, mas nunca chega a zero.',
  },
};

/** Pontos da curva, já em coordenadas do plano (não da tela). */
export function samplePoints(
  family: Family,
  a: number,
  b: number,
  passos = 240,
): Array<{ x: number; y: number } | null> {
  const { min, max } = family.domain;
  const largura = max - min;
  return Array.from({ length: passos + 1 }, (_, i) => {
    const x = min + (largura * i) / passos;
    const y = family.f(x, a, b);
    // Fora do domínio, ou tão alto que sairia do quadro: corta o traço em vez
    // de desenhar uma linha vertical falsa até a borda.
    if (y === null || !Number.isFinite(y)) return null;
    if (y < family.range.min - largura || y > family.range.max + largura) return null;
    return { x, y };
  });
}
