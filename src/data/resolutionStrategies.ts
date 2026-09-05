// Estratégias de resolução de questões — método geral, por matéria, por banca
// e protocolos de segunda fase (discursiva). Inspirado nos materiais de
// tutoria da Ana Júlia (estratégias por matéria, padrões de banca e
// protocolos de 2ª fase da Unicamp/Comvest e Unesp/Vunesp).

export interface ResolutionStep {
  step: number;
  title: string;
  description: string;
}

export const generalResolutionMethod: ResolutionStep[] = [
  { step: 1, title: 'Identifique a matéria e o assunto', description: 'Diga explicitamente qual conteúdo está sendo testado — e se a questão mistura mais de um tópico (comum na Fuvest).' },
  { step: 2, title: 'Identifique o tipo de questão', description: 'Cálculo direto, interpretação, situação-problema, gráfico, comparação de alternativas? Reconhecer o "formato" antes de resolver economiza tempo.' },
  { step: 3, title: 'Entenda o que o enunciado está pedindo', description: 'Em palavras simples, qual é o objetivo real. A pergunta de verdade muitas vezes está disfarçada ou só aparece no fim de um parágrafo longo.' },
  { step: 4, title: 'Separe dados úteis de dados-distração', description: 'Liste explicitamente o que será usado. Se houver números/informações que não entram na resolução, perceber isso evita pânico e economiza tempo de prova.' },
  { step: 5, title: 'Encontre o primeiro passo correto', description: 'O "pulo do gato" inicial. Se houver mais de um caminho possível, escolha o mais robusto — não necessariamente o mais rápido.' },
  { step: 6, title: 'Monte o raciocínio antes de calcular', description: 'Escreva a "ponte" entre o que foi dado e o que foi pedido em palavras, antes de qualquer conta. É isso que separa "decorar fórmula" de "saber resolver".' },
  { step: 7, title: 'Resolva passo a passo, sem saltos', description: 'Cada operação precisa ser justificável — isso também é o que treina para a segunda fase, onde o caminho vale pontos.' },
  { step: 8, title: 'Confirme a alternativa correta', description: 'Não só confirme — explique por que ela é a única consistente com o raciocínio montado.' },
  { step: 9, title: 'Entenda por que as outras alternativas erram', description: 'Cada alternativa errada geralmente não é aleatória — é uma "pegadinha projetada". Que erro de raciocínio levaria alguém a marcá-la?' },
  { step: 10, title: 'Nomeie a pegadinha escondida', description: 'Ex: "troca de unidade", "banca testa se você lê o enunciado até o final". Nomear a pegadinha ajuda a reconhecê-la de novo.' },
  { step: 11, title: 'Generalize para a próxima questão parecida', description: '"Sempre que eu vir [padrão X no enunciado], devo pensar em [estratégia Y]" — é essa regra transferível que realmente fica.' },
];

export interface SubjectStrategy {
  subject: string;
  tips: string[];
  pitfalls: string[];
}

