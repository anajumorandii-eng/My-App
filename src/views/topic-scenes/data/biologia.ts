import type { SceneEntry } from '../types';

/** Cenas-âncora de Biologia. Vazio nesta fase: a Parte A do inventário
 *  (docs/visual-personalizado/15-familias-biologia.md, capítulos 1-36)
 *  só decide família ou lacuna por capítulo — a escrita das entradas fica
 *  para uma task futura, depois que a Parte B (capítulos 37-72) fechar o
 *  inventário completo. */
export const biologia: SceneEntry[] = [];

/** Capítulos de Biologia sem cena-âncora, com o motivo. Preenchido apenas
 *  com os gaps da Parte A (capítulos 1-36) — a Parte B adiciona o resto.
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
];
