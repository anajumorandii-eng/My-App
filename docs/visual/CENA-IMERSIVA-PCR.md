# Cena imersiva da PCR — especificação

Como foi feita a cena 3D do capítulo de Biotecnologia
(`summary-biologia-biotecnologia`), integrada na PR #440. Serve de registro e de
modelo para a próxima cena nessa linguagem.

Tudo aqui descreve o código que está em `src/views/visual-immersive/`. Onde um
número aparece, ele está no código com esse valor; ao mudar o código, mude aqui.

## 1. Origem e decisões

A Ana Júlia enviou um protótipo autônomo ("CRIVO · Protótipo Visual PCR": um
HTML, um CSS e um `app.js` com Canvas 2D) como referência de como a aba Visual
deveria ser: a molécula ocupa o palco inteiro e as etapas acontecem nela, em vez
de ao lado dela. A cena é o porte desse protótipo para React, seguido de uma
revisão que ela aprovou em 11/11/2026.

| Decisão | O que ficou | Por quê |
| --- | --- | --- |
| Desenho | Canvas 2D, o mesmo da referência | Centenas de esferas por quadro; em SVG seriam centenas de nós no DOM |
| Moldura de demonstração | Removida (logotipo e aba "Visual") | A navegação é a do aplicativo |
| Tinta | Duas: `caderno` e `noite` | Verde-escuro e lima eram um salto de linguagem num app de papel e bordô |
| Frase fixa | Removida ("Uma mudança de escala…") | Repetia igual nas cinco etapas |
| Previsão | Uma pergunta antes de cada avanço | Sem ela a cena só se assistia |
| Celular | Composição própria, 724 px | A referência tinha 820 px, mais que a tela |
| Evidência | A cena não grava nada | Histórico próprio faria o mapa e o Caderno discordarem |

A regra do projeto "a cena é desenhada em SVG, nunca um arquivo de imagem"
continua atendida no que importa: o canvas é desenhado em código, acompanha o
tema, reage às etapas e anima. Não há raster.

## 2. Arquivos

| Arquivo | Papel |
| --- | --- |
| `PcrImmersion.tsx` | Componente: dados das etapas, estado, laço de desenho, marcação |
| `PcrImmersion.css` | Estilo, escopado em `.crivo-immersion` |
| `registry.ts` | Quais capítulos têm cena imersiva (hoje, um) |
| `PcrImmersion.test.tsx` | 12 testes de comportamento |
| `../VisualArtifact.tsx` | Onde a cena entra na página do capítulo |

## 3. Como entra na página

`VisualArtifact` decide o que ocupa a vista **Cena 3D** em Explorar:

1. `immersiveSceneFor(summary.id)` devolve o componente imersivo ou `null`.
2. Havendo cena imersiva, ela substitui o modelo espacial genérico
   (`SpatialChapterSupplement`).
3. A alternância **Cena 3D / Esquema** continua: o esquema plano fica a um toque.
4. Em Testar a cena não é montada; em Reconstruir a cena é o esquema.

O componente é carregado sob demanda (`lazy` + `Suspense`), para não pesar na
abertura dos outros capítulos. Recebe uma única propriedade útil:

- `onPractice`: leva ao modo Testar do capítulo. É o botão "Testar o que
  entendi" da última etapa.
- `temaInicial` (opcional): força a tinta; sem ela, a cena segue o tema do app.

## 4. As cinco etapas

Estão em `PCR_PHASES`. Cada etapa tem título em duas partes (a segunda em
itálico serifado), rótulo curto para o trilho, texto, leitura numérica, legenda,
texto do botão de avançar, nome do ponto de interesse e o detalhe dele.

| # | Trilho | Título | Leitura | Legenda | O que a cena mostra |
| --- | --- | --- | --- | --- | --- |
| 1 | DNA | Entre no *DNA.* | 01 | Molécula inicial | Dupla hélice fechada |
| 2 | Separar | O calor *separa.* | 95° | Celsius · exemplo | Fitas afastadas, brilho quente |
| 3 | Primers | O início *da cópia.* | 58° | Celsius · exemplo | Primers dourados nas pontas |
| 4 | Copiar | A informação *se multiplica.* | 72° | Celsius · exemplo | Fita nova crescendo, polimerase |
| 5 | Comparar | E sem *primers?* | 02 / 00 | Duplas após a síntese | Com e sem primers |

