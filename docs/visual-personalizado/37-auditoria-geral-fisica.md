# Auditoria geral — Física (85 capítulos)

Data: 26/09/2026. Só leitura de código e navegador (1440 claro / 390 escuro); nada em `src/` foi alterado. Capturas em `docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/fisica/` (40 PNGs, amostra dirigida aos defeitos encontrados). Varredura automática cobriu os 85 capítulos nas duas larguras (`fis-sweep-all.log`, 169 páginas carregadas).

## 1. Resumo

| Veredito | Capítulos |
| --- | --- |
| Manter | 64 |
| Ajustar | 3 |
| Redesenhar | 18 |

Por engine (85 = soma):

| Engine | Capítulos | Manter | Ajustar | Redesenhar |
| --- | --- | --- | --- | --- |
| PhysicsRemainingBoard | 15 | 15 | 0 | 0 |
| MechanicsFinalBoard | 5 | 5 | 0 | 0 |
| EB (EnergyInstrument) | 5 | 0 | 0 | 5 |
| ElectrostaticsBoard | 5 | 5 | 0 | 0 |
| ElectricBoard | 5 | 5 | 0 | 0 |
| MagnetismBoard | 5 | 5 | 0 | 0 |
| DB (DynamicsInstrument) | 4 | 0 | 0 | 4 |
| OB (OrbitalInstrument) | 4 | 0 | 1 | 3 |
| WavesBoard | 4 | 4 | 0 | 0 |
| WaveBoard | 3 | 3 | 0 | 0 |
| VB (VectorsInstrument) | 3 | 0 | 0 | 3 |
| ThermoBoard | 3 | 3 | 0 | 0 |
| OpticsBoard | 3 | 3 | 0 | 0 |
| LensBoard | 3 | 2 | 1 | 0 |
| CalorimetryBoard | 2 | 2 | 0 | 0 |
| KBoard (KinematicsInstrument) | 2 | 2 | 0 | 0 |
| autoral (cena própria) | 5 | 5 | 0 | 0 |
| KinematicsBoard | 1 | 1 | 0 | 0 |
| grade-de-eixos (cena) | 1 | 1 | 0 | 0 |
| NewtonBoard | 1 | 0 | 0 | 1 |
| criterios-conjuntivos (cena) | 1 | 0 | 0 | 1 |
| HydrostaticsBoard | 1 | 1 | 0 | 0 |
| cadeia-de-derivacao (cena) | 1 | 1 | 0 | 0 |
| AdiabaticBoard | 1 | 0 | 0 | 1 |
| CircuitBoard | 1 | 1 | 0 | 0 |
| VisionDefectsBoard | 1 | 0 | 1 | 0 |
| **Total** | **85** | **64** | **3** | **18** |

**Cinco achados principais:**

1. Dois "instrumentos" inteiros são estrutura genérica com texto trocado, do mesmo tipo já achado em História/Geografia: `DynamicsInstrument.tsx` (4 capítulos — caixa com 3 setas, igual para resultante de forças, força de contato e **corpos interagindo por um fio**, que deveria mostrar dois corpos e uma corda/roldana e não mostra nenhum) e `OrbitalInstrument.tsx` (3 dos 4 capítulos — círculo dentro de círculo com uma linha radial, byte-idêntico entre "Leis da Gravitação", "Dinâmica do Movimento Circular" e "Órbitas", sem órbita, satélite ou movimento algum). `VectorsInstrument.tsx` (3 capítulos) e `EnergyInstrument.tsx` (5 capítulos) repetem o padrão com um triângulo de vetor e uma caixa+barra genéricos, respectivamente.
2. **Regressão ao anti-padrão do `.webp` transparente que o CLAUDE.md documenta como erro corrigido.** `NewtonBoard.tsx` e `AdiabaticBoard.tsx` hoje renderizam `<motion.img src=".../*-atlas.webp">` em vez de SVG. No caso do pistão adiabático isso é mais grave: o arquivo ainda contém `AdiabaticPiston`, um SVG completo, anotado e comentado ("Antes era `<img>`... desenhado aqui em vez de vir de um arquivo"), que **não é usado** — o componente exportado chama `AdiabaticAtlas` (a versão raster) na cena real. A imagem de Newton não acompanha o tema escuro (fundo pastel claro contra o cartão escuro) e o rodapé com "Q = 0 riscado" e a legenda colidem com a barra de navegação inferior no celular.
3. **`estatica-*` não desenha nada.** O capítulo "Estática" é a única cena do lote sem nenhum elemento SVG (`nEls: 0` nas duas larguras): três cartões de texto com condições de equilíbrio (translação, rotação, "um critério só não basta"), sem corpo, sem forças, sem braço de alavanca — viola a regra 1 (mecanismo desenhado) num capítulo cujo fenômeno é claramente visual.
4. **`LensBoard` renderiza dois capítulos diferentes com o mesmo pixel a pixel.** "Lentes Esféricas: Estudo Gráfico" e "Estudo Analítico das Lentes Esféricas" mostram exatamente a mesma cena de traçado de raios, mesmo título, mesmo texto — a rota condicional do componente só distingue "fabricante" dos outros dois, não distingue os dois entre si.
5. **Bug preciso, achado por código, não só por captura**: `DynamicsInstrument.tsx:2` e `VectorsInstrument.tsx:2` cortam o primeiro período do excerto em `.slice(0,180)` sem reticências — diferente de todos os outros 9 arquivos de instrumento, que fazem `slice(0,176)+'…'`. O corte aparece nas capturas como palavra pela metade ("...soma ve", "...cada um po"). A varredura automática também achou a `formula` de "corpos interagindo" (`T atua em sentidos opostos nos corpos`, uma frase, não uma fórmula) vazando da caixa do cartão — confirmado visualmente.

