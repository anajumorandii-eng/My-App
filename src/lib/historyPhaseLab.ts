/**
 * Capítulos de História cuja unidade não é um objeto manipulável (como a
 * parábola do plano cartesiano), mas uma sequência de fases ou processos
 * simultâneos de um mesmo tema — a Revolução Russa não é a Mexicana nem a
 * Chinesa, mas as três compartilham a pergunta "o que muda entre elas?".
 *
 * O padrão é o mesmo de `geographyContextLab.ts`: três casos comparáveis por
 * capítulo, um só componente genérico desenha a cena. A diferença de
 * `historyInstrumentLab.ts` é que aquele arquivo desenha uma cena própria por
 * capítulo (cinco `if` no `HistoryScene`); este cobre o restante com uma única
 * cena de linha do tempo, porque hand-desenhar dez cenas não escalaria — a
 * mesma lição que motivou `geographyRemainingLab`/`GeographyContextInstrument`.
 *
 * Cada caso vem direto das seções já revisadas de `deepSummaryContent.json`
 * (rev 2) para o capítulo correspondente — nenhuma data, nome ou evento aqui é
 * inventado; o texto só resume o que a seção já afirma. Onde a seção não dá um
 * ano preciso (a Revolução Chinesa não tem data de início listada, só o ano da
 * vitória em 1949), o campo `period` usa só o que está no texto-fonte.
 */
export type HistoryPhaseId =
  | 'grandes-revolucoes-seculo-xx'
  | 'america-latina-seculo-xx'
  | 'dinamica-interna-colonizacao'
  | 'disputas-europeias-brasil-colonial'
  | 'segundo-reinado'
  | 'republica-da-espada'
  | 'republica-liberal-democracia'
  | 'republica-liberal-desenvolvimentismo'
  | 'regime-militar-i'
  | 'regime-militar-ii';

export interface HistoryPhaseCase {
  label: string;
  period: string;
  observation: string;
  conclusion: string;
}

export interface HistoryPhaseConfig {
  chapterId: string;
  title: string;
  question: string;
  relation: string;
  cases: readonly [HistoryPhaseCase, HistoryPhaseCase, HistoryPhaseCase];
  caution: string;
}

