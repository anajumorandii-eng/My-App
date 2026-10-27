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

## Como a questão é montada — medido nas questões oficiais

Medição nas 165 questões oficiais de 2025 e 2026 transcritas no banco:

| Traço | Oficial | Lote 1 (v1) | Lote 1 (atual) |
|---|---|---|---|
| Enunciado mediano | ~840 caracteres | ~250 | ~570 |
| Alternativa mediana | ~94 caracteres | ~70 | ~93 |
| Texto-base com fonte | 47% | 0% | 100% com origem declarada |
| Gráfico, tabela ou figura | 39% | 8% | 33% (tabelas e "Note e adote") |
| Comando que completa a frase | 76% | 71% | maioria |

Daí as regras:

- **Texto-base primeiro.** Notícia, artigo científico, documento ou dado de
  saúde pública, com um recorte atual (garimpo e mercúrio, El Niño de
  2023–2024, rastreamento de doenças). O conteúdo escolar é a ferramenta para
  ler o texto, não o assunto da pergunta.
- **Origem sempre declarada, nunca inventada.** A banca cita fonte real em
  quase metade das questões. Aqui, fonte real só entra quando conferida (o
  art. 7º da CLT, transcrito do decreto-lei); o texto escrito pelo CRIVO diz
  "Texto elaborado para esta questão." e dados hipotéticos dizem "Dados
  ilustrativos." Inventar referência bibliográfica seria o mesmo erro de
  inventar enunciado.
- **Comando que completa a frase** ("espera-se que", "permitem concluir que",
  "é correto afirmar que", "No texto, o autor").
- **Alternativas longas e paralelas, com justificativa** ("X, pois…", "Y, uma
  vez que…"). O distrator típico traz fato verdadeiro com vínculo errado,
  contradiz o dado da tabela, generaliza o que o texto restringe ou repete
  palavras do texto com sentido invertido.
- **"Note e adote"** com constantes e conversões; alternativas numéricas em
  ordem crescente.
- **Literatura só com as obras vigentes.** A lista de 2027 está em
  `docs/estudos-2026/fuvest-incidencia/estrategias-2027.md`. Questão de obra
  exige trecho conferido na edição; sem isso, a questão de Português é de
  leitura de texto escrito para ela.

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
- Tomar como tese do autor a crença que o texto apresenta para refutar
  ("bastava informar"), ou trocar conectivo concessivo por condicional/causal.
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
genética, farmacologia em contexto de química e matemática). Gabarito: A 4,
B 7, C 4, D 4, E 5.
