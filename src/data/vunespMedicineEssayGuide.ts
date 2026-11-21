// Guia de redação da Famerp e da Unifesp (Vestibular Misto), as duas
// corrigidas pela Fundação Vunesp.
//
// Origem de cada dado:
// - Critérios, regras de zero, regras de extensão e pontuação da Famerp:
//   edital do Vestibular 2027 da Famerp (Capítulos VIII, XII e XIII e o anexo
//   "Redação"). Antes daqui o app dizia "3 critérios" e tratava a nota como
//   aproximada — o edital tem 4 critérios (Tema, Estrutura, Língua, Coesão),
//   redação valendo 20 de 100 no 2º dia e nota zero na redação elimina.
// - Temas: lidos nos cadernos de prova originais (2022–2026), não em listas
//   de cursinho, que misturavam temas de Unesp e Unifesp.
// - Unifesp: o caderno confirma o formato (dia 1: 25 objetivas de Português e
//   Inglês + redação; dia 2: 20 discursivas). O PDF oficial de critérios não
//   pôde ser baixado; a grade abaixo é a da Vunesp e fica marcada como não
//   confirmada, em vez de copiar a pontuação da Famerp como se fosse dela.
//
// Passo a passo, exercícios e roteiro semanal são autorais do CRIVO.

export type MedicineEssayBoard = 'Famerp' | 'Unifesp';

export interface EssayCriterion { id: string; name: string; whatIsEvaluated: string; howToSecure: string }
export interface EssayTheme { year: number; theme: string; shape: string; possibleAngles: string[] }
export interface EssayStep { minutes: string; title: string; actions: string[] }
export interface EssayDrill { id: string; criterion: string; title: string; minutes: number; instructions: string[]; doneWhen: string }
export interface EssayGuide {
  board: MedicineEssayBoard;
  when: string;
  scoring: string;
  confirmed: boolean;
  sourceNote: string;
  criteria: EssayCriterion[];
  zeroRules: string[];
  lengthRules: string[];
  notRequired: string[];
  themes: EssayTheme[];
}

const vunespCriteria: EssayCriterion[] = [
  {
    id: 'A',
    name: 'A. Tema',
    whatIsEvaluated: 'Se o texto atende ao tema proposto, inclusive ao recorte da frase temática. Fuga completa ao tema zera a redação inteira, sem correção dos demais critérios.',
    howToSecure: 'Reescreva a frase temática com suas palavras antes de planejar e repita as palavras-chave dela na tese e no fechamento de cada parágrafo. O título não conta: o tema precisa estar no corpo do texto.',
  },
  {
    id: 'B',
    name: 'B. Estrutura (gênero/tipo e coerência)',
    whatIsEvaluated: 'Dissertação-argumentativa com introdução, desenvolvimento e conclusão; ponto de vista claro; argumentos desenvolvidos e encadeados; repertório pertinente; compreensão da coletânea; autonomia do texto. Fuga completa ao gênero também zera.',
    howToSecure: 'Tese explícita no 1º parágrafo; cada parágrafo de desenvolvimento com uma razão diferente, explicada (por quê? com que efeito?); conclusão que decorre do que foi dito. Evite 1ª pessoa do singular, 2ª pessoa e frases como “como diz o texto I”.',
  },
  {
    id: 'C',
    name: 'C. Língua (modalidade e registro)',
    whatIsEvaluated: 'Norma-padrão: concordância, regência, ortografia, acentuação, pontuação, precisão vocabular e grau de formalidade. Letra incompreensível também reduz a nota aqui.',
    howToSecure: 'Frases curtas e completas, vocabulário preciso em vez de rebuscado e uma revisão dedicada só a concordância, crase e vírgula. Letra legível conta ponto.',
  },
  {
    id: 'D',
    name: 'D. Coesão',
    whatIsEvaluated: 'Conectivos, retomadas (pronomes, sinônimos), divisão em parágrafos. Penaliza monobloco, quebras indevidas, repetição do mesmo conectivo e parágrafos de um só período.',
    howToSecure: 'Quatro ou cinco parágrafos, cada um com três ou mais períodos; varie conectivos por função (causa, oposição, conclusão) e retome ideias com pronomes e sinônimos.',
  },
];

const vunespZero = [
  'Fugir ao tema ou ao gênero (dissertativo-argumentativo).',
  'Ter 7 linhas ou menos (sem contar o título).',
  'Ter menos de 8 linhas autorais contínuas, ou ser predominantemente cópia da coletânea, da prova, de modelos prontos ou da internet.',
  'Ser idêntica ou muito semelhante a outra redação (modelo decorado).',
  'Ter nome, rubrica, assinatura, iniciais ou qualquer marca que identifique o candidato.',
  'Estar em branco, em outra língua, só com desenhos/números/palavras soltas, predominantemente ilegível ou fora do espaço definitivo.',
  'Trazer impropérios, trechos jocosos ou recusa explícita ao tema.',
];

