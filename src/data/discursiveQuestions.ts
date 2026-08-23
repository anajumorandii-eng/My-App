// Banco de questões discursivas reais de 2ª fase, para o Treino de 2ª Fase.
// Reconstruídas a partir de sites de resolução de cursinhos (Curso Objetivo,
// Elite Campinas, Kuadro, Poliedro Resolve, Indagação, Biologia Resolvida) —
// o ambiente de pesquisa não permite baixar os PDFs oficiais diretamente, só
// buscar e cruzar trechos. O conteúdo e a lógica de resolução têm boa
// confiança; a redação exata pode diferir em pequenos detalhes da prova
// original. Itens de sub-questões que dependiam de figuras/gráficos não
// verificáveis, ou cujo enunciado tinha fontes conflitantes, foram omitidos
// em vez de adivinhados.

import { DiscursiveQuestion } from '../types';

export const boardExamStructure: Record<string, string> = {
  Fuvest: '2ª fase em 2 dias. Dia 1: Português + Redação. Dia 2: 12 questões dissertativas (para Medicina/Biológicas, majoritariamente Biologia, Química e Física), em 4h.',
  'Unicamp / Comvest': '2ª fase em 2 dias consecutivos, ~28 questões dissertativas + redação, até 5h por dia.',
  'Unesp / Vunesp': '2ª fase em 2 dias, 36 questões discursivas + redação, 5h por dia (dia 1: Humanas + Natureza/Matemática; dia 2: Linguagens + redação).',
  Famerp: 'Prova de conhecimentos específicos com 20 questões discursivas (aprox. 8 Biologia, 6 Química, 6 Física), em 4h.',
  Unifesp: 'Prova II (dia 2) com 20 questões discursivas, aprox. 5 de cada: Biologia, Química, Física e Matemática, em 4h.',
};

