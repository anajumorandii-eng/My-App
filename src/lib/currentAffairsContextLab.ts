/**
 * Dossiê de Atualidades, módulo puro para rodar em `node:test`.
 *
 * Antes este capítulo reaproveitava o laboratório de três recortes de
 * `geographyContextLab.ts`, e a cena eram três folhas com linhas rotuladas
 * "registro, contexto, avaliação": a auditoria da fila visual (A1) apontou que
 * nada ali era Belém, nem ator, nem decisão, nem limite — trocar o capítulo
 * não mudaria o desenho. O objeto próprio da COP30 é a separação entre tipos
 * de evidência sobre um mesmo acontecimento datado, então o dossiê agora
 * guarda cada peça do caso com o tipo de evidência da seção de onde ela sai.
 *
 * Nenhum dado novo entra aqui: cada texto reproduz o que já está nas seções
 * `cop-a`, `cop-t`, `cop-u`, `cop-a2` e `cop-h` de `interactiveSummaries.ts`,
 * verificadas contra UNFCCC, Nature e AP em 24/08/2026. `sectionId` amarra a
 * peça à seção, e o teste confere que a seção existe e tem o mesmo tipo.
 */
export type CurrentAffairsContextId = 'cop30-belem';

/** Os mesmos valores de `evidenceKind` das seções do resumo. */
export type EvidenceLens = 'fato' | 'contexto' | 'interpretacao' | 'hipotese';

export const EVIDENCE_LENS_LABEL: Record<EvidenceLens, string> = {
  fato: 'Fato',
  contexto: 'Contexto',
  interpretacao: 'Avaliação',
  hipotese: 'Hipótese',
};

export interface DossierLensInfo {
  lens: EvidenceLens;
  /** Critério que separa este tipo dos outros, curto o bastante para a faixa da equação. */
  rule: string;
  /** Como a prova costuma cobrar a distinção. */
  reading: string;
  sectionId: string;
}

export interface DossierPiece {
  id: string;
  lens: EvidenceLens;
  sectionId: string;
  label: string;
}

export interface DossierStatement {
  id: string;
  text: string;
  lens: EvidenceLens;
  sectionId: string;
  /** Por que a afirmação pertence a esse tipo — a correção vem junto. */
  why: string;
}

export interface CurrentAffairsDossierConfig {
  chapterId: string;
  title: string;
  question: string;
  relation: string;
  caution: string;
  closing: string;
  lenses: DossierLensInfo[];
  pieces: DossierPiece[];
  statements: DossierStatement[];
}

export const CURRENT_AFFAIRS_CONTEXTS: Record<CurrentAffairsContextId, CurrentAffairsDossierConfig> = {
  'cop30-belem': {
    chapterId: 'atu-cop30-belem',
    title: 'COP30: decisão formal e avaliação crítica',
    question: 'O que a COP30 decidiu formalmente em Belém — e o que ficou de fora, segundo a leitura crítica dos resultados?',
    relation: 'fato documental + contexto + avaliação identificada → leitura não binária',
    caution: 'Leitura baseada nas fontes verificadas do dossiê; não substitui o texto integral do Pacote Político de Belém.',
    closing: 'O texto do pacote é fato; dizer que ele foi insuficiente é avaliação — e precisa aparecer como avaliação.',
    lenses: [
      { lens: 'fato', sectionId: 'cop-a', rule: 'verificável no documento', reading: 'O que as Partes adotaram e o que o texto final não estabeleceu. A ausência de rota para os fósseis também é fato: está no texto.' },
      { lens: 'contexto', sectionId: 'cop-t', rule: 'onde, quando e entre quem', reading: 'Dez anos após Paris, em território amazônico, com coalizões de interesses distintos negociando por consenso.' },
      { lens: 'interpretacao', sectionId: 'cop-a2', rule: 'juízo sustentado por fonte', reading: 'Avanço em cooperação, adaptação e financiamento, aquém da ambição defendida por cientistas e organizações.' },
      { lens: 'hipotese', sectionId: 'cop-h', rule: 'cenário condicionado', reading: 'O efeito futuro depende de financiamento, políticas nacionais e prestação de contas; não é resultado confirmado.' },
    ],
    pieces: [
      { id: 'belem', lens: 'fato', sectionId: 'cop-a', label: 'Belém (PA) · 10–22 nov. 2025' },
      { id: 'pacote', lens: 'fato', sectionId: 'cop-a', label: 'Pacote Político de Belém' },
      { id: 'financiamento', lens: 'fato', sectionId: 'cop-a', label: '13 decisões de financiamento (registro da UNFCCC)' },
      { id: 'sem-rota', lens: 'fato', sectionId: 'cop-a', label: 'sem rota formal explícita para abandonar fósseis' },
      { id: 'paris', lens: 'contexto', sectionId: 'cop-t', label: '10 anos após o Acordo de Paris' },
      { id: 'amazonia', lens: 'contexto', sectionId: 'cop-t', label: 'território amazônico' },
      { id: 'vulneraveis', lens: 'contexto', sectionId: 'cop-u', label: 'países vulneráveis: adaptação e financiamento' },
      { id: 'fosseis', lens: 'contexto', sectionId: 'cop-u', label: 'produtores e consumidores de fósseis: divergem sobre a transição' },
      { id: 'sociedade', lens: 'contexto', sectionId: 'cop-u', label: 'sociedade civil e povos indígenas: participação e justiça climática' },
      { id: 'avaliacao', lens: 'interpretacao', sectionId: 'cop-a2', label: 'avanço real, ambição incompleta' },
      { id: 'futuro', lens: 'hipotese', sectionId: 'cop-h', label: 'efeito futuro: depende de implementação' },
    ],
    statements: [
      { id: 's-fin', lens: 'fato', sectionId: 'cop-a', text: 'A UNFCCC registra 13 decisões de financiamento no Pacote Político de Belém.', why: 'É conferível no registro oficial da conferência; ninguém está julgando, só relatando o que foi adotado.' },
      { id: 's-rota', lens: 'fato', sectionId: 'cop-a', text: 'O texto final não estabeleceu uma rota formal explícita para abandonar combustíveis fósseis.', why: 'Pegadinha: parece crítica, mas é fato documental — a ausência se verifica lendo o texto. Chamar isso de insuficiente é que seria avaliação.' },
      { id: 's-territorio', lens: 'contexto', sectionId: 'cop-t', text: 'A conferência ocorreu dez anos após o Acordo de Paris, em território amazônico.', why: 'Situa o acontecimento no tempo e no espaço; não diz o que foi decidido nem se foi bom.' },
      { id: 's-ambicao', lens: 'interpretacao', sectionId: 'cop-a2', text: 'O pacote ficou aquém da ambição defendida por cientistas e organizações.', why: 'É juízo sobre o resultado, sustentado por fontes; na resposta, apresente-o como avaliação, não como dado.' },
      { id: 's-futuro', lens: 'hipotese', sectionId: 'cop-h', text: 'O efeito futuro do pacote dependerá de financiamento, políticas nacionais e prestação de contas.', why: 'Projeta um cenário condicionado; nada disso já aconteceu, então não pode ser tratado como resultado.' },
    ],
  },
};

export function piecesOfLens(config: CurrentAffairsDossierConfig, lens: EvidenceLens): DossierPiece[] {
  return config.pieces.filter((piece) => piece.lens === lens);
}

/** Correção de uma classificação: o tipo escolhido bate com o da seção de origem? */
export function classifyStatement(statement: DossierStatement, answer: EvidenceLens): { correct: boolean; expected: EvidenceLens } {
  return { correct: statement.lens === answer, expected: statement.lens };
}
