/**
 * Capítulos de Literatura cujo objeto não é um autor único, mas uma estética,
 * um movimento, um período ou um campo (artes plásticas, teatro, canção) —
 * unidades que só existem através de mais de um traço. O padrão é o de
 * `geographyContextLab.ts` e `historyPhaseLab.ts`: três facetas comparáveis
 * por capítulo, um só componente genérico desenha a cena.
 *
 * A diferença para os dois arquivos citados é o que os três casos comparam.
 * Lá, cada caso é um recorte real diferente (três revoluções, três recortes
 * territoriais). Aqui, os três casos são três FACETAS do mesmo capítulo —
 * contexto, procedimento, autor/obra — porque uma estética não se define por
 * comparação com outra estética dentro do capítulo, e sim pela tensão entre
 * de onde ela vem, como ela se escreve e quem a escreveu. Foi a própria Ana
 * Júlia quem pediu esse critério para esta rodada de Literatura: instrumento
 * genérico onde não há um objeto manipulável óbvio, contanto que nenhum fato,
 * data, título ou nome seja inventado.
 *
 * Cada caso vem direto das seções já revisadas de `deepSummaryContent.json`
 * (rev 2) do capítulo correspondente — os três primeiros dados de cada seção
 * (fora "Pegadinhas frequentes" e "Pratique e confira", que já têm lugar
 * próprio no capítulo). Nenhuma data, título de obra ou nome de autor aqui é
 * inventado; o texto só reorganiza o que a seção já afirma.
 */
export type LiteraryTraitId =
  | 'art-languages'
  | 'renaissance-camoes'
  | 'first-records'
  | 'baroque'
  | 'neoclassic'
  | 'romantic-poetry'
  | 'narrative-elements'
  | 'realism'
  | 'naturalism'
  | 'eca-de-queiros'
  | 'parnassianism'
  | 'symbolism'
  | 'pre-modernism'
  | 'modern-art-week'
  | 'modernism-first-generation'
  | 'modernism-second-generation'
  | 'concrete-poetry'
  | 'prose-1960-1980'
  | 'lusophone-contemporary'
  | 'brazilian-visual-arts'
  | 'brazilian-theater'
  | 'popular-songbook';

export interface LiteraryTraitCase {
  label: string;
  note: string;
  observation: string;
  conclusion: string;
}

export interface LiteraryTraitConfig {
  chapterId: string;
  title: string;
  question: string;
  relation: string;
  cases: readonly [LiteraryTraitCase, LiteraryTraitCase, LiteraryTraitCase];
  caution: string;
}

