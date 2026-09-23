import type { QualityReview } from './visualQuality';

/** Registro explícito da relação visual; aprovação exige evidência em navegador. */
const ecologyEvidence = (chapterId: string) =>
  ['mobile-360', 'mobile-375', 'mobile-390', 'tablet', 'desktop'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/ecologia-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const historyGeographyEvidence = (chapterId: string) =>
  ['mobile-360', 'mobile-375', 'mobile-390', 'tablet', 'desktop'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/historia-geografia-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const geographyContextEvidence = (chapterId: string) =>
  ['mobile-360', 'mobile-375', 'mobile-390', 'tablet', 'desktop'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/geografia-contextos-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const qaNotes = 'QA técnico: 360, 375, 390, 768 e 1440 px; temas claro/escuro; primeira e última seleção; teclado; movimento reduzido; axe sem violações. Aprovado pela responsável em 2026-09-23.';

export const visualQualityReviews: QualityReview[] = [
  { chapterId: 'bio-ecologia-ciclo-nitrogenio', mechanism: 'ciclo microbiano no solo e atmosfera', relation: 'fixação e amonificação alimentam nitrificação; desnitrificação devolve N₂', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-nitrogenio'), notes: qaNotes },
  { chapterId: 'bio-ecologia-eutrofizacao', mechanism: 'seção vertical de lago', relation: 'nutrientes induzem floração, bloqueiam luz e levam ao consumo de oxigênio', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-eutrofizacao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-dinamica-populacoes', mechanism: 'perfis reprodutivos', relation: 'muitos descendentes e pouco cuidado versus poucos descendentes e longo cuidado', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-dinamica-populacoes'), notes: qaNotes },
  { chapterId: 'bio-ecologia-invasoras-controle-biologico', mechanism: 'rede de impactos', relation: 'invasora alcança nativas, recursos, genes e ambiente por cinco caminhos', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-invasoras-controle-biologico'), notes: qaNotes },
  { chapterId: 'bio-ecologia-sucessao', mechanism: 'paisagem de comunidades', relation: 'solo e vegetação mudam da pioneira ao clímax', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-sucessao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-ciclo-hidrologico-poluicao-agua', mechanism: 'fonte, água e efeito', relation: 'cada agente altera o meio aquático por consequência própria', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-hidrologico-poluicao-agua'), notes: qaNotes },
  { chapterId: 'summary-historia-revolucao-francesa', mechanism: 'cronologia com forças políticas e militares', relation: 'crise fiscal abre conflito institucional; guerra externa e desconfiança interna compõem a radicalização', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-historia-revolucao-francesa'), notes: 'Prancha específica do capítulo; QA técnico em cinco larguras, dois temas, teclado e movimento reduzido. Aprovação editorial pendente.' },
  { chapterId: 'summary-historia-revolucao-industrial', mechanism: 'campo cercado, fábrica e documento legal', relation: 'cercamentos liberam mão de obra e capital; documentação e pressão social contribuem para reformas', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-historia-revolucao-industrial'), notes: 'Prancha específica do capítulo; QA técnico em cinco larguras, dois temas, teclado e movimento reduzido. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-projecoes-cartograficas', mechanism: 'comparação esquemática de três propriedades cartográficas', relation: 'conforme preserva forma local; equivalente, área; equidistante, distâncias desde um centro', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-geografia-projecoes-cartograficas'), notes: 'Esquemas de propriedades, não mapas mensuráveis. QA técnico em cinco larguras, dois temas, teclado e movimento reduzido. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-dinamica-climatica', mechanism: 'seções de ascensão do ar', relation: 'aquecimento, barreira montanhosa e encontro de massas criam chuvas por mecanismos distintos', status: 'em-validacao', evidencePaths: historyGeographyEvidence('summary-geografia-dinamica-climatica'), notes: 'Prancha específica do capítulo; QA técnico em cinco larguras, dois temas, teclado e movimento reduzido. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-energia-eletrica-no-brasil', mechanism: 'usina, rede e centro consumidor', relation: 'geração e transmissão conectam fontes a uma demanda variável', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-energia-eletrica-no-brasil'), notes: 'Figura esquemática, sem dados de usina real; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-estrutura-etnica-e-fluxos-migratorios', mechanism: 'origem, trajeto e destino ligados por redes', relation: 'o deslocamento reorganiza destinos e pode preservar vínculos com a origem', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-estrutura-etnica-e-fluxos-migratorios'), notes: 'Fluxo hipotético, sem rota real; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-os-fluxos-do-comercio-externo', mechanism: 'produção, porto e mercado externo', relation: 'a logística e seus custos ligam especialização produtiva a parceiros externos', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-os-fluxos-do-comercio-externo'), notes: 'Corredor ilustrativo, sem porto ou parceiro real; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
  { chapterId: 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil', mechanism: 'estoque fóssil, planta e etapa de uso', relation: 'carbono recente não torna biocombustível automaticamente neutro; solo e transporte integram o balanço', status: 'em-validacao', evidencePaths: geographyContextEvidence('summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil'), notes: 'Esquema de ciclo de vida sem emissões numéricas; QA técnico em cinco larguras e dois temas. Aprovação editorial pendente.' },
];
