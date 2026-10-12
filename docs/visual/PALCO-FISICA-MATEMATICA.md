# Palco imersivo em Física e Matemática

Complemento de `PALCO-IMERSIVO.md`. Registra como as pranchas e os instrumentos
de Física e Matemática passaram a responder à etapa do palco, e o que ficou de fora.

## O problema

Com o palco, cena e trilho de etapas passaram a dividir a tela, mas a cena não
lia `activeStep`: trocar de "Intuição" para "Estratégia" mudava o texto do painel e
deixava o gráfico, o circuito e o raio de luz parados no valor inicial. A tira de
equação e a "Ideia central" continuavam abaixo da cena, fora da vista.

## Como a etapa chega à cena

- `lazyBoard` (por onde passa toda prancha e todo instrumento registrado) publica o
  contrato do palco num contexto (`visual-boards/stageStep.tsx`). Nenhuma prancha
  precisou receber prop nova; fora do palco (testes que montam a prancha direto)
  não há contexto e nada muda.
- **Instrumentos** trocam `useState(config.control.initial)` por
  `useStageParameter(config.control, config.readouts)` (ou `useStageParameters`
  com vários eixos). A etapa vira um estado do próprio modelo, calculado por
  `lib/stageParameters.ts` (puro, em `node:test`) a partir das mesmas `readouts`
  que alimentam as leituras:
  - intuição e conceito: valor inicial do instrumento;
  - aplicação: outro valor do mesmo controle, com o "antes → agora" das leituras;
  - estratégia: o ponto de virada mais próximo, em que a leitura principal muda de
    natureza (ex.: raízes "duas" → "nenhuma real"); sem virada, o extremo da faixa
    em que alguma leitura muda;
  - exercício (e todo o modo Reconstruir): volta ao inicial e propõe uma meta que
    só se alcança mexendo na cena. A meta é observação, não evidência: a resposta
    continua indo pelo desafio do capítulo (`evaluateRetrievalAnswer` +
    `applySummaryAttempt`). A cena não grava nada.
- **Pranchas autorais** pedem `boardPair(props, { porEtapa: true })`: sem nó
  selecionado, conceito acende o lado do nó 1 e aplicação o do nó 2. Como essas
  cenas já se desenham pela ênfase (o pistão expande ou comprime, a parábola
  perde as raízes), é isso que as faz mudar. Seleção continua mandando.
  Mecanismos com controle próprio (lentes, ondas, triângulo retângulo,
  probabilidade, referencial da cinemática) usam o mesmo `useStageParameters`.
- `BoardShell palco` põe a **faixa da etapa** dentro da cena: rótulo do nó (abre o
  inspetor), o que olhar agora, fórmula/condição/ideia central na etapa a que
  pertencem, as leituras que mudaram e a meta. Setas da faixa chamam
  `onStepChange`, então faixa, trilho e pontos do palco são a mesma etapa. No
  palco, a tira de equação e o fecho saem de baixo da cena e as faces
  Essencial/Relações não se repetem (o palco já separa cena e painel).

Nada de texto novo sobre o conteúdo: rótulos vêm dos nós do mapa, pergunta e
fórmula do instrumento, desafio de `recallPrompt`, números das `readouts`.

## Cobertura

`visual-boards/stageStep.test.tsx` renderiza toda prancha e todo instrumento de
Física e Matemática (as 159 representações `board`/`instrument` das duas matérias: 77 de Física, 82 de Matemática)
e falha se algum não puser a faixa na cena ou se o desenho não mudar em nenhuma das
quatro primeiras etapas.

## O que ficou de fora

- Oito capítulos de Física com cena (`TopicScene`): aceleração vetorial, força e
  seus tipos, colisões, geração elétrica, estática, dilatação, gases ideais e
  eletrização; e o experimento de Potências e radicais (Matemática). `TopicScene`
  não recebe o contrato do palco hoje, e o repasse em `VisualArtifact` é de outro
  lote; ligar esses capítulos depende dele.
- Os pontos de investigação continuam os padrões (um por nó): `Component.stage`
  não atravessa o `lazyBoard`, então declarações estáticas não chegam ao palco.
- Onde a leitura principal só muda de número, a estratégia leva ao extremo da
  faixa, e não à pegadinha descrita no texto do capítulo (ex.: aresta lateral
  contra altura no prisma oblíquo). É honesto, mas genérico.
