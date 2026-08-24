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
  bio_estrutura_fisio_celular: ['Estrutura e fisiologia celular'],
  bio_metabolismo_energetico: ['Metabolismo energético'],
  bio_codigo_genetico_sintese: ['Código genético e síntese proteica'],
  bio_biotecnologia: ['Biotecnologia'],
  bio_genetica: ['Genética'],
  bio_evolucao: ['Evolução'],
  bio_ecologia: ['Ecologia'],
  bio_zoologia: ['Animais'],
  bio_botanica: [],
  bio_microbiologia: ['Vírus'],
  bio_fisio_animal: ['Fisiologia animal'],
  bio_fisio_vegetal: ['Fisiologia vegetal'],

  mat_aritmetica_proporcionalidade: ['Potenciação e radiciação', 'Porcentagem'],
  mat_teoria_numeros: ['Teoria dos números inteiros'],
  mat_sequencias_matrizes: [],
  mat_combinatoria: ['Análise combinatória'],
  mat_dados_probabilidade: ['Interpretação e análise de dados'],
  mat_geometria_plana: ['Geometria plana'],
  mat_trigonometria: ['Trigonometria'],
  mat_geometria_espacial: ['Geometria espacial'],
  mat_geometria_analitica: ['Geometria analítica'],
  mat_equacoes: ['Equações de 1º e 2º grau'],
  mat_funcoes: ['Funções'],
  mat_log_exponenciais: ['Logaritmos e exponenciais'],
  mat_complexos_polinomios: [],

  fis_cinematica: ['Cinemática escalar'],
  fis_cinematica_vetorial: ['Cinemática vetorial'],
  fis_leis_newton: ['Dinâmica', 'Dinâmica do movimento retilíneo'],
  fis_gravitacao_circular: ['Gravitação'],
  fis_dinamica_impulsiva: ['Dinâmica impulsiva'],
  fis_energia: ['Trabalho e energia'],
  fis_estatica: [],
  fis_calorimetria: ['Calorimetria'],
  fis_termodinamica_gases: ['Termologia'],
  fis_eletrostatica: ['Eletrodinâmica'],
  fis_circuitos: ['Eletrodinâmica'],
  fis_eletromagnetismo: [],
  fis_optica_geometrica: ['Óptica geométrica'],
  fis_optica_instrumental: ['Óptica'],
  fis_ondas_fundamentos: ['Movimentos oscilatórios'],
  fis_ondulatoria: ['Ondulatória'],
  fis_fisica_moderna: ['Física moderna'],

  qui_modelos_atomicos: ['Modelos atômicos e estrutura do átomo'],
  qui_radioatividade: ['Radioatividade'],
  qui_polaridade_geometria: ['Polaridade das ligações e geometria molecular'],
  qui_gases: ['Gases'],
  qui_estequiometria: ['Análises quantitativas e estequiometria'],
  qui_inorganica: ['Química inorgânica'],
  qui_oxirreducao: ['Oxirredução'],
  qui_organica_fundamentos: ['Funções, nomenclatura e propriedades orgânicas', 'Funções e nomenclatura orgânicas'],
  qui_organica_reacoes: ['Funções, nomenclatura e propriedades orgânicas', 'Funções e nomenclatura orgânicas'],
  qui_solucoes: ['Soluções'],
  qui_termoquimica: ['Termoquímica'],
  qui_cinetica: ['Cinética química'],
  qui_eletroquimica: ['Eletroquímica'],
  qui_equilibrio: ['Equilíbrio químico'],

  geo_cartografia: ['Cartografia'],
  geo_climatologia_socioambiental: ['Climatologia', 'Problemas socioambientais'],
  geo_hidrogeografia: ['Hidrogeografia'],
  geo_globalizacao_economica: ['Globalização', 'Geografia econômica', 'Geografia da população'],
  geo_geopolitica_regional: ['Tensões globais', 'Regionalização'],
  geo_fisica_brasil: ['Geografia agrária'],
  geo_economica_brasil: ['Geografia agrária'],
  geo_populacao_urbana_brasil: ['Geografia agrária'],

  his_idade_antiga: ['Idade Antiga'],
  his_idade_media: ['Idade Média'],
  his_moderna_iluminismo: ['Idade Moderna'],
  his_imperialismo_guerras: ['Idade Contemporânea'],
  his_guerra_fria_contemporaneo: ['Idade Contemporânea'],
  his_brasil_colonia: ['Brasil Colônia'],
  his_brasil_imperio: ['Brasil Império'],
  his_primeira_republica_vargas: ['Brasil República'],
  his_republica_liberal_atual: ['Brasil República'],

  por_norma_culta: ['Domínio da norma culta'],
  por_sintaxe: ['Análise sintática'],
  por_texto: ['Apreensão e compreensão de sentido', 'Leitura de textos sincréticos e não verbais', 'Semântica'],
  por_lit_classica_barroca: ['Leitura de textos literários', 'História da literatura e escolas literárias', 'Obras de leitura obrigatória'],
  por_lit_romantismo_realismo: ['Leitura de textos literários', 'História da literatura e escolas literárias', 'Obras de leitura obrigatória'],
  por_lit_modernismo: ['Leitura de textos literários', 'História da literatura e escolas literárias', 'Obras de leitura obrigatória'],
  por_lit_contemporanea: ['Leitura de textos literários', 'História da literatura e escolas literárias', 'Obras de leitura obrigatória'],
  por_red_fundamentos: [],
  por_red_repertorio: [],
  por_red_argumentacao: [],
  por_red_estrutura_coesao: [],
  por_red_direitos_modelo: [],

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