const vunespLength = [
  '20 linhas ou menos: não alcança a nota máxima nos critérios C e D.',
  '15 linhas ou menos: perde um ponto em C e em D.',
  'Trechos copiados da coletânea (mesmo sem predominância) ou paráfrase predominante: nota mínima em B, C e D.',
  'O rascunho não é corrigido; o título não é avaliado — repetir a frase temática fora do corpo conta como título.',
];

const vunespNotRequired = [
  'Proposta de intervenção não é exigida (o edital diz isso textualmente). Conclusão pode retomar a tese, sintetizar ou apontar consequência.',
  'Citar pensadores não dá nota por si: repertório solto, sem ligação com a tese, é penalizado no critério B.',
];

export const medicineEssayGuides: Record<MedicineEssayBoard, EssayGuide> = {
  Famerp: {
    board: 'Famerp',
    when: '2º dia (Conhecimentos Específicos e Redação): 20 questões discursivas (8 de Biologia, 6 de Química, 6 de Física) e a redação, tudo em 4 horas.',
    scoring: 'Redação vale 20 pontos; as discursivas valem 80 (0 a 4 cada). Nota da prova = soma, até 100. Para classificar: nota da redação diferente de zero e pelo menos 20/100 no 2º dia. Corrigida por dois examinadores independentes; havendo discrepância, um terceiro.',
    confirmed: true,
    sourceNote: 'Edital do Vestibular 2027 da Famerp (critérios e regras) e cadernos de prova de 2022 a 2026 (temas).',
    criteria: vunespCriteria,
    zeroRules: vunespZero,
    lengthRules: vunespLength,
    notRequired: vunespNotRequired,
    themes: [
      { year: 2026, theme: 'Indústria da moda: entre os benefícios do fast fashion e a responsabilidade socioambiental', shape: 'Dilema “entre X e Y”', possibleAngles: ['acesso a roupas baratas × trabalho precário na cadeia', 'descarte têxtil e poluição', 'responsabilidade de empresas × do consumidor'] },
      { year: 2025, theme: 'Proibição de livros na escola: censura ou proteção da infância e da juventude?', shape: 'Pergunta com duas respostas', possibleAngles: ['papel da escola na formação crítica', 'quem decide o que é inadequado', 'mediação do professor em vez de proibição'] },
      { year: 2024, theme: 'Racismo ambiental no Brasil: é possível proteger as populações mais vulneráveis?', shape: 'Pergunta de viabilidade', possibleAngles: ['enchentes e periferias', 'saneamento e saúde', 'distribuição desigual dos riscos'] },
      { year: 2023, theme: 'Sobrepeso e obesidade infantil: entre as responsabilidades da família e do Estado', shape: 'Dilema “entre X e Y”', possibleAngles: ['publicidade de ultraprocessados', 'merenda e educação alimentar', 'renda e acesso a alimento fresco'] },
      { year: 2022, theme: 'Os impactos da inteligência artificial nas relações de trabalho contemporâneas', shape: 'Tema-assunto (impactos)', possibleAngles: ['substituição × criação de funções', 'desigualdade de qualificação', 'vigilância e precarização'] },
    ],
  },
  Unifesp: {
    board: 'Unifesp',
    when: 'Vestibular Misto, 1º dia: 25 questões objetivas (Português e Inglês) e a redação. O 2º dia tem 20 questões discursivas (Biologia, Química, Física e Matemática).',
    scoring: 'Correção feita pela Fundação Vunesp. Escala e peso da redação na nota final: confirme no edital e no documento “Critérios de Correção da Redação” do ano vigente (sites de cursinho citam 50 pontos, não confirmado em fonte oficial).',
    confirmed: false,
    sourceNote: 'Formato e temas confirmados nos cadernos de prova de 2022 a 2026. Critérios: grade da Vunesp (mesma banca), não confirmada no documento oficial da Unifesp.',
    criteria: vunespCriteria,
    zeroRules: vunespZero,
    lengthRules: vunespLength,
    notRequired: vunespNotRequired,
    themes: [
      { year: 2026, theme: 'Luto contemporâneo: entre a espetacularização da morte e a manutenção da lembrança coletiva', shape: 'Dilema “entre X e Y”', possibleAngles: ['luto exposto em redes sociais', 'memória coletiva de tragédias e da pandemia', 'tempo para o luto e saúde mental'] },
      { year: 2025, theme: 'Ser imigrante: entre desafios e oportunidades', shape: 'Dilema “entre X e Y”', possibleAngles: ['xenofobia e acolhimento', 'trabalho e documentação', 'contribuição cultural e econômica'] },
      { year: 2024, theme: 'O fim do anonimato digital reduziria danos causados pelo discurso de ódio?', shape: 'Pergunta sim/não', possibleAngles: ['responsabilização × liberdade de expressão', 'proteção de denunciantes e minorias', 'papel das plataformas'] },
      { year: 2023, theme: 'É possível conciliar mérito e bem comum?', shape: 'Pergunta de viabilidade, tema abstrato', possibleAngles: ['meritocracia e desigualdade de partida', 'ações afirmativas', 'mérito a serviço do coletivo'] },
      { year: 2022, theme: 'Derrubar monumentos? Os dilemas entre relembrar e apagar o passado', shape: 'Pergunta + dilema', possibleAngles: ['homenagem × memória crítica', 'ressignificar com contexto (museus, placas)', 'quem decide a memória pública'] },
    ],
  },
};