Na etapa 5 há dois botões, **Com primers** e **Sem primers**. Sem primers, a
leitura vira `00`, a legenda "Novas fitas sintetizadas", o ponto de interesse
"Fita molde", e o texto explica que não há amplificação.

### Previsão antes de avançar

As etapas 1 a 4 trazem `predict`: uma pergunta sobre o que a etapa seguinte vai
mostrar, com duas opções. Responder avança a etapa. A etapa seguinte abre com o
retorno:

- acerto: uma linha, "Você previu certo." (a explicação é o texto da etapa);
- erro: "Não foi isso." seguido do porquê.

| Sai da etapa | Pergunta | Resposta certa |
| --- | --- | --- |
| 1 | O que o calor de cerca de 95 °C faz com a dupla hélice? | Separa as duas fitas |
| 2 | Ao resfriar, o que se liga primeiro às fitas separadas? | Os primers |
| 3 | Em que sentido a nova fita vai crescer? | 5′ → 3′ |
| 4 | E se a reação não tivesse primers? | Nenhuma fita nova seria sintetizada |

A posição da resposta certa alterna (1ª, 2ª, 1ª, 2ª). Pular pelo trilho limpa o
retorno: não se mostra resultado de previsão que não foi feita. A última etapa
não tem previsão.

Este texto foi escrito na integração e **não passou por revisão de especialista**.

## 5. Estado

Estado de React, que decide o que a marcação mostra:

| Estado | Tipo | O que controla |
| --- | --- | --- |
| `phase` | 0 a 4 | Etapa atual |
| `primers` | booleano | Cenário da etapa 5; volta a `true` ao trocar de etapa |
| `zoomed` | booleano | Aproximação |
| `detail` | booleano | Detalhe do ponto de interesse aberto |
| `escolhida` | tinta ou `null` | Tinta escolhida no botão; `null` segue o app |
| `previsao` | `{acertou, porque}` ou `null` | Retorno da previsão |
| `paused` | booleano | Movimento pausado |

O laço de desenho não depende desse estado como dependência de efeito. Ele lê
uma referência (`live`) atualizada a cada render. Recriar o laço a cada clique
reiniciaria a separação das fitas e a síntese no meio da transição.

As grandezas animadas vivem em variáveis locais do efeito, fora do React:
`rotation`, `tilt`, `separation`, `primerAmount`, `extension`, `zoom`,
`cameraShift`, `heat`.

## 6. Geometria da molécula

- `N = 28` nucleotídeos por fita.
- Posição do nucleotídeo `i` na fita `s` (0 ou 1):
  - ângulo = `i × 0,57` rad, mais π na fita 1;
  - raio = 41;
  - `x = cos(ângulo) × 41 ± separation`, `y = (i − 13,5) × 12`,
    `z = sen(ângulo) × 41`.
- A fita complementar nova usa o mesmo cálculo com mais π no ângulo.

Cada nucleotídeo desenha:

| Peça | Raio | Observação |
| --- | --- | --- |
| Esfera principal | 5,7 | Verde (fita 0) ou azul (fita 1) |
| Ligação ao vizinho | 3,2 | Com uma esfera de 3,5 no meio |
| Base | haste 2,5, esfera 3,6 | A 43% do caminho até a posição oposta |
| Detalhe claro | 2,2 | A cada dois nucleotídeos, opacidade 0,65 |
| Ponte de hidrogênio | 1,2 | Só na fita 0; some com a separação |

Os primers ocupam 4 nucleotídeos: os 4 últimos da fita 0 e os 4 primeiros da
fita 1 (dourado). O restante da fita nova é roxo.

Na etapa 4, a polimerase é um aglomerado de 19 esferas douradas (raio 7 a 11)
em torno do ponto de síntese de cada fita, distribuídas pelo ângulo áureo
(`j × 2,39996`). Some quando a extensão passa de 0,995.

