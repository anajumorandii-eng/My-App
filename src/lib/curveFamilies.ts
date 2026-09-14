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

/**
 * Rótulo manuscrito com seta apontando para um ponto da curva.
 *
 * É o que separa um gráfico de uma prancha: a referência que a Ana Júlia
 * aprovou não rotula os eixos, rotula os *achados* — "vértice", "raiz", "nunca
 * toca o eixo" — com a letra à mão e uma seta curva até o ponto. Aqui o ponto é
 * calculado a partir dos parâmetros, então a anotação anda junto: subir o
 * vértice move o rótulo do vértice, e quando a raiz deixa de existir o texto
 * passa a dizer isso em vez de apontar para um lugar vazio.
 */
export interface Annotation {
  /** Curto. O espaço entre a curva e a borda não perdoa. */
  text: string;
  /** Ponto da curva que a seta toca, em coordenadas do plano. */
  x: number;
  y: number;
  /** Deslocamento do rótulo em relação ao ponto, nas mesmas unidades. */
  dx: number;
  dy: number;
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
  /** Rótulos manuscritos, recalculados a cada mexida nos controles. */
  annotations(a: number, b: number): Annotation[];
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

/**
 * Primeira raiz real dentro do intervalo, por varredura e bisseção.
 *
 * A cúbica não tem forma fechada que compense; e a anotação precisa apontar para
 * onde a curva cruza de fato, senão a seta aterrissa no vazio quando os
 * coeficientes mudam.
 */
export function primeiraRaiz(
  f: (x: number) => number | null,
  min: number,
  max: number,
  passos = 200,
): number | null {
  let anterior = f(min);
  for (let i = 1; i <= passos; i += 1) {
    const x = min + ((max - min) * i) / passos;
    const atual = f(x);
    if (anterior !== null && atual !== null && anterior !== 0 && anterior * atual < 0) {
      let lo = min + ((max - min) * (i - 1)) / passos;
      let hi = x;
      for (let k = 0; k < 40; k += 1) {
        const meio = (lo + hi) / 2;
        const v = f(meio);
        if (v === null) break;
        if ((f(lo) ?? 0) * v <= 0) hi = meio; else lo = meio;
      }
      return (lo + hi) / 2;
    }
    if (atual === 0) return x;
    anterior = atual;
  }
  return null;
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
    annotations: (a, b) => {
      const marcas: Annotation[] = [{ text: 'corta y aqui', x: 0, y: b, dx: 1.6, dy: 1.6 }];
      if (a === 0) marcas.push({ text: 'sem raiz: reta deitada', x: 3, y: b, dx: -0.6, dy: -2.2 });
      else {
        const raiz = -b / a;
        if (raiz > -5.4 && raiz < 5.4) marcas.push({ text: 'raiz', x: raiz, y: 0, dx: 0.5, dy: -2.1 });
      }
      return marcas;
    },
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
    annotations: (a, c) => {
      const marcas: Annotation[] = [{ text: 'vértice', x: 0, y: c, dx: -2.4, dy: -1.9 }];
      if (a !== 0 && -c / a > 0) {
        const raiz = Math.sqrt(-c / a);
        // Para a direita e para baixo do ponto: acima da raiz sobe o braço da
        // parábola, e o rótulo encostava nele.
        if (raiz < 4.6) marcas.push({ text: 'raiz', x: raiz, y: 0, dx: 1.4, dy: 1.7 });
      } else if (a !== 0) {
        // Ancorar no vértice e jogar o rótulo para o lado vazio: quando a
        // parábola não cruza o eixo, ela está inteira de um lado dele, e o outro
        // lado é o único pedaço do quadro garantidamente livre. A primeira
        // versão punha o rótulo em x = 2,2 e ele caía em cima do braço da curva.
        marcas.push({ text: 'não cruza o eixo', x: 0, y: c, dx: 2.7, dy: a > 0 ? -4.6 : 4.6 });
      }
      return marcas;
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
    annotations: (a, b) => {
      const marcas: Annotation[] = [{ text: 'f(0) = a', x: 0, y: a, dx: -1.5, dy: 1.9 }];
      if (b > 1) marcas.push({ text: 'nunca toca o eixo', x: -3, y: a * Math.pow(b, -3), dx: 0.35, dy: 1.7 });
      else if (b < 1) marcas.push({ text: 'decresce, mas não zera', x: 3, y: a * Math.pow(b, 3), dx: -1.1, dy: 1.7 });
      return marcas;
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
    annotations: (a, b) => [
      { text: 'f(1) = 0', x: 1, y: 0, dx: 1.1, dy: -1.7 },
      { text: 'assíntota', x: 0.14, y: (a * Math.log(0.14)) / Math.log(b), dx: 1.8, dy: 0.9 },
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
    annotations: (a, b) => {
      const pico = Math.PI / (2 * b);
      const marcas: Annotation[] = [];
      if (pico < 5.8) marcas.push({ text: 'amplitude', x: pico, y: a, dx: 0.8, dy: 0.7 });
      // 2π ≈ 6,28 e o domínio vai a 6,5: o limite antigo, 5,8, cortava justo o
      // período do valor padrão, que é a anotação mais útil da família.
      const periodo = (2 * Math.PI) / b;
      if (periodo <= 6.4) marcas.push({ text: 'um período', x: periodo, y: 0, dx: -0.9, dy: -1.4 });
      return marcas;
    },
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
    annotations: (a, b) => {
      if (a === 0) return [{ text: 'sem V: valor fixo', x: 2, y: Math.abs(b), dx: 0.4, dy: 1.6 }];
      const vertice = -b / a;
      const marcas: Annotation[] = [];
      if (vertice > -5.2 && vertice < 5.2) marcas.push({ text: 'vértice do V', x: vertice, y: 0, dx: 0.6, dy: 2.1 });
      marcas.push({ text: 'nunca desce de zero', x: -4.4, y: Math.abs(a * -4.4 + b), dx: 0.5, dy: 1.5 });
      return marcas;
    },
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
    annotations: (a, b) => {
      const raiz = primeiraRaiz((x) => x * x * x + a * x + b, -3.2, 3.2);
      const marcas: Annotation[] = [];
      if (raiz !== null) marcas.push({ text: 'raiz real', x: raiz, y: 0, dx: 0.35, dy: 3.4 });
      marcas.push({ text: 'sobe sem parar', x: 2.7, y: 2.7 ** 3 + a * 2.7 + b, dx: -1.5, dy: -2.6 });
      return marcas;
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