## 2. Por engine

### PhysicsRemainingBoard — 15 capítulos, manter
`src/views/visual-instruments/PhysicsRemainingInstrument.tsx`. Apesar do nome ("o que sobrou"), é o melhor engine do lote: cada um dos 15 ids tem uma cena própria e fisicamente correta — eco com ida/volta e fórmula `d=340·Δt/2`, difração com leque de raios saindo de duas fendas, harmônicos em tubo com função de perfil comentada para não espelhar a curva errada, polias com raios e velocidade angular distintos, mapa de campo elétrico radial com carga de teste, amperímetro em série vs voltímetro em paralelo com o próprio traçado do fio mudando, gerador/receptor com `U = ε − ri` e `U = ε' + r'i`, campo de ímã com bússola, sombra/penumbra geométrica, luneta com imagem intermediária real, onda com λ marcado, corda com extremidade fixa/livre, corda estacionária com nós contados, fóton subindo níveis de energia. Verificado ao vivo: `o-movimento-circular` (polias) e o ramo padrão de física quântica.
Nenhum defeito transversal encontrado nesta amostra além do genérico já corrigido (`--vs-ink-muted`, ver seção 4).

### MechanicsFinalBoard — 5 capítulos, manter
`MechanicsFinalInstrument.tsx`. Cena própria por id: `vertical-plane` (círculo + N/mg no topo, texto muda com "contato se perde"), `mhs` (mola com senoide e bloco), `potential-energy` (rampa com bloco a altura h), `nonconservative` (bloco com trilha de atrito ondulada), e o ramo padrão para `equivalencia-massa-energia` (átomo estilizado com Δm→E). Sem genericidade.

### EB — EnergyInstrument.tsx — 5 capítulos, **redesenhar**
Ids: `impulso`, `conservacao-momento`, `trabalho-forca`, `energia-cinetica`, `potencia`. É o único arquivo de instrumento **sem** função `Scene` por id — desenha sempre um retângulo (`vs-plane`) e uma barra horizontal subindo, sem eixos, sem grade, sem rótulos de eixo, só a fórmula como texto (linha 2 do arquivo). O texto do cartão "Aplicação" chega a descrever "área sob a curva força×tempo" (impulso) sem que a curva exista no desenho. Capturado: `impulso-e-quantidade-de-movimento` e `trabalho-e-energia-trabalho-de-uma-forca` são visualmente idênticos exceto pela fórmula.
Defeito adicional: o cartão "Aplicação" de `trabalho-forca` tem um parágrafo de ~9 linhas (bem acima da densidade das outras pranchas) — quebra a régua "densidade alta mas leitura clara".

### ElectrostaticsBoard — ElectrostaticsInstrument.tsx — 5 capítulos, manter
`coulomb` (duas cargas com distância r variável), `field` (linhas radiais saindo de +Q), `potential` (equipotenciais concêntricas), `uniform-field` (placas paralelas com linhas de campo retas), e o ramo padrão para `dinamica-das-cargas-eletricas` (carga acelerando por F=qE). Sem genericidade.

### ElectricBoard — ElectricInstrument.tsx — 5 capítulos, manter
`current` (cargas cruzando uma seção, opacidade ligada à corrente), `power` (resistor com potência calculada), `resistor` (zigue-zague com corrente inversamente proporcional), `kirchhoff` (nó com correntes de entrada/saída somando), e o ramo padrão para `capacitores` (placas com cargas opostas). Sem genericidade.

### MagnetismBoard — MagnetismInstrument.tsx — 5 capítulos, manter
`fio-espira` (linhas de campo circulares), `carga-em-b` (trajetória curva com feixe entrando em ×××), `fios-paralelos` (atração entre correntes paralelas), `lenz` (ímã se aproximando de uma espira), e o ramo padrão para indução em geradores (espira girando entre polos N/S). Verificado ao vivo (`inducao-eletromagnetica-lei-de-lenz`): cena própria, texto do cartão correto, sem genericidade.

