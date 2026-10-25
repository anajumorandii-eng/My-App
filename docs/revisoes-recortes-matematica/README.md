# Revisões, recortes e matemática

## Causas e correção compartilhada da matemática

A tela usa KaTeX, mas o exportador escondia seu HTML e passava a exibir o MathML nativo. O HTML enviado ao renderizador incorporava fontes do corpo e da capa, sem incorporar as fontes e o CSS de matemática. Como o renderizador é isolado e bloqueia rede, o resultado dependia de fontes matemáticas disponíveis no sistema. Além disso, regras genéricas de impressão anulavam o recorte dos SVGs usados pelo KaTeX: a inspeção visual reproduziu barras de radicais estendidas até a borda.

A exportação agora usa o mesmo HTML do KaTeX e incorpora seu CSS e vinte fontes WOFF2 em dados locais. O texto comum continua na fonte existente; cores, margens e composição da capa foram preservadas. O isolamento de rede do renderizador também foi preservado.

A normalização troca letras Unicode matemáticas estilizadas por formas LaTeX nos contextos matemáticos, incluindo comandos gregos. Não reescreve a prosa nem os trechos de código e preserva o texto de comandos como `\text{...}`. A moeda escapada dentro de uma expressão usa um comando equivalente para não encerrar prematuramente o delimitador. Os prompts compartilhados também orientam notação LaTeX. As verificações não encontraram caracteres nulos introduzidos pela conversão.

O exportador aguarda o carregamento do renderizador do conteúdo e, no Chromium, `document.fonts.ready` e a decodificação das imagens. Depois do carregamento das fontes, expressões maiores que sua célula ou bloco recebem ajuste proporcional localizado. As regras internas de recorte do KaTeX foram restauradas para preservar radicais e elementos extensíveis.

A solução se aplica ao exportador compartilhado de revisões, resumos e aprofundamentos. PDFs já salvos permanecem intactos; uma nova exportação usa o fluxo corrigido.

## Tópicos e recortes

A combinação existente de até quatro tópicos foi preservada. Cada tópico pode selecionar vários subtópicos e adicionar recortes personalizados, com deduplicação de espaços, caixa e acentos. A seleção é mantida por identificador do tópico e nenhuma seleção significa tópico completo. O limite de oito recortes por tópico acompanha a validação do pedido.

A Geometria Plana distingue ângulos na circunferência, comprimento da circunferência e de arcos, área do círculo e área de setores e segmentos circulares. As fontes desses rótulos reutilizam os capítulos correspondentes do currículo. Um recorte personalizado continua sendo um foco de estudo; não é apresentado como capítulo editorial publicado.

Antes da geração, o resumo de seleção permite editar recortes e remover tópicos. Os recortes chegam às explicações, exemplos, exercícios e resoluções pelo pedido e pelo contrato compartilhado de geração; conteúdos externos ao recorte são limitados a pré-requisitos breves. A preparação de fontes contempla os capítulos selecionados e descreve o mesmo recorte, sem contradizê-lo com uma indicação de tópico completo. Quando precisa reduzir o pacote, remove questões inteiras em vez de cortar um enunciado.

Os recortes são salvos com o material, preservam banca, etapa, origem e profundidade e voltam ao reabrir/editar. Aprofundamentos recebem o mesmo seletor e restauram seus recortes pelo link da biblioteca. Configurações antigas sem o novo campo continuam válidas. A identidade de um material diferencia recortes e é independente da ordem de marcação.

## Organização das Revisões

A central tem acesso direto à fila, criação/leitura de revisões, caderno de erros e flashcards. O seletor completo de ferramentas permanece disponível sob demanda, sem repetir uma grade de ações equivalente. As atividades continuam montadas ao alternar, preservando preenchimentos.

A criação começa pela matéria, tópico e seleção de subtópicos. Banca/profundidade e origem/tipo de material ficam em grupos recolhidos. A ação de geração recebe maior destaque; o resumo permite conferir e ajustar o conteúdo antes de enviar. A biblioteca fica ao lado da criação em telas largas e abaixo dela em telas menores, com busca e filtros quando existem materiais. Exclusão fica em uma área secundária identificada, sem remoção de capacidades ou dados.

Na fila, agendamento, revisões de resumos e ajustes de banca/tempo ficam sob demanda. Foram removidos o segundo cabeçalho de página, o painel decorativo de métricas e a aparência clicável dos cartões que não tinham ação de cartão. Permanecem os treinos, critérios, registros e históricos. Estados vazios orientam como começar.

Os controles de criação têm rótulos, áreas de toque e foco de teclado. A trava de envio impede duas gerações no mesmo instante; falha, nova tentativa, conclusão e preparação do PDF têm feedback. A edição abre os grupos necessários dentro da configuração atual, sem afetar atividades retidas em outra ferramenta.

## Validação executada

- `npm run lint`: TypeScript sem erros.
- `npm test`: 1.242 testes do servidor aprovados (um ignorado) e 3.335 testes de interface aprovados em 257 arquivos.
- `npm run build`: cliente e servidor compilados. O build mantém o aviso de tamanho de chunks, incluindo os recursos de impressão com fontes incorporadas.
- `git diff --check`: sem erros de whitespace.

