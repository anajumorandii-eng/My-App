import type { SceneEntry } from '../types';

/** Capítulos de Matemática sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Parte A (41 capítulos) e Parte B (42 capítulos, 83 no total), por ordem
 *  de aparição em deepSummaryContent.json filtrado por
 *  subject === "Matemática" menos os chapterIds já cobertos pela outra
 *  parte. As duas partes juntas cobrem os 83 capítulos de Matemática.
 *
 *  Todos os 83 capítulos foram lidos por inteiro e testados contra as oito
 *  famílias de `types.ts`. Nenhum sustentou honestamente nenhuma família:
 *  são conteúdo procedimental (fórmula, algoritmo de cálculo, exercício
 *  resolvido), sem a estrutura de rivalidade genuína, camadas assimétricas,
 *  movimento dialético, tipos coexistentes com guarda-chuva explícito,
 *  critérios conjuntivos com necessidade declarada, escala de graus
 *  nomeados, cadeia causal instrumental entre eventos distintos, ou grade de
 *  dois eixos ortogonais que as famílias exigem. Ver
 *  `docs/visual-personalizado/17-familias-matematica.md` (seções "Parte A" e
 *  "Parte B") para o raciocínio capítulo a capítulo, incluindo os candidatos
 *  considerados e descartados.
 */