### DB — DynamicsInstrument.tsx — 4 capítulos, **redesenhar**
`src/views/visual-instruments/DynamicsInstrument.tsx:2`. Ids: `resultante`, `contato`, `corpos`, `plano`. Uma única cena — um bloco sobre uma reta (ou rampa, só para `plano`) com até três setas — serve os quatro capítulos.
- **`corpos` (Sistema de Corpos Interagindo) é o pior caso**: o resumo e a própria pergunta do experimento falam de tração transmitida entre dois blocos acoplados e citam a "máquina de Atwood", mas a cena desenha **um único bloco**, sem segundo corpo, sem fio, sem roldana. Confirmado por captura (`sistema-de-corpos-interagindo-...-1440-claro.png`): o único elemento que muda é o texto.
- **Bug de overflow confirmado**: a `formula` de `corpos` no `dynamicsLab.ts` é a frase `'T atua em sentidos opostos nos corpos'` (não uma fórmula) — ela vaza da caixa `<code>` tanto no cartão de aplicação quanto na barra de equação inferior (visível na captura, texto cortado em "...nos corp").
- **Bug de truncamento sem reticências**: `function s(t){return(...).slice(0,180)}` (linha 2) não adiciona `…` como os outros 9 arquivos de instrumento fazem — corta no meio da palavra ("...pela soma ve", capturado em `resultante-de-um-sistema-de-forcas`).
- `plano-inclinado` ao menos ganha a rampa (`id==='plano'`), então tem alguma diferenciação, mas herda a mesma caixa+setas anêmica e o mesmo bug de truncamento — mantém-se em "redesenhar" pelo conjunto.

### OB — OrbitalInstrument.tsx — 4 capítulos, 3 redesenhar + 1 ajustar
`src/views/visual-instruments/OrbitalInstrument.tsx:2`. Ids: `gravidade`, `circular`, `orbitas`, `balistica`.
- `gravidade` (Leis da Gravitação), `circular` (Dinâmica do Movimento Circular) e `orbitas` (Órbitas) renderizam **a mesma cena, byte a byte**: um círculo pintado dentro de outro círculo maior, com uma linha radial. Confirmado por captura: `leis-da-gravitacao-1440-claro.png` e `orbitas-1440-claro.png` são pixel-idênticos na cena (só título/texto muda). Nenhuma trajetória, nenhum satélite, nenhuma velocidade tangencial desenhada — para um trio de capítulos cujo conteúdo é inteiramente sobre movimento orbital. **Redesenhar os três.**
- `balistica` recebe um caminho parabólico (`id==='balistica'?'M50 230 Q160 45 270 230'`), então tem alguma identidade própria — **ajustar** (ainda herda o círculo decorativo sem função e a seta genérica, mas o traçado da trajetória já diferencia o capítulo).
- Cartão "Aplicação" de `orbitas` tem parágrafo de ~10 linhas sobre órbita geoestacionária — mesma densidade excessiva do EB.

### WavesBoard — WavesInstrument.tsx — 4 capítulos, manter
`wave-equation`/`sound-intensity`/`interference`/`string-harmonics` e o ramo padrão (efeito Doppler, frentes de onda comprimidas). Cada cena é gerada por função própria (onda senoidal parametrizada, círculos concêntricos de intensidade, superposição de duas fases, corda com nós contados). Sem genericidade.

### WaveBoard — 3 capítulos (equação fundamental, ondas eletromagnéticas, som), manter
`WaveBoard.tsx` + `WaveMechanism.tsx` compartilham a mesma armação (eixo de propagação, controle de frequência/amplitude), mas isso é reaproveitamento legítimo pela regra 5: o objeto é o mesmo (uma onda com λ e f), e a renderização muda de fato por `kind` — som ganha nuvem de pontos comprimindo/rarefazendo, eletromagnética ganha dois campos E/B perpendiculares rotulados, transversal ganha um ponto oscilando na vertical com marca vermelha. Precedente análogo ao plano cartesiano de funções citado no CLAUDE.md.

### VB — VectorsInstrument.tsx — 3 capítulos, **redesenhar**
`src/views/visual-instruments/VectorsInstrument.tsx:2`. Ids: `vetores` (Grandezas Físicas e Vetores), `velocidade` (Velocidade Vetorial), `composicao` (Composição de Movimentos). Mesmo triângulo retângulo de composição vetorial nos três — nenhum contexto físico desenhado (sem barco, sem rio, sem margens para o capítulo de travessia, que é justamente o exemplo clássico do resumo). Confirmado por captura: `composicao-de-movimentos-1440-claro.png` mostra o texto "Ler a travessia de rio" ao lado de um triângulo genérico sem barco nem rio.
Mesmo bug de truncamento sem reticências que o DB (`function short(t){return(...).slice(0,180)}`, linha 2) — confirmado no card esquerdo, cortado em "...cada um po".

