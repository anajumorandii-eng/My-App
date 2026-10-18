import type { Topic } from '../types';
import { mockTopics } from './mockData';
import { studyAreaForTopic } from './studyProtocols';

export const fuvestDepthSources = [
  { label: 'Programa oficial FUVEST 2027', url: 'https://www.fuvest.br/wp-content/uploads/fuvest2027-programa-vestibular.pdf', scope: 'Conteúdos e habilidades; não fornece incidência.' },
  { label: 'Vestibular 2027: documentos e carreira', url: 'https://www.fuvest.br/vestibular-da-usp/', scope: 'Edital, guia e componentes da carreira escolhida.' },
  { label: 'Acervo oficial 2026', url: 'https://www.fuvest.br/acervo-vestibular-2026/', scope: 'Provas, respostas esperadas e análise das questões; não constitui uma série por assunto.' },
];
export type DepthPhase = 'first' | 'second';
export interface AreaDepth {
  skills: string[];
  transfer: string;
  check: string;
}
/** Editorial training goals, not official correction rubrics or frequency estimates. */
export const fuvestAreaDepth: Record<string, AreaDepth> = {
  Biologia: {
    skills: ['Interpretar experimento: hipótese, controle, variável e resultado.', 'Explicar mecanismo ligando níveis molecular, celular, organismo e ambiente.', 'Ler gráficos, ciclos e relações evolutivas sem converter correlação em causa.'],
    transfer: 'Cruze Biologia e Química: explique como pH, temperatura ou concentração afetam um processo, distinguindo resultado observado de hipótese causal.',
    check: 'Nomeie o processo, explique o mecanismo e use um dado do enunciado. Em experimentos, indique o que o controle permite concluir.',
  },
  Matemática: {
    skills: ['Traduzir texto em relações, com domínio e restrições explícitos.', 'Alternar entre expressão, gráfico, tabela e construção geométrica.', 'Justificar contagem, dependência probabilística e validade de soluções.'],
    transfer: 'Mude a representação ou uma condição do problema e investigue quais soluções permanecem válidas.',
    check: 'Mostre a modelagem, resolva e teste no enunciado original; rejeite raízes estranhas e confira unidades e domínio.',
  },
  Física: {
    skills: ['Definir sistema, referencial e condições de validade do modelo.', 'Interpretar área, inclinação, vetores e diagramas com unidades.', 'Relacionar leis e conservação sem presumir isolamento ou ausência de dissipação.'],
    transfer: 'Resolva o mesmo fenômeno por outra representação e examine um caso-limite; explique por que a equação escolhida continua válida.',
    check: 'Apresente diagrama, lei, substituição coerente e conclusão física. Confira sinais, dimensões e ordem de grandeza.',
  },
  Química: {
    skills: ['Conectar observação macroscópica, partículas e representação simbólica.', 'Balancear massa e carga e converter grandezas antes de proporções.', 'Separar cinética, equilíbrio e energia; explicitar condições experimentais.'],
    transfer: 'Mude temperatura, diluição ou quantidade de reagente e separe alterações na velocidade, composição e constante de equilíbrio.',
    check: 'Escreva espécies e relações usadas, confira conservação e unidades, e justifique a conclusão no nível das partículas.',
  },
  Geografia: {
    skills: ['Ler mapas com escala, projeção, legenda e recorte territorial.', 'Relacionar processos físicos, produção do espaço e desigualdade.', 'Comparar indicadores distinguindo número absoluto, taxa e distribuição.'],
    transfer: 'Relacione um processo ambiental a ocupação, infraestrutura e vulnerabilidade; compare escalas local e global.',
    check: 'Localize o fenômeno, descreva a evidência e explique o mecanismo espacial. Não substitua explicação por opinião.',
  },
  História: {
    skills: ['Analisar autoria, temporalidade, destinatário e intenção da fonte.', 'Explicar causalidade, permanências e rupturas sem anacronismo.', 'Comparar processos preservando diferenças entre sociedades e períodos.'],
    transfer: 'Compare duas fontes de posições sociais diferentes e explique como contexto e interesse alteram suas representações.',
    check: 'Responda ao comando com contexto, evidência e relação histórica; uma data ou nome isolado não explica o processo.',
  },
  Português: {
    skills: ['Inferir sentidos com evidência textual e distinguir vozes e pontos de vista.', 'Explicar efeitos de sintaxe, léxico, coesão, modalização e figuras.', 'Relacionar textos verbais e visuais, gênero, circulação e interlocução.'],
    transfer: 'Reescreva um trecho modificando um conector ou tempo verbal e explique a mudança de sentido e posicionamento.',
    check: 'Identifique o recurso, localize a evidência e explique o efeito naquele texto. A classificação gramatical sozinha é insuficiente.',
  },
  Literatura: {
    skills: ['Relacionar voz, composição, linguagem e tensão histórica em passagens concretas.', 'Analisar poema, narrativa ou ensaio sem reduzir a obra a tema ou enredo.', 'Comparar obras por uma questão comum, preservando diferenças formais.'],
    transfer: 'Compare uma passagem da leitura obrigatória com outro texto ou imagem: mostre aproximação temática e diferença de construção.',
    check: 'Sustente a leitura com passagem verificável, procedimento formal e efeito. Confira a lista do ciclo, sem atribuir frequência individual às obras.',
  },
  Redação: {
    skills: ['Ler recorte, gênero, finalidade e interlocutor da proposta.', 'Selecionar a coletânea, formular um projeto e desenvolver relações argumentativas.', 'Revisar progressão, coesão, precisão e adequação de linguagem.'],
    transfer: 'Reescreva um desenvolvimento fraco após correção, alterando a relação entre afirmação, evidência e conclusão.',
    check: 'Use os critérios da proposta e da banca; não imponha modelo de intervenção do ENEM. Registre os problemas de conteúdo e expressão separadamente.',
  },
  Inglês: {
    skills: ['Localizar tese, informação específica e evidências sem tradução integral.', 'Inferir vocabulário e referentes em contexto.', 'Preservar negação, modalidade, quantificadores e relações discursivas.'],
    transfer: 'Compare uma alternativa com a passagem que a sustenta e explique como um modalizador altera o alcance da afirmação.',
    check: 'Mostre a evidência textual e explique a paráfrase; repetir uma palavra do texto não comprova equivalência de sentido.',
  },
  Filosofia: {
    skills: ['Reconstruir problema, conceitos, premissas e conclusão de um argumento.', 'Comparar posições por seus critérios, sem reduzir autores a frases famosas.', 'Distinguir tese, objeção e consequência e testar contraexemplos.'],
    transfer: 'Aplique duas posições filosóficas a um mesmo problema e explique por que podem divergir mesmo partindo dos mesmos fatos.',
    check: 'Defina o conceito no sentido do trecho e mostre como ele sustenta a conclusão; opinião pessoal não substitui análise.',
  },
  Sociologia: {
    skills: ['Conectar conceitos a instituições, relações de poder e processos sociais.', 'Distinguir experiência individual, regularidade e explicação causal.', 'Ler indicadores com população, denominador, período e limites da comparação.'],
    transfer: 'Compare duas explicações para desigualdade ou trabalho, identificando mecanismos e evidências que poderiam diferenciá-las.',
    check: 'Relacione conceito, mecanismo e situação; evite naturalização, moralização e generalização a partir de um único caso.',
  },
  Arte: {
    skills: ['Analisar composição, materialidade, linguagem e contexto de uma obra.', 'Relacionar produção, circulação, mediação e patrimônio cultural.', 'Comparar linguagens visuais, sonoras, cênicas e corporais, incluindo matrizes indígenas e africanas.'],
    transfer: 'Compare duas obras por um procedimento formal, relacionando suporte, circulação e contexto social.',
    check: 'Aponte elementos perceptíveis da obra e explique sua relação com a interpretação; reconhecer o movimento não encerra a análise.',
  },
  'Educação Física': {
    skills: ['Interpretar práticas corporais como manifestações culturais e históricas.', 'Analisar corpo, saúde, inclusão, lazer e relações de poder.', 'Comparar esportes, danças, lutas, jogos e ginásticas nos seus contextos sociais.'],
    transfer: 'Examine uma campanha sobre corpo ou saúde e relacione sua mensagem a evidências, padrões culturais e condições de acesso.',
    check: 'Explique a prática no contexto social sem reduzir saúde a responsabilidade individual nem reproduzir estereótipos corporais.',
  },
};

