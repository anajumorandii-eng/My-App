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
|Assunto|0.167|0.201|29/30|1|
|Capítulo|0.201|0.206|22/30|15|

Calibração por faixa (assunto): 80–100%: 30/31 · 60–80%: 17/25 · 40–60%: 16/23 · 20–40%: 6/16 · 0–20%: 1/2.

Calibração por faixa (capítulo): 80–100%: 14/17 · 60–80%: 14/29 · 40–60%: 27/74 · 20–40%: 23/132 · 0–20%: 33/135.

Brier menor que a referência significa que o histórico separa de fato o que cai do que não cai. Capítulo é mais incerto que assunto: o currículo tem muitos capítulos e cada prova escolhe poucos.

## Top 40 assuntos de todo o exame

|#|Matéria|Assunto|P(cair)|Questões esperadas|Edições|Tendência|2018→2025|
|---|---|---|---|---|---|---|---|
|1|Português|Entendimento de Texto|96%|21.6|8/8|↑|15 21 25 21 20 19 22 25|
|2|Matemática|Aritmética e Proporcionalidade|96%|8.6|8/8|↑|2 8 6 5 10 8 10 12|
|3|Português|Domínio da Norma Culta|96%|7.1|8/8|→|10 4 6 7 6 8 8 7|
|4|Matemática|Probabilidade e Interpretação de Dados|95%|6.0|8/8|↑|7 6 4 2 6 7 6 8|
|5|Matemática|Geometria Espacial|95%|5.3|8/8|↑|2 3 10 5 8 5 4 5|
|6|Matemática|Geometria Plana|95%|5.1|8/8|↓|8 5 7 4 4 5 6 4|
|7|Matemática|Funções|95%|5.1|8/8|↓|5 6 3 8 7 8 5 1|
|8|Inglês|Compreensão de Texto em Inglês|95%|5.0|8/8|→|5 5 5 5 5 5 5 5|
|9|Português|Literatura Contemporânea|95%|4.1|8/8|↑|2 4 3 5 4 8 3 3|
|10|Biologia|Ecologia|95%|3.9|8/8|↑|2 5 6 1 3 4 3 6|
|11|Geografia|Geografia da População e Urbana do Brasil|94%|3.7|8/8|→|5 1 5 6 3 4 2 4|
|12|Biologia|Fisiologia Animal e Humana|94%|3.6|8/8|↓|4 6 2 4 3 4 4 3|
|13|Geografia|Globalização e Geografia Econômica|94%|3.5|8/8|↑|2 3 3 2 5 7 3 2|
|14|Português|Simbolismo, Pré-Modernismo e Modernismo|94%|3.3|8/8|↓|2 7 4 2 4 5 2 2|
|15|Matemática|Sequências, Matrizes e Sistemas Lineares|94%|3.2|8/8|↓|5 4 3 5 5 4 2 1|
|16|Física|Circuitos Elétricos|93%|3.0|8/8|→|3 1 3 6 4 1 2 4|
|17|História|Idade Moderna e Iluminismo|93%|2.9|8/8|↓|3 3 6 3 2 4 3 1|
|18|Geografia|Climatologia e Problemas Socioambientais|92%|2.7|8/8|→|3 4 1 3 3 2 3 3|
|19|História|Primeira República e Era Vargas|91%|2.3|8/8|↓|4 3 1 3 2 3 3 1|
|20|Matemática|Análise Combinatória|91%|2.3|8/8|→|1 3 3 4 2 2 2 2|
|21|História|Brasil Império|91%|2.3|8/8|↓|2 5 1 3 4 2 2 1|
|22|Matemática|Teoria dos Números Inteiros|90%|2.3|8/8|↓|3 2 2 4 3 1 2 2|
|23|Química|Análises Quantitativas e Estequiometria|90%|2.2|8/8|↑|1 2 2 1 2 3 2 3|
|24|Geografia|Geografia Física do Brasil|89%|2.0|8/8|↓|2 1 5 3 4 1 1 1|
|25|Física|Calorimetria|88%|1.9|8/8|→|2 2 4 1 1 2 3 1|
|26|Filosofia|Nietzsche, Existencialismo e Filosofia Contemporânea|86%|1.7|8/8|↑|1 1 1 2 1 1 3 2|
|27|História|Brasil Colônia|84%|2.5|7/8|↓|2 4 5 3 2 3 0 3|
|28|História|República Liberal e Brasil Contemporâneo|84%|1.9|7/8|↓|5 2 0 3 3 2 1 1|
|29|Matemática|Equações, Desigualdades e Modelagem Algébrica|83%|3.7|6/8|→|4 4 5 3 0 0 6 6|
|30|Português|Literatura Clássica, Medieval e Barroca|82%|1.9|7/8|↓|7 3 2 2 2 0 2 1|
|31|Sociologia|Cultura, Identidade e Diversidade|81%|1.8|6/8|↑|0 0 1 1 2 1 3 3|
|32|Biologia|Zoologia|80%|1.4|7/8|↑|1 0 2 1 1 1 2 2|
|33|Química|Química Inorgânica|80%|1.3|7/8|→|0 2 2 2 2 1 1 1|
|34|Português|Romantismo e Realismo|80%|2.1|6/8|→|4 1 0 3 4 0 3 2|
|35|Filosofia|Ética e Política Contemporâneas|79%|2.1|5/8|↑|0 1 0 0 1 2 3 5|
|36|Física|Leis de Newton e Dinâmica do Movimento Retilíneo|78%|1.1|8/8|→|2 1 1 1 1 1 1 1|
|37|História|Idade Média|78%|1.3|7/8|→|2 1 0 4 1 1 1 1|
|38|Biologia|Metabolismo Energético|77%|1.2|7/8|→|1 1 0 2 1 1 1 2|
|39|Biologia|Estrutura e Fisiologia Celular|76%|1.3|7/8|→|1 1 1 1 2 0 3 1|
|40|Matemática|Logaritmos e Exponenciais|75%|1.4|6/8|→|0 3 1 2 0 2 2 1|

