# Auditoria editorial — FUVEST 2019, primeira fase

Revisão individual por leitura de fonte realizada em 21/10/2026. Foram classificadas as 90 questões da única primeira fase, versão V, aplicada em 25/11/2018 no vestibular 2019. A capa e os rodapés confirmam V. Não foram classificadas segunda fase, provas específicas nem outras versões como se fossem novas provas.

## Fontes e identificação

- first-phase-exam: https://www.fuvest.br/wp-content/uploads/fuvest_2019_primeira_fase.pdf
  - SHA-256: `b6ff89a26436635f4fed4af7b9480ed5d51b3310c425b16ebde689c789d70728`; 6400677 bytes; 25 páginas. Arquivo: `fuvest_2019_primeira_fase.pdf`.
- first-phase-answer-key: https://www.fuvest.br/wp-content/uploads/fuv2019.gabarito.oficial.pdf
  - SHA-256: `a6fff130b2be76877753cb4a8ad086efd4a749ed9f790677b2e2a49ecd8dd91b`; 125036 bytes; 2 páginas. Arquivo: `fuv2019.gabarito.oficial.pdf`.

Os dois arquivos locais foram confrontados por SHA-256 e tamanho com o inventário oficial da coleta. O manifesto no JSON conserva metadados, URL do acervo e identificação dos arquivos. O manual não foi usado para classificar questões.

## Cobertura e gabarito

O gabarito oficial foi lido em suas duas páginas: a primeira traz a tabela de respostas das provas V/K/Q/X/Z e a segunda a correspondência das versões. A coluna V contém respostas A–E para as 90 questões; nenhuma anulação foi indicada nesse documento. Assim, nenhuma ficha está excluída. Esta constatação se refere ao arquivo oficial identificado acima, sem presumir retificações externas não consultadas.

A paginação das fichas é física, incluindo a capa como página 1. Há 90 fichas, numeradas de 01 a 90 sem repetição. Distribuição editorial por matéria principal:

| Matéria | Questões |
|---|---:|
| Química | 13 |
| Geografia | 13 |
| Física | 11 |
| Matemática | 12 |
| Biologia | 8 |
| Português | 9 |
| Literatura | 7 |
| Inglês | 6 |
| História | 10 |
| Arte | 1 |
| Total | 90 |

## Leitura e figuras

O texto integral com preservação das páginas foi lido. A prova foi renderizada com `pdftoppm` em PNG, e as páginas físicas 2 a 18 e 23 a 25 foram efetivamente abertas e inspecionadas visualmente. Isso compreende: habitação indígena, gráficos climáticos e inversão térmica (2); tabela de refugiados e mapas de Wegener (3); tabela alimentar, exportações e curvas térmicas (4); mapa de escritórios, perfil de relevo e gradientes adiabáticos (5); pressão, área superficial e trajetórias (6); cargas, lente e circuito (7); diagrama P–V e tabela de biomas (8); hormônios (9); cladograma e heredograma (10); Lewis e pesagens (11); estruturas peptídicas e soluções (12); ebulição, reação orgânica e gatos (13); polímero e milho (14); fórmulas e gráficos de funções (15); escada, lona, triângulo e passeio aleatório (16); dispersão e cartum (17); anúncio de igualdade no trabalho (18); pintura de Segall (23); tabela econômica e alegoria republicana (24); charges sobre Paraguai e escravidão (25).

As páginas 19 a 22 foram lidas pelo texto extraído; as imagens pequenas de abertura dos textos em inglês não foram usadas como evidência para classificação. O gabarito foi lido por extração de tabela, com correspondência entre as colunas e confirmação dos 90 itens de V. Não se alega inspeção visual do PDF do gabarito.

## Decisões editoriais e ambiguidades concretas

- 01: principal Química, radioatividade; Geografia secundária para Holoceno. A ocupação de mil anos não exige conteúdo de História indígena. Confiança média pela distribuição interdisciplinar.
- 06: deriva continental global foi aproximada de Geografia Física do Brasil, tópico disponível na taxonomia; a limitação territorial do nome não corresponde à abrangência da questão.
- 14: o consumo animal é contexto de uma razão entre áreas lidas no gráfico; principal Matemática, sem secundária Biologia.
- 17: principal dinâmica impulsiva pela colisão; conservação energética na rampa consta como tópico relacionado de Física.
- 27: principal Geografia climática, com Física secundária necessária para os comprimentos de onda. A palavra “refletida” da questão simplifica a radiação térmica emitida pela Terra.
- 31: principal equilíbrio químico, com Ecologia secundária. A alternativa oficial E simplifica a explicação do efeito do ácido carbônico sobre carbonatos; a ficha não trata ácido carbônico como única espécie dissolvida nem adota sua formulação como descrição completa dos equilíbrios.
- 39: as ações das enzimas são fornecidas; a decisão é química estrutural sobre peptídeos, não uma cobrança independente de Biologia.
- 45: principal gases em Química; reconhecer endosperma torna Botânica uma secundária necessária.
- 64: exige reconhecer Memórias Póstumas e Vidas Secas; principal Literatura em Romantismo/Realismo com Modernismo relacionado. Ambas as obras são decisivas.
- 67 e 69: Português. A elipse temporal e o oxímoro podem ser resolvidos nos fragmentos, sem conhecimento das obras. Em 68, 70, 71 e 72 a leitura literária e a poética/estrutura das obras justificam Literatura.
- 79: Geografia principal porque exige fatos externos de junho de 2018; Inglês secundário pela leitura do texto-base. As questões 73–78 ficam em Inglês.
- 82: na revisão amostral de integração, a página23 foi aberta novamente. Arte foi definida como principal porque o comando identifica a linguagem expressionista em Segall. História permanece associada pelas perseguições e migrações. `topicId` nulo evita atribuir reconhecimento de estilo ao tópico de guerras apenas por seu contexto histórico. Confiança média pela integração entre leitura estética e contextualização histórica.
- 85: Revolução Industrial foi aproximada de Idade Moderna e Iluminismo pelo fim do século XVIII.
- 90: nacionalismo oitocentista e fragmentação de impérios foram aproximados de Imperialismo e Guerras Mundiais; falta um tópico específico de movimentos nacionais do século XIX.

## Limitações e validação

A extração textual perde símbolos em fórmulas e omite informações visuais dos diagramas. As imagens citadas foram usadas para recuperar, entre outros, as estruturas químicas, os eixos invertidos na questão 03, as dimensões da lona e do triângulo e os índices do heredograma. Não houve uso de resolução de terceiros nem reprodução de enunciados extensos.

Foi validada a leitura JSON, a sequência única 01–90, a presença dos campos exigidos, duas etapas específicas por estratégia, o limite físico de 25 páginas, a existência e compatibilidade dos IDs de assunto e dos IDs relacionados. Os hashes e tamanhos dos PDFs foram recalculados. Todas as fichas têm resumo, justificativa e armadilha específicos. Esta é revisão editorial única; não houve dupla revisão integral.

## Revisão amostral de integração

Foram relidas as sínteses e estratégias de10,27,46,68,89; a imagem física da página23 foi aberta para conferir82. Essa conferência alterou a matéria principal de82 para Arte e conservou História associada. Não constitui segunda codificação integral das90 questões.

Harmonização de integração da questão 70: Guimarães Rosa foi vinculado a `por_lit_contemporanea`, que contém seu capítulo no currículo, mantendo o Modernismo como enquadramento histórico da obra. Essa alteração muda o agrupamento editorial de assunto, não a matéria Literatura.
