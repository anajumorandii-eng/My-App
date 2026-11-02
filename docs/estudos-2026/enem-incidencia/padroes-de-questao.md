# ENEM 2026: padrões de questão que se repetem

Revisão: 02/11/2026. É o equivalente, para o ENEM, do guia FUVEST `../fuvest-incidencia/estrategias-2027.md`. O ranking de assuntos (`probabilidades-2026.md`) diz **o que** cai; este guia diz **que operação** a prova pede, porque a mesma operação aparece em assuntos diferentes.

Âncoras: ano e número da questão no **caderno amarelo** da aplicação regular, como no banco do app. Os exercícios de transferência são autorais e as respostas estão conferidas.

## Quanto cada padrão aparece

Contagem de `scripts/medir-padroes-enem.py` sobre o enunciado das 1.440 questões de 2018–2025. Ela parte do texto do enunciado, então é **piso**: 549 itens têm figura recortada, e o gráfico ou a tabela que só aparecem na imagem não entram na conta.

| Padrão | Questões em 8 provas | Por prova | Natureza | Matemática | Linguagens | Humanas |
|---|---|---|---|---|---|---|
| Porcentagem | 113 | 14,1 | 26 | 60 | 12 | 15 |
| Tabela ou quadro | 82 | 10,2 | 33 | 42 | 5 | 2 |
| Gráfico citado no enunciado | 71 | 8,9 | 11 | 55 | 1 | 4 |
| Unidades e conversão | 68 | 8,5 | 21 | 40 | 4 | 3 |
| Escala | 35 | 4,4 | 6 | 18 | 4 | 7 |
| Experimento ou grupo controle | 24 | 3,0 | 18 | 1 | 2 | 3 |
| Média, mediana ou moda | 12 | 1,5 | 0 | 7 | 2 | 3 |
| Escolha da opção mais barata ou vantajosa | 9 | 1,1 | 3 | 6 | 0 | 0 |

Os padrões se sobrepõem: uma questão com tabela e porcentagem conta nas duas linhas. A conclusão prática é que **porcentagem, leitura de tabela/gráfico e unidades juntas aparecem em dezenas de questões por prova, espalhadas por Matemática e Natureza**. Treinar a operação rende mais do que revisar um capítulo isolado.

## 1. Unidades antes de qualquer conta

**Âncora:** 2025, q166 (Matemática). Um pote de 20 000 cm³ serve taças de 250 mL. Como 1 L = 1 000 cm³ = 1 000 mL, o pote tem 20 L = 20 000 mL, e 20 000 ÷ 250 = **80 taças** (gabarito d). As alternativas 8 e 800 são o erro de uma casa decimal na conversão.

**Como executar:** escreva a unidade ao lado de cada número do enunciado, converta tudo para a mesma unidade e só depois divida. Equivalências que mais caem: 1 m³ = 1 000 L, 1 cm³ = 1 mL, 1 h = 3 600 s, km/h ÷ 3,6 = m/s, 1 kWh = 3,6 × 10⁶ J.

**Transferência:** uma caixa-d'água de 1,2 m³ enche garrafas de 1,5 L. Quantas garrafas?
<details><summary>Conferir</summary>1,2 m³ = 1 200 L; 1 200 ÷ 1,5 = 800 garrafas. Quem usar 1 m³ = 100 L chega a 80.</details>

## 2. Escala é razão de comprimentos

**Âncora:** 2025, q163 (Matemática). O desenho foi ampliado e as medidas indicadas viraram 30 m; a pergunta é a escala desenho : obra (gabarito e, 1 : 150). Também aparece em Geografia (mapa) e em Física (imagem de microscópio).

**Como executar:** escala = medida no desenho ÷ medida real, **na mesma unidade**. Em área, a razão vai ao quadrado; em volume, ao cubo. Essa é a armadilha das alternativas.

**Transferência:** num mapa 1 : 250 000, duas cidades estão a 6 cm. Qual é a distância real?
<details><summary>Conferir</summary>6 × 250 000 = 1 500 000 cm = 15 km.</details>

## 3. Mediana pede a lista ordenada

**Âncoras:** 2024, q137 (umidade relativa em seis meses). Ordenando 46, 54, 60, 64, 64, 66, a mediana é a média dos dois centrais: (60 + 64) ÷ 2 = **62** (gabarito e). 2025, q139 (velocidade de internet em dez cidades) repete a operação com número par de dados.

