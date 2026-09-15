# 01 — Auditoria da implementação encontrada

## Versão examinada

- Base auditada: `origin/main` em `3798b83` (2026-09-15), commit
  "feat(visual): integra ilustrações de atlas científico".
- `main` local e `origin/main` sincronizados nesta auditoria.
- Trabalho conduzido na worktree dedicada `wt-visual-personalizado`.

## Recusa da Ana Júlia em 2026-09-15 — o que ela apontou

Genérico, sem personalidade, "SVG de desenvolvedor", parecido com wireframe ou
dashboard, baseado em retângulos/círculos/cartões repetidos, distante das cinco
referências aprovadas, sem qualidade de ilustração editorial, pouco
personalizado por matéria/tópico. Ver [[crivo-visual-redesign-brief]] em
memória para o texto completo do briefing.

## O que já funcionava (preservado desde a auditoria anterior)

- biblioteca de capítulos com busca e filtro; URL por `summaryId`;
- modos Explorar, Testar e Reconstruir; sete estados pedagógicos e confiança;
- correção graduada de reconstrução; intervenção mínima eficaz;
- inspetor com evidências e discordância;
- responsividade básica e `prefers-reduced-motion`;
- testes das regras e das jornadas principais (454 Node + 237 Vitest em
  2026-09-14, não re-executados nesta auditoria ainda).

## Achados concretos desta auditoria (evidência, não impressão)

Comparação lado a lado das capturas existentes em `screenshots/` contra as
cinco referências em `referencias-aprovadas/`, mais leitura do código-fonte de
`BoardShell.tsx`, `ConceptChain.tsx`, `Visual.tsx`, `NewtonBoard.tsx` e
`AtomModelsBoard.tsx`.

1. **Só 2 das 27 pranchas receberam ilustração de verdade.** `AdiabaticBoard`
   (pistão) e `PhotosynthesisBoard` (cloroplasto/folha) usam os assets gerados
   em `public/visual-assets/*.webp` — e o resultado é bom, próximo do nível das
   referências. As outras 25, incluindo duas que estão na lista de validação
   obrigatória (`NewtonBoard`, `AtomModelsBoard`), continuam em SVG geométrico
   puro: círculos concêntricos rotulados para camadas eletrônicas, retângulos
   arredondados com texto para cada Lei de Newton. Isto sozinho explica boa
   parte da recusa — a amostra que a Ana Júlia viu não é representativa das
   duas pranchas boas.
