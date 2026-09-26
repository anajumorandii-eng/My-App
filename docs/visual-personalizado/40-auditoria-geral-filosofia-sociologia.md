# Auditoria geral — Filosofia (35) e Sociologia (27)

Data: 26/09/2026. Método: leitura de código de cada família de cena
(`src/views/topic-scenes/families/`), amostragem no navegador (Playwright,
Chromium 1194, 1440 claro e 390 escuro, `localStorage.juju_onboarding=true`) e
varredura automática dos 62 capítulos em 390 px (overflow, erro de console,
artefato renderizado). Nada em `src/` foi alterado. Capturas reaproveitadas de
uma tentativa anterior em
`docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/filosofia-sociologia/`
(40 PNGs), mais 6 novas para fechar lacunas de amostragem por engine (3
capítulos × 2 recortes), total 46.

## Resumo

| Engine | Capítulos | Manter | Ajustar | Redesenhar |
| --- | --- | --- | --- | --- |
| contraste-de-posicoes | 24 | 0 | 0 | 24 |
| cadeia-de-derivacao | 12 | 0 | 0 | 12 |
| tipologia | 6 | 0 | 0 | 6 |
| camadas-de-determinacao | 5 | 0 | 0 | 5 |
| escala-de-graus | 5 | 0 | 0 | 5 |
| movimento-dialetico | 3 | 0 | 1 (Hegel) | 2 |
| criterios-conjuntivos | 3 | 0 | 0 | 3 |
| grade-de-eixos | 2 | 0 | 0 | 2 |
| myth (experimento) | 1 | 1 | 0 | 0 |
| solidarity (experimento) | 1 | 1 | 0 | 0 |
| **Total** | **62** | **2** | **1** | **59** |

Nenhum capítulo tem erro de console, rolagem lateral a 390 px ou artefato
ausente — a varredura automática dos 62 confirma isso (o script de varredura
relatou "NO-SCENE" para os dois experimentos por procurar a classe errada,
`.tc-scene`/`.vs-instrument` em vez de `.topic-studio`; capturas manuais dos
dois confirmam cena renderizada e funcional). O problema do grupo não é
ausência de artefato: é que **8 das 9 "famílias" de cena são estruturas
puramente genéricas** — pilares, caixas empilhadas, escada, cartões numerados
— sem nenhum traço, ícone ou forma que venha do conteúdo do capítulo. A régua
de 25/09 (critérios 1 e 5) é violada sistematicamente: a mesma forma é
desenhada para dezenas de capítulos, só o texto de `src/views/topic-scenes/data/*.ts`
muda.

## Por engine

### contraste-de-posicoes (24 capítulos — redesenhar todos)
`src/views/topic-scenes/families/ContrasteDePosicoes.tsx`. Desenha N pilares
retangulares num eixo horizontal; clicar num rótulo aumenta o pilar
correspondente. Não há nenhuma marca do conteúdo — a mesma forma serve tanto
"Heráclito e Parmênides" quanto "Foucault e as relações de poder" quanto
"Cultura e etnocentrismo". Textos e citações são fiéis ao resumo nos capítulos
amostrados (sofistas, justiça e direitos humanos, desigualdade racial).

**Defeito transversal grave: colisão de rótulos quando há 3 posições com nomes
longos.** `ContrasteDePosicoes.tsx:25` calcula `x = 40 + ((i + 0.5) * 400) / n`
e `:35` escreve `<text x={x} y="36" textAnchor="middle">` sem quebra de linha
nem ajuste de tamanho de fonte. Com `n=3` e rótulos como "Teoria histórica
(Nozick)" ou "Reabilitação historiográfica", os três textos se sobrepõem e
vazam para fora do `viewBox` à esquerda — reproduzido em
`filosofia-justica-e-direitos-humanos` (1440 e 390, claro e escuro) e em
`filosofia-os-sofistas-e-a-crise-da-verdade`. Qualquer capítulo desta família
com 3 itens e rótulo médio acima de ~14 caracteres deve ter o mesmo problema —
isso cobre pelo menos 6 dos 24 (justiça e direitos humanos, sofistas, fé e
razão, ética aplicada e bioética, filosofia política contemporânea, política
aristotélica).

Conteúdo que pede mecanismo próprio em vez do genérico: Heráclito × Parmênides
(fluxo do rio × esfera imutável são imagens do próprio resumo, desenháveis
literalmente); Alegoria não se aplica aqui mas o Mito da Caverna (ver
escala-de-graus) é o caso mais evidente de família errada para conteúdo.

