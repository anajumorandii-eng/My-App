export type WavesId = 'wave-equation' | 'sound-intensity' | 'interference' | 'string-harmonics' | 'doppler';
export interface WavesReadout { label: string; value: string; pivot?: boolean }
export interface WavesConfig { id: WavesId; name: string; question: string; control: { label: string; description: string; min: number; max: number; step: number; initial: number }; formula: string; insight: string; readouts(value: number): WavesReadout[] }
const decimal = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');

export function dopplerGeometry(sourceSpeed: number) {
  const soundSpeed = 340, emittedFrequency = 500, pixelsPerMeter = 32;
  const source = { x: 150, y: 140 }, observer = { x: 265, y: 140 };
  return {
    source, observer, pixelsPerMeter,
    wavelengthAhead: (soundSpeed - sourceSpeed) / emittedFrequency,
    wavelengthBehind: (soundSpeed + sourceSpeed) / emittedFrequency,
    frequencyHeard: emittedFrequency * soundSpeed / (soundSpeed - sourceSpeed),
    // Cada círculo permanece centrado onde a fonte estava ao emiti-lo.
    fronts: Array.from({ length: 4 }, (_, i) => {
      const age = (i + 1) / emittedFrequency;
      return { age, cx: source.x - sourceSpeed * age * pixelsPerMeter, cy: source.y, r: soundSpeed * age * pixelsPerMeter };
    }),
  };
}

export const WAVES: Record<WavesId, WavesConfig> = {
  'wave-equation': { id: 'wave-equation', name: 'A fonte fixa a frequência; o meio define a velocidade', question: 'Mude a frequência de uma onda que percorre este meio a 24 m/s.', control: { label: 'f', description: 'frequência da fonte em Hz', min: 1, max: 12, step: 1, initial: 4 }, formula: 'v = λf', insight: 'num mesmo meio, mudar a frequência modifica o comprimento de onda; a velocidade continua sendo propriedade do meio.', readouts: f => [{ label: 'Velocidade v', value: '24 m/s' }, { label: 'Comprimento λ', value: `${decimal(24 / f)} m`, pivot: true }] },
  'sound-intensity': { id: 'sound-intensity', name: 'A intensidade sonora se espalha pela área', question: 'Afaste o ouvinte de uma fonte que emite 8 W igualmente em todas as direções.', control: { label: 'r', description: 'distância à fonte em m', min: 1, max: 8, step: 1, initial: 2 }, formula: 'I = P/(4πr²)', insight: 'a mesma potência atravessa esferas cada vez maiores: por isso a intensidade cai com o quadrado da distância.', readouts: r => [{ label: 'Potência P', value: '8 W' }, { label: 'Intensidade I', value: `${decimal(8 / (4 * Math.PI * r * r))} W/m²`, pivot: true }] },
  interference: { id: 'interference', name: 'A fase decide se duas ondas se reforçam ou se cancelam', question: 'Mude a diferença de fase entre duas ondas de mesma amplitude, A = 2 cm.', control: { label: 'Δφ', description: 'diferença de fase em graus', min: 0, max: 180, step: 15, initial: 60 }, formula: 'Aᵣ = 2A·|cos(Δφ/2)|', insight: 'crista com crista reforça; crista com vale reduz a amplitude resultante até anulá-la quando as amplitudes são iguais.', readouts: phase => [{ label: 'Fase relativa', value: `${phase}°` }, { label: 'Amplitude resultante', value: `${decimal(4 * Math.abs(Math.cos(phase * Math.PI / 360)))} cm`, pivot: true }] },
  'string-harmonics': { id: 'string-harmonics', name: 'Uma corda fixa só admite modos com nós nas extremidades', question: 'Mude o número do harmônico numa corda de 1,5 m, onde a onda se propaga a 12 m/s.', control: { label: 'n', description: 'número do harmônico', min: 1, max: 5, step: 1, initial: 2 }, formula: 'fₙ = nv/(2L)', insight: 'cada harmônico acrescenta um ventre, mas os nós das pontas permanecem: é a condição de contorno que seleciona as frequências.', readouts: n => [{ label: 'Comprimento L', value: '1,5 m' }, { label: 'Frequência fₙ', value: `${4 * n} Hz`, pivot: true }] },
  doppler: { id: 'doppler', name: 'A aproximação comprime as frentes e eleva a frequência ouvida', question: 'Mude a velocidade de aproximação de uma sirene de 500 Hz; o som propaga-se a 340 m/s.', control: { label: 'v fonte', description: 'velocidade de aproximação em m/s', min: 0, max: 80, step: 10, initial: 40 }, formula: 'f′ = f·v/(v − vₛ)', insight: 'com a fonte se aproximando, cada frente nasce mais perto da anterior; o observador recebe mais ciclos por segundo.', readouts: speed => [{ label: 'Frequência emitida', value: '500 Hz' }, { label: 'Frequência ouvida', value: `${decimal(dopplerGeometry(speed).frequencyHeard)} Hz`, pivot: true }, { label: 'Comprimento à frente λ+', value: `${((340 - speed) / 500).toFixed(2).replace('.', ',')} m` }, { label: 'Comprimento atrás λ−', value: `${((340 + speed) / 500).toFixed(2).replace('.', ',')} m` }] },
};
