# Entrega D — retomada validada no PR #259

A implementação dos 21 capítulos F2/F3, salva em 04/10/2026 no checkpoint `f3e519df`, foi retomada e validada. Branch `fix/entrega-d-fisica-f2-f3`, base `7d169534ecbcf5448d2a0b34eb4085eade40e67b`. O PR permanece rascunho, sem merge automático.

Leia o [resultado final](README.md), o [manifesto](manifest.json), a [galeria](GALERIA.md) e a [evidência consolidada](browser-evidence.json). As imagens em `capturas-preliminares/` e `browser-smoke.json` conservam problemas anteriores às correções; não são a galeria definitiva.

A retomada corrigiu contenção móvel/coluna desktop, espiras do MHS atrás da parede, colisões e tamanho de fonte em 360 px. TypeScript, build, 1.943 testes gerais, matriz visual (13 testes) e qualidade (quatro) passaram. Navegador: 14 configurações, 1.868 estados SVG, 192 idas e voltas de abas por teclado e 63 capturas. A fila da proposta contém 138 tratados, 160 pendentes e 315 preservados; conteúdo editorial e persistência mantidos.

## Reprodução

Execute `npm run lint`, `npm run build` e depois, sem compilador em paralelo:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.visual-production.config.ts tests/e2e/visual-entrega-d.spec.ts
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium CRIVO_D_WIDTHS=360 npx playwright test --config playwright.visual-production.config.ts tests/e2e/visual-entrega-d.spec.ts --grep reduce
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.visual-production.config.ts tests/e2e/visual-entrega-d-faces.spec.ts
npm test
npm run visual:matrix
npm run visual:quality
node scripts/validar-fila-visual.mjs
```

Confira CI no SHA final e o delta de main antes de novo trabalho. Não repetir A/B/C, História/Geografia ou F2/F3. Restam LG1/LG3, H2/H3, R1/R2/R3 e A1 no plano ampliado. Os PRs #246, #234 e #222 são independentes. Nenhum PDF privado foi incluído.
