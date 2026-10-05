# Continuidade — Entrega E

Branch `fix/entrega-e-gramatica`, base `abba293c6c671f7b21bf1b34d536300fa28ac9d3`. A Entrega D foi integrada em #259 e não deve ser refeita. LG1 reúne 26 capítulos de Gramática. Resultado e evidências desta pasta registram 14 configurações aprovadas, 2.770 estados e 78 capturas. A fila contém 164 tratados, 134 pendentes e 315 preservados; faltam 114 aprofundamentos editoriais. A situação da suíte geral está no README. Confirmar a integração desta branch e o delta de main antes de iniciar LG3, sem repetir Gramática. Sem merge automático.

Após LG1, avançar para LG3/Literatura (37), H2/H3 (38), R1/R2/R3 (58) e A1/COP30 (1), além da frente geral de contraste/layout/fluxos prevista em `docs/PLANO-GERAL-CRIVO-2026-10-03.md`. Não integrar os PRs independentes #246/#234/#222 sem instrução específica.

Runners em sequência: `npm run lint`, `npm run build`, testes Playwright de produção com Chromium instalado, `npm test`, matrizes visual/qualidade e integridade da fila. Navegador do lote em `tests/e2e/visual-entrega-e.spec.ts`; variáveis opcionais `CRIVO_E_IDS` e `CRIVO_E_WIDTHS` permitem repetir capítulos/configurações afetados.
