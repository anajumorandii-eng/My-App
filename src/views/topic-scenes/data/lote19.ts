import type { SceneEntry } from '../types';

// Recortes do Lote 19 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
//
// Espaço Industrial Brasileiro II não traz mais "comando concentrado / sedes"
// nem "mercado consumidor e capital inicial": o instrumento antigo mostrava
// os dois, e nenhum está no resumo do capítulo (auditoria de 26/09).
export const ENTRIES_LOTE19: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-industria-ii',
    family: 'cadeia-de-derivacao',
    question: 'Por que a produção se espalha pelo mundo e, ao mesmo tempo, se aglomera em certos lugares?',
    items: [
      {
        label: 'Deslocalização',
        claim: 'Os países desenvolvidos mantêm design, P&D e marketing e transferem a manufatura intensiva em mão de obra para onde o trabalho custa menos.',
        section: 'Nova geografia industrial',
        quote: 'mantiveram etapas de maior valor agregado (design, pesquisa e desenvolvimento, marketing) em seu território, enquanto transferiram etapas de manufatura intensiva em mão de obra para países com custos trabalhistas menores',
      },
      {
        label: 'Cluster',
        claim: 'Universidade, capital de risco e empresas vizinhas: ideias circulam entre concorrentes pela mobilidade de profissionais — o transbordamento de conhecimento.',
        section: 'Tecnopolos e clusters',
        quote: 'ideias e inovações circulam mais rapidamente entre empresas próximas fisicamente, mesmo concorrentes entre si, por meio da mobilidade de profissionais entre empresas',
      },
      {
        label: 'Economia circular',
        claim: 'Contra o modelo linear "extrair, produzir, descartar": o resíduo de um processo vira insumo de outro, e reparo e reuso prolongam a vida do produto.',
        section: 'Indústria e ambiente',
        quote: 'busca reintegrar resíduos de um processo produtivo como insumo de outro, prolongar a vida útil de produtos por meio de reparo e reuso, e reduzir a extração de matéria-prima virgem',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-gedeconomia-mundial',
    family: 'tipologia',
    question: 'Como comércio, tecnologia e moeda viram instrumentos de pressão entre Estados?',
    items: [
      {
        label: 'Chips e terras-raras',
        claim: 'Os EUA restringem chips avançados e litografia EUV à China; a China controla extração e refino de terras-raras. A cadeia de suprimento vira campo de batalha.',
        section: 'Economia e poder',
        quote: 'os EUA restringiram a exportação de semicondutores avançados e equipamentos de litografia extrema ultravioleta',
      },
      {
        label: 'Tarifas de 2018',
        claim: 'Tarifas dos EUA sobre produtos chineses buscavam reduzir o déficit comercial e pressionar contra subsídios e transferência forçada de tecnologia.',
        section: 'Instrumentos',
        quote: 'as tarifas impostas pelos Estados Unidos sobre produtos chineses a partir de 2018 buscavam reduzir o déficit comercial americano',
      },
      {
        label: 'Sanções de 2022',
        claim: 'Após a invasão da Ucrânia, as sanções ocidentais congelaram reservas russas no exterior e tiraram bancos russos do SWIFT.',
        section: 'Instrumentos',
        quote: 'incluíram o congelamento de reservas do banco central russo mantidas no exterior e a exclusão de bancos russos do sistema SWIFT',
      },
      {
        label: 'Desdolarização',
        claim: 'Moedas locais, sistemas alternativos ao SWIFT e ouro tentam reduzir a dependência do dólar, que ainda domina reservas e comércio.',
        section: 'Moeda e finanças',
        quote: 'Esse movimento ainda é limitado — o dólar continua respondendo pela maior parte das reservas internacionais e das transações de comércio global',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-o-espaco-agrario-brasileiro',
    family: 'camadas-de-determinacao',
    question: 'Como terra concentrada, técnica e fronteira agrícola moldam o campo brasileiro e seus conflitos?',
    items: [
      {
        label: 'Estrutura fundiária',
        claim: 'O latifúndio ocupa a maior parte da área e exporta commodities; a agricultura familiar, com menos terra, abastece o mercado interno de alimentos básicos.',
        section: 'Estrutura fundiária',
        quote: 'ocupam a maior parte da área agrícola total do país, enquanto a agricultura familiar, apesar de ocupar proporcionalmente menos terra, responde por parcela expressiva da produção de alimentos básicos consumidos internamente',
      },
      {
        label: 'Revolução do Cerrado',
        claim: 'Solo ácido e pobre corrigido com calcário e adubação: a região de baixo potencial vira o principal polo de grãos do país.',
        section: 'Modernização e fronteira agrícola',
        quote: 'por meio de calagem (aplicação de calcário) e adubação intensiva, transformou uma região antes considerada de baixo potencial agrícola no principal polo de produção de grãos do país',
      },
      {
        label: 'Matopiba',
        claim: 'A fronteira avança do Centro-Sul ao Centro-Oeste e, mais recentemente, ao Matopiba, muitas vezes sobre vegetação nativa de Cerrado.',
        section: 'Modernização e fronteira agrícola',
        quote: 'mais recentemente, ao chamado "Matopiba" (a fronteira agrícola que abrange partes do Maranhão, Tocantins, Piauí e Bahia)',
      },
      {
        label: 'Conflitos pela terra',
        claim: 'MST pressiona por reforma agrária; grilagem com documento falso avança na fronteira, sobretudo na Amazônia; demarcação e regularização têm sucesso desigual.',
        section: 'Conflitos e políticas',
        quote: 'A grilagem de terras (apropriação ilegal de terras públicas por meio de documentação falsificada) segue sendo problema estrutural em áreas de fronteira agrícola recente',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-o-espaco-industrial-brasileiro-ii',
    family: 'cadeia-de-derivacao',
    question: 'Por que a indústria saiu em parte de São Paulo e por que perdeu peso no PIB antes da hora?',
    items: [
      {
        label: 'Desconcentração',
        claim: 'A RMSP saturada empurra; infraestrutura e incentivos de outros estados atraem. São Paulo perde peso relativo, mas segue com a maior participação.',
        section: 'Desconcentração industrial',
        quote: 'reduziu gradualmente o peso relativo de São Paulo na produção industrial nacional, embora o estado ainda mantenha a maior participação isolada',
      },
      {
        label: 'Guerra fiscal',
        claim: 'Estados disputam montadoras cortando ICMS: surgem polos no Nordeste e no Sul, mas com perda de arrecadação e disputa judicial.',
        section: 'Guerra fiscal e polos',
        quote: 'principalmente isenções ou reduções do ICMS (Imposto sobre Circulação de Mercadorias e Serviços, de competência estadual)',
      },
      {
        label: 'Desindustrialização precoce',
        claim: 'A indústria de transformação perde peso no PIB antes de o Brasil chegar à renda dos países desenvolvidos, sob concorrência chinesa e câmbio valorizado.',
        section: 'Desindustrialização',
        quote: 'a perda de peso relativo da indústria ocorreu antes de o país atingir níveis de renda per capita e infraestrutura tecnológica equivalentes aos de economias plenamente desenvolvidas',
      },
    ],
  },
];