## Por matéria: assuntos e capítulos

### Matemática — 45.1 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Aritmética e Proporcionalidade|96%|8.6|8/8|↑|2 8 6 5 10 8 10 12|
|Probabilidade e Interpretação de Dados|95%|6.0|8/8|↑|7 6 4 2 6 7 6 8|
|Geometria Espacial|95%|5.3|8/8|↑|2 3 10 5 8 5 4 5|
|Geometria Plana|95%|5.1|8/8|↓|8 5 7 4 4 5 6 4|
|Funções|95%|5.1|8/8|↓|5 6 3 8 7 8 5 1|
|Sequências, Matrizes e Sistemas Lineares|94%|3.2|8/8|↓|5 4 3 5 5 4 2 1|
|Análise Combinatória|91%|2.3|8/8|→|1 3 3 4 2 2 2 2|
|Teoria dos Números Inteiros|90%|2.3|8/8|↓|3 2 2 4 3 1 2 2|
|Equações, Desigualdades e Modelagem Algébrica|83%|3.7|6/8|→|4 4 5 3 0 0 6 6|
|Logaritmos e Exponenciais|75%|1.4|6/8|→|0 3 1 2 0 2 2 1|
|Trigonometria|71%|1.4|5/8|→|4 0 0 2 0 2 1 2|
|Geometria Analítica|41%|0.6|3/8|↓|4 0 1 0 0 0 0 1|
|Números Complexos e Polinômios|32%|0.3|3/8|→|0 1 0 1 0 1 0 0|

**Capítulos mais recorrentes de Matemática** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Razão e Proporção (Aritmética e Proporcionalidade)|95%|8/8|1 2 4 3 3 4 5 10|
|Introdução às Probabilidades (Probabilidade e Interpretação de Dados)|95%|8/8|3 2 4 2 3 2 4 8|
|Porcentagem (Aritmética e Proporcionalidade)|91%|7/8|0 5 1 2 6 3 4 2|
|O Sistema de Numeração Decimal (Teoria dos Números Inteiros)|89%|8/8|2 1 2 4 2 1 2 2|
|O Universo Tridimensional (Geometria Espacial)|86%|7/8|1 1 5 4 4 0 2 4|
|Introdução às Funções (Funções)|84%|8/8|2 2 1 1 1 2 2 1|
|Introdução às Técnicas de Contagem (Análise Combinatória)|84%|8/8|1 1 1 2 1 2 2 1|
|Sólidos de Revolução (Geometria Espacial)|78%|7/8|1 1 1 0 2 3 1 1|
|Função Constante e Função Afim (Funções)|71%|5/8|1 0 0 4 2 4 2 0|
|Técnicas Algébricas (Equações, Desigualdades e Modelagem Algébrica)|69%|4/8|2 0 2 0 0 0 5 3|
|Estatística Descritiva (Probabilidade e Interpretação de Dados)|67%|5/8|1 3 0 0 3 4 1 0|
|Área do Círculo e de suas Partes (Geometria Plana)|63%|5/8|1 3 0 2 0 1 3 0|

