# ENEM 2026: o que tem maior probabilidade de cair

Gerado por `scripts/analisar-enem-probabilidades.mts` a partir de 1440 itens das oito aplicações regulares 2018–2025 do banco (Inglês como língua estrangeira). Provas em 8 e 15/11/2026.

## Como ler

- **P(cair)**: estimativa de aparecer **pelo menos uma questão** do assunto no ENEM 2026. Média de duas leituras do histórico ponderado por recência (peso 0,84 por ano de distância): presença por edição suavizada e Poisson sobre a média de questões.
- **Questões esperadas**: média ponderada de itens por edição. **Edições**: em quantas das 8 provas o assunto apareceu. **Tendência**: inclinação de 2018 a 2025 (↑ / → / ↓).
- A classificação por assunto e capítulo é a do banco (uma classificação editorial por questão), não oficial do Inep. Assunto que aparece pouco aqui pode estar escondido dentro de uma questão classificada em outro assunto — interdisciplinaridade é a regra no ENEM.
- Probabilidade de cair não é peso na nota: na TRI, a questão fácil que você erra pesa mais que a difícil. Prioridade real = P(cair) × quanto você ainda erra o assunto.

## O modelo acerta? Retroteste 2018–2024 → 2025

Antes de confiar nos números de 2026, o mesmo cálculo foi feito só com 2018–2024 e comparado com a prova de 2025.

|Nível|Brier do modelo|Brier de referência (taxa única)|Top-30 previstos que caíram em 2025|Caíram sem histórico|
|---|---|---|---|---|
|Assunto|0.168|0.210|26/30|0|
|Capítulo|0.215|0.215|21/30|17|

Calibração por faixa (assunto): 80–100%: 30/34 · 60–80%: 20/25 · 40–60%: 12/19 · 20–40%: 5/14 · 0–20%: 1/5.

Calibração por faixa (capítulo): 80–100%: 10/15 · 60–80%: 14/26 · 40–60%: 25/67 · 20–40%: 31/141 · 0–20%: 29/107.

Brier menor que a referência significa que o histórico separa de fato o que cai do que não cai. Capítulo é mais incerto que assunto: o currículo tem muitos capítulos e cada prova escolhe poucos.

## Top 40 assuntos de todo o exame

