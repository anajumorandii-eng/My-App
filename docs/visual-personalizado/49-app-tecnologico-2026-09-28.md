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
