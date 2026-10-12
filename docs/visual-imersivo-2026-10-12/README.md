# Palco imersivo: integração dos três lotes (12/10/2026)

## O que mudou

A branch `claude/inspiring-planck-e1h32d` já tinha o palco único por capítulo
(`.vs-stage`: cena, etapas, explicação e desafio no mesmo quadro). Nesta
integração entraram, por `git merge --no-ff`, os três lotes que fazem a cena
responder à etapa:

- `visual-imersivo/fis-mat` — Física e Matemática (159 capítulos): contexto de
  etapa via `lazyBoard` (`visual-boards/stageStep.tsx`), regra pura em
  `src/lib/stageParameters.ts`, faixa da etapa dentro do `BoardShell` (`palco`).
- `visual-imersivo/qui-bio` — Química e Biologia: casos por etapa em
  `visual-boards/stageCaseItems.ts`, lidos pela cena e pela barra do palco;
  Termoquímica I/II, Membranas, Bioenergética, Modelos atômicos, Mendel e Mutações.
- `visual-imersivo/hist-geo` — História, Geografia e Atualidades (113 capítulos):
  camadas de leitura (`visual-stage/hgLayers.ts`), laboratórios declarados por id
  (`caseDeclaration.ts`), COP30, Independência e o globo de Coordenadas.

Conflitos (`declarations.ts`, `sceneDeclarations.ts`, `docs/visual/PALCO-IMERSIVO.md`)
foram resolvidos somando os dois lados: o palco consulta, nesta ordem, cena por id,
experimento (Coordenadas), laboratório por id, pranchas com casos comuns e, por
último, `Component.stage`.

## Contrato

Inalterado: `src/views/visual-stage/contract.ts` (`activeStep`, `onStepChange`,
`selectedId`, `onSelect`, `mode`, `challengeActive`, `focusTarget`). A cena não
grava evidência; Testar e Reconstruir continuam em `evaluateRetrievalAnswer` +
`applySummaryAttempt`.

## Validação no navegador

Chromium 1194, onboarding contornado, `prefers-reduced-motion: reduce`, nos
tamanhos 1440×900, 1366×900, 834×1112 e 390×844. Doze capítulos, dois por matéria:

| Matéria | Capítulos |
| --- | --- |
| Física | resistores; estudo analítico das lentes esféricas |
| Química | geometria molecular; termoquímica II |
| Matemática | função quadrática; prismas |
| Biologia | coração e vasos sanguíneos; membranas celulares |
| História | Independência do Brasil; mineração no Brasil colonial |
| Geografia | coordenadas geográficas; sistema de fusos horários |

Em todos os 48 casos: palco presente com modos (Explorar/Testar/Reconstruir),
trilho de etapas e inspetor no mesmo quadro; trocar de ponto de investigação
mudou o conteúdo da cena; Enter num ponto focado por teclado o tornou a etapa
atual (`aria-current="step"`); sem rolagem horizontal; nenhuma sobreposição entre
textos SVG visíveis (a medição bruta acusou 43 em fusos horários, todas entre
casos empilhados com opacidade 0); nenhum erro de página além do aviso de
WebSocket do HMR do Vite.

Altura da página em `summary-quimica-geometria-molecular`:

| Tamanho | Antes do palco | Depois |
| --- | --- | --- |
| 1366×900 | 4.380px | 911px |
| 1440×900 | — | 911px |
| 834×1112 | — | 1.203px |
| 390×844 | — | 935px |

Os mesmos valores valeram para os doze capítulos: no desktop o palco tem 630px
e cena e painel cabem lado a lado na primeira tela.

Capturas: `<capitulo>-<largura>x<altura>.png` nesta pasta.

## Skills usadas

Nenhuma. A integração foi merge, testes e Playwright com o roteiro do próprio
repositório; nenhuma skill cobria isso melhor.

## Pendências

- Física: 8 capítulos que abrem com cena e o experimento de Potências e radicais
  não seguem a etapa.
- Química/Biologia: Ligações/alotropia, Leis ponderais, Dispersões, Fungos,
  Enzimas, Divisão celular e Sangue/ABO seguem estáticas; `equilibrios-ionicos-ii`
  ficou de fora porque as citações dos casos não batem com o texto em revisão 2.
- HG: a camada "Modelo espacial" não lê a etapa; `HumanitiesConcepts` repete os nós
  abaixo da cena.
- No celular e no iPad retrato a área da cena é pequena e a barra de pontos de
  investigação rola na horizontal, cortando rótulos.
- Erro antigo `<path> attribute d: undefined` em resistores não foi corrigido.
- Tema escuro, tema tecnológico e leitor de tela não foram conferidos.