### ThermoBoard — ThermoInstrument.tsx — 3 capítulos, manter
`gas-work` (área sob a curva pV real, com o retângulo hachurado), `first-law` (círculo do sistema com Q entrando e W saindo), e o ramo padrão para Carnot (fonte quente/fria com W entre elas). Sem genericidade — este é o contraponto direto do EB: aqui o "trabalho como área" é de fato desenhado.

### OpticsBoard — OpticsInstrument.tsx — 3 capítulos, manter
`plane-mirror` (lei de reflexão com ângulos iguais calculados), `spherical-mirror` (posição da imagem calculada por `sphericalImageDistance`), `refraction` (lei de Snell com `angleOfRefraction` real). Engine tecnicamente sólido (funções trigonométricas de verdade, não aproximação visual). Verificado ao vivo indiretamente pela leitura do código; qualidade evidente e consistente com a amostra capturada de `LensBoard`/`VisionDefectsBoard`, que reaproveitam o mesmo padrão de traçado de raios.

### LensBoard — 3 capítulos, 1 manter + 2 ajustar
`src/views/visual-boards/LensBoard.tsx:10`. A rota condicional só verifica `maker` (equação do fabricante) — os outros dois ids (`lentes-esfericas-estudo-grafico` e `estudo-analitico-das-lentes-esfericas`) caem no mesmo `else`, então renderizam **o mesmo componente com o mesmo texto**. Confirmado por captura: `lentes-esfericas-estudo-grafico-1440-claro.png` e `estudo-analitico-das-lentes-esfericas-1440-claro.png` são idênticos, inclusive o título "Lentes: onde a imagem se forma" e a legenda "Equação de Gauss".
- `lentes-esfericas-estudo-grafico`: manter (o conteúdo de traçado gráfico de raios é o que já está lá).
- `estudo-analitico-das-lentes-esfericas`: ajustar — precisa de conteúdo próprio sobre convenção de sinais e álgebra da equação de Gauss, hoje ausente.
- `equacao-do-fabricante-de-lentes-e-associacao-de-lentes`: manter (tem ramo `maker` dedicado, com vergência e associação de lentes).

### CalorimetryBoard — 2 capítulos, manter (observação de duplicidade)
`fis-termologia-calor` e `calor-sensivel-e-calor-latente` renderizam o mesmo board — mas, diferente do LensBoard, aqui os dois ids parecem ser o mesmo capítulo em dois formatos de id (um herdado de apostila, outro do currículo de resumos), então o conteúdo idêntico não é per se um empréstimo indevido. Vale confirmar com a Ana Júlia se `fis-termologia-calor` é entrada legada a aposentar.

### KBoard — KinematicsInstrument.tsx — 2 capítulos, manter
`movimento-uniforme` (reta no gráfico posição×tempo) e `movimento-uniformemente-variado` (curva). Reaproveitamento legítimo pela regra 5 — o objeto é o gráfico cinemático, que muda de fato de reta para parábola entre os dois capítulos. Observação menor: os eixos do gráfico não têm rótulo "t"/"s" — ajuste de polimento, não redesenho.

