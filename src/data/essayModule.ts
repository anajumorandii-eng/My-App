// Módulo de Redação — modelos, guia passo a passo e critérios de nota máxima
// por vestibular (ENEM, Fuvest, Unicamp/Comvest, Unesp/Vunesp, Famerp,
// Unifesp). Estrutura geral e critérios de correção mudam pouco de ano para
// ano; pesos numéricos exatos e o gênero pedido pela Comvest mudam mais —
// marcados como incertos onde as fontes divergem ou o dado é sensível ao ano.

export interface StructurePart {
  part: 'Introdução' | 'Desenvolvimento' | 'Conclusão';
  title: string;
  description: string;
}

export const essayStructure: StructurePart[] = [
  {
    part: 'Introdução',
    title: 'Contextualização',
    description: 'Parta de algo mais amplo — um repertório, um fato histórico/social, uma observação conceitual — e vá estreitando até o recorte específico do tema. Abrir diretamente pela tese também pode funcionar, desde que o recorte e a posição fiquem claros.',
  },
  {
    part: 'Introdução',
    title: 'Tese',
    description: 'Declare com clareza a posição que você vai defender. Uma tese fraca ou implícita — que o corretor precisa "adivinhar" — prejudica textos argumentativos; em outros gêneros, confira como a posição ou ideia central deve aparecer na situação proposta.',
  },
  {
    part: 'Desenvolvimento',
    title: 'Tópico frasal',
    description: 'Cada parágrafo abre afirmando seu sub-argumento específico. Os parágrafos de desenvolvimento precisam defender pontos diferentes — repetir a mesma ideia com palavras diferentes é um erro comum.',
  },
  {
    part: 'Desenvolvimento',
    title: 'Repertório sociocultural',
    description: 'Traga a referência (livro, filme, dado, lei, conceito, evento histórico) como evidência, não como decoração. Ver o guia de repertório abaixo — essa é a diferença entre repertório "produtivo" e "decorado".',
  },
  {
    part: 'Desenvolvimento',
    title: 'Argumentação',
    description: 'Explique por que o repertório sustenta o seu ponto. É o passo mais pulado por redações medianas: citam a referência e seguem em frente sem argumentar de fato a conexão.',
  },
  {
    part: 'Desenvolvimento',
    title: 'Conclusão parcial',
    description: 'Feche o parágrafo retomando como aquele ponto sustenta a tese geral — evita que o parágrafo pareça um bloco solto de informação.',
  },
  {
    part: 'Conclusão',
    title: 'Retomada',
    description: 'Reafirme a tese e o argumento central, sem repetir a introdução palavra por palavra.',
  },
  {
    part: 'Conclusão',
    title: 'Proposta de intervenção',
    description: 'Obrigatória no ENEM, valorizada nas demais (e explicitamente cobrada pela Unifesp). Use a fórmula de 5 elementos abaixo — ela é o "padrão-ouro" e funciona mesmo onde não é exigida.',
  },
];

export interface InterventionElement {
  letter: string;
  title: string;
  description: string;
}

export const interventionFormula: InterventionElement[] = [
  { letter: '1', title: 'Agente', description: 'Quem vai executar a ação (governo, escolas, ONGs, família, mídia, o próprio indivíduo...).' },
  { letter: '2', title: 'Ação', description: 'O que exatamente será feito — verbo de ação concreto, não uma boa intenção vaga ("conscientizar" sozinho não basta).' },
  { letter: '3', title: 'Meio/modo', description: 'Como a ação será executada na prática (campanhas, leis, parcerias, investimento, currículo escolar...).' },
  { letter: '4', title: 'Finalidade', description: 'Para quê — o efeito esperado, conectado de volta à tese do texto.' },
  { letter: '5', title: 'Detalhamento', description: 'Aprofunde um dos quatro elementos acima. Explique um aspecto pertinente da execução ou da função de um elemento; confira os descritores na cartilha vigente.' },
];

export interface RepertoireGuidance {
  productive: string[];
  nonProductive: string[];
  connectivePhrases: string[];
}

