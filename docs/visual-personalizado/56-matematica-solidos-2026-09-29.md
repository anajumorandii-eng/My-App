# Matemática: laboratório de sólidos geométricos (29/09/2026)

Quarta matéria com laboratório no cartão do Hoje, e a última das quatro
ciências. Pela regra por matéria, ele aparece na aba de Matemática qualquer que
seja o tópico do dia, com o rótulo "Laboratório de Matemática".

Geometria espacial foi a escolha porque é a parte do programa que só se lê
inteira em três dimensões: prisma e cilindro, de frente, são o mesmo retângulo,
e pirâmide e cone o mesmo triângulo.

## A matemática é a real

`src/lib/solidos.ts` é módulo puro, em `node:test`, com prisma e pirâmide de
base quadrada, cilindro, cone e esfera, todos na base de medida 3. Os testes
conferem:

- **Valores dos livros:** cilindro r = 3 e h = 4 dá 36π; cone r = 3 e h = 4 dá
  geratriz 5 e 12π; esfera r = 3 dá 36π.
- **As relações que a prova cobra:** o cone é um terço do cilindro e a pirâmide
  um terço do prisma, em qualquer altura.
- **As medidas auxiliares:** a geratriz e o apótema saem de Pitágoras.
- **A escrita:** π separado, com a aproximação ao lado ("12π ≈ 37,7").

**Só a altura varia.** Com duas variáveis na mão, a relação que o controle
mostra se perdia: o volume cresce em linha reta com a altura.

## A cena

- O sólido fica sobre a folha, em papel tingido pela tinta da matéria, com
  contorno a tinta.
- As cotas de altura e de base (h, r ou ℓ) e a medida auxiliar (g ou ap) vêm à
  mão.
- A esfera ganhou um equador a tinta: sem aresta, lia como um disco.
- A estudante troca o sólido, muda a altura e gira com o dedo. Nada gira
  sozinho.

## Conferência pelo caminho real

Seguindo a lição da rodada anterior, a conferência foi feita clicando a aba
Matemática do Hoje, não por atalho:

- a 390 px e 1180 px, nos temas claro e escuro;
- cinco sólidos × duas alturas × três giros;
- 120 quadros com os rótulos medidos: nenhuma colisão.

Os valores lidos na tela com h = 8 batem com a conta à mão:

| Sólido | Volume | Área total | Auxiliar |
| --- | --- | --- | --- |
| Prisma | 72 | 114 | — |
| Cilindro | 72π | 66π | — |
| Pirâmide | 24 | 57,84 | apótema 8,14 |
| Cone | 24π | 34,63π | geratriz 8,54 |
| Esfera | 36π | 36π | — |

A captura mostrou dois defeitos, já corrigidos:

- **Topo do sólido no rótulo.** Com altura 8, o topo encostava em
  "Laboratório de Matemática"; o enquadramento abriu.
- **Sólido cinza no tema claro.** A luz do papel creme lavava a tinta e o
  sólido saía cinza; a mistura com a cor da matéria subiu.
