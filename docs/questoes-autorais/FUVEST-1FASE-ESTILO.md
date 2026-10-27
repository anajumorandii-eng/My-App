# Questões autorais no estilo da FUVEST — 1ª fase

Base: a classificação editorial de 2017–2026 em `scripts/data/fuvest-incidence/`
(900 questões de 1ª fase, com assunto, habilidade, estratégia e pegadinha) e
`docs/estudos-2026/fuvest-incidencia/`. As questões são escritas do zero: nenhum
enunciado, alternativa ou resolução é copiado de prova ou apostila.

## O que a prova cobra

Distribuição na 1ª fase (2017–2026, itens classificados): Matemática 118,
Química 111, Geografia 109, Física 105, História 101, Biologia 101, Português 85,
Inglês 67, Literatura 62, Sociologia 18, Filosofia 11, Arte 9. A partir de 2027
são 80 questões em cinco horas.

Habilidades mais exigidas: comparação conceitual (318), cálculo (201),
interpretação textual (156), análise conceitual (132), inferência causal (82),
modelagem (82), análise de evidências (67), leitura de fontes históricas (59),
interpretação de gráfico (56) e análise de imagem (46).

## Como a questão é montada

- **Contexto antes do conteúdo.** Situação real (estuário contaminado, antiácido,
  alpinista, chuveiro na tensão errada) que obriga a escolher o modelo pelo que
  se pede, não pelo substantivo do texto.
- **Dados suficientes e só os necessários.** Massa molar, conversão de unidades e
  constantes vêm no enunciado; o que a questão mede é a operação.
- **Cinco alternativas, todas plausíveis.** Cada distrator corresponde a um erro
  real de raciocínio, nunca a um absurdo. Alternativas numéricas em ordem
  crescente.
- **Comando curto e preciso** ("é correto afirmar que", "considerando apenas os
  dados", "a substituição que mantém o sentido e a correção").

## Pegadinhas recorrentes que os distratores reproduzem

- Confundir a probabilidade condicional com a inversa (sensibilidade ×
  valor preditivo).
- Modelo linear onde o fenômeno é exponencial ou quadrático (meia-vida,
  P = V²/R).
- Erro de base em porcentagem e de unidade na conversão (pH, escala, dioptria,
  kJ × kcal).
- Inverter sentido de processo: fluxo de sangue, deslocamento de equilíbrio,
  regiões afetadas pelo El Niño.
- Atribuir a constante de equilíbrio à pressão, ou à seleção natural uma
  intenção (raciocínio lamarckista).
- Ler a afirmação do narrador ao pé da letra quando o texto a nega logo depois
  (ironia machadiana), ou trocar conectivo concessivo por condicional/causal.
- Generalizar o que a fonte restringe (CLT "para todos").

## Comentário

Abre com "Resposta X." e a resolução completa, de onde vem cada número. Depois,
uma linha por alternativa errada dizendo **qual erro leva a ela**. O teste
`src/lib/crivoAuthoredQuestions.test.ts` confere essa estrutura e que o gabarito
do lote esteja distribuído entre as cinco letras.

## Como acrescentar um lote

1. Escrever `scripts/data/crivo-fuvest-f1-loteN.json` com `skill` e `trap` em
   cada questão (metadados de treino que não vão para o banco).
2. `python3 scripts/aplicar-questoes-autorais.py scripts/data/crivo-fuvest-f1-loteN.json`
   — recusa o lote inteiro se houver questão malformada.
3. Atualizar a contagem do banco nos testes e no `CLAUDE.md`.

Questão autoral não recebe `examSource`: o filtro de provas reais não pode
listá-la como aplicada pela FUVEST. O enunciado abre com "Questão autoral
CRIVO · estilo FUVEST, 1ª fase."

## Lote 1 (24 questões)

Biologia 5, Química 4, Física 4, Geografia 3, Matemática 3, História 2,
Português 2, Inglês 1 — com ênfase nos assuntos de Medicina (fisiologia,
genética, farmacologia em contexto de química e matemática). Gabarito: A 5,
B 6, C 3, D 5, E 5.
