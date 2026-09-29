/**
 * Geometria molecular pela teoria da repulsão dos pares de elétrons (VSEPR):
 * a química da cena de "Polaridade das Ligações e Geometria Molecular".
 *
 * Módulo puro, como `lenteDelgada.ts` e `duplaHelice.ts`: a cena só desenha o
 * que sai daqui. Os ângulos são os dos livros de vestibular (104,5° na água,
 * 107° na amônia). A polaridade não é um campo escrito à mão: sai da soma dos
 * vetores das ligações, e é essa conta que decide "polar" ou "apolar" — o
 * teste confere que ela bate com o que os livros dizem de cada molécula.
 *
 * Simplificação declarada: nas cinco moléculas os ligantes de uma mesma
 * molécula são iguais, então cada ligação pesa o mesmo na soma. Ligantes
 * diferentes pediriam eletronegatividades, que esta cena não usa.
 */

export type Vetor = [number, number, number];

export type IdMolecula = 'CO2' | 'BF3' | 'CH4' | 'NH3' | 'H2O';

export interface Molecula {
  id: IdMolecula;
  /** Fórmula como a estudante escreve, com subscrito. */
  formula: string;
  central: string;
  ligante: string;
  /** Pares ligantes ao redor do central (ligação dupla conta como uma nuvem). */
  paresLigantes: number;
  paresNaoLigantes: number;
  geometria: string;
  anguloGraus: number;
  /** Direções unitárias das ligações, a partir do átomo central. */
  ligacoes: Vetor[];
  /** Direções dos pares não ligantes, só para o desenho. */
  paresLivres: Vetor[];
}

const rad = (graus: number) => (graus * Math.PI) / 180;
const norm = ([x, y, z]: Vetor): Vetor => { const n = Math.hypot(x, y, z); return [x / n, y / n, z / n]; };

/** Três ligações iguais em volta do eixo y, apontando para baixo, com o ângulo dado entre elas. */
function piramide(anguloGraus: number): Vetor[] {
  // Vetores com ângulo polar β a partir de −y e azimutes a 120°:
  // cos θ = cos²β − ½ sen²β = 1 − 1,5 sen²β.
  const sen2 = (1 - Math.cos(rad(anguloGraus))) / 1.5;
  const b = Math.asin(Math.sqrt(sen2));
  return [0, 120, 240].map((az) => norm([Math.sin(b) * Math.cos(rad(az)), -Math.cos(b), Math.sin(b) * Math.sin(rad(az))]));
}

/** Duas ligações no plano xy, simétricas em relação a −y, com o ângulo dado entre elas. */
function angular(anguloGraus: number): Vetor[] {
  const m = rad(anguloGraus / 2);
  return [norm([Math.sin(m), -Math.cos(m), 0]), norm([-Math.sin(m), -Math.cos(m), 0])];
}

const s3 = 1 / Math.sqrt(3);

export const MOLECULAS: Record<IdMolecula, Molecula> = {
  CO2: {
    id: 'CO2', formula: 'CO₂', central: 'C', ligante: 'O', paresLigantes: 2, paresNaoLigantes: 0,
    geometria: 'linear', anguloGraus: 180, ligacoes: [[1, 0, 0], [-1, 0, 0]], paresLivres: [],
  },
  BF3: {
    id: 'BF3', formula: 'BF₃', central: 'B', ligante: 'F', paresLigantes: 3, paresNaoLigantes: 0,
    geometria: 'trigonal plana', anguloGraus: 120,
    ligacoes: [0, 120, 240].map((a) => norm([Math.cos(rad(a + 90)), Math.sin(rad(a + 90)), 0])),
    paresLivres: [],
  },
  CH4: {
    id: 'CH4', formula: 'CH₄', central: 'C', ligante: 'H', paresLigantes: 4, paresNaoLigantes: 0,
    geometria: 'tetraédrica', anguloGraus: 109.5,
    ligacoes: [[s3, s3, s3], [s3, -s3, -s3], [-s3, s3, -s3], [-s3, -s3, s3]],
    paresLivres: [],
  },
  NH3: {
    id: 'NH3', formula: 'NH₃', central: 'N', ligante: 'H', paresLigantes: 3, paresNaoLigantes: 1,
    geometria: 'piramidal', anguloGraus: 107, ligacoes: piramide(107), paresLivres: [[0, 1, 0]],
  },
  H2O: {
    id: 'H2O', formula: 'H₂O', central: 'O', ligante: 'H', paresLigantes: 2, paresNaoLigantes: 2,
    geometria: 'angular', anguloGraus: 104.5, ligacoes: angular(104.5),
    paresLivres: [norm([0, 0.6, 0.8]), norm([0, 0.6, -0.8])],
  },
};

export const ORDEM: IdMolecula[] = ['CO2', 'BF3', 'CH4', 'NH3', 'H2O'];

/** Ângulo (graus) entre duas direções. */
export function anguloEntre(a: Vetor, b: Vetor) {
  const cos = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

/** Módulo da soma dos vetores das ligações: o momento dipolar resultante, em unidades de ligação. */
export function momentoResultante(m: Molecula) {
  const soma = m.ligacoes.reduce<Vetor>((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]);
  return Math.hypot(...soma);
}

export function ehPolar(m: Molecula) {
  return momentoResultante(m) > 1e-6;
}
