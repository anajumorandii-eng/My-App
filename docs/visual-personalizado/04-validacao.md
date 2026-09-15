# 04 — Validação

## Verificações executadas

| Data | Verificação | Resultado |
| --- | --- | --- |
| 2026-09-14 | `npm test` sobre a `origin/main` mais recente | 454 testes Node e 237 testes Vitest aprovados |
| 2026-09-14 | Vitest focal de `Visual` e do registro de pranchas | 2 arquivos, 14 testes aprovados |
| 2026-09-14 | TypeScript `tsc --noEmit` com 4 GB | aprovado, sem erros |
| 2026-09-14 | Física, Biologia e Química em Chromium 1440 × 1000 | capturas refeitas sobre a `main`, sem erro de console |
| 2026-09-14 | Reconstrução por arrastar em 375 × 812 | peça colocada e captura concluída |
| 2026-09-14 | Leis de Newton no tema escuro em 390 × 844 | artefato radial próprio e captura concluída |
| 2026-09-14 | Redução de movimento em 768 × 1024 | página e artefato renderizados |
| 2026-09-14 | Overflow horizontal em 375 px e 390 px | ausente após correção da margem da prancha |
| 2026-09-14 | Build de produção (`vite build` + servidor esbuild) | aprovado |
| 2026-09-14 | Revisão editorial após recusa da primeira composição | cinco capturas refeitas |
| 2026-09-14 | Toque em Reconstruir após reposicionar domínio | aprovado sem sobreposição |

## Evidências finais

- `fisica-adiabatica-desktop.png`: prancha térmica com pistão e inspetor aberto;
- `biologia-fotossintese-desktop.png`: cloroplasto, mitocôndria e equações;
- `quimica-modelos-atomicos-desktop.png`: experimento de Rutherford e níveis de Bohr;
- `fisica-reconstruir-mobile.png`: reconstrução ativa após arrastar uma relação;
- `fisica-newton-mobile-escuro.png`: núcleo radial das três leis no tema escuro.

O script também falha se detectar exceção de página, erro de console ou largura
da página maior que o viewport nos dois cenários mobile.

## Reprodução das capturas

Com o servidor local ativo:

```powershell
$env:CRIVO_URL='http://localhost:3011'
npx tsx scripts/captureVisualPersonalized.ts
```

## Observações

As capturas são de página completa para documentar a prancha e os controles de
estudo. O menu inferior permanece fixo durante a rolagem, como no restante do
aplicativo.
