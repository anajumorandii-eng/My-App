import { LiteraryWork, WorkEdition, ExamRequirement } from '../../src/types/literaryWorks';

// Catálogo curado na Fase 0 (Saneamento) do roteiro de Obras Obrigatórias —
// as 18 exigências oficiais do ciclo 2027 (9 Fuvest + 9 Unicamp/Comvest),
// com o resultado da auditoria dos 16 PDFs recebidos em obras-brutos/.
//
// sourceFileId ainda é um placeholder: o upload real pro bucket privado
// (POST /api/admin/literary/works/:workId/editions) só roda quando o painel
// de ingestão (Fase 1, item pendente) existir. fileHash já é o SHA-256 real
// dos arquivos auditados, calculado a partir de obras-brutos/, pra permitir
// detectar duplicata/alteração no upload de verdade mais tarde.
//
// Ver AUDITORIA_FASE0.md (na mesma pasta dos PDFs brutos) para o detalhe de
// cada achado de auditoria.

const FUVEST_OFFICIAL_LIST_URL = 'https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/';
const UNICAMP_OFFICIAL_LIST_URL = 'https://www.unicamp.br/noticias/2025/03/25/comvest-divulga-listas-de-livros-para-os-vestibulares-2027-2028-e-2029/';
const VERIFIED_AT = '2026-08-22';

export const SEED_WORKS: LiteraryWork[] = [
  // --- Fuvest 2027 ---
  { id: 'opusculo-humanitario', slug: 'opusculo-humanitario', title: 'Opúsculo Humanitário', author: 'Nísia Floresta', originalYear: 1853, genre: 'ensaio', language: 'pt-BR' },
  { id: 'nebulosas', slug: 'nebulosas', title: 'Nebulosas', author: 'Narcisa Amália', originalYear: 1872, genre: 'poesia', language: 'pt-BR' },
  { id: 'memorias-de-martha', slug: 'memorias-de-martha', title: 'Memórias de Martha', author: 'Júlia Lopes de Almeida', originalYear: 1899, genre: 'romance', language: 'pt-BR' },
  { id: 'caminho-de-pedras', slug: 'caminho-de-pedras', title: 'Caminho de Pedras', author: 'Rachel de Queiroz', originalYear: 1937, genre: 'romance', language: 'pt-BR' },
  { id: 'paixao-segundo-gh', slug: 'paixao-segundo-gh', title: 'A Paixão Segundo G.H.', author: 'Clarice Lispector', originalYear: 1964, genre: 'romance', language: 'pt-BR' },
  { id: 'geografia', slug: 'geografia', title: 'Geografia', author: 'Sophia de Mello Breyner Andresen', originalYear: 1967, genre: 'poesia', language: 'pt-PT' },
  { id: 'balada-de-amor-ao-vento', slug: 'balada-de-amor-ao-vento', title: 'Balada de Amor ao Vento', author: 'Paulina Chiziane', originalYear: 1990, genre: 'romance', language: 'pt-MZ' },
  { id: 'cancao-para-ninar-menino-grande', slug: 'cancao-para-ninar-menino-grande', title: 'Canção para Ninar Menino Grande', author: 'Conceição Evaristo', originalYear: 2018, genre: 'romance', language: 'pt-BR' },
  { id: 'visao-das-plantas', slug: 'visao-das-plantas', title: 'A Visão das Plantas', author: 'Djaimilia Pereira de Almeida', originalYear: 2019, genre: 'romance', language: 'pt-PT' },

  // --- Unicamp/Comvest 2027 ---
  { id: 'a-vida-nao-e-util', slug: 'a-vida-nao-e-util', title: 'A Vida Não É Útil', author: 'Ailton Krenak', originalYear: 2020, genre: 'ensaio', language: 'pt-BR' },
  { id: 'prosas-seguidas-de-odes-minimas', slug: 'prosas-seguidas-de-odes-minimas', title: 'Prosas Seguidas de Odes Mínimas', author: 'José Paulo Paes', originalYear: 1992, genre: 'poesia', language: 'pt-BR' },
  { id: 'morangos-mofados', slug: 'morangos-mofados', title: 'Morangos Mofados', author: 'Caio Fernando Abreu', originalYear: 1982, genre: 'conto', language: 'pt-BR' },
  { id: 'gonzaga-de-sa', slug: 'gonzaga-de-sa', title: 'Vida e Morte de M.J. Gonzaga de Sá', author: 'Lima Barreto', originalYear: 1919, genre: 'romance', language: 'pt-BR' },
  { id: 'no-seu-pescoco', slug: 'no-seu-pescoco', title: 'No Seu Pescoço', author: 'Chimamanda Ngozi Adichie', originalYear: 2009, genre: 'conto', language: 'pt-BR' },
  { id: 'olhos-dagua', slug: 'olhos-dagua', title: 'Olhos d\'Água', author: 'Conceição Evaristo', originalYear: 2014, genre: 'conto', language: 'pt-BR' },
  { id: 'bras-cubas', slug: 'bras-cubas', title: 'Memórias Póstumas de Brás Cubas', author: 'Machado de Assis', originalYear: 1881, genre: 'romance', language: 'pt-BR' },
  { id: 'funerais-da-mamae-grande', slug: 'funerais-da-mamae-grande', title: 'Os Funerais da Mamãe Grande', author: 'Gabriel García Márquez', originalYear: 1962, genre: 'conto', language: 'pt-BR' },
  { id: 'cancoes-escolhidas-14-letras', slug: 'cancoes-escolhidas-14-letras', title: 'Canções Escolhidas (14 letras)', author: 'Paulo César Pinheiro', genre: 'canção/poesia musicada', language: 'pt-BR' },
];

