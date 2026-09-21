export type GrammarInstrumentId = 'noun-phrase' | 'agreement' | 'comma-scope' | 'crasis' | 'verbal-voice' | 'pronoun-reference' | 'verbal-aspect' | 'ambiguity' | 'clause-relations';
export interface GrammarReadout { label: string; value: string; pivot?: boolean }
export interface GrammarInstrumentConfig {
  id: GrammarInstrumentId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number; display: (value: number) => string };
  relation: string;
  insight: string;
  readouts: (value: number) => GrammarReadout[];
}

export const nounPhrase = (level: number) => [
  ['propostas'],
  ['as', 'propostas'],
  ['as', 'duas', 'propostas'],
  ['as', 'duas', 'propostas', 'urgentes'],
][Math.max(0, Math.min(3, Math.round(level)))];

export const agreementCase = (index: number) => [
  { subject: 'Os estudantes', predicate: 'chegaram cedo', rule: 'verbo no plural' },
  { subject: 'Ø', predicate: 'havia estudantes', rule: 'haver impessoal: singular' },
  { subject: 'Casas', predicate: 'vendem-se', rule: 'sujeito paciente: plural' },
][Math.max(0, Math.min(2, Math.round(index)))];

export const commaReading = (explanatory: boolean) => explanatory
  ? { sentence: 'Os alunos, que estudaram, passaram.', scope: 'todos os alunos', role: 'explicação' }
  : { sentence: 'Os alunos que estudaram passaram.', scope: 'somente os que estudaram', role: 'restrição' };

export const crasisCase = (index: number) => [
  { sentence: 'Entreguei o documento à diretora.', result: 'à', reason: 'preposição a + artigo a' },
  { sentence: 'Encontrei a diretora.', result: 'a', reason: 'o verbo não exige preposição' },
  { sentence: 'Começou a estudar.', result: 'a', reason: 'antes de verbo não há artigo' },
  { sentence: 'Refiro-me àquele episódio.', result: 'àquele', reason: 'preposição a + aquele' },
][Math.max(0, Math.min(3, Math.round(index)))];

export const voiceCase = (index: number) => [
  { sentence: 'O professor corrigiu as provas.', focus: 'agente', agent: 'professor', patient: 'provas' },
  { sentence: 'As provas foram corrigidas pelo professor.', focus: 'paciente', agent: 'professor', patient: 'provas' },
  { sentence: 'As provas foram corrigidas.', focus: 'agente oculto', agent: 'não informado', patient: 'provas' },
][Math.max(0, Math.min(2, Math.round(index)))];

