/** As estruturas conceituais que o material de Filosofia realmente pede.
 *  Uma família nova só nasce quando uma matéria pede estrutura que nenhuma
 *  destas representa — e isso vira nota no documento de famílias. */
export type SceneFamily =
  | 'contraste-de-posicoes'
  | 'escala-de-graus'
  | 'cadeia-de-derivacao'
  | 'camadas-de-determinacao'
  | 'movimento-dialetico';

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
}

export type LastroReason = 'capitulo-ausente' | 'secao-ausente' | 'trecho-ausente';
export interface LastroIssue { chapterId: string; label: string; reason: LastroReason; }
