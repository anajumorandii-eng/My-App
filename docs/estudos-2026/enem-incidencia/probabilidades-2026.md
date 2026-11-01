# ENEM 2026: o que tem maior probabilidade de cair

Gerado por `scripts/analisar-enem-probabilidades.mts` a partir de 1390 itens das oito aplicações regulares 2018–2025 do banco (Inglês como língua estrangeira). Provas em 8 e 15/11/2026.

## Como ler

- **P(cair)**: estimativa de aparecer **pelo menos uma questão** do assunto no ENEM 2026. Média de duas leituras do histórico ponderado por recência (peso 0,84 por ano de distância): presença por edição suavizada e Poisson sobre a média de questões.
- **Questões esperadas**: média ponderada de itens por edição. **Edições**: em quantas das 8 provas o assunto apareceu. **Tendência**: inclinação de 2018 a 2025 (↑ / → / ↓).
- A classificação por assunto e capítulo é a do banco (uma classificação editorial por questão), não oficial do Inep. Assunto que aparece pouco aqui pode estar escondido dentro de uma questão classificada em outro assunto — interdisciplinaridade é a regra no ENEM.
- Probabilidade de cair não é peso na nota: na TRI, a questão fácil que você erra pesa mais que a difícil. Prioridade real = P(cair) × quanto você ainda erra o assunto.

## O modelo acerta? Retroteste 2018–2024 → 2025

Antes de confiar nos números de 2026, o mesmo cálculo foi feito só com 2018–2024 e comparado com a prova de 2025.

|Nível|Brier do modelo|Brier de referência (taxa única)|Top-30 previstos que caíram em 2025|Caíram sem histórico|
|---|---|---|---|---|
|Assunto|0.179|0.218|30/30|1|
|Capítulo|0.193|0.199|23/30|12|

Calibração por faixa (assunto): 80–100%: 33/35 · 60–80%: 16/24 · 40–60%: 12/25 · 20–40%: 7/15 · 0–20%: 2/4.

Calibração por faixa (capítulo): 80–100%: 11/11 · 60–80%: 16/37 · 40–60%: 24/65 · 20–40%: 32/149 · 0–20%: 29/148.

Brier menor que a referência significa que o histórico separa de fato o que cai do que não cai. Capítulo é mais incerto que assunto: o currículo tem muitos capítulos e cada prova escolhe poucos.

## Top 40 assuntos de todo o exame

