import type { SceneEntry } from '../types';


// Recortes do Lote 15 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
export const ENTRIES_LOTE15: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-sistema-de-fusos-horarios',
    family: 'cadeia-de-derivacao',
    question: 'Como a rotação da Terra vira hora marcada no relógio, e onde a data muda?',
    items: [
      {
        label: '24 fusos de 15°',
        claim: 'A Terra gira 360° em 24 horas, de oeste para leste: cada hora de diferença equivale a 15° de longitude, a partir de Greenwich.',
        section: 'Da rotação ao horário',
        quote: 'Como a Terra completa uma rotação de 360 graus em 24 horas, cada hora de diferença corresponde a 15 graus de longitude (360 dividido por 24)',
      },
      {
        label: 'Destino menos origem',
        claim: 'Converter os dois lugares para UTC e subtrair destino menos origem evita a troca de sinais: de Brasília (UTC-3) a Tóquio (UTC+9) são 12 horas.',
        section: 'Método que evita troca de sinais',
        quote: 'No exemplo entre Brasília (UTC-3) e Tóquio (UTC+9), a diferença é de 9 menos (-3), ou seja, 12 horas: Tóquio está 12 horas à frente de Brasília.',
      },
      {
        label: 'Voo São Paulo–Londres',
        claim: 'Primeiro soma-se a duração do voo no fuso de origem; depois converte-se o fuso. 22h + 11h = 9h em São Paulo; + 3h = 12h em Londres, no dia seguinte.',
        section: 'Viagem resolvida',
        quote: 'soma-se 3 horas ao horário calculado: 9h mais 3 horas resulta em 12h do dia seguinte, horário local de chegada em Londres',
      },
      {
        label: 'Linha de Data',
        claim: 'Perto do meridiano de 180°, a volta de 24 horas se fecha: cruzando de leste para oeste, o calendário avança um dia; de oeste para leste, recua um.',
        section: 'Linha Internacional de Data',
        quote: 'ao cruzá-la viajando de leste para oeste, adianta-se um dia no calendário; ao cruzá-la viajando de oeste para leste, atrasa-se um dia',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-linguagem-cartografica',
    family: 'cadeia-de-derivacao',
    question: 'Como a escala transforma centímetros do mapa em quilômetros do terreno, e o que as curvas de nível contam do relevo?',
    items: [
      {
        label: '8 cm a 1:50.000',
        claim: 'Multiplica-se a medida do mapa pelo denominador e converte-se a unidade: 8 cm × 50.000 = 400.000 cm = 4.000 m = 4 km.',
        section: 'Cálculo resolvido',
        quote: 'multiplica-se a medida no mapa pelo denominador da escala: 8 cm × 50.000 = 400.000 cm',
      },
      {
        label: 'Cópia ampliada',
        claim: 'Ao ampliar ou reduzir o mapa numa cópia, a barra da escala gráfica cresce junto e continua certa; a escala numérica impressa fica errada.',
        section: 'Escala numérica e gráfica',
        quote: 'com a vantagem de permanecer correta mesmo que o mapa seja ampliado ou reduzido numa cópia ou impressão, diferente da escala numérica, que se torna incorreta nesses casos',
      },
      {
        label: 'Escala grande × pequena',
        claim: 'Escala grande (1:5.000) mostra área pequena com muito detalhe; escala pequena (1:10.000.000) mostra área extensa com pouco detalhe.',
        section: 'Escala numérica e gráfica',
        quote: 'a contraintuitividade dessa nomenclatura (escala "grande" mostra área pequena) é fonte comum de confusão',
      },
      {
        label: 'Curvas de nível',
        claim: 'Com a mesma equidistância entre curvas, linhas próximas indicam encosta íngreme e linhas espaçadas, relevo suave.',
        section: 'Áreas e curvas de nível',
        quote: 'Quando as curvas de nível estão muito próximas umas das outras, indicam declividade acentuada (relevo íngreme); quando estão espaçadas, indicam declividade suave',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-cartografia-digital',
    family: 'camadas-de-determinacao',
    question: 'O que a cartografia digital faz além de mostrar uma imagem na tela?',
    items: [
      {
        label: 'Camadas do SIG',
        claim: 'O SIG empilha camadas georreferenciadas e as cruza: o padrão que nenhuma camada mostra sozinha aparece na sobreposição.',
        section: 'Sistemas de Informação Geográfica',
        quote: 'a capacidade central e distintiva de um SIG é permitir a análise combinada e simultânea entre múltiplas dessas camadas de informação',
      },
      {
        label: 'Satélite de imagem × GPS',
        claim: 'Sensoriamento remoto capta imagens à distância; o GPS determina onde está um receptor. São tecnologias relacionadas, mas distintas.',
        section: 'Pegadinhas frequentes',
        quote: 'O segundo erro é confundir sensoriamento remoto (a captura de imagens e dados à distância, tipicamente por satélites ou aeronaves) com posicionamento por satélite do tipo GPS',
      },
      {
        label: 'Resolução × revisita',
        claim: 'Cada sensor troca uma coisa pela outra: imagem grosseira com revisita diária, ou imagem muito detalhada com revisita rara.',
        section: 'Pegadinhas frequentes',
        quote: 'desde imagens de baixíssima resolução espacial mas com revisita diária muito frequente, até imagens de altíssima resolução espacial mas com revisita muito menos frequente da mesma área específica',
      },
      {
        label: 'Detectar não é impedir',
        claim: 'O satélite detecta o desmatamento em dias, mas o alerta ainda precisa ser verificado e levar uma equipe a campo, muitas vezes em área remota.',
        section: 'Pratique e confira',
        quote: 'a detecção por si só não impede fisicamente a ação ilegal já em curso',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-representacoes-graficas-e-cartograficas',
    family: 'tipologia',
    question: 'O que um mapa precisa ter para ser lido, e quando ele deforma de propósito?',
    items: [
      {
        label: 'Elementos do mapa',
        claim: 'Título, legenda, escala, orientação, fonte e data: sem legenda, cores e símbolos ficam ambíguos, mesmo com escala e orientação corretas.',
        section: 'Elementos do mapa',
        quote: 'A legenda (ou lenda) explica o significado de símbolos, cores e padrões usados no mapa',
      },
      {
        label: 'Generalização',
        claim: 'Quanto menor a escala, mais o mapa simplifica: agrupa feições, suaviza costas e rios e omite detalhes. É técnica, não defeito.',
        section: 'Escala e generalização',
        quote: 'precisam necessariamente simplificar e generalizar a informação, agrupando feições menores, suavizando contornos de costas e rios',
      },
      {
        label: 'Anamorfose',
        claim: 'O cartograma dimensiona cada país por uma variável: por população, Índia e China crescem; Canadá e Austrália encolhem.',
        section: 'Gráficos e anamorfoses',
        quote: 'ampliaria visualmente a Índia e a China (populosas mas territorialmente não as maiores) e reduziria drasticamente países vastos mas pouco povoados, como o Canadá ou a Austrália',
      },
      {
        label: 'Gráfico não é mapa',
        claim: 'O gráfico mostra o dado de forma abstrata, sem a forma do território; o mapa e a anamorfose mantêm a referência geográfica.',
        section: 'Pegadinhas frequentes',
        quote: 'gráficos representam dados quantitativos de forma abstrata, sem necessariamente reproduzir a forma geográfica real do espaço representado',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-agua-na-superficie-terrestre',
    family: 'camadas-de-determinacao',
    question: 'Se a água cobre 71% da superfície, por que ela é questão estratégica?',
    items: [
      {
        label: '97% salgada',
        claim: 'Os oceanos guardam cerca de 97% da água; dos 3% doces, a maior parte está congelada ou em aquíferos profundos. Bem menos de 1% está em rios e lagos.',
        section: 'Distribuição da água',
        quote: 'Os oceanos concentram cerca de 97% de toda a água do planeta',
      },
      {
        label: 'Bacia e fronteira',
        claim: 'O divisor de águas define a bacia, não a fronteira: quem usa ou polui a montante afeta quem está a jusante, em outro país.',
        section: 'Bacias hidrográficas',
        quote: 'Uma mesma bacia hidrográfica pode se estender por múltiplos municípios, estados ou até países',
      },
      {
        label: 'Livre × confinado',
        claim: 'O aquífero livre tem o nível freático exposto e se contamina mais; o confinado fica sob camada impermeável, mais protegido, mas recarrega devagar.',
        section: 'Águas subterrâneas',
        quote: 'geralmente mais protegidos de contaminação mas também de recarga natural mais lenta',
      },
      {
        label: 'Superexplotação',
        claim: 'Tirar água mais rápido do que ela recarrega rebaixa o lençol freático e pode afundar o solo, como em partes da Cidade do México.',
        section: 'Águas subterrâneas',
        quote: 'pode causar rebaixamento progressivo do nível do lençol freático ao longo de décadas',
      },
    ],
  },
];
