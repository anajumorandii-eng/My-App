import type { SceneEntry } from '../types';

/** Capítulos de Filosofia sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas. */
export const filosofiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos',
    motivo: 'Já tem experiência interativa própria (myth) no mesmo slot do fluxo de Explorar.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 4-8
 *  preenchem esta lista, família por família. */
export const filosofia: SceneEntry[] = [
  // Task 4 — família contraste-de-posicoes (14 capítulos)
  {
    chapterId: 'summary-filosofia-a-critica-da-razao-pura',
    family: 'contraste-de-posicoes',
    question: 'O conhecimento deve se conformar aos objetos, ou os objetos ao conhecimento?',
    items: [
      { label: 'Visão pré-kantiana', claim: 'o conhecimento deve se conformar aos objetos, como o receptáculo passivo do real', section: 'A revolução copernicana', quote: 'nosso conhecimento deve se conformar aos objetos' },
      { label: 'Kant', claim: 'os objetos, enquanto conhecidos, é que se conformam à estrutura da mente', section: 'A revolução copernicana', quote: 'os objetos, enquanto conhecidos, devem se conformar à estrutura do nosso aparato cognitivo' },
      { label: 'A síntese kantiana', claim: 'nem o racionalismo puro nem o empirismo puro bastam: um funda o outro', section: 'Síntese entre racionalismo e empirismo', quote: 'intuições sem conceitos são cegas, conceitos sem intuições são vazios' },
    ],
  },
  {
    chapterId: 'summary-filosofia-a-relacao-entre-fe-e-razao',
    family: 'contraste-de-posicoes',
    question: 'Fé e razão podem contradizer-se, ou são vias conciliáveis?',
    items: [
      { label: 'Fideísmo', claim: 'a fé é independente da razão e pode até contrariá-la sem prejuízo', section: 'As posições possíveis', quote: 'a fé é independente da razão e pode até contrariá-la sem prejuízo' },
      { label: 'Racionalismo estrito', claim: 'só se deve aceitar o que a razão consegue demonstrar', section: 'As posições possíveis', quote: 'só se deve aceitar aquilo que a razão demonstra' },
      { label: 'Harmonia', claim: 'fé e razão são vias distintas que não se contradizem entre si', section: 'As posições possíveis', quote: 'fé e razão são vias distintas que não se contradizem' },
    ],
  },
  {
    chapterId: 'summary-filosofia-a-teoria-das-ideias-de-platao',
    family: 'contraste-de-posicoes',
    question: 'Onde está o conhecimento verdadeiro: no que muda ou no que permanece?',
    items: [
      { label: 'Heráclito', claim: 'tudo flui e nada permanece; conhecimento estável seria impossível', section: 'Solução ao problema herdado', quote: 'tudo flui e nada permanece' },
      { label: 'Parmênides', claim: 'o ser é uno, imóvel e imutável; a mudança que percebemos é ilusão dos sentidos', section: 'Solução ao problema herdado', quote: 'o ser é uno, imóvel e imutável, e a mudança que percebemos seria ilusão dos sentidos' },
      { label: 'Platão', claim: 'concede a cada um seu domínio: o sensível a Heráclito, o inteligível a Parmênides', section: 'Solução ao problema herdado', quote: 'Platão resolve a disputa concedendo a cada um seu domínio' },
    ],
  },
  {
    chapterId: 'summary-filosofia-empirismo-britanico-locke-berkeley-e-hume',
    family: 'contraste-de-posicoes',
    question: 'De onde vêm as ideias, e o que resta quando levamos essa origem a sério?',
    items: [
      { label: 'Locke', claim: 'a mente nasce tábula rasa; todo conteúdo vem da experiência', section: 'A tese central', quote: 'a mente ao nascer é tabula rasa, folha em branco' },
      { label: 'Berkeley', claim: 'ser é ser percebido; não há matéria independente de toda percepção', section: 'Berkeley', quote: 'esse est percipi' },
      { label: 'Hume', claim: 'o eu não é substância encontrável, apenas um feixe de percepções em sucessão', section: 'Hume', quote: 'o eu é apenas um feixe de percepções' },
    ],
  },
  {
    chapterId: 'summary-filosofia-filosofia-politica-contemporanea',
    family: 'contraste-de-posicoes',
    question: 'O que fundamenta a ordem política: o indivíduo abstrato, a comunidade, ou o processo deliberativo?',
    items: [
      { label: 'Rawls', claim: 'princípios de justiça devem ser escolhidos por trás de um véu da ignorância imparcial', section: 'Liberalismo e suas críticas', quote: 'o experimento mental do véu da ignorância' },
      { label: 'Sandel', claim: 'a pessoa é constituída por seus vínculos comunitários, não um indivíduo abstrato e descolado', section: 'Liberalismo e suas críticas', quote: 'a pessoa é constituída por seus vínculos comunitários, tradições e papéis sociais' },
      { label: 'Habermas', claim: 'a legitimidade política vem da qualidade da deliberação pública, não só da contagem de votos', section: 'Democracia em disputa', quote: 'a legitimidade de uma decisão política não vem apenas da contagem de votos' },
    ],
  },
  {
    chapterId: 'summary-filosofia-heraclito-e-parmenides-o-ser-e-o-devir',
    family: 'contraste-de-posicoes',
    question: 'O que é real: o que muda ou o que permanece?',
    items: [
      { label: 'Heráclito', claim: 'a realidade é fluxo permanente; tudo passa, nada permanece', section: 'Heráclito e o devir', quote: 'a realidade é fluxo permanente: tudo passa, nada permanece' },
      { label: 'Parmênides', claim: 'o ser é, o não-ser não é, nem pode de modo algum ser pensado ou dito', section: 'Parmênides e o ser', quote: 'o ser é, e o não-ser não é, nem pode de modo algum ser pensado ou dito' },
      { label: 'Aristóteles', claim: 'uma terceira via, com potência e ato, concilia a mudança heraclitiana com a permanência exigida por Parmênides', section: 'A herança do problema', quote: 'uma terceira via que tenta conciliar a intuição heraclitiana de que as coisas mudam com a exigência parmenídica' },
    ],
  },
  {
    chapterId: 'summary-filosofia-justica-e-direitos-humanos',
    family: 'contraste-de-posicoes',
    question: 'O que torna justa uma distribuição: o procedimento que a gerou, o resultado final, ou a história das trocas?',
    items: [
      { label: 'Teoria procedimental (Rawls)', claim: 'se o procedimento de escolha foi imparcial, o resultado distributivo é justo, seja ele qual for', section: 'Concepções de justiça', quote: 'o resultado distributivo dele decorrente é justo, independentemente de qual seja seu conteúdo específico' },
      { label: 'Teoria histórica (Nozick)', claim: 'uma distribuição é justa se vem de aquisições e transferências voluntárias legítimas, não de um padrão final', section: 'Concepções de justiça', quote: 'uma distribuição é justa se resultou de aquisições originais legítimas seguidas de transferências voluntárias legítimas' },
      { label: 'Teorias de resultado', claim: 'a justiça se julga comparando o padrão distributivo final a um critério substantivo desejável', section: 'Concepções de justiça', quote: 'avaliam diretamente o padrão distributivo final, comparando-o a um critério substantivo desejável' },
    ],
  },
  {
    chapterId: 'summary-filosofia-o-ideal-iluminista-de-razao-e-progresso',
    family: 'contraste-de-posicoes',
    question: 'A razão iluminista sempre liberta?',
    items: [
      { label: 'Kant', claim: 'sapere aude: a razão autônoma emancipa o indivíduo da tutela alheia', section: 'Saída da menoridade', quote: 'sapere aude' },
      { label: 'Adorno e Horkheimer', claim: 'reduzida a cálculo instrumental, a própria razão iluminista se converteu em instrumento de dominação técnica', section: 'Críticas ao Iluminismo', quote: 'teria se convertido em seu oposto — instrumento de dominação técnica' },
      { label: 'Crítica pós-colonial', claim: 'o ideal iluminista de razão universal serviu, na prática histórica, para justificar a colonização europeia', section: 'Críticas ao Iluminismo', quote: 'o próprio ideal iluminista de razão universal serviu, historicamente, para justificar a colonização europeia' },
    ],
  },
  {
    chapterId: 'summary-filosofia-os-filosofos-da-physis-tales-anaximandro-e-anaximenes',
    family: 'contraste-de-posicoes',
    question: 'Qual é o princípio de que tudo é feito?',
    items: [
      { label: 'Tales', claim: 'a água como arché', section: 'As três respostas', quote: 'propõe a água como arché' },
      { label: 'Anaximandro', claim: 'o ápeiron, o indeterminado e ilimitado, por trás de todo elemento sensível', section: 'As três respostas', quote: 'propondo em seu lugar o ápeiron — o indeterminado, o ilimitado' },
      { label: 'Anaxímenes', claim: 'o ar, que gera a diversidade por condensação e rarefação', section: 'As três respostas', quote: 'condensação (que produz água, terra, pedra) e rarefação (que produz fogo)' },
    ],
  },
  {
    chapterId: 'summary-filosofia-os-sofistas-e-a-crise-da-verdade',
    family: 'contraste-de-posicoes',
    question: 'A verdade é relativa?',
    items: [
      { label: 'Protágoras', claim: 'o homem é a medida de todas as coisas; não há verdade objetiva independente de quem a afirma', section: 'Relativismo', quote: 'o homem é a medida de todas as coisas, das que são, enquanto são, e das que não são, enquanto não são' },
      { label: 'Crítica de Platão', claim: 'os sofistas vendem persuasão sem compromisso com a verdade, como bajulação que agrada sem cuidar da saúde', section: 'Crítica e reabilitação', quote: 'uma "arte de bajulação" análoga à culinária que agrada ao paladar' },
      { label: 'Reabilitação historiográfica', claim: 'a historiografia contemporânea reconhece os sofistas como educadores que democratizaram a formação retórica e política', section: 'Crítica e reabilitação', quote: 'os sofistas foram educadores importantes que democratizaram, ainda que mediante pagamento, um tipo de formação retórica e política antes restrita a poucos' },
    ],
  },
  {
    chapterId: 'summary-filosofia-patristica-e-santo-agostinho',
    family: 'contraste-de-posicoes',
    question: 'De onde vem o mal, e como fé e razão respondem a essa pergunta?',
    items: [
      { label: 'Agostinho (fé e razão)', claim: 'a fé precede e ilumina o entendimento, sem dispensá-lo', section: 'Conciliar fé e filosofia', quote: 'creio para compreender' },
      { label: 'Maniqueísmo', claim: 'o mal seria um princípio cósmico próprio, tão real quanto o bem, em conflito eterno com ele', section: 'O problema do mal', quote: 'dois princípios cósmicos opostos e igualmente reais, o bem e o mal, em conflito eterno' },
      { label: 'Agostinho (privatio boni)', claim: 'o mal não é substância própria, mas privação do bem devido', section: 'O problema do mal', quote: 'o mal não é substância positiva com existência própria, mas privação do bem' },
    ],
  },
  {
    chapterId: 'summary-filosofia-politica-aristotelica-o-homem-como-animal-politico',
    family: 'contraste-de-posicoes',
    question: 'Que forma de governo é melhor, e o que a corrompe?',
    items: [
      { label: 'Zoon politikon', claim: 'o ser humano só realiza plenamente sua natureza na vida política organizada', section: 'Zoon politikon', quote: 'um zoon politikon, um animal político' },
      { label: 'Politeia', claim: 'o governo misto que visa o bem comum é a forma mais estável na prática', section: 'Formas de governo', quote: 'a politeia, que Aristóteles considera a forma mista mais estável na prática' },
      { label: 'Formas degeneradas', claim: 'toda forma correta de governo degenera quando passa a visar o interesse de quem governa', section: 'Formas de governo', quote: 'a monarquia (governo de um visando o bem comum) degenera em tirania (governo de um visando interesse pessoal)' },
    ],
  },
  {
    chapterId: 'summary-filosofia-racionalismo-continental-espinosa-e-leibniz',
    family: 'contraste-de-posicoes',
    question: 'O que garante certeza ao conhecimento?',
    items: [
      { label: 'Espinosa', claim: 'existe uma única substância infinita; tudo mais é modo dela', section: 'Espinosa', quote: 'existe apenas uma única substância infinita, que ele identifica simultaneamente com Deus e com a Natureza' },
      { label: 'Leibniz', claim: 'a realidade é feita de infinitas mônadas simples que não interagem causalmente entre si', section: 'Leibniz', quote: 'pluralismo radical de substâncias simples e indivisíveis chamadas mônadas' },
      { label: 'Harmonia preestabelecida', claim: 'a coordenação entre as mônadas vem de uma sincronização divina prévia, não de interação real', section: 'Leibniz', quote: 'harmonia preestabelecida por Deus desde a criação' },
    ],
  },
  {
    chapterId: 'summary-filosofia-etica-aplicada-e-bioetica',
    family: 'contraste-de-posicoes',
    question: 'Como decidir em dilemas de vida e morte, quando os princípios da bioética entram em conflito?',
    items: [
      { label: 'Autonomia', claim: 'o paciente tem direito de decidir, informado, sobre o próprio corpo e tratamento', section: 'Princípios da bioética', quote: 'respeito à capacidade do paciente de tomar decisões informadas sobre o próprio corpo e tratamento' },
      { label: 'Beneficência', claim: 'a equipe médica tem a obrigação positiva de promover o bem-estar do paciente', section: 'Princípios da bioética', quote: 'obrigação positiva de promover o bem-estar do paciente' },
      { label: 'O conflito real', claim: 'respeitar a autonomia de quem recusa tratamento pode conflitar diretamente com a beneficência', section: 'Princípios da bioética', quote: 'respeitar plenamente a autonomia de um paciente que recusa tratamento pode conflitar com o princípio de beneficência' },
    ],
  },
];
