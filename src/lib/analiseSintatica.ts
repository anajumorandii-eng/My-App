/**
 * Análise sintática em blocos: o laboratório de Português no Hoje.
 *
 * Cada frase vem dividida em termos, e cada termo com a sua função. As frases
 * foram escritas aqui, curtas e sem ambiguidade de análise, uma para cada
 * transitividade que a prova cobra: o verbo decide que complementos a oração
 * pede, e o tipo de predicado sai do verbo (de ligação → nominal).
 *
 * O teste confere a coerência que a gramática exige: os termos recompõem a
 * frase, verbo transitivo direto tem objeto direto e não indireto, verbo de
 * ligação tem predicativo, e assim por diante.
 */

export type Funcao =
  | 'sujeito'
  | 'verbo'
  | 'objeto direto'
  | 'objeto indireto'
  | 'predicativo do sujeito'
  | 'adjunto adverbial';

export type Transitividade = 'VTD' | 'VTI' | 'VTDI' | 'VI' | 'VL';

export interface Termo { texto: string; funcao: Funcao }

export interface Frase {
  id: string;
  termos: Termo[];
  transitividade: Transitividade;
  /** O que a frase ensina, numa linha. */
  licao: string;
}

export const NOME_DA_TRANSITIVIDADE: Record<Transitividade, string> = {
  VTD: 'transitivo direto',
  VTI: 'transitivo indireto',
  VTDI: 'transitivo direto e indireto',
  VI: 'intransitivo',
  VL: 'de ligação',
};

export const FRASES: Frase[] = [
  {
    id: 'vtd', transitividade: 'VTD',
    termos: [
      { texto: 'A estudante', funcao: 'sujeito' },
      { texto: 'resolveu', funcao: 'verbo' },
      { texto: 'as questões', funcao: 'objeto direto' },
    ],
    licao: 'quem resolve, resolve algo: o complemento vem sem preposição',
  },
  {
    id: 'vti', transitividade: 'VTI',
    termos: [
      { texto: 'Os candidatos', funcao: 'sujeito' },
      { texto: 'precisam', funcao: 'verbo' },
      { texto: 'de descanso', funcao: 'objeto indireto' },
    ],
    licao: 'quem precisa, precisa de algo: a preposição é exigida pelo verbo',
  },
  {
    id: 'vtdi', transitividade: 'VTDI',
    termos: [
      { texto: 'O professor', funcao: 'sujeito' },
      { texto: 'entregou', funcao: 'verbo' },
      { texto: 'os simulados', funcao: 'objeto direto' },
      { texto: 'aos alunos', funcao: 'objeto indireto' },
    ],
    licao: 'quem entrega, entrega algo a alguém: dois complementos',
  },
  {
    id: 'vl', transitividade: 'VL',
    termos: [
      { texto: 'A prova', funcao: 'sujeito' },
      { texto: 'parecia', funcao: 'verbo' },
      { texto: 'difícil', funcao: 'predicativo do sujeito' },
    ],
    licao: 'o verbo só liga o sujeito a uma qualidade dele: o núcleo é "difícil"',
  },
  {
    id: 'vi', transitividade: 'VI',
    termos: [
      { texto: 'Choveu', funcao: 'verbo' },
      { texto: 'muito', funcao: 'adjunto adverbial' },
      { texto: 'ontem', funcao: 'adjunto adverbial' },
    ],
    licao: 'fenômeno da natureza: oração sem sujeito, e o verbo não pede complemento',
  },
];

export const textoDaFrase = (f: Frase) => `${f.termos.map((t) => t.texto).join(' ')}.`;

export function predicado(f: Frase) {
  return f.transitividade === 'VL' ? 'predicado nominal' : 'predicado verbal';
}

export const temSujeito = (f: Frase) => f.termos.some((t) => t.funcao === 'sujeito');

/** Abreviação do rótulo na cena, onde o espaço é curto. */
export const SIGLA: Record<Funcao, string> = {
  sujeito: 'sujeito',
  verbo: 'verbo',
  'objeto direto': 'obj. direto',
  'objeto indireto': 'obj. indireto',
  'predicativo do sujeito': 'predicativo',
  'adjunto adverbial': 'adj. adverbial',
};
