# Lote de Biologia — conferência e análise (27/09/2026)

Este é o registro que a regra de entrega do padrão visual exige
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`). Ele diz o que mudou, como foi
conferido no navegador e o que ainda falta. A auditoria de origem é a
`39-auditoria-geral-biologia.md`.

As capturas estão em `screenshots/lote-biologia-2026-09-27/fenomenos/`. Há
uma cena por capítulo novo, em 1440 claro, 1440 escuro e 390 claro, com
movimento reduzido para mostrar o estado final.

A aprovação editorial de cada prancha é da Ana Júlia. Este documento é só a
conferência técnica.

## Lote A — já estava resolvido

`air-pollution` e `climate-pops` já têm `case` próprio em
`BiologyRemainingInstrument.tsx`. A correção entrou antes deste lote, no
commit "corrige casamentos errados e cenas de poluição".

## Lote F — polimento transversal (auditoria §4.3, §4.4, §4.6, §4.7)

Ficou para o começo porque é o único item que violava o padrão vinculante, e
não apenas ficava aquém dele.

- **Cartões cobertos no celular (§4.3).** A barra inferior não era a
  culpada. No celular, o painel de prioridade e o inspetor tinham
  `margin-top: -18px` e subiam sobre os cartões da cadeia de conceitos. Isso
  acontecia nos 613 capítulos, não só em "Sistemas sensoriais". A margem
  passou a 12 px.
- **Legenda saindo do quadro (§4.4).**
  - `BiologyRemainingInstrument` desenhava um rodapé genérico sobre toda cena:
    uma barra de progresso e a lista de estações. Era esse rodapé que colidia
    e vazava. Ele saiu, e o detalhe agora mostra só a primeira frase.
  - Os rodapés de ácidos nucleicos, respiração e hormônios vegetais foram
    reduzidos e centralizados.
- **Atributo `undefined` no primeiro quadro (§4.6).** O `motion.ellipse` da
  ecologia e do experimento ganhou `rx` e `ry` iniciais. As famílias
  `EscalaDeGraus` e `ContrasteDePosicoes` já tinham sido corrigidas no lote
  de Química.
- **Texto minúsculo (§4.7).** As figuras de `BiologiaFisiologia` e
  `BiologiaProcessos` encolhiam no celular até rótulos de 6 a 8 px. Agora
  elas têm 760 px de largura e rolam dentro da prancha, com dica de deslizar e
  setas do teclado, como em Química, História e Geografia. O texto fica com
  13,5 px ou mais, e a página continua sem rolagem lateral.
- **Fotossíntese.** "ciclo de" e "Calvin" estavam encostados.

## Lotes B, C e D — 18 capítulos que só mostravam texto

As quatro famílias genéricas (`tipologia`, `cadeia-de-derivacao`,
`escala-de-graus` e `contraste-de-posicoes`) não desenhavam nada do conteúdo.
A família nova `BiologiaFenomenos` desenha o objeto de cada capítulo.

Os itens e as citações literais continuam os mesmos. Só o desenho mudou, e
ele não afirma nada que a citação não sustente.

A moldura comum saiu de `QuimicaFenomenos` para `FenomenoFrame.tsx`, com
cabeçalho, figura rolável, escolhas, citação e nota de desenho esquemático.
As duas matérias usam a mesma moldura, e cada uma só escreve as próprias cenas.

| Lote | Capítulo | O que a cena mostra |
| --- | --- | --- |
| B | Carboidratos e lipídios | Um anel; dois anéis que soltam água; a cadeia ramificada de reserva; as cadeias retas e paralelas de estrutura. |
| B | Herança sexual | O par XY, o par XX e um par de autossomos em cada sexo; a faixa marca onde fica o gene de cada tipo de herança. |
| B | Mecanismos da evolução | Uma população de pontos em cada quadro e o que cada fator faz com ela: alelo novo, rearranjo, seleção, deriva, migração e isolamento. |
| B | Biomas brasileiros | A paisagem de cada bioma, com os números que a citação dá (~49% da Amazônia, ~12% restante da Mata Atlântica). |
| B | Protozoários | A mesma célula com a estrutura de locomoção de cada grupo. |
| B | Moluscos | A silhueta de gastrópode, bivalve e cefalópode com o traço que os distingue. A lula foi redesenhada porque parecia água-viva. |
| B | Anelídeos | O corpo segmentado com clitelo, parapódios ou ventosas, conforme o grupo. |
| B | Equinodermos | A forma de cada uma das cinco classes, da estrela-do-mar ao crinoide. |
| C | Origem da vida | Da síntese abiótica ao sistema que se copia: frasco com descarga, polímero na argila, coacervado, RNA. |
| C | Proteínas | Os quatro níveis de estrutura, cada um apoiado no anterior. |
| C | Embriologia | Segmentação, mórula, blástula oca e gastrulação, com a parede de baixo dobrando para dentro. |
| C | Vírus | A mesma célula nas cinco etapas; a etapa escolhida acende e as anteriores ficam visíveis. |
| C | Transpiração | Coluna de água no xilema, da evaporação no estômato até a raiz. |
| C | Floema | Xilema e floema lado a lado, da fonte ao dreno, com a sacarose e a água em cada passo. |
| D | Classificação | Os três domínios, a hierarquia encaixada e o parentesco de gênero. |
| D | Tetrápodes | Anfíbio, ovo amniótico e mamífero numa régua de independência da água. |
| D | Plantas terrestres | Briófita, pteridófita e pólen na mesma régua. |
| D | Evolução (construção histórica) | Lamarck contra Darwin e, como juiz, a réplica em placas de Lederberg. |

Um teste confere que cada rótulo tem cena e que a troca de caso funciona
(`BiologiaFenomenos.test.tsx`). O portão do movimento
(`movimento.test.ts`) confere que a família anima por `motion/react`.

### O que a conferência no navegador achou

A varredura mede texto sobre texto e texto fora do quadro nas coordenadas do
viewBox. Nas cenas novas ela achou:

- rótulos de etapa e legendas de quadro mais largos que o quadro. O SVG não
  quebra linha, e "Estrutura quaternária" ou "arqueias mais perto de
  eucariontes" invadiam o vizinho. Agora os dois quebram por palavra na
  largura do quadro;
- "evapora no estômato" e "independência da água" saíam pela direita;
- no vírus, o núcleo ficava sob os textos das etapas 3 e 4, e o texto da
  etapa 5 caía sobre a membrana. O núcleo foi para o canto superior e o
  texto 5 saiu da célula;
- nos Domínios, "Eukarya" não ficava sobre o próprio ramo.

Também havia defeitos que a varredura não mede, porque ela não compara texto
com forma. Eles apareceram nas capturas:

- a gástrula, desenhada com bolinhas, virava um monte no fundo da esfera. Ela
  foi redesenhada em duas camadas: a externa em arco e a interna forrando o
  arquêntero, aberta no blastóporo;
- "blastocele" encostava nas células da blástula;
- no Lamarckismo, as bactérias estavam fora do eixo da seta.

No lote B, as legendas eram longas demais para quadros de 150. Também
apareceram o flagelo sobre a célula vizinha, a "ligação β" sobre os anéis e
uma curva tracejada sem sentido no caso holândrico. Tudo foi corrigido antes
da varredura final.

## Lote E — seis instrumentos abstratos demais

Os seis instrumentos desenhavam formas soltas: três círculos ligados, um
retângulo com duas ondas, uma elipse que ganhava opacidade. Nenhuma delas
dizia de que objeto se tratava. Agora cada cena desenha o objeto do capítulo,
e o cursor move a peça que o mecanismo move. As cenas estão em
`BiologyMechanismScenes.tsx`. Todo rótulo sai do resumo do capítulo.

| Capítulo | O que a cena mostra |
| --- | --- |
| Sustentação e locomoção | Braço com úmero, antebraço e cotovelo. Com a contração, o bíceps engrossa, o tendão puxa, o antebraço gira em torno do cotovelo e o tríceps afina: músculo só puxa. |
| Coordenação endócrina I | Hipófise, TSH e tireoide, com T3 e T4 no sangue. Mais hormônio engrossa a linha que inibe a hipófise e afina a seta do TSH. |
| Compostos inorgânicos | Coluna de teor de água com os marcos do resumo (semente seca abaixo de 15%, humano adulto entre 60 e 70%, água-viva perto de 98%) e uma célula que enche até o teor. As enzimas trabalham ou param; abaixo de 15%, aparecem inativas e não desnaturadas. |
| Núcleo celular | Colar de nucleossomos. Condensar aperta as contas; a polimerase some e o RNA encurta. O rótulo troca de eucromatina para heterocromatina. |
| Biotecnologia | As três etapas da PCR com as temperaturas do resumo e a fita em cada uma, mais uma coluna de cópias em escala log₂: cada ciclo dobra, e 30 ciclos passam de um bilhão. |
| Reprodução humana | Útero, tubas e ovários, com o lugar de cada etapa aceso. Na ovulação aparece a pílula; na fecundação, barreira, laqueadura e DIU de cobre. Na implantação o resumo não cita método, só o HCG que o teste detecta, e é isso que a cena mostra. |

**Compostos inorgânicos emprestava o assunto de outro capítulo.** O
instrumento se chamava "Água, soluto e osmose" e movia soluto através de uma
membrana. O resumo do capítulo não fala de osmose: fala de água, sais minerais
e teor de água. A configuração passou a "Teor de água e metabolismo", com
cursor, relação, leitura e fechamento tirados do texto. É a mesma regra que
proíbe desenhar para tapar buraco.

A conferência percorreu o cursor de ponta a ponta em 1440 claro e 390 escuro.
Ela achou três defeitos:

- "reações em meio aquoso" saía da célula;
- "desnaturação" passava da caixa;
- "~milhão" encostava na caixa do anelamento.

Os três foram corrigidos. As capturas do mínimo, do meio e do máximo de cada
cursor estão em `screenshots/lote-biologia-2026-09-27/instrumentos/`.

## Como foi conferido

- **Cenas novas:** cada caso selecionado em claro e escuro, 1440 e 390 px, e
  com `prefers-reduced-motion`. Não há achado nem erro de console.
- **Varredura de Biologia** (72 capítulos, 1440 claro e 390 escuro):
  - antes: 20 combinações com achado;
  - depois do lote F: nenhuma;
  - depois dos lotes B, C e D: nenhuma.

## Pendente

- **Aprovação editorial** de todas as cenas acima.

## Revisão — 18 instrumentos que ficaram de fora

Depois da entrega, a Ana Júlia apontou que várias pranchas de Biologia
continuavam péssimas, e tinha razão. Este lote fechou só os capítulos que a
auditoria 39 mandou redesenhar. A auditoria deu os demais instrumentos de
`BiologyRemainingInstrument` e `BiologyInstrument` como aceitáveis, porque
cada id tinha um `case` próprio. Eu não conferi esses capítulos na tela.

A captura das 72 pranchas mostrou 18 desenhos de uma forma só. Alguns
exemplos:

- duas ovais para os procariotos;
- uma elipse para o plano corporal;
- o mesmo besouro para insetos e aracnídeos;
- um "X" para a não disjunção;
- um círculo com linhas cruzadas para o citoesqueleto.

Todos foram refeitos. Cada um desenha o objeto do capítulo e move a peça do
mecanismo: os três filamentos do citoesqueleto; a proteína do RER ao Golgi;
os gametas n + 1 e n − 1 conforme a anáfase em que a separação falha; poros,
ósculo e coanócitos contra o cnidócito; os três planos corporais em corte;
inseto, crustáceo, miriápode e aracnídeo com tagmas, antenas e patas
contados; tubarão contra peixe ósseo, com opérculo e bexiga natatória; o
ovário que vira fruto; transformação, transdução e conjugação; o caule em
corte com xilema para dentro e floema para fora; raiz, caule e folha; a
inversão térmica que prende o poluente; o solo com POPs sendo degradados; a
escada de DNA com as pontes de hidrogênio contadas; os homólogos com
crossing-over e a barra de recombinantes; o O₂ do alvéolo ao capilar; a
auxina no lado sombreado.

A revisão também achou três defeitos que não eram só de desenho:

- **Citoplasma I e II estavam trocados.** O instrumento de citoesqueleto
  estava no capítulo I, que trata de RER e síntese. A rota de secreção estava
  no II, que é onde o citoesqueleto aparece. Cada capítulo mostrava o assunto
  do outro, e o registro foi corrigido.
- **Insetos e aracnídeos liam "3% relativo" e "4% relativo".** O número de
  pares de patas caía na leitura genérica de porcentagem. O controle passou
  a ser o grupo, com leitura própria.
- **Cursores sem significado.** O citoesqueleto tinha "Organização relativa
  50%" e a poluição do ar, "Emissão relativa". Viraram o filamento em foco e
  a condição do ar: dispersão normal ou inversão térmica, o mecanismo que o
  resumo descreve.

Conferência: o cursor foi percorrido de ponta a ponta nos 18, em 1440 claro e
390 escuro. A captura achou colisões de texto com desenho, todas
corrigidas: a legenda do RNA, a da auxina, a dos tecidos e a da flor. Na
varredura de Biologia, nenhum dos 72 capítulos tem achado. As capturas estão
em `screenshots/lote-biologia-2026-09-27/revisao/`.