|#|Matéria|Assunto|P(cair)|Questões esperadas|Edições|Tendência|2018→2025|
|---|---|---|---|---|---|---|---|
|1|Português|Entendimento de Texto|96%|15.7|8/8|↑|9 13 13 14 10 7 22 25|
|2|Matemática|Aritmética e Proporcionalidade|96%|7.7|8/8|↑|2 7 4 3 3 3 13 15|
|3|Português|Domínio da Norma Culta|96%|6.9|8/8|↑|9 3 5 6 6 9 8 7|
|4|Matemática|Probabilidade e Interpretação de Dados|95%|5.6|8/8|↑|7 5 3 2 5 6 6 8|
|5|Matemática|Geometria Espacial|95%|5.4|8/8|↑|2 3 9 5 8 6 4 5|
|6|Inglês|Compreensão de Texto em Inglês|95%|5.0|8/8|→|5 5 5 5 5 5 5 5|
|7|Matemática|Funções|95%|5.0|8/8|↓|4 6 4 7 7 8 5 1|
|8|Matemática|Geometria Plana|95%|4.8|8/8|↓|7 5 7 5 4 3 6 4|
|9|Biologia|Ecologia|95%|4.1|8/8|↑|2 5 6 1 4 4 3 6|
|10|Português|Literatura Contemporânea|94%|3.7|8/8|↑|2 4 2 5 3 7 3 3|
|11|Biologia|Fisiologia Animal e Humana|94%|3.5|8/8|↓|4 6 2 3 3 4 4 3|
|12|Geografia|Geografia da População e Urbana do Brasil|94%|3.4|8/8|↓|5 1 5 6 2 3 2 4|
|13|Geografia|Globalização e Geografia Econômica|94%|3.4|8/8|↑|2 3 3 2 3 8 3 2|
|14|Matemática|Equações, Desigualdades e Modelagem Algébrica|94%|3.3|8/8|→|3 4 6 2 1 1 5 4|
|15|Geografia|Climatologia e Problemas Socioambientais|92%|2.7|8/8|→|3 4 1 3 3 2 3 3|
|16|Matemática|Sequências, Matrizes e Sistemas Lineares|92%|2.7|8/8|↓|5 4 2 5 3 3 2 1|
|17|Física|Circuitos Elétricos|92%|2.6|8/8|↑|2 1 2 5 3 1 2 4|
|18|Matemática|Análise Combinatória|92%|2.6|8/8|→|2 3 3 4 5 1 2 2|
|19|Português|Simbolismo, Pré-Modernismo e Modernismo|92%|2.6|8/8|↓|2 7 4 2 1 3 2 2|
|20|História|Idade Moderna e Iluminismo|92%|2.5|8/8|↓|2 3 6 3 1 3 3 1|
|21|Português|Literatura Clássica, Medieval e Barroca|90%|2.2|8/8|↓|7 3 2 2 2 2 2 1|
|22|História|Primeira República e Era Vargas|89%|2.1|8/8|↓|4 3 1 3 1 2 3 1|
|23|Geografia|Geografia Física do Brasil|89%|2.0|8/8|↓|2 1 5 3 4 1 1 1|
|24|Química|Análises Quantitativas e Estequiometria|88%|1.9|8/8|↑|1 2 2 1 1 2 2 3|
|25|Física|Calorimetria|88%|1.9|8/8|→|2 2 4 1 2 1 3 1|
|26|Português|Romantismo e Realismo|88%|2.5|7/8|↑|3 1 0 3 4 3 3 2|
|27|História|Brasil Império|87%|2.3|7/8|↓|2 5 0 3 4 3 2 1|
|28|Filosofia|Nietzsche, Existencialismo e Filosofia Contemporânea|86%|1.7|8/8|↑|1 1 1 2 1 1 3 2|
|29|Biologia|Estrutura e Fisiologia Celular|84%|1.5|8/8|↑|1 1 1 1 2 1 3 1|
|30|História|República Liberal e Brasil Contemporâneo|84%|1.9|7/8|↓|5 2 0 3 3 2 1 1|
|31|História|Idade Média|83%|1.7|7/8|→|2 1 0 4 3 2 1 1|
|32|Matemática|Trigonometria|82%|1.6|7/8|→|4 0 1 2 1 2 1 2|
|33|História|Brasil Colônia|82%|2.1|7/8|↓|2 3 4 2 2 2 0 3|
|34|Sociologia|Cultura, Identidade e Diversidade|81%|1.8|6/8|↑|0 0 1 1 2 1 3 3|
|35|Biologia|Zoologia|80%|1.4|7/8|↑|1 0 2 1 1 1 2 2|
|36|Química|Química Inorgânica|80%|1.3|7/8|→|0 2 2 2 2 1 1 1|
|37|Matemática|Logaritmos e Exponenciais|80%|1.8|6/8|→|0 3 1 3 0 4 2 1|
|38|Matemática|Teoria dos Números Inteiros|79%|1.7|7/8|↓|3 2 2 4 2 2 0 1|
|39|Física|Leis de Newton e Dinâmica do Movimento Retilíneo|78%|1.1|8/8|→|2 1 1 1 1 1 1 1|
|40|Biologia|Metabolismo Energético|77%|1.2|7/8|→|1 1 0 2 1 1 1 2|

## Por matéria: assuntos e capítulos

