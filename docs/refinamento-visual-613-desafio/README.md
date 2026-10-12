# Cena, explicação e desafio nos 613 capítulos

Base: `e0677f3b`, após a PR #315 mesclada e seus dois checks aprovados.

A ponte entre a cena e a leitura mostrava a etapa atual, mas não oferecia acesso à etapa vinculada ao desafio. Após uma resposta, o feedback também não permitia voltar diretamente à explicação. A aba agora usa o `sectionId` da pergunta autoral para indicar a etapa, abrir a leitura correta e transferir o foco. O campo de resposta também anuncia a pergunta e a etapa vinculada para leitores de tela. O retorno preserva a resposta escrita e o feedback ao entrar novamente em Testar. A troca de capítulo continua limpando esses estados.

A validação encontrou ainda uma lacuna no cancelamento das animações: a preferência vigente já podia estar reduzida enquanto a atualização correspondente continuava pendente no React. A câmera e o mecanismo agora conferem a preferência antes de cada quadro ativo e conservam o último estado observado. Dois testes falharam antes da correção e passaram depois; o timeout de cancelamento do navegador permanece em cinco segundos. `motion-browser-diagnostics.json` registra o evento nativo e a leitura vigente durante a falha anterior.

O catálogo possui exatamente um desafio por capítulo. Os 613 vínculos existem, apontam para seções do próprio capítulo e têm critérios de resposta e transferência. Não foram criadas perguntas, respostas ou animações adicionais. O vínculo indica uma etapa autoral; sua validade estrutural não constitui revisão pedagógica do conteúdo.

## Evidências

- `challenge-links.json`: vínculo capítulo/pergunta/seção/título, confrontado com os dados atuais por teste.
- `catalog-browser-results.json`: auditoria de cada capítulo nas larguras 1440, 834, 390 e 360 px; comparação de condições, preservação da referência, câmera, foco da leitura, seção correta do desafio e ocultação da cena em Testar.
- Capturas `ponte-*` e `retorno-*`: desktop, tablet e tela de 360 px, temas claro e escuro. A barra fixa é ocultada apenas nas capturas do feedback para permitir examinar seu conteúdo completo; o teste verifica a página normal quanto ao overflow.
- `challenge-accessibility.json`: Axe nos componentes de leitura, ponte e recuperação, em seis recortes; registra separadamente resultados inconclusivos.
- Os fluxos Playwright verificam Linguagens, Física, Química e História em Chromium desktop e WebKit com perfil de iPad. Incluem retorno após correção, foco na explicação certa e preservação da resposta/feedback. Os três novos caminhos usam toque no perfil de iPad.

A auditoria do modo Testar identificou contraste de 3,67:1 em três textos no tema escuro (instrução, etapa e pista). Esses textos passam a usar `--vs-dim`, já definido na identidade visual do CRIVO. A descrição da recuperação mantém referência ao mesmo artefato com concordância correta para prancha, instrumento, experimento, cena e estrutura visual.

Verificação concluída: 1.970 testes em 88 arquivos; após a associação acessível e o ajuste de contraste, os 646 testes dos componentes alterados foram repetidos. O build final, TypeScript e oito fluxos de navegador passaram. Axe: seis recortes sem violações; três resultados inconclusivos de contraste em Explorar, registrados sem tratá-los como aprovação. Os três recortes de Testar não tiveram resultados inconclusivos.

## Recursos utilizados

Plugins pertinentes: Design de Interfaces, Design & Motion Kit e Qualidade. Skills selecionadas nesta continuidade: acessibilidade, depuração sistemática e verificação antes da conclusão, com a hierarquia visual já estabelecida na PR anterior. React/TypeScript, controles nativos, Vite/esbuild, Testing Library/Vitest, Playwright, Chromium, WebKit, Axe-core, Git e GitHub CLI. Nenhuma nova biblioteca, mídia gerada ou efeito visual.

A validação de iPad usa emulação WebKit, sem teste em aparelho físico. Os resultados técnicos não promovem aprovação editorial. O inventário formal permanece em 81 capítulos em validação, 532 sem revisão registrada e zero aprovados. A primeira passagem pedagógica integral documentada é outra contagem: 69 capítulos, com 544 pendentes. A documentação anterior prioriza os 43 restantes de Geografia; essas duas contagens não devem ser somadas nem confundidas com cobertura funcional.

## Reprodução

```sh
npm run lint
npm run build
npx vitest run src/views/VisualChallenge.test.ts src/views/Visual.test.tsx src/views/VisualJourney.test.tsx --maxWorkers=2
PORT=3001 NODE_ENV=production node dist/server.cjs
CRIVO_URL=http://127.0.0.1:3001 CRIVO_VISUAL_OUTPUT=docs/refinamento-visual-613-desafio PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/auditProfessionalVisual.mjs
CRIVO_URL=http://127.0.0.1:3001 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/auditVisualChallengeAccessibility.mjs
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium PLAYWRIGHT_WEBKIT_EXECUTABLE_PATH=/tmp/crivo-webkit.sh npx playwright test --config=playwright.visual-refinement.config.ts
```

Os caminhos de executáveis são locais a este ambiente. Em um ambiente com navegadores Playwright e suas dependências instalados, omita os overrides. Não reconstrua `dist` durante a auditoria do servidor de produção. Checkpoints ficam fora da árvore do projeto e permitem retomada com `CRIVO_AUDIT_RESUME=1`.