export const LITERARY_TRAITS: Record<LiteraryTraitId, LiteraryTraitConfig> = {
  'art-languages': {
    chapterId: 'summary-literatura-a-arte-e-suas-linguagens',
    title: 'O que faz uma obra ser arte',
    question: 'O que muda entre o conceito, a linguagem e a função de uma obra de arte?',
    relation: 'materialidade da linguagem + contexto de produção + função pretendida → leitura não anacrônica da arte',
    cases: [
      { label: 'Conceito', note: 'o que é arte', observation: 'Arte organiza materiais e linguagens para produzir experiência estética e sentido; não se define por beleza nem por utilidade.', conclusion: 'Critérios de arte variam historicamente: o que uma época recusa, outra consagra.' },
      { label: 'Linguagens', note: 'materialidade própria', observation: 'Cada linguagem tem materialidade própria: a literatura trabalha com a palavra; as artes visuais, com forma, cor e espaço; a música, com som e tempo.', conclusion: 'Muitas obras cruzam linguagens, combinando palavra, imagem, som e corpo.' },
      { label: 'Função social', note: 'informa e critica', observation: 'A arte informa, emociona, questiona, celebra e também critica; pode servir ao poder ou contestá-lo.', conclusion: 'Julgar obra antiga por valores atuais é leitura anacrônica — o contexto de produção importa.' },
    ],
    caution: 'Panorama conceitual: não cobre todas as linguagens artísticas nem substitui a análise de uma obra específica.',
  },
  'renaissance-camoes': {
    chapterId: 'summary-literatura-renascimento-e-camoes',
    title: 'Classicismo e a lírica de Camões',
    question: 'O que a lírica e a epopeia de Camões têm em comum com o ideal clássico do Renascimento?',
    relation: 'classicismo + lírica de antíteses + epopeia com voz crítica → Renascimento português',
    cases: [
      { label: 'Classicismo', note: 'retomada clássica', observation: 'O Renascimento retoma valores da Antiguidade clássica: equilíbrio, harmonia, racionalidade e antropocentrismo, com difusão do soneto decassílabo.', conclusion: 'A poesia passa a explorar o conflito entre razão e sentimento, entre ideal e experiência.' },
      { label: 'Lírica camoniana', note: 'antíteses e paradoxos', observation: 'Camões trabalha o amor platônico e o sensual, a transitoriedade e o desconcerto do mundo, com definições por antíteses, como em "Amor é fogo que arde sem se ver".', conclusion: 'O procedimento por antíteses e paradoxos é a marca central de sua lírica.' },
      { label: 'Os Lusíadas', note: 'epopeia com crítica', observation: 'A epopeia narra a viagem de Vasco da Gama; o episódio do Velho do Restelo questiona a ambição e o custo humano das navegações dentro do próprio poema.', conclusion: 'Não é exaltação sem contradição: a epopeia contém sua própria crítica.' },
    ],
    caution: 'Leitura de síntese: Os Lusíadas e a lírica camoniana têm procedimentos distintos, resumidos aqui lado a lado.',
  },
  'first-records': {
    chapterId: 'summary-literatura-brasil-primeiros-registros',
    title: 'Os primeiros registros sobre o Brasil',
    question: 'Por que os primeiros textos sobre o Brasil não são literatura no sentido moderno?',
    relation: 'relato de viajante + olhar europeu + catequese → literatura de informação colonial',
    cases: [
      { label: 'Literatura de informação', note: 'Carta de Caminha, 1500', observation: 'Os primeiros textos são relatos de viajantes, com a Carta de Pero Vaz de Caminha (1500) como marco — documento oficial, não literatura no sentido moderno.', conclusion: 'Registram, do ponto de vista europeu, paisagem, povos e possibilidades de exploração.' },
      { label: 'Olhar do colonizador', note: 'categorias europeias', observation: 'Os povos originários são descritos a partir de categorias europeias, entre o encantamento com a inocência e o julgamento da diferença como falta.', conclusion: 'Não é descrição neutra: revela a intenção prática dos relatos, como a catequese.' },
      { label: 'Literatura jesuítica', note: 'Anchieta', observation: 'José de Anchieta escreveu poesia, teatro e cartas catequéticas em português, latim, espanhol e tupi, com autos que adaptam elementos locais à doutrina.', conclusion: 'Constitui o primeiro teatro produzido no território, com função pedagógica e religiosa.' },
    ],
    caution: 'Recorte de gênese: cobre só os primeiros registros; a literatura colonial segue nos capítulos do Barroco e do Neoclassicismo.',
  },
  baroque: {
    chapterId: 'summary-literatura-a-estetica-barroca',
    title: 'Cultismo, conceptismo e o conflito barroco',
    question: 'O que separa cultismo de conceptismo, e como os dois aparecem no Barroco brasileiro?',
    relation: 'conflito barroco + cultismo/conceptismo + autores no Brasil → estética do contraste',
    cases: [
      { label: 'Contexto e tensão', note: 'Contrarreforma', observation: 'O Barroco surge na Contrarreforma e na crise entre valores medievais e renascentistas, com linguagem carregada de antíteses, paradoxos e hipérboles.', conclusion: 'Sua marca é o conflito: fé e razão, corpo e alma, pecado e perdão, efêmero e eterno.' },
      { label: 'Cultismo e conceptismo', note: 'palavras x ideias', observation: 'O cultismo (gongorismo) investe no jogo de palavras e inversões sintáticas; o conceptismo (quevedismo) organiza o texto pelo jogo de ideias, típico dos sermões.', conclusion: 'Confundir os dois é o erro mais cobrado: jogo de palavras num, raciocínio argumentativo no outro.' },
      { label: 'No Brasil', note: 'Gregório e Vieira', observation: 'Gregório de Matos produziu poesia lírica, religiosa e satírica; Padre Antônio Vieira dominou o conceptismo nos sermões, como no Sermão de Santo Antônio aos Peixes.', conclusion: 'Gregório não é só satírico: sua obra religiosa e lírica também é central.' },
    ],
    caution: 'Síntese de escola: não abrange toda a produção barroca ibérica, só o recorte usado no vestibular.',
  },
  neoclassic: {
    chapterId: 'summary-literatura-a-estetica-neoclassica',
    title: 'Arcadismo e a convenção pastoril',
    question: 'Por que o campo árcade é convenção, e como isso se liga à Inconfidência Mineira?',
    relation: 'reação ao Barroco + convenção pastoril + poetas da Inconfidência → Arcadismo brasileiro',
    cases: [
      { label: 'Arcadismo', note: 'simplicidade clássica', observation: 'O Neoclassicismo (Arcadismo) reage ao exagero barroco com simplicidade e equilíbrio, sob os lemas inutilia truncat, fugere urbem, locus amoenus, carpe diem e aurea mediocritas.', conclusion: 'Cortar o supérfluo é resposta direta ao acúmulo de recursos do Barroco.' },
      { label: 'Convenções pastoris', note: 'campo idealizado', observation: 'Poetas adotam pseudônimos pastoris e um cenário bucólico idealizado — convenção literária, não descrição da vida real do campo.', conclusion: 'Ler o bucolismo árcade como retrato realista do campo é o erro central da escola.' },
      { label: 'No Brasil', note: 'Gonzaga e a Inconfidência', observation: 'Cláudio Manuel da Costa, Tomás Antônio Gonzaga e Basílio da Gama são os nomes centrais; Marília de Dirceu articula convenção pastoril com a prisão do autor.', conclusion: 'Vários árcades participaram da Inconfidência Mineira, ligando literatura e política.' },
    ],
    caution: 'Síntese de escola: cada lema latino tem nuances que a apostila detalha melhor do que este resumo visual.',
  },
  'romantic-poetry': {
    chapterId: 'summary-literatura-a-estetica-romantica-poesia',
    title: 'As três gerações da poesia romântica',
    question: 'O que muda entre a primeira, a segunda e a terceira geração romântica?',
    relation: 'geração + traço formal + função do texto → poesia romântica brasileira',
    cases: [
      { label: 'Três gerações', note: 'indianismo a denúncia', observation: 'A primeira geração, indianista, tem Gonçalves Dias; a segunda, ultrarromântica, tem Álvares de Azevedo; a terceira, condoreira, tem Castro Alves.', conclusion: 'Atribuir a Gonçalves Dias o pessimismo da segunda geração é confusão frequente.' },
      { label: 'Traços gerais', note: 'subjetividade e nação', observation: 'O Romantismo valoriza subjetividade, emoção, liberdade formal, idealização do amor e nacionalismo, opondo-se à contenção clássica.', conclusion: 'O eu lírico é o centro, com forte presença da saudade, do sonho e da morte.' },
      { label: 'Idealização e denúncia', note: 'de herói a Navio Negreiro', observation: 'A trajetória vai do índio-herói fundador ao mal do século da segunda geração e à poesia de intervenção de Castro Alves, como em O Navio Negreiro.', conclusion: 'O indianismo é construção idealizada com moldes europeus, não retrato dos povos indígenas.' },
    ],
    caution: 'Síntese por geração: cada poeta tem obra própria além do traço aqui resumido.',
  },
  'narrative-elements': {
    chapterId: 'summary-literatura-elementos-da-narrativa',
    title: 'Enredo, personagem e narrador',
    question: 'Como enredo, personagem e narrador se articulam para contar uma história?',
    relation: 'conflito + personagem + narrador → elementos que compõem toda narrativa',
    cases: [
      { label: 'Enredo e conflito', note: 'estrutura tradicional', observation: 'O enredo é a sequência de acontecimentos organizada em torno de um conflito, com situação inicial, desenvolvimento, clímax e desfecho.', conclusion: 'Textos modernos rompem essa ordem, com finais abertos ou circularidade.' },
      { label: 'Personagens', note: 'planas ou redondas', observation: 'Personagens podem ser planas, com poucos traços fixos, ou redondas, complexas e capazes de mudar; a caracterização pode ser direta ou indireta.', conclusion: 'Chamar toda personagem secundária de plana confunde dois critérios distintos.' },
      { label: 'Tempo, espaço, narrador', note: 'quem conta e como', observation: 'O tempo pode ser cronológico ou psicológico; o narrador, distinto do autor, pode ser de primeira ou terceira pessoa, observador ou onisciente.', conclusion: 'A escolha do narrador determina a que o leitor tem acesso na história.' },
    ],
    caution: 'Vocabulário de análise: os exemplos aqui são ilustrativos, não a leitura de uma obra específica.',
  },
  realism: {
    chapterId: 'summary-literatura-a-estetica-realista',
    title: 'Observação, ironia e determinismo',
    question: 'O que distingue o Realismo do Naturalismo, apesar de serem contemporâneos?',
    relation: 'observação + ironia crítica + personagem que delibera → estética realista',
    cases: [
      { label: 'Contexto e princípios', note: 'positivismo e crítica', observation: 'O Realismo surge na segunda metade do século XIX, associado ao positivismo e à crítica social, opondo-se à idealização romântica.', conclusion: 'Privilegia observação, análise psicológica e crítica às instituições, sobretudo casamento e Igreja.' },
      { label: 'Procedimentos', note: 'ironia e objetividade', observation: 'A narrativa trabalha com objetividade aparente, ironia, digressão e detalhamento de ambientes; o adultério burguês é tema recorrente.', conclusion: 'A objetividade não é ausência de posição: a ironia é justamente a marca crítica do narrador.' },
      { label: 'Realismo x Naturalismo', note: 'psicologia x determinismo', observation: 'O Realismo enfatiza análise psicológica e social, com personagens que deliberam; o Naturalismo aplica determinismo de meio, raça e momento.', conclusion: 'Tratar as duas escolas como sinônimos é o erro mais frequente da prova.' },
    ],
    caution: 'Síntese de escola: a obra machadiana, principal exemplo brasileiro, tem instrumento próprio.',
  },
  naturalism: {
    chapterId: 'summary-literatura-naturalismo',
    title: 'Determinismo e o cortiço-personagem',
    question: 'Por que O Cortiço é lido como aplicação do determinismo naturalista?',
    relation: 'tese determinista + descrição minuciosa + crítica histórica → romance naturalista',
    cases: [
      { label: 'Determinismo', note: 'meio, raça, momento', observation: 'O Naturalismo aplica o modelo científico do século XIX: personagens seriam determinadas por meio, raça e momento histórico, como em um experimento.', conclusion: 'A conduta humana é explicada por instintos, hereditariedade e ambiente.' },
      { label: 'Procedimentos', note: 'O Cortiço', observation: 'Predominam a descrição minuciosa e a linguagem crua; em O Cortiço, de Aluísio Azevedo, o próprio cortiço ganha vida e determina o destino de quem nele vive.', conclusion: 'O ambiente funciona como personagem coletiva, não só cenário.' },
      { label: 'Limites e crítica', note: 'teorias da época', observation: 'O modelo incorporou teorias racistas de sua época, e muitas obras reproduzem estereótipos de raça, gênero e sexualidade lidos hoje criticamente.', conclusion: 'Reconhecer esse traço é leitura histórica, sem anular o valor documental dos romances.' },
    ],
    caution: 'Síntese de escola: a leitura crítica das teses raciais da época é parte obrigatória da análise, não detalhe.',
  },
  'eca-de-queiros': {
    chapterId: 'summary-literatura-realismo-portugues-eca-de-queiros',
    title: 'Eça de Queirós e a Geração de 70',
    question: 'Como a crítica de Eça de Queirós alcança toda a sociedade portuguesa, não só o clero?',
    relation: 'Geração de 70 + obra-diagnóstico + ironia sem exceção → Realismo português',
    cases: [
      { label: 'Geração de 70', note: 'Conferências do Casino', observation: 'Eça integra a Geração de 70, grupo que promoveu as Conferências do Casino Lisbonense e propôs renovar a cultura portuguesa, criticando o atraso e o clericalismo.', conclusion: 'Sua obra combina crítica social ácida com ironia refinada.' },
      { label: 'Obras centrais', note: 'Amaro, Basílio, Maias', observation: 'O Crime do Padre Amaro critica o celibato clerical; O Primo Basílio trata do adultério burguês; Os Maias acompanha três gerações e diagnostica a decadência da elite.', conclusion: 'Confundir as obras entre si quanto a enredo e tema é deslize frequente.' },
      { label: 'Procedimentos', note: 'ironia sem exceção', observation: 'Eça usa ironia, descrição de interiores como índice de caráter e narrador de distância crítica, atingindo clero, aristocracia, burguesia e imprensa.', conclusion: 'A crítica não poupa nem a intelectualidade que pretendia reformar o país.' },
    ],
    caution: 'Recorte de um autor: o Realismo português tem outros nomes que este capítulo não cobre.',
  },
  parnassianism: {
    chapterId: 'summary-literatura-parnasianismo',
    title: 'A arte pela arte e o ourives da palavra',
    question: 'Por que os modernistas de 1922 escolheram justamente o Parnasianismo como alvo?',
    relation: 'arte pela arte + rigor formal + prestígio consagrado → Parnasianismo alvo de 1922',
    cases: [
      { label: 'Arte pela arte', note: 'perfeição formal', observation: 'O Parnasianismo reage ao subjetivismo romântico com a defesa da arte pela arte: o valor está na perfeição formal, não na expressão do sentimento.', conclusion: 'O poeta é artesão que trabalha a palavra com rigor, buscando impessoalidade.' },
      { label: 'Rigor formal', note: 'o ourives de Bilac', observation: 'O soneto é a forma preferida, com metrificação rigorosa e rimas raras; Olavo Bilac compara o trabalho do poeta ao do ourives que lapida joias.', conclusion: 'Temas greco-latinos e a descrição de objetos de arte são recorrentes.' },
      { label: 'Nomes e recepção', note: 'alvo dos modernistas', observation: 'Olavo Bilac, Alberto de Oliveira e Raimundo Correia formam a tríade parnasiana, com prestígio até as primeiras décadas do século XX.', conclusion: 'Esse prestígio explica a virulência das paródias e ataques dos modernistas de 1922.' },
    ],
    caution: 'Síntese de escola: há lirismo contido sob o rigor formal, não ausência total de emoção.',
  },
  symbolism: {
    chapterId: 'summary-literatura-simbolismo',
    title: 'Sugestão, musicalidade e sinestesia',
    question: 'Por que o Simbolismo prefere sugerir a nomear, ao contrário do Parnasianismo?',
    relation: 'sugestão + musicalidade e sinestesia + poetas contemporâneos ao Parnasianismo → Simbolismo',
    cases: [
      { label: 'Reação ao materialismo', note: 'o inefável', observation: 'O Simbolismo reage ao cientificismo realista e ao formalismo parnasiano, voltando-se ao subjetivo, ao inconsciente e ao inefável.', conclusion: 'A poesia busca sugerir mais do que nomear.' },
      { label: 'Recursos', note: 'musicalidade e sinestesia', observation: 'Predominam musicalidade, sinestesia — cruzamento de sensações de sentidos diferentes — e um vocabulário de brumas, luares e cristais.', conclusion: 'A imprecisão é recurso buscado, e não defeito, ao contrário do Parnasianismo.' },
      { label: 'Cruz e Sousa e Alphonsus', note: 'angústia e transcendência', observation: 'Cruz e Sousa marca-se pela angústia e pela discriminação racial vivida; Alphonsus de Guimaraens, pela religiosidade e o tema da morte da amada.', conclusion: 'O Simbolismo brasileiro conviveu com o auge parnasiano, sem o mesmo prestígio imediato.' },
    ],
    caution: 'Síntese de escola: Simbolismo e Parnasianismo são contemporâneos, não sucessivos — cuidado com a ordem.',
  },
  'pre-modernism': {
    chapterId: 'summary-literatura-pre-modernismo',
    title: 'Um período entre a herança e a ruptura',
    question: 'Por que o Pré-Modernismo não é uma escola literária com programa?',
    relation: 'momento histórico + autor-diagnóstico + tensão de linguagem → Pré-Modernismo',
    cases: [
      { label: 'Período, não escola', note: '1902 a 1922', observation: 'O Pré-Modernismo não é estética unificada, e sim o conjunto da produção entre 1902 e 1922, com atenção à realidade brasileira excluída do projeto oficial de nação.', conclusion: 'Chamá-lo de escola com programa é o erro conceitual central.' },
      { label: 'Autores e obras', note: 'Sertões, Policarpo, Jeca', observation: 'Euclides da Cunha narra a Guerra de Canudos em Os Sertões; Lima Barreto retrata o subúrbio em Triste Fim de Policarpo Quaresma; Monteiro Lobato cria Jeca Tatu.', conclusion: 'Jeca Tatu foi criado como crítica, não elogio, e depois reinterpretado pelo próprio autor.' },
      { label: 'Traços de linguagem', note: 'academicismo x coloquial', observation: 'Convivem a linguagem academicista de Euclides e a busca de coloquialidade e ironia de Lima Barreto, que critica o bacharelismo.', conclusion: 'Essa tensão entre herança e ruptura faz o período funcionar como ponte para o Modernismo.' },
    ],
    caution: 'Síntese de período: Os Sertões também é reportagem e ensaio científico, não só literatura.',
  },
  'modern-art-week': {
    chapterId: 'summary-literatura-semana-de-arte-moderna',
    title: 'A Semana de 22 como marco',
    question: 'Por que a Semana de 22 é marco, e não a origem, do modernismo brasileiro?',
    relation: 'evento catalisador + nomes centrais + manifestos posteriores → marco simbólico de 1922',
    cases: [
      { label: 'O evento', note: 'fevereiro de 1922', observation: 'Realizada em fevereiro de 1922 no Theatro Municipal de São Paulo, reuniu escritores, artistas e músicos em três noites, com vaias e escândalo.', conclusion: 'O objetivo era romper com o academicismo e afirmar uma expressão nacional.' },
      { label: 'Participantes e obras', note: 'Mário, Oswald, Anita', observation: 'Mário de Andrade, Oswald de Andrade, Villa-Lobos, Anita Malfatti e Di Cavalcanti estiveram entre os nomes centrais, no contexto do centenário da Independência.', conclusion: 'A São Paulo enriquecida pelo café e transformada pela imigração ajuda a explicar o momento.' },
      { label: 'Legado', note: 'manifestos depois', observation: 'A Semana não produziu de imediato as grandes obras do modernismo, mas funcionou como marco simbólico, gerando os manifestos Pau-Brasil e Antropófago.', conclusion: 'Supor que a Semana criou o modernismo do zero ignora obras anteriores, como a exposição de Anita Malfatti em 1917.' },
    ],
    caution: 'Síntese de evento: os manifestos de 1924 e 1928 têm datas e propostas distintas, detalhadas no capítulo seguinte.',
  },
  'modernism-first-generation': {
    chapterId: 'summary-literatura-modernismo-no-brasil-primeira-geracao',
    title: 'A fase heroica do Modernismo',
    question: 'Como Pau-Brasil e Antropofagia se diferenciam, e como Macunaíma sintetiza a fase?',
    relation: 'ruptura formal + manifesto + obra-síntese → primeira geração modernista',
    cases: [
      { label: 'Fase heroica', note: '1922 a 1930', observation: 'A primeira geração, de 1922 a 1930, é a fase de ruptura: verso livre, linguagem coloquial brasileira, humor e paródia, recusa do academicismo.', conclusion: 'Busca identidade nacional que incorpore o popular, o indígena e o afro-brasileiro.' },
      { label: 'Manifestos e grupos', note: 'Pau-Brasil e Antropófago', observation: 'O Manifesto da Poesia Pau-Brasil (1924) propõe poesia sintética e brasileira; o Manifesto Antropófago (1928) propõe deglutir a cultura estrangeira.', conclusion: 'Grupos como Verde-Amarelo e Anta defendem, em contraponto, um nacionalismo mais conservador.' },
      { label: 'Obras centrais', note: 'Macunaíma', observation: 'Macunaíma, de Mário de Andrade, reúne lendas e falares de várias regiões, criando o herói sem nenhum caráter como síntese contraditória do brasileiro.', conclusion: 'Ler Macunaíma como afirmação simples de identidade nacional ignora sua ironia.' },
    ],
    caution: 'Síntese de fase: nem todo modernismo de 22 era progressista — havia vertentes nacionalistas conservadoras.',
  },
  'modernism-second-generation': {
    chapterId: 'summary-literatura-segunda-geracao-modernista-poesia',
    title: 'A segunda geração e a densidade reflexiva',
    question: 'O que a segunda geração modernista mantém e o que muda em relação a 1922?',
    relation: 'liberdade formal herdada + nome do núcleo + pergunta pelo papel do poeta → segunda geração',
    cases: [
      { label: 'Amadurecimento', note: 'densidade reflexiva', observation: 'A poesia dos anos 1930-40 mantém a liberdade formal de 22, mas troca a irreverência por maior densidade reflexiva, com o social e a angústia existencial em foco.', conclusion: 'Não é abandono das conquistas de 22, e sim mudança de tom.' },
      { label: 'Nomes centrais', note: 'Drummond, Cecília, Murilo', observation: 'Drummond, Cecília Meireles, Murilo Mendes, Jorge de Lima e Vinicius de Moraes formam o núcleo; Cecília também escreveu o Romanceiro da Inconfidência, de tema histórico.', conclusion: 'Reduzir Cecília Meireles ao lirismo intimista ignora essa outra vertente de sua obra.' },
      { label: 'Poesia e mundo', note: 'o papel do poeta', observation: 'O contexto de guerras e autoritarismo atravessa a produção, e a pergunta pelo papel do poeta diante da barbárie se torna tema explícito.', conclusion: 'Nem toda poesia do período é engajada — a densidade reflexiva convive com registros variados.' },
    ],
    caution: 'Síntese de fase: cada poeta do núcleo tem obra e trajetória próprias além do traço aqui resumido.',
  },
  'concrete-poetry': {
    chapterId: 'summary-literatura-poesia-concreta',
    title: 'O poema como objeto visual',
    question: 'O que substitui o verso na proposta concretista, e por que a leitura exige olhar a página?',
    relation: 'fim do verso + materialidade da palavra + diálogo com o design moderno → poesia concreta',
    cases: [
      { label: 'O projeto', note: 'fim do verso', observation: 'A poesia concreta surge em São Paulo nos anos 1950, com Augusto e Haroldo de Campos e Décio Pignatari, propondo o fim do verso e o poema como objeto visual e sonoro.', conclusion: 'Aproxima poesia, design e comunicação, usando o espaço da página, tipografia e cor.' },
      { label: 'Procedimentos', note: 'materialidade da palavra', observation: 'O poema trabalha a forma gráfica e a sonoridade da palavra, com fragmentação e disposição em grades, de modo que o sentido nasce da relação visual.', conclusion: 'Ler só o significado das palavras, sem a disposição na página, é o erro central de leitura.' },
      { label: 'Contexto e desdobramentos', note: 'Brasília e crítica', observation: 'O movimento dialoga com o desenvolvimentismo, o design moderno e a construção de Brasília, com desdobramentos na publicidade e na tipografia.', conclusion: 'Foi criticado por excesso de formalismo, e dialoga com Mallarmé, Pound e João Cabral — não rompe com toda a tradição.' },
    ],
    caution: 'Síntese de movimento: a produção posterior de parte do grupo seguiu vertentes mais engajadas, fora deste recorte.',
  },
  'prose-1960-1980': {
    chapterId: 'summary-literatura-prosa-brasileira-1960-1980',
    title: 'Prosa entre censura e violência urbana',
    question: 'Por que muitos autores do período recorreram à alegoria e ao fantástico?',
    relation: 'censura + violência urbana como diagnóstico + testemunho → prosa de 1960-1980',
    cases: [
      { label: 'Ficção e ditadura', note: 'alegoria e fantástico', observation: 'A prosa do período responde à censura com alegoria, fantástico e fragmentação, como em Incidente em Antares, de Erico Verissimo, e Zero, de Ignácio de Loyola Brandão.', conclusion: 'O insólito permite tratar do autoritarismo de forma que escape à repressão.' },
      { label: 'Conto urbano e violência', note: 'Rubem Fonseca', observation: 'Rubem Fonseca renova o conto com narrativas urbanas, linguagem direta e violência explícita, em livros como Feliz Ano Novo, censurado na época.', conclusion: 'A violência é diagnóstico da desigualdade, não celebração dela.' },
      { label: 'Memória e testemunho', note: 'crônica e exílio', observation: 'Cresce a literatura de testemunho, com relatos de prisão e exílio, e a crônica se consolida como gênero que capta o cotidiano com humor e crítica.', conclusion: 'Confundir literatura de testemunho com autobiografia ignora seu outro pacto de leitura.' },
    ],
    caution: 'Síntese de período: nem toda a prosa trata diretamente da ditadura — a diversidade temática é maior que o recorte.',
  },
  'lusophone-contemporary': {
    chapterId: 'summary-literatura-literatura-lusofona-contemporanea',
    title: 'Um campo plural em língua portuguesa',
    question: 'O que aproxima Mia Couto de Guimarães Rosa, apesar de países e décadas diferentes?',
    relation: 'língua compartilhada + projeto de linguagem próprio + diálogo com a história → campo lusófono',
    cases: [
      { label: 'Campo plural', note: 'língua compartilhada', observation: 'A literatura em língua portuguesa contemporânea reúne Portugal, Brasil, Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé e Príncipe e Timor-Leste.', conclusion: 'O que aproxima os países é a língua, reelaborada de modo distinto em cada território.' },
      { label: 'África lusófona', note: 'Mia Couto, Agualusa', observation: 'Mia Couto, em Moçambique, cria linguagem própria com neologismos e oralidade, aproximando-se de Guimarães Rosa; Agualusa e Pepetela tratam de guerra e memória em Angola.', conclusion: 'Ler essas obras só como documento sobre a guerra ignora seu projeto de linguagem.' },
      { label: 'Portugal contemporâneo', note: 'Saramago e Lobo Antunes', observation: 'José Saramago, Nobel de literatura, trabalha com alegorias e prosa de longos períodos; António Lobo Antunes explora memória e guerra colonial em fluxo de consciência.', conclusion: 'As duas obras dialogam criticamente com a história recente e o legado colonial português.' },
    ],
    caution: 'Síntese de campo: a lusofonia não é bloco homogêneo — cada país tem história e projeto literário próprios.',
  },
  'brazilian-visual-arts': {
    chapterId: 'summary-literatura-artes-plasticas-brasileiras',
    title: 'Do academicismo ao neoconcretismo',
    question: 'O que o neoconcretismo acrescentou ao concretismo nas artes plásticas?',
    relation: 'ruptura modernista + obra-síntese + participação do público → artes plásticas brasileiras',
    cases: [
      { label: 'Até o modernismo', note: 'Missão Francesa', observation: 'A produção oitocentista foi marcada pela Missão Artística Francesa e pela pintura acadêmica; o modernismo rompeu com esse padrão, com Malfatti, Tarsila, Di Cavalcanti e Portinari.', conclusion: 'Articula vanguardas europeias e temas brasileiros.' },
      { label: 'Tarsila e Portinari', note: 'Abaporu, Operários', observation: 'Tarsila do Amaral produziu Abaporu, ligada ao Manifesto Antropófago, e Operários; Portinari trabalhou temas sociais, como os retirantes, com grande alcance público.', conclusion: 'Ler Abaporu como figura curiosa ignora sua ligação direta com o projeto antropofágico.' },
      { label: 'Neoconcretismo e hoje', note: 'Lygia Clark, Oiticica', observation: 'Nos anos 1950-60, o neoconcretismo, com Lygia Clark e Hélio Oiticica, incorporou a participação do público e o corpo, com bichos manipuláveis e parangolés vestíveis.', conclusion: 'A produção contemporânea amplia suportes, com instalação, performance e arte digital.' },
    ],
    caution: 'Síntese de campo: pintura e escultura convivem com os novos meios contemporâneos, não foram abandonadas.',
  },
  'brazilian-theater': {
    chapterId: 'summary-literatura-teatro-brasileiro',
    title: 'De Anchieta ao Teatro do Oprimido',
    question: 'Por que Vestido de Noiva é marco do teatro moderno, e o que o Teatro do Oprimido acrescenta depois?',
    relation: 'ruptura formal + planos simultâneos + palco como crítica política → teatro brasileiro moderno',
    cases: [
      { label: 'Formação', note: 'Anchieta a Vestido de Noiva', observation: 'O teatro brasileiro tem marcos na função catequética de Anchieta e na comédia de costumes de Martins Pena; a modernização começa com Vestido de Noiva, de Nelson Rodrigues, em 1943.', conclusion: 'Vestido de Noiva rompe com o realismo cênico dominante até então.' },
      { label: 'Nelson Rodrigues', note: 'três planos simultâneos', observation: 'Sua dramaturgia trabalha com três planos simultâneos — alucinação, memória e realidade — e temas de desejo, culpa e tragédia familiar.', conclusion: 'Reduzi-lo a autor de escândalo ignora sua inovação formal.' },
      { label: 'Teatro e política', note: 'Arena, Oficina, Boal', observation: 'Nos anos 1960, o Teatro de Arena e o Teatro Oficina fizeram do palco espaço de crítica política; Augusto Boal desenvolveu o Teatro do Oprimido.', conclusion: 'O Teatro do Oprimido é método de intervenção social e educativa, não só técnica de encenação.' },
    ],
    caution: 'Síntese de campo: Teatro de Arena e Teatro Oficina têm projetos e estéticas distintos entre si.',
  },
  'popular-songbook': {
    chapterId: 'summary-literatura-cancioneiro-popular-brasileiro',
    title: 'A canção como texto literário',
    question: 'Por que a canção popular é objeto legítimo de análise literária, com o mesmo rigor de um poema?',
    relation: 'letra e melodia + registro histórico + driblar a censura → cancioneiro como texto literário',
    cases: [
      { label: 'Canção como texto', note: 'letra e melodia', observation: 'A canção popular é objeto legítimo de análise literária: articula letra e melodia, e o sentido nasce dessa relação.', conclusion: 'Analisar a letra ignorando melodia e ritmo empobrece a leitura da canção.' },
      { label: 'Momentos e nomes', note: 'samba a Tropicália', observation: 'Do samba de Noel Rosa à Bossa Nova de Tom Jobim, da Tropicália de Caetano e Gil às canções de protesto de Chico Buarque, a canção comenta a história brasileira.', conclusion: 'Rap e funk também pertencem ao cancioneiro, e não devem ser excluídos da análise.' },
      { label: 'Canção e censura', note: 'Cálice', observation: 'Durante o regime militar, a canção foi veículo central de crítica; Cálice, de Chico Buarque e Gilberto Gil, explora a homofonia entre cálice e cale-se.', conclusion: 'Ler a metáfora sem o contexto de censura faz perder o sentido político da canção.' },
    ],
    caution: 'Síntese de campo: cobre só os exemplos citados na apostila, não todo o cancioneiro popular brasileiro.',
  },
};
