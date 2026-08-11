import { Topic, TopicMastery, UserProfile, ErrorLog, Question, PodcastEpisode, StudyMethod } from '../types';

export const mockTopics: Topic[] = [
  { id: 'bio_01', name: 'Citologia', subject: 'Biologia', prerequisites: [] },
  { id: 'bio_02', name: 'Genética', subject: 'Biologia', prerequisites: ['bio_01'] },
  { id: 'mat_01', name: 'Funções de 1º Grau', subject: 'Matemática', prerequisites: [] },
  { id: 'mat_02', name: 'Análise Combinatória', subject: 'Matemática', prerequisites: [] },
  { id: 'fis_01', name: 'Cinemática', subject: 'Física', prerequisites: ['mat_01'] },
  { id: 'fis_02', name: 'Eletrodinâmica', subject: 'Física', prerequisites: [] }
];

export const mockMastery: TopicMastery[] = [
  { topicId: 'bio_01', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_02', level: 30, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'mat_01', level: 95, uncertainty: 0.05, lastReviewed: new Date(Date.now() - 15 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'mat_02', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 4 },
  { topicId: 'fis_01', level: 75, uncertainty: 0.2, lastReviewed: new Date(Date.now() - 2 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_02', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 2 }
];

export const mockProfile: UserProfile = {
  targetCourse: 'Medicina',
  targetUniversities: ['USP', 'UNICAMP', 'UNESP'],
  targetExams: ['ENEM', 'FUVEST'],
  availableHoursPerWeek: 40,
  currentEnergyLevel: 'medium',
  autonomyIndex: 35 // starts low, increases over time
};

export const mockErrorLogs: ErrorLog[] = [
  {
    id: 'err_1',
    topicId: 'mat_02',
    questionId: 'q_mat_02_1',
    date: new Date().toISOString(),
    type: 'interpretation',
    notes: 'Confundi "pelo menos um" com "exatamente um".',
    aiHypothesis: 'A hipótese provável é falha na decodificação do jargão lógico de combinatória. Recomendo mapear as palavras-chave (e/ou, no mínimo/no máximo).'
  }
];

export const mockQuestions: Question[] = [
  {
    id: 'q_bio_01_1',
    topicId: 'bio_01',
    subject: 'Biologia',
    prompt: 'Qual organela é responsável pela produção de ATP através da respiração celular aeróbica?',
    options: [
      { id: 'a', text: 'Complexo de Golgi' },
      { id: 'b', text: 'Mitocôndria' },
      { id: 'c', text: 'Retículo endoplasmático liso' },
      { id: 'd', text: 'Lisossomo' }
    ],
    correctOptionId: 'b',
    explanation: 'A mitocôndria realiza a fosforilação oxidativa na cadeia transportadora de elétrons, gerando a maior parte do ATP celular.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_02_1',
    topicId: 'bio_02',
    subject: 'Biologia',
    prompt: 'No cruzamento entre dois heterozigotos (Aa x Aa), qual a proporção fenotípica esperada considerando dominância completa?',
    options: [
      { id: 'a', text: '1:1' },
      { id: 'b', text: '1:2:1' },
      { id: 'c', text: '3:1' },
      { id: 'd', text: '9:3:3:1' }
    ],
    correctOptionId: 'c',
    explanation: 'Com dominância completa, o cruzamento Aa x Aa produz genótipos na proporção 1AA:2Aa:1aa, resultando em fenótipos 3 dominantes : 1 recessivo.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_01_1',
    topicId: 'mat_01',
    subject: 'Matemática',
    prompt: 'Qual é o valor de x para que a função f(x) = 2x - 6 seja igual a zero?',
    options: [
      { id: 'a', text: 'x = -3' },
      { id: 'b', text: 'x = 0' },
      { id: 'c', text: 'x = 3' },
      { id: 'd', text: 'x = 6' }
    ],
    correctOptionId: 'c',
    explanation: 'Isolando x: 2x - 6 = 0 → 2x = 6 → x = 3. Essa é a raiz da função, onde o gráfico cruza o eixo x.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_02_1',
    topicId: 'mat_02',
    subject: 'Matemática',
    prompt: 'De quantas formas 3 pessoas podem se sentar em 3 cadeiras em fila?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '6' },
      { id: 'c', text: '9' },
      { id: 'd', text: '12' }
    ],
    correctOptionId: 'b',
    explanation: 'É uma permutação simples de 3 elementos: 3! = 3 × 2 × 1 = 6 formas distintas.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_01_1',
    topicId: 'fis_01',
    subject: 'Física',
    prompt: 'Um corpo parte do repouso com aceleração constante de 2 m/s². Qual sua velocidade após 5 segundos?',
    options: [
      { id: 'a', text: '2,5 m/s' },
      { id: 'b', text: '5 m/s' },
      { id: 'c', text: '7 m/s' },
      { id: 'd', text: '10 m/s' }
    ],
    correctOptionId: 'd',
    explanation: 'Usando v = v0 + a·t, com v0 = 0: v = 2 × 5 = 10 m/s.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_02_1',
    topicId: 'fis_02',
    subject: 'Física',
    prompt: 'Em um circuito com dois resistores de 10Ω em série ligados a uma fonte de 20V, qual a corrente total no circuito?',
    options: [
      { id: 'a', text: '0,5 A' },
      { id: 'b', text: '1 A' },
      { id: 'c', text: '2 A' },
      { id: 'd', text: '4 A' }
    ],
    correctOptionId: 'b',
    explanation: 'Resistência equivalente em série: 10 + 10 = 20Ω. Pela Lei de Ohm, I = V/R = 20/20 = 1 A.',
    difficulty: 'hard'
  }
];

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: 'pod_bio_01',
    topicId: 'bio_01',
    title: 'Citologia em 5 minutos',
    subject: 'Biologia',
    durationMinutes: 5,
    script: 'A célula é a unidade fundamental da vida. Toda célula possui uma membrana plasmática que controla o que entra e sai. Dentro dela, o citoplasma abriga as organelas. As mitocôndrias produzem energia na forma de ATP através da respiração celular. O núcleo guarda o material genético e comanda as atividades celulares. Entender a função de cada organela é a base para todo o resto da biologia celular e molecular que você vai estudar.'
  },
  {
    id: 'pod_bio_02',
    topicId: 'bio_02',
    title: 'Genética Mendeliana sem decoreba',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'Mendel descobriu que características são herdadas em unidades discretas, os genes, que existem em pares chamados alelos. Quando um alelo é dominante, ele se expressa mesmo na presença de um alelo recessivo. Um heterozigoto tem um alelo de cada tipo. Ao cruzar dois heterozigotos, a proporção fenotípica esperada é de três dominantes para um recessivo. Isso é a base do quadro de Punnett, sua principal ferramenta para prever cruzamentos.'
  },
  {
    id: 'pod_mat_01',
    topicId: 'mat_01',
    title: 'Funções de primeiro grau na prática',
    subject: 'Matemática',
    durationMinutes: 4,
    script: 'Uma função de primeiro grau tem a forma f de x igual a a x mais b, onde a é o coeficiente angular e b o coeficiente linear. O coeficiente a define a inclinação da reta: se for positivo, a função é crescente, se for negativo, é decrescente. A raiz da função é o valor de x que zera f de x, ou seja, onde a reta cruza o eixo horizontal. Esse conceito aparece disfarçado em várias questões de física e economia no vestibular.'
  },
  {
    id: 'pod_mat_02',
    topicId: 'mat_02',
    title: 'Análise combinatória: quando somar e quando multiplicar',
    subject: 'Matemática',
    durationMinutes: 7,
    script: 'A maior pegadinha da análise combinatória é saber quando somar e quando multiplicar possibilidades. Use a multiplicação quando os eventos acontecem em sequência, um depois do outro. Use a soma quando são alternativas que se excluem. Permutação é usada quando todos os elementos são organizados em ordem. Combinação é usada quando a ordem não importa. Ler o enunciado com atenção às palavras chave, como pelo menos, no máximo e exatamente, evita a maioria dos erros de interpretação.'
  },
  {
    id: 'pod_fis_01',
    topicId: 'fis_01',
    title: 'Cinemática: as três equações que resolvem tudo',
    subject: 'Física',
    durationMinutes: 5,
    script: 'A cinemática descreve o movimento sem se preocupar com suas causas. As três equações fundamentais do movimento uniformemente variado são: velocidade igual a velocidade inicial mais aceleração vezes tempo; posição igual a posição inicial mais velocidade inicial vezes tempo mais metade da aceleração vezes tempo ao quadrado; e a equação de Torricelli, velocidade ao quadrado igual a velocidade inicial ao quadrado mais duas vezes aceleração vezes o deslocamento. Dominar essas três fórmulas resolve a grande maioria das questões de cinemática do vestibular.'
  },
  {
    id: 'pod_fis_02',
    topicId: 'fis_02',
    title: 'Eletrodinâmica: série, paralelo e a Lei de Ohm',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Em circuitos em série, a corrente é a mesma em todos os componentes e as resistências se somam diretamente. Em circuitos em paralelo, a tensão é a mesma em todos os ramos e o inverso da resistência equivalente é a soma dos inversos de cada resistência. A Lei de Ohm, tensão igual a resistência vezes corrente, conecta essas três grandezas e é a ferramenta mais usada para resolver exercícios de eletrodinâmica no vestibular.'
  }
];