As pontas 5′ e 3′ são escritas no canvas a partir da etapa 2, em Inter 600 de
13 px. A orientação não muda com a câmera.

## 7. Projeção e câmera

Para cada ponto:

1. rotação em torno do eixo vertical (`rotation`);
2. inclinação (`tilt`, limitada a ±0,4 rad);
3. giro fixo do quadro: −0,49 rad no iPad e desktop, −0,32 rad no celular (é o
   que deita a hélice na diagonal);
4. perspectiva: `800 / (800 + z)`;
5. escala: `min(largura / 660; 1,58)` no iPad e desktop;
   `min(largura / 355; 1,28) × 0,74` no celular; vezes o zoom.

Centro da molécula na tela:

| | x | y |
| --- | --- | --- |
| iPad e desktop | 66,5% da largura | 330 px |
| Celular (largura < 641 px) | 52% da largura | 262 px |

Controles de câmera:

- **Arrastar:** 0,008 rad por pixel na horizontal, 0,002 na vertical.
- **Botão girar:** soma π/3 ao alvo de rotação.
- **Botão aproximar:** zoom 1,25.
- **Deriva:** 0,055 rad por segundo quando não está pausada nem sendo arrastada.

## 8. Animação

Um único `requestAnimationFrame`. A cada quadro:

- `delta` = tempo desde o quadro anterior, limitado a 0,05 s.
- Suavização: cada grandeza anda `1 − e^(−3·delta)` do caminho até o alvo.
- Rotação e inclinação seguem o alvo com fator `5·delta`.

| Grandeza | Alvo |
| --- | --- |
| `separation` | 0 na etapa 1; 88 nas demais |
| `primerAmount` | 1 a partir da etapa 3 (0 na etapa 5 sem primers) |
| `extension` | Etapa 4: cresce 0,105 por segundo, de 0 a 1 (cerca de 9,5 s). Etapa 5 com primers: 1. Demais: 0 |
| `zoom` | 1,25 aproximado; 1 normal |
| `cameraShift` | 14 px na etapa 3; 0 nas demais |
| `heat` | 1 na etapa 2; 0 nas demais |

Entrar na etapa 4 zera `extension`, para a síntese recomeçar.

A fita nova aparece nucleotídeo a nucleotídeo: a opacidade de cada um é
`(extension − fração) × 7`, limitada entre 0 e 1, onde `fração` é a posição dele
ao longo da fita.

### Pausa e movimento reduzido

- Pausada, a suavização vira 1: a cena **salta para o estado final** da etapa.
  Não congela a meio caminho, então quem usa movimento reduzido ainda vê o
  resultado de cada passo.
- Na etapa 4 pausada, `extension` vai direto a 1.
- A preferência de movimento reduzido é lida ao montar e acompanhada ao vivo
  (`useLiveReducedMotion`); quando ligada, a cena pausa.
- O botão "Pausar movimento / Retomar movimento" fica no rodapé.

### Quando o laço desenha

Só com duas condições verdadeiras: a cena na tela (`IntersectionObserver`) e a
aba à frente (`visibilitychange`). São guardadas em separado. Com uma variável
só, voltar à aba religava o desenho de uma cena que estava fora da tela.

Medido no navegador: 180 chamadas de `fillRect` por segundo com a cena visível
e zero fora da tela, antes e depois do retorno à aba.

## 9. Fundo e profundidade

Em ordem de desenho:

1. cor de fundo chapada;
2. brilho radial centrado em 67% × 36% do quadro; na etapa 2 o centro esquenta
   conforme `heat`;
3. um feixe de luz diagonal;
4. três arcos de elipse finos atrás da molécula;
5. 95 partículas que sobem devagar, com posição pseudoaleatória determinística
   (`seed(i)`), para a cena ser igual a cada abertura; as maiores têm halo;
6. a molécula.

Profundidade da molécula:

