import type { SceneEntry } from '../types';

// Recortes do Lote 14 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
//
// O Segundo Reinado fica sem Questão Religiosa e Militar: são do capítulo do
// Declínio, que já tem cena. Nos dois capítulos do Regime Militar, política e
// economia aparecem lado a lado, sem elo causal, porque o resumo não liga uma
// à outra.
export const ENTRIES_LOTE14: SceneEntry[] = [
  {
    chapterId: 'summary-historia-brasil-imperio-segundo-reinado-1840-1889',
    family: 'tipologia',
    question: 'O que sustentou o Segundo Reinado, e o que mudou no trabalho e na guerra?',
    items: [
      {
        label: 'Café: do Vale ao oeste',
        claim: 'O café substitui o açúcar aos poucos e desloca o eixo econômico do Vale do Paraíba para o oeste paulista.',
        section: 'Estabilidade e café',
        quote: 'deslocando o eixo econômico do país para o Vale do Paraíba (inicialmente) e, posteriormente, para o oeste paulista',
      },
      {
        label: 'Liberais e conservadores',
        claim: 'Pelo Poder Moderador, D. Pedro II alterna no governo dois partidos da mesma elite proprietária.',
        section: 'Estabilidade e café',
        quote: 'alternando no poder os dois principais partidos políticos da época — o Partido Liberal e o Partido Conservador',
      },
      {
        label: 'Fim do tráfico, 1850',
        claim: 'A Lei Eusébio de Queirós fecha o tráfico atlântico; o comércio interprovincial leva escravizados para o café.',
        section: 'Fim do tráfico e trabalho',
        quote: 'formalizado pela Lei Eusébio de Queirós em 1850',
      },
      {
        label: 'Guerra do Paraguai',
        claim: 'Tríplice Aliança contra o Paraguai de Solano López; o Exército brasileiro sai mais coeso.',
        section: 'Guerra do Paraguai',
        quote: 'fortaleceu o Exército brasileiro como instituição política mais coesa e consciente de seu próprio poder',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-republica-da-espada',
    family: 'tipologia',
    question: 'Como a República recém-proclamada atravessou os governos dos dois marechais?',
    items: [
      {
        label: 'Deodoro fecha o Congresso',
        claim: 'Em 1891 Deodoro dissolve o Congresso; a crise contribui para sua renúncia meses depois, e Floriano assume.',
        section: 'Governos militares iniciais',
        quote: 'chegando a dissolver o Congresso Nacional em 1891 diante de conflitos políticos com o Legislativo',
      },
      {
        label: 'Revolta da Armada',
        claim: 'Oficiais da Marinha ameaçam bombardear o Rio, a capital; o governo resiste com apoio popular e do Exército.',
        section: 'Crises do período',
        quote: 'ameaçou bombardear o Rio de Janeiro, então capital federal, mas foi contida pela resistência do governo com apoio popular e de setores do Exército',
      },
      {
        label: 'Revolução Federalista',
        claim: 'No Rio Grande do Sul, federalistas contra republicanos aliados de Floriano: um dos conflitos mais sangrentos.',
        section: 'Crises do período',
        quote: 'conflito armado concentrado no Rio Grande do Sul entre federalistas',
      },
      {
        label: 'Prudente de Morais, 1894',
        claim: 'O primeiro presidente civil encerra o governo militar direto; os militares passam a sustentar e a contestar.',
        section: 'Transição para os civis',
        quote: 'o primeiro presidente civil da história republicana brasileira',
      },
    ],
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria',
    family: 'contraste-de-posicoes',
    question: 'Quão plural era a democracia de 1946 sob a pressão da Guerra Fria?',
    items: [
      {
        label: 'Constituição de 1946',
        claim: 'Depois da queda de Vargas, voltam eleições diretas, imprensa livre e vários partidos.',
        section: 'Redemocratização',
        quote: 'restabeleceu eleições diretas, liberdade de imprensa e pluralismo partidário',
      },
      {
        label: 'PCB cassado, 1947',
        claim: 'O anticomunismo da Guerra Fria exclui um partido votado em 1945: o pluralismo tinha limite.',
        section: 'Anticomunismo e limites',
        quote: 'teve seu registro cassado já em 1947',
      },
      {
        label: 'Crise de 1954',
        claim: 'Pressão de militares, civis conservadores e imprensa oposicionista; Vargas morre e deixa a carta-testamento.',
        section: 'Crises institucionais',
        quote: 'A crise de 1954, que culminou no suicídio do próprio presidente Getúlio Vargas em agosto daquele ano',
      },
      {
        label: 'Posse de JK, 1955',
        claim: 'Um golpe tenta impedir a posse do eleito; o contragolpe preventivo de Lott a garante.',
        section: 'Crises institucionais',
        quote: 'contidas por contragolpe militar preventivo liderado pelo general Henrique Teixeira Lott',
      },
    ],
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo',
    family: 'contraste-de-posicoes',
    question: 'O que o desenvolvimentismo prometia, e que tensões atravessaram 1956–1964?',
    items: [
      {
        label: 'Plano de Metas',
        claim: '31 metas em cinco áreas, com planejamento estatal e capital estrangeiro: "cinquenta anos em cinco".',
        section: 'Plano de Metas',
        quote: 'estabeleceu conjunto ambicioso de 31 metas específicas de investimento em setores considerados estratégicos',
      },
      {
        label: 'Brasília, 1960',
        claim: 'A capital sai do litoral para o interior: símbolo do otimismo e da interiorização do desenvolvimento.',
        section: 'Plano de Metas',
        quote: 'A construção de Brasília, nova capital federal inaugurada em 1960 no interior do território nacional',
      },
      {
        label: 'Petrobras × montadoras',
        claim: 'Nacionalistas defendem controle estatal, como a Petrobras de 1953; JK prioriza montadoras estrangeiras.',
        section: 'Nacionalismo e capital estrangeiro',
        quote: 'priorizou na prática atração intensiva de investimento estrangeiro direto, especialmente para a indústria automobilística',
      },
      {
        label: 'Crise de 1961–1964',
        claim: 'Jânio renuncia; o parlamentarismo empossa Goulart e cai no plebiscito de 1963; em abril de 1964, o golpe.',
        section: 'Crise de 1961-1964',
        quote: 'foi revertida por plebiscito popular já em 1963, restaurando o presidencialismo pleno',
      },
    ],
  },
  {
    chapterId: 'summary-historia-regime-militar-1964-1985-i',
    family: 'tipologia',
    question: 'Como o regime se fechou na política e acelerou na economia, lado a lado?',
    items: [
      {
        label: 'Golpe e Atos Institucionais',
        claim: 'O golpe de abril de 1964 depõe Goulart; decretos com força constitucional ampliam o Executivo.',
        section: 'Instalação do regime',
        quote: 'O regime instalado consolidou-se progressivamente por meio de uma série de Atos Institucionais',
      },
      {
        label: 'AI-5 e anos de chumbo',
        claim: 'Dezembro de 1968: poder de fechar o Congresso e cassar sem controle judicial, censura prévia, repressão.',
        section: 'Anos de chumbo',
        quote: 'instaurou censura prévia sistemática à imprensa, à produção artística e cultural do país',
      },
      {
        label: 'Milagre econômico',
        claim: 'PIB acelerado de 1968 a 1973, com obras estatais, crédito externo barato e salários contidos.',
        section: 'Milagre econômico',
        quote: 'período de crescimento acelerado do Produto Interno Bruto entre aproximadamente 1968 e 1973',
      },
      {
        label: 'Dívida externa',
        claim: 'O crescimento foi financiado com dívida externa, que o choque de 1973 e os juros tornariam impagável.',
        section: 'Milagre econômico',
        quote: 'O financiamento desse crescimento acelerado dependeu fortemente de endividamento externo crescente',
      },
    ],
  },
  {
    chapterId: 'summary-historia-regime-militar-1964-1985-ii',
    family: 'escala-de-graus',
    question: 'Como terminou o regime: abertura controlada, crise, Diretas Já e colégio eleitoral?',
    items: [
      {
        label: 'Abertura controlada',
        claim: '"Lenta, gradual e segura": AI-5 revogado em 1978, fim da censura prévia e anistia recíproca em 1979.',
        section: 'Distensão e abertura',
        quote: 'a revogação do AI-5 em 1978, o fim da censura prévia à imprensa, e a Lei da Anistia de 1979',
      },
      {
        label: 'Crise econômica',
        claim: 'Dívida do milagre, choque de 1979 e juros dos EUA: recessão, inflação e desemprego desgastam o regime.',
        section: 'Crise econômica',
        quote: 'agravado pelo segundo choque do petróleo de 1979 e pela elevação abrupta das taxas de juros internacionais',
      },
      {
        label: 'Diretas Já',
        claim: 'Multidões nas praças, mas a Emenda Dante de Oliveira cai no Congresso por margem estreita.',
        section: 'Diretas Já e transição',
        quote: 'a Emenda Dante de Oliveira foi rejeitada por margem estreita de votos em abril de 1984',
      },
      {
        label: 'Colégio eleitoral, 1985',
        claim: 'Transição indireta: Tancredo eleito morre antes da posse; Sarney assume; Constituição em 1988.',
        section: 'Diretas Já e transição',
        quote: 'um colégio eleitoral composto por congressistas e delegados estaduais elegeu Tancredo Neves',
      },
    ],
  },
];