/** Passo a passo autoral para uma redação Vunesp de ~60 minutos. Na Famerp, a redação divide as 4 h com as 20 discursivas. */
export const vunespEssaySteps: EssayStep[] = [
  { minutes: '0–8', title: 'Ler a proposta e a coletânea', actions: ['Sublinhe as palavras-chave da frase temática e escreva o tema com suas palavras.', 'Classifique a forma do tema: pergunta sim/não, “entre X e Y” ou tema-assunto. Ela define a tese.', 'Em cada texto da coletânea, anote em 5 palavras a ideia (não o trecho) que ele oferece.'] },
  { minutes: '8–15', title: 'Decidir a tese', actions: ['Responda à pergunta ou escolha um lado do dilema — ou uma posição intermediária justificada.', 'Teste: a tese cabe em uma frase e alguém poderia discordar dela? Se não, ainda é só o tema.'] },
  { minutes: '15–22', title: 'Planejar os parágrafos', actions: ['Duas razões diferentes para a tese, uma por parágrafo (ex.: causa e consequência; ou dimensão social e individual).', 'Para cada razão: um dado, exemplo ou repertório e a frase que explica por que ele prova a razão.', 'Se couber, um contraponto rebatido dentro de um dos parágrafos.', 'Decida a conclusão: síntese + consequência ou retomada da tese. Intervenção não é obrigatória.'] },
  { minutes: '22–45', title: 'Escrever o rascunho', actions: ['Introdução: contexto curto → tese. Desenvolvimento: tópico frasal → explicação → evidência → fechamento ligado ao tema. Conclusão: retomada que decorre do texto.', 'Mire entre 25 e 30 linhas; abaixo de 21 já não é possível nota máxima em Língua e Coesão.', 'Nada de “eu acho”, “você” ou “como diz o texto II”.'] },
  { minutes: '45–55', title: 'Revisar e passar a limpo', actions: ['Uma leitura só para tema: cada parágrafo responde à frase temática?', 'Uma leitura só para língua: concordância, crase, vírgula entre sujeito e verbo.', 'Passe a limpo com letra legível, sem nome nem marcas, dentro do espaço definitivo.'] },
  { minutes: '55–60', title: 'Conferência final', actions: ['Contar linhas autorais (mais de 20).', 'Confirmar que nenhum trecho foi copiado da coletânea.', 'Ver se não há título repetindo a frase temática no lugar do primeiro parágrafo.'] },
];

