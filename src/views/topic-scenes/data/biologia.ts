import type { SceneEntry } from '../types';

/** Cenas-âncora de Biologia. Vazio nesta fase: o inventário completo
 *  (Parte A, docs/visual-personalizado/15-familias-biologia.md, capítulos
 *  1-36; Parte B, mesma doc, capítulos 37-72) só decide família ou lacuna
 *  por capítulo — a escrita das entradas fica para uma task futura, agora
 *  que as duas partes fecham os 72 capítulos. */
export const biologia: SceneEntry[] = [];

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