|#|Matéria|Assunto|P(cair)|Questões esperadas|Edições|Tendência|2018→2025|
|---|---|---|---|---|---|---|---|
|1|Português|Entendimento de Texto|96%|24.2|8/8|↓|26 28 30 25 24 20 20 26|
|2|Matemática|Aritmética e Proporcionalidade|96%|11.3|8/8|↓|10 14 16 11 11 9 10 12|
|3|Matemática|Probabilidade e Interpretação de Dados|96%|6.4|8/8|↑|7 6 3 7 5 7 6 8|
|4|Português|Domínio da Norma Culta|95%|5.5|8/8|↑|4 4 7 6 4 7 6 5|
|5|Matemática|Geometria Espacial|95%|5.1|8/8|↑|2 5 6 6 8 4 4 5|
|6|Inglês|Compreensão de Texto em Inglês|95%|5.0|8/8|→|5 5 5 5 5 5 5 5|
|7|Matemática|Geometria Plana|95%|4.5|8/8|→|7 3 5 2 4 5 6 4|
|8|Matemática|Funções|95%|4.3|8/8|↑|1 4 3 3 7 9 5 1|
|9|Biologia|Ecologia|95%|3.9|8/8|→|2 6 5 2 3 3 3 6|
|10|Biologia|Fisiologia Animal e Humana|94%|3.7|8/8|→|4 5 2 3 5 4 4 3|
|11|Matemática|Sequências, Matrizes e Sistemas Lineares|94%|3.3|8/8|↓|5 5 4 6 5 3 2 1|
|12|Geografia|Climatologia e Problemas Socioambientais|93%|2.9|8/8|↑|2 3 4 1 2 3 3 4|
|13|Geografia|Geografia da População e Urbana do Brasil|93%|2.8|8/8|↑|1 2 3 3 3 3 2 4|
|14|Geografia|Geografia Econômica do Brasil|92%|2.8|8/8|→|2 2 4 4 2 3 2 3|
|15|Física|Circuitos Elétricos|92%|2.7|8/8|→|3 1 2 4 4 1 2 4|
|16|Português|Literatura Contemporânea|91%|4.4|7/8|↑|3 3 0 3 3 5 7 6|
|17|Geografia|Globalização e Geografia Econômica|91%|2.4|8/8|↓|4 4 3 1 3 2 2 2|
|18|História|Idade Moderna e Iluminismo|90%|2.3|8/8|↓|2 4 5 1 2 2 3 1|
|19|Sociologia|Cultura, Identidade e Diversidade|90%|2.7|7/8|↑|0 2 2 5 3 2 3 3|
|20|Física|Calorimetria|89%|2.1|8/8|→|1 3 2 4 1 2 3 1|
|21|Matemática|Análise Combinatória|89%|2.0|8/8|→|1 2 3 2 2 2 2 2|
|22|Filosofia|Nietzsche, Existencialismo e Filosofia Contemporânea|88%|2.3|7/8|↑|0 2 3 2 2 3 3 2|
|23|Química|Análises Quantitativas e Estequiometria|88%|2.2|7/8|↑|0 1 2 3 3 2 2 3|
|24|Filosofia|Ética e Política Contemporâneas|87%|2.4|7/8|↑|1 3 1 0 1 2 3 5|
|25|Português|Simbolismo, Pré-Modernismo e Modernismo|86%|2.3|7/8|→|2 3 1 0 4 5 2 1|
|26|Biologia|Metabolismo Energético|85%|1.6|8/8|→|1 1 1 2 2 2 1 2|
|27|Biologia|Zoologia|85%|1.5|8/8|→|2 1 2 1 1 1 2 2|
|28|História|Primeira República e Era Vargas|85%|1.9|7/8|→|5 1 0 1 2 3 3 1|
|29|Sociologia|Estratificação Social e Desigualdade|84%|2.5|7/8|→|2 1 2 6 3 6 0 1|
|30|História|Brasil Colônia|83%|2.3|7/8|↓|3 4 3 3 1 3 0 3|
|31|Matemática|Equações, Desigualdades e Modelagem Algébrica|82%|3.2|6/8|↑|5 1 1 4 0 0 6 6|
|32|História|Brasil Império|81%|1.6|7/8|→|1 1 0 3 3 1 2 1|
|33|Português|Literatura Clássica, Medieval e Barroca|80%|2.0|7/8|↓|4 2 2 3 2 2 3 0|
|34|Matemática|Teoria dos Números Inteiros|80%|1.6|6/8|↑|0 0 1 2 3 1 2 2|
|35|Química|Fundamentos e Nomenclatura Orgânica|78%|1.8|7/8|↓|5 1 1 2 1 4 2 0|
|36|Sociologia|Movimentos Sociais e Cidadania|77%|1.6|7/8|→|1 2 1 1 3 2 3 0|
|37|Matemática|Trigonometria|77%|1.3|7/8|→|2 1 1 1 0 2 1 2|
|38|História|República Liberal e Brasil Contemporâneo|76%|1.2|7/8|↓|3 2 1 1 0 2 1 1|
|39|Matemática|Logaritmos e Exponenciais|75%|1.5|6/8|→|2 3 2 0 0 3 2 1|
|40|Química|Química Inorgânica|75%|1.1|7/8|→|1 0 1 1 2 1 1 1|

## Por matéria: assuntos e capítulos

