/**
 * Lote espacial de Matemática (11/10/2026): um objeto por capítulo, desenhado no mesmo
 * palco dos lotes de ciências. Os gráficos planos aparecem como uma prancha deitada no
 * espaço, que a câmera pode girar; quando o assunto é tridimensional (cônicas, sólidos,
 * (a+b)³, planos de um sistema), o objeto é tridimensional de fato.
 */
export type MathSpatialKind =
  | 'powers'|'ratio'|'percent'|'decimal'|'divisors'|'figurate'|'arithmetic'|'geometric'|'fibonacci'|'system2'
  | 'matrix'|'matmul'|'determinant'|'planes'|'means'|'tree'|'queue'|'group'|'anagram'|'union'
  | 'independence'|'histogram'|'plane-basics'|'triangle-angles'|'polygon-angles'|'inscribed'|'congruence'|'axes-symmetry'|'rotational'|'thales'
  | 'similar'|'centroid'|'pythagoras'|'metric'|'shear-area'|'circle-area'|'area-ratio'|'trapezoid'|'trig-ramp'|'law-cosines'
  | 'unit-circle'|'tangent'|'fundamental'|'angle-sum'|'sine-wave'|'space-point'|'distance'|'circle-eq'|'line-eq'|'two-lines'
  | 'point-line'|'line-circle'|'conics'|'half-plane'|'complex-rotation'|'binomial'|'balance'|'inequality'|'linear-model'|'complete-square'
  | 'max-area'|'function-map'|'graph-transform'|'composition'|'inverse'|'bijection'|'affine'|'quadratic'|'sign'|'exponential'
  | 'log'|'log-exp'|'decay'|'absolute'|'complex-polar'|'polynomial'|'girard'|'dice';
export interface MathSpatialLesson {kind:MathSpatialKind;title:string;label:string;min:number;max:number;step:number;initial:number;note:string;choices?:[string,string][];}
const m=(kind:MathSpatialKind,title:string,label:string,min:number,max:number,step:number,initial:number,note:string,choices?:[string,string][]):MathSpatialLesson=>({kind,title,label,min,max,step,initial,note,choices});
const M='summary-matematica-';