### Português — 40.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Entendimento de Texto|96%|21.6|8/8|↑|15 21 25 21 20 19 22 25|
|Domínio da Norma Culta|96%|7.1|8/8|→|10 4 6 7 6 8 8 7|
|Literatura Contemporânea|95%|4.1|8/8|↑|2 4 3 5 4 8 3 3|
|Simbolismo, Pré-Modernismo e Modernismo|94%|3.3|8/8|↓|2 7 4 2 4 5 2 2|
|Literatura Clássica, Medieval e Barroca|82%|1.9|7/8|↓|7 3 2 2 2 0 2 1|
|Romantismo e Realismo|80%|2.1|6/8|→|4 1 0 3 4 0 3 2|

**Capítulos mais recorrentes de Português** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Tecnologias Digitais da Informação e Comunicação (TDIC): Impactos Sociais (Entendimento de Texto)|94%|8/8|2 5 2 2 1 2 3 8|
|Variação Linguística (Domínio da Norma Culta)|94%|8/8|2 1 3 4 2 5 5 3|
|Gêneros não Verbais: Fundamentos de Leitura (Entendimento de Texto)|92%|7/8|0 3 3 5 4 2 5 6|
|Gêneros Textuais (Entendimento de Texto)|87%|7/8|0 3 3 3 3 2 2 1|
|Modelos de Leitura e Distorções Interpretativas (Entendimento de Texto)|84%|7/8|3 3 6 4 4 4 2 0|
|A Arte e suas Linguagens (Literatura Clássica, Medieval e Barroca)|79%|7/8|3 2 2 2 2 0 2 1|
|Fatores de Textualidade (Entendimento de Texto)|78%|6/8|1 2 1 0 0 2 1 5|
|Função Poética e Linguagem Literária (Entendimento de Texto)|73%|6/8|2 1 5 1 0 0 2 2|
|Poesia Concreta (Literatura Contemporânea)|73%|6/8|0 1 1 0 1 1 3 1|
|Língua: um Sistema Complexo (Domínio da Norma Culta)|71%|6/8|3 1 1 0 0 2 2 1|
|Funções da Linguagem (Entendimento de Texto)|71%|7/8|5 1 1 1 2 1 1 0|
|Intertextualidade e Interdiscursividade (Entendimento de Texto)|68%|6/8|2 2 1 2 5 0 1 0|

### História — 17.4 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Idade Moderna e Iluminismo|93%|2.9|8/8|↓|3 3 6 3 2 4 3 1|
|Primeira República e Era Vargas|91%|2.3|8/8|↓|4 3 1 3 2 3 3 1|
|Brasil Império|91%|2.3|8/8|↓|2 5 1 3 4 2 2 1|
|Brasil Colônia|84%|2.5|7/8|↓|2 4 5 3 2 3 0 3|
|República Liberal e Brasil Contemporâneo|84%|1.9|7/8|↓|5 2 0 3 3 2 1 1|
|Idade Média|78%|1.3|7/8|→|2 1 0 4 1 1 1 1|
|Idade Antiga|72%|1.4|6/8|↓|2 3 3 0 2 1 0 2|
|Imperialismo e Guerras Mundiais|55%|0.9|4/8|↓|3 2 0 0 0 1 0 2|
|Guerra Fria e Mundo Contemporâneo|43%|0.5|3/8|→|0 0 1 0 0 0 1 1|

