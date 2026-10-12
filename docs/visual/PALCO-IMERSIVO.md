# Palco imersivo da aba Visual

## Por que existe

A Ana Júlia pediu que a cena e o trabalho deixassem de ser duas coisas: antes, a
página de um capítulo empilhava cartão de título, cena, galeria, "Conceitos do
capítulo", cartão de desafio, "Mapa do capítulo" e só lá embaixo o texto das cinco
etapas. Em `summary-quimica-geometria-molecular`, a 1366×900, eram 4.380px de
rolagem, e cena e leitura nunca estavam na tela ao mesmo tempo.

Agora cada capítulo abre num **palco único** (`.vs-stage` em `src/views/Visual.tsx`):

- **Cena** (esquerda no desktop, topo fixo no iPad retrato e no celular): o
  `VisualArtifact`, que rola por dentro do palco, nunca a página. Barra do palco
  com **camadas** (cena principal / modelo espacial, quando o capítulo tem) e
  **pontos de investigação** (um por nó, ou os que a cena declarar).
- **HUD** (direita no desktop, gaveta sob a cena abaixo de 1100px): modos,
  domínio, inspetor do nó selecionado, trilho das 5 etapas com texto curto e
  "Aprofundar esta etapa" no mesmo lugar, ponte para o desafio, diagnóstico
  vivo, Testar/Reconstruir e o mapa do capítulo recolhível.

## Regras preservadas

- Testar é "sem consultar": a cena **não é montada** (nem fica no DOM para o
  leitor de tela); o palco mostra um véu no lugar dela e volta no mesmo ponto.
- A avaliação é a mesma: `evaluateRetrievalAnswer` + `applySummaryAttempt`.
  O palco não guarda histórico próprio.
- Par de cartões dos nós 1 e 2 continua no `BoardShell`; cena em SVG/Three.js
  existente, nada de raster, nada de ilustração emprestada.
- O texto integral da etapa continua no DOM; "Aprofundar" só tira o recorte
  visual (`.vs-journey-text`).
- Movimento: só a transição de entrada da cena, desligada em
  `prefers-reduced-motion`.

## Contrato (`src/views/visual-stage/contract.ts`)

```ts
type StageMode = 'explorar' | 'testar' | 'reconstruir';
interface StageSceneProps {
  activeStep: number; onStepChange(step: number): void;
  selectedId: string | null; onSelect(nodeId: string): void;
  mode: StageMode; challengeActive: boolean; focusTarget?: string | null;
}
interface StageHotspot { id: string; label: string; nodeId?: string; step?: number }
interface StageLayer { id: string; label: string }
interface StageSceneDeclaration { hotspots?: StageHotspot[]; layers?: StageLayer[] }
resolveStageDeclaration(map, declaration?) => { hotspots, layers }
hotspotStep(map, spot) => number
```

Pranchas e instrumentos recebem os campos de `StageSceneProps` como props
opcionais de `BoardProps` (`activeStep`, `onStepChange`, `challengeActive`,
`focusTarget`). Quem não os lê continua funcionando: os 613 capítulos ganham o
palco sem migração. `resolveStageDeclaration` descarta ponto que aponta para nó
inexistente ou etapa fora do trilho e, sem ponto válido, usa um por nó.

## Como migrar uma cena

1. Ler `activeStep` e mudar o estado da cena por etapa (ex.: destacar o par
   isolado na etapa de conceito). Só onde a mudança explica o mecanismo.
2. Chamar `onStepChange`/`onSelect` quando a estudante tocar num elemento da
   cena que corresponde a um nó — o inspetor do palco abre ao lado.
3. Declarar pontos próprios pendurando `stage` no componente:
   `MinhaPrancha.stage = { hotspots: [{ id: 'par', label: 'Par isolado', nodeId: '<id>-n2' }] }`
   (ou função de `summary`). Nunca rótulo que não esteja no capítulo.
4. Painel secundário que hoje fica abaixo da cena vira camada do palco (hoje: o
   modelo espacial de `SpatialChapterSupplement`).
5. Conferir em 1440×900, 1366×900, 834×1112 e 390×844.

## História, Geografia e Atualidades (113 capítulos)

Medição de 12/10/2026, pela representação que abre cada capítulo:

| Componente | Capítulos | O que a etapa muda |
| --- | --- | --- |
| `topic-scenes/families/HistoriaGeografia.tsx` | 103 | abre o recorte que a seção cita (`useStageCases`) e escolhe a camada de leitura (`visual-stage/hgLayers.ts`): observar com a afirmação coberta, relacionar, comparar dois recortes, ler o alerta, e na missão escolher o recorte que sustenta a resposta |
| `GeographyContextInstrument`, `HistoryPhaseInstrument`, `HistoryInstrument` | 7 | a etapa leva o recorte/cursor ao caso que a seção cita; Reconstruir cobre a conclusão que entregaria a relação oculta |
| `CurrentAffairsDossier` (COP30) | 1 | acende as peças tiradas da seção da etapa (`sectionId` do dossiê) e leva o quadro à afirmação da mesma seção |
| `IndependenceBoard` | 1 | a etapa escolhe o eixo da prancha; a de pegadinhas acende o rodapé |
| `TopicExperiment` / globo de coordenadas | 1 | `topic-experiments/coordinatesStage.ts`: acende barras, referências ou convergência, leva o ponto a 23°S, 46°O (leitura resolvida) e, no exercício, pede ajustar a latitude até 40°N |

Os pontos de investigação vêm de `visual-stage/caseDeclaration.ts` (laboratórios,
que chegam embrulhados em `lazyBoard` e por isso declaram pelo id),
`sceneDeclarations.ts` (cenas) e `declarations.ts` (experimento). Nenhuma camada
grava evidência: o desafio continua no formulário do palco.

Ainda não alcançado: a camada "Modelo espacial" (`SpatialChapterSupplement`)
não lê a etapa; `HumanitiesConcepts` repete, abaixo da cena, os nós que a barra
de pontos já oferece (o `Visual.test.tsx` ainda o exige); o cabeçalho do
`BoardShell` dos laboratórios segue grande dentro do palco.
