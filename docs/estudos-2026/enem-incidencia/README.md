# ENEM 2026 — prioridades por probabilidade histórica

Provas em **8/11** (Linguagens, Humanas e Redação) e **15/11** (Natureza e Matemática).
Tabelas completas: [probabilidades-2026.md](probabilidades-2026.md) · dados: [probabilidades-2026.json](probabilidades-2026.json).
Regerar: `npx tsx scripts/analisar-enem-probabilidades.mts`.

## O que difere da análise FUVEST

A FUVEST foi medida com n/N e recorrência em 2017–2026 (`../fuvest-incidencia/`). O ENEM
já tinha classificação editorial só de 2024–2025 (`../incidencia-multibancas/enem-relatorio.md`).
Aqui a base são as **oito aplicações regulares 2018–2025** do banco: 1.440 itens, 180 por edição
(Inglês como língua estrangeira), com dois acréscimos:

1. **P(cair)** — chance estimada de vir pelo menos uma questão do assunto/capítulo, com peso maior
   para provas recentes.
2. **Retroteste** — o mesmo cálculo feito só com 2018–2024 previu 2025. No nível de **assunto**, os
   30 mais prováveis, 29 caíram e a faixa 80–100% acertou 35 de 38. No nível de
   **capítulo**, a faixa 80–100% acertou 13/13, mas abaixo disso a previsão é fraca: escolha de
   capítulo varia muito de ano para ano. Use capítulo para ordenar, não para excluir.

## Limitações declaradas

- A classificação é a do banco, uma por questão, sem dupla codificação.
- Correções feitas em 01/11/2026, depois da primeira versão desta análise:
  - **50 questões de 2018–2023 estavam fora da conta.** Itens importados de outro caderno guardam o
    número daquele caderno; a posição no caderno amarelo está em `src/data/enemPreservedPositions.json`.
    O script passou a usá-la e agora recusa rodar se duas questões caírem na mesma posição ou se uma
    edição não tiver exatamente 180 itens.
  - **23 questões de Matemática de 2024–2025 tinham o capítulo errado** ("Potências e Radicais" como
    rótulo de sobra, inclusive em porcentagem, escala e regra de três). Cada uma foi relida e recebeu o
    capítulo do seu subassunto revisado; a lista está em
    `scripts/data/enem-reclassificacao/capitulos-2024-2025.json`. Três questões de leitura de decimais
    e frações foram para "Sistema de Numeração Decimal" e três de custo/receita para "Modelagem Algébrica".
- O salto de "Entendimento de Texto" (22–25 itens em 2024–2025) e de "Aritmética e Proporcionalidade"
  (10–12) **não é erro de importação**: a classificação revisada independente desses dois anos chega
  aos mesmos assuntos. Pode ser mudança real de perfil da prova ou critério mais amplo que o usado em
  2018–2023; como os dois têm 96% de qualquer jeito, isso muda quantas questões esperar, não se caem.
- Contagem não é peso na TRI. Questão fácil errada derruba mais a nota que difícil errada.
- Atualidades e Redação não estão no modelo (redação não tem "assunto que cai"; o tema não é previsível
  por frequência).

## Leitura prática para esta semana

**Certo de cair (≥ 90%, as 8 edições):**
- Matemática: razão/proporção/porcentagem, probabilidade e leitura de gráficos/tabelas, geometria
  espacial (volumes, sólidos de revolução), funções, geometria plana, equações/modelagem, análise
  combinatória, sequências, leitura de números decimais e frações.
- Linguagens: interpretação (gêneros não verbais, TDIC, função poética), variação linguística,
  literatura contemporânea e modernismo; Inglês sempre 5 de compreensão.
- Natureza: ecologia, fisiologia humana, circuitos elétricos, calorimetria; estequiometria logo abaixo (88%).
- Humanas: população e urbanização no Brasil, globalização, clima/socioambiental, Idade Moderna e Iluminismo,
  Primeira República e Vargas.

**Muito provável (75–90%):** Brasil Império, Colônia e República recente, Idade Média; geografia física
do Brasil; citologia, zoologia, metabolismo energético; química inorgânica; Newton; trigonometria,
logaritmos/exponenciais; Nietzsche/existencialismo e filosofia contemporânea; cultura e etnocentrismo.

**Faixa 60–75% (cai algo, não se sabe qual):** genética, ondulatória, cinemática, energia mecânica,
orgânica (nomenclatura e reações), equilíbrio, soluções, ética e política, Aristóteles.

Em sete dias, não estude por lista: refaça questões de ENEM 2022–2025 dos assuntos ≥ 90% em que você
ainda erra (Caderno de Erros), porque é ali que P(cair) × taxa de erro é maior.
