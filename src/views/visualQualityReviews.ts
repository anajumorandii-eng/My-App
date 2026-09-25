import type { QualityReview } from './visualQuality';

/** Registro explícito da relação visual; aprovação exige evidência em navegador. */
const ecologyEvidence = (chapterId: string) =>
  ['390', '1440'].flatMap(viewport =>
    ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/ecologia-motion-2026-09-23/${chapterId}-${viewport}-${theme}.png`,
    ),
  );

const qaNotes = 'Reaberto após rejeição visual da responsável em 2026-09-23. Cenas refeitas com movimento no mecanismo; aprovação editorial pendente. Evidências novas: 60 verificações de largura/seleção e capturas em 390 e 1440 px nos dois temas.';

const mechanismExpansion: Array<[string, string, string]> = [
  ['summary-fisica-equacao-fundamental-da-ondulatoria', 'corda com ponto material destacado', 'perfil se propaga enquanto um ponto oscila; v = λf'],
  ['summary-fisica-ondulatoria-ondas-eletromagneticas', 'campos E e B em perspectiva', 'campos transversais em fase, com amplitudes normalizadas'],
  ['summary-fisica-ondulatoria-som-e-suas-propriedades', 'partículas em compressões e rarefações', 'oscilação longitudinal do meio sem transporte líquido de matéria'],
  ['summary-quimica-termoquimica-i', 'perfil de entalpia e fluxo sistema-vizinhança', 'saldo ΔH e barreira Ea distintos; troca de calor muda de sentido'],
  ['summary-quimica-termoquimica-ii', 'caminhos direto e por intermediário', 'mesmos estados extremos dão o mesmo ΔH; intermediários se cancelam'],
  ['summary-quimica-evolucao-dos-modelos-atomicos', 'espalhamento alfa e níveis discretos do hidrogênio', 'grandes desvios sustentam núcleo concentrado; fóton corresponde à diferença de energia'],
  ['summary-biologia-coracao-e-vasos-sanguineos', 'percurso selecionável entre cavidades, pulmões e corpo', 'artéria e veia definidas pela direção, não pela oxigenação'],
];

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

export const visualQualityReviews: QualityReview[] = [
  ...mechanismExpansion.map(([chapterId, mechanism, relation]): QualityReview => ({
    chapterId, mechanism, relation, status: 'em-validacao',
    evidencePaths: ['390', '1440'].flatMap(width => ['light', 'dark'].map(theme =>
      `docs/visual-personalizado/screenshots/mecanismos-expansao-2026-09-25/${chapterId}-${width}-${theme}.png`)),
    notes: 'QA em 360, 390, 768 e 1440 px nos dois temas: sem overflow horizontal. Capturas de página e controles conferidos. Movimento reduzido coberto por teste de componente, sem emulação no navegador. Aprovação editorial pendente; não equivale a finalização do capítulo.',
  })),
  { chapterId: 'summary-biologia-bioenergetica-fotossintese-e-quimiossintese', mechanism: 'cloroplasto em corte e procarionte quimioautotrófico', relation: 'luz ou oxidação inorgânica fornecem energia; CO₂ fornece carbono', status: 'em-validacao', evidencePaths: ['fotossintese-390-light', 'fotossintese-1440-light', 'quimiossintese-390-dark', 'quimiossintese-1440-dark'].map(name => `docs/visual-personalizado/screenshots/bioenergetica-motion-2026-09-23/${name}.png`), notes: 'Reconstrução com fluxos finitos, seleção por teclado e dez verificações de largura nos dois temas. Movimento reduzido coberto por teste de componente, sem emulação no navegador. Aprovação editorial pendente.' },
  { chapterId: 'bio-ecologia-ciclo-nitrogenio', mechanism: 'ciclo microbiano no solo e atmosfera', relation: 'fixação e amonificação alimentam nitrificação; desnitrificação devolve N₂', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-nitrogenio'), notes: qaNotes },
  { chapterId: 'bio-ecologia-eutrofizacao', mechanism: 'seção vertical de lago', relation: 'nutrientes induzem floração, bloqueiam luz e levam ao consumo de oxigênio', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-eutrofizacao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-dinamica-populacoes', mechanism: 'perfis reprodutivos', relation: 'muitos descendentes e pouco cuidado versus poucos descendentes e longo cuidado', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-dinamica-populacoes'), notes: qaNotes },
  { chapterId: 'bio-ecologia-invasoras-controle-biologico', mechanism: 'rede de impactos', relation: 'invasora alcança nativas, recursos, genes e ambiente por cinco caminhos', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-invasoras-controle-biologico'), notes: qaNotes },
  { chapterId: 'bio-ecologia-sucessao', mechanism: 'paisagem de comunidades', relation: 'solo e vegetação mudam da pioneira ao clímax', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-sucessao'), notes: qaNotes },
  { chapterId: 'bio-ecologia-ciclo-hidrologico-poluicao-agua', mechanism: 'fonte, água e efeito', relation: 'cada agente altera o meio aquático por consequência própria', status: 'em-validacao', evidencePaths: ecologyEvidence('bio-ecologia-ciclo-hidrologico-poluicao-agua'), notes: qaNotes },
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
