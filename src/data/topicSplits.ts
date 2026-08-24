// The curriculum was split further on 2026-08-19: broad frentes like
// "Modelagem Geométrica de Problemas" or "Geografia Geral" got broken into
// the real, distinct sub-areas the exam-incidence report (examPriorities.ts)
// and the apostila itself already treat separately (Geometria Plana,
// Trigonometria, Geometria Espacial, Geometria Analítica, ...).
//
// A student's saved TopicMastery is keyed by the old, now-retired topic id.
// This maps each new topic id to the old id(s) it was split from, so
// reconciliation can carry forward her real mastery estimate to every child
// instead of resetting each one to an unstudied baseline. When a topic drew
// chapters from two old frentes (e.g. Trigonometria pulled chapters from
// both Modelagem Geométrica and Modelagem Algébrica), all contributing
// parents are listed and their estimates are averaged.
export const SPLIT_TOPIC_PARENTS: Record<string, string[]> = {
  bio_estrutura_fisio_celular: ['bio_celular'],
  bio_metabolismo_energetico: ['bio_celular'],
  bio_codigo_genetico_sintese: ['bio_celular'],
  bio_biotecnologia: ['bio_celular'],

  mat_aritmetica_proporcionalidade: ['mat_numerica'],
  mat_teoria_numeros: ['mat_numerica'],
  mat_sequencias_matrizes: ['mat_numerica'],
  mat_combinatoria: ['mat_numerica'],
  mat_dados_probabilidade: ['mat_numerica'],
  mat_geometria_plana: ['mat_geometrica'],
  mat_trigonometria: ['mat_geometrica', 'mat_algebrica'],
  mat_geometria_espacial: ['mat_geometrica'],
  mat_geometria_analitica: ['mat_geometrica'],
  mat_equacoes: ['mat_algebrica'],
  mat_funcoes: ['mat_algebrica'],
  mat_log_exponenciais: ['mat_algebrica'],
  mat_complexos_polinomios: ['mat_algebrica'],

  fis_cinematica_vetorial: ['fis_dinamica'],
  fis_leis_newton: ['fis_dinamica'],
  fis_gravitacao_circular: ['fis_dinamica'],
  fis_calorimetria: ['fis_termofisica'],
  fis_termodinamica_gases: ['fis_termofisica'],
  fis_eletrostatica: ['fis_eletricidade'],
  fis_circuitos: ['fis_eletricidade'],
  fis_optica_geometrica: ['fis_optica'],
  fis_optica_instrumental: ['fis_optica'],
  fis_ondas_fundamentos: ['fis_ondas'],
  fis_ondulatoria: ['fis_ondas'],
  fis_fisica_moderna: ['fis_ondas'],

  qui_modelos_atomicos: ['qui_atomistica'],
  qui_radioatividade: ['qui_atomistica'],
  qui_polaridade_geometria: ['qui_atomistica'],
  qui_gases: ['qui_geral'],
  qui_estequiometria: ['qui_geral'],
  qui_inorganica: ['qui_geral'],
  qui_oxirreducao: ['qui_geral'],
  qui_organica_fundamentos: ['qui_organica'],
  qui_organica_reacoes: ['qui_organica'],
  qui_solucoes: ['qui_fisico_quimica'],
  qui_termoquimica: ['qui_fisico_quimica'],
  qui_cinetica: ['qui_fisico_quimica'],
  qui_eletroquimica: ['qui_fisico_quimica'],
  qui_equilibrio: ['qui_fisico_quimica'],

  geo_cartografia: ['geo_geral'],
  geo_climatologia_socioambiental: ['geo_geral'],
  geo_hidrogeografia: ['geo_geral'],
  geo_globalizacao_economica: ['geo_geral'],
  geo_geopolitica_regional: ['geo_geral'],
  geo_fisica_brasil: ['geo_brasil'],
  geo_economica_brasil: ['geo_brasil'],
  geo_populacao_urbana_brasil: ['geo_brasil'],

  his_idade_antiga: ['his_geral'],
  his_idade_media: ['his_geral'],
  his_moderna_iluminismo: ['his_geral'],
  his_imperialismo_guerras: ['his_geral'],
  his_guerra_fria_contemporaneo: ['his_geral'],
  his_brasil_colonia: ['his_brasil'],
  his_brasil_imperio: ['his_brasil'],
  his_primeira_republica_vargas: ['his_brasil'],
  his_republica_liberal_atual: ['his_brasil'],

  por_norma_culta: ['por_gramatica'],
  por_sintaxe: ['por_gramatica'],
  por_lit_classica_barroca: ['por_literatura'],
  por_lit_romantismo_realismo: ['por_literatura'],
  por_lit_modernismo: ['por_literatura'],
  por_lit_contemporanea: ['por_literatura'],
  por_red_fundamentos: ['por_redacao'],
  por_red_repertorio: ['por_redacao'],
  por_red_argumentacao: ['por_redacao'],
  por_red_estrutura_coesao: ['por_redacao'],
  por_red_direitos_modelo: ['por_redacao'],
};