### Matemática — 43.5 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Aritmética e Proporcionalidade|96%|7.7|8/8|↑|2 7 4 3 3 3 13 15|
|Probabilidade e Interpretação de Dados|95%|5.6|8/8|↑|7 5 3 2 5 6 6 8|
|Geometria Espacial|95%|5.4|8/8|↑|2 3 9 5 8 6 4 5|
|Funções|95%|5.0|8/8|↓|4 6 4 7 7 8 5 1|
|Geometria Plana|95%|4.8|8/8|↓|7 5 7 5 4 3 6 4|
|Equações, Desigualdades e Modelagem Algébrica|94%|3.3|8/8|→|3 4 6 2 1 1 5 4|
|Sequências, Matrizes e Sistemas Lineares|92%|2.7|8/8|↓|5 4 2 5 3 3 2 1|
|Análise Combinatória|92%|2.6|8/8|→|2 3 3 4 5 1 2 2|
|Trigonometria|82%|1.6|7/8|→|4 0 1 2 1 2 1 2|
|Logaritmos e Exponenciais|80%|1.8|6/8|→|0 3 1 3 0 4 2 1|
|Teoria dos Números Inteiros|79%|1.7|7/8|↓|3 2 2 4 2 2 0 1|
|Geometria Analítica|70%|1.5|5/8|↓|4 0 1 0 4 3 0 1|
|Números Complexos e Polinômios|20%|0.2|2/8|→|0 1 0 1 0 0 0 0|

**Capítulos mais recorrentes de Matemática** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Introdução às Probabilidades (Probabilidade e Interpretação de Dados)|95%|8/8|3 2 3 2 3 2 4 8|
|O Universo Tridimensional (Geometria Espacial)|94%|8/8|1 1 4 4 6 4 2 4|
|Introdução às Técnicas de Contagem (Análise Combinatória)|86%|8/8|1 1 1 2 4 1 2 1|
|Potências e Radicais (Aritmética e Proporcionalidade)|86%|6/8|1 1 1 0 0 1 11 13|
|Introdução às Funções (Funções)|81%|8/8|1 2 1 1 1 1 2 1|
|O Sistema de Numeração Decimal (Teoria dos Números Inteiros)|78%|7/8|2 1 2 4 2 2 0 1|
|Porcentagem (Aritmética e Proporcionalidade)|76%|6/8|0 4 0 1 3 1 1 1|
|Razão e Proporção (Aritmética e Proporcionalidade)|76%|7/8|1 2 3 2 0 1 1 1|
|Sólidos de Revolução (Geometria Espacial)|71%|7/8|1 1 1 0 1 1 1 1|
|Técnicas Algébricas (Equações, Desigualdades e Modelagem Algébrica)|69%|4/8|2 0 2 0 0 0 5 3|
|Área do Círculo e de suas Partes (Geometria Plana)|63%|5/8|1 3 0 2 0 1 3 0|
|Estatística Descritiva (Probabilidade e Interpretação de Dados)|62%|5/8|1 2 0 0 2 3 1 0|

### Português — 38.5 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Entendimento de Texto|96%|15.7|8/8|↑|9 13 13 14 10 7 22 25|
|Domínio da Norma Culta|96%|6.9|8/8|↑|9 3 5 6 6 9 8 7|
|Literatura Contemporânea|94%|3.7|8/8|↑|2 4 2 5 3 7 3 3|
|Simbolismo, Pré-Modernismo e Modernismo|92%|2.6|8/8|↓|2 7 4 2 1 3 2 2|
|Literatura Clássica, Medieval e Barroca|90%|2.2|8/8|↓|7 3 2 2 2 2 2 1|
|Romantismo e Realismo|88%|2.5|7/8|↑|3 1 0 3 4 3 3 2|
|Leitura de Coletânea e Repertório Temático|72%|1.9|6/8|↓|1 2 7 1 3 4 0 0|
|Análise Sintática|60%|1.0|6/8|↓|1 1 1 2 3 1 0 0|
|Coesão, Conclusão e Proposta de Intervenção|54%|1.1|4/8|→|1 0 2 1 6 0 0 0|
|Fundamentos da Dissertação|48%|0.6|5/8|↓|1 3 1 1 0 1 0 0|
|Introdução, Argumentação e Coerência|43%|0.5|5/8|↓|1 1 1 1 0 1 0 0|
|Direitos Humanos e Redações Modelo|10%|0.1|1/8|→|1 0 0 0 0 0 0 0|