**Capítulos mais recorrentes de História** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Brasil Império: Formação do Estado Nacional Brasileiro (Brasil Império)|82%|7/8|2 4 0 2 2 2 1 1|
|A História e o Brasil (Brasil Colônia)|75%|6/8|1 0 3 3 2 2 0 2|
|América Espanhola (Idade Moderna e Iluminismo)|64%|6/8|2 3 2 2 0 1 1 0|
|O Brasil Atual (República Liberal e Brasil Contemporâneo)|59%|5/8|2 2 0 0 1 0 1 1|
|Introdução à História e Primeiras Civilizações (Idade Antiga)|53%|5/8|1 1 2 0 0 1 0 1|
|Baixa Idade Média (Idade Média)|53%|4/8|0 0 0 1 1 0 1 1|
|A Era Vargas: o Estado Novo (Primeira República e Era Vargas)|52%|5/8|1 0 1 0 1 1 1 0|
|Antiguidade Clássica: o Mundo Romano (Idade Antiga)|51%|5/8|1 2 1 0 1 0 0 1|
|Brasil Império: Segundo Reinado (1840-1889) (Brasil Império)|50%|5/8|0 1 1 1 1 0 1 0|
|Regime Militar (1964-1985) I (República Liberal e Brasil Contemporâneo)|45%|4/8|1 0 0 1 1 2 0 0|
|Primeira Guerra Mundial (1914-1918) (Imperialismo e Guerras Mundiais)|45%|4/8|1 1 0 0 0 1 0 1|
|Revolução Francesa (Idade Moderna e Iluminismo)|43%|4/8|1 0 1 0 0 1 1 0|

### Biologia — 16.4 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Ecologia|95%|3.9|8/8|↑|2 5 6 1 3 4 3 6|
|Fisiologia Animal e Humana|94%|3.6|8/8|↓|4 6 2 4 3 4 4 3|
|Zoologia|80%|1.4|7/8|↑|1 0 2 1 1 1 2 2|
|Metabolismo Energético|77%|1.2|7/8|→|1 1 0 2 1 1 1 2|
|Estrutura e Fisiologia Celular|76%|1.3|7/8|→|1 1 1 1 2 0 3 1|
|Genética|70%|0.9|7/8|→|1 2 1 1 1 0 1 1|
|Botânica|58%|1.0|5/8|↓|3 0 2 2 2 1 0 0|
|Evolução|55%|0.9|4/8|→|0 0 2 1 2 0 2 0|
|Biotecnologia|49%|0.6|3/8|↑|0 0 0 0 2 0 1 1|
|Microbiologia e Virologia|43%|0.5|4/8|→|0 1 1 1 0 0 0 1|
|Código Genético e Síntese Proteica|41%|0.6|3/8|→|1 0 0 1 0 3 0 0|
|Fisiologia Vegetal|37%|0.5|3/8|→|0 1 0 1 0 2 0 0|

**Capítulos mais recorrentes de Biologia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Introdução à Ecologia (Ecologia)|86%|8/8|1 1 1 1 1 1 2 3|
|Coração e Vasos Sanguíneos (Fisiologia Animal e Humana)|60%|5/8|0 1 0 1 0 1 1 1|
|Introdução à Genética (Genética)|54%|5/8|1 1 0 1 0 0 1 1|
|Embriologia Animal (Fisiologia Animal e Humana)|52%|3/8|0 1 0 0 0 0 3 1|
|Sangue e Imunologia (Fisiologia Animal e Humana)|51%|5/8|0 1 1 2 1 1 0 0|
|Espécies Invasoras e Controle Biológico (Ecologia)|50%|3/8|0 0 0 0 1 1 0 2|
|Biotecnologia (Biotecnologia)|49%|3/8|0 0 0 0 2 0 1 1|
|Bioenergética: Fermentação e Respiração (Metabolismo Energético)|46%|5/8|1 1 0 1 1 1 0 0|
|Mecanismos da Evolução Biológica (Evolução)|41%|3/8|0 0 1 0 2 0 1 0|
|Evolução Biológica: Construção Histórica (Evolução)|35%|3/8|0 0 1 1 0 0 1 0|
|Artrópodes: Insetos, Crustáceos e Miriápodes (Zoologia)|35%|3/8|1 0 0 0 1 0 1 0|
|Ciclo do Nitrogênio (Ecologia)|35%|3/8|0 0 1 0 1 1 0 0|

### Geografia — 15.6 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Geografia da População e Urbana do Brasil|94%|3.7|8/8|→|5 1 5 6 3 4 2 4|
|Globalização e Geografia Econômica|94%|3.5|8/8|↑|2 3 3 2 5 7 3 2|
|Climatologia e Problemas Socioambientais|92%|2.7|8/8|→|3 4 1 3 3 2 3 3|
|Geografia Física do Brasil|89%|2.0|8/8|↓|2 1 5 3 4 1 1 1|
|Geografia Econômica do Brasil|73%|1.4|5/8|↑|0 0 2 1 0 1 2 3|
|Geopolítica Regional Contemporânea|69%|1.0|6/8|→|2 1 0 0 2 1 1 1|
|Cartografia e Fundamentos|58%|0.8|6/8|↓|1 3 1 1 1 0 1 0|
|Hidrogeografia|39%|0.4|3/8|→|0 0 1 0 0 1 1 0|

