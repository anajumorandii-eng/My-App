# Piloto tecnológico — cinco capítulos de Física (27/09/2026)

Registro exigido pela regra de entrega do padrão visual
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`). Continua o
`46-piloto-estetica-fisica-2026-09-27.md` e substitui a direção dele.

## A direção

A Ana Júlia mandou três vídeos e pediu: "Quero assim, moderno e tecnológico.
Utilize todos os recursos possíveis para entregar esse app perfeito."

Os vídeos são de terceiros e não foram versionados: o repositório é público.
Os quadros extraídos mostram:

- **Portfólio imersivo:** fundo escuro, cartões de vidro flutuando em
  profundidade, luz dourada e partículas, letreiro grande.
- **Bibliotecas de componentes:** título que se decodifica letra a letra,
  fundo líquido, botões com brilho, dados em monoespaçada.
- **Site de produto contado pela rolagem:** tipografia grande e apertada,
  objeto no centro, blocos que entram em sequência.

A moldura de caderno ilustrado (doc 46) saiu. O que ficou dela é estrutural:
a cena no alto, o kit compartilhado e a moldura opcional só para os cinco.

## O que foi feito

### A troca custou um arquivo, não cinco cenas

As cenas usam `Painel`, `Bola`, `Nota`, `Pilula` e os tons de
`illustrationKit.tsx`. O kit foi reescrito no traço tecnológico, e as cinco
cenas mudaram sem ser redesenhadas.

| Peça do kit | Caderno (antes) | Tecnológico (agora) |
| --- | --- | --- |
| `Papel` | Papel pontilhado | Grade fina de HUD |
| `Painel` | Borda colorida com etiqueta | Vidro com cantoneiras e rótulo monoespaçado com ponto aceso |
| `Bola` | Lápis de cor com contorno | Esfera brilhante com reflexo e halo |
| `Nota` | Seta curva manuscrita | Chamada de HUD: ponto no alvo, linha em cotovelo, texto monoespaçado |
| `Pilula` | Estrela | Chip de vidro com ponto pulsando e traço de luz embaixo |
| filtro | Traço trêmulo | Halo de neon |

Os tons (ciano, violeta, rosa, âmbar, esmeralda, laranja) clareiam na lousa e
escurecem no vidro branco.

### A moldura (`BoardShell tecnologico`)

- **Fundo:** aurora de três focos de luz que deriva devagar, sobre quase
  preto no escuro e branco-azulado no claro.
- **Partículas:** campo em canvas atrás do cabeçalho. Os pontos derivam, se
  ligam quando ficam próximos e fogem do ponteiro.
  - Foi feito em canvas 2D, e não em WebGL: não há three.js no projeto, e um
    motor 3D inteiro por um fundo não se paga no iPad.
  - Para quando sai da tela ou a aba fica oculta.
- **Luz que segue o ponteiro:** um halo de ciano ilumina o vidro perto do
  dedo ou do mouse.
- **Título:** Space Grotesk grande e apertado. Entra desfocando para o nítido
  e tem um brilho que percorre as letras.
- **Rótulo do laboratório:** monoespaçado, com ponto aceso.
- **Condição:** mostrador de vidro em JetBrains Mono. Ao mexer no cursor, o
  valor passa por símbolos e assenta no número novo, o efeito de letreiro dos
  vídeos.
  - A primeira renderização já mostra o valor certo.
  - Com movimento reduzido não há embaralhamento: o número nunca fica
    escondido.
- **Pincel:** vira um feixe de luz que percorre a linha.
- **Cena, cartões, fórmula e ideia central:** vidro, com `backdrop-filter`.
- **Cartões:**
  - inclinam em 3D sob o ponteiro;
  - trazem ícone do estágio (lucide): lâmpada, livro, engrenagem, alvo e
    lápis;
  - mantêm a cor do par, verde à esquerda e laranja à direita, e o estado
    segue na linha de baixo;
  - razão: a leitura de cor precisa significar o mesmo em todas as pranchas.
- **Controles:** cursor e leituras em ciano e monoespaçada; a leitura que
  decide tem brilho.
- **Entrada em cascata:** cada bloco sobe e desfoca para o nítido, em
  sequência.
- **Movimento reduzido:** desliga todas as animações e a inclinação.

Space Grotesk e JetBrains Mono entraram no `<link>` do `index.html`. As duas
foram conferidas com `curl` na URL do servidor de fontes: a resposta traz as
duas famílias.

## Achados da captura, corrigidos

- **Valor do mostrador miúdo.** O `span` do valor herdava a regra do rótulo
  (`.vs-q-callout span`) e saía em caixa alta miúda.
- **Mostrador no celular.**
  - A regra base prende o selo em 74 px.
  - Isso partia "orbita" em "orbi/ta" e "27 × 10¹⁰ J" em três linhas,
    espremendo o título.
  - Abaixo de 560 px ele virou uma faixa horizontal sob o título.
- **Notas da balança.** Em monoespaçada ficaram mais largas e encostavam na
  base da balança e no fiel. Foram reduzidas e reposicionadas.

## Como foi conferido

- **Cenas:** iPad (1194×834), claro e escuro, com o cursor no mínimo, no meio e
  no máximo (`cenas-cursor-grade.png`).
- **Pranchas inteiras:** iPad, claro e escuro. Órbitas também com movimento
  ligado e o ponteiro sobre a prancha, para ver as partículas e a luz.
- **Celular:** 390 px, órbitas no claro e massa-energia no escuro. Nenhuma
  rolagem lateral e nenhum erro de página.
- **Medição:** texto sobre texto e texto fora do quadro nos cinco capítulos,
  em 1440 claro e 390 escuro. Nenhum achado.
- **Checagens:** `npm run lint` limpo; `npm test` verde (711 node:test e 739
  vitest).

No ambiente remoto o servidor de fontes é bloqueado, então as capturas mostram
fontes de fallback. No aparelho da Ana Júlia o título sai em Space Grotesk e
os números em JetBrains Mono.

## Pendente

- **Aprovação da Ana Júlia** desta direção nos cinco capítulos.
- **O resto do app.** Ela pediu o app inteiro. O que está em volta da prancha
  continua no estilo anterior, e fica claro nas capturas:
  - navegação lateral e superior;
  - painel "Diagnóstico vivo";
  - Hoje, Resumos, Questões e Caderno.

  Se a direção for aprovada, a ordem proposta é:
  1. tokens globais de tema (fundo, vidro, tipografia);
  2. navegação;
  3. as demais telas;
  4. a moldura `tecnologico` como padrão das 613 pranchas.
