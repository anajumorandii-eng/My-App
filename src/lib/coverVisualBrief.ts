import { selectCoverTheme, type PrintCoverContext } from './printCoverSpec';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const isBroad = (value: string) => /^(visao geral|obra completa|topico completo|conteudo completo|geral)$/.test(normalize(value.trim()));
const languageMotifs = [
  { match: /sintax|orac|periodo composto|concordancia|regencia|crase|colocacao pronominal|pontuacao/, motif: 'Sentence structure: interrelated manuscript passages, nested clause groupings, dependency branches and editorial marks connecting the relevant sentence parts; no readable invented sentences.' },
  { match: /morfolog|verb|substantiv|adjetiv|pronome|formacao de palavras|classes de palavras|flexao/, motif: 'Word structure: movable typographic pieces, word-family groupings and layered manuscript fragments suggesting the selected grammatical category or inflection, without invented readable words.' },
  { match: /fonet|fonolog|fonema|silab|acentuacao|ortografia/, motif: 'Sound and writing: manuscript fragments paired with restrained sound-wave traces and rhythmic syllabic groupings appropriate to the selected sound or spelling relationship.' },
  { match: /semantic|sentido|figuras de linguagem|metafora|ambiguidade|polissemia|intertextual|interpretacao|coesao|coerencia/, motif: 'Meaning and reading: layered passages with highlighted correspondences, contrasting or overlapping text fragments and connected editorial marks representing the selected relation of meaning.' },
  { match: /comunicacao|funcoes da linguagem|referencial|emotiv|conativ|apelativ|expressiv|fatic|metalingu|funcao poetica|variacao linguistica|generos textuais|linguistica/, motif: 'Communication and language use: connected letters, correspondence sheets, speech-recording traces and different text formats representing the selected communicative situation, without personifications.' },
  { match: /redacao|argument|dissert|tese|escrita|producao textual/, motif: 'Composition and argument: manuscript revisions and connected passages showing an ordered claim, supporting evidence and conclusion, with relevant editorial tools.' },
];

/** Semantic instructions precede aesthetic instructions; metadata remains quoted data. */
export function buildCoverVisualBrief(context: PrintCoverContext) {
  const theme = selectCoverTheme(context);
  const specific = context.subtopic?.trim();
  const scope = specific && !isBroad(specific) ? specific : context.work || context.topic || '';
  const textScope = normalize(scope);
  const linguistic = theme === 'language' || theme === 'writing';
  const motifs = linguistic ? languageMotifs.filter(rule => rule.match.test(textScope)).map(rule => rule.motif) : [];
  return {
    scope,
    theme,
    motifs: motifs.length ? motifs : [linguistic
      ? 'Choose textual relationships and editorial objects that express the exact selected scope, not a generic portrait of someone reading.'
      : 'Choose the objects, processes or relationships required by this exact scope; do not substitute a discipline-wide emblem.'],
    scopeRule: 'These motifs are guidance, not an inventory. Include only relationships present in the selected scope. For combined scopes integrate their relationships; do not add unrelated motifs from the broader topic.',
    humanFigures: linguistic
      ? 'Do not depict any woman, man, reader, face, portrait, bust, statue, muse or human silhouette as an allegory of language, grammar or writing. The textual relationship is the subject of the image.'
      : 'A human figure is allowed only when the selected content itself requires a particular person, character, population or human process. Never add a generic woman, reader, muse, portrait or classical bust to symbolize a discipline. For literature, prefer settings, objects and relationships grounded in the identified work and interpretive scope; do not invent character appearances, costumes or episodes.',
    relevanceCheck: 'Before rendering, check that the dominant motif and every supporting object can be justified by the quoted topic, work or selected subtopic. Remove any decorative figure or object that cannot. Never derive imagery from the exam board, document type, language name alone or from the art style.',
  };
}
