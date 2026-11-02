// Redação do ENEM 2026: histórico de temas, padrão e eixos de treino.
// Os temas são os oficiais divulgados pelo Inep no dia de cada prova. Os eixos
// são leitura editorial do padrão e das apostas publicadas por professores em
// 2026 — não há como prever o tema, e o texto da tela diz isso.
// Repertório: só leis, documentos e obras que existem e podem ser conferidos.
// Nenhum número estatístico entra aqui: dado que ela não consiga verificar na
// hora vira risco de citação inventada, e a coletânea da prova traz os dados.

export interface EnemEssayTheme {
  year: number;
  theme: string;
  group: string;
}

export const enemEssayThemes: EnemEssayTheme[] = [
  { year: 2018, theme: 'Manipulação do comportamento do usuário pelo controle de dados na internet', group: 'Tecnologia e cidadania' },
  { year: 2019, theme: 'Democratização do acesso ao cinema no Brasil', group: 'Cultura e acesso' },
  { year: 2020, theme: 'O estigma associado às doenças mentais na sociedade brasileira', group: 'Saúde e estigma' },
  { year: 2021, theme: 'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil', group: 'Grupo invisibilizado' },
  { year: 2022, theme: 'Desafios para a valorização de comunidades e povos tradicionais no Brasil', group: 'Grupo invisibilizado' },
  { year: 2023, theme: 'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil', group: 'Grupo invisibilizado' },
  { year: 2024, theme: 'Desafios para a valorização da herança africana no Brasil', group: 'Grupo invisibilizado' },
  { year: 2025, theme: 'Perspectivas acerca do envelhecimento na sociedade brasileira', group: 'Grupo invisibilizado' },
];

export const enemEssayPattern: string[] = [
  'Recorte nacional nas oito provas: "no Brasil" ou "na sociedade brasileira". Desenvolva com causas e agentes brasileiros; exemplo estrangeiro só como comparação.',
  'Cinco dos oito temas, e todos desde 2021, tratam de um grupo cuja existência ou cujo trabalho é pouco reconhecido: pessoas sem registro civil, povos tradicionais, mulheres cuidadoras, herança africana, pessoas idosas.',
  'Quatro dos oito começam por "Desafios para…": a tese precisa nomear obstáculos concretos, não só afirmar que o assunto é importante.',
  'Grupos dos últimos três anos (mulheres cuidadoras, herança africana, envelhecimento) têm menor chance de voltar já: o Inep não costuma repetir o grupo em sequência.',
  'O tema chega com coletânea de dados oficiais. Use esses dados e explique o mecanismo; não traga número de memória que você não consegue garantir.',
];

export interface EnemEssayAxis {
  id: string;
  title: string;
  why: string;
  angles: string[];
  repertoire: string[];
  practice: string;
}

