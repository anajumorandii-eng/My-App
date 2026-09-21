export type ElectrochemistryId = 'redox' | 'cells' | 'spontaneous' | 'electrolysis' | 'quantitative';

export interface ElectrochemistryReadout {
  label: string;
  value: string;
  pivot?: boolean;
}

export interface ElectrochemistryConfig {
  id: ElectrochemistryId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): ElectrochemistryReadout[];
}

const decimal = (n: number, places = 2) => n.toFixed(places).replace('.', ',');

export const ELECTROCHEMISTRY: Record<ElectrochemistryId, ElectrochemistryConfig> = {
  redox: {
    id: 'redox',
    name: 'Elétrons ligam oxidação e redução',
    question: 'Acompanhe quantos elétrons o zinco cede e os íons cobre recebem.',
    control: { label: 'n(e⁻)', description: 'mols de elétrons transferidos', min: 1, max: 6, step: 1, initial: 2 },
    formula: 'Zn → Zn²⁺ + 2e⁻ | Cu²⁺ + 2e⁻ → Cu',
    insight: 'oxidação e redução são simultâneas: os elétrons perdidos pelo redutor são exatamente os ganhos pelo oxidante.',
    readouts: n => [
      { label: 'Oxidação', value: `${n} mol e⁻ cedidos` },
      { label: 'Redução', value: `${n} mol e⁻ recebidos`, pivot: true },
    ],
  },
  cells: {
    id: 'cells',
    name: 'A pilha separa as semirreações',
    question: 'Mude a resistência externa e observe a corrente no circuito metálico.',
    control: { label: 'R', description: 'resistência externa em ohms', min: 1, max: 10, step: 1, initial: 5 },
    formula: 'Zn | Zn²⁺ || Cu²⁺ | Cu',
    insight: 'a ponte salina fecha o circuito por migração de íons, enquanto os elétrons percorrem o fio do ânodo ao cátodo.',
    readouts: resistance => [
      { label: 'Tensão ideal', value: '1,10 V' },
      { label: 'Corrente', value: `${decimal(1.1 / resistance, 2)} A`, pivot: true },
    ],
  },
  spontaneous: {
    id: 'spontaneous',
    name: 'O sinal da ddp revela a espontaneidade',
    question: 'Varie o potencial de redução do cátodo mantendo E°ânodo = −0,76 V.',
    control: { label: 'E°cátodo', description: 'potencial de redução em volts', min: -1, max: 1, step: 0.1, initial: 0.34 },
    formula: 'ΔE° = E°cátodo − E°ânodo',
    insight: 'uma reação escrita é espontânea em condições padrão quando a diferença de potencial da célula é positiva.',
    readouts: cathode => {
      const voltage = cathode - (-0.76);
      return [
        { label: 'ΔE°', value: `${decimal(voltage, 2)} V`, pivot: true },
        { label: 'Processo', value: voltage > 0 ? 'espontâneo' : voltage < 0 ? 'não espontâneo' : 'equilíbrio' },
      ];
    },
  },
  electrolysis: {
    id: 'electrolysis',
    name: 'A fonte força a reação inversa',
    question: 'Aumente a tensão aplicada a uma cuba cuja decomposição exige 2,0 V.',
    control: { label: 'U', description: 'tensão da fonte em volts', min: 0, max: 5, step: 0.5, initial: 3 },
    formula: 'Ufonte > Udecomposição',
    insight: 'na eletrólise, energia elétrica é consumida para sustentar uma transformação que não ocorreria espontaneamente.',
    readouts: voltage => [
      { label: 'Excesso de tensão', value: `${decimal(Math.max(0, voltage - 2), 1)} V`, pivot: true },
      { label: 'Eletrólise', value: voltage > 2 ? 'em curso' : 'não sustentada' },
    ],
  },
  quantitative: {
    id: 'quantitative',
    name: 'Carga elétrica determina massa depositada',
    question: 'Mude o tempo de eletrólise de Cu²⁺ com corrente constante de 2 A.',
    control: { label: 't', description: 'tempo de corrente em minutos', min: 5, max: 60, step: 5, initial: 30 },
    formula: 'm = M·I·t/(nF)',
    insight: 'a lei de Faraday conecta elétrons contados no circuito à quantidade de metal obtida no eletrodo.',
    readouts: minutes => {
      const charge = 2 * minutes * 60;
      const mass = 63.546 * charge / (2 * 96485);
      return [
        { label: 'Carga Q', value: `${charge} C` },
        { label: 'Cobre depositado', value: `${decimal(mass, 2)} g`, pivot: true },
      ];
    },
  },
};