### Matemática — 45.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Aritmética e Proporcionalidade|96%|11.3|8/8|↓|10 14 16 11 11 9 10 12|
|Probabilidade e Interpretação de Dados|96%|6.4|8/8|↑|7 6 3 7 5 7 6 8|
|Geometria Espacial|95%|5.1|8/8|↑|2 5 6 6 8 4 4 5|
|Geometria Plana|95%|4.5|8/8|→|7 3 5 2 4 5 6 4|
|Funções|95%|4.3|8/8|↑|1 4 3 3 7 9 5 1|
|Sequências, Matrizes e Sistemas Lineares|94%|3.3|8/8|↓|5 5 4 6 5 3 2 1|
|Análise Combinatória|89%|2.0|8/8|→|1 2 3 2 2 2 2 2|
|Equações, Desigualdades e Modelagem Algébrica|82%|3.2|6/8|↑|5 1 1 4 0 0 6 6|
|Teoria dos Números Inteiros|80%|1.6|6/8|↑|0 0 1 2 3 1 2 2|
|Trigonometria|77%|1.3|7/8|→|2 1 1 1 0 2 1 2|
|Logaritmos e Exponenciais|75%|1.5|6/8|→|2 3 2 0 0 3 2 1|
|Geometria Analítica|38%|0.5|3/8|↓|3 1 0 0 0 0 0 1|

**Capítulos mais recorrentes de Matemática** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Razão e Proporção (Aritmética e Proporcionalidade)|96%|8/8|7 8 11 5 5 5 5 10|
|Porcentagem (Aritmética e Proporcionalidade)|95%|8/8|3 4 4 6 5 4 4 2|
|Introdução às Probabilidades (Probabilidade e Interpretação de Dados)|91%|7/8|3 0 3 1 2 2 4 8|
|O Universo Tridimensional (Geometria Espacial)|84%|7/8|1 2 2 3 2 0 2 4|
|Sólidos de Revolução (Geometria Espacial)|78%|6/8|0 1 0 2 3 3 1 1|
|Estatística Descritiva (Probabilidade e Interpretação de Dados)|78%|6/8|3 4 0 6 3 4 1 0|
|Função Constante e Função Afim (Funções)|77%|6/8|1 4 0 2 3 5 2 0|
|Introdução às Técnicas de Contagem (Análise Combinatória)|72%|6/8|1 0 1 0 1 2 2 1|
|Introdução às Funções (Funções)|71%|5/8|0 0 3 0 1 2 2 1|
|O Sistema de Numeração Decimal (Teoria dos Números Inteiros)|69%|5/8|0 0 1 1 2 0 2 2|
|Técnicas Algébricas (Equações, Desigualdades e Modelagem Algébrica)|66%|3/8|0 0 0 2 0 0 5 3|
|Trigonometria no Triângulo Retângulo (Trigonometria)|58%|5/8|1 0 1 0 0 1 1 1|

### Português — 39.6 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Entendimento de Texto|96%|24.2|8/8|↓|26 28 30 25 24 20 20 26|
|Domínio da Norma Culta|95%|5.5|8/8|↑|4 4 7 6 4 7 6 5|
|Literatura Contemporânea|91%|4.4|7/8|↑|3 3 0 3 3 5 7 6|
|Simbolismo, Pré-Modernismo e Modernismo|86%|2.3|7/8|→|2 3 1 0 4 5 2 1|
|Literatura Clássica, Medieval e Barroca|80%|2.0|7/8|↓|4 2 2 3 2 2 3 0|
|Romantismo e Realismo|68%|1.4|4/8|↑|0 0 0 1 3 0 3 2|

**Capítulos mais recorrentes de Português** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Tecnologias Digitais da Informação e Comunicação (TDIC): Impactos Sociais (Entendimento de Texto)|95%|8/8|3 7 4 1 3 4 3 8|
|Gêneros não Verbais: Fundamentos de Leitura (Entendimento de Texto)|94%|8/8|4 1 3 3 2 1 5 6|
|Variação Linguística (Domínio da Norma Culta)|93%|8/8|4 1 3 4 3 4 4 1|
|Gêneros Textuais (Entendimento de Texto)|91%|8/8|1 4 6 3 4 2 1 1|
|Fatores de Textualidade (Entendimento de Texto)|87%|7/8|3 2 0 2 1 2 1 5|
|Função Poética e Linguagem Literária (Entendimento de Texto)|84%|7/8|5 3 4 2 1 0 2 3|
|Os Dois Níveis da Leitura (Entendimento de Texto)|84%|7/8|1 1 0 2 2 3 3 1|
|Modelos de Leitura e Distorções Interpretativas (Entendimento de Texto)|84%|7/8|3 2 6 5 4 3 2 0|
|Artes Plásticas Brasileiras (Literatura Contemporânea)|80%|6/8|1 1 0 2 0 1 4 4|
|A Arte e suas Linguagens (Literatura Clássica, Medieval e Barroca)|79%|7/8|3 2 2 3 1 2 3 0|
|Língua: um Sistema Complexo (Domínio da Norma Culta)|76%|6/8|0 2 1 2 0 3 2 1|
|Funções da Linguagem (Entendimento de Texto)|71%|7/8|3 2 1 1 1 2 1 0|

