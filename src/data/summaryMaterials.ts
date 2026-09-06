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
  { id: 'disc_fuvest_bio_2024', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda', uncertain: true },
  { id: 'disc_comvest_bio_2020', subject: 'Biologia', topic: 'Evolução', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda', uncertain: true },
  { id: 'disc_comvest_qui_2024', subject: 'Química', topic: 'Equilíbrio Químico', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda', uncertain: true },
  { id: 'disc_unesp_fis_2024', subject: 'Física', topic: 'Eletrostática e Campo Elétrico', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unesp / Vunesp', phase: 'segunda' },
  { id: 'disc_famerp_bio_2015', subject: 'Biologia', topic: 'Fisiologia Vegetal', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Famerp', phase: 'segunda', uncertain: true },
  { id: 'disc_famerp_qui_2018', subject: 'Química', topic: 'Análises Quantitativas e Estequiometria', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Famerp', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_bio_2025_cerrado', subject: 'Biologia', topic: 'Biomas brasileiros', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_bio_2026_parkinson', subject: 'Biologia', topic: 'Fisiologia do sistema nervoso', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_bio_2025_clorofila', subject: 'Biologia', topic: 'Fotossíntese e nutrição mineral', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda', uncertain: true },
  { id: 'disc_comvest_his_2024_colonizar', subject: 'História', topic: 'Brasil Colônia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda', uncertain: true },
  { id: 'disc_comvest_fil_2025_descartes', subject: 'Filosofia', topic: 'Filosofia Moderna: Racionalismo e Empirismo', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_bio_2026_hidrocarbonetos', subject: 'Biologia', topic: 'Estrutura e Fisiologia Celular', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_fis_2026_homem_aranha', subject: 'Física', topic: 'Dinâmica Energética e Transformações de Energia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_fis_2026_pipoca', subject: 'Física', topic: 'Cinemática Escalar', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_geo_2026_amazonia_legal', subject: 'Geografia', topic: 'Geopolítica Regional Contemporânea', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_his_2026_universidades_medievais', subject: 'História', topic: 'Idade Média', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_qui_2026_aluminio_combustivel', subject: 'Química', topic: 'Eletroquímica', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2025_vermes_duna', subject: 'Biologia', topic: 'Zoologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda', uncertain: true },
  { id: 'disc_famerp_bio_2025_ciclo_celular', subject: 'Biologia', topic: 'Código Genético e Síntese Proteica', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Famerp', phase: 'segunda', uncertain: true },
  { id: 'disc_unifesp_qui_2025_trilinoleina', subject: 'Química', topic: 'Reações e Aplicações Orgânicas', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda', uncertain: true },
  { id: 'disc_unifesp_bio_2025_digestao', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda', uncertain: true },
  { id: 'disc_fuvest_bio_2026_oceanos', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_geo_2026_manguezal', subject: 'Geografia', topic: 'Climatologia e Problemas Socioambientais', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_his_2026_machado_voto', subject: 'História', topic: 'Brasil Império', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_qui_2026_oxido_calcio', subject: 'Química', topic: 'Análises Quantitativas e Estequiometria', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_fuvest_mat_2026_percentual', subject: 'Matemática', topic: 'Aritmética e Proporcionalidade', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Fuvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2026_neuroplasticidade', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2026_rios_voadores', subject: 'Biologia', topic: 'Fisiologia Vegetal', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2026_microbiota', subject: 'Biologia', topic: 'Microbiologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2026_evolucao_pavao', subject: 'Biologia', topic: 'Evolução', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2026_hemoglobina', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2026_terapia_genica', subject: 'Biologia', topic: 'Genética', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_qui_2026_rdx', subject: 'Química', topic: 'Análises Quantitativas e Estequiometria', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_qui_2026_carro_flex', subject: 'Química', topic: 'Soluções', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2025_dengue', subject: 'Biologia', topic: 'Microbiologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2025_placenta', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2025_hemofilia', subject: 'Biologia', topic: 'Genética', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2024_amamentacao', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_comvest_bio_2024_codigo_genetico', subject: 'Biologia', topic: 'Código Genético e Síntese Proteica', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unicamp / Comvest', phase: 'segunda' },
  { id: 'disc_unifesp_bio_2026_javaporco', subject: 'Biologia', topic: 'Ecologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda' },
  { id: 'disc_unifesp_bio_2026_virus_oncolitico', subject: 'Biologia', topic: 'Microbiologia', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda' },
  { id: 'disc_unifesp_bio_2026_vitamina_d', subject: 'Biologia', topic: 'Fisiologia Animal e Humana', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda' },
  { id: 'disc_unifesp_bio_2026_ame_splicing', subject: 'Biologia', topic: 'Código Genético e Síntese Proteica', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda' },
  { id: 'disc_unifesp_qui_2026_equilibrio_ferro', subject: 'Química', topic: 'Equilíbrio Químico', format: 'questao-discursiva', sourceFile: 'src/data/discursiveQuestions.ts', board: 'Unifesp', phase: 'segunda' },
  { id: 'resolutionStrategies', subject: 'Interdisciplinar', topic: 'Estratégias de prova', format: 'estrategia', sourceFile: 'src/data/resolutionStrategies.ts' },
  ...biologySummaryMaterials,
  ...physicsSummaryMaterials,
  ...geographySummaryMaterials,
  ...remainingSummaryMaterials,
  ...humanitiesSummaryMaterials,
];
