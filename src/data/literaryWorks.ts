// Listas de leitura obrigatória — Fuvest e Comvest/Unicamp, ciclo 2027
// (vestibular a ser prestado no fim de 2026). Fonte: divulgação oficial das
// bancas, cruzada com múltiplas coberturas jornalísticas independentes.

export interface LiteraryWork {
  title: string;
  author: string;
  movement: string;
  examAngle: string;
  uncertain?: boolean;
}

export interface ExamLiteraryList {
  board: 'Fuvest' | 'Unicamp';
  cycle: string;
  note?: string;
  works: LiteraryWork[];
}

export const literaryWorks: ExamLiteraryList[] = [
  {
    board: 'Fuvest',
    cycle: 'Vestibular 2027 (ciclo de obras só de autoras mulheres)',
    note: 'Os títulos 1 e 4 desta lista tiveram confirmação um pouco mais frágil na pesquisa (existe uma troca parecida para o ciclo 2028) — vale conferir diretamente em fuvest.br antes de estudar por eles com 100% de confiança.',
    works: [
      {
        title: 'Opúsculo Humanitário',
        author: 'Nísia Floresta',
        movement: 'Romantismo (ensaio/manifesto)',
        examAngle: 'Uma das primeiras defesas públicas dos direitos das mulheres e da educação feminina no Brasil. Questões tendem a cobrar a tese central — educação como caminho de emancipação — e o contexto histórico do Brasil oitocentista.',
        uncertain: true,
      },
      {
        title: 'Nebulosas',
        author: 'Narcisa Amália',
        movement: 'Romantismo tardio (antecipa traços do Simbolismo)',
        examAngle: 'Coletânea de 44 poemas marcados por subjetivismo e melancolia, com crítica à condição feminina numa sociedade patriarcal, sem a idealização romântica clássica da mulher. Esse contraste costuma ser o ângulo de prova.',
      },
      {
        title: 'Memórias de Martha',
        author: 'Julia Lopes de Almeida',
        movement: 'Transição Realismo/Naturalismo',
        examAngle: 'Narrativa em 1ª pessoa sobre duas Marthas (mãe e filha) num cortiço. Eixo temático é opressão de gênero, classe e cor na virada do século; foco de prova costuma ser a construção da identidade feminina e a crítica social.',
      },
      {
        title: 'Caminho de pedras',
        author: 'Rachel de Queiroz',
        movement: 'Modernismo — 2ª fase ("Romance de 30"), regionalismo social',
        examAngle: 'A protagonista Noemi, casada, envolve-se com um militante socialista. Tema central é a jornada de emancipação política e pessoal da protagonista contra normas conservadoras — ângulo recorrente: luta de classes + autonomia feminina.',
        uncertain: true,
      },
      {
        title: 'A Paixão Segundo G.H.',
        author: 'Clarice Lispector',
        movement: 'Prosa introspectiva de matiz existencialista',
        examAngle: 'Narrativa de fluxo de consciência: a protagonista G.H., após esmagar uma barata, mergulha numa crise existencial de identidade. Ângulo clássico de prova: a crise de individuação e a linguagem fragmentada/filosófica.',
      },
      {
        title: 'Geografia',
        author: 'Sophia de Mello Breyner Andresen',
        movement: 'Poesia portuguesa contemporânea',
        examAngle: 'Explora natureza x cidade, infância, memória e a viagem da autora à Grécia (helenismo), em diálogo indireto com a ditadura de Salazar. Ângulo de prova: a linguagem clássica/rítmica e o contraponto natureza-civilização.',
      },
      {
        title: 'Balada de Amor ao Vento',
        author: 'Paulina Chiziane',
        movement: 'Literatura moçambicana contemporânea',
        examAngle: 'Primeiro romance de autoria feminina moçambicana; história de amor de Sarnau e Mwando, abordando tradições que restringem a autonomia da mulher. Ângulo de prova: relação indivíduo/tradição e voz feminina africana lusófona.',
      },
      {
        title: 'Canção para Ninar Menino Grande',
        author: 'Conceição Evaristo',
        movement: 'Literatura afro-brasileira contemporânea ("escrevivência")',
        examAngle: 'Narrativa polifônica centrada em Fio Jasmim, homem negro ferroviário, sobre masculinidade negra e sua relação com mulheres negras. Ângulo de prova: escrevivência como método e a construção da identidade negra masculina.',
      },
      {
        title: 'A Visão das Plantas',
        author: 'Djaimilia Pereira de Almeida',
        movement: 'Literatura portuguesa contemporânea',
        examAngle: 'O capitão Celestino, ex-capitão de navio negreiro, volta-se ao cuidado do jardim na velhice; a natureza funciona como metáfora do bem e do mal. Ângulo de prova: memória do colonialismo e culpa histórica via essa metáfora.',
      },
    ],
  },
  {
    board: 'Unicamp',
    cycle: 'Vestibular 2027 (divulgada em março de 2025 pela Comvest)',
    works: [
      {
        title: 'A vida não é útil',
        author: 'Ailton Krenak',
        movement: 'Ensaio/crônica filosófico-poética, literatura indígena contemporânea',
        examAngle: 'Coletânea de textos adaptados de palestras, criticando a lógica capitalista/utilitarista e a devastação ambiental, propondo saberes ancestrais indígenas como alternativa. Ângulo de prova: crítica ao "progresso" e ao antropocentrismo.',
      },
      {
        title: 'Prosas seguidas de odes mínimas',
        author: 'José Paulo Paes',
        movement: 'Poesia/prosa poética contemporânea',
        examAngle: 'Textos em prosa e "odes mínimas" sobre memória autobiográfica, passagem do tempo e crítica social com humor e ironia epigramática.',
      },
      {
        title: 'Morangos mofados (seis contos selecionados)',
        author: 'Caio Fernando Abreu',
        movement: 'Literatura Marginal/Contracultura',
        examAngle: 'Contos sobre solidão, marginalização e melancolia numa geração marcada pela ditadura militar. Ângulo de prova: contexto histórico dos anos de chumbo e a prosa fragmentária/existencial.',
      },
      {
        title: 'Vida e morte de M. J. Gonzaga de Sá',
        author: 'Lima Barreto',
        movement: 'Pré-modernismo brasileiro',
        examAngle: 'Narrado por um funcionário humilde sobre a vida do amigo Gonzaga de Sá, satirizando a aristocracia carioca. Ângulo de prova: crítica social ao início do século XX e ruptura com convenções realistas.',
      },
      {
        title: 'No seu pescoço',
        author: 'Chimamanda Ngozi Adichie',
        movement: 'Literatura africana/pós-colonial contemporânea (contos)',
        examAngle: 'Explora migração, diáspora negra e choque cultural Nigéria-EUA. Ângulo de prova: desconstrução do "sonho americano" e identidade da mulher negra migrante.',
      },
      {
        title: 'Olhos d\'água',
        author: 'Conceição Evaristo',
        movement: 'Literatura afro-brasileira contemporânea ("escrevivência")',
        examAngle: 'Contos sobre mulheres negras brasileiras, racismo, violência e resistência, na perspectiva "de baixo". Compará-la com a obra da mesma autora na lista da Fuvest é um bom ângulo de redação/dissertativa.',
      },
      {
        title: 'Memórias Póstumas de Brás Cubas',
        author: 'Machado de Assis',
        movement: 'Inaugura o Realismo brasileiro',
        examAngle: 'Narrado por um "defunto-autor", com ironia, pessimismo e crítica à burguesia. Ângulo clássico de prova: a inovação narrativa (narrador morto) e a crítica social irônica.',
      },
      {
        title: 'Os funerais da Mamãe Grande (8 contos)',
        author: 'Gabriel García Márquez',
        movement: 'Realismo mágico',
        examAngle: 'Contos ambientados em Macondo, mesclando o trivial e o fantástico. Ângulo de prova: características do realismo mágico e comparação com a tradição regionalista latino-americana.',
      },
      {
        title: 'Canções escolhidas (14 letras)',
        author: 'Paulo César Pinheiro',
        movement: 'MPB — poesia musicada',
        examAngle: 'Não é um livro, mas uma seleção de 14 letras de música marcada por lirismo político-social. Ângulo de prova: análise da letra como texto poético (metáfora, ritmo, crítica social).',
      },
    ],
  },
];