export const discursiveQuestions: DiscursiveQuestion[] = [
  {
    id: 'disc_fuvest_bio_2024',
    topicId: 'bio_fisio_animal',
    board: 'Fuvest',
    year: 2024,
    subject: 'Biologia',
    topic: 'Hematologia e imunologia — interpretação de exame de sangue',
    prompt: 'Um exame de sangue de um paciente adulto apresenta os resultados de vários parâmetros da série vermelha (hemoglobina, hematócrito) e da série branca (leucócitos totais, neutrófilos, entre outros), acompanhados dos respectivos valores de referência.',
    subItems: [
      { letter: 'a', prompt: 'Que evidências permitem dizer que essa pessoa não tem um quadro de anemia?' },
      { letter: 'b', prompt: 'Cite todos os elementos que permitem afirmar que essa pessoa tem um quadro infeccioso e inflamatório.' },
    ],
    modelAnswer: [
      'Item a: os valores da série vermelha (hemoglobina e hematócrito) estão dentro da faixa de referência normal — não há sinal de anemia.',
      'Item b: leucocitose (contagem de leucócitos totais acima do normal), impulsionada principalmente por neutrófilos elevados — os neutrófilos são células fagocitárias que aumentam rapidamente em processos infecciosos/inflamatórios, especialmente de origem bacteriana.',
    ],
    suggestedMinutes: 16,
    uncertain: true,
    note: 'O item (c) original desta questão (identificação do patógeno específico a partir da tabela) não pôde ser confirmado com confiança e foi omitido aqui — os itens (a) e (b) têm boa cobertura de fontes.',
  },
  {
    id: 'disc_fuvest_fis_2024',
    topicId: 'fis_calorimetria',
    board: 'Fuvest',
    year: 2024,
    subject: 'Física',
    topic: 'Termologia e densidade — degelo do Ártico',
    prompt: 'Um estudo mostrou que, desde o início do século XXI, o volume de gelo acumulado no oceano Ártico durante o inverno diminuiu em cerca de 6000 km³. Dados: densidade do gelo = 0,92 g/cm³; área do oceano Ártico ≈ 1,5×10⁷ km²; calor específico do gelo = 2×10³ J/(kg·°C); calor latente de fusão do gelo = 3×10⁵ J/kg.',
    subItems: [
      { letter: 'a', prompt: 'Estime, em kg, o acréscimo na massa de água no oceano devido ao degelo no Ártico desde o início do século XXI.' },
      { letter: 'b', prompt: 'Se todo esse gelo perdido formasse uma camada sobre a superfície do oceano Ártico, qual seria a espessura dessa camada?' },
      { letter: 'c', prompt: 'Estime a mínima quantidade de energia (em joules) para derreter completamente uma tonelada de gelo inicialmente a −20°C.' },
    ],
    modelAnswer: [
      'Item a: V = 6000 km³ = 6×10¹² m³; massa = densidade × V = 0,92×10³ kg/m³ × 6×10¹² m³ ≈ 5,5×10¹⁵ kg.',
      'Item b: espessura = V / área = 6×10¹² m³ / 1,5×10¹³ m² = 0,4 m (40 cm).',
      'Item c: Q = m·c·ΔT + m·Lf = (1000×2000×20) + (1000×3×10⁵) = 4×10⁷ + 3×10⁸ = 3,4×10⁸ J.',
    ],
    suggestedMinutes: 20,
  },
  {
    id: 'disc_fuvest_qui_2024',
    topicId: 'qui_equilibrio',
    board: 'Fuvest',
    year: 2024,
    subject: 'Química',
    topic: 'Equilíbrio químico — intemperismo e acidificação dos oceanos',
    prompt: 'Alguns minerais alcalinos, em contato com soluções ácidas, sofrem intemperismo químico. Quanto menor a razão Si:O de um mineral, maior sua propensão ao intemperismo (e à neutralização de ácido). A queima de combustíveis fósseis e a emissão de CO₂ resultam na acidificação dos oceanos, pois o CO₂ atmosférico governa o equilíbrio do carbonato na água do mar.',
    subItems: [
      { letter: 'a', prompt: 'Entre minerais com razões Si:O diferentes, qual teria maior capacidade de neutralizar uma mesma quantidade de chuva ácida? Justifique.' },
      { letter: 'b', prompt: 'Seria possível remover CO₂ da atmosfera dispersando grandes quantidades de minerais alcalinos no oceano? Explique com base nos equilíbrios químicos envolvidos.' },
    ],
    modelAnswer: [
      'Item a: o mineral com a menor razão Si:O (ex.: olivina) consome maior quantidade de íons H⁺ por unidade de massa e, portanto, tem maior capacidade de neutralizar chuva ácida.',
      'Item b: sim — minerais alcalinos consomem H⁺, deslocando o equilíbrio carbonato/bicarbonato no sentido de favorecer a captura de CO₂ dissolvido, reduzindo a acidez oceânica (mecanismo análogo ao "enhanced weathering").',
    ],
    suggestedMinutes: 18,
    uncertain: true,
    note: 'A tabela original com os valores exatos da razão Si:O de cada mineral não pôde ser recuperada com confiança — a questão é apresentada aqui em versão conceitual, sem os números da tabela.',
  },
  {
    id: 'disc_fuvest_mat_2022',
    topicId: 'mat_dados_probabilidade',
    board: 'Fuvest',
    year: 2022,
    subject: 'Matemática',
    topic: 'Conjuntos, probabilidade e análise combinatória',
    prompt: 'Considere o conjunto C de pontos do plano cartesiano da forma (m, n), com m e n pertencentes a {3, 4, 5, 6, 7, 8, 9}.',
    subItems: [
      { letter: 'a', prompt: 'Apresente todos os pontos (m, n) de C para os quais o produto m·n é maior do que 60.' },
      { letter: 'b', prompt: 'Sorteando-se um ponto (m, n) de C, com iguais probabilidades para todos os pontos, qual é a probabilidade de que a fração m/n seja redutível (m e n possuem divisor comum além de 1)?' },
    ],
    modelAnswer: [
      'Item a: os pares com produto maior que 60 são (7,9), (8,8), (8,9), (9,7), (9,8) e (9,9).',
      'Item b: |C| = 7×7 = 49 pontos totais. É preciso contar sistematicamente os pares (m,n) com mdc(m,n) > 1 (múltiplos comuns dentro de {3,...,9}) e dividir essa contagem por 49.',
    ],
    suggestedMinutes: 20,
    uncertain: true,
    note: 'Um terceiro item desta questão original foi omitido por conflito entre fontes sobre seu enunciado exato.',
  },
  {
    id: 'disc_comvest_bio_2020',
    topicId: 'bio_evolucao',
    board: 'Unicamp / Comvest',
    year: 2020,
    subject: 'Biologia',
    topic: 'Evolução divergente e homologia',
    prompt: 'Considerando a nadadeira anterior de uma baleia como exemplo, defina evolução divergente e explique por que essa estrutura é um exemplo desse processo.',
    modelAnswer: [
      'Evolução divergente ocorre quando duas ou mais estruturas têm uma origem evolutiva comum (homologia), mas divergem funcional e morfologicamente ao longo do tempo sob pressões seletivas distintas.',
      'O membro anterior da baleia (nadadeira), do ser humano (braço) e do morcego (asa) compartilham a mesma origem óssea do tetrápode ancestral, mas divergiram para funções muito diferentes — natação, manipulação e voo, respectivamente.',
    ],
    suggestedMinutes: 14,
    uncertain: true,
    note: 'A redação exata do enunciado de 2020 não foi totalmente confirmada — o conteúdo e a lógica de resposta esperada são o foco aqui.',
  },
  {
    id: 'disc_comvest_qui_2024',
    topicId: 'qui_equilibrio',
    board: 'Unicamp / Comvest',
    year: 2024,
    subject: 'Química',
    topic: 'Equilíbrio de precipitação — cálculo renal (oxalato de cálcio)',
    prompt: 'O oxalato de cálcio, Ca(C₂O₄), está associado à formação de pedras nos rins (cálculo renal), formadas por precipitação a partir de soluções aquosas contendo os íons Ca²⁺ e C₂O₄²⁻.',
    subItems: [
      { letter: 'a', prompt: 'Escreva a equação química e a expressão da constante de equilíbrio (Kps) que representam a formação da pedra no rim. Explique, do ponto de vista do equilíbrio químico, o que significa a urina estar "supersaturada" em oxalato de cálcio.' },
    ],
    modelAnswer: [
      'Ca²⁺(aq) + C₂O₄²⁻(aq) ⇌ CaC₂O₄(s), com Kps = [Ca²⁺][C₂O₄²⁻].',
      '"Supersaturada" significa que o produto iônico [Ca²⁺][C₂O₄²⁻] na urina excede o valor de Kps, deslocando o equilíbrio no sentido da precipitação — ou seja, favorecendo a formação do sólido (cálculo renal).',
    ],
    suggestedMinutes: 10,
    uncertain: true,
    note: 'Um segundo item desta questão original dependia da leitura de um gráfico de concentração de citrato e foi omitido — mantido apenas o item conceitual, verificado com boa confiança.',
  },
  {
    id: 'disc_unesp_geo_2024',
    topicId: 'geo_populacao_urbana_brasil',
    board: 'Unesp / Vunesp',
    year: 2024,
    subject: 'Geografia',
    topic: 'Demografia — crescimento populacional e bônus demográfico',
    prompt: 'A Organização das Nações Unidas (ONU) confirmou que a Índia ultrapassou a China em tamanho de população em abril de 2023, tornando-se o país mais populoso do planeta pela primeira vez desde 1950.',
    subItems: [
      { letter: 'a', prompt: 'Identifique dois conceitos que tratam do crescimento de uma população, aplicáveis a esse contexto.' },
      { letter: 'b', prompt: 'Considerando o perfil demográfico indiano, explique o que é "bônus demográfico" e cite um desafio socioeconômico que a Índia precisa administrar diante dessa condição.' },
    ],
    modelAnswer: [
      'Item a: crescimento vegetativo (natalidade menos mortalidade) e bônus demográfico.',
      'Item b: bônus demográfico é a fase da transição demográfica em que a proporção de população em idade ativa é maior que a de dependentes (crianças e idosos), reduzindo a razão de dependência e abrindo uma "janela de oportunidade" para crescimento econômico — desde que haja investimento em educação e geração de emprego. Desafio: gerar postos de trabalho suficientes para essa força de trabalho, ou preparar a estrutura previdenciária para o envelhecimento populacional futuro.',
    ],
    suggestedMinutes: 12,
  },
  {
    id: 'disc_unesp_fis_2024',
    topicId: 'fis_eletrostatica',
    board: 'Unesp / Vunesp',
    year: 2024,
    subject: 'Física',
    topic: 'Eletrostática e modelo atômico',
    prompt: 'Devido ao atrito com o ar, insetos voadores podem acumular carga elétrica positiva em seu corpo enquanto voam. Uma abelha acumulou uma carga elétrica de 3,2×10⁻¹¹ C ao voar (dado: carga elementar e = 1,6×10⁻¹⁹ C).',
    subItems: [
      { letter: 'a', prompt: 'Calcule a diferença entre o número de prótons e de elétrons na abelha.' },
      { letter: 'b', prompt: 'Explique, em termos do modelo atômico, por que a abelha acumula carga positiva por perda de elétrons (e não por ganho de prótons).' },
    ],
    modelAnswer: [
      'Item a: n = q/e = 3,2×10⁻¹¹ / 1,6×10⁻¹⁹ ≈ 2×10⁸ prótons em excesso (elétrons a menos).',
      'Item b: os elétrons de valência estão fracamente ligados ao átomo (mais afastados do núcleo) e podem ser removidos por atrito com relativa facilidade; os prótons estão presos no núcleo pela força nuclear forte, muito mais intensa, permanecendo estáveis e não sendo transferidos por atrito.',
    ],
    suggestedMinutes: 15,
  },
  {
    id: 'disc_famerp_bio_2015',
    topicId: 'bio_fisio_vegetal',
    board: 'Famerp',
    year: 2015,
    subject: 'Biologia',
    topic: 'Fisiologia vegetal — fotoperiodismo e floração',
    prompt: 'Fotoperíodo crítico é o tempo de exposição diária à luz que uma planta necessita para iniciar sua floração — algumas espécies exigem períodos de iluminação maiores (plantas de dia longo), outras menores (plantas de dia curto). Um agricultor, em uma cidade onde os dias mais longos do ano têm 12h30 de luz e os mais curtos têm 11h30, tem dúvida entre cultivar uma variedade de crisântemo (planta de dia curto, fotoperíodo crítico de 12h30) ou de brinco-de-princesa (Fuchsia sp., planta de dia longo, fotoperíodo crítico de 13h00).',
    subItems: [
      { letter: 'a', prompt: 'Qual espécie o agricultor deveria escolher para conseguir floração? Justifique com base nos fotoperíodos críticos de cada planta e nos dados de duração do dia na região.' },
      { letter: 'b', prompt: 'O que aconteceria com a floração do crisântemo (planta de dia curto) se fosse dado um "flash" de 15 minutos de luz artificial no meio da noite? Explique.' },
    ],
    modelAnswer: [
      'Item a: em plantas de dia curto, o que determina a floração é o período de escuro ininterrupto ser suficientemente longo — não a duração exata da luz. Como os dias na região variam entre 11h30 e 12h30, o crisântemo (fotoperíodo crítico de 12h30) consegue atingir a noite ininterrupta necessária na maior parte do ano; já a Fuchsia (planta de dia longo, fotoperíodo crítico de 13h de luz) nunca atingiria esse valor nessa localidade. O agricultor deve escolher o crisântemo.',
      'Item b: o flash de luz interrompe o período de escuro contínuo, impedindo que a planta de dia curto acumule a noite ininterrupta necessária — o fitocromo é reconvertido para a forma que sinaliza "dia" mesmo com pouca luz. Resultado: a floração do crisântemo é inibida.',
    ],
    suggestedMinutes: 15,
  },
  {
    id: 'disc_famerp_qui_2018',
    topicId: 'qui_estequiometria',
    board: 'Famerp',
    year: 2018,
    subject: 'Química',
    topic: 'Estequiometria e separação de misturas',
    prompt: 'O hidróxido de cobre(II), Cu(OH)₂, utilizado como antifúngico na agricultura, pode ser obtido como precipitado pela reação entre soluções aquosas de sulfato de cobre(II) e hidróxido de sódio. A solução sobrenadante aquosa contém sulfato de sódio dissolvido.',
    subItems: [
      { letter: 'a', prompt: 'Cite dois processos de separação de misturas pelos quais o precipitado pode ser separado da solução sobrenadante.' },
      { letter: 'b', prompt: 'Escreva a equação da reação entre a solução aquosa de sulfato de cobre(II) e a de hidróxido de sódio.' },
      { letter: 'c', prompt: 'Considerando o precipitado completamente insolúvel em água, calcule a quantidade, em mol, de hidróxido de cobre(II) obtida pela mistura de 100 mL de solução de sulfato de cobre(II) 1 mol/L com 200 mL de solução de hidróxido de sódio 1 mol/L.' },
    ],
    modelAnswer: [
      'Item a: filtração e/ou decantação (centrifugação também é aceitável).',
      'Item b: CuSO₄(aq) + 2 NaOH(aq) → Cu(OH)₂(s) + Na₂SO₄(aq).',
      'Item c: n(CuSO₄) = 0,1 mol; n(NaOH) = 0,2 mol. A razão estequiométrica é 1:2, então os reagentes estão em proporção exata (0,2 mol de NaOH é exatamente o dobro de 0,1 mol de CuSO₄) — sem excesso. n(Cu(OH)₂) = 0,1 mol.',
    ],
    suggestedMinutes: 15,
    uncertain: true,
    note: 'Baseada em uma única fonte de resolução (o cálculo foi verificado de forma independente e é internamente consistente).',
  },
  {
    id: 'disc_unifesp_bio_2020',
    topicId: 'bio_ecologia',
    board: 'Unifesp',
    year: 2020,
    subject: 'Biologia',
    topic: 'Ecologia — eutrofização e cadeia trófica',
    prompt: 'As águas límpidas do Caribe foram manchadas por uma invasão de sargaço, alga marrom que forma grandes ilhas flutuantes onde peixes, caranguejos e aves se alimentam. Um dos principais fatores que contribuem para a formação dessas ilhas é o uso de fertilizantes na agricultura na região do rio Amazonas — os fertilizantes são carregados pelas chuvas até o rio e chegam ao oceano Atlântico.',
    subItems: [
      { letter: 'a', prompt: 'Como se denomina o fenômeno resultante da liberação de fertilizantes no oceano que contribui para a formação das ilhas de sargaço? Situe, na sua resposta, a cadeia/rede trófica que se forma a partir do sargaço (produtores, peixes e aves).' },
    ],
    modelAnswer: [
      'O fenômeno é a eutrofização: fertilizantes ricos em nutrientes minerais (nitrato, fosfato) chegam à água e promovem crescimento explosivo (bloom) de produtores primários — no caso, o sargaço.',
      'Esse crescimento sustenta uma cadeia alimentar local: produtores (sargaço) → consumidores primários (peixes que se alimentam da alga ou de organismos associados a ela) → consumidores secundários (aves que se alimentam desses peixes) — ainda que o excesso de nutrientes normalmente também traga riscos de desequilíbrio ecológico (como hipóxia) em outros contextos.',
    ],
    suggestedMinutes: 12,
  },
];
