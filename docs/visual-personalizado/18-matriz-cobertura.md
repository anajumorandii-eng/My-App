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
| Experimento exato | 10 | 1,6% |
| Prancha autoral | 43 | 7,0% |
| Instrumento | 329 | 53,7% |
| Cena validada | 231 | 37,7% |
| Lacuna honesta | 0 | 0,0% |
| **Total** | **613** | |

## Por matéria

| Matéria | Capítulos | Experimento exato | Prancha autoral | Instrumento | Cena validada | Lacuna honesta |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Física | 85 | 0 | 14 | 63 | 8 | 0 |
| Atualidades | 1 | 0 | 0 | 1 | 0 | 0 |
| Biologia | 72 | 1 | 10 | 27 | 34 | 0 |
| Geografia | 63 | 1 | 0 | 4 | 58 | 0 |
| História | 49 | 0 | 1 | 3 | 45 | 0 |
| Língua Inglesa | 17 | 1 | 0 | 16 | 0 | 0 |
| Redação | 58 | 1 | 0 | 57 | 0 | 0 |
| Gramática | 26 | 1 | 0 | 25 | 0 | 0 |
| Literatura | 37 | 1 | 0 | 28 | 8 | 0 |
| Entendimento de Texto | 12 | 1 | 0 | 11 | 0 | 0 |
| Matemática | 83 | 1 | 11 | 71 | 0 | 0 |
| Química | 48 | 0 | 7 | 23 | 18 | 0 |
| Filosofia | 35 | 1 | 0 | 0 | 34 | 0 |
| Sociologia | 27 | 1 | 0 | 0 | 26 | 0 |

## Capítulos com mais de um candidato

63 capítulos têm mais de um artefato registrado. A seleção continua exclusiva: vence o primeiro da ordem acima.

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
| Óptica da Visão | Física | Prancha autoral (defeitos-visao) | Cena validada (tipologia) |
| Ondulatória: Ondas Eletromagnéticas | Física | Prancha autoral (ondulatoria) | Cena validada (escala-de-graus) |
| Ondulatória: Som e suas Propriedades | Física | Prancha autoral (ondulatoria) | Cena validada (tipologia) |
| Sistema de Fusos Horários | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (fusos-horarios) |
| Linguagem Cartográfica | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (linguagem-cartografica) |
| Cartografia Digital | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (digital-map) |
| Representações Gráficas e Cartográficas | Geografia | Cena validada (tipologia) | Instrumento (map-elements) |
| Água na Superfície Terrestre | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (agua-superficie) |
| Desafios Ambientais do Século XXI | Geografia | Cena validada (tipologia) | Instrumento (commons) |
| Geopolítica Ambiental | Geografia | Cena validada (contraste-de-posicoes) | Instrumento (governanca-ambiental) |
| Hidrogeografia Mundial | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (world-basin) |
| Globalização e Processos Econômicos Atuais | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (supply-chain) |
| Geografia das Redes Mundiais | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (redes-mundiais) |
| Unilateralismo e Multilateralismo | Geografia | Cena validada (contraste-de-posicoes) | Instrumento (unilateralismo-multilateralismo) |
| União Europeia | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (uniao-europeia) |
| Indústria II | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (technopole) |
| Gedeconomia Mundial | Geografia | Cena validada (tipologia) | Instrumento (geoeconomics) |
| Terrorismo Internacional | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (terrorismo-internacional) |
| Geografia das Religiões | Geografia | Cena validada (tipologia) | Instrumento (geografia-religioes) |
| Tensões Geopolíticas na Europa | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (conflito-europa) |
| Geopolítica e Geoeconomia da América Latina | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (geopolitica-america-latina) |
| África no Mundo Atual | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (africa-mundo-atual) |
| Geopolítica e Geoeconomia da Ásia | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (geopolitica-asia) |
| Geografia do Oriente Médio | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (geografia-oriente-medio) |
| Questão Palestina | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (questao-palestina) |
| Conflitos no Mundo Árabe | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (conflitos-mundo-arabe) |
| Biogeografia do Brasil I | Geografia | Cena validada (tipologia) | Instrumento (biogeografia-brasil-i) |
| Biogeografia do Brasil II | Geografia | Cena validada (tipologia) | Instrumento (biogeografia-brasil-ii) |
| Políticas Ambientais Brasileiras | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (politicas-ambientais-brasileiras) |
| Hidrogeografia do Brasil | Geografia | Cena validada (tipologia) | Instrumento (brazilian-basins) |
| Matriz Energética | Geografia | Cena validada (tipologia) | Instrumento (matriz-energetica) |
| Energia Elétrica no Mundo | Geografia | Cena validada (contraste-de-posicoes) | Instrumento (energia-eletrica-mundo) |
| Produção Mineral | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (mining) |
| O Espaço Agrário Brasileiro | Geografia | Cena validada (camadas-de-determinacao) | Instrumento (agrarian) |
| O Espaço Industrial Brasileiro II | Geografia | Cena validada (cadeia-de-derivacao) | Instrumento (espaco-industrial-brasileiro-ii) |
| Introdução à História e Primeiras Civilizações | História | Cena validada (cadeia-de-derivacao) | Experimento exato (sources) |
| América no Século XIX | História | Cena validada (tipologia) | Instrumento (america-xix) |
| Grandes Revoluções do Século XX | História | Cena validada (tipologia) | Instrumento (grandes-revolucoes-seculo-xx) |
| Segunda Guerra Mundial (1939-1945) | História | Cena validada (cadeia-de-derivacao) | Instrumento (segunda-guerra) |
| Guerra Fria | História | Cena validada (contraste-de-posicoes) | Instrumento (guerra-fria) |
| América Latina no Século XX | História | Cena validada (cadeia-de-derivacao) | Instrumento (america-latina-seculo-xx) |
| Disputas Europeias no Brasil Colonial | História | Cena validada (cadeia-de-derivacao) | Instrumento (disputas-europeias-brasil-colonial) |
| A Independência do Brasil | História | Prancha autoral (independencia-brasil) | Cena validada (contraste-de-posicoes) |
| Brasil Império: Segundo Reinado (1840-1889) | História | Cena validada (tipologia) | Instrumento (segundo-reinado) |
| A República da Espada | História | Cena validada (tipologia) | Instrumento (republica-da-espada) |
| República Liberal (1945-1964): Democracia em Tempos de Guerra Fria | História | Cena validada (contraste-de-posicoes) | Instrumento (republica-liberal-democracia) |
| República Liberal (1945-1964): Desenvolvimentismo e Populismo | História | Cena validada (contraste-de-posicoes) | Instrumento (republica-liberal-desenvolvimentismo) |
| Regime Militar (1964-1985) I | História | Cena validada (tipologia) | Instrumento (regime-militar-i) |
| Regime Militar (1964-1985) II | História | Cena validada (escala-de-graus) | Instrumento (regime-militar-ii) |
| Evolução dos Modelos Atômicos | Química | Prancha autoral (modelos-atomicos) | Cena validada (cadeia-de-derivacao) |
| Ligações Químicas e Alotropia | Química | Prancha autoral (ligacoes) | Cena validada (tipologia) |
| Equações Iônicas e outras Teorias para Ácidos e Bases | Química | Prancha autoral (acido-base) | Cena validada (cadeia-de-derivacao) |
| Dispersões | Química | Prancha autoral (dispersoes) | Cena validada (tipologia) |
| Termoquímica II | Química | Prancha autoral (termoquimica) | Cena validada (grade-de-eixos) |