export const HISTORY_PHASES: Record<HistoryPhaseId, HistoryPhaseConfig> = {
  'grandes-revolucoes-seculo-xx': {
    chapterId: 'summary-historia-grandes-revolucoes-do-seculo-xx',
    title: 'Três revoluções, três bases sociais',
    question: 'Compare a base social e o desfecho institucional de três revoluções do século XX.',
    relation: 'base social + método + desfecho → um modelo revolucionário próprio',
    cases: [
      { label: 'Revolução Russa', period: '1917-1922', observation: 'Bolcheviques mobilizam o operariado urbano e derrubam o czarismo em dois momentos do mesmo ano de 1917.', conclusion: 'Consolida o primeiro Estado socialista da história, com poder centralizado sob liderança única.' },
      { label: 'Revolução Mexicana', period: '1910-1920', observation: 'Coalizão heterogênea — Madero, Zapata e Villa — combate a ditadura de Porfirio Díaz por quase uma década.', conclusion: 'Resulta em constituição de compromisso (1917), com reforma agrária e direitos trabalhistas, não em Estado socialista.' },
      { label: 'Revolução Chinesa', period: 'vitória em 1949', observation: 'Mao Tsé-tung mobiliza o campesinato rural, adaptando o marxismo a um país agrário, e vence o Kuomintang.', conclusion: 'Funda a República Popular da China sobre base social distinta da soviética, apoiada no campo, não na cidade.' },
    ],
    caution: 'Comparação temática: não reduz cada revolução a uma causa única nem cobre todos os seus desdobramentos posteriores.',
  },
  'america-latina-seculo-xx': {
    chapterId: 'summary-historia-america-latina-no-seculo-xx',
    title: 'Três fases da América Latina no século XX',
    question: 'Percorra três fases latino-americanas e veja como cada uma reorganizou a relação entre Estado e sociedade.',
    relation: 'contexto internacional + projeto político → fase da América Latina',
    cases: [
      { label: 'Populismo', period: 'anos 1930 a 1960', observation: 'Lideranças carismáticas como Vargas, Perón e Cárdenas ampliam direitos urbanos e defendem industrialização por substituição de importações.', conclusion: 'Reduz a dependência de matérias-primas sem romper o padrão de liderança pessoal acima dos partidos.' },
      { label: 'Ditaduras militares', period: 'anos 1960 a 1980', observation: 'Regimes como Brasil, Argentina, Chile e Uruguai reprimem opositores sob o temor da Guerra Fria; a Operação Condor coordena a repressão entre países.', conclusion: 'A Revolução Cubana de 1959 é fator de contexto geopolítico, não causa única de cada golpe.' },
      { label: 'Redemocratização', period: 'década de 1980', observation: 'Cada país sai da ditadura de um jeito: transição negociada no Brasil, colapso abrupto na Argentina após a Guerra das Malvinas (1982).', conclusion: 'A forma da saída molda a capacidade posterior de responsabilizar os agentes da repressão.' },
    ],
    caution: 'Esquema de fases: cada país teve ritmo e particularidades próprias dentro do padrão regional.',
  },
  'dinamica-interna-colonizacao': {
    chapterId: 'summary-historia-dinamica-interna-da-colonizacao',
    title: 'Além do canavial: a sociedade colonial açucareira',
    question: 'Observe três peças da sociedade açucareira colonial além da lavoura voltada à exportação.',
    relation: 'produção + trabalho + resistência → dinâmica social da colônia açucareira',
    cases: [
      { label: 'Sociedade do açúcar', period: 'séculos XVI-XVII', observation: 'Casa-grande e senzala organizam a hierarquia em torno do senhor de engenho, na leitura clássica de Gilberto Freyre em "Casa-Grande & Senzala" (1933).', conclusion: 'Interpretação historiográfica influente, mas criticada depois por minimizar a violência estrutural da escravidão.' },
      { label: 'Resistência escrava', period: 'período colonial', observation: 'Fuga, formação de quilombos, sabotagem e redução do ritmo de trabalho compõem formas diversas de resistência.', conclusion: 'O Quilombo dos Palmares resistiu quase um século inteiro (c. 1600-1695) antes de ser destruído.' },
      { label: 'Atividades subsidiárias', period: 'junto ao engenho', observation: 'Roças de subsistência e artesanato de trabalhadores livres pobres sustentam uma economia complementar à cana.', conclusion: 'Revela uma sociedade colonial mais diversa do que só senhor de engenho e pessoa escravizada.' },
    ],
    caution: 'Recorte social: descreve um padrão repetido na economia açucareira colonial, não um engenho específico.',
  },
  'disputas-europeias-brasil-colonial': {
    chapterId: 'summary-historia-disputas-europeias-no-brasil-colonial',
    title: 'Duas potências, dois séculos de disputa pelo litoral',
    question: 'Siga duas potências europeias que contestaram o domínio português sobre o litoral colonial.',
    relation: 'interesse europeu + aliança local + resposta portuguesa → disputa territorial',
    cases: [
      { label: 'França Antártica', period: '1555-1567', observation: 'Villegagnon tenta colônia na Baía de Guanabara, aliado a indígenas tupinambás, somando interesse comercial e refúgio calvinista.', conclusion: 'Primeira contestação europeia relevante ao litoral português, encerrada quase um século antes da União Ibérica.' },
      { label: 'Invasões holandesas', period: '1624-1654', observation: 'A Companhia das Índias Ocidentais ataca a Bahia e depois Pernambuco, sob Maurício de Nassau, aproveitando a União Ibérica de Portugal com a Espanha.', conclusion: 'Quase 25 anos de domínio duradouro no Nordeste, com desenvolvimento urbano incomum para uma colônia.' },
      { label: 'Expulsão e consequências', period: 'até 1654', observation: 'Resistência armada local — com Henrique Dias e Filipe Camarão — soma-se ao desgaste financeiro da Companhia das Índias Ocidentais.', conclusion: 'Técnicas açucareiras levadas ao Caribe por ex-colonos holandeses criam concorrência futura ao açúcar brasileiro.' },
    ],
    caution: 'Sequência histórica: a França Antártica é do século XVI; as invasões holandesas, um século depois.',
  },
  'segundo-reinado': {
    chapterId: 'summary-historia-brasil-imperio-segundo-reinado-1840-1889',
    title: 'Segundo Reinado: da estabilidade à crise',
    question: 'Percorra três momentos do Segundo Reinado e veja o que sustentou a estabilidade — e o que a corroeu.',
    relation: 'poder pessoal + economia cafeeira + desgaste institucional → trajetória do Segundo Reinado',
    cases: [
      { label: 'Consolidação e café', period: 'a partir de 1840', observation: 'Dom Pedro II alterna liberais e conservadores pelo Poder Moderador, enquanto o café desloca o açúcar como principal produto de exportação.', conclusion: 'Partidos com nomes distintos, mas ligados aos mesmos setores da elite proprietária rural e urbana.' },
      { label: 'Guerra do Paraguai', period: '1864-1870', observation: 'O conflito fortalece o Exército brasileiro como instituição política.', conclusion: 'Esse fortalecimento militar seria relevante décadas depois, na Proclamação da República.' },
      { label: 'Crise do Império', period: 'décadas finais', observation: 'A Questão Religiosa (1872-1875) e a Questão Militar (1883-1887) afastam parte do clero e do Exército do apoio à monarquia.', conclusion: 'Soma-se ao abolicionismo e ao republicanismo crescentes, corroendo o apoio que sustentava o trono.' },
    ],
    caution: 'Leitura por fases: a crise final tem causas acumuladas ao longo de décadas, não um evento único que derruba o Império.',
  },
  'republica-da-espada': {
    chapterId: 'summary-historia-a-republica-da-espada',
    title: 'Dois presidentes, dois desafios de consolidação',
    question: 'Compare os dois presidentes militares que abriram a República e o que cada um enfrentou.',
    relation: 'autoridade militar + resistência política → consolidação institucional da República',
    cases: [
      { label: 'Deodoro da Fonseca', period: '1889-1891', observation: 'O primeiro presidente governa de forma centralizadora e dissolve o Congresso Nacional em 1891, diante de conflito com o Legislativo.', conclusion: 'O ato gera crise institucional que leva à sua renúncia poucos meses depois.' },
      { label: 'Floriano Peixoto', period: '1891-1894', observation: 'Sucede Deodoro e enfrenta a Revolta da Armada, da Marinha no Rio de Janeiro, e a Revolução Federalista, no Rio Grande do Sul.', conclusion: 'São dois conflitos distintos, com atores e dinâmicas regionais próprias — não um único levante.' },
      { label: 'Legado militar', period: 'a partir de 1894', observation: 'A eleição civil de Prudente de Morais reconfigura o papel militar na política, sem eliminá-lo por completo.', conclusion: 'Abre caminho para a política do café com leite da República Oligárquica que se consolida em seguida.' },
    ],
    caution: 'Dois presidentes, não um: a República da Espada teve liderança militar direta em ambos os mandatos.',
  },
  'republica-liberal-democracia': {
    chapterId: 'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria',
    title: 'Uma democracia com limites da Guerra Fria',
    question: 'Veja como o pluralismo formal da redemocratização de 1945 conviveu com os limites da Guerra Fria.',
    relation: 'redemocratização + anticomunismo + instabilidade → democracia limitada',
    cases: [
      { label: 'Redemocratização', period: '1945-1946', observation: 'A queda de Vargas em outubro de 1945 e a nova Constituição de 1946 restabelecem eleições diretas e pluralismo partidário.', conclusion: 'Vargas volta ao poder em 1950 por via eleitoral direta — não mais pelo caminho autoritário de 1930.' },
      { label: 'Anticomunismo', period: 'a partir de 1947', observation: 'O Partido Comunista Brasileiro tem o registro cassado em 1947, apesar da votação expressiva obtida ao ser legalizado.', conclusion: 'Revela os limites práticos do pluralismo formal proclamado pela Constituição de 1946.' },
      { label: 'Crises institucionais', period: '1954 e 1955', observation: 'O suicídio de Vargas em 1954 e a tentativa de golpe contra a posse de Kubitschek em 1955, contida pelo general Lott, expõem fragilidade das instituições.', conclusion: 'Essa fragilidade acumulada ajuda a entender a vulnerabilidade do regime democrático ao golpe de 1964.' },
    ],
    caution: 'Recorte político-institucional: a dimensão econômica do mesmo período tem capítulo próprio.',
  },
  'republica-liberal-desenvolvimentismo': {
    chapterId: 'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo',
    title: 'Desenvolvimentismo, tensões e a crise que fechou o período',
    question: 'Acompanhe o projeto desenvolvimentista de JK e a crise que encerrou a experiência democrática de 1945-1964.',
    relation: 'planejamento estatal + capital estrangeiro + polarização → fim da experiência democrática',
    cases: [
      { label: 'Plano de Metas', period: '1956-1961', observation: 'JK organiza 31 metas em cinco áreas sob o lema "cinquenta anos em cinco" e constrói Brasília, inaugurada em 1960.', conclusion: 'Simboliza o objetivo de interiorizar um desenvolvimento historicamente concentrado no litoral.' },
      { label: 'Capital estrangeiro', period: 'governo JK', observation: 'Setores nacionalistas defendem controle estatal, como na Petrobras de 1953, enquanto o governo atrai montadoras multinacionais.', conclusion: 'A tensão entre controle nacional e capital estrangeiro atravessa décadas do debate econômico brasileiro.' },
      { label: 'Crise de 1961-1964', period: '1961-1964', observation: 'A renúncia de Jânio Quadros em 1961 leva a um parlamentarismo temporário para viabilizar a posse de Jango, revertido por plebiscito em 1963.', conclusion: 'A polarização, intensificada pela Revolução Cubana, culmina no golpe civil-militar de abril de 1964.' },
    ],
    caution: 'Recorte econômico-institucional: as crises políticas mais amplas do mesmo período têm capítulo próprio.',
  },
  'regime-militar-i': {
    chapterId: 'summary-historia-regime-militar-1964-1985-i',
    title: 'Regime Militar: instalação e endurecimento',
    question: 'Percorra a instalação do regime militar e o que explica seu período de repressão mais intensa.',
    relation: 'golpe + endurecimento institucional + crescimento concentrador → primeira fase do regime',
    cases: [
      { label: 'Golpe de 1964', period: 'abril de 1964', observation: 'Setores militares e civis conservadores depõem João Goulart, alegando conter as reformas de base e o avanço comunista da Guerra Fria.', conclusion: 'Atos Institucionais ampliam o Executivo federal e instauram eleições indiretas para a Presidência.' },
      { label: 'Anos de chumbo', period: 'a partir de 1968', observation: 'O AI-5, de dezembro de 1968, suspende garantias constitucionais e institui censura prévia à imprensa e à cultura.', conclusion: 'Concentra a repressão mais intensa do regime, com tortura institucionalizada e exílio de opositores.' },
      { label: 'Milagre econômico', period: '1968-1973', observation: 'O crescimento acelerado combina investimento estatal, crédito internacional barato e arrocho sobre o salário real.', conclusion: 'O endividamento externo barato de então se tornaria impagável após o choque do petróleo de 1973.' },
    ],
    caution: 'Fase inicial do regime: a abertura política e a crise final ficam no capítulo seguinte.',
  },
  'regime-militar-ii': {
    chapterId: 'summary-historia-regime-militar-1964-1985-ii',
    title: 'Regime Militar: crise e transição',
    question: 'Percorra a abertura controlada, a crise econômica e o fim negociado do regime militar.',
    relation: 'liberalização controlada + crise econômica + pressão popular → fim do regime',
    cases: [
      { label: 'Distensão e abertura', period: 'a partir de 1974', observation: 'Geisel inicia a abertura "lenta, gradual e segura"; o AI-5 cai em 1978 e a Lei da Anistia é aprovada em 1979.', conclusion: 'A anistia é recíproca — perdoa opositores e agentes do Estado — e gera controvérsia por décadas.' },
      { label: 'Crise econômica', period: 'anos 1980', observation: 'O segundo choque do petróleo e os juros internacionais mais altos encarecem a dívida externa herdada do "milagre".', conclusion: 'Recessão, inflação e desemprego desgastam o apoio ao regime, mesmo entre quem antes o sustentava.' },
      { label: 'Diretas Já e transição', period: '1983-1985', observation: 'A mobilização popular não consegue aprovar a emenda das eleições diretas em 1984; um colégio eleitoral elege Tancredo Neves em 1985.', conclusion: 'Tancredo morre antes da posse; José Sarney se torna o primeiro presidente civil após 21 anos de regime militar.' },
    ],
    caution: 'Fase final do regime: a instalação e os anos de chumbo ficam no capítulo anterior.',
  },
};
