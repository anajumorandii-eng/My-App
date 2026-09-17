import type { SceneEntry } from '../types';

/** Cenas-âncora de Biologia. As 39 entradas abaixo (17 tipologia, 17
 *  cadeia-de-derivacao, 4 escala-de-graus, 1 contraste-de-posicoes) seguem
 *  exatamente a atribuição de família e as citações planejadas pelo
 *  inventário em docs/visual-personalizado/15-familias-biologia.md (Parte A,
 *  capítulos 1-36; Parte B, capítulos 37-72). Toda `quote` foi conferida
 *  como substring literal da seção correta em `deepSummaryContent.json`. */
export const biologia: SceneEntry[] = [
{
  chapterId: "biologia-algas",
  family: "tipologia",
  question: "Por que algas verdes, pardas e vermelhas vivem em profundidades diferentes?",
  items: [
    {
      label: "Verdes",
      claim: "Clorofila a e b absorvem bem a luz vermelha, por isso vivem em águas rasas, onde essa luz ainda chega.",
      section: "Pigmentos e profundidade",
      quote: "As algas verdes, com clorofilas a e b, absorvem bem no vermelho e por isso ocupam águas rasas.",
    },
    {
      label: "Pardas",
      claim: "A fucoxantina permite viver em profundidade intermediária.",
      section: "Pigmentos e profundidade",
      quote: "As pardas, com fucoxantina, ocupam profundidade intermediária.",
    },
    {
      label: "Vermelhas",
      claim: "A ficoeritrina absorve a luz azul-verde, que penetra mais fundo, permitindo viver mais fundo que qualquer outro grupo fotossintetizante.",
      section: "Pigmentos e profundidade",
      quote: "As vermelhas, com ficoeritrina, absorvem justamente a faixa azul-verde e por isso conseguem viver mais fundo do que qualquer outro grupo fotossintetizante",
    },
  ],
},
{
  chapterId: "biologia-anelideos",
  family: "tipologia",
  question: "Quais são os três grupos de anelídeos e o que os diferencia?",
  items: [
    {
      label: "Oligoquetos",
      claim: "Têm poucas cerdas, vivem no solo ou em água doce, são hermafroditas e têm clitelo que secreta o casulo dos ovos.",
      section: "Os três grupos",
      quote: "Oligoquetos, como a minhoca (Lumbricus), têm poucas cerdas por segmento, vivem no solo ou em água doce, são hermafroditas e apresentam clitelo, região glandular espessada que secreta o casulo onde os ovos se desenvolvem.",
    },
    {
      label: "Poliquetos",
      claim: "Majoritariamente marinhos, com muitas cerdas em parapódios, sexos separados e larva trocófora.",
      section: "Os três grupos",
      quote: "Poliquetos são majoritariamente marinhos, têm muitas cerdas inseridas em parapódios",
    },
    {
      label: "Hirudíneos",
      claim: "Sanguessugas sem cerdas nem parapódios, com ventosas, muitas vezes ectoparasitas que secretam hirudina anticoagulante.",
      section: "Os três grupos",
      quote: "Hirudíneos, os sanguessugas, não têm cerdas nem parapódios, têm ventosas nas extremidades, número fixo de segmentos e são hermafroditas",
    },
  ],
},
{
  chapterId: "biologia-biomas-brasileiros",
  family: "tipologia",
  question: "Quais são os principais biomas brasileiros e o que caracteriza cada um?",
  items: [
    {
      label: "Amazônia",
      claim: "O maior bioma, floresta densa e perene de altíssima biodiversidade, com fertilidade concentrada na biomassa e serapilheira, não no solo.",
      section: "Os grandes biomas",
      quote: "A Amazônia é o maior, com cerca de 49% do território, floresta ombrófila densa, latifoliada e perene, de altíssima biodiversidade e solo pobre",
    },
    {
      label: "Cerrado",
      claim: "Savana mais rica em espécies vegetais do mundo, com árvores tortuosas de casca grossa e solo ácido com alumínio tóxico.",
      section: "Os grandes biomas",
      quote: "O Cerrado, com cerca de 24%, é a savana mais rica do mundo em espécies vegetais: árvores tortuosas de casca grossa e súber espesso, raízes profundas que alcançam o lençol freático e solo ácido com alumínio tóxico.",
    },
    {
      label: "Mata Atlântica",
      claim: "Reduzida a cerca de 12% da área original, é um hotspot de biodiversidade com altíssimo endemismo.",
      section: "Os grandes biomas",
      quote: "está reduzida a cerca de 12% da área original e é um hotspot de biodiversidade, com altíssimo endemismo",
    },
    {
      label: "Caatinga",
      claim: "Único bioma exclusivamente brasileiro, semiárido, com vegetação caducifólia e cactáceas que armazenam água.",
      section: "Caatinga, Pampa e Pantanal",
      quote: "A Caatinga é o único bioma exclusivamente brasileiro e ocupa o semiárido nordestino, com chuvas escassas e irregulares concentradas em poucos meses.",
    },
    {
      label: "Pampa",
      claim: "Gramíneas rasteiras no sul do Rio Grande do Sul, sob pressão da pecuária, soja e espécies exóticas.",
      section: "Caatinga, Pampa e Pantanal",
      quote: "O Pampa, ou Campos Sulinos, ocupa a metade sul do Rio Grande do Sul: gramíneas rasteiras, clima subtropical com estações bem marcadas",
    },
    {
      label: "Pantanal",
      claim: "Maior planície alagável do mundo, definido não por vegetação própria mas pelo regime de cheia sazonal.",
      section: "Caatinga, Pampa e Pantanal",
      quote: "O Pantanal é a maior planície alagável do mundo, e sua identidade não é uma vegetação própria mas um regime hidrológico",
    },
  ],
},
{
  chapterId: "biologia-ciclos-de-vida",
  family: "tipologia",
  question: "Quais são os três padrões de ciclo de vida sexuado e onde a meiose ocorre em cada um?",
  items: [
    {
      label: "Haplobionte haplonte",
      claim: "O adulto é haploide; o zigoto é a única célula diploide e sofre meiose zigótica logo após se formar.",
      section: "Os três padrões",
      quote: "No ciclo haplobionte haplonte, típico de muitas algas e fungos, o organismo adulto é haploide; a fecundação forma um zigoto diploide que é a única célula 2n do ciclo, e ele imediatamente sofre meiose",
    },
    {
      label: "Haplobionte diplonte",
      claim: "O adulto é diploide; só os gametas são haploides, formados por meiose gamética.",
      section: "Os três padrões",
      quote: "No ciclo haplobionte diplonte, o dos animais e de algumas algas, o adulto é diploide e as únicas células haploides são os gametas, produzidos por meiose gamética diretamente a partir de células germinativas.",
    },
    {
      label: "Diplobionte",
      claim: "Há dois organismos multicelulares alternados, gametófito e esporófito; a meiose é espórica e produz esporos, não gametas.",
      section: "Os três padrões",
      quote: "existem dois organismos multicelulares alternados: um haploide, o gametófito, e um diploide, o esporófito; a meiose é espórica, produz esporos, e não gametas",
    },
  ],
},
{
  chapterId: "biologia-composicao-quimica-celular-carboidratos-e-lipidios",
  family: "tipologia",
  question: "Como se classificam os carboidratos e os polissacarídeos?",
  items: [
    {
      label: "Monossacarídeos",
      claim: "Unidades básicas que não sofrem hidrólise, como glicose, frutose e galactose.",
      section: "Carboidratos",
      quote: "Monossacarídeos são as unidades básicas e não sofrem hidrólise: glicose, o combustível universal",
    },
    {
      label: "Dissacarídeos",
      claim: "União de dois monossacarídeos por ligação glicosídica, como sacarose, lactose e maltose.",
      section: "Carboidratos",
      quote: "Dissacarídeos resultam da união de dois monossacarídeos por ligação glicosídica, com liberação de uma molécula de água",
    },
    {
      label: "Polissacarídeos de reserva",
      claim: "Amido nas plantas e glicogênio nos animais, ambos polímeros de glicose com ligação alfa digerível.",
      section: "Reserva e estrutura",
      quote: "o amido é o polissacarídeo das plantas, armazenado em amiloplastos de raízes, caules e sementes, e o glicogênio é o dos animais e fungos, estocado sobretudo no fígado e no músculo esquelético",
    },
    {
      label: "Polissacarídeos estruturais",
      claim: "Celulose na parede vegetal e quitina no exoesqueleto de artrópodes, ambas com ligação beta que enzimas humanas não digerem.",
      section: "Reserva e estrutura",
      quote: "a celulose forma a parede das células vegetais e é o composto orgânico mais abundante da biosfera; a quitina forma o exoesqueleto dos artrópodes e a parede celular dos fungos",
    },
  ],
},
{
  chapterId: "biologia-dinamica-de-populacoes",
  family: "tipologia",
  question: "Como r-estrategistas e K-estrategistas diferem em suas estratégias reprodutivas?",
  items: [
    {
      label: "r-estrategistas",
      claim: "Produzem muitos descendentes pequenos, com pouco cuidado parental e alta mortalidade juvenil, se recuperando rápido de catástrofes.",
      section: "Densidade-dependência",
      quote: "espécies r-estrategistas produzem muitos descendentes pequenos, com pouco ou nenhum cuidado parental, maturação rápida e alta mortalidade juvenil",
    },
    {
      label: "K-estrategistas",
      claim: "Produzem poucos descendentes, com longo cuidado parental, vivem perto de K e são mais vulneráveis à extinção.",
      section: "Densidade-dependência",
      quote: "espécies K-estrategistas produzem poucos descendentes, com longo cuidado parental e maturação lenta, e vivem perto de K",
    },
  ],
},
{
  chapterId: "biologia-equinodermos",
  family: "tipologia",
  question: "Quais são as cinco classes de equinodermos e o que caracteriza cada uma?",
  items: [
    {
      label: "Asteroides",
      claim: "Estrelas-do-mar, predadoras de moluscos.",
      section: "Diversidade e regeneração",
      quote: "Asteroides são as estrelas-do-mar, predadoras de moluscos.",
    },
    {
      label: "Equinoides",
      claim: "Ouriços e bolachas-da-praia, herbívoros com lanterna de Aristóteles para raspar algas.",
      section: "Diversidade e regeneração",
      quote: "Equinoides são os ouriços e as bolachas-da-praia, com esqueleto rígido em carapaça e um aparelho mastigador de cinco dentes chamado lanterna de Aristóteles, usado para raspar algas",
    },
    {
      label: "Holoturoides",
      claim: "Pepinos-do-mar detritívoros que revolvem sedimento e podem expelir vísceras como defesa.",
      section: "Diversidade e regeneração",
      quote: "Holoturoides são os pepinos-do-mar, de corpo alongado e esqueleto reduzido, detritívoros que revolvem o sedimento",
    },
    {
      label: "Ofiuroides",
      claim: "Serpentes-do-mar, de braços finos e móveis.",
      section: "Diversidade e regeneração",
      quote: "Ofiuroides são as serpentes-do-mar, de braços finos e móveis.",
    },
    {
      label: "Crinoides",
      claim: "Lírios-do-mar, os mais primitivos, filtradores e frequentemente fixos.",
      section: "Diversidade e regeneração",
      quote: "Crinoides são os lírios-do-mar, os mais primitivos, filtradores e frequentemente fixos.",
    },
  ],
},
{
  chapterId: "biologia-especies-invasoras-e-controle-biologico",
  family: "tipologia",
  question: "Por quais mecanismos as espécies invasoras causam impacto?",
  items: [
    {
      label: "Predação",
      claim: "Predação direta sobre espécies sem defesa evolutiva, mais destrutiva em ilhas.",
      section: "Impactos e exemplos",
      quote: "A predação direta sobre espécies sem defesa evolutiva é a mais destrutiva em ilhas.",
    },
    {
      label: "Competição",
      claim: "Competição por recurso e espaço que desloca espécies nativas.",
      section: "Impactos e exemplos",
      quote: "A competição por recurso e espaço desloca nativas.",
    },
    {
      label: "Transmissão de patógenos",
      claim: "Patógenos novos dizimam populações nativas imunologicamente ingênuas.",
      section: "Impactos e exemplos",
      quote: "A transmissão de patógenos novos dizima populações imunologicamente ingênuas.",
    },
    {
      label: "Hibridação",
      claim: "Hibridação com espécies próximas dilui o patrimônio genético nativo.",
      section: "Impactos e exemplos",
      quote: "A hibridação com espécies próximas dilui o patrimônio genético nativo.",
    },
    {
      label: "Alteração do ambiente físico",
      claim: "Modificação do próprio ambiente físico, como o capim-braquiária alterando o regime de fogo no Cerrado.",
      section: "Impactos e exemplos",
      quote: "E há a alteração do próprio ambiente físico.",
    },
  ],
},
{
  chapterId: "biologia-ciclo-hidrologico-e-poluicao-da-agua",
  family: "tipologia",
  question: "Quais são os tipos de poluição da água, classificados por agente?",
  items: [
    {
      label: "Orgânica",
      claim: "Esgoto e resíduos agroindustriais consomem oxigênio dissolvido via decomposição aeróbia, medida pela DBO.",
      section: "Poluição e seus tipos",
      quote: "A poluição orgânica, de esgoto doméstico e resíduos agroindustriais, introduz matéria orgânica que os decompositores aeróbios oxidam, consumindo oxigênio dissolvido",
    },
    {
      label: "Por nutrientes",
      claim: "Fertilizantes e detergentes ricos em fósforo provocam eutrofização.",
      section: "Poluição e seus tipos",
      quote: "A poluição por nutrientes, de fertilizantes e detergentes ricos em fósforo, provoca eutrofização.",
    },
    {
      label: "Térmica",
      claim: "Água de refrigeração industrial eleva a temperatura e reduz o oxigênio disponível.",
      section: "Poluição e seus tipos",
      quote: "A poluição térmica, de água de refrigeração industrial, eleva a temperatura e reduz a solubilidade dos gases, diminuindo o oxigênio disponível",
    },
    {
      label: "Química",
      claim: "Metais pesados e agrotóxicos que biomagnificam na cadeia alimentar.",
      section: "Poluição e seus tipos",
      quote: "A poluição química inclui metais pesados e agrotóxicos, que biomagnificam.",
    },
    {
      label: "Biológica",
      claim: "Contaminação por microrganismos patogênicos fecais, medida pelo índice de coliformes.",
      section: "Poluição e seus tipos",
      quote: "A poluição biológica é a contaminação por microrganismos patogênicos de origem fecal, medida pelo índice de coliformes",
    },
    {
      label: "Por plásticos",
      claim: "Microplásticos ingeridos por filtradores entram na cadeia alimentar, preocupação mais recente.",
      section: "Poluição e seus tipos",
      quote: "A poluição por plásticos, incluindo microplásticos, é a preocupação mais recente, com ingestão por organismos filtradores e entrada na cadeia alimentar.",
    },
  ],
},
{
  chapterId: "biologia-fungos",
  family: "tipologia",
  question: "Como os fungos se dividem em grupos, e o que define cada um?",
  items: [
    {
      label: "Zigomicetos",
      claim: "Hifas cenocíticas, formam zigósporo (ex.: Rhizopus, o bolor do pão).",
      section: "Reprodução e diversidade",
      quote: "Zigomicetos, como o Rhizopus, o bolor do pão, têm hifas cenocíticas e formam zigósporo.",
    },
    {
      label: "Ascomicetos",
      claim: "Formam esporos dentro de ascos; inclui leveduras, Penicillium e trufas.",
      section: "Reprodução e diversidade",
      quote: "Ascomicetos formam esporos dentro de ascos e reúnem as leveduras (Saccharomyces cerevisiae), o Penicillium, de onde veio a penicilina descoberta por Fleming em 1928, e as trufas.",
    },
    {
      label: "Basidiomicetos",
      claim: "Formam esporos em basídios; são os cogumelos e orelhas-de-pau.",
      section: "Reprodução e diversidade",
      quote: "Basidiomicetos formam esporos em basídios e são os cogumelos e orelhas-de-pau",
    },
    {
      label: "Deuteromicetos",
      claim: "Grupo histórico dos fungos sem reprodução sexuada conhecida, hoje redistribuído pela genética.",
      section: "Reprodução e diversidade",
      quote: "Deuteromicetos era o grupo dos fungos sem reprodução sexuada conhecida, hoje redistribuídos conforme a genética os esclarece.",
    },
  ],
},
{
  chapterId: "biologia-heranca-sexual",
  family: "tipologia",
  question: "Quais são os tipos de herança relacionados ao sexo, e o que os diferencia?",
  items: [
    {
      label: "Ligada ao sexo (ao X)",
      claim: "Genes no X fazem condições recessivas serem muito mais frequentes em homens.",
      section: "Determinação do sexo e herança ligada ao X",
      quote: "características recessivas ligadas ao X — daltonismo e hemofilia são os exemplos obrigatórios — são muito mais frequentes em homens.",
    },
    {
      label: "Restrita ao sexo (holândrica)",
      claim: "Genes exclusivos do Y: só aparece em homens, passa de pai para todos os filhos homens.",
      section: "Herança restrita e influenciada pelo sexo",
      quote: "Herança restrita ao sexo, ou holândrica, é a de genes situados na porção exclusiva do Y: manifesta-se apenas em homens e passa integralmente de pai para todos os filhos homens, nunca para filhas — a hipertricose auricular é o exemplo citado.",
    },
    {
      label: "Influenciada pelo sexo",
      claim: "Genes autossômicos cuja dominância se inverte conforme o sexo (ex.: calvície).",
      section: "Herança restrita e influenciada pelo sexo",
      quote: "Herança influenciada pelo sexo envolve genes autossômicos, presentes em ambos os sexos, cuja dominância se inverte conforme o ambiente hormonal: a calvície hereditária é dominante no homem e recessiva na mulher",
    },
    {
      label: "Limitada pelo sexo",
      claim: "Genes autossômicos que só se expressam num dos sexos (ex.: produção de leite).",
      section: "Herança restrita e influenciada pelo sexo",
      quote: "Herança limitada pelo sexo, por fim, é a de genes autossômicos que só se expressam num dos sexos por razões anatômicas ou fisiológicas, como a produção de leite.",
    },
  ],
},
{
  chapterId: "biologia-mecanismos-da-evolucao-biologica",
  family: "tipologia",
  question: "Quais fatores alteram as frequências alélicas de uma população?",
  nota: "A introdução sobre o equilíbrio de Hardy-Weinberg e os erros mais comuns não entram aqui — os tipos abaixo vêm apenas das seções que descrevem cada fator em si.",
  items: [
    {
      label: "Mutação",
      claim: "Única fonte de alelos genuinamente novos, ao acaso e sem relação com a necessidade do organismo.",
      section: "Fontes de variação",
      quote: "A mutação é a única fonte de alelos genuinamente novos: alterações no DNA, espontâneas ou induzidas, que surgem ao acaso e sem relação com a necessidade do organismo.",
    },
    {
      label: "Recombinação",
      claim: "Não cria alelos novos, rearranja os existentes em combinações inéditas.",
      section: "Fontes de variação",
      quote: "A recombinação não cria alelos novos, mas rearranja os existentes em combinações inéditas",
    },
    {
      label: "Seleção natural",
      claim: "Único fator que produz adaptação; pode ser estabilizadora, direcional ou disruptiva.",
      section: "Seleção e adaptação",
      quote: "A seleção natural é o único deles que produz adaptação: ela não é aleatória, favorece o que aumenta o sucesso reprodutivo naquele ambiente, e pode ser estabilizadora, quando favorece o fenótipo médio; direcional, quando favorece um dos extremos e desloca a média",
    },
    {
      label: "Deriva genética",
      claim: "Variação aleatória das frequências por amostragem, relevante em populações pequenas.",
      section: "Seleção e adaptação",
      quote: "A deriva genética é a variação aleatória das frequências por amostragem, importante em populações pequenas",
    },
    {
      label: "Migração",
      claim: "Fluxo gênico que homogeneíza populações vizinhas.",
      section: "Seleção e adaptação",
      quote: "A migração, ou fluxo gênico, homogeneíza populações vizinhas.",
    },
    {
      label: "Isolamento reprodutivo",
      claim: "Permite que populações separadas acumulem diferenças até virarem espécies distintas.",
      section: "Seleção e adaptação",
      quote: "o isolamento reprodutivo, pré ou pós-zigótico, é o que permite que populações separadas acumulem diferenças até se tornarem espécies distintas.",
    },
  ],
},
{
  chapterId: "biologia-moluscos",
  family: "tipologia",
  question: "Quais são as três classes principais de moluscos, e o que as distingue?",
  items: [
    {
      label: "Gastrópodes",
      claim: "Grupo mais numeroso e único que conquistou o ambiente terrestre; têm rádula e torção.",
      section: "As três classes principais",
      quote: "Gastrópodes são o grupo mais numeroso e o único que conquistou o ambiente terrestre: caracóis, lesmas e caramujos, com pé rastejante ventral, cabeça bem definida com tentáculos e olhos, rádula, e torção da massa visceral durante o desenvolvimento.",
    },
    {
      label: "Bivalves",
      claim: "Concha de duas valvas, sem cabeça diferenciada nem rádula, filtradores.",
      section: "As três classes principais",
      quote: "Bivalves, como ostras, mexilhões e vieiras, têm concha de duas valvas articuladas, não têm cabeça diferenciada nem rádula, e são filtradores",
    },
    {
      label: "Cefalópodes",
      claim: "Exclusivamente marinhos, circulação fechada, sistema nervoso mais desenvolvido entre os invertebrados.",
      section: "As três classes principais",
      quote: "Cefalópodes — polvos, lulas, chocos e náutilos — são exclusivamente marinhos, com o pé modificado em tentáculos ao redor da cabeça, circulação fechada, propulsão a jato pelo sifão e o sistema nervoso mais desenvolvido entre os invertebrados",
    },
  ],
},
{
  chapterId: "biologia-mutacoes-genicas",
  family: "tipologia",
  question: "Quais são os tipos de mutação gênica, e como cada um afeta a proteína?",
  items: [
    {
      label: "Silenciosa",
      claim: "Troca a base mas não muda o aminoácido, pela degeneração do código genético.",
      section: "Alterações na sequência",
      quote: "A mutação silenciosa troca a base mas não muda o aminoácido, graças à degeneração do código genético",
    },
    {
      label: "Missense (sentido trocado)",
      claim: "Muda um aminoácido; efeito varia de nulo a devastador conforme a posição.",
      section: "Alterações na sequência",
      quote: "A mutação de sentido trocado, ou missense, muda um aminoácido: o efeito vai de nulo a devastador conforme a posição",
    },
    {
      label: "Nonsense (sem sentido)",
      claim: "Cria um códon de parada, truncando a proteína.",
      section: "Alterações na sequência",
      quote: "A mutação sem sentido, ou nonsense, transforma um códon de aminoácido em códon de parada, truncando a proteína",
    },
    {
      label: "Frameshift",
      claim: "Inserção/deleção não múltipla de três desloca o quadro de leitura inteiro.",
      section: "Inserções e deleções",
      quote: "acrescentar ou remover um número de bases que não seja múltiplo de três desloca todo o quadro de leitura a partir daquele ponto — a chamada mutação de fase, ou frameshift.",
    },
    {
      label: "Múltiplo de três",
      claim: "Mantém o quadro de leitura; só acrescenta ou remove poucos aminoácidos.",
      section: "Inserções e deleções",
      quote: "Se a inserção ou deleção for de três bases, ou de um múltiplo de três, o quadro se mantém e apenas um ou poucos aminoácidos são acrescentados ou perdidos",
    },
  ],
},
{
  chapterId: "biologia-protozoarios-e-protozooses",
  family: "tipologia",
  question: "Como os protozoários se classificam pela estrutura locomotora?",
  items: [
    {
      label: "Rizópodes",
      claim: "Movem-se por pseudópodes (ex.: Entamoeba).",
      section: "Diversidade dos protozoários",
      quote: "Rizópodes (ou sarcodíneos), como a Entamoeba, movem-se por pseudópodes",
    },
    {
      label: "Flagelados",
      claim: "Movem-se por flagelos em movimento ondulatório (ex.: Trypanosoma, Giardia).",
      section: "Diversidade dos protozoários",
      quote: "Flagelados (ou mastigóforos), como Trypanosoma e Giardia, movem-se por um ou mais flagelos batendo em movimento ondulatório.",
    },
    {
      label: "Ciliados",
      claim: "Cílios curtos cobrindo toda a superfície celular (ex.: Paramecium).",
      section: "Diversidade dos protozoários",
      quote: "Ciliados, como Paramecium, têm numerosos cílios curtos cobrindo toda a superfície celular",
    },
    {
      label: "Esporozoários",
      claim: "Único grupo sem estrutura locomotora nas formas adultas (ex.: Plasmodium).",
      section: "Diversidade dos protozoários",
      quote: "Esporozoários (ou apicomplexos), como Plasmodium, são o único grupo sem estrutura locomotora nas formas adultas",
    },
  ],
},
{
  chapterId: "biologia-sangue-e-imunologia",
  family: "tipologia",
  question: "Quais são os tipos de defesa imunológica, e como vacina e soro se encaixam neles?",
  nota: "A seção sobre composição do sangue (hemácias, plaquetas etc.) não sustenta essa tipologia — os tipos abaixo vêm apenas das seções sobre resposta imune e sobre vacina/soro.",
  items: [
    {
      label: "Imunidade inata",
      claim: "Rápida, inespecífica, não gera memória.",
      section: "Resposta imune",
      quote: "A imunidade inata é rápida (minutos a horas), inespecífica — reconhece padrões gerais de patógenos, não um agente particular — e não gera memória",
    },
    {
      label: "Imunização ativa (vacina)",
      claim: "Estimula o próprio organismo a produzir anticorpos e células de memória.",
      section: "Vacina e soro",
      quote: "A vacina contém o antígeno (patógeno inativado, atenuado, ou fragmentos dele, incluindo tecnologias mais recentes como RNA mensageiro) e estimula o próprio organismo a produzir anticorpos e, principalmente, células de memória — trata-se de imunização ativa",
    },
    {
      label: "Imunização passiva (soro)",
      claim: "Fornece anticorpos prontos, proteção imediata e temporária.",
      section: "Vacina e soro",
      quote: "O soro contém anticorpos prontos, já produzidos (originalmente em animais, hoje também por outras vias), e ao ser aplicado confere proteção imediata — imunização passiva",
    },
  ],
},
{
  chapterId: "biologia-segunda-lei-de-mendel-e-interacao-genica",
  family: "tipologia",
  question: "Quais são os mecanismos pelos quais mais de um gene afeta uma mesma característica?",
  items: [
    {
      label: "Interação gênica simples",
      claim: "Dois genes independentes geram quatro fenótipos de uma mesma característica (ex.: crista de galinha, 9:3:3:1).",
      section: "Quando dois genes afetam a mesma característica",
      quote: "O exemplo clássico é a forma da crista em galinhas, controlada por dois genes independentes cuja combinação de alelos dominantes e recessivos produz quatro fenótipos de crista distintos (ervilha, rosa, noz e simples) numa proporção 9:3:3:1",
    },
    {
      label: "Epistasia",
      claim: "Um gene mascara ou impede a expressão de outro gene, em locus diferente.",
      section: "Epistasia",
      quote: "Epistasia é um tipo específico de interação gênica em que um gene mascara ou impede completamente a expressão de outro gene, situado em locus diferente",
    },
    {
      label: "Herança quantitativa (poligênica)",
      claim: "Muitos genes de efeito aditivo pequeno geram variação contínua.",
      section: "Herança quantitativa",
      quote: "A herança quantitativa, ou poligênica, ocorre quando muitos genes (não apenas dois), cada um com efeito aditivo pequeno, contribuem juntos para uma mesma característica, produzindo variação contínua em vez de categorias discretas",
    },
  ],
},
{
  chapterId: "biologia-bioenergetica-fermentacao-e-respiracao",
  family: "cadeia-de-derivacao",
  question: "Qual é a sequência de etapas da respiração aeróbia, da glicólise até a cadeia respiratória?",
  items: [
    {
      label: "1. Glicólise",
      claim: "No citosol, a glicose é quebrada em duas moléculas de piruvato, com saldo de 2 ATP e 2 NADH.",
      section: "Respiração aeróbia",
      quote: "A glicólise ocorre no citosol, não na mitocôndria, e converte uma glicose em duas moléculas de piruvato, com saldo líquido de 2 ATP e 2 NADH",
    },
    {
      label: "2. Descarboxilação oxidativa",
      claim: "Na mitocôndria, o piruvato perde CO2 e vira acetil-CoA, gerando mais NADH.",
      section: "Respiração aeróbia",
      quote: "Havendo oxigênio, o piruvato entra na mitocôndria e passa pela descarboxilação oxidativa, que libera CO2 e forma acetil-CoA, com mais 1 NADH por piruvato.",
    },
    {
      label: "3. Ciclo de Krebs",
      claim: "O acetil-CoA entra no ciclo de Krebs, na matriz mitocondrial, liberando CO2 e produzindo NADH, FADH2 e ATP.",
      section: "Respiração aeróbia",
      quote: "O acetil-CoA entra no ciclo de Krebs, na matriz mitocondrial, onde cada volta libera 2 CO2 e rende 3 NADH, 1 FADH2 e 1 ATP (ou GTP)",
    },
    {
      label: "4. Cadeia respiratória",
      claim: "Os elétrons de NADH e FADH2 percorrem a cadeia respiratória e movem a ATP-sintase pelo gradiente de prótons.",
      section: "Respiração aeróbia",
      quote: "Na cadeia respiratória, na membrana interna da mitocôndria, os elétrons do NADH e do FADH2 percorrem complexos proteicos e o gradiente de prótons formado no espaço intermembranar move a ATP-sintase",
    },
  ],
},
{
  chapterId: "biologia-bioenergetica-fotossintese-e-quimiossintese",
  family: "cadeia-de-derivacao",
  question: "Como o produto da etapa fotoquímica se torna o insumo da etapa química da fotossíntese?",
  items: [
    {
      label: "1. Etapa fotoquímica",
      claim: "Nos tilacoides, a luz excita elétrons da clorofila e o processo gera ATP e NADPH.",
      section: "Duas etapas integradas",
      quote: "O produto da etapa clara é, portanto, ATP e NADPH — mais o oxigênio, que é subproduto.",
    },
    {
      label: "2. Etapa química (ciclo de Calvin)",
      claim: "No estroma, a rubisco usa o ATP e o NADPH da etapa anterior para fixar CO2 e formar gliceraldeído-3-fosfato.",
      section: "Duas etapas integradas",
      quote: "Nela, a enzima rubisco fixa o CO2 sobre a ribulose bifosfato, e as moléculas resultantes são reduzidas com o ATP e o NADPH da etapa anterior, formando gliceraldeído-3-fosfato",
    },
  ],
},
{
  chapterId: "biologia-biomagnificacao",
  family: "cadeia-de-derivacao",
  question: "Como a concentração de um poluente lipossolúvel se multiplica ao longo da cadeia trófica?",
  items: [
    {
      label: "1. Fitoplâncton",
      claim: "O fitoplâncton retém uma concentração basal do poluente.",
      section: "Como o processo funciona",
      quote: "o fitoplâncton tem 0,01 ppm",
    },
    {
      label: "2. Zooplâncton",
      claim: "Ao comer fitoplâncton, o zooplâncton concentra dez vezes mais poluente.",
      section: "Como o processo funciona",
      quote: "o zooplâncton chega a 0,1",
    },
    {
      label: "3. Peixe pequeno",
      claim: "O peixe pequeno, ao comer zooplâncton, concentra ainda mais.",
      section: "Como o processo funciona",
      quote: "o peixe pequeno a 1",
    },
    {
      label: "4. Peixe grande",
      claim: "O peixe grande, predador do peixe pequeno, chega a dez vezes mais concentração.",
      section: "Como o processo funciona",
      quote: "o peixe grande a 10",
    },
    {
      label: "5. Ave/humano",
      claim: "No topo da cadeia, a ave predadora ou o ser humano recebe a concentração máxima.",
      section: "Como o processo funciona",
      quote: "a ave predadora ou o ser humano a 100 ppm",
    },
  ],
},
{
  chapterId: "biologia-ciclo-do-nitrogenio",
  family: "cadeia-de-derivacao",
  question: "Qual é a sequência de etapas microbianas do ciclo do nitrogênio, da fixação à desnitrificação?",
  items: [
    {
      label: "1. Fixação",
      claim: "Bactérias como Azotobacter e Rhizobium convertem N2 atmosférico em amônia.",
      section: "Etapas microbianas",
      quote: "A fixação converte N2 em amônia, feita por bactérias de vida livre do gênero Azotobacter e, sobretudo, por bactérias do gênero Rhizobium, que vivem em simbiose mutualística nos nódulos das raízes de leguminosas",
    },
    {
      label: "2. Amonificação",
      claim: "Decompositores liberam amônia a partir da matéria orgânica em decomposição.",
      section: "Etapas microbianas",
      quote: "A amonificação é a liberação de amônia a partir da decomposição de matéria orgânica, excretas e cadáveres, feita por bactérias e fungos decompositores.",
    },
    {
      label: "3. Nitrificação I (Nitrosomonas)",
      claim: "Nitrosomonas oxida amônia a nitrito.",
      section: "Etapas microbianas",
      quote: "Nitrosomonas oxida amônia a nitrito",
    },
    {
      label: "4. Nitrificação II (Nitrobacter)",
      claim: "Nitrobacter oxida nitrito a nitrato, forma preferencialmente absorvida pelas raízes.",
      section: "Etapas microbianas",
      quote: "Nitrobacter oxida nitrito a nitrato",
    },
    {
      label: "5. Desnitrificação",
      claim: "Bactérias anaeróbias do gênero Pseudomonas reduzem nitrato a N2, devolvendo-o à atmosfera.",
      section: "Etapas microbianas",
      quote: "bactérias anaeróbias do gênero Pseudomonas reduzem nitrato a N2, devolvendo-o à atmosfera.",
    },
  ],
},
{
  chapterId: "biologia-composicao-quimica-celular-proteinas-e-sua-funcao-estrutural",
  family: "cadeia-de-derivacao",
  question: "Como cada nível de estrutura proteica se constrói sobre o anterior?",
  items: [
    {
      label: "1. Estrutura primária",
      claim: "A sequência linear de aminoácidos, determinada pelo gene, define todos os outros níveis.",
      section: "Os quatro níveis de estrutura",
      quote: "A estrutura primária é a sequência linear de aminoácidos, determinada pelo gene; é o nível que define todos os outros",
    },
    {
      label: "2. Estrutura secundária",
      claim: "A cadeia se enrola localmente em alfa-hélice ou folha beta, por pontes de hidrogênio.",
      section: "Os quatro níveis de estrutura",
      quote: "A secundária é o enrolamento local em alfa-hélice ou folha beta pregueada, mantido por pontes de hidrogênio entre grupos da cadeia principal.",
    },
    {
      label: "3. Estrutura terciária",
      claim: "O dobramento tridimensional global é estabilizado por interações entre os radicais, formando o sítio ativo.",
      section: "Os quatro níveis de estrutura",
      quote: "A terciária é o dobramento tridimensional global, estabilizado por interações entre os radicais — pontes dissulfeto entre cisteínas, interações hidrofóbicas, iônicas e pontes de hidrogênio — e é nela que se forma o sítio ativo das enzimas.",
    },
    {
      label: "4. Estrutura quaternária",
      claim: "Quando há mais de uma cadeia polipeptídica, como na hemoglobina, forma-se a estrutura quaternária.",
      section: "Os quatro níveis de estrutura",
      quote: "A quaternária existe apenas nas proteínas formadas por mais de uma cadeia polipeptídica, e o exemplo obrigatório é a hemoglobina, com quatro cadeias, cada uma com um grupo heme contendo ferro.",
    },
  ],
},
{
  chapterId: "biologia-coordenacao-endocrina-ii",
  family: "cadeia-de-derivacao",
  question: "Como o eixo hipotálamo-hipófise-glândula se fecha pelo feedback negativo?",
  items: [
    {
      label: "1. Hipotálamo",
      claim: "O hipotálamo libera um hormônio liberador.",
      section: "Feedback negativo",
      quote: "O hipotálamo libera um hormônio liberador",
    },
    {
      label: "2. Adeno-hipófise",
      claim: "A adeno-hipófise responde com um hormônio trófico, como TSH ou ACTH.",
      section: "Feedback negativo",
      quote: "a adeno-hipófise responde com o hormônio trófico, como TSH ou ACTH",
    },
    {
      label: "3. Glândula-alvo",
      claim: "A glândula-alvo produz o hormônio final, como tiroxina ou cortisol.",
      section: "Feedback negativo",
      quote: "a glândula-alvo produz o hormônio final, como tiroxina ou cortisol",
    },
    {
      label: "4. Feedback negativo",
      claim: "O hormônio final inibe hipotálamo e hipófise, fechando o circuito.",
      section: "Feedback negativo",
      quote: "esse hormônio final inibe tanto o hipotálamo quanto a hipófise, fechando o circuito",
    },
  ],
},
{
  chapterId: "biologia-coordenacao-nervosa-ii",
  family: "cadeia-de-derivacao",
  question: "Qual é o percurso do arco reflexo, do receptor sensorial ao efetor?",
  items: [
    {
      label: "1. Receptor sensorial",
      claim: "O estímulo é captado por um receptor sensorial na pele ou no músculo.",
      section: "Arco reflexo",
      quote: "receptor sensorial na pele ou no músculo",
    },
    {
      label: "2. Neurônio sensitivo",
      claim: "O neurônio sensitivo, ou aferente, conduz o impulso pela raiz dorsal até a medula.",
      section: "Arco reflexo",
      quote: "neurônio sensitivo, ou aferente, que conduz o impulso pela raiz dorsal até a medula",
    },
    {
      label: "3. Centro integrador",
      claim: "O centro integrador, na substância cinzenta medular, processa o sinal, muitas vezes com um interneurônio.",
      section: "Arco reflexo",
      quote: "centro integrador na substância cinzenta medular, muitas vezes com um interneurônio",
    },
    {
      label: "4. Neurônio motor",
      claim: "O neurônio motor, ou eferente, sai pela raiz ventral.",
      section: "Arco reflexo",
      quote: "neurônio motor, ou eferente, que sai pela raiz ventral",
    },
    {
      label: "5. Efetor",
      claim: "O efetor, músculo ou glândula, executa a resposta.",
      section: "Arco reflexo",
      quote: "efetor, o músculo ou a glândula que responde",
    },
  ],
},
{
  chapterId: "biologia-divisao-celular",
  family: "cadeia-de-derivacao",
  question: "Quais são as fases da mitose, da condensação dos cromossomos à divisão do citoplasma?",
  items: [
    {
      label: "1. Prófase",
      claim: "A cromatina se condensa, o nucléolo desaparece, a carioteca se desfaz e o fuso se organiza.",
      section: "Mitose e ciclo celular",
      quote: "Na prófase, a cromatina se condensa em cromossomos visíveis, o nucléolo desaparece, a carioteca se desfaz e o fuso se organiza.",
    },
    {
      label: "2. Metáfase",
      claim: "Os cromossomos, no grau máximo de condensação, alinham-se na placa equatorial.",
      section: "Mitose e ciclo celular",
      quote: "Na metáfase, os cromossomos, no grau máximo de condensação, alinham-se na placa equatorial",
    },
    {
      label: "3. Anáfase",
      claim: "Os centrômeros se dividem e as cromátides irmãs migram para polos opostos.",
      section: "Mitose e ciclo celular",
      quote: "Na anáfase, os centrômeros se dividem e as cromátides irmãs migram para polos opostos",
    },
    {
      label: "4. Telófase",
      claim: "A carioteca se refaz e os cromossomos se descondensam.",
      section: "Mitose e ciclo celular",
      quote: "Na telófase, a carioteca se refaz e os cromossomos se descondensam.",
    },
  ],
},
{
  chapterId: "biologia-embriologia-animal",
  family: "cadeia-de-derivacao",
  question: "Como o embrião se desenvolve da segmentação até a gastrulação?",
  items: [
    {
      label: "1. Segmentação (clivagem)",
      claim: "Mitoses sucessivas e rápidas dividem o zigoto em blastômeros progressivamente menores.",
      section: "Da fecundação à gástrula",
      quote: "Segue-se a segmentação, ou clivagem: mitoses sucessivas e rápidas, sem crescimento entre elas, de modo que as células resultantes, os blastômeros, ficam progressivamente menores",
    },
    {
      label: "2. Mórula",
      claim: "A segmentação resulta na mórula, maciça, com cerca de dezesseis células.",
      section: "Da fecundação à gástrula",
      quote: "Da segmentação resulta a mórula, maciça, com cerca de dezesseis células",
    },
    {
      label: "3. Blástula",
      claim: "Segue-se a blástula, esférica e oca, com uma cavidade central, a blastocele.",
      section: "Da fecundação à gástrula",
      quote: "a blástula, esférica e oca, com uma cavidade central chamada blastocele",
    },
    {
      label: "4. Gastrulação",
      claim: "Na gastrulação, forma-se o arquêntero e o blastóporo, surgindo os folhetos embrionários.",
      section: "Da fecundação à gástrula",
      quote: "Na gastrulação, a blástula sofre invaginação, forma o arquêntero — intestino primitivo — e o blastóporo, e passa a ter dois e depois três folhetos.",
    },
  ],
},
{
  chapterId: "biologia-eutrofizacao",
  family: "cadeia-de-derivacao",
  question: "Qual é a cadeia de consequências do excesso de nutrientes em um corpo d’água até a mortandade de peixes?",
  items: [
    {
      label: "1. Aporte de nutrientes e floração",
      claim: "O excesso de nutrientes provoca a floração explosiva de algas e cianobactérias.",
      section: "A cadeia de consequências",
      quote: "O aporte de nutrientes provoca a floração — proliferação explosiva de algas e cianobactérias na superfície, o chamado bloom.",
    },
    {
      label: "2. Bloqueio da luz",
      claim: "A camada densa de algas bloqueia a penetração da luz na coluna d’água.",
      section: "A cadeia de consequências",
      quote: "Essa camada densa bloqueia a penetração da luz",
    },
    {
      label: "3. Morte das produtoras submersas",
      claim: "Plantas aquáticas e algas de profundidade morrem por falta de luz.",
      section: "A cadeia de consequências",
      quote: "as produtoras submersas, plantas aquáticas e algas de profundidade, morrem por falta de luz.",
    },
    {
      label: "4. Decomposição",
      claim: "Decompositores aeróbios consomem intensamente o oxigênio dissolvido para degradar a biomassa morta.",
      section: "A cadeia de consequências",
      quote: "entrega uma carga enorme de matéria orgânica aos decompositores aeróbios, cuja atividade intensa consome o oxigênio dissolvido.",
    },
    {
      label: "5. Anoxia",
      claim: "Instala-se a hipóxia e depois a anoxia na água.",
      section: "A cadeia de consequências",
      quote: "Instala-se a hipóxia e depois a anoxia",
    },
    {
      label: "6. Mortandade",
      claim: "Peixes e invertebrados morrem por asfixia.",
      section: "A cadeia de consequências",
      quote: "matando peixes e invertebrados por asfixia",
    },
  ],
},
{
  chapterId: "biologia-fisiologia-vegetal-transporte-no-floema",
  family: "cadeia-de-derivacao",
  question: "Como a hipótese do fluxo por pressão explica o transporte da seiva elaborada da fonte ao dreno?",
  items: [
    {
      label: "1. Carregamento na fonte",
      claim: "Na fonte, a sacarose é carregada ativamente para dentro dos elementos de tubo crivado.",
      section: "A hipótese do fluxo por pressão",
      quote: "Na fonte, tipicamente uma folha fotossintetizante, a sacarose produzida é carregada ativamente, com gasto de ATP, para dentro dos elementos de tubo crivado — é o carregamento do floema.",
    },
    {
      label: "2. Queda do potencial hídrico",
      claim: "A entrada de soluto reduz o potencial hídrico do interior do tubo.",
      section: "A hipótese do fluxo por pressão",
      quote: "Essa entrada de soluto reduz o potencial hídrico do interior do tubo",
    },
    {
      label: "3. Entrada de água por osmose",
      claim: "A água do xilema vizinho entra por osmose, elevando a pressão de turgor.",
      section: "A hipótese do fluxo por pressão",
      quote: "a água do xilema vizinho entra por osmose, elevando a pressão de turgor naquele ponto",
    },
    {
      label: "4. Gradiente de pressão",
      claim: "Estabelece-se um gradiente de pressão entre fonte e dreno, e a seiva flui em massa.",
      section: "A hipótese do fluxo por pressão",
      quote: "Estabelece-se assim um gradiente de pressão entre fonte e dreno, e a seiva flui em massa da região de alta para a de baixa pressão, arrastando os solutos.",
    },
    {
      label: "5. Descarregamento no dreno",
      claim: "No dreno, a sacarose é descarregada e retirada, e a pressão cai.",
      section: "A hipótese do fluxo por pressão",
      quote: "No dreno, um órgão que consome ou armazena, a sacarose é descarregada e retirada, o potencial hídrico interno sobe, a água sai de volta para o xilema e a pressão cai.",
    },
  ],
},
{
  chapterId: "biologia-fisiologia-da-coordenacao-nervosa-i",
  family: "cadeia-de-derivacao",
  question: "Qual é a sequência de eventos na sinapse química, do potencial de ação à remoção do neurotransmissor?",
  items: [
    {
      label: "1. Potencial de ação chega ao terminal axônico",
      claim: "O potencial de ação chega ao terminal axônico e abre canais de cálcio.",
      section: "Sinapse",
      quote: "o potencial de ação chega ao terminal axônico e abre canais de cálcio",
    },
    {
      label: "2. Influxo de Ca2+ e liberação do neurotransmissor",
      claim: "O influxo de Ca2+ faz as vesículas sinápticas se fundirem à membrana e liberarem neurotransmissor.",
      section: "Sinapse",
      quote: "o influxo de Ca2+ faz as vesículas sinápticas se fundirem à membrana e liberarem neurotransmissor na fenda sináptica",
    },
    {
      label: "3. Ligação a receptores e novo potencial",
      claim: "O neurotransmissor se liga a receptores na membrana pós-sináptica e gera um novo potencial.",
      section: "Sinapse",
      quote: "o neurotransmissor difunde-se e se liga a receptores específicos na membrana pós-sináptica, abrindo canais iônicos e gerando um novo potencial",
    },
    {
      label: "4. Remoção do neurotransmissor",
      claim: "O neurotransmissor é removido por recaptação, degradação enzimática ou difusão, encerrando o sinal.",
      section: "Sinapse",
      quote: "Em seguida ele é removido, por recaptação, por degradação enzimática ou por difusão, o que encerra o sinal",
    },
  ],
},
{
  chapterId: "biologia-fisiologia-da-digestao",
  family: "cadeia-de-derivacao",
  question: "Qual é o trajeto do alimento pelas etapas de digestão, do início na boca até o intestino grosso?",
  items: [
    {
      label: "Boca",
      claim: "A amilase salivar inicia a quebra do amido em maltose, em pH levemente alcalino.",
      section: "O trajeto e as enzimas",
      quote: "a amilase salivar, ou ptialina, inicia a quebra do amido em maltose, em pH levemente alcalino",
    },
    {
      label: "Estômago",
      claim: "O suco gástrico ácido desnatura proteínas e ativa o pepsinogênio em pepsina.",
      section: "O trajeto e as enzimas",
      quote: "o suco gástrico tem ácido clorídrico produzido pelas células parietais, que mantém o pH em torno de 2, desnatura proteínas e ativa o pepsinogênio em pepsina",
    },
    {
      label: "Intestino delgado",
      claim: "O suco pancreático traz amilase, lipase, tripsina e quimotripsina para completar a digestão.",
      section: "O trajeto e as enzimas",
      quote: "No intestino delgado, o suco pancreático traz amilase, lipase, tripsina e quimotripsina",
    },
    {
      label: "Intestino grosso",
      claim: "Não há digestão enzimática significativa; a função é absorver água e sais.",
      section: "Intestino grosso e regulação",
      quote: "No intestino grosso não há digestão enzimática significativa; suas funções são a absorção de água e de sais",
    },
  ],
},
{
  chapterId: "biologia-fisiologia-da-excrecao",
  family: "cadeia-de-derivacao",
  question: "Quais são as três etapas, em ordem, que formam a urina no néfron?",
  items: [
    {
      label: "Filtração glomerular",
      claim: "A diferença de calibre entre as arteríolas aferente e eferente gera a pressão que força a filtração.",
      section: "Néfron e formação da urina",
      quote: "A filtração glomerular ocorre por pressão: o sangue chega pela arteríola aferente, mais calibrosa, e sai pela eferente, mais estreita, o que gera pressão suficiente para forçar água e pequenas moléculas através da parede capilar para a cápsula.",
    },
    {
      label: "Reabsorção tubular",
      claim: "Devolve ao sangue praticamente toda a glicose e os aminoácidos, e a maior parte da água e dos sais.",
      section: "Néfron e formação da urina",
      quote: "A reabsorção tubular devolve ao sangue o que é útil: praticamente toda a glicose e os aminoácidos, no túbulo proximal, e a maior parte da água e dos sais.",
    },
    {
      label: "Secreção tubular",
      claim: "Acrescenta ativamente substâncias como H+, K+ e certos medicamentos ao túbulo.",
      section: "Néfron e formação da urina",
      quote: "A secreção tubular acrescenta ativamente ao túbulo substâncias como H+, K+ e certos medicamentos.",
    },
  ],
},
{
  chapterId: "biologia-origem-da-vida-e-as-primeiras-celulas",
  family: "cadeia-de-derivacao",
  question: "Segundo a hipótese heterotrófica, quais etapas levam da síntese abiótica até um sistema capaz de se replicar?",
  items: [
    {
      label: "Síntese abiótica",
      claim: "O experimento de Miller e Urey simulou a atmosfera primitiva e obteve aminoácidos em poucos dias.",
      section: "A hipótese de Oparin e Haldane",
      quote: "O experimento de Miller e Urey, em 1953, simulou essa atmosfera num sistema fechado com descargas elétricas simulando raios, e obteve aminoácidos e outras moléculas orgânicas em poucos dias",
    },
    {
      label: "Polimerização",
      claim: "Monômeros se polimerizaram em macromoléculas na superfície de argilas ou por ciclos de secagem e umedecimento.",
      section: "Dos coacervados às primeiras células",
      quote: "Monômeros (aminoácidos, nucleotídeos) teriam se polimerizado em macromoléculas (proteínas, ácidos nucleicos primitivos) na superfície de argilas minerais ou por ciclos de secagem e umedecimento em poças costeiras.",
    },
    {
      label: "Coacervados",
      claim: "As macromoléculas formaram agregados coloidais que se separavam espontaneamente do meio aquoso.",
      section: "Dos coacervados às primeiras células",
      quote: "Essas macromoléculas, em solução, formaram agregados coloidais chamados coacervados: gotículas que se separam espontaneamente do meio aquoso circundante",
    },
    {
      label: "Sistema de replicação",
      claim: "O mundo de RNA propõe moléculas capazes de guardar informação e catalisar reações, precedendo DNA e proteínas.",
      section: "Dos coacervados às primeiras células",
      quote: "A hipótese do mundo de RNA propõe que moléculas de RNA, capazes tanto de guardar informação quanto de catalisar reações (como certas ribozimas fazem hoje), precederam o DNA e as proteínas nesse papel duplo.",
    },
  ],
},
{
  chapterId: "biologia-traqueofitas-transpiracao-e-reposicao-rapida-de-agua",
  family: "cadeia-de-derivacao",
  question: "Como a teoria da tensão-coesão explica a subida da seiva bruta, do estômato até a raiz?",
  items: [
    {
      label: "Transpiração",
      claim: "A evaporação de água pelos estômatos das folhas é o ponto de partida do mecanismo.",
      section: "A teoria da tensão-coesão",
      quote: "A transpiração — evaporação de água pelos estômatos das folhas —",
    },
    {
      label: "Tensão",
      claim: "A evaporação cria, no topo da coluna de água, uma pressão negativa que se propaga até a raiz.",
      section: "A teoria da tensão-coesão",
      quote: "cria, no topo da coluna de água dentro do xilema, uma pressão negativa (tensão) que se propaga por toda a coluna até a raiz",
    },
    {
      label: "Coesão",
      claim: "As moléculas de água se atraem por pontes de hidrogênio, mantendo a coluna contínua dentro do xilema.",
      section: "A teoria da tensão-coesão",
      quote: "as moléculas de água se atraem entre si por pontes de hidrogênio (coesão), formando uma coluna contínua e praticamente inquebrável dentro dos estreitos vasos do xilema",
    },
    {
      label: "Tração",
      claim: "Essa tração é o que suga mais água das raízes, sem gasto direto de energia metabólica.",
      section: "A teoria da tensão-coesão",
      quote: "é essa tração que suga mais água das raízes, sem gasto direto algum de energia metabólica no processo de transporte em si",
    },
  ],
},
{
  chapterId: "biologia-virus",
  family: "cadeia-de-derivacao",
  question: "Quais são as etapas, em ordem, do ciclo de replicação viral?",
  items: [
    {
      label: "Adsorção",
      claim: "Proteínas na superfície do vírus reconhecem e se ligam a receptores complementares na célula-alvo.",
      section: "Replicação dependente",
      quote: "Na adsorção, proteínas específicas na superfície do vírus reconhecem e se ligam a receptores complementares na membrana da célula-alvo",
    },
    {
      label: "Penetração",
      claim: "O material genético viral entra na célula por fusão de membranas ou endocitose.",
      section: "Replicação dependente",
      quote: "Na penetração, o material genético viral (às vezes com proteínas associadas) entra na célula, por fusão de membranas (vírus envelopados) ou endocitose.",
    },
    {
      label: "Replicação e síntese",
      claim: "O vírus sequestra ribossomos e enzimas da célula hospedeira para produzir cópias do genoma e das proteínas.",
      section: "Replicação dependente",
      quote: "Segue-se a replicação do material genético e a síntese de proteínas virais, sequestrando ribossomos, enzimas e nucleotídeos da própria célula hospedeira para produzir cópias do genoma e das proteínas do capsídeo.",
    },
    {
      label: "Montagem",
      claim: "Novos capsídeos são organizados ao redor de cópias do material genético.",
      section: "Replicação dependente",
      quote: "Na montagem, novos capsídeos são organizados ao redor de cópias do material genético, formando partículas virais completas.",
    },
    {
      label: "Liberação",
      claim: "As partículas saem da célula por lise ou por brotamento.",
      section: "Replicação dependente",
      quote: "Na liberação, as novas partículas saem da célula, seja por lise (rompimento e morte da célula hospedeira, típico de vírus não envelopados) ou por brotamento",
    },
  ],
},
{
  chapterId: "biologia-classificacao-biologica-nomenclatura-cientifica-e-nocoes-de-sistematica-filogenetica",
  family: "escala-de-graus",
  question: "Como a hierarquia taxonômica se organiza do nível mais abrangente ao mais restrito, e por que isso indica parentesco?",
  eixo: "do grau mais baixo de parentesco (domínio, categoria mais abrangente) ao mais alto (espécie, categoria mais restrita, maior parentesco)",
  items: [
    {
      label: "Domínio",
      claim: "A árvore atual mostra que arqueias e eucariontes são mais aparentados entre si do que qualquer um deles é das bactérias.",
      section: "Categorias e nomenclatura",
      quote: "Em três domínios, Bacteria, Archaea e Eukarya, a árvore atual mostra que arqueias e eucariontes são mais aparentados entre si do que qualquer um deles é das bactérias",
    },
    {
      label: "Hierarquia completa",
      claim: "A classificação vai de domínio a espécie, da categoria mais abrangente à mais restrita.",
      section: "Categorias e nomenclatura",
      quote: "domínio, reino, filo, classe, ordem, família, gênero e espécie, da mais abrangente à mais restrita",
    },
    {
      label: "Gênero e espécie",
      claim: "Quanto mais específica a categoria compartilhada, maior o parentesco: mesmo gênero é mais próximo do que mesma família.",
      section: "Categorias e nomenclatura",
      quote: "dois animais do mesmo gênero são mais próximos que dois da mesma família",
    },
  ],
},
{
  chapterId: "biologia-cordados-tetrapodes",
  family: "escala-de-graus",
  question: "Como os cordados tetrápodes se organizam numa escala crescente de independência da água?",
  eixo: "do grau mais baixo de independência da água (anfíbios) ao mais alto (mamíferos)",
  items: [
    {
      label: "Anfíbios",
      claim: "Os anfíbios ainda não se libertaram da água, dependendo dela para respiração cutânea e reprodução.",
      section: "Anfíbios",
      quote: "Os anfíbios são os tetrápodes que ainda não se libertaram da água",
    },
    {
      label: "Répteis e aves",
      claim: "Pele seca, fecundação interna e ovo amniótico libertaram esse conjunto da água.",
      section: "Répteis e aves",
      quote: "A pele é seca e queratinizada, com escamas, o que reduz drasticamente a perda de água mas impede a respiração cutânea — a respiração é exclusivamente pulmonar, com pulmões bem mais compartimentados. A fecundação é interna, condição necessária num ovo que será revestido. E o ovo é amniótico, com casca e quatro anexos embrionários, permitindo o desenvolvimento fora d'água.",
    },
    {
      label: "Mamíferos",
      claim: "Somam-se endotermia, diafragma, hemácias anucleadas, coração de quatro cavidades e heterodontia.",
      section: "Mamíferos",
      quote: "endotermia, o diafragma muscular separando as cavidades torácica e abdominal e responsável pela ventilação, as hemácias anucleadas, o coração de quatro cavidades e a heterodontia",
    },
  ],
},
{
  chapterId: "biologia-plantas-terrestres-i-briofitas-e-pteridofitas",
  family: "escala-de-graus",
  question: "Como briófitas, pteridófitas e a evolução do grão de pólen marcam graus crescentes de independência da água para a reprodução?",
  eixo: "do grau mais baixo de independência da água (briófitas) ao mais alto (plantas com pólen, que dispensam água líquida na fecundação)",
  items: [
    {
      label: "Briófitas",
      claim: "Não têm tecidos condutores verdadeiros nem raiz, caule e folha verdadeiros, apenas estruturas análogas.",
      section: "Briófitas",
      quote: "não têm tecidos condutores especializados (xilema e floema verdadeiros) nem raiz, caule e folha verdadeiros, apenas estruturas análogas chamadas rizoide, cauloide e filoide",
    },
    {
      label: "Pteridófitas",
      claim: "Possuem tecidos condutores verdadeiros, xilema e floema, um avanço evolutivo sobre as briófitas.",
      section: "Pteridófitas",
      quote: "representam um avanço evolutivo importante sobre as briófitas: possuem tecidos condutores verdadeiros, xilema e floema",
    },
    {
      label: "Rumo às sementes",
      claim: "A evolução do grão de pólen dispensa por completo a água líquida como meio de deslocamento do gameta.",
      section: "A dependência da água",
      quote: "a evolução do grão de pólen nas gimnospermas: o gameta masculino passa a ser transportado pelo vento (ou por polinizadores, nas angiospermas) dentro de uma estrutura resistente à dessecação, dispensando por completo a água líquida como meio de deslocamento do gameta",
    },
  ],
},
{
  chapterId: "biologia-sucessao-ecologica",
  family: "escala-de-graus",
  question: "Como a sucessão ecológica progride do estágio pioneiro ao clímax?",
  eixo: "do estágio pioneiro (menor riqueza, biomassa e estabilidade) ao clímax (maior riqueza, biomassa e estabilidade)",
  items: [
    {
      label: "Comunidade pioneira",
      claim: "Formada pelas primeiras espécies, de crescimento rápido, alta dispersão e tolerância a condições adversas.",
      section: "Comunidade pioneira e clímax",
      quote: "A comunidade pioneira é formada pelas primeiras espécies capazes de se estabelecer no ambiente inicial (estéril ou perturbado): organismos de crescimento rápido, alta capacidade de dispersão e tolerância a condições adversas",
    },
    {
      label: "Estágios intermediários",
      claim: "Gramíneas estabilizam o solo e favorecem arbustos, que por sua vez favorecem árvores de crescimento lento.",
      section: "Comunidade pioneira e clímax",
      quote: "gramíneas estabilizam o solo e acumulam matéria orgânica, favorecendo arbustos, que por sua vez criam sombra e condições que favorecem árvores de crescimento mais lento",
    },
    {
      label: "Comunidade clímax",
      claim: "É o estágio final, relativamente estável, em equilíbrio dinâmico com o clima e o solo locais.",
      section: "Comunidade pioneira e clímax",
      quote: "A comunidade clímax é o estágio final, relativamente estável, em equilíbrio dinâmico com as condições climáticas e edáficas locais",
    },
  ],
},
{
  chapterId: "biologia-evolucao-biologica-construcao-historica",
  family: "contraste-de-posicoes",
  question: "Como lamarckismo e darwinismo explicam de modo diferente o surgimento de bactérias resistentes a antibióticos, e qual dos dois é sustentado por evidência?",
  items: [
    {
      label: "Lamarckismo",
      claim: "O uso e desuso e a transmissão dos caracteres adquiridos: modificações obtidas em vida seriam herdadas.",
      section: "Lamarck e a primeira teoria",
      quote: "Ele propôs duas leis. A do uso e desuso: o órgão mais usado se desenvolve, o pouco usado atrofia. E a da transmissão dos caracteres adquiridos: as modificações obtidas em vida seriam passadas aos descendentes.",
    },
    {
      label: "Darwinismo",
      claim: "A variação já existe na população; o ambiente seleciona os mais aptos, que deixam mais descendentes.",
      section: "Darwin e a seleção natural",
      quote: "os organismos produzem mais descendentes do que o ambiente pode sustentar; existe variação entre os indivíduos de uma população; essa variação afeta a sobrevivência e a reprodução, de modo que os mais aptos àquele ambiente deixam mais descendentes; e, como parte da variação é herdável, a composição da população muda ao longo das gerações",
    },
    {
      label: "Veredito da evidência",
      claim: "O experimento de réplica em placas de Lederberg mostrou que a resistência já existia antes do contato com o antibiótico, sustentando o darwinismo.",
      section: "Pratique e confira",
      quote: "A segunda é a sustentada por evidência — o experimento de réplica em placas de Lederberg mostrou que colônias resistentes podiam ser identificadas em placas que nunca haviam tido contato com o antibiótico.",
    },
  ],
},
];