export const mockStudyMethods: StudyMethod[] = [
  {
    id: 'method_active_recall',
    name: 'Evocação Ativa (Active Recall)',
    category: 'retencao',
    summary: 'Testar sua memória ativamente é muito mais eficaz do que reler o material passivamente.',
    steps: [
      'Feche o material de estudo antes de começar.',
      'Tente escrever ou falar tudo que lembra sobre o tópico, sem consultar nada.',
      'Compare com o material original e identifique as lacunas.',
      'Repita o processo focando apenas nas lacunas encontradas.'
    ],
    bestFor: ['Revisão de conteúdo teórico', 'Preparação para questões discursivas']
  },
  {
    id: 'method_spaced_repetition',
    name: 'Repetição Espaçada',
    category: 'retencao',
    summary: 'Revisar o conteúdo em intervalos crescentes de tempo consolida a memória de longo prazo.',
    steps: [
      'Revise um tópico novo no dia seguinte ao primeiro contato.',
      'Se lembrar bem, aumente o intervalo até a próxima revisão (ex: 3 dias, depois 7, depois 15).',
      'Se errar ou tiver dúvida, reduza o intervalo e revise antes.',
      'Use a tela de Revisões Adaptativas para acompanhar o que está vencendo.'
    ],
    bestFor: ['Matérias com muito conteúdo decorável', 'Fórmulas e definições']
  },
  {
    id: 'method_feynman',
    name: 'Técnica de Feynman',
    category: 'aquisicao',
    summary: 'Explicar um conceito em linguagem simples revela exatamente onde está sua lacuna de entendimento.',
    steps: [
      'Escolha um conceito e escreva o nome dele no topo de uma folha.',
      'Explique-o como se estivesse ensinando para alguém de 12 anos, sem jargões.',
      'Onde você travar ou usar termos complicados, volte ao material de estudo.',
      'Simplifique a explicação até ficar clara e fluida.'
    ],
    bestFor: ['Conceitos abstratos de Física e Química', 'Preparação para o Tutor Socrático']
  },
  {
    id: 'method_interleaving',
    name: 'Prática Intercalada (Interleaving)',
    category: 'aplicacao',
    summary: 'Alternar entre matérias ou tipos de problema numa mesma sessão melhora a capacidade de reconhecer qual estratégia usar.',
    steps: [
      'Em vez de fazer 20 questões seguidas do mesmo tópico, misture 2-3 tópicos relacionados.',
      'Alterne a ordem a cada sessão para evitar prever o próximo tipo de questão.',
      'Foque em identificar qual conceito a questão está testando antes de resolver.'
    ],
    bestFor: ['Simulados', 'Revisão final antes da prova']
  },
  {
    id: 'method_pomodoro',
    name: 'Pomodoro',
    category: 'foco',
    summary: 'Blocos curtos e cronometrados de foco intenso, intercalados com pausas curtas, sustentam a concentração por mais tempo.',
    steps: [
      'Escolha uma única tarefa de estudo.',
      'Estude com foco total por 25 minutos, sem distrações.',
      'Faça uma pausa de 5 minutos.',
      'A cada 4 ciclos, faça uma pausa mais longa de 15 a 30 minutos.'
    ],
    bestFor: ['Dias de baixa energia ou dificuldade de concentração', 'Sessões de estudo em casa']
  },
  {
    id: 'method_elaboration',
    name: 'Interrogação Elaborativa',
    category: 'aquisicao',
    summary: 'Perguntar "por quê" e "como" a cada novo fato conecta o conhecimento novo ao que você já sabe.',
    steps: [
      'Ao ler um fato novo, pare e pergunte "por que isso é verdade?".',
      'Tente responder com o que você já sabe antes de checar a resposta.',
      'Conecte explicitamente o novo conceito a outro que você já domina.'
    ],
    bestFor: ['Biologia e Química conceituais', 'Conexões interdisciplinares']
  }
];
