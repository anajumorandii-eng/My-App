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
    description: 'Parta de algo mais amplo — um repertório, um fato histórico/social, uma observação conceitual — e vá estreitando até o recorte específico do tema. Evite começar direto pela tese sem preparar o terreno.',
  },
  {
    part: 'Introdução',
    title: 'Tese',
    description: 'Declare com clareza a posição que você vai defender. Uma tese fraca ou implícita — que o corretor precisa "adivinhar" — é um dos erros que mais limita a nota em todas as bancas.',
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
  { letter: '5', title: 'Detalhamento', description: 'Aprofunde um dos quatro elementos acima. É o elemento mais esquecido, e sua ausência é o motivo mais comum de a Competência V do ENEM não bater 200/200 mesmo em redações fortes.' },
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
      { name: 'I — Domínio da norma culta', description: 'Gramática, ortografia, acentuação, concordância, regência, pontuação e construção de frases. Nota máxima tolera no máximo 1-2 desvios não recorrentes — não zero desvios, mas nenhum padrão de erro repetido.' },
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
    keyToMaxScore: 'As 5 competências precisam bater a faixa máxima ao mesmo tempo — menos de 0,1% dos participantes tira 1000. O gargalo mais comum não é falta de conteúdo, é a Competência V incompleta (faltando o "detalhamento") ou repertório decorado que não sustenta de fato a Competência II/III.',
  },
  {
    board: 'Fuvest',
    format: 'A partir de 2026, uma coletânea gera 2 propostas e você escolhe apenas uma: Proposta 1 (dissertativo-argumentativo clássico) ou Proposta 2 (gênero narrativo revelado só no dia, ex.: crônica, carta). Não indicar qual proposta você escolheu zera a redação.',
    scoring: 'Faz parte da 2ª fase, no mesmo dia da prova de Português. A pontuação exata e a escala de correção mudam de ano para ano (em 2026 a própria Fuvest precisou publicar uma nota de esclarecimento reajustando a escala) — confirme sempre no edital vigente.',
    criteria: [
      { name: 'Desenvolvimento do tema e autoria', description: 'Apropriação produtiva da coletânea (intertextualidade), com evidências de voz própria. Copiar ou parafrasear os textos de apoio é fortemente penalizado.' },
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
    scoring: '4 critérios avaliados de 0 a 3 cada, somando até 12 pontos (estrutura corroborada por múltiplas fontes; o peso exato na nota final do vestibular é menos claro).',
    criteria: [
      { name: 'Proposta Temática', description: 'Adequação ao tema e à situação comunicativa específica pedida pela proposta.' },
      { name: 'Gênero', description: 'Respeito às características formais e composicionais do gênero pedido (ex.: cabeçalho e fecho de carta, tom de discurso, estrutura de nota oficial).' },
      { name: 'Leitura da coletânea', description: 'Uso produtivo dos textos de apoio — referenciados e articulados, nunca copiados.' },
      { name: 'Convenções da escrita e coesão', description: 'Norma-padrão: escolhas lexicais e sintáticas, coesão, ortografia.' },
    ],
    zeroRules: [
      'Zerar a redação elimina o candidato do vestibular, independentemente das outras notas — por isso a Comvest costuma corrigir a redação antes das demais provas.',
      'Fugir do gênero pedido ou do tema.',
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
    format: 'Vestibular de fase única — a redação entra no 2º dia, junto às provas de conhecimentos específicos. Dissertativo-argumentativo, na mesma linha da Vunesp (Famerp usa a Vunesp como banca).',
    scoring: 'Mesma estrutura de 3 critérios da Vunesp/Unesp.',
    criteria: [
      { name: 'Tema', description: 'Adequação ao tema proposto.' },
      { name: 'Gênero/estrutura e coerência', description: 'Estrutura dissertativo-argumentativa e posicionamento consistente.' },
      { name: 'Elementos linguísticos e coesão', description: 'Norma culta e coesão textual.' },
    ],
    zeroRules: [
      'Cópia predominante da coletânea.',
      'Até 7 linhas.',
      'Até 20 linhas: não é possível atingir a nota máxima no critério de expressão, mesmo com o resto bem resolvido.',
    ],
    keyToMaxScore: 'Mesma lógica da Vunesp: clareza, domínio técnico da norma culta e uso não-copiado da coletânea. Vale reforçar repertório com viés de saúde/contexto clínico, coerente com o perfil de Biologia/Química da prova objetiva da Famerp.',
    uncertain: true,
    note: 'Fontes divergem sobre o peso exato da redação na nota final — trate a pontuação como aproximada e confirme no edital vigente.',
  },
  {
    board: 'Unifesp',
    format: 'Dissertativo-argumentativo com proposta de intervenção obrigatória (como o ENEM) — diferente de Unesp/Famerp, que normalmente não exigem intervenção explícita. Faz parte do "Dia 1" de provas complementares, junto com Português e Inglês objetivos.',
    scoring: 'Corrigida por 2 corretores independentes, cujas notas são somadas. Segue o padrão Vunesp de 3 critérios, com nomes ligeiramente diferentes.',
    criteria: [
      { name: 'Tema', description: 'Adesão ao tema proposto e desenvolvimento adequado.' },
      { name: 'Estrutura', description: 'Presença clara de introdução, desenvolvimento e conclusão dissertativo-argumentativos.' },
      { name: 'Expressão', description: 'Qualidade da linguagem e coesão textual.' },
    ],
    zeroRules: [
      'Fuga ao tema.',
      'Não seguir a estrutura dissertativo-argumentativa.',
      'Ausência de proposta de intervenção quando exigida.',
    ],
    keyToMaxScore: 'Use a fórmula de 5 elementos da proposta de intervenção (como no ENEM) — é o ponto que mais diferencia essa redação das demais bancas Vunesp, que normalmente não cobram isso.',
    uncertain: true,
    note: 'O peso exato da redação na nota final tem poucas fontes disponíveis — confirme no edital vigente antes de tratar como definitivo.',
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
  { mistake: 'Copiar ou parafrasear a coletânea', why: 'As 6 bancas pesquisadas penalizam isso de forma independente — é o único erro que aparece em 100% dos perfis de banca levantados.' },
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
