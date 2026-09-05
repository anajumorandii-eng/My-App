import { biologySummaryMaterials } from './biologyInteractiveSummaries';
import { physicsSummaryMaterials } from './physicsInteractiveSummaries';
import { geographySummaryMaterials } from './geographyInteractiveSummaries';
import { humanitiesSummaryMaterials } from './humanitiesInteractiveSummaries';
import { remainingSummaryMaterials } from './remainingInteractiveSummaries';

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
  { id: 'bio-eco-introducao', subject: 'Biologia', topic: 'Introdução à Ecologia', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Introdução à Ecologia', startPage: 4, endPage: 31 },
  { id: 'bio-eco-dinamica-populacoes', subject: 'Biologia', topic: 'Dinâmica de Populações', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Dinâmica de Populações', startPage: 32, endPage: 50 },
  { id: 'bio-eco-invasoras-controle', subject: 'Biologia', topic: 'Espécies Invasoras e Controle Biológico', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Espécies Invasoras e Controle Biológico', startPage: 51, endPage: 58 },
  { id: 'bio-eco-sucessao', subject: 'Biologia', topic: 'Sucessão Ecológica', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Sucessão Ecológica', startPage: 59, endPage: 65 },
  { id: 'bio-eco-ciclo-carbono', subject: 'Biologia', topic: 'Ciclos Biogeoquímicos – Ciclo do Carbono', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Ciclos Biogeoquímicos – Ciclo do Carbono', startPage: 66, endPage: 71 },
  { id: 'bio-eco-ciclo-nitrogenio', subject: 'Biologia', topic: 'Ciclo do Nitrogênio', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Ciclo do Nitrogênio', startPage: 72, endPage: 78 },
  { id: 'bio-eco-ciclo-hidrologico', subject: 'Biologia', topic: 'Ciclo Hidrológico e Poluição da Água', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Ciclo Hidrológico e Poluição da Água', startPage: 79, endPage: 85 },
  { id: 'bio-eco-eutrofizacao', subject: 'Biologia', topic: 'Eutrofização', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Eutrofização', startPage: 86, endPage: 91 },
  { id: 'bio-eco-poluicao-ar', subject: 'Biologia', topic: 'Poluição do Ar', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Poluição do Ar', startPage: 92, endPage: 98 },
  { id: 'bio-eco-biomagnificacao', subject: 'Biologia', topic: 'Biomagnificação', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 1.pdf', chapter: 'Biomagnificação', startPage: 99, endPage: 106 },
  { id: 'bio-eco-aquecimento-pops-biorremediacao', subject: 'Biologia', topic: 'Poluição: Aquecimento Global, POPs e Biorremediação', format: 'apostila', sourceFile: 'materiais brutos/Biologia (v1) 2.pdf', chapter: 'Poluição: Aquecimento Global, POPs e Biorremediação', startPage: 4, endPage: 18 },
  { id: 'pod_fis_04', subject: 'Física', topic: 'Termologia', format: 'roteiro', sourceFile: 'src/data/mockData.ts' },
  { id: 'pod_bio_04', subject: 'Biologia', topic: 'Ecologia', format: 'roteiro', sourceFile: 'src/data/mockData.ts' },
  { id: 'disc_fuvest_fis_2024', subject: 'Física', topic: 'Termologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_unifesp_bio_2020', subject: 'Biologia', topic: 'Ecologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_qui_2024', subject: 'Química', topic: 'Equilíbrio químico', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_mat_2022', subject: 'Matemática', topic: 'Probabilidade', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda', uncertain: true },
  { id: 'disc_unesp_geo_2024', subject: 'Geografia', topic: 'Geografia do Brasil', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unesp/Vunesp', phase: 'segunda' },
  { id: 'resolutionStrategies', subject: 'Interdisciplinar', topic: 'Estratégias de prova', format: 'estrategia', sourceFile: 'src/data/resolutionStrategies.ts' },
  ...biologySummaryMaterials,
  ...physicsSummaryMaterials,
  ...geographySummaryMaterials,
  ...remainingSummaryMaterials,
  ...humanitiesSummaryMaterials,
];
