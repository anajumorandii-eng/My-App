export type EnglishInstrumentId = 'poetry-reading' | 'quantity-language' | 'modal-certainty' | 'cause-connectors' | 'research-claims';

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
};

export function englishInstrumentState(id: EnglishInstrumentId, index: number) {
  const states = ENGLISH_INSTRUMENTS[id].states;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(index)))];
}
