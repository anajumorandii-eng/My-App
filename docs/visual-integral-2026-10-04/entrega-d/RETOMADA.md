# Entrega D — checkpoint na nuvem, em andamento

Salvo em 4 de outubro de 2026 por solicitação explícita da usuária, antes da validação final. Branch `fix/entrega-d-fisica-f2-f3`, base `7d169534ecbcf5448d2a0b34eb4085eade40e67b`. Este checkpoint é rascunho; não mesclar automaticamente.

## Escopo e implementação

21 capítulos de Física, lotes F2 (11) e F3 (10), listados no [manifesto](manifest.json). Os 112 mapas de História/Geografia já foram integrados em #255; a Entrega B em #256 e C em #258 também foram integradas. Esta etapa continua o plano de lotes ampliados.

Novos mecanismos: referencial e percurso; aceleração tangencial/radial; pares de terceira lei; movimento circular vertical; MHS; energia potencial; dissipação; geração elétrica; expansão térmica; calor/temperatura e transferência; primeira lei; Carnot; raios de lentes; vergência; campos eletromagnéticos; intensidade sonora; difração/polarização/ressonância; níveis quânticos e fotoelétrico. Forças e estática mantêm todas as situações legíveis. Newton foi revalidado e recebeu correção conceitual. Rotas condicionais limitam os novos desenhos aos IDs pertinentes.

## Evidência disponível

- A primeira conferência móvel dos 21 capítulos terminou com falhas de legibilidade e sobreposições; dados em [browser-smoke.json](browser-smoke.json) e imagens em `capturas-preliminares/`. São evidências anteriores às correções mais recentes.
- Correções posteriores: janelas de rolagem interna para fontes pequenas, rótulos reposicionados, condição do elevador em Newton, desigualdade textual e escala da abertura na difração.
- Após essas correções, 36 testes de interface passaram em sete arquivos; TypeScript (`npm run lint`) e build (`npm run build`) também passaram. Antes das últimas correções, também passaram 87 testes de interface dirigidos e 21 testes Node; TypeScript e build passaram naquela revisão anterior.
- A revisão independente está em [review.md](review.md), incluindo a resolução dos três achados. Relatórios de termodinâmica, óptica/ondas e fenômenos restantes estão nesta pasta.
- Ainda não existe validação integral final, matriz visual final nem aprovação desta entrega. A fila oficial continua inalterada; os 21 itens permanecem pendentes.

## Próximos passos exatos

1. Executar `npm run lint` e `npm run build` na branch e registrar resultado atual.
2. Executar `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.visual-production.config.ts tests/e2e/visual-entrega-d.spec.ts --grep '390px light reduce'`. Corrigir falhas reais de geometria/fontes.
3. Executar o mesmo comando sem `--grep`: 12 configurações (390/834/1366, claro/escuro, movimento normal/reduzido), controles nos extremos/zero, rolagem por teclado, relações e Testar/Reconstruir. Não executar vários runners simultaneamente.
4. Inspecionar capturas atualizadas e criar galeria definitiva. As capturas atuais não representam o código corrigido. Ajustar ocultação das barras fixas apenas na captura, sem modificar o produto.
5. Executar suíte integral `npm test`, matrizes visual/qualidade e integridade da fila. Somente após aprovação tratar os 21 itens da Entrega D: contagens esperadas 138 tratados, 160 pendentes, 315 preservados (613 IDs), oito lotes restantes. Não promover a fila antes disso.
6. Atualizar manifesto, evidências, plano geral e continuidade com resultados reais; manter textos editoriais e IDs existentes.
7. Atualizar este PR de rascunho com a entrega validada e verificar CI no SHA final. Sem merge automático.

Arquivos de teste principais: `FisicaEntregaD.test.tsx`, `MechanicsFidelityD.test.tsx`, `OpticsWavesFidelity.test.tsx`, `NewtonFidelityD.test.tsx`, `CalorimetryBoard.test.tsx`, testes de Thermo/Remaining e Node de thermo/waves/physicsRemaining. O teste de navegador está versionado em `tests/e2e/visual-entrega-d.spec.ts`.

Leia também `docs/superpowers/plans/2026-10-03-lotes-ampliados.md` e `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`. Nenhum PDF privado ou material licenciado foi incluído neste checkpoint.
