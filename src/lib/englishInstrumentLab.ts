export type EnglishInstrumentId =
  | 'poetry-reading'
  | 'quantity-language'
  | 'modal-certainty'
  | 'cause-connectors'
  | 'research-claims'
  | 'narrative-inference'
  | 'lexical-inference'
  | 'comparison-signals'
  | 'stance-language';

export interface EnglishInstrumentState {
  label: string;
  example: string;
  reading: string;
  trap: string;
}

export interface EnglishInstrumentConfig {
  id: EnglishInstrumentId;
  name: string;
  question: string;
  controlLabel: string;
  controlDescription: string;
  formula: string;
  insight: string;
  states: EnglishInstrumentState[];
}

export const ENGLISH_INSTRUMENTS: Record<EnglishInstrumentId, EnglishInstrumentConfig> = {
  'poetry-reading': {
    id: 'poetry-reading',
    name: 'Camadas de leitura poética',
    question: 'Mude a lente de leitura para distinguir repetição, contraste e metáfora.',
    controlLabel: 'Lente',
    controlDescription: 'selecione o recurso que organiza o trecho',
    formula: 'forma + contexto → efeito de sentido',
    insight: 'em poema ou canção, reconhecer palavras não basta: a forma como elas retornam, se opõem ou figuram muda o sentido.',
    states: [
      { label: 'Repetition', example: 'Still I wait. Still I listen.', reading: '“still” concentra persistência', trap: 'tratar a repetição como redundância' },
      { label: 'Contrast', example: 'The room is loud, my thoughts are quiet.', reading: 'loud × quiet organiza a tensão', trap: 'ler as duas imagens isoladamente' },
      { label: 'Metaphor', example: 'Hope is a door left open.', reading: 'door representa possibilidade', trap: 'procurar uma porta literal' },
    ],
  },
  'quantity-language': {
    id: 'quantity-language',
    name: 'Números com limites diferentes',
    question: 'Compare expressões que mudam completamente o alcance de um mesmo número.',
    controlLabel: 'Expressão',
    controlDescription: 'mude a relação quantitativa',
    formula: 'número + operador linguístico = intervalo',
    insight: 'a alternativa precisa preservar não só o número, mas também se ele é teto, piso ou multiplicador.',
    states: [
      { label: 'up to 30%', example: 'The body may use up to 30%.', reading: 'no máximo 30%', trap: 'interpretar como exatamente 30%' },
      { label: 'at least 30%', example: 'The body uses at least 30%.', reading: '30% ou mais', trap: 'interpretar como no máximo 30%' },
      { label: 'twice as much', example: 'Group A used twice as much energy.', reading: 'o dobro da referência', trap: 'somar apenas duas unidades' },
    ],
  },
  'modal-certainty': {
    id: 'modal-certainty',
    name: 'Escala de certeza científica',
    question: 'Troque o modal e observe o quanto a afirmação autoriza concluir.',
    controlLabel: 'Modal',
    controlDescription: 'mude o grau de certeza da previsão',
    formula: 'modal → força da afirmação',
    insight: 'may e might preservam possibilidade; expected to projeta expectativa; will formula previsão mais forte, não uma constatação presente.',
    states: [
      { label: 'might', example: 'Aftershocks might occur.', reading: 'possibilidade cautelosa', trap: 'afirmar que ocorrerão' },
      { label: 'is expected to', example: 'Aftershocks are expected to occur.', reading: 'expectativa fundamentada', trap: 'dizer que já ocorreram' },
      { label: 'will', example: 'Aftershocks will occur.', reading: 'previsão categórica', trap: 'trocar previsão por fato passado' },
    ],
  },
  'cause-connectors': {
    id: 'cause-connectors',
    name: 'Direção dos conectores causais',
    question: 'Mude o conector sem perder quem é causa e quem é consequência.',
    controlLabel: 'Conector',
    controlDescription: 'selecione a estrutura causal',
    formula: 'causa → consequência',
    insight: 'because e due to apresentam a causa; therefore e as a result introduzem a consequência. A direção lógica deve permanecer.',
    states: [
      { label: 'because', example: 'Temperatures rise because gases retain heat.', reading: 'efeito because causa', trap: 'atribuir a elevação aos termômetros' },
      { label: 'therefore', example: 'Gases retain heat; therefore, temperatures rise.', reading: 'causa; therefore, efeito', trap: 'inverter a seta causal' },
      { label: 'as a result of', example: 'Temperatures rise as a result of heat retention.', reading: 'efeito as a result of causa', trap: 'ler como simples sequência temporal' },
    ],
  },
  'research-claims': {
    id: 'research-claims',
    name: 'O que um estudo permite afirmar',
    question: 'Suba a força da frase e identifique onde a conclusão ultrapassa a evidência descrita.',
    controlLabel: 'Afirmação',
    controlDescription: 'mude a força inferencial da conclusão',
    formula: 'desenho do estudo → limite da conclusão',
    insight: 'associação observada não demonstra causalidade nem garante que o resultado valha para toda população.',
    states: [
      { label: 'is associated with', example: 'Poor sleep is associated with memory problems.', reading: 'há associação observada', trap: 'inferir direção causal' },
      { label: 'may contribute to', example: 'Poor sleep may contribute to memory problems.', reading: 'causalidade possível e parcial', trap: 'apagar o modal e outros fatores' },
      { label: 'causes', example: 'Poor sleep causes memory problems.', reading: 'causalidade direta', trap: 'aceitar sem desenho causal' },
    ],
  },
  // Reusado por Hurricanes e Stem Cells: previsão de furacão e projeção sobre
  // terapia com células-tronco usam exatamente a mesma escala modal
  // (might/is expected to/will) que earthquakes já cobria — não é o mesmo
  // texto-fonte, é a mesma estrutura gramatical de cautela científica, o que
  // é a razão de o instrumento existir (ver `curveFamilies` para o precedente
  // em Matemática: uma família serve vários capítulos por ser o mesmo objeto).
  'narrative-inference': {
    id: 'narrative-inference',
    name: 'Sentimento mostrado, não dito',
    question: 'Troque como o sentimento chega ao leitor: dito, mostrado por ação ou por fala cortada.',
    controlLabel: 'Modo de indicação',
    controlDescription: 'mude como o texto revela o sentimento',
    formula: 'ação/fala + contexto → sentimento implícito',
    insight: 'narrativa raramente nomeia o sentimento; ele aparece por gesto, por fala que contradiz o gesto, ou pelo que a personagem deixa de dizer.',
    states: [
      { label: 'Told directly', example: 'She was angry.', reading: 'o sentimento está escrito na frase', trap: 'procurar inferência onde o texto já afirma' },
      { label: 'Shown by action', example: 'She slammed the door and said nothing.', reading: 'o gesto (bater a porta) substitui o rótulo do sentimento', trap: 'ler a ação apenas como evento, sem o que ela indica' },
      { label: 'Undercut by dialogue', example: '"Fine," she said, not looking up.', reading: 'a fala contradiz o comportamento; o sentimento mora na contradição', trap: 'tomar a palavra "fine" pelo valor literal' },
    ],
  },
  'lexical-inference': {
    id: 'lexical-inference',
    name: 'Vocabulário técnico pela pista do texto',
    question: 'Troque o tipo de pista e veja como o texto entrega o sentido de um termo desconhecido sem dicionário.',
    controlLabel: 'Pista',
    controlDescription: 'selecione o tipo de pista ao redor do termo',
    formula: 'pista textual + termo desconhecido → sentido aproximado',
    insight: 'texto técnico costuma definir, contrastar ou exemplificar o termo novo na própria frase — a pista está ao lado, não em outro parágrafo.',
    states: [
      { label: 'Definition clue', example: 'A pathogen is an organism that causes disease.', reading: 'a oração após "is" define o termo', trap: 'procurar a definição fora da frase' },
      { label: 'Contrast clue', example: 'Unlike a microbe, a pathogen triggers illness.', reading: 'a oposição delimita o sentido por exclusão', trap: 'ignorar "unlike" e ler os dois termos como sinônimos' },
      { label: 'Example clue', example: 'Pathogens include some bacteria and viruses.', reading: 'os exemplos restringem a categoria do termo', trap: 'tratar os exemplos citados como a lista completa' },
    ],
  },
  'comparison-signals': {
    id: 'comparison-signals',
    name: 'Conectores de comparação entre duas categorias',
    question: 'Troque o conector e veja se ele marca diferença ou semelhança entre os dois termos comparados.',
    controlLabel: 'Conector comparativo',
    controlDescription: 'mude a relação entre os dois termos',
    formula: 'termo A + conector + termo B → relação de semelhança ou diferença',
    insight: 'unlike e whereas marcam diferença; similarly marca semelhança pontual, não identidade geral — confundir a direção troca qual característica pertence a qual termo.',
    states: [
      { label: 'unlike', example: 'Unlike bacteria, a virus needs a host cell.', reading: 'diferença marcada logo no início da frase', trap: 'ler os dois termos como equivalentes' },
      { label: 'similarly', example: 'Both are studied under a microscope.', reading: 'semelhança pontual, não em todas as características', trap: 'estender a semelhança a tudo o mais no texto' },
      { label: 'whereas', example: 'Bacteria respond to antibiotics, whereas viruses do not.', reading: 'cada oração descreve um lado do contraste', trap: 'aplicar a mesma propriedade aos dois termos' },
    ],
  },
  'stance-language': {
    id: 'stance-language',
    name: 'Do dado neutro à convocação',
    question: 'Suba o registro e veja onde a frase deixa de descrever e passa a defender uma posição.',
    controlLabel: 'Registro',
    controlDescription: 'mude o grau de neutralidade da frase',
    formula: 'escolha lexical → grau de neutralidade ou defesa de posição',
    insight: 'texto argumentativo mistura dado neutro, avaliação e convocação à ação; confundir as três é tomar fato relatado por posição defendida, ou o oposto.',
    states: [
      { label: 'Neutral data', example: 'Women make up 40% of this workforce.', reading: 'número relatado sem avaliação', trap: 'ler neutralidade como concordância do autor' },
      { label: 'Evaluative', example: 'It is unacceptable that women earn less.', reading: 'o adjetivo avaliativo marca a posição do autor', trap: 'tratar a avaliação como fato comprovado' },
      { label: 'Call to action', example: 'Companies must close the pay gap now.', reading: 'must + imperativo pede mudança, não descreve o presente', trap: 'ler "must" como constatação do que já ocorre' },
    ],
  },
};

export function englishInstrumentState(id: EnglishInstrumentId, index: number) {
  const states = ENGLISH_INSTRUMENTS[id].states;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(index)))];
}
