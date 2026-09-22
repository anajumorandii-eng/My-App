export type WritingInstrumentId =
  | 'essay-myths' | 'evaluation' | 'idea-map' | 'repertoire' | 'theme-axes'
  | 'prompt-fit' | 'prompt-boundary' | 'genre-letter' | 'genre-dissertation'
  | 'source-sense' | 'source-visual' | 'source-authorship' | 'source-dialogue'
  | 'repertoire-environment' | 'repertoire-work' | 'repertoire-abstract' | 'repertoire-body'
  | 'repertoire-violence' | 'repertoire-citizenship' | 'repertoire-culture' | 'repertoire-media'
  | 'theme-environment' | 'theme-work' | 'theme-abstract' | 'theme-body'
  | 'theme-violence' | 'theme-citizenship' | 'theme-culture' | 'theme-media'
  | 'intro-thesis' | 'intro-context' | 'audience' | 'quasi-logic' | 'internal-coherence' | 'external-coherence'
  | 'data-examples' | 'prestigious-voices' | 'concession' | 'refutation' | 'intertextuality' | 'repertoire-bank' | 'current-affairs' | 'domains'
  | 'conclusion-synthesis' | 'conclusion-focus' | 'intervention-agents' | 'intervention-feasibility' | 'intervention-coherence' | 'intervention-rights'
  | 'reference-cohesion' | 'sequential-cohesion' | 'cohesion-diagnosis' | 'language-clarity' | 'rights-generations' | 'rights-social' | 'model-essay' | 'media-revision';

export type WritingSceneId = 'prompt' | 'genre' | 'source' | 'repertoire' | 'theme';

export interface WritingInstrumentState {
  label: string;
  example: string;
  diagnosis: string;
  action: string;
}

export interface WritingInstrumentConfig {
  id: WritingInstrumentId;
  name: string;
  question: string;
  controlLabel: string;
  controlDescription: string;
  relation: string;
  insight: string;
  states: WritingInstrumentState[];
  /** O desenho acompanha a operação de escrita, não apenas a matéria geral. */
  scene?: WritingSceneId;
}

function workshop(id: WritingInstrumentId, name: string, question: string, states: WritingInstrumentState[], scene: WritingSceneId = 'theme'): WritingInstrumentConfig {
  const completeStates = states.length >= 3 ? states : [...states, {
    label: 'revisão do vínculo',
    example: 'a escolha é relida à luz da tese e do recorte.',
    diagnosis: 'a decisão só permanece quando sua função no argumento é verificável',
    action: 'conferir se a evidência, a relação lógica e a tese continuam alinhadas',
  }];
  return {
    id, name, question, scene,
    controlLabel: 'Decisão editorial', controlDescription: 'compare as escolhas antes de redigir',
    relation: 'decisão → evidência → efeito no argumento',
    insight: 'Um projeto de texto melhora quando cada escolha tem função explícita e vínculo com a tese.',
    states: completeStates,
  };
}

