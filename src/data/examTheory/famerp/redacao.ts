// Redações-modelo para os cinco temas reais da Famerp (2022–2026), lidos nos
// cadernos de prova (ver src/data/vunespMedicineEssayGuide.ts).
//
// Os textos são autorais do CRIVO. Redações nota máxima publicadas são texto de
// estudantes, e o repositório é público: copiá-las seria publicar texto de
// terceiros, e a própria Vunesp zera redação "idêntica ou muito semelhante" a
// modelo. Por isso cada modelo serve para estudar decisões (tese, recorte,
// encadeamento), não para decorar.
//
// Cada modelo foi escrito contra a grade do edital (Tema, Estrutura, Língua,
// Coesão), em quatro parágrafos e cerca de 28 linhas manuscritas. Proposta de
// intervenção não é exigida pela Vunesp; as conclusões retomam a tese e apontam
// consequência.

import type { EssayModel } from '../types';

export const famerpEssayModels: EssayModel[] = [
  {
    year: 2026,
    theme: 'Indústria da moda: entre os benefícios do fast fashion e a responsabilidade socioambiental',
    shape: 'Dilema “entre X e Y”: a tese precisa dizer como os dois lados se relacionam, não só escolher um.',
    thesis: 'O barateamento da roupa é um benefício real, mas ele é pago por trabalhadores e pelo ambiente; sem que esse custo entre no preço, o benefício é ilusório.',
    recorteTraps: [
      'Falar só de consumismo em geral: o recorte é a indústria da moda e o modelo fast fashion.',
      'Ignorar os benefícios: o tema diz “entre”, e negar que existam enfraquece a tese no critério A.',
      'Discutir só o meio ambiente: “socioambiental” inclui as condições de trabalho.',
    ],
    paragraphs: [
      {
        role: 'Introdução',
        text: 'Em 2013, o desabamento do edifício Rana Plaza, em Bangladesh, matou mais de mil trabalhadores que costuravam roupas para grandes marcas ocidentais. A tragédia expôs o outro lado de um modelo que lança coleções a cada poucas semanas e as vende a preços baixos. O fast fashion de fato ampliou o acesso ao vestuário, mas esse benefício só existe porque parte do seu custo é transferida para quem produz e para o ambiente; enquanto isso não for corrigido, a moda barata permanecerá uma vantagem aparente.',
        doesWhat: [
          'Tema: “fast fashion”, “benefício” e “custo socioambiental” aparecem já na tese.',
          'Estrutura: o fato de abertura é explicado (o que ele expõe), não só citado.',
          'Tese de dilema: reconhece o benefício e diz por que ele é parcial.',
        ],
      },
      {
        role: 'Desenvolvimento 1',
        text: 'Em primeiro lugar, o preço reduzido depende da precarização do trabalho. Para entregar peças novas em prazos curtos e a custo mínimo, as marcas terceirizam a confecção para países com salários baixos e fiscalização frágil, onde jornadas exaustivas e prédios inseguros tornam-se parte do cálculo. No Brasil, operações de resgate de costureiros em condição análoga à escravidão em oficinas que abasteciam redes varejistas mostram que o problema não é distante. Assim, a economia do consumidor corresponde, em boa medida, a um custo humano que não aparece na etiqueta.',
        doesWhat: [
          'Estrutura: tópico frasal → mecanismo (prazo curto e custo mínimo → terceirização) → evidência → fechamento ligado à tese.',
          'Coesão: “Em primeiro lugar” e “Assim” marcam início e conclusão do parágrafo.',
        ],
      },
      {
        role: 'Desenvolvimento 2',
        text: 'Além disso, a lógica do descarte rápido produz um passivo ambiental crescente. Roupas feitas para durar poucas estações, em geral de fibras sintéticas derivadas de petróleo, viram resíduo em pouco tempo; segundo a Fundação Ellen MacArthur, menos de 1% do material usado em vestuário é reciclado em roupa nova. As montanhas de peças descartadas no deserto do Atacama, no Chile, tornam visível esse excedente. Desse modo, o modelo que torna a roupa acessível hoje transfere às próximas gerações o custo de lidar com o que foi descartado.',
        doesWhat: [
          'Estrutura: segunda razão, diferente da primeira (ambiental, depois da social).',
          'Repertório amarrado: o dado prova que o descarte não é compensado pela reciclagem.',
          'Coesão: “Além disso” e “Desse modo”; retomada por “esse excedente”.',
        ],
      },
      {
        role: 'Conclusão',
        text: 'Portanto, o fast fashion oferece um benefício verdadeiro, mas incompleto, porque se apoia em custos sociais e ambientais deslocados para longe do consumidor. Reconhecer esse deslocamento não significa negar o acesso à roupa, e sim exigir que a responsabilidade pela cadeia produtiva e pelo descarte acompanhe o lucro de quem a organiza. Só assim a moda acessível deixará de ser uma economia aparente.',
        doesWhat: [
          'Retoma a tese com outras palavras e decorre dos dois parágrafos.',
          'Não precisa de proposta de intervenção detalhada: a Vunesp não a exige.',
        ],
      },
    ],
    repertoire: [
      { item: 'Rana Plaza (Bangladesh, 2013)', proves: 'o custo humano da produção terceirizada a custo mínimo' },
      { item: 'Resgates de costureiros em condição análoga à escravidão no Brasil', proves: 'que a precarização não é um problema só de outros países' },
      { item: 'Fundação Ellen MacArthur: menos de 1% reciclado em roupa nova', proves: 'que a reciclagem não compensa o descarte' },
      { item: 'Roupas descartadas no deserto do Atacama', proves: 'o volume físico do excedente' },
    ],
  },
  {
    year: 2025,
    theme: 'Proibição de livros na escola: censura ou proteção da infância e da juventude?',
    shape: 'Pergunta com duas respostas: a tese responde qual delas, ou mostra quando uma vira a outra.',
    thesis: 'Retirar obras do acervo escolar é censura, porque protege menos do que a mediação do professor e priva o estudante da leitura crítica que de fato o protege.',
    recorteTraps: [
      'Discutir censura em geral (imprensa, internet): o recorte é a escola e o livro.',
      'Esquecer o outro lado: a preocupação com a idade do leitor é legítima e precisa ser respondida.',
      'Citar “o texto II” ou a coletânea diretamente: tira autonomia no critério B.',
    ],
    paragraphs: [
      {
        role: 'Introdução',
        text: 'Em 2024, o romance “O avesso da pele”, de Jeferson Tenório, vencedor do Prêmio Jabuti, foi recolhido de escolas públicas em alguns estados sob a alegação de conter linguagem inadequada aos alunos. O episódio reacendeu o debate sobre o papel da escola diante de obras consideradas impróprias. Embora a preocupação com a formação dos jovens seja legítima, a retirada de livros do acervo configura censura, pois substitui a mediação pedagógica, que de fato protege, por um silêncio que apenas empobrece a formação.',
        doesWhat: [
          'Tema: responde à pergunta (“configura censura”) e reconhece o lado contrário.',
          'Estrutura: o caso real contextualiza; a tese vem no fim da introdução.',
        ],
      },
      {
        role: 'Desenvolvimento 1',
        text: 'De fato, a proteção da infância e da juventude não exige o afastamento dos temas difíceis, mas o acompanhamento da leitura. Violência, racismo e sexualidade fazem parte da experiência dos estudantes, e a literatura permite elaborá-los com distância e reflexão. Quando o professor escolhe a obra adequada à faixa etária e conduz a discussão, o texto deixa de ser ameaça e se torna instrumento de compreensão. Proibir, ao contrário, não elimina o contato com esses assuntos; apenas o desloca para espaços sem nenhuma mediação.',
        doesWhat: [
          'Estrutura: responde ao argumento contrário (proteção) por dentro do próprio parágrafo.',
          'Explicação de mecanismo: por que a mediação protege mais do que a proibição.',
        ],
      },
      {
        role: 'Desenvolvimento 2',
        text: 'Ademais, a proibição transforma a escola, que deveria formar leitores autônomos, em instância de controle sobre o que pode ser pensado. Paulo Freire defendia a educação como prática da liberdade, na qual o estudante aprende a interpretar o mundo, e não a aceitar interpretações prontas. Ao decidir de antemão quais livros são perigosos, gestores e grupos de pressão retiram dos jovens justamente o exercício crítico que os tornaria capazes de reconhecer conteúdos nocivos. Assim, a medida apresentada como proteção acaba por fragilizar aquilo que pretende defender.',
        doesWhat: [
          'Repertório amarrado: Freire sustenta a ideia de autonomia, não decora o texto.',
          'Coesão: “Ademais”, “Ao decidir”, “Assim”; retomada por “a medida”.',
        ],
      },
      {
        role: 'Conclusão',
        text: 'Logo, a retirada de livros das escolas não protege a infância e a juventude: priva-as do acompanhamento que tornaria a leitura segura e da autonomia que a leitura constrói. Cabe à escola selecionar obras pela adequação à idade e discuti-las com responsabilidade, e não apagá-las do acervo, sob pena de confundir cuidado com censura.',
        doesWhat: [
          'Retoma a pergunta do tema e responde com a tese.',
          'Fecha com consequência (“confundir cuidado com censura”).',
        ],
      },
    ],
    repertoire: [
      { item: '“O avesso da pele”, de Jeferson Tenório, recolhido de escolas em 2024', proves: 'que o debate é concreto e recente no Brasil' },
      { item: 'Paulo Freire, educação como prática da liberdade', proves: 'que a função da escola é formar leitor autônomo' },
    ],
  },
  {
    year: 2024,
    theme: 'Racismo ambiental no Brasil: é possível proteger as populações mais vulneráveis?',
    shape: 'Pergunta de viabilidade: responda “é possível, desde que…” ou “não, enquanto…”, com a condição explícita.',
    thesis: 'É possível proteger essas populações, mas só se o Estado reconhecer que o risco ambiental é distribuído pela cor e pela renda e investir primeiro onde ele se concentra.',
    recorteTraps: [
      'Tratar só de meio ambiente: sem o vínculo com raça e renda, o texto perde o conceito de racismo ambiental.',
      'Não responder à pergunta “é possível?”.',
      'Falar de racismo em geral sem a dimensão ambiental.',
    ],
    paragraphs: [
      {
        role: 'Introdução',
        text: 'A expressão “racismo ambiental”, cunhada nos Estados Unidos na década de 1980, designa a concentração de danos ambientais sobre populações negras e pobres. No Brasil, as enchentes, os deslizamentos e a falta de saneamento atingem com mais força as periferias e as comunidades tradicionais, majoritariamente negras e indígenas. É possível proteger esses grupos, mas apenas se o poder público reconhecer que o risco não se distribui ao acaso e direcionar o investimento para onde ele se concentra.',
        doesWhat: [
          'Tema: define o conceito e responde à pergunta com uma condição.',
          'Estrutura: a definição não é decorativa, ela introduz o recorte “distribuição do risco”.',
        ],
      },
      {
        role: 'Desenvolvimento 1',
        text: 'Em primeiro lugar, a desigualdade ambiental decorre da forma como as cidades brasileiras foram ocupadas. Sem acesso à terra regularizada, a população pobre, em grande parte descendente de escravizados, instalou-se em encostas, várzeas e margens de rios, áreas desvalorizadas justamente por serem perigosas. Por isso, quando chuvas extremas atingem uma cidade, como nas enchentes do Rio Grande do Sul em 2024, os bairros mais afetados tendem a ser os que menos receberam obras de drenagem e contenção. O dano, portanto, não é natural: segue uma geografia social construída historicamente.',
        doesWhat: [
          'Explicação de causa histórica (ocupação do território) que liga raça, renda e risco.',
          'Coesão: “Em primeiro lugar”, “Por isso”, “portanto”.',
        ],
      },
      {
        role: 'Desenvolvimento 2',
        text: 'Além disso, a omissão em serviços básicos agrava a exposição dessas populações. Dezenas de milhões de brasileiros ainda vivem sem coleta de esgoto, o que os expõe a doenças de veiculação hídrica e compromete a saúde de crianças. A Constituição garante a todos o direito a um meio ambiente ecologicamente equilibrado, e o novo Marco Legal do Saneamento fixou a universalização até 2033; contudo, metas gerais tendem a contemplar primeiro as áreas mais rentáveis. Sem critérios que priorizem os territórios mais vulneráveis, a proteção prometida continuará chegando por último a quem mais precisa dela.',
        doesWhat: [
          'Responde ao “é possível?”: os instrumentos existem; falta prioridade.',
          'Repertório amarrado: lei e meta usadas para mostrar a distância entre direito e prática.',
        ],
      },
      {
        role: 'Conclusão',
        text: 'Desse modo, proteger as populações mais vulneráveis ao racismo ambiental é viável, porque as leis e as metas já existem. O que falta é reconhecer que o risco tem endereço, cor e renda, e inverter a ordem do investimento público. Enquanto as obras chegarem primeiro aos bairros mais valorizados, a resposta à pergunta continuará sendo negativa na prática.',
        doesWhat: [
          'Retoma a pergunta e a condição da tese.',
          'Fecha com consequência, sem proposta obrigatória.',
        ],
      },
    ],
    repertoire: [
      { item: 'Origem do termo “racismo ambiental” (EUA, anos 1980)', proves: 'o conceito exato do recorte' },
      { item: 'Enchentes do Rio Grande do Sul (2024)', proves: 'que o dano se concentra onde faltou infraestrutura' },
      { item: 'Constituição, art. 225, e Marco Legal do Saneamento (meta de 2033)', proves: 'que o problema é de prioridade, não de falta de lei' },
    ],
  },
  {
    year: 2023,
    theme: 'Sobrepeso e obesidade infantil: entre as responsabilidades da família e do Estado',
    shape: 'Dilema “entre X e Y”: a tese reparte a responsabilidade e diz por quê.',
    thesis: 'A família educa o hábito, mas não controla o ambiente alimentar; por isso a responsabilidade principal de mudar esse ambiente é do Estado.',
    recorteTraps: [
      'Falar de obesidade em adultos: o recorte é infantil.',
      'Atribuir tudo à família ou tudo ao Estado sem explicar a divisão.',
      'Discutir estética ou padrão de beleza em vez de saúde.',
    ],
    paragraphs: [
      {
        role: 'Introdução',
        text: 'O aumento do sobrepeso e da obesidade entre crianças é tratado pela Organização Mundial da Saúde como um dos grandes desafios de saúde pública do século, por antecipar doenças antes restritas aos adultos, como diabetes tipo 2 e hipertensão. Diante desse quadro, costuma-se atribuir o problema às escolhas da família. Embora ela tenha papel decisivo na formação dos hábitos, a responsabilidade principal é do Estado, pois apenas ele pode alterar o ambiente alimentar em que essas escolhas são feitas.',
        doesWhat: [
          'Tema: os dois polos do dilema aparecem, e a tese reparte a responsabilidade.',
          'Estrutura: o dado de saúde justifica a importância do tema.',
        ],
      },
      {
        role: 'Desenvolvimento 1',
        text: 'Com efeito, a família influencia o que a criança come, mas decide dentro de limites que não estabelece. Alimentos ultraprocessados são baratos, práticos e amplamente anunciados, enquanto frutas e verduras frescas custam mais e exigem tempo de preparo, recurso escasso para pais com jornadas longas. O Guia Alimentar para a População Brasileira recomenda evitar esses produtos, mas a recomendação perde força quando a opção saudável é a mais cara e a menos acessível. Culpar apenas os pais, assim, ignora que a escolha é condicionada por renda, tempo e oferta.',
        doesWhat: [
          'Reconhece o papel da família e mostra seu limite (mecanismo: preço, tempo, oferta).',
          'Coesão: “Com efeito”, “mas”, “assim”.',
        ],
      },
      {
        role: 'Desenvolvimento 2',
        text: 'Por outro lado, o Estado dispõe de instrumentos capazes de modificar esse ambiente. O Programa Nacional de Alimentação Escolar, por exemplo, oferece refeições a milhões de estudantes e exige a compra de parte dos alimentos da agricultura familiar, o que leva comida fresca a crianças que talvez não a tivessem em casa. Da mesma forma, restringir a publicidade de ultraprocessados dirigida ao público infantil e tornar mais claros os rótulos reduz a pressão sobre escolhas que a criança ainda não tem maturidade para fazer. Essas medidas alcançam todas as famílias ao mesmo tempo, algo que nenhuma decisão doméstica isolada consegue.',
        doesWhat: [
          'Segunda razão: o Estado tem alcance coletivo que a família não tem.',
          'Repertório amarrado: o PNAE prova que a política pública muda o prato da criança.',
        ],
      },
      {
        role: 'Conclusão',
        text: 'Portanto, a obesidade infantil exige o envolvimento da família, mas depende sobretudo da ação do Estado, porque é ele quem define preço, oferta e propaganda dos alimentos. Sem um ambiente que torne a escolha saudável também a mais fácil, a orientação dada em casa continuará competindo, em desvantagem, com a lógica do mercado.',
        doesWhat: [
          'Retoma a divisão de responsabilidades da tese.',
          'Fecha com consequência.',
        ],
      },
    ],
    repertoire: [
      { item: 'OMS: obesidade infantil como desafio de saúde pública', proves: 'a gravidade e a antecipação de doenças crônicas' },
      { item: 'Guia Alimentar para a População Brasileira (2014)', proves: 'que a orientação existe, mas depende de acesso' },
      { item: 'Programa Nacional de Alimentação Escolar (PNAE)', proves: 'que a política pública altera o ambiente alimentar' },
    ],
  },
  {
    year: 2022,
    theme: 'Os impactos da inteligência artificial nas relações de trabalho contemporâneas',
    shape: 'Tema-assunto (impactos): a tese precisa escolher quais impactos e avaliá-los, não listar.',
    thesis: 'A IA não elimina o trabalho, mas o reorganiza de forma desigual: valoriza quem tem qualificação e intensifica o controle sobre quem não tem.',
    recorteTraps: [
      'Falar de IA em geral (medicina, arte, ficção científica): o recorte é relações de trabalho.',
      'Listar vantagens e desvantagens sem tese.',
      'Prever o futuro sem base: o tema diz “contemporâneas”.',
    ],
    paragraphs: [
      {
        role: 'Introdução',
        text: 'No início do século XIX, os luditas destruíam teares mecânicos na Inglaterra por temerem perder seus empregos para as máquinas. Dois séculos depois, a inteligência artificial desperta receio semelhante, agora sobre tarefas cognitivas antes consideradas exclusivamente humanas. Contudo, seu impacto mais imediato não é o fim do trabalho, e sim sua reorganização desigual: a tecnologia valoriza os profissionais qualificados e amplia o controle sobre os demais.',
        doesWhat: [
          'Tema: o recorte “relações de trabalho” está na tese.',
          'Estrutura: o paralelo histórico é usado para corrigir uma ideia comum, não como enfeite.',
        ],
      },
      {
        role: 'Desenvolvimento 1',
        text: 'Em primeiro lugar, a automação de tarefas repetitivas aprofunda a distância entre trabalhadores com e sem qualificação. Funções de atendimento, triagem de documentos e análise de dados simples são as primeiras a ser absorvidas por sistemas automatizados, enquanto cresce a demanda por quem sabe desenvolver, supervisionar e interpretar essas ferramentas. Em um país com grande desigualdade educacional como o Brasil, isso significa que os ganhos de produtividade tendem a se concentrar nos mais escolarizados, ao passo que os demais enfrentam a substituição sem acesso à requalificação.',
        doesWhat: [
          'Mecanismo: que tarefas são substituídas e por que isso aumenta a desigualdade.',
          'Contextualiza no Brasil, sem dado inventado.',
        ],
      },
      {
        role: 'Desenvolvimento 2',
        text: 'Além disso, a IA transforma a própria forma de gerir o trabalho. Em aplicativos de transporte e entrega, algoritmos distribuem tarefas, definem preços e avaliam o desempenho, sem que o trabalhador conheça os critérios ou tenha a quem recorrer. Esse modelo, frequentemente chamado de uberização, apresenta-se como autonomia, mas combina instabilidade de renda com vigilância constante. Como observa o filósofo Byung-Chul Han, o sujeito que se acredita livre passa a explorar a si mesmo, e a gestão algorítmica intensifica essa lógica ao converter cada minuto em métrica.',
        doesWhat: [
          'Segunda razão, distinta: não é a substituição, é o controle.',
          'Repertório amarrado: Han explica por que a “autonomia” é aparente.',
        ],
      },
      {
        role: 'Conclusão',
        text: 'Desse modo, os impactos da inteligência artificial sobre o trabalho contemporâneo dependem menos da tecnologia em si do que de quem tem acesso a ela e de como ela é empregada. Sem formação ampla e regras transparentes para a gestão por algoritmos, a ferramenta capaz de reduzir esforço humano tende a ampliar a desigualdade e a precarização.',
        doesWhat: [
          'Retoma os dois impactos e a tese.',
          'Fecha com consequência condicionada.',
        ],
      },
    ],
    repertoire: [
      { item: 'Luditas (Inglaterra, início do século XIX)', proves: 'que o medo da substituição é antigo e nem sempre se confirma como fim do trabalho' },
      { item: 'Uberização e gestão por algoritmo', proves: 'a mudança na relação de trabalho, não só na quantidade de vagas' },
      { item: 'Byung-Chul Han, “Sociedade do cansaço”', proves: 'que a autonomia aparente pode intensificar a exploração' },
    ],
  },
];
