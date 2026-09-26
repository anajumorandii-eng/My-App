import type { SceneEntry } from '../types';

// Recortes do Lote 16 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
//
// As duas hidrografias abriam com a mesma cena de bacia, e as duas
// biogeografias com a mesma configuração — a da I ainda dizia que o resumo
// "não lista os biomas", quando ele é organizado bioma por bioma. Aqui cada
// capítulo tem recortes próprios, tirados só das seções dele.
export const ENTRIES_LOTE16: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-hidrogeografia-mundial',
    family: 'cadeia-de-derivacao',
    question: 'Por que o rio mais longo não é o de mais água, e quando um rio vira disputa?',
    items: [
      {
        label: 'Extensão × vazão',
        claim: 'O Nilo é o mais extenso; a Amazônica, mais curta, despeja muito mais água porque atravessa região de chuva intensa.',
        section: 'Pegadinhas frequentes',
        quote: 'a Amazônia, embora mais curta que o Nilo, descarrega volume de água muito superior por atravessar região de pluviosidade muito mais intensa',
      },
      {
        label: 'Nilo no deserto',
        claim: 'Atravessando regiões áridas, o Nilo concentra a população e a agricultura do Egito numa faixa estreita.',
        section: 'Os grandes rios e bacias',
        quote: 'tornando-se fonte quase exclusiva de água para o Egito, onde praticamente toda a população e agricultura se concentram numa faixa estreita ao longo de seu vale e delta',
      },
      {
        label: 'Barragem a montante',
        claim: 'Quem represa as cabeceiras altera a vazão que chega aos países a jusante, e com ela a pesca e a agricultura.',
        section: 'Usos e conflitos',
        quote: 'barragens construídas pela China nas cabeceiras alteram o regime de vazão que chega aos países a jusante, afetando a pesca e a agricultura de milhões de pessoas no Laos, na Tailândia, no Camboja e no Vietnã',
      },
      {
        label: 'Estresse hídrico',
        claim: 'Abaixo de mil m³ de água renovável por habitante ao ano, o país está em estresse hídrico severo; a irrigação é o maior consumo.',
        section: 'Disponibilidade e estresse hídrico',
        quote: 'com disponibilidade de água doce renovável por habitante abaixo de mil metros cúbicos por ano, o limiar considerado crítico',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-hidrogeografia-do-brasil',
    family: 'tipologia',
    question: 'Para que serve cada grande bacia brasileira, e por que o São Francisco foi transposto?',
    items: [
      {
        label: 'Amazônica: rio é estrada',
        claim: 'A maior bacia do país é a principal via de transporte numa região com poucas estradas.',
        section: 'Usos dos rios',
        quote: 'Na Amazônia, os rios são historicamente a principal via de transporte de pessoas e mercadorias, dada a baixa densidade de estradas na região',
      },
      {
        label: 'Paraná: escada de usinas',
        claim: 'Uma sucessão de grandes usinas, Itaipu entre elas, faz da bacia o maior parque hidrelétrico do país.',
        section: 'Usos dos rios',
        quote: 'Na bacia do Paraná, a geração hidrelétrica domina o uso econômico, com uma sucessão de grandes usinas ao longo do curso principal e de seus afluentes',
      },
      {
        label: 'Semiárido: rio intermitente',
        claim: 'No semiárido, o rio secar parte do ano é a norma; açudes e cisternas guardam a chuva para os meses secos.',
        section: 'Usos dos rios',
        quote: 'o que motivou historicamente a construção de açudes e cisternas para armazenamento de água durante o período chuvoso, garantindo reserva para os meses secos',
      },
      {
        label: 'Transposição',
        claim: 'Dois eixos de canais levam parte do São Francisco ao Nordeste Setentrional; defensores e críticos pesam benefício e impacto.',
        section: 'Aquíferos e transposição',
        quote: 'desviou parte da vazão do rio por meio de dois eixos de canais para abastecer bacias do Nordeste Setentrional (Ceará, Rio Grande do Norte, Paraíba e Pernambuco)',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-biogeografia-do-brasil-i',
    family: 'tipologia',
    question: 'O que molda a Amazônia, a Mata Atlântica, o Cerrado e a Caatinga?',
    items: [
      {
        label: 'Amazônia em andares',
        claim: 'Dossel, sub-bosque e solo recebem cada vez menos luz; a estratificação abriga espécies em nichos diferentes.',
        section: 'Amazônia e Mata Atlântica',
        quote: 'essa estratificação vertical complexa é o que sustenta a coexistência de um número extraordinário de espécies em nichos ecológicos específicos',
      },
      {
        label: 'Mata Atlântica em fragmentos',
        claim: 'Primeira atingida pela colonização e pela expansão no litoral, restou em fragmentos, cada um valioso pelas espécies endêmicas.',
        section: 'Amazônia e Mata Atlântica',
        quote: 'com menos de 15% de sua cobertura original ainda preservada',
      },
      {
        label: 'Cerrado: raiz e casca',
        claim: 'Raízes profundas vencem o solo pobre e a seca longa; a casca grossa resiste ao fogo que faz parte do bioma.',
        section: 'Cerrado e Caatinga',
        quote: 'com raízes profundas adaptadas a um solo historicamente pobre em nutrientes e a uma estação seca prolongada',
      },
      {
        label: 'Caatinga: seca e chuva',
        claim: 'Na seca, a vegetação perde as folhas para poupar água; com a chuva irregular, a Caatinga floresce rápido.',
        section: 'Cerrado e Caatinga',
        quote: 'com vegetação caducifólia (que perde as folhas na estação seca, reduzindo a perda de água por transpiração)',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-biogeografia-do-brasil-ii',
    family: 'tipologia',
    question: 'Como a cheia, o campo e o litoral organizam o Pantanal, o Pampa e os manguezais?',
    items: [
      {
        label: 'Pulso de inundação',
        claim: 'A cheia espalha a água; a seca prende os peixes em poças, e ali se concentram aves e jacarés.',
        section: 'Pantanal, Pampa e transições',
        quote: 'tem seu regime ecológico inteiramente ditado pelo pulso de inundação sazonal',
      },
      {
        label: 'Pampa: campo nativo',
        claim: 'Campo de gramíneas onde a pecuária extensiva pode coexistir; a lavoura de soja converte o campo nativo.',
        section: 'Conservação',
        quote: 'o Pampa sofre conversão progressiva para lavouras de grãos (soja, especialmente)',
      },
      {
        label: 'Manguezal: berçário',
        claim: 'Peixes e crustáceos passam a fase juvenil entre as raízes antes do mar aberto; o mangue ainda protege a costa.',
        section: 'Formações litorâneas',
        quote: 'manguezais funcionam como berçários naturais para inúmeras espécies de peixes e crustáceos',
      },
      {
        label: 'Fogo no Pantanal',
        claim: 'Os grandes incêndios recentes não são só naturais: três fatores humanos os agravam.',
        section: 'Pegadinhas frequentes',
        quote: 'têm sido significativamente agravados por fatores humanos específicos (manejo inadequado do fogo, mudanças climáticas de origem antrópica, drenagem artificial de áreas úmidas)',
      },
    ],
  },
];