- tudo é ordenado de trás para a frente por `z` antes de desenhar;
- a opacidade cai com a distância, entre 0,42 e 1;
- as esferas são sprites de 80 × 80 px gerados uma vez por cor e por tinta, com
  gradiente radial e um reflexo; são desenhados com `drawImage`, o que é muito
  mais barato que criar um gradiente por esfera a cada quadro;
- cada ligação recebe um fio claro de 22% da largura, deslocado 1 px, que dá
  volume ao traço.

A resolução do canvas usa `devicePixelRatio`, limitado a 1,6.

## 10. As duas tintas

`PALETA` em `PcrImmersion.tsx` define as cores do canvas; o CSS define as da
marcação com `[data-tema=caderno]`. O desenho é o mesmo; só a tinta muda.

| | Noite (referência) | Caderno |
| --- | --- | --- |
| Fundo | `#071b19` | `#f6f0e3` |
| Texto | `#edf4df` | `#2a2118` |
| Acento | `#d4f68c` (lima) | `#86233a` (bordô) |
| Fita 0 | `#9acbb0` | `#3f8a73` |
| Fita 1 | `#83c6ce` | `#2f6f93` |
| Primer e polimerase | `#e9ca7a` | `#b9791c` |
| Fita nova | `#c7a0e5` | `#7d52a8` |
| Sombra da esfera | `#284d42` → `#071f1c` | `#3a3026` → `#1f1812` |

Sem escolha da estudante, a tinta segue o tema do aplicativo: `noite` quando
`<html>` tem a classe `dark`, `caderno` caso contrário (um `MutationObserver`
acompanha a troca). O botão do rodapé alterna, e a escolha vale enquanto a cena
estiver aberta. Não é gravada.

As cores são fixas no código, e não tokens do design system, de propósito: a
cena é uma ilustração e mantém as próprias cores, como uma figura mantém as
suas. O que segue o app é a escolha entre as duas tintas.

## 11. Marcação e composição

A cena é uma `section.crivo-immersion` com uma `div.cr-shell` de altura mínima
fixa. O canvas ocupa a casca inteira; o resto fica por cima, em posição absoluta.

| Elemento | Classe | Onde |
| --- | --- | --- |
| Rótulo do assunto | `.cr-eyebrow` | Topo esquerdo |
| Título | `h2` | Abaixo do rótulo |
| Indicador | `.cr-indicator` | Topo direito (oculto no celular) |
| Dica de gesto | `.cr-view-note` | Abaixo do indicador (oculta no celular) |
| Leitura | `.cr-temp` | Esquerda, a 236 px (celular: 150 px) |
| Marca d'água "PCR" | `.cr-watermark` | Atrás, decorativa |
| Ferramentas | `.cr-tools` | Direita: girar e aproximar |
| Ponto de interesse | `.cr-label` | Segue a molécula |
| Bloco de leitura | `.cr-bottom` | Base, sobre um degradê |
| Trilho | `.cr-rail` | Cinco botões |
| Rodapé | `.cr-foot` | Pausa, troca de tinta, aviso |

Altura da casca: **820 px** a partir de 641 px de largura; **724 px** abaixo.

### Ponto de interesse

É um botão posicionado a cada quadro pelo laço, perto de um ponto da molécula
que muda com a etapa (a hélice, uma fita separada, um primer, a frente de
síntese, a fita nova). Um fio fino liga o ponto ao botão.

A posição é limitada para não sair do quadro nem parar debaixo das ferramentas:

| | Largura reservada | x mínimo | y entre |
| --- | --- | --- | --- |
| iPad e desktop | 250 px | 47% da largura | 240 e 400 px |
| Celular | 212 px | 18 px | 236 e 292 px |

Tocar no ponto abre o detalhe da etapa e aproxima a molécula.

### Tipografia

Inter no corpo e Newsreader na segunda parte do título, as fontes do aplicativo.

| Texto | iPad e desktop | Celular |
| --- | --- | --- |
| Título | 45 a 79 px (`clamp`) | 28 px |
| Texto da etapa | 15,5 px | 14,5 px |
| Pergunta de previsão | 15 px | 14,5 px |
| Botões | 14 px | 13,5 px |
| Trilho | 13 px | 12 px |
| Rótulos | 11 a 11,5 px | 10,5 a 11 px |