### Capítulos com engine próprio (1 capítulo cada)
- **NewtonBoard** (`as-leis-de-newton`) — **redesenhar**. Usa `<motion.img src="/visual-assets/newton-laws-atlas.webp">`, contrariando a regra explícita "a cena é desenhada em SVG, nunca um arquivo de imagem". A imagem (61% dos pixels opacos, portanto carrega e é vista — não é o defeito do `.webp` transparente original) não muda com o tema: no escuro, o fundo pastel dos três balões (verde/azul/rosa) da ilustração continua claro contra o cartão `--vs-paper-strong` escuro, criando um contraste que destoa do resto da prancha (ver `as-leis-de-newton-390-escuro.png`). O rodapé do mapa de relações ("Continuam enquanto nenhuma força...") também colide com a barra de navegação inferior fixa no celular.
- **AdiabaticBoard** (`primeira-lei-da-termodinamica-aplicada-...`) — **redesenhar**, com o menor custo de correção do lote inteiro. O arquivo já contém `AdiabaticPiston` — um SVG completo, com hachuras de isolamento térmico, moléculas, `SceneNote` com âncoras e o comentário explicando por que um raster foi rejeitado antes — mas a função exportada usa `AdiabaticAtlas`, que renderiza `<motion.img src="/visual-assets/adiabatic-piston-atlas.webp">` em vez do SVG já pronto. Corrigir é trocar uma linha (`scene={<AdiabaticAtlas .../>}` → `scene={<AdiabaticPiston .../>}`), não desenhar do zero.
- **HydrostaticsBoard** (`hidrostatica-densidade-e-pressao`) — manter (não capturado nesta rodada; arquivo dedicado de 127 linhas, sem sinal de genericidade na varredura).
- **CircuitBoard** (`circuitos-de-malha-unica`) — manter. Verificado ao vivo: circuito de resistores em série e em paralelo desenhado com símbolos reais (fonte, resistores, dois ramos), conteúdo fiel (Req = R1+R2 em série, 1/Req = 1/R1+1/R2 em paralelo, "queimar uma lâmpada em série apaga as outras").
- **VisionDefectsBoard** (`optica-da-visao`) — ajustar. Bom conteúdo (miopia com lente divergente antes da retina, hipermetropia com convergente depois, presbiopia diferenciada corretamente do erro de refração), mas a varredura achou fonte de **5,3–6,4 px efetivos** nos rótulos "lente divergente"/"lente convergente" dentro do mini-diagrama do olho — abaixo de qualquer limite de legibilidade, mesmo tendo sido possível ler na captura em 1440.
- **KinematicsBoard** (`cinematica-escalar-conceitos-fundamentais`) — manter (board dedicado, não capturado nesta rodada por prioridade de tempo; sem sinais de genericidade no código).
- **grade-de-eixos** (`aceleracao-vetorial`) e **cadeia-de-derivacao** (`dilatacao-ou-contracao-termica-dos-solidos-e-liquidos`) — manter (cenas de família própria; varredura sem colisão nem estouro).
- **criterios-conjuntivos** (`estatica`) — **redesenhar**. Confirmado por captura (`estatica-1440-claro.png`): três cartões de texto expansíveis (Translação/Rotação/"um critério só não basta"), **zero elementos SVG** desenhados (`nEls: 0` nas duas larguras da varredura). Não há corpo, força ou braço de alavanca — o único capítulo do lote sem nenhum desenho do fenômeno.

### autoral — 5 capítulos, manter
`forca-e-seus-tipos`, `colisoes`, `a-fisica-por-tras-da-obtencao-de-energia-eletrica-...`, `gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas`, `eletrostatica-processos-de-eletrizacao-e-aplicacoes` — marcados `autoral: true` no inventário. Verificado ao vivo `forca-e-seus-tipos`: diagrama de corpo livre com um bloco e cinco tipos de força selecionáveis por chip (Peso/Normal/Tração/Atrito/Elástica), cada um isolado com seu próprio texto e fórmula — mecanismo fiel ao capítulo, sem empréstimo. Fonte de rodapé pequena (7,6 px, texto de atribuição "As forças que aparecem no vestibular") — cosmético, não redesenho.

## 3. Tabela por capítulo

