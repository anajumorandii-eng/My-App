import { summaryCurriculum } from './summaryCurriculum';
import { buildSubjectSummaries, type SubjectTopicNote } from './subjectSummaryFactory';

// Filosofia e Sociologia entraram no app com identidade visual (crivoSubjects)
// e com tópicos/capítulos em mockData, mas sem nenhum resumo: eram as duas
// únicas matérias com 0 de cobertura. As notas abaixo são autorais, escritas
// no mesmo padrão das demais matérias — `focus` é a ideia central que abre o
// resumo e `application` é o uso orientado à prova. Elas não transcrevem a
// apostila; a apostila é citada como fonte pelo factory.
//
// O factory lança erro se um capítulo do currículo ficar sem nota, então
// acrescentar um capítulo em summaryCurriculum obriga a escrever a nota aqui.

const philosophyNotes: Record<string, SubjectTopicNote> = {
  'O Nascimento da Filosofia: do Mito ao Logos': {
    focus: 'A passagem do mito ao logos não é a troca do erro pela verdade, mas a mudança do tipo de justificação aceita: o mito explica por narrativa e autoridade da tradição; o logos exige razão pública, argumento e possibilidade de contestação.',
    application: 'Em prova, resista à leitura evolucionista simples ("o mito é primitivo"). Mostre que o mito continua operando socialmente e que a novidade grega é o critério de validação: o argumento tem de poder ser examinado por outro.',
  },
  'Os Filósofos da Physis: Tales, Anaximandro e Anaxímenes': {
    focus: 'Os milésios procuram um princípio (arché) que explique a natureza por ela mesma: água em Tales, ápeiron (indeterminado) em Anaximandro, ar em Anaxímenes. O ganho não é a resposta, é o tipo de pergunta — causa natural, não divina.',
    application: 'Use-os para caracterizar a cosmologia como primeira forma de racionalidade. O ápeiron de Anaximandro costuma cair porque rompe com a explicação por um elemento sensível e antecipa a ideia de princípio abstrato.',
  },
  'Heráclito e Parmênides: o Ser e o Devir': {
    focus: 'Heráclito toma o devir como realidade e a unidade dos contrários como lei (logos); Parmênides toma o ser como único, imóvel e pensável, e o movimento como ilusão dos sentidos. A oposição funda o problema clássico entre sensível e inteligível.',
    application: 'A questão quase sempre pede a tensão, não o resumo de cada um. Mostre que Platão responde a ambos: o mundo sensível é heraclitiano, o das Ideias é parmenidiano.',
  },
  'Os Sofistas e a Crise da Verdade': {
    focus: 'Os sofistas deslocam a filosofia da physis para o humano e ensinam retórica: Protágoras afirma que "o homem é a medida de todas as coisas", tornando a verdade relativa ao sujeito e à convenção (nomos), não à natureza.',
    application: 'Serve a temas contemporâneos (pós-verdade, desinformação). Cuidado com o julgamento fácil: distinga relativismo epistemológico de má-fé argumentativa, e lembre que a crítica de Platão é interessada.',
  },
  'O Método Socrático e a Maiêutica': {
    focus: 'Sócrates opera em dois tempos: a ironia desmonta o saber presumido do interlocutor ("só sei que nada sei") e a maiêutica faz parir o conceito por perguntas encadeadas. O saber é buscado em comum, não transmitido.',
    application: 'Boa chave para questões sobre educação e diálogo. Explicite que o reconhecimento da ignorância é condição do conhecimento, não modéstia retórica.',
  },
  'A Teoria das Ideias de Platão': {
    focus: 'Para Platão, o real em sentido pleno são as Ideias (Formas): imutáveis, universais e inteligíveis. As coisas sensíveis apenas participam delas, e por isso são múltiplas, mutáveis e conhecidas de modo imperfeito (dóxa, não epistéme).',
    application: 'Relacione sempre com a resposta a Heráclito e Parmênides e com a hierarquia do conhecimento. Erro comum: tratar as Ideias como conceitos mentais — em Platão elas têm existência própria.',
  },
  'O Mito da Caverna': {
    focus: 'A alegoria narra a saída da opinião para o conhecimento: sombras, objetos, mundo exterior e sol figuram graus de realidade; a subida é dolorosa e o retorno para libertar os outros é hostilizado.',
    application: 'A leitura política costuma valer mais do que a epistemológica: o filósofo tem dever de voltar, e a resistência dos prisioneiros explica a condenação de Sócrates. Traga a alegoria para mediação, ideologia e formação crítica.',
  },
  'A Alegoria da Linha Dividida e o Conhecimento': {
    focus: 'A linha divide o cognoscível em dóxa (imaginação e crença, sobre o sensível) e epistéme (raciocínio matemático e dialética, sobre o inteligível). Cada segmento tem objeto e grau de certeza próprios.',
    application: 'Use a linha para justificar por que a matemática é propedêutica e a dialética é o ápice. Em comparações, ela dá o vocabulário para distinguir opinião informada de conhecimento fundamentado.',
  },
  'Lógica e Metafísica Aristotélicas': {
    focus: 'Aristóteles traz a Forma para dentro da coisa: substância é composto de matéria e forma, e a mudança se explica por potência e ato e pelas quatro causas (material, formal, eficiente, final). O silogismo dá a forma válida do raciocínio.',
    application: 'Contraste explicitamente com Platão: em Aristóteles não há mundo separado. Nas discursivas, a causa final e a distinção potência/ato são as ferramentas mais cobradas.',
  },
  'A Ética a Nicômaco e a Doutrina do Meio-Termo': {
    focus: 'A finalidade da ação humana é a eudaimonia, realizada pelo exercício da virtude. A virtude ética é o justo meio entre excesso e falta, relativo a nós, determinado pela prudência (phrónesis) e consolidado como hábito.',
    application: 'Cuidado com "meio-termo = moderação medíocre": o meio é excelência e depende da situação. Compare com Kant para contrastar ética de caráter e ética do dever.',
  },
  'Política Aristotélica: o Homem como Animal Político': {
    focus: 'O ser humano é zoon politikon: só se realiza na pólis, porque apenas ele tem logos para discutir o justo e o injusto. A cidade é anterior ao indivíduo na ordem da finalidade, e a política é continuação da ética.',
    application: 'Útil contra leituras contratualistas: aqui a vida política é natural, não fruto de pacto. Confronte com Hobbes para mostrar duas antropologias opostas.',
  },
  'Patrística e Santo Agostinho': {
    focus: 'Agostinho cristianiza o platonismo: a verdade é iluminação divina no interior do homem, o mal não é substância mas privação do bem, e a liberdade do arbítrio compatibiliza-se com a graça.',
    application: 'A tese do mal como privação é a mais cobrada, porque resolve o problema teológico sem admitir um princípio mau. Ligue com a interioridade como fonte de verdade.',
  },
  'Escolástica e Santo Tomás de Aquino': {
    focus: 'Tomás articula fé e razão pela recepção de Aristóteles: há verdades acessíveis à razão natural e verdades reveladas, sem contradição entre elas. As cinco vias argumentam racionalmente pela existência de Deus.',
    application: 'Compare com Agostinho: Tomás dá autonomia relativa à razão e à filosofia. A lei natural, participação humana na lei eterna, é a ponte para questões de direito e ética.',
  },
  'A Relação entre Fé e Razão': {
    focus: 'O problema medieval é o estatuto de dois saberes que reivindicam verdade. As soluções variam da subordinação da razão à fé à harmonia tomista e à separação de domínios, cada uma com consequências para a autonomia do pensamento.',
    application: 'Tema clássico em questões que aproximam Idade Média e laicidade contemporânea. Evite anacronismo: o debate medieval não é sobre religião versus ciência no sentido moderno.',
  },
  'Descartes e o Método: a Dúvida Hiperbólica': {
    focus: 'A dúvida metódica é instrumento, não ceticismo: duvida-se de tudo o que possa ser falso (sentidos, sonho, gênio maligno) até encontrar o indubitável — o cogito, a existência do sujeito enquanto pensa.',
    application: 'Marque a diferença entre dúvida metódica e dúvida cética. O cogito funda o sujeito moderno e o critério de clareza e distinção; daí a fundamentação racionalista da ciência.',
  },
  'Racionalismo Continental: Espinosa e Leibniz': {
    focus: 'Espinosa reduz a realidade a uma única substância (Deus sive Natura), com necessidade imanente e liberdade como conhecimento adequado das causas. Leibniz pensa mônadas, harmonia preestabelecida e razão suficiente.',
    application: 'Use-os para mostrar que o racionalismo não é bloco homogêneo. Em Espinosa, a crítica ao livre-arbítrio e à superstição rende boas discursivas sobre autonomia.',
  },
  'Empirismo Britânico: Locke, Berkeley e Hume': {
    focus: 'Todo conhecimento provém da experiência: Locke nega ideias inatas e parte da mente como tábula rasa; Berkeley reduz o ser ao ser percebido; Hume distingue impressões de ideias e submete todo conceito à origem empírica.',
    application: 'Contraste com Descartes ponto a ponto (origem do conhecimento, papel da razão, certeza). Locke também sustenta a defesa dos direitos naturais em contratualismo.',
  },
  'A Crítica de Hume à Causalidade': {
    focus: 'Não observamos a conexão necessária entre causa e efeito, apenas conjunção constante, contiguidade e sucessão. A necessidade causal é hábito da mente projetado no mundo, o que limita a indução e a pretensão de certeza científica.',
    application: 'Ponto de virada da história da filosofia: é o que "desperta Kant do sono dogmático". Ao responder, separe o que é observado do que é inferido pelo costume.',
  },
  'Hobbes e o Estado de Natureza': {
    focus: 'No estado de natureza há igualdade de capacidades, escassez e desconfiança, produzindo guerra de todos contra todos. O pacto transfere o direito natural a um soberano cujo poder, absoluto e indivisível, garante a segurança.',
    application: 'Enfatize que o estado de natureza é hipótese lógica, não fato histórico. O contraste com Locke e Rousseau sobre a natureza humana e o alcance do poder é o eixo mais cobrado.',
  },
  'Locke e os Direitos Naturais': {
    focus: 'Há lei natural antes do Estado, garantindo vida, liberdade e propriedade, esta fundada no trabalho. O governo é fiduciário, limitado e divisível, e a violação sistemática dos direitos legitima a resistência.',
    application: 'Base do liberalismo político e das revoluções do século XVIII. Em prova, mostre a diferença decisiva em relação a Hobbes: aqui o poder é condicional e revogável.',
  },
  'Rousseau e a Vontade Geral': {
    focus: 'O homem nasce bom e a sociedade o corrompe; a desigualdade tem origem na propriedade privada. O contrato legítimo submete cada um à vontade geral — que visa o interesse comum e não se confunde com a soma das vontades particulares.',
    application: 'A distinção entre vontade geral e vontade de todos é a pegadinha recorrente. Ligue com soberania popular, democracia e crítica à representação.',
  },
  'O Ideal Iluminista de Razão e Progresso': {
    focus: 'O Iluminismo define-se pela saída da menoridade: coragem de usar o próprio entendimento, crítica à autoridade da tradição, defesa da tolerância e confiança na razão como instrumento de emancipação e progresso.',
    application: 'Boa articulação com História (revoluções) e com a crítica posterior (Escola de Frankfurt). Cobre-se com frequência a tensão entre universalismo declarado e exclusões concretas.',
  },
  'A Crítica da Razão Pura': {
    focus: 'Kant opera a revolução copernicana: o objeto se conforma às condições do sujeito. Conhecemos fenômenos, nunca a coisa em si; o conhecimento resulta da síntese entre intuições sensíveis e categorias do entendimento.',
    application: 'Responda sempre mostrando que é síntese entre racionalismo e empirismo, e que os juízos sintéticos a priori são o problema central. Fenômeno versus númeno é a distinção mais exigida.',
  },
  'A Ética Kantiana e o Imperativo Categórico': {
    focus: 'O valor moral está na intenção de agir por dever, não por inclinação ou consequência. O imperativo categórico exige universalizar a máxima e tratar a humanidade sempre também como fim, nunca apenas como meio.',
    application: 'Contraste com utilitarismo e com Aristóteles. Em bioética e direitos humanos, a fórmula da humanidade como fim é a mais produtiva; evite reduzir Kant a "seguir regras".',
  },
  'Hegel e a Dialética': {
    focus: 'A realidade e o pensamento se desenvolvem por contradição e superação: cada figura da consciência engendra sua negação e é conservada e ultrapassada na síntese (Aufhebung). O Espírito se realiza historicamente.',
    application: 'A dialética do senhor e do escravo rende análises de trabalho e reconhecimento. Deixe claro que a contradição é motor, não defeito — e que Marx a herda invertendo o ponto de partida.',
  },
  'O Materialismo Histórico': {
    focus: 'Não é a consciência que determina o ser social, mas o ser social que determina a consciência. A base material (forças produtivas e relações de produção) condiciona a superestrutura jurídica, política e ideológica.',
    application: 'Cuidado com determinismo mecânico: há determinação em última instância e reação da superestrutura. Explicite modo de produção antes de analisar qualquer sociedade concreta.',
  },
  'Alienação e Mais-Valia': {
    focus: 'No trabalho assalariado o trabalhador se aliena do produto, do ato de trabalhar, de sua espécie e dos outros. A mais-valia é o valor produzido além do necessário para repor a força de trabalho e apropriado pelo capitalista.',
    application: 'Separe a dimensão econômica (mais-valia, exploração medida) da dimensão filosófica (alienação, perda de sentido). Distinguir mais-valia absoluta de relativa costuma ser exigido.',
  },
  'A Luta de Classes na Filosofia Marxista': {
    focus: 'A história das sociedades é história da luta de classes: a posição na produção define interesses antagônicos, e o conflito é o motor da transformação histórica, não anomalia a ser corrigida.',
    application: 'Aplique a casos concretos com cuidado analítico — classe é relação, não faixa de renda. Boa articulação com Sociologia (Marx sociólogo) e com História do movimento operário.',
  },
  'Nietzsche e a Crítica aos Valores Morais': {
    focus: 'A genealogia mostra que os valores têm história e origem em relações de força: a moral do rebanho inverte a valoração aristocrática por ressentimento. A "morte de Deus" nomeia o colapso dos fundamentos absolutos.',
    application: 'Evite ler niilismo como pessimismo: há o niilismo passivo e a transvaloração afirmativa. Genealogia como método (perguntar quem valora e a serviço de quê) é o que mais rende em discursiva.',
  },
  'O Existencialismo de Sartre': {
    focus: 'A existência precede a essência: não há natureza humana dada, o ser humano é o que faz de si. Daí a liberdade radical, a responsabilidade por si e por todos, a angústia e a má-fé como fuga da liberdade.',
    application: 'Ligue liberdade a responsabilidade — é o par que a banca cobra. A má-fé (atribuir a determinantes externos o que é escolha) dá bons exemplos contemporâneos.',
  },
  'A Escola de Frankfurt e a Indústria Cultural': {
    focus: 'A razão iluminista converteu-se em razão instrumental, voltada a meios e ao domínio. A indústria cultural transforma cultura em mercadoria padronizada, produzindo pseudoindividualidade e conformismo.',
    application: 'Tema recorrente em questões sobre mídia, algoritmos e consumo. Não confunda indústria cultural com cultura de massa em geral: o alvo é a produção industrial padronizada e sua função de integração.',
  },
  'Foucault e as Relações de Poder': {
    focus: 'O poder não é propriedade concentrada no Estado, é relação capilar que atravessa instituições e produz saberes e sujeitos. O poder disciplinar fabrica corpos dóceis pela vigilância, exemplificada no panóptico; a biopolítica gere populações.',
    application: 'Chave forte para prisão, escola, hospital, saúde pública e vigilância digital. Marque que poder produz (saber, subjetividade), não apenas reprime.',
  },
  'Justiça e Direitos Humanos': {
    focus: 'Justiça distributiva discute que critério legitima a repartição de bens e ônus. Rawls propõe princípios escolhidos sob véu de ignorância, com prioridade das liberdades e diferença admitida só se beneficiar os menos favorecidos.',
    application: 'Boa base para redação e para questões sobre políticas afirmativas. Distinga igualdade formal de igualdade material e apresente a objeção comunitarista ao sujeito abstrato.',
  },
  'Ética Aplicada e Bioética': {
    focus: 'A bioética examina conflitos concretos (autonomia do paciente, início e fim da vida, pesquisa, alocação de recursos) com princípios de autonomia, beneficência, não maleficência e justiça, sem receita automática.',
    application: 'Tema de altíssima incidência para Medicina. Estruture: identifique os princípios em conflito, mostre as consequências de cada escolha e conclua justificando o critério adotado.',
  },
  'Filosofia Política Contemporânea': {
    focus: 'O debate atual cruza legitimidade democrática, pluralismo, reconhecimento e crítica: Arendt distingue poder de violência e valoriza a ação no espaço público; Habermas funda a legitimidade no agir comunicativo.',
    application: 'Arendt aparece muito em questões sobre totalitarismo, banalidade do mal e esfera pública. Use-a para separar poder (agir em concerto) de violência (instrumento).',
  },
};

