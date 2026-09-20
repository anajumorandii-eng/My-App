# Instrumento de sólidos

Data: 2026-09-20  
Base: `origin/main` em `c71c6b9`

## O que entrou

Um instrumento manipulável para cinco capítulos de Matemática, cada um com o
sólido do capítulo e as medidas nas mãos da estudante. A matriz de cobertura
(`18-matriz-cobertura.md`) passou de 22 para 27 instrumentos e de 353 para 348
lacunas; Matemática foi de 49 para 44 lacunas.

| Capítulo | Instrumento | O que se mexe | Leitura que a manipulação revela |
| --- | --- | --- | --- |
| Cubos e Paralelepípedos | `cubos-paralelepipedos` | a, b, c | diagonal principal (usa as três dimensões; a da face usa duas) |
| Prismas | `prismas` | lados da base, ℓ, h, inclinação | volume, que não muda quando o prisma inclina |
| Pirâmides | `piramides` | lados da base, ℓ, h, corte t | volume, um terço do prisma; pirâmide menor (t³) e tronco |
| Sólidos de Revolução | `solidos-de-revolucao` | cilindro, cone ou esfera; r, h | volume de cada um e a fração do cone |
| Razões entre Volumes de Sólidos | `razoes-entre-volumes` | aresta, razão k | razão de volumes k³, com a de áreas k² |

**Ficou de fora de propósito:** *O Universo Tridimensional*. O capítulo trata de
posições relativas de retas e planos, perpendicularismo e perspectiva, não de
sólidos. Continua lacuna honesta, e `registry.test.ts` o nomeia.

O critério é o do registro de instrumentos: só entra onde o instrumento é o
objeto do capítulo. Os textos dos capítulos foram lidos antes de decidir o
mapeamento.

## Onde está

- `src/lib/solids.ts`: as contas. Os testes usam os exemplos resolvidos dos
  próprios capítulos (paralelepípedo 3 × 4 × 12 com diagonal 13, pirâmide de base
  6 e altura 4 com volume 48, cilindro r = 5 e h = 12 com 170π, cubos
  semelhantes 3:2 com 40 → 135).
- `src/lib/solidInstruments.ts`: controles, faixas, leituras e fórmulas.
- `src/lib/solidDrawing.ts`: a geometria, já enquadrada na tela.
- `src/views/visual-instruments/SolidInstrument.tsx` e `.css`: a prancha, sobre
  o `BoardShell`, com os mesmos controles e leituras dos outros instrumentos.
- Registro em `src/views/visual-instruments/registry.ts`.

## Decisões

- **Escala fixa por instrumento**, a do pior caso de todos os controles, para que
  dobrar a altura se veja como dobro. Só a razão entre volumes ajusta a escala,
  porque o que ela mostra é a proporção entre dois cubos. Em ambos os casos o
  desenho fica centrado.
- **O prisma inclinado não mostra área lateral.** A do prisma oblíquo é uma soma
  de paralelogramos e pede outra conta; mostrar a do prisma reto seria dar um
  número errado. O volume, que é o ponto do capítulo, continua na tela.
- **A cota de altura é uma linha de dimensão fora do sólido**, com marcas nas
  pontas. A altura é sempre a perpendicular ao plano da base.
- **Sem animação.** O instrumento não tem movimento próprio, então não há o que
  reduzir para `prefers-reduced-motion`.

## Verificação

Automática:

- 37 testes de `node:test` em `src/lib` (contas, configuração e desenho). Um
  deles percorre todos os extremos dos controles e falha se qualquer forma sair
  do `viewBox`.
- 9 testes de `vitest` do componente e 6 do registro, incluindo "cada instrumento
  de sólidos alcança exatamente o seu capítulo" e o contraste de texto do bordô.
- A matriz de cobertura é regenerada por `npm run visual:matrix` e o teste
  falha se `18-matriz-cobertura.*` divergir do código.

No navegador (Vite local, Chromium, `/visual?summary=<id>`): 5 capítulos × 3
larguras (1440, 834 e 390 px) × 2 temas = 30 combinações abertas sem overflow
horizontal, sem erro de console e com uma interação real por teclado (setas no
primeiro controle) alterando as leituras. Capturas em
`screenshots/solidos/`.

### Defeitos que só a captura mostrou

Passaram por testes verdes e foram corrigidos, cada um com teste novo:

1. A cota de altura caía sobre a aresta vertical da frente do prisma e a
   escondia.
2. Com o sólido ancorado no chão, o cartão ficava meio vazio em cima.
3. A aresta escondida de trás, tracejada, era pintada por cima da visível da
   frente (mesmo x na tela). As formas agora seguem uma ordem de camadas.
4. A face de cima do prisma, vista de cima, mostrava as arestas de trás como
   escondidas.
5. No tema escuro o bordô do tema (`#852636`) tem cerca de 2:1 sobre o cartão: os
   valores dos controles e o preenchimento dos sliders quase sumiam. O
   instrumento clareia o bordô só no escopo dele (`#e0788d`, cerca de 6:1). As
   pranchas dos outros instrumentos usam a mesma cor e provavelmente têm o mesmo
   problema no tema escuro; não foram tocadas.

### O que não foi verificado

- Leitor de tela real: os controles têm rótulo, faixa e passo declarados
  (testado), mas ninguém ouviu a prancha em NVDA, VoiceOver ou TalkBack.
- Toque em dispositivo físico; a validação móvel foi por viewport de 390 px.
- WebKit e Firefox. Só Chromium.
- Comparação lado a lado com as cinco referências aprovadas: elas são de
  Termodinâmica, Fotossíntese e Newton, sem equivalente para sólidos.

## O que sobra em Matemática

44 lacunas, em aglomerados. O próximo candidato de maior alcance é a geometria
plana; cada capítulo precisa ser lido antes de decidir se um instrumento é de
fato o objeto dele.

| Aglomerado | Capítulos |
| --- | ---: |
| Geometria plana (ângulos, semelhança, triângulo retângulo, áreas, trigonometria) | 17 |
| Álgebra (técnicas, igualdades, desigualdades, modelagem, inequações) | 6 |
| Matrizes e sistemas | 5 |
| Aritmética (razão, porcentagem, numeração, inteiros) | 4 |
| Contagem e probabilidade | 4 |
| Estatística | 2 |
| Progressões (PA e PG) | 2 |
| Funções (composição, bijetoras) | 2 |
| Cônicas | 1 |
| O Universo Tridimensional | 1 |
