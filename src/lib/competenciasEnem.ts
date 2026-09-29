/**
 * As cinco competências da redação do ENEM: o laboratório de Redação no Hoje.
 *
 * Cada competência vale de 0 a 200, em seis níveis de 40 pontos, e a nota é a
 * soma — por isso a cena empilha folhas: cada folha é um nível. A matriz é a
 * pública do INEP; os descritores abaixo são resumos escritos aqui, não o
 * texto da cartilha.
 *
 * Na competência 5 a correção conta os elementos válidos da proposta de
 * intervenção — agente, ação, modo ou meio, efeito e detalhamento, os cinco
 * que a cartilha do participante nomeia —, e é essa conta que a cena faz:
 * cada elemento presente vale um nível. Proposta que fira os direitos humanos
 * zera a competência, o que a cena não simula.
 */

export const NIVEL = 40;
export const MAXIMO = 200;

export type IdCompetencia = 'c1' | 'c2' | 'c3' | 'c4' | 'c5';

export interface Competencia { id: IdCompetencia; numero: number; resumo: string }

export const COMPETENCIAS: Competencia[] = [
  { id: 'c1', numero: 1, resumo: 'domínio da modalidade escrita formal da língua' },
  { id: 'c2', numero: 2, resumo: 'entender a proposta e desenvolver o tema no texto dissertativo-argumentativo' },
  { id: 'c3', numero: 3, resumo: 'selecionar, relacionar e organizar argumentos em defesa de um ponto de vista' },
  { id: 'c4', numero: 4, resumo: 'coesão: os mecanismos que encadeiam a argumentação' },
  { id: 'c5', numero: 5, resumo: 'proposta de intervenção que respeite os direitos humanos' },
];

export const ELEMENTOS_DA_INTERVENCAO = ['agente', 'ação', 'modo ou meio', 'efeito', 'detalhamento'] as const;
export type Elemento = (typeof ELEMENTOS_DA_INTERVENCAO)[number];

/** Nota da competência 5 pelos elementos presentes: um nível por elemento. */
export function notaDaIntervencao(presentes: ReadonlySet<Elemento>) {
  return Math.min(MAXIMO, presentes.size * NIVEL);
}

export function validaNota(n: number) {
  return Number.isInteger(n) && n >= 0 && n <= MAXIMO && n % NIVEL === 0;
}

export function notaTotal(notas: Record<IdCompetencia, number>) {
  return COMPETENCIAS.reduce((s, c) => s + notas[c.id], 0);
}

/** Níveis de 0 a 5: o número de folhas da pilha. */
export const folhas = (nota: number) => nota / NIVEL;