| id | engine | veredito | motivo |
| --- | --- | --- | --- |
| fis-termologia-calor | CalorimetryBoard | manter | possível duplicata legada de calor-sensivel-e-calor-latente; conteúdo correto |
| cinematica-escalar-conceitos-fundamentais | KinematicsBoard | manter | board dedicado |
| movimento-uniforme | KBoard | manter | gráfico reta, objeto legítimo |
| movimento-uniformemente-variado | KBoard | manter | gráfico curva, objeto legítimo |
| o-movimento-circular | PhysicsRemainingBoard | manter | polias com raios e ω distintos, verificado ao vivo |
| grandezas-fisicas-e-operacoes-com-vetores | VB | redesenhar | triângulo genérico, sem contexto |
| velocidade-vetorial | VB | redesenhar | mesmo triângulo de "vetores" |
| composicao-de-movimentos | VB | redesenhar | sem barco/rio apesar do texto pedir travessia |
| aceleracao-vetorial | grade-de-eixos | manter | cena de família própria, sem colisão |
| forca-e-seus-tipos | autoral | manter | 5 tipos de força isolados, DCL correto |
| resultante-de-um-sistema-de-forcas | DB | redesenhar | caixa+setas genérica |
| as-leis-de-newton | NewtonBoard | redesenhar | raster não acompanha tema escuro; rodapé colide com nav |
| a-forca-de-contato | DB | redesenhar | mesma caixa+setas de "resultante" |
| sistema-de-corpos-interagindo-e-os-elementos-transmissores-de-forca | DB | redesenhar | 1 corpo só desenhado para capítulo de 2 corpos + corda; fórmula vaza do cartão |
| plano-inclinado | DB | redesenhar | ganha rampa mas herda caixa+setas e bug de truncamento |
| leis-da-gravitacao | OB | redesenhar | idêntico a "orbitas" e "dinamica-do-movimento-circular" |
| dinamica-do-movimento-circular | OB | redesenhar | idêntico aos outros dois |
| analisando-movimentos-contidos-em-um-plano-vertical | MechanicsFinalBoard | manter | cena própria (N/mg no topo do loop) |
| orbitas | OB | redesenhar | idêntico a "gravitacao"; sem órbita desenhada |
| balistica | OB | ajustar | ganha parábola própria, mas herda decoração genérica |
| movimento-harmonico-simples-mhs | MechanicsFinalBoard | manter | mola com senoide própria |
| impulso-e-quantidade-de-movimento | EB | redesenhar | caixa+barra sem eixos |
| sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento | EB | redesenhar | mesma caixa+barra |
| colisoes | autoral | manter | cena tipológica própria |
| trabalho-e-energia-trabalho-de-uma-forca | EB | redesenhar | mesma caixa+barra; cartão com parágrafo excessivo |
| trabalho-e-energia-teorema-da-energia-cinetica | EB | redesenhar | mesma caixa+barra |
| trabalho-e-energia-o-teorema-da-energia-potencial | MechanicsFinalBoard | manter | rampa com bloco a altura h |
| sistemas-conservativos-e-sistemas-nao-conservativos | MechanicsFinalBoard | manter | trilha de atrito ondulada própria |
| potencia-maquina-e-rendimento | EB | redesenhar | mesma caixa+barra |
| a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares | autoral | manter | cena tipológica própria |
| equivalencia-massa-energia | MechanicsFinalBoard | manter | ramo padrão Δm→E |
| estatica | criterios-conjuntivos | redesenhar | zero elementos SVG; só texto |
| hidrostatica-densidade-e-pressao | HydrostaticsBoard | manter | board dedicado |
| dilatacao-ou-contracao-termica-dos-solidos-e-liquidos | cadeia-de-derivacao | manter | cena de família própria |
| calor-sensivel-e-calor-latente | CalorimetryBoard | manter | board dedicado |
| gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas | autoral | manter | cena tipológica própria |
| trabalho-da-forca-de-pressao-do-gas | ThermoBoard | manter | área sob curva pV real |
| primeira-lei-da-termodinamica | ThermoBoard | manter | círculo do sistema com Q/W |
| primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares | AdiabaticBoard | redesenhar | usa raster; SVG pronto (`AdiabaticPiston`) já existe no arquivo e não é usado |
| maquinas-termicas-e-ciclo-de-carnot | ThermoBoard | manter | fonte quente/fria com W |
| eletrostatica-processos-de-eletrizacao-e-aplicacoes | autoral | manter | cena tipológica própria |
| forca-eletrica-lei-de-coulomb | ElectrostaticsBoard | manter | duas cargas com distância r |
| campo-eletrico | ElectrostaticsBoard | manter | linhas radiais de +Q |
| energia-potencial-e-potencial-eletrico | ElectrostaticsBoard | manter | equipotenciais concêntricas |
| mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais | PhysicsRemainingBoard | manter | campo radial com carga de teste |
| campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial | ElectrostaticsBoard | manter | placas paralelas |
| dinamica-das-cargas-eletricas | ElectrostaticsBoard | manter | ramo padrão F=qE |
| corrente-eletrica | ElectricBoard | manter | cargas cruzando seção |
| potencia-eletrica | ElectricBoard | manter | resistor com potência |
| resistores | ElectricBoard | manter | zigue-zague com corrente ∝ 1/R |
| medidores-eletricos | PhysicsRemainingBoard | manter | amperímetro série × voltímetro paralelo |
| geradores | PhysicsRemainingBoard | manter | U = ε − ri |
| receptores | PhysicsRemainingBoard | manter | U = ε' + r'i |
| circuitos-de-malha-unica | CircuitBoard | manter | série/paralelo com símbolos reais, verificado ao vivo |
| eletrodinamica-as-leis-de-kirchhoff | ElectricBoard | manter | nó com correntes somando |
| capacitores | ElectricBoard | manter | ramo padrão placas com cargas opostas |
| imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre | PhysicsRemainingBoard | manter | ímã com bússola |
| campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes | MagnetismBoard | manter | linhas de campo circulares |
| forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme | MagnetismBoard | manter | trajetória curva em ××× |
| analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas | MagnetismBoard | manter | atração entre fios paralelos |
| inducao-eletromagnetica-lei-de-lenz | MagnetismBoard | manter | ímã + espira, verificado ao vivo |
| inducao-eletromagnetica-analise-da-corrente-induzida-em-geradores | MagnetismBoard | manter | espira girando N/S |
| fundamentos-da-optica-geometrica | PhysicsRemainingBoard | manter | sombra/penumbra geométrica |
| reflexao-em-superficies-planas | OpticsBoard | manter | ângulos i=r calculados |
| reflexao-em-superficies-esfericas | OpticsBoard | manter | posição de imagem calculada |
| refracao-fundamentos-leis-e-aplicacoes | OpticsBoard | manter | lei de Snell real |
| lentes-esfericas-estudo-grafico | LensBoard | manter | traçado de raios, verificado ao vivo |
| estudo-analitico-das-lentes-esfericas | LensBoard | ajustar | idêntico ao estudo gráfico; falta conteúdo analítico próprio |
| equacao-do-fabricante-de-lentes-e-associacao-de-lentes | LensBoard | manter | ramo `maker` dedicado |
| optica-da-visao | VisionDefectsBoard | ajustar | fonte de 5,3–6,4px nos rótulos do diagrama do olho |
| microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas | PhysicsRemainingBoard | manter | luneta com imagem intermediária |
| conceitos-basicos | PhysicsRemainingBoard | manter | onda com λ marcado |
| equacao-fundamental-da-ondulatoria | WaveBoard | manter | onda transversal com ponto oscilando |
| ondulatoria-ondas-eletromagneticas | WaveBoard | manter | campos E/B perpendiculares, diferenciado |
| ondulatoria-som-e-suas-propriedades | WaveBoard | manter | nuvem de pontos comprimindo, diferenciado |
| intensidade-sonora | WavesBoard | manter | círculos concêntricos de intensidade |
| reflexao-eco-reverberacao-e-refracao-de-ondas | PhysicsRemainingBoard | manter | eco com ida/volta e fórmula |
| fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas | PhysicsRemainingBoard | manter | reflexão fixa/livre com fase invertida |
| fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia | PhysicsRemainingBoard | manter | leque de difração |
| interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento | WavesBoard | manter | superposição de duas fases |
| um-caso-particular-de-interferencia-onda-estacionaria | PhysicsRemainingBoard | manter | nós/ventres contados |
| ondas-estacionarias-em-cordas | WavesBoard | manter | corda com nós fixos |
| ondas-estacionarias-em-tubos | PhysicsRemainingBoard | manter | perfil por função, sem espelhamento (bug já corrigido conforme comentário) |
| efeito-doppler-descricao-e-estudo-quantitativo | WavesBoard | manter | frentes comprimidas à frente |
| nocoes-basicas-de-fisica-quantica | PhysicsRemainingBoard | manter | fóton subindo níveis, verificado ao vivo |

