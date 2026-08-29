# Núcleo Instrumental — referência aprovada

**Aprovado em:** 28 de agosto de 2026

Esta pasta preserva o protótipo visual e cinético aprovado do Crivo. `index.html` abre diretamente no navegador e `engine.js` contém o motor Canvas 2D usado na validação. O vídeo `nucleo-instrumental-demo-v6.webm` registra as dez identidades e as transições aprovadas.

## Regra central

> **MATÉRIA = universo visual e leis de movimento / TÓPICO = artefato específico / ESTADO = comportamento do artefato.**

O protótipo é uma referência de composição, materialidade, cor e movimento, não código de produção. A implementação real deve preservar a identidade conceitual e adaptar dimensões, desempenho, acessibilidade e dados ao produto.

## Paletas aprovadas no protótipo

| Identidade | Fundo | Superfície | Primária | Secundária | Emissiva | Atmosfera A | Atmosfera B |
|---|---|---|---|---|---|---|---|
| Matemática | `#12161A` | `#1A2126` | `#6E93B3` | `#C9A468` | `#F1EFE9` | `#1E2C36` | `#0B0E11` |
| Física | `#0A0E15` | `#121A24` | `#4C7FE0` | `#E0B23A` | `#F3F6FF` | `#16264A` | `#080A0F` |
| Química | `#0D1714` | `#15211D` | `#B87545` | `#7C9C74` | `#FBF6EC` | `#173029` | `#080D0B` |
| Biologia | `#0A150F` | `#122018` | `#54D998` | `#E0876A` | `#F3EFE2` | `#0F2E1E` | `#070C09` |
| Português | `#160B0E` | `#231216` | `#8A2E3F` | `#C1443D` | `#F4EDE6` | `#241A1C` | `#0C0708` |
| Literatura | `#120810` | `#1E1018` | `#6E1F30` | `#B5924F` | `#F0E9DD` | `#171C26` | `#08060A` |
| Redação | `#150E09` | `#221610` | `#C9703B` | `#8A3B33` | `#F3ECE1` | `#1D1815` | `#0A0706` |
| História | `#130F09` | `#1F1810` | `#9C7A45` | `#A1483A` | `#EAD9A8` | `#241A12` | `#0A0806` |
| Geografia | `#0F130D` | `#181F14` | `#77804E` | `#B5723F` | `#E9DFC4` | `#12262A` | `#0A0D08` |
| Atualidades | `#101112` | `#191B1C` | `#D99A3E` | `#C1443D` | `#EFF3F5` | `#241E14` | `#0A0A0A` |

## Cobertura das matérias reais da tela Hoje

### Identidade aprovada nesta entrega

- Biologia
- Matemática
- Física
- Química
- Geografia
- História
- Português

### Identidade específica pendente — usar perfil neutro explícito

- Inglês
- Filosofia
- Sociologia

Literatura, Redação e Atualidades permanecem preservadas neste artefato como direções conceituais. Elas não são matérias distintas em `Topic.subject` na tela Hoje atual e não devem ser propagadas para outras rotas nesta entrega.

## Limites da referência

- Não copiar controles de demonstração para o produto.
- Não substituir dados reais por fixtures do protótipo.
- Não expandir o redesign além da tela Hoje.
- Respeitar `prefers-reduced-motion`, fallback estático, contraste e desempenho.
- Comparar a implementação final lado a lado com esta pasta antes de concluir.
