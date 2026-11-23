// Estratégia de prova por banca, escrita a partir das provas reais que estão
// no banco (Famerp 2022–2026: 400 objetivas e 100 discursivas) e do edital.
//
// Três tipos de afirmação convivem aqui, e não podem se confundir:
// - fato do edital (formato, número de questões, pontuação), com fonte em
//   studyBoardProfiles/boardExamStructure;
// - padrão observado nas provas do banco ("pilha caiu nos 5 anos");
// - método de treino, que é recomendação didática, não regra da banca.
// A incidência por capítulo NÃO é escrita aqui: ela sai das próprias provas
// em boardPriorities, para não haver número no texto que divirja do dado.

export interface PlaybookStep {
  title: string;
  text: string;
}

export interface SubjectPlaybook {
  subject: string;
  /** Como a banca cobra, observado nas provas do banco. */
  howItCharges: string[];
  /** Roteiro de resolução para o tipo de questão que mais aparece. */
  method: PlaybookStep[];
  traps: { trap: string; fix: string }[];
  /** Só nas matérias do 2º dia: o que a discursiva desta matéria cobra. */
  discursive?: { recurring: string[]; checklist: string[] };
}

export interface ExamPlaybook {
  board: string;
  /** O que decide a estratégia, em uma frase. */
  thesis: string;
  structure: string[];
  examDays: { label: string; plan: PlaybookStep[] }[];
  subjects: SubjectPlaybook[];
  discursive: { scoring: string; protocol: PlaybookStep[]; lostPoints: string[] };
  essay: string[];
}

