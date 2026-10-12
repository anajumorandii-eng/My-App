# Retomada do palco imersivo (12/10/2026)

Pedido da Ana Júlia: cena, manipulação, explicação e desafio no mesmo palco, sem
blocos empilhados, em Física, Química, Matemática, Biologia, História e Geografia.

## Já na branch `claude/inspiring-planck-e1h32d` (PR #317), lint e testes verdes
- `21614d8` palco imersivo único; contrato em `src/views/visual-stage/contract.ts`,
  regras em `docs/visual/PALCO-IMERSIVO.md`. Geometria Molecular: 4380px → 911px.
- `5e7294a` palco abre sempre na cena principal (77 capítulos de HG escondiam a cena).

## Branches enviadas, ainda não integradas
| Branch | Estado |
| --- | --- |
| `visual-imersivo/fis-mat` | commit do agente concluído (cenas seguem a etapa); validar |
| `visual-imersivo/qui-bio` | 2 commits do agente + 1 checkpoint WIP sem lint/test |
| `visual-imersivo/hist-geo` | checkpoint WIP; nasceu sobre os commits de qui-bio |

## Próximos passos
1. Para cada branch: `git merge --no-ff` na branch da PR, `npm run lint`, `npm test`.
   Remover antes `.claude/worktrees/` — o vitest coleta as cópias e acusa falhas falsas.
2. Validar no navegador (1440, 1366, 834×1112, 390): trocar etapa muda a cena;
   desafio no palco; `tests/e2e/visual-entrega-hg.spec.ts` verde.
3. Revisar a camada "Modelo espacial" (metade vazia em União Europeia).
4. Lote de Linguagens do refino anterior ainda não feito.
