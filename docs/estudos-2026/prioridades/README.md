> Atualização: a cobertura FUVEST foi substituída pela série completa 2022–2026. Veja [método e integração atuais](../prioridades-aprofundadas.md). Os números de 220 fichas/nove recortes abaixo documentam a etapa anterior; a base integrada atual tem 881 fichas/22 recortes.

# Prioridades, cobrança e aprofundamentos combinados

## Problema encontrado

A base anterior atribuía percentuais ao “Anglo Analisa Região Sudeste 2023–2025”, mas não registrava denominadores, fases, números de questões ou a origem de cada célula. O comentário declarava leituras de gráficos e mistura de ano recente com leitura geral. O algoritmo somava sinal regional e sinal de banca. Isso não é uma estimativa estatística defensável. Os valores foram preservados no arquivo legado, em quarentena, e retirados da interface e do cálculo.

A pesquisa pública encontrou uma publicação do próprio Anglo com outro recorte: [FUVEST, múltipla escolha, 2021–2025](https://www.sistemaanglo.com.br/blog/revisao-final-fuvest-2026). Ela não valida a tabela antiga de 2023–2025 nem permite converter silenciosamente suas categorias em tópicos do aplicativo. Por isso não foi usada para preencher os dados ausentes.

## Base rastreável ativa

- Sete manifestos revisados já existentes: Unicamp 2025/2026; amostras de FUVEST 2026, UNESP 2025, FAMERP 2025, UNIFESP 2025 e ENEM 2022. Prova e gabarito foram baixados das origens oficiais em 17/10/2026 e comparados por SHA-256 com os registros dos manifestos. O primeiro acesso à prova ENEM retornou HTTP 503; uma nova tentativa respondeu PDF com hash idêntico ao registrado.
- Nova leitura dos seis itens de [Biologia da FUVEST 2026, segunda fase, com respostas esperadas](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase2-dia2-respostas-esperadas-biologia.pdf).
- Nova leitura dos sete itens de Biologia da [prova comentada Unicamp 2026, segundo dia de Biológicas/Saúde](https://www.comvest.unicamp.br/wp-content/uploads/2026/06/F2_2o-dia_CB_S.pdf), incluindo objetivos e comentários da banca. O documento cobre outros componentes; a classificação nova cobre somente Biologia. [Índice oficial de provas comentadas](https://www.comvest.unicamp.br/vestibulares-anteriores/1a-fase-2a-fase-comentadas/).

São 220 fichas, nove recortes e seis bancas. Quatro recortes são completos no escopo declarado: duas primeiras fases da Unicamp e duas seções de Biologia de segunda fase. As cinco demais seleções não estimam frequência. A classificação por tópico é editorial do CRIVO, não classificação homologada pelas bancas; respeita os agrupamentos curriculares do app. Por exemplo, Literatura fica separada de Português, e o agrupamento de Botânica inclui o capítulo Fungos. Não equiparar esses denominadores à divisão oficial de disciplinas.

Cada questão válida recebe um tópico principal para a contagem. Relações secundárias aparecem nos exemplos e não duplicam numeradores. A anulada 53 da Unicamp 2025 é excluída. O percentual exibido é ocorrência/total da matéria naquele recorte, sempre acompanhado por n/N, edição, fase, versão e fonte. Não se misturam objetivas, discursivas, edições futuras ou simulados.

Para a ordenação, apenas recortes completos contribuem: ocorrências/(total + 20). O acréscimo 20 é uma escolha editorial conservadora, reduzindo o peso de amostras pequenas; não é intervalo de confiança, modelo probabilístico validado ou previsão. Calcula-se a média das fases disponíveis dentro da banca, depois a média das bancas quando não há filtro. Metas pessoais conservam seus pesos e foco de fase. No plano próximo à prova, usa-se a fase do próximo exame. Banca sem recorte completo contribui zero, sem herdar percentual regional. Falta de dado não é evidência de que um conteúdo não cai. As lacunas pessoais, revisão e incerteza continuam separadas da parcela histórica.

As análises trazem questão, fonte, conceito, comandos e cuidado de leitura. A questão 11 da segunda fase Unicamp 2026 conecta seleção sexual e predação: um exemplo concreto para estudar Evolução + Ecologia, sem alegar que essa conexão seja uma frequência geral da banca. Nas fichas novas de discursivas não há enunciado integral; o link oficial permite conferi-lo com as figuras e respostas. Os enunciados integrais já conferidos permanecem na tela de questões. Uma ficha analítica não é enviada à IA como se fosse a questão completa.

## Reprodução

`node --import tsx scripts/buildExamEvidence.ts` reconstrói `examEvidenceCounts.json` e `examEvidenceCases.json` a partir dos manifestos e de `scripts/data/analise-discursivas-2026.json`. A contagem é leve e o arquivo de análises é carregado sob demanda. `fontes-verificadas.json` registra URLs, hashes e resultado das consultas; os PDFs baixados ficaram fora do commit.

## Recortes combinados e impressão

Estratégias permite até quatro tópicos da mesma matéria, com visão geral ou capítulo por tópico. A chave combinada independe da ordem, preserva guias individuais e conserva os recortes na biblioteca e no retorno à estratégia. O contexto de fontes reserva sínteses e questões para os tópicos; enunciados extensos ou dependentes de figuras não são truncados para caber na IA. Fichas analíticas de provas são identificadas como análises parciais. A geração deve explicitar faltas de cobertura, conexões, limites e treino autoral.

A impressão deixa de depender de iframe invisível, cópia de folhas de estilo e uma promessa que podia permanecer pendente. O botão prepara uma cópia exclusiva para impressão no documento atual e chama `window.print()` no evento de clique. Fontes e detalhes são incluídos, controles são excluídos e a tela é restaurada no `afterprint`; falha síncrona também limpa a preparação. Não migra nem apaga guias.

## Limites da validação

As porcentagens descrevem os recortes declarados; a janela é curta e não representa toda a história das seis bancas. Não há nova série completa de todas as disciplinas para FUVEST, ENEM, UNESP, FAMERP ou UNIFESP. Os exemplos dessas bancas são úteis para estilo, mas ficam fora da ordenação quando o recorte não é completo. Não se inventam dados para preencher lacunas.

A geração de IA é simulada nos testes. A auditoria de navegador usa um guia sintético salvo, sem autenticação e sem gravar em conta real. A impressão é verificada pela chamada na janela atual e pelo PDF produzido pelo mecanismo de impressão do Chromium; o diálogo nativo de cada sistema operacional não é automatizado.

A verificação no navegador passou em 390 e 1366 pixels, claro/escuro: quatro PDFs continham o texto salvo e os recortes, a impressão usou a janela atual e a navegação foi restaurada. Os 12 estados avaliados não apresentaram violações automáticas de acessibilidade, erro de página ou corte horizontal. Evidências resumidas em `verificacao-navegador.json`; execução reproduzível em `scripts/audit-priorities-combined-print.mjs`. Reflexões extensas dividem o orçamento de contexto entre os tópicos, identificando recortes e preservando os registros originais.

Validação final: TypeScript e build de produção passaram; suíte completa com 1.147 testes Node e 3.220 testes de interface em 241 arquivos (4.367 testes). Os testes antigos de impressão foram adaptados ao diálogo na janela atual, preservando os critérios de conteúdo, fontes, exclusão de controles e limpeza. O cenário da tela inicial passou a usar a nova pontuação e verifica que uma pontuação antiga não recebe causalidade atual inventada.
