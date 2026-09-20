import {
  bloco, cilindro, cone, cortePiramide, esfera, formatar, piramide, prisma, semelhanca,
} from './solids';

/**
 * Os cinco instrumentos de sólidos e o que cada um deixa a estudante mexer e
 * ler. Módulo puro (sem React): a tela desenha, aqui ficam as medidas e os
 * textos, para que dê para conferi-los em node:test contra os exemplos
 * resolvidos dos próprios capítulos.
 *
 * Cada instrumento existe porque o objeto do capítulo é aquele sólido. O
 * capítulo "O Universo Tridimensional" trata de retas e planos no espaço, não
 * de sólidos, e por isso não entra aqui.
 */
export type SolidConfigId = 'bloco' | 'prisma' | 'piramide' | 'revolucao' | 'semelhanca';

export interface ControleSolido { id: string; rotulo: string; descricao: string; min: number; max: number; passo: number; inicial: number }
export interface LeituraSolido { label: string; value: string; pivot?: boolean }
export interface FormaSolido { id: string; label: string }

export interface SolidConfig {
  id: SolidConfigId;
  name: string;
  question: string;
  insight: string;
  controles: ControleSolido[];
  /** Só `revolucao` escolhe entre formas. */
  formas?: FormaSolido[];
  /** Quais controles valem para a forma escolhida; sem isto, todos. */
  controlesVisiveis?: (forma: string) => string[];
  leituras: (valores: Record<string, number>, forma?: string) => LeituraSolido[];
  formula: (valores: Record<string, number>, forma?: string) => string;
}

const f = formatar;

const bloco3d: SolidConfig = {
  id: 'bloco',
  name: 'Bloco retangular',
  question: 'Por onde passa a diagonal do bloco, e por que ela usa as três dimensões?',
  insight: 'A diagonal da face usa duas dimensões e fica sobre a superfície; a diagonal principal atravessa o interior e usa as três: D² = a² + b² + c².',
  controles: [
    { id: 'a', rotulo: 'a', descricao: 'comprimento', min: 1, max: 12, passo: 0.5, inicial: 3 },
    { id: 'b', rotulo: 'b', descricao: 'largura', min: 1, max: 12, passo: 0.5, inicial: 4 },
    { id: 'c', rotulo: 'c', descricao: 'altura', min: 1, max: 12, passo: 0.5, inicial: 12 },
  ],
  leituras: ({ a, b, c }) => {
    const m = bloco(a, b, c);
    return [
      { label: 'Volume', value: f(m.volume) },
      { label: 'Área total', value: f(m.areaTotal) },
      { label: 'Diagonal da face a × b', value: f(m.diagonalFace) },
      { label: 'Diagonal principal', value: f(m.diagonalPrincipal), pivot: true },
    ];
  },
  formula: ({ a, b, c }) => `D = √(${f(a)}² + ${f(b)}² + ${f(c)}²) = ${f(bloco(a, b, c).diagonalPrincipal)}`,
};

const prismaConfig: SolidConfig = {
  id: 'prisma',
  name: 'Prisma reto e oblíquo',
  question: 'Inclinar o prisma muda o volume?',
  insight: 'O volume é a área da base vezes a altura perpendicular. Inclinar o prisma alonga a aresta lateral, mas a altura, e por isso o volume, não mudam.',
  controles: [
    { id: 'n', rotulo: 'n', descricao: 'lados da base', min: 3, max: 8, passo: 1, inicial: 6 },
    { id: 'l', rotulo: 'ℓ', descricao: 'lado da base', min: 1, max: 3, passo: 0.5, inicial: 2 },
    { id: 'h', rotulo: 'h', descricao: 'altura', min: 1, max: 8, passo: 0.5, inicial: 5 },
    { id: 's', rotulo: 's', descricao: 'inclinação lateral', min: 0, max: 3, passo: 0.5, inicial: 0 },
  ],
  leituras: ({ n, l, h, s }) => {
    const p = prisma(n, l, h);
    const arestaLateral = Math.hypot(h, s);
    return [
      { label: 'Área da base', value: f(p.areaBase) },
      { label: 'Volume', value: f(p.volume), pivot: true },
      { label: 'Altura h', value: f(h) },
      { label: 'Aresta lateral', value: f(arestaLateral) },
      // A área lateral do prisma oblíquo é uma soma de paralelogramos e pede
      // outra conta; mostrar a do prisma reto ali seria dar um número errado.
      ...(s === 0 ? [
        { label: 'Área lateral', value: f(p.areaLateral) },
        { label: 'Área total', value: f(p.areaTotal) },
      ] : []),
    ];
  },
  formula: ({ n, l, h }) => `V = A_base · h = ${f(prisma(n, l, h).areaBase)} · ${f(h)} = ${f(prisma(n, l, h).volume)}`,
};