export const repertoireGuidance: RepertoireGuidance = {
  productive: [
    'Você explica por que aquela referência sustenta especificamente o seu argumento (não um argumento genérico qualquer).',
    'A referência é usada como evidência dentro do raciocínio, na posição que faz a tese avançar.',
    'É uma referência verdadeira e verificável — inventar dados, autores ou pesquisas é reconhecido pelo corretor e derruba a credibilidade do texto inteiro.',
  ],
  nonProductive: [
    '"Decorar" uma citação/autor e encaixá-la em qualquer redação, independente do tema.',
    'Citar e seguir em frente sem explicar a conexão com o argumento.',
    'Repertório que só confirma o óbvio, sem acrescentar profundidade à discussão.',
  ],
  connectivePhrases: [
    'Isso pode ser ilustrado por...',
    'Tal cenário é evidenciado por...',
    'Nesse sentido, [referência] demonstra que...',
    'Um exemplo elucidativo dessa dinâmica é...',
    'Corroborando esse raciocínio, [referência] evidencia que...',
  ],
};

export interface EssayCriterion {
  name: string;
  description: string;
}

export interface EssayBoardProfile {
  board: string;
  format: string;
  scoring: string;
  criteria: EssayCriterion[];
  zeroRules: string[];
  keyToMaxScore: string;
  uncertain?: boolean;
  note?: string;
}