const sociologyNotes: Record<string, SubjectTopicNote> = {
  'O Contexto Histórico do Surgimento da Sociologia': {
    focus: 'A Sociologia nasce da dupla revolução — Industrial e Francesa —, quando a ordem tradicional se desfaz e a sociedade se torna problema a explicar: urbanização, trabalho fabril, pauperismo e novas formas de conflito.',
    application: 'Situe autor e contexto antes de expor conceito: a pergunta de Durkheim pela coesão, a de Marx pela exploração e a de Weber pela racionalização respondem à mesma crise por caminhos distintos.',
  },
  'O que é o Fato Social': {
    focus: 'Para Durkheim, fato social é exterior ao indivíduo, coercitivo e geral na sociedade, e deve ser tratado como coisa — explicado por outros fatos sociais, não por motivações psicológicas individuais.',
    application: 'As três características precisam aparecer nomeadas e exemplificadas. O erro típico é explicar fenômeno social por escolha individual, exatamente o que o método recusa.',
  },
  'Sociologia e Senso Comum': {
    focus: 'O conhecimento sociológico difere do senso comum pela vigilância epistemológica: exige ruptura com noções prévias, método explícito, evidência e possibilidade de crítica pública dos resultados.',
    application: 'Sempre demandado em questões sobre "naturalização" de desigualdades. Mostre como a Sociologia desnaturaliza o que parece óbvio, sem tratar o senso comum como mera ignorância.',
  },
  'Solidariedade Mecânica e Solidariedade Orgânica': {
    focus: 'Na solidariedade mecânica a coesão vem da semelhança e de forte consciência coletiva, com direito repressivo; na orgânica vem da interdependência gerada pela divisão do trabalho, com direito restitutivo.',
    application: 'O par é comparativo por natureza: organize a resposta por critérios (base da coesão, tipo de consciência, tipo de direito, tipo de sociedade) em vez de descrever um e depois o outro.',
  },
  'Anomia e Coesão Social': {
    focus: 'Anomia é ausência ou enfraquecimento de normas capazes de regular condutas e expectativas, típica de transições rápidas. Em Durkheim explica variações de suicídio e a patologia da divisão do trabalho.',
    application: 'Não reduza anomia a "caos" ou "falta de lei": é desregulação normativa. Aplique a crises econômicas e a mudanças abruptas de status.',
  },
  'Educação e Socialização em Durkheim': {
    focus: 'A educação é socialização metódica das novas gerações: transmite a consciência coletiva e forma o ser social sobre o ser individual, garantindo homogeneidade suficiente e diversidade necessária à divisão do trabalho.',
    application: 'Confronte com abordagens críticas (Bourdieu, reprodução): Durkheim vê integração, a crítica vê legitimação de desigualdade. A comparação é o que a banca quer.',
  },
  'Modo de Produção e Estrutura Social': {
    focus: 'O modo de produção articula forças produtivas e relações de produção; a posição na propriedade dos meios de produção define as classes e organiza a estrutura social e suas contradições.',
    application: 'Defina modo de produção antes de aplicar. Em análise de caso, identifique quem detém os meios, como o excedente é apropriado e qual conflito daí decorre.',
  },
  'Ideologia e Alienação': {
    focus: 'Ideologia é o conjunto de representações que apresenta como natural e universal o interesse da classe dominante, invertendo a percepção das relações reais; a alienação é a separação entre o trabalhador e sua atividade e produto.',
    application: 'Distinga ideologia (dimensão simbólica, legitimação) de alienação (dimensão da experiência do trabalho). Ligue a mídia, publicidade e discurso meritocrático.',
  },
  'A Luta de Classes na Análise Sociológica': {
    focus: 'Classe é relação, não faixa de renda: define-se pela posição na produção. O conflito entre classes com interesses antagônicos é estruturante e explica mudança social, sindicalismo e políticas de Estado.',
    application: 'Cuidado com o uso jornalístico de "classe média". Em prova, sustente a análise em posição na produção e apropriação do excedente, e só depois use indicadores de renda.',
  },
  'Tipos de Ação Social': {
    focus: 'Weber parte da ação dotada de sentido orientada por outros e distingue quatro tipos ideais: racional com relação a fins, racional com relação a valores, afetiva e tradicional. Tipo ideal é instrumento de análise, não descrição.',
    application: 'Classificar exemplos é o formato mais comum; justifique pelo sentido que o agente atribui. Explicitar que o tipo ideal é construção metodológica costuma valer ponto.',
  },
  'Dominação e Poder em Weber': {
    focus: 'Dominação é a probabilidade de encontrar obediência, e se legitima de três formas puras: tradicional (costume), carismática (qualidades excepcionais do líder) e racional-legal (normas impessoais e burocracia).',
    application: 'Analise casos concretos como combinação de tipos, não como um puro. A burocracia como face da racionalização e a "jaula de ferro" são desdobramentos muito cobrados.',
  },
  'Ética Protestante e o Espírito do Capitalismo': {
    focus: 'Weber mostra afinidade eletiva entre a ascese intramundana protestante — vocação, disciplina, poupança, valorização do trabalho — e o espírito do capitalismo moderno, contrapondo-se à explicação exclusivamente econômica.',
    application: 'Afinidade eletiva não é causa única nem inversão de Marx: é crítica ao materialismo unilateral. Diga isso explicitamente; é o ponto mais confundido do tema.',
  },
  'Cultura e Etnocentrismo': {
    focus: 'Cultura é o conjunto aprendido e compartilhado de significados, práticas e instituições. Etnocentrismo é julgar outras culturas pelos valores da própria, tomando-a como medida universal.',
    application: 'Tema frequente em textos sobre povos indígenas e imigração. Mostre a diferença entre compreender uma prática em seu contexto e endossá-la — é o que separa relativismo metodológico de relativismo moral absoluto.',
  },
  'Identidade e Diferença': {
    focus: 'Identidades são construídas relacionalmente e marcadas por diferença, não são essências fixas. Processos de classificação social produzem pertencimento e também estigma e hierarquia.',
    application: 'Ligue a raça, gênero e território sem naturalizar categorias. Boa articulação com políticas de reconhecimento e com a crítica ao essencialismo.',
  },
  'Multiculturalismo e Relativismo Cultural': {
    focus: 'Relativismo cultural é postura metodológica: compreender práticas em seu próprio sistema de sentido. Multiculturalismo é projeto político de convivência e reconhecimento da diversidade, com versões liberais e críticas.',
    application: 'A tensão clássica é entre respeito à diferença e direitos humanos universais. Discursivas pedem que você sustente uma posição enfrentando essa tensão, não que a ignore.',
  },
  'Classes Sociais e Mobilidade Social': {
    focus: 'Estratificação é a distribuição desigual e estruturada de recursos e posições. Marx a lê por classe, Weber por classe, status e partido, e Bourdieu por capitais econômico, cultural e social.',
    application: 'Mobilidade pode ser vertical ou horizontal, intra ou intergeracional. Use a baixa mobilidade brasileira para criticar a explicação meritocrática do sucesso individual.',
  },
  'Desigualdade Racial no Brasil': {
    focus: 'A desigualdade racial é estrutural e tem raiz na escravidão e na ausência de reparação, expressando-se em renda, escolaridade, moradia, saúde e violência letal, e sustentada pelo mito da democracia racial.',
    application: 'Traga indicadores e mecanismos, não apenas denúncia. O mito da democracia racial como ideologia que dificulta o reconhecimento do racismo é o argumento mais exigido.',
  },
  'Desigualdade de Gênero': {
    focus: 'Gênero é construção social das diferenças sexuais e organiza divisão do trabalho, poder e sexualidade. A divisão sexual do trabalho e o trabalho de cuidado não remunerado explicam boa parte das desigualdades observadas.',
    application: 'Articule dados (rendimento, dupla jornada, violência) a mecanismos sociais. Distinguir sexo de gênero e recusar explicação biologizante costuma ser critério de correção.',
  },
  'Divisão Social do Trabalho': {
    focus: 'A divisão do trabalho especializa funções e aumenta a interdependência; em Durkheim gera solidariedade orgânica, em Marx separa trabalho intelectual e manual e é base da exploração e da alienação.',
    application: 'A mesma noção com duas avaliações opostas: apresentar as duas leituras e o critério de cada uma é a resposta completa.',
  },
  'Transformações no Mundo do Trabalho': {
    focus: 'A passagem do fordismo à acumulação flexível (toyotismo) muda produção rígida e em massa por produção enxuta, just in time, polivalência e terceirização, com efeitos sobre vínculo e organização coletiva.',
    application: 'Compare fordismo e toyotismo por critérios (organização da produção, estoque, qualificação, vínculo, sindicato). Ligue à reestruturação produtiva e ao desemprego estrutural.',
  },
  'Precarização e Uberização do Trabalho': {
    focus: 'A uberização estende a precarização: o trabalhador é gerido por algoritmos, arca com custos e riscos e é classificado como autônomo, perdendo direitos enquanto permanece subordinado ao controle da plataforma.',
    application: 'Tema de alta incidência atual. Mostre a contradição entre autonomia formal e controle real, e conecte a informalidade histórica do mercado de trabalho brasileiro.',
  },
  'Movimentos Sociais Clássicos e Contemporâneos': {
    focus: 'Movimentos sociais são ações coletivas organizadas em torno de identidade, adversário e projeto. Os clássicos centram-se no trabalho e na distribuição; os contemporâneos incorporam reconhecimento, identidade e pautas ambientais.',
    application: 'Não confunda movimento social com manifestação isolada: exige organização e continuidade. Redistribuição e reconhecimento é o par analítico que estrutura boas respostas.',
  },
  'Cidadania e Direitos': {
    focus: 'Marshall distingue direitos civis, políticos e sociais. No Brasil a sequência foi invertida e incompleta, com direitos sociais concedidos antes da consolidação dos políticos, produzindo a cidadania regulada.',
    application: 'Classificar direitos e apontar a especificidade brasileira é o formato mais comum. A Constituição de 1988 como marco de ampliação, com implementação desigual, fecha bem a resposta.',
  },
  'Democracia e Participação Política': {
    focus: 'Democracia representativa combina eleições, competição e garantias; a participativa acrescenta conselhos, orçamento participativo e consultas. Legitimidade depende de instituições e de acesso efetivo à deliberação.',
    application: 'Discuta limites da representação sem cair em antipolítica. Desinformação e plataformas digitais são recortes atuais que a banca gosta de cruzar com esfera pública.',
  },
  'Globalização Econômica e Cultural': {
    focus: 'A globalização intensifica fluxos de capital, mercadorias, informação e pessoas, integrando territórios de forma seletiva. No plano cultural produz simultaneamente homogeneização, hibridismo e reafirmação de identidades locais.',
    application: 'Evite a resposta de mão única. Mostre a seletividade dos fluxos (capital circula mais livremente que pessoas) e dê um exemplo de resposta local à padronização.',
  },
  'O Estado-Nação na Era Global': {
    focus: 'O Estado-nação não desaparece, mas tem sua soberania reconfigurada por organismos multilaterais, blocos, capital financeiro e corporações transnacionais, ao mesmo tempo que reforça controle de fronteiras e migração.',
    application: 'Recuse tanto "o Estado acabou" quanto "nada mudou". Sustente a tese de soberania reconfigurada com um caso — regulação de plataformas, política migratória ou tributação internacional.',
  },
  'A Sociedade da Informação': {
    focus: 'Informação e conhecimento tornam-se recursos produtivos centrais e a sociedade se organiza em redes. Isso redefine trabalho, sociabilidade e poder, e cria novas desigualdades de acesso, dado e atenção.',
    application: 'Vigilância, algoritmos e exclusão digital são os recortes mais cobrados. Ligue a Foucault (poder e saber) e à indústria cultural para dar densidade teórica à análise.',
  },
};

