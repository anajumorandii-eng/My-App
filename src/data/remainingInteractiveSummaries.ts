import type { InteractiveSummary } from '../types/summary';
import { summaryCurriculum, type CurriculumTopic } from './summaryCurriculum';
import { buildSubjectSummaries, type SubjectTopicNote } from './subjectSummaryFactory';
import type { SummaryMaterial } from './summaryMaterials';

type Config = { subject: string; prefix: string; source: string; exclude?: Set<string> };

const configs: Config[] = [
  { subject: 'História', prefix: 'his', source: 'materiais brutos/História (v1) 1.pdf' },
  { subject: 'Língua Inglesa', prefix: 'ing', source: 'materiais brutos/Inglês (v1) 1.pdf' },
  { subject: 'Redação', prefix: 'red', source: 'materiais brutos/Português (v1) 1.pdf' },
  { subject: 'Gramática', prefix: 'gra', source: 'materiais brutos/Português (v1) 2.pdf' },
  { subject: 'Literatura', prefix: 'lit', source: 'materiais brutos/Português (v1) 3.pdf' },
  { subject: 'Entendimento de Texto', prefix: 'tex', source: 'materiais brutos/Português (v1) 4.pdf' },
  { subject: 'Matemática', prefix: 'mat', source: 'materiais brutos/Matemática (v1) 1.pdf', exclude: new Set(['Introdução às Probabilidades']) },
  { subject: 'Química', prefix: 'qui', source: 'materiais brutos/Química (v1) 1.pdf', exclude: new Set(['Equilíbrios Químicos I']) },
];

function history(topic: CurriculumTopic): string {
  const era: Record<string, string> = {
    'Idade Antiga': 'Compare organização política, trabalho, religião e cidadania a partir de fontes; Grécia e Roma não eram sociedades homogêneas.',
    'Idade Média': 'Relacione poder fragmentado, dependência senhorial, Igreja, comércio e cidades, distinguindo mudanças graduais de rupturas.',
    'Idade Moderna e Iluminismo': 'Conecte expansão comercial, centralização monárquica, conflitos religiosos e crítica iluminista às estruturas do Antigo Regime.',
    'Imperialismo e Guerras Mundiais': 'Nacionalismo, indústria, imperialismo, crise econômica e política de massas formam causalidade múltipla; cronologia não basta como explicação.',
    'Guerra Fria e Mundo Contemporâneo': 'A bipolaridade combinou disputa estratégica, modelos socioeconômicos, guerras por procuração e descolonização, com experiências regionais próprias.',
    'Brasil Colônia': 'Colonização articulou metrópole, escravidão, produção exportadora, mercado interno, Igreja e resistências em territórios diversos.',
    'Brasil Império': 'A construção do Estado monárquico conciliou centralização, elites provinciais, escravidão e cidadania restrita, sob conflitos e negociações.',
    'Primeira República e Era Vargas': 'O período combina federalismo oligárquico, conflitos sociais, urbanização e posterior centralização trabalhista e autoritária.',
    'República Liberal e Brasil Contemporâneo': 'Democracia, desenvolvimento, autoritarismo militar, redemocratização e direitos devem ser lidos com atenção a continuidades sociais.',
  };
  return `${topic.title}: ${era[topic.track]}`;
}

function english(topic: CurriculumTopic): string {
  const theme = topic.title.replace('Text Comprehension: ', '');
  return `${theme} é o campo semântico do texto, não um convite à tradução palavra por palavra. Localize tese, referentes pronominais, conectores, cognatos confiáveis e marcas de opinião; use formação de palavras e contexto para inferir vocabulário.`;
}

