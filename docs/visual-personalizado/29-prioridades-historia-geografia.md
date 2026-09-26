# Revisão visual por necessidade — História e Geografia

Data: 2026-09-23. O inventário técnico cobre 613 capítulos, mas a presença de um artefato não demonstra que a prancha ajude o estudante. História tem 49 capítulos (32 cenas, 15 instrumentos, uma prancha e um experimento); Geografia tem 63 (26 cenas, 36 instrumentos e um experimento). Nenhum dos 112 tinha revisão editorial aprovada quando esta rodada começou.

## Primeiro lote corrigido

| Capítulo | Problema observado no artefato anterior | Nova representação | Estado |
| --- | --- | --- | --- |
| Revolução Francesa | A cadeia de caixas escondia a cronologia e não distinguia o conflito fiscal inicial das pressões da radicalização. | Linha de 1789 a 1794, com acontecimentos datados e indicação separada de guerra externa e desconfiança interna. | em validação |
| Revolução Industrial | A cadeia genérica não mostrava o campo cercado, a fábrica e o papel da investigação e da pressão social na reforma. | Campo, fábrica e documento legal; a legenda explicita que as leis levaram décadas. | em validação |
| Projeções cartográficas | Cartões de texto não mostravam a escolha entre forma, área e distância. | Três esquemas comparáveis, rotulados como propriedades e não como mapas mensuráveis. | em validação |
| Dinâmica Climática | Cartões de texto não mostravam o que faz o ar subir em cada tipo de chuva. | Três seções: aquecimento, barreira de relevo e encontro de massas de ar. | em validação |

Os recortes, afirmações e citações dos quatro capítulos continuam ligados às entradas de `SceneEntry` e ao conteúdo do resumo; a nova arte não cria uma fonte pedagógica paralela. Seleção atualiza o diagnóstico e o trecho de lastro. As pranchas não foram marcadas como aprovadas por testes automáticos.

`node scripts/auditHistoryGeographyVisual.mjs` passou em **40/40 casos**: quatro capítulos × cinco larguras × dois temas, sempre com movimento reduzido. Não detectou overflow horizontal da página, erro de console, resposta local HTTP 4xx/5xx nem falha de seleção ou pan pelo teclado. O axe-core passou em **8/8 varreduras** a 375 px, sem violações WCAG A/AA automáticas. As capturas e dados brutos estão em `screenshots/historia-geografia-2026-09-23/`. TypeScript, build, testes direcionados e o inventário de qualidade passaram. O `npm test` local segue bloqueado pelos mesmos 14 PDFs licenciados ausentes no checkout; a suíte Vitest ampla com um worker foi interrompida após vários minutos sem resultado, e a CI remota deve fornecer a verificação completa.

## Critério para os próximos lotes

1. Abrir a representação que vence no roteamento real, no celular e no desktop. Instrumentos que vencem uma cena devem ser avaliados pelo que o aluno vê, não pela cena oculta.
2. Identificar a relação central que a visualização deve ensinar: território, temporalidade, causalidade, escala, fluxo ou comparação. Se o artefato atual só repete texto ou uma estrutura genérica, registrar a deficiência.
3. Atacar primeiro o defeito com maior custo pedagógico confirmado por inspeção. História e Geografia recebem a primeira passagem completa porque a responsável apontou ambas como especialmente ruins; as outras matérias entram pela mesma régua.
4. Guardar capturas e testar 360, 375, 390, 768 e 1440 px, temas, teclado, movimento reduzido, console, rede e acessibilidade. Revisão editorial continua uma decisão separada.

O restante do inventário não é rotulado `insuficiente` sem inspeção. Esta fila documenta o método para avançar pelos 613 capítulos sem transformar cobertura formal em aprovação visual.

## Lote 1 — auditoria dos oito em validação (25/09/2026)

A régua aprovada pela Ana Júlia em 25/09 (cena própria, relação central nomeada, fidelidade ao resumo, movimento que explica, nada emprestado, três modos intactos, conferência no navegador, aprovação só dela) foi aplicada aos oito capítulos que estavam em validação. Nenhum passava.

