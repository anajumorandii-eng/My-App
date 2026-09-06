# Matemática | Função Quadrática
## Forma e significado
Uma função quadrática tem a forma f(x) = ax² + bx + c, com a diferente de zero. Seu gráfico é uma parábola: se a é positivo, abre para cima e possui mínimo; se a é negativo, abre para baixo e possui máximo. O coeficiente c é f(0), ponto em que o gráfico corta o eixo y.
## Raízes e vértice
As raízes são os valores de x para os quais f(x) = 0. Pelo discriminante Δ = b² − 4ac, há duas raízes reais distintas se Δ > 0, uma raiz real dupla se Δ = 0 e nenhuma raiz real se Δ < 0. O x do vértice é −b/(2a); substitua esse valor em f para obter a altura extrema.
## Exemplo de modelagem
Se h(t) = −5t² + 20t + 1 descreve uma altura, o instante de altura máxima é t = −20/(2·−5) = 2 s. A altura máxima é h(2) = 21 m. Para saber quando o objeto chega ao chão, resolva h(t) = 0 e descarte tempos negativos, pois podem surgir como solução algébrica sem sentido físico.
## Armadilhas comuns
Não troque o sinal de b na fórmula de Bhaskara: x = (−b ± √Δ)/(2a). Não suponha que toda parábola cruza o eixo x. Também não trate o vértice como uma raiz: ele só estará no eixo x quando Δ = 0. Em contexto aplicado, examine domínio, unidade e quais soluções são fisicamente aceitáveis.
## Pratique e confira
Para f(x) = x² − 6x + 5, encontre raízes e vértice. As raízes são 1 e 5; o eixo de simetria é x = 3 e f(3) = −4. Explique por que o gráfico fica negativo entre as raízes, usando o fato de a parábola abrir para cima.

# Matemática | Introdução às Probabilidades
## Medir chance em um modelo
Probabilidade quantifica a chance de um evento dentro de um espaço amostral. Quando os resultados elementares são equiprováveis, P(A) = número de casos favoráveis dividido pelo número de casos possíveis. Antes de contar, defina claramente o experimento e o que será considerado resultado. Um modelo ruim produz uma conta correta para a pergunta errada.
## União, interseção e complemento
Para eventos A e B, P(A ou B) = P(A) + P(B) − P(A e B). A subtração evita contar duas vezes resultados pertencentes aos dois eventos. O complemento satisfaz P(não A) = 1 − P(A), muito útil quando é mais simples contar o oposto. Eventos mutuamente exclusivos têm interseção vazia, mas não são automaticamente independentes.
## Condicional e independência
P(A dado B) = P(A e B)/P(B), desde que P(B) seja diferente de zero. A informação B reduz o universo considerado. Eventos são independentes quando P(A e B) = P(A)P(B), equivalente a P(A dado B) = P(A) quando definido. Retirar cartas sem reposição geralmente cria dependência; com reposição, as chances podem permanecer iguais.
## Erros recorrentes
Não some probabilidades de eventos que se sobrepõem sem descontar a interseção. Não use multiplicação apenas porque há duas etapas: multiplique probabilidades condicionais ou independentes de modo justificado. Em problemas de “pelo menos um”, o complemento de “nenhum” costuma evitar casos perdidos. Sempre confira se o resultado está entre zero e um.
## Pratique e confira
Uma moeda honesta é lançada três vezes. A probabilidade de sair pelo menos uma cara é 1 menos a chance de não sair cara: 1 − (1/2)³ = 7/8. Explique por que somar diretamente os casos “uma cara”, “duas caras” e “três caras” exigiria cuidado com a contagem de sequências.