export const MATH_SPATIAL_LESSONS:Record<string,MathSpatialLesson>={
  [M+'potencias-e-radicais']:m('powers','a² é um quadrado, a³ é um cubo','Base a',1,5,1,3,'Cubos unitários empilhados. Raiz quadrada é o lado do quadrado de área dada; raiz cúbica, a aresta do cubo de volume dado.',[['square','a²'],['cube','a³']]),
  [M+'razao-e-proporcao']:m('ratio','Caixas proporcionais','Razão de semelhança k',1,3,.5,2,'As duas caixas têm as mesmas proporções. Medidas lineares escalam por k; a razão entre arestas correspondentes é constante.'),
  [M+'porcentagem']:m('percent','100 cubos: cada um é 1%','Porcentagem destacada',0,100,5,35,'Quadro de 10×10 cubos idênticos. Porcentagem é razão com denominador 100.'),
  [M+'o-sistema-de-numeracao-decimal']:m('decimal','Valor posicional em blocos','Número representado',1,999,1,243,'Cubinho = 1, barra = 10, placa = 100. O mesmo algarismo vale 10 vezes mais a cada posição à esquerda.'),
  [M+'introducao-a-teoria-dos-numeros-inteiros']:m('divisors','Divisores como retângulos','Quantidade n de cubos',6,36,1,12,'Cada retângulo a×b com a·b = n mostra um par de divisores. Primo: só a fileira 1×n.'),
  [M+'introducao-as-sequencias']:m('figurate','Sequências de figuras','Termo n',1,6,1,4,'Números quadrados (n²) e triangulares (n(n+1)/2) construídos com cubos.',[['square','Quadrados'],['triangular','Triangulares']]),
  [M+'progressao-aritmetica']:m('arithmetic','PA: cada torre soma r','Razão r',1,4,1,2,'a₁ = 2, seis termos. Topos alinhados: uma PA é uma função afim de n.'),
  [M+'progressao-geometrica']:m('geometric','PG: cada torre multiplica por q','Razão q × 10',11,20,1,15,'a₁ = 2, seis termos, alturas em escala. q > 1: crescimento cada vez mais rápido.'),
  [M+'sequencias']:m('fibonacci','Fibonacci em quadrados','Termos desenhados',3,8,1,6,'aₙ = aₙ₋₁ + aₙ₋₂ com 1, 1. Os lados formam o retângulo que tende à razão áurea.'),
  [M+'sistemas-de-equacoes']:m('system2','Duas retas, uma solução','Coeficiente a da reta 2',-3,3,.5,1,'Reta 1: x + y = 4; reta 2: a·x − y = −1. Solução = interseção; a = −1 dá retas paralelas.'),
  [M+'tabelas-e-matrizes']:m('matrix','Matriz como tabela de barras','Linha i destacada',1,3,1,2,'Matriz 3×3 fixa: cada entrada aᵢⱼ vira uma barra na linha i, coluna j.'),
  [M+'multiplicacao-de-matrizes']:m('matmul','Linha × coluna = uma entrada','Linha i de A',1,2,1,1,'A (2×3) · B (3×2). Cada cᵢⱼ soma os produtos da linha i de A com a coluna j de B.'),
  [M+'determinantes']:m('determinant','Determinante = área orientada','Cisalhamento da coluna 2',-2,2,.5,1,'Colunas (3, 0) e (s, 2). O paralelogramo muda de forma, mas a área |det| = 6 se mantém.'),
  [M+'discussao-de-sistemas-lineares']:m('planes','Três planos, três situações','Inclinação do terceiro plano',-1,1,.5,.5,'Cada equação com três incógnitas é um plano. SPD: um ponto comum; SPI: uma reta comum; SI: nada comum.',[['spd','Possível determinado'],['spi','Possível indeterminado'],['si','Impossível']]),
  [M+'medias']:m('means','A média nivela as torres','Valor da última torre',1,15,1,9,'Cinco valores: 3, 4, 5, 6 e o variável. A média aritmética é a altura do plano que iguala as torres.',[['arith','Aritmética'],['median','Mediana']]),
  [M+'introducao-as-tecnicas-de-contagem']:m('tree','Árvore de possibilidades','Opções na segunda etapa',2,4,1,3,'Princípio multiplicativo: 2 opções na primeira etapa e n na segunda geram 2·n ramos.'),
  [M+'o-problema-da-fila']:m('queue','Fila: cada posição tem uma pessoa a menos','Pessoas n',2,6,1,4,'Permutação simples: n·(n−1)·…·1 = n! filas distintas.'),
  [M+'o-problema-do-grupo']:m('group','Grupo: a ordem não importa','Escolhidos k (de 6)',1,5,1,2,'C(6, k) = 6!/(k!(6−k)!). Grupos com as mesmas pessoas são iguais.'),
  [M+'tecnicas-de-contagem']:m('anagram','Anagramas com repetição','Letras repetidas',1,4,1,2,'Palavra de 6 letras em que uma letra aparece r vezes: 6!/r!. Trocar letras iguais não cria anagrama novo.'),
  [M+'operacoes-com-probabilidades']:m('union','União de eventos','Pontos na interseção',0,6,1,3,'Espaço com 20 resultados equiprováveis; A e B com 8 cada. P(A∪B) = P(A) + P(B) − P(A∩B).'),
  [M+'eventos-disjuntos-e-eventos-independentes']:m('independence','Disjuntos ou independentes','P(A) em %',10,60,10,40,'P(B) = 50%. Independentes: P(A∩B) = P(A)·P(B), a área do retângulo. Disjuntos: interseção vazia.',[['independent','Independentes'],['disjoint','Disjuntos']]),
  [M+'estatistica-descritiva']:m('histogram','Histograma, média e mediana','Assimetria',-2,2,1,1,'Distribuição com 40 observações. Cauda à direita puxa a média acima da mediana.'),
  [M+'introducao-a-geometria-plana']:m('plane-basics','Ponto, reta e plano','Ângulo entre as retas',15,90,15,60,'Duas retas concorrentes num plano determinam um ponto e quatro ângulos, opostos pelo vértice iguais.'),
  [M+'angulos-em-triangulos']:m('triangle-angles','Os três ângulos fazem 180°','Ângulo A em graus',20,120,10,60,'Triângulo com B = 50°. Dobrando os cantos sobre a base, os três ângulos formam um ângulo raso.'),
  [M+'angulos-em-poligonos']:m('polygon-angles','Polígono regular','Número de lados n',3,10,1,6,'Soma interna (n − 2)·180°; ângulo externo 360°/n.'),
  [M+'angulos-e-circunferencias']:m('inscribed','Inscrito vale metade do central','Arco em graus',40,300,20,100,'Mesmo arco: ângulo central = arco; inscrito = arco/2, onde quer que esteja o vértice.'),
  [M+'simetrias-e-congruencias']:m('congruence','Isometrias preservam a figura','Parâmetro do movimento',0,1,.25,.5,'Triângulo e sua imagem: lados e ângulos iguais. Reflexão inverte a orientação; rotação e translação não.',[['reflection','Reflexão'],['rotation','Rotação'],['translation','Translação']]),
  [M+'identificacao-de-simetrias-i']:m('axes-symmetry','Eixos de simetria','Lados do polígono regular',3,8,1,5,'Polígono regular de n lados tem n eixos de simetria.'),
  [M+'identificacao-de-simetrias-ii']:m('rotational','Simetria de rotação','Pontas da estrela',3,8,1,5,'Estrela regular de n pontas coincide consigo mesma após 360°/n.'),
  [M+'a-geometria-da-proporcionalidade']:m('thales','Teorema de Tales','Distância entre paralelas 2 e 3',1,4,.5,2,'Paralelas cortadas por duas transversais: segmentos correspondentes são proporcionais.'),
  [M+'semelhanca-de-triangulos']:m('similar','Triângulos semelhantes','Razão k',1,2.5,.5,2,'Ângulos iguais, lados proporcionais. Perímetro escala por k, área por k².'),
  [M+'o-ponto-medio-e-o-baricentro-de-um-triangulo']:m('centroid','Baricentro: o ponto de equilíbrio','Posição do vértice C',-40,40,10,10,'Medianas ligam vértice ao ponto médio do lado oposto e se cruzam em G, que divide cada uma na razão 2:1.'),
  [M+'triangulo-retangulo']:m('pythagoras','Quadrados sobre os lados','Cateto a',2,6,1,3,'Cateto b = 4. Área do quadrado da hipotenusa = soma das áreas dos quadrados dos catetos.'),
  [M+'a-geometria-metrica-plana']:m('metric','Relações métricas','Projeção m',1,8,1,4,'Triângulo retângulo com hipotenusa 9 dividida em m e n pela altura: h² = m·n, b² = m·a.'),
  [M+'areas-de-poligonos']:m('shear-area','Mesma base, mesma altura, mesma área','Deslocamento do vértice',-40,40,10,0,'Base 8 e altura 5: área 20 para qualquer posição do vértice sobre a paralela.'),
  [M+'area-do-circulo-e-de-suas-partes']:m('circle-area','Do círculo ao retângulo','Setores',4,16,2,8,'r = 3. Setores alternados formam quase um retângulo de base πr e altura r: A = πr².'),
  [M+'razoes-entre-areas-de-figuras-planas']:m('area-ratio','Área cresce com k²','Razão linear k',1,3,.5,2,'Hexágonos semelhantes: lado ×k, área ×k².'),
  [M+'areas-de-figuras-planas']:m('trapezoid','Trapézio = dois triângulos','Base menor',1,8,1,4,'Base maior 10, altura 6. A = (B + b)·h/2.'),
  [M+'trigonometria-no-triangulo-retangulo']:m('trig-ramp','Rampa: seno, cosseno e tangente','Ângulo θ',10,80,5,30,'Hipotenusa 10. Cateto oposto = 10·sen θ; adjacente = 10·cos θ.'),
  [M+'relacoes-trigonometricas-em-poligonos']:m('law-cosines','Lei dos cossenos','Ângulo entre os lados 6 e 8',20,160,10,60,'c² = a² + b² − 2ab·cos C. Em 90° recai em Pitágoras.'),
  [M+'a-trigonometria-dos-numeros-reais']:m('unit-circle','Círculo trigonométrico','Ângulo em graus',0,360,15,60,'Raio 1. Cada ponto (cos x, sen x); os sinais mudam por quadrante.'),
  [M+'outras-razoes-trigonometricas']:m('tangent','Tangente, secante e cotangente','Ângulo em graus',5,85,5,40,'Reta tangente em x = 1: o raio prolongado a corta em tg x; o segmento até ela mede sec x.'),
  [M+'a-relacao-fundamental-da-trigonometria']:m('fundamental','sen² + cos² = 1','Ângulo em graus',0,90,5,35,'Os quadrados sobre os catetos do triângulo no círculo unitário somam a área do quadrado da hipotenusa, 1.'),
  [M+'transformacoes-trigonometricas']:m('angle-sum','Soma de arcos','Ângulo b em graus',0,90,10,30,'a = 40° fixo. Girar a e depois b equivale a girar a + b: cos(a+b) = cos a cos b − sen a sen b.'),
  [M+'funcoes-trigonometricas']:m('sine-wave','Do círculo à senoide','Amplitude A',1,3,.5,2,'f(x) = A·sen x. A ordenada do ponto que gira é desenhada ao longo de x.'),
  [M+'o-universo-tridimensional']:m('space-point','Coordenadas no espaço','Cota z do ponto',-4,4,1,3,'P = (3, 2, z). As projeções nos planos coordenados ligam o ponto aos eixos.'),
  [M+'introducao-a-geometria-analitica']:m('distance','Distância entre dois pontos','Abscissa de B',-4,6,1,5,'A = (−2, 1), B = (x, 4). d² = Δx² + Δy².'),
  [M+'lugar-geometrico-e-equacao-da-circunferencia']:m('circle-eq','Circunferência: mesma distância ao centro','Raio r',1,5,.5,3,'Centro (1, 1): (x − 1)² + (y − 1)² = r².'),
  [M+'estudo-analitico-da-reta']:m('line-eq','Coeficiente angular','m',-3,3,.5,1,'y = m·x + 1. m é a tangente do ângulo com o eixo x.'),
  [M+'posicoes-relativas-entre-duas-retas']:m('two-lines','Paralelas, concorrentes, perpendiculares','Coeficiente da reta 2',-3,3,.5,2,'Reta 1: y = 2x. Iguais m: paralelas; m₁·m₂ = −1: perpendiculares.'),
  [M+'distancia-entre-um-ponto-e-uma-reta']:m('point-line','Distância é o segmento perpendicular','Ordenada do ponto P',-4,6,1,4,'Reta 3x − 4y = 0, P = (2, y). d = |3·2 − 4y|/5.'),
  [M+'posicoes-relativas-entre-uma-reta-e-uma-circunferencia']:m('line-circle','Secante, tangente ou exterior','Altura c da reta',-5,5,.5,2,'Circunferência de raio 3 na origem e reta y = c. Compare |c| com o raio.'),
  [M+'introducao-ao-estudo-analitico-das-conicas']:m('conics','Cônicas: cortes do cone','Inclinação do plano em graus',0,80,5,30,'Cone duplo com geratriz a 45°. Abaixo de 45°: elipse (0° = circunferência); 45°: parábola; acima: hipérbole.'),
  [M+'representacao-geometrica-de-inequacoes']:m('half-plane','Inequação é um semiplano','b em y ≥ x + b',-3,3,1,0,'A reta y = x + b é a fronteira; a região acima satisfaz a desigualdade.'),
  [M+'a-geometria-dos-numeros-complexos']:m('complex-rotation','Multiplicar por i gira 90°','Parte real de z',-3,3,1,2,'z = a + 2i. Cada multiplicação por i gira o vetor 90° no plano de Argand.'),
  [M+'tecnicas-algebricas']:m('binomial','(a + b)² e (a + b)³ em blocos','b',1,4,1,2,'a = 4. (a+b)² = a² + 2ab + b²; (a+b)³ separa-se em 8 blocos.',[['square','Quadrado'],['cube','Cubo']]),
  [M+'igualdades']:m('balance','Equação como balança','Valor de x testado',0,6,1,2,'2x + 1 = 7. A balança só fica nivelada na solução.'),
  [M+'desigualdades']:m('inequality','Inequação como balança','x',0,8,1,2,'3x − 2 > 7. Pratos desnivelados mostram o lado maior; multiplicar por negativo inverte o sentido.'),
  [M+'modelagem-algebrica-de-problemas-i']:m('linear-model','Tanque enchendo','Vazão em L/min',1,5,1,2,'Tanque com 10 L e vazão constante: V(t) = 10 + vt.'),
  [M+'equacoes-do-2-grau']:m('complete-square','Completar o quadrado','b em x² + bx = 16',2,8,2,6,'Os retângulos b/2·x completam o quadrado com (b/2)².'),
  [M+'modelagem-algebrica-de-problemas-ii']:m('max-area','Cercado de perímetro fixo','Largura em m',1,19,1,6,'40 m de cerca: A(x) = x(20 − x), máximo no quadrado 10×10.'),
  [M+'introducao-as-funcoes']:m('function-map','Função: cada entrada, uma saída','Entrada destacada',1,4,1,2,'f(x) = 2x + 1 de {1,2,3,4}. Cada elemento do domínio tem exatamente uma imagem.'),
  [M+'transformacoes-em-graficos-de-funcoes']:m('graph-transform','Transformar o gráfico','Parâmetro',-3,3,.5,2,'f(x) = x². Somar desloca; multiplicar dilata; sinal negativo reflete.',[['vertical','f(x) + k'],['horizontal','f(x − h)'],['stretch','a·f(x)']]),
  [M+'composicao-de-funcoes']:m('composition','g ∘ f: aplicar f e depois g','Entrada x',0,3,1,1,'f(x) = x + 1, g(x) = 2x. (g∘f)(x) = 2x + 2 ≠ (f∘g)(x) = 2x + 1.'),
  [M+'inversao-de-funcoes']:m('inverse','f e f⁻¹: espelho em y = x','Coeficiente a de f(x) = a·x + 1',.5,3,.5,2,'Inversa troca x e y; os gráficos são simétricos pela bissetriz.'),
  [M+'funcoes-bijetoras']:m('bijection','Injetora, sobrejetora, bijetora','Elementos do contradomínio',3,5,1,4,'Domínio com 4 elementos. Bijetora exige contradomínio do mesmo tamanho.'),
  [M+'funcao-constante-e-funcao-afim']:m('affine','Função afim','Coeficiente a',-2,2,.5,1,'f(x) = a·x + 1. a = 0: função constante; a é a taxa de variação.'),
  [M+'funcao-quadratica']:m('quadratic','Parábola e vértice','Coeficiente a',-2,2,.5,1,'f(x) = a(x − 1)² − 2. Vértice (1, −2); a > 0: concavidade para cima.'),
  [M+'estudo-do-sinal-de-funcoes']:m('sign','Onde f é positiva','Raiz r',-3,3,.5,1,'f(x) = (x + 2)(x − r)/2. Entre as raízes, sinal oposto ao de a.'),
  [M+'introducao-ao-modelo-exponencial']:m('exponential','Crescimento por fator','Taxa por período em %',10,100,10,50,'Valor inicial 1, seis períodos: aₙ = (1 + i)ⁿ.'),
  [M+'introducao-aos-logaritmos']:m('log','Logaritmo: o expoente procurado','x',1,32,1,8,'log₂ x: quantas vezes dobrar 1 para chegar a x.'),
  [M+'equacoes-e-funcoes-logaritmicas']:m('log-exp','Exponencial e logaritmo','Base b',1.5,4,.5,2,'y = bˣ e y = log_b x são inversas: espelhadas pela bissetriz.'),
  [M+'modelagem-exponencial-de-problemas']:m('decay','Meia-vida','Meia-vida em anos',1,5,1,2,'100 g de amostra, 10 anos: m(t) = 100·(1/2)^(t/T).'),
  [M+'modulo-de-um-numero-real']:m('absolute','Módulo é distância','x',-5,5,.5,-3,'|x| é a distância de x a 0; o gráfico y = |x| tem forma de V.'),
  [M+'numeros-complexos']:m('complex-polar','Módulo e argumento','Argumento θ',0,360,15,45,'|z| = 3. z = 3(cos θ + i sen θ).'),
  [M+'polinomios']:m('polynomial','Raízes de um polinômio','Raiz móvel r',-3,3,.5,1,'p(x) = (x + 2)(x − 1)(x − r)/2. Cada raiz é um corte no eixo x.'),
  [M+'equacoes-polinomiais']:m('girard','Relações de Girard','Termo independente d',-6,6,1,-6,'x³ − 2x² − 5x + d. Soma das raízes = 2 sempre; produto = −d.'),
  'mat-probabilidade-contagem':m('dice','Dois dados: 36 resultados','Soma desejada',2,12,1,7,'Dados honestos. P(soma) = casos favoráveis/36; 7 é a soma mais provável.'),
};

export const factorial=(n:number):number=>n<=1?1:n*factorial(n-1);
export const comb=(n:number,k:number):number=>factorial(n)/(factorial(k)*factorial(n-k));
export const diceWays=(s:number):number=>6-Math.abs(s-7);
export function conicType(angle:number):'circunferência'|'elipse'|'parábola'|'hipérbole'{return angle===0?'circunferência':angle<45?'elipse':angle===45?'parábola':'hipérbole';}
export function systemSolution(a:number):[number,number]|null{if(Math.abs(a+1)<1e-9)return null;const x=3/(a+1);return [x,4-x];}
