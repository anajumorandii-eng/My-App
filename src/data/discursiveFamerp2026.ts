// Famerp 2026, 2º dia (Conhecimentos Específicos): as 20 questões
// discursivas, com enunciado transcrito do caderno oficial (FMRP2501) e
// respostas-modelo escritas e calculadas do zero para o CRIVO. Não há
// gabarito oficial discursivo; por isso cada resposta mostra o raciocínio
// inteiro, para a estudante conferir o caminho e não só o número.
//
// As figuras são recortes do caderno; o enunciado também descreve o que
// cada uma mostra, para a questão continuar legível se a imagem não carregar.

import type { DiscursiveQuestion } from '../types';

const SRC = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2026/2dia/famerp2026_2dia_prova.pdf';
const fig = (n: number, alt: string) => [{ url: `/question-media/discursivas/famerp-2026/q${String(n).padStart(2, '0')}.webp`, alt }];

const base = { board: 'Famerp', year: 2026, sourceUrl: SRC } as const;

export const famerp2026Discursive: DiscursiveQuestion[] = [
  {
    ...base, id: 'disc_famerp_2026_q01', topicId: 'bio_ecologia', subject: 'Biologia',
    topic: 'Petróleo na Foz do Amazonas — acidificação dos oceanos e corais',
    prompt: 'Até 17 de junho de 2025, apenas a Petrobras tinha concessões e buscava licença para explorar petróleo na bacia marítima Foz do Amazonas. Com o leilão realizado naquele dia, outras petroleiras também arremataram blocos na região. Há diversos riscos: é uma bacia pouco estudada ecologicamente, próxima do grande sistema recifal amazônico, com correntes fortíssimas, o que aumenta a chance de acidentes. Um possível derramamento de óleo poderia afetar a fauna e a flora da região. (g1, 09.07.2025, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Qual gás de efeito estufa é liberado na queima de combustíveis derivados do petróleo? Por que esse gás contribui para a acidificação das águas dos mares?' },
      { letter: 'b', prompt: 'Por que o acúmulo de petróleo na superfície da água do mar pode causar a morte dos corais?' },
    ],
    modelAnswer: [
      'Item a: dióxido de carbono (CO₂). Dissolvido no mar, reage com a água formando ácido carbônico (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻); o aumento de H⁺ baixa o pH da água.',
      'Item b: a mancha de óleo bloqueia a luz e reduz as trocas gasosas com a atmosfera. Sem luz, as algas simbiontes dos corais (zooxantelas) não fazem fotossíntese e deixam de fornecer matéria orgânica e O₂; com menos O₂ dissolvido, os corais morrem (além da toxicidade direta dos hidrocarbonetos).',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q02', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Embriologia — notocorda, tubo neural e celoma',
    prompt: 'Dentro do mesoderma, uma série de células se junta em torno de um fino eixo para formar a notocorda, estrutura em forma de bastão que vai da frente às costas do embrião. A notocorda orientará a formação do embrião, expelindo proteínas indutoras. Em resposta, logo acima da notocorda, uma seção do ectoderma invagina, dobrando-se para dentro e formando um tubo. (Siddhartha Mukherjee, A canção da célula, 2023, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Cite o nome do tubo que é formado logo acima da notocorda. Que cavidade corpórea é revestida inteiramente por mesoderme?' },
      { letter: 'b', prompt: 'Que estrutura substitui a notocorda durante o desenvolvimento embrionário humano? Alguns vírus podem infectar as células embrionárias e causar malformações fetais. Como esses vírus chegam ao embrião humano para infectar essas células?' },
    ],
    modelAnswer: [
      'Item a: tubo neural (origina encéfalo e medula espinal). A cavidade revestida inteiramente por mesoderme é o celoma (celoma verdadeiro).',
      'Item b: a coluna vertebral (as vértebras, que se formam ao redor da notocorda; restos dela persistem no núcleo pulposo dos discos). Os vírus estão no sangue materno e atravessam a placenta, chegando ao embrião pela circulação fetal (ex.: vírus da rubéola, zika).',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q03', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Imunologia — fagocitose pelo macrófago e apresentação de antígeno',
    prompt: 'A figura representa a atividade de um macrófago humano: uma bactéria ligada a receptores da membrana é englobada (endocitose) com participação da actina, formando um endossomo; este se funde ao lisossomo, formando o endolisossomo, onde ocorre a digestão, restando um vacúolo digestivo. (Si-Yuan Li et al., Cancers, 2023, adaptado)',
    figures: fig(3, 'Macrófago englobando bactéria: endocitose, endossomo, lisossomo, endolisossomo e vacúolo digestivo'),
    subItems: [
      { letter: 'a', prompt: 'Cite o tipo de endocitose que o macrófago realiza para englobar a bactéria. A qual grupo orgânico pertence a actina?' },
      { letter: 'b', prompt: 'Que molécula componente das membranas celulares possibilita a fusão entre o endossomo e o lisossomo? Como o macrófago sinaliza para os linfócitos T auxiliadores (CD4) a existência de um antígeno no corpo humano?' },
    ],
    modelAnswer: [
      'Item a: fagocitose (englobamento de partícula sólida por pseudópodes). A actina é uma proteína.',
      'Item b: os fosfolipídios, que formam a bicamada fluida e permitem que as duas membranas se fundam. O macrófago apresenta fragmentos do antígeno digerido em sua superfície ligados a moléculas do MHC de classe II; o linfócito T CD4 reconhece esse complexo pelo receptor TCR e é ativado.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q04', topicId: 'bio_fisio_vegetal', subject: 'Biologia',
    topic: 'Fisiologia vegetal — abertura estomática e absorção de água',
    prompt: 'O gráfico mostra a absorção de água e o comportamento estomático em plantas de regiões tropicais durante 24 horas. A abertura estomática sobe no início do dia e cai no fim da tarde; a absorção de água acompanha com atraso. Uma curva tracejada marcada com X mostra uma queda temporária da abertura estomática por volta do meio do dia. (Armênio Uzunian e Ernesto Birner, Biologia 2, 2013, adaptado)',
    figures: fig(4, 'Gráfico de abertura estomática e absorção de água ao longo de 24 horas, com queda X ao meio-dia'),
    subItems: [
      { letter: 'a', prompt: 'Por que os estômatos abrem durante o dia? Qual a influência da elevada umidade do ar sobre a transpiração estomática?' },
      { letter: 'b', prompt: 'Qual o hormônio vegetal induz o fechamento dos estômatos? Em que condições ambientais, ao longo do dia, os estômatos apresentam o comportamento indicado pela letra X no gráfico?' },
    ],
    modelAnswer: [
      'Item a: a luz estimula a entrada de íons K⁺ nas células-guarda; a água entra por osmose, elas ficam túrgidas e o ostíolo se abre. Isso permite a entrada de CO₂ para a fotossíntese. Com umidade do ar elevada, a diferença de concentração de vapor entre a folha e o ar é menor, e a transpiração diminui.',
      'Item b: ácido abscísico. O fechamento X ocorre nas horas mais quentes e secas do dia (alta temperatura, baixa umidade, ventos), quando a perda de água pela transpiração supera a absorção e a planta entra em déficit hídrico.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q05', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Digestão — ativação do pepsinogênio',
    prompt: 'Em um experimento, o pepsinogênio extraído do tubo digestório de um porco foi purificado e adicionado a três tubos com carne. Tubo 1: pepsinogênio + água → carne não digerida. Tubo 2: pepsinogênio + ácido + água → carne digerida. Tubo 3: bicarbonato + pepsinogênio + ácido + água → carne não digerida.',
    figures: fig(5, 'Três tubos de ensaio com carne: só o tubo com pepsinogênio e ácido digeriu'),
    subItems: [
      { letter: 'a', prompt: 'Qual órgão do tubo digestório produz pepsinogênio? Qual o nome do ácido produzido no estômago?' },
      { letter: 'b', prompt: 'Por que no tubo 2 ocorreu a digestão da carne? Qual a influência do bicarbonato sobre a ausência de digestão da carne no tubo 3?' },
    ],
    modelAnswer: [
      'Item a: o estômago (células principais das glândulas gástricas). O ácido é o clorídrico (HCl).',
      'Item b: o ácido converte o pepsinogênio inativo em pepsina e mantém o pH ácido em que ela atua, digerindo as proteínas da carne. O bicarbonato neutraliza o ácido; com pH elevado, o pepsinogênio não é ativado (e a pepsina não funcionaria), por isso não há digestão.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q06', topicId: 'bio_codigo_genetico_sintese', subject: 'Biologia',
    topic: 'Dogma central — replicação, código degenerado e splicing alternativo',
    prompt: 'A figura representa as etapas do metabolismo de controle: DNA → (1) DNA (duplicação); DNA → (2) RNA mensageiro; RNA mensageiro → (3) proteína.',
    figures: fig(6, 'Esquema: 1 = DNA a DNA, 2 = DNA a RNA mensageiro, 3 = RNA a proteína'),
    subItems: [
      { letter: 'a', prompt: 'Na figura, qual número representa a etapa em que uma mutação gênica pode ser transmitida à descendência de um organismo? Que estrutura celular citoplasmática participa da síntese de uma proteína?' },
      { letter: 'b', prompt: 'Por que modificações nos códons podem resultar na síntese de uma proteína sem alterações em sua sequência original de monômeros? Qual processo permite que um mesmo RNA mensageiro origine proteínas diferentes?' },
    ],
    modelAnswer: [
      'Item a: etapa 1, a replicação (duplicação) do DNA — a mutação copiada nas células da linhagem germinativa passa aos gametas. O ribossomo participa da síntese proteica.',
      'Item b: o código genético é degenerado: vários códons codificam o mesmo aminoácido, então uma troca de base pode manter o aminoácido (mutação silenciosa). O splicing alternativo: o mesmo RNA transcrito (pré-RNAm) tem seus éxons combinados de formas diferentes, gerando RNAm maduros e proteínas diferentes.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q07', topicId: 'bio_genetica', subject: 'Biologia',
    topic: 'Ligação gênica em Drosophila — gametas parentais',
    prompt: 'Em Drosophila melanogaster, a cor do corpo, o tamanho das asas e a cor dos olhos são determinados pelos genes P, A e B. P e A estão ligados e são autossômicos; B está no cromossomo X. A figura mostra os cromossomos de uma mosca macho: um autossomo com P e a, o homólogo com p e A; o cromossomo X com B e o Y sem esse gene.',
    figures: fig(7, 'Cromossomos de mosca macho: autossomos P/a e p/A, cromossomos X (com B) e Y'),
    subItems: [
      { letter: 'a', prompt: 'Qual fenômeno biológico permite que essa mosca macho produza gametas com apenas genes A e P dominantes? Em qual fase da meiose ocorre a separação dos cromossomos X e Y?' },
      { letter: 'b', prompt: 'Cite dois genes que atendem ao conceito proposto pela segunda lei de Mendel. Suponha que, nessa mosca macho, os genes A e P distam 26 UR. Qual a porcentagem de gametas parentais Ap esperados ao final da meiose realizada pelas células gaméticas dessa mosca?' },
    ],
    modelAnswer: [
      'Item a: a permutação (crossing-over) entre os homólogos, que recombina P (de um cromossomo) com A (do outro). X e Y se separam na anáfase I.',
      'Item b: A e B (ou P e B), pois estão em pares de cromossomos diferentes e segregam de forma independente. Os parentais são Pa e pA; 26 UR significam 26% de recombinantes, logo 74% de parentais, divididos igualmente: 37% de gametas Ap.',
    ],
    note: 'Na prática, machos de Drosophila quase não fazem permutação; a questão supõe que façam.',
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2026_q08', topicId: 'bio_biotecnologia', subject: 'Biologia',
    topic: 'Transgênicos e herança ligada ao Z em aves',
    prompt: 'Um bioquímico chamado Mark Tizard e colegas inseriram um gene de água-viva numa galinha. O gene codifica uma proteína fluorescente; uma galinha com essa proteína brilharia sob luz ultravioleta. Tizard imaginou inserir o gene de modo a ser passado apenas para os filhotes machos, para saber o sexo dos pintinhos ainda dentro do ovo. (Elizabeth Kolbert, Sob um céu branco, 2021, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Como é biologicamente denominada a galinha submetida à modificação genética descrita no excerto? Qual a função das enzimas de restrição utilizadas na técnica de engenharia genética?' },
      { letter: 'b', prompt: 'Para que apenas os filhotes machos de uma galinha modificada apresentem o gene para fluorescência, o gene seria inserido no cromossomo sexual Z, no W ou em ambos? Suponha que um filhote macho dessa galinha, com o gene, se desenvolva e seja cruzado com uma galinha sem esse gene. Qual a probabilidade de esse cruzamento gerar um descendente, independentemente do sexo, que produza a proteína fluorescente?' },
    ],
    modelAnswer: [
      'Item a: organismo transgênico (geneticamente modificado com gene de outra espécie). As enzimas de restrição cortam o DNA em sequências específicas, permitindo recortar o gene de interesse e abrir o DNA receptor para inseri-lo.',
      'Item b: no cromossomo Z. Em aves a fêmea é ZW e o macho ZZ: a galinha passa o Z aos filhos machos e o W às fêmeas. O filho macho é Z^G Z; cruzado com fêmea normal (ZW), cada descendente recebe Z^G com probabilidade 1/2. Probabilidade = 1/2 (50%).',
    ],
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2026_q09', topicId: 'qui_estequiometria', subject: 'Química',
    topic: 'Decomposição do CaCO₃ — teor na mistura',
    prompt: 'Para determinar o teor de carbonato de cálcio (CaCO₃; M = 100 g/mol) em 125 g de uma mistura com areia, a mistura foi aquecida: a areia não reagiu e o CaCO₃ se decompôs totalmente: CaCO₃(s) → CaO(s) + CO₂(g). Restaram 81 g de sólido (areia + CaO). Adicionou-se água a esse produto, e o pH da mistura foi 14.',
    figures: fig(9, 'Etapas: mistura de 125 g aquecida resulta em 81 g de sólido; água adicionada dá pH 14'),
    subItems: [
      { letter: 'a', prompt: 'Qual é a carga do cálcio no composto CaO? Classifique esse composto quanto ao seu caráter ácido-base.' },
      { letter: 'b', prompt: 'Calcule a massa, em gramas, de carbonato de cálcio contida na mistura analisada. Qual é o teor percentual de CaCO₃ nessa mistura?' },
    ],
    modelAnswer: [
      'Item a: Ca²⁺. CaO é óxido básico: com água forma Ca(OH)₂, o que explica o pH 14.',
      'Item b: a perda de massa é o CO₂ que saiu: 125 − 81 = 44 g = 1 mol de CO₂. Pela proporção 1:1, havia 1 mol de CaCO₃ = 100 g. Teor = 100/125 = 80%.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q10', topicId: 'qui_polaridade_geometria', subject: 'Química',
    topic: 'Tetracloreto de carbono — metano e limite de exposição',
    prompt: 'O tetracloreto de carbono (CCl₄) é líquido a 20 °C, com densidade 1,6 g/mL. Pela legislação brasileira de saúde no trabalho, a concentração máxima de vapores de CCl₄ no ar não pode exceder 50 mg/m³. Ele pode ser obtido pela reação CH₄(g) + 4 Cl₂(g) → CCl₄(g) + 4 HCl(g).',
    subItems: [
      { letter: 'a', prompt: 'Apresente a fórmula estrutural da molécula de metano. Qual é o caráter das ligações entre o hidrogênio e o carbono no metano?' },
      { letter: 'b', prompt: 'Calcule a massa máxima de vapor de CCl₄, em gramas, que pode estar presente no ar de um galpão de 2 560 m³ que obedece à legislação. A qual volume de CCl₄ líquido, em mL, a 20 °C, essa massa corresponde?' },
    ],
    modelAnswer: [
      'Item a: carbono central ligado por ligações simples a quatro hidrogênios (H–C–H em cruz, geometria tetraédrica). As ligações C–H são covalentes, praticamente apolares (eletronegatividades próximas).',
      'Item b: m = 50 mg/m³ × 2 560 m³ = 128 000 mg = 128 g. V = m/d = 128/1,6 = 80 mL.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q11', topicId: 'qui_termoquimica', subject: 'Química',
    topic: 'Lei de Hess — obtenção do CCl₄',
    prompt: 'Considere a reação 1: CH₄(g) + 4 Cl₂(g) → CCl₄(g) + 4 HCl(g) e as equações: (2) C(s) + 2 H₂(g) → CH₄(g), ΔH° = −75 kJ; (3) C(s) + 2 Cl₂(g) → CCl₄(g), ΔH° = −96 kJ; (4) ½ H₂(g) + ½ Cl₂(g) → HCl(g), ΔH° = −92,3 kJ.',
    subItems: [
      { letter: 'a', prompt: 'A qual grupo da Classificação Periódica pertence o elemento da substância simples envolvida na equação da reação 1? Usando o modelo de Lewis, represente a ligação química dessa substância.' },
      { letter: 'b', prompt: 'Calcule a variação de entalpia padrão da reação 1. Classifique essa reação quanto ao caráter termoquímico.' },
    ],
    modelAnswer: [
      'Item a: a substância simples é o Cl₂; o cloro pertence ao grupo 17 (halogênios). Lewis: cada Cl com três pares não ligantes e um par compartilhado entre eles (:Cl̈–C̈l:), ligação covalente simples.',
      'Item b: as equações 2, 3 e 4 são de formação. ΔH = [ΔHf(CCl₄) + 4·ΔHf(HCl)] − [ΔHf(CH₄) + 4·0] = [−96 + 4(−92,3)] − (−75) = −465,2 + 75 = −390,2 kJ. Reação exotérmica.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q12', topicId: 'qui_eletroquimica', subject: 'Química',
    topic: 'Pilha zinco–manganês em meio alcalino e ácido',
    prompt: 'Uma pilha emprega espécies de zinco em solução de NaOH (polo negativo) e espécies de manganês em ácido sulfúrico (polo positivo), separadas por ponte salina. Semirreações: MnO₂(s) + 4 H⁺(aq) + 2e⁻ → Mn²⁺(aq) + 2 H₂O(l), E° = +1,23 V; Zn(OH)₄²⁻(aq) + 2e⁻ → Zn(s) + 4 OH⁻(aq), E° = −1,21 V. (Mingming Wang et al., Advanced Energy Materials, 2021, adaptado)',
    figures: fig(12, 'Pilha: polo negativo Zn/Zn(OH)4 com OH⁻; ponte salina; polo positivo MnO2/Mn²⁺ com H⁺'),
    subItems: [
      { letter: 'a', prompt: 'Apresente a fórmula unitária do composto formado entre os íons Mn²⁺ e OH⁻. A qual função inorgânica esse composto pertence?' },
      { letter: 'b', prompt: 'Escreva a equação global dessa pilha. Calcule a diferença de potencial (ddp) dessa pilha.' },
    ],
    modelAnswer: [
      'Item a: Mn(OH)₂, uma base (hidróxido).',
      'Item b: o zinco se oxida (inverte-se a semirreação de menor potencial): Zn + 4 OH⁻ → Zn(OH)₄²⁻ + 2e⁻. Somando com a redução do MnO₂: Zn(s) + 4 OH⁻(aq) + MnO₂(s) + 4 H⁺(aq) → Zn(OH)₄²⁻(aq) + Mn²⁺(aq) + 2 H₂O(l). ddp = E°(cátodo) − E°(ânodo) = 1,23 − (−1,21) = 2,44 V.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q13', topicId: 'qui_radioatividade', subject: 'Química',
    topic: 'Ouro-198 — captura de nêutron e decaimento beta',
    prompt: 'O ouro-198 (¹⁹⁸Au) é emissor de partículas beta, usado como traçador. É obtido do ouro natural pela equação 1: ¹⁹⁷₇₉Au + a → ¹⁹⁸₇₉Au + γ. No refino, o ouro metálico é transformado em íon ouro(III), Au³⁺. O decaimento do ouro-198 é dado pela equação 2: ¹⁹⁸₇₉Au → ᴬ_Z X + ⁰₋₁β.',
    subItems: [
      { letter: 'a', prompt: 'Calcule a quantidade de nêutrons do isótopo natural ouro-197. Qual a quantidade total de elétrons do íon ouro(III)?' },
      { letter: 'b', prompt: 'Qual o nome da partícula representada pela letra a na equação 1? Usando a notação ᴬ_Z X, apresente a identidade química do produto do decaimento radioativo do ouro-198 na equação 2.' },
    ],
    modelAnswer: [
      'Item a: nêutrons = 197 − 79 = 118. O Au³⁺ tem 79 − 3 = 76 elétrons.',
      'Item b: na equação 1, a massa sobe de 197 para 198 e a carga continua 79: a partícula tem A = 1 e Z = 0, é um nêutron. Na equação 2: A = 198 e Z = 79 + 1 = 80, o mercúrio: ¹⁹⁸₈₀Hg.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2026_q14', topicId: 'qui_organica_fundamentos', subject: 'Química',
    topic: 'Ácido ferúlico — isomeria cis-trans e esterificação',
    prompt: 'O ácido ferúlico é um antioxidante de origem vegetal. Seu isômero trans é um anel benzênico com OH (posição 4) e OCH₃ (posição 3), ligado a CH=CH–COOH, com os dois H da dupla em lados opostos (ligação marcada com asterisco). A reação do ácido ferúlico com um composto orgânico (composto 1) forma água e o composto 2, igual ao ácido ferúlico mas com –COO–CH₂CH₃ no lugar de –COOH (grupo destacado num círculo).',
    figures: fig(14, 'Estruturas do ácido ferúlico (trans) e do composto 2, com o grupo –COOCH2CH3 destacado'),
    subItems: [
      { letter: 'a', prompt: 'Escreva a fórmula molecular do ácido ferúlico. Desenhe a estrutura do isômero cis desse composto.' },
      { letter: 'b', prompt: 'Represente a fórmula estrutural do composto 1. Qual o nome da função orgânica oxigenada destacada na fórmula do composto 2?' },
    ],
    modelAnswer: [
      'Item a: C₁₀H₁₀O₄ (6 C do anel + 1 C do OCH₃ + 3 C da cadeia; 10 H; 4 O). No isômero cis, os dois H da dupla C=C ficam do mesmo lado, e o anel e o –COOH também ficam do mesmo lado da dupla.',
      'Item b: composto 1 é o etanol, CH₃–CH₂–OH (ácido + álcool → éster + água). A função destacada é éster.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q15', topicId: 'fis_leis_newton', subject: 'Física',
    topic: 'Equilíbrio e plano inclinado com atrito — escorregador',
    prompt: 'Uma criança de peso 400 N está sentada e em repouso na plataforma horizontal de um escorregador, cuja rampa forma ângulo θ com a horizontal.',
    figures: fig(15, 'Criança sentada na plataforma de um escorregador com rampa inclinada de ângulo θ'),
    subItems: [
      { letter: 'a', prompt: 'Calcule, em newtons, a intensidade da resultante das forças sobre a criança e a intensidade da força que a plataforma exerce sobre ela enquanto está em repouso.' },
      { letter: 'b', prompt: 'Sabe-se que sen θ = 0,6, cos θ = 0,8 e que, ao escorregar, a criança tem aceleração constante de 4,0 m/s². Considerando g = 10 m/s², calcule o coeficiente de atrito cinético entre a rampa e as roupas da criança.' },
    ],
    modelAnswer: [
      'Item a: em repouso, a resultante é nula (0 N). Na plataforma horizontal, a força que ela exerce equilibra o peso: 400 N, vertical para cima.',
      'Item b: na rampa, a = g·sen θ − μ·g·cos θ → 4,0 = 10·0,6 − μ·10·0,8 → 4,0 = 6,0 − 8,0·μ → μ = 0,25.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q16', topicId: 'fis_energia', subject: 'Física',
    topic: 'Salto ornamental — energia, empuxo e trabalho',
    prompt: 'Uma atleta de 55 kg deixa o corpo cair de uma plataforma, a partir do repouso, e atinge a água com energia cinética de 5 500 J; seu centro de massa desce uma altura H. Considere g = 10 m/s², densidade da água 1 000 kg/m³, volume do corpo da atleta 5,3 × 10⁻² m³ e nenhuma perda de energia mecânica durante a queda.',
    figures: fig(16, 'Atleta na plataforma e ao tocar a água, com altura H entre as posições do centro de massa'),
    subItems: [
      { letter: 'a', prompt: 'Calcule a energia potencial gravitacional, em joules, da atleta em repouso na plataforma. Calcule a altura H, em metros.' },
      { letter: 'b', prompt: 'Ao penetrar na água, a atleta submerge totalmente e sua velocidade se anula a certa profundidade. Calcule o empuxo sobre ela, em newtons, quando totalmente submersa. Calcule, em joules, o módulo do trabalho resultante das forças desde que ela penetra na água até sua velocidade se anular.' },
    ],
    modelAnswer: [
      'Item a: sem perdas, a energia potencial em relação à superfície da água vira cinética: Ep = 5 500 J. H = Ep/(m·g) = 5 500/(55·10) = 10 m.',
      'Item b: E = d·V·g = 1 000 · 5,3 × 10⁻² · 10 = 530 N. Pelo teorema da energia cinética, o trabalho resultante é a variação de Ec: 0 − 5 500 = −5 500 J; em módulo, 5 500 J.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q17', topicId: 'fis_calorimetria', subject: 'Física',
    topic: 'Dilatação do recipiente e dilatação aparente da glicerina',
    prompt: 'A 20 °C, o volume interno de um recipiente de vidro é 500,00 cm³. Aquecido até 100 °C, seu volume interno aumenta 0,60 cm³.',
    subItems: [
      { letter: 'a', prompt: 'Calcule, em °C⁻¹, os coeficientes de dilatação volumétrica e linear do vidro.' },
      { letter: 'b', prompt: 'Coloca-se 480,00 cm³ de glicerina a 20 °C nesse recipiente, também a 20 °C. O conjunto é aquecido até 100 °C e o volume livre no recipiente fica 1,40 cm³. Calcule a dilatação da glicerina, em cm³, e o coeficiente de dilatação volumétrica da glicerina, em °C⁻¹.' },
    ],
    modelAnswer: [
      'Item a: γ = ΔV/(V₀·Δθ) = 0,60/(500·80) = 1,5 × 10⁻⁵ °C⁻¹. α = γ/3 = 5,0 × 10⁻⁶ °C⁻¹.',
      'Item b: a 100 °C o recipiente tem 500,60 cm³; com 1,40 cm³ livres, a glicerina ocupa 499,20 cm³. ΔV = 499,20 − 480,00 = 19,20 cm³. γ = 19,20/(480·80) = 5,0 × 10⁻⁴ °C⁻¹.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2026_q18', topicId: 'fis_termodinamica_gases', subject: 'Física',
    topic: 'Ciclo de máquina térmica no diagrama P × V',
    prompt: 'Uma máquina térmica executa o ciclo ABCDA no diagrama P × V (P em 10⁴ Pa; V em 10⁻³ m³): A (1,0; 3,0) → B (4,0; 2,0) em linha reta; B → C (4,0; 1,0) a volume constante; C → D (1,0; 1,0) a pressão constante; D → A a volume constante.',
    figures: fig(18, 'Diagrama P x V do ciclo ABCDA'),
    subItems: [
      { letter: 'a', prompt: 'Sendo a substância de trabalho um gás ideal e a temperatura em A igual a 57 °C, calcule a temperatura do gás, em kelvins, no ponto C.' },
      { letter: 'b', prompt: 'Calcule o trabalho, em joules, realizado em um ciclo. Sabendo que a máquina realiza 80 ciclos por minuto, calcule a potência, em watts.' },
    ],
    modelAnswer: [
      'Item a: T_A = 57 + 273 = 330 K. P·V/T constante: (3,0·1,0)/330 = (1,0·4,0)/T_C → T_C = 330 · 4/3 = 440 K.',
      'Item b: o trabalho é a área do ciclo, um trapézio entre AB e DC: bases 2,0 × 10⁴ Pa (em V = 1,0) e 1,0 × 10⁴ Pa (em V = 4,0), altura 3,0 × 10⁻³ m³ → τ = (2,0 + 1,0)/2 × 10⁴ × 3,0 × 10⁻³ = 45 J (sentido horário: trabalho positivo). Potência = 45 J × 80/60 s = 60 W.',
    ],
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2026_q19', topicId: 'fis_optica_geometrica', subject: 'Física',
    topic: 'Reflexão em espelho plano e refração em lâmina de faces paralelas',
    prompt: 'Uma pessoa sentada, de frente para uma parede com janela de vidro plano e vertical, vê por reflexão a imagem de uma lâmpada posicionada exatamente acima de sua cabeça. Na figura: olhos a 1,20 m do solo; lâmpada 1,40 m acima dos olhos; o raio que vai da lâmpada ao vidro forma 30° com a horizontal; β é o ângulo entre o raio refletido e a parede; h é a distância entre a base do vidro e o solo.',
    figures: fig(19, 'Pessoa sentada vendo a lâmpada refletida na janela; raio a 30° da horizontal; detalhe da refração no vidro'),
    subItems: [
      { letter: 'a', prompt: 'Calcule o ângulo β, em graus, e a maior distância h, em metros, entre a base do vidro e o solo para que a pessoa veja a imagem da lâmpada.' },
      { letter: 'b', prompt: 'Um raio da lâmpada incide no vidro com 30° em relação à normal, atravessa-o e emerge paralelo ao incidente. As faces são paralelas, a distância percorrida no vidro é a = 4,2 mm, sen 30° = 0,50 e os índices do ar e do vidro são 1,0 e 1,4. Calcule, em milímetros, a distância X indicada na figura (o deslocamento vertical do raio dentro do vidro, medido a partir da normal no ponto de entrada).' },
    ],
    modelAnswer: [
      'Item a: o vidro é vertical, então sua normal é horizontal; o raio refletido também faz 30° com a horizontal, e portanto β = 90° − 30° = 60° com a parede. Como lâmpada e olhos estão na mesma vertical, o ponto de reflexão fica na metade do desnível: 1,20 + 1,40/2 = 1,90 m. O vidro precisa começar no máximo nessa altura: h = 1,90 m.',
      'Item b: Snell: 1,0 · sen 30° = 1,4 · sen r → sen r = 0,50/1,4. No vidro, o raio percorre a = 4,2 mm, e o desvio vertical em relação à normal é X = a · sen r = 4,2 · 0,50/1,4 = 1,5 mm.',
    ],
    note: 'A leitura de X (deslocamento perpendicular à normal dentro do vidro) foi feita a partir da figura do caderno.',
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2026_q20', topicId: 'fis_eletromagnetismo', subject: 'Física',
    topic: 'Campo de fio retilíneo e força magnética em condutor',
    prompt: 'Um condutor longo e retilíneo, vertical na folha, tem corrente i para cima. O campo magnético que ela produz é proporcional à corrente e inversamente proporcional à distância. No ponto M, à esquerda do fio a uma distância d, o campo vale 6,0 × 10⁻⁶ T, perpendicular à folha e para fora dela. O ponto N fica à direita do fio, a 2d.',
    figures: fig(20, 'Fio vertical com corrente para cima; ponto M à esquerda a d e ponto N à direita a 2d'),
    subItems: [
      { letter: 'a', prompt: 'Determine o vetor campo magnético produzido pela corrente no ponto N: intensidade, em teslas, direção e sentido.' },
      { letter: 'b', prompt: 'Cria-se na região um campo uniforme de 4,0 × 10⁻² T, perpendicular à folha e para dentro. Com corrente de 200 mA, calcule a força sobre 1,0 cm do condutor e indique sua direção e sentido.' },
    ],
    modelAnswer: [
      'Item a: com o dobro da distância, o campo cai à metade: 3,0 × 10⁻⁶ T. Pela regra da mão direita, do lado oposto do fio o sentido se inverte: perpendicular à folha, para dentro.',
      'Item b: F = B · i · L = 4,0 × 10⁻² · 0,200 · 1,0 × 10⁻² = 8,0 × 10⁻⁵ N. Corrente para cima e campo para dentro da folha: a força é horizontal, para a esquerda (regra da mão esquerda/produto vetorial).',
    ],
    suggestedMinutes: 10,
  },
];
