export type HistoryInstrumentId = 'america-xix' | 'wwii-fronts' | 'cold-war' | 'interiorization' | 'mining-colony';

export interface HistoryInstrumentState {
  label: string;
  focus: string;
  relation: string;
  evidence: string;
}

export interface HistoryInstrumentConfig {
  id: HistoryInstrumentId;
  name: string;
  question: string;
  controlLabel: string;
  controlDescription: string;
  formula: string;
  insight: string;
  states: HistoryInstrumentState[];
}

export const HISTORY_INSTRUMENTS: Record<HistoryInstrumentId, HistoryInstrumentConfig> = {
  'america-xix': {
    id: 'america-xix',
    name: 'Projetos territoriais nas Américas',
    question: 'Compare como independência, expansão dos EUA e neocolonialismo reorganizaram territórios no século XIX.',
    controlLabel: 'Processo',
    controlDescription: 'mude o processo territorial observado',
    formula: 'poder político → controle territorial',
    insight: 'o século XIX americano não foi uma marcha única: soberania, expansão interna e intervenção externa produziram mapas políticos distintos.',
    states: [
      { label: 'Independências', focus: 'ruptura colonial', relation: 'novos Estados', evidence: 'fronteiras herdadas e disputadas' },
      { label: 'Expansão dos EUA', focus: 'avanço para o oeste', relation: 'anexação e deslocamento', evidence: 'território nacional ampliado' },
      { label: 'Neocolonialismo', focus: 'influência externa', relation: 'dependência sem anexação', evidence: 'controle econômico e diplomático' },
    ],
  },
  'wwii-fronts': {
    id: 'wwii-fronts',
    name: 'Uma guerra, frentes diferentes',
    question: 'Percorra as frentes e observe por que acontecimentos simultâneos não formam uma única cadeia linear.',
    controlLabel: 'Frente',
    controlDescription: 'selecione o teatro de operações',
    formula: 'frentes simultâneas → guerra global',
    insight: 'Europa Ocidental, Frente Oriental e Pacífico tiveram atores, ritmos e pontos de inflexão próprios, embora integrassem o mesmo conflito.',
    states: [
      { label: 'Europa Ocidental', focus: 'ocupação e desembarque', relation: 'Eixo × Aliados', evidence: 'França, Atlântico e Normandia' },
      { label: 'Frente Oriental', focus: 'guerra de desgaste', relation: 'Alemanha × URSS', evidence: 'Stalingrado e avanço soviético' },
      { label: 'Pacífico', focus: 'guerra aeronaval', relation: 'Japão × EUA e aliados', evidence: 'ilhas, Midway e rendição japonesa' },
    ],
  },
  'cold-war': {
    id: 'cold-war',
    name: 'Confronto sem guerra direta',
    question: 'Alterne o mecanismo de disputa que manteve as superpotências em tensão sem choque militar direto entre elas.',
    controlLabel: 'Mecanismo',
    controlDescription: 'mude a forma assumida pela rivalidade',
    formula: 'bipolaridade → disputa indireta',
    insight: 'a Guerra Fria combinou dissuasão, guerras por procuração e competição político-tecnológica; nenhuma dessas formas resume sozinha o período.',
    states: [
      { label: 'Dissuasão nuclear', focus: 'equilíbrio do medo', relation: 'retaliação recíproca', evidence: 'arsenais evitam ataque direto' },
      { label: 'Guerras por procuração', focus: 'conflito regional', relation: 'apoio a lados opostos', evidence: 'Coreia e Vietnã' },
      { label: 'Competição sistêmica', focus: 'prestígio e influência', relation: 'blocos rivais', evidence: 'corrida espacial e propaganda' },
    ],
  },
  interiorization: {
    id: 'interiorization',
    name: 'Vetores da interiorização colonial',
    question: 'Siga os agentes que partiram do litoral por rotas e objetivos diferentes.',
    controlLabel: 'Vetor',
    controlDescription: 'selecione o agente de ocupação do interior',
    formula: 'agente + interesse → rota territorial',
    insight: 'bandeiras, mineração e criação de gado impulsionaram deslocamentos distintos e conectaram o interior à economia colonial.',
    states: [
      { label: 'Bandeiras', focus: 'sertanismo paulista', relation: 'expedições terrestres', evidence: 'apresamento e busca de metais' },
      { label: 'Mineração', focus: 'núcleos mineradores', relation: 'atração populacional', evidence: 'caminhos e abastecimento interno' },
      { label: 'Pecuária', focus: 'sertões e vales fluviais', relation: 'ocupação extensiva', evidence: 'gado afastado da faixa açucareira' },
    ],
  },
  'mining-colony': {
    id: 'mining-colony',
    name: 'Circuito fiscal do ouro colonial',
    question: 'Percorra os mecanismos usados pela Coroa para transformar extração mineral em receita metropolitana.',
    controlLabel: 'Mecanismo fiscal',
    controlDescription: 'mude a etapa de controle do ouro',
    formula: 'extração → fiscalização → tributo',
    insight: 'o quinto, as casas de fundição e a derrama pertenciam ao mesmo circuito fiscal, mas operavam como alíquota, controle e cobrança extraordinária.',
    states: [
      { label: 'Quinto', focus: 'parcela tributada', relation: 'um quinto devido à Coroa', evidence: 'tributação sobre o ouro extraído' },
      { label: 'Casas de fundição', focus: 'controle da circulação', relation: 'ouro fundido e selado', evidence: 'fiscalização antes da circulação' },
      { label: 'Derrama', focus: 'meta não atingida', relation: 'cobrança compulsória', evidence: 'arrecadação extraordinária' },
    ],
  },
};

export function historyInstrumentState(id: HistoryInstrumentId, index: number) {
  const states = HISTORY_INSTRUMENTS[id].states;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(index)))];
}