**Capítulos mais recorrentes de Português** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Variação Linguística (Domínio da Norma Culta)|93%|8/8|2 1 2 3 1 5 5 3|
|Gêneros não Verbais: Fundamentos de Leitura (Entendimento de Texto)|92%|7/8|0 3 3 4 3 2 5 6|
|Tecnologias Digitais da Informação e Comunicação (TDIC): Impactos Sociais (Entendimento de Texto)|87%|7/8|1 4 1 1 1 0 3 8|
|A Arte e suas Linguagens (Literatura Clássica, Medieval e Barroca)|85%|8/8|3 2 2 2 1 1 2 1|
|Fatores de Textualidade (Entendimento de Texto)|78%|5/8|0 0 1 0 1 3 1 5|
|Tipos de Texto: Explorando Elementos Concretos e Conceitos Abstratos (Domínio da Norma Culta)|76%|7/8|3 1 0 1 2 1 1 1|
|Língua: um Sistema Complexo (Domínio da Norma Culta)|72%|6/8|3 0 1 0 1 1 2 1|
|Função Poética e Linguagem Literária (Entendimento de Texto)|71%|6/8|2 1 3 1 0 0 2 2|
|Poesia Concreta (Literatura Contemporânea)|66%|5/8|0 1 1 0 0 1 3 1|
|Gêneros Textuais (Entendimento de Texto)|65%|5/8|0 2 2 2 0 0 2 1|
|A Estética Romântica: Poesia (Romantismo e Realismo)|65%|4/8|0 0 0 0 1 1 2 2|
|Modelos de Leitura e Distorções Interpretativas (Entendimento de Texto)|57%|5/8|1 1 0 2 0 1 2 0|

### História — 16.4 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Idade Moderna e Iluminismo|92%|2.5|8/8|↓|2 3 6 3 1 3 3 1|
|Primeira República e Era Vargas|89%|2.1|8/8|↓|4 3 1 3 1 2 3 1|
|Brasil Império|87%|2.3|7/8|↓|2 5 0 3 4 3 2 1|
|República Liberal e Brasil Contemporâneo|84%|1.9|7/8|↓|5 2 0 3 3 2 1 1|
|Idade Média|83%|1.7|7/8|→|2 1 0 4 3 2 1 1|
|Brasil Colônia|82%|2.1|7/8|↓|2 3 4 2 2 2 0 3|
|Idade Antiga|71%|1.4|6/8|↓|2 2 3 0 2 1 0 2|
|Imperialismo e Guerras Mundiais|46%|0.8|3/8|↓|3 2 0 0 0 0 0 2|
|Guerra Fria e Mundo Contemporâneo|43%|0.5|3/8|→|0 0 1 0 0 0 1 1|

**Capítulos mais recorrentes de História** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Brasil Império: Formação do Estado Nacional Brasileiro (Brasil Império)|80%|7/8|2 4 0 2 1 2 1 1|
|A História e o Brasil (Brasil Colônia)|73%|6/8|1 0 2 2 2 2 0 2|
|América Espanhola (Idade Moderna e Iluminismo)|63%|6/8|1 3 2 2 0 1 1 0|
|Brasil Império: Segundo Reinado (1840-1889) (Brasil Império)|60%|5/8|0 1 0 1 3 1 1 0|
|O Brasil Atual (República Liberal e Brasil Contemporâneo)|59%|5/8|2 2 0 0 1 0 1 1|
|Baixa Idade Média (Idade Média)|56%|4/8|0 0 0 1 2 0 1 1|
|Alta Idade Média e Feudalismo (Idade Média)|53%|5/8|2 1 0 3 1 1 0 0|
|A Era Vargas: o Estado Novo (Primeira República e Era Vargas)|52%|5/8|1 0 1 0 1 1 1 0|
|Antiguidade Clássica: o Mundo Romano (Idade Antiga)|51%|5/8|1 2 1 0 1 0 0 1|
|Introdução à História e Primeiras Civilizações (Idade Antiga)|48%|4/8|1 0 2 0 0 1 0 1|
|A República da Espada (Primeira República e Era Vargas)|47%|3/8|0 3 0 0 0 1 2 0|
|Regime Militar (1964-1985) I (República Liberal e Brasil Contemporâneo)|45%|4/8|1 0 0 1 1 2 0 0|

