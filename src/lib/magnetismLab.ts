export type MagnetismId = 'fio-espira' | 'carga-em-b' | 'fios-paralelos' | 'lenz' | 'gerador';
export interface MagnetismReadout { label: string; value: string; pivot?: boolean }
export interface MagnetismConfig { id: MagnetismId; name: string; question: string; control: { label: string; description: string; min: number; max: number; step: number; initial: number }; formula: string; insight: string; readouts(value: number): MagnetismReadout[] }
const decimal = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',');

export const MAGNETISM: Record<MagnetismId, MagnetismConfig> = {
  'fio-espira': {
    id: 'fio-espira', name: 'Corrente cria campo circular ao redor do fio', question: 'Mude a corrente em um fio retilíneo; a distância de observação fica em 2 cm.',
    control: { label: 'I', description: 'corrente no fio em A', min: 0, max: 10, step: 1, initial: 4 }, formula: 'B = μ₀I/(2πr)',
    insight: 'em torno de um fio, as linhas de campo são círculos; aumentar corrente aumenta B, enquanto afastar-se do fio o reduz.',
    readouts: (i) => [{ label: 'Distância r', value: '2 cm' }, { label: 'B relativo', value: `${decimal(i / 2)} u.a.`, pivot: true }],
  },
  'carga-em-b': {
    id: 'carga-em-b', name: 'Carga em movimento curva no campo magnético', question: 'Mude o ângulo entre velocidade e campo para uma carga com qvB = 0,6 N.',
    control: { label: 'θ', description: 'ângulo entre v e B em graus', min: 0, max: 90, step: 10, initial: 60 }, formula: 'F = |q|vB sen θ',
    insight: 'a força magnética só age sobre a componente da velocidade perpendicular ao campo: em paralelo ela é nula.',
    readouts: (theta) => [{ label: 'Ângulo θ', value: `${theta}°` }, { label: 'Força magnética', value: `${decimal(.6 * Math.sin(theta * Math.PI / 180))} N`, pivot: true }],
  },
  'fios-paralelos': {
    id: 'fios-paralelos', name: 'Fios com correntes exercem força entre si', question: 'Mude a corrente igual que percorre dois fios paralelos separados por uma distância fixa.',
    control: { label: 'I', description: 'corrente em cada fio em A', min: 0, max: 8, step: 1, initial: 3 }, formula: 'F/L = μ₀I₁I₂/(2πd)',
    insight: 'correntes paralelas no mesmo sentido se atraem; inverter o sentido de uma delas transforma a atração em repulsão.',
    readouts: (i) => [{ label: 'Sentido das correntes', value: 'igual → atração' }, { label: 'F/L relativo', value: `${decimal(i * i / 4)} u.a.`, pivot: true }],
  },
  lenz: {
    id: 'lenz', name: 'Uma espira responde à variação do fluxo', question: 'Mude o tempo em que um fluxo de 0,20 Wb desaparece numa bobina de 10 espiras.',
    control: { label: 'Δt', description: 'tempo de variação em s', min: .1, max: 2, step: .1, initial: .5 }, formula: '|ε| = N|ΔΦ|/Δt',
    insight: 'pela Lei de Lenz, a corrente induzida cria um campo que se opõe à mudança do fluxo, exigindo trabalho para a alteração.',
    readouts: (time) => [{ label: 'Fluxo', value: '0,20 Wb → 0' }, { label: 'FEM induzida', value: `${decimal(2 / time)} V`, pivot: true }],
  },
  gerador: {
    id: 'gerador', name: 'Uma espira girando converte trabalho em eletricidade', question: 'Mude a velocidade angular de uma bobina em campo uniforme.',
    control: { label: 'ω', description: 'velocidade angular em rad/s', min: 0, max: 20, step: 2, initial: 10 }, formula: 'εmáx = NBAω',
    insight: 'a rotação muda continuamente o fluxo através da espira; a energia elétrica gerada vem do trabalho mecânico que a mantém girando.',
    readouts: (omega) => [{ label: 'Fluxo variável', value: 'N·B·A·cos(ωt)' }, { label: 'FEM máxima', value: `${decimal(.4 * omega)} V`, pivot: true }],
  },
};