**Como executar:** ordene sempre. Com número ímpar de dados, a mediana é o valor central; com número par, a média dos dois centrais. Média é a soma dividida pela quantidade; moda é o valor mais frequente. A alternativa errada costuma ser o valor central da lista **não ordenada**.

**Transferência:** 12, 5, 9, 20, 9, 14, 3. Calcule mediana, moda e média.
<details><summary>Conferir</summary>Ordenada: 3, 5, 9, 9, 12, 14, 20. Mediana 9, moda 9, média 72 ÷ 7 ≈ 10,3. O valor 20 puxa a média, não a mediana.</details>

## 4. Porcentagem sobre porcentagem

**Âncora:** 2024, q170 (casa de shows). A meia-entrada prevista era de 60% dos 500 ingressos, ou seja, 300. Ela "superou em 50% o previsto": 300 × 1,5 = 450 meias. A porcentagem incide sobre a **quantidade prevista**, não sobre o total de ingressos.

**Como executar:** troque cada porcentagem por um fator multiplicativo (aumento de 20% = × 1,2; desconto de 20% = × 0,8) e pergunte "por cento **de quê**?". Variações sucessivas se multiplicam, não se somam.

**Transferência:** um preço sobe 20% e depois cai 20%. Qual é a variação final?
<details><summary>Conferir</summary>1,2 × 0,8 = 0,96, ou seja, queda de 4%. Somar dá 0%, que é a alternativa armadilha.</details>

## 5. Comparar opções montando o custo total

**Âncora:** 2025, q173 (autoescolas). O custo de cada escola é 20 aulas teóricas + 10 práticas + aluguel do veículo; a escolha é a de menor total (gabarito e, III com R$ 1 200,00). As alternativas com valores baixos (R$ 280, R$ 460) somam só parte dos produtos.

**Como executar:** escreva a expressão do total de cada opção antes de substituir valores. Quando há fixo + variável, o ponto de empate (igualar as expressões) diz a partir de quando cada opção vence.

**Transferência:** o plano A cobra R$ 40 fixos + R$ 2 por km; o plano B, R$ 100 fixos + R$ 0,50 por km. A partir de quantos km B fica mais barato?
<details><summary>Conferir</summary>40 + 2x = 100 + 0,5x, então 1,5x = 60 e x = 40 km. Acima de 40 km, B é mais barato.</details>

## 6. Experimento: o que o controle permite concluir

**Âncoras:** 2024, q91 (Biologia). Amebas tratadas com citocalasina B perdem forma e movimento, e o grupo não tratado é o controle; o componente afetado são os microfilamentos (gabarito c). 2024, q100 (Física) usa o farelo de milho que desenha as linhas de campo elétrico. Dezoito das 24 questões com "experimento" no enunciado são de Natureza.

**Como executar:** identifique a variável que mudou entre os grupos, o que ficou igual e o efeito observado. A conclusão só vale para aquela variável. Alternativas erradas tiram conclusão que o experimento não testou ou citam uma estrutura que não explica o efeito observado (movimento, aqui).

**Transferência:** sementes regadas com água salgada germinam menos do que as regadas com água pura, com mesma luz e temperatura. O que o experimento permite e o que não permite concluir?
<details><summary>Conferir</summary>Permite: a salinidade reduz a germinação nessas condições. Não permite: qual mecanismo (osmótico ou tóxico) causa o efeito, nem o resultado em outras espécies ou concentrações.</details>

## 7. Gráfico de Natureza: ache o eixo antes da curva

**Âncora:** 2024, q123 (Química). O gráfico relaciona a razão ar/combustível do motor com a composição dos gases (CO₂, HC, CO, NO). A pergunta fixa a razão em 18, mistura com excesso de ar. A resposta (gabarito c: baixa de CO e alta de CO₂) sai de marcar 18 no eixo horizontal e ler cada curva; o mecanismo confirma, porque sobra oxigênio e a combustão fica mais completa.

**Como executar:** leia título, eixos e unidades; marque no eixo horizontal a condição pedida e suba até cada curva. Depois confira com o mecanismo: mais O₂ leva a combustão completa, com mais CO₂ e menos CO.

## 8. Linguagens: a função do texto, não o assunto

