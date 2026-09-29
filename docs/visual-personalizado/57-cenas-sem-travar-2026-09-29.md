# Cenas do Hoje sem travar no iPad (29/09/2026)

A Ana Júlia gravou o iPad trocando de aba no Hoje: "está travando muito". Nos
quadros da gravação aparecem as cenas trocando aos solavancos, e até um quadro
preto no meio da troca.

## Medição

Tarefas longas (tempo em que a tela fica bloqueada) na troca de aba, medidas no
Chromium com WebGL por software, a 1180 px e densidade 2×. Os números absolutos
exageram, porque aqui o desenho roda na CPU; a comparação entre antes e depois é
o que vale.

| Aba | Antes: 1ª visita | Antes: 2ª visita | Depois: 2ª visita |
| --- | --- | --- | --- |
| Matemática | 0,8 s | **7,9 s** | 0,7–1,0 s |
| Biologia | 0,5 s | **4,8 s** | 0,9 s |
| Química | 0,5 s | **4,3 s** | 0,9–1,1 s |
| Física | 5,0 s | **4,9 s** | 1,2–2,1 s |

Com a medição separando montagem e desenho, a montagem das peças ficou entre
5 e 50 ms. O resto é o desenho, que no aparelho vai para a placa de vídeo.

## Causas e correções

- **Um contexto WebGL por troca de aba.** Cada troca criava um contexto novo e
  recompilava do zero todos os programas de sombreamento; é o que fazia a
  segunda visita ser pior que a primeira. O quadro preto da gravação é a troca
  de contexto. Agora há um renderizador só, reaproveitado por todas as cenas
  (`rendererCompartilhado` em `estudio3d.ts`), e o three.js guarda os programas
  já compilados.
- **Vidro da lente com transmissão física.** A transmissão desenhava a cena
  inteira uma segunda vez a cada quadro e era o programa mais pesado de
  compilar. Por isso Física era a aba mais lenta até na primeira visita. Agora
  é vidro transparente com reflexo e verniz, e continua lendo como vidro.
- **Sombra.** O VSM desfocava o mapa de sombra em várias passadas a cada
  desenho. Agora é PCF suave, e o mapa só é refeito quando a cena muda: girar a
  molécula não recalcula a sombra.
- **Pixels.** A densidade vai até 2×, mas sem passar de cerca de 1.600 pixels
  de largura desenhada. No iPad em paisagem, a coluna a 2× passava de 2.000.
- **Tudo refeito ao carregar a fonte.** A cena era montada duas vezes em toda
  abertura; agora só é refeita se a fonte ainda não tinha chegado.
- **Texturas desenhadas.** A régua da bancada (mais de 2.000 pixels), o papel
  da mesa e o metal escovado agora são desenhados uma vez por tema e guardados.
- **A aba antes da cena.** A cena é montada no quadro seguinte ao toque. Antes,
  a aba só mudava de cor depois de a cena inteira estar pronta, e o toque
  parecia não pegar.

Conferido depois das mudanças: as quatro cenas renderizam nos dois temas. A
bancada responde ao controle depois de ir e voltar entre abas: p = 18 cm dá
p′ = 22,5 cm.