2. **`NewtonBoard` é o pior caso.** A cena é um hub-and-spoke de caixas de
   texto (`<rect>` + `<text>`) ao redor de um círculo "LEIS DE NEWTON" — o
   padrão listado explicitamente como proibido ("mapas mentais compostos por
   caixas conectadas"). A referência 04 usa a mesma topologia radial, mas
   executada como lousa de giz de verdade: contorno traçado à mão, brilho de
   giz, e sub-diagramas de força ilustrados (bloco na rampa com vetores) — nada
   disso existe na implementação atual. Além disso, a 3ª Lei fica **escondida
   atrás da barra de navegação inferior** no mobile em tema escuro
   (`fisica-newton-mobile-escuro.png`), uma falha de sobreposição que o padrão
   obrigatório proíbe explicitamente.
3. **`AtomModelsBoard` também é geometria pura.** Camadas eletrônicas são só
   três círculos concêntricos; o núcleo é um círculo com "+"; não há textura,
   sombreado ou densidade de ilustração científica. O selo circular
   `condition={{ label: 'critério', value: 'evidência' }}` estoura o círculo
   (`vs-q-callout` foi dimensionado para valores curtos como "Q = 0"): o texto
   quebra em "evidênc / ia", visível em
   `quimica-modelos-atomicos-desktop.png`. Bug concreto, não só direção de
   arte.
4. **A barra de modos (Explorar/Testar/Reconstruir) está com um bug de CSS
   visível.** `Visual.tsx` linha ~394 usa classes Tailwind soltas
   (`rounded-xl px-4 py-2.5 ... bg-indigo-600 text-white` / `border
   border-zinc-300 dark:border-zinc-700`) misturadas ao design system `vs-*`
   usado no resto da tela. O resultado capturado é uma barra sólida sem texto
   visível para a aba ativa e links sem nenhum estilo para as inativas — a
   primeira coisa que a estudante vê ao abrir a aba já parece quebrada.
5. **A cadeia de conceitos (`ConceptChain.tsx`, "Intuição → Conceito →
   Aplicação → Estratégia → Exercício") é estruturalmente igual à referência**
   (que também encadeia `Q=0 → Trabalho → Energia interna → Temperatura` em
   cartões), mas a execução visual é mais pobre: rótulos em caixa alta
   monoespaçada, cores planas, sem os selos/ícones coloridos e a hierarquia
   tipográfica que a referência usa. Não é uma estrutura proibida — é uma
   execução que ainda parece painel administrativo.
6. **`vs-support-grid` (as caixas "Relações úteis", "Diagrama P×V", "Pista de
   prova" etc.) e o rodapé `vs-landscape`** são compartilhados por
   `BoardShell` e, portanto, por todas as 27 pranchas. Hoje são caixas com
   borda fina e título em caixa alta monoespaçada (dashboard), e o rodapé é
   uma silhueta cinza chapada de colina — nas referências 02/05 é uma paisagem
   aquarelada colorida com textura. Como são compartilhados, corrigir aqui
   eleva as 27 pranchas de uma vez, incluindo as 23 que não estão no escopo
   imediato do piloto.

## Pontuação 0–10 das quatro pranchas do escopo imediato

| Prancha | Personalidade | Fidelidade às refs | Qualidade da ilustração | Especificidade científica | Tipografia | Ícones | Interação | Movimento | Mobile | Acessibilidade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Transformação adiabática (piloto) | 6 | 6 | 7 | 8 | 5 | 3 | 6 | 6 | 6 | 7 |
| Fotossíntese | 7 | 7 | 8 | 8 | 5 | 3 | 6 | 6 | 6 | 7 |
| Leis de Newton | 2 | 3 | 1 | 4 | 4 | 2 | 5 | 5 | 3 (bug de sobreposição) | 6 |
| Modelos atômicos | 2 | 3 | 1 | 5 | 4 | 2 | 5 | 4 | 5 | 5 (bug de texto no selo) |

Notas de leitura: "tipografia" e "ícones" pontuam baixo nas quatro porque o
problema é compartilhado (`BoardShell`, `ConceptChain`, seletor de modo) — não
é um problema por prancha, é um problema da casca comum. "Interação" pontua
razoável nas quatro porque Explorar/Testar/Reconstruir já funcionam; o que
falta é manipulação direta sobre a ilustração (item já registrado na
auditoria anterior) e a forma da Reconstrução em mobile, que hoje aparece como
formulário genérico solto abaixo da prancha ilustrada
(`fisica-reconstruir-mobile.png`), sem nenhuma unidade visual com o resto da
tela.

## Backlog explícito fora do escopo desta rodada

As 23 pranchas restantes do registro (`WaveBoard`, `LensBoard`,
`TrigCircleBoard`, `CarbonCycleBoard`, `MembraneBoard`, `StoichiometryBoard`,
`ExponentialBoard`, `MendelBoard`, `ThermochemBoard`, `CircuitBoard`,
`QuadraticBoard`, `TrophicBoard`, `BondingBoard`, `KinematicsBoard`,
`ProgressionBoard`, `CellDivisionBoard`, `HydrostaticsBoard`, `AcidBaseBoard`,
`LogarithmBoard`, `CalorimetryBoard`, `CountingBoard`, `BloodTypeBoard`,
`SolutionsBoard`) não foram abertas uma a uma nesta auditoria. Elas herdam
qualquer correção feita em `BoardShell`, `ConceptChain` e no seletor de modo,
mas continuam com cena em SVG geométrico até uma rodada dedicada — não devem
ser anunciadas como "redesenhadas" neste ciclo.

## Dependências e recursos disponíveis nesta sessão

Sem acesso confirmado a uma ferramenta de geração de imagem dedicada nesta
sessão (o registro de 2026-09-15 cita uma skill `imagegen` que não está
disponível aqui). Os dois assets já gerados
(`public/visual-assets/adiabatic-piston-atlas.webp` e `photosynthesis-atlas.webp`)
serão reaproveitados e, se necessário, refinados; para Newton e Modelos
Atômicos a estratégia principal é elevar a qualidade do SVG autoral (textura,
sombreado, densidade de ilustração científica) em vez de depender de geração
de imagem não verificada. React 19, `motion/react`, KaTeX, Recharts e
Playwright já estão no projeto.
