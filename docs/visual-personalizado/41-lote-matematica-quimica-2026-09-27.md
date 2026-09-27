# Lote de Matemática e Química — conferência e análise (27/09/2026)

Registro exigido pela regra de entrega do padrão visual
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`): o que mudou, como foi conferido
no navegador e o que continua pendente. Capturas em
`screenshots/lote-matematica-quimica-2026-09-27/` — cena de cada capítulo em
1440 claro, 1440 escuro e 390 claro.

A aprovação editorial de cada prancha é da Ana Júlia. Este documento é a
conferência técnica.

## Matemática (auditoria 36 fechada; PR #221)

As capturas de Matemática não foram salvas junto com o PR #221. Elas estão aqui
agora, para os 13 capítulos tocados:

- sete redesenhos da Ana Júlia: probabilidade, triângulo retângulo, razão,
  porcentagem, sistema decimal, números inteiros e médias;
- cinco ajustes: inversão, sinal, transformações, introdução à geometria
  analítica, ponto médio e baricentro;
- "Estudo Analítico da Reta", cujas notas foram refeitas.

## Química

### Lote 0 — grade de eixos ilegível

`summary-quimica-equilibrios-ionicos-ii`: com viewBox de 220, o `.tc-label` de
18 px ficava 2,2 vezes maior que o previsto, e o rótulo saía da célula e da
tela. `GradeDeEixos` passou a 480 × 400. As bordas escrevem os polos e o nome de
cada eixo, o rótulo quebra no "+" e as células são clicáveis. A correção vale
também para os dois capítulos de Sociologia da família.

### Lote 1 — seis capítulos sem desenho

A família genérica `tipologia` só mostrava cartões de texto. A família nova
`QuimicaFenomenos` desenha o fenômeno que cada resumo descreve. O caso
escolhido move o que explica o mecanismo:

| Capítulo | O que a cena mostra |
| --- | --- |
| Tabela periódica | As 18 colunas com a família acesa (o H fica fora dos alcalinos) e o átomo com 1, 2, 7 ou 8 elétrons de valência. O elétron sai do alcalino e entra no halogênio. |
| Radioatividade | Fonte e três barreiras (papel, alumínio, chumbo ou concreto). O feixe escolhido corre até a barreira que o detém. |
| Estados físicos | O mesmo número de partículas em rede com forças (sólido), junto no fundo (líquido) e espalhado (gás). |
| Química inorgânica | Quatro quadros: H⁺ como único cátion, OH⁻ como único ânion, neutralização formando o sal e o O mais eletronegativo do óxido. |
| Combustíveis fósseis | Da queima saem quatro trilhas até o dano de cada produto; a escolhida se desenha até o destino. |
| Efeitos coligativos | Solvente puro contra solução: menos vapor, ebulição mais alta, congelamento mais baixo, pressão que barra o solvente na membrana. |

Os números desenhados vêm das citações (os elétrons de valência são conferidos
por teste). A⁻, M⁺ e E são símbolos genéricos, não compostos específicos. A
prancha declara, no rodapé, que o desenho é esquemático.

### Lote 6 — polimento

- Orgânica: o O da carbonila interna caía sobre o C da terminal. "Br" e
  "sem H no C–OH" saíam do quadro.
- Filtração:
  - as partículas que atravessam o filtro desciam fora do vidro; agora descem
    pela haste;
  - os rótulos se encostavam e viraram legenda;
  - "8 µm" aparecia como "8 ΜM" num selo em maiúsculas.
- Seis capítulos gravavam `cx`, `cy` ou `width` como "undefined" no primeiro
  quadro, com erro no console.

## Como foi conferido

- **Varredura de Química** (47 capítulos, 1440 claro e 390 escuro): mede
  texto sobre texto e texto fora do quadro nas coordenadas do viewBox, rolagem
  lateral e erros de console.
  - Antes: 16 combinações com achado.
  - Depois: nenhuma.
- **Cenas novas:** cada caso selecionado em claro e escuro, 1440 e 390 px, e
  com `prefers-reduced-motion`. Com movimento reduzido, o estado final aparece
  completo, sem animação.
- **Combustíveis:** a conferência achou as quatro trilhas acesas ao mesmo
  tempo. O `motion` anima a opacidade como atributo SVG, e a regra de classe
  vencia. A trilha animada ganhou classe própria; agora há uma acesa por caso.
- **Celular:** o quadro de 480 encolhia a cerca de 350 px, com legendas de uns
  7 px. A figura agora tem 640 px de largura mínima e rola dentro da prancha,
  com dica de deslizar e setas do teclado, como nas cenas de História e
  Geografia. A página não rola.

## Pendente em Química

- Lote 2 — quatro capítulos do `ChemistryInstrument` com os mesmos dois
  círculos genéricos: esterificação, transesterificação, deslocamento de
  equilíbrio e equilíbrios iônicos.
- Lote 3 — três capítulos com a mesma caixa de partículas: gás ideal, lei geral
  dos gases e mol.
- Lote 4 — três capítulos com caixas genéricas de equação: balanceamento,
  estequiometria e oxidação de hidrocarbonetos.
- Lote 5 — três capítulos com escala abstrata sem molécula: interações
  intermoleculares, cinética e polaridade.
- A mini-escala de pH da prancha de ácidos e bases, que a auditoria chamou de
  ilegível, não foi localizada nesta conferência. Falta confirmar se ela ainda
  existe.
