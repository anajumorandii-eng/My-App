export interface SummaryMaterial {
  id: string;
  subject: string;
  topic: string;
  format: 'roteiro' | 'questao-discursiva' | 'estrategia' | 'apostila';
  sourceFile: string;
  chapter?: string;
  startPage?: number;
  endPage?: number;
  board?: string;
  phase?: 'primeira' | 'segunda' | 'unica';
  uncertain?: boolean;
}

export const summaryMaterials: SummaryMaterial[] = [
  { id: 'pod_fis_04', subject: 'Física', topic: 'Termologia', format: 'roteiro', sourceFile: 'src/data/mockData.ts' },
  { id: 'pod_bio_04', subject: 'Biologia', topic: 'Ecologia', format: 'roteiro', sourceFile: 'src/data/mockData.ts' },
  { id: 'disc_fuvest_fis_2024', subject: 'Física', topic: 'Termologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_unifesp_bio_2020', subject: 'Biologia', topic: 'Ecologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_qui_2024', subject: 'Química', topic: 'Equilíbrio químico', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_mat_2022', subject: 'Matemática', topic: 'Probabilidade', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda', uncertain: true },
  { id: 'disc_unesp_geo_2024', subject: 'Geografia', topic: 'Geografia do Brasil', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unesp/Vunesp', phase: 'segunda' },
  { id: 'resolutionStrategies', subject: 'Interdisciplinar', topic: 'Estratégias de prova', format: 'estrategia', sourceFile: 'src/data/resolutionStrategies.ts' },
];