const piramideConfig: SolidConfig = {
  id: 'piramide',
  name: 'Pirâmide regular e seu corte',
  question: 'Por que o volume da pirâmide é um terço do prisma de mesma base e altura?',
  insight: 'Com a mesma base e a mesma altura, a pirâmide ocupa exatamente um terço do prisma. Um corte paralelo à base separa uma pirâmide menor, semelhante à inteira, que vale t³ do volume; o tronco é o resto.',
  controles: [
    { id: 'n', rotulo: 'n', descricao: 'lados da base', min: 3, max: 6, passo: 1, inicial: 4 },
    { id: 'l', rotulo: 'ℓ', descricao: 'lado da base', min: 1, max: 8, passo: 0.5, inicial: 6 },
    { id: 'h', rotulo: 'h', descricao: 'altura', min: 1, max: 8, passo: 0.5, inicial: 4 },
    { id: 't', rotulo: 't', descricao: 'posição do corte (1 = sem corte)', min: 0.1, max: 1, passo: 0.05, inicial: 1 },
  ],
  leituras: ({ n, l, h, t }) => {
    const p = piramide(n, l, h);
    const corte = t < 1 ? cortePiramide(p.volume, t) : null;
    return [
      { label: 'Área da base', value: f(p.areaBase) },
      { label: 'Apótema da pirâmide', value: f(p.apotema) },
      { label: 'Área lateral', value: f(p.areaLateral) },
      { label: 'Volume', value: f(p.volume), pivot: true },
      { label: 'Prisma de mesma base e altura', value: f(prisma(n, l, h).volume) },
      ...(corte ? [
        { label: 'Pirâmide menor', value: f(corte.menor) },
        { label: 'Tronco', value: f(corte.tronco) },
      ] : []),
    ];
  },
  formula: ({ n, l, h }) => `V = ⅓ · A_base · h = ⅓ · ${f(piramide(n, l, h).areaBase)} · ${f(h)} = ${f(piramide(n, l, h).volume)}`,
};

const REVOLUCAO_FORMAS: FormaSolido[] = [
  { id: 'cilindro', label: 'Cilindro' },
  { id: 'cone', label: 'Cone' },
  { id: 'esfera', label: 'Esfera' },
];

const revolucaoConfig: SolidConfig = {
  id: 'revolucao',
  name: 'Sólidos de revolução',
  question: 'Que sólido nasce ao girar a figura plana, e quanto ele ocupa?',
  insight: 'O cone ocupa um terço do cilindro de mesma base e altura. A esfera de raio r tem V = ⁴⁄₃ π r³ e área 4π r². O raio pesa mais que a altura: entra ao quadrado, ou ao cubo.',
  controles: [
    { id: 'r', rotulo: 'r', descricao: 'raio', min: 1, max: 6, passo: 0.5, inicial: 3 },
    { id: 'h', rotulo: 'h', descricao: 'altura', min: 1, max: 12, passo: 0.5, inicial: 4 },
  ],
  formas: REVOLUCAO_FORMAS,
  controlesVisiveis: (forma) => (forma === 'esfera' ? ['r'] : ['r', 'h']),
  leituras: ({ r, h }, forma = 'cilindro') => {
    if (forma === 'esfera') {
      const e = esfera(r);
      return [
        { label: 'Volume', value: f(e.volume), pivot: true },
        { label: 'Área da superfície', value: f(e.areaTotal) },
      ];
    }
    if (forma === 'cone') {
      const c = cone(r, h);
      return [
        { label: 'Geratriz', value: f(c.geratriz) },
        { label: 'Volume', value: f(c.volume), pivot: true },
        { label: 'Área lateral', value: f(c.areaLateral) },
        { label: 'Área total', value: f(c.areaTotal) },
        { label: 'Fração do cilindro de mesma base e altura', value: '1/3' },
      ];
    }
    const c = cilindro(r, h);
    return [
      { label: 'Volume', value: f(c.volume), pivot: true },
      { label: 'Área lateral', value: f(c.areaLateral) },
      { label: 'Área total', value: f(c.areaTotal) },
    ];
  },
  formula: ({ r, h }, forma = 'cilindro') => {
    if (forma === 'esfera') return `V = ⁴⁄₃ · π · ${f(r)}³ = ${f(esfera(r).volume)}`;
    if (forma === 'cone') return `V = ⅓ · π · ${f(r)}² · ${f(h)} = ${f(cone(r, h).volume)}`;
    return `V = π · ${f(r)}² · ${f(h)} = ${f(cilindro(r, h).volume)}`;
  },
};

const semelhancaConfig: SolidConfig = {
  id: 'semelhanca',
  name: 'Razão entre volumes de sólidos semelhantes',
  question: 'Se a aresta dobra, o volume dobra?',
  insight: 'A razão entre os volumes é o cubo da razão linear, e a razão entre as áreas é o quadrado: dobrar a aresta multiplica a área por 4 e o volume por 8.',
  controles: [
    { id: 'a', rotulo: 'a', descricao: 'aresta do cubo menor', min: 1, max: 6, passo: 0.5, inicial: 2 },
    { id: 'k', rotulo: 'k', descricao: 'razão de semelhança', min: 1, max: 3, passo: 0.5, inicial: 1.5 },
  ],
  leituras: ({ a, k }) => {
    const s = semelhanca(k);
    const menor = bloco(a, a, a).volume;
    return [
      { label: 'Razão linear k', value: f(s.comprimento) },
      { label: 'Razão de áreas k²', value: f(s.area) },
      { label: 'Razão de volumes k³', value: f(s.volume), pivot: true },
      { label: 'Volume do cubo menor', value: f(menor) },
      { label: 'Volume do cubo maior', value: f(menor * s.volume) },
    ];
  },
  formula: ({ k }) => `V₂ / V₁ = k³ = ${f(k)}³ = ${f(semelhanca(k).volume)}`,
};

export const SOLID_CONFIGS: Record<SolidConfigId, SolidConfig> = {
  bloco: bloco3d,
  prisma: prismaConfig,
  piramide: piramideConfig,
  revolucao: revolucaoConfig,
  semelhanca: semelhancaConfig,
};

export function estadoInicial(config: SolidConfig): { valores: Record<string, number>; forma?: string } {
  return { valores: Object.fromEntries(config.controles.map((c) => [c.id, c.inicial])), forma: config.formas?.[0]?.id };
}