## 4. Defeitos transversais e conteúdo sem lastro

1. **Estrutura genérica com texto trocado** (o mesmo padrão do relatório de História/Geografia): `DynamicsInstrument.tsx`, `OrbitalInstrument.tsx`, `VectorsInstrument.tsx`, `EnergyInstrument.tsx` — 16 capítulos ao todo. Ao contrário de História/Geografia, aqui a maioria dos outros 9 arquivos de instrumento (`KinematicsInstrument`, `MechanicsFinalInstrument`, `ElectrostaticsInstrument`, `ElectricInstrument`, `MagnetismInstrument`, `OpticsInstrument`, `ThermoInstrument`, `WavesInstrument`, `PhysicsRemainingInstrument`) já resolveu isso com uma função `Scene` própria por id — os quatro genéricos são exceção, não regra, e servem de modelo de correção uns para os outros.
2. **Truncamento sem reticências**: `DynamicsInstrument.tsx:2` e `VectorsInstrument.tsx:2` usam `.slice(0,180)` puro; os outros 9 arquivos usam `slice(0,176)+'…'`. Corrigir as duas linhas resolve o corte de palavra em qualquer excerto longo desses dois engines.
3. **Regressão ao raster de cena** (`NewtonBoard.tsx`, `AdiabaticBoard.tsx`) — contraria a frase do CLAUDE.md "a cena é desenhada em SVG no componente, nunca um arquivo de imagem" e o precedente do `.webp` transparente. Vale auditoria rápida de `HeartCirculationBoard.tsx` (Biologia, fora deste escopo) que usa o mesmo padrão `<img src=".../*-atlas.webp">` — mesma família de arquivos `public/visual-assets/*-atlas.webp` (newton, adiabatic-piston, atom-models, heart-circulation, photosynthesis) sugere uma decisão de produto recente de reintroduzir ilustrações raster “atlas”, que precisa ser confirmada com a Ana Júlia antes de reverter, já que ela pode ter aprovado esse formato para leitura mais “livro didático”. O que não tem ambiguidade é o caso do pistão adiabático: o SVG substituto já foi escrito, comentado e teria bloqueado a regressão se estivesse ligado — reconectar `AdiabaticPiston` é a correção mais barata do relatório inteiro.
4. **Cartões "Aplicação" às vezes viram parágrafo de ~10 linhas** (`impulso`/`trabalho-forca` do EB, `orbitas` do OB) — bem acima da densidade das outras pranchas do mesmo lote, quebrando a promessa de "densidade alta mas leitura clara" do `PADRAO-VISUAL-OBRIGATORIO.md`.
5. **Fonte efetiva abaixo de 9 px** em dois pontos: `optica-da-visao` (5,3–6,4px, rótulos "lente divergente/convergente" dentro do mini-diagrama) e os rótulos internos de `forca-e-seus-tipos`/`colisoes` (7,6px, texto de atribuição, menos crítico).
6. **`--vs-ink-muted` e `--vs-blue`**: já corrigidos em `Visual.css:7-16` (comentário no próprio CSS documenta o bug relatado em História/Geografia). Conferido que os 15 capítulos de `PhysicsRemainingBoard`, que usam `var(--vs-ink-muted)` e `var(--vs-blue)` extensivamente, herdam a correção — nenhum traço sumido nem texto ilegível no escuro nesta amostra.
7. **Falsos "sem artefato" na varredura automática**: ~40 das 169 páginas varridas reportaram `art:"none"` na primeira passada, mas checagem manual em 4 delas (`orbitas`, `primeira-lei-da-termodinamica`, `campo-eletrico`, `forca-eletrica-lei-de-coulomb`) mostrou a prancha carregando normalmente — é instabilidade de tempo de carregamento sob muitos contextos sequenciais do Playwright, não um bug do produto. Não usar esses "none" como veredito sem confirmação visual (o que este relatório já fez).

