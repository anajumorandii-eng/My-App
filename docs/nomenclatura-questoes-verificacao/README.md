# Identificações claras de figuras e perguntas

As representações dos resumos, revisões e aprofundamentos usam **Figura 1 — título**, **Figura 2 — título**. A pergunta de cada representação aparece como **Questão de verificação 1**, **Questão de verificação 2**. O contrato de geração orienta a IA a responder somente no gabarito final, na subseção **Respostas das questões de verificação**, com **Resposta da questão de verificação 1**, etc.

O aplicativo calcula a numeração pela ordem dos blocos válidos `study-visual`, independentemente de renderizações anteriores. Não há contador global ou estado que possa misturar documentos. Figuras inválidas e exemplos em código literal não entram na contagem.

Materiais antigos com perguntas `V1.` e `V2.` recebem os nomes por extenso na exibição. Apenas os rótulos das respostas na seção correspondente são expandidos, usando a associação com a pergunta da figura. Fórmulas, código, versões de prova, outras séries de exercícios e identificações sem figura correspondente permanecem intactos. Não há migração nem regravação do texto salvo. A preparação ocorre antes de separar corpo e gabarito nas revisões, mantendo as respostas recolhidas.

A exportação copia o mesmo conteúdo renderizado: tela e PDF recebem as mesmas identificações. A fonte, as cores e os desenhos existentes foram preservados.

## Evidências

- [Computador](desktop.png) e [celular](mobile.png): conteúdo sintético com duas representações e rótulos antigos, exibido pelos componentes reais `ReviewSummaryText` e `AiTextRenderer`; conferida a correspondência no gabarito, sem transbordamento horizontal.
- [Impressão](impressao.png): página de conteúdo de um PDF A4 de duas páginas (capa e conteúdo), produzido no Chromium usando `createStrategyPrintRoot` e `printStyles`. Conferência visual de títulos, perguntas e respostas, incluindo acentos e quebras de linha. Essa prévia de impressão não passou pelo serviço de paginação final do sumário.
- Testes do contrato de geração, normalização de documentos, proteção de código/fórmulas/provas, blocos incompletos ou inválidos, reinício da contagem por documento, separação do gabarito e cópia para impressão.

Todas as evidências usam conteúdo sintético. O PDF privado enviado pela estudante não está no repositório. Não foram necessárias chamadas pagas de geração.

Verificações finais: `npm run lint` concluído sem erros; `npm test -- -- --maxWorkers=2` com 1.329 testes Node aprovados (um ignorado) e 3.397 testes de interface aprovados em 263 arquivos; `npm run build` concluído. Permanecem os avisos de bundles grandes do projeto e os avisos de `scrollTo` no ambiente simulado de testes, sem falhas.