export const enemEssayAxes: EnemEssayAxis[] = [
  {
    id: 'deficiencia',
    title: 'Pessoas com deficiência e neurodivergentes',
    why: 'Grupo ainda não cobrado e citado por professores em 2026; segue o padrão de reconhecimento e acesso.',
    angles: ['Acessibilidade na escola e no trabalho', 'Diagnóstico tardio e acesso a apoio', 'Capacitismo no cotidiano'],
    repertoire: [
      'Lei Brasileira de Inclusão (Lei 13.146/2015): acessibilidade como direito, não favor.',
      'Lei Berenice Piana (Lei 12.764/2012): pessoa com autismo é pessoa com deficiência para todos os efeitos legais.',
      'Convenção da ONU sobre os Direitos das Pessoas com Deficiência, incorporada com status de emenda constitucional (Decreto 6.949/2009).',
      'Modelo social da deficiência: a barreira está no ambiente, não na pessoa — sustenta propostas de adaptação do espaço.',
    ],
    practice: 'Desafios para a inclusão de pessoas neurodivergentes na educação brasileira',
  },
  {
    id: 'rua',
    title: 'População em situação de rua e direito à moradia',
    why: 'Grupo invisibilizado por excelência, com decisão recente do STF; encaixa no padrão de 2021–2025.',
    angles: ['Invisibilidade estatística', 'Arquitetura hostil', 'Acesso a documentos, saúde e trabalho'],
    repertoire: [
      'Constituição, art. 6º: moradia é direito social.',
      'Política Nacional para a População em Situação de Rua (Decreto 7.053/2009).',
      'STF, ADPF 976 (2023): determinou medidas do poder público e vedou remoção forçada de bens e pessoas.',
      'Lei Padre Júlio Lancellotti (Lei 14.489/2022): proíbe arquitetura hostil em espaços livres de uso público.',
    ],
    practice: 'Desafios para garantir a cidadania da população em situação de rua no Brasil',
  },
  {
    id: 'saude-mental-jovem',
    title: 'Saúde mental de jovens e uso de telas',
    why: 'A aposta mais citada por professores em 2026; dialoga com a restrição de celulares nas escolas aprovada em 2025.',
    angles: ['Redes sociais e autoestima', 'Autodiagnóstico pela internet', 'Acesso a atendimento psicológico pelo SUS'],
    repertoire: [
      'Lei 15.100/2025: restringe o uso de celulares nas escolas de educação básica.',
      'Constituição, art. 227: prioridade absoluta a crianças, adolescentes e jovens; ECA (Lei 8.069/1990).',
      'Rede de Atenção Psicossocial (RAPS) e os CAPS, porta de entrada pública para atendimento.',
      'Byung-Chul Han, "Sociedade do cansaço": o excesso de desempenho como fonte de esgotamento.',
    ],
    practice: 'Caminhos para proteger a saúde mental de jovens na era das redes sociais no Brasil',
  },
  {
    id: 'trabalho-plataformas',
    title: 'Trabalho por aplicativos e proteção social',
    why: 'Recorrente nas listas de 2026; o tema de 2023 já mostrou interesse pelo trabalho pouco reconhecido.',
    angles: ['Jornada e renda instáveis', 'Ausência de previdência', 'Algoritmo como chefe invisível'],
    repertoire: [
      'Constituição, art. 7º: direitos dos trabalhadores, como limite de jornada e previdência.',
      'Ricardo Antunes, "O privilégio da servidão" (2018): o conceito de uberização.',
      'Consolidação das Leis do Trabalho (1943) como marco de proteção que o trabalho por plataforma não alcança.',
    ],
    practice: 'Desafios para a proteção social dos trabalhadores por aplicativo no Brasil',
  },
  {
    id: 'digital',
    title: 'Desinformação, inteligência artificial e apostas on-line',
    why: 'Tecnologia só caiu em 2018 e voltou ao centro do debate público com a IA generativa e as bets.',
    angles: ['Deepfakes e eleições', 'Educação midiática', 'Apostas on-line e endividamento'],
    repertoire: [
      'Marco Civil da Internet (Lei 12.965/2014) e Lei Geral de Proteção de Dados (Lei 13.709/2018).',
      'Lei 14.790/2023: regulamenta as apostas de quota fixa (bets).',
      'Shoshana Zuboff, "A era do capitalismo de vigilância": dados pessoais como matéria-prima.',
      'Base Nacional Comum Curricular: competência geral 5, uso crítico das tecnologias digitais.',
    ],
    practice: 'Os impactos das apostas on-line na vida financeira dos brasileiros',
  },
  {
    id: 'clima',
    title: 'Clima, desastres e justiça ambiental',
    why: 'Nunca foi tema desde 2018 e ganhou peso com as enchentes no Rio Grande do Sul (2024) e a COP30 em Belém (2025).',
    angles: ['Quem sofre primeiro com os desastres', 'Moradia em áreas de risco', 'Prevenção e defesa civil'],
    repertoire: [
      'Constituição, art. 225: meio ambiente ecologicamente equilibrado como direito de todos.',
      'Acordo de Paris (2015) e a COP30, realizada em Belém em 2025.',
      'Ailton Krenak, "Ideias para adiar o fim do mundo": crítica à separação entre humanidade e natureza.',
      'Racismo ambiental: os efeitos dos desastres recaem desproporcionalmente sobre populações pobres e negras.',
    ],
    practice: 'Desafios para enfrentar os efeitos dos eventos climáticos extremos nas cidades brasileiras',
  },
];

