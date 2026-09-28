# App inteiro no ambiente tecnológico (28/09/2026)

Continua o doc 48. Com o Visual aprovado, a Ana Júlia autorizou o passo
seguinte: levar o mesmo ambiente para o resto do app ("Pode começar").

## O problema de arquitetura

O ambiente nasceu dentro do Visual e escrevia direto no `<html>`. Com o app
inteiro usando o ambiente, dois escritores disputariam o mesmo atributo:

- o layout pintaria a cor padrão;
- o Visual, a cor do capítulo;
- a limpeza de um apagaria o ambiente do outro.

**Agora há um escritor só,** o `AmbienteProvider`
(`src/design-system/ambiente/`), acima do layout.

- **Sem pedido de tela:** vale a cor escolhida no Personalizar (ou a padrão).
- **Tela com conteúdo:** pede o ambiente dele com `useAmbienteDaTela` e o
  solta ao sair.
- **Fora do provider** (teste, prancha solta): o hook aplica direto, como
  antes.

O CSS do ambiente saiu do `Visual.css` para
`src/design-system/css/ambiente-tecnologico.css`, importado pelo app. O
`Visual.css` só carrega com a tela do Visual, e o ambiente agora vale em toda
tela.

## As telas vestem o ambiente pelos tokens

As telas leem os tokens semânticos (`--surface-*`, `--text-*`,
`--border-subtle`, `--action-primary`, `--font-display`) pelo Tailwind. Sob o
ambiente, esses tokens são redefinidos, e Hoje, Plano, Resumos, Questões,
Caderno, Análises e as demais mudam sem tocar em cada tela:

- vidro nas superfícies;
- texto e bordas da paleta;
- botão de ação no tom da paleta escurecido, porque o neon puro com texto
  branco não passa em contraste.

**Resíduos do estilo editorial** foram levantados no navegador em 18 rotas,
listando todo elemento com texto em serif ou itálico, e corrigidos:

- **Título-herói em itálico:** o Space Grotesk não tem itálico, e o navegador
  inclinava a letra à força.
- **Serif:** abas de matéria, enunciado de questão (agora em Inter, por ser
  leitura longa), contador do cronômetro e cabeçalhos de trajetória.
- **Cores fixas no CSS, não token:** o botão principal dourado, a aba de
  matéria ativa, a placa preta do cabeçalho do capítulo nos Resumos e o fundo
  creme da "atmosfera" de matéria.

A segunda passada no navegador não achou nenhum elemento com texto em serif ou
itálico.

## Adaptável pela matéria e pelo conteúdo, fora do Visual

| Tela | De onde vem a cor |
| --- | --- |
| Hoje | Matéria da decisão em destaque, ou da aba escolhida |
| Resumos | Capítulo aberto (a mesma regra do Visual: "Órbitas" → espaço), ou a matéria filtrada na lista |
| Questões | Matéria filtrada |
| Visual | Capítulo aberto, ou matéria filtrada na biblioteca |
| Demais telas | A cor do Personalizar |

## Buscar e Personalizar no topo do app

Os dois botões saíram do Visual e foram para o topo, em qualquer tela. No
celular, eles ficam só com o ícone.

- **⌘K / Ctrl+K** vale no app inteiro.
- **A busca acha também telas pelo nome.** "caderno" leva ao Caderno de Erros.
  - Primeiro vêm as telas, depois os capítulos, numa lista só para o teclado.
- **Achado de acessibilidade, corrigido:** no celular o texto do Personalizar
  fica oculto, e o botão ficava sem nome para leitor de tela. Ganhou
  `aria-label`.

## Como foi conferido

- **Rotas:** Hoje, Plano, Resumos, Questões, Caderno e Análises no iPad, claro
  e escuro, com o tema pelo caminho do app. Nenhum erro de página e nenhuma
  rolagem lateral.
- **Interações,** em iPad e celular, claro e escuro:
  - Resumos com "Órbitas" aberto fica no ambiente "espaço";
  - Hoje fica em Física;
  - ⌘K com "caderno" e Enter leva a `/erros`;
  - Personalizar → Floresta aplica no app inteiro.
- **Testes novos:** `AmbienteProvider.test.tsx`, com três casos:
  - o padrão sem pedido de tela;
  - a tela pede e solta, sem apagar o ambiente do app (o bug que o escritor
    único evita);
  - a paleta escolhida vale fora das telas de conteúdo.

  O arquivo ficou em `src/views/visual-boards/`: `src/design-system` não está
  na lista do `test:vitest` e o teste nunca rodaria no CI.
- **Checagens:**
  - `npm run lint` limpo;
  - `npm test` verde (718 node:test e 749 vitest);
  - `npm run build` sem erro.

## Pendente

- Imagens raster antigas continuam como estão, por exemplo as fichas de papel
  envelhecido da "decisão recomendada" no Hoje. Trocá-las é redesenho de
  conteúdo, não de tema.
- Aprovação da Ana Júlia.

## Rodada 2 — identidade do Crivo e os erros do Hoje

A Ana Júlia aprovou o rumo e pediu duas coisas antes de seguir: não perder a
estética do app ("as cores da logo") e corrigir os pequenos erros, a começar
pela primeira tela.

### Identidade: as cores do ícone

