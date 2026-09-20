export type OpticsId = 'plane-mirror' | 'spherical-mirror' | 'refraction' | 'vision';

export interface OpticsReadout { label: string; value: string; pivot?: boolean }
export interface OpticsConfig {
  id: OpticsId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number };
  formula: string;
  insight: string;
  readouts(value: number): OpticsReadout[];
}

const round = (value: number, places = 1) => Number(value.toFixed(places));
const comma = (value: number, places = 1) => String(round(value, places)).replace('.', ',');

export function angleOfRefraction(incidence: number, n1 = 1, n2 = 1.5) {
  return Math.asin((n1 / n2) * Math.sin(incidence * Math.PI / 180)) * 180 / Math.PI;
}

export function sphericalImageDistance(objectDistance: number, focalDistance = 30) {
  if (objectDistance === focalDistance) return null;
  return 1 / (1 / focalDistance - 1 / objectDistance);
}

export const OPTICS: Record<OpticsId, OpticsConfig> = {
  'plane-mirror': {
    id: 'plane-mirror',
    name: 'Espelho plano conserva o ângulo',
    question: 'Gire o raio incidente e compare-o com o raio refletido em torno da normal.',
    control: { label: 'i', description: 'ângulo de incidência em graus', min: 10, max: 75, step: 5, initial: 35 },
    formula: 'i = r',
    insight: 'a normal é a referência: os dois raios fazem ângulos iguais com ela, não com a superfície do espelho.',
    readouts: incidence => [{ label: 'Incidência i', value: `${incidence}°` }, { label: 'Reflexão r', value: `${incidence}°`, pivot: true }],
  },
  'spherical-mirror': {
    id: 'spherical-mirror',
    name: 'Espelho côncavo muda a natureza da imagem',
    question: 'Aproxime o objeto do foco de um espelho côncavo de 30 cm.',
    control: { label: 'p', description: 'distância do objeto ao espelho em cm', min: 10, max: 90, step: 5, initial: 60 },
    formula: '1/f = 1/p + 1/p′',
    insight: 'fora do foco os raios se encontram e a imagem é real; dentro dele, os prolongamentos se encontram e ela é virtual.',
    readouts: p => {
      const image = sphericalImageDistance(p);
      if (image === null) return [{ label: 'Imagem', value: 'no infinito', pivot: true }];
      return [{ label: 'Foco f', value: '30 cm' }, { label: 'p′', value: `${comma(image)} cm`, pivot: true }, { label: 'Natureza', value: image > 0 ? 'real e invertida' : 'virtual e direita' }];
    },
  },
  refraction: {
    id: 'refraction',
    name: 'Refração aproxima o raio da normal',
    question: 'Mude o ângulo com que a luz sai do ar e entra no vidro (n = 1,5).',
    control: { label: 'i', description: 'ângulo de incidência no ar em graus', min: 5, max: 75, step: 5, initial: 45 },
    formula: 'n₁ sen i = n₂ sen r',
    insight: 'na fronteira a frequência permanece; no meio mais refringente a velocidade cai e o raio se aproxima da normal.',
    readouts: incidence => [{ label: 'n ar', value: '1,0' }, { label: 'r no vidro', value: `${comma(angleOfRefraction(incidence))}°`, pivot: true }, { label: 'n vidro', value: '1,5' }],
  },
  vision: {
    id: 'vision',
    name: 'Lente divergente traz o foco à retina',
    question: 'Aumente a correção divergente de um olho míope e acompanhe o foco.',
    control: { label: 'P', description: 'potência da lente corretiva em dioptrias', min: -6, max: -1, step: 1, initial: -3 },
    formula: 'P = 1/f',
    insight: 'na miopia o olho convergente demais focaliza antes da retina; a lente divergente reduz a convergência do conjunto.',
    readouts: power => [{ label: 'Correção', value: `${power} D`, pivot: true }, { label: 'Foco da lente', value: `${comma(100 / power)} cm` }, { label: 'Efeito', value: 'desloca o foco para trás' }],
  },
};
