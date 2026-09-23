import type { QualityReview } from './visualQuality';

/** Registro explícito da relação visual; aprovação exige evidência em navegador. */
export const visualQualityReviews: QualityReview[] = [
  { chapterId: 'bio-ecologia-ciclo-nitrogenio', mechanism: 'ciclo microbiano no solo e atmosfera', relation: 'fixação e amonificação alimentam nitrificação; desnitrificação devolve N₂', status: 'em-validacao', evidencePaths: [], notes: 'Aguardando inspeção visual em navegador' },
  { chapterId: 'bio-ecologia-eutrofizacao', mechanism: 'seção vertical de lago', relation: 'nutrientes induzem floração, bloqueiam luz e levam ao consumo de oxigênio', status: 'em-validacao', evidencePaths: [], notes: 'Aguardando inspeção visual em navegador' },
  { chapterId: 'bio-ecologia-dinamica-populacoes', mechanism: 'perfis reprodutivos', relation: 'muitos descendentes e pouco cuidado versus poucos descendentes e longo cuidado', status: 'em-validacao', evidencePaths: [], notes: 'Aguardando inspeção visual em navegador' },
  { chapterId: 'bio-ecologia-invasoras-controle-biologico', mechanism: 'rede de impactos', relation: 'invasora alcança nativas, recursos, genes e ambiente por cinco caminhos', status: 'em-validacao', evidencePaths: [], notes: 'Aguardando inspeção visual em navegador' },
  { chapterId: 'bio-ecologia-sucessao', mechanism: 'paisagem de comunidades', relation: 'solo e vegetação mudam da pioneira ao clímax', status: 'em-validacao', evidencePaths: [], notes: 'Aguardando inspeção visual em navegador' },
  { chapterId: 'bio-ecologia-ciclo-hidrologico-poluicao-agua', mechanism: 'fonte, água e efeito', relation: 'cada agente altera o meio aquático por consequência própria', status: 'em-validacao', evidencePaths: [], notes: 'Aguardando inspeção visual em navegador' },
];
