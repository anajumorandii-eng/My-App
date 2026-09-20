# Instrumento de geometria plana — primeira leva

Data: 2026-09-20
Base: `origin/main` em `f31195e`

## Escopo

Os 17 capítulos do aglomerado foram lidos antes do registro. Dois já tinham
representação exclusiva (Ponto Médio/Baricentro e Trigonometria no Triângulo
Retângulo). Nesta primeira leva, nove lacunas passam a usar um laboratório de
geometria plana com configuração, desenho, controle e invariável próprios.

| Capítulo | Controle | O que deve ficar visível |
| --- | --- | --- |
| Introdução à Geometria Plana | ângulo α | alternos iguais; colaterais suplementares |
| Ângulos em Triângulos | ângulo A | soma interna 180° e teorema do ângulo externo |
| Ângulos em Polígonos | número de lados n | decomposição em n−2 triângulos |
| Ângulos e Circunferências | arco | central igual ao arco; inscrito pela metade |
| Simetrias e Congruências | rotação | forma, medidas e área preservadas |
| Identificação de Simetrias I | rotação | coincidência real e ordem do hexágono |
| Identificação de Simetrias II | coordenada x | composição de reflexões nos eixos |
| A Geometria da Proporcionalidade | razão k | Tales nas duas transversais |
| Semelhança de Triângulos | razão k | lados em k e áreas em k² |

Os seis capítulos ainda sem representação tratam de relações métricas e áreas.
Eles ficam como lacuna honesta até a segunda leva, porque exigem decomposição e
medição de regiões — não a manipulação de ângulos/transformações desta entrega.

## Arquitetura

- `src/lib/planarGeometry.ts`: configurações, faixas, fórmulas e leituras.
- `src/views/visual-instruments/PlanarGeometryInstrument.tsx`: cenas SVG e
  integração com `BoardShell`, evidência e modos da aba Visual.
- `src/views/visual-instruments/registry.ts`: correspondência exclusiva entre
  cada configuração e seu capítulo.
- `scripts/capturePlanarGeometry.ts`: auditoria das nove rotas e capturas.

## Verificação

- Cálculos unitários: soma no triângulo, decomposição do polígono, ângulo
  inscrito e escala quadrática de áreas.
- Componente: atualização pelo controle e slider nativo acessível por teclado.
- Registro: cada configuração alcança exatamente um capítulo e não disputa uma
  prancha autoral.
- Navegador: nove rotas em 390 px, interação por teclado, ausência de overflow,
  ocultação da prancha em Testar, temas claro/escuro, 375/768/1440 px e
  `prefers-reduced-motion`.

Capturas versionadas em `screenshots/geometria-plana/`.
