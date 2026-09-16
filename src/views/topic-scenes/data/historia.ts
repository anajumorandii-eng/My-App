import type { SceneEntry } from '../types';

/** Capítulos de História sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Esta é a inventariação da Task 1 (ver docs/visual-personalizado/09-familias-historia.md),
 *  já corrigida após revisão: a primeira versão usava "não cobre o capítulo
 *  inteiro" como motivo de lacuna em vários casos — padrão nunca exigido em
 *  Fase 1/2 (uma cena ancora UM aspecto do capítulo, não o capítulo inteiro).
 *  Os motivos abaixo já não usam esse raciocínio: cada lacuna aqui é de
 *  capítulo em que nenhuma seção, nem isoladamente, sustenta rivalidade
 *  genuína, derivação com dependência real, assimetria de base/camada ou
 *  tipos paralelos nomeados com frase-guarda-chuva explícita. */
export const historiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-historia-introducao-a-historia-e-primeiras-civilizacoes',
    motivo: 'Já tem experiência interativa própria (sources) no catálogo de topic-experiments, ocupando o mesmo slot do fluxo de Explorar.',
  },
  {
    chapterId: 'summary-historia-a-interiorizacao-da-colonizacao',
    motivo: 'Bandeiras, mineração e pecuária/drogas do sertão são atividades econômicas paralelas com lógicas e cronologias próprias; nenhuma seção isolada declara uma dependência real entre elas, uma rivalidade sobre pergunta compartilhada, uma assimetria de base/camada ou uma frase-guarda-chuva de tipos nomeados.',
  },
  {
    chapterId: 'summary-historia-a-mineracao-no-brasil-colonial',
    motivo: 'A fiscalidade (quinto, derrama) tensiona a vida social mineradora e antecede a Revolta de Vila Rica e a Inconfidência Mineira, mas o texto não chega a afirmar que a fiscalidade é a base condicionando-as como camada assimétrica — apenas contextualiza cada revolta separadamente, em momentos econômicos distintos. Fica como lacuna nesta rodada; se uma leitura futura decidir que a assimetria é suficiente, cabe reclassificar para camadas-de-determinacao.',
  },
  {
    chapterId: 'summary-historia-america-latina-no-seculo-xx',
    motivo: 'Populismo, ditaduras militares e redemocratização têm cada um sua própria pluralidade de instâncias nacionais (Vargas/Perón/Cárdenas; Brasil/Argentina/Chile/Uruguai), mas nenhuma das três seções isoladas assume claramente a forma de tipos paralelos nomeados com frase-guarda-chuva explícita — o texto apresenta exemplos de um fenômeno já definido, não tipos de um fenômeno.',
  },
  {
    chapterId: 'summary-historia-america-no-seculo-xix',
    motivo: 'Independências latino-americanas, expansão dos EUA e neocolonialismo são três processos regionais distintos; nenhuma seção isolada contém uma frase-guarda-chuva de tipos, uma rivalidade sobre pergunta compartilhada, uma dependência real entre etapas ou uma assimetria de base/camada.',
  },
  {
    chapterId: 'summary-historia-brasil-imperio-segundo-reinado-1840-1889',
    motivo: 'Estabilidade política/café, fim do tráfico e Guerra do Paraguai são processos paralelos sem dependência causal direta entre si (o fim do tráfico decorre de pressão britânica e de realocação de capital interno, não da economia cafeeira; a Guerra do Paraguai é disputa geopolítica à parte); nenhuma seção isolada sustenta rivalidade, assimetria de camada ou tipos nomeados.',
  },
  {
    chapterId: 'summary-historia-dinamica-interna-da-colonizacao',
    motivo: 'A seção de resistência escrava enumera formas diversas (quilombo/fuga e resistência cotidiana) mas sem uma frase-guarda-chuva que as trate explicitamente como tipos paralelos de uma classificação — descreve um espectro de táticas, não uma tipologia nomeada. Sociedade do açúcar e atividades subsidiárias permanecem paralelas sem estrutura adicional.',
  },
  {
    chapterId: 'summary-historia-guerra-fria',
    motivo: 'Bipolaridade, conflitos por procuração e Terceiro Mundo são aspectos paralelos amplos; a Guerra da Coreia e a Guerra do Vietnã são duas instâncias do mesmo tipo ("guerra por procuração"), não tipos paralelos distintos — não atinge o padrão de tipologia (que exige tipos diferentes entre si, não repetições do mesmo tipo).',
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria',
    motivo: 'Redemocratização, contradição do anticomunismo institucionalizado e as crises de 1954 e 1955 são aspectos paralelos; a contradição pluralismo/exclusão do PCB é uma inconsistência interna de um único sistema, não uma rivalidade entre duas posições que disputam a mesma pergunta, e as duas crises institucionais não chegam a uma frase-guarda-chuva de tipos nomeados.',
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo',
    motivo: 'Plano de Metas, tensão nacionalismo/capital estrangeiro e crise de 1961-1964 são aspectos paralelos; a tensão nacionalista é descrita como convivência tensa entre duas posturas dentro do mesmo governo, não uma rivalidade decisória sobre a mesma pergunta, nem uma cadeia ou camada assimétrica suficientemente explícita.',
  },
  {
    chapterId: 'summary-historia-segunda-guerra-mundial-1939-1945',
    motivo: 'As frentes europeia e do Pacífico avançam em paralelo e não dependem estritamente uma da outra (a entrada dos EUA na guerra do Pacífico não decorre da Frente Oriental europeia); o capítulo é melhor descrito como narrativa cronológica multifacetada do que como cadeia única de derivação, rivalidade ou camada.',
  },
];

/** Task 1 não escreve cenas — apenas o inventário e o esqueleto. As Tasks
 *  seguintes (análogas às Tasks 4-8 de Fase 1) preenchem esta lista,
 *  família por família, a partir da atribuição definitiva registrada em
 *  docs/visual-personalizado/09-familias-historia.md. */
export const historia: SceneEntry[] = [];