**Capítulos mais recorrentes de Geografia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Dinâmica Demográfica (Geografia da População e Urbana do Brasil)|77%|7/8|3 1 1 2 0 1 1 2|
|O Espaço Urbano I (Geografia da População e Urbana do Brasil)|75%|6/8|0 0 1 1 1 2 1 2|
|Do Mundo Bipolar ao Multipolar (Globalização e Geografia Econômica)|61%|4/8|1 0 0 0 0 1 2 2|
|Produção Mineral (Geografia Econômica do Brasil)|61%|5/8|0 0 1 1 0 1 1 1|
|Água na Superfície Terrestre (Climatologia e Problemas Socioambientais)|60%|5/8|2 1 0 0 2 0 1 1|
|O Espaço Urbano II (Geografia da População e Urbana do Brasil)|52%|5/8|1 0 2 2 1 1 0 0|
|Indústria I (Globalização e Geografia Econômica)|50%|4/8|0 0 2 0 1 1 1 0|
|Geomorfologia Mundial (Climatologia e Problemas Socioambientais)|42%|4/8|0 1 1 2 0 1 0 0|
|Globalização e Processos Econômicos Atuais (Globalização e Geografia Econômica)|40%|3/8|0 0 1 0 1 2 0 0|
|Relevo Brasileiro (Geografia Física do Brasil)|39%|3/8|0 0 1 0 1 0 0 1|
|Geologia e Geomorfologia (Geografia Física do Brasil)|38%|3/8|0 0 2 1 2 0 0 0|
|Desafios Ambientais do Século XXI (Climatologia e Problemas Socioambientais)|34%|3/8|0 1 0 0 1 1 0 0|

### Física — 15.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Circuitos Elétricos|93%|3.0|8/8|→|3 1 3 6 4 1 2 4|
|Calorimetria|88%|1.9|8/8|→|2 2 4 1 1 2 3 1|
|Leis de Newton e Dinâmica do Movimento Retilíneo|78%|1.1|8/8|→|2 1 1 1 1 1 1 1|
|Ondulatória|72%|1.5|5/8|↑|2 0 2 0 0 3 2 2|
|Fundamentos de Ondas e Oscilações|60%|0.8|5/8|→|0 1 0 1 1 2 0 1|
|Dinâmica Energética e Transformações de Energia|58%|0.8|6/8|↓|2 1 1 2 1 0 1 0|
|Eletrostática e Campo Elétrico|57%|0.9|4/8|→|0 0 2 1 0 0 2 1|
|Cinemática Vetorial|56%|0.7|4/8|↑|0 0 0 2 1 0 1 1|
|Eletromagnetismo|55%|0.7|5/8|→|1 2 0 0 1 1 0 1|
|Gravitação e Movimento Circular|52%|1.0|4/8|↓|0 2 4 1 3 0 0 0|
|Estática dos Corpos Sólidos e dos Fluidos|52%|0.6|4/8|→|1 0 0 0 0 1 1 1|
|Cinemática Escalar|44%|0.6|3/8|→|1 0 0 0 0 2 0 1|
|Física Moderna|41%|0.5|3/8|→|0 0 0 0 1 1 1 0|
|Dinâmica Impulsiva|30%|0.3|3/8|↓|1 2 0 0 1 0 0 0|
|Termodinâmica dos Gases|26%|0.3|2/8|→|0 1 0 0 0 0 1 0|
|Óptica Geométrica|25%|0.2|2/8|→|1 0 0 0 0 0 1 0|

