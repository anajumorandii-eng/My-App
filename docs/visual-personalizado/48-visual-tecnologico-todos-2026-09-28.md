# Visual tecnológico em todos os capítulos, com personalização e busca rápida (28/09/2026)

Registro exigido pela regra de entrega do padrão visual
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`). Continua o doc 47.

## Origem

A Ana Júlia aprovou o piloto dos cinco capítulos de Física: "Agora sim, cada
vez mais tecnológico, mais interações e personalizações. Pode começar."

## 1. A moldura e o ambiente valem para os 613 capítulos

`usaMolduraTecnologica` passou a valer para todo capítulo. Como a moldura e o
ambiente já liam uma fonte única, a extensão foi uma linha.

- **A cor de cada capítulo sai sozinha,** pela matéria e pelas regras de
  conteúdo de `lib/visualAmbiente.ts`.
- **As regras agora são por matéria.** "Dinâmica de populações", de Biologia,
  casava com "dinâmica" e saía na cor da mecânica da Física. Cada regra lista
  as matérias em que vale, e um teste fixa o caso.
- **Tipografia única.** Com a moldura em todos os capítulos, sobravam títulos
  em Newsreader e rótulos em Kalam nas cenas que não usam o kit. Na tela
  tecnológica:
  - títulos e texto de SVG usam Space Grotesk;
  - dados, código e anotações usam JetBrains Mono;
  - texto SVG com fonte declarada no próprio elemento fica como está.

## 2. Personalizar

Um painel no topo de cada capítulo e da biblioteca. Aplica na hora e fica
salvo no aparelho (`crivo_visual_preferencias`).

**Cor:**

- **Automática:** matéria + conteúdo, o padrão. O painel mostra de onde veio
  ("matéria + conteúdo: espaço").
- **Só a matéria:** sem ajuste pelo conteúdo.
- **Paletas fixas:** Neon, Aurora, Solar, Floresta e Oceano, com o nome do que
  a cor lembra, e não de matéria.

**Efeitos:**

| Nível | O que faz |
| --- | --- |
| Completo | Partículas, luz que segue o dedo e cartões que inclinam. |
| Suave | Sem partículas nem inclinação. Poupa bateria. |
| Mínimo | Nada se move. |

O movimento reduzido do sistema continua desligando tudo, qualquer que seja a
escolha.

**Fundo:** aurora, grade ou liso. Vale para a tela inteira e para a prancha.

Preferência gravada que não seja reconhecida (chave antiga ou JSON quebrado)
volta ao padrão, e um teste cobre isso.

## 3. Busca rápida (⌘K)

- **Como abrir:** ⌘K ou Ctrl+K em qualquer ponto do Visual, ou o botão
  "Buscar".
- **O que busca:** matéria, tópico e título primeiro, e também a visão geral e
  os títulos das seções.
  - "mitose" não achava nada, porque o capítulo se chama "Divisão Celular".
  - Agora acha, e um teste fixa o caso.
  - Ignora acento e ordem das palavras.
- **Sem texto:** mostra os seis capítulos abertos por último
  (`crivo_visual_recentes`).
- **Na lista:** cada resultado traz um ponto aceso na cor do ambiente que vai
  abrir.
- **Teclado:** setas navegam, Enter abre e Esc fecha.

## 4. Biblioteca no mesmo ambiente

A biblioteca veste a cor da matéria filtrada, ou a padrão em "Todas". Antes,
sair de um capítulo apagava o ambiente de uma vez.

- O cabeçalho e os cartões são de vidro.
- Cada cartão tem uma faixa acesa na cor do próprio capítulo.
- Buscar e Personalizar ficam no cabeçalho.

## Como foi conferido

- **Interações no navegador,** claro e escuro, no iPad:
  - abrir Personalizar e trocar para Solar;
  - voltar para Automática;
  - ⌘K, digitar e abrir com Enter;
  - biblioteca filtrada em Biologia.
- **Amostra de 40 capítulos,** três por matéria, no escuro. Achou os dois
  defeitos que viraram regra: tipografia misturada e a regra de conteúdo
  atravessando matéria.
- **Varredura dos 613 capítulos:** o resultado está na seção abaixo.
- **Testes novos:**
  - `BuscaRapida.test.tsx`: busca por texto, acento, Enter, recentes e
    preferências inválidas;
  - `visualAmbiente.test.ts`: paletas fixas, "só a matéria" e regra por
    matéria.
- **Checagens:**
  - `npm run lint` limpo;
  - `npm test` verde (718 node:test e 746 vitest);
  - `npm run build` sem erro.

## Pendente

- Hoje, Resumos, Questões e Caderno ainda estão no estilo anterior.
- Aprovação da Ana Júlia deste conjunto.