| Capítulo | O que a auditoria achou | O que mudou |
| --- | --- | --- |
| Revolução Francesa | Cronologia estática; nada mostrava que a cadeia é cumulativa. | Linha preenche elo a elo até o recorte escolhido; ícones próprios (déficit, Assembleia, Bastilha, guilhotina); as chaves "conflito fiscal" e "radicalização" acendem quando a cadeia chega a elas. |
| Revolução Industrial | Legendas "mão de obra + capital" e "investigação" em cima da cerca, da chaminé e do documento; cena estática. | Layout refeito sem colisão; trabalhadores saem do campo cercado e entram na fábrica; a lupa leva a investigação ao documento, que recebe o selo das Factory Acts. |
| Dinâmica Climática | Etiqueta "cartografia comparada" num capítulo de clima; setas com ponta desproporcional sobre a nuvem. | Etiqueta "mecanismo do clima"; a parcela de ar percorre o caminho que a obriga a subir e só então a nuvem se fecha e a chuva cai; cunha de ar frio na frontal; barlavento e sotavento seco na orográfica. |
| Projeções Cartográficas | Três esquemas sem nada que mostrasse a distorção. | Indicatriz de Tissot: o mesmo círculo cresce com a latitude na conforme e achata sem mudar de área na equivalente; na equidistante, um marcador anda passos iguais a partir do centro. |
| Energia Elétrica no Brasil | Mesma fôrma dos outros três: abas, holofote deslizando entre três caixas, ícone trocado. | Hidrelétrica e eólica (a turbina gira só no recorte Geração), energia correndo pela linha e encolhendo no caminho (perdas), curva de consumo do dia desenhada no recorte Demanda; a balança oferta ↔ demanda pende para o lado em foco. |
| Estrutura Étnica e Fluxos Migratórios | Idem. | Condições da origem (trabalho, família, moradia); a pessoa percorre a rota passando pelos nós de informação, transporte e apoio; no recorte Destino, uma carta volta pela rota de retorno — os vínculos continuam. |
| Os Fluxos do Comércio Externo | Idem. | Campo e silo, caminhão pela estrada, porto com guindaste, navio até o mercado; o preço final empilha produto, estrada, porto e frete conforme o recorte. Sem valores. |
| Combustíveis Fósseis e Biocombustíveis | Idem. | Carbono fóssil sobe do subsolo e fica na atmosfera; o da cana circula planta ↔ atmosfera; trator e caminhão acrescentam emissões do ciclo. Pontos sem escala, só sentido do saldo. |

Conferência dos oito: 25 recortes × tema claro e escuro a 1440 px, sem texto sobreposto a outro texto nem saindo do SVG (`screenshots/lote1-hg-2026-09-25/`, arquivos `*-recorteN*.png`; as capturas sem sufixo são o estado anterior). Sob movimento reduzido `useSceneMotion` zera a duração e a cena abre no estado final. `npm run lint` limpo; `npm test` com 706 + 544 testes aprovados. Os quatro capítulos continuam **em validação** até a revisão da Ana Júlia.

## Lote 2 — Brasil Colônia (25/09/2026)

Seis capítulos, cada um com cena própria. Os fatos e datas das cenas saem do resumo do capítulo (`deepSummaryContent.json`) ou das entradas já registradas; nenhum número novo.

