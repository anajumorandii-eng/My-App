/** Relações territoriais que pedem comparação entre recortes, não um cálculo. */
export type GeographyContextId =
  | 'environmental-governance'
  | 'eu-integration'
  | 'electricity-system'
  | 'population-flows'
  | 'trade-network'
  | 'urban-conflict'
  // Rodada de fechamento de lacuna (Geografia, set/2026): mesmo padrão de três
  // recortes comparáveis, aplicado a capítulos de geopolítica regional e de
  // geografia econômica/ambiental do Brasil que não tinham prancha nem
  // instrumento. Cada entrada usa só o conteúdo já registrado na nota de
  // `geographyInteractiveSummaries.ts` — nenhum fato, data ou número novo.
  | 'unilateral-multilateral'
  | 'international-terrorism'
  | 'religious-geography'
  | 'latin-america-geopolitics'
  | 'africa-geopolitics'
  | 'asia-geopolitics'
  | 'middle-east-geography'
  | 'palestinian-question'
  | 'arab-world-conflicts'
  | 'world-electricity-sources'
  | 'fossil-biofuels-brazil'
  | 'brazil-industrial-command'
  // Biogeografia do Brasil I e II compartilham hoje a mesma nota genérica em
  // `geographyInteractiveSummaries.ts` (a função `note()` casa os dois títulos
  // na mesma condição `t.includes('biogeografia')`). Sem conteúdo que
  // distinga I de II, as duas entradas usam o mesmo modelo de três fatores —
  // isso é fiel ao que o currículo hoje contém, não uma cópia por preguiça.
  | 'brazil-biogeography-i'
  | 'brazil-biogeography-ii'
  | 'brazilian-environmental-policy';

export interface GeographyContextCase {
  label: string;
  location: string;
  observation: string;
  conclusion: string;
}

export interface GeographyContext {
  chapterId: string;
  title: string;
  question: string;
  relation: string;
  cases: readonly [GeographyContextCase, GeographyContextCase, GeographyContextCase];
  caution: string;
}