/** Exercícios autorais, cada um mirando um critério. */
export const vunespEssayDrills: EssayDrill[] = [
  { id: 'tese-relampago', criterion: 'A. Tema', title: 'Tese-relâmpago', minutes: 10, instructions: ['Pegue 3 temas da lista de provas reais.', 'Para cada um, escreva em 2 minutos: o tema com suas palavras + uma tese de uma frase.', 'Confira se a tese responde exatamente à pergunta ou ao dilema, e não ao assunto geral.'], doneWhen: 'As três teses podem ser contestadas e usam o recorte, não só o assunto.' },
  { id: 'recorte', criterion: 'A. Tema', title: 'Assunto × recorte', minutes: 10, instructions: ['Escreva o assunto amplo de um tema (ex.: “inteligência artificial”) e depois o recorte pedido (“relações de trabalho contemporâneas”).', 'Liste duas teses que fugiriam parcialmente do recorte e explique por quê.'], doneWhen: 'Você consegue apontar a palavra da frase temática que cada tese ignora.' },
  { id: 'paragrafo-explicado', criterion: 'B. Estrutura', title: 'Parágrafo com explicação', minutes: 15, instructions: ['Escreva um parágrafo de desenvolvimento: tópico frasal, explicação, evidência, fechamento.', 'Marque com cores: o que é afirmação, o que é explicação (por quê?) e o que é evidência.', 'Se não houver explicação marcada, reescreva acrescentando o mecanismo.'], doneWhen: 'Há pelo menos duas frases de explicação que não são exemplo nem opinião.' },
  { id: 'coletanea-sem-copia', criterion: 'B. Estrutura', title: 'Usar a coletânea sem copiar', minutes: 15, instructions: ['Escolha um caderno real e leia a coletânea.', 'Para cada texto, escreva a ideia aproveitável em até 8 palavras próprias, sem olhar o original.', 'Escreva um parágrafo que use uma dessas ideias e acrescente algo que não está na coletânea.'], doneWhen: 'Nenhuma sequência de 4 palavras do parágrafo coincide com a coletânea.' },
  { id: 'autonomia', criterion: 'B. Estrutura', title: 'Texto autônomo e impessoal', minutes: 10, instructions: ['Pegue uma redação antiga sua.', 'Circule toda 1ª pessoa do singular, 2ª pessoa e referência à prova (“o texto I”, “a proposta”).', 'Reescreva cada trecho em 3ª pessoa ou 1ª do plural, de modo que um leitor sem a prova entenda.'], doneWhen: 'Zero ocorrências circuladas na versão nova.' },
  { id: 'repertorio-amarrado', criterion: 'B. Estrutura', title: 'Repertório amarrado', minutes: 10, instructions: ['Escolha um repertório (lei, dado, obra, conceito).', 'Escreva 3 frases: o que é; o que ele mostra sobre o tema; por que isso sustenta a tese.', 'Apague a primeira frase e veja se o raciocínio ainda funciona. Se sim, o repertório estava decorativo.'], doneWhen: 'Sem a terceira frase o repertório perde a função.' },
  { id: 'revisao-norma', criterion: 'C. Língua', title: 'Revisão em três passadas', minutes: 15, instructions: ['Leia o texto procurando só concordância verbal e nominal.', 'Segunda leitura: só crase e regência.', 'Terceira: só vírgula (sujeito e verbo nunca separados; adjunto deslocado entre vírgulas).', 'Registre no Caderno de Erros o desvio que se repetiu.'], doneWhen: 'Você sabe qual é o seu desvio recorrente e quantas vezes apareceu.' },
  { id: 'conectivos', criterion: 'D. Coesão', title: 'Troca de conectivos', minutes: 10, instructions: ['Liste os conectivos que você usou numa redação.', 'Classifique por função: adição, oposição, causa, conclusão.', 'Troque todo conectivo repetido por outro da mesma função e verifique se a relação lógica continua certa.'], doneWhen: 'Nenhum conectivo aparece mais de duas vezes e todos estão na função certa.' },
  { id: 'paragrafacao', criterion: 'D. Coesão', title: 'Paragrafação', minutes: 10, instructions: ['Conte os períodos de cada parágrafo de uma redação sua.', 'Una ou desdobre até que todos tenham de 3 a 5 períodos.', 'Confirme que cada parágrafo começa retomando o anterior (pronome, sinônimo ou conectivo).'], doneWhen: 'Nenhum parágrafo de um período só e nenhum monobloco.' },
  { id: 'simulado', criterion: 'Todos', title: 'Simulado com tempo de prova', minutes: 60, instructions: ['Escolha um tema real ainda não treinado.', 'Siga o passo a passo cronometrado, sem consultar nada.', 'Na Famerp, treine também a versão de 50 minutos, porque a redação divide as 4 h com as discursivas.', 'Corrija com a lista de verificação contra zero e a grade A–D.'], doneWhen: 'Texto entre 25 e 30 linhas, terminado dentro do tempo e sem nenhum item de zero.' },
];

export const vunespWeeklyPlan: { day: string; task: string }[] = [
  { day: 'Segunda', task: 'Tese-relâmpago com 3 temas reais (10 min) + leitura de 1 notícia sobre saúde, ambiente ou tecnologia, anotando um dado com fonte.' },
  { day: 'Terça', task: 'Parágrafo com explicação sobre o tema da semana (15 min).' },
  { day: 'Quarta', task: 'Usar a coletânea sem copiar, com um caderno real (15 min).' },
  { day: 'Quinta', task: 'Repertório amarrado + troca de conectivos (20 min).' },
  { day: 'Sexta', task: 'Simulado completo de 60 min (50 min na semana da Famerp).' },
  { day: 'Sábado', task: 'Correção do simulado pela grade A–D e revisão em três passadas; registrar o desvio recorrente.' },
  { day: 'Domingo', task: 'Reescrever o parágrafo mais fraco do simulado.' },
];

export const vunespZeroChecklist: string[] = [
  'O tema aparece no corpo do texto, não só no título?',
  'É dissertativo-argumentativo, com tese explícita?',
  'Mais de 20 linhas, todas autorais?',
  'Nenhum trecho copiado da coletânea nem de modelo decorado?',
  'Sem nome, assinatura, iniciais ou qualquer marca?',
  'Sem 1ª pessoa do singular, 2ª pessoa ou referência à prova (“texto I”)?',
  'Letra legível e texto dentro do espaço definitivo?',
];
