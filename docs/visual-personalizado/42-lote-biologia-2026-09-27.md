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

## Como foi conferido

- **Cenas novas:** cada caso selecionado em claro e escuro, 1440 e 390 px, e
  com `prefers-reduced-motion`. Não há achado nem erro de console.
- **Varredura de Biologia** (72 capítulos, 1440 claro e 390 escuro):
  - antes: 20 combinações com achado;
  - depois do lote F: nenhuma;
  - depois dos lotes B, C e D: nenhuma.

## Pendente

- **Lote E:** reforçar o visual de seis instrumentos abstratos demais
  (`locomotion`, `endocrine`, `inorganic`, `nucleus`, `biotechnology` e
  `reproduction`).
- **Aprovação editorial** de todas as cenas acima.