function writing(topic: CurriculumTopic): string {
  const t = topic.title.toLowerCase();
  if (t.includes('introdução')) return `${topic.title}: contextualize o recorte e formule uma tese específica que antecipe os eixos argumentativos, sem começar por generalizações vazias.`;
  if (t.includes('argument')) return `${topic.title}: cada parágrafo precisa de tópico frasal, evidência pertinente, explicação do nexo e retorno explícito à tese; repertório sem análise vira citação decorativa.`;
  if (t.includes('coesão')) return `${topic.title}: retomadas referenciais e conectores devem explicitar relações lógicas reais; variedade vocabular não compensa ambiguidade ou encadeamento defeituoso.`;
  if (t.includes('intervenção')) return `${topic.title}: combine agente, ação, meio, finalidade e detalhamento, preserve os direitos humanos e faça a solução responder às causas discutidas.`;
  if (t.includes('repertório') || t.includes('tema')) return `${topic.title}: delimite problema, agentes, causas e efeitos; selecione repertório legitimado e produtivo, explicando sua relação com o argumento.`;
  return `${topic.title}: transforme o comando e a coletânea em projeto de texto autoral, com tese, progressão lógica, evidências analisadas e conclusão coerente.`;
}

function grammar(topic: CurriculumTopic): string {
  const t = topic.title.toLowerCase();
  if (t.includes('oração')) return `${topic.title}: classifique pela função sintática e pelo vínculo lógico, observando conectivo, termo antecedente e efeito de sentido, não apenas a forma.`;
  if (t.includes('vírgula') || t.includes('pontuação')) return `${topic.title}: pontuação representa estrutura sintática e intenção discursiva; não se separa sujeito de verbo nem verbo de complemento sem intercalação marcada.`;
  if (t.includes('concordância') || t.includes('regência') || t.includes('crase')) return `${topic.title}: identifique núcleo, termo regente e complemento antes de aplicar a norma; sentido e posição podem alterar a construção aceita.`;
  return `${topic.title}: reconheça classe, função sintática e efeito de sentido no contexto; a mesma forma pode assumir funções distintas conforme suas relações na oração.`;
}

function literature(topic: CurriculumTopic): string {
  return `${topic.title}: relacione escolhas de linguagem, forma, voz e construção temática ao contexto histórico e ao projeto estético. Características de escola literária são tendências verificáveis no texto, não uma lista automática de rótulos.`;
}

function reading(topic: CurriculumTopic): string {
  return `${topic.title}: parta de marcas verbais e visuais para inferir propósito, gênero, interlocutor e ponto de vista. Diferencie informação explícita, pressuposto e inferência e confira se a leitura é sustentada pelo texto inteiro.`;
}

function math(topic: CurriculumTopic): string {
  const rules: Record<string, string> = {
    'Aritmética e Proporcionalidade': 'Conserve unidades, escreva razões entre grandezas correspondentes e diferencie variação aditiva de multiplicativa.',
    'Teoria dos Números Inteiros': 'Use divisibilidade, decomposição em primos, MDC, MMC e congruências, justificando a propriedade usada.',
    'Sequências, Matrizes e Sistemas Lineares': 'Traduza o padrão ou as restrições em equações; verifique índice, dimensões de matrizes e número de soluções.',
    'Análise Combinatória': 'Defina as escolhas e restrições, aplique princípio aditivo ou multiplicativo e corrija contagens repetidas.',
    'Probabilidade e Interpretação de Dados': 'Defina espaço amostral e evento; condicional restringe o universo, independência multiplica probabilidades e não é sinônimo de disjunção.',
    'Geometria Plana': 'Marque hipóteses no desenho, use congruência, semelhança e relações métricas sem confiar na aparência da figura.',
    Trigonometria: 'Associe seno, cosseno e tangente ao círculo ou triângulo, controle quadrante, periodicidade e domínio.',
    'Geometria Espacial': 'Decomponha o sólido, identifique base e altura perpendiculares e diferencie área de volume.',
    'Geometria Analítica': 'Converta a condição geométrica em equação e interprete coeficientes, distâncias e interseções no plano.',
    'Equações, Desigualdades e Modelagem Algébrica': 'Defina incógnita e restrições, preserve equivalência e teste raízes no contexto original.',
    Funções: 'Leia domínio, imagem, zeros, sinal e variação; transformações no argumento atuam horizontalmente e fora dele verticalmente.',
    'Logaritmos e Exponenciais': 'Exponencial modela razão constante e logaritmo é sua inversa; imponha base positiva diferente de 1 e argumento positivo.',
    'Números Complexos e Polinômios': 'Use forma algébrica ou polar conforme a operação e conecte raízes, fatores, multiplicidade e coeficientes.',
  };
  return `${topic.title}: ${rules[topic.track]}`;
}