// Os 2 materiais que bloqueavam a Fase 0 (seção 3.3 do roteiro) foram
// enviados pela Ana Júlia em 22/08/2026 — ver as edições correspondentes
// logo abaixo. Nenhuma obra segue sem material-fonte.
export const PENDING_MATERIAL_WORKS: LiteraryWork[] = [];

export const SEED_EDITIONS: WorkEdition[] = [
  {
    id: 'opusculo-humanitario-ed1', workId: 'opusculo-humanitario', publisher: 'Senado Federal (Coleção Escritoras do Brasil)',
    pdfPageCount: 162, sourceFileId: 'pending-ingestion',
    fileHash: '758e904b92e562d5617535b07a0595a51fc6766e89316440297f738ff0a5d741',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // achado: colunas embaralhadas na extração das páginas iniciais (layout em 2 colunas).
  },
  {
    id: 'nebulosas-ed1', workId: 'nebulosas', publisher: 'edição 2024 com introdução e notas',
    pdfPageCount: 194, sourceFileId: 'pending-ingestion',
    fileHash: '92c84d40f3b30927eb1c175a1049341225a596e29ad1da8cc5beb40d7bb0dbd6',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // achado: paratexto crítico (introdução/notas) precisa ser separado do corpo dos 44 poemas na segmentação.
  },
  {
    id: 'memorias-de-martha-ed1', workId: 'memorias-de-martha', publisher: 'edição 2024, ortografia atualizada',
    pdfPageCount: 60, sourceFileId: 'pending-ingestion',
    fileHash: 'f10048b045d7fab9b336b0ec9d8d45f5a08fc15d52c6ef0dc567125684d80d90',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'verified',
  },
  {
    id: 'caminho-de-pedras-ed1', workId: 'caminho-de-pedras', publisher: 'José Olympio/Record', year: 2024,
    pdfPageCount: 102, sourceFileId: 'pending-ingestion',
    fileHash: '3a8274142abc4de4b01bf0f619493488ea96cf817366602ebe3cc80d54d9e896',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'verified',
  },
  {
    id: 'paixao-segundo-gh-ed1', workId: 'paixao-segundo-gh',
    pdfPageCount: 122, sourceFileId: 'pending-ingestion',
    fileHash: '9a61c582416d9980ac6a7002e68bd0f34a67129d04185b6e23ad6884c4458d0f',
    rightsStatus: 'authorized', integrityStatus: 'needs_review', extractionStatus: 'needs_review',
    // achado: conversão de ePub com metadados pobres — falta identificar edição/tradução usada.
  },
  {
    id: 'geografia-ed1', workId: 'geografia', publisher: 'Assírio & Alvim (estabelecimento de texto de Obra poética, 2015)',
    pdfPageCount: 93, sourceFileId: 'pending-ingestion',
    fileHash: '503501f6847be48288d2794dbfbf7bed441d530a1a1fda2b35e1a9a0e3af31c8',
    rightsStatus: 'authorized', integrityStatus: 'needs_review', extractionStatus: 'needs_review',
    // achados: (1) arquivo contém "O Cristo Cigano" nas págs. ~3-22, que não integra a
    // lista Fuvest 2027 — só págs. ~24-93 são "Geografia" de fato; (2) págs. 1-2 trazem
    // aviso/propaganda do site de digitalização não-oficial "eLivros" (Etapa B: excluir
    // do corpus de IA per seção 2.2 do roteiro).
  },
  {
    id: 'balada-de-amor-ao-vento-ed1', workId: 'balada-de-amor-ao-vento', publisher: 'Editorial Caminho', edition: '2ª edição', year: 2007,
    pdfPageCount: 76, sourceFileId: 'pending-ingestion',
    fileHash: '921e2c10e350949d70cbd9c8a230eccaa2eaecc5367284ca9ccda2417a3d3472',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'verified',
    // reauditado nesta passagem: o inventário inicial suspeitava de corte no meio de
    // frase no final; a última página traz um desfecho narrativo completo, sem corte.
  },
  {
    id: 'cancao-para-ninar-menino-grande-ed1', workId: 'cancao-para-ninar-menino-grande', edition: '2ª edição', year: 2022,
    pdfPageCount: 65, sourceFileId: 'pending-ingestion',
    fileHash: '16678a1688d98a66a7295dc68284c09bd0a4975d87e3fd2901b6e94cf7147af4',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // achado confirmado: catálogo editorial de outros títulos da Pallas/Evaristo nas
    // últimas páginas — remover do corpus antes da segmentação.
  },
  {
    id: 'visao-das-plantas-ed1', workId: 'visao-das-plantas', publisher: 'Todavia (ed. original Relógio D\'Água, 2019)', year: 2021, printedPageCount: 88,
    pdfPageCount: 82, sourceFileId: 'pending-ingestion',
    fileHash: 'fdbea708d74bec8a53eb26fc6e43edbe92f3360e77ace9061e91f950f1b88f85',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // achado: romance termina na pág. 64; pág. 65 é posfácio crítico de Humberto Brito
    // (fonte possível pra documented_criticism); págs. ~71+ são catálogo comercial —
    // ambos precisam ser tratados como fora do corpo do romance na segmentação.
  },
  {
    id: 'a-vida-nao-e-util-ed1', workId: 'a-vida-nao-e-util',
    pdfPageCount: 60, sourceFileId: 'pending-ingestion',
    fileHash: 'c42bef206cdeaa06cc373683903e2bfd92fdc64a3f2a15a7dba111833f85fb57',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // achado: catálogo editorial a remover (per inventário inicial).
  },
  {
    id: 'prosas-seguidas-de-odes-minimas-ed1', workId: 'prosas-seguidas-de-odes-minimas', edition: 'edição digital', year: 2023,
    pdfPageCount: 58, sourceFileId: 'pending-ingestion',
    fileHash: '415a9cec9117021f5dff5898a24ba12788d900ef1753d5d068012b1c09b67b22',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'verified',
  },
  {
    id: 'morangos-mofados-ed1', workId: 'morangos-mofados',
    pdfPageCount: 95, sourceFileId: 'pending-ingestion',
    fileHash: '5a6209a453a73ea90b321c8421f042255c04d136ce5a03ea6169cc0d98603cd7',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // livro completo (muito mais que 6 contos) — segmentação precisa isolar exatamente
    // "Diálogo", "Além do Ponto", "Terça-Feira Gorda", "Pêra, uva ou maçã?", "O dia em
    // que Júpiter encontrou Saturno" e "Aqueles dois" (ver requiredScope abaixo).
  },
  {
    id: 'gonzaga-de-sa-ed1', workId: 'gonzaga-de-sa', publisher: 'Wikisource (exportado em 10/12/2025)',
    pdfPageCount: 92, sourceFileId: 'pending-ingestion',
    fileHash: 'fcf9ef8ebca6c4140447be0b856653d0cd97c94a5f63d9ddd693ed713e9c8f4c',
    rightsStatus: 'authorized', integrityStatus: 'needs_review', extractionStatus: 'needs_review',
    // achado: texto de Wikisource precisa ser conferido contra uma edição confiável
    // antes de virar fonte de citação/paginação (Etapa B do roteiro).
  },
  {
    id: 'no-seu-pescoco-ed1', workId: 'no-seu-pescoco',
    pdfPageCount: 136, sourceFileId: 'pending-ingestion',
    fileHash: 'c3822a535a5bdc4642d70d555751f94b866b8b527f2c05b69de637f2c261712e',
    rightsStatus: 'authorized', integrityStatus: 'needs_review', extractionStatus: 'needs_review',
    // achado confirmado nesta auditoria: nenhuma menção a tradutor/edição encontrada no
    // miolo do arquivo — precisa ser identificada antes de citar página/tradução.
  },
  {
    id: 'bras-cubas-ed1', workId: 'bras-cubas', publisher: 'Edições Câmara', year: 2018,
    pdfPageCount: 134, sourceFileId: 'pending-ingestion',
    fileHash: 'faa9143f3ee292ba2919b086541b3dc1b17eaeaa4ca544b5bc49eb9daff36cfc',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'verified',
  },
  {
    id: 'funerais-da-mamae-grande-ed1', workId: 'funerais-da-mamae-grande', publisher: 'Editora Record', edition: '15ª edição', translator: 'Édson Braga',
    pdfPageCount: 85, sourceFileId: 'pending-ingestion',
    fileHash: 'f2dccbcf61dfeeb69b0b4f0d760afc6b1677df48cdef15bfd98c2fee137588d0',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // tradutor identificado nesta auditoria (Édson Braga); falta mapear os 8 contos
    // obrigatórios como WorkUnit na segmentação.
  },
  {
    id: 'olhos-dagua-ed1', workId: 'olhos-dagua', publisher: 'Pallas Editora', year: 2014,
    pdfPageCount: 83, sourceFileId: 'pending-ingestion',
    fileHash: '96d810fadda2f7354be7e93d1e3d5565653ab101b9559d1b895a1bf5d994d32e',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'needs_review',
    // enviado pela Ana Júlia em 22/08/2026, resolvendo o bloqueador da Fase 0.
    // achado: conto real termina na pág. ~71; págs. 72-83 são aviso de site de
    // digitalização não-oficial + catálogo comercial da Pallas — mesmo tratamento
    // dado a "A visão das plantas" e "Canção para ninar menino grande" (excluir do
    // corpus antes da segmentação).
  },
  {
    id: 'cancoes-escolhidas-14-letras-ed1', workId: 'cancoes-escolhidas-14-letras',
    // fonte é .docx, não PDF — pdfPageCount não se aplica; contagem real é de 14
    // letras (canções), não de páginas. O modelo WorkEdition assume PDF; revisitar
    // esse campo se mais fontes não-PDF entrarem no catálogo.
    pdfPageCount: 0, sourceFileId: 'pending-ingestion',
    fileHash: '8132656bb3b1c8f396525bf96c7f5ec49e978b0edbbb43d23fff89a846992dc2',
    rightsStatus: 'authorized', integrityStatus: 'verified', extractionStatus: 'verified',
    // enviado pela Ana Júlia em 22/08/2026, resolvendo o bloqueador da Fase 0.
    // arquivo limpo, sem contaminação de site de download. As 14 letras
    // confirmadas: Viagem, Canto das Três Raças, Estrela da Terra, Mordaça, Na
    // Volta que o Mundo Dá, Pesadelo, Vento Bravo, Evangelho, Cordilheira,
    // Desenredo, Navio Fantasma, O Dia em que o Morro Descer e Não For Carnaval,
    // Velho Arvoredo e Vontade de Chorar.
  },
];