export const subjectStrategies: SubjectStrategy[] = [
  {
    subject: 'Matemática',
    tips: [
      'Entenda de onde cada fórmula vem (a dedução) — isso permite reconstruí-la se for esquecida na prova.',
      'Identifique o tipo de questão pela "cara" do enunciado (que palavras-chave indicam progressão, função, geometria analítica...).',
      'Treine "traduzir" o texto do problema para a equação — geralmente essa é a parte mais difícil, não a conta em si.',
      'Só use o caminho rápido depois de dominar o caminho completo, e saiba em que tipo de questão o atalho é seguro.',
    ],
    pitfalls: [
      'Esquecer restrições de domínio de uma função.',
      'Erro de leitura de escala/eixos em gráficos.',
      'Confundir unidades em problemas de geometria/proporção.',
      'Trocar o sinal da desigualdade ao multiplicar por número negativo.',
    ],
  },
  {
    subject: 'Física',
    tips: [
      'Traduza o fenômeno físico em palavras antes de usar qualquer fórmula — o que está acontecendo no mundo real?',
      'Entenda o significado físico de cada grandeza, não só a letra (aceleração é a taxa de mudança da velocidade, e o sinal indica se acelera ou freia).',
      'Saiba quando cada fórmula NÃO se aplica (fórmulas de MUV não valem se a aceleração varia).',
      'Confira unidades sempre — conversão km/h ↔ m/s é pegadinha clássica.',
    ],
    pitfalls: [
      'Sinal e sentido em vetores/movimento.',
      'Leitura de área/inclinação em gráficos v×t e posição×tempo.',
      'Esquecer de definir o referencial ("em relação a quê?").',
      'Confundir trabalho, energia e potência.',
    ],
  },
  {
    subject: 'Química',
    tips: [
      'Separe conceito, cálculo e interpretação — identifique em qual etapa a questão está pedindo esforço.',
      'Domine mol, massa, proporção, balanceamento e estequiometria — sustentam a maioria das contas de vestibular.',
      'Use raciocínio proporcional (regra de três) sempre que possível.',
    ],
    pitfalls: [
      'Unidade (mL vs L, g vs mol).',
      'Reagente limitante vs excesso.',
      'Pureza (entrada) vs rendimento (saída) — e a ordem certa de entrar no cálculo.',
      'Confundir massa molar do átomo com a da molécula.',
    ],
  },
  {
    subject: 'Biologia',
    tips: [
      'Explique processos em sequência lógica — como uma "linha do tempo" do mecanismo.',
      'Use analogias para tornar processos abstratos (replicação, transcrição, ciclos) mais concretos.',
      'Pense em causa → consequência: bancas adoram perguntar "o que aconteceria se [etapa X] falhasse?".',
      'Conecte com fisiologia, genética, ecologia e evolução — Medicina valoriza muito questões de "mecanismo".',
    ],
    pitfalls: [
      'Trocar "mais frequente" por "dominante" em genética populacional.',
      'Confundir fenótipo com genótipo.',
      'Errar a leitura de heredogramas (padrão de herança).',
      'Confundir termos parecidos: mitose vs meiose, autotrófico vs heterotrófico.',
    ],
  },
  {
    subject: 'História',
    tips: [
      'Nada de decoreba solta — explique contexto, causa, consequência e comparação. Datas e nomes são âncoras, não o conteúdo principal.',
      'Procure as disputas políticas, sociais e econômicas por trás dos fatos.',
      'Aprenda a ler um documento de época, charge ou mapa histórico à luz do conteúdo.',
    ],
    pitfalls: [
      'Anacronismo — atribuir ideia/valor de uma época a outra.',
      'Generalizar processos que tiveram variações regionais.',
      'Confundir causa com consequência em cadeias de eventos.',
    ],
  },
  {
    subject: 'Geografia',
    tips: [
      'Trabalhe conceitos sempre com exemplo concreto — geografia de vestibular raramente cobra definição pura.',
      'Conecte espaço, sociedade, economia, política e meio ambiente.',
      'Treine leitura de mapas, gráficos, tabelas e escalas como parte do conteúdo, não como extra.',
    ],
    pitfalls: [
      'Confundir escala de mapa (grande vs pequena escala).',
      'Tratar correlação como causalidade em dados socioeconômicos.',
      'Generalizar fenômenos regionais para o país/mundo todo.',
    ],
  },
  {
    subject: 'Literatura',
    tips: [
      'Domine contexto histórico e escola literária — sem isso, a interpretação fica solta.',
      'Analise autor, obra, personagens, narrador, linguagem, símbolos e temas centrais com profundidade real.',
      'Vá além do enredo: conexões temáticas, ambiguidades propositais, o que a obra "discute".',
    ],
    pitfalls: [
      'Confundir narrador com autor.',
      'Atribuir ao autor a opinião do narrador/personagem.',
      'Ignorar ironia ou crítica social embutida no texto.',
    ],
  },
  {
    subject: 'Gramática e Interpretação de Texto',
    tips: [
      'Entenda a função do termo no texto, não só a regra decorada.',
      'Muitas questões "de gramática" são, na real, questões de sentido.',
      'Elimine alternativas por critérios objetivos ("essa generaliza algo que o texto restringe", "essa inverte causa e consequência").',
    ],
    pitfalls: [
      'Alternativa que repete palavras do texto mas muda o sentido.',
      'Alternativa "quase certa" que extrapola o que o texto realmente diz.',
      'Confundir opinião do autor com fato relatado.',
    ],
  },
  {
    subject: 'Redação',
    tips: [
      'Construa repertório sociocultural legítimo e variado — evite clichês.',
      'Cada peça (tese, argumentos, repertório, proposta de intervenção, coesão) precisa se conectar explicitamente com a nota.',
      'Aponte problemas de estrutura/argumentação mostrando a versão reescrita, não só "o que está errado".',
    ],
    pitfalls: [
      'Tese fraca ou ausente.',
      'Argumentos que não sustentam a tese.',
      'Repertório "decorado" mal encaixado.',
      'Proposta de intervenção genérica, sem agente/ação/meio/finalidade.',
    ],
  },
  {
    subject: 'Atualidades e Geopolítica',
    tips: [
      'Conecte o tema atual a processos de fundo (história, economia, geografia) — atualidade isolada esquece rápido; conectada a processos, fica.',
      'Mostre múltiplos lados de temas contestados, de forma equilibrada — ENEM e Unicamp gostam de testar percepção de complexidade.',
      'Ligue com possíveis recortes de redação e questões interdisciplinares (geografia + história + atualidade é combinação comum).',
    ],
    pitfalls: [
      'Tratar a atualidade como fato isolado, sem estrutura por trás.',
      'Assumir só um lado de um tema controverso.',
      'Confundir fato confirmado com interpretação ou hipótese.',
    ],
  },
  {
    subject: 'Filosofia',
    tips: [
      'Antes de responder, identifique de que autor ou corrente o comando trata — resposta genérica sobre "o pensamento humano" não pontua em nenhuma banca.',
      'Defina o conceito com precisão antes de aplicá-lo: nome de filósofo sem conceito explicado vale tanto quanto conceito sem autor.',
      'Trabalhe por oposições, que é como a banca monta a questão: Platão × Aristóteles, racionalismo × empirismo, Hobbes × Rousseau, Kant × utilitarismo.',
      'Em texto de apoio, extraia a tese do autor antes de opinar — e depois marque claramente onde começa sua própria avaliação.',
      'Feche com a consequência filosófica da tese, não com um resumo do que já foi dito.',
    ],
    pitfalls: [
      'Citar o filósofo e parar aí, sem explicar o conceito que a resposta exige.',
      'Parafrasear o texto de apoio sem nomear nenhuma categoria filosófica.',
      'Anacronismo: ler o debate medieval entre fé e razão como o embate moderno entre religião e ciência.',
      'Confundir a dúvida metódica de Descartes com ceticismo, ou o meio-termo de Aristóteles com moderação.',
      'Tratar as Ideias de Platão como conceitos mentais e a "morte de Deus" de Nietzsche como tese sobre religião.',
    ],
  },
  {
    subject: 'Sociologia',
    tips: [
      'Use o par fonte → conceito → mecanismo: extraia o dado do texto, gráfico ou charge, nomeie a categoria sociológica e explique o processo social que liga um ao outro.',
      'Desnaturalize antes de explicar: mostre que o fenômeno tem história e produção social, em vez de tratá-lo como decorrência da natureza humana.',
      'Sustente a análise com dados e mecanismos, não com indignação — denúncia sem categoria não é resposta sociológica.',
      'Compare os clássicos por critérios explícitos (base da coesão, tipo de direito, critério de classe), em vez de descrever um autor depois do outro.',
      'Em temas contemporâneos — uberização, algoritmos, desigualdade racial e de gênero —, ancore a atualidade em um conceito clássico.',
    ],
    pitfalls: [
      'Reduzir classe social a faixa de renda, o que apaga o antagonismo estrutural.',
      'Explicar fenômeno social por escolha ou mérito individual — exatamente o que o método de Durkheim recusa.',
      'Traduzir anomia como "ausência de leis" ou "caos", quando é desregulação moral.',
      'Apresentar a tese weberiana da ética protestante como o inverso simétrico de Marx.',
      'Tratar cultura como bloco homogêneo, ignorando que ela é internamente disputada.',
    ],
  },
];

