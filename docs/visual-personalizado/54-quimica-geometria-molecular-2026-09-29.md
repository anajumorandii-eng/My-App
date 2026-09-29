# Química: geometria molecular no cartão do Hoje (29/09/2026)

Terceira matéria com cena própria. Ela entra no tópico "Polaridade das Ligações
e Geometria Molecular" (`qui_polaridade_geometria`), porque ali a forma da
molécula no espaço é o próprio assunto. Soluções e Estequiometria, por exemplo,
não recebem a molécula; `CenaDaMateria.test.ts` confere isso.

## A química é a real

`src/lib/geometriaMolecular.ts` é módulo puro, em `node:test`, com cinco
moléculas:

| Molécula | Geometria | Ângulo | Nuvens no átomo central | Polaridade |
| --- | --- | --- | --- | --- |
| CO₂ | linear | 180° | 2 | apolar |
| BF₃ | trigonal plana | 120° | 3 | apolar |
| CH₄ | tetraédrica | 109,5° | 4 | apolar |
| NH₃ | piramidal | 107° | 4 (1 par livre) | polar |
| H₂O | angular | 104,5° | 4 (2 pares livres) | polar |

- **Direções calculadas.** As direções das ligações são calculadas para dar o
  ângulo dos livros, e o teste mede o ângulo entre os vetores. Para a pirâmide:
  cos θ = 1 − 1,5 sen²β.
- **Polaridade não é um campo escrito à mão.** Ela sai da soma dos vetores das
  ligações: se a soma é zero, a molécula é apolar. O teste confere que essa
  conta bate com o que os livros dizem das cinco.
- **Simplificação declarada.** Em cada molécula os ligantes são iguais, então
  cada ligação pesa o mesmo na soma. Ligantes diferentes pediriam
  eletronegatividades, que a cena não usa.

## A cena

A molécula aparece em bolas e varetas, com as cores dos elementos em tons do
caderno.

- **Pares livres** são nuvens translúcidas na cor da matéria, cada uma com os
  seus dois elétrons.
- **O ângulo** é marcado com um arco entre duas ligações e o valor escrito à
  mão.
- **Sequência de estudo.** A estudante troca a molécula em cinco botões. A
  ordem CH₄ → NH₃ → H₂O é a dos livros: as mesmas quatro nuvens, e cada par
  livre fecha o ângulo.
- **Girar só com o dedo.** O arraste horizontal gira a molécula; o vertical
  continua rolando a página. Vista de frente, a pirâmide da amônia parece um
  triângulo plano, então girar é parte do assunto. Nada gira sozinho.
- **Redesenho sem remontar.** O estúdio ganhou `redesenhar()`, que desenha a
  cena de novo sem refazer as peças.

## Ajustes da captura

- **Molécula pequena no celular.** Com a câmera a 7 unidades, a molécula
  ocupava um terço do palco. Agora a câmera se aproxima e mira um pouco acima do
  centro, para o átomo de cima não encostar na borda, que se dissolve.
- **Rótulo do átomo central.** Em cima do átomo, o rótulo caía sobre o par
  livre da amônia. Foi para o lado.

- **Rótulos se atropelando no giro.** Apontado na revisão automática do PR:
  girando, o ângulo caía sobre o rótulo de um átomo ("109,5°H" no metano). A
  causa é que um ponto fixo na cena não garante espaço livre na tela. O estúdio
  agora põe os rótulos na ordem configurada, e quem colide com um já posto
  desce até ficar livre. A medição foi de 80 quadros (cinco moléculas × oito
  giros, no celular e no iPad): 13 com colisão antes da correção, nenhum
  depois. A correção vale para todas as cenas.

Capturas `molecula-*` em `screenshots/cenas-3d-2026-09-29/`.