O ícone é um astrolábio de cobre sobre uma diagonal vinho → floresta, com uma
estrela laranja no centro. O ambiente tecnológico estava em violeta e ciano
genéricos, que não são do Crivo.

- **A aurora de toda tela carrega a diagonal do ícone:** vinho no canto de cima
  e floresta no de baixo (`--marca-vinho`, `--marca-floresta`). A cor da
  matéria ou do conteúdo entra como destaque por cima, não no lugar. A prancha
  do Visual segue a mesma regra.
- **Paleta padrão "Crivo"** (cobre, vinho, floresta). Vale nas telas sem
  matéria e em "Todas", e é também a primeira paleta fixa do Personalizar.
- **Fundos:**
  - claro: marfim quente, o papel original do app, e não branco-azulado;
  - escuro: preto-esverdeado do ícone;
  - superfícies do escuro em neutro quente, e não azul-marinho.

### Hoje: o que não fazia sentido

| Antes | Problema | Agora |
| --- | --- | --- |
| "Você está em ritmo." sobre um gráfico | A curva era fixa no código; o leitor de tela anunciava "cresce de 42 para 74" sem dado nenhum. Mesma família de defeito da barra de 62% no CSS. | Painel "Hoje na agenda", só com dado real: tempo livre, próximo bloco, ações no plano e fila de espera. |
| "Próximo bloco às 23:11" | Sem janela na agenda, a hora era só "agora", logo abaixo do aviso "sua agenda não tem janelas". | Mostra a hora só quando há janela; senão, "Sem janela na agenda hoje." |
| Domínio, incerteza e sessão no painel lateral | Repetiam domínio, confiança (invertida) e tempo do cartão ao lado. | Saíram do painel lateral. |
| "perfil wave · foco ativo" | Nome interno, em inglês, da família de cor da paleta. | Fase real e próxima prova: "Reta final · Unicamp em 20 dias". |
| "DADOS REAIS · DECISION" no topo | Selo de depuração. | Removido. |
| "Validar resultado — Proteja a próxima janela de estudo" | O texto não dizia o que o botão faz (abre Revisões). | "Revisar o que venceu — Revisões espaçadas marcadas para hoje." |
| "Testar representação — Instrumentos para ler…" | O botão abre o banco de questões. | "Treinar em questões." |
| Imagem do tópico | Cobria "Discordo" (e "Por que isso?" no celular). | Imagem à direita; botões na frente, com fundo de vidro. |
| Abas de matéria | "Atualidades" caía sozinha numa segunda linha. | Uma fileira que rola de lado. |
| Cartão da decisão | Altura mínima de 540 px, pensada para a ilustração antiga, deixava um vão vazio no iPad. | 440 px. |

**Robustez.** Metas sem bancas (documento antigo, ou ainda carregando)
derrubariam o Hoje ao calcular a fase. Agora o selo só omite a contagem. Foi
achado pelo teste do Hoje, cujo mock de metas não tem bancas.

### Varredura dos 597 capítulos e medição com as fontes reais

- **Rolagem lateral no celular (39 capítulos): era minha.** O mostrador da
  condição não quebrava linha, para "27 × 10¹⁰ J" caber numa linha; em
  capítulos onde a condição é uma frase, esticava a prancha a 714 px.
  - Agora só valor curto fica numa linha (`data-frase` para mais de 18
    caracteres).
  - O contêiner da tela ganhou coluna declarada.
- **As fontes da web não carregam neste ambiente.** As medições anteriores
  usavam DejaVu, bem mais larga, e acusavam colisões inexistentes no iPad.
  - As fontes reais foram baixadas e injetadas no navegador de teste.
  - Medições e capturas desta rodada usam Space Grotesk, JetBrains Mono,
    Inter, Kalam e Newsreader de verdade.
- **Três rótulos saíam da borda com Space Grotesk**, que é mais larga que a
  fonte para a qual foram posicionados: "cnidócito", "especiarias:
  prioridade" e "3 escolhas, depois 2".
  - Os dois primeiros foram alinhados pela direita.
  - O terceiro vinha do `SceneNote`, que estimava a largura com o glifo médio
    da Kalam (4,7 px). A constante foi para 6, e o clamp de toda nota passou a
    valer para a fonte nova.
- **As notas de cena voltaram para fonte proporcional.** Em monoespaçada
  também passavam da borda.
- **Sobreposições em Geografia e História já existiam.** A mesma medição na
  versão de ontem dá números iguais (fusos 50 × 52, linguagem cartográfica
  35 × 35). É defeito dessas cenas, não desta reformulação, e fica para a
  rodada delas.
- **Conferência de anotações:** `scripts/conferir-anotacoes.mts`, rodado com
  as fontes reais, não achou colisão. A única prancha que "não abriu"
  (`trofico` em `bio-ecologia-introducao`) também não abria ontem: o capítulo
  hoje mostra outro tipo de cena.

### Conferência

- **Hoje:** iPad e celular, claro e escuro, com fontes reais, sem erro de
  página.
- **Checagens:**
  - `npm run lint` limpo;
  - `npm test` verde (718 node:test e 749 vitest);
  - `npm run build` sem erro.

Capturas em `screenshots/hoje-identidade-2026-09-28/`: antes, depois e as cenas
corrigidas.