export const WRITING_INSTRUMENTS: Record<WritingInstrumentId, WritingInstrumentConfig> = {
  'essay-myths': {
    id: 'essay-myths', name: 'Mitos sob o crivo da banca', question: 'A regra é universal ou depende do edital e da proposta?',
    controlLabel: 'Afirmação', controlDescription: 'teste fórmulas comuns contra o pedido real da banca', relation: 'afirmação + edital + proposta = decisão segura',
    insight: 'Não existe fórmula universal de vestibular: gênero, interlocutor, critérios e exigências mudam, e o edital é a fonte que decide.',
    states: [
      { label: '“há fórmula universal”', example: 'Todo parágrafo deve ter o mesmo número de linhas.', diagnosis: 'mito: não existe número mágico válido para toda proposta', action: 'consultar edital, gênero pedido e espaço disponível' },
      { label: '“citação garante nota”', example: 'Basta citar um autor conhecido para valorizar o texto.', diagnosis: 'mito: referência sem vínculo é decoração', action: 'explicar como a ideia citada sustenta o argumento' },
      { label: '“as bancas pedem igual”', example: 'ENEM, Fuvest e Unicamp aceitam o mesmo modelo.', diagnosis: 'mito: cada banca define gênero e critérios próprios', action: 'comparar intervenção no ENEM, coletânea na Fuvest e gênero/interlocutor na Unicamp' },
    ],
  },
  evaluation: {
    id: 'evaluation', name: 'Painel das cinco competências', question: 'Qual dimensão do texto cada competência do ENEM mede?',
    controlLabel: 'Competência', controlDescription: 'percorra C1 a C5 e seus critérios de 0 a 200', relation: 'C1 + C2 + C3 + C4 + C5 = até 1000 pontos',
    insight: 'A nota resulta do equilíbrio entre as cinco competências: cada uma vale até 200 pontos e nenhuma é substituída pelo brilho isolado de outra.',
    states: [
      { label: 'C1 · norma-padrão', example: 'Construções e convenções da escrita formal.', diagnosis: 'mede domínio da modalidade escrita formal', action: 'revisar desvios recorrentes sem apagar a clareza' },
      { label: 'C2 · proposta e repertório', example: 'Tema compreendido no gênero dissertativo-argumentativo.', diagnosis: 'mede compreensão da proposta e aplicação produtiva de repertório', action: 'ligar conhecimento de outras áreas ao argumento' },
      { label: 'C3 · argumentação', example: 'Informações selecionadas e organizadas em defesa da tese.', diagnosis: 'mede o projeto e a consistência dos argumentos', action: 'articular evidência, análise e ponto de vista' },
      { label: 'C4 · coesão', example: 'Relações entre frases e parágrafos ficam explícitas.', diagnosis: 'mede mecanismos linguísticos de encadeamento', action: 'variar conectivos conforme a relação lógica' },
      { label: 'C5 · intervenção', example: 'Agente, ação, meio, finalidade e detalhamento.', diagnosis: 'mede proposta de intervenção completa e ligada ao problema', action: 'detalhar ao menos um elemento e respeitar direitos humanos' },
    ],
  },
  'idea-map': {
    id: 'idea-map', name: 'Mapa de ideias com hierarquia', question: 'Como sair do brainstorm sem transformar o texto numa lista?',
    controlLabel: 'Etapa', controlDescription: 'organize associação, seleção e encadeamento', relation: 'gerar → selecionar → ordenar',
    insight: 'Brainstorm abre possibilidades; o mapa só ajuda quando hierarquiza ideias pelo vínculo com a tese e pela função de cada parágrafo.',
    states: [
      { label: 'gerar', example: 'acesso · custo · formação · infraestrutura', diagnosis: 'ideias numerosas ainda sem prioridade', action: 'registrar associações sem censura inicial' },
      { label: 'selecionar', example: 'barreira: infraestrutura · resposta: formação', diagnosis: 'ideias filtradas pela pergunta central', action: 'eliminar o que não ajuda a defender a tese' },
      { label: 'ordenar', example: 'problema → causa → consequência → resposta', diagnosis: 'trajeto argumentativo pronto para virar parágrafos', action: 'atribuir uma função a cada bloco do texto' },
    ],
  },
  repertoire: {
    id: 'repertoire', name: 'Repertório em funcionamento', question: 'A referência enfeita o texto ou produz uma razão?',
    controlLabel: 'Integração', controlDescription: 'avance da menção isolada à análise', relation: 'referência + vínculo + análise = evidência',
    insight: 'Repertório produtivo não é uma coleção de nomes: é uma referência pertinente cujo vínculo com a tese fica demonstrado no texto.',
    states: [
      { label: 'nome solto', example: 'Como dizia Paulo Freire...', diagnosis: 'citação decorativa sem função argumentativa', action: 'identificar a ideia concreta que será mobilizada' },
      { label: 'referência pertinente', example: 'A educação exige participação ativa do estudante.', diagnosis: 'a ideia combina com o tema, mas o vínculo está implícito', action: 'relacionar a referência ao problema discutido' },
      { label: 'repertório produtivo', example: 'A participação ativa defendida por Freire mostra por que acesso técnico sem autonomia não democratiza a aprendizagem.', diagnosis: 'referência transformada em evidência analisada', action: 'explicar como a referência sustenta a tese' },
    ],
  },
  'theme-axes': {
    id: 'theme-axes', name: 'Do eixo amplo ao problema', question: 'Como antecipar repertório sem tentar adivinhar o tema?',
    controlLabel: 'Escala', controlDescription: 'aproxime o eixo até formular uma tensão discutível', relation: 'eixo → recorte → problema',
    insight: 'Eixos temáticos servem para organizar repertório transferível; a proposta real exige um recorte e uma tensão, não uma redação decorada.',
    states: [
      { label: 'eixo', example: 'Educação', diagnosis: 'campo amplo demais para orientar uma tese', action: 'listar agentes, processos e conflitos recorrentes' },
      { label: 'recorte', example: 'Tecnologia na educação pública', diagnosis: 'objeto delimitado, ainda sem questão central', action: 'localizar uma tensão verificável no recorte' },
      { label: 'problema', example: 'Digitalização amplia acesso ou reproduz desigualdades?', diagnosis: 'tensão que admite posições e argumentos', action: 'formular tese e critérios para selecionar repertório' },
    ],
  },
  'prompt-fit': {
    id: 'prompt-fit', scene: 'prompt', name: 'Alvo da proposta', question: 'O parágrafo responde exatamente ao recorte pedido?',
    controlLabel: 'Leitura do tema', controlDescription: 'compare tema, recorte e resposta antes de escrever', relation: 'tema + recorte + tese = adequação',
    insight: 'Adequação não é mencionar palavras do enunciado: é sustentar uma tese sobre o recorte delimitado pela proposta.',
    states: [
      { label: 'eixo amplo', example: 'falar de educação sem tratar do problema delimitado', diagnosis: 'o assunto aparece, mas a pergunta específica fica sem resposta', action: 'sublinhar o recorte e formular uma tese que o enfrente' },
      { label: 'recorte atendido', example: 'nomear o problema e a relação exigida pela proposta', diagnosis: 'a tese responde à pergunta central', action: 'verificar se cada argumento permanece dentro do recorte' },
      { label: 'assunto distinto', example: 'trocar o problema proposto por outro tema social', diagnosis: 'a resposta deixa de dialogar com a proposta', action: 'retomar as palavras-chave e reconstruir a tese antes de desenvolver' },
    ],
  },
  'prompt-boundary': {
    id: 'prompt-boundary', scene: 'prompt', name: 'Fronteira do tema', question: 'O texto enfrenta o tema ou apenas circula ao redor dele?',
    controlLabel: 'Distância do recorte', controlDescription: 'desloque a tese entre o núcleo do tema e seus arredores', relation: 'núcleo do recorte → resposta avaliável',
    insight: 'Tangenciar e fugir não são sinônimos: no primeiro caso há proximidade sem enfrentamento; no segundo, o tema foi trocado.',
    states: [
      { label: 'núcleo', example: 'a tese trata da relação pedida no enunciado', diagnosis: 'desenvolvimento plenamente vinculado ao tema', action: 'usar o recorte como critério para selecionar exemplos' },
      { label: 'entorno', example: 'o texto discute o eixo amplo, mas evita a tensão proposta', diagnosis: 'tangenciamento: há vínculo parcial, sem resposta central', action: 'perguntar qual parte do enunciado ainda não recebeu posição' },
      { label: 'fora do alvo', example: 'a tese discute outro problema', diagnosis: 'fuga temática: não há resposta à proposta', action: 'recomeçar pela pergunta do comando, não por um texto memorizado' },
    ],
  },
  'genre-letter': {
    id: 'genre-letter', scene: 'genre', name: 'Projeto do gênero', question: 'A forma do texto corresponde ao interlocutor e à finalidade?',
    controlLabel: 'Gênero em foco', controlDescription: 'mude o gênero e observe o que a estrutura passa a exigir', relation: 'gênero + interlocutor + finalidade = escolhas formais',
    insight: 'A mesma opinião muda de forma conforme o gênero: destinatário, registro, marcas de autoria e efeito desejado fazem parte da resposta.',
    states: [
      { label: 'carta aberta', example: 'destinatário explícito, vocativo e apelo público', diagnosis: 'a argumentação se dirige a alguém e busca mobilizá-lo', action: 'deixar claro quem é chamado e qual resposta se espera' },
      { label: 'artigo de opinião', example: 'leitor de jornal, assinatura e defesa pública de posição', diagnosis: 'a voz autoral argumenta para um público amplo', action: 'equilibrar registro público, tese e interlocução' },
      { label: 'manifesto', example: 'primeira pessoa do plural e tom de convocação', diagnosis: 'o texto constrói um coletivo e chama à ação', action: 'usar marcas de convocação sem abandonar a razão do apelo' },
    ],
  },
  'genre-dissertation': {
    id: 'genre-dissertation', scene: 'genre', name: 'Arquitetura dissertativa', question: 'Cada parágrafo cumpre uma função no percurso da tese?',
    controlLabel: 'Bloco do texto', controlDescription: 'percorra a função de cada parte antes de redigir', relation: 'introdução → desenvolvimento → conclusão',
    insight: 'Estrutura não é receita de linhas: é distribuição de funções para que o leitor reconheça tema, tese, razões e fecho.',
    states: [
      { label: 'introduzir', example: 'tema, recorte e tese aparecem com clareza', diagnosis: 'o leitor sabe o que será defendido', action: 'evitar contextualização longa que esconda a posição' },
      { label: 'desenvolver', example: 'cada argumento ganha explicação e vínculo com a tese', diagnosis: 'o texto avança em vez de repetir a introdução', action: 'atribuir uma razão distinta a cada parágrafo' },
      { label: 'concluir', example: 'o percurso retorna à tese em formulação enriquecida', diagnosis: 'o fecho mostra aonde a argumentação chegou', action: 'não resumir mecanicamente nem abrir uma ideia sem desenvolvimento' },
    ],
  },
  'source-sense': {
    id: 'source-sense', scene: 'source', name: 'Leitura da coletânea', question: 'Que aspecto do problema cada texto motivador ilumina?',
    controlLabel: 'Foco de leitura', controlDescription: 'separe afirmação, perspectiva e aspecto iluminado', relation: 'texto motivador → leitura do recorte → argumento próprio',
    insight: 'A coletânea orienta a compreensão do problema; ela não substitui a autoria nem deve ser transcrita.',
    states: [
      { label: 'afirmação', example: 'o que o texto efetivamente diz', diagnosis: 'identifica a informação sem acrescentar uma conclusão inexistente', action: 'parafrasear a ideia central com suas próprias palavras' },
      { label: 'perspectiva', example: 'de qual ângulo o problema é mostrado', diagnosis: 'reconhece o ponto de vista em jogo', action: 'comparar essa perspectiva com as demais fontes' },
      { label: 'aspecto', example: 'qual dimensão do tema o material esclarece', diagnosis: 'a leitura já pode servir ao planejamento do argumento', action: 'anotar o uso possível sem copiar a formulação' },
    ],
  },
  'source-visual': {
    id: 'source-visual', scene: 'source', name: 'Coletânea visual sob exame', question: 'O que o suporte visual informa antes de virar argumento?',
    controlLabel: 'Suporte', controlDescription: 'troque o documento e procure sua pista própria', relation: 'suporte + pista específica = interpretação',
    insight: 'Gráfico, charge e fotografia pedem perguntas diferentes; tratá-los como simples ilustração faz perder a informação que delimita o tema.',
    states: [
      { label: 'gráfico', example: 'eixos, unidade, período e tendência', diagnosis: 'os dados só significam algo quando a escala e a comparação são lidas', action: 'dizer o que a tendência revela no recorte da proposta' },
      { label: 'charge', example: 'alvo da crítica e recurso de humor', diagnosis: 'o efeito de humor aponta uma posição, não um fato neutro', action: 'explicitar a crítica antes de aproximá-la da tese' },
      { label: 'fotografia', example: 'enquadramento, destaque e ausência', diagnosis: 'a seleção visual constrói uma leitura do problema', action: 'perguntar o que foi colocado no centro e o que ficou fora da cena' },
    ],
  },
  'source-authorship': {
    id: 'source-authorship', scene: 'source', name: 'Da fonte ao texto autoral', question: 'A ideia foi incorporada ao raciocínio ou apenas reproduzida?',
    controlLabel: 'Transformação', controlDescription: 'avance da cópia para a reformulação argumentativa', relation: 'dado lido + reformulação + tese = autoria',
    insight: 'Usar a coletânea é transformar informação em razão própria; copiar reduz espaço de argumentação e não demonstra compreensão.',
    states: [
      { label: 'transcrever', example: 'repetir o trecho, mesmo com pequena alteração', diagnosis: 'a formulação e o percurso continuam sendo da fonte', action: 'fechar o texto motivador e reescrever a ideia com a própria lógica' },
      { label: 'reformular', example: 'manter o dado, mas explicar seu sentido no argumento', diagnosis: 'a informação começa a trabalhar para a tese', action: 'acrescentar a consequência que liga dado e posição' },
      { label: 'integrar', example: 'usar a ideia como evidência em uma razão desenvolvida', diagnosis: 'a fonte foi assimilada pelo texto autoral', action: 'conferir se o parágrafo continuaria compreensível sem a frase original' },
    ],
  },
  'source-dialogue': {
    id: 'source-dialogue', scene: 'source', name: 'Diálogo com a coletânea', question: 'Como os materiais podem produzir uma leitura própria?',
    controlLabel: 'Movimento autoral', controlDescription: 'altere a relação entre os textos motivadores', relation: 'fonte A ↔ fonte B → interpretação',
    insight: 'Autoria aparece quando o texto estabelece relações: concorda com limites, contrapõe perspectivas ou desloca um dado para outra conclusão.',
    states: [
      { label: 'concordar com limite', example: 'aceitar a ideia principal e mostrar o que ela ainda não explica', diagnosis: 'a fonte é lida criticamente, sem ser descartada', action: 'nomear o limite e justificar sua relevância para a tese' },
      { label: 'contrapor', example: 'colocar duas perspectivas em tensão', diagnosis: 'o contraste cria problema argumentativo, não lista de fontes', action: 'explicar qual critério permite avaliar a divergência' },
      { label: 'deslocar o dado', example: 'usar um número para sustentar leitura diferente da sugerida', diagnosis: 'o texto produz inferência autoral a partir de informação dada', action: 'tornar explícita a ponte entre o dado e a conclusão' },
  ],
  },
  'repertoire-environment': {
    id: 'repertoire-environment', scene: 'repertoire', name: 'Repertório ambiental em ação', question: 'Que lente ajuda a explicar o problema ambiental?', controlLabel: 'Lente', controlDescription: 'mude o conceito e compare a pergunta que ele abre', relation: 'conceito ambiental → ângulo de análise → argumento', insight: 'Repertório ambiental funciona quando o conceito escolhe um ângulo real de análise, e não quando vira uma lista de termos.',
    states: [
      { label: 'externalidade negativa', example: 'um custo do consumo recai sobre quem não decidiu produzi-lo', diagnosis: 'expõe a transferência social e ambiental de custos', action: 'ligar o custo deslocado ao agente e à prática discutidos' },
      { label: 'justiça ambiental', example: 'impactos e proteção não se distribuem igualmente', diagnosis: 'permite analisar desigualdade na exposição ao dano', action: 'mostrar quem suporta mais risco e por quê' },
      { label: 'economia circular', example: 'materiais retornam ao ciclo em vez de virar descarte', diagnosis: 'abre a discussão sobre consumo, reuso e logística', action: 'explicar qual etapa do ciclo precisa mudar' },
    ],
  },
  'repertoire-work': {
    id: 'repertoire-work', scene: 'repertoire', name: 'Repertório sobre educação e trabalho', question: 'Qual conceito transforma um tema amplo em explicação?', controlLabel: 'Chave de leitura', controlDescription: 'altere o conceito e veja o foco do argumento', relation: 'conceito social → mecanismo → tese', insight: 'O repertório é produtivo quando esclarece um mecanismo entre escola, origem social e trabalho.',
    states: [
      { label: 'capital cultural', example: 'origem social influencia acesso a recursos valorizados pela escola', diagnosis: 'explica desigualdades que não são apenas individuais', action: 'relacionar a desigualdade de recursos ao recorte da proposta' },
      { label: 'educação libertadora', example: 'aprendizagem exige participação ativa do estudante', diagnosis: 'permite questionar uma formação apenas transmissiva', action: 'mostrar a consequência para autonomia ou permanência escolar' },
      { label: 'precarização', example: 'trabalho instável reduz proteção e continuidade', diagnosis: 'conecta qualificação, informalidade e vulnerabilidade', action: 'explicar como esse processo afeta a trajetória educacional' },
    ],
  },
  'repertoire-abstract': {
    id: 'repertoire-abstract', scene: 'repertoire', name: 'Conceito abstrato ancorado', question: 'Como discutir uma ideia sem perder o concreto?', controlLabel: 'Movimento', controlDescription: 'passe da definição ao exemplo que testa o conceito', relation: 'conceito + exemplo concreto = discussão densa', insight: 'Temas abstratos exigem definir a ideia e testá-la em uma situação concreta; só uma das etapas produz generalidade vazia.',
    states: [
      { label: 'definir', example: 'delimitar o que liberdade, tempo ou felicidade significa no texto', diagnosis: 'o conceito ganha fronteira para ser debatido', action: 'evitar definições de dicionário que não criam problema' },
      { label: 'concretizar', example: 'usar uma situação que manifeste o conflito conceitual', diagnosis: 'a abstração encontra um caso observável', action: 'selecionar exemplo que realmente teste a definição' },
      { label: 'retomar', example: 'voltar do caso ao conceito com uma conclusão', diagnosis: 'o exemplo sustenta uma tese, não ilustra por enfeite', action: 'dizer o que o caso permite concluir sobre a ideia geral' },
    ],
  },
  'repertoire-body': {
    id: 'repertoire-body', scene: 'repertoire', name: 'Repertório de corpo e saúde', question: 'A referência preserva direitos e explica estruturas?', controlLabel: 'Lente', controlDescription: 'compare lentes que deslocam julgamento moral para análise social', relation: 'direito + estrutura social → argumentação responsável', insight: 'Em corpo, saúde e sexualidade, repertório sólido evita moralizar indivíduos e ilumina políticas, representações e direitos.',
    states: [
      { label: 'determinantes sociais', example: 'condições de vida influenciam possibilidades de saúde', diagnosis: 'desloca o foco da culpa individual para as estruturas', action: 'relacionar renda, território ou acesso ao problema discutido' },
      { label: 'integralidade do SUS', example: 'saúde como cuidado amplo e direito', diagnosis: 'oferece critério para discutir política pública', action: 'indicar qual dimensão do cuidado está sendo negligenciada' },
      { label: 'tabu e silenciamento', example: 'certos temas são afastados do debate público', diagnosis: 'explica por que informação e atendimento podem falhar', action: 'mostrar como o silêncio reproduz o problema' },
    ],
  },
  'repertoire-violence': {
    id: 'repertoire-violence', scene: 'repertoire', name: 'Repertório de violência e punição', question: 'Que conceito explica a violência além da reação imediata?', controlLabel: 'Escala de análise', controlDescription: 'mude a lente e acompanhe a causa que ganha foco', relation: 'conceito → causa social → política de longo prazo', insight: 'Segurança pública não se reduz à resposta penal: conceitos ajudam a separar sintoma, estrutura e política duradoura.',
    states: [
      { label: 'violência estrutural', example: 'desigualdades organizam exposição desigual a danos', diagnosis: 'a causa não cabe em uma decisão individual isolada', action: 'explicitar o mecanismo social que sustenta o risco' },
      { label: 'seletividade penal', example: 'a punição atinge grupos de maneira desigual', diagnosis: 'permite analisar aplicação concreta das normas', action: 'distinguir regra formal e efeito social da política' },
      { label: 'ressocialização', example: 'pena também pode buscar reinserção social', diagnosis: 'questiona uma visão apenas retributiva', action: 'avaliar se a medida proposta reduz ou reproduz violência' },
    ],
  },
  'repertoire-citizenship': {
    id: 'repertoire-citizenship', scene: 'repertoire', name: 'Repertório de cidadania e poder', question: 'Que lente revela a distância entre direito formal e participação real?', controlLabel: 'Chave política', controlDescription: 'altere o conceito para localizar o obstáculo à cidadania', relation: 'direito + participação + equidade = cidadania', insight: 'Cidadania se prova na possibilidade concreta de participação e acesso a direitos, não apenas na sua declaração formal.',
    states: [
      { label: 'igualdade formal', example: 'a regra vale para todos no plano jurídico', diagnosis: 'mostra o ponto de partida, mas não garante acesso efetivo', action: 'verificar quais barreiras persistem apesar da regra igual' },
      { label: 'igualdade material', example: 'políticas compensam condições desiguais de partida', diagnosis: 'permite discutir equidade sem confundir com privilégio', action: 'indicar qual obstáculo concreto a medida enfrenta' },
      { label: 'esfera pública', example: 'debate e participação formam opinião coletiva', diagnosis: 'explica a importância de canais acessíveis de voz', action: 'relacionar a qualidade do debate à participação proposta' },
    ],
  },
  'repertoire-culture': {
    id: 'repertoire-culture', scene: 'repertoire', name: 'Repertório de cultura e relações sociais', question: 'Como a cultura ajuda a explicar acesso, memória e valor?', controlLabel: 'Lente cultural', controlDescription: 'troque o conceito e escolha o mecanismo que será defendido', relation: 'cultura + acesso + reconhecimento = argumento', insight: 'Cultura não é apenas consumo: repertórios ajudam a analisar quem produz, acessa, preserva e reconhece bens culturais.',
    states: [
      { label: 'capital cultural', example: 'recursos e hábitos valorizados são distribuídos desigualmente', diagnosis: 'explica acesso desigual à fruição e à produção cultural', action: 'ligar o repertório familiar e escolar ao recorte' },
      { label: 'memória e esquecimento', example: 'preservar também é decidir o que permanece visível', diagnosis: 'transforma patrimônio em disputa de reconhecimento', action: 'identificar quais grupos ou narrativas foram apagados' },
      { label: 'indústria cultural', example: 'produção cultural circula sob lógica de mercado', diagnosis: 'permite discutir padronização e concentração de visibilidade', action: 'mostrar como a lógica afeta diversidade e acesso' },
    ],
  },
  'repertoire-media': {
    id: 'repertoire-media', scene: 'repertoire', name: 'Repertório de mídia e sociedade', question: 'Qual mecanismo explica a circulação e o impacto da informação?', controlLabel: 'Mecanismo', controlDescription: 'troque a lente e compare os efeitos sobre o debate público', relation: 'plataforma + circulação + atenção = efeito social', insight: 'Repertório de mídia é produtivo quando nomeia o mecanismo de circulação, atenção ou visibilidade que sustenta a tese.',
    states: [
      { label: 'agenda-setting', example: 'a seleção de temas orienta o que parece relevante', diagnosis: 'explica poder de visibilidade sem confundir com ordem direta', action: 'ligar a seleção do assunto ao efeito no debate' },
      { label: 'câmara de eco', example: 'interações repetem perspectivas semelhantes', diagnosis: 'mostra como a circulação pode reduzir contato com dissenso', action: 'explicar a consequência para informação ou participação' },
      { label: 'economia da atenção', example: 'disputa por engajamento valoriza permanência e reação', diagnosis: 'permite analisar incentivos das plataformas', action: 'relacionar o incentivo à prática que o texto critica' },
    ],
  },
  'theme-environment': {
    id: 'theme-environment', scene: 'theme', name: 'Recorte ambiental', question: 'Qual conflito do tema ambiental sua tese vai explicar?', controlLabel: 'Eixo do problema', controlDescription: 'escolha um mecanismo em vez de listar todos os danos', relation: 'recorte ambiental → causa → tese', insight: 'Um tema ambiental fica argumentável quando o texto escolhe uma tensão — consumo, gestão, acesso ou interesse — e a desenvolve.',
    states: [
      { label: 'consumo', example: 'descarte de eletrônicos envolve obsolescência e uso de materiais', diagnosis: 'o foco está no ciclo de compra e descarte', action: 'ligar hábito de consumo ao problema ambiental específico' },
      { label: 'gestão', example: 'crise hídrica envolve planejamento e distribuição de água', diagnosis: 'o foco está em decisões coletivas sobre recurso comum', action: 'definir qual falha de gestão a tese sustenta' },
      { label: 'desigualdade de acesso', example: 'os impactos não atingem todos os territórios do mesmo modo', diagnosis: 'o foco está na distribuição de proteção e risco', action: 'mostrar quem é mais afetado e por qual mecanismo' },
    ],
  },
  'theme-work': {
    id: 'theme-work', scene: 'theme', name: 'Recorte de educação e trabalho', question: 'Qual fator explica o problema sem transformar “a escola” em abstração?', controlLabel: 'Fator central', controlDescription: 'escolha um fator e acompanhe o argumento que ele permite', relation: 'fator específico → explicação → foco', insight: 'Tema de educação e trabalho pede causa nomeada: generalizar a escola impede explicar o que realmente produz evasão ou precarização.',
    states: [
      { label: 'necessidade de trabalhar', example: 'a renda imediata compete com a permanência escolar', diagnosis: 'o problema liga sobrevivência e tempo de estudo', action: 'explicar que suporte pode reduzir essa tensão' },
      { label: 'currículo sem vínculo', example: 'o conteúdo não é percebido como trajetória possível', diagnosis: 'o foco está na relação entre formação e projeto de vida', action: 'mostrar como orientação e sentido podem favorecer permanência' },
      { label: 'falha de permanência', example: 'distância, violência ou ausência de apoio dificultam concluir', diagnosis: 'o problema não é apenas matrícula, mas continuidade', action: 'identificar a barreira material que interrompe o percurso' },
    ],
  },
  'theme-abstract': {
    id: 'theme-abstract', scene: 'theme', name: 'Recorte de tema abstrato', question: 'Que verbo do enunciado define a operação que o texto precisa fazer?', controlLabel: 'Comando', controlDescription: 'mude o verbo e transforme conceito em tarefa argumentativa', relation: 'conceito + verbo do comando = tese pertinente', insight: 'Em tema abstrato, o conceito não basta: o verbo do enunciado diz se o texto deve avaliar, discutir limites ou explicar importância.',
    states: [
      { label: 'avaliar desafios', example: 'medir obstáculos e consequências de uma ideia', diagnosis: 'a tese precisa julgar condições, não apenas definir', action: 'formular critério para avaliar o desafio' },
      { label: 'discutir importância', example: 'examinar por que algo importa e para quem', diagnosis: 'a tese precisa mostrar relevância sob uma perspectiva', action: 'evitar elogio genérico; indicar o efeito defendido' },
      { label: 'analisar limites', example: 'investigar até onde uma ideia permanece válida', diagnosis: 'a tese pede tensão e condição de validade', action: 'construir contraste entre possibilidade e restrição' },
    ],
  },
  'theme-body': {
    id: 'theme-body', scene: 'theme', name: 'Recorte de corpo, saúde e sexualidade', question: 'Como analisar o problema sem generalizar pessoas ou violar direitos?', controlLabel: 'Plano de análise', controlDescription: 'desloque o foco para estruturas, políticas e representações', relation: 'estrutura + direito + cuidado = tese responsável', insight: 'Nesses temas, o argumento ganha rigor quando discute condições sociais e políticas públicas, não julgamento moral de indivíduos.',
    states: [
      { label: 'estrutura social', example: 'condições de vida e desigualdade organizam o acesso', diagnosis: 'a causa não é reduzida a escolha individual', action: 'explicar qual estrutura limita proteção ou informação' },
      { label: 'política pública', example: 'serviços, informação e cuidado devem ser acessíveis', diagnosis: 'o foco passa à garantia de direito', action: 'definir qual ação pública é compatível com a necessidade' },
      { label: 'representação cultural', example: 'padrões e silenciamentos moldam percepção e conduta', diagnosis: 'o texto analisa linguagem e valores compartilhados', action: 'ligar a representação ao efeito social discutido' },
    ],
  },
  'theme-violence': {
    id: 'theme-violence', scene: 'theme', name: 'Recorte de violência e proteção', question: 'Qual elo da cadeia de proteção será desenvolvido?', controlLabel: 'Eixo', controlDescription: 'escolha um elo e evite transformar violência em lista de problemas', relation: 'eixo de proteção → causa → resposta', insight: 'Em violência, escolher um eixo — subnotificação, atendimento, cultura ou proteção — permite explicar e responder com profundidade.',
    states: [
      { label: 'subnotificação', example: 'a violência não chega aos registros e aos serviços', diagnosis: 'o problema começa antes dos dados oficiais', action: 'mostrar que barreira impede a denúncia ou o acolhimento' },
      { label: 'rede de atendimento', example: 'serviços precisam agir de forma coordenada', diagnosis: 'a proteção depende de acesso e continuidade', action: 'identificar onde a rede falha para a pessoa atendida' },
      { label: 'medidas protetivas', example: 'a norma existe, mas sua efetividade pode ser limitada', diagnosis: 'o texto diferencia previsão legal e proteção concreta', action: 'explicar qual condição torna a medida efetiva' },
    ],
  },
  'theme-citizenship': {
    id: 'theme-citizenship', scene: 'theme', name: 'Recorte de cidadania e poder', question: 'Que obstáculo torna a participação política juvenil mais difícil?', controlLabel: 'Obstáculo', controlDescription: 'escolha uma barreira e defenda uma relação causal', relation: 'barreira de participação → consequência → tese', insight: 'Cidadania não se explica por uma suposta falta de interesse: é preciso identificar a barreira que organiza a distância em relação à participação.',
    states: [
      { label: 'desinformação', example: 'falta de informação dificulta reconhecer canais e direitos', diagnosis: 'o foco está na qualidade da mediação informativa', action: 'explicar como educação e informação alteram participação' },
      { label: 'canais inacessíveis', example: 'espaços de decisão não acolhem a presença juvenil', diagnosis: 'o foco está no desenho institucional da participação', action: 'mostrar qual adaptação amplia acesso real' },
      { label: 'descrença institucional', example: 'experiências de ineficácia reduzem expectativa de influência', diagnosis: 'o foco está na confiança construída pela resposta pública', action: 'ligar transparência e retorno à disposição de participar' },
    ],
  },
  'theme-culture': {
    id: 'theme-culture', scene: 'theme', name: 'Recorte de acesso cultural', question: 'Qual barreira organiza o acesso desigual a bens culturais?', controlLabel: 'Barreira', controlDescription: 'escolha um obstáculo e observe o argumento que ele sustenta', relation: 'barreira cultural → desigualdade de acesso → tese', insight: 'Cultura não deve ser defendida de modo abstrato: o argumento fica forte quando localiza a barreira concreta que impede acesso e participação.',
    states: [
      { label: 'distribuição desigual', example: 'equipamentos culturais se concentram em poucos territórios', diagnosis: 'a distância física organiza oportunidade desigual', action: 'relacionar território, transporte e presença de equipamentos' },
      { label: 'custo', example: 'preço e renda limitam fruição e produção cultural', diagnosis: 'a barreira econômica reduz o acesso mesmo quando a oferta existe', action: 'mostrar como a política pode enfrentar a restrição' },
      { label: 'representatividade', example: 'acervos e programações não reconhecem todos os grupos', diagnosis: 'a exclusão também aparece no que é valorizado e exibido', action: 'explicar por que reconhecimento modifica pertencimento' },
    ],
  },
  'theme-media': {
    id: 'theme-media', scene: 'theme', name: 'Recorte de desinformação', question: 'Qual mecanismo explica o efeito social da informação falsa?', controlLabel: 'Mecanismo central', controlDescription: 'escolha a causa e evite tratar “a internet” como explicação única', relation: 'mecanismo informacional → efeito público → tese', insight: 'Desinformação exige mecanismo definido: circulação, educação midiática, modelo de negócio ou impacto público produzem argumentos diferentes.',
    states: [
      { label: 'velocidade de circulação', example: 'conteúdo se espalha antes de ser verificado', diagnosis: 'o foco está no tempo entre alcance e checagem', action: 'mostrar como a velocidade amplia o dano discutido' },
      { label: 'educação midiática', example: 'leitores precisam avaliar fonte, evidência e intenção', diagnosis: 'o foco está na capacidade de leitura crítica', action: 'explicar qual prática formativa reduz vulnerabilidade' },
      { label: 'modelo de negócio', example: 'engajamento pode incentivar conteúdo sensacionalista', diagnosis: 'o foco está nos incentivos que moldam circulação', action: 'ligar incentivo econômico e comportamento da plataforma' },
    ],
  },
  'intro-thesis': workshop('intro-thesis', 'Tese logo na entrada', 'A opinião aparece como resposta ao recorte, e não como tema solto?', [
    { label: 'tema amplo', example: 'A educação é importante para a sociedade.', diagnosis: 'assunto apresentado sem posição discutível', action: 'converter o tema em uma resposta delimitada' },
    { label: 'tese delimitada', example: 'A desigualdade de acesso à formação técnica limita a inserção profissional juvenil.', diagnosis: 'posição responde a uma relação precisa', action: 'fazer os argumentos comprovarem essa relação' },
  ], 'genre'),
  'intro-context': workshop('intro-context', 'Contexto que conduz à tese', 'A contextualização prepara a pergunta ou a substitui?', [
    { label: 'abertura ornamental', example: 'Desde os primórdios, a humanidade enfrenta desafios.', diagnosis: 'frase poderia abrir quase qualquer redação', action: 'trazer um dado, processo ou referência ligada ao recorte' },
    { label: 'contexto funcional', example: 'A expansão do trabalho por plataformas alterou a proteção de quem presta o serviço.', diagnosis: 'o contexto conduz diretamente ao problema', action: 'formular a tese logo depois da contextualização' },
  ], 'genre'),
  audience: workshop('audience', 'Auditório e escolha de razão', 'Que razão pode convencer este leitor, sem apelar apenas à concordância prévia?', [
    { label: 'auditório particular', example: 'uma associação de bairro avalia efeitos concretos no território', diagnosis: 'argumento considera valores e situação de interlocutores definidos', action: 'usar exemplos verificáveis para esse público' },
    { label: 'auditório universal', example: 'a dignidade e a igualdade sustentam a defesa para leitores diversos', diagnosis: 'argumento busca princípios compartilháveis', action: 'explicitar a premissa, não apenas declará-la' },
  ], 'repertoire'),
  'quasi-logic': workshop('quasi-logic', 'Semelhança de lógica, prova de verdade?', 'O efeito de certeza nasce de uma relação válida ou de uma aparência de rigor?', [
    { label: 'analogia frágil', example: 'Dois problemas parecem iguais, logo exigem a mesma solução.', diagnosis: 'semelhança superficial pode esconder condições decisivas', action: 'verificar o critério que permite comparar os casos' },
    { label: 'relação explicitada', example: 'A comparação vale porque ambos os casos compartilham a mesma barreira de acesso.', diagnosis: 'a premissa da aproximação fica examinável', action: 'ligar o critério à conclusão defendida' },
  ]),
  'internal-coherence': workshop('internal-coherence', 'Coerência dentro do argumento', 'As partes do parágrafo se sustentam mutuamente?', [
    { label: 'salto', example: 'Há desigualdade; portanto basta criar uma campanha.', diagnosis: 'a solução não deriva da causa apresentada', action: 'inserir o mecanismo que conecta causa, consequência e resposta' },
    { label: 'cadeia coerente', example: 'A falta de informação reduz acesso; por isso a mediação escolar amplia o uso dos serviços.', diagnosis: 'cada passo responde ao anterior', action: 'reler procurando conclusão sem premissa' },
  ]),
  'external-coherence': workshop('external-coherence', 'Coerência com o mundo', 'A afirmação é compatível com o conhecimento mobilizado?', [
    { label: 'dado deslocado', example: 'um número sem fonte ou período é usado como prova total.', diagnosis: 'a evidência não permite a generalização feita', action: 'delimitar fonte, recorte e alcance do dado' },
    { label: 'evidência situada', example: 'o dado é explicado no período e no grupo a que se refere.', diagnosis: 'a tese respeita o que a informação realmente mostra', action: 'distinguir fato, interpretação e hipótese' },
  ], 'source'),
  'data-examples': workshop('data-examples', 'Número que vira argumento', 'O dado ilustra a tese ou apenas ocupa espaço?', [
    { label: 'estatística solta', example: '“30%” aparece sem fonte, grupo ou consequência.', diagnosis: 'o leitor não sabe o que o número prova', action: 'identificar medida, contexto e implicação' },
    { label: 'evidência analisada', example: 'o indicador revela uma barreira específica e explica seu efeito.', diagnosis: 'o exemplo passa a funcionar como razão', action: 'conectar explicitamente evidência e tese' },
  ], 'source'),
  'prestigious-voices': workshop('prestigious-voices', 'Voz prestigiada com função', 'A autoridade citada substitui o raciocínio ou o aprofunda?', [
    { label: 'nome de empréstimo', example: 'um autor é mencionado sem ideia nem vínculo.', diagnosis: 'prestígio não demonstra a conclusão', action: 'apresentar o conceito que será usado' },
    { label: 'conceito mobilizado', example: 'a ideia do autor esclarece o mecanismo do problema.', diagnosis: 'a voz entra como evidência interpretada', action: 'retomar a tese após explicar a referência' },
  ], 'repertoire'),
  concession: workshop('concession', 'Conceder sem abandonar a tese', 'O contraponto é reconhecido e depois limitado?', [
    { label: 'concessão sem retorno', example: '“Embora haja avanços...” e o parágrafo termina aí.', diagnosis: 'a objeção passa a ocupar o centro', action: 'marcar contraste e reafirmar a posição' },
    { label: 'ressalva produtiva', example: 'o avanço é reconhecido, mas não elimina a barreira analisada.', diagnosis: 'a concessão torna a tese mais precisa', action: 'mostrar qual condição limita o contraponto' },
  ]),
  refutation: workshop('refutation', 'Refutar pelo mecanismo', 'A resposta ao contraponto mostra onde ele falha?', [
    { label: 'negação', example: '“Esse argumento está errado.”', diagnosis: 'a discordância não oferece razão', action: 'identificar a premissa ou consequência problemática' },
    { label: 'refutação', example: 'a medida é insuficiente porque não alcança o grupo que enfrenta a barreira.', diagnosis: 'o limite é demonstrado com critério', action: 'retomar a tese em formulação fortalecida' },
  ]),
  intertextuality: workshop('intertextuality', 'Diálogo entre textos', 'A referência transforma o sentido da tese ou apenas repete uma fórmula conhecida?', [
    { label: 'alusão decorativa', example: 'uma obra é citada sem relação com o problema.', diagnosis: 'o diálogo não produz leitura nova', action: 'nomear qual aspecto da obra será comparado' },
    { label: 'intertexto analisado', example: 'a referência ilumina uma contradição presente no tema.', diagnosis: 'dois discursos se esclarecem mutuamente', action: 'explicar o efeito da aproximação' },
  ], 'source'),
  'repertoire-bank': workshop('repertoire-bank', 'Banco de repertório utilizável', 'A experiência de um tema anterior é transferida com cuidado?', [
    { label: 'analogia automática', example: 'uma solução de outro tema é copiada para o novo problema.', diagnosis: 'o contexto pode ter mudado', action: 'comparar mecanismo, agente e limite dos dois casos' },
    { label: 'transferência justificada', example: 'o caso anterior ajuda porque enfrenta a mesma barreira causal.', diagnosis: 'a referência ganha pertinência', action: 'adaptar a lição ao recorte atual' },
  ], 'repertoire'),
  'current-affairs': workshop('current-affairs', 'Fato atual com prazo de validade', 'O acontecimento recente é usado como dado verificável, não como manchete?', [
    { label: 'manchete genérica', example: '“as notícias mostram que o problema cresceu”.', diagnosis: 'falta evento, fonte e relação causal', action: 'registrar o fato e o que ele permite concluir' },
    { label: 'fato contextualizado', example: 'o acontecimento tem data, contexto e limite de interpretação.', diagnosis: 'atualidade apoia sem substituir a análise', action: 'vincular o fato à tese, não à impressão pessoal' },
  ], 'source'),
  domains: workshop('domains', 'Cruzar domínios sem colagem', 'As áreas do saber se complementam para explicar uma mesma questão?', [
    { label: 'lista de áreas', example: 'história, ciência e arte aparecem sem conexão.', diagnosis: 'amplitude não vira argumento', action: 'definir a pergunta comum que orienta as referências' },
    { label: 'lentes complementares', example: 'um dado social mostra o efeito e um conceito histórico explica sua origem.', diagnosis: 'as áreas cumprem funções diferentes', action: 'sintetizar a relação entre as lentes' },
  ], 'repertoire'),
  'conclusion-synthesis': workshop('conclusion-synthesis', 'Fecho que retoma e avança', 'A conclusão volta à tese sem copiar a introdução?', [
    { label: 'repetição', example: 'a mesma tese reaparece sem incorporar o percurso do texto.', diagnosis: 'o fecho não mostra elaboração', action: 'sintetizar as razões já desenvolvidas' },
    { label: 'retomada enriquecida', example: 'a tese retorna à luz das relações demonstradas.', diagnosis: 'a conclusão dá unidade ao percurso', action: 'não abrir uma evidência nova no último momento' },
  ], 'genre'),
  'conclusion-focus': workshop('conclusion-focus', 'Síntese com foco', 'O último parágrafo seleciona o essencial?', [
    { label: 'resumo em lista', example: 'cada argumento é repetido na mesma ordem.', diagnosis: 'muita informação, pouca direção', action: 'eleger a consequência ou a tese que organiza o fecho' },
    { label: 'focalização', example: 'a síntese destaca a relação decisiva do argumento.', diagnosis: 'o leitor reconhece a ideia que permanece', action: 'ajustar o tom final ao efeito desejado' },
  ], 'genre'),
  'intervention-agents': workshop('intervention-agents', 'Agente com responsabilidade', 'Quem pode executar a ação proposta?', [
    { label: 'agente abstrato', example: '“a sociedade deve resolver”.', diagnosis: 'não há competência nem ação verificável', action: 'nomear instituição ou coletivo com atribuição real' },
    { label: 'agente situado', example: 'a escola forma leitores críticos em parceria com a rede local.', diagnosis: 'agente e capacidade ficam coerentes', action: 'detalhar meio e finalidade da ação' },
  ], 'theme'),
  'intervention-feasibility': workshop('intervention-feasibility', 'Intervenção viável e inventiva', 'A proposta indica como sai do papel?', [
    { label: 'verbo sem meio', example: '“criar uma política” sem recurso, canal ou etapa.', diagnosis: 'a solução não permite avaliar execução', action: 'explicar instrumento, articulação e alcance' },
    { label: 'caminho executável', example: 'a ação prevê formação, canal de acesso e acompanhamento.', diagnosis: 'a proposta mostra condições de funcionamento', action: 'verificar se a inovação responde ao obstáculo real' },
  ], 'theme'),
  'intervention-coherence': workshop('intervention-coherence', 'Resposta proporcional ao diagnóstico', 'A intervenção enfrenta a causa apresentada?', [
    { label: 'solução deslocada', example: 'o texto diagnostica acesso e propõe apenas campanha.', diagnosis: 'meio e problema não se encontram', action: 'ligar cada ação a uma causa analisada' },
    { label: 'resposta encadeada', example: 'a medida remove a barreira descrita no desenvolvimento.', diagnosis: 'a conclusão completa o projeto argumentativo', action: 'revisar os elos entre tese, causas e proposta' },
  ], 'theme'),
  'intervention-rights': workshop('intervention-rights', 'Intervir preservando direitos', 'A proposta combate o problema sem violar dignidade ou liberdade?', [
    { label: 'controle punitivo', example: 'a solução restringe um grupo sem garantia nem participação.', diagnosis: 'eficiência alegada não justifica violação de direitos', action: 'examinar meios, destinatários e efeitos da medida' },
    { label: 'proteção de direitos', example: 'a ação amplia acesso, escuta e proteção sem discriminar.', diagnosis: 'a proposta mantém a dignidade como limite', action: 'explicitar como o meio respeita quem será afetado' },
  ], 'theme'),
  'reference-cohesion': workshop('reference-cohesion', 'Referente sem ambiguidade', 'O leitor sabe a que cada retomada se refere?', [
    { label: 'pronome ambíguo', example: 'dois termos possíveis antecedem “ele” ou “isso”.', diagnosis: 'a cadeia referencial se rompe', action: 'substituir por expressão nominal específica' },
    { label: 'retomada precisa', example: 'a expressão recupera exatamente a ideia necessária.', diagnosis: 'frases se conectam sem adivinhação', action: 'alternar formas sem esconder o referente' },
  ], 'source'),
  'sequential-cohesion': workshop('sequential-cohesion', 'Conectivo com relação lógica', 'A palavra de ligação corresponde ao movimento do raciocínio?', [
    { label: 'conectivo automático', example: '“portanto” aparece onde há apenas contraste.', diagnosis: 'a relação anunciada contradiz o argumento', action: 'nomear se há causa, oposição, condição ou conclusão' },
    { label: 'encadeamento explícito', example: 'o conectivo torna visível a passagem entre as ideias.', diagnosis: 'o leitor acompanha a progressão', action: 'variar conectivos preservando a relação lógica' },
  ], 'source'),
  'cohesion-diagnosis': workshop('cohesion-diagnosis', 'Diagnóstico de ruptura', 'Em que ponto a sequência deixa de conduzir o leitor?', [
    { label: 'lacuna de relação', example: 'a frase seguinte muda de assunto sem ponte.', diagnosis: 'há informação, mas falta ligação', action: 'inserir a relação ou reorganizar a ordem' },
    { label: 'progressão', example: 'cada frase retoma e acrescenta uma informação necessária.', diagnosis: 'o parágrafo avança sem saltos', action: 'eliminar repetições que não cumprem função' },
  ], 'source'),
  'language-clarity': workshop('language-clarity', 'Norma a favor da clareza', 'A escolha linguística ajuda o leitor a recuperar o sentido?', [
    { label: 'opacidade', example: 'período longo acumula encaixes e termos vagos.', diagnosis: 'a forma dificulta a tese', action: 'dividir unidades e escolher termos específicos' },
    { label: 'precisão expressiva', example: 'a frase tem sujeito, relação e vocabulário adequados.', diagnosis: 'a norma serve à inteligibilidade', action: 'revisar concordância e pontuação no texto real' },
  ]),
  'rights-generations': workshop('rights-generations', 'Direitos individuais em conflito', 'Que liberdade precisa ser protegida e qual limite público entra em jogo?', [
    { label: 'direito abstrato', example: 'liberdade é citada sem sujeito nem situação.', diagnosis: 'não há como avaliar o conflito', action: 'indicar titular, proteção e eventual limite' },
    { label: 'garantia situada', example: 'a liberdade é ligada à proteção contra interferência arbitrária.', diagnosis: 'o direito individual ganha sentido concreto', action: 'articular liberdade e igualdade perante a lei' },
  ], 'theme'),
  'rights-social': workshop('rights-social', 'Direitos sociais, coletivos e difusos', 'O problema exige prestação, participação coletiva ou proteção de interesse comum?', [
    { label: 'direito sem obrigação', example: 'saúde ou ambiente são citados sem dever correspondente.', diagnosis: 'o texto não mostra quem deve assegurar o direito', action: 'identificar política, responsabilidade e grupo alcançado' },
    { label: 'proteção compartilhada', example: 'o direito orienta ação pública e participação social.', diagnosis: 'a dimensão coletiva fica visível', action: 'distinguir titularidade individual e efeito coletivo' },
  ], 'theme'),
  'model-essay': workshop('model-essay', 'Ler modelo sem imitar molde', 'O que merece ser estudado numa redação de alto desempenho?', [
    { label: 'caça a frases', example: 'trechos são copiados como fórmula.', diagnosis: 'a técnica desaparece atrás da superfície', action: 'perguntar qual função cada escolha cumpre' },
    { label: 'leitura de estratégia', example: 'tese, evidência, progressão e proposta são identificadas.', diagnosis: 'o modelo vira objeto de análise', action: 'adaptar o procedimento ao novo tema' },
  ], 'genre'),
  'media-revision': workshop('media-revision', 'Revisar texto publicado', 'O aprimoramento nasce de impressão vaga ou de critério?', [
    { label: 'comentário genérico', example: '“o texto está fraco”.', diagnosis: 'não informa o que mudar', action: 'localizar problema de tese, evidência, coesão ou proposta' },
    { label: 'revisão localizada', example: 'a evidência é pertinente, mas falta explicar seu vínculo com a tese.', diagnosis: 'o diagnóstico orienta a reescrita', action: 'reescrever o trecho e conferir o efeito produzido' },
  ], 'source'),
};

export function writingInstrumentState(id: WritingInstrumentId, index: number) {
  const states = WRITING_INSTRUMENTS[id].states;
  return states[Math.max(0, Math.min(states.length - 1, Math.round(index)))];
}