// Repertório que serve a qualquer eixo, para não ficar sem nada se o tema surpreender.
export const enemEssayWildcards: string[] = [
  'Constituição de 1988, art. 5º (igualdade) e art. 6º (direitos sociais): sustenta quase toda tese sobre acesso.',
  'Gilberto Dimenstein, "O cidadão de papel": direitos garantidos na lei e ausentes na prática.',
  'Milton Santos, "Por uma outra globalização": a globalização como perversidade para os mais pobres.',
  'Paulo Freire, "Pedagogia do oprimido": educação como prática de liberdade — base para propostas educativas.',
  'Sérgio Buarque de Holanda, "Raízes do Brasil": o "homem cordial" e a mistura entre público e privado.',
];

export const enemEssayTimedPlan: string[] = [
  'Dia 1 tem 5h30 para 90 questões e a redação. Reserve cerca de 1h10 para a redação e termine-a antes da metade do tempo, como diz o seu cronograma.',
  '10 min: ler a proposta, sublinhar o recorte exato e escrever a tese em uma frase.',
  '10 min: projeto — dois argumentos com causa, mecanismo e repertório; proposta com agente, ação, meio, finalidade e detalhamento.',
  '35 min: rascunho. 15 min: passar a limpo e conferir os cinco elementos da intervenção.',
];

// Técnica de redação conferida contra a cartilha do participante do Inep e o
// material de curso enviado ao Drive em 02/11/2026. O texto é próprio: o curso
// é material pago de terceiros e o repositório é público.

export const enemThemeReading: string[] = [
  'Separe o assunto (amplo, como "internet") do tema (o recorte, como "manipulação do comportamento do usuário pelo controle de dados"). Escrever só sobre o assunto é tangenciar o tema.',
  'Marque três peças da frase-tema: a palavra que dá a direção ("desafios", "persistência", "caminhos para", "efeitos", "democratização"), o objeto ("estigma associado às doenças mentais") e o recorte de lugar e tempo ("no Brasil", "na sociedade brasileira").',
  'A direção decide o desenvolvimento: "desafios" e "persistência" pedem obstáculos e causas; "efeitos" pede consequências, não origens; "caminhos para" e "como garantir" já pedem soluções nos desenvolvimentos, não só na conclusão.',
  'Se o tema traz "e" ligando duas exigências ("garantir a liberdade de informação e evitar abusos"), as duas precisam aparecer.',
  'Use os textos motivadores para confirmar o sentido de palavras que você não domina: em 2020, muitos fugiram do tema por não saber o que era "estigma", definido na própria coletânea.',
];

export const enemEssaySkeleton: { part: string; lines: string; role: string }[] = [
  { part: 'Introdução', lines: '5 a 7 linhas', role: 'Contexto ligado ao tema (repertório com informação suficiente para mostrar que não é enfeite), transição que leva da referência ao problema brasileiro, e tese que anuncia os dois eixos do desenvolvimento. Não desenvolver argumento aqui.' },
  { part: 'Desenvolvimento 1', lines: '8 a 9 linhas', role: 'Tópico frasal com o primeiro eixo da tese; explicação do porquê ("isso ocorre porque…"); fundamentação com repertório, dado ou conceito; fechamento que liga de volta à tese.' },
  { part: 'Desenvolvimento 2', lines: '8 a 9 linhas', role: 'Mesmo desenho, com o segundo eixo. Abrir com operador argumentativo ("Além disso", "Ademais", "Como consequência"). Manter os dois desenvolvimentos com tamanhos parecidos.' },
  { part: 'Conclusão', lines: '6 a 8 linhas', role: 'Retomar a tese sem ideia nova; proposta com agente, ação, meio, finalidade e detalhamento; fechamento que pode retomar o repertório da introdução.' },
];

