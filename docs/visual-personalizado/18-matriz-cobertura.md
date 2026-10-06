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
| Experimento exato | 8 | 1,3% |
| Prancha autoral | 43 | 7,0% |
| Instrumento | 363 | 59,2% |
| Cena validada | 199 | 32,5% |
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
| Língua Inglesa | 17 | 0 | 0 | 17 | 0 | 0 |
| Redação | 58 | 1 | 0 | 57 | 0 | 0 |
| Gramática | 26 | 1 | 0 | 25 | 0 | 0 |
| Literatura | 37 | 1 | 0 | 36 | 0 | 0 |
| Entendimento de Texto | 12 | 0 | 0 | 12 | 0 | 0 |
| Matemática | 83 | 1 | 11 | 71 | 0 | 0 |
| Química | 48 | 0 | 7 | 23 | 18 | 0 |
| Filosofia | 35 | 1 | 0 | 18 | 16 | 0 |
| Sociologia | 27 | 1 | 0 | 6 | 20 | 0 |

## Capítulos com mais de um candidato

95 capítulos têm mais de um artefato registrado. A seleção continua exclusiva: vence o primeiro da ordem acima.

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
| Trovadorismo e Humanismo | Literatura | Instrumento (medieval-voices) | Cena validada (tipologia) |
| A Estética Romântica: Prosa | Literatura | Instrumento (romantic-prose) | Cena validada (tipologia) |
| Vanguardas Artísticas | Literatura | Instrumento (vanguards) | Cena validada (tipologia) |
| Fernando Pessoa | Literatura | Instrumento (fernando-pessoa) | Cena validada (tipologia) |
| Segunda Geração Modernista: Prosa | Literatura | Instrumento (modernism-second-prose) | Cena validada (contraste-de-posicoes) |
| Poesia Brasileira: 1960-1980 | Literatura | Instrumento (poetry-1960-1980) | Cena validada (tipologia) |
| Poesia Brasileira Contemporânea | Literatura | Instrumento (poetry-contemporary) | Cena validada (tipologia) |
| Prosa Brasileira Contemporânea | Literatura | Instrumento (prose-contemporary) | Cena validada (tipologia) |
| Evolução dos Modelos Atômicos | Química | Prancha autoral (modelos-atomicos) | Cena validada (cadeia-de-derivacao) |
| Ligações Químicas e Alotropia | Química | Prancha autoral (ligacoes) | Cena validada (tipologia) |
| Equações Iônicas e outras Teorias para Ácidos e Bases | Química | Prancha autoral (acido-base) | Cena validada (cadeia-de-derivacao) |
| Dispersões | Química | Prancha autoral (dispersoes) | Cena validada (tipologia) |
| Termoquímica II | Química | Prancha autoral (termoquimica) | Cena validada (grade-de-eixos) |
| O Método Socrático e a Maiêutica | Filosofia | Instrumento (socratic-method) | Cena validada (movimento-dialetico) |
| O Mito da Caverna | Filosofia | Instrumento (cave) | Cena validada (escala-de-graus) |
| A Alegoria da Linha Dividida e o Conhecimento | Filosofia | Instrumento (divided-line) | Cena validada (escala-de-graus) |
| Lógica e Metafísica Aristotélicas | Filosofia | Instrumento (aristotle-logic) | Cena validada (cadeia-de-derivacao) |
| A Ética a Nicômaco e a Doutrina do Meio-Termo | Filosofia | Instrumento (golden-mean) | Cena validada (escala-de-graus) |
| Escolástica e Santo Tomás de Aquino | Filosofia | Instrumento (aquinas-synthesis) | Cena validada (cadeia-de-derivacao) |
| Descartes e o Método: a Dúvida Hiperbólica | Filosofia | Instrumento (cartesian-doubt) | Cena validada (escala-de-graus) |
| A Crítica de Hume à Causalidade | Filosofia | Instrumento (hume-causation) | Cena validada (cadeia-de-derivacao) |
| Hobbes e o Estado de Natureza | Filosofia | Instrumento (hobbes-state) | Cena validada (cadeia-de-derivacao) |
| Locke e os Direitos Naturais | Filosofia | Instrumento (locke-rights) | Cena validada (cadeia-de-derivacao) |
| Rousseau e a Vontade Geral | Filosofia | Instrumento (rousseau-general-will) | Cena validada (cadeia-de-derivacao) |
| A Ética Kantiana e o Imperativo Categórico | Filosofia | Instrumento (kant-duty) | Cena validada (cadeia-de-derivacao) |
| Hegel e a Dialética | Filosofia | Instrumento (hegel-dialectic) | Cena validada (movimento-dialetico) |
| O Materialismo Histórico | Filosofia | Instrumento (historical-materialism) | Cena validada (camadas-de-determinacao) |
| A Luta de Classes na Filosofia Marxista | Filosofia | Instrumento (class-struggle) | Cena validada (camadas-de-determinacao) |
| Nietzsche e a Crítica aos Valores Morais | Filosofia | Instrumento (nietzsche-genealogy) | Cena validada (movimento-dialetico) |
| O Existencialismo de Sartre | Filosofia | Instrumento (sartre-freedom) | Cena validada (cadeia-de-derivacao) |
| A Escola de Frankfurt e a Indústria Cultural | Filosofia | Instrumento (frankfurt-culture) | Cena validada (camadas-de-determinacao) |
| O que é o Fato Social | Sociologia | Instrumento (social-fact) | Cena validada (criterios-conjuntivos) |
| Anomia e Coesão Social | Sociologia | Instrumento (anomie-grid) | Cena validada (grade-de-eixos) |
| Identidade e Diferença | Sociologia | Instrumento (identity-difference) | Cena validada (criterios-conjuntivos) |
| Classes Sociais e Mobilidade Social | Sociologia | Instrumento (mobility-grid) | Cena validada (grade-de-eixos) |
| Cidadania e Direitos | Sociologia | Instrumento (citizenship-rights) | Cena validada (escala-de-graus) |
| A Sociedade da Informação | Sociologia | Instrumento (information-society) | Cena validada (criterios-conjuntivos) |