### Biologia — 16.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Ecologia|95%|4.1|8/8|↑|2 5 6 1 4 4 3 6|
|Fisiologia Animal e Humana|94%|3.5|8/8|↓|4 6 2 3 3 4 4 3|
|Estrutura e Fisiologia Celular|84%|1.5|8/8|↑|1 1 1 1 2 1 3 1|
|Zoologia|80%|1.4|7/8|↑|1 0 2 1 1 1 2 2|
|Metabolismo Energético|77%|1.2|7/8|→|1 1 0 2 1 1 1 2|
|Genética|72%|1.1|7/8|→|1 2 1 1 2 0 1 1|
|Evolução|55%|0.9|4/8|→|0 0 2 1 2 0 2 0|
|Biotecnologia|46%|0.5|3/8|↑|0 0 0 0 1 0 1 1|
|Microbiologia e Virologia|43%|0.5|4/8|→|0 1 1 1 0 0 0 1|
|Código Genético e Síntese Proteica|41%|0.6|3/8|→|1 0 0 1 0 3 0 0|
|Botânica|40%|0.5|4/8|↓|3 0 1 1 1 0 0 0|
|Fisiologia Vegetal|37%|0.5|3/8|→|0 1 0 1 0 2 0 0|

**Capítulos mais recorrentes de Biologia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Introdução à Ecologia (Ecologia)|86%|8/8|1 1 1 1 1 1 2 3|
|Coração e Vasos Sanguíneos (Fisiologia Animal e Humana)|60%|5/8|0 1 0 1 0 1 1 1|
|Introdução à Genética (Genética)|54%|5/8|1 1 0 1 0 0 1 1|
|Embriologia Animal (Fisiologia Animal e Humana)|52%|3/8|0 1 0 0 0 0 3 1|
|Espécies Invasoras e Controle Biológico (Ecologia)|50%|3/8|0 0 0 0 1 1 0 2|
|Sangue e Imunologia (Fisiologia Animal e Humana)|48%|5/8|0 1 1 1 1 1 0 0|
|Bioenergética: Fermentação e Respiração (Metabolismo Energético)|46%|5/8|1 1 0 1 1 1 0 0|
|Biotecnologia (Biotecnologia)|46%|3/8|0 0 0 0 1 0 1 1|
|Evolução Biológica: Construção Histórica (Evolução)|45%|4/8|0 0 1 1 1 0 1 0|
|Composição Química Celular: Compostos Inorgânicos (Estrutura e Fisiologia Celular)|42%|3/8|0 0 0 1 0 1 0 1|
|Poluição do Ar (Ecologia)|39%|3/8|0 0 1 0 1 0 0 1|
|Mecanismos da Evolução Biológica (Evolução)|37%|3/8|0 0 1 0 1 0 1 0|

### Geografia — 15.5 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Geografia da População e Urbana do Brasil|94%|3.4|8/8|↓|5 1 5 6 2 3 2 4|
|Globalização e Geografia Econômica|94%|3.4|8/8|↑|2 3 3 2 3 8 3 2|
|Climatologia e Problemas Socioambientais|92%|2.7|8/8|→|3 4 1 3 3 2 3 3|
|Geografia Física do Brasil|89%|2.0|8/8|↓|2 1 5 3 4 1 1 1|
|Geopolítica Regional Contemporânea|75%|1.4|6/8|→|2 1 0 0 4 2 1 1|
|Geografia Econômica do Brasil|73%|1.4|5/8|↑|0 0 2 1 0 1 2 3|
|Cartografia e Fundamentos|51%|0.7|5/8|↓|1 3 1 0 1 0 1 0|
|Hidrogeografia|39%|0.4|3/8|→|0 0 1 0 0 1 1 0|