### Biologia — 16.8 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Ecologia|95%|3.9|8/8|→|2 6 5 2 3 3 3 6|
|Fisiologia Animal e Humana|94%|3.7|8/8|→|4 5 2 3 5 4 4 3|
|Metabolismo Energético|85%|1.6|8/8|→|1 1 1 2 2 2 1 2|
|Zoologia|85%|1.5|8/8|→|2 1 2 1 1 1 2 2|
|Genética|70%|1.0|7/8|→|1 1 1 2 1 0 1 1|
|Estrutura e Fisiologia Celular|70%|1.2|6/8|→|1 2 1 0 1 0 3 1|
|Biotecnologia|66%|0.9|6/8|→|1 0 1 1 2 0 1 1|
|Evolução|56%|0.8|5/8|→|1 0 1 2 1 0 2 0|
|Botânica|51%|0.7|5/8|↓|2 1 0 2 1 1 0 0|
|Código Genético e Síntese Proteica|41%|0.7|3/8|→|2 0 1 0 0 3 0 0|
|Fisiologia Vegetal|35%|0.5|2/8|→|0 0 0 2 0 2 0 0|
|Microbiologia e Virologia|29%|0.3|2/8|→|0 1 0 0 0 0 0 1|

**Capítulos mais recorrentes de Biologia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Biotecnologia (Biotecnologia)|66%|6/8|1 0 1 1 2 0 1 1|
|Introdução à Ecologia (Ecologia)|64%|4/8|1 0 0 0 0 1 2 3|
|Mecanismos da Evolução Biológica (Evolução)|52%|5/8|1 0 1 2 1 0 1 0|
|Espécies Invasoras e Controle Biológico (Ecologia)|50%|3/8|0 2 0 0 2 0 0 2|
|Sangue e Imunologia (Fisiologia Animal e Humana)|49%|4/8|0 2 1 0 3 1 0 0|
|Introdução à Genética (Genética)|49%|4/8|1 0 0 1 0 0 1 1|
|Coração e Vasos Sanguíneos (Fisiologia Animal e Humana)|48%|3/8|0 0 0 2 0 0 1 1|
|Proteínas: Enzimas (Metabolismo Energético)|46%|3/8|0 0 0 0 1 0 1 1|
|Bioenergética: Fotossíntese e Quimiossíntese (Metabolismo Energético)|46%|4/8|1 0 1 0 0 1 0 1|
|Plantas Terrestres II: Gimnospermas e Angiospermas (Botânica)|42%|4/8|2 1 0 2 0 1 0 0|
|Bioenergética: Fermentação e Respiração (Metabolismo Energético)|42%|4/8|0 1 0 1 1 1 0 0|
|Artrópodes: Insetos, Crustáceos e Miriápodes (Zoologia)|33%|3/8|1 0 0 1 0 0 1 0|