function chemistry(topic: CurriculumTopic): string {
  const rules: Record<string, string> = {
    'Modelos Atômicos e Estrutura do Átomo': 'Modelos mudam com evidências; distribuição eletrônica e carga nuclear efetiva explicam tendências periódicas.',
    Radioatividade: 'Balanceie número de massa e número atômico, diferencie atividade de dose e use meia-vida como decaimento exponencial.',
    'Polaridade das Ligações e Geometria Molecular': 'Geometria resulta da repulsão entre domínios eletrônicos; polaridade molecular depende da soma vetorial dos dipolos.',
    Gases: 'Para gás ideal, PV = nRT; temperatura deve estar em kelvin e cada transformação conserva grandezas específicas.',
    'Análises Quantitativas e Estequiometria': 'Balanceie primeiro, converta dados em mol, aplique a razão dos coeficientes e só então retorne à unidade pedida.',
    'Química Inorgânica': 'Reconheça ácidos, bases, sais e óxidos pelas espécies e pelo comportamento em reação, controlando carga e conservação.',
    Oxirredução: 'Oxidação aumenta NOX e libera elétrons; redução diminui NOX e recebe elétrons; agentes fazem o processo oposto ao próprio nome.',
    'Fundamentos e Nomenclatura Orgânica': 'Identifique cadeia principal, insaturações, substituintes e grupo funcional antes de numerar e nomear.',
    'Reações e Aplicações Orgânicas': 'Localize ligações rompidas e formadas, reagente e condições; estrutura eletrônica e estabilidade orientam o produto.',
    Soluções: 'Concentração relaciona soluto e solução; propriedades coligativas dependem do número de partículas efetivas.',
    Termoquímica: 'ΔH = Hprodutos − Hreagentes; sinal depende do sistema e a Lei de Hess permite somar equações e entalpias.',
    'Cinética Química': 'Velocidade depende de colisões eficazes e energia de ativação; catalisador muda o caminho, não ΔH nem a constante de equilíbrio.',
    Eletroquímica: 'Ânodo oxida e cátodo reduz; espontaneidade vem do potencial da célula, enquanto eletrólise exige energia externa.',
    'Equilíbrio Químico': 'No equilíbrio, velocidades direta e inversa são iguais; Q comparado a K prevê o sentido e Le Châtelier prevê a resposta à perturbação.',
  };
  return `${topic.title}: ${rules[topic.track]}`;
}

function focus(topic: CurriculumTopic): string {
  if (topic.subject === 'História') return history(topic);
  if (topic.subject === 'Língua Inglesa') return english(topic);
  if (topic.subject === 'Redação') return writing(topic);
  if (topic.subject === 'Gramática') return grammar(topic);
  if (topic.subject === 'Literatura') return literature(topic);
  if (topic.subject === 'Entendimento de Texto') return reading(topic);
  if (topic.subject === 'Matemática') return math(topic);
  return chemistry(topic);
}

const allSummaries: InteractiveSummary[] = [];
const allMaterials: SummaryMaterial[] = [];
for (const config of configs) {
  const topics = summaryCurriculum.find((item) => item.subject === config.subject)!.topics;
  const notes = Object.fromEntries(topics.map((topic) => [topic.title, { focus: focus(topic) } satisfies SubjectTopicNote]));
  const built = buildSubjectSummaries({ subject: config.subject, topics, notes, sourceFile: config.source, idPrefix: config.prefix, excludeTopics: config.exclude });
  allSummaries.push(...built.summaries);
  allMaterials.push(...built.materials);
}

export const remainingInteractiveSummaries = allSummaries;
export const remainingSummaryMaterials = allMaterials;