### cadeia-de-derivacao (12 capítulos — redesenhar todos)
`src/views/topic-scenes/families/CadeiaDeDerivacao.tsx`. Lista vertical de
caixas de texto com uma seta entre a caixa ativa e a anterior. É literalmente
uma lista com marca-passo — nenhum desenho do encadeamento lógico específico.
Hobbes ("Igualdade natural → Guerra de todos → Pacto → Soberano absoluto") e
Lógica e Metafísica Aristotélicas ("Premissa maior → Premissa menor →
Conclusão necessária → Validade ≠ verdade") renderizam com a **mesma forma
exata**, só trocando o texto das quatro caixas — o empréstimo que a régua
proíbe (critério 5) fica visível lado a lado nas duas capturas. O silogismo em
especial tem um diagrama canônico e citável ("Todos os homens são mortais;
Sócrates é homem; logo, Sócrates é mortal") que pede círculos de Venn ou termos
concêntricos, não uma pilha de retângulos.

### tipologia (6 capítulos — redesenhar todos)
`src/views/topic-scenes/families/Tipologia.tsx`. Grade de cartões numerados
(01, 02, 03...) com texto; a única exceção com desenho de verdade é o ramo
`chapterId === 'summary-biologia-mutacoes-genicas'` (fora deste grupo), que
tem workbench de comparação de DNA — prova de que o componente sabe desenhar
mecanismo quando alguém escreve um. Para os 6 de Sociologia (tipos de ação
social, dominação e poder em Weber, movimentos sociais, Estado-nação,
globalização, democracia e participação) é só texto em cartão, sem ícone.

**Defeito de conteúdo**: `src/views/topic-scenes/data/sociologia.ts:30`, a
`nota` do capítulo "Dominação e Poder em Weber" começa com letra minúscula e
lê como frase cortada — `'supor que os tipos aparecem puros na realidade,
quando se combinam em casos concretos'` — falta o início da oração (algo como
"Não é preciso supor que..."); compare com a `nota` do capítulo vizinho na
mesma família (linha 18), que é uma frase completa. Reproduzido na captura
`sociologia-dominacao-e-poder-em-weber-1440-light.png`.

### camadas-de-determinacao (5 capítulos — redesenhar todos)
`src/views/topic-scenes/families/CamadasDeDeterminacao.tsx`. Pilha de
retângulos empilhados (base + camadas superiores), com uma linha vertical de
"determinação" entre a base e a camada em foco. Sem ícone.

**Defeito de layout**: o `viewBox` é fixo em `"0 0 480 196"`
(`CamadasDeDeterminacao.tsx:19`) e `yDe(i) = 116 - i * 40` (linha 14) posiciona
as camadas a partir do topo da base; capítulos com só 1 camada superior (Modo
de Produção e Estrutura Social: só "Superestrutura" sobre "Base econômica")
deixam mais da metade do quadro vazio acima da pilha, enquanto capítulos com 3
camadas (O Materialismo Histórico) usam o espaço inteiro — o mesmo componente
produz uma composição desequilibrada dependendo de quantos itens o capítulo
tem, porque a altura do desenho não se adapta à contagem de itens.

### escala-de-graus (5 capítulos — redesenhar todos)
`src/views/topic-scenes/families/EscalaDeGraus.tsx`. Escada horizontal
abstrata com um marcador circular que sobe/desce; função `labelLines` já
quebra rótulos longos em duas linhas — é o único dos 8 "genéricos" com esse
cuidado, mas segue sendo puramente esquemático.

**Pior caso de família inadequada do grupo inteiro: o Mito da Caverna.** É a
alegoria mais visual da história da filosofia — prisioneiros acorrentados,
sombras na parede, fogueira, saída para o sol — e a cena mostra quatro barras
horizontais rotuladas "Sombras / Fogo / Dia / Sol" com um ponto que desliza,
sem caverna, sem parede, sem silhueta, sem fogueira. O resumo do capítulo
(seção "A alegoria") descreve a cena completa; nada disso aparece. É o
equivalente filosófico de desenhar o pistão adiabático como uma barra de
progresso — a régua (critério 1: "mecanismo do capítulo, não estrutura
genérica") é violada da forma mais visível possível neste grupo.

### movimento-dialetico (3 capítulos — 2 redesenhar, 1 ajustar)
`src/views/topic-scenes/families/MovimentoDialetico.tsx`. Dois círculos que se
aproximam e formam uma vesica (interseção em forma de olho) com o rótulo da
síntese. Tecnicamente é o único "genérico" com uma metáfora visual coerente
(dois se tornam um terceiro) e cabe bem em Hegel (tese/antítese/síntese) e no
método socrático (duas posições convergindo por refutação).

**Ajustar, não redesenhar: Hegel** — a família e a metáfora (superação como
fusão de dois círculos) são exatamente o conteúdo do capítulo; falta ícone e
rótulo dos "momentos" (ex.: Ser/Nada em vez de "Contradição"/"Posição"
genéricos), mas a estrutura serve.

**Redesenhar: Nietzsche** — a "Crítica aos Valores Morais" usa a mesma forma de
tese-antítese-síntese hegeliana para descrever a genealogia da moral e a
vontade de potência, que **não é um movimento dialético em Hegel**: Nietzsche
rejeita explicitamente a síntese conciliadora. A cena rotula o segundo polo
como "Valor universal", quando o ponto do capítulo é que Nietzsche nega a
existência de um valor universal — a forma emprestada da família impõe uma
lógica (contradição → superação → terceiro termo estável) que contradiz o
conteúdo do próprio capítulo. É o exemplo mais claro do grupo de família
inadequada ao conteúdo, não só de execução genérica.

**Redesenhar: O Método Socrático** — a maiêutica é um processo de perguntas
sucessivas que refutam a posição inicial (elenchus), não uma fusão de dois
opostos coexistentes; a forma de "dois círculos que se sobrepõem" não
corresponde ao método (não há dois momentos coexistentes, há uma sequência de
perguntas). Cabia melhor em `cadeia-de-derivacao` conceitualmente, mas o ideal
é um diálogo desenhado (pergunta → resposta → contradição percebida → nova
definição).

### criterios-conjuntivos (3 capítulos — redesenhar todos)
`src/views/topic-scenes/families/CriteriosConjuntivos.tsx`. Cartões com "+"/"✓"
que a estudante marca; nenhum SVG, só HTML. Serve capítulos genuinamente
conjuntivos (Fato Social de Durkheim: exterioridade + coercitividade +
generalidade têm de estar todas presentes), mas a apresentação é texto puro —
nenhuma ilustração do que "exterioridade" ou "coercitividade" significam
concretamente (ex.: uma norma de trânsito que existe antes do indivíduo e pune
quem a rompe).

### grade-de-eixos (2 capítulos — redesenhar ambos)
`src/views/topic-scenes/families/GradeDeEixos.tsx`. Grade 2×2 de células que
o rótulo do eixo A/B seleciona. O cruzamento de dois eixos binários é
conceitualmente adequado para Durkheim (dimensão × desequilíbrio → 4 tipos de
suicídio) e para Classes Sociais (direção × prazo → 4 tipos de mobilidade) —
mas a implementação tem um **defeito grave de escala de texto**:

- `GradeDeEixos.tsx:24` fixa `viewBox="0 0 220 220"` (quadrado) mas o CSS
  (`TopicScene.css:32`) estica o SVG para `width:100%` do container — em 1440
  px isso amplia o desenho ~4×, e o texto em `GradeDeEixos.tsx:34` (`<text
  x={x+47} y={y+52} textAnchor="middle">`) não tem quebra de linha nem
  `font-size` relativo à largura da célula (95 unidades). Com rótulos de mais
  de uma palavra ("Vertical intra", "Horizontal inter") o texto vaza pelas
  quatro bordas da célula e se sobrepõe ao texto da célula vizinha —
  reproduzido em `sociologia-anomia-e-coesao-social` e
  `sociologia-classes-sociais-e-mobilidade-social` (1440 claro e 390 escuro,
  4 capturas no total).
- Em 1440 px o SVG ampliado empurra a altura da página o bastante para que a
  barra de navegação fixa cubra as duas células de cima
  (`sociologia-anomia-e-coesao-social-1440-light.png`); em 390 px o título da
  pergunta fica atrás do cabeçalho fixo
  (`sociologia-anomia-e-coesao-social-390-dark.png`).

## Experimentos (myth, solidarity) — manter

`src/views/topic-experiments/TopicExperiment.tsx`, funções `Myth` (linha 137)
e `Solidarity` (linha 157). Diferente das 8 famílias acima, cada um tem SVG
desenhado à mão para o conceito específico: `Myth` desenha uma nuvem com raio
e alterna entre "tradição/autoridade" (mito) e "argumentação/contestação"
(logos); `Solidarity` morfa três blocos redondos (semelhança mecânica) em três
blocos angulares com iniciais de função (interdependência orgânica). Ambos têm
movimento que explica (Framer Motion), nota de ressalva sobre a metáfora não
literal, e nenhum defeito de layout nas capturas em 1440/390, claro/escuro.
Estes dois não entram no redesenho — servem de referência de nível mínimo
aceitável para as famílias genéricas que os têm como vizinhos na mesma tela.

## Tabela por capítulo

| id | engine | veredito | motivo |
| --- | --- | --- | --- |
| filosofia-o-nascimento-da-filosofia-do-mito-ao-logos | myth | manter | cena autoral, ícone próprio, sem defeito |
| sociologia-solidariedade-mecanica-e-solidariedade-organica | solidarity | manter | cena autoral, ícone próprio, sem defeito |
| filosofia-hegel-e-a-dialetica | movimento-dialetico | ajustar | forma cabe no conteúdo; falta ícone/rótulo específico (Ser/Nada) |
| filosofia-nietzsche-e-a-critica-aos-valores-morais | movimento-dialetico | redesenhar | forma hegeliana de síntese contradiz o conteúdo (Nietzsche rejeita síntese e "valor universal") |
| filosofia-o-metodo-socratico-e-a-maieutica | movimento-dialetico | redesenhar | maiêutica é sequência de perguntas, não fusão de dois círculos |
| filosofia-os-filosofos-da-physis-tales-anaximandro-e-anaximenes | contraste-de-posicoes | redesenhar | pilares genéricos, sem água/ar/ápeiron desenhados |
| filosofia-heraclito-e-parmenides-o-ser-e-o-devir | contraste-de-posicoes | redesenhar | rio × esfera são imagens do próprio resumo, não desenhadas |
| filosofia-os-sofistas-e-a-crise-da-verdade | contraste-de-posicoes | redesenhar | pilares genéricos + colisão de rótulo em n=3 (confirmado em captura) |
| filosofia-a-teoria-das-ideias-de-platao | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-politica-aristotelica-o-homem-como-animal-politico | contraste-de-posicoes | redesenhar | pilares genéricos, risco de colisão em n=3 |
| filosofia-patristica-e-santo-agostinho | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-a-relacao-entre-fe-e-razao | contraste-de-posicoes | redesenhar | pilares genéricos, risco de colisão em n=3 |
| filosofia-racionalismo-continental-espinosa-e-leibniz | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-empirismo-britanico-locke-berkeley-e-hume | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-o-ideal-iluminista-de-razao-e-progresso | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-a-critica-da-razao-pura | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-alienacao-e-mais-valia | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-foucault-e-as-relacoes-de-poder | contraste-de-posicoes | redesenhar | pilares genéricos |
| filosofia-justica-e-direitos-humanos | contraste-de-posicoes | redesenhar | colisão de rótulo confirmada em captura (n=3, "Reabilitação historiográfica") |
| filosofia-etica-aplicada-e-bioetica | contraste-de-posicoes | redesenhar | pilares genéricos, risco de colisão em n=3 |
| filosofia-filosofia-politica-contemporanea | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-o-contexto-historico-do-surgimento-da-sociologia | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-sociologia-e-senso-comum | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-a-luta-de-classes-na-analise-sociologica | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-cultura-e-etnocentrismo | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-multiculturalismo-e-relativismo-cultural | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-divisao-social-do-trabalho | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-transformacoes-no-mundo-do-trabalho | contraste-de-posicoes | redesenhar | pilares genéricos |
| sociologia-desigualdade-racial-no-brasil | contraste-de-posicoes | redesenhar | pilares genéricos (n=2, sem colisão, mas ainda sem mecanismo) |
| filosofia-hobbes-e-o-estado-de-natureza | cadeia-de-derivacao | redesenhar | lista com marca-passo, sem desenho do pacto/soberano |
| filosofia-logica-e-metafisica-aristotelicas | cadeia-de-derivacao | redesenhar | mesma forma do Hobbes; silogismo pede diagrama de termos |
| filosofia-a-critica-de-hume-a-causalidade | cadeia-de-derivacao | redesenhar | lista genérica |
| filosofia-a-etica-kantiana-e-o-imperativo-categorico | cadeia-de-derivacao | redesenhar | lista genérica |
| filosofia-escolastica-e-santo-tomas-de-aquino | cadeia-de-derivacao | redesenhar | lista genérica |
| filosofia-locke-e-os-direitos-naturais | cadeia-de-derivacao | redesenhar | lista genérica |
| filosofia-o-existencialismo-de-sartre | cadeia-de-derivacao | redesenhar | lista genérica |
| filosofia-rousseau-e-a-vontade-geral | cadeia-de-derivacao | redesenhar | lista genérica |
| sociologia-precarizacao-e-uberizacao-do-trabalho | cadeia-de-derivacao | redesenhar | lista genérica |
| sociologia-desigualdade-de-genero | cadeia-de-derivacao | redesenhar | lista genérica |
| sociologia-educacao-e-socializacao-em-durkheim | cadeia-de-derivacao | redesenhar | lista genérica |
| sociologia-etica-protestante-e-o-espirito-do-capitalismo | cadeia-de-derivacao | redesenhar | lista genérica |
| filosofia-a-escola-de-frankfurt-e-a-industria-cultural | camadas-de-determinacao | redesenhar | pilha genérica; indústria cultural pede linha de produção desenhada |
| filosofia-a-luta-de-classes-na-filosofia-marxista | camadas-de-determinacao | redesenhar | pilha genérica |
| filosofia-o-materialismo-historico | camadas-de-determinacao | redesenhar | pilha genérica, bem preenchida (3 camadas) mas sem ícone |
| sociologia-modo-de-producao-e-estrutura-social | camadas-de-determinacao | redesenhar | pilha genérica + vazio vertical grande (só 1 camada sobre a base) |
| sociologia-ideologia-e-alienacao | camadas-de-determinacao | redesenhar | pilha genérica |
| filosofia-a-alegoria-da-linha-dividida-e-o-conhecimento | escala-de-graus | redesenhar | escada abstrata para uma alegoria com hierarquia visual e cognitiva citável |
| filosofia-a-etica-a-nicomaco-e-a-doutrina-do-meio-termo | escala-de-graus | redesenhar | escada abstrata; meio-termo entre dois vícios pede uma régua com extremos nomeados |
| filosofia-descartes-e-o-metodo-a-duvida-hiperbolica | escala-de-graus | redesenhar | escada abstrata |
| filosofia-o-mito-da-caverna | escala-de-graus | redesenhar | pior caso do grupo: alegoria visual icônica virou barras horizontais |
| sociologia-cidadania-e-direitos | escala-de-graus | redesenhar | escada abstrata para gerações de direitos (linha do tempo seria mais fiel) |
| sociologia-o-que-e-o-fato-social | criterios-conjuntivos | redesenhar | cartões de texto puro, sem exemplo concreto desenhado |
| sociologia-identidade-e-diferenca | criterios-conjuntivos | redesenhar | cartões de texto puro |
| sociologia-a-sociedade-da-informacao | criterios-conjuntivos | redesenhar | cartões de texto puro |
| sociologia-anomia-e-coesao-social | grade-de-eixos | redesenhar | texto vaza da célula e colide com a vizinha; grade cobre a nav fixa em 1440 |
| sociologia-classes-sociais-e-mobilidade-social | grade-de-eixos | redesenhar | mesmo defeito de texto vazando, confirmado em captura |
| sociologia-tipos-de-acao-social | tipologia | redesenhar | cartões numerados, sem ícone |
| sociologia-dominacao-e-poder-em-weber | tipologia | redesenhar | cartões numerados + nota de pegadinha com frase cortada (dado, não só forma) |
| sociologia-democracia-e-participacao-politica | tipologia | redesenhar | cartões numerados |
| sociologia-globalizacao-economica-e-cultural | tipologia | redesenhar | cartões numerados |
| sociologia-movimentos-sociais-classicos-e-contemporaneos | tipologia | redesenhar | cartões numerados |
| sociologia-o-estado-nacao-na-era-global | tipologia | redesenhar | cartões numerados |

## Defeitos transversais

1. **Empréstimo de estrutura (crítério 5) é a regra, não a exceção.** 8 das 9
   famílias do grupo desenham a mesma forma abstrata para todo capítulo que
   caiu nelas; só o texto de `src/views/topic-scenes/data/{filosofia,sociologia}.ts`
   muda. As duas capturas lado a lado de `cadeia-de-derivacao` (Hobbes ×
   silogismo aristotélico) e as duas de `movimento-dialetico` (Hegel ×
   Nietzsche) tornam isso literal: pixels idênticos, texto diferente.
2. **Colisão de rótulo em `ContrasteDePosicoes` com 3 itens e nomes longos**
   (`ContrasteDePosicoes.tsx:25,35`) — sem quebra de linha nem `font-size`
   adaptativo. Reproduzida em pelo menos 2 capturas, risco em ~6 dos 24
   capítulos da família.
3. **Texto vazando de célula em `GradeDeEixos`** (`GradeDeEixos.tsx:24,34`) —
   viewBox quadrado ampliado pelo CSS `width:100%` sem limitar o tamanho do
   texto à largura da célula. Reproduzida nos 2 únicos capítulos da família.
   Em 1440 px o desenho ampliado também empurra o conteúdo para debaixo da
   barra de navegação fixa.
4. **Altura fixa do `viewBox` em `CamadasDeDeterminacao` não se adapta ao
   número de itens** (`CamadasDeDeterminacao.tsx:14,19`) — capítulos com 1
   camada superior (Modo de Produção) deixam mais da metade do quadro vazia.
5. **Família escolhida por semelhança estrutural superficial, não por
   fidelidade ao mecanismo**: Nietzsche e Método Socrático usam
   `movimento-dialetico` (tese-antítese-síntese hegeliana) para descrever
   processos que não são dialéticos nesse sentido — o formato da família
   distorce o conteúdo, não só deixa de ilustrá-lo.
6. **Conteúdo sem lastro**: nenhum item inventado foi encontrado na amostra —
   toda citação (`quote`) conferida bate com o texto de
   `deepSummaryContent.json`/`interactiveSummaries`, incluindo o item extra
   "Difusos e digitais" em Cidadania e Direitos, que parecia adicional mas
   está no resumo. O único problema de conteúdo (não de forma) encontrado é a
   `nota` cortada de Dominação e Poder em Weber
   (`src/views/topic-scenes/data/sociologia.ts:30`).

## Proposta de lotes de redesenho

Ordem por tamanho do grupo e por gravidade do defeito de execução, não só
contagem:

1. **Lote A — grade-de-eixos (2) + camadas-de-determinacao (5) + criterios-conjuntivos (3) = 10 capítulos.**
   Prioridade máxima: são os únicos com defeito de renderização visível
   (texto vazando, colisão com nav fixa, vazio desproporcional) além da
   genericidade. Concentra Durkheim (fato social, anomia) e Marx/Frankfurt
   (materialismo histórico, ideologia, indústria cultural) — mecanismos bem
   desenháveis (linha de produção da indústria cultural; pirâmide
   infraestrutura/superestrutura com setas de retorno; quadro 2×2 do suicídio
   com ícones por tipo).
2. **Lote B — movimento-dialetico (3).** Pequeno e urgente: Nietzsche e
   Método Socrático usam uma metáfora que contradiz o próprio conteúdo; Hegel
   só precisa de ajuste. Vale revisar antes que mais capítulos entrem nesta
   família por semelhança superficial ("tem duas posições, cabe aqui").
3. **Lote C — escala-de-graus (5).** O Mito da Caverna é o item de maior
   visibilidade e maior distância entre o texto e a imagem clássica; os outros
   quatro (alegoria da linha dividida, doutrina do meio-termo, dúvida
   cartesiana, cidadania e direitos) têm mecanismos citáveis e concretos.
4. **Lote D — cadeia-de-derivacao (12).** Maior volume de capítulos com a
   mesma forma; silogismo, contrato social (Hobbes/Locke/Rousseau) e
   Sartre/existencialismo têm diagramas próprios bem conhecidos (Venn,
   linha do tempo do pacto, angústia da escolha).
5. **Lote E — tipologia (6, exceto mutações genéticas que já é bom exemplo).**
   Corrigir a `nota` cortada de Weber antes ou junto do redesenho.
6. **Lote F — contraste-de-posicoes (24).** Maior grupo; redesenhar em
   sublotes por época/tema (pré-socráticos e clássicos; medievais e
   racionalistas; contratualistas e Marx; contemporâneos — Foucault, ética
   aplicada, filosofia política; Sociologia — cultura, trabalho, classes).
   Corrigir a colisão de rótulo (item transversal 2) é obrigatório mesmo que o
   redesenho de cada capítulo individual espere a fila.