export const enemConnectivesByFunction: { function: string; examples: string; use: string }[] = [
  { function: 'Abrir o 1º desenvolvimento', examples: 'Nesse sentido; Diante desse cenário; Em primeiro lugar', use: 'Liga o parágrafo à tese.' },
  { function: 'Explicar a causa', examples: 'Isso ocorre porque; uma vez que; visto que; haja vista', use: 'Logo depois do tópico frasal, para dizer o porquê.' },
  { function: 'Somar um argumento', examples: 'Além disso; Ademais; Outrossim; não só… mas também', use: 'Abertura do 2º desenvolvimento.' },
  { function: 'Opor ou ressalvar', examples: 'No entanto; Contudo; Todavia; embora; ainda que', use: '"embora" e "ainda que" pedem subjuntivo: "embora a lei exista".' },
  { function: 'Consequência', examples: 'Consequentemente; Por conseguinte; de modo que', use: 'Para mostrar efeito, central em temas sobre "efeitos" e "persistência".' },
  { function: 'Exemplificar ou reformular', examples: 'Prova disso é; por exemplo; ou seja; isto é', use: 'Entre a tese do parágrafo e o repertório.' },
  { function: 'Finalidade', examples: 'a fim de; com o intuito de; para que', use: 'Obrigatório na proposta de intervenção.' },
  { function: 'Concluir', examples: 'Portanto; Logo; Dessa forma; Torna-se evidente, portanto, que', use: 'Evite "conclui-se" e "diante do exposto", que são fórmulas gastas.' },
];

export const enemC4Rule = 'Para 200 na Competência 4, a correção espera operador argumentativo entre parágrafos em pelo menos dois momentos, algum elemento coesivo dentro de cada parágrafo e poucas repetições. Conectivo errado ("onde" sem ideia de lugar, "mas" em sequência) conta contra.';

export const enemInterventionPitfalls: string[] = [
  'Agente que não vale: "alguém", "a gente", verbo no imperativo ("respeitem"). Nomeie quem tem a atribuição: Ministério da Educação, Congresso Nacional, prefeituras, escolas, mídia, ONGs.',
  'Agente com escala compatível: tema "no Brasil" pede agente nacional ou articulação entre esferas; prefeitura não resolve diplomacia, Presidência não recolhe lixo.',
  'Ação vaga não conta: "conscientizar a população", "ter mais respeito", "viver em harmonia". Diga o que será feito, como em "incluir no currículo", "criar linha de financiamento" ou "veicular campanha em horário nobre".',
  'Meio responde "por meio de quê"; finalidade responde "para quê". "O Estado, por meio do Ministério X" é um único agente com meio, não dois agentes.',
  'Detalhamento: uma explicação a mais sobre agente, ação, meio ou finalidade. Sem ele, a proposta perde pontos na Competência 5.',
  'A proposta resolve o problema que você discutiu. Se o desenvolvimento falou de quem está fora da escola, a escola não pode ser o agente.',
  'Direitos humanos: nada de punição cruel, exclusão de grupos ou solução ilegal. Fere a Competência 5.',
];

export const enemFormalTraps: string[] = [
  'Texto com até 7 linhas é anulado; linha toda riscada não conta.',
  'Erro na folha definitiva: um traço simples sobre a palavra e a forma correta ao lado. Nada de parênteses ou corretivo.',
  'Na divisão silábica no fim da linha, evite deixar vogal sozinha e cortes que formem palavra inadequada.',
  '"Neste século" para o atual; "nesse" para o já citado. "Cujo" só com ideia de posse: "o relatório cujo conteúdo revisei".',
  'Título é opcional no ENEM, mas, se usado, conta como linha escrita e pode ter erro.',
];
