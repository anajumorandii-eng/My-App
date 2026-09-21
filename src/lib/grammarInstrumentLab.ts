export type GrammarInstrumentId = 'noun-phrase' | 'agreement' | 'comma-scope' | 'crasis' | 'verbal-voice' | 'pronoun-reference' | 'verbal-aspect' | 'ambiguity' | 'clause-relations'
  | 'language-system' | 'noun-class' | 'text-type' | 'adverb-circumstance' | 'verb-syntax' | 'implicit-meaning' | 'discourse-type' | 'clause-punctuation'
  | 'lexical-context' | 'government' | 'word-formation' | 'nominal-function' | 'subject-type' | 'noun-clause' | 'adjective-clause' | 'adverbial-clause';
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
  'language-system': {
    id: 'language-system', name: 'A língua como sistema de níveis', question: 'Uma troca em um nível da língua muda o que nos níveis seguintes?',
    control: { label: 'Nível trocado', description: 'fonema, morfema ou ordem sintática', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['fonema', 'morfema', 'sintaxe'][Math.round(v)] }, relation: 'fonema < morfema < palavra < frase, cada nível construído sobre o anterior', insight: 'Língua é sistema porque os níveis são interdependentes: trocar uma unidade pequena (um fonema, um sufixo, uma posição) reorganiza o sentido no nível de cima.',
    readouts: (v) => [{ label: 'Troca', value: ['“pato” → “bato” (p→b)', '“gato” → “gatinho” (+inho)', '“O cão mordeu o gato.” → “O gato mordeu o cão.”'][Math.round(v)], pivot: true }, { label: 'Nível afetado', value: ['palavra inteira muda de referente', 'grau/afetividade muda sem trocar o referente', 'papel de agente e paciente se inverte'][Math.round(v)] }, { label: 'Unidade mínima', value: ['fonema distintivo', 'morfema derivacional', 'ordem dos termos'][Math.round(v)] }],
  },
  'noun-class': {
    id: 'noun-class', name: 'O substantivo e a visão do enunciador', question: 'O nome recorta um objeto do mundo, uma qualidade ou um grupo visto como um só?',
    control: { label: 'Classe do nome', description: 'comum concreto, abstrato ou coletivo', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['concreto', 'abstrato', 'coletivo'][Math.round(v)] }, relation: 'o enunciador escolhe nomear objeto, estado ou conjunto', insight: 'Substantivo não é só “nome de coisa”: abstrato nomeia o que só existe na percepção de quem fala, e coletivo condensa vários seres num único nome singular.',
    readouts: (v) => [{ label: 'Substantivo', value: ['cadeira', 'coragem', 'cardume'][Math.round(v)], pivot: true }, { label: 'O que nomeia', value: ['um objeto que existe fora da fala', 'uma qualidade que só existe na ideia do enunciador', 'vários seres agrupados sob um nome no singular'][Math.round(v)] }, { label: 'Teste', value: ['aponta-se no mundo', 'não se toca, só se concebe', '“cardume” = muitos peixes, um substantivo'][Math.round(v)] }],
  },
  'text-type': {
    id: 'text-type', name: 'O que organiza cada tipo de texto', question: 'O texto avança por ações, por propriedades ou por conceitos abstratos?',
    control: { label: 'Tipo predominante', description: 'narrativo, descritivo ou dissertativo', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['narrativo', 'descritivo', 'dissertativo'][Math.round(v)] }, relation: 'elemento concreto (ação, propriedade) vs. conceito abstrato organizam o texto', insight: 'Tipos de texto não são rótulos de gênero: cada um organiza a informação por um eixo diferente — sucessão de ações, propriedades de um objeto, ou relações entre ideias abstratas.',
    readouts: (v) => [{ label: 'Trecho', value: ['Ela abriu a porta e entrou correndo.', 'A sala era pequena, com paredes brancas.', 'A liberdade individual pressupõe responsabilidade social.'][Math.round(v)], pivot: true }, { label: 'Eixo do texto', value: ['sucessão de ações no tempo', 'propriedades concretas de um espaço', 'relação entre conceitos abstratos'][Math.round(v)] }, { label: 'Pergunta que guia', value: ['o que aconteceu depois?', 'como é isso?', 'por que isso se relaciona com aquilo?'][Math.round(v)] }],
  },
  'adverb-circumstance': {
    id: 'adverb-circumstance', name: 'O advérbio e a circunstância que ele marca', question: 'O advérbio informa quando, onde ou como?',
    control: { label: 'Circunstância', description: 'tempo, lugar ou modo', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['tempo', 'lugar', 'modo'][Math.round(v)] }, relation: 'advérbio/locução adverbial + verbo → circunstância do fato', insight: 'Advérbio não modifica só o verbo: ele responde a uma pergunta específica (quando? onde? como?), e é essa pergunta que nomeia a circunstância.',
    readouts: (v) => [{ label: 'Frase', value: ['Ela chegou ontem.', 'Ela mora aqui.', 'Ela respondeu calmamente.'][Math.round(v)], pivot: true }, { label: 'Advérbio', value: ['ontem', 'aqui', 'calmamente'][Math.round(v)] }, { label: 'Pergunta-teste', value: ['quando?', 'onde?', 'como?'][Math.round(v)] }],
  },
  'verb-syntax': {
    id: 'verb-syntax', name: 'O verbo e o que a oração exige dele', question: 'O verbo se basta sozinho, exige um objeto ou liga o sujeito a uma característica?',
    control: { label: 'Exigência sintática', description: 'intransitivo, transitivo direto ou de ligação', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['intransitivo', 'transitivo direto', 'de ligação'][Math.round(v)] }, relation: 'verbo → (nada) | objeto direto | predicativo do sujeito', insight: 'A sintaxe da oração nasce da exigência do verbo: um verbo intransitivo fecha sentido sozinho, um transitivo pede complemento, e um de ligação nem descreve ação — liga o sujeito a uma qualidade.',
    readouts: (v) => [{ label: 'Oração', value: ['O bebê chorou.', 'Ela encontrou o livro.', 'Ela parece cansada.'][Math.round(v)], pivot: true }, { label: 'O que completa', value: ['nada: sentido já fechado', 'objeto direto: “o livro”', 'predicativo do sujeito: “cansada”'][Math.round(v)] }, { label: 'Teste', value: ['chorou o quê? — pergunta não cabe', 'encontrou o quê? — pede resposta', 'liga sujeito e qualidade, sem ação'][Math.round(v)] }],
  },
  'implicit-meaning': {
    id: 'implicit-meaning', name: 'O que a frase deixa implícito', question: 'O implícito vem do próprio verbo, de uma palavra-chave ou do contexto da fala?',
    control: { label: 'Fonte do implícito', description: 'pressuposto lexical, pressuposto marcado ou subentendido', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['pressuposto lexical', 'pressuposto marcado', 'subentendido'][Math.round(v)] }, relation: 'verbo factivo / palavra pressuposicional / contexto → conteúdo não dito', insight: 'Pressuposto está preso à estrutura da frase (nega-la e ele continua valendo); subentendido depende da situação e pode ser negado sem contradição.',
    readouts: (v) => [{ label: 'Frase', value: ['Pedro parou de fumar.', 'Até o João passou na prova.', '— Você pode passar o sal?'][Math.round(v)], pivot: true }, { label: 'O que fica implícito', value: ['Pedro fumava antes', 'outros também passaram, e João era o menos esperado', 'um pedido, não uma dúvida sobre capacidade'][Math.round(v)] }, { label: 'Mecanismo', value: ['verbo aspectual “parar”', 'partícula “até”', 'implicatura da situação de fala'][Math.round(v)] }],
  },
  'discourse-type': {
    id: 'discourse-type', name: 'Como a fala de alguém entra no texto', question: 'A fala é reproduzida literalmente, resumida pelo narrador ou fundida à narração?',
    control: { label: 'Tipo de discurso', description: 'direto, indireto ou indireto livre', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['direto', 'indireto', 'indireto livre'][Math.round(v)] }, relation: 'fala do personagem + narrador → grau de fusão das vozes', insight: 'O discurso direto preserva a voz do personagem entre marcas gráficas; o indireto a converte à voz do narrador; o indireto livre mistura as duas sem aviso, e é essa ausência de marca que muda a leitura.',
    readouts: (v) => [{ label: 'Trecho', value: ['Ela disse: “Vou viajar amanhã.”', 'Ela disse que viajaria no dia seguinte.', 'Ela olhou pela janela. Viajaria amanhã, enfim.'][Math.round(v)], pivot: true }, { label: 'Marca', value: ['dois-pontos e aspas/travessão', 'conjunção integrante “que”', 'nenhuma marca gráfica'][Math.round(v)] }, { label: 'Tempo verbal', value: ['mantido da fala original', 'deslocado para o passado', 'do narrador, mas com a perspectiva do personagem'][Math.round(v)] }],
  },
  'clause-punctuation': {
    id: 'clause-punctuation', name: 'Vírgula, ponto e vírgula e dois-pontos entre orações', question: 'O sinal separa orações simples, orações já pontuadas por dentro, ou introduz uma explicação?',
    control: { label: 'Sinal', description: 'vírgula, ponto e vírgula ou dois-pontos', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['vírgula', 'ponto e vírgula', 'dois-pontos'][Math.round(v)] }, relation: 'orações coordenadas + sinal → separação, hierarquia ou explicação', insight: 'Ponto e vírgula não é “vírgula mais forte”: ele separa orações que já têm vírgula interna, evitando ambiguidade que a vírgula sozinha criaria.',
    readouts: (v) => [{ label: 'Período', value: ['Chegou, sentou, começou a escrever.', 'As metas foram cumpridas; os prazos, respeitados.', 'Faltava uma coisa: coragem.'][Math.round(v)], pivot: true }, { label: 'Função', value: ['separa orações coordenadas assindéticas', 'separa orações que já usam vírgula por dentro', 'introduz explicação ou aposto'][Math.round(v)] }, { label: 'Risco sem o sinal', value: ['orações se fundem numa leitura confusa', 'a segunda vírgula interna se perde entre as orações', 'a explicação parece continuação da frase'][Math.round(v)] }],
  },
  'lexical-context': {
    id: 'lexical-context', name: 'A mesma palavra, sentidos diferentes', question: 'O contexto ao redor da palavra decide qual dos sentidos possíveis vale aqui?',
    control: { label: 'Contexto', description: 'troque a frase ao redor da palavra “banco”', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['instituição', 'assento', 'conjunto de dados'][Math.round(v)] }, relation: 'palavra polissêmica + contexto → sentido ativado', insight: 'Polissemia não se resolve pela palavra isolada: é o entorno sintático e semântico que ativa um sentido entre vários possíveis para a mesma forma.',
    readouts: (v) => [{ label: 'Frase', value: ['Sacou dinheiro no banco.', 'Sentou no banco da praça.', 'Consultou o banco de dados.'][Math.round(v)], pivot: true }, { label: 'Sentido ativado', value: ['instituição financeira', 'assento público', 'conjunto organizado de informações'][Math.round(v)] }, { label: 'Pista no contexto', value: ['“sacou dinheiro”', '“da praça”', '“de dados”'][Math.round(v)] }],
  },
  government: {
    id: 'government', name: 'A preposição que o verbo exige', question: 'Qual preposição o verbo pede para introduzir seu complemento?',
    control: { label: 'Verbo regente', description: 'troque o verbo e a preposição que ele exige', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['assistir', 'obedecer', 'precisar'][Math.round(v)] }, relation: 'verbo regente + preposição exigida + complemento', insight: 'Regência não é decoreba solta: cada verbo tem uma exigência própria de preposição, e trocar o verbo sem checar essa exigência é o erro mais comum de regência.',
    readouts: (v) => [{ label: 'Frase', value: ['Assisti ao filme.', 'Obedeço às regras.', 'Preciso de ajuda.'][Math.round(v)], pivot: true }, { label: 'Preposição exigida', value: ['a', 'a', 'de'][Math.round(v)] }, { label: 'Complemento', value: ['ao filme (objeto indireto)', 'às regras (objeto indireto)', 'de ajuda (objeto indireto)'][Math.round(v)] }],
  },
  'word-formation': {
    id: 'word-formation', name: 'De onde vem cada palavra', question: 'A palavra nova ganha um afixo ou nasce da junção de duas palavras já existentes?',
    control: { label: 'Processo', description: 'sufixação, prefixação ou composição', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['sufixação', 'prefixação', 'composição'][Math.round(v)] }, relation: 'base + afixo, ou base + base → palavra nova', insight: 'Derivação acrescenta um afixo a uma base já existente; composição junta duas bases que já eram palavras — “girassol” não deriva de “gira”, nasce da soma de duas.',
    readouts: (v) => [{ label: 'Palavra formada', value: ['felicidade', 'infeliz', 'girassol'][Math.round(v)], pivot: true }, { label: 'Formação', value: ['feliz + -idade', 'in- + feliz', 'gira + sol'][Math.round(v)] }, { label: 'Processo', value: ['sufixação: afixo depois da base', 'prefixação: afixo antes da base', 'composição: duas palavras já existentes se juntam'][Math.round(v)] }],
  },
  'nominal-function': {
    id: 'nominal-function', name: 'O substantivo muda de função na oração', question: 'O termo pratica a ação, recebe a ação ou apenas chama alguém?',
    control: { label: 'Função', description: 'sujeito, objeto direto ou vocativo', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['sujeito', 'objeto direto', 'vocativo'][Math.round(v)] }, relation: 'substantivo ocupa uma posição sintática diferente a cada função', insight: 'Vocativo não é complemento de nada: é um chamamento isolado por pontuação, fora da estrutura sujeito-predicado da oração — por isso não responde “quem?” nem “o quê?”.',
    readouts: (v) => [{ label: 'Oração', value: ['O aluno estudou.', 'Vi o aluno.', 'Aluno, preste atenção!'][Math.round(v)], pivot: true }, { label: 'Função de “aluno”', value: ['sujeito: quem pratica a ação', 'objeto direto: quem recebe a ação', 'vocativo: chamamento, fora da oração'][Math.round(v)] }, { label: 'Teste', value: ['quem estudou?', 'vi quem/o quê?', 'isolado por vírgula, sem função sintática'][Math.round(v)] }],
  },
  'subject-type': {
    id: 'subject-type', name: 'Onde está o sujeito da oração', question: 'O sujeito aparece expresso, some mas fica recuperável pela desinência, ou nem existe?',
    control: { label: 'Tipo de sujeito', description: 'simples, indeterminado ou inexistente', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['simples', 'indeterminado', 'inexistente'][Math.round(v)] }, relation: 'sujeito expresso | sujeito não identificável | oração sem sujeito', insight: 'Sujeito indeterminado existe mas não se sabe quem é; oração sem sujeito não tem ninguém para ser sujeito — verbos de fenômeno da natureza não têm agente a declarar.',
    readouts: (v) => [{ label: 'Oração', value: ['Os alunos chegaram.', 'Falaram mal do filme.', 'Choveu à noite.'][Math.round(v)], pivot: true }, { label: 'Tipo', value: ['simples: núcleo “alunos” expresso', 'indeterminado: verbo na 3ª pessoa do plural sem referente definido', 'inexistente: verbo de fenômeno da natureza, sem sujeito possível'][Math.round(v)] }, { label: 'Pista', value: ['sujeito nomeado na frase', 'quem falou não é dito nem recuperável', '“chover” não tem agente'][Math.round(v)] }],
  },
  'noun-clause': {
    id: 'noun-clause', name: 'A oração que funciona como substantivo', question: 'A oração substantiva é sujeito, objeto direto do verbo, ou completa um nome?',
    control: { label: 'Função', description: 'subjetiva, objetiva direta ou completiva nominal', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['subjetiva', 'objetiva direta', 'completiva nominal'][Math.round(v)] }, relation: 'oração inteira ocupa a posição de um substantivo', insight: 'Trocar a oração substantiva por “isso” revela a função: se “isso” vira sujeito, é subjetiva; se vira objeto do verbo, é objetiva direta; se completa um nome, é completiva nominal.',
    readouts: (v) => [{ label: 'Período', value: ['É importante que ela estude.', 'Ela espera que ele chegue.', 'Ela tem certeza de que vencerá.'][Math.round(v)], pivot: true }, { label: 'Função', value: ['subjetiva: sujeito de “é importante”', 'objetiva direta: objeto de “espera”', 'completiva nominal: completa o nome “certeza”'][Math.round(v)] }, { label: 'Teste', value: ['“Isso é importante.”', '“Ela espera isso.”', '“Ela tem certeza disso.”'][Math.round(v)] }],
  },
  'adjective-clause': {
    id: 'adjective-clause', name: 'A oração que qualifica um antecedente', question: 'A oração adjetiva restringe o antecedente, o descreve à parte, ou retoma um lugar?',
    control: { label: 'Relação com o antecedente', description: 'restritiva, explicativa ou pronome locativo', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['restritiva', 'explicativa', 'locativa'][Math.round(v)] }, relation: 'antecedente + pronome relativo + oração adjetiva', insight: 'O pronome relativo retoma um antecedente e abre uma oração que funciona como adjetivo dele — restringindo o grupo, acrescentando informação, ou, com “onde”, retomando um lugar.',
    readouts: (v) => [{ label: 'Período', value: ['Os alunos que estudaram passaram.', 'Os alunos, que estudaram bastante, passaram.', 'A cidade onde nasci mudou muito.'][Math.round(v)], pivot: true }, { label: 'Pronome relativo', value: ['que', 'que', 'onde'][Math.round(v)] }, { label: 'Antecedente', value: ['alunos, restrito ao grupo que estudou', 'alunos, todos, com informação a mais', 'cidade, retomada como lugar'][Math.round(v)] }],
  },
  'adverbial-clause': {
    id: 'adverbial-clause', name: 'A oração que circunstancia a principal', question: 'A oração adverbial explica a causa, impõe uma condição, ou contraria a expectativa?',
    control: { label: 'Relação', description: 'causal, condicional ou concessiva', min: 0, max: 2, step: 1, initial: 0, display: (v) => ['causal', 'condicional', 'concessiva'][Math.round(v)] }, relation: 'conectivo + oração adverbial → circunstância da oração principal', insight: 'Cada conjunção subordinativa adverbial fixa uma relação lógica própria: “como” explica causa, “se” impõe condição, “embora” admite um fato e ainda assim contraria a expectativa que ele criaria.',
    readouts: (v) => [{ label: 'Período', value: ['Como estava chovendo, adiamos o passeio.', 'Se estudar, ela passará.', 'Embora estivesse cansada, ela terminou o trabalho.'][Math.round(v)], pivot: true }, { label: 'Conectivo', value: ['como', 'se', 'embora'][Math.round(v)] }, { label: 'Relação', value: ['causa do fato principal', 'condição para o fato principal', 'concessão: contraria a expectativa, mas não impede'][Math.round(v)] }],
  },
};
