# ENEM 2026 — prioridades por probabilidade histórica

Provas em **8/11** (Linguagens, Humanas e Redação) e **15/11** (Natureza e Matemática).
Tabelas completas: [probabilidades-2026.md](probabilidades-2026.md) · dados: [probabilidades-2026.json](probabilidades-2026.json).
Regerar: `npx tsx scripts/analisar-enem-probabilidades.mts`.

## O que difere da análise FUVEST

A FUVEST foi medida com n/N e recorrência em 2017–2026 (`../fuvest-incidencia/`). O ENEM
já tinha classificação editorial só de 2024–2025 (`../incidencia-multibancas/enem-relatorio.md`).
Aqui a base são as **oito aplicações regulares 2018–2025** do banco (1.390 itens; 2018–2023 têm
170–172 dos 180 itens no banco, 2024–2025 completos), com dois acréscimos:

1. **P(cair)** — chance estimada de vir pelo menos uma questão do assunto/capítulo, com peso maior
   para provas recentes.
2. **Retroteste** — o mesmo cálculo feito só com 2018–2024 previu 2025. No nível de **assunto**, os
   30 mais prováveis caíram todos (30/30) e a faixa 80–100% acertou 33 de 35. No nível de
   **capítulo**, a faixa 80–100% acertou 11/11, mas abaixo disso a previsão é fraca: escolha de
   capítulo varia muito de ano para ano. Use capítulo para ordenar, não para excluir.

## Limitações declaradas

- A classificação é a do banco, uma por questão, sem dupla codificação. Em **2024–2025 há deriva**:
  "Entendimento de Texto" passa de ~10 para 22–25 itens e "Aritmética e Proporcionalidade" de ~3
  para 13–15, mais por mudança de quem classificou do que da prova. O peso de recência amplifica
  isso — leia esses dois assuntos como "certos de cair", não como "três vezes mais que antes".
- Contagem não é peso na TRI. Questão fácil errada derruba mais a nota que difícil errada.
- Atualidades e Redação não estão no modelo (redação não tem "assunto que cai"; o tema não é previsível
  por frequência).

## Leitura prática para esta semana

**Certo de cair (≥ 90%, as 8 edições):**
- Matemática: razão/proporção/porcentagem, probabilidade e leitura de gráficos/tabelas, geometria
  espacial (volumes, sólidos de revolução), funções, geometria plana, equações/modelagem, análise
  combinatória, sequências.
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
