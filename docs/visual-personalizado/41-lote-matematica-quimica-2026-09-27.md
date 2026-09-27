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

### Lotes 2, 3 e 4 — dez capítulos que dividiam três desenhos

Os dados de cada configuração do `ChemistryInstrument` já eram do capítulo; o
desenho não. Três grupos compartilhavam o mesmo quadro:

- a mesma caixa de 12 bolinhas paradas;
- duas caixas de bolinhas que só ganhavam opacidade;
- dois círculos "reagentes/produtos".

Agora cada capítulo desenha o próprio objeto (`ChemistryMechanisms.tsx`). Todo
número desenhado sai da mesma conta que produz a leitura:

| Capítulo | O que a cena mostra |
| --- | --- |
| O estado gasoso | Volume fixo; a seta de cada partícula cresce com √T e o manômetro sobe. |
| Estudo dos gases II | Seringa com escala de litros; o êmbolo recua com a temperatura. |
| Mol e massa molar | Massa ÷ 18 g/mol vira caixas de 1 mol, com a contagem de moléculas. |
| Balanceamento | Moléculas de H₂, O₂ e H₂O, lote a lote, com a contagem de átomos dos dois lados. |
| Cálculos estequiométricos | O₂ fixo em 2 mol; a sobra aparece apagada e o reagente limitante é nomeado. |
| Oxidação de hidrocarbonetos | As duas vagas de O₂ que 1 CH₄ pede, cada vaga vazia marcada como "falta". |
| Esterificação | Cada álcool encontra um ácido; o teto 1 : 1 e o aviso de que o equilíbrio pode parar antes. |
| Transesterificação | Cada álcool solta uma cadeia do triglicerídeo; três soltas liberam o glicerol. |
| Deslocamento de equilíbrio | Barras de concentração e Q na reta; a posição em relação a K = 1 dá o sentido. |
| Equilíbrios iônicos | Ao diluir, [H⁺] cai, a fração ionizada sobe e o pH anda na escala. |

A conferência achou dois defeitos, corrigidos:

- **Gases:** as setas de velocidade atravessavam a parede e pareciam partículas
  escapando. Agora ficam presas dentro do recipiente.
- **Seringa:** com 4 L, a haste do êmbolo saía do quadro. A escala foi
  reajustada.

Na varredura final de Química (47 capítulos, 1440 claro e 390 escuro), nenhum
achado.

### Lote 5 e Química Ambiental — escala abstrata e cadeia sem desenho

Quatro capítulos entram na família `QuimicaFenomenos`, com os mesmos itens e
citações de antes:

| Capítulo | Antes | Agora |
| --- | --- | --- |
| Interações intermoleculares | Régua com marcador subindo degraus | Os três pares de moléculas com a interação desenhada (tracejado cada vez mais forte). As colunas de ponto de ebulição mostram só a ordem, porque a citação não dá valores. |
| Cinética química | Régua de "ordem de reação" | Velocidade × concentração para as três ordens; dobrar a concentração marca × 1, × 2 e × 4. |
| Polaridade | Critérios em texto | Ligação apolar, dipolos que se cancelam na geometria linear e dipolos que se somam na angular, com a resultante. |
| Química ambiental | Cadeia de caixas | O mesmo lago em três etapas: algas barram a luz, as bactérias consomem o O₂ dissolvido e os peixes morrem sem nada tóxico no desenho. |

Os átomos A, X e Y são genéricos: a citação trata do critério, não de uma
molécula. A conferência achou três colisões, todas corrigidas:

- "[reagente]" encostava no "2c";
- a legenda da molécula angular saía pela direita;
- a coluna mais alta subia até o nome da interação.

### Correção transversal encontrada de passagem

A varredura de Sociologia, rodada para garantir que a nova grade de eixos não
quebrasse os dois capítulos que a usam, achou 18 combinações com defeito. Os
dois capítulos da grade estavam limpos; os achados vinham da
`ContrasteDePosicoes`, família genérica, e são os dois defeitos transversais que
a auditoria já apontava:

- o retângulo animava `y` e `height` sem valor inicial, com erro de console em
  nove capítulos;
- os rótulos longos das posições se sobrepunham ("Relativismo metodológico" ×
  "Relativismo moral radical").

Agora o rótulo quebra em até três linhas na largura da coluna. Depois disso,
Filosofia não tem nenhum achado, e em Sociologia restam 2, ambos do experimento
interativo de solidariedade (`rx` sem valor inicial), que fica para o lote de
Sociologia.

## Pendente em Química

- A mini-escala de pH da prancha de ácidos e bases, que a auditoria chamou de
  ilegível, não foi localizada nesta conferência. Falta confirmar se ela ainda
  existe.
- Aprovação editorial de todas as cenas acima.
