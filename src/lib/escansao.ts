/**
 * Escansão de versos: o laboratório de Literatura no Hoje.
 *
 * Cada verso vem dividido em sílabas poéticas, que não são as gramaticais: a
 * contagem para na última sílaba tônica, e vogais que se encontram entre
 * palavras se fundem numa só (elisão, "que‿ar", "cio‿in"). As divisões foram
 * feitas aqui, verso a verso, e o teste confere as regras que as sustentam: o
 * número de sílabas dá o nome do metro, e a última tônica é a última sílaba
 * contada.
 *
 * Os versos são de domínio público e dos mais cobrados: Gonçalves Dias,
 * Camões e Bilac.
 */

export interface Verso {
  id: string;
  autor: string;
  obra: string;
  /** Sílabas poéticas, com "‿" onde houve elisão. */
  silabas: string[];
  /** O que sobra depois da última tônica e não se conta. */
  sobra: string;
  /** Posições (a partir de 1) das tônicas que definem o metro. */
  tonicas: number[];
}

export const VERSOS: Verso[] = [
  {
    id: 'i-juca', autor: 'Gonçalves Dias', obra: 'I-Juca-Pirama',
    silabas: ['Meu', 'can', 'to', 'de', 'mor'], sobra: 'te',
    tonicas: [2, 5],
  },
  {
    id: 'exilio', autor: 'Gonçalves Dias', obra: 'Canção do exílio',
    silabas: ['Mi', 'nha', 'ter', 'ra', 'tem', 'pal', 'mei'], sobra: 'ras',
    tonicas: [3, 7],
  },
  {
    id: 'amor', autor: 'Camões', obra: 'soneto "Amor é fogo que arde sem se ver"',
    silabas: ['A', 'mor', 'é', 'fo', 'go', 'que‿ar', 'de', 'sem', 'se', 'ver'], sobra: '',
    tonicas: [6, 10],
  },
  {
    id: 'lacio', autor: 'Olavo Bilac', obra: 'soneto "Língua portuguesa"',
    silabas: ['Úl', 'ti', 'ma', 'flor', 'do', 'Lá', 'cio‿in', 'cul', 'ta‿e', 'be'], sobra: 'la',
    tonicas: [6, 10],
  },
];

/** O verso como se escreve, recomposto das sílabas. */
export const TEXTO_DO_VERSO: Record<string, string> = {
  'i-juca': 'Meu canto de morte,',
  exilio: 'Minha terra tem palmeiras,',
  amor: 'Amor é fogo que arde sem se ver;',
  lacio: 'Última flor do Lácio, inculta e bela,',
};

export function metro(v: Verso) {
  const n = v.silabas.length;
  if (n === 5) return 'redondilha menor';
  if (n === 7) return 'redondilha maior';
  if (n === 10) return v.tonicas.includes(6) ? 'decassílabo heroico' : 'decassílabo';
  if (n === 12) return 'alexandrino';
  return `${n} sílabas`;
}

/**
 * Sílabas gramaticais da versão escrita, sem pontuação: "que‿ar" conta duas.
 * Serve ao teste, para provar que a elisão é o que reduz a contagem.
 */
export function silabasGramaticais(v: Verso) {
  const elisoes = v.silabas.filter((s) => s.includes('‿')).length;
  return v.silabas.length + elisoes + (v.sobra ? 1 : 0);
}
