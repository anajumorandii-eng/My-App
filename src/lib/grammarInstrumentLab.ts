export type GrammarInstrumentId = 'noun-phrase' | 'agreement' | 'comma-scope' | 'crasis' | 'verbal-voice';
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
};