**Capítulos mais recorrentes de Geografia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Dinâmica Demográfica (Geografia da População e Urbana do Brasil)|77%|7/8|3 1 1 2 0 1 1 2|
|O Espaço Urbano I (Geografia da População e Urbana do Brasil)|65%|5/8|0 0 1 1 0 1 1 2|
|Do Mundo Bipolar ao Multipolar (Globalização e Geografia Econômica)|61%|4/8|1 0 0 0 0 1 2 2|
|Produção Mineral (Geografia Econômica do Brasil)|61%|5/8|0 0 1 1 0 1 1 1|
|Água na Superfície Terrestre (Climatologia e Problemas Socioambientais)|60%|5/8|2 1 0 0 2 0 1 1|
|O Espaço Urbano II (Geografia da População e Urbana do Brasil)|52%|5/8|1 0 2 2 1 1 0 0|
|Indústria I (Globalização e Geografia Econômica)|50%|4/8|0 0 2 0 1 1 1 0|
|Terrorismo Internacional (Geopolítica Regional Contemporânea)|46%|3/8|0 0 0 0 1 0 1 1|
|Geomorfologia Mundial (Climatologia e Problemas Socioambientais)|42%|4/8|0 1 1 2 0 1 0 0|
|Relevo Brasileiro (Geografia Física do Brasil)|39%|3/8|0 0 1 0 1 0 0 1|
|Geologia e Geomorfologia (Geografia Física do Brasil)|34%|3/8|0 0 2 1 1 0 0 0|
|Desafios Ambientais do Século XXI (Climatologia e Problemas Socioambientais)|34%|3/8|0 1 0 0 1 1 0 0|

### Física — 14.3 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Circuitos Elétricos|92%|2.6|8/8|↑|2 1 2 5 3 1 2 4|
|Calorimetria|88%|1.9|8/8|→|2 2 4 1 2 1 3 1|
|Leis de Newton e Dinâmica do Movimento Retilíneo|78%|1.1|8/8|→|2 1 1 1 1 1 1 1|
|Ondulatória|68%|1.2|5/8|→|2 0 2 0 0 1 2 2|
|Cinemática Vetorial|68%|1.0|5/8|↑|0 0 0 2 1 2 1 1|
|Dinâmica Energética e Transformações de Energia|62%|0.8|6/8|→|1 0 1 2 1 1 1 0|
|Eletrostática e Campo Elétrico|57%|0.9|4/8|→|0 0 2 1 0 0 2 1|
|Eletromagnetismo|55%|0.7|5/8|→|1 2 0 0 1 1 0 1|
|Cinemática Escalar|55%|0.8|4/8|→|1 0 0 0 2 2 0 1|
|Gravitação e Movimento Circular|50%|0.9|4/8|↓|0 2 4 1 2 0 0 0|
|Fundamentos de Ondas e Oscilações|48%|0.5|4/8|→|0 1 0 1 0 1 0 1|
|Estática dos Corpos Sólidos e dos Fluidos|41%|0.5|3/8|→|1 0 0 0 0 0 1 1|
|Termodinâmica dos Gases|38%|0.4|3/8|→|0 1 0 0 0 1 1 0|
|Dinâmica Impulsiva|38%|0.4|4/8|↓|1 2 0 1 1 0 0 0|
|Física Moderna|30%|0.3|2/8|→|0 0 0 0 1 0 1 0|
|Óptica Geométrica|25%|0.2|2/8|→|1 0 0 0 0 0 1 0|

