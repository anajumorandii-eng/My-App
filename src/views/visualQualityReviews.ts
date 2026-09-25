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

// Rodadas de 25/09 (régua aprovada pela responsável): três recortes a 1440 px
// e a prancha a 390 e 768 px, cada um nos dois temas.
const roundEvidence = (folder: string, chapterId: string) => {
  const stem = `docs/visual-personalizado/screenshots/${folder}/${chapterId.replace('summary-', '')}`;
  return [
    ...[1, 2, 3].flatMap(n => [`${stem}-recorte${n}.png`, `${stem}-recorte${n}-dark.png`]),
    ...[390, 768].flatMap(w => [`${stem}-${w}-light.png`, `${stem}-${w}-dark.png`]),
  ];
};
const lote1 = (chapterId: string) => roundEvidence('lote1-hg-2026-09-25', chapterId);
const lote2 = (chapterId: string) => roundEvidence('lote2-hg-2026-09-25', chapterId);
const roundNotes = 'Redesenhada em 25/09 pela régua aprovada: cena própria com movimento que explica o mecanismo. QA técnico: 390, 768 e 1440 px, temas claro e escuro, todos os recortes sem colisão de texto. Aprovação editorial pendente.';

const qaNotes = 'QA técnico: 360, 375, 390, 768 e 1440 px; temas claro/escuro; primeira e última seleção; teclado; movimento reduzido; axe sem violações. Aprovado pela responsável em 2026-09-23.';