export interface BancaStrategy {
  board: string;
  profile: string;
  examStrategy: string;
}

export const bancaStrategies: BancaStrategy[] = [
  {
    board: 'Fuvest (USP)',
    profile: 'Cobra raciocínio, profundidade e domínio conceitual real. Enunciados menos óbvios, que só "viram a chave" no fim. Muita conexão entre matérias (química + biologia, física + matemática, história + geografia). Pouca decoreba isolada; muita aplicação de conceito em situação não-padrão. Em Humanas/Literatura: análise sofisticada, obras obrigatórias cobradas a fundo, texto de apoio que precisa ser cruzado com o conteúdo.',
    examStrategy: 'Não responda no impulso na primeira leitura. Releia procurando "o que ela realmente está testando aqui?" — desconfie de enunciados que parecem fáceis demais, geralmente há uma camada extra.',
  },
  {
    board: 'Unicamp / Comvest',
    profile: 'Cobra leitura cuidadosa e aplicação em contexto. 1ª fase de múltipla escolha com viés de leitura longa; 2ª fase frequentemente dissertativa, pedindo para explicar/justificar o raciocínio. Muitos gráficos, tabelas e situações-problema do mundo real, com a informação relevante espalhada.',
    examStrategy: 'Extraia os dados do texto/gráfico com calma antes de calcular. Treine escrever o raciocínio de forma organizada mesmo em questões de múltipla escolha — isso fixa o hábito para a segunda fase.',
  },
  {
    board: 'Vunesp (Unesp e Famerp)',
    profile: 'Cobra objetividade, cálculo direto e técnica rápida. Questões mais "limpas", com menos contexto que Unicamp/ENEM. Recompensa quem domina a técnica e resolve com agilidade — tempo por questão costuma ser apertado. Famerp tende a ter forte peso em Biologia/Química com viés de saúde/contexto clínico.',
    examStrategy: 'Tenha automatismo nas fórmulas e procedimentos mais comuns. Não complique o que é direto — mas confira o detalhe (uma unidade, um sinal, uma casa decimal) antes de marcar.',
  },
  {
    board: 'Unifesp',
    profile: 'Cobra precisão conceitual e interpretação científica exigente. Questões contextualizadas em ciência/saúde, com detalhes finos fazendo diferença — conceitos próximos precisam estar bem separados.',
    examStrategy: 'Domine a definição exata dos conceitos (não a versão "popular"). Leia dados experimentais e gráficos com rigor, prestando atenção em eixos, escalas e unidades. Desconfie de alternativas "quase certas".',
  },
  {
    board: 'ENEM / Inep',
    profile: 'Cobra interpretação, cotidiano e leitura estratégica. Textos longos, gráficos e tabelas — o "filtro" de leitura é a habilidade mais testada. O conteúdo técnico costuma ser simples, mas disfarçado em texto.',
    examStrategy: 'Identifique a pergunta real (geralmente na última frase) antes de ler todo o texto, para já ler com foco. Use lógica e ordem de grandeza para eliminar alternativas absurdas sem calcular tudo. Gestão de tempo é crítica.',
  },
];