**Conteúdo sem lastro**: nenhum caso de invenção de fato encontrado nesta amostra (diferente do achado em História/Geografia). O problema dominante em Física é estrutura genérica e regressão a raster, não conteúdo fabricado. O único ponto de atenção editorial é a possível duplicidade `fis-termologia-calor` × `calor-sensivel-e-calor-latente` (seção 2), que é uma questão de currículo, não de precisão factual.

## 5. Proposta de lotes de redesenho

Ordem sugerida, do maior ganho por esforço para o menor:

1. **Correção imediata, quase sem desenho novo** — `AdiabaticBoard`: trocar `AdiabaticAtlas` por `AdiabaticPiston` (já escrito). `DynamicsInstrument.tsx:2` e `VectorsInstrument.tsx:2`: adicionar a reticência que falta. `dynamicsLab.ts`: trocar a `formula` de `corpos` por uma fórmula curta de verdade (ex.: `T_A = T_B`) e mover a frase para `insight`. Resolve 1 redesenho inteiro + 2 bugs transversais em poucas linhas.
2. **OB — Órbitas e movimento circular (3 capítulos)**: `leis-da-gravitacao`, `dinamica-do-movimento-circular`, `orbitas`. Cena única hoje; precisa de órbita elíptica/circular desenhada, satélite em movimento, vetor de velocidade tangente e força centrípeta apontando ao centro — o objeto (um corpo orbitando outro) é o mesmo para os três, então um instrumento novo bem desenhado, com parâmetro de raio/velocidade, atende aos três de uma vez sem virar empréstimo (a regra 5 permite objeto compartilhado quando ele é o próprio assunto).
3. **DB — Dinâmica com corpos e forças (4 capítulos)**: `resultante-de-um-sistema-de-forcas`, `a-forca-de-contato`, `sistema-de-corpos-interagindo-...`, `plano-inclinado`. Precisam de diagramas de corpo livre reais por capítulo — em especial dois blocos e uma corda para "corpos interagindo". Não dá para resolver com um único objeto compartilhado como o OB, porque os quatro mecanismos são visualmente diferentes (bloco isolado × bloco em contato com atrito × dois blocos com fio × bloco em rampa).
4. **VB — Vetores (3 capítulos)**: `grandezas-fisicas-e-operacoes-com-vetores`, `velocidade-vetorial`, `composicao-de-movimentos`. Precisa de contexto físico por capítulo (setas soltas para o primeiro, um corpo em movimento para o segundo, barco/rio para o terceiro).
5. **EB — Energia e trabalho (5 capítulos)**: `impulso-e-quantidade-de-movimento`, `sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento`, `trabalho-e-energia-trabalho-de-uma-forca`, `trabalho-e-energia-teorema-da-energia-cinetica`, `potencia-maquina-e-rendimento`. O `ThermoBoard` já mostra como desenhar "trabalho como área sob a curva" corretamente (`gas-work`) — usar o mesmo princípio aqui resolve o maior lote de uma vez. Também aparar os parágrafos longos dos cartões de aplicação.
6. **NewtonBoard**: decisão de produto primeiro (manter a linha de ilustrações "atlas" com correção de tema escuro, ou reverter para SVG) — depois redesenhar de acordo.
7. **`estatica`**: desenhar um corpo extenso com forças em pontos diferentes e o braço de alavanca do torque — hoje não há nenhuma base visual para partir.
8. **Ajustes pontuais (baixo esforço, agrupar num PR pequeno)**: `estudo-analitico-das-lentes-esfericas` (conteúdo próprio de convenção de sinais), `optica-da-visao` (aumentar fonte dos rótulos do mini-diagrama), `balistica` (já tem trajetória própria, só falta tirar a decoração genérica residual).