# Matemática | Progressão Aritmética
## Variação constante
Uma progressão aritmética, ou PA, é uma sequência em que a diferença entre termos consecutivos é constante, chamada razão r. Se r é positiva, a sequência cresce; se é negativa, decresce; se é zero, é constante. Identificar a diferença é mais seguro que tentar deduzir a fórmula apenas olhando os primeiros termos.
## Termo geral e posição
O termo de posição n é aₙ = a₁ + (n − 1)r. O n − 1 aparece porque o primeiro termo está a zero passos de si mesmo. Em problemas de contagem, deixe claro se a numeração começa em 0 ou 1. A fórmula permite encontrar termos distantes sem listar toda a sequência.
## Soma de termos
A soma dos n primeiros termos é Sₙ = n(a₁ + aₙ)/2. Ela pode ser entendida ao parear primeiro e último termos: cada par tem mesma soma. Se não houver termo final conhecido, substitua aₙ pela fórmula do termo geral. Em PA com número ímpar de termos, o termo central é a média do primeiro e do último.
## Armadilhas de índice
Não use n no lugar de n − 1 no termo geral. Não confunda razão de PA com razão de PG, onde o fator é multiplicativo. Uma sequência de quadrados, como 1, 4, 9, 16, não é PA porque as diferenças 3, 5 e 7 não são constantes, apesar de seguir um padrão simples.
## Pratique e confira
Numa PA com a₁ = 7 e r = 3, encontre a₍₂₀₎ e S₂₀. O vigésimo termo é 7 + 19·3 = 64; a soma é 20(7 + 64)/2 = 710. Mostre por que usar 20 em vez de 19 no primeiro cálculo produziria o termo seguinte.

# Matemática | Semelhança de Triângulos
## Mesma forma, outra escala
Triângulos semelhantes têm ângulos correspondentes iguais e lados correspondentes proporcionais. Eles não precisam ter o mesmo tamanho; a razão de semelhança informa a escala entre medidas lineares. Esse conceito permite calcular alturas inacessíveis, interpretar sombras e relacionar figuras em mapas, desde que as correspondências sejam estabelecidas corretamente.
## Critérios de semelhança
Dois ângulos iguais garantem semelhança pelo critério AA, pois o terceiro ângulo fica determinado. Também podem valer LAL, com ângulo compreendido igual e lados proporcionais, e LLL, com três pares de lados proporcionais. Não basta duas medidas de lado isoladas: é preciso verificar o critério completo e a correspondência entre vértices.
## Escala de grandezas
Se a razão linear é k, perímetros variam por k, áreas por k² e volumes por k³. Essa distinção é uma fonte clássica de erro. Uma ampliação de lados por fator 3 não triplica a área: multiplica-a por 9. Em problemas de sombras, a luz solar pode ser tratada como raios paralelos, formando triângulos semelhantes.
## Checagens de coerência
Não associe lado maior de um triângulo a lado menor do outro sem razão geométrica. Use letras de vértices correspondentes e mantenha a ordem nas proporções. Congruência é caso particular de semelhança com razão 1; semelhança não autoriza concluir igualdade de comprimentos nem de áreas.
## Pratique e confira
Uma haste de 2 m projeta sombra de 1,5 m; no mesmo instante, um prédio projeta sombra de 18 m. Qual é a altura? Pela proporcionalidade, h/18 = 2/1,5, logo h = 24 m. Explique qual hipótese sobre a direção dos raios de luz torna válida a comparação.

# Matemática | Introdução ao Modelo Exponencial
## Crescimento proporcional
Em uma função exponencial f(x) = a·bˣ, a variável aparece no expoente e b é positivo, diferente de 1. Se b > 1, há crescimento; se 0 < b < 1, há decaimento. Variações iguais em x multiplicam o valor por um mesmo fator b, ao contrário de uma função afim, em que acrescentam uma diferença constante.
## Modelagem de taxas
Juros compostos, crescimento de populações e decaimento radioativo podem ser modelados exponencialmente quando a taxa é proporcional à quantidade presente. A forma Q(t) = Q₀(1 + i)ᵗ usa i em forma decimal. Taxa de 5% significa fator 1,05; redução de 5% significa fator 0,95, não subtração fixa de 5 unidades.
## Leitura de gráficos
Com a > 0, o gráfico fica acima do eixo x e aproxima-se de zero em uma direção sem necessariamente alcançá-lo. O coeficiente a ajusta o valor inicial; b controla o fator de mudança. Comparar gráficos exige observar base e multiplicador, não apenas qual parece mais inclinado em uma janela específica.
## Erros frequentes
Não use porcentagem como número inteiro dentro do fator: 10% corresponde a 0,10. Não confunda dobrar em cada período com somar a mesma quantidade. Em decaimento, o tempo necessário para reduzir pela metade depende da base e pode ser calculado com logaritmos, não por subtração linear de metade a cada ponto arbitrário.
## Pratique e confira
Uma cultura começa com 500 células e dobra a cada hora. Escreva Q(t) = 500·2ᵗ e calcule após 4 horas: 8.000 células. Explique por que uma previsão linear de “mais 500 por hora” daria resultado diferente já na segunda hora.