O menor texto da cena tem 10,5 px (a segunda linha do ponto de interesse e o
rótulo do assunto no celular). A referência tinha rótulos de 9 px.

### Diferenças no celular

- A molécula sobe (centro a 262 px) e encolhe (× 0,74).
- O título fica em uma linha quando cabe; a quebra forçada sai.
- Indicador, dica de gesto e aviso do rodapé somem.
- Enquanto houver previsão, o botão grande de avançar some: responder é o que
  avança, e o trilho continua para quem quer pular.
- No erro de previsão, o texto da etapa some e fica só o porquê. Com os dois, o
  bloco cobria o terço de baixo da molécula.

## 12. Acessibilidade

- O canvas tem `role="img"` e uma descrição do que as etapas mostram.
- Todo o conteúdo que importa está em texto fora do canvas: título, leitura,
  texto da etapa, detalhe, previsão e retorno.
- O texto da etapa é uma região viva (`aria-live="polite"`); o retorno da
  previsão é `role="status"`.
- O trilho é uma `nav` e a etapa atual leva `aria-current="step"`.
- Botões de alternância usam `aria-pressed`; o ponto de interesse usa
  `aria-expanded`.
- Girar e aproximar têm botão, porque arrastar não é alcançável por teclado.
- Alvos de toque com 44 px ou mais.
- Movimento reduzido: descrito na seção 8.

Limite conhecido: a rotação por arraste não tem equivalente por setas do
teclado; há só o botão de girar em passos de 60°.

## 13. Testes

`PcrImmersion.test.tsx`, 12 testes. O jsdom não implementa Canvas 2D, então o
laço não roda neles: o componente detecta a falta de contexto e fica só com a
marcação, que é o que os testes verificam.

- Percorre as cinco etapas pelo trilho e pelo botão de avançar.
- Compara com e sem primers só na última etapa, e volta ao padrão ao trocar.
- Abre o detalhe no ponto de interesse e o recolhe ao trocar de etapa.
- Termina no desafio real do capítulo.
- Pausa e retoma o movimento.
- Previsão: avança e devolve acerto; no erro explica o porquê; pular pelo
  trilho não deixa retorno; a última etapa não pergunta.
- Tinta: abre em caderno, alterna, e abre em noite com o app escuro.
- Registro: atende só o capítulo de Biotecnologia.

O desenho em si foi conferido no navegador, em iPad (834 × 1112) e celular
(390 × 844), nas duas tintas e nos dois temas, sem erro de console e sem
estouro horizontal.

## 14. Limites

- A cena cobre a PCR, que é parte do capítulo de Biotecnologia.
- Geometria e tempos são didáticos: não há sequência real, a hélice não está em
  escala, e um ciclo dura segundos.
- O texto científico não foi revisto por especialista.
- As etapas da cena não estão ligadas às cinco etapas da leitura do capítulo.
- A escolha de tinta não é lembrada entre visitas.

## 15. Para fazer a próxima cena

A qualidade desta cena vem de ela ter sido desenhada para a PCR. Não há molde
que sirva a outro assunto. O que se reaproveita é a estrutura:

1. Escolher um capítulo em que o fenômeno é espacial e tem etapas.
2. Escrever as etapas no formato de `PCR_PHASES`, com previsão em todas menos a
   última.
3. Definir as grandezas animadas e o alvo de cada uma por etapa.
4. Desenhar com a mesma disciplina: ordenar por profundidade, sprites para o que
   se repete, laço que para fora da tela.
5. Pintar nas duas tintas.
6. Compor iPad e celular em separado, medindo sobreposição na captura.
7. Registrar o capítulo em `registry.ts` e cobrir o comportamento com testes.

Antes de uma segunda cena, vale extrair o que é comum (casca, trilho, previsão,
rodapé, laço e tintas) para um componente compartilhado. Hoje tudo isso está
dentro de `PcrImmersion`, o que é certo para uma cena e errado para duas.