**Capítulos mais recorrentes de Física** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Temperatura, Calor e seus Mecanismos de Transferência (Calorimetria)|67%|5/8|0 0 1 1 1 0 3 1|
|Corrente Elétrica (Circuitos Elétricos)|63%|5/8|1 1 0 1 0 0 1 3|
|Composição de Movimentos (Cinemática Vetorial)|54%|4/8|0 0 0 2 1 1 0 1|
|Calor Sensível e Calor Latente (Calorimetria)|49%|5/8|1 2 2 0 1 1 0 0|
|Potência Elétrica (Circuitos Elétricos)|49%|4/8|1 0 0 1 0 0 1 1|
|Resultante de um Sistema de Forças (Leis de Newton e Dinâmica do Movimento Retilíneo)|40%|4/8|1 0 1 1 0 0 1 0|
|Leis da Gravitação (Gravitação e Movimento Circular)|39%|4/8|0 2 1 1 1 0 0 0|
|Potência, Máquina e Rendimento (Dinâmica Energética e Transformações de Energia)|39%|3/8|0 0 0 2 1 1 0 0|
|Campo Magnético devido à Corrente em Fio Reto e Espira: Descrição Vetorial e Aplicações (Eletromagnetismo)|38%|4/8|1 1 0 0 1 1 0 0|
|Interferência de Ondas: Análise Quantitativa, Aplicações e Batimento (Ondulatória)|32%|3/8|2 0 1 0 0 1 0 0|
|Equação Fundamental da Ondulatória (Fundamentos de Ondas e Oscilações)|32%|3/8|0 1 0 1 0 1 0 0|
|Impulso e Quantidade de Movimento (Dinâmica Impulsiva)|30%|3/8|1 2 0 0 1 0 0 0|

### Química — 13.1 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Análises Quantitativas e Estequiometria|88%|1.9|8/8|↑|1 2 2 1 1 2 2 3|
|Química Inorgânica|80%|1.3|7/8|→|0 2 2 2 2 1 1 1|
|Fundamentos e Nomenclatura Orgânica|70%|1.5|6/8|↓|5 2 1 1 0 3 2 0|
|Equilíbrio Químico|66%|0.8|6/8|→|1 0 1 0 1 1 1 1|
|Soluções|64%|1.0|4/8|↑|0 0 0 0 1 2 1 2|
|Reações e Aplicações Orgânicas|60%|1.3|4/8|→|0 3 1 3 0 0 0 3|
|Cinética Química|59%|0.9|5/8|→|0 1 2 3 1 0 0 1|
|Oxirredução|58%|0.9|5/8|→|1 1 0 0 2 1 2 0|
|Eletroquímica|54%|0.7|4/8|→|3 0 0 0 1 0 1 1|
|Modelos Atômicos e Estrutura do Átomo|50%|0.7|5/8|↓|1 2 1 2 0 0 1 0|
|Polaridade das Ligações e Geometria Molecular|48%|0.7|3/8|↑|0 0 0 1 0 1 0 2|
|Gases|45%|0.7|3/8|→|0 0 0 1 1 3 0 0|
|Radioatividade|33%|0.3|2/8|→|0 0 0 0 1 0 0 1|
|Termoquímica|29%|0.4|3/8|↓|3 1 1 0 0 0 0 0|

**Capítulos mais recorrentes de Química** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Separação de Misturas (Análises Quantitativas e Estequiometria)|63%|6/8|1 0 1 1 1 0 1 1|
|Dispersões (Soluções)|61%|4/8|0 0 0 0 1 1 1 2|
|Cinética Química (Cinética Química)|59%|5/8|0 1 2 3 1 0 0 1|
|Massa Atômica, Mol e Massa Molar (Análises Quantitativas e Estequiometria)|56%|3/8|0 0 0 0 0 2 1 2|
|Processos de Oxirredução (Oxirredução)|54%|5/8|1 1 0 0 2 1 1 0|
|Equações Iônicas e outras Teorias para Ácidos e Bases (Química Inorgânica)|54%|5/8|0 1 2 1 2 1 0 0|
|Química Inorgânica (Química Inorgânica)|50%|4/8|0 1 0 1 0 0 1 1|
|Nomenclatura de Compostos Orgânicos (Fundamentos e Nomenclatura Orgânica)|47%|4/8|3 0 1 0 0 1 1 0|
|Introdução ao Estudo das Pilhas e Baterias (Eletroquímica)|43%|3/8|2 0 0 0 0 0 1 1|
|Ligações Químicas e Alotropia (Polaridade das Ligações e Geometria Molecular)|42%|3/8|0 0 0 1 0 1 0 1|
|Introdução à Química Orgânica (Fundamentos e Nomenclatura Orgânica)|42%|4/8|1 1 0 0 0 1 1 0|
|Deslocamento de Equilíbrio (Equilíbrio Químico)|41%|3/8|1 0 0 0 0 0 1 1|