### Física — 15.1 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Circuitos Elétricos|92%|2.7|8/8|→|3 1 2 4 4 1 2 4|
|Calorimetria|89%|2.1|8/8|→|1 3 2 4 1 2 3 1|
|Estática dos Corpos Sólidos e dos Fluidos|74%|1.5|6/8|↓|3 3 4 0 0 2 1 1|
|Ondulatória|72%|1.6|5/8|↑|1 0 3 0 0 3 2 2|
|Eletromagnetismo|66%|0.8|7/8|→|1 1 1 1 1 1 0 1|
|Leis de Newton e Dinâmica do Movimento Retilíneo|63%|0.8|5/8|↑|0 0 0 1 1 1 1 1|
|Fundamentos de Ondas e Oscilações|59%|0.8|5/8|→|1 0 0 1 1 2 0 1|
|Cinemática Escalar|57%|0.8|5/8|→|1 2 1 0 0 2 0 1|
|Eletrostática e Campo Elétrico|55%|0.8|4/8|→|0 1 2 0 0 0 2 1|
|Cinemática Vetorial|53%|0.6|4/8|↑|0 0 0 1 1 0 1 1|
|Dinâmica Energética e Transformações de Energia|48%|0.5|5/8|→|1 1 0 1 1 0 1 0|
|Óptica Geométrica|48%|0.5|5/8|→|1 1 0 1 1 0 1 0|
|Gravitação e Movimento Circular|39%|0.6|3/8|→|0 0 1 2 2 0 0 0|
|Física Moderna|32%|0.3|2/8|→|0 0 0 0 0 1 1 0|
|Termodinâmica dos Gases|27%|0.3|2/8|→|0 0 1 0 0 0 1 0|
|Dinâmica Impulsiva|27%|0.3|3/8|↓|1 1 0 0 1 0 0 0|
|Óptica Instrumental e da Visão|11%|0.1|1/8|→|0 1 0 0 0 0 0 0|

**Capítulos mais recorrentes de Física** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Temperatura, Calor e seus Mecanismos de Transferência (Calorimetria)|70%|5/8|0 2 0 2 0 1 3 1|
|Hidrostática: Densidade e Pressão (Estática dos Corpos Sólidos e dos Fluidos)|59%|5/8|2 1 4 0 0 1 0 1|
|Potência Elétrica (Circuitos Elétricos)|58%|5/8|1 0 0 1 1 0 1 1|
|Ondulatória: Ondas Eletromagnéticas (Ondulatória)|57%|4/8|0 0 1 0 0 2 1 1|
|Conceitos Básicos (Fundamentos de Ondas e Oscilações)|56%|5/8|1 0 0 1 1 1 0 1|
|Resistores (Circuitos Elétricos)|54%|6/8|2 1 1 1 1 1 0 0|
|Calor Sensível e Calor Latente (Calorimetria)|50%|5/8|0 1 2 1 1 1 0 0|
|Campo Elétrico (Eletrostática e Campo Elétrico)|43%|3/8|0 0 1 0 0 0 1 1|
|Estática (Estática dos Corpos Sólidos e dos Fluidos)|42%|4/8|1 1 0 0 0 1 1 0|
|Fundamentos da Óptica Geométrica (Óptica Geométrica)|34%|3/8|0 1 0 1 0 0 1 0|
|O Movimento Circular (Cinemática Escalar)|34%|3/8|1 1 0 0 0 0 0 1|

### Geografia — 14.9 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Climatologia e Problemas Socioambientais|93%|2.9|8/8|↑|2 3 4 1 2 3 3 4|
|Geografia da População e Urbana do Brasil|93%|2.8|8/8|↑|1 2 3 3 3 3 2 4|
|Geografia Econômica do Brasil|92%|2.8|8/8|→|2 2 4 4 2 3 2 3|
|Globalização e Geografia Econômica|91%|2.4|8/8|↓|4 4 3 1 3 2 2 2|
|Geografia Física do Brasil|74%|1.6|6/8|↓|4 0 3 1 4 2 1 0|
|Geopolítica Regional Contemporânea|69%|0.9|6/8|→|1 0 1 0 2 1 1 1|
|Cartografia e Fundamentos|59%|0.8|6/8|↓|1 2 1 1 2 0 1 0|
|Hidrogeografia|35%|0.4|3/8|→|0 0 1 1 0 0 1 0|