const famerp: ExamPlaybook = {
  board: 'Famerp',
  thesis: 'Biologia, Química e Física aparecem nos dois dias: 30 das 80 objetivas e as 20 discursivas. É nelas que a prova separa candidatos de Medicina, e é para elas que vai a maior parte do tempo de estudo.',
  structure: [
    '1º dia: 80 questões objetivas, 10 de cada componente: Português, Inglês, Matemática, Biologia, Química, Física, História e Geografia.',
    '2º dia: 20 questões discursivas só de Natureza (8 de Biologia, 6 de Química, 6 de Física) e a redação.',
    'Cada discursiva vale de 0 a 4 pontos: resposta parcial pontua, e item em branco é ponto entregue.',
    'A redação não exige proposta de intervenção; tese, argumentos explicados e uso da coletânea sem cópia são o que conta.',
  ],
  examDays: [
    {
      label: '1º dia — objetivas',
      plan: [
        { title: 'Primeira passada, sem travar', text: 'Resolva na ordem e pule a questão que passar de 3 minutos sem caminho claro. Marque com um sinal na prova e siga: uma questão travada custa o tempo de duas que você sabe.' },
        { title: 'Blocos de texto primeiro pelo enunciado', text: 'Português e Inglês vêm em blocos de 3 a 6 questões por texto. Leia as perguntas antes do texto; em Inglês, as respostas costumam seguir a ordem dos parágrafos.' },
        { title: 'Contas no rascunho organizado', text: 'Matemática e Física da Famerp têm contas curtas e contextualizadas. Escreva a fórmula antes do número: o erro de sinal e de unidade aparece no rascunho, não na cabeça.' },
        { title: 'Segunda passada nas marcadas', text: 'Volte às que pulou com o tempo que sobrou. Elimine alternativas absurdas antes de decidir entre duas.' },
        { title: 'Gabarito com folga', text: 'Reserve os 15 minutos finais para transcrever. Transcrever no fim, com pressa, é onde se perde questão já resolvida.' },
      ],
    },
    {
      label: '2º dia — discursivas e redação',
      plan: [
        { title: 'Redação primeiro ou por último, nunca no meio', text: 'Decida antes da prova. Começar pela redação garante o texto inteiro com cabeça fresca; deixá-la para o fim exige parar as discursivas na hora marcada. Mudar de ideia na hora é o que estoura o tempo.' },
        { title: 'Ritmo de 8 a 9 minutos por discursiva', text: 'Vinte questões com redação no mesmo dia não comportam 15 minutos em cada uma. Se uma passar de 12 minutos, escreva o que tem e volte depois.' },
        { title: 'Todos os itens com alguma resposta', text: 'Com nota de 0 a 4, o item com mecanismo certo e conta incompleta pontua. Branco não pontua nunca.' },
        { title: 'Rascunho em tópicos, resposta em 2 a 4 linhas', text: 'A banca não premia texto longo. Premia o termo técnico, o porquê e a conta com unidade, dentro do espaço.' },
        { title: 'Última volta nas unidades', text: 'Os 10 minutos finais vão para conferir unidade, sinal, equação balanceada e item esquecido. São os pontos mais baratos da prova.' },
      ],
    },
  ],
  subjects: [
    {
      subject: 'Biologia',
      howItCharges: [
        'Nas objetivas, cobre a Biologia inteira: cerca de 40 capítulos diferentes em 5 anos, quase todos uma vez só. Classificação e cladogramas e mecanismos da evolução são os que se repetem.',
        'Nas discursivas (8 por prova), genética cai todo ano, de 2 a 3 itens: Hardy-Weinberg, herança ligada ao X e ao Z, ligação gênica, herança quantitativa.',
        'Imunologia, fisiologia humana (rim, pâncreas, digestão, circulação) e fisiologia vegetal (estômatos) reaparecem com frequência, quase sempre a partir de um caso clínico ou notícia.',
      ],
      method: [
        { title: 'Ache o processo por trás do caso', text: 'O enunciado conta uma história (ponte de safena, terapia CAR-T, nematódeo em criptobiose). Pergunte: qual processo biológico explica isso?' },
        { title: 'Nomeie a estrutura e o mecanismo', text: 'Resposta que pontua tem o termo técnico: "células-guarda", "transporte ativo", "plasmócito".' },
        { title: 'Genética: escreva os genótipos antes de calcular', text: 'Monte o cruzamento com as letras. Calcule cada gene separado e multiplique. Separe probabilidade de "menino afetado" e de "filho ser menino e afetado".' },
        { title: 'Feche com a consequência', text: 'Termine dizendo o que acontece no organismo: "a urina fica mais concentrada", "o estômato fecha e a fotossíntese cai".' },
      ],
      traps: [
        { trap: '"A espécie desenvolveu X para sobreviver."', fix: 'É lamarckismo. O certo: a variação já existia e foi selecionada.' },
        { trap: 'Confundir homologia com analogia.', fix: 'Homólogo tem a mesma origem embrionária; análogo, a mesma função com origem diferente.' },
        { trap: 'Achar que o soro estimula anticorpos.', fix: 'O soro já é o anticorpo (imunidade passiva). A vacina é que estimula (ativa, com memória).' },
        { trap: 'Herança ligada ao Z tratada como ligada ao X.', fix: 'Em aves, o macho é ZZ e a fêmea ZW: a lógica do daltonismo se inverte entre os sexos.' },
      ],
      discursive: {
        recurring: ['Genética (todo ano)', 'Imunologia', 'Fisiologia humana', 'Fisiologia e reprodução vegetal', 'Ecologia a partir de notícia', 'Evolução e cladogramas'],
        checklist: ['Usei o termo técnico?', 'Expliquei o mecanismo, não só o nome?', 'Na genética, os genótipos estão escritos?', 'Respondi as duas partes do item?'],
      },
    },
    {
      subject: 'Química',
      howItCharges: [
        'Nas objetivas, soluções e diluições são o que mais se repete, seguidas de interações intermoleculares, separação de misturas, oxirredução e cinética.',
        'Nas discursivas (6 por prova), eletroquímica e orgânica caíram nos 5 anos: pilhas, ânodo de sacrifício, bafômetro; isomeria, esterificação, oxidação.',
        'Estequiometria com pureza e rendimento aparece todo ano, quase sempre num processo industrial ou num produto do cotidiano. Hess caiu de 2024 a 2026 e radioatividade em 2025 e 2026.',
      ],
      method: [
        { title: 'Escreva a equação balanceada', text: 'Toda conta de Química da Famerp parte dela. Sem a proporção certa, o resto está perdido.' },
        { title: 'Converta para mol, com a pureza já aplicada', text: 'Massa → mol do reagente puro. A pureza entra no começo; o rendimento entra no fim.' },
        { title: 'Pilha: decida cátodo e ânodo pelo potencial', text: 'Maior potencial de redução é o cátodo (redução, polo +). Escreva as duas semirreações e a global. ΔE° = E°(cátodo) − E°(ânodo), sem multiplicar pelo coeficiente.' },
        { title: 'Orgânica: justifique a isomeria pela estrutura', text: 'Cis-trans: dupla com dois ligantes diferentes em cada carbono. Óptica: carbono com quatro ligantes diferentes. Aponte o carbono no desenho.' },
      ],
      traps: [
        { trap: 'Multiplicar o E° pelo coeficiente da reação.', fix: 'O potencial é propriedade intensiva: não depende da quantidade.' },
        { trap: '"Ânodo é polo negativo" usado na eletrólise.', fix: 'Na pilha o ânodo é −; na eletrólise é +. O que não muda: ânodo é onde ocorre a oxidação.' },
        { trap: 'Temperatura em °C na equação dos gases.', fix: 'PV = nRT sempre em kelvin.' },
        { trap: 'Catalisador desloca o equilíbrio.', fix: 'Só acelera a chegada a ele. Kc muda apenas com a temperatura.' },
      ],
      discursive: {
        recurring: ['Pilhas e Nox (todo ano)', 'Orgânica: isomeria e reações (todo ano)', 'Estequiometria com pureza e rendimento', 'Lei de Hess', 'Equilíbrio e pH', 'Radioatividade'],
        checklist: ['Equação balanceada, com estados físicos?', 'Pureza no começo, rendimento no fim?', 'Indiquei cátodo, ânodo e semirreações?', 'Resultado com unidade?'],
      },
    },
    {
      subject: 'Física',
      howItCharges: [
        'Nas objetivas, hidrostática (densidade, pressão, empuxo) é o que mais se repete, seguida de movimento uniforme, calorimetria e física quântica básica.',
        'Nas discursivas (6 por prova), óptica, cinemática e dinâmica e termologia caíram nos 5 anos. Energia e quantidade de movimento e eletricidade aparecem em quase todos.',
        'As situações são concretas: escorregador, decolagem, quique da bola, salto ornamental, lanterna de LEDs. O trabalho é traduzir a cena em modelo físico.',
      ],
      method: [
        { title: 'Desenhe a cena e as forças', text: 'Um esboço com eixos e vetores decide o sinal de tudo que vem depois.' },
        { title: 'Escolha a lei antes da conta', text: 'Tem tempo? Cinemática. Tem velocidade e altura sem tempo? Energia. Tem choque? Quantidade de movimento.' },
        { title: 'Fórmula, substituição com unidade, resultado', text: 'É assim que a banca vê o processo. Conta solta perde ponto se o número final errar.' },
        { title: 'Confira a ordem de grandeza', text: 'Um carro a 300 m/s ou uma lente com foco de 20 m denunciam erro de unidade antes da banca.' },
      ],
      traps: [
        { trap: 'Usar a massa no tempo de queda.', fix: 'No lançamento horizontal, o tempo de queda só depende da altura.' },
        { trap: 'Esquecer a dilatação do recipiente.', fix: 'Dilatação aparente = dilatação do líquido − dilatação do recipiente.' },
        { trap: 'Aumento de área igual ao aumento linear.', fix: 'Se a lente aumenta A vezes o tamanho, a área aumenta A².' },
        { trap: 'Luz mais intensa arranca elétrons mais rápidos.', fix: 'Arranca mais elétrons. A energia de cada um depende da frequência.' },
      ],
      discursive: {
        recurring: ['Óptica (todo ano)', 'Cinemática e dinâmica (todo ano)', 'Termologia: dilatação, calorimetria, gases (todo ano)', 'Energia e colisões', 'Circuitos', 'Magnetismo'],
        checklist: ['Desenhei a situação?', 'Escrevi a fórmula antes do número?', 'Resultado com unidade do SI?', 'A ordem de grandeza faz sentido?'],
      },
    },
    {
      subject: 'Matemática',
      howItCharges: [
        'É a matéria mais concentrada: porcentagem caiu nos 5 anos; trigonometria no triângulo retângulo, estatística descritiva e função quadrática, em 4.',
        'Os problemas são contextualizados e as contas, curtas. A dificuldade está em montar a equação a partir do texto.',
      ],
      method: [
        { title: 'Traduza o texto em equação', text: 'Dê nome à incógnita e escreva a relação antes de calcular.' },
        { title: 'Porcentagem por fator', text: 'Aumento de i% multiplica por (1 + i); desconto, por (1 − i). Variações sucessivas multiplicam os fatores.' },
        { title: 'Máximo e mínimo pelo vértice', text: 'Lucro ou altura máxima: xᵥ = −b/2a e yᵥ = −Δ/4a.' },
        { title: 'Teste as alternativas quando a conta for longa', text: 'Substituir as opções na condição do problema costuma ser mais rápido que resolver do zero.' },
      ],
      traps: [
        { trap: 'Somar porcentagens sucessivas.', fix: '+10% e depois −10% dá 0,99: queda de 1%.' },
        { trap: 'Média de médias sem ponderar.', fix: 'Pondere pelo tamanho de cada grupo.' },
        { trap: 'Mediana sem ordenar os dados.', fix: 'Ordene antes; com quantidade par, faça a média dos dois centrais.' },
      ],
    },
    {
      subject: 'Português',
      howItCharges: [
        'Interpretação domina: pressuposto e subentendido e figuras de linguagem caíram em 4 dos 5 anos, sempre pedindo o efeito de sentido no texto.',
        'Em literatura, Arcadismo e Parnasianismo aparecem mais que as outras escolas, com poema para reconhecer a estética.',
        'Sintaxe vem aplicada ao texto: orações adverbiais, regência, vozes verbais.',
      ],
      method: [
        { title: 'Volte ao trecho citado', text: 'Toda alternativa precisa estar apoiada numa passagem. Se não encontrar a passagem, a alternativa extrapola.' },
        { title: 'Pergunte pelo efeito, não pelo nome', text: 'A figura importa pelo que ela faz no texto: ironiza, intensifica, suaviza.' },
        { title: 'Reconheça a escola por três marcas', text: 'Arcadismo: natureza convencional, pastores, razão. Parnasianismo: forma fixa, rima rica, objetividade.' },
      ],
      traps: [
        { trap: 'Escolher a alternativa verdadeira no mundo, mas ausente do texto.', fix: 'Na interpretação, só vale o que o texto diz ou pressupõe.' },
        { trap: 'Antítese e paradoxo trocados.', fix: 'Antítese opõe palavras; paradoxo afirma juntas ideias contraditórias.' },
      ],
    },
    {
      subject: 'Inglês',
      howItCharges: [
        'Blocos de textos de ciência e saúde: tecnologia digital, calorias e energia, gases de efeito estufa, cérebro, probióticos. As perguntas vêm em português.',
        'Quase tudo é compreensão: a resposta está no texto, em geral na ordem das perguntas.',
      ],
      method: [
        { title: 'Perguntas antes do texto', text: 'Saiba o que procurar e leia só o parágrafo necessário.' },
        { title: 'Atenção aos conectivos', text: 'However, although, whereas, thus, unless mudam o sentido da frase inteira.' },
        { title: 'Grau de certeza do texto', text: 'May, might e suggest indicam possibilidade. A alternativa que afirma com certeza o que o texto só sugere está errada.' },
      ],
      traps: [
        { trap: 'Falsos cognatos.', fix: 'Actually = na verdade; eventually = finalmente; pretend = fingir; sensible = sensato.' },
      ],
    },
    {
      subject: 'História',
      howItCharges: [
        'Guerra Fria caiu em 4 dos 5 anos. Brasil Colônia (montagem da colonização e mineração) e Alta Idade Média, em 3.',
        'A questão parte de documento ou texto de historiador e pede relação de causa ou consequência, não data.',
      ],
      method: [
        { title: 'Situe o documento', text: 'Quem escreve, quando e para quem. A alternativa certa respeita o contexto do documento.' },
        { title: 'Procure a relação pedida', text: 'Causa, consequência, permanência ou ruptura: a pergunta diz qual.' },
      ],
      traps: [
        { trap: 'Anacronismo: julgar o passado com conceitos de hoje.', fix: 'Desconfie de alternativa que atribui ao período uma ideia que ele não tinha.' },
        { trap: '"Na Guerra Fria, EUA e URSS se enfrentaram diretamente."', fix: 'O confronto foi indireto, em conflitos periféricos e na corrida armamentista.' },
      ],
    },
    {
      subject: 'Geografia',
      howItCharges: [
        'Espaço agrário brasileiro, geologia e geomorfologia e desafios ambientais caíram em 3 dos 5 anos. Cartografia aparece quase todo ano.',
        'Mapas, gráficos e tabelas são o ponto de partida: a questão pede para ler a representação e relacionar com o processo.',
      ],
      method: [
        { title: 'Leia legenda, escala e fonte primeiro', text: 'Metade das alternativas erradas contradiz a legenda.' },
        { title: 'Ligue o dado ao processo', text: 'Fronteira agrícola, urbanização, erosão: diga que processo explica o que o mapa mostra.' },
      ],
      traps: [
        { trap: 'Escala 1:100.000 "maior" que 1:10.000.', fix: 'Quanto maior o denominador, menor a escala e menor o detalhe.' },
        { trap: 'Floresta exuberante como prova de solo fértil.', fix: 'Na Amazônia, a fertilidade está no ciclo rápido da serapilheira, não no solo.' },
      ],
    },
  ],
  discursive: {
    scoring: 'Cada questão vale de 0 a 4 pontos. A nota parcial existe: ela premia quem nomeia o conceito, justifica e mostra a conta, mesmo que o número final erre.',
    protocol: [
      { title: 'Ache o dado escondido', text: 'A Famerp põe no texto de apoio o dado decisivo: massa molar, potencial, meia-vida, frequência. Sublinhe antes de começar.' },
      { title: 'Sublinhe o verbo de comando', text: 'Cite pede o nome; explique pede o mecanismo; justifique pede o porquê; calcule pede a conta; escreva a equação pede a equação balanceada.' },
      { title: 'Responda item por item', text: 'Escreva "a)" e "b)" separados. Se o item pede duas coisas, as duas aparecem.' },
      { title: 'Termo técnico e porquê', text: 'Nomear sem justificar costuma valer metade.' },
      { title: 'Conta completa', text: 'Fórmula, substituição com unidades, resultado com unidade e algarismos coerentes.' },
    ],
    lostPoints: [
      'Escrever sobre o tema em vez de responder a pergunta.',
      'Deixar item em branco.',
      'Resultado sem unidade, equação sem balancear, isomeria sem justificar.',
      'Resposta fora do espaço ou ilegível.',
    ],
  },
  essay: [
    'Tese clara já no primeiro parágrafo.',
    'Duas razões explicadas e amarradas ao tema, não só citadas.',
    'Coletânea usada como apoio, sem cópia de trechos.',
    'Proposta de intervenção não é exigida.',
    'Uma redação por semana com correção no ateliê, sempre com o tempo controlado.',
  ],
};

export const examPlaybooks: ExamPlaybook[] = [famerp];

export function playbookFor(board: string): ExamPlaybook | undefined {
  return examPlaybooks.find((p) => p.board.toLowerCase() === board.toLowerCase());
}
