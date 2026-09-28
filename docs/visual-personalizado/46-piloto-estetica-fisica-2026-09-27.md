# Piloto de estética — cinco instrumentos de Física (27/09/2026)

Registro exigido pela regra de entrega do padrão visual
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`).

## Origem

A Ana Júlia mandou cinco capturas do iPad, todas no tema escuro:

- interferência de ondas;
- defeito de massa;
- reflexão em cordas;
- órbitas;
- polias.

O comentário foi: "o maior problema é que agora você tem que arrumar a
estética, porque a estética está feia".

As capturas mostravam três defeitos diferentes:

1. **Texto borrado no escuro.** Os rótulos da reflexão em cordas saíam como
   manchas.
2. **Cena miúda.** A cena ficava pequena dentro de uma caixa escura grande.
3. **Desenho pobre.** O traço era chapado sobre fundo vazio: um círculo com
   contorno como planeta, um disco com duas bolinhas como núcleo, e uma senoide
   de 17 pontos que saía em zigue-zague.

Este lote corrige os três nos cinco capítulos. Serve de piloto: o estilo só se
estende às outras pranchas depois da aprovação dela.

## 1. Texto borrado

`PhysicsRemainingInstrument.tsx` estilizava 54 rótulos com o objeto `ink`, que
é o estilo de *linha* (`stroke` 3, `fill: none`). Como estilo inline, ele vence
o reset global de `Visual.css`
(`:where(.crivo-visual) svg text:not([stroke])`). O seletor olha o *atributo*
`stroke`, não o estilo.

Resultado: letra sem preenchimento e com contorno grosso. No papel claro isso
passava por negrito; na lousa, virava mancha.

Os rótulos agora usam `txt` (preenchimento, sem contorno). Uma varredura em
todos os arquivos de `src/views` procurou `<text>` com objeto de estilo que
traga `stroke`. Este era o único arquivo.

A checagem de contorno nos 613 capítulos, no tema escuro e no tamanho do iPad
(`halo.mjs`), achou 14 capítulos na primeira passada, todos deste arquivo.
Depois da correção, a segunda passada está registrada no PR.

## 2. Composição

No iPad, a grade antiga de três colunas espremia a cena em cerca de 280 px
entre os dois cartões.

Agora, acima de 620 px:

- a cena ocupa a largura toda no alto, como a figura central da referência;
- os cartões ficam lado a lado embaixo;
- dentro do instrumento, a cena fica à esquerda e o cursor e as leituras à
  direita.

## 3. Desenho: `illustrationKit.tsx`

As cenas repetiam à mão o mesmo gradiente, a mesma seta e a mesma legenda, cada
uma um pouco diferente. O kit reúne essas peças:

| Peça | O que faz |
| --- | --- |
| `useKit()` | Gradientes de esfera (luz no alto à esquerda), metal e vidro. Os ids saem de `useId`, para duas pranchas na mesma página não disputarem o mesmo `url(#…)`. |
| `Nota` | Anotação manuscrita (Kalam) com seta curva e ponta desenhada à mão. A seta sai do ponto do texto mais próximo do alvo. |
| `Marca` | Marca-texto amarelo, de borda irregular, atrás do resultado. |
| `Sombra` | Sombra pousada no chão. |
| `Rotulo` | Rótulo impresso, com `stroke="none"` explícito. |
| `senoide` | Onda amostrada em 96 passos. |

Na lousa, o vinho do papel (#852636) ficava no limite da leitura. Um token novo,
`--vs-kit-acc`, clareia o destaque só no tema escuro, sem mexer no vinho dos
cartões.

## As cinco cenas

| Capítulo | Antes | Agora |
| --- | --- | --- |
| Interferência | Três curvas de 17 pontos no mesmo eixo, um novelo. | Três faixas: onda 1 + onda 2 = soma. Uma linha tracejada passa pela crista da onda 1 e atravessa as três. A soma é preenchida e a nota diz o que aconteceu ("crista + vale: anula"). |
| Defeito de massa | Disco, duas bolinhas, seta. | Balança: núcleons separados de um lado, o núcleo formado do outro. A inclinação cresce com Δm e a energia sai em fótons do lado mais leve. É a definição do resumo — soma dos núcleons isolados menos a massa do núcleo — desenhada como comparação. |
| Reflexão em cordas | Ida e volta no mesmo eixo; a extremidade era um traço. | Ida e volta em faixas separadas. A extremidade é o objeto: parede com a corda amarrada, ou anel que desliza na haste. As notas dizem por que o pulso volta invertido ou não. |
| Órbitas | Planeta com contorno, satélite-bolinha, setas sem nome. | Planeta com volume e atmosfera, satélite com painéis, céu com estrelas. As notas dizem "gravidade: para o centro" e "v: para o lado". O traçado continua saindo de `trajetoria`. |
| Polias | Dois círculos e duas retas; a correia não abraçava nada. | A correia é tangente de verdade às duas polias. Os raios de cada polia giram no seu ω (parados com movimento reduzido), e o arco âmbar tem o comprimento de ω. |

Todo número desenhado vem da mesma conta que produz a leitura do instrumento:

- Aᵣ = 2A·|cos(Δφ/2)|;
- a energia vem de `MECHANICS_FINAL['mass-energy'].readouts`;
- ω₂ = ω₁R₁/R₂;
- a órbita vem de `trajetoria`, que o teste já amarra à leitura "cai" ou
  "orbita".

## Rótulos e conteúdo

As notas repetem o que o lab e o resumo já dizem. Não trazem fato novo:

- "crista com crista reforça; crista com vale… anula" (insight de
  `wavesLab`);
- "a massa total final menor corresponde à energia liberada" (insight de
  `mechanicsFinalLab`);
- "a corda fixa impõe deslocamento nulo; a livre não" (pergunta de
  `physicsRemainingLab`);
- "a gravidade fornece a força centrípeta" (insight de `orbitalLab`);
- "a correia impõe o mesmo deslocamento linear nas bordas" (insight de
  `physicsRemainingLab`).

Dois pontos de escolha do desenho, não do resumo:

- A balança leva seis núcleons, três prótons e três nêutrons. A contagem é do
  desenho, não de um núcleo específico, e o código diz isso.
- Os continentes do planeta são manchas genéricas.

## Como foi conferido

- **Capturas.** Só a cena, no iPad (1194×834), claro e escuro, com o cursor no
  mínimo, no meio e no máximo (`cenas-cursor-grade.png`). A prancha inteira
  também foi capturada no iPad, claro e escuro (`*-ipad-*.png`).
- **O que a captura achou e foi corrigido:**
  - "crista + crista: reforça", "sem defeito: equilíbrio", "volta como vale" e
    as duas notas da órbita saíam do quadro;
  - "núcleons separados" era cortado à esquerda;
  - os fótons do Δm máximo encostavam na borda;
  - a seta da nota dava a volta por fora do texto quando o alvo ficava do outro
    lado. Foi corrigido no kit, então vale para todas as notas.
- **Medição** (`instr.mjs`): texto sobre texto e texto fora do quadro, em cada
  posição do cursor, em 1440 claro e 390 escuro. Achou "onda 2" encostado no
  "+", que foi corrigido. Depois disso, nenhum achado nos cinco capítulos.
- **Checagens:** `npm run lint` limpo; `npm test` verde (711 node:test e 737
  vitest).

## Segunda rodada — "mais divertido"

Depois da primeira versão, a Ana Júlia mandou capturas de três pôsteres de
caderno ilustrado (astronomia, eletricidade e DNA) e pediu "um pouco mais
assim, mais divertido". As capturas vêm de um vídeo de terceiros e não foram
versionadas: o repositório é público. O que elas têm e as cenas não tinham:

| No pôster | Peça no kit | Onde aparece |
| --- | --- | --- |
| Blocos de borda colorida com etiqueta ("SOLAR SYSTEM") | `Painel` | ONDA 1 / ONDA 2 / SOMA, IDA / VOLTA, DEFEITO DE MASSA, ÓRBITA, CORREIA |
| Faixa de céu escuro do sistema solar | `Painel escuro` | a órbita, escura também no tema claro |
| Contorno de tinta em cada objeto | `Bola`, contornos explícitos | núcleons, planeta, polias, alto-falantes |
| Textura de lápis de cor | padrão `lapis` (hachura) | preenchimentos |
| Traço de mão | filtro `tremido` | ondas, balança, correia, parede — nunca em texto |
| Estrelinhas e brilhos | `Brilho`, `Estrela` | crista, fótons, céu |
| Rótulo manuscrito | `Rotulo` em Kalam | todos os rótulos da cena |
| Frase-resumo com estrela | `Pilula` | o resultado do cursor, embaixo de cada cena |
| Papel pontilhado | `Papel` | fundo de toda cena |

Os lápis novos (sol, roxo, laranja, ciano, vermelho, verde) são tokens de
`Visual.css` com versão clara para a lousa.

Dois defeitos foram achados na captura e corrigidos no kit:

- **Notas pretas e sem seta.** A cor da nota vinha de uma classe por tom, e só
  havia classe para os cinco tons da primeira rodada. Agora a cor vai inline.
- **A soma zerada sumia.** Com Δφ = 180°, a soma é uma linha reta de altura
  zero, e o filtro de traço trêmulo, medido na caixa do próprio objeto, a
  apagava. A região do filtro agora é a da cena.

A varredura de contorno herdado nos 613 capítulos, no tema escuro e no tamanho
do iPad, terminou com **zero achados** (eram 14 antes da correção).

## Terceira rodada — a moldura

A cena tinha o traço dos pôsteres, mas a página em volta continuava com cara de
jornal: título serif gigante, cartões inclinados, morros no rodapé. A Ana Júlia
concordou em mexer primeiro na moldura, e só nestes cinco capítulos.

`BoardShell` ganhou a opção `caderno`, passada só pelos cinco instrumentos do
piloto. As outras 608 pranchas não mudam até a aprovação.

| Peça da prancha | Antes | Com `caderno` |
| --- | --- | --- |
| Fundo | Papel liso | Papel pontilhado (giz na lousa) |
| Rótulo do laboratório | Itálico solto | Etiqueta com estrela |
| Título | Serif vinho | Letra de marcador com sombra amarela deslocada (roxa na lousa) |
| Subtítulo | Parágrafo cinza | Quadro de definição com tracinhos dos dois lados |
| Condição | Oval de contorno | Adesivo redondo amarelo |
| Pincel | Faixa em degradê | Rabisco ondulado |
| Cartões | Inclinados, de fundo chapado | Quadros de borda colorida, etiqueta presa na borda e ícone do estágio |
| Fórmula | Tira tracejada | Quadro tracejado com etiqueta |
| Ideia central | Sobre morros | Pílula com estrela |

**A cor de cada lado do par não mudou de significado.** O verde fica à
esquerda e o laranja à direita, e o estado segue na linha de baixo do cartão.
A leitura de cor precisa significar o mesmo em todas as pranchas.

**Os ícones seguem o estágio pedagógico** (`STAGE_LABEL`):

- lâmpada para intuição;
- livro para conceito;
- engrenagem para aplicação;
- alvo para estratégia;
- lápis para exercício.

Estágio sem ícone recebe a estrela.

**Achados da captura, corrigidos:**

- a pílula da ideia central quebrava em coluna no escuro, porque era flex;
- no celular a estrela caía sozinha numa linha: o preflight do Tailwind faz
  todo `svg` ser bloco;
- a etiqueta dos quadros da cena ficava justa na fonte de fallback.

**Teste novo** (`BoardShell.test.tsx`): sem `caderno` a prancha fica como
sempre; com `caderno`, os dois cartões têm ícones diferentes e a ideia central
tem a estrela.

**Conferência:**

- os cinco no iPad, claro e escuro;
- massa-energia também em 390 px, claro e escuro;
- nenhuma rolagem lateral.

## Pendente

- **Aprovação da Ana Júlia** do estilo deste piloto, antes de estendê-lo às
  outras pranchas.
- Levar a moldura `caderno` para todas as pranchas, se aprovada. Hoje ela é
  opção de cinco capítulos.
- No ambiente remoto a Kalam não carrega, porque `fonts.googleapis.com` é
  bloqueado. As capturas mostram as notas no serif de fallback. No aparelho
  dela, elas saem manuscritas.