**Capítulos mais recorrentes de Geografia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|O Espaço Urbano I (Geografia da População e Urbana do Brasil)|77%|7/8|0 1 1 1 1 1 1 2|
|O Espaço Agrário Brasileiro (Geografia Econômica do Brasil)|68%|6/8|2 2 4 1 2 3 0 0|
|Dinâmica Demográfica (Geografia da População e Urbana do Brasil)|62%|5/8|1 1 0 0 0 1 1 2|
|Geomorfologia Mundial (Climatologia e Problemas Socioambientais)|60%|5/8|0 2 3 1 0 1 0 1|
|Água na Superfície Terrestre (Climatologia e Problemas Socioambientais)|50%|4/8|1 0 0 0 1 0 1 1|
|O Espaço Urbano II (Geografia da População e Urbana do Brasil)|46%|4/8|0 0 1 2 1 1 0 0|
|Produção Mineral (Geografia Econômica do Brasil)|44%|3/8|0 0 0 1 0 0 1 1|
|Terrorismo Internacional (Geopolítica Regional Contemporânea)|43%|3/8|0 0 1 0 0 0 1 1|
|Geopolítica dos Recursos Hídricos (Hidrogeografia)|35%|3/8|0 0 1 1 0 0 1 0|
|Globalização e Processos Econômicos Atuais (Globalização e Geografia Econômica)|33%|3/8|0 0 1 1 0 1 0 0|
|Pedologia (Geografia Física do Brasil)|33%|3/8|1 0 0 0 1 1 0 0|

### História — 13.4 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Idade Moderna e Iluminismo|90%|2.3|8/8|↓|2 4 5 1 2 2 3 1|
|Primeira República e Era Vargas|85%|1.9|7/8|→|5 1 0 1 2 3 3 1|
|Brasil Colônia|83%|2.3|7/8|↓|3 4 3 3 1 3 0 3|
|Brasil Império|81%|1.6|7/8|→|1 1 0 3 3 1 2 1|
|República Liberal e Brasil Contemporâneo|76%|1.2|7/8|↓|3 2 1 1 0 2 1 1|
|Idade Média|68%|1.0|6/8|→|2 1 0 3 1 0 1 1|
|Idade Antiga|57%|1.1|4/8|→|0 1 5 1 0 0 0 2|
|Imperialismo e Guerras Mundiais|54%|0.8|4/8|↑|1 0 0 0 1 1 0 2|
|Guerra Fria e Mundo Contemporâneo|54%|0.7|4/8|→|2 0 0 0 0 1 1 1|

**Capítulos mais recorrentes de História** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Baixa Idade Média (Idade Média)|57%|5/8|1 1 0 2 0 0 1 1|
|Brasil Império: Formação do Estado Nacional Brasileiro (Brasil Império)|51%|4/8|0 1 0 0 1 0 1 1|
|Brasil Império: Segundo Reinado (1840-1889) (Brasil Império)|49%|4/8|0 0 0 1 1 1 1 0|
|O Brasil Atual (República Liberal e Brasil Contemporâneo)|49%|4/8|0 1 1 0 0 0 1 1|
|A Era Vargas: o Estado Novo (Primeira República e Era Vargas)|43%|4/8|1 0 0 1 1 0 1 0|
|Introdução à História e Primeiras Civilizações (Idade Antiga)|41%|3/8|0 0 2 1 0 0 0 1|
|Guerra Fria (Guerra Fria e Mundo Contemporâneo)|39%|3/8|1 0 0 0 0 1 0 1|
|Revolução Francesa (Idade Moderna e Iluminismo)|39%|3/8|0 0 1 0 0 1 1 0|
|Dinâmica Interna da Colonização (Brasil Colônia)|39%|4/8|1 1 0 2 1 0 0 0|
|Ascensão e Domínio das Oligarquias (Primeira República e Era Vargas)|38%|4/8|1 1 0 0 1 1 0 0|
|A Montagem da Colonização (Brasil Colônia)|35%|3/8|1 0 1 0 0 0 0 1|
|América Espanhola (Idade Moderna e Iluminismo)|33%|3/8|2 1 0 0 0 0 1 0|