const supplementalTopics: Topic[] = [
  { id: 'priority_arte_linguagens', subject: 'Arte', name: 'Linguagens, materialidades e criação', prerequisites: [], chapters: ['Artes visuais: composição, imagem e suporte', 'Música: som, ritmo e contexto', 'Teatro e dança: corpo, cena e expressão', 'Hibridismo e tecnologias na criação'] },
  { id: 'priority_arte_patrimonio', subject: 'Arte', name: 'Patrimônio, circulação e diversidade', prerequisites: [], chapters: ['Patrimônio material e imaterial', 'Matrizes indígenas, africanas e europeias', 'Mediação cultural e acesso', 'Arte e relações sociais, políticas e estéticas'] },
  { id: 'priority_edfis_praticas', subject: 'Educação Física', name: 'Práticas corporais e cultura', prerequisites: [], chapters: ['Jogos e brincadeiras', 'Esportes e suas transformações', 'Danças, lutas e ginásticas', 'Práticas corporais e patrimônio cultural'] },
  { id: 'priority_edfis_corpo', subject: 'Educação Física', name: 'Corpo, saúde e participação social', prerequisites: [], chapters: ['Padrões corporais e mídia', 'Saúde e condições de acesso', 'Inclusão, diversidade e participação', 'Lazer e espaços de prática'] },
];