const philosophyTopics = summaryCurriculum.find((item) => item.subject === 'Filosofia')!.topics;
const sociologyTopics = summaryCurriculum.find((item) => item.subject === 'Sociologia')!.topics;

const argumentativeKeywords = ['conceito', 'autor', 'crítica', 'critica', 'relação', 'relacao', 'contexto', 'argumento'];

const philosophy = buildSubjectSummaries({
  subject: 'Filosofia', topics: philosophyTopics, notes: philosophyNotes,
  sourceFile: 'materiais brutos/Filosofia 1.pdf', idPrefix: 'fil',
  relationKeywords: argumentativeKeywords,
  examStrategy: (title) => `Leia o comando e a fonte antes de mobilizar teoria: identifique de que autor ou corrente ${title} trata, defina o conceito com precisão, sustente a tese com um argumento próprio e feche com a consequência filosófica. Citar nome de filósofo sem explicar o conceito não pontua; parafrasear o texto de apoio sem nomear a categoria, também não.`,
});
const sociology = buildSubjectSummaries({
  subject: 'Sociologia', topics: sociologyTopics, notes: sociologyNotes,
  sourceFile: 'materiais brutos/Apostila de Sociologia 1.pdf', idPrefix: 'soc',
  relationKeywords: argumentativeKeywords,
  examStrategy: (title) => `Extraia o dado da fonte (texto, gráfico ou charge), nomeie o conceito sociológico de ${title} e explicite o mecanismo social que liga um ao outro antes de concluir. A banca cobra conceito aplicado ao caso: opinião sem categoria e categoria sem o caso valem o mesmo — nada.`,
});

export const humanitiesInteractiveSummaries = [...philosophy.summaries, ...sociology.summaries];
export const humanitiesSummaryMaterials = [...philosophy.materials, ...sociology.materials];