### Química — 13.3 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Análises Quantitativas e Estequiometria|88%|2.2|7/8|↑|0 1 2 3 3 2 2 3|
|Fundamentos e Nomenclatura Orgânica|78%|1.8|7/8|↓|5 1 1 2 1 4 2 0|
|Química Inorgânica|75%|1.1|7/8|→|1 0 1 1 2 1 1 1|
|Reações e Aplicações Orgânicas|70%|1.3|6/8|→|1 1 1 3 0 1 0 3|
|Equilíbrio Químico|68%|0.9|6/8|→|1 0 2 0 1 1 1 1|
|Eletroquímica|67%|1.0|6/8|↓|2 2 0 2 1 0 1 1|
|Cinética Química|61%|0.9|6/8|→|1 1 2 1 2 0 0 1|
|Oxirredução|60%|1.0|5/8|→|0 2 2 1 2 0 2 0|
|Polaridade das Ligações e Geometria Molecular|57%|1.0|4/8|→|0 2 1 0 0 2 0 2|
|Radioatividade|50%|0.6|4/8|→|0 0 1 0 1 1 0 1|
|Soluções|43%|0.6|2/8|↑|0 0 0 0 0 0 1 2|
|Modelos Atômicos e Estrutura do Átomo|34%|0.4|3/8|↓|1 2 0 0 0 0 1 0|
|Gases|24%|0.3|1/8|→|0 0 0 0 0 2 0 0|
|Termoquímica|19%|0.2|2/8|↓|2 1 0 0 0 0 0 0|

**Capítulos mais recorrentes de Química** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Separação de Misturas (Análises Quantitativas e Estequiometria)|62%|5/8|0 0 1 1 2 0 1 1|
|Cinética Química (Cinética Química)|61%|6/8|1 1 2 1 2 0 0 1|
|Cálculos Estequiométricos (Análises Quantitativas e Estequiometria)|54%|5/8|0 1 1 2 1 2 0 0|
|Deslocamento de Equilíbrio (Equilíbrio Químico)|54%|4/8|0 0 1 0 0 1 1 1|
|Introdução à Química Orgânica (Fundamentos e Nomenclatura Orgânica)|53%|5/8|2 1 0 0 1 1 1 0|
|Radioatividade: o Estudo das Radiações (Radioatividade)|50%|4/8|0 0 1 0 1 1 0 1|
|Introdução ao Estudo das Pilhas e Baterias (Eletroquímica)|49%|4/8|1 0 0 1 0 0 1 1|
|Processos de Oxirredução (Oxirredução)|47%|4/8|0 1 0 1 2 0 1 0|
|Equações Iônicas e outras Teorias para Ácidos e Bases (Química Inorgânica)|46%|4/8|0 0 1 1 2 1 0 0|
|Química Inorgânica (Química Inorgânica)|41%|3/8|1 0 0 0 0 0 1 1|
|Interações Intermoleculares (Polaridade das Ligações e Geometria Molecular)|40%|3/8|0 1 0 0 0 1 0 1|
|Eletroquímica de Processos Espontâneos (Eletroquímica)|38%|4/8|1 2 0 1 1 0 0 0|

### Sociologia — 9.1 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Cultura, Identidade e Diversidade|90%|2.7|7/8|↑|0 2 2 5 3 2 3 3|
|Estratificação Social e Desigualdade|84%|2.5|7/8|→|2 1 2 6 3 6 0 1|
|Movimentos Sociais e Cidadania|77%|1.6|7/8|→|1 2 1 1 3 2 3 0|
|Globalização e Sociedade Contemporânea|70%|1.2|5/8|↑|1 0 0 0 2 1 2 2|
|Trabalho e Sociedade|57%|0.7|5/8|→|0 1 0 2 1 1 1 0|
|A Formação da Sociologia como Ciência|23%|0.3|2/8|→|1 0 0 2 0 0 0 0|
|Karl Marx e a Sociologia|14%|0.1|1/8|→|0 0 0 1 0 0 0 0|
|Émile Durkheim e o Fato Social|10%|0.1|1/8|→|1 0 0 0 0 0 0 0|