export const GEOGRAPHY_CONTEXTS: Record<GeographyContextId, GeographyContext> = {
  'environmental-governance': {
    chapterId: 'summary-geografia-geopolitica-ambiental',
    title: 'Uma questão ambiental em escalas',
    question: 'Por que uma decisão territorial pode exigir coordenação para além de suas fronteiras?',
    relation: 'território local + fluxos transfronteiriços + acordos → governança ambiental',
    cases: [
      { label: 'Território', location: 'Área de decisão', observation: 'Comece por quem usa, protege ou transforma um recurso em um lugar concreto.', conclusion: 'Impactos e interesses surgem em territórios situados, com atores e regras próprios.' },
      { label: 'Fluxo', location: 'Além da fronteira', observation: 'Siga água, ar, biodiversidade ou emissões para além do limite político.', conclusion: 'O efeito ambiental pode alcançar lugares que não participaram da decisão inicial.' },
      { label: 'Coordenação', location: 'Escala internacional', observation: 'Compare acordos, financiamento e fiscalização entre os envolvidos.', conclusion: 'A cooperação não elimina conflitos, mas cria meios para negociar responsabilidades compartilhadas.' },
    ],
    caution: 'Esquema de escalas: não representa uma negociação, país ou tratado específico.',
  },
  'eu-integration': {
    chapterId: 'summary-geografia-uniao-europeia',
    title: 'Integração europeia em prática',
    question: 'Que conexões a integração regional aproxima — e quais decisões continuam nacionais?',
    relation: 'circulação + regras comuns + decisões nacionais → integração regional',
    cases: [
      { label: 'Circulação', location: 'Entre membros', observation: 'Observe a redução de barreiras para bens, pessoas e serviços em espaços integrados.', conclusion: 'A integração altera os fluxos cotidianos sem tornar os territórios idênticos.' },
      { label: 'Regra comum', location: 'Instituições do bloco', observation: 'Acrescente normas e instâncias que coordenam parte das decisões.', conclusion: 'Regras compartilhadas criam compromissos, mas sua aplicação envolve negociação política.' },
      { label: 'Decisão nacional', location: 'Estados membros', observation: 'Compare competências do bloco com políticas que cada Estado preserva.', conclusion: 'A integração combina ação conjunta e soberanias nacionais; não equivale a um Estado único.' },
    ],
    caution: 'Diagrama conceitual: a União Europeia tem instituições e exceções que variam conforme o tema.',
  },
  'electricity-system': {
    chapterId: 'summary-geografia-energia-eletrica-no-brasil',
    title: 'Equilíbrio do sistema elétrico',
    question: 'Como fontes, transmissão e consumo precisam se articular para a eletricidade chegar?',
    relation: 'geração + transmissão + demanda → operação do sistema elétrico',
    cases: [
      { label: 'Geração', location: 'Usinas e fontes', observation: 'Compare fontes que produzem em ritmos e lugares diferentes.', conclusion: 'A oferta depende tanto da fonte disponível quanto de sua localização no território.' },
      { label: 'Transmissão', location: 'Rede interligada', observation: 'Siga a eletricidade entre áreas produtoras e centros consumidores.', conclusion: 'Linhas e subestações conectam distâncias, mas também criam limites de capacidade e perdas.' },
      { label: 'Demanda', location: 'Cidades e atividades', observation: 'Observe como o consumo varia ao longo do dia e entre regiões.', conclusion: 'Operar o sistema é equilibrar oferta e demanda continuamente, com planejamento de longo prazo.' },
    ],
    caution: 'Rede hipotética: não informa a participação real de fontes nem a operação de uma usina brasileira.',
  },
  'population-flows': {
    chapterId: 'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
    title: 'Fluxos e redes migratórias',
    question: 'Como uma migração reorganiza simultaneamente origem, destino e trajetos?',
    relation: 'origem + deslocamento + destino → redes migratórias',
    cases: [
      { label: 'Origem', location: 'Lugar de partida', observation: 'Identifique condições de trabalho, família, moradia ou conflito que influenciam a decisão.', conclusion: 'A saída se relaciona a condições concretas, mas pessoas em situação semelhante podem fazer escolhas diferentes.' },
      { label: 'Trajeto', location: 'Corredor migratório', observation: 'Acompanhe redes de informação, transporte e apoio que tornam um caminho viável.', conclusion: 'A migração não é apenas uma linha no mapa: redes sociais e custos moldam o percurso.' },
      { label: 'Destino', location: 'Lugar de chegada', observation: 'Compare trabalho, serviços, moradia e vínculos disponíveis no novo lugar.', conclusion: 'A chegada reorganiza tanto o destino quanto as relações mantidas com a origem.' },
    ],
    caution: 'Fluxo hipotético: não representa uma rota migratória real nem reduz migração a uma causa única.',
  },
  'trade-network': {
    chapterId: 'summary-geografia-os-fluxos-do-comercio-externo',
    title: 'Uma rede de comércio exterior',
    question: 'Como produção, logística e destino se conectam em um fluxo de exportação?',
    relation: 'produção + corredor logístico + mercado externo → comércio exterior',
    cases: [
      { label: 'Produção', location: 'Região produtora', observation: 'Comece por bens e serviços que entram na pauta comercial.', conclusion: 'O que se exporta depende de especializações produtivas, tecnologia e condições do território.' },
      { label: 'Logística', location: 'Portos e corredores', observation: 'Siga o bem por estradas, ferrovias, terminais e portos.', conclusion: 'Infraestrutura conecta produtores a mercados, mas custos e gargalos alteram a competitividade.' },
      { label: 'Mercado', location: 'Parceiros externos', observation: 'Compare destinos, preços e exigências de compradores.', conclusion: 'Dependência de poucos produtos ou parceiros pode aumentar a vulnerabilidade a mudanças externas.' },
    ],
    caution: 'Rede ilustrativa: não retrata uma pauta, porto ou parceiro comercial específico.',
  },
  'urban-conflict': {
    chapterId: 'summary-geografia-tensoes-geopoliticas-na-europa',
    title: 'Tensões no território europeu',
    question: 'Como fronteiras, identidades e alianças podem se sobrepor em uma tensão geopolítica?',
    relation: 'território + identidades + alianças → tensões geopolíticas',
    cases: [
      { label: 'Território', location: 'Área disputada', observation: 'Localize fronteiras, recursos, rotas e posições estratégicas em jogo.', conclusion: 'O espaço importa porque concentra acessos e delimita quem exerce autoridade.' },
      { label: 'Identidades', location: 'Grupos e comunidades', observation: 'Compare memórias, línguas e pertencimentos mobilizados por diferentes atores.', conclusion: 'Identidade pode dar sentido político ao conflito, sem explicar sozinha suas causas.' },
      { label: 'Alianças', location: 'Escala regional', observation: 'Observe apoios diplomáticos, econômicos ou militares que conectam atores externos.', conclusion: 'Alianças ampliam a escala de uma tensão local e alteram os custos de negociação.' },
    ],
    caution: 'Esquema analítico: não simplifica conflitos europeus a três causas nem substitui a cronologia de cada caso.',
  },
  'unilateral-multilateral': {
    chapterId: 'summary-geografia-unilateralismo-e-multilateralismo',
    title: 'Unilateralismo e multilateralismo em decisão',
    question: 'Uma decisão internacional nasce de um só Estado, de instituições compartilhadas — ou das duas coisas, dependendo de quem tem mais poder para impô-la?',
    relation: 'decisão unilateral + coordenação multilateral + poder desigual → arranjo internacional',
    cases: [
      { label: 'Unilateral', location: 'Decisão de um Estado', observation: 'Um único país age por conta própria, sem depender da aprovação de outros.', conclusion: 'A ação é rápida, mas sua legitimidade e seus efeitos dependem do poder de quem decide.' },
      { label: 'Multilateral', location: 'Instituições compartilhadas', observation: 'Vários Estados negociam regras e decisões em fóruns e organizações comuns.', conclusion: 'A coordenação distribui a decisão, mas exige consenso e pode travar diante de interesses divergentes.' },
      { label: 'Poder desigual', location: 'Assimetria entre Estados', observation: 'Compare a capacidade de cada Estado de impor ou recusar uma decisão, unilateral ou multilateral.', conclusion: 'A desigualdade de poder atravessa os dois arranjos e ajuda a explicar bloqueios e coalizões.' },
    ],
    caution: 'Esquema conceitual: não representa uma decisão, organismo ou país específico.',
  },
  'international-terrorism': {
    chapterId: 'summary-geografia-terrorismo-internacional',
    title: 'Terrorismo como estratégia política',
    question: 'O que caracteriza o terrorismo como estratégia de violência política — e por que sua causa e sua resposta não se resumem a uma explicação única?',
    relation: 'violência contra alvo civil/simbólico + rede e causas diversas + resposta estatal → estratégia de terror',
    cases: [
      { label: 'Estratégia', location: 'Violência política', observation: 'Observe o uso de violência contra alvos civis ou simbólicos para produzir medo.', conclusion: 'O objetivo é pressão política por meio do medo, não apenas o dano direto causado.' },
      { label: 'Rede', location: 'Causas e organização', observation: 'Compare as causas e redes que sustentam diferentes grupos e ações.', conclusion: 'Causas e redes variam bastante; reduzir o fenômeno a uma religião ou a um motivo único simplifica demais.' },
      { label: 'Resposta', location: 'Política de segurança', observation: 'Observe como Estados respondem com segurança, vigilância ou força.', conclusion: 'Respostas estatais podem conter o problema, mas também podem ampliar o conflito que buscam resolver.' },
    ],
    caution: 'Esquema conceitual: não identifica grupo, atentado ou país específico.',
  },
  'religious-geography': {
    chapterId: 'summary-geografia-geografia-das-religioes',
    title: 'Território e difusão religiosa',
    question: 'Como uma religião ocupa território ao longo do tempo — e por que isso não a torna um bloco único?',
    relation: 'difusão histórica + território religioso + diversidade interna → geografia das religiões',
    cases: [
      { label: 'Difusão', location: 'Migração e história', observation: 'Siga como uma religião se espalha por migração, conquista ou conversão ao longo do tempo.', conclusion: 'A distribuição atual é resultado de processos históricos, não de uma origem fixa no espaço.' },
      { label: 'Território', location: 'Organização do espaço', observation: 'Observe como crenças organizam identidade, prática e, por vezes, conflito em um território.', conclusion: 'Território religioso pode reforçar pertencimento e também disputa por espaço e poder.' },
      { label: 'Diversidade', location: 'Dentro do mesmo grupo', observation: 'Compare correntes, ramos e práticas dentro da mesma tradição religiosa.', conclusion: 'Tratar uma religião como bloco homogêneo esconde a diversidade interna que a atravessa.' },
    ],
    caution: 'Esquema conceitual: não mapeia uma religião, região ou estatística específica.',
  },
  'latin-america-geopolitics': {
    chapterId: 'summary-geografia-geopolitica-e-geoeconomia-da-america-latina',
    title: 'América Latina entre dependência e integração',
    question: 'Como urbanização, exportação de commodities e integração regional se combinam na inserção latino-americana?',
    relation: 'estrutura produtiva + integração regional + influência externa → geoeconomia latino-americana',
    cases: [
      { label: 'Estrutura', location: 'Produção e cidades', observation: 'Compare urbanização acelerada, exportação de commodities e desigualdade entre países da região.', conclusion: 'A estrutura produtiva condiciona quem ganha e quem perde nos ciclos de preços internacionais.' },
      { label: 'Integração', location: 'Blocos regionais', observation: 'Observe acordos e blocos que tentam coordenar comércio e política entre países vizinhos.', conclusion: 'A integração regional avança de forma desigual, conforme o ciclo político de cada país.' },
      { label: 'Influência', location: 'Atores externos', observation: 'Compare a presença de capitais, potências e organismos internacionais na região.', conclusion: 'Dependência e autonomia variam: nenhum país da região ocupa a mesma posição o tempo todo.' },
    ],
    caution: 'Esquema conceitual: não substitui a leitura de um país ou acordo latino-americano específico.',
  },
  'africa-geopolitics': {
    chapterId: 'summary-geografia-africa-no-mundo-atual',
    title: 'África: diversidade e inserção global',
    question: 'Por que tratar o continente africano como um bloco único apaga diferenças que explicam seus conflitos e oportunidades?',
    relation: 'herança colonial + diversidade interna + inserção global → áfrica no mundo atual',
    cases: [
      { label: 'Herança', location: 'Fronteiras coloniais', observation: 'Observe como fronteiras traçadas de fora combinam povos e dividem territórios historicamente ligados.', conclusion: 'A herança colonial ajuda a explicar tensões atuais, sem ser sua causa única ou automática.' },
      { label: 'Diversidade', location: 'Estados e sociedades', observation: 'Compare economias, línguas, regimes políticos e recursos entre diferentes países africanos.', conclusion: 'O continente reúne realidades muito distintas; generalizações escondem essa diversidade.' },
      { label: 'Inserção', location: 'Escala global', observation: 'Observe recursos, juventude populacional e urbanização conectando a África a cadeias globais.', conclusion: 'A inserção global cria tanto oportunidades de crescimento quanto riscos de dependência externa.' },
    ],
    caution: 'Esquema conceitual: não descreve um país, conflito ou recurso africano específico.',
  },
  'asia-geopolitics': {
    chapterId: 'summary-geografia-geopolitica-e-geoeconomia-da-asia',
    title: 'Ásia: centros heterogêneos de poder',
    question: 'Como economias tão diferentes quanto China, Índia e Japão ocupam posições distintas nas cadeias e disputas asiáticas?',
    relation: 'centros produtivos distintos + disputas territoriais e marítimas + posição nas cadeias globais → geoeconomia asiática',
    cases: [
      { label: 'Centros', location: 'Polos produtivos', observation: 'Compare centros industriais, financeiros e demográficos como China, Índia, Japão e o Sudeste Asiático.', conclusion: 'Cada centro ocupa um papel diferente na produção e nas finanças; não há um único "polo asiático".' },
      { label: 'Disputas', location: 'Rotas e fronteiras marítimas', observation: 'Observe tensões territoriais e marítimas que atravessam a região.', conclusion: 'O controle de rotas e recursos conecta geografia física a disputas de poder entre Estados.' },
      { label: 'Cadeias', location: 'Posição na produção global', observation: 'Compare a posição de cada centro nas cadeias de produção e nos mercados globais.', conclusion: 'A heterogeneidade interna explica por que a Ásia não pode ser tratada como um bloco único de poder.' },
    ],
    caution: 'Esquema conceitual: não substitui a leitura de um país, rota ou disputa asiática específica.',
  },
  'middle-east-geography': {
    chapterId: 'summary-geografia-geografia-do-oriente-medio',
    title: 'Oriente Médio: recursos, rotas e fronteiras',
    question: 'Como hidrocarbonetos, água, rotas e fronteiras se cruzam para explicar a geografia do Oriente Médio?',
    relation: 'recursos estratégicos + rotas e fronteiras + intervenção externa → geografia do oriente médio',
    cases: [
      { label: 'Recursos', location: 'Hidrocarbonetos e água', observation: 'Observe como petróleo, gás e disputa por água moldam economia e conflito na região.', conclusion: 'Recursos são centrais, mas não explicam sozinhos cada conflito da região.' },
      { label: 'Rotas', location: 'Fronteiras e corredores', observation: 'Compare fronteiras traçadas e rotas comerciais e estratégicas que atravessam o território.', conclusion: 'A posição geográfica torna a região disputada por trânsito e controle, além de recursos.' },
      { label: 'Intervenção', location: 'Atores externos', observation: 'Observe interesses de potências externas somados aos de Estados e grupos locais.', conclusion: 'Interesses diversos — internos e externos — tornam a região um sistema de múltiplos atores.' },
    ],
    caution: 'Esquema conceitual: não descreve um país, rota ou conflito específico do Oriente Médio.',
  },
  'palestinian-question': {
    chapterId: 'summary-geografia-questao-palestina',
    title: 'Questão Palestina em múltiplas escalas',
    question: 'Como território, deslocamento e autodeterminação se articulam em escalas diferentes na questão palestina?',
    relation: 'território e ocupação + atores e deslocamento + escala internacional → questão palestina',
    cases: [
      { label: 'Território', location: 'Ocupação e assentamentos', observation: 'Observe território, ocupação, assentamentos e a situação de Jerusalém.', conclusion: 'A dimensão territorial organiza direitos, fronteiras e disputas cotidianas concretas.' },
      { label: 'Atores', location: 'Povos e deslocamento', observation: 'Diferencie povos, governos e organizações, sem reduzi-los a um único ator.', conclusion: 'Deslocamento e segurança afetam populações civis de ambos os lados de formas distintas.' },
      { label: 'Escala', location: 'Marcos internacionais', observation: 'Compare marcos históricos e a atuação de organismos internacionais ao longo do tempo.', conclusion: 'A questão palestina só se entende articulando escala local, nacional e internacional.' },
    ],
    caution: 'Esquema conceitual: não substitui cronologia, mapa de assentamentos ou marco jurídico específico.',
  },
  'arab-world-conflicts': {
    chapterId: 'summary-geografia-conflitos-no-mundo-arabe',
    title: 'Mundo árabe: diversidade e conflito',
    question: 'Por que "mundo árabe" é categoria linguístico-cultural, e não sinônimo de um único regime ou religião?',
    relation: 'categoria linguístico-cultural + diversidade de estados e minorias + intervenção e revolta → conflitos no mundo árabe',
    cases: [
      { label: 'Categoria', location: 'Língua e cultura', observation: 'Observe que "mundo árabe" define países pela língua e cultura compartilhadas, não por regime ou religião únicos.', conclusion: 'Confundir a categoria com o Islã ou com um único sistema político simplifica a região.' },
      { label: 'Diversidade', location: 'Estados e minorias', observation: 'Compare regimes, recursos e minorias religiosas e étnicas entre diferentes países árabes.', conclusion: 'Autoritarismo, recursos e composição social variam muito de um Estado a outro.' },
      { label: 'Conflito', location: 'Intervenções e revoltas', observation: 'Observe como intervenções externas e revoltas internas se combinam nos conflitos recentes.', conclusion: 'Cada conflito tem sua própria combinação de fatores internos e externos, não uma causa comum.' },
    ],
    caution: 'Esquema conceitual: não descreve um país, revolta ou intervenção específica.',
  },
  'world-electricity-sources': {
    chapterId: 'summary-geografia-energia-eletrica-no-mundo',
    title: 'Fontes de eletricidade no mundo',
    question: 'Por que a escolha entre fontes de eletricidade nunca é só sobre qual gera mais energia?',
    relation: 'fonte + despachabilidade, custo e emissões + impacto territorial → matriz elétrica mundial',
    cases: [
      { label: 'Fonte', location: 'Hidrelétrica, térmica, nuclear, eólica, solar', observation: 'Compare fontes que geram eletricidade de formas físicas muito diferentes.', conclusion: 'Cada fonte tem disponibilidade, previsibilidade e escala de geração próprias.' },
      { label: 'Despachabilidade', location: 'Custo e emissões', observation: 'Observe quais fontes podem ser acionadas sob demanda e quais dependem de condições naturais.', conclusion: 'Despachabilidade, custo e emissões formam um conjunto de trocas, não um ranking único.' },
      { label: 'Território', location: 'Impacto local', observation: 'Compare o impacto territorial de diferentes formas de geração de eletricidade.', conclusion: 'A escolha de matriz elétrica de um país reflete geografia e prioridades, não só tecnologia disponível.' },
    ],
    caution: 'Esquema conceitual: não informa a matriz elétrica real de nenhum país específico.',
  },
  'fossil-biofuels-brazil': {
    chapterId: 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
    title: 'Combustíveis fósseis e biocombustíveis no Brasil',
    question: 'Por que reciclar carbono recente não torna um biocombustível automaticamente neutro em impacto?',
    relation: 'carbono fóssil + carbono reciclado + uso do solo e manejo → combustíveis fósseis e biocombustíveis',
    cases: [
      { label: 'Fóssil', location: 'Petróleo, carvão e gás', observation: 'Observe que combustíveis fósseis concentram energia e liberam carbono armazenado há milhões de anos.', conclusion: 'Sua concentração energética alta explica o uso amplo, apesar do impacto climático já conhecido.' },
      { label: 'Biocombustível', location: 'Cana, soja e outras culturas', observation: 'Compare como biocombustíveis reciclam carbono absorvido recentemente pelas plantas.', conclusion: 'Reciclar carbono recente reduz parte do impacto, mas não o zera automaticamente.' },
      { label: 'Ciclo de vida', location: 'Uso do solo e manejo', observation: 'Observe como uso do solo, manejo agrícola e transporte alteram o balanço final de cada combustível.', conclusion: 'O impacto real depende do ciclo de vida completo, não só da origem fóssil ou vegetal do carbono.' },
    ],
    caution: 'Esquema conceitual: não quantifica emissões nem detalha uma cultura ou usina específica.',
  },
  'brazil-industrial-command': {
    chapterId: 'summary-geografia-o-espaco-industrial-brasileiro-ii',
    title: 'Indústria brasileira: concentração e comando',
    question: 'Se a produção industrial se desconcentrou pelo território, por que o comando das empresas nem sempre acompanhou?',
    relation: 'concentração histórica + desconcentração seletiva + comando concentrado → espaço industrial brasileiro',
    cases: [
      { label: 'Concentração', location: 'Sudeste histórico', observation: 'Observe como a indústria brasileira se concentrou historicamente no Sudeste do país.', conclusion: 'Infraestrutura, mercado consumidor e capital inicial explicam essa concentração original.' },
      { label: 'Desconcentração', location: 'Custos e incentivos', observation: 'Compare como custos, incentivos fiscais e infraestrutura atraíram indústrias para outras regiões.', conclusion: 'A desconcentração é seletiva: nem toda atividade nem toda região se beneficiou igualmente.' },
      { label: 'Comando', location: 'Sedes e tecnologia', observation: 'Observe onde permanecem as sedes, a tecnologia e os serviços avançados das empresas.', conclusion: 'A produção pode se espalhar pelo território enquanto o comando das decisões segue concentrado.' },
    ],
    caution: 'Esquema conceitual: não informa a localização real de uma empresa ou setor específico.',
  },
  'brazil-biogeography-i': {
    chapterId: 'summary-geografia-biogeografia-do-brasil-i',
    title: 'Biogeografia do Brasil I: fatores de distribuição',
    question: 'O que faz um bioma predominar em um lugar e não em outro?',
    relation: 'fator físico + fator histórico-evolutivo + ação humana → distribuição de biomas',
    cases: [
      { label: 'Físico', location: 'Clima, solo e relevo', observation: 'Observe como clima, solo e relevo condicionam onde cada tipo de vegetação predomina.', conclusion: 'Fatores físicos explicam parte da distribuição, mas a mesma condição física pode sustentar biomas diferentes.' },
      { label: 'Histórico', location: 'Evolução e barreiras', observation: 'Compare como história evolutiva e barreiras geográficas separaram ou aproximaram espécies ao longo do tempo.', conclusion: 'A distribuição atual carrega heranças de processos que já não estão mais ativos.' },
      { label: 'Humano', location: 'Ação humana', observation: 'Observe como uso do solo, desmatamento e urbanização alteram limites e composição de biomas.', conclusion: 'Biomas combinam fisionomia e processo em escala ampla — natureza e ação humana, juntas.' },
    ],
    caution: 'Esquema conceitual: não lista os biomas brasileiros nem seus limites reais.',
  },
  'brazil-biogeography-ii': {
    chapterId: 'summary-geografia-biogeografia-do-brasil-ii',
    title: 'Biogeografia do Brasil II: fatores de distribuição',
    question: 'O que faz um bioma predominar em um lugar e não em outro?',
    relation: 'fator físico + fator histórico-evolutivo + ação humana → distribuição de biomas',
    cases: [
      { label: 'Físico', location: 'Clima, solo e relevo', observation: 'Observe como clima, solo e relevo condicionam onde cada tipo de vegetação predomina.', conclusion: 'Fatores físicos explicam parte da distribuição, mas a mesma condição física pode sustentar biomas diferentes.' },
      { label: 'Histórico', location: 'Evolução e barreiras', observation: 'Compare como história evolutiva e barreiras geográficas separaram ou aproximaram espécies ao longo do tempo.', conclusion: 'A distribuição atual carrega heranças de processos que já não estão mais ativos.' },
      { label: 'Humano', location: 'Ação humana', observation: 'Observe como uso do solo, desmatamento e urbanização alteram limites e composição de biomas.', conclusion: 'Biomas combinam fisionomia e processo em escala ampla — natureza e ação humana, juntas.' },
    ],
    // I e II têm hoje a mesma nota-fonte (ver geographyInteractiveSummaries.ts);
    // por isso o modelo de três fatores se repete de propósito, em vez de
    // inventar uma distinção entre as duas metades que o currículo ainda não
    // registrou.
    caution: 'Esquema conceitual: não lista os biomas brasileiros nem seus limites reais. O modelo se repete em I e II porque as duas partes ainda compartilham a mesma nota-fonte no currículo.',
  },
  'brazilian-environmental-policy': {
    chapterId: 'summary-geografia-politicas-ambientais-brasileiras',
    title: 'Instrumentos da política ambiental brasileira',
    question: 'Unidade de conservação, licenciamento e fiscalização fazem o mesmo trabalho — ou cada um cobre uma etapa diferente?',
    relation: 'instrumento legal + fiscalização e monitoramento + efetividade territorial → política ambiental brasileira',
    cases: [
      { label: 'Instrumento', location: 'UCs, licenciamento, Código Florestal', observation: 'Compare unidades de conservação, licenciamento ambiental e Código Florestal como regras distintas.', conclusion: 'Cada instrumento atua em um momento diferente: proteger área, autorizar atividade ou definir uso da terra.' },
      { label: 'Fiscalização', location: 'Monitoramento e capacidade estatal', observation: 'Observe como a fiscalização depende de capacidade estatal e monitoramento contínuo para funcionar.', conclusion: 'Uma regra sem fiscalização efetiva tende a não mudar o comportamento no território.' },
      { label: 'Efetividade', location: 'Participação e justiça territorial', observation: 'Compare participação social e justiça territorial como parte do resultado final da política.', conclusion: 'Efetividade depende de regra, capacidade estatal, monitoramento e participação juntos — não de um único instrumento.' },
    ],
    caution: 'Esquema conceitual: não descreve uma unidade de conservação, norma ou fiscalização específica.',
  },
};