export const GRAMMAR_INSTRUMENTS: Record<GrammarInstrumentId, GrammarInstrumentConfig> = {
  'noun-phrase': {
    id: 'noun-phrase', name: 'Arquitetura do sintagma nominal', question: 'O que muda quando determinantes e modificadores cercam o núcleo?',
    control: { label: 'Camadas do sintagma', description: 'núcleo, artigo, numeral e adjetivo', min: 0, max: 3, step: 1, initial: 3, display: (v) => `${Math.round(v) + 1} termos` },
    relation: 'determinantes + substantivo nuclear + modificadores',
    insight: 'O substantivo é o núcleo; artigo e numeral determinam sua referência, enquanto o adjetivo modifica o sentido.',
    readouts: (v) => { const words = nounPhrase(v); return [
      { label: 'Sintagma', value: words.join(' '), pivot: true }, { label: 'Núcleo', value: 'propostas' },
      { label: 'Satélites', value: String(words.length - 1) },
    ]; },
  },
  agreement: {
    id: 'agreement', name: 'Concordância em contexto', question: 'A forma verbal acompanha qual elemento da oração?',
    control: { label: 'Construção', description: 'regular, impessoal ou passiva sintética', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['sujeito expresso', 'haver impessoal', 'passiva com se'][Math.round(v)] },
    relation: 'o verbo concorda com o sujeito; verbo impessoal permanece singular',
    insight: 'Encontrar o sujeito antes de flexionar evita tanto “haviam estudantes” quanto “vende-se casas”.',
    readouts: (v) => { const item = agreementCase(v); return [
      { label: 'Sujeito', value: item.subject }, { label: 'Predicado', value: item.predicate, pivot: true }, { label: 'Regra', value: item.rule },
    ]; },
  },
  'comma-scope': {
    id: 'comma-scope', name: 'Vírgula e alcance da afirmação', question: 'As vírgulas restringem o grupo ou apresentam uma explicação?',
    control: { label: 'Leitura da oração', description: 'retire ou acrescente o par de vírgulas', min: 0, max: 1, step: 1, initial: 0, display: (v) => v ? 'explicativa' : 'restritiva' },
    relation: 'sem vírgulas: restringe · com duas vírgulas: explica',
    insight: 'Pontuação organiza relações sintáticas: um par de vírgulas pode mudar quais indivíduos a afirmação alcança.',
    readouts: (v) => { const item = commaReading(Boolean(v)); return [
      { label: 'Frase', value: item.sentence, pivot: true }, { label: 'Alcance', value: item.scope }, { label: 'Papel', value: item.role },
    ]; },
  },
  crasis: {
    id: 'crasis', name: 'Encontro que produz crase', question: 'Há simultaneamente preposição a e artigo ou demonstrativo iniciado por a?',
    control: { label: 'Contexto', description: 'teste a exigência anterior e a admissão posterior', min: 0, max: 3, step: 1, initial: 0, display: (v) => `caso ${Math.round(v) + 1}` },
    relation: 'a (preposição) + a/as/aquela(s)/aquele(s)/aquilo = à…',
    insight: 'Palavra feminina não basta: o acento grave só aparece quando dois elementos gramaticais se fundem.',
    readouts: (v) => { const item = crasisCase(v); return [
      { label: 'Frase', value: item.sentence }, { label: 'Forma', value: item.result, pivot: true }, { label: 'Diagnóstico', value: item.reason },
    ]; },
  },
  'verbal-voice': {
    id: 'verbal-voice', name: 'Papéis nas vozes verbais', question: 'Como mudar o foco sem trocar quem age e quem recebe a ação?',
    control: { label: 'Voz e explicitação', description: 'ativa, passiva com agente ou passiva sem agente', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['ativa', 'passiva analítica', 'passiva sem agente'][Math.round(v)] },
    relation: 'ativa: agente é sujeito · passiva: paciente é sujeito',
    insight: 'A voz muda o foco informacional; omitir o agente na passiva também produz efeito argumentativo.',
    readouts: (v) => { const item = voiceCase(v); return [
      { label: 'Frase', value: item.sentence, pivot: true }, { label: 'Foco', value: item.focus }, { label: 'Agente', value: item.agent },
    ]; },
  },
  'pronoun-reference': {
    id: 'pronoun-reference', name: 'Pronome e referente no texto', question: 'A que termo o pronome retoma — e como o contexto impede uma leitura solta?',
    control: { label: 'Retomada', description: 'altere o referente disponível na frase', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['retomada nominal', 'retomada de ideia', 'referência ambígua'][Math.round(v)] }, relation: 'pronome + contexto anterior → referente recuperado', insight: 'Pronome não aponta sozinho: a coesão depende do termo ou ideia recuperável e da ausência de concorrentes plausíveis.',
    readouts: (v) => [{ label: 'Construção', value: ['Marina entregou o relatório. Ela revisou os dados.', 'A cidade cresceu sem planejamento. Isso ampliou o risco.', 'Ana contou a Bia que ela chegaria cedo.'][Math.round(v)], pivot: true }, { label: 'Referente', value: ['Marina', 'o crescimento sem planejamento', 'Ana ou Bia: falta desambiguar'][Math.round(v)] }, { label: 'Teste', value: ['retomada nominal clara', 'retomada de uma proposição', 'reescrever com o nome'][Math.round(v)] }],
  },
  'verbal-aspect': {
    id: 'verbal-aspect', name: 'Tempo, aspecto e efeito verbal', question: 'A forma verbal apresenta hábito, ação em curso ou fato concluído?',
    control: { label: 'Forma verbal', description: 'compare o recorte temporal que cada forma produz', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['estudava', 'está estudando', 'estudou'][Math.round(v)] }, relation: 'tempo + aspecto → perspectiva sobre a ação', insight: 'Tempo localiza; aspecto mostra a ação por dentro, como hábito, processo ou conclusão. Trocar a forma verbal muda a cena construída.',
    readouts: (v) => [{ label: 'Frase', value: ['Ela estudava à noite.', 'Ela está estudando agora.', 'Ela estudou ontem.'][Math.round(v)], pivot: true }, { label: 'Recorte', value: ['hábito ou ação em desenvolvimento no passado', 'processo em curso no presente', 'evento terminado'][Math.round(v)] }, { label: 'Efeito', value: ['duração sem limite fechado', 'flagrante da ação', 'resultado concluído'][Math.round(v)] }],
  },
  ambiguity: {
    id: 'ambiguity', name: 'Ambiguidade que a sintaxe cria', question: 'Onde uma mesma sequência permite duas leituras — e como a reescrita decide uma delas?',
    control: { label: 'Leitura', description: 'selecione o vínculo que a frase deixa em disputa', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['ambígua', 'instrumento', 'companhia'][Math.round(v)] }, relation: 'posição + vínculo sintático → interpretação', insight: 'Ambiguidade não é apenas palavra “com dois sentidos”: posição e encaixe dos termos podem produzir mais de uma análise sintática.',
    readouts: (v) => [{ label: 'Frase', value: ['Vi a aluna com o telescópio.', 'Vi a aluna usando o telescópio.', 'Vi a aluna que estava com o telescópio.'][Math.round(v)], pivot: true }, { label: 'Leitura', value: ['quem usava o telescópio não fica definido', 'o observador usa o instrumento', 'a aluna porta o instrumento'][Math.round(v)] }, { label: 'Reparo', value: ['explicitar o vínculo', 'adjunto do verbo', 'oração relativa da aluna'][Math.round(v)] }],
  },
  'clause-relations': {
    id: 'clause-relations', name: 'Conectivo e relação entre orações', question: 'O conectivo soma, contrasta ou apresenta consequência?',
    control: { label: 'Relação', description: 'mude o conectivo e confira a seta lógica', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['adição', 'contraste', 'consequência'][Math.round(v)] }, relation: 'oração A + conectivo + oração B → relação de sentido', insight: 'Conectivo é uma instrução de leitura: trocar “mas” por “portanto” não é trocar estilo, é mudar a relação que organiza o argumento.',
    readouts: (v) => [{ label: 'Período', value: ['Leu os dados e comparou as fontes.', 'Leu os dados, mas não comparou as fontes.', 'Não comparou as fontes; portanto, errou a conclusão.'][Math.round(v)], pivot: true }, { label: 'Relação', value: ['acréscimo de ação', 'quebra de expectativa', 'resultado inferido'][Math.round(v)] }, { label: 'Pergunta', value: ['o que se soma?', 'o que se opõe?', 'o que decorre?'][Math.round(v)] }],
  },
};