**Capítulos mais recorrentes de Sociologia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Cultura e Etnocentrismo (Cultura, Identidade e Diversidade)|82%|7/8|0 1 2 2 1 1 2 2|
|Desigualdade de Gênero (Estratificação Social e Desigualdade)|69%|6/8|2 0 2 2 1 2 0 1|
|Globalização Econômica e Cultural (Globalização e Sociedade Contemporânea)|52%|3/8|0 0 0 0 0 1 2 1|
|Identidade e Diferença (Cultura, Identidade e Diversidade)|51%|4/8|0 1 0 3 2 1 0 0|
|Movimentos Sociais Clássicos e Contemporâneos (Movimentos Sociais e Cidadania)|48%|3/8|0 0 0 1 1 0 3 0|
|Classes Sociais e Mobilidade Social (Estratificação Social e Desigualdade)|44%|3/8|0 1 0 2 0 3 0 0|
|Desigualdade Racial no Brasil (Estratificação Social e Desigualdade)|43%|3/8|0 0 0 2 2 1 0 0|
|Cidadania e Direitos (Movimentos Sociais e Cidadania)|43%|4/8|0 2 1 0 1 1 0 0|
|A Sociedade da Informação (Globalização e Sociedade Contemporânea)|41%|3/8|1 0 0 0 2 0 0 1|
|Democracia e Participação Política (Movimentos Sociais e Cidadania)|33%|3/8|1 0 0 0 1 1 0 0|
|Transformações no Mundo do Trabalho (Trabalho e Sociedade)|30%|3/8|0 1 0 1 1 0 0 0|

### Filosofia — 7.9 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Nietzsche, Existencialismo e Filosofia Contemporânea|88%|2.3|7/8|↑|0 2 3 2 2 3 3 2|
|Ética e Política Contemporâneas|87%|2.4|7/8|↑|1 3 1 0 1 2 3 5|
|Filosofia Moderna: Racionalismo e Empirismo|70%|1.0|6/8|→|0 4 1 1 0 1 1 1|
|Sócrates e Platão|53%|0.6|4/8|↑|0 0 0 1 1 0 1 1|
|Aristóteles|48%|0.5|4/8|→|1 0 1 0 0 0 1 1|
|Origens da Filosofia e os Pré-Socráticos|48%|0.6|3/8|↑|0 0 0 0 2 1 0 1|
|Contratualismo Político e Iluminismo|27%|0.3|2/8|→|2 0 0 0 0 0 1 0|
|Kant e o Idealismo Alemão|26%|0.3|2/8|→|0 1 0 0 0 0 1 0|
|Filosofia Medieval|19%|0.2|2/8|↓|2 1 0 0 0 0 0 0|
|Marx e a Crítica à Sociedade Capitalista|14%|0.1|1/8|→|0 0 0 1 0 0 0 0|

**Capítulos mais recorrentes de Filosofia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Justiça e Direitos Humanos (Ética e Política Contemporâneas)|67%|4/8|0 1 0 0 0 2 2 3|
|Foucault e as Relações de Poder (Nietzsche, Existencialismo e Filosofia Contemporânea)|51%|4/8|0 2 0 0 1 1 0 1|
|Nietzsche e a Crítica aos Valores Morais (Nietzsche, Existencialismo e Filosofia Contemporânea)|49%|3/8|0 0 0 1 0 0 2 1|
|Ética Aplicada e Bioética (Ética e Política Contemporâneas)|48%|3/8|0 1 0 0 0 0 1 2|
|Descartes e o Método: a Dúvida Hiperbólica (Filosofia Moderna: Racionalismo e Empirismo)|38%|3/8|0 1 0 0 0 1 1 0|
|Filosofia Política Contemporânea (Ética e Política Contemporâneas)|34%|4/8|1 1 1 0 1 0 0 0|

### Inglês — 5.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Compreensão de Texto em Inglês|95%|5.0|8/8|→|5 5 5 5 5 5 5 5|

**Capítulos mais recorrentes de Inglês** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Text Comprehension: Taxonomy and Terminology (Compreensão de Texto em Inglês)|95%|8/8|5 5 5 5 5 5 5 5|

