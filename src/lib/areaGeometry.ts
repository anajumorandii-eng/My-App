export type AreaConfigId =
  | 'triangulo-retangulo'
  | 'geometria-metrica'
  | 'areas-poligonos'
  | 'area-circulo'
  | 'razoes-areas'
  | 'areas-compostas';

export interface AreaReadout {
  label: string;
  value: string;
  pivot?: boolean;
}

export interface AreaConfig {
  id: AreaConfigId;
  mode: 'right-triangle' | 'sector' | 'regular-polygon' | 'circle-parts' | 'scale' | 'composite';
  name: string;
  question: string;
  control: {
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    initial: number;
  };
  formula: string;
  insight: string;
  readouts(value: number): AreaReadout[];
}

const format = (value: number) =>
  String(Math.round((value + Number.EPSILON) * 100) / 100).replace('.', ',');

const degreesToRadians = (degrees: number) => degrees * Math.PI / 180;

export const AREA_CONFIGS: Record<AreaConfigId, AreaConfig> = {
  'triangulo-retangulo': {
    id: 'triangulo-retangulo',
    mode: 'right-triangle',
    name: 'A altura revela três triângulos semelhantes',
    question: 'Mude a projeção m e acompanhe todas as relações métricas ao mesmo tempo.',
    control: { label: 'm', description: 'primeira projeção na hipotenusa de 25 cm', min: 4, max: 21, step: 1, initial: 9 },
    formula: 'a = m + n; h² = mn; b² = an; c² = am',
    insight: 'cada cateto se liga à sua própria projeção; a altura não divide a hipotenusa necessariamente ao meio.',
    readouts: (m) => {
      const hypotenuse = 25;
      const n = hypotenuse - m;
      return [
        { label: 'Altura h', value: `${format(Math.sqrt(m * n))} cm`, pivot: true },
        { label: 'Hipotenusa a', value: `${format(hypotenuse)} cm` },
        { label: 'Catetos b · c', value: `${format(Math.sqrt(hypotenuse * n))} · ${format(Math.sqrt(hypotenuse * m))} cm` },
      ];
    },
  },
  'geometria-metrica': {
    id: 'geometria-metrica',
    mode: 'sector',
    name: 'O ângulo recorta arco, área e perímetro',
    question: 'Converta o ângulo para radianos antes de medir um setor de raio 6 cm.',
    control: { label: 'θ', description: 'ângulo central em graus', min: 30, max: 330, step: 15, initial: 60 },
    formula: 'θrad = θ°·π/180; L = Rθ; A = R²θ/2',
    insight: 'comprimento cresce com R; área cresce com R². O perímetro do setor ainda inclui os dois raios.',
    readouts: (degrees) => {
      const radius = 6;
      const radians = degreesToRadians(degrees);
      const arc = radius * radians;
      return [
        { label: 'Ângulo em radianos', value: `${format(radians)} rad` },
        { label: 'Comprimento do arco', value: `${format(arc)} cm`, pivot: true },
        { label: 'Área do setor', value: `${format(radius * radius * radians / 2)} cm²` },
        { label: 'Perímetro do setor', value: `${format(2 * radius + arc)} cm` },
      ];
    },
  },
  'areas-poligonos': {
    id: 'areas-poligonos',
    mode: 'regular-polygon',
    name: 'Um polígono regular se desmonta em triângulos',
    question: 'Aumente o número de lados mantendo cada lado com 4 cm.',
    control: { label: 'n', description: 'número de lados do polígono regular', min: 3, max: 10, step: 1, initial: 6 },
    formula: 'A = perímetro · apótema / 2',
    insight: 'ligar o centro aos vértices revela n triângulos congruentes; é essa decomposição que produz a fórmula.',
    readouts: (value) => {
      const sides = Math.round(value);
      const side = 4;
      const perimeter = sides * side;
      const apothem = side / (2 * Math.tan(Math.PI / sides));
      return [
        { label: 'Triângulos no centro', value: String(sides) },
        { label: 'Perímetro', value: `${format(perimeter)} cm` },
        { label: 'Apótema', value: `${format(apothem)} cm` },
        { label: 'Área', value: `${format(perimeter * apothem / 2)} cm²`, pivot: true },
      ];
    },
  },
  'area-circulo': {
    id: 'area-circulo',
    mode: 'circle-parts',
    name: 'A coroa é a diferença entre dois círculos',
    question: 'Mude o raio interno dentro de um círculo de raio externo 10 cm.',
    control: { label: 'r', description: 'raio interno da coroa circular', min: 2, max: 9, step: 0.5, initial: 6 },
    formula: 'Acoroa = π(R² − r²)',
    insight: 'subtraia as áreas depois de elevar cada raio ao quadrado; π(R − r)² não descreve a coroa.',
    readouts: (radius) => {
      const outerRadius = 10;
      const outerArea = Math.PI * outerRadius * outerRadius;
      const innerArea = Math.PI * radius * radius;
      return [
        { label: 'Área externa', value: `${format(outerArea)} cm²` },
        { label: 'Área retirada', value: `${format(innerArea)} cm²` },
        { label: 'Área da coroa', value: `${format(outerArea - innerArea)} cm²`, pivot: true },
      ];
    },
  },
  'razoes-areas': {
    id: 'razoes-areas',
    mode: 'scale',
    name: 'A escala linear aparece duas vezes na área',
    question: 'Aplique a razão linear k a uma figura cuja área inicial é 27 cm².',
    control: { label: 'k', description: 'razão de semelhança linear', min: 0.5, max: 3, step: 1 / 6, initial: 4 / 3 },
    formula: 'A₂/A₁ = k²; P₂/P₁ = k',
    insight: 'perímetro é linear, área é bidimensional: esquecer o quadrado de k é comparar grandezas diferentes.',
    readouts: (scale) => [
      { label: 'Razão linear', value: format(scale) },
      { label: 'Razão de perímetros', value: format(scale) },
      { label: 'Razão de áreas', value: format(scale * scale), pivot: true },
      { label: 'Nova área', value: `${format(27 * scale * scale)} cm²` },
    ],
  },
  'areas-compostas': {
    id: 'areas-compostas',
    mode: 'composite',
    name: 'Área útil é a figura inteira menos a abertura',
    question: 'Aumente o raio da piscina dentro de um terreno de 20 m por 15 m.',
    control: { label: 'r', description: 'raio da região circular retirada', min: 1, max: 7, step: 0.5, initial: 3 },
    formula: 'Aútil = 20·15 − πr²',
    insight: 'primeiro identifique o todo e o que deve sair; só depois verifique se todas as medidas usam a mesma unidade.',
    readouts: (radius) => {
      const whole = 20 * 15;
      const removed = Math.PI * radius * radius;
      return [
        { label: 'Área do terreno', value: `${format(whole)} m²` },
        { label: 'Área da piscina', value: `${format(removed)} m²` },
        { label: 'Área não ocupada', value: `${format(whole - removed)} m²`, pivot: true },
      ];
    },
  },
};
