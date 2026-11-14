# Cena imersiva de geometria molecular (WebGL) — conferência de 14/11/2026

Terceira cena imersiva do Visual, para o capítulo
`summary-quimica-geometria-molecular`, e a primeira em WebGL. A PCR e a Lei de
Lenz desenham em Canvas 2D. Esta foi feita como teste, a pedido da Ana Júlia,
para comparar as duas técnicas no iPad antes de decidir o padrão das próximas.

## O que a cena mostra

| Etapa | Leitura | O que acontece |
| --- | --- | --- |
| 01 Linear | 180° | CO₂: duas nuvens ficam em lados opostos |
| 02 Trigonal | 120° | BF₃: entra a terceira nuvem, as três dividem o plano |
| 03 Tetraedro | 109,5° | CH₄: a quarta nuvem tira a molécula do plano |
| 04 Pirâmide | 107° | NH₃: uma ligação vira par livre e fecha o ângulo |
| 05 Polar | 104,5° / μ = 0 | H₂O polar contra CO₂ apolar, com os dipolos à mostra |

Uma molécula vira a seguinte: as quatro nuvens ocupam sempre as mesmas posições
(`vseprStages.ts`), e só se move o que a repulsão explica. Ângulos, contagem de
nuvens e polaridade saem de `src/lib/geometriaMolecular.ts`; `vseprStages.test.ts`
confere que as direções da cena reproduzem cada ângulo.

## Como foi feita

- **Não é uma base nova.** O aplicativo já tinha um estúdio three.js nas cenas
  do Hoje (`src/features/daily-plan/cenas/estudio3d.ts`), aprovado depois de
  várias rodadas: renderizador único compartilhado, papel milimetrado, traço a
  tinta, desenho só quando algo muda. `motorVsepr.ts` monta sobre ele. Um
  segundo contexto WebGL traria de volta o travamento do iPad que o
  renderizador único resolveu.
- **Mudança no estúdio:** `redesenhar(comSombra)` refaz o mapa de sombra quando
  a peça muda de forma no lugar. Sem o argumento, o comportamento do Hoje é o
  mesmo de antes.
- **Casca comum:** `ImmersiveShell` ganhou `stage` (palco próprio no lugar do
  canvas 2D), `onTurn` e `footNote`. Etapas, previsões, tintas e pausa são as
  mesmas das outras cenas.
- **Nada se mexe sozinho.** O laço roda durante a transição ou o gesto e para.
- **Enquadramento medido.** A molécula ocupa o espaço que sobra entre título,
  leitura, ferramentas e texto, lido da própria tela a cada desenho.
- **Sem WebGL**, a cena fica com o texto das etapas e avisa no rodapé; o
  esquema plano do capítulo continua a um toque.

## Método

`scripts/verify-molecule-immersion.mjs`, contra o build de produção, no
Chromium com renderização por software: celular 390×844, iPad 834×1112 e
desktop 1366×900, cada um em claro, escuro e `prefers-reduced-motion`.
Resultado bruto em `browser-results.json`.

Além do que as cenas 2D conferem (leitura de cada etapa, sobreposição entre
ferramentas, etiqueta, título, leitura, texto e previsão, foco de teclado,
console, rede, estouro), o roteiro mede o que o WebGL pode errar calado:

- o canvas tem tinta de fato (fração de pixels opacos lida do próprio quadro);
- há um canvas WebGL só;
- terminada a transição, o quadro não muda mais;
- arrastar gira a molécula;
- a etiqueta de exploração recebe o clique;
- pausada, a troca de etapa mostra direto o resultado.

## Resultado

Nove combinações: cinco leituras corretas, canvas desenhado em todas as etapas,
nenhuma sobreposição, estouro 0, ferramentas 44×44, foco `solid 2px`, repouso
depois da transição, giro por arraste e pausa conferidos.

## Defeitos achados na captura e corrigidos

- Título de três linhas cobria a leitura: títulos encurtados.
- Etiqueta de exploração em cima da molécula: saiu de cima dela (ao lado do
  texto no iPad, logo acima dele no celular e no computador).
- Etiqueta desbotada e sem clique sob o degradê do bloco de texto: subiu de camada.
- De frente, uma ligação se escondia atrás do átomo central e o CO₂ apontava
  para a câmera: ângulo inicial trocado.
- Símbolo do átomo central encostado no do ligante ("O C"): foi para baixo do átomo.
- No celular a molécula saía do tamanho de um ícone: a cena ganhou 70 px.
- "Polaridade" quebrava no trilho do celular: "Polar".
- O laço seguia meio segundo além do movimento visível: assentamento mais cedo.
- O próprio roteiro acusava movimento que era dos pontos pulsando em CSS por
  cima do canvas: passou a comparar o quadro do WebGL.

## O que não foi conferido

- **iPad de verdade.** É o ponto do teste: fluidez, aquecimento e bateria só
  se medem no aparelho. Aqui o WebGL rodou por software.
- Safari; fundos "aurora" e "grade".
- Ir do Visual para o Hoje e voltar com as duas cenas usando o mesmo
  renderizador foi coberto só pelos testes de componente, não por captura.
- O texto de Química não passou por revisão de especialista.