export const SEED_EXAM_REQUIREMENTS: ExamRequirement[] = [
  // --- Fuvest 2027 ---
  { id: 'opusculo-humanitario-fuvest-2027', workId: 'opusculo-humanitario', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'nebulosas-fuvest-2027', workId: 'nebulosas', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'memorias-de-martha-fuvest-2027', workId: 'memorias-de-martha', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'caminho-de-pedras-fuvest-2027', workId: 'caminho-de-pedras', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'paixao-segundo-gh-fuvest-2027', workId: 'paixao-segundo-gh', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'geografia-fuvest-2027', workId: 'geografia', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa (excluir "O Cristo Cigano" do mesmo PDF — não integra a lista 2027)', active: true },
  { id: 'balada-de-amor-ao-vento-fuvest-2027', workId: 'balada-de-amor-ao-vento', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'cancao-para-ninar-menino-grande-fuvest-2027', workId: 'cancao-para-ninar-menino-grande', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'visao-das-plantas-fuvest-2027', workId: 'visao-das-plantas', board: 'FUVEST', examCycle: '2027', officialListUrl: FUVEST_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },

  // --- Unicamp/Comvest 2027 ---
  { id: 'a-vida-nao-e-util-unicamp-2027', workId: 'a-vida-nao-e-util', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'prosas-seguidas-de-odes-minimas-unicamp-2027', workId: 'prosas-seguidas-de-odes-minimas', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'morangos-mofados-unicamp-2027', workId: 'morangos-mofados', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: '6 contos: "Diálogo", "Além do Ponto", "Terça-Feira Gorda", "Pêra, uva ou maçã?", "O dia em que Júpiter encontrou Saturno" e "Aqueles dois"', active: true },
  { id: 'gonzaga-de-sa-unicamp-2027', workId: 'gonzaga-de-sa', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'no-seu-pescoco-unicamp-2027', workId: 'no-seu-pescoco', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: '12 contos (obra completa)', active: true },
  { id: 'olhos-dagua-unicamp-2027', workId: 'olhos-dagua', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'bras-cubas-unicamp-2027', workId: 'bras-cubas', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: 'obra completa', active: true },
  { id: 'funerais-da-mamae-grande-unicamp-2027', workId: 'funerais-da-mamae-grande', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: '8 contos (obra completa; mapeamento de cada conto pendente na Fase 1)', active: true },
  { id: 'cancoes-escolhidas-14-letras-unicamp-2027', workId: 'cancoes-escolhidas-14-letras', board: 'UNICAMP', examCycle: '2027', officialListUrl: UNICAMP_OFFICIAL_LIST_URL, officiallyVerifiedAt: VERIFIED_AT, requiredScope: '14 letras: Viagem, Canto das Três Raças, Estrela da Terra, Mordaça, Na Volta que o Mundo Dá, Pesadelo, Vento Bravo, Evangelho, Cordilheira, Desenredo, Navio Fantasma, O Dia em que o Morro Descer e Não For Carnaval, Velho Arvoredo e Vontade de Chorar', active: true },
];