| Capítulo | Antes | Agora |
| --- | --- | --- |
| A Mineração no Brasil Colonial | Três círculos com rótulo (ouro, fundição, Coroa). | Bateia, Casa de Fundição e baú da Coroa. Quinto: uma de cinco barras vai para a Coroa. Fundição: o pó entra, barras seladas saem, o desvio aparece como ilegal. Derrama: cota anual incompleta, moedas saem das vilas para cobrir a diferença. |
| A Interiorização da Colonização | Retângulo e três curvas. | Contorno do Brasil a partir de coordenadas reais, Tordesilhas, faixa açucareira. Bandeiras saem de São Paulo (apresamento, metais); o ouro puxa migrantes para Minas e a capital para o Rio (1763); o gado sobe o São Francisco. |
| Grandes Navegações e Conquista Colonial | Família genérica "cadeia de derivação". | Atlântico com Ibéria, África, Índia e Brasil: a caravela faz a rota do Cabo (1488) a Calicute (1498); especiarias como prioridade; pau-brasil por escambo; navios estrangeiros e fortificações a partir de 1530. |
| A Montagem da Colonização | Família genérica "critérios conjuntivos". | Balança com metáfora declarada no rodapé: cada fator sozinho não inclina o prato; resistência, epidemias e oposição jesuíta juntas inclinam para o tráfico transatlântico. |
| A Crise do Antigo Sistema Colonial | Família genérica "tipologia". | Inconfidência Mineira (1789) e Conjuração Baiana (1798) lado a lado com a composição social desenhada (elites de Minas; artesão, soldado, escravizado, liberto) e a corrente do pacto colonial que as duas contestam. |
| Dinâmica Interna da Colonização | Linha do tempo de três cartões para três peças simultâneas. | Um só engenho: casa-grande sobre senzala (com o aviso sobre a leitura de Freyre), fuga para o quilombo (Palmares, c. 1600–1695), roças e ofícios abastecendo o engenho. |

No celular, as pranchas de 620 unidades de História continuam com rolagem lateral dentro da própria prancha (decisão anterior, para o texto não encolher); a página não rola para os lados. As evidências das duas rodadas estão registradas em `visualQualityReviews.ts` e apontam para `screenshots/lote1-hg-2026-09-25/` e `screenshots/lote2-hg-2026-09-25/`. Todos seguem **em validação** até a revisão da Ana Júlia.

## Lote 3 — geografia física do Brasil (25/09/2026)

Os seis capítulos usavam as famílias genéricas "tipologia" ou "cadeia de derivação". As cenas novas ficam em `src/views/topic-scenes/families/GeografiaFisica.tsx`; o conteúdo sai das entradas do capítulo e do resumo.

| Capítulo | Agora |
| --- | --- |
| Movimentos da Terra | Céu noturno com o Sol e a órbita; o eixo de 23,5° mantém a direção enquanto a Terra percorre a órbita; painel de raios diretos e oblíquos ("mesma luz, área maior"); junho e dezembro com as estações opostas. Rodapé corrige o equívoco da distância (periélio e afélio). |
| Relevo Brasileiro | Perfil com escudo cristalino: grãos saem dos planaltos (cerca de 60% do território), sedimentos recentes se depositam na planície, a erosão rebaixa a depressão entre planaltos. |
| Pedologia | Três perfis lado a lado: a chuva leva os nutrientes do latossolo (lixiviação), o basalto alterado enriquece a terra roxa, a irrigação sem manejo deixa sal no solo raso do semiárido. |
| Climatologia do Brasil | Mapa com Equador e Trópico de Capricórnio; painel por recorte: massa Equatorial sobre a Amazônia, chuva ao longo do ano no tropical e no semiárido (barras ilustrativas, sem medida), invernos frios e geadas no Sul. |
| Domínios Morfoclimáticos | Os seis domínios de Ab'Sáber no mapa, com paisagem própria para Amazônico, Cerrado e Caatinga; rodapé lembra as faixas de transição. |
| Geologia e Geomorfologia | Corte com vulcão, câmara magmática, rio e bacia: o magma esfria em granito (cristais grandes) e basalto (pequenos), camadas se compactam e guardam um fóssil, faixas em profundidade se dobram sob calor e pressão. |

Contornos e limites são aproximados e dizem isso na prancha. QA: todos os recortes a 1440 px nos dois temas sem colisão de texto; 390 e 768 px sem rolagem lateral da página. Em validação até a revisão da Ana Júlia.

## Lote 4 — Brasil Império e Primeira República (26/09/2026)