### Filosofia — 6.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Nietzsche, Existencialismo e Filosofia Contemporânea|86%|1.7|8/8|↑|1 1 1 2 1 1 3 2|
|Ética e Política Contemporâneas|71%|1.8|4/8|↑|0 1 0 0 1 0 3 5|
|Aristóteles|66%|0.8|6/8|→|0 1 1 1 0 1 1 1|
|Filosofia Moderna: Racionalismo e Empirismo|51%|0.6|4/8|→|0 2 1 0 0 0 1 1|
|Sócrates e Platão|49%|0.6|3/8|↑|0 0 0 0 2 0 1 1|
|Contratualismo Político e Iluminismo|40%|0.4|4/8|→|1 0 1 1 0 0 1 0|
|Kant e o Idealismo Alemão|26%|0.3|2/8|→|0 1 0 0 0 0 1 0|
|Origens da Filosofia e os Pré-Socráticos|23%|0.2|1/8|→|0 0 0 0 0 0 0 1|
|Filosofia Medieval|19%|0.2|2/8|↓|2 1 0 0 0 0 0 0|
|Marx e a Crítica à Sociedade Capitalista|14%|0.1|1/8|→|0 0 0 1 0 0 0 0|

**Capítulos mais recorrentes de Filosofia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Nietzsche e a Crítica aos Valores Morais (Nietzsche, Existencialismo e Filosofia Contemporânea)|58%|4/8|0 0 1 2 0 0 2 1|
|Justiça e Direitos Humanos (Ética e Política Contemporâneas)|56%|3/8|0 1 0 0 0 0 2 3|
|A Crítica de Hume à Causalidade (Filosofia Moderna: Racionalismo e Empirismo)|36%|3/8|0 1 1 0 0 0 0 1|
|Hobbes e o Estado de Natureza (Contratualismo Político e Iluminismo)|26%|3/8|1 0 1 1 0 0 0 0|

### Sociologia — 5.5 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Cultura, Identidade e Diversidade|81%|1.8|6/8|↑|0 0 1 1 2 1 3 3|
|Estratificação Social e Desigualdade|58%|0.9|5/8|→|0 1 1 1 3 0 0 1|
|Movimentos Sociais e Cidadania|56%|1.0|4/8|↑|1 0 1 0 0 2 3 0|
|Globalização e Sociedade Contemporânea|56%|0.9|3/8|↑|0 0 0 0 1 0 2 2|
|Trabalho e Sociedade|48%|0.7|3/8|↑|0 0 0 1 0 3 1 0|
|Karl Marx e a Sociologia|38%|0.5|3/8|→|0 0 1 1 0 2 0 0|
|Max Weber e a Ação Social|27%|0.3|3/8|→|0 1 1 1 0 0 0 0|
|A Formação da Sociologia como Ciência|18%|0.2|2/8|→|1 0 1 0 0 0 0 0|

**Capítulos mais recorrentes de Sociologia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Cultura e Etnocentrismo (Cultura, Identidade e Diversidade)|76%|6/8|0 0 1 1 1 1 2 2|
|Movimentos Sociais Clássicos e Contemporâneos (Movimentos Sociais e Cidadania)|43%|3/8|1 0 1 0 0 0 3 0|
|Classes Sociais e Mobilidade Social (Estratificação Social e Desigualdade)|35%|3/8|0 1 0 1 2 0 0 0|

### Inglês — 5.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Compreensão de Texto em Inglês|95%|5.0|8/8|→|5 5 5 5 5 5 5 5|

**Capítulos mais recorrentes de Inglês** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Text Comprehension: Taxonomy and Terminology (Compreensão de Texto em Inglês)|95%|8/8|5 5 5 5 5 5 5 5|

