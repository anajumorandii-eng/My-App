export type PlanarConfigId =
  | 'fundamentos'
  | 'angulos-triangulo'
  | 'angulos-poligono'
  | 'angulos-circunferencia'
  | 'congruencia'
  | 'simetria-i'
  | 'simetria-ii'
  | 'tales'
  | 'semelhanca';

export interface PlanarReadout { label: string; value: string; pivot?: boolean }

export interface PlanarConfig {
  id: PlanarConfigId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): PlanarReadout[];
}

const n = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');

export const PLANAR_CONFIGS: Record<PlanarConfigId, PlanarConfig> = {
  fundamentos: {
    id: 'fundamentos', name: 'Relações que nascem de uma transversal',
    question: 'Se as retas são paralelas, um ângulo determina os outros sete.',
    control: { label: 'α', description: 'ângulo dado', min: 25, max: 155, step: 5, initial: 65 },
    formula: 'alternos = α; colaterais = 180° − α',
    insight: 'o desenho não é uma tabela para decorar: igualdade vem do paralelismo e suplementaridade vem da reta.',
    readouts: (a) => [
      { label: 'Alterno interno', value: `${n(a)}°`, pivot: true },
      { label: 'Colateral interno', value: `${n(180 - a)}°` },
      { label: 'Soma linear', value: '180°' },
    ],
  },
  'angulos-triangulo': {
    id: 'angulos-triangulo', name: 'O terceiro ângulo não é livre',
    question: 'Mova um vértice: os três internos continuam fechando 180°.',
    control: { label: 'A', description: 'primeiro ângulo interno', min: 25, max: 115, step: 5, initial: 50 },
    formula: 'A + B + C = 180°',
    insight: 'o ângulo externo é a soma dos dois internos não adjacentes — a mesma conta vista por fora.',
    readouts: (a) => {
      const b = 40; const c = 180 - a - b;
      return [
        { label: 'Ângulo C', value: `${n(c)}°`, pivot: true },
        { label: 'Ângulo externo', value: `${n(a + b)}°` },
        { label: 'Soma interna', value: '180°' },
      ];
    },
  },
  'angulos-poligono': {
    id: 'angulos-poligono', name: 'Um polígono vira triângulos',
    question: 'Aumente os lados e veja de onde vem o fator n − 2.',
    control: { label: 'n', description: 'número de lados', min: 3, max: 10, step: 1, initial: 6 },
    formula: 'S = (n − 2) · 180°',
    insight: 'as diagonais partindo de um vértice produzem n − 2 triângulos; é isso que a fórmula conta.',
    readouts: (value) => {
      const sides = Math.round(value);
      return [
        { label: 'Triângulos', value: String(sides - 2) },
        { label: 'Soma interna', value: `${(sides - 2) * 180}°`, pivot: true },
        { label: 'Cada externo regular', value: `${n(360 / sides)}°` },
      ];
    },
  },
  'angulos-circunferencia': {
    id: 'angulos-circunferencia', name: 'O vértice decide a regra do arco',
    question: 'O mesmo arco produz ângulo central inteiro e inscrito pela metade.',
    control: { label: 'arco', description: 'medida do arco destacado', min: 40, max: 240, step: 10, initial: 100 },
    formula: 'central = arco; inscrito = arco/2',
    insight: 'antes de calcular, localize o vértice: no centro vale o arco; sobre a circunferência vale metade.',
    readouts: (arc) => [
      { label: 'Ângulo central', value: `${n(arc)}°`, pivot: true },
      { label: 'Ângulo inscrito', value: `${n(arc / 2)}°` },
      { label: 'Razão', value: '2 : 1' },
    ],
  },
  congruencia: {
    id: 'congruencia', name: 'Mover sem deformar',
    question: 'Uma isometria muda posição ou orientação, nunca medidas.',
    control: { label: 'giro', description: 'rotação da cópia', min: 0, max: 180, step: 15, initial: 45 },
    formula: 'distâncias antes = distâncias depois',
    insight: 'congruência é sobreposição por movimento rígido; semelhança permite escala, congruência não.',
    readouts: (angle) => [
      { label: 'Rotação', value: `${n(angle)}°`, pivot: true },
      { label: 'Escala', value: '1 : 1' },
      { label: 'Área preservada', value: 'sim' },
    ],
  },
  'simetria-i': {
    id: 'simetria-i', name: 'Uma figura só é simétrica se coincidir',
    question: 'Gire o hexágono e encontre os ângulos que o levam a si mesmo.',
    control: { label: 'giro', description: 'rotação de teste', min: 0, max: 360, step: 30, initial: 60 },
    formula: 'ordem 6 → passo de 60°',
    insight: 'aparência equilibrada não basta: a transformação precisa levar cada ponto a outro ponto da própria figura.',
    readouts: (angle) => [
      { label: 'Rotação', value: `${n(angle)}°` },
      { label: 'Coincide', value: Math.round(angle) % 60 === 0 ? 'sim' : 'não', pivot: true },
      { label: 'Ordem', value: '6' },
    ],
  },
  'simetria-ii': {
    id: 'simetria-ii', name: 'Duas reflexões compõem outro movimento',
    question: 'Refletir nos dois eixos equivale a girar 180° em torno da origem.',
    control: { label: 'x', description: 'abscissa do ponto P', min: -5, max: 5, step: 1, initial: 3 },
    formula: '(x, y) → (x, −y) → (−x, −y)',
    insight: 'duas reflexões em eixos que se cruzam não produzem outra reflexão: produzem uma rotação.',
    readouts: (x) => [
      { label: 'P', value: `(${n(x)}, −3)` },
      { label: 'Após eixo x', value: `(${n(x)}, 3)` },
      { label: 'Após eixo y', value: `(${n(-x)}, 3)`, pivot: true },
    ],
  },
  tales: {
    id: 'tales', name: 'Paralelas preservam proporções',
    question: 'Mude a escala: os segmentos nas duas transversais crescem na mesma razão.',
    control: { label: 'k', description: 'razão entre os segmentos', min: 0.5, max: 2.5, step: 0.25, initial: 1.5 },
    formula: 'AB/BC = A′B′/B′C′',
    insight: 'Tales é a ponte entre paralelismo e semelhança: a mesma razão aparece nas duas transversais.',
    readouts: (k) => [
      { label: 'AB / BC', value: n(k), pivot: true },
      { label: 'A′B′ / B′C′', value: n(k) },
      { label: 'Paralelas', value: '3' },
    ],
  },
  semelhanca: {
    id: 'semelhanca', name: 'Mesma forma, outra escala',
    question: 'A razão linear k multiplica todos os lados correspondentes.',
    control: { label: 'k', description: 'razão de semelhança', min: 0.5, max: 2.5, step: 0.25, initial: 1.5 },
    formula: 'lado₂ = k · lado₁; área₂ = k² · área₁',
    insight: 'AA, LAL ou LLL bastam separadamente para provar semelhança; nenhum deles exige tamanho igual.',
    readouts: (k) => [
      { label: 'Razão linear', value: n(k), pivot: true },
      { label: 'Razão de áreas', value: n(k * k) },
      { label: 'Ângulos', value: 'iguais' },
    ],
  },
};
