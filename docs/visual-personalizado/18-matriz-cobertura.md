# Matriz de cobertura visual

Gerada por `npm run visual:matrix` a partir do resolvedor da tela
(`src/views/visualRepresentation.ts`). Não edite à mão: o teste
`src/views/visualCoverage.test.ts` falha se este arquivo divergir do código.

Cada capítulo tem uma única representação primária, na ordem experimento,
prancha, instrumento, cena e lacuna. Lacuna honesta é o capítulo que ainda
não tem artefato próprio e recebe o aviso, sem emprestar a ilustração de
outro assunto. O detalhe capítulo a capítulo está em
`18-matriz-cobertura.json`.

## Total

| Representação | Capítulos | Parcela |
| --- | ---: | ---: |
| Experimento exato | 11 | 1,8% |
| Prancha autoral | 41 | 6,7% |
| Instrumento | 89 | 14,5% |
| Cena validada | 187 | 30,5% |
| Lacuna honesta | 285 | 46,5% |
| **Total** | **613** | |

## Por matéria

| Matéria | Capítulos | Experimento exato | Prancha autoral | Instrumento | Cena validada | Lacuna honesta |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Física | 85 | 0 | 13 | 18 | 9 | 45 |
| Atualidades | 1 | 0 | 0 | 0 | 0 | 1 |
| Biologia | 72 | 1 | 9 | 0 | 34 | 28 |
| Geografia | 63 | 1 | 0 | 0 | 26 | 36 |
| História | 49 | 1 | 1 | 0 | 32 | 15 |
| Língua Inglesa | 17 | 1 | 0 | 0 | 0 | 16 |
| Redação | 58 | 1 | 0 | 0 | 0 | 57 |
| Gramática | 26 | 1 | 0 | 0 | 0 | 25 |
| Literatura | 37 | 1 | 0 | 0 | 8 | 28 |
| Entendimento de Texto | 12 | 1 | 0 | 0 | 0 | 11 |
| Matemática | 83 | 1 | 11 | 71 | 0 | 0 |
| Química | 48 | 0 | 7 | 0 | 18 | 23 |
| Filosofia | 35 | 1 | 0 | 0 | 34 | 0 |
| Sociologia | 27 | 1 | 0 | 0 | 26 | 0 |

## Capítulos com mais de um candidato

17 capítulos têm mais de um artefato registrado. A seleção continua exclusiva: vence o primeiro da ordem acima.

| Capítulo | Matéria | Vence | Perde |
| --- | --- | --- | --- |
| Calor, temperatura e mudanças de estado | Física | Prancha autoral (calorimetria) | Cena validada (tipologia) |
| Introdução à Ecologia | Biologia | Experimento exato (ecology) | Prancha autoral (trofico) |
| Bioenergética: Fotossíntese e Quimiossíntese | Biologia | Prancha autoral (bioenergetica) | Cena validada (cadeia-de-derivacao) |
| Divisão Celular | Biologia | Prancha autoral (divisao-celular) | Cena validada (cadeia-de-derivacao) |
| Segunda Lei de Mendel e Interação Gênica | Biologia | Prancha autoral (mendel) | Cena validada (tipologia) |
| Fungos | Biologia | Prancha autoral (fungos) | Cena validada (tipologia) |
| Sangue e Imunologia | Biologia | Prancha autoral (abo) | Cena validada (tipologia) |
| Calor Sensível e Calor Latente | Física | Prancha autoral (calorimetria) | Cena validada (cadeia-de-derivacao) |
| Primeira Lei da Termodinâmica Aplicada a Algumas Transformações Particulares | Física | Prancha autoral (adiabatica) | Cena validada (tipologia) |
| Ondulatória: Ondas Eletromagnéticas | Física | Prancha autoral (ondulatoria) | Cena validada (escala-de-graus) |
| Ondulatória: Som e suas Propriedades | Física | Prancha autoral (ondulatoria) | Cena validada (tipologia) |
| A Independência do Brasil | História | Prancha autoral (independencia-brasil) | Cena validada (contraste-de-posicoes) |
| Evolução dos Modelos Atômicos | Química | Prancha autoral (modelos-atomicos) | Cena validada (cadeia-de-derivacao) |
| Ligações Químicas e Alotropia | Química | Prancha autoral (ligacoes) | Cena validada (tipologia) |
| Equações Iônicas e outras Teorias para Ácidos e Bases | Química | Prancha autoral (acido-base) | Cena validada (cadeia-de-derivacao) |
| Dispersões | Química | Prancha autoral (dispersoes) | Cena validada (tipologia) |
| Termoquímica II | Química | Prancha autoral (termoquimica) | Cena validada (grade-de-eixos) |