export const essayBoardProfiles: EssayBoardProfile[] = [
  {
    board: 'ENEM',
    format: 'Texto dissertativo-argumentativo em prosa, tema sigiloso até o dia da prova, a partir de uma coletânea de textos motivadores. Extensão: até 30 linhas, com mínimo efetivo de 8 linhas.',
    scoring: '5 competências, cada uma avaliada em uma de 6 faixas (0, 40, 80, 120, 160 ou 200 pontos), somando 0 a 1000. Corrigida por 2 corretores independentes, com um 3º em caso de divergência grande entre eles.',
    criteria: [
      { name: 'I — Domínio da norma culta', description: 'Gramática, ortografia, acentuação, concordância, regência, pontuação e construção de frases. Revise desvios recorrentes e construções de frase; os descritores da cartilha orientam as faixas, sem uma contagem simples de erros que garanta nota.' },
      { name: 'II — Compreensão da proposta e uso de repertório', description: 'Entender o recorte exato do tema e usar repertório de várias áreas do conhecimento para desenvolvê-lo, dentro da estrutura dissertativo-argumentativa (não vale narrar, descrever ou usar outro gênero).' },
      { name: 'III — Seleção e organização de argumentos', description: 'Projeto de texto: os argumentos formam uma linha de raciocínio coerente em defesa de um ponto de vista, não uma lista solta de ideias.' },
      { name: 'IV — Coesão textual', description: 'Uso de conectivos, retomadas (anáfora/catáfora) e articulação entre parágrafos — a "costura" do texto.' },
      { name: 'V — Proposta de intervenção', description: 'Proposta completa com os 5 elementos (agente, ação, meio, finalidade, detalhamento), respeitando os direitos humanos.' },
    ],
    zeroRules: [
      'Fuga total ao tema (fugir do assunto geral, não só do recorte específico).',
      'Não seguir a estrutura dissertativo-argumentativa (texto narrativo, poético, carta etc.).',
      'Texto com até 7 linhas — considerado "texto insuficiente".',
      'Folha em branco, letra ilegível ou texto em língua estrangeira.',
      'Importante: desde uma decisão do STF em 2017, uma proposta de intervenção que desrespeita direitos humanos zera APENAS a Competência V (–200 pontos), não a redação inteira — um erro comum é achar que zera tudo.',
    ],
    keyToMaxScore: 'Trabalhe as cinco competências: domínio da escrita, recorte e repertório, organização argumentativa, coesão e intervenção. Identifique seu próprio ponto de ruptura a partir de trechos, sem presumir um gargalo igual para todas as estudantes.',
  },
  {
    board: 'Fuvest',
    format: 'O guia de provas 2027 orienta escolher uma das propostas na folha de redação e respeitar a modalidade indicada. Informa nota zero caso nenhuma proposta seja escolhida. Leia o comando antes de decidir a estrutura.',
    scoring: 'O guia oficial 2027 apresenta pesos 3, 2, 3 e 2 para os quatro eixos de avaliação, considerando a modalidade escolhida. Pesos não devem ser confundidos com uma escala automática de nota para este treino.',
    criteria: [
      { name: 'Desenvolvimento do tema e autoria', description: 'Apropriação produtiva da coletânea (intertextualidade), com evidências de voz própria. Use informações da coletânea com elaboração e função claras, sem copiar seus trechos como texto próprio.' },
      { name: 'Gênero e tipo de texto', description: 'Respeitar as características do gênero pedido — ainda mais decisivo agora que existe a opção narrativa.' },
      { name: 'Coesão, coerência e progressão', description: 'Articulação do texto e progressão real do argumento, não apenas conectivos soltos.' },
      { name: 'Correção linguística', description: 'Norma culta, precisão vocabular — evitar clichês e "frases feitas".' },
    ],
    zeroRules: [
      'Fuga total ao tema.',
      'A partir de 2026: não indicar qual das duas propostas foi escolhida.',
      'Cópia extensa da coletânea sem elaboração própria.',
    ],
    keyToMaxScore: 'O diferencial mais citado por quem corrige na Fuvest é "autoria": mostrar que você entendeu a coletânea a ponto de transformá-la num argumento seu, não de repeti-la. Some isso a uma coesão apurada — a Fuvest valoriza mais a articulação do texto do que a quantidade de repertório.',
    uncertain: true,
    note: 'Pesos exatos e a escala de pontuação variam por ano (e a própria Fuvest gerou confusão sobre isso em 2026). Trate os critérios qualitativos como estáveis; confirme a pontuação exata no edital do ano vigente.',
  },
  {
    board: 'Unicamp / Comvest',
    format: 'Não existe "o" formato da redação da Comvest: o gênero textual pedido muda todo ano e só é revelado no dia da prova. Já caíram carta, crônica, discurso, verbete, roteiro, texto de opinião, manifesto, petição, projeto de lei, comunicado e depoimento pessoal — geralmente com 2 propostas simultâneas em gêneros diferentes (em 2025: projeto de lei + comunicado formal; em 2026: depoimento pessoal + nota de esclarecimento). As propostas costumam pedir que você assuma uma "máscara discursiva" — escrever como um interlocutor específico, para um destinatário específico, no registro daquele gênero.',
    scoring: 'As diretrizes institucionais avaliam proposta temática, gênero, leitura dos textos e convenções/coerência/coesão. Consulte a grade temática da prova e o manual vigente para pontuação e procedimentos.',
    criteria: [
      { name: 'Proposta Temática', description: 'Adequação ao tema e à situação comunicativa específica pedida pela proposta.' },
      { name: 'Gênero', description: 'Respeito às características formais e composicionais do gênero pedido (ex.: cabeçalho e fecho de carta, tom de discurso, estrutura de nota oficial).' },
      { name: 'Leitura da coletânea', description: 'Uso produtivo dos textos de apoio — referenciados e articulados, nunca copiados.' },
      { name: 'Convenções da escrita e coesão', description: 'Norma-padrão: escolhas lexicais e sintáticas, coesão, ortografia.' },
    ],
    zeroRules: [
      'Confira nas diretrizes e no manual as condições de anulação e eliminação. Não confunda falha pontual em um critério com anulação global.',
      'Abandonar o tema ou as tarefas da proposta; o enquadramento da anulação segue as diretrizes institucionais.',
      'Copiar trechos da coletânea sem elaboração.',
    ],
    keyToMaxScore: 'Como o gênero muda todo ano, treinar só dissertação não prepara para a Comvest. O que separa notas altas é reconhecer rápido qual gênero foi pedido e produzir um texto que respeite de verdade as convenções formais dele, usando a coletânea com clareza, sem copiá-la.',
    uncertain: true,
    note: 'A pontuação exata por critério e o rótulo preciso de cada critério têm fontes que divergem entre si — confirme no documento oficial da Comvest do ano vigente antes de levar os números ao pé da letra.',
  },
  {
    board: 'Unesp / Vunesp',
    format: 'Dissertativo-argumentativo em prosa, com coletânea de textos motivadores, no 2º dia da 2ª fase. Extensão: cerca de 25 a 30 linhas.',
    scoring: '3 critérios (estrutura estável); o total de pontos exato varia conforme a fonte e o ano — trate como aproximado.',
    criteria: [
      { name: 'Tema', description: 'Adequação ao tema proposto, sem fugir do recorte pedido.' },
      { name: 'Gênero/estrutura e coerência', description: 'Estrutura do texto dissertativo-argumentativo, posicionamento claro, sem contradições internas.' },
      { name: 'Elementos linguísticos e coesão', description: 'Ortografia, concordância, regência, crase, pontuação, registro formal e coesão textual.' },
    ],
    zeroRules: [
      'Fuga ao tema.',
      'Até 7 linhas — texto insuficiente.',
      'Menos de 8 linhas autorais — se a maior parte do texto for copiada da coletânea, é anulada mesmo que pareça longa.',
      'Cópia predominante dos textos de apoio reduz muito ou zera a nota.',
      'Até 15 linhas: penalizado no critério de estrutura/expressão, mesmo sem zerar.',
    ],
    keyToMaxScore: 'A Vunesp valoriza objetividade e domínio técnico da norma culta mais do que originalidade estilística — desenvolva o tema com clareza, apoiado na coletânea, mas sem parafraseá-la.',
    uncertain: true,
    note: 'A pontuação total relatada varia bastante entre fontes (de ~10 a ~28 pontos, dependendo do ano/instituição). Os 3 critérios qualitativos são estáveis; os pesos numéricos não — confirme no edital vigente.',
  },
  {
    board: 'Famerp',
    format: 'Redação dissertativo-argumentativa em prosa, a partir de uma coletânea, no 2º dia, junto com 20 questões discursivas (8 de Biologia, 6 de Química, 6 de Física), tudo em 4 horas.',
    scoring: 'Redação vale 20 pontos e as discursivas 80, somando 100 no 2º dia. Nota zero na redação elimina. Dois corretores independentes (edital do Vestibular 2027).',
    criteria: [
      { name: 'A. Tema', description: 'Atender ao tema e ao recorte; fuga completa zera tudo.' },
      { name: 'B. Estrutura (gênero/tipo e coerência)', description: 'Introdução, desenvolvimento e conclusão; tese clara; argumentos desenvolvidos; repertório pertinente; texto autônomo, sem 1ª pessoa do singular, 2ª pessoa ou referência à prova.' },
      { name: 'C. Língua', description: 'Norma-padrão, precisão vocabular e registro formal; letra ilegível reduz a nota.' },
      { name: 'D. Coesão', description: 'Conectivos, retomadas e paragrafação; penaliza monobloco e parágrafos de um período.' },
    ],
    zeroRules: [
      'Fuga ao tema ou ao gênero.',
      '7 linhas ou menos, ou menos de 8 linhas autorais contínuas.',
      'Cópia predominante da coletânea, de modelos prontos ou de outra redação.',
      'Marca de identificação, texto em branco, ilegível ou fora do espaço definitivo.',
      'Até 20 linhas não alcança a nota máxima em Língua e Coesão; até 15 perde um ponto em cada.',
    ],
    keyToMaxScore: 'Proposta de intervenção não é exigida. O que dá nota é tese clara, duas razões explicadas e amarradas ao tema, coletânea usada sem cópia e 25 a 30 linhas revisadas. Veja a aba “Famerp e Unifesp” para passo a passo e exercícios.',
  },
  {
    board: 'Unifesp',
    format: 'Vestibular Misto: redação dissertativo-argumentativa no 1º dia, junto com 25 objetivas de Português e Inglês. O 2º dia é de 20 questões discursivas.',
    scoring: 'Corrigida pela Fundação Vunesp. Confirme escala e peso no documento “Critérios de Correção da Redação” do ano vigente; a pontuação citada por cursinhos não foi confirmada em fonte oficial.',
    criteria: [
      { name: 'Tema', description: 'Atender ao tema e ao recorte da frase temática.' },
      { name: 'Estrutura e coerência', description: 'Dissertação com tese clara, argumentos desenvolvidos e conclusão coerente.' },
      { name: 'Língua', description: 'Norma-padrão e registro formal.' },
      { name: 'Coesão', description: 'Conectivos, retomadas e paragrafação.' },
    ],
    zeroRules: [
      'Fuga ao tema ou ao gênero.',
      'Texto insuficiente ou predominantemente copiado da coletânea.',
      'Marca de identificação.',
    ],
    keyToMaxScore: 'Mesma banca da Famerp: posição clara, argumentos explicados e coletânea sem cópia. Intervenção não é obrigatória. Veja a aba “Famerp e Unifesp”.',
    uncertain: true,
    note: 'Critérios inferidos da grade da Vunesp; o documento oficial da Unifesp não pôde ser consultado.',
  },
];