export function priorityCurriculum(subject: string): Topic[] {
  const normalized = subject === 'Língua Portuguesa' ? 'Português' : subject === 'Língua Inglesa' ? 'Inglês' : subject;
  return [...mockTopics, ...supplementalTopics].filter(topic => studyAreaForTopic(topic) === normalized);
}

export interface TopicDrill { task: string; criteria: string; }
export const topicDepthDrills: Record<string, TopicDrill> = {
  bio_genetica: { task: 'Em um cruzamento-teste, interprete as frequências das classes descendentes: identifique parentais e recombinantes e avalie se os dados sustentam ligação gênica.', criteria: 'Explicite genótipos, hipótese de segregação, total analisado e cálculo de recombinação; diferencie inferência amostral de certeza.' },
  bio_ecologia: { task: 'Compare biomassa e concentração de contaminante ao longo de uma cadeia; explique por que energia e contaminantes não seguem a mesma tendência.', criteria: 'Diferencie fluxo de energia, produtividade e biomagnificação; use unidades e dados de cada nível trófico.' },
  bio_fisio_animal: { task: 'Explique como uma alteração hormonal modifica uma variável fisiológica e produz uma resposta de retroalimentação.', criteria: 'Identifique estímulo, receptor ou órgão regulador, efetor e resposta; distinga causa primária de compensação.' },
  bio_fisio_vegetal: { task: 'Interprete curvas de transpiração em diferentes umidades e explique o transporte no xilema e a regulação estomática.', criteria: 'Relacione gradiente de potencial hídrico, coesão-tensão e perda de água; diferencie xilema e floema.' },
  bio_metabolismo_energetico: { task: 'Preveja o efeito de bloquear a cadeia respiratória sobre consumo de oxigênio, regeneração de NAD⁺ e produção de ATP.', criteria: 'Localize as etapas, explique a dependência entre elas e distinga fosforilação oxidativa de fosforilação em nível de substrato.' },
  bio_evolucao: { task: 'Compare frequências alélicas antes e depois de uma mudança ambiental e avalie seleção, deriva e fluxo gênico como explicações.', criteria: 'Diferencie mudança individual de mudança populacional; indique que evidência permitiria discriminar os mecanismos.' },
  bio_biotecnologia: { task: 'Interprete um procedimento de PCR ou eletroforese e explique como o controle permite avaliar o resultado.', criteria: 'Relacione função dos reagentes, amplificação e padrão observado; não confunda presença de fragmento com expressão de proteína.' },
  bio_microbiologia: { task: 'Compare intervenções contra vírus e bactérias e explique os limites de antibióticos, vacinação e medidas de prevenção.', criteria: 'Diferencie estrutura, replicação, alvo terapêutico e resposta imune sem generalizar mecanismos entre patógenos.' },
  mat_dados_probabilidade: { task: 'Resolva uma probabilidade condicionada com tabela e compare-a à probabilidade sem a condição.', criteria: 'Defina evento e espaço amostral em cada caso; justifique independência em vez de presumi-la.' },
  mat_funcoes: { task: 'Reconstrua uma função a partir de gráfico ou tabela e interprete composição, inversa ou mudança de parâmetro.', criteria: 'Declare domínio e imagem e verifique se a inversa existe no recorte usado; distinga deslocamento de alteração de escala.' },
  mat_geometria_plana: { task: 'Resolva uma configuração com semelhança e relações de área sem depender da aparência do desenho.', criteria: 'Justifique ângulos e correspondência; distinga razão linear e quadrática e confira casos degenerados.' },
  mat_combinatoria: { task: 'Conte configurações com uma restrição de posição ou repetição e valide por um caso pequeno.', criteria: 'Defina se a ordem importa, construa casos disjuntos e evite dupla contagem.' },
  fis_leis_newton: { task: 'Modele dois corpos vinculados, desenhando forças separadamente e discutindo a hipótese sobre fio, contato e atrito.', criteria: 'Declare eixos, sinais e vínculos de aceleração; não coloque ação e reação no mesmo diagrama de corpo livre.' },
  fis_energia: { task: 'Determine velocidade ou alcance em um sistema com trecho dissipativo e explique o balanço energético.', criteria: 'Defina sistema e estados; represente trabalho não conservativo e diferencie energia mecânica de energia total.' },
  fis_circuitos: { task: 'Preveja como ligar um novo resistor altera corrente, tensão e potência em cada ramo de um circuito.', criteria: 'Reconstrua a topologia, aplique conservação de carga e tensão e não mantenha constante uma grandeza que o circuito mudou.' },
  fis_calorimetria: { task: 'Resolva uma mistura térmica com mudança de fase e verifique primeiro se há energia para completar a transformação.', criteria: 'Separe aquecimento e calor latente, faça balanço com sinais e verifique o estado final obtido.' },
  fis_ondulatoria: { task: 'Interprete a mudança de meio de uma onda e compare frequência, velocidade e comprimento de onda.', criteria: 'Identifique o que a fonte determina e use v = λf com unidades; diferencie refração e interferência.' },
  qui_estequiometria: { task: 'Resolva uma reação com reagente limitante, pureza e rendimento, justificando em que etapa entra cada fator.', criteria: 'Balanceie a reação, converta para mol, determine o limitante e diferencie produção teórica e obtida.' },
  qui_equilibrio: { task: 'Compare os efeitos de diluição e temperatura sobre um equilíbrio ácido-base, separando composição, constante e pH.', criteria: 'Escreva o equilíbrio e sua expressão; explique quais condições alteram K e verifique as aproximações usadas.' },
  qui_cinetica: { task: 'Use dados de velocidades iniciais para inferir a lei de velocidade e prever o efeito de variar concentrações.', criteria: 'Compare experimentos controlando variáveis; não deduza ordens pelos coeficientes da equação global sem hipótese válida.' },
  qui_eletroquimica: { task: 'Represente uma pilha e relacione semirreações, fluxo de elétrons e transformação dos eletrodos.', criteria: 'Balanceie carga e matéria, identifique ânodo e cátodo e diferencie fluxo eletrônico de migração iônica.' },
  qui_organica_reacoes: { task: 'Compare transformações orgânicas identificando grupo funcional, ligações alteradas e condições da reação.', criteria: 'Represente reagentes e produtos, confira valência e conservação e justifique a transformação em vez de apenas nomeá-la.' },
  geo_climatologia_socioambiental: { task: 'Relacione um climograma e um evento extremo à circulação atmosférica e às condições de ocupação.', criteria: 'Separe clima e tempo e explique risco por ameaça, exposição e vulnerabilidade, usando a escala correta.' },
  geo_populacao_urbana_brasil: { task: 'Compare indicadores demográficos e distribuição de infraestrutura entre áreas urbanas.', criteria: 'Distinga taxa e valor absoluto, explique segregação e indique os limites da agregação territorial.' },
  por_texto: { task: 'Compare duas paráfrases de um trecho e identifique qual altera pressuposto, modalização ou relação argumentativa.', criteria: 'Localize a marca textual responsável pela diferença e explique seu efeito sobre a tese ou a voz enunciativa.' },
  por_sintaxe: { task: 'Reescreva uma oração alterando subordinação, posição ou pontuação e explique o efeito de sentido.', criteria: 'Preserve as relações exigidas pelo comando e justifique a leitura sintática no contexto, além da nomenclatura.' },
  bio_estrutura_fisio_celular: { task: "Preveja a variação de volume de células em soluções diferentes e relacione o resultado à permeabilidade da membrana.", criteria: "Diferencie osmose e transporte de soluto; indique gradiente, barreira e condições que alteram o equilíbrio." },
  bio_codigo_genetico_sintese: { task: "Relacione uma alteração na sequência de DNA ao RNA e à proteína, comparando efeitos de substituição e mudança do quadro de leitura.", criteria: "Explicite sentido de leitura, transcrição e tradução; diferencie mutação gênica, alteração cromossômica e variação de expressão." },
  bio_zoologia: { task: "Compare grupos em um cladograma e associe novidades evolutivas a reprodução, circulação ou adaptação ao ambiente.", criteria: "Identifique ancestral comum e caracteres derivados; não trate grupos atuais como ancestrais diretos uns dos outros." },
  bio_botanica: { task: "Compare ciclos de vida de grupos vegetais e explique as consequências evolutivas de vasos, sementes e frutos.", criteria: "Localize meiose, fecundação e gerações haploide e diploide; diferencie polinização de fecundação e semente de fruto." },
  mat_aritmetica_proporcionalidade: { task: "Compare variações percentuais sucessivas e relações entre grandezas em escalas diferentes.", criteria: "Defina a base de cada percentual e justifique proporcionalidade direta ou inversa antes de operar." },
  mat_teoria_numeros: { task: "Determine soluções inteiras de uma situação com divisibilidade, restos ou periodicidade.", criteria: "Use decomposição, congruências ou máximo divisor comum com justificativa; verifique restrições inteiras e positivas." },
  mat_sequencias_matrizes: { task: "Modele uma recorrência ou um sistema linear e discuta como um parâmetro altera a existência de solução.", criteria: "Diferencie padrão observado e lei justificada; classifique o sistema sem dividir por expressão que pode ser zero." },
  mat_trigonometria: { task: "Modele uma medida indireta ou fenômeno periódico e resolva no intervalo solicitado.", criteria: "Declare unidade angular, período e domínio; considere todas as soluções e justifique relações geométricas." },
  mat_geometria_espacial: { task: "Determine uma seção ou volume de sólido composto e examine o efeito de uma mudança de escala.", criteria: "Represente a seção, justifique dimensões e distinga escala linear, de área e de volume." },
  mat_geometria_analitica: { task: "Traduza uma condição de distância ou tangência em lugar geométrico e determine suas interseções.", criteria: "Escreva as equações e confira a condição original; diferencie coincidência, interseção e tangência." },
  mat_equacoes: { task: "Modele uma situação com equação ou inequação e examine valores excluídos durante as transformações.", criteria: "Mantenha equivalências, acompanhe sinais e teste soluções na condição original, especialmente após elevar ao quadrado." },
  mat_log_exponenciais: { task: "Compare modelos exponenciais e use logaritmos para determinar um limiar ou tempo de crescimento.", criteria: "Verifique domínio, base, unidades e interpretação do expoente; não suponha crescimento linear." },
  mat_complexos_polinomios: { task: "Relacione raízes, coeficientes e representação geométrica de um polinômio ou número complexo.", criteria: "Explicite multiplicidade e domínio; justifique conjugação para coeficientes reais e confira raízes por substituição." },
  fis_cinematica: { task: "Reconstrua um movimento a partir de gráfico de velocidade e compare deslocamento e distância percorrida.", criteria: "Use área algébrica e inclinação corretamente; separe mudança de sentido, repouso e variação de rapidez." },
  fis_cinematica_vetorial: { task: "Resolva uma composição de movimentos ou lançamento separando componentes e referenciais.", criteria: "Declare eixos, condições iniciais e acelerações; aplique o mesmo tempo às componentes do movimento." },
  fis_gravitacao_circular: { task: "Relacione velocidade orbital, raio e período e explique a origem da aceleração centrípeta.", criteria: "Identifique a força resultante radial e diferencie massa, peso e campo; não acrescente uma força centrípeta independente." },
  fis_dinamica_impulsiva: { task: "Interprete um gráfico de força e tempo e analise uma colisão, verificando conservação de quantidade de movimento.", criteria: "Calcule impulso com sinais, defina sistema e forças externas e não confunda colisão inelástica com conservação de energia cinética." },
  fis_estatica: { task: "Analise equilíbrio de uma estrutura ou corpo imerso, escolhendo um ponto conveniente para os torques.", criteria: "Confira forças e momentos, braços perpendiculares e condições de pressão e empuxo; não confunda volume total e submerso." },
  fis_termodinamica_gases: { task: "Interprete um ciclo em diagrama pressão-volume e faça o balanço de energia em cada etapa.", criteria: "Declare a convenção de trabalho, calcule áreas e relacione temperatura à energia interna no modelo de gás usado." },
  fis_eletrostatica: { task: "Compare campo, potencial e energia no deslocamento de uma carga entre posições.", criteria: "Diferencie grandezas escalares e vetoriais, faça superposição e considere o sinal da carga no trabalho e na força." },
  fis_eletromagnetismo: { task: "Determine o sentido de uma força magnética ou corrente induzida em um sistema com fluxo variável.", criteria: "Defina direções e orientação da área, aplique a lei de Lenz e diferencie fluxo de campo magnético." },
  fis_optica_geometrica: { task: "Construa o trajeto de raios em uma interface e examine as condições para reflexão total.", criteria: "Meça ângulos em relação à normal, aplique Snell e confira o sentido de passagem entre índices de refração." },
  fis_optica_instrumental: { task: "Determine a imagem de uma lente e relacione sua posição a uma correção de visão.", criteria: "Declare convenção de sinais, classifique imagem real ou virtual e confira o resultado com construção de raios." },
  fis_ondas_fundamentos: { task: "Relacione gráficos temporal e espacial de uma oscilação e identifique amplitude, período e comprimento de onda.", criteria: "Diferencie os eixos, separe deslocamento do meio e propagação da perturbação e use unidades compatíveis." },
  fis_fisica_moderna: { task: "Interprete dados do efeito fotoelétrico e compare alterações de frequência e intensidade da radiação.", criteria: "Use energia do fóton e função trabalho; distinga energia cinética máxima, limiar e número de elétrons emitidos." },
  qui_modelos_atomicos: { task: "Use evidência experimental para comparar modelos atômicos e interpretar níveis de energia.", criteria: "Relacione observação e limite do modelo; diferencie átomo e íon e não confunda emissão com absorção." },
  qui_radioatividade: { task: "Modele decaimento e compare atividade, quantidade restante e transformações nucleares.", criteria: "Conserve número de massa e carga nas equações e diferencie meia-vida de tempo para desaparecimento completo." },
  qui_polaridade_geometria: { task: "Compare moléculas quanto a geometria, polaridade e propriedades físicas.", criteria: "Considere pares eletrônicos e soma vetorial dos dipolos; diferencie polaridade de ligação, polaridade molecular e força intermolecular." },
  qui_gases: { task: "Compare estados de um gás e determine quantidade, pressão ou volume após uma transformação.", criteria: "Use temperatura absoluta e unidades consistentes; declare se quantidade de gás é constante e verifique limites do modelo ideal." },
  qui_inorganica: { task: "Represente reações de neutralização, precipitação ou formação de gases e identifique espécies em solução.", criteria: "Balanceie equações moleculares ou iônicas, confira carga e diferencie dissolução, dissociação e ionização." },
  qui_oxirreducao: { task: "Identifique agente oxidante e redutor e balanceie uma reação em meio indicado.", criteria: "Acompanhe números de oxidação e elétrons transferidos, confira carga e matéria e não inverta espécie oxidada e agente oxidante." },
  qui_organica_fundamentos: { task: "Compare estruturas orgânicas identificando funções, isomeria e relações com solubilidade ou ebulição.", criteria: "Confira valência e nomenclatura e justifique propriedades por estrutura e interações; não use apenas massa molar." },
  qui_solucoes: { task: "Resolva uma mistura ou titulação distinguindo diluição de reação química.", criteria: "Converta concentrações, preserve quantidade de soluto na diluição e use estequiometria quando houver reação." },
  qui_termoquimica: { task: "Determine a entalpia de uma transformação por Hess ou energias de ligação e interprete seu sinal.", criteria: "Ajuste coeficientes, estados físicos e sinais das equações; diferencie energia absorvida para romper e liberada para formar ligações." },
  geo_cartografia: { task: "Compare mapas e calcule distâncias avaliando projeção, escala e finalidade.", criteria: "Confira unidade e escala, identifique distorções e não confunda tamanho aparente na projeção com área real." },
  geo_hidrogeografia: { task: "Relacione uso do solo, bacia hidrográfica e mudanças no escoamento ou disponibilidade de água.", criteria: "Diferencie infiltração, escoamento, aquífero e vazão e explique efeitos a montante e a jusante." },
  geo_globalizacao_economica: { task: "Interprete fluxos comerciais e cadeias produtivas relacionando localização, tecnologia e divisão do trabalho.", criteria: "Diferencie produção e comando, identifique agentes e escalas e use dados sem generalizar um país para toda a região." },
  geo_geopolitica_regional: { task: "Analise um conflito territorial por mapas, atores e interesses e compare escalas de atuação.", criteria: "Distinga Estado, nação, território e fronteira; contextualize as fontes e não reduza o conflito a uma única causa." },
  geo_fisica_brasil: { task: "Relacione relevo, solos, clima e cobertura vegetal em um problema de uso do território.", criteria: "Explique os processos e a escala temporal e diferencie condicionante físico e determinação inevitável da ocupação." },
  geo_economica_brasil: { task: "Compare mudanças na produção agrária, industrial ou energética e suas consequências territoriais.", criteria: "Relacione infraestrutura, trabalho e concentração de recursos; diferencie crescimento produtivo e distribuição dos benefícios." },
  his_idade_antiga: { task: "Compare cidadania e formas de poder em sociedades antigas a partir de uma fonte.", criteria: "Defina quem estava incluído e excluído e preserve o sentido histórico de cidadania, sem projetar a democracia atual." },
  his_idade_media: { task: "Relacione organização do poder, trabalho e religião em uma transformação medieval.", criteria: "Localize sociedade e período e diferencie vínculos de dependência; evite apresentar a Idade Média como homogênea." },
  his_moderna_iluminismo: { task: "Compare justificativas do poder e projetos de mudança na formação do mundo moderno.", criteria: "Relacione ideias, grupos e instituições, distinguindo linguagem universalista e limites sociais concretos de participação." },
  his_imperialismo_guerras: { task: "Relacione expansão imperial, nacionalismos e conflito por meio de documentos de posições distintas.", criteria: "Separe causas estruturais, conjuntura e estopim; identifique interesses e não trate propaganda como relato neutro." },
  his_guerra_fria_contemporaneo: { task: "Compare processos de descolonização e disputas da Guerra Fria, considerando agência local.", criteria: "Relacione escalas internacional e nacional sem reduzir todos os movimentos a instrumentos de uma superpotência." },
  his_brasil_colonia: { task: "Explique uma mudança na colonização relacionando trabalho, território e relações com populações indígenas e africanas.", criteria: "Distinga modalidades de exploração e resistência, situe agentes e fontes e evite naturalizar escravidão e conquista." },
  his_brasil_imperio: { task: "Analise cidadania e escravidão em um documento do Império, relacionando norma e prática social.", criteria: "Contextualize restrições de participação, interesses e resistências e diferencie independência política de transformação social ampla." },
  his_primeira_republica_vargas: { task: "Compare mecanismos de participação, controle e direitos em momentos da Primeira República e da Era Vargas.", criteria: "Relacione instituições e grupos sociais, diferencie legislação e efetivação e não apague mobilização dos trabalhadores." },
  his_republica_liberal_atual: { task: "Analise documentos sobre democracia, ditadura ou redemocratização e explique permanências e rupturas.", criteria: "Identifique autoria e contexto e diferencie memória, justificativa política e evidência histórica do processo." },
  por_norma_culta: { task: "Reescreva um trecho adequando concordância, regência e pontuação à situação pedida.", criteria: "Explique a relação sintática e o efeito da alteração; diferencie adequação de registro e julgamento de variedades linguísticas." },
  por_lit_classica_barroca: { task: "Compare procedimentos formais de um poema clássico ou barroco e relacione-os ao conflito construído.", criteria: "Use evidência de ritmo, imagem, oposição ou voz; escola literária não substitui análise do texto." },
  por_lit_romantismo_realismo: { task: "Compare representação da personagem e intervenção do narrador em dois excertos.", criteria: "Mostre focalização, ironia ou idealização com marcas textuais; diferencie voz narrativa de posição do autor." },
  por_lit_modernismo: { task: "Analise como escolha de linguagem e composição reelaboram tradição e representação do país.", criteria: "Relacione procedimento formal e tensão histórica, sem tratar todas as fases e autores como um movimento uniforme." },
  por_lit_contemporanea: { task: "Explique como voz, fragmentação, memória ou deslocamento produzem uma perspectiva no texto.", criteria: "Sustente cada interpretação em passagem verificável e preserve particularidades de gênero e contexto." },
  por_red_fundamentos: { task: "Planeje uma resposta à proposta identificando gênero, recorte, interlocutor e propósito antes de redigir.", criteria: "Verifique atendimento a todas as condições da proposta; não suponha que toda produção deva seguir um modelo dissertativo fixo." },
  por_red_repertorio: { task: "Selecione duas relações da coletânea e integre uma referência verificável à progressão do texto.", criteria: "Explique a função argumentativa da referência e evite cópia, citação inventada e repertório apenas decorativo." },
  por_red_argumentacao: { task: "Reescreva um parágrafo cujo exemplo não sustenta a afirmação inicial.", criteria: "Torne explícita a relação entre tese, explicação, evidência e consequência e confira se o texto enfrenta o recorte proposto." },
  por_red_estrutura_coesao: { task: "Revise transições e conclusão de um texto para eliminar saltos lógicos e retomadas ambíguas.", criteria: "Explique a relação de cada conector e adeque o fechamento ao gênero; intervenção não é exigência universal da FUVEST." },
  por_red_direitos_modelo: { task: "Compare uma redação modelo com uma proposta diferente e identifique o que precisaria ser reconstruído.", criteria: "Diferencie recurso transferível e conteúdo específico; use direitos humanos quando pertinentes e evite transplante de fórmulas do ENEM." },
  ing_01: { task: "Compare uma paráfrase à tese de um texto e identifique alteração de modalidade, referente ou quantificador.", criteria: "Aponte evidência contextual e preserve alcance e negação; não escolha pela simples repetição de palavras." },
  fil_origem_pre_socraticos: { task: "Compare explicações sobre origem e transformação da natureza em fragmentos filosóficos.", criteria: "Reconstrua o problema e o tipo de justificativa, sem reduzir a passagem de mito a filosofia a uma oposição simplista." },
  fil_socrates_platao: { task: "Analise um diálogo identificando pergunta, definição proposta e objeção que a coloca em dificuldade.", criteria: "Diferencie opinião, exame e fundamentação; explique a função do argumento no trecho sem substituir por uma alegoria decorada." },
  fil_aristoteles: { task: "Reconstrua um raciocínio e teste a relação entre premissas, conclusão e definição dos termos.", criteria: "Diferencie validade do raciocínio e verdade das premissas e não atribua toda questão de lógica a Aristóteles." },
  fil_medieval: { task: "Compare relações entre razão e fé em argumentos contextualizados.", criteria: "Identifique pressupostos e alcance de cada posição e evite tratar a filosofia medieval como uma doutrina única." },
  fil_moderna_racionalismo_empirismo: { task: "Compare como dois argumentos justificam a origem e os limites do conhecimento.", criteria: "Defina experiência, razão e evidência no sentido de cada posição e indique qual objeção cada argumento enfrenta." },
  fil_contratualismo_iluminismo: { task: "Compare justificativas da autoridade política e do direito de resistência.", criteria: "Diferencie estado de natureza, contrato e soberania conforme o autor; não transforme construções teóricas em relatos históricos." },
  fil_kant_idealismo: { task: "Analise a máxima de uma ação e diferencie agir por dever e agir conforme o dever.", criteria: "Explique o critério de universalização e diferencie fundamento moral e consequência favorável da ação." },
  fil_marx_critica_sociedade: { task: "Relacione trabalho, propriedade e relações sociais na crítica de um texto.", criteria: "Defina o conceito no argumento e explique o mecanismo histórico; não reduza a análise a uma opinião sobre riqueza." },
  fil_niilismo_existencialismo: { task: "Compare sentidos de liberdade, valor e responsabilidade em duas posições contemporâneas.", criteria: "Preserve diferenças entre autores e reconstrua o problema em vez de usar rótulos como pessimismo ou ausência de regras." },
  fil_etica_politica_contemporanea: { task: "Compare dois critérios para decidir um dilema de justiça ou responsabilidade coletiva.", criteria: "Explicite os princípios em tensão, teste uma objeção e justifique o critério sem confundir descrição e prescrição." },
  soc_formacao_ciencia: { task: "Transforme uma explicação cotidiana de um problema em uma pergunta sociológica investigável.", criteria: "Defina população, contexto, conceito e evidência; diferencie interpretação científica e julgamento moral." },
  soc_durkheim: { task: "Analise a persistência de uma norma institucional e explique socialização e coerção.", criteria: "Relacione exterioridade, generalidade e sanção ao caso; não confunda fato social com qualquer evento coletivo." },
  soc_marx_sociologia: { task: "Explique uma transformação no trabalho relacionando classe, propriedade e organização da produção.", criteria: "Identifique as relações e os mecanismos, sem tratar classe apenas como faixa de renda." },
  soc_weber: { task: "Compare sentidos atribuídos por agentes a uma ação e relacione-os à racionalização ou dominação.", criteria: "Diferencie sentido da ação e efeito observado; explique os tipos como instrumentos analíticos, não classificações rígidas de pessoas." },
  soc_cultura_identidade: { task: "Analise uma representação de um grupo e compare etnocentrismo, identidade e diversidade.", criteria: "Contextualize práticas e relações de poder sem naturalizar diferenças ou tratar culturas como homogêneas e imóveis." },
  soc_estratificacao_desigualdade: { task: "Compare indicadores de desigualdade entre grupos e avalie mecanismos de reprodução social.", criteria: "Declare denominadores e recortes e distinga mobilidade individual de transformação estrutural." },
  soc_trabalho_sociedade: { task: "Relacione mudança tecnológica, gestão e condições de trabalho em um caso de organização produtiva.", criteria: "Explique controle, autonomia e distribuição de riscos sem presumir que tecnologia determina sozinha os resultados sociais." },
  soc_movimentos_sociais: { task: "Compare demandas e formas de ação de movimentos sociais e seus efeitos sobre cidadania.", criteria: "Identifique atores, repertórios de ação e instituições e diferencie direito reconhecido e acesso efetivo." },
  soc_globalizacao: { task: "Analise circulação de informação e recursos e seus efeitos sobre sociabilidade e desigualdade.", criteria: "Explique redes, assimetrias de acesso e poder, distinguindo conexão técnica e integração social efetiva." },
  priority_arte_linguagens: { task: "Compare como imagem, som ou gesto organizam sentido em duas produções artísticas.", criteria: "Use elementos perceptíveis e relacione materialidade, composição e contexto; não limite a resposta ao nome da linguagem." },
  priority_arte_patrimonio: { task: "Analise uma disputa sobre preservação ou circulação de um patrimônio cultural.", criteria: "Identifique agentes, memória, acesso e critérios de valorização, considerando matrizes culturais distintas." },
  priority_edfis_praticas: { task: "Compare mudanças nas regras, usos ou significados de uma prática corporal em contextos diferentes.", criteria: "Relacione história, participação e cultura; diferencie regra esportiva e significado social da prática." },
  priority_edfis_corpo: { task: "Analise uma mensagem de mídia sobre corpo e saúde e confronte-a com condições de participação.", criteria: "Identifique padrões, evidências e barreiras sociais sem naturalizar estereótipos nem individualizar toda responsabilidade." },
};

export function topicDepthDrill(topic: Topic): TopicDrill | undefined {
  return topicDepthDrills[topic.id];
}