/** Capítulos de Biologia sem cena-âncora, com o motivo. Preenchido com os
 *  gaps da Parte A (capítulos 1-36) e da Parte B (capítulos 37-72).
 *  Motivos e citações completos em
 *  docs/visual-personalizado/15-familias-biologia.md. */
export const biologiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'biologia-alelos-multiplos-e-heranca-dos-grupos-sanguineos',
    motivo:
      'Capítulo é regra de herança e cálculo de probabilidade (ABO, Rh, eritroblastose), não classificação de tipos coexistentes nem cadeia causal única; a única hierarquia real do texto (dominância em série na pelagem de coelhos) é exemplo lateral, não o sistema ABO, que é codominante.',
  },
  {
    chapterId:
      'biologia-arquitetura-corporal-dos-animais-e-o-filo-dos-platelmintos-e-dos-nematodeos',
    motivo:
      'Os três critérios de anatomia comparada (simetria, folhetos, celoma) são eixos analíticos, não uma grade de dois eixos com quatro células nem uma tipologia de variantes coexistentes sob um único critério; a comparação platelminto/nematódeo é lista de diferenças, não rejeição explícita de posição teórica.',
  },
  {
    chapterId: 'biologia-artropodes-aracnideos',
    motivo:
      'Catálogo de características do grupo, importância médica por espécie e papel ecológico; nenhuma seção organiza o conteúdo como tipos coexistentes sob critério comum, cadeia causal ou escala de grau.',
  },
  {
    chapterId: 'biologia-artropodes-insetos-crustaceos-e-miriapodes',
    motivo:
      'Catálogo de grupos (insetos, crustáceos, quilópodes, diplópodes) com traços próprios, sem guarda-chuva classificatório explícito além do filo em si; a variação de peças bucais dos insetos é citada mas não é o eixo do capítulo.',
  },
  {
    chapterId: 'biologia-biotecnologia',
    motivo:
      'Três blocos de técnicas independentes (DNA recombinante, PCR/sequenciamento, transgenia/clonagem/CRISPR) sem classificação, cadeia ou escala que atravesse o capítulo inteiro; cada bloco tem lógica interna própria, sem fio único que os amarre.',
  },
  {
    chapterId: 'biologia-ciclos-biogeoquimicos-ciclo-do-carbono',
    motivo:
      'Reservatórios e fluxos bidirecionais (fotossíntese retira, respiração devolve), não uma cadeia linear de derivação nem uma base fixa que condiciona camadas posteriores; o capítulo é sobre equilíbrio entre compartimentos, não sequência ou hierarquia.',
  },
  {
    chapterId: 'biologia-citoplasma-estrutura-e-componentes-i',
    motivo:
      'Mistura modelo de membrana, mecânica da osmose e catálogo de organelas (retículo, Golgi, ribossomos) sem família que cubra as três partes; forçar tipologia só para o transporte de membrana deixaria de fora as organelas, que são o resto do capítulo.',
  },
  {
    chapterId: 'biologia-citoplasma-estrutura-e-componentes-ii',
    motivo:
      'Mitocôndria/cloroplasto, lisossomos/peroxissomos e citoesqueleto são três blocos de organelas com lógicas próprias; o guarda-chuva de tipologia do citoesqueleto ("três tipos de filamento") cobre uma seção, não o capítulo inteiro.',
  },
  {
    chapterId: 'biologia-composicao-quimica-celular-compostos-inorganicos',
    motivo:
      'Água e sais minerais são descritos por propriedades e funções nominais por íon, não por classificação com critério comum, cadeia causal ou escala; a divisão binária de sais em imobilizados/dissolvidos é rasa demais para sustentar tipologia sozinha, e o resto do capítulo não segue essa divisão.',
  },
  {
    chapterId: 'biologia-coordenacao-endocrina-i',
    motivo:
      'Catálogo de glândulas e hormônios (hipófise, tireoide, paratireoides, pâncreas) com mecanismos próprios cada um; o eixo de retroalimentação que uniria o capítulo só é explicitado no capítulo seguinte, Coordenação Endócrina II.',
  },
  {
    chapterId: 'biologia-coracao-e-vasos-sanguineos',
    motivo:
      'Os três adjetivos da circulação (fechada/dupla/completa), a distinção artéria/veia por sentido do fluxo e o ciclo cardíaco são conteúdo que nenhuma das oito famílias testa; não há tipos coexistentes sob critério comum, cadeia de derivação nem escala de grau.',
  },
  {
    chapterId: 'biologia-fisiologia-vegetal-hormonios-vegetais',
    motivo:
      'Cinco hormônios (auxinas, giberelinas, citocininas, etileno, ácido abscísico), cada um com mecanismo e efeitos próprios; não há frase-guarda-chuva que os apresente como tipos de uma mesma categoria com critério comum, e os mecanismos citados são explicações causais pontuais, não uma cadeia única.',
  },
  {
    chapterId: 'biologia-fisiologia-da-respiracao',
    motivo:
      'Três blocos técnicos independentes (mecânica da ventilação, transporte de gases pela hemoglobina e bicarbonato, controle bulbar pelo CO2) sem classificação, cadeia ou escala que atravesse o capítulo inteiro; cada bloco explica um mecanismo fisiológico próprio, sem fio único que os amarre.',
  },
  {
    chapterId: 'biologia-fisiologia-da-sustentacao-e-da-locomocao',
    motivo:
      'A tipologia dos três esqueletos (hidrostático, exo, endo) cobre só a primeira seção; as seções de articulações/tendões e de contração muscular são catálogo e mecanismo, não tipos coexistentes sob o mesmo critério, cadeia nem escala — forçar tipologia para o capítulo inteiro deixaria de fora a maior parte do conteúdo.',
  },
  {
    chapterId: 'biologia-histologia-e-morfologia-vegetal',
    motivo:
      'Três blocos de tecido com lógicas próprias (meristemas por posição/efeito, revestimento e sustentação, xilema×floema) sem um critério único que os classifique juntos; a comparação xilema×floema é a mais forte, mas não é tipologia de variantes coexistentes nem cadeia, e não estende às outras duas seções.',
  },
  {
    chapterId: 'biologia-morfofisiologia-vegetal-caules-e-folhas',
    motivo:
      'O capítulo bundla dois órgãos com tipologias próprias e não relacionadas (tipos de caule — rizoma, tubérculo, bulbo, estipe, colmo, tronco — e adaptações foliares por ambiente — xerófitas, hidrófitas, halófitas), separados por uma seção puramente descritiva de histologia foliar que não é tipológica; nenhum critério único une caule e folha.',
  },
  {
    chapterId: 'biologia-introducao-aos-cordados-e-os-peixes',
    motivo:
      'A definição conjuntiva dos cordados (quatro características presentes em algum momento do desenvolvimento) cobre só a primeira seção; as duas seções seguintes, sobre peixes cartilaginosos/ósseos e osmorregulação por ambiente, são conteúdo diferente que a definição de cordados não organiza — nenhuma família cobre os três blocos juntos.',
  },
  {
    chapterId: 'biologia-introducao-a-ecologia',
    motivo:
      'Dois eixos independentes e igualmente centrais: os níveis de organização encaixados (espécie a biosfera, uma escala) e a cadeia trófica com a regra dos 10% (um encadeamento de energia); nenhuma das duas famílias cobre a outra metade do capítulo, e forçar uma deixaria a outra de fora.',
  },
  {
    chapterId: 'biologia-introducao-a-genetica',
    motivo:
      'Vocabulário mendeliano básico e cálculo de cruzamento monoíbrido nas duas primeiras seções, sem classificação, cadeia ou escala; a lista de exceções ao modelo simples (dominância incompleta, codominância, polialelia, interação gênica, herança quantitativa) é tipologia real mas só da última seção, não do capítulo.',
  },
  {
    chapterId: 'biologia-ligacao-genica',
    motivo:
      'Conteúdo é procedimento de cálculo (frequência de recombinação, mapeamento, ordem de genes) com ressalvas estatísticas, no mesmo padrão de "regra e cálculo de probabilidade" que motivou a lacuna de Alelos Múltiplos na Parte A; não é uma cadeia de elos coexistentes nem uma classificação.',
  },
  {
    chapterId: 'biologia-membranas-celulares',
    motivo:
      'Barreira seletiva, modelo do mosaico fluido com tipos de transporte e leitura de tonicidade formam uma explicação mecanística contínua, não tipos coexistentes sob critério comum; forçar tipologia só no par passivo×ativo do transporte deixaria de fora a fronteira seletiva e a tonicidade, que são o resto do capítulo.',
  },
  {
    chapterId: 'biologia-mutacoes-cromossomicas-e-gametogenese',
    motivo:
      'Três tipologias distintas e desconectadas (mutação estrutural×numérica; espermatogênese×ovogênese; catálogo de síndromes) sob títulos e critérios diferentes, igual ao padrão que gerou a lacuna do Citoplasma II na Parte A; nenhuma cobre o capítulo inteiro nem se estende às demais.',
  },
  {
    chapterId: 'biologia-nucleo-celular',
    motivo:
      'Mistura catálogo de estruturas (carioteca, poros, nucléolo), estados de condensação da cromatina e mecanismo de transcrição sem família que cubra as três partes — mesmo padrão do Citoplasma I/II na Parte A, que também combinam estrutura e mecanismo sem guarda-chuva único.',
  },
  {
    chapterId: 'biologia-plantas-terrestres-ii-gimnospermas-e-angiospermas',
    motivo:
      'A escala de independência da água entre gimnospermas e angiospermas (continuação do eixo de Plantas Terrestres I) cobre só as duas primeiras seções; a terceira seção classifica monocotiledôneas×eudicotiledôneas por um critério totalmente diferente (número de cotilédones), quebrando a unidade em torno de um único eixo.',
  },
  {
    chapterId: 'biologia-poluicao-do-ar',
    motivo:
      'Catálogo de poluentes com fontes e efeitos distintos, mais dois fenômenos bundled (chuva ácida, inversão térmica) e o contraste de papel do ozônio por altitude; nenhuma família cobre o capítulo inteiro, e cada seção tem lógica causal própria e não conectada às demais.',
  },
  {
    chapterId: 'biologia-poluicao-aquecimento-global-pops-e-biorremediacao',
    motivo:
      'Três blocos independentes (efeito estufa/aquecimento, POPs, biorremediação); os POPs têm três critérios conjuntivos genuínos ("compartilham três propriedades perigosas... reconhecer essa combinação é o núcleo do tema"), mas isso cobre só uma seção — o capítulo inteiro reúne três assuntos ambientais distintos sob o título "Poluição", sem fio único.',
  },
  {
    chapterId: 'biologia-poriferos-e-cnidarios',
    motivo:
      'O salto organizacional poríferos→cnidários é escala com apenas dois itens e não inclui a tipologia pólipo×medusa da terceira seção; nenhuma das duas famílias cobre o capítulo inteiro, e forçar uma deixaria a outra de fora.',
  },
  {
    chapterId: 'biologia-procariotos',
    motivo:
      'Três tipologias desconectadas sob critérios diferentes (Gram+/−; duas classificações metabólicas por fonte de energia e por necessidade de O2; três mecanismos de variabilidade genética) — mesmo padrão de citoplasma-ii na Parte A: cada bloco é catálogo com lógica própria, nenhum se estende ao capítulo inteiro.',
  },
  {
    chapterId: 'biologia-proteinas-enzimas',
    motivo:
      'O corpo do capítulo (catálise, encaixe induzido, curvas de temperatura e pH) é explicação mecanística contínua; só a última seção tem tipologia real (inibição competitiva×não competitiva), e ela não organiza o resto do capítulo.',
  },
  {
    chapterId: 'biologia-reproducao-humana-e-metodos-contraceptivos',
    motivo:
      'Três blocos com naturezas diferentes (comparação anatômica homem×mulher, cadeia hormonal do ciclo menstrual, tipologia dos métodos contraceptivos por mecanismo); os métodos contraceptivos por si sós seriam tipologia legítima, mas não cobrem a anatomia nem o ciclo, que são a maior parte do capítulo.',
  },
  {
    chapterId: 'biologia-segunda-lei-de-mendel',
    motivo:
      'Conteúdo é enunciado da lei e procedimento de cálculo combinatório (proporção 9:3:3:1, potência de 2 para gametas), no mesmo padrão de regra-e-cálculo que motivou a lacuna de Alelos Múltiplos na Parte A; não há classificação, cadeia de elos nem escala de grau.',
  },
  {
    chapterId: 'biologia-sistemas-sensoriais-visao-e-audicao',
    motivo:
      'O capítulo bundla dois sentidos diferentes: visão, com uma tipologia real de defeitos (miopia, hipermetropia, presbiopia), e audição, com uma cadeia de transdução real em três etapas anatômicas; nenhuma das duas famílias cobre o outro sentido, e o título já anuncia dois assuntos, não um.',
  },
  {
    chapterId: 'biologia-acidos-nucleicos',
    motivo:
      'Três blocos com lógicas diferentes: comparação estrutural DNA×RNA (não classificação nem cadeia), mecanismo de replicação semiconservativa (cadeia interna própria: helicase, polimerase, fita líder/tardia) e o dogma central transcrição→tradução (outra cadeia, mas de conversão de informação, não de cópia de DNA); o texto não liga replicação a transcrição como elos de uma mesma sequência, e inventar essa ligação seria fabricar o que a fonte não diz.',
  },
];