export interface CommonMistake {
  mistake: string;
  why: string;
}

export const commonMistakes: CommonMistake[] = [
  { mistake: 'Repertório decorado, mal empregado', why: 'Citar uma referência sem explicar por que ela sustenta o argumento é reconhecido por todas as bancas como repertório "não-produtivo" — limita a nota mesmo que a referência em si seja sofisticada.' },
  { mistake: 'Tese fraca, implícita ou ausente', why: 'Se o corretor precisa adivinhar sua posição, a nota cai — em todas as bancas pesquisadas isso aparece como um dos erros mais citados.' },
  { mistake: 'Parágrafos desequilibrados', why: 'Um parágrafo muito desenvolvido e outro raso sugere planejamento fraco do texto como um todo.' },
  { mistake: 'Desvios gramaticais recorrentes', why: 'Um erro isolado custa pouco; o mesmo erro repetido várias vezes é tratado como um padrão, não um deslize — e isso pesa muito mais na correção.' },
  { mistake: 'Fuga parcial ao tema', why: 'Discutir o assunto geral mas errar o recorte específico pedido é menos grave que fuga total, mas ainda limita a nota — muito comum quando o tema é reescrito "de memória" em vez de reler o comando com atenção.' },
  { mistake: 'Copiar a coletânea ou apenas repeti-la sem elaboração', why: 'Use informações pertinentes com elaboração própria. Uma paráfrase pode ter função produtiva quando identificada e articulada ao raciocínio; repetir o conteúdo sem desenvolver sua função não substitui argumentação.' },
  { mistake: 'Ignorar o limite de linhas', why: 'Ficar abaixo do mínimo (geralmente 7-8 linhas) zera a redação em quase todas as bancas; textos "curtos mas válidos" ainda são penalizados no critério de estrutura/expressão.' },
  { mistake: 'Não indicar a proposta escolhida (Fuvest) ou ignorar o gênero pedido (Comvest)', why: 'Fuvest zera se você não marcar qual das duas propostas respondeu; a Comvest penaliza pesado quem escreve uma dissertação genérica quando o gênero pedido era outro.' },
];

export const revisionChecklist: string[] = [
  'Cada parágrafo tem um tópico frasal claro e distinto dos demais?',
  'A tese está explícita e se mantém coerente do início ao fim (sem se contradizer depois)?',
  'Cada repertório está conectado ao argumento por uma frase de raciocínio, não apenas citado?',
  'A proposta de intervenção (quando exigida) tem os 5 elementos e respeita os direitos humanos?',
  'O texto está dentro do limite de linhas da banca (mínimo e máximo)?',
  'Releitura final: procure erros recorrentes de concordância, regência, crase e pontuação — são pontos baratos de proteger.',
  'Para Comvest: o texto respeita as convenções formais do gênero pedido (cabeçalho de carta, tom de discurso, registro adequado à "máscara" pedida)?',
  'Para Fuvest/Comvest/Vunesp: há evidência clara de síntese própria da coletânea, e não apenas repetição dela?',
];
