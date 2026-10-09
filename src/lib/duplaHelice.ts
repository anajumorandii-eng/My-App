import { basePair } from './biologyInstrumentLab';

/**
 * Dupla-hélice de DNA: a biologia da cena de "Código Genético e Síntese
 * Proteica" no cartão do Hoje.
 *
 * Módulo puro, como `lenteDelgada.ts` para a bancada óptica: a cena só desenha
 * o que sai daqui, e o node:test confere antes. O pareamento vem de
 * `basePair`, o mesmo que o instrumento de ácidos nucleicos do Visual já usa —
 * duas fontes de pareamento no app poderiam discordar.
 *
 * A sequência é ilustrativa, não de um gene real, e a tela diz isso. Foi
 * escolhida para que transcrição e tradução sejam verificáveis: o molde
 * 3′-TAC GGC AAA ATT-5′ dá o RNAm 5′-AUG CCG UUU UAA-3′, lido como
 * metionina, prolina, fenilalanina e o fim.
 */

/** Medidas do modelo de Watson e Crick como os livros de vestibular trazem (DNA-B). */
export const DNA_B = {
  paresPorVolta: 10,
  subidaPorParNm: 0.34,
  passoNm: 3.4,
  diametroNm: 2,
} as const;

export type Base = 'A' | 'T' | 'C' | 'G';
export type BaseRna = 'A' | 'U' | 'C' | 'G';

/** Fita molde, lida de 3′ para 5′ — o sentido em que a RNA polimerase a percorre. */
export const MOLDE: readonly Base[] = ['T', 'A', 'C', 'G', 'G', 'C', 'A', 'A', 'A', 'A', 'T', 'T'];

const INDICE: Record<Base, number> = { A: 0, T: 1, C: 2, G: 3 };

export interface ParDeBases {
  indice: number;
  molde: Base;
  /** A base da outra fita de DNA, antiparalela. */
  complementar: Base;
  /** A base que entra no RNAm na transcrição. */
  rna: BaseRna;
  pontesDeHidrogenio: 2 | 3;
}

export function parNaPosicao(indice: number): ParDeBases {
  const i = Math.max(0, Math.min(MOLDE.length - 1, Math.round(indice)));
  const molde = MOLDE[i];
  const par = basePair(INDICE[molde]);
  return {
    indice: i,
    molde,
    complementar: par.dna as Base,
    rna: par.rna as BaseRna,
    pontesDeHidrogenio: par.hydrogenBonds as 2 | 3,
  };
}

/** RNAm transcrito do molde, de 5′ para 3′. */
export function rnaMensageiro(): BaseRna[] {
  return MOLDE.map((_, i) => parNaPosicao(i).rna);
}

/**
 * Só os códons que a sequência usa: tabela parcial de propósito. Uma tabela
 * inteira aqui seria conteúdo que nenhum teste da cena confere.
 */
const CODONS: Record<string, string> = {
  AUG: 'metionina (início)',
  CCG: 'prolina',
  UUU: 'fenilalanina',
  UAA: 'fim da tradução',
};

export interface Codon {
  numero: number;
  trinca: string;
  significado: string;
}

export function codons(): Codon[] {
  const rna = rnaMensageiro();
  const lista: Codon[] = [];
  for (let i = 0; i + 3 <= rna.length; i += 3) {
    const trinca = rna.slice(i, i + 3).join('');
    const significado = CODONS[trinca];
    if (!significado) throw new Error(`códon ${trinca} fora da tabela da cena`);
    lista.push({ numero: i / 3 + 1, trinca, significado });
  }
  return lista;
}

export function codonDoPar(indice: number): Codon {
  return codons()[Math.floor(parNaPosicao(indice).indice / 3)];
}

/** Ângulo (rad) e posição ao longo do eixo (nm) do par, no modelo de 10 pares por volta. */
export function geometriaDoPar(indice: number) {
  return {
    angulo: (indice * 2 * Math.PI) / DNA_B.paresPorVolta,
    alturaNm: indice * DNA_B.subidaPorParNm,
  };
}

/** DNA-B destrogiro em coordenadas cartesianas com Y vertical, em nanômetros.
 * O molde segue a sequência 3′ → 5′ conforme o índice aumenta; a outra fita
 * segue o sentido oposto. A mudança de eixo conserva a quiralidade da hélice.
 */
export function posicoesDoParVertical(indice: number, quantidade = 10): {
  molde: [number, number, number]; complementar: [number, number, number];
} {
  const { angulo } = geometriaDoPar(indice);
  const raio = DNA_B.diametroNm / 2;
  const y = (indice - (quantidade - 1) / 2) * DNA_B.subidaPorParNm;
  const x = raio * Math.cos(angulo), z = -raio * Math.sin(angulo);
  return { molde: [x, y, z], complementar: [-x, y, -z] };
}
