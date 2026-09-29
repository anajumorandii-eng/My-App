# Ainda travando: shaders recompilados a cada gesto (29/09/2026)

A Ana Júlia voltou com "Ainda tá travando" depois do #239 (renderizador
compartilhado) e do #240 (laboratório das doze matérias).

## Como foi medido

Build de produção, viewport de iPad em paisagem (1180×820, 2×) e CPU quatro
vezes mais lenta pelo DevTools. O roteiro clicou as doze abas do Hoje duas
vezes, e em cada troca somou as tarefas longas e anotou o pior intervalo entre
quadros. Depois repeti tudo com o WebGL desligado, para separar o custo da cena
3D do custo do resto da tela. O perfil de CPU de cada volta foi lido por função.

## O que o perfil mostrou

1. **Os programas de shader eram recompilados sem parar.** Na segunda volta,
   8,1 s dos ~19 s ocupados eram `getProgramInfoLog`, a espera do fim de uma
   compilação. O `descartar()` do estúdio chamava `material.dispose()`, e o
   three.js apaga o programa quando nenhum material o usa mais. Cada aba e cada
   gesto refaz as peças, então o programa era apagado e compilado de novo logo
   em seguida. O renderizador compartilhado do #239 nunca chegou a guardar
   nada. Medido na versão publicada: 10 movimentos do controle recompilavam de
   28 a 35 programas, com travadas de até 380 ms.
2. **O cartão da decisão inteiro tinha `layout` do Framer Motion.** Cada troca
   de aba media a árvore toda (`measureScroll`, `getBoundingClientRect`), por
   ~200 ms com a CPU desacelerada, mesmo sem a cena 3D.
3. **A reserva montava à toa.** A reserva, o Núcleo do Crivo, era também o
   `fallback` do `Suspense`. Na primeira visita a cada aba o Núcleo montava
   inteiro (canvas, medição da tela, laço de animação) só para ser trocado pela
   cena um instante depois.
4. **A sonda de WebGL criava um contexto novo a cada troca de aba.**
5. **Menores:**
   - o mapa de sombra (4 MB na GPU) de cada montagem nunca era liberado;
   - o laço de `requestAnimationFrame` acordava 60 vezes por segundo com a
     tela parada, sem desenhar nada;
   - `checkShaderErrors` obrigava a esperar cada compilação terminar ali
     mesmo.

## O que mudou

- `descartar()` libera geometria, textura e mapa de sombra, mas **não o
  material**. O material vai embora com o coletor de lixo, e o programa fica
  no cache para o próximo material igual. São poucas variantes, então o cache
  não cresce.
- O cartão da decisão perdeu `layout`, e a transição virou
  `transition-[transform,box-shadow]` em vez de `all`.
- O `fallback` do `Suspense` virou um palco vazio. O Núcleo continua como
  reserva para quando o WebGL falha.
- A sonda de WebGL roda uma vez por página e libera o contexto de teste.
- As cenas das outras abas são baixadas numa pausa, depois da primeira.
- O quadro é pedido só quando algo muda.
- As variantes de material são pré-compiladas numa pausa do app, **uma por
  pausa**. Compiladas todas juntas, elas viraram um bloco que caiu em cima do
  toque seguinte: o ócio do navegador demorou mais de cinco segundos a chegar.

## Antes e depois

CPU 4× mais lenta, WebGL por software (os números absolutos exageram o custo de
GPU; a comparação é o que vale).

| | Antes | Depois |
| --- | --- | --- |
| Segunda visita a uma aba, tarefas longas | 0,5–1,5 s | 0,05–0,15 s (Física até 0,4 s) |
| 10 movimentos do controle, programas recompilados | 28–35 | 0 |
| 10 movimentos do controle, maior travada | 300–380 ms | 0–105 ms |
| Tela parada, desenhos WebGL em 3 s | 0 | 0 (e sem o laço acordando) |

A primeira visita a algumas abas ainda compila de 1 a 8 programas. Aqui isso
custa até 1 s, porque o SwiftShader compila na CPU; no iPad, que compila na
GPU, deve custar bem menos. É uma vez por sessão, e a pré-compilação em pausas
cobre a maior parte quando a estudante fica alguns segundos na primeira aba.

## Lição

A correção do #239 mediu o sintoma certo (compilação na troca de aba) e mudou a
peça errada. O contexto compartilhado era necessário, mas não suficiente,
porque o cache morria no `dispose()`. Desta vez a prova foi contar
`linkProgram` por fase: é esse número que diz se o cache funciona, não o tempo
total.
