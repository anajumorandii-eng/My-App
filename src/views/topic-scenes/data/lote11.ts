import type { SceneEntry } from '../types';

// Recortes do Lote 11 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
export const ENTRIES_LOTE11: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-terrorismo-internacional',
    family: 'cadeia-de-derivacao',
    question: 'Por que o terrorismo é difícil de definir e, hoje, também de detectar?',
    items: [
      {
        label: 'Rótulo em disputa',
        claim: 'Sem definição universal, o mesmo grupo armado pode ser chamado de terrorista por um governo e de resistência legítima por outro.',
        section: 'Definição e disputa do termo',
        quote: 'grupos armados que recorrem a táticas de violência contra civis podem ser classificados como terroristas por um governo e como resistência legítima por outro',
      },
      {
        label: 'Rede hierárquica (2001)',
        claim: 'O 11 de setembro foi coordenado por uma rede centralizada, a Al-Qaeda, e desencadeou a "guerra ao terror".',
        section: 'Trajetória recente',
        quote: 'Os ataques de 11 de setembro de 2001 nos Estados Unidos, coordenados pela rede Al-Qaeda, provocaram resposta militar americana em escala global',
      },
      {
        label: 'Células e atores isolados',
        claim: 'Depois do Estado Islâmico, pesam as células pequenas e os atores isolados radicalizados pela internet, difíceis de detectar.',
        section: 'Trajetória recente',
        quote: 'o terrorismo contemporâneo frequentemente se manifesta também por meio de atores isolados ou pequenas células radicalizadas majoritariamente pela internet',
      },
      {
        label: 'Custos além das vítimas',
        claim: 'Vigilância cara, liberdades civis restringidas e polarização social também são consequências do terrorismo.',
        section: 'Causas e consequências',
        quote: 'incluem custos econômicos elevados de segurança e vigilância, restrições a liberdades civis justificadas por políticas antiterrorismo',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geografia-das-religioes',
    family: 'tipologia',
    question: 'Por que onde uma religião nasceu não é onde ela está hoje, e como ela pesa no território e no Estado?',
    items: [
      {
        label: 'Cristianismo se espalha',
        claim: 'Nasce no Oriente Médio, chega à Europa pelo Império Romano e às Américas e à África pela colonização europeia.',
        section: 'Distribuição espacial',
        quote: 'O cristianismo, originado no Oriente Médio, expandiu-se pela Europa a partir do Império Romano e, posteriormente, pela colonização europeia das Américas, África e partes da Ásia e Oceania',
      },
      {
        label: 'Islã: maioria na Ásia',
        claim: 'Nasce na Península Arábica, mas o país com mais muçulmanos hoje é a Indonésia; o hinduísmo, pouco proselitista, fica na Índia.',
        section: 'Distribuição espacial',
        quote: 'a Indonésia é hoje o país com mais muçulmanos do mundo, superando países árabes em número absoluto de fiéis',
      },
      {
        label: 'Jerusalém',
        claim: 'Sagrada para judeus, cristãos e muçulmanos, a cidade tem a soberania entre os pontos mais sensíveis do conflito israelo-palestino.',
        section: 'Religião e território',
        quote: 'o que torna a questão de soberania sobre a cidade um dos pontos mais sensíveis do conflito israelo-palestino',
      },
      {
        label: 'Laicidade: lei × prática',
        claim: 'Irã teocrático, França laica e restritiva, Brasil laico no papel e com forte presença religiosa na política.',
        section: 'Laicidade e conflitos',
        quote: 'laicidade formal (ausência de religião oficial) e laicidade substantiva (real distância entre religião e política) nem sempre coincidem na prática de cada país',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-tensoes-geopoliticas-na-europa',
    family: 'cadeia-de-derivacao',
    question: 'Como fronteiras do século XX, a guerra na Ucrânia e os separatismos redesenham a Europa?',
    items: [
      {
        label: 'Fronteiras do século XX',
        claim: 'Versalhes, o pós-Segunda Guerra e o fim da URSS e da Iugoslávia redesenharam o mapa; a divisão tcheca foi pacífica, a iugoslava, violenta.',
        section: 'Heranças e fronteiras',
        quote: 'A dissolução da União Soviética e da Iugoslávia nos anos 1990 criou uma série de novos Estados independentes na Europa Oriental e nos Bálcãs',
      },
      {
        label: 'Ucrânia: 2014 → 2022',
        claim: 'A anexação da Crimeia e o conflito limitado no Donbass precederam em oito anos a invasão em larga escala.',
        section: 'Pegadinhas frequentes',
        quote: 'a anexação e o conflito limitado no Donbass precederam por oito anos a invasão russa em larga escala de 2022',
      },
      {
        label: 'Finlândia e Suécia na Otan',
        claim: 'A invasão levou dois países historicamente neutros a aderir à Otan, efeito oposto ao objetivo declarado pela Rússia.',
        section: 'Guerra na Ucrânia',
        quote: 'levando países historicamente neutros como Finlândia e Suécia a solicitarem e obterem adesão à Otan',
      },
      {
        label: 'Escócia × Catalunha',
        claim: 'O referendo escocês de 2014 teve aval de Londres e deu "não"; o catalão de 2017 foi considerado ilegal por Madri.',
        section: 'Pegadinhas frequentes',
        quote: 'o referendo escocês de 2014 teve aprovação prévia do governo britânico central; o catalão de 2017 foi considerado ilegal pelo governo espanhol',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geopolitica-e-geoeconomia-da-america-latina',
    family: 'cadeia-de-derivacao',
    question: 'Por que a América Latina volta a depender de matéria-prima, agora vendida à China?',
    items: [
      {
        label: 'Pauta primário-exportadora',
        claim: 'Da prata de Potosí e do ouro de Minas ao café, cobre, petróleo, carne e grãos: vender matéria-prima deixa a região exposta aos preços.',
        section: 'Formação e dependência',
        quote: 'café brasileiro, cobre chileno, petróleo venezuelano, carne e grãos argentinos',
      },
      {
        label: 'Substituição de importações',
        claim: 'Entre 1930 e 1970, Brasil, Argentina e México protegeram a indústria nacional com tarifas, com resultados parciais.',
        section: 'Formação e dependência',
        quote: 'entre as décadas de 1930 e 1970, políticas de industrialização por substituição de importações em países como Brasil, Argentina e México',
      },
      {
        label: 'Mercosul × Aliança do Pacífico',
        claim: 'Dois blocos, duas orientações: um mais protecionista, outro mais liberal no comércio exterior.',
        section: 'Pegadinhas frequentes',
        quote: 'Mercosul e Aliança do Pacífico representam abordagens divergentes, mais protecionista e mais liberal respectivamente',
      },
      {
        label: 'China e reprimarização',
        claim: 'A demanda chinesa puxa petróleo, minério e soja, e a China supera os EUA como parceiro de Brasil e Chile.',
        section: 'Desafios contemporâneos',
        quote: 'superando os Estados Unidos em volume de comércio com países como Brasil e Chile',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-africa-no-mundo-atual',
    family: 'cadeia-de-derivacao',
    question: 'Por que a África de hoje ainda carrega as fronteiras de Berlim e disputa os próprios recursos?',
    items: [
      {
        label: 'Fronteiras de Berlim',
        claim: 'Traçadas por potências europeias em 1884-1885, as fronteiras dividiram grupos unidos e juntaram grupos rivais.',
        section: 'Herança colonial',
        quote: 'Essa arbitrariedade fronteiriça dividiu grupos étnicos historicamente unidos entre múltiplos países e uniu, dentro de um mesmo país, grupos com histórico de rivalidade ou pouca identidade compartilhada',
      },
      {
        label: 'Mais de 50 trajetórias',
        claim: 'Ruanda e Botsuana crescem, Lagos e Nairóbi se expandem, e a população mais jovem do planeta é oportunidade e desafio.',
        section: 'Diversidade e dinamismo',
        quote: 'A população africana é a mais jovem do planeta em termos demográficos',
      },
      {
        label: 'Empréstimo chinês',
        claim: 'A China financia estradas, ferrovias e portos com empréstimos garantidos por recursos: infraestrutura real e risco de dívida.',
        section: 'Recursos e disputas externas',
        quote: 'financiando estradas, ferrovias e portos por meio de empréstimos frequentemente garantidos por acesso a recursos minerais e energéticos',
      },
      {
        label: 'Maldição dos recursos',
        claim: 'Cobalto no Congo, petróleo na Nigéria e em Angola: riqueza mineral pode vir com instabilidade e corrupção.',
        section: 'Recursos e disputas externas',
        quote: 'países ricos em recursos naturais específicos frequentemente apresentam instabilidade política, corrupção e desenvolvimento econômico mais lento',
      },
    ],
  },
];
