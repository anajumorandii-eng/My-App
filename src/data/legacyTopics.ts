// The Anglo/Plural curriculum replacement (see mockData.ts) renamed almost
// every topic id. A handful of renames kept the exact same topic name, so
// remapping them is a safe, meaning-preserving id fix rather than a new
// content decision — those are listed in LEGACY_TOPIC_ID_MIGRATIONS and
// applied automatically when reading a student's saved backlog.
//
// Everything else was consolidated into broader topics with no single
// correct successor (e.g. 11 old Matemática topics became 3). Guessing a
// mapping for those would silently change what the student's own backlog
// entry means, so they are left alone and the UI asks the student to pick
// the right topic herself. LEGACY_TOPIC_LABELS lets that UI show her which
// old topic the entry used to point to, instead of a bare id.
export const LEGACY_TOPIC_ID_MIGRATIONS: Record<string, string> = {
  bio_02: 'bio_genetica',
  bio_04: 'bio_ecologia',
  bio_05: 'bio_evolucao',
  bio_07: 'bio_zoologia',
  bio_08: 'bio_botanica',
  fis_01: 'fis_cinematica',
  qui_03: 'qui_organica',
  qui_06: 'qui_fisico_quimica',
};

export const LEGACY_TOPIC_LABELS: Record<string, string> = {
  bio_01: 'Citologia',
  bio_02: 'Genética',
  bio_03: 'Fisiologia Humana',
  bio_04: 'Ecologia',
  bio_05: 'Evolução',
  bio_06: 'Microbiologia e Imunologia',
  bio_07: 'Zoologia',
  bio_08: 'Botânica',
  mat_01: 'Funções de 1º Grau',
  mat_02: 'Análise Combinatória',
  mat_03: 'Funções de 2º Grau',
  mat_04: 'Geometria Plana',
  mat_05: 'Probabilidade',
  mat_06: 'Trigonometria',
  mat_07: 'Progressões (PA e PG)',
  mat_08: 'Funções Exponenciais e Logarítmicas',
  mat_09: 'Geometria Espacial',
  mat_10: 'Geometria Analítica',
  mat_11: 'Estatística',
  fis_01: 'Cinemática',
  fis_02: 'Eletrodinâmica',
  fis_03: 'Dinâmica',
  fis_04: 'Termologia',
  fis_05: 'Óptica',
  fis_06: 'Ondulatória',
  fis_07: 'Trabalho e Energia',
  fis_08: 'Eletromagnetismo',
  fis_09: 'Estática e Hidrostática',
  qui_01: 'Estequiometria',
  qui_02: 'Ligações Químicas',
  qui_03: 'Química Orgânica',
  qui_04: 'Soluções e Concentração',
  qui_05: 'Atomística',
  qui_06: 'Físico-Química',
  geo_01: 'Cartografia e Fundamentos',
  geo_02: 'Climatologia e Dinâmica Ambiental',
  geo_03: 'Geomorfologia e Recursos Hídricos',
  geo_04: 'Geografia da População e Urbanização',
  geo_05: 'Geografia Econômica e Industrial',
  geo_06: 'Geopolítica Mundial',
  geo_07: 'Geografia do Brasil: Território e Natureza',
  his_01: 'Antiguidade e Idade Média',
  his_02: 'Idade Moderna e Absolutismo',
  his_03: 'Revoluções e Iluminismo',
  his_04: 'Brasil Colônia',
  his_05: 'Brasil Império',
  his_06: 'Brasil República',
  his_07: 'Século XX: Guerras e Guerra Fria',
  por_01: 'Gramática e Sintaxe',
  por_02: 'Interpretação de Texto',
  por_03: 'Literatura: Estilos de Época',
};

export function remapLegacyTopicId(topicId: string): string {
  return LEGACY_TOPIC_ID_MIGRATIONS[topicId] ?? topicId;
}
