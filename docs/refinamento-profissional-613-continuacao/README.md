# Continuidade do refinamento Visual — comparação e movimento

Base: `72052c4d`, com as PRs #313 e #314 incorporadas. Esta rodada continua a experiência compartilhada da #313 e preserva os ajustes posteriores de Matemática, Física, Biologia e Química.

## Experiência

A comparação agora registra as condições de cada estado: parâmetro, condição selecionada e percurso do modelo. Nos exemplos moleculares, registra molécula, reagente/produto, separação, unidades do fragmento e percurso ilustrativo, conforme os controles disponíveis. Os dados vêm dos controles e modelos existentes.

Os estados guardado e atual apresentam listas equivalentes. O estado guardado conserva seus valores ao manipular o modelo; as diferenças aparecem na coluna atual com a indicação textual **Alterado**, além do destaque visual. A orientação distingue uma alteração de controle de uma alteração da leitura. Quando somente a câmera muda, informa que as condições registradas e a leitura permanecem iguais.

Na câmera, sliders, teclado e arraste têm prioridade sobre o giro automático. No percurso, a seleção manual interrompe a reprodução. O cancelamento descarta callbacks anteriores, que não podem alterar o novo estado nem encerrar uma reprodução posterior. Ao ocultar a página, câmera e percurso param no estado observado e aguardam nova ação ao retornar. Ajustar ou restaurar a câmera conserva os parâmetros do conteúdo.

A preferência de movimento reduzido passa a ser reativa na câmera e nos percursos. A versão atual de Motion mantém o valor inicial nessa hook; a nova implementação acompanha a consulta nativa. O teste no WebKit também identificou uma consulta já criada com valor anterior enquanto uma consulta nova refletia a preferência vigente. A leitura atualizada e a conferência na própria ação tratam essa situação, inclusive antes da notificação. Com movimento reduzido, o giro avança 90° sem animar e a reprodução mostra o quadro final por ação explícita.

A direção visual continua baseada nos tokens do CRIVO. A rodada adiciona informação útil para comparar e explicar o conteúdo, mantendo os roteiros, modelos, perguntas de recuperação e estados editoriais.

## Cobertura e evidências

Resultado final: **1.352 testes em 87 arquivos**, **oito cenários E2E em desktop/iPad**, **613 capítulos em quatro larguras**, TypeScript e build aprovados. Os avisos existentes de tamanho de bundles e imports estáticos/dinâmicos permanecem registrados no build.

- [Catálogo individual](catalog-browser-results.json): 613 capítulos, 14 disciplinas, em 1440, 834, 390 e 360 pixels. A auditoria altera um controle dos 588 suplementos compartilhados e verifica a permanência da figura e das condições guardadas. Os 25 modelos próprios continuam sendo verificados quanto a teclado, largura, leitura e desafio.
- [Perfis Chromium](browser-results.json) e [WebKit](webkit-browser-results.json): desktop, iPad em retrato/paisagem e telas pequenas; temas claro/escuro e toque.
- [Acessibilidade](accessibility-results.json): axe nos painéis alterados. Verificações inconclusivas de contraste permanecem explicitadas, sem declaração de conformidade integral do aplicativo.
- `visual-refinement-continuation.spec.ts`: cenários de Linguagens, Física, Química e História no desktop e no WebKit do iPad. Verifica condições guardadas, prioridade manual e interrupção de câmera e percurso quando a preferência de movimento muda durante a reprodução.
- Testes de regressão reproduzem callbacks atrasados, ocultação da página, mudança da preferência, consulta de mídia com valor anterior e ação antes da notificação.
- Testes de mecanismos e instrumentos preservam as relações científicas e os cenários existentes; as fixtures de movimento reduzido usam a nova interface de preferência.

A validação de iPad é por emulação WebKit; nenhum aparelho físico foi utilizado. Contagens e resultados finais estão no [resumo das verificações](verification-summary.json).

## Capturas

- [Desktop — comparação](desktop-light-comparacao.png)
- [iPad / WebKit — comparação](webkit-ipad-dark-comparacao.png)
- [Móvel — comparação](mobile-light-comparacao.png)
- [Móvel — integração com leitura e desafio](mobile-light-integracao.png)

## Repetir

Com o build atual servido localmente, instale os navegadores Playwright e use:

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test --config=playwright.visual-refinement.config.ts
CRIVO_VISUAL_OUTPUT=docs/refinamento-profissional-613-continuacao CRIVO_URL=http://127.0.0.1:3001 node scripts/auditProfessionalVisual.mjs
CRIVO_VISUAL_OUTPUT=docs/refinamento-profissional-613-continuacao CRIVO_URL=http://127.0.0.1:3001 node scripts/checkProfessionalVisualProfiles.mjs
CRIVO_VISUAL_OUTPUT=docs/refinamento-profissional-613-continuacao CRIVO_URL=http://127.0.0.1:3001 CRIVO_BROWSER=webkit node scripts/checkProfessionalVisualProfiles.mjs
CRIVO_VISUAL_OUTPUT=docs/refinamento-profissional-613-continuacao CRIVO_URL=http://127.0.0.1:3001 node scripts/auditProfessionalVisualAccessibility.mjs
```

`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, `PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH` e `CRIVO_BROWSER_EXECUTABLE` permitem selecionar executáveis locais. Nesta execução o Chromium do ambiente e o launcher WebKit com dependências temporárias foram usados. Os checkpoints do catálogo ficam fora da árvore observada pelo Vite, evitando recargas durante verificações simultâneas.

Skills pertinentes: accessibility (Design de Interfaces) e verification-before-completion (Qualidade). A direção do Design & Motion Kit adaptada na #313 permanece como referência. Não foram adicionadas bibliotecas de efeitos ou assets externos.