Os cinco capítulos usavam as famílias genéricas "cadeia de derivação", "tipologia", "critérios conjuntivos" e "camadas de determinação". As cenas novas ficam em `src/views/topic-scenes/families/BrasilImperio.tsx`; datas e nomes saem do resumo do capítulo. Segundo Reinado e República da Espada continuam com o instrumento `historicoFase` e ficam para a auditoria seguinte.

| Capítulo | Agora |
| --- | --- |
| Formação do Estado Nacional | Coroa do Poder Moderador acima de Executivo, Legislativo e Judiciário, sobre a base da Constituição de 1824. Outorga: a Constituinte é riscada e o selo cai no documento; os três poderes do Moderador listados. Confederação do Equador: bandeira, pauta republicana e federalista, repressão e Frei Caneca — "cala a revolta, não o problema". Abdicação: a coroa passa de D. Pedro I ao filho criança. Uma barra embaixo acumula a insatisfação até 1831 (ilustrativa, e diz isso). |
| Período Regencial | Contorno do Brasil com as quatro revoltas no lugar (Grão-Pará, Rio Grande do Sul, Bahia, Maranhão) e a corte no Rio; linha do tempo 1831–1845 mostra a sobreposição e a Farroupilha durando além da maioridade de 1840. |
| Declínio do Segundo Reinado | Trono sobre uma plataforma e três colunas: clero, Exército e cafeicultores. Cada questão derruba uma coluna e a plataforma só balança; no recorte "Perda simultânea" as três cedem, a plataforma desaba e a coroa rola — 15 nov. 1889, sem resistência armada. Painel da abolição gradual (1871, 1885, 1888). |
| Ascensão e Domínio das Oligarquias | Pirâmide do eleitor dependente ao presidente. Coronelismo: laços de emprego, moradia e terra; cabresto: as cédulas sobem nível a nível; política dos governadores: apoio federal desce e votos no Congresso sobem, com o carimbo da Comissão de Verificação; café com leite: SP e MG trocam de lado sobre o topo. |
| Declínio Oligárquico | Elite cafeeira de SP e MG sobre sacas de café; tenentismo, movimento operário e modernismo apontam para o mesmo alvo a partir das armas, da fábrica e da arte; linha do tempo 1917–1930 destaca as datas de cada recorte; queda do preço do café em 1929 como gráfico ilustrativo. |

QA: todos os recortes a 1440 px nos dois temas sem colisão nem texto fora da cena; 390 e 768 px sem rolagem lateral da página (`screenshots/lote4-hg-2026-09-26/`). Em validação até a revisão da Ana Júlia.

## Lotes 5 a 10 — os 40 capítulos restantes com fôrma genérica (26/09/2026)

Com o Lote 4 concluído, sobravam 40 capítulos de História e Geografia desenhados com as famílias genéricas (tipologia, cadeia de derivação, critérios conjuntivos, escala de graus, camadas de determinação, contraste de posições, movimento dialético). Eles foram feitos em paralelo, um módulo por lote, todos agregados por `HistoriaGeografia.tsx` (`SCENES_*` e `HEADERS_*`) e compartilhando as peças de `cenaKit.tsx`. Mesma régua dos lotes anteriores: fatos, datas e nomes só do resumo do capítulo; tudo o que é metáfora ou grandeza sem medida é declarado no rodapé da prancha.

