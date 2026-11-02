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