export const visualQualityReviews: QualityReview[] = [
  { chapterId: 'bio-ecologia-ciclo-nitrogenio', mechanism: 'ciclo microbiano no solo e atmosfera', relation: 'fixação e amonificação alimentam nitrificação; desnitrificação devolve N₂', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-nitrogenio'), notes: qaNotes },
  { chapterId: 'bio-ecologia-eutrofizacao', mechanism: 'seção vertical de lago', relation: 'nutrientes induzem floração, bloqueiam luz e levam ao consumo de oxigênio', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-eutrofizacao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-dinamica-populacoes', mechanism: 'perfis reprodutivos', relation: 'muitos descendentes e pouco cuidado versus poucos descendentes e longo cuidado', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-dinamica-populacoes'), notes: qaNotes },
  { chapterId: 'bio-ecologia-invasoras-controle-biologico', mechanism: 'rede de impactos', relation: 'invasora alcança nativas, recursos, genes e ambiente por cinco caminhos', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-invasoras-controle-biologico'), notes: qaNotes },
  { chapterId: 'bio-ecologia-sucessao', mechanism: 'paisagem de comunidades', relation: 'solo e vegetação mudam da pioneira ao clímax', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-sucessao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-ciclo-hidrologico-poluicao-agua', mechanism: 'fonte, água e efeito', relation: 'cada agente altera o meio aquático por consequência própria', status: 'aprovado', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-hidrologico-poluicao-agua'), notes: qaNotes },
  { chapterId: 'summary-historia-revolucao-francesa', mechanism: 'cronologia com forças políticas e militares', relation: 'crise fiscal abre conflito institucional; guerra externa e desconfiança interna compõem a radicalização', status: 'em-validacao', evidencePaths: lote1('summary-historia-revolucao-francesa'), notes: roundNotes },
  { chapterId: 'summary-historia-revolucao-industrial', mechanism: 'campo cercado, fábrica e documento legal', relation: 'cercamentos liberam mão de obra e capital; documentação e pressão social contribuem para reformas', status: 'em-validacao', evidencePaths: lote1('summary-historia-revolucao-industrial'), notes: roundNotes },
  { chapterId: 'summary-geografia-projecoes-cartograficas', mechanism: 'comparação esquemática de três propriedades cartográficas', relation: 'conforme preserva forma local; equivalente, área; equidistante, distâncias desde um centro', status: 'em-validacao', evidencePaths: lote1('summary-geografia-projecoes-cartograficas'), notes: roundNotes },
  { chapterId: 'summary-geografia-dinamica-climatica', mechanism: 'seções de ascensão do ar', relation: 'aquecimento, barreira montanhosa e encontro de massas criam chuvas por mecanismos distintos', status: 'em-validacao', evidencePaths: lote1('summary-geografia-dinamica-climatica'), notes: roundNotes },
  { chapterId: 'summary-geografia-energia-eletrica-no-brasil', mechanism: 'usina, rede e centro consumidor', relation: 'geração e transmissão conectam fontes a uma demanda variável', status: 'em-validacao', evidencePaths: lote1('summary-geografia-energia-eletrica-no-brasil'), notes: roundNotes },
  { chapterId: 'summary-geografia-estrutura-etnica-e-fluxos-migratorios', mechanism: 'origem, trajeto e destino ligados por redes', relation: 'o deslocamento reorganiza destinos e pode preservar vínculos com a origem', status: 'em-validacao', evidencePaths: lote1('summary-geografia-estrutura-etnica-e-fluxos-migratorios'), notes: roundNotes },
  { chapterId: 'summary-geografia-os-fluxos-do-comercio-externo', mechanism: 'produção, porto e mercado externo', relation: 'a logística e seus custos ligam especialização produtiva a parceiros externos', status: 'em-validacao', evidencePaths: lote1('summary-geografia-os-fluxos-do-comercio-externo'), notes: roundNotes },
  { chapterId: 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil', mechanism: 'estoque fóssil, planta e etapa de uso', relation: 'carbono recente não torna biocombustível automaticamente neutro; solo e transporte integram o balanço', status: 'em-validacao', evidencePaths: lote1('summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil'), notes: roundNotes },
  { chapterId: 'summary-historia-a-mineracao-no-brasil-colonial', mechanism: 'casa de fundição, barras e cota anual', relation: 'o quinto separa 20%; a fundição sela o restante e torna ilegal o pó; a derrama cobra de todos a diferença até a cota', status: 'em-validacao', evidencePaths: lote2('summary-historia-a-mineracao-no-brasil-colonial'), notes: roundNotes },
  { chapterId: 'summary-historia-a-interiorizacao-da-colonizacao', mechanism: 'contorno do Brasil com três vetores', relation: 'bandeiras saem de São Paulo, o ouro puxa gente e a capital para o Rio, o gado sobe o São Francisco', status: 'em-validacao', evidencePaths: lote2('summary-historia-a-interiorizacao-da-colonizacao'), notes: roundNotes },
  { chapterId: 'summary-historia-grandes-navegacoes-e-conquista-colonial', mechanism: 'rota do Cabo e litoral do pau-brasil', relation: 'tecnologia náutica leva à Índia; a prioridade asiática deixa o Brasil no escambo até as ameaças de 1530', status: 'em-validacao', evidencePaths: lote2('summary-historia-grandes-navegacoes-e-conquista-colonial'), notes: roundNotes },
  { chapterId: 'summary-historia-a-montagem-da-colonizacao', mechanism: 'balança de fatores (metáfora declarada)', relation: 'resistência, epidemias e oposição jesuíta só juntas explicam a passagem ao tráfico transatlântico', status: 'em-validacao', evidencePaths: lote2('summary-historia-a-montagem-da-colonizacao'), notes: roundNotes },
  { chapterId: 'summary-historia-a-crise-do-antigo-sistema-colonial', mechanism: 'duas revoltas e a corrente do pacto colonial', relation: 'Inconfidência e Conjuração Baiana diferem em composição e pauta, contra o mesmo pacto', status: 'em-validacao', evidencePaths: lote2('summary-historia-a-crise-do-antigo-sistema-colonial'), notes: roundNotes },
  { chapterId: 'summary-historia-dinamica-interna-da-colonizacao', mechanism: 'engenho com casa-grande, senzala, quilombo e roças', relation: 'hierarquia, resistência e atividades subsidiárias convivem na mesma sociedade açucareira', status: 'em-validacao', evidencePaths: lote2('summary-historia-dinamica-interna-da-colonizacao'), notes: roundNotes },
];