**Capítulos mais recorrentes de Física** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Temperatura, Calor e seus Mecanismos de Transferência (Calorimetria)|68%|5/8|0 0 1 1 0 1 3 1|
|Corrente Elétrica (Circuitos Elétricos)|63%|5/8|1 1 0 1 0 0 1 3|
|Potência Elétrica (Circuitos Elétricos)|58%|5/8|1 0 0 1 1 0 1 1|
|Calor Sensível e Calor Latente (Calorimetria)|49%|5/8|1 2 2 0 1 1 0 0|
|Ondulatória: Ondas Eletromagnéticas (Ondulatória)|48%|3/8|0 0 0 0 0 1 1 1|
|Composição de Movimentos (Cinemática Vetorial)|44%|3/8|0 0 0 2 1 0 0 1|
|Conceitos Básicos (Fundamentos de Ondas e Oscilações)|44%|3/8|0 0 0 0 1 1 0 1|
|Noções Básicas de Física Quântica (Física Moderna)|41%|3/8|0 0 0 0 1 1 1 0|
|Resistores (Circuitos Elétricos)|41%|4/8|1 0 0 1 1 1 0 0|
|Resultante de um Sistema de Forças (Leis de Newton e Dinâmica do Movimento Retilíneo)|40%|4/8|1 0 1 1 0 0 1 0|
|Leis da Gravitação (Gravitação e Movimento Circular)|39%|4/8|0 2 1 1 1 0 0 0|
|Campo Magnético devido à Corrente em Fio Reto e Espira: Descrição Vetorial e Aplicações (Eletromagnetismo)|38%|4/8|1 1 0 0 1 1 0 0|

### Química — 13.6 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Análises Quantitativas e Estequiometria|90%|2.2|8/8|↑|1 2 2 1 2 3 2 3|
|Química Inorgânica|80%|1.3|7/8|→|0 2 2 2 2 1 1 1|
|Fundamentos e Nomenclatura Orgânica|72%|1.7|6/8|↓|6 2 1 1 0 4 2 0|
|Equilíbrio Químico|69%|0.9|6/8|→|1 0 1 0 2 1 1 1|
|Cinética Química|62%|1.0|5/8|→|0 1 2 3 2 0 0 1|
|Soluções|61%|0.9|4/8|↑|0 0 0 0 1 1 1 2|
|Reações e Aplicações Orgânicas|60%|1.3|4/8|→|0 3 1 3 0 0 0 3|
|Oxirredução|58%|0.9|5/8|→|1 1 0 0 2 1 2 0|
|Modelos Atômicos e Estrutura do Átomo|52%|0.8|5/8|↓|1 3 1 2 0 0 1 0|
|Eletroquímica|52%|0.6|4/8|→|2 0 0 0 1 0 1 1|
|Polaridade das Ligações e Geometria Molecular|48%|0.7|3/8|↑|0 0 0 1 0 1 0 2|
|Radioatividade|44%|0.5|3/8|↑|0 0 0 0 1 1 0 1|
|Gases|32%|0.4|2/8|→|0 0 0 1 0 2 0 0|
|Termoquímica|29%|0.4|3/8|↓|3 1 1 0 0 0 0 0|

**Capítulos mais recorrentes de Química** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Separação de Misturas (Análises Quantitativas e Estequiometria)|66%|6/8|1 0 1 1 2 0 1 1|
|Cinética Química (Cinética Química)|62%|5/8|0 1 2 3 2 0 0 1|
|Massa Atômica, Mol e Massa Molar (Análises Quantitativas e Estequiometria)|56%|3/8|0 0 0 0 0 2 1 2|
|Processos de Oxirredução (Oxirredução)|54%|5/8|1 1 0 0 2 1 1 0|
|Equações Iônicas e outras Teorias para Ácidos e Bases (Química Inorgânica)|54%|5/8|0 1 2 1 2 1 0 0|
|Deslocamento de Equilíbrio (Equilíbrio Químico)|52%|4/8|1 0 0 0 0 1 1 1|
|Dispersões (Soluções)|52%|3/8|0 0 0 0 1 0 1 2|
|Química Inorgânica (Química Inorgânica)|50%|4/8|0 1 0 1 0 0 1 1|
|Radioatividade: o Estudo das Radiações (Radioatividade)|44%|3/8|0 0 0 0 1 1 0 1|
|Introdução ao Estudo das Pilhas e Baterias (Eletroquímica)|43%|3/8|2 0 0 0 0 0 1 1|
|Evolução dos Modelos Atômicos (Modelos Atômicos e Estrutura do Átomo)|43%|4/8|0 2 1 1 0 0 1 0|
|Introdução à Química Orgânica (Fundamentos e Nomenclatura Orgânica)|42%|4/8|1 1 0 0 0 1 1 0|