| Lote | Módulo | Capítulos e o que a cena mostra |
| --- | --- | --- |
| 5 · População e cidade | `Populacao.tsx` | **Dinâmica Demográfica**: natalidade e mortalidade se descolam fase a fase e a pirâmide muda de forma. **Transição e bônus demográfico**: trabalhadores migram do primário ao terciário (os recortes deste id vêm de "Estrutura Ativa da População", ver comentário em `data/geografia.ts`). **Espaço Urbano I**: rede urbana com fluxos subindo de nível até a metrópole global. **Espaço Urbano II**: corte da cidade em que a rede de água para antes da periferia. **Mobilidade Populacional**: expulsão e atração que só juntas movem a pessoa. **Redes de Transportes**: cada modal pela distância e pela carga. |
| 6 · Era Vargas ao Brasil Atual | `EraVargas.tsx` | **Era Vargas**: estrada de 1930 à Constituição de 1934. **Governo Constitucional**: cabo de guerra AIB × ANL e a cadeia de pretextos até o golpe de 1937 (Plano Cohen carimbado "falso"). **Estado Novo**: ditadura dentro × guerra ao fascismo fora. **O Brasil Atual**: três condições que só juntas baixam a desigualdade (curva ilustrativa). **A História e o Brasil**: o encontro de 1500 narrado do navio e da aldeia. |
| 7A · Antiguidade e Idade Média | `Antiguidade.tsx` | **Mundo Grego**: póleis separadas pelo relevo e unidas pela cultura; cidadania ateniense; pirâmide espartana. **Mundo Romano**: fichas de poder repartidas, tomadas nas guerras civis e concentradas em Augusto. **Alta Idade Média**: os dois vínculos feudais lado a lado. **Baixa Idade Média**: a Peste leva de um terço à metade e inverte a barganha. **Renascimento**: riqueza → mecenato → humanismo → perspectiva. |
| 7B · Idade Moderna | `IdadeModerna.tsx` | **Primeira Globalização**: metal como riqueza puxa pacto, trabalho forçado e tráfico. **América Espanhola**: pirâmide de castas com o criollo travado abaixo dos cargos altos. **Reforma**: indulgência, 95 teses e Trento (reafirma × corrige). **Absolutismo**: Bossuet e Hobbes chegam ao mesmo trono. **Iluminismo**: uma lamparina da razão acende três propostas. |
| 8 · Séculos XIX e XX | `SeculoXX.tsx` | **Europa no século XIX**: revolução e reforma saindo da mesma fábrica. **Imperialismo**: mando direto × indireto e a partilha de Berlim. **Primeira Guerra**: alianças, pressão e a faísca de Sarajevo. **Entreguerras**: 1929 → totalitarismos → concessões → 1939. **Nazismo**: três rachaduras que só juntas derrubam a democracia alemã, sem iconografia do regime. **Descolonização**: as trilhas da Índia e da Argélia. **Fim da Guerra Fria**: panela, Muro, dominós e as 15 repúblicas. |
| 9 · Geografia física mundial | `GeografiaMundial.tsx` | **Clima Mundial**: cinco fatores sobre o mesmo ponto. **Geomorfologia Mundial**: cráton, bacia e dobra jovem na mesma crosta. **Biogeografia Mundial**: célula de Hadley e temperatura ordenando os biomas. **Recursos Hídricos**: o Nilo de montante a jusante, da barragem à escalada. **Paisagem**: a mesma paisagem lida por determinismo, possibilismo e geografia crítica. |
| 10 · Economia e ordem mundial | `EconomiaGlobal.tsx` | **Produção Agrícola**: mecanização, escala e destino, sem escada evolutiva. **Indústria I**: Taylor, Ford e Toyota na mesma esteira. **Espaço Industrial Brasileiro I**: café financia a fábrica; indústria atrai indústria. **Turismo**: cada tipo ocupa o território de um jeito. **Blocos Econômicos**: cada grau soma um compromisso. **Desigualdades Globais**: termos de troca, substituição de importações, indústria protegida. **Bipolar ao multipolar**: o polo soviético se desfaz e resta um. |

QA: todos os recortes a 1440 px nos dois temas, sem texto sobre texto nem fora da cena; uma segunda varredura, com movimento reduzido, confere que nenhum texto passa da moldura da prancha (40/40); 390 e 768 px sem rolagem lateral da página. Capturas de todos os recortes em `screenshots/lote{5,6,7a,7b,8,9,10}-hg-2026-09-26/`. Todos em validação até a revisão da Ana Júlia.

Restam 47 capítulos de História e Geografia que abrem com instrumento, experimento ou prancha (Segundo Reinado, República da Espada, Guerra Fria, Oriente Médio, fusos, cartografia etc.). Eles não usam as fôrmas genéricas e precisam de auditoria um a um antes de qualquer redesenho.
