export type BiologyInstrumentId =
  | 'nucleic-acids'
  | 'linkage'
  | 'circulation'
  | 'respiration'
  | 'plant-hormones';

export interface BiologyReadout {
  label: string;
  value: string;
  pivot?: boolean;
}

export interface BiologyInstrumentConfig {
  id: BiologyInstrumentId;
  name: string;
  question: string;
  control: {
    label: string;
    description: string;
    min: number;
    max: number;
    step: number;
    initial: number;
    display: (value: number) => string;
  };
  relation: string;
  insight: string;
  readouts: (value: number) => BiologyReadout[];
}

const decimal = (value: number) => String(Math.round(value * 10) / 10).replace('.', ',');
const bases = ['A', 'T', 'C', 'G'] as const;
const dnaComplement = { A: 'T', T: 'A', C: 'G', G: 'C' } as const;
const rnaComplement = { A: 'U', T: 'A', C: 'G', G: 'C' } as const;

export function basePair(index: number) {
  const template = bases[Math.max(0, Math.min(3, Math.round(index)))];
  return {
    template,
    dna: dnaComplement[template],
    rna: rnaComplement[template],
    hydrogenBonds: template === 'A' || template === 'T' ? 2 : 3,
  };
}

export function recombination(frequency: number) {
  const recombinant = Math.max(0, Math.min(50, frequency));
  return { recombinant, parental: 100 - recombinant, distanceCm: recombinant };
}

export function bloodVelocity(totalArea: number) {
  return 8 / Math.max(1, totalArea);
}

export function oxygenGradient(alveolarPressure: number) {
  return Math.max(0, alveolarPressure - 40);
}

export function shootCurvature(shadedSideAuxin: number) {
  return Math.max(0, shadedSideAuxin - 50);
}

export const BIOLOGY_INSTRUMENTS: Record<BiologyInstrumentId, BiologyInstrumentConfig> = {
  'nucleic-acids': {
    id: 'nucleic-acids',
    name: 'Pareamento de bases',
    question: 'Como uma base da fita molde determina DNA complementar e RNA?',
    control: { label: 'Base na fita molde', description: 'A, T, C ou G', min: 0, max: 3, step: 1, initial: 0, display: (v) => bases[Math.round(v)] },
    relation: 'DNA: A–T e C–G · RNA usa U no lugar de T',
    insight: 'Complementaridade conserva a informação; transcrição e replicação produzem moléculas diferentes a partir da mesma fita molde.',
    readouts: (v) => {
      const pair = basePair(v);
      return [
        { label: 'Molde', value: pair.template },
        { label: 'DNA complementar', value: pair.dna, pivot: true },
        { label: 'RNA transcrito', value: pair.rna },
        { label: 'Pontes de H', value: String(pair.hydrogenBonds) },
      ];
    },
  },
  linkage: {
    id: 'linkage',
    name: 'Mapa de ligação gênica',
    question: 'O que a frequência de recombinantes revela sobre a distância entre genes?',
    control: { label: 'Descendentes recombinantes', description: 'teto observável: 50%', min: 0, max: 50, step: 1, initial: 10, display: (v) => `${v}%` },
    relation: 'distância no mapa = recombinantes ÷ total × 100',
    insight: 'Genes próximos viajam juntos com maior frequência; 50% é o teto e se torna indistinguível da segregação independente.',
    readouts: (v) => {
      const result = recombination(v);
      return [
        { label: 'Recombinantes', value: `${result.recombinant}%` },
        { label: 'Parentais', value: `${result.parental}%` },
        { label: 'Distância', value: `${result.distanceCm} cM`, pivot: true },
      ];
    },
  },
  circulation: {
    id: 'circulation',
    name: 'Área vascular e velocidade',
    question: 'Por que o sangue desacelera justamente nos capilares?',
    control: { label: 'Área transversal total', description: 'vasos em paralelo, escala relativa', min: 1, max: 8, step: 1, initial: 8, display: (v) => `${v}×` },
    relation: 'velocidade ∝ 1 ÷ área transversal total',
    insight: 'A soma da área de bilhões de capilares reduz a velocidade e dá tempo para as trocas com os tecidos.',
    readouts: (v) => [
      { label: 'Área total', value: `${v}×` },
      { label: 'Velocidade relativa', value: `${decimal(bloodVelocity(v))}×`, pivot: true },
      { label: 'Local das trocas', value: 'capilares' },
    ],
  },
  respiration: {
    id: 'respiration',
    name: 'Gradiente alvéolo-capilar',
    question: 'Quando o O₂ difunde do alvéolo para o sangue?',
    control: { label: 'PO₂ alveolar', description: 'pressão parcial em mmHg', min: 40, max: 105, step: 5, initial: 100, display: (v) => `${v} mmHg` },
    relation: 'fluxo de O₂ segue o gradiente: PO₂ alvéolo − PO₂ sangue',
    insight: 'A hematose é difusão a favor do gradiente de pressão parcial; altitude menor reduz esse gradiente.',
    readouts: (v) => [
      { label: 'PO₂ alveolar', value: `${v} mmHg` },
      { label: 'PO₂ venosa', value: '40 mmHg' },
      { label: 'Gradiente de O₂', value: `${oxygenGradient(v)} mmHg`, pivot: true },
    ],
  },
  'plant-hormones': {
    id: 'plant-hormones',
    name: 'Auxina e fototropismo',
    question: 'Como a distribuição desigual de auxina curva o caule em direção à luz?',
    control: { label: 'Auxina no lado sombreado', description: 'fração relativa entre os dois lados', min: 50, max: 90, step: 5, initial: 70, display: (v) => `${v}%` },
    relation: 'mais auxina no lado sombreado → mais alongamento desse lado',
    insight: 'O caule não é atraído pela luz: a assimetria de crescimento do lado sombreado produz a curvatura.',
    readouts: (v) => [
      { label: 'Lado sombreado', value: `${v}% auxina` },
      { label: 'Lado iluminado', value: `${100 - v}% auxina` },
      { label: 'Assimetria', value: `${shootCurvature(v)} p.p.`, pivot: true },
    ],
  },
};