### Filosofia — 6.4 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Nietzsche, Existencialismo e Filosofia Contemporânea|86%|1.7|8/8|↑|1 1 1 2 1 1 3 2|
|Ética e Política Contemporâneas|79%|2.1|5/8|↑|0 1 0 0 1 2 3 5|
|Filosofia Moderna: Racionalismo e Empirismo|61%|0.8|5/8|→|0 2 1 0 0 1 1 1|
|Aristóteles|60%|0.7|6/8|→|1 1 1 1 0 0 1 1|
|Sócrates e Platão|49%|0.6|3/8|↑|0 0 0 0 2 0 1 1|
|Contratualismo Político e Iluminismo|40%|0.4|4/8|→|1 0 1 1 0 0 1 0|
|Kant e o Idealismo Alemão|26%|0.3|2/8|→|0 1 0 0 0 0 1 0|
|Origens da Filosofia e os Pré-Socráticos|23%|0.2|1/8|→|0 0 0 0 0 0 0 1|
|Filosofia Medieval|19%|0.2|2/8|↓|2 1 0 0 0 0 0 0|
|Marx e a Crítica à Sociedade Capitalista|14%|0.1|1/8|→|0 0 0 1 0 0 0 0|

**Capítulos mais recorrentes de Filosofia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Justiça e Direitos Humanos (Ética e Política Contemporâneas)|67%|4/8|0 1 0 0 0 2 2 3|
|Nietzsche e a Crítica aos Valores Morais (Nietzsche, Existencialismo e Filosofia Contemporânea)|58%|4/8|0 0 1 2 0 0 2 1|
|Descartes e o Método: a Dúvida Hiperbólica (Filosofia Moderna: Racionalismo e Empirismo)|38%|3/8|0 1 0 0 0 1 1 0|
|A Crítica de Hume à Causalidade (Filosofia Moderna: Racionalismo e Empirismo)|36%|3/8|0 1 1 0 0 0 0 1|
|A Ética a Nicômaco e a Doutrina do Meio-Termo (Aristóteles)|33%|3/8|1 0 0 1 0 0 1 0|
|Hobbes e o Estado de Natureza (Contratualismo Político e Iluminismo)|26%|3/8|1 0 1 1 0 0 0 0|

### Sociologia — 5.5 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Cultura, Identidade e Diversidade|81%|1.8|6/8|↑|0 0 1 1 2 1 3 3|
|Globalização e Sociedade Contemporânea|65%|1.1|4/8|↑|0 0 0 0 1 1 2 2|
|Estratificação Social e Desigualdade|61%|1.0|5/8|→|0 1 1 1 4 0 0 1|
|Movimentos Sociais e Cidadania|56%|1.0|4/8|↑|1 0 1 0 0 2 3 0|
|Trabalho e Sociedade|44%|0.6|3/8|→|0 0 0 1 0 2 1 0|
|Karl Marx e a Sociologia|33%|0.3|3/8|→|0 0 1 1 0 1 0 0|
|Max Weber e a Ação Social|27%|0.3|3/8|→|0 1 1 1 0 0 0 0|
|A Formação da Sociologia como Ciência|18%|0.2|2/8|→|1 0 1 0 0 0 0 0|

**Capítulos mais recorrentes de Sociologia** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Cultura e Etnocentrismo (Cultura, Identidade e Diversidade)|76%|6/8|0 0 1 1 1 1 2 2|
|Globalização Econômica e Cultural (Globalização e Sociedade Contemporânea)|52%|3/8|0 0 0 0 0 1 2 1|
|Movimentos Sociais Clássicos e Contemporâneos (Movimentos Sociais e Cidadania)|43%|3/8|1 0 1 0 0 0 3 0|
|Desigualdade de Gênero (Estratificação Social e Desigualdade)|39%|3/8|0 0 1 0 1 0 0 1|
|Classes Sociais e Mobilidade Social (Estratificação Social e Desigualdade)|35%|3/8|0 1 0 1 2 0 0 0|

### Inglês — 5.0 questões por edição

|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|
|---|---|---|---|---|---|
|Compreensão de Texto em Inglês|95%|5.0|8/8|→|5 5 5 5 5 5 5 5|

**Capítulos mais recorrentes de Inglês** (3+ edições):

|Capítulo|P(cair)|Edições|2018→2025|
|---|---|---|---|
|Text Comprehension: Taxonomy and Terminology (Compreensão de Texto em Inglês)|95%|8/8|5 5 5 5 5 5 5 5|

