export type MechanicsFinalId = 'vertical-plane' | 'mhs' | 'potential-energy' | 'nonconservative' | 'mass-energy';

export interface MechanicsReadout { label: string; value: string; pivot?: boolean }
export interface MechanicsFinalConfig {
  id: MechanicsFinalId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): MechanicsReadout[];
}

const rounded = (value: number) => String(Math.round(value * 10) / 10).replace('.', ',');

export const MECHANICS_FINAL: Record<MechanicsFinalId, MechanicsFinalConfig> = {
  'vertical-plane': {
    id: 'vertical-plane', name: 'No topo, peso e normal disputam a curva',
    question: 'Mude a velocidade no topo de uma trajetória de raio 3 m para testar a condição de contato.',
    control: { label: 'v', description: 'velocidade no topo em m/s', min: 0, max: 10, step: 1, initial: 7 },
    formula: 'N + mg = mv²/R',
    insight: 'No topo, o centro fica para baixo: o peso ajuda a resultante radial; se N chegaria negativa, o contato já se perdeu.',
    readouts: v => {
      const normal = v * v / 3 - 10;
      return [{ label: 'Normal calculada', value: `${rounded(normal)} N`, pivot: true }, { label: 'Contato', value: normal >= 0 ? 'mantido' : 'perdido' }];
    },
  },
  mhs: {
    id: 'mhs', name: 'A mola puxa sempre de volta ao equilíbrio',
    question: 'Desloque uma massa numa mola de constante 4 N/m e compare força restauradora e energia elástica.',
    control: { label: 'x', description: 'deslocamento em metros', min: -5, max: 5, step: 1, initial: 3 },
    formula: 'F = −kx; U = kx²/2',
    insight: 'Força e deslocamento têm sinais opostos; nos extremos a energia é toda potencial e no equilíbrio a força zera.',
    readouts: x => [{ label: 'Força restauradora', value: `${-4 * x} N`, pivot: true }, { label: 'Energia elástica', value: `${2 * x * x} J` }],
  },
  'potential-energy': {
    id: 'potential-energy', name: 'Altura armazena energia gravitacional',
    question: 'Eleve uma massa de 2 kg e acompanhe a energia potencial em relação ao solo escolhido.',
    control: { label: 'h', description: 'altura em metros', min: 0, max: 10, step: 1, initial: 4 },
    formula: 'ΔU = mgΔh = −Wpeso',
    insight: 'O peso realiza trabalho negativo na subida exatamente na medida em que a energia potencial aumenta.',
    readouts: h => [{ label: 'Energia potencial', value: `${20 * h} J`, pivot: true }, { label: 'Trabalho do peso', value: `${-20 * h} J` }],
  },
  nonconservative: {
    id: 'nonconservative', name: 'Atrito retira energia mecânica do bloco',
    question: 'Mude o atrito em um percurso de 4 m e acompanhe a transformação em energia interna.',
    control: { label: 'fat', description: 'força de atrito em N', min: 0, max: 10, step: 1, initial: 3 },
    formula: 'ΔEmec = Watrito',
    insight: 'O atrito não destrói energia: reduz K + U do bloco e aumenta a energia interna de bloco e superfície.',
    readouts: friction => [{ label: 'Variação de Emec', value: `${-4 * friction} J`, pivot: true }, { label: 'Energia interna gerada', value: `${4 * friction} J` }],
  },
  'mass-energy': {
    id: 'mass-energy', name: 'Um pequeno defeito de massa libera muita energia',
    question: 'Mude o defeito de massa em miligramas e use c² para estimar a energia associada.',
    control: { label: 'Δm', description: 'defeito de massa em mg', min: 0, max: 10, step: 1, initial: 3 },
    formula: 'E = Δmc²',
    insight: 'A equivalência não cria energia do nada: a massa total final menor corresponde à energia liberada na reação nuclear.',
    readouts: massMg => [{ label: 'Energia equivalente', value: `${rounded(9 * massMg)} × 10¹⁰ J`, pivot: true }, { label: 'Defeito em kg', value: `${massMg} × 10⁻⁶ kg` }],
  },
};
