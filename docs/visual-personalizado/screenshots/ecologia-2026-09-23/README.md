# Ecologia: capturas de revisão

Sessão local de 2026-09-23. `audit.json` contém 60 combinações de capítulo, viewport e tema; `accessibility.json` contém 12 varreduras axe. As capturas mostram a figura com a última etapa selecionada e `prefers-reduced-motion: reduce`.

| Capítulo | Celular 360 px | Desktop 1440 px |
| --- | --- | --- |
| Ciclo do nitrogênio | [claro](bio-ecologia-ciclo-nitrogenio-mobile-360-light.png) · [escuro](bio-ecologia-ciclo-nitrogenio-mobile-360-dark.png) | [claro](bio-ecologia-ciclo-nitrogenio-desktop-light.png) · [escuro](bio-ecologia-ciclo-nitrogenio-desktop-dark.png) |
| Eutrofização | [claro](bio-ecologia-eutrofizacao-mobile-360-light.png) · [escuro](bio-ecologia-eutrofizacao-mobile-360-dark.png) | [claro](bio-ecologia-eutrofizacao-desktop-light.png) · [escuro](bio-ecologia-eutrofizacao-desktop-dark.png) |
| Dinâmica de populações | [claro](bio-ecologia-dinamica-populacoes-mobile-360-light.png) · [escuro](bio-ecologia-dinamica-populacoes-mobile-360-dark.png) | [claro](bio-ecologia-dinamica-populacoes-desktop-light.png) · [escuro](bio-ecologia-dinamica-populacoes-desktop-dark.png) |
| Invasoras e controle biológico | [claro](bio-ecologia-invasoras-controle-biologico-mobile-360-light.png) · [escuro](bio-ecologia-invasoras-controle-biologico-mobile-360-dark.png) | [claro](bio-ecologia-invasoras-controle-biologico-desktop-light.png) · [escuro](bio-ecologia-invasoras-controle-biologico-desktop-dark.png) |
| Sucessão | [claro](bio-ecologia-sucessao-mobile-360-light.png) · [escuro](bio-ecologia-sucessao-mobile-360-dark.png) | [claro](bio-ecologia-sucessao-desktop-light.png) · [escuro](bio-ecologia-sucessao-desktop-dark.png) |
| Poluição da água | [claro](bio-ecologia-ciclo-hidrologico-poluicao-agua-mobile-360-light.png) · [escuro](bio-ecologia-ciclo-hidrologico-poluicao-agua-mobile-360-dark.png) | [claro](bio-ecologia-ciclo-hidrologico-poluicao-agua-desktop-light.png) · [escuro](bio-ecologia-ciclo-hidrologico-poluicao-agua-desktop-dark.png) |

Para reproduzir: iniciar Vite em `http://127.0.0.1:3105` com HMR desativado (`$env:DISABLE_HMR='true'; node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3105` no PowerShell), executar `node scripts/auditEcologyVisual.mjs` e `node scripts/auditEcologyAccessibility.mjs` na raiz do projeto. O teste automatizado valida layout, seleção, pan por teclado, respostas HTTP locais, console e erros de página; a revisão editorial continua manual.
