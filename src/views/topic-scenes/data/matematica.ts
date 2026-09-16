import type { SceneEntry } from '../types';

/** Capítulos de Matemática sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Parte A (capítulos 1-41, por ordem de aparição em deepSummaryContent.json
 *  filtrado por subject === "Matemática"). A Parte B (42-83) é adicionada por
 *  uma dispatch separada, que não deve repetir nenhum dos chapterIds abaixo.
 *
 *  Todos os 41 capítulos desta metade foram lidos por inteiro e testados
 *  contra as oito famílias de `types.ts`. Nenhum sustentou honestamente
 *  nenhuma família: são conteúdo procedimental (fórmula, algoritmo de
 *  cálculo, exercício resolvido), sem a estrutura de rivalidade genuína,
 *  camadas assimétricas, movimento dialético, tipos coexistentes com
 *  guarda-chuva explícito, critérios conjuntivos com necessidade declarada,
 *  escala de graus nomeados, cadeia causal instrumental entre eventos
 *  distintos, ou grade de dois eixos ortogonais que as famílias exigem. Ver
 *  `docs/visual-personalizado/17-familias-matematica.md` (Parte A) para o
 *  raciocínio capítulo a capítulo, incluindo os candidatos considerados e
 *  descartados.
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
    chapterId: 'summary-matematica-introducao-as-probabilidades',
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
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. Vazio nesta
 *  Parte A: a leitura dos 41 capítulos não encontrou nenhum capítulo que
 *  sustentasse honestamente uma das oito famílias com citação literal — ver
 *  `matematicaSemCena` acima e o raciocínio completo em
 *  `docs/visual-personalizado/17-familias-matematica.md`. Uma dispatch
 *  futura pode reconsiderar candidatos específicos anotados no documento
 *  (Cônicas) se novas evidências de leitura mudarem essa avaliação.
 */
export const matematica: SceneEntry[] = [];
