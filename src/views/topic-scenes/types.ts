/** As estruturas conceituais que o material de Filosofia realmente pede.
 *  Uma família nova só nasce quando uma matéria pede estrutura que nenhuma
 *  destas representa — e isso vira nota no documento de famílias. */
export type SceneFamily =
  | 'contraste-de-posicoes'
  | 'escala-de-graus'
  | 'cadeia-de-derivacao'
  | 'camadas-de-determinacao'
  | 'movimento-dialetico'
  | 'tipologia'
  | 'criterios-conjuntivos'
  | 'grade-de-eixos';

/** Uma afirmação da cena e o trecho do capítulo que a sustenta. */
export interface SceneItem {
  /** Rótulo curto exibido na cena. */
  label: string;
  /** O que a cena afirma sobre esse rótulo. */
  claim: string;
  /** Título exato de uma seção do capítulo. */
  section: string;
  /** Trecho literal daquela seção que sustenta o claim. */
  quote: string;
  /**
   * Só usado por `grade-de-eixos`: em qual polo de cada eixo este item
   * vive. `eixoA`/`eixoB` indexam `SceneEntry.eixos.a.polos` /
   * `.b.polos` (0 = primeiro polo, 1 = segundo). Um item sem `celula`
   * não participa da grade.
   */
  celula?: { eixoA: 0 | 1; eixoB: 0 | 1 };
}

/** Um eixo da grade: seu nome e os dois polos que o percorrem. Só
 *  `grade-de-eixos` usa isto — os eixos, não os quatro rótulos
 *  resultantes, são o conteúdo que a cena precisa ensinar. */
export interface SceneEixo {
  nome: string;
  polos: [string, string];
}

export interface SceneEntry {
  /** ID exato do capítulo. Nunca palavra-chave. */
  chapterId: string;
  family: SceneFamily;
  /** A pergunta que a cena responde, exibida no cabeçalho. */
  question: string;
  items: SceneItem[];
  /** Legenda do eixo da escala. Só as famílias de escala usam. */
  eixo?: string;
  /**
   * Nota de honestidade sobre o estatuto dos tipos (ex.: "são tipos
   * ideais; casos reais combinam mais de um"). Só `tipologia` usa isto.
   * Vem do capítulo, nunca é inventada pelo componente; sem `nota`,
   * nada é renderizado no lugar dela.
   */
  nota?: string;
  /** Os dois eixos independentes cujo cruzamento gera as células.
   *  Só `grade-de-eixos` usa isto. */
  eixos?: { a: SceneEixo; b: SceneEixo };
}

export type LastroReason = 'capitulo-ausente' | 'secao-ausente' | 'trecho-ausente';
export interface LastroIssue { chapterId: string; label: string; reason: LastroReason; }