export interface ProtocolStep {
  letter: string;
  title: string;
  description: string;
}

export interface SecondPhaseProtocol {
  board: string;
  scope: string;
  name: string;
  steps: ProtocolStep[];
  responseStructure?: string[];
}

export const secondPhaseProtocols: SecondPhaseProtocol[] = [
  {
    board: 'Fuvest',
    scope: 'Qualquer matéria — 2ª fase dissertativa',
    name: 'Esqueleto geral de resposta',
    steps: [
      { letter: '1', title: 'Identifique', description: 'Dados/hipóteses do problema.' },
      { letter: '2', title: 'Aplique', description: 'O conceito, nomeando-o explicitamente (ex: "pela conservação de energia...", "como a Primeira Lei de Mendel prevê...").' },
      { letter: '3', title: 'Calcule/desenvolva', description: 'Mostrando as etapas — pular uma etapa que "vale ponto" custa nota mesmo com o resultado certo.' },
      { letter: '4', title: 'Conclua', description: 'Relacionando explicitamente com o que foi perguntado.' },
    ],
    responseStructure: [
      'A banca avalia o processo, não só se o número final bate.',
      'Se a questão pede "explique/justifique/mostre que", a justificativa é a resposta.',
      'Erro de conta no fim com raciocínio certo perde pouco; raciocínio errado com conta certa perde muito.',
    ],
  },
  {
    board: 'Fuvest',
    scope: 'Literatura / obras obrigatórias — 2ª fase',
    name: 'F.O.R.M.A.',
    steps: [
      { letter: 'F', title: 'Foco no comando', description: 'Verbo, quantidade, recorte, comparação ou relação pedida.' },
      { letter: 'O', title: 'Observação textual', description: 'O dado do trecho: cena, imagem, estrutura, comportamento narrativo.' },
      { letter: 'R', title: 'Recurso formal', description: 'Nomeie apenas o recurso relevante.' },
      { letter: 'M', title: 'Mecanismo interpretativo', description: 'Explique como o recurso produz o efeito.' },
      { letter: 'A', title: 'Articulação', description: 'Conecte ao conjunto da obra, ao contexto, ou a uma segunda obra.' },
    ],
    responseStructure: ['Uma resposta forte tem: afirmação direta → evidência → mecanismo → articulação.'],
  },
  {
    board: 'Unicamp / Comvest',
    scope: 'Qualquer matéria — 2ª fase dissertativa',
    name: 'C-F-C-R (Comando, Fonte, Conceito, Relação)',
    steps: [
      { letter: 'C', title: 'Comando', description: 'Qual é o verbo? Quantos elementos precisam ser apresentados? Pede causa, consequência, processo ou evidência?' },
      { letter: 'F', title: 'Fonte', description: 'O que o texto/gráfico/imagem mostra objetivamente? A fonte confirma, contrasta ou problematiza o conceito?' },
      { letter: 'C', title: 'Conceito', description: 'Qual conceito formal explica a informação? Que vocabulário técnico precisa aparecer?' },
      { letter: 'R', title: 'Relação', description: 'Como a fonte e o conceito se conectam? Qual conclusão responde exatamente ao comando?' },
    ],
    responseStructure: [
      'Resposta nuclear (uma frase direta) → evidência da fonte → conceito → explicação → conclusão.',
      'Responda cada subitem (a, b, c) separadamente, sem misturar.',
      'Use a fonte ativamente — nunca apenas copie ou parafraseie.',
    ],
  },
  {
    board: 'Unicamp / Comvest',
    scope: 'Literatura / obras obrigatórias',
    name: 'F.O.N.T.E.',
    steps: [
      { letter: 'F', title: 'Fonte', description: 'Localize o elemento textual, visual ou paratextual (capa, epígrafe...).' },
      { letter: 'O', title: 'Operação do comando', description: 'Identificar, explicar, comparar, relacionar, justificar ou analisar?' },
      { letter: 'N', title: 'Núcleo formal', description: 'Voz, recurso, estrutura, gênero ou composição.' },
      { letter: 'T', title: 'Tensão interpretativa', description: 'Ambiguidade, conflito, contraste ou silêncio no texto.' },
      { letter: 'E', title: 'Explicação articulada', description: 'Integre fonte, forma, contexto e conclusão.' },
    ],
    responseStructure: ['Em comparação entre obras: "ambas criticam a sociedade" é insuficiente — mostre ponto comum preciso, diferença de procedimento e efeito distinto.'],
  },
  {
    board: 'Unesp / Vunesp',
    scope: 'Qualquer matéria — 2ª fase dissertativa',
    name: 'D-C-E-A (Direto, Conceito/Cálculo, Explicação, Aplicação)',
    steps: [
      { letter: 'D', title: 'Direto', description: 'Responda ao comando já na primeira frase ou primeira linha de cálculo.' },
      { letter: 'C', title: 'Conceito ou cálculo', description: 'Nomeie o conceito central ou apresente a equação/modelagem necessária.' },
      { letter: 'E', title: 'Explicação', description: 'Mostre por que a resposta decorre do conceito, do dado ou do cálculo.' },
      { letter: 'A', title: 'Aplicação e arremate', description: 'Aplique ao caso, indique unidade/efeito/consequência e conclua.' },
    ],
    responseStructure: [
      'Questões quantitativas: dados relevantes → equação/princípio → substituição organizada → cálculo → unidade → interpretação.',
      'Evite respostas longas sem resposta direta — a Vunesp valoriza objetividade acima de tudo.',
      'Nunca deixe um subitem em branco: registre ao menos a fórmula ou o primeiro elo causal correto.',
    ],
  },
];