export const matematicaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-matematica-a-geometria-metrica-plana',
    motivo: 'Fórmulas de comprimento de arco e área de setor circular, com conversão de unidades — procedimento de cálculo, sem tipos coexistentes, cadeia causal entre eventos distintos ou critérios conjuntivos.',
  },
  {
    chapterId: 'summary-matematica-a-geometria-da-proporcionalidade',
    motivo: 'Teorema de Tales e razão de semelhança são regras de proporcionalidade aplicadas a problemas métricos; não há rivalidade, tipos coexistentes com guarda-chuva nem cadeia causal narrativa.',
  },
  {
    chapterId: 'summary-matematica-a-geometria-dos-numeros-complexos',
    motivo: 'Forma trigonométrica, De Moivre e raízes n-ésimas são técnicas de cálculo geométrico-algébrico; as "n raízes igualmente espaçadas" são resultado de uma fórmula, não tipos que a fonte apresenta como categorias distintas com guarda-chuva.',
  },
  {
    chapterId: 'summary-matematica-a-relacao-fundamental-da-trigonometria',
    motivo: 'Dedução de sen²θ+cos²θ=1 a partir de Pitágoras no círculo trigonométrico é uma prova geométrica única de um único fato, não uma cadeia de elos narrativos entre eventos distintos nem outra família.',
  },
  {
    chapterId: 'summary-matematica-a-trigonometria-dos-numeros-reais',
    motivo: 'Extensão de seno e cosseno a qualquer real via círculo trigonométrico e tabela de sinais por quadrante — conteúdo de definição e convenção, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-composicao-de-funcoes',
    motivo: 'Regras de composição e domínio da composta são procedimento algébrico; a ordem f∘g ≠ g∘f é uma propriedade, não um contraste de posições teóricas rivais.',
  },
  {
    chapterId: 'summary-matematica-cubos-e-paralelepipedos',
    motivo: 'Fórmulas de área, volume e diagonal, e uma identidade algébrica auxiliar — procedimento de cálculo geométrico, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-desigualdades',
    motivo: 'Regras de manipulação de inequações (inversão de sinal, quadro de sinais, notação de intervalo) são procedimento algébrico; não há tipos coexistentes, critérios conjuntivos declarados nem cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-determinantes',
    motivo: 'Fórmulas e propriedades de cálculo de determinante (Sarrus, matriz triangular, troca de linhas) são procedimento; "invertível/singular" é uma dicotomia binária, mais fraca que qualquer tipologia aceita em fases anteriores.',
  },
  {
    chapterId: 'summary-matematica-discussao-de-sistemas-lineares',
    motivo: 'Os três desfechos (determinado/indeterminado/impossível) são estados mutuamente exclusivos de um mesmo sistema, nunca coexistentes como variantes lado a lado — não sustenta `tipologia` (que exige tipos que coexistem) nem `criterios-conjuntivos` (não há condição que precise ser reunida); é classificação por critério de determinante, não narrativa causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-distancia-entre-um-ponto-e-uma-reta',
    motivo: 'Fórmula de distância ponto-reta e suas aplicações diretas (altura de triângulo, tangência) são procedimento de cálculo, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-equacoes-polinomiais',
    motivo: 'Fatoração, relações de Girard e multiplicidade de raízes são técnicas algébricas; pares conjugados de raízes complexas são uma propriedade demonstrável, não uma cadeia narrativa nem tipologia com guarda-chuva.',
  },
  {
    chapterId: 'summary-matematica-equacoes-do-2-grau',
    motivo: 'Bhaskara, discriminante e relação com a parábola são procedimento e interpretação geométrica de uma única fórmula; os três casos de Δ são estados de uma classificação por sinal, não tipos coexistentes nem critérios conjuntivos.',
  },
  {
    chapterId: 'summary-matematica-equacoes-e-funcoes-logaritmicas',
    motivo: 'Condições de existência, resolução de equações/inequações logarítmicas e monotonicidade por base são procedimento algébrico, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-estatistica-descritiva',
    motivo: 'Média, mediana, moda e medidas de dispersão são definições e fórmulas de cálculo aplicadas a um conjunto de dados; não há tipos com guarda-chuva de coexistência nem cadeia causal entre elas — cada medida captura um aspecto diferente do mesmo conjunto, não posições rivais.',
  },
  {
    chapterId: 'summary-matematica-estudo-analitico-da-reta',
    motivo: 'Coeficiente angular, formas de equação de reta e condições de paralelismo/perpendicularidade são procedimento algébrico de construção de equação, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-estudo-do-sinal-de-funcoes',
    motivo: 'Regras de sinal por tipo de função (afim, quadrática) e quadro de sinais são procedimento sistemático de análise, sem tipos coexistentes com guarda-chuva nem cadeia causal narrativa.',
  },
  {
    chapterId: 'summary-matematica-eventos-disjuntos-e-eventos-independentes',
    motivo: 'Distinção conceitual entre disjunção e independência, com fórmulas correspondentes — são dois conceitos definidos por contraste didático, não posições teóricas rivais que a fonte apresenta como leituras concorrentes de um mesmo fenômeno.',
  },
  {
    chapterId: 'summary-matematica-funcao-constante-e-funcao-afim',
    motivo: 'Taxa de variação, interpretação de parâmetros e cálculo de zero são procedimento e interpretação de uma única forma de função, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-funcao-quadratica',
    motivo: 'Forma, vértice e exemplos de modelagem por função quadrática são procedimento de cálculo e interpretação, sem tipos coexistentes, critérios conjuntivos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-funcoes-bijetoras',
    motivo: 'Injetora/sobrejetora/bijetora são definições cumulativas (bijetora = injetora E sobrejetora), não tipos que coexistem como variantes paralelas nem critérios cuja necessidade conjunta a fonte declara para definir um fenômeno distinto — é a própria definição composta do conceito, não uma condição verificada sobre um fenômeno externo.',
  },
  {
    chapterId: 'summary-matematica-funcoes-trigonometricas',
    motivo: 'Parâmetros A, B, C, D da função trigonométrica geral e sua leitura gráfica são procedimento de modelagem, sem rivalidade, tipos com guarda-chuva ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-identificacao-de-simetrias-i',
    motivo: 'Simetria axial, central e de rotação são definições geométricas testadas por procedimento (dobrar, girar); a fonte não as apresenta como tipos coexistentes com guarda-chuva declarado, mas como testes independentes a aplicar a uma figura.',
  },
  {
    chapterId: 'summary-matematica-identificacao-de-simetrias-ii',
    motivo: 'Composição de reflexões, grupos de papel de parede e simetria em coordenadas são resultados e procedimentos de verificação algébrica, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-igualdades',
    motivo: 'Equivalência entre equações, cuidados com radicais/frações e tradução de sistemas são procedimento de resolução algébrica, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-introducao-ao-estudo-analitico-das-conicas',
    motivo: 'Elipse, hipérbole e parábola têm guarda-chuva de origem comum ("obtidas geometricamente como interseção de um plano com um cone duplo"), mas a fonte as diferencia por propriedades de distância mutuamente exclusivas por definição (soma constante vs. diferença constante vs. equidistância a foco único) para resolver problemas por fórmula, não como variantes que a fonte convida a comparar como tipos de um mesmo fenômeno — mais próximo de taxonomia de definições que de tipologia com convite a reconhecer casos reais mistos; sem a nota de honestidade que `tipologia` exige, forçar a família fabricaria uma leitura que a fonte não sustenta.',
  },
  {
    chapterId: 'summary-matematica-introducao-ao-modelo-exponencial',
    motivo: 'Estrutura f(t)=A×bᵗ, modelagem de taxas e leitura de gráfico são procedimento de modelagem matemática, sem tipos coexistentes, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-introducao-aos-logaritmos',
    motivo: 'Logaritmo como pergunta sobre expoente, propriedades operatórias e mudança de base são procedimento algébrico, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-introducao-a-geometria-analitica',
    motivo: 'Distância entre pontos, alinhamento por área/coeficiente angular e quadrantes são procedimento de cálculo analítico, sem rivalidade, tipos com guarda-chuva ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-introducao-a-geometria-plana',
    motivo: 'Objetos primitivos, relações angulares e o método axiomático são conteúdo de definição e classificação de ângulos por regra fixa (complementares, suplementares, opostos pelo vértice), não tipos coexistentes com guarda-chuva nem cadeia causal narrativa entre eventos.',
  },
  {
    chapterId: 'summary-matematica-introducao-a-teoria-dos-numeros-inteiros',
    motivo: 'Divisibilidade, primos/compostos, MDC e MMC são definições e algoritmos de teoria dos números; primo/composto é uma dicotomia binária, mais fraca que qualquer tipologia aceita, e MDC/MMC são conceitos complementares, não rivais.',
  },
  {
    chapterId: 'summary-matematica-introducao-as-funcoes',
    motivo: 'Definição de função, domínio/contradomínio/imagem e teste da reta vertical são conteúdo de definição, sem tipos coexistentes, critérios conjuntivos ou cadeia causal.',
  },
  {
    chapterId: 'mat-probabilidade-contagem',
    motivo: 'Modelo de Laplace, operações de conjuntos aplicadas a eventos e probabilidade condicional (inclusive Bayes) são procedimento e fórmula, sem rivalidade, tipos com guarda-chuva ou cadeia causal narrativa entre eventos distintos — o exemplo de Bayes é um cálculo único, não uma cadeia de elos causais encadeados.',
  },
  {
    chapterId: 'summary-matematica-introducao-as-sequencias',
    motivo: 'Definição de sequência, leitura de padrão e a ressalva sobre indeterminação de fórmula a partir de termos finitos são conteúdo conceitual, sem tipos coexistentes com guarda-chuva nem cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-introducao-as-tecnicas-de-contagem',
    motivo: 'Princípio multiplicativo, distinção soma/produto e tratamento de restrições são procedimento de contagem, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-inversao-de-funcoes',
    motivo: 'Procedimento algébrico de troca de variáveis, condição de existência (bijetividade) e simetria gráfica em relação a y=x são conteúdo procedimental, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-lugar-geometrico-e-equacao-da-circunferencia',
    motivo: 'Dedução da equação da circunferência a partir da fórmula de distância é uma derivação algébrica única de uma única fórmula (não uma cadeia de elos causais entre eventos distintos); os três casos de k (positivo/zero/negativo) são estados de uma classificação por sinal, não tipos coexistentes.',
  },
  {
    chapterId: 'summary-matematica-modelagem-algebrica-de-problemas-i',
    motivo: 'Tradução de enunciado para equação, padrões de tradução recorrentes e verificação de sentido prático são procedimento de modelagem, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-modelagem-algebrica-de-problemas-ii',
    motivo: 'Reconhecimento de modelo quadrático, otimização pelo vértice e validação de domínio contextual são procedimento de modelagem e cálculo, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-modelagem-exponencial-de-problemas',
    motivo: 'Reconhecimento de modelo exponencial, meia-vida/tempo de duplicação e resolução por logaritmo são procedimento de modelagem, sem tipos coexistentes, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-multiplicacao-de-matrizes',
    motivo: 'Regra "linha por coluna", condição de compatibilidade dimensional e propriedades que diferem da aritmética real (não comutatividade, produto nulo possível) são procedimento e propriedades algébricas, sem estrutura de família.',
  },

  // Parte B (capítulos 42-83). Ver seção "Parte B" de
  // docs/visual-personalizado/17-familias-matematica.md para o raciocínio
  // completo, capítulo a capítulo, com citação literal.
  {
    chapterId: 'summary-matematica-potencias-e-radicais',
    motivo: 'Propriedades operatórias de potências, conversão de radical para expoente fracionário e racionalização de denominador são procedimento algébrico de manipulação, sem tipos coexistentes, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-razao-e-proporcao',
    motivo: 'Grandezas diretas/inversas são uma dicotomia binária de classificação, não tipos com guarda-chuva explícito nem rivalidade; regra de três composta e divisão proporcional são procedimento de cálculo.',
  },
  {
    chapterId: 'summary-matematica-porcentagem',
    motivo: 'Cálculo de porcentagem, fator multiplicativo de aumento/desconto e distinção entre variação percentual e ponto percentual são definições e procedimento de cálculo, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-o-sistema-de-numeracao-decimal',
    motivo: 'Valor posicional, conversão entre bases e notação científica são convenção de representação numérica e procedimento de conversão, sem rivalidade, tipos coexistentes ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-progressao-aritmetica',
    motivo: 'Termo geral e soma de uma PA são fórmulas derivadas de uma única definição de variação constante; não há tipos, critérios conjuntivos ou cadeia causal narrativa.',
  },
  {
    chapterId: 'summary-matematica-progressao-geometrica',
    motivo: 'Termo geral, soma finita e soma infinita de uma PG são fórmulas derivadas da mesma definição de razão constante multiplicativa — procedimento de cálculo, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-sequencias',
    motivo: 'Recorrência versus lei explícita são duas formas equivalentes de descrever a mesma sequência (não posições rivais nem tipos coexistentes); convergência de séries é critério técnico único, sem cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-sistemas-de-equacoes',
    motivo: 'Métodos de substituição e adição/eliminação são técnicas alternativas de resolução (escolha de ferramenta, não rivalidade de posições); impossível/indeterminado são estados mutuamente exclusivos de classificação, não tipos coexistentes.',
  },
  {
    chapterId: 'summary-matematica-tabelas-e-matrizes',
    motivo: 'Definição de matriz, matrizes especiais (identidade, nula, diagonal) e operações de soma/multiplicação por escalar são procedimento e nomenclatura, sem critérios conjuntivos declarados nem cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-medias',
    motivo: 'Média ponderada, média harmônica (caso de velocidades) e mediana/moda são fórmulas alternativas para "resumir um conjunto de dados", escolhidas por contexto — não rivalidade de posições teóricas nem tipos com guarda-chuva explícito.',
  },
  {
    chapterId: 'summary-matematica-o-problema-da-fila',
    motivo: 'Arranjo, permutação com repetição e a técnica do bloco combinado são fórmulas e técnicas de contagem aplicadas conforme a situação — procedimento, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-o-problema-do-grupo',
    motivo: 'Combinação e a distinção arranjo/combinação por "ordem importa ou não" é um critério binário de escolha de fórmula, não uma tipologia com guarda-chuva nem critérios conjuntivos exigindo reunião simultânea.',
  },
  {
    chapterId: 'summary-matematica-tecnicas-de-contagem',
    motivo: 'Separação em casos e técnica do complemento são estratégias de resolução de problemas de contagem — procedimento e heurística, sem tipos coexistentes ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-operacoes-com-probabilidades',
    motivo: 'União, complemento, condicional e regra do produto generalizada são fórmulas operatórias sobre probabilidades — procedimento algébrico, sem rivalidade, tipos ou critérios conjuntivos.',
  },
  {
    chapterId: 'summary-matematica-angulos-em-triangulos',
    motivo: 'Classificação por lados (equilátero/isósceles/escaleno) e por ângulos (acutângulo/retângulo/obtusângulo) são dois esquemas de classificação apresentados separadamente, nunca cruzados numa grade de células — não sustenta `grade-de-eixos` (que exige dois eixos que se cruzam formando células com itens); soma dos ângulos e ângulo externo são fórmulas derivadas de uma única demonstração.',
  },
  {
    chapterId: 'summary-matematica-angulos-em-poligonos',
    motivo: 'Soma dos ângulos internos, ângulo de polígono regular e número de diagonais são fórmulas derivadas por decomposição geométrica — procedimento de cálculo, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-angulos-e-circunferencias',
    motivo: 'Relações entre ângulo central/inscrito/de cordas/de secantes e o arco correspondente são um conjunto de fórmulas específicas por configuração geométrica, escolhidas por identificação do caso — procedimento, não tipologia com guarda-chuva nem critérios conjuntivos.',
  },
  {
    chapterId: 'summary-matematica-simetrias-e-congruencias',
    motivo: 'Congruência como caso particular de semelhança (k=1) e os três movimentos rígidos (translação, rotação, reflexão) são definição e propriedades, sem rivalidade de posições nem tipos com guarda-chuva explícito de coexistência.',
  },
  {
    chapterId: 'summary-matematica-semelhanca-de-triangulos',
    motivo: 'Os critérios AA, LAL e LLL são alternativas suficientes e independentes para provar semelhança (qualquer um basta isoladamente) — o oposto estrutural de `criterios-conjuntivos`, que exige condições que precisam ser reunidas simultaneamente; não há necessidade conjunta declarada na fonte.',
  },
  {
    chapterId: 'summary-matematica-o-ponto-medio-e-o-baricentro-de-um-triangulo',
    motivo: 'Fórmula de ponto médio e de baricentro por coordenadas, e a razão fixa 2:1 do baricentro na mediana, são fórmulas derivadas de um único teorema de concorrência — procedimento e propriedade única, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-triangulo-retangulo',
    motivo: 'Relações métricas (h²=mn, b²=an, c²=am) e razões trigonométricas são duas abordagens equivalentes para o mesmo triângulo, escolhidas conforme o dado disponível — não são posições rivais nem tipos coexistentes.',
  },
  {
    chapterId: 'summary-matematica-areas-de-poligonos',
    motivo: 'Fórmulas de área de triângulo, retângulo, trapézio, losango e polígono regular são derivadas por decomposição geométrica umas das outras — procedimento de cálculo, sem tipos, critérios conjuntivos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-area-do-circulo-e-de-suas-partes',
    motivo: 'Área do círculo, setor, segmento circular e coroa circular são fórmulas relacionadas por subtração/proporção de áreas — procedimento de cálculo, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-razoes-entre-areas-de-figuras-planas',
    motivo: 'Razão de áreas igual ao quadrado da razão linear, e as técnicas de "ângulo comum" e "base/altura comum" são fórmulas e atalhos de cálculo — procedimento, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-areas-de-figuras-planas',
    motivo: 'Decomposição de figuras compostas e cálculo de áreas sombreadas por "figura completa menos parte excluída" são estratégia e procedimento de cálculo, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-trigonometria-no-triangulo-retangulo',
    motivo: 'Definições de seno/cosseno/tangente, verificação por Pitágoras e problemas de ângulo de elevação são procedimento trigonométrico aplicado, sem tipos coexistentes ou critérios conjuntivos.',
  },
  {
    chapterId: 'summary-matematica-relacoes-trigonometricas-em-poligonos',
    motivo: 'Lei dos senos, lei dos cossenos (generalização de Pitágoras) e fórmula de área por dois lados e ângulo são fórmulas derivadas aplicadas conforme os dados disponíveis — procedimento, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-outras-razoes-trigonometricas',
    motivo: 'Tangente, cotangente, secante e cossecante são definições derivadas de seno/cosseno, com identidades algébricas correspondentes — procedimento e nomenclatura, sem rivalidade, tipos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-transformacoes-trigonometricas',
    motivo: 'Fórmulas de soma/diferença de arcos e arco duplo/metade são identidades algébricas derivadas umas das outras — procedimento de manipulação trigonométrica, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-o-universo-tridimensional',
    motivo: 'Paralelas/concorrentes/reversas são estados mutuamente exclusivos de classificação de posição relativa de retas, não tipos coexistentes com guarda-chuva; perpendicularismo reta-plano é uma condição única, sem cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-prismas',
    motivo: 'Definição de prisma, fórmula de volume (A_base×h) e de área total são procedimento e nomenclatura geométrica, sem tipos coexistentes com guarda-chuva, critérios conjuntivos ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-piramides',
    motivo: 'Fórmula de volume com fator 1/3, apótema da pirâmide e fórmula do tronco são derivações e fórmulas de cálculo — procedimento geométrico, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-solidos-de-revolucao',
    motivo: 'Cilindro, cone e esfera como sólidos gerados por rotação de uma figura plana são instâncias de um único princípio gerador comum (não tipos rivais nem coexistentes com guarda-chuva distinto); fórmulas de volume/área são procedimento de cálculo.',
  },
  {
    chapterId: 'summary-matematica-razoes-entre-volumes-de-solidos',
    motivo: 'Razão de volumes igual ao cubo da razão linear é uma única fórmula aplicada a sólidos semelhantes — procedimento de cálculo, sem tipos, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-posicoes-relativas-entre-duas-retas',
    motivo: 'Paralelas/coincidentes/concorrentes são estados mutuamente exclusivos verificados por comparação de coeficientes — classificação por critério algébrico único, não tipos coexistentes nem critérios conjuntivos que exigem reunião simultânea.',
  },
  {
    chapterId: 'summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia',
    motivo: 'Secante/tangente/externa são estados mutuamente exclusivos definidos por comparação distância-raio (ou sinal do discriminante) — classificação por critério único, não tipologia com guarda-chuva de coexistência.',
  },
  {
    chapterId: 'summary-matematica-representacao-geometrica-de-inequacoes',
    motivo: 'Semiplano de uma inequação linear e interseção de semiplanos num sistema são procedimento de representação geométrica, sem tipos coexistentes, critérios conjuntivos declarados como necessidade ou cadeia causal.',
  },
  {
    chapterId: 'summary-matematica-tecnicas-algebricas',
    motivo: 'Produtos notáveis e simplificação de frações algébricas são identidades e procedimento de manipulação algébrica — sem rivalidade, tipos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-matematica-transformacoes-em-graficos-de-funcoes',
    motivo: 'Translações, reflexões e dilatações de gráficos são regras de transformação algébrica aplicadas conforme a expressão — procedimento, sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-modulo-de-um-numero-real',
    motivo: 'Definição de módulo como distância à origem, e resolução de equações/inequações modulares por desdobramento em casos, são procedimento algébrico, sem tipos coexistentes ou critérios conjuntivos.',
  },
  {
    chapterId: 'summary-matematica-numeros-complexos',
    motivo: 'Definição de i, operações (soma, multiplicação, divisão por conjugado) e igualdade de complexos são procedimento algébrico derivado de uma única definição (i²=−1), sem estrutura de família.',
  },
  {
    chapterId: 'summary-matematica-polinomios',
    motivo: 'Grau, divisão de polinômios (Briot-Ruffini) e fatoração progressiva por raízes são procedimento algébrico sequencial, sem tipos coexistentes, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. Vazio: a
 *  leitura dos 83 capítulos (Parte A + Parte B) não encontrou nenhum
 *  capítulo que sustentasse honestamente uma das oito famílias com citação
 *  literal — ver `matematicaSemCena` acima e o raciocínio completo em
 *  `docs/visual-personalizado/17-familias-matematica.md`. Uma dispatch
 *  futura pode reconsiderar candidatos específicos anotados no documento
 *  (Cônicas) se novas evidências de leitura mudarem essa avaliação.
 */
export const matematica: SceneEntry[] = [];
