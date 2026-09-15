# 02 — Direção visual e personalização

## Direção (mantida, reforçada em execução)

A prancha é um **atlas científico editorial interativo**: papel quente e
manuscrito no tema claro, lousa escura de giz no tema escuro. A auditoria em
`01-auditoria.md` mostrou que a estrutura já aprovada (par esquerda/direita,
cena central, cadeia de conceitos, inspetor lateral/folha inferior) está
correta — o que falhou foi a **execução em 25 das 27 pranchas e em três peças
compartilhadas** (seletor de modo, grade de apoio, rodapé). Esta rodada não
reinventa a composição: eleva a execução até o nível das cinco referências e
corrige os bugs concretos encontrados.

## Correções na casca compartilhada (afeta as 27 pranchas de uma vez)

1. **Seletor de modo (`Visual.tsx`, `.vs-modes`).** O CSS de `.vs-modes > button`
   já implementa o design correto (ícone, cor por matéria, estado
   `aria-selected`). O bug é que o JSX aplica classes Tailwind soltas
   (`bg-indigo-600`, `border-zinc-300` etc.) por cima, quebrando o resultado.
   Correção: remover essas classes do `<button>` e deixar o seletor de
   `.vs-modes` cascatear, como já funciona em outras telas do app.
2. **Selo de condição (`.vs-q-callout`).** Dimensionado para valores curtos
   ("Q = 0", "ΣF = m·a"). `AtomModelsBoard` usa "evidência", que quebra em duas
   linhas dentro do círculo. Correção: ou o círculo cresce para acomodar até
   ~12 caracteres sem quebra grotesca, ou o valor do badge muda para algo tão
   curto quanto os outros (ex.: trocar `condition` por algo como
   `{ label: 'critério', value: 'Rutherford → Bohr' }` não cabe também — a
   solução certa é o componente, não o texto: ajustar `.vs-q-callout` para
   `white-space: normal` com `hyphens: none` e uma segunda linha de tamanho
   menor, testado com o pior caso real do registro, não só "Q = 0").
3. **Cadeia de conceitos (`ConceptChain.tsx` / `.vs-chain-link`).** Manter a
   estrutura (ela já corresponde à referência). Trocar rótulo de estágio de
   caixa alta monoespaçada por tipografia editorial (`Newsreader` para o
   texto, mantendo um selo de cor pequeno e redondo por estado, no estilo dos
   badges coloridos da referência 02) e dar às cores de estado o mesmo peso
   visual (traço colorido + fundo suave) que os cartões "Lacuna
   provável/Em consolidação/Dominado" da referência.
4. **Grade de apoio (`.vs-support-grid` / `.vs-formula-note`).** Sair do
   padrão "caixa com borda fina + título monoespaçado" para cartões com fundo
   levemente colorido (mesma família de cor da matéria via
   `crivoSubjects.ts`), cantos mais orgânicos e o título em tipografia
   editorial — sem virar `vs-concept-card` duplicado.
5. **Rodapé (`.vs-landscape`).** Hoje é uma silhueta cinza chapada, igual em
   toda matéria. Trocar por uma paisagem com paleta derivada da matéria
   (`atmoA`/`atmoB`/`secondary` de `crivoSubjects.ts`) e textura leve (grão ou
   hachura fina via filtro SVG), para deixar de ser um "divisor de template" e
   ganhar identidade por matéria mantendo o mesmo contrato de layout.

## Direção por prancha do escopo imediato

**Transformação adiabática (piloto) e Fotossíntese** — já usam ilustração
gerada em `public/visual-assets/`, próxima do nível das referências. Não
refazer a imagem; herdam as correções da casca (item acima) e recebem revisão
fina de encaixe (halo/sombra da imagem contra o papel, rótulos sobrepostos).

**Leis de Newton** — mantém a topologia radial (ela já bate com a referência
04), mas a execução muda de "caixas com cantos arredondados" para **traço de
giz de verdade**: contorno spray/textura em vez de `rx` liso, brilho
(`feGaussianBlur` já existe em `chalk-glow`, hoje subutilizado — usar em toda
borda, não só nas linhas), e cada Lei ganha um **pequeno diagrama de força
desenhado** ao lado do texto (bloco com vetores para a 1ª e 2ª lei; par de
setas opostas para a 3ª), não apenas a equação. Corrigir a sobreposição da 3ª
Lei com a barra de navegação inferior no mobile.

**Modelos atômicos** — sai de círculos concêntricos finos para uma ilustração
com volume e textura: núcleo com gradiente metálico/denso, camadas com traço
mais expressivo (espessura variável, não um único `stroke-width` uniforme),
trajetória alfa com espessura e leve granulação, salto de Bohr com brilho de
fóton real (gradiente radial), mantendo tudo em SVG autoral dado que não há
geração de imagem confirmada nesta sessão ([[crivo-visual-illustration-approach]]).

## Regras de qualidade (mantidas de 02 anterior, ainda válidas)

- Não usar o mesmo desenho com cores diferentes para todas as matérias.
- Não usar cartões genéricos como representação de conhecimento.
- Não transformar o mapa em dashboard — inclui a grade de apoio e o seletor de
  modo, que hoje são o dashboard remanescente.
- Cor de matéria identifica o universo; cor de estágio organiza a sequência;
  cor de estado comunica diagnóstico.
- O título do tópico e o artefato precisam caber em 360 px sem rolagem
  lateral.
- No celular, nenhum controle fixo (nav, domínio) pode cobrir conteúdo
  acionável — item que falhou em Newton e precisa de teste de regressão
  visual, não só leitura de código.
