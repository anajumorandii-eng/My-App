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
  // Task 5 — família escala-de-graus (4 capítulos)
  {
    chapterId: 'summary-filosofia-a-alegoria-da-linha-dividida-e-o-conhecimento',
    family: 'escala-de-graus',
    question: 'Que grau de realidade corresponde a cada grau de conhecimento, da sombra à Ideia de Bem?',
    eixo: 'do grau mais distante ao mais próximo do inteligível',
    items: [
      { label: 'Eikasia', claim: 'lida com sombras, reflexos e imagens — cópias de cópias, o grau mais baixo da linha', section: 'A linha e seus segmentos', quote: 'a eikasia (imaginação ou conjectura), lida com sombras, reflexos na água e imagens — cópias de cópias' },
      { label: 'Pistis', claim: 'lida com os próprios objetos sensíveis — animais, plantas e artefatos — e não mais com suas imagens', section: 'A linha e seus segmentos', quote: 'a pistis (crença), lida com os próprios objetos sensíveis, os animais, as plantas e os artefatos que produzimos' },
      { label: 'Dianoia', claim: 'já opera com objetos inteligíveis, os matemáticos, mas ainda raciocina a partir de hipóteses não examinadas e apoiadas em figuras sensíveis', section: 'A linha e seus segmentos', quote: 'a dianoia (pensamento discursivo), que opera com objetos matemáticos e raciocina a partir de hipóteses ainda apoiadas em figuras sensíveis' },
      { label: 'Noesis', claim: 'alcança as Ideias diretamente, sem apoio de imagem alguma, até o princípio não hipotético que é a Ideia de Bem', section: 'A linha e seus segmentos', quote: 'a noesis (intelecção pura), que alcança as Ideias diretamente, sem apoio de imagem alguma, até o princípio não hipotético que é a Ideia de Bem' },
    ],
  },
  {
    chapterId: 'summary-filosofia-a-etica-a-nicomaco-e-a-doutrina-do-meio-termo',
    family: 'escala-de-graus',
    question: 'Onde fica a virtude entre dois vícios opostos, e o que determina esse ponto certo?',
    eixo: 'da deficiência ao excesso; a virtude está no meio',
    items: [
      { label: 'Falta', claim: 'a covardia é falta de audácia diante do perigo — um vício por falta, não uma virtude "mais segura"', section: 'O meio-termo', quote: 'a covardia (deficiência de audácia)' },
      { label: 'Meio', claim: 'a coragem é o meio entre dois vícios — não meio-caminho automático, mas o ponto certo que a prudência (phronesis) discerne em cada situação', section: 'O meio-termo', quote: 'A coragem é o meio entre a temeridade (excesso de audácia diante do perigo) e a covardia (deficiência de audácia)' },
      { label: 'Excesso', claim: 'a temeridade é audácia em excesso diante do perigo — vício simétrico ao da covardia, não uma forma "mais corajosa" de coragem', section: 'O meio-termo', quote: 'a temeridade (excesso de audácia diante do perigo)' },
    ],
  },
  {
    chapterId: 'summary-filosofia-descartes-e-o-metodo-a-duvida-hiperbolica',
    family: 'escala-de-graus',
    question: 'Até onde a dúvida cartesiana consegue avançar antes de encontrar algo que resista a ela?',
    eixo: 'do primeiro grau de dúvida ao mais radical',
    items: [
      { label: 'Sentidos', claim: 'os sentidos enganam ocasionalmente, e quem já foi enganado uma vez tem razão para desconfiar de toda informação sensorial', section: 'Os graus da dúvida', quote: 'os sentidos enganam ocasionalmente (um bastão parece torto na água, objetos distantes parecem menores), e quem já foi enganado uma vez tem razão para desconfiar de toda informação sensorial' },
      { label: 'Sonho', claim: 'não há critério seguro para distinguir vigília de sonho, de modo que toda experiência sensorial presente poderia ser ilusão onírica', section: 'Os graus da dúvida', quote: 'não há critério seguro para distinguir estar acordado de estar sonhando enquanto se sonha, de modo que toda experiência sensorial presente poderia ser ilusão onírica' },
      { label: 'Gênio', claim: 'o grau mais radical: um poder hipotético supremamente enganador que poderia fazer parecer verdadeiro até mesmo o que parece mais evidente à razão, incluindo a própria matemática', section: 'Os graus da dúvida', quote: 'a hipótese do gênio maligno, um poder hipotético supremamente enganador que poderia fazer parecer verdadeiro até mesmo aquilo que parece mais evidente à razão, incluindo a própria matemática' },
    ],
  },
  {
    chapterId: 'summary-filosofia-o-mito-da-caverna',
    family: 'escala-de-graus',
    question: 'Quais etapas o prisioneiro liberto atravessa até contemplar o sol fora da caverna?',
    eixo: 'da sombra na parede à luz do sol',
    items: [
      { label: 'Sombras', claim: 'acorrentado, o prisioneiro toma as sombras projetadas como a totalidade da realidade', section: 'A alegoria', quote: 'os prisioneiros, nunca tendo visto outra coisa, tomam essas sombras projetadas como a totalidade da realidade' },
      { label: 'Fogo', claim: 'já liberto, primeiro vê os próprios objetos que geravam as sombras, depois o fogo que as projetava', section: 'A alegoria', quote: 'primeiro vê os próprios objetos que geravam as sombras, depois o fogo que as projetava' },
      { label: 'Dia', claim: 'já fora da caverna, contempla as coisas reais sob a luz do dia', section: 'A alegoria', quote: 'já fora da caverna, as coisas reais sob a luz do dia' },
      { label: 'Sol', claim: 'por último, quando os olhos já se acostumaram, contempla o próprio sol, fonte de toda luz e visibilidade', section: 'A alegoria', quote: 'por último, quando seus olhos já se acostumaram, o próprio sol, fonte de toda luz e visibilidade' },
    ],
  },
  // Task 6 — família cadeia-de-derivacao (8 capítulos)
  {
    chapterId: 'summary-filosofia-a-critica-de-hume-a-causalidade',
    family: 'cadeia-de-derivacao',
    question: 'Por que a causalidade não pode ser demonstrada racionalmente?',
    items: [
      { label: 'Conjunção constante', claim: 'observamos contiguidade, sucessão e conjunção constante entre os eventos, mas nunca a força que ligaria um ao outro', section: 'O problema', quote: 'Percebemos contiguidade espacial (estavam em contato), sucessão temporal (uma veio antes da outra) e conjunção constante (sempre que uma atinge a outra nas mesmas condições, o mesmo se repete).' },
      { label: 'Sem conexão necessária', claim: 'não há impressão sensorial de necessidade alguma; a ideia de conexão causal necessária fica sem base empírica que a legitime', section: 'O problema', quote: 'Não há impressão sensorial de necessidade alguma.' },
      { label: 'Hábito', claim: 'a necessidade que atribuímos à causalidade não está nos objetos, mas é produzida pelo hábito, que gera expectativa projetada sobre o mundo', section: 'Hábito e expectativa', quote: 'a necessidade que atribuímos à conexão causal não está nos objetos, mas é produzida pelo hábito' },
      { label: 'Indução sem fundamento', claim: 'esse hábito não pode ser justificado racionalmente sem circularidade, deixando a indução — e a ciência empírica — sem fundamento demonstrativo', section: 'O problema da indução', quote: 'esse princípio não pode ser justificado sem circularidade' },
    ],
  },
  {
    chapterId: 'summary-filosofia-a-etica-kantiana-e-o-imperativo-categorico',
    family: 'cadeia-de-derivacao',
    question: 'Como se chega do dever pelo dever à autonomia como fundamento da moral?',
    items: [
      { label: 'Boa vontade', claim: 'só a boa vontade é boa sem restrição, pois vale por querer o dever pelo próprio dever, não pelos resultados que produz', section: 'Dever e boa vontade', quote: 'nada no mundo pode ser considerado bom sem restrição exceto uma boa vontade' },
      { label: 'Agir por dever', claim: 'o valor moral de uma ação não está no resultado nem no sentimento que a acompanha, mas na máxima que a determina', section: 'Dever e boa vontade', quote: 'o critério kantiano, portanto, não está no resultado da ação nem no sentimento que a acompanha, mas na máxima que a determina' },
      { label: 'Imperativo categórico', claim: 'essa máxima deve poder ser universalizada sem se contradizer; se a universalização a destrói, a ação é imoral', section: 'O imperativo categórico', quote: 'agir apenas segundo a máxima que se possa querer que se torne lei universal' },
      { label: 'Autonomia', claim: 'a lei moral obriga porque o próprio sujeito racional a dá a si mesmo, e não porque venha de fora', section: 'Autonomia', quote: 'Autonomia significa literalmente dar a si mesmo a própria lei' },
    ],
  },
  {
    chapterId: 'summary-filosofia-escolastica-e-santo-tomas-de-aquino',
    family: 'cadeia-de-derivacao',
    question: 'Como Tomás de Aquino chega da redescoberta de Aristóteles à ideia de filosofia serva da teologia?',
    items: [
      { label: 'Aristóteles redescoberto', claim: 'o resgate das obras de Aristóteles no século XIII gera um problema teológico urgente: como incorporar um sistema racional pagão sem comprometer a verdade revelada', section: 'O contexto escolástico', quote: 'como incorporar um sistema filosófico pagão, racional e sistemático, sem comprometer a verdade revelada do cristianismo?' },
      { label: 'Fé e razão convergem', claim: 'Tomás resolve a tensão sustentando que fé e razão, corretamente compreendidas, não podem se contradizer, pois ambas têm origem última em Deus', section: 'Tomás e a síntese', quote: 'fé e razão, corretamente compreendidas, não podem se contradizer, pois ambas têm origem última em Deus' },
      { label: 'Duas verdades', claim: 'dessa tese decorre a distinção entre verdades demonstráveis pela razão natural, como a existência de Deus, e verdades reveladas que excedem a razão sem a contradizer', section: 'Tomás e a síntese', quote: 'Ele distingue verdades demonstráveis pela razão natural sem auxílio da revelação (a existência de Deus, certos princípios morais básicos) de verdades reveladas que excedem a capacidade da razão humana, mas não a contrariam' },
      { label: 'Filosofia serva da teologia', claim: 'por isso a filosofia é serva da teologia: a razão filosófica prepara e elucida verdades que a fé fornece em plenitude maior', section: 'Tomás e a síntese', quote: '"serva da teologia" (ancilla theologiae)' },
    ],
  },
  {
    chapterId: 'summary-filosofia-hobbes-e-o-estado-de-natureza',
    family: 'cadeia-de-derivacao',
    question: 'Como se chega da guerra de todos ao soberano?',
    items: [
      { label: 'Igualdade natural', claim: 'os indivíduos têm capacidades naturais aproximadamente iguais — mesmo o mais fraco pode matar o mais forte por astúcia ou aliança', section: 'O estado de natureza', quote: 'mesmo o mais fraco pode matar o mais forte por astúcia ou aliança' },
      { label: 'Guerra de todos', claim: 'dessa igualdade decorre a guerra de todos contra todos, condição em que a vida seria solitária, pobre, sórdida, brutal e curta', section: 'O estado de natureza', quote: 'a vida do homem seria solitária, pobre, sórdida, brutal e curta' },
      { label: 'Pacto entre súditos', claim: 'a razão indica transferir os direitos naturais irrestritos a um soberano único; o contrato ocorre entre os próprios súditos, não entre súditos e soberano', section: 'O contrato', quote: 'o contrato ocorre entre os próprios súditos entre si, e não entre súditos e soberano' },
      { label: 'Soberano absoluto', claim: 'por não ser parte do contrato, o soberano não pode violá-lo nem ser legitimamente destituído pelos súditos', section: 'O contrato', quote: 'este último não é parte do contrato e por isso não pode violá-lo nem ser legitimamente destituído por seus súditos' },
    ],
  },
  {
    chapterId: 'summary-filosofia-locke-e-os-direitos-naturais',
    family: 'cadeia-de-derivacao',
    question: 'Como se chega da lei natural ao direito de resistência?',
    items: [
      { label: 'Lei natural', claim: 'o estado de natureza é regido por uma lei natural acessível à razão, que probe prejudicar vida, liberdade, saúde ou bens de outrem; os direitos são anteriores a qualquer governo', section: 'Estado de natureza segundo Locke', quote: 'uma lei natural acessível à razão, que ensina que ninguém deve prejudicar a vida, a liberdade, a saúde ou os bens de outrem' },
      { label: 'Governo fiduciário', claim: 'o contrato não cria direitos, apenas protege de modo mais eficaz os que já existiam; o governo recebe poder condicionalmente, como um depositário de confiança', section: 'O contrato e o governo limitado', quote: 'o governo instituído é fiduciário, um depositário de confiança que recebe poder condicionalmente, para a finalidade específica de proteger vida, liberdade e propriedade' },
      { label: 'Poder limitado', claim: 'por isso o poder deve ser institucionalmente limitado, para que o próprio governo não se torne ameaça maior aos direitos que deveria proteger', section: 'O contrato e o governo limitado', quote: 'a limitação institucional do poder é justamente o que impede que o remédio contra a insegurança do estado de natureza (o governo) se torne ele mesmo uma ameaça maior aos direitos que deveria proteger' },
      { label: 'Direito de resistência', claim: 'um governo que viola sistematicamente esses direitos rompe o fundamento de sua legitimidade, e o povo recupera o direito de resistir e instituir novo governo', section: 'Direito de resistência', quote: 'o povo recupera o direito de resistir e de instituir novo governo' },
    ],
  },
  {
    chapterId: 'summary-filosofia-logica-e-metafisica-aristotelicas',
    family: 'cadeia-de-derivacao',
    question: 'Como as premissas de um silogismo obrigam a uma conclusão — e o que essa necessidade tem, e não tem, a ver com verdade?',
    items: [
      { label: 'Premissa maior', claim: 'liga o termo maior (mortal) a um termo médio (homem), estabelecendo a premissa geral do silogismo', section: 'Lógica e silogismo', quote: 'todo homem é mortal' },
      { label: 'Premissa menor', claim: 'liga o termo menor (Sócrates) ao mesmo termo médio, conectando o caso particular à premissa geral', section: 'Lógica e silogismo', quote: 'Sócrates é homem' },
      { label: 'Conclusão necessária', claim: 'a conclusão decorre necessariamente das duas premissas, desde que a forma do silogismo seja respeitada', section: 'Lógica e silogismo', quote: 'a conclusão segue necessariamente da verdade das premissas, desde que a forma lógica seja corretamente respeitada' },
      { label: 'Validade ≠ verdade', claim: 'essa necessidade é puramente formal: um silogismo pode ser válido mesmo com premissas falsas, pois a validade diz respeito à estrutura, não ao conteúdo', section: 'Lógica e silogismo', quote: 'Um silogismo pode ser formalmente válido mesmo com premissas falsas' },
    ],
  },
  {
    chapterId: 'summary-filosofia-o-existencialismo-de-sartre',
    family: 'cadeia-de-derivacao',
    question: 'Como se chega da existência precedendo a essência até a má-fé como fuga da liberdade?',
    items: [
      { label: 'Existência precede essência', claim: 'sem Deus como artesão cósmico, o ser humano primeiro existe e só depois se define por suas escolhas; não há natureza humana fixa e prévia', section: 'A existência precede a essência', quote: 'o ser humano primeiro existe, surge no mundo, e só depois, ao longo da vida, se define por meio de suas escolhas' },
      { label: 'Liberdade radical', claim: 'porque nada determina previamente o que o ser humano é, cada indivíduo é inteiramente responsável por aquilo em que se torna', section: 'A existência precede a essência', quote: 'cada indivíduo é inteiramente responsável por aquilo em que se torna por meio de suas próprias escolhas' },
      { label: 'Responsabilidade universal', claim: 'como escolher para si é implicitamente propor um valor universal, cada escolha individual pesa como se fosse escolha por toda a humanidade', section: 'Liberdade e responsabilidade', quote: 'cada indivíduo carrega o peso de estar, em certo sentido, escolhendo por toda a humanidade ao escolher por si mesmo' },
      { label: 'Má-fé', claim: 'a má-fé nega essa liberdade, fingindo que as próprias escolhas decorrem de uma natureza fixa e não de uma escolha constantemente renovada', section: 'Engajamento', quote: 'consiste em fingir para si mesmo que não se é livre, atribuindo as próprias escolhas a determinações externas' },
    ],
  },
  {
    chapterId: 'summary-filosofia-rousseau-e-a-vontade-geral',
    family: 'cadeia-de-derivacao',
    question: 'Como se chega da bondade natural à liberdade civil de obedecer à vontade geral?',
    items: [
      { label: 'Bondade natural', claim: 'o homem natural é solitário, autossuficiente e bom, guiado pelo amor de si e pela piedade, sentimentos pré-sociais que moderam o egoísmo antes de qualquer lei', section: 'O homem natural', quote: 'amor de si (instinto natural de autopreservação, sem malícia) e piedade (repulsa natural ao sofrimento alheio, que modera espontaneamente os impulsos egoístas antes mesmo de qualquer lei ou razão elaborada)' },
      { label: 'Propriedade corrompe', claim: 'a desigualdade e os vícios não são naturais, mas nascem quando alguém cerca um pedaço de terra e o declara seu, inaugurando a propriedade e a dependência mútua', section: 'O homem natural', quote: 'inaugurando a propriedade privada e, com ela, a desigualdade, a competição, a vaidade comparativa e a dependência mútua' },
      { label: 'Alienação à vontade geral', claim: 'para resolver esse problema, cada indivíduo aliena totalmente seus direitos ao corpo coletivo, submetendo-se à vontade geral, distinta da mera soma de vontades particulares', section: 'O contrato e a vontade geral', quote: 'ao corpo coletivo formado pela totalidade dos cidadãos associados, submetendo-se à vontade geral' },
      { label: 'Liberdade civil', claim: 'obedecer à vontade geral, mesmo contrariando a vontade particular, constitui a verdadeira liberdade civil — superior à mera liberdade natural sem lei alguma', section: 'Liberdade e educação', quote: 'obedecer à vontade geral, mesmo quando ela contraria a vontade particular imediata de um indivíduo específico, constitui verdadeira liberdade civil' },
    ],
  },
  // Task 7 — camadas de determinação. Foucault permanece fora desta família:
  // o próprio capítulo recusa um centro/base única e por isso usa contraste.
  {
    chapterId: 'summary-filosofia-a-escola-de-frankfurt-e-a-industria-cultural',
    family: 'camadas-de-determinacao',
    question: 'Como a racionalidade industrial chega à cultura e condiciona a autonomia do público?',
    items: [
      { label: 'Lógica do lucro', claim: 'organiza a produção cultural como indústria planejada para consumo', section: 'Indústria cultural', quote: 'produção industrial padronizada, planejada de cima, destinada ao consumo e organizada pela lógica do lucro' },
      { label: 'Padronização', claim: 'obras aparentemente diferentes repetem a mesma fórmula', section: 'Indústria cultural', quote: 'obras diferentes obedecem à mesma fórmula, variando apenas detalhes superficiais' },
      { label: 'Pseudoindividualização', claim: 'variações mínimas produzem aparência de escolha singular', section: 'Indústria cultural', quote: 'a variação mínima cria ilusão de escolha e singularidade onde há repetição do mesmo esquema' },
      { label: 'Passividade', claim: 'respostas prontas enfraquecem interpretação e negação crítica do existente', section: 'Indústria cultural', quote: 'o consumidor recebe respostas prontas, não é convocado a interpretar' },
    ],
  },
  {
    chapterId: 'summary-filosofia-a-luta-de-classes-na-filosofia-marxista',
    family: 'camadas-de-determinacao',
    question: 'Como a posição na produção condiciona consciência, Estado e transformação histórica?',
    items: [
      { label: 'Relações de produção', claim: 'definem grupos antagônicos conforme controlam ou não os meios de produção', section: 'A tese central', quote: 'grupos definidos por sua posição nas relações de produção' },
      { label: 'Classe em si', claim: 'existe objetivamente antes mesmo de reconhecer seus interesses comuns', section: 'Classe em si e para si', quote: 'o grupo definido objetivamente por sua posição na estrutura econômica' },
      { label: 'Ideologia e Estado', claim: 'naturalizam e reproduzem a ordem da classe economicamente dominante', section: 'Ideologia e Estado', quote: 'representação invertida da realidade que apresenta como natural, eterno e universal aquilo que é histórico' },
      { label: 'Classe para si', claim: 'a consciência e a organização convertem posição objetiva em ação coletiva', section: 'Classe em si e para si', quote: 'reconhece seus interesses comuns, organiza-se politicamente e age coletivamente' },
    ],
  },
  {
    chapterId: 'summary-filosofia-alienacao-e-mais-valia',
    family: 'camadas-de-determinacao',
    question: 'Como a propriedade do produto condiciona as formas de alienação do trabalho?',
    items: [
      { label: 'Produto apropriado', claim: 'o que o trabalhador produz pertence ao capitalista', section: 'As formas de alienação', quote: 'o que produz não lhe pertence, mas ao capitalista' },
      { label: 'Ato forçado', claim: 'trabalhar deixa de expressar capacidades e vira mero meio de sobrevivência', section: 'As formas de alienação', quote: 'o trabalho deixa de ser expressão livre e criativa das capacidades humanas para se tornar atividade forçada' },
      { label: 'Essência negada', claim: 'a repetição imposta nega o trabalho livre e criativo que distingue o humano', section: 'As formas de alienação', quote: 'quando esse trabalho é reduzido a repetição mecânica imposta, o próprio ser genérico humano é negado' },
      { label: 'Relações alienadas', claim: 'as relações sociais assumem forma de competição e exploração mediada pelo mercado', section: 'As formas de alienação', quote: 'a relação social se converte em relação de competição e de exploração mútua mediada pelo mercado' },
    ],
  },
  {
    chapterId: 'summary-filosofia-o-materialismo-historico',
    family: 'camadas-de-determinacao',
    question: 'Como a base material condiciona instituições e ideias sem determinismo mecânico?',
    items: [
      { label: 'Infraestrutura', claim: 'forças produtivas e relações de produção formam a base material', section: 'Infraestrutura e superestrutura', quote: 'compreende as forças produtivas' },
      { label: 'Direito e política', claim: 'erguem-se sobre a base e ajudam a legitimar suas relações', section: 'Infraestrutura e superestrutura', quote: 'A superestrutura compreende tudo o que se ergue sobre essa base: o direito, a política' },
      { label: 'Formas de consciência', claim: 'religião, filosofia, arte e moral também são historicamente condicionadas', section: 'Infraestrutura e superestrutura', quote: 'a religião, a filosofia, a arte, a moral vigente em cada sociedade' },
      { label: 'Efeito de retorno', claim: 'a superestrutura formada reage sobre a base, afastando causalidade mecânica', section: 'Infraestrutura e superestrutura', quote: 'pode exercer efeitos de retorno sobre a própria base econômica' },
    ],
  },
  // Task 8 — movimentos dialéticos
  {
    chapterId: 'summary-filosofia-hegel-e-a-dialetica',
    family: 'movimento-dialetico',
    question: 'Como uma contradição interna transforma uma posição em estágio mais rico?',
    items: [
      { label: 'Posição', claim: 'uma posição inicial é examinada em profundidade', section: 'O movimento dialético', quote: 'uma posição inicial (tese) revela, ao ser examinada a fundo' },
      { label: 'Contradição', claim: 'suas contradições internas geram a negação, não uma oposição arbitrária', section: 'O movimento dialético', quote: 'contradições internas que geram seu oposto' },
      { label: 'Superação', claim: 'cancela, preserva e eleva o verdadeiro de cada lado', section: 'O movimento dialético', quote: 'cancelar, preservar e elevar' },
    ],
  },
  {
    chapterId: 'summary-filosofia-nietzsche-e-a-critica-aos-valores-morais',
    family: 'movimento-dialetico',
    question: 'Como a genealogia desmonta valores herdados e abre a criação de novos valores?',
    items: [
      { label: 'Valor universal', claim: 'os bons costumes parecem nascer de reflexão neutra sobre o bem', section: 'Genealogia da moral', quote: 'não surgiu de reflexão racional neutra sobre o bem' },
      { label: 'Origem interessada', claim: 'a genealogia revela relações de força e ressentimento na origem desses valores', section: 'Genealogia da moral', quote: 'inversão histórica de valores promovida pelos fracos como forma de vingança simbólica contra os fortes' },
      { label: 'Criação ativa', claim: 'superar o niilismo exige criar novos valores e afirmar a vida', section: 'Vontade de potência e além-do-homem', quote: 'capaz de criar seus próprios valores após o colapso dos fundamentos morais tradicionais' },
    ],
  },
  {
    chapterId: 'summary-filosofia-o-metodo-socratico-e-a-maieutica',
    family: 'movimento-dialetico',
    question: 'Como o diálogo transforma certeza aparente em investigação e ideia própria?',
    items: [
      { label: 'Certeza', claim: 'o interlocutor começa seguro de que domina o conceito', section: 'Ironia e maiêutica', quote: 'interlocutor que se apresenta como especialista confiante num tema' },
      { label: 'Aporia', claim: 'perguntas revelam contradições e desfazem a falsa segurança', section: 'Ironia e maiêutica', quote: 'revelam progressivamente contradições internas na posição inicialmente defendida com segurança' },
      { label: 'Maiêutica', claim: 'perguntas direcionadas ajudam o interlocutor a dar à luz uma ideia própria', section: 'Ironia e maiêutica', quote: 'ajuda o interlocutor a "dar à luz" ideias' },
    ],
  },
  {
    chapterId: 'summary-filosofia-foucault-e-as-relacoes-de-poder',
    family: 'contraste-de-posicoes',
    question: 'O poder desce de um centro ou circula nas relações cotidianas?',
    items: [
      { label: 'Modelo jurídico', claim: 'trata o poder como posse centralizada no Estado e exercida sobretudo por proibição', section: 'Poder como relação', quote: 'poder como algo que se possui e se exerce de cima para baixo, concentrado no Estado ou na lei' },
      { label: 'Poder relacional', claim: 'o poder circula numa rede capilar de interações e instituições cotidianas', section: 'Poder como relação', quote: 'relação difusa que atravessa toda a rede social, presente em toda interação' },
      { label: 'Poder produtivo', claim: 'além de reprimir, produz saberes, normas, sujeitos e comportamentos', section: 'Poder como relação', quote: 'produz saberes, discursos, subjetividades e formas de comportamento consideradas normais' },
    ],
  },
];
