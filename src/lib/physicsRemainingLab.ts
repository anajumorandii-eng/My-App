export type PhysicsRemainingId = 'echo' | 'diffraction' | 'tube-harmonics' | 'quantum-photon';

export interface PhysicsRemainingReadout { label: string; value: string; pivot?: boolean }
export interface PhysicsRemainingConfig {
  id: PhysicsRemainingId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): PhysicsRemainingReadout[];
}

const decimal = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');

export const PHYSICS_REMAINING: Record<PhysicsRemainingId, PhysicsRemainingConfig> = {
  echo: {
    id: 'echo',
    name: 'O eco só se separa quando a onda volta tarde o bastante',
    question: 'Ajuste o intervalo entre emitir um pulso e ouvi-lo voltar; o som viaja a 340 m/s.',
    control: { label: 'Δt', description: 'intervalo de ida e volta, em segundos', min: 0.05, max: 1.2, step: 0.05, initial: 0.3 },
    formula: 'd = v·Δt/2',
    insight: 'o som percorre a distância até o obstáculo e a mesma distância na volta; por isso o tempo medido precisa ser dividido por dois.',
    readouts: time => [{ label: 'Tempo de ida e volta', value: `${decimal(time)} s` }, { label: 'Distância ao obstáculo', value: `${decimal(170 * time)} m`, pivot: true }],
  },
  diffraction: {
    id: 'diffraction',
    name: 'Uma abertura estreita espalha mais a onda',
    question: 'Mude a largura da fenda em comprimentos de onda e observe a abertura do feixe.',
    control: { label: 'a/λ', description: 'largura da fenda em comprimentos de onda', min: 0.5, max: 5, step: 0.5, initial: 1 },
    formula: 'sen θ ≈ λ/a',
    insight: 'quando a abertura tem dimensão comparável ao comprimento de onda, cada ponto da fenda passa a agir como fonte e o feixe se espalha.',
    readouts: ratio => [{ label: 'Largura da fenda', value: `${decimal(ratio)} λ` }, { label: 'Abertura aproximada', value: `${decimal(Math.asin(Math.min(1, 1 / ratio)) * 180 / Math.PI)}°`, pivot: true }],
  },
  'tube-harmonics': {
    id: 'tube-harmonics',
    name: 'Um tubo fechado só admite harmônicos ímpares',
    question: 'Escolha um modo numa coluna de ar de 0,85 m, fechada em uma extremidade.',
    control: { label: 'n', description: 'harmônico ímpar do tubo fechado', min: 1, max: 5, step: 2, initial: 1 },
    formula: 'fₙ = nv/(4L), n = 1, 3, 5…',
    insight: 'a extremidade fechada é nó de deslocamento e a aberta é ventre; essa condição exclui os harmônicos pares.',
    readouts: harmonic => [{ label: 'Modo permitido', value: `${harmonic}º harmônico` }, { label: 'Frequência', value: `${decimal(harmonic * 100)} Hz`, pivot: true }],
  },
  'quantum-photon': {
    id: 'quantum-photon',
    name: 'A frequência do fóton determina o salto de energia',
    question: 'Aumente a frequência da luz incidente e compare a energia de cada fóton.',
    control: { label: 'f', description: 'frequência da luz, em 10¹⁴ Hz', min: 3, max: 12, step: 1, initial: 6 },
    formula: 'E = hf',
    insight: 'luz não entrega energia de modo contínuo: cada fóton carrega h vezes sua frequência, por isso frequências maiores podem alcançar transições maiores.',
    readouts: frequency => [{ label: 'Frequência', value: `${frequency} × 10¹⁴ Hz` }, { label: 'Energia por fóton', value: `${decimal(0.4136 * frequency)} eV`, pivot: true }],
  },
};