**Âncoras:** 2024, q14 (aplicativo que facilita a escrita de línguas indígenas; gabarito b, democratização do registro escrito) e 2024, q15 (foto de longa exposição feita por acaso; gabarito e, a produção artística pode resultar do acaso). Nas duas, as alternativas erradas repetem palavras do texto (jogo, tradução, tecnologia) com outra relação entre elas.

**Como executar:** responda antes de ler as alternativas: "este texto serve para quê?". Descarte a alternativa que generaliza ("depende", "limita", "sempre") ou que troca causa e efeito.

## Como treinar até a prova

1. No dia 2 (15/11), os padrões 1 a 5 concentram a maior parte de Matemática: faça 10 questões de cada no banco filtrando ENEM, cronometradas a 3 minutos.
2. Para cada erro, anote no Caderno de Erros **qual operação falhou** (unidade, "por cento de quê", lista não ordenada, total incompleto), não só o assunto.
3. No dia 1 (8/11), o padrão 8 vale para Linguagens e Humanas: antecipe a função do texto antes das alternativas.

## 9. Palavra do enunciado que entrega o conceito (Natureza)

Materiais de macetes que circulam para o ENEM (como o enviado ao Drive em 02/11/2026) ensinam a reconhecer o conceito pela palavra do enunciado. A regra vale, mas a frequência varia muito. Contagem no enunciado das 1.440 questões de 2018–2025; é piso, porque palavras que estão só na figura não entram:

| Pista no enunciado | Conceito a recuperar | Questões | Provas |
|---|---|---|---|
| corrente elétrica, resistor, resistência | U = R·I; associação série e paralelo; potência P = U·I | 13 | 7/8 |
| satélite, órbita, geoestacionário | período igual à rotação da Terra; gravidade como força centrípeta | 10 | 7/8 |
| indução, fluxo magnético variável | lei de Faraday: só há corrente induzida se o fluxo variar (fogão de indução, transformador, usina) | 9 | 6/8 |
| fragmentação, corredor ecológico | ilhas de habitat, perda de fluxo gênico; corredores reconectam populações | 7 | 4/8 |
| mitocôndria, ATP, respiração celular | glicose + O₂ → CO₂ + H₂O + ATP; ciclo de Krebs e cadeia respiratória | 5 | 5/8 |
| Bluetooth, wi-fi, radiofrequência | onda eletromagnética, não sonora; viaja no vácuo | 4 | 2/8 |
| decibel, nível sonoro | escala logarítmica: +10 dB = intensidade 10 vezes maior | 3 | 3/8 (2023–2025) |
| chuva ácida, óxidos de enxofre | SO₂/NOₓ + água → ácidos; corrosão de calcário e metais | 1 | 1/8 |
| sensação térmica, condutividade | metal parece mais frio porque conduz calor mais rápido, não por estar mais frio | 0 | — |

**Como usar:** a pista diz **onde procurar**, não a resposta. Em Física e Química, confirme com a conta ou com o mecanismo; as alternativas erradas costumam usar a palavra certa com a relação trocada (por exemplo, "o metal está a uma temperatura menor").

## 10. Atalhos de conta que economizam tempo

- **Porcentagem de cabeça:** 10% = dividir por 10; 5% = metade dos 10%; 1% = dividir por 100; 0,5% = metade de 1%.
- **Comparar frações sem MMC:** para a/b e c/d, compare a·d com c·b; o produto maior indica a fração maior.
- **Terno pitagórico:** lados proporcionais a 3, 4 e 5 (como 90, 120 e 150) dispensam a conta.
- **MMC ou MDC:** "quando voltam a coincidir" pede MMC; "maior pedaço possível, sem sobra" pede MDC.
- **Grandezas:** diretamente proporcional fica no numerador; inversamente proporcional, no denominador.

## 11. Linguagens: como a alternativa errada é construída

Fonte: e-book de macetes de Linguagens enviado em 02/11/2026, conferido com a classificação das 320 questões de Português de 2018–2025. Entendimento de Texto tem cerca de 16 questões por prova e 96% de chance, a maior de toda a prova.

**Os cinco tipos de alternativa errada.** Antes de marcar, pergunte qual destes vícios a alternativa tem:

| Vício | Como reconhecer | Exemplo do raciocínio |
|---|---|---|
| Contradição | diz o oposto do texto | o texto defende a reciclagem e a alternativa nega o benefício |
| Redução | pega um detalhe e trata como ideia central | o texto lista três efeitos e a alternativa diz "apenas um" |
| Extrapolação | conclui além do que o texto garante | o texto diz que ler ajuda a memória e a alternativa promete sucesso escolar |
| Generalização | "sempre", "todos", "nunca" onde o texto diz "alguns" | um estudo indica e a alternativa afirma para todos |
| Fuga | fala de assunto que o texto não trata | o texto é sobre poluição e a alternativa sobre desemprego |

É a mesma lógica do padrão 8 (função antes do assunto) e da prova de 2024 (q14 e q15), em que as erradas repetiam palavras do texto com outra relação entre elas.

**O que o histórico confirma dentro de Linguagens** (capítulos presentes em 6 ou mais das 8 provas):
- **Variação linguística:** 94%, 8 de 8 provas. A resposta certa trata de adequação ao contexto e legitimidade das variedades, nunca de "certo e errado".
- **Textos de tecnologia e redes sociais (TDIC):** 94%, 8 de 8 provas.
- **Gêneros não verbais (charge, tirinha, cartaz):** 92%, 7 de 8 provas. Leia imagem, texto e contexto juntos.
- **Fatores de textualidade e progressão:** 87%.
- **Funções da linguagem:** 75%, com a pergunta explícita em 7 das 8 provas. Informar → referencial; sentimento do autor → emotiva; convencer ou chamar o leitor → conativa; testar o canal → fática; falar da própria língua → metalinguística; forma e ritmo → poética.
- **Gêneros textuais:** 77%. Identifique o gênero pela intenção do texto (informar, convencer, criticar, relatar), não pelo formato. Na questão do ENEM 2024 sobre "Feijoada à minha moda", de Vinicius de Moraes, uma receita com marcas de carta, o que fazia do texto um poema era a linguagem expressiva.
- **Intertextualidade:** 68%. Citação, paráfrase, paródia (recriação crítica ou humorística) e alusão.

**O que o macete superestima:** figuras de linguagem isoladas (56%, em 5 de 8 provas) e escolas literárias por data. O ENEM cobra a escola pelo efeito no trecho, não pela cronologia: Parnasianismo aparece em 44% e a Semana de 22 em 46%.

## 12. Humanas: palavra-chave e eliminação

Fonte: e-book "Como dominar Humanas" enviado em 02/11/2026. O método confere com o padrão 8 e com os vícios da seção 11:

1. **Resuma o enunciado em três partes:** assunto, recorte e tarefa. Por exemplo: "Era Vargas; legislação trabalhista; identificar a medida".
2. **Elimine pela coerência de tempo e lugar.** Se o enunciado fala do Brasil no século XX, a alternativa que cita a Europa medieval sai.
3. **Desconfie dos absolutos** ("redução total das desigualdades", "fim das barreiras").
4. **Duelo final:** entre duas alternativas, fica a mais ligada ao núcleo do enunciado.

Os exemplos do e-book (empirismo e tábula rasa, fato social, CLT, globalização) caem nos assuntos de maior chance de Humanas: Brasil República (89%), globalização (94%) e Idade Moderna e Iluminismo (92%).

## 13. Resumões de Natureza: o que eles destacam e o que o histórico diz

Os dois resumões enviados ("Resumão da Salvação" e "Guia completo de Ciências da Natureza") são revisões de conteúdo, sem dado de incidência. Conferindo os temas que eles destacam com o enunciado das 1.440 questões:

| Tema destacado | Questões 2018–2025 | Provas |
|---|---|---|
| Polímeros e plásticos | 16 | 8/8 |
| Ciclo do nitrogênio e leguminosas | 10 | 6/8 |
| Tratamento de água e esgoto | 4 | 4/8 |
| Arboviroses (dengue, zika, chikungunya) | 4 | 3/8 |
| Fibra óptica e reflexão total | 0 | 0/8 |

**Polímeros** aparecem em todas as provas, quase sempre como contexto ambiental (plástico, biodegradável) dentro de questões de orgânica. Vale revisar a diferença entre polímero de adição e de condensação, e entre biodegradável e reciclável. **Fibra óptica** é tema clássico de vestibular, mas não apareceu no ENEM nesse período.
