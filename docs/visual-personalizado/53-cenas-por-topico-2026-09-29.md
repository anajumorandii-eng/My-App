# Cenas por tópico e a dupla-hélice de Biologia (29/09/2026)

A Ana Júlia aprovou a bancada óptica no caderno e pediu as outras matérias.
Esta rodada muda a regra de onde a cena aparece e traz a primeira cena fora da
Física.

## A cena é do tópico, não da matéria

Registrada por matéria, a bancada abria em toda decisão de Física. Com
"Circuitos Elétricos" no dia, o cartão mostraria uma lente. É o mesmo erro de
emprestar ilustração de outro assunto que a regra do Visual proíbe.

- O registro (`CENAS_POR_TOPICO`, em `CenaDaMateria.tsx`) é por id de tópico.
- A bancada entra nas duas óticas: Geométrica e Instrumental e da Visão.
- Tópico sem cena própria fica com o Núcleo do Crivo. Na captura, Evolução
  aparece com o Núcleo.
- `CenaDaMateria.test.ts` confere duas coisas: todo id do registro existe, e
  Circuitos e Termodinâmica não recebem a lente.

## Dupla-hélice: Código Genético e Síntese Proteica

**A biologia é a real.** `src/lib/duplaHelice.ts` é módulo puro, em
`node:test`:

- **Medidas do DNA-B** dos livros: 10 pares por volta, 0,34 nm entre pares,
  3,4 nm por volta e 2 nm de diâmetro.
- **Pareamento** vem de `basePair`, o mesmo do instrumento de ácidos nucleicos
  do Visual. Uma segunda tabela de pareamento no app poderia discordar da
  primeira.
- **Sequência ilustrativa.** A tela avisa que é ilustrativa. Ela foi escolhida
  para a tradução ser conferível: o molde 3′-TAC GGC AAA ATT-5′ dá o RNAm
  5′-AUG CCG UUU UAA-3′, lido como metionina, prolina, fenilalanina e fim.
- **Tabela de códons parcial, de propósito.** Só os quatro que a sequência usa,
  porque uma tabela inteira seria conteúdo que nenhum teste da cena confere.

**Interação.** A estudante toca um degrau, ou usa o controle "Par em foco". A
leitura mostra:

- o par;
- as pontes de hidrogênio (2 em A–T, 3 em C–G), desenhadas na cor da matéria;
- a base que entra no RNA;
- o códon daquele trecho, com o significado.

Os rótulos à mão marcam as pontas 3′ e 5′ das duas fitas, antiparalelas.

**Simplificação declarada.** Os degraus passam pelo eixo, como no desenho dos
livros. Os sulcos maior e menor não aparecem, e por isso a cena não os nomeia.

**Cores das bases.** São as cores da logo: cobre, vinho, floresta e latão. As
quatro cores saturadas dos livros brigariam com o acento da matéria, que marca
o par em foco.

## Estúdio comum

`estudio3d.ts` reúne o que a bancada levou três rodadas para acertar:

- canvas transparente, sem pós-processamento;
- luzes de estúdio;
- contorno a tinta;
- folha da mesa que some em degradê;
- rótulos em HTML presos à cena;
- desenho só quando algo muda.

A bancada foi reescrita sobre ele sem mudar peça nenhuma. A captura
`bancada-depois-do-estudio` confere isso. Cada cena nova traz só as peças dela.
Por isso a hélice já nasce parada, fundida ao cartão e em papel e tinta.

## Pendente

- Química, Matemática e as outras matérias, cada uma no tópico em que o objeto
  da cena é o assunto.
- O Núcleo do Crivo, que é a reserva de quem não tem cena, ainda é néon sobre o
  papel.
