import type { QualityReview } from './visualQuality';

/** Registro explícito da relação visual; aprovação exige evidência em navegador. */
const ecologyEvidence = (chapterId: string) =>
  ['390', '1440'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/ecologia-motion-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const historyGeographyEvidence = (chapterId: string) =>
  ['390', '1440'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/humanas-motion-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const geographyContextEvidence = (chapterId: string) =>
  ['390', '1440'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/humanas-motion-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const qaNotes = 'Reaberto após rejeição visual da responsável em 2026-09-23. Cenas refeitas com movimento no mecanismo; aprovação editorial pendente. Evidências novas: 60 verificações de largura/seleção e capturas em 390 e 1440 px nos dois temas.';

export const visualQualityReviews: QualityReview[] = [
  { chapterId: 'summary-biologia-bioenergetica-fotossintese-e-quimiossintese', mechanism: 'cloroplasto em corte e procarionte quimioautotrófico', relation: 'luz ou oxidação inorgânica fornecem energia; CO₂ fornece carbono', status: 'em-validacao', evidencePaths: ['fotossintese-390-light', 'fotossintese-1440-light', 'quimiossintese-390-dark', 'quimiossintese-1440-dark'].map(name => `docs/visual-personalizado/screenshots/bioenergetica-motion-2026-09-23/${name}.png`), notes: 'Reconstrução com fluxos finitos, seleção por teclado e dez verificações de largura nos dois temas. Movimento reduzido coberto por teste de componente, sem emulação no navegador. Aprovação editorial pendente.' },
  { chapterId: 'bio-ecologia-ciclo-nitrogenio', mechanism: 'ciclo microbiano no solo e atmosfera', relation: 'fixação e amonificação alimentam nitrificação; desnitrificação devolve N₂', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-nitrogenio'), notes: qaNotes },
  { chapterId: 'bio-ecologia-eutrofizacao', mechanism: 'seção vertical de lago', relation: 'nutrientes induzem floração, bloqueiam luz e levam ao consumo de oxigênio', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-eutrofizacao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-dinamica-populacoes', mechanism: 'perfis reprodutivos', relation: 'muitos descendentes e pouco cuidado versus poucos descendentes e longo cuidado', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-dinamica-populacoes'), notes: qaNotes },
  { chapterId: 'bio-ecologia-invasoras-controle-biologico', mechanism: 'rede de impactos', relation: 'invasora alcança nativas, recursos, genes e ambiente por cinco caminhos', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-invasoras-controle-biologico'), notes: qaNotes },
  { chapterId: 'bio-ecologia-sucessao', mechanism: 'paisagem de comunidades', relation: 'solo e vegetação mudam da pioneira ao clímax', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-sucessao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-ciclo-hidrologico-poluicao-agua', mechanism: 'fonte, água e efeito', relation: 'cada agente altera o meio aquático por consequência própria', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-hidrologico-poluicao-agua'), notes: qaNotes },
  { chapterId: 'summary-historia-revolucao-francesa', mechanism: 'cronologia com forças políticas e militares', relation: 'crise fiscal abre conflito institucional; guerra externa e desconfiança interna compõem a radicalização', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-historia-revolucao-francesa'), notes: 'Prancha específica do capítulo; QA de largura e seleção em cinco larguras e dois temas; teclado verificado. Movimento reduzido tratado no código, sem emulação no navegador. Aprovação editorial pendente.' },
  { chapterId: 'summary-historia-revolucao-industrial', mechanism: 'campo cercado, fábrica e documento legal', relation: 'cercamentos liberam mão de obra e capital; documentação e pressão social contribuem para reformas', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-historia-revolucao-industrial'), notes: 'Prancha específica do capítulo; QA de largura e seleção em cinco larguras e dois temas; teclado verificado. Movimento reduzido tratado no código, sem emulação no navegador. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-projecoes-cartograficas', mechanism: 'comparação esquemática de três propriedades cartográficas', relation: 'conforme preserva forma local; equivalente, área; equidistante, distâncias desde um centro', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-geografia-projecoes-cartograficas'), notes: 'Esquemas de propriedades, não mapas mensuráveis. QA de largura e seleção em cinco larguras e dois temas; teclado verificado. Movimento reduzido tratado no código, sem emulação no navegador. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-dinamica-climatica', mechanism: 'seções de ascensão do ar', relation: 'aquecimento, barreira montanhosa e encontro de massas criam chuvas por mecanismos distintos', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-geografia-dinamica-climatica'), notes: 'Prancha específica do capítulo; QA de largura e seleção em cinco larguras e dois temas; teclado verificado. Movimento reduzido tratado no código, sem emulação no navegador. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-energia-eletrica-no-brasil', mechanism: 'usina, rede e centro consumidor', relation: 'geração e transmissão conectam fontes a uma demanda variável', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-energia-eletrica-no-brasil'), notes: 'Figura esquemática, sem dados de usina real; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-estrutura-etnica-e-fluxos-migratorios', mechanism: 'origem, trajeto e destino ligados por redes', relation: 'o deslocamento reorganiza destinos e pode preservar vínculos com a origem', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-estrutura-etnica-e-fluxos-migratorios'), notes: 'Fluxo hipotético, sem rota real; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-os-fluxos-do-comercio-externo', mechanism: 'produção, porto e mercado externo', relation: 'a logística e seus custos ligam especialização produtiva a parceiros externos', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-os-fluxos-do-comercio-externo'), notes: 'Corredor ilustrativo, sem porto ou parceiro real; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil', mechanism: 'estoque fóssil, planta e etapa de uso', relation: 'carbono recente não torna biocombustível automaticamente neutro; solo e transporte integram o balanço', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil'), notes: 'Esquema de ciclo de vida sem emissões numéricas; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
];