- Regressões de renderização para letras gregas, Unicode estilizado, texto comum, código literal, texto LaTeX e moeda escapada.
- Contrato de exportação com CSS e fontes de KaTeX incorporadas, sem URLs relativas de fontes no HTML offline.
- Testes de recortes personalizados, deduplicação, opções precisas de Geometria, preparação de fontes, identidade do material e compatibilidade de configurações.
- Testes de criação, combinação, salvamento, reabertura, edição e preservação de materiais antigos.
- Fluxos de navegador em 390 × 844, 834 × 1112 e 1440 × 1000: tópico completo, múltiplos recortes em dois tópicos, recorte personalizado, restauração, busca, alternância com a fila, teclado e ausência de rolagem horizontal. Duplo acionamento não duplicou a geração. Falha e nova tentativa foram exercitadas no computador.
- PDF real de quatro páginas produzido pelo renderizador do servidor: 67 expressões, zero erros de KaTeX e quatro expressões ajustadas em células estreitas, sem transbordamento após o ajuste. As seis fórmulas solicitadas foram conferidas visualmente em linha, em destaque e em tabela. Radicais, frações, índices, expoentes, letras gregas e a fórmula com texto/moeda foram inspecionados nas páginas rasterizadas. A extração de texto foi usada apenas como verificação complementar.

Os scripts reproduzíveis são `scripts/validate-review-math.mjs` e `scripts/validate-review-workspace.mjs`, com Vite disponível em `http://127.0.0.1:3138` e Chromium instalado. Eles usam os componentes do projeto e o renderizador real de PDF.

### Limites da validação

O navegador de teste usa autenticação e respostas de IA controladas, e a biblioteca é exercitada em armazenamento local. A montagem do pedido, validação no servidor, seleção das fontes e regras dos prompts são verificadas, mas não foi gerado conteúdo num provedor externo nem gravado material em uma conta real. A responsividade foi exercitada por tamanhos de viewport, não em hardware físico de celular/tablet. Esta entrega não altera o provedor nem implanta a aplicação automaticamente.

## Evidências

- [PDF com as fórmulas](evidencias/matematica.pdf)
- [Matemática: página 3](evidencias/matematica-pagina-3.png)
- [Matemática: página 4](evidencias/matematica-pagina-4.png)
- [Revisões no celular](evidencias/revisoes-celular.png)
- [Revisões no tablet](evidencias/revisoes-tablet.png)
- [Revisões no computador](evidencias/revisoes-computador.png)
- [Recortes restaurados](evidencias/recortes-restaurados.png)
- [Fila no celular](evidencias/fila-celular.png)
- [Erro e nova tentativa](evidencias/erro-e-nova-tentativa.png)
- [Resultados dos fluxos](evidencias/fluxos.json)
- [Resultados da matemática](evidencias/matematica.json)

Todos os materiais das evidências são sintéticos. Nenhum PDF pessoal, histórico de estudante ou credencial está incluído.

## Arquivos alterados

- `scripts/reviewMathFixture.tsx`
- `scripts/reviewWorkspaceFixture.tsx`
- `scripts/validate-review-math.mjs`
- `scripts/validate-review-workspace.mjs`
- `server/ai/prompts.ts`
- `server/ai/reviewSummaryPrompt.test.ts`
- `server/ai/reviewSummaryPrompt.ts`
- `server/ai/studyMaterialQuality.ts`
- `server/ai/validation.ts`
- `server/http/studyPdf.ts`
- `src/assets.d.ts`
- `src/components/AdditionalStudyTopics.tsx`
- `src/components/AiTextRenderer.test.tsx`
- `src/components/AiTextRenderer.tsx`
- `src/components/ReviewWorkspace.tsx`
- `src/components/StrategyExplorer.test.tsx`
- `src/components/StrategyExplorer.tsx`
- `src/components/SubtopicSelector.test.tsx`
- `src/components/SubtopicSelector.tsx`
- `src/components/printPdfFile.test.ts`
- `src/lib/fitPrintMath.ts`
- `src/lib/loadStudyPacket.ts`
- `src/lib/printMathStyles.ts`
- `src/lib/printPdfFile.ts`
- `src/lib/printStyles.ts`
- `src/lib/reviewSummaries.ts`
- `src/lib/strategicReview.ts`
- `src/lib/strategyGuides.ts`
- `src/lib/strategySelection.ts`
- `src/lib/studySources.test.ts`
- `src/lib/studySources.ts`
- `src/lib/topicCuts.test.ts`
- `src/lib/topicCuts.ts`
- `src/views/Aprofundamentos.test.tsx`
- `src/views/Aprofundamentos.tsx`
- `src/views/ReviewCenter.test.tsx`
- `src/views/ReviewQueue.tsx`
- `src/views/ReviewSummaries.test.tsx`
- `src/views/ReviewSummaries.tsx`
- `src/views/Revisoes.tsx`
- `vitest.config.ts`

O relatório e as evidências desta pasta também integram a entrega.
