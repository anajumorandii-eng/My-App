import { examPriorities, SubjectPriorities, TopicIncidence } from '../data/examPriorities';
import { Topic } from '../types';

// Topic.subject uses the app's short subject names; the incidence report
// spells two of them out in full.
const SUBJECT_ALIASES: Record<string, string> = {
  Português: 'Língua Portuguesa',
  Inglês: 'Língua Inglesa',
};

// Which report "temas" (examPriorities.ts, from the real Anglo incidence
// report) fall under each grouped topic. A topic with no themes listed here
// simply has no incidence evidence — it still gets studied on mastery gaps
// alone, just without the exam-focus boost.
const TOPIC_THEMES: Record<string, string[]> = {
  bio_celular: ['Estrutura e fisiologia celular', 'Metabolismo energético', 'Código genético e síntese proteica', 'Biotecnologia'],
  bio_genetica: ['Genética'],
  bio_evolucao: ['Evolução'],
  bio_ecologia: ['Ecologia'],
  bio_zoologia: ['Animais'],
  bio_botanica: [],
  bio_microbiologia: ['Vírus'],
  bio_fisio_animal: ['Fisiologia animal'],
  bio_fisio_vegetal: ['Fisiologia vegetal'],

  mat_algebrica: ['Funções', 'Equações de 1º e 2º grau', 'Logaritmos e exponenciais', 'Potenciação e radiciação'],
  mat_geometrica: ['Geometria plana', 'Geometria espacial', 'Trigonometria', 'Geometria analítica'],
  mat_numerica: ['Porcentagem', 'Análise combinatória', 'Teoria dos números inteiros', 'Interpretação e análise de dados'],

  fis_cinematica: ['Cinemática vetorial', 'Cinemática escalar'],
  fis_dinamica: ['Dinâmica', 'Dinâmica do movimento retilíneo', 'Gravitação'],
  fis_dinamica_impulsiva: ['Dinâmica impulsiva'],
  fis_energia: ['Trabalho e energia'],
  fis_estatica: [],
  fis_termofisica: ['Calorimetria', 'Termologia'],
  fis_eletricidade: ['Eletrodinâmica'],
  fis_eletromagnetismo: [],
  fis_optica: ['Óptica geométrica', 'Óptica'],
  fis_ondas: ['Ondulatória', 'Física moderna', 'Movimentos oscilatórios'],

  qui_atomistica: ['Polaridade das ligações e geometria molecular', 'Modelos atômicos e estrutura do átomo', 'Radioatividade'],
  qui_geral: ['Análises quantitativas e estequiometria', 'Química inorgânica', 'Oxirredução', 'Gases'],
  qui_organica: ['Funções, nomenclatura e propriedades orgânicas', 'Funções e nomenclatura orgânicas'],
  qui_fisico_quimica: ['Equilíbrio químico', 'Termoquímica', 'Cinética química', 'Soluções', 'Eletroquímica'],

  geo_geral: ['Problemas socioambientais', 'Climatologia', 'Geografia econômica', 'Globalização', 'Geografia da população', 'Hidrogeografia', 'Cartografia', 'Regionalização', 'Tensões globais'],
  geo_brasil: ['Geografia agrária'],

  his_geral: ['Idade Contemporânea', 'Idade Moderna', 'Idade Média', 'Idade Antiga', 'Historicidade'],
  his_brasil: ['Brasil República', 'Brasil Império', 'Brasil Colônia'],

  por_gramatica: ['Domínio da norma culta', 'Análise sintática'],
  por_texto: ['Apreensão e compreensão de sentido', 'Leitura de textos sincréticos e não verbais', 'Semântica'],
  por_literatura: ['Leitura de textos literários', 'História da literatura e escolas literárias', 'Obras de leitura obrigatória'],
  por_redacao: [],

  ing_01: ['Compreensão global', 'Compreensão específica', 'Reflexão pós-leitura', 'Vocabulário', 'Gramática', 'Estruturas linguísticas'],
};

function findSubjectPriorities(subject: string): SubjectPriorities | undefined {
  const alias = SUBJECT_ALIASES[subject] ?? subject;
  return examPriorities.find((entry) => entry.subject === alias);
}

function sumThemePercents(themes: TopicIncidence[], wanted: string[]): number {
  if (wanted.length === 0) return 0;
  return themes
    .filter((theme) => wanted.includes(theme.theme))
    .reduce((sum, theme) => sum + theme.percent, 0);
}

/**
 * How much real exam weight a topic carries, as a 0..~1 fraction (percent
 * incidence / 100). Combines the regional "how often this comes up across
 * boards" baseline with, when a specific upcoming board is given, that
 * board's own incidence for the same themes stacked on top.
 */
export function topicIncidenceWeight(topic: Pick<Topic, 'id' | 'subject'>, nearBoard?: string): number {
  const themes = TOPIC_THEMES[topic.id];
  if (!themes || themes.length === 0) return 0;

  const subjectData = findSubjectPriorities(topic.subject);
  if (!subjectData) return 0;

  let weight = sumThemePercents(subjectData.regionalSummary, themes) / 100;
  if (nearBoard) {
    const board = subjectData.byBoard.find((entry) => entry.board === nearBoard);
    if (board) {
      weight += sumThemePercents(board.topics, themes) / 100;
    }
  }
  return weight;
}
