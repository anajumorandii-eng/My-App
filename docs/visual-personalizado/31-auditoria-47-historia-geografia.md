# Auditoria dos 47 capítulos de História e Geografia com instrumento, experimento ou prancha

Data: 26/09/2026. Depois dos Lotes 1 a 10, 65 dos 112 capítulos de História e Geografia têm cena autoral em validação. Os 47 restantes não usavam as famílias genéricas das cenas, e sim instrumentos (`src/views/visual-instruments/`), um experimento ou uma prancha — por isso foram auditados antes de qualquer redesenho. Quatro agentes auditaram em paralelo, só lendo código e abrindo cada capítulo no navegador (1440 e 390 px, claro e escuro, todos os recortes), com a régua aprovada pela Ana Júlia em 25/09. Nada em `src/` foi alterado nesta rodada.

## Resultado

| Grupo | Capítulos | Manter | Ajustar | Redesenhar |
| --- | --- | --- | --- | --- |
| Cartografia e natureza | 13 | 0 | 1 (Coordenadas) | 12 |
| Economia, energia e redes | 11 | 0 | 0 | 11 |
| Geopolítica regional | 9 | 0 | 0 | 9 |
| História | 14 | 0 | 1 (Independência) | 13 |
| **Total** | **47** | **0** | **2** | **45** |

## Causas comuns

Quatro motores genéricos explicam quase todos os redesenhos: a mesma estrutura desenhada para capítulos diferentes, trocando só o texto de um arquivo de configuração — o empréstimo que a régua proíbe (critérios 1 e 5).

- **`ContextScene`** (`GeographyContextInstrument.tsx`): três círculos, duas setas e uma colina, com texto de `src/lib/geographyContextLab.ts`. Serve 17 capítulos: os 9 de geopolítica, unilateralismo, União Europeia, energia elétrica no mundo, Espaço Industrial II, Biogeografia do Brasil I e II (com configuração idêntica), geopolítica ambiental e políticas ambientais.
- **`TimelineScene`** (`HistoryPhaseInstrument.tsx`): três caixas num eixo, com texto de `historyPhaseLab.ts`. Serve 9 capítulos de História; o próprio comentário do arquivo admite que "desenhar à mão dez cenas não escalaria".
- **`FlowScene` / `BasinScene`** (`GeographyRemainingInstrument.tsx`): caixas e setas genéricas; as duas hidrografias usam a mesma bacia hipotética.
- **`GeographyInstrument` e `HistoryInstrument`** têm cena por capítulo, mas desenhada com polígonos e círculos abstratos, sem ícones nem movimento que explique.

## Defeitos transversais (valem além destes 47)

1. **`--vs-ink-muted` não está definida em nenhum CSS**, e é usada em 14 arquivos. Contorno com ela fica invisível (a seta mina → usina sai com `stroke: none`, a camada de Relevo do SIG some, das setas da `ContextScene` sobra só a ponta) e preenchimento cai no preto, ilegível no tema escuro. Afeta também instrumentos de Linguagens, Matemática, Química e Física.
2. **Par de cartões descasado** em `GeographyInstrument.tsx:91`, `GeographyRemainingInstrument.tsx:93` e `HistoryInstrument.tsx:64`: o cartão escreve o texto de `nodes[0]`, mas estado e clique vêm de `boardPair` (nós 1 e 2). Quebra o contrato do `BoardShell` descrito no CLAUDE.md.
3. **O cartão direito mostra a fórmula do recorte selecionado, não a do próprio nó** (`HistoryInstrument.tsx:88`, `HistoryPhaseInstrument.tsx:100`).
4. **A frase de relação no pé da cena sai cortada dos dois lados** em quase todos os capítulos das `ContextScene`, `FlowScene` e `GeographyInstrument`.
5. **Cartões com o excerto inteiro** nos instrumentos Remaining e Context (~1.400 px de altura), selo de condição quebrando valores curtos ("UTC-/3") e texto meta visível para a estudante ("mude o recorte para comparar relações sem inventar uma cadeia única").

## Fidelidade ao resumo

Conteúdo que não está no resumo do capítulo e precisa sair mesmo antes do redesenho:

- Terrorismo Internacional: "alvos simbólicos" e "respostas estatais podem ampliar o conflito".
- Conflitos no Mundo Árabe: recorte inteiro sobre "categoria linguístico-cultural" e a confusão com o Islã.
- Espaço Industrial Brasileiro II: "comando concentrado / sedes" e "mercado consumidor e capital inicial".
- Geopolítica da América Latina: "urbanização acelerada".
- Políticas Ambientais Brasileiras: recorte "Participação e justiça territorial".
- Segunda Guerra: Normandia, Midway e Atlântico.
- Segundo Reinado: usa a Questão Religiosa e a Militar (conteúdo do capítulo do Declínio, que já tem cena) e omite o fim do tráfico.
- Grandes Revoluções do Século XX: a linha põe a Revolução Russa (1917) antes da Mexicana (1910).
- Biogeografia do Brasil I: a ressalva "não lista os biomas" contradiz um resumo todo organizado por bioma; a II repete a I.
- Matriz Energética: o cursor deixa a estudante arrastar a participação fóssil livremente de 0 a 100%.

Nos temas sensíveis (terrorismo, Questão Palestina, conflitos), nenhuma configuração toma partido; o problema é o oposto, abstração demais. No redesenho, a regra é usar só as formulações do resumo e atribuir cada posição a quem a sustenta.

## Por capítulo

As propostas abaixo são dos auditores, com fatos do resumo de cada capítulo; entram como ponto de partida, não como decisão. As capturas estão em `screenshots/auditoria-2026-09-26/<grupo>/`.

### Cartografia e natureza (13) — redesenhar 12 · ajustar 1 · manter 0
Roteamento: coordenadas → experimento Coordinates (TopicExperiment.tsx); fusos, linguagem cartográfica, água na superfície → GeographyInstrument; cartografia digital, representações, hidrogeografia mundial e do Brasil (mesma BasinScene), desafios ambientais → GeographyRemainingInstrument; biogeografia BR I e II (configuração idêntica), geopolítica ambiental, políticas ambientais → ContextScene.
Defeitos transversais além dos já citados (`--vs-ink-muted`, cartões, relação cortada): cartões dos instrumentos Remaining e Context recebem o excerpt inteiro (sem short()) e chegam a ~1.400 px de altura; selo de condição quebra valor curto ("UTC-/3"); na Linguagem Cartográfica o texto fala de 1:50.000 com 8 cm e o selo diz "2,5 km"; ponta de seta gigante no rio (markerEnd escala com strokeWidth 13); erro de console em Coordinates (motion.path sem d inicial).
Fidelidade: biogeografia I traz a ressalva "não lista os biomas", mas o resumo é todo por bioma; biogeografia II repete a I; políticas ambientais tem o recorte "Participação e justiça territorial" sem base no resumo.
Vereditos e propostas:
- coordenadas-geograficas (ajustar): mecanismo certo (1° de longitude encolhe com a latitude); "Equador · 0°" encosta no globo, rótulos de ~8 px em 390, faltam N/S/L/O e o contraponto dos ~111 km constantes da latitude.
- fusos-horarios: Terra vista do polo, 24 gomos de 15°, Sol fixo; destino − origem (Brasília UTC-3 × Tóquio UTC+9); Linha Internacional de Data.
- linguagem-cartografica: régua 8 cm × 50.000 = 4 km; escala gráfica × numérica ao ampliar; perfil com curvas de nível próximas × espaçadas.
- cartografia-digital: folhas do SIG em perspectiva; sensoriamento remoto × GPS (pegadinha do resumo); cruzamento de camadas / Deter.
- representacoes-graficas: elementos do mapa acendendo; generalização por escala; anamorfose.
- agua-na-superficie: 97% salgada → 3% doce → pouquíssima acessível; bacia atravessando fronteira; aquífero livre × confinado, rebaixamento e subsidência.
- hidrogeografia-mundial: Nilo mais longo × Amazonas com mais vazão; barragens no Mekong; estresse hídrico (1.000 m³/hab/ano) e água virtual.
- hidrogeografia-do-brasil: Amazônica como via de transporte; escada de usinas no Paraná até Itaipu; São Francisco, transposição, rios intermitentes, Guarani.
- biogeografia-do-brasil-i: estratos da Amazônia × Mata Atlântica; Cerrado (raízes profundas, casca contra o fogo); Caatinga na seca e na chuva.
- biogeografia-do-brasil-ii: pulso de inundação do Pantanal; Pampa × soja; manguezal como berçário e restinga.
- desafios-ambientais: efeitos regionais do clima; estoque pesqueiro encolhendo; tragédia dos comuns (custo concentrado × benefício dividido).
- geopolitica-ambiental: Amazônia como sumidouro e pressão; Kyoto 1997 × Paris 2015; Nilo e a barragem etíope.
- politicas-ambientais: APP × Reserva Legal (80% na Amazônia Legal); Prodes e Deter orientando o Ibama; lei robusta × fiscalização limitada e pagamento por serviços ambientais.
Capturas: screenshots/auditoria-2026-09-26/cartografia-natureza/ (130 PNGs).

### Economia, energia e redes (11) — redesenhar 11 · ajustar 0 · manter 0
Roteamento: todos instrumento — GeographyRemainingInstrument (FlowScene) em 5 (globalização, indústria II, geoeconomia, produção mineral, espaço agrário); GeographyInstrument em 2 (redes mundiais, matriz energética); ContextScene genérica em 4 (unilateralismo, UE, energia elétrica no mundo, espaço industrial II).
Defeitos transversais:
1. `--vs-ink-muted` não está definida em nenhum CSS (confirmado: nenhuma declaração; usada em 14 arquivos). Traços somem (seta mina→usina com stroke none, bordas de caixas inativas, raios do tecnopolo; na ContextScene só sobra a ponta da seta) e textos caem no preto, ilegíveis no escuro.
2. Cartões descasados: GeographyRemainingInstrument.tsx:93-94 e GeographyInstrument.tsx:91-92 usam nodes[0] e nodes[2], mas boardPair pinta o estado de nodes[1] e nodes[2].
3. Linha de relação no pé cortada dos dois lados em 10 de 11 (GeographyRemainingInstrument.tsx:58, GeographyContextInstrument.tsx:28, GeographyInstrument.tsx:69).
4. Nenhum movimento que explique; estética muito abaixo das cenas novas; ContextScene como fôrma de 4 capítulos.
Fidelidade: espaço industrial II inventa "comando concentrado / sedes" e "mercado consumidor e capital inicial"; matriz energética deixa a aluna arrastar a participação fóssil de 0 a 100%; "1 rotas".
Propostas:
- globalizacao: o smartphone no mapa (design EUA → chips Taiwan/Coreia → montagem China/Vietnã → mercado); gargalo de Taiwan na pandemia; nearshoring com medidor custo × resiliência.
- redes-mundiais: nós e vazios; hierarquia de cidades globais; cabos submarinos (>95% do tráfego), data centers e a ilha de rota única.
- unilateralismo: um Estado sozinho × mesa multilateral; instituições do pós-1945 (ONU e o veto dos 5, OMC, FMI, Banco Mundial); problema transfronteiriço onde a ação unilateral falha.
- uniao-europeia: linha do tempo — CECA 1951, Maastricht 1992 e o euro (Grécia 2010 sem câmbio), Brexit 2020 e crise migratória 2015.
- industria-ii: deslocalização (P&D fica, manufatura migra); cluster com transbordamento de conhecimento; economia circular.
- geoeconomia: tarifas de 2018; sanções à Rússia em 2022 (reservas, SWIFT) e yuan; chips × terras-raras.
- matriz-energetica: duas roscas (matriz elétrica × energética do Brasil); mundo >80% fóssil com cada fonte ligada ao uso; intermitente × despachável.
- energia-eletrica-no-mundo: geração mundial por fonte; França nuclear × Alemanha Energiewende; China, Chernobyl × Fukushima.
- producao-mineral: mapa de jazidas (Quadrilátero, Carajás, lítio, RDC, terras-raras); barragem a montante (Mariana 2015, Brumadinho 2019); garimpo e mercúrio.
- espaco-agrario: latifúndio × agricultura familiar; fronteira no Cerrado e Matopiba com calagem; conflitos (MST, grilagem, terras indígenas e quilombolas).
- espaco-industrial-ii: desconcentração a partir da RMSP; guerra fiscal do ICMS; desindustrialização precoce.
Capturas: screenshots/auditoria-2026-09-26/economia-energia/ (77 PNGs).

### Geopolítica regional (9) — redesenhar 9 · ajustar 0 · manter 0
Causa: os 9 caem em geograficoContexto (visual-instruments/registry.ts:357-371) e desenham a mesma ContextScene (GeographyContextInstrument.tsx:11-31): três círculos, duas setas, colina; só o texto de src/lib/geographyContextLab.ts muda. Defeitos comuns: rodapé da relação cortado nos dois lados; texto estourando os círculos r=38; rótulos inativos ilegíveis no escuro; seta escondida e ponta solta; nenhum território, fluxo ou tempo; ressalva "esquema conceitual: não descreve país/conflito específico" contrária à régua. Sem rolagem lateral; três modos intactos.
Fidelidade: terrorismo traz "alvos simbólicos" e "respostas estatais podem ampliar o conflito" (não estão no resumo); mundo árabe traz recorte "categoria linguístico-cultural / confundir com o Islã" (zero ocorrência no resumo); tensões na Europa usa a chave 'urban-conflict'; América Latina cita "urbanização acelerada" (fora do resumo).
Propostas:
- terrorismo-internacional: definição disputada (mesmo ato, dois rótulos); rede hierárquica (2001) que vira células e lobos solitários (anos 2010); custos (vigilância, liberdades, polarização). Sem ícone religioso.
- geografia-das-religioes: difusão no mapa (origem ≠ distribuição atual); Jerusalém com lugares sagrados das três religiões; régua de laicidade Irã–França–Brasil.
- tensoes-geopoliticas-na-europa: fronteiras 1919→1945→1991; Ucrânia 2014→2022 e adesão de Finlândia e Suécia à Otan; referendos Escócia 2014 × Catalunha 2017 diante da UE.
- america-latina: pauta exportadora no tempo (Potosí → café/cobre/petróleo → ISI 1930–70 → soja/minério para a China); Mercosul × Aliança do Pacífico; China ultrapassando os EUA como parceiro.
- africa-no-mundo-atual: Berlim 1884–85 cortando grupos étnicos; diversidade (pirâmide jovem, Lagos, Nairóbi, Ruanda, Botsuana); maldição dos recursos (cobalto, petróleo, empréstimo chinês).
- asia: ascensão chinesa desde 1978 subindo na cadeia de valor, Cinturão e Rota 2013; Mar do Sul da China, Taiwan, Caxemira; Japão, tigres, "China plus one".
- oriente-medio: Golfo, Ormuz (~1/5 do petróleo) e Suez; clivagens étnicas × religiosas, curdos em 4 países; Tigre e Eufrates com barragens do GAP.
- questao-palestina: faixa de tempo com o território mudando (1917 Balfour, 1947 partilha, 1948 independência e Nakba, 1967 ocupação, hoje assentamentos/Gaza/Jerusalém). Só formulações do resumo, cada posição atribuída a quem a sustenta, vítimas civis de ambos os lados, sem cor de vilão.
- conflitos-no-mundo-arabe: Primavera Árabe com três desfechos (Tunísia, Egito, Líbia/Síria/Iêmen); Síria internacionalizada (apoios só como o resumo atribui); fronteiras pós-1ª Guerra, petróleo, Arábia Saudita × Irã.
Transversal: a mesma ContextScene atende também unilateralismo, governança ambiental, UE, energia elétrica no mundo, espaço industrial II, biogeografia BR I/II, políticas ambientais.
Capturas: screenshots/auditoria-2026-09-26/geopolitica/ (90 PNGs).

### História (14) — redesenhar 13 · ajustar 1 · manter 0
Roteamento: introdução → experimento `sources`; Independência → IndependenceBoard (vence a cena contraste-de-posicoes, que nunca aparece); América XIX, Segunda Guerra, Guerra Fria → HistoryInstrument (cena por id, mas polígonos abstratos); os outros 9 → HistoryPhaseInstrument, uma única TimelineScene (3 caixas num eixo) com texto de historyPhaseLab.ts — fôrma genérica.
Defeitos transversais:
1. HistoryInstrument.tsx:64 — cartão esquerdo mostra nodes[0], mas estado/seleção vêm do nó 1 (boardPair).
2. HistoryInstrument.tsx:88 e HistoryPhaseInstrument.tsx:100 — o cartão direito mostra a fórmula do recorte selecionado, não a do próprio nó ("Terceiro Mundo" com "equilíbrio do medo").
3. TimelineScene: texto de ~7–8 px efetivos; caixas inativas ilegíveis no escuro; ponta da seta encosta no 3º marcador; "Percorra a linha do tempo" em comparações não temporais; único movimento é crescer 5%.
4. Texto meta visível à aluna em HistoryInstrument ("mude o recorte para comparar relações sem inventar uma cadeia única").
Fidelidade: Grandes Revoluções põe Russa (1917) antes da Mexicana (1910); Segunda Guerra cita Normandia, Midway e Atlântico, ausentes do resumo; Segundo Reinado usa Questão Religiosa e Militar (conteúdo do capítulo "Declínio", que já tem EmpireDecline) e omite o fim do tráfico.
Vereditos e propostas:
- introducao-a-historia (redesenhar): excedente no centro — Crescente Fértil c. 10.000 a.C. (nômade → aldeia), excedente libera ofícios e nasce a cidade, Tigre-Eufrates (cidades-Estado, cuneiforme) × Nilo (Estado centralizado); lente das fontes como faixa lateral.
- america-no-seculo-xix (redesenhar): mapa das Américas — independências hispânicas fragmentadas; EUA para o oeste (Louisiana 1803, guerra com o México 1846–48); neocolonialismo (matéria-prima → Reino Unido, empréstimos e ferrovias ←).
- grandes-revolucoes (redesenhar): comparação por base social — Rússia 1917 (operariado), México (Madero/Zapata/Villa → Constituição de 1917), China (campesinato, 1949).
- segunda-guerra (redesenhar): blitzkrieg 1939–40, Barbarossa e Stalingrado, Pearl Harbor → Hiroshima e Nagasaki; 70–85 milhões de mortos; bipolaridade.
- guerra-fria (redesenhar): Otan 1949 × Varsóvia 1955, Muro 1961; Coreia e Vietnã; Sputnik × Apollo; Bandung 1955 e os não alinhados.
- america-latina-seculo-xx (redesenhar): populismos (Vargas, Perón, Cárdenas); ditaduras e Operação Condor; saídas negociada (Brasil) × colapso (Argentina, Malvinas 1982).
- disputas-europeias (redesenhar): Guanabara 1555–67; Bahia 1624–25 e Pernambuco sob Nassau na União Ibérica; expulsão em 1654 e o açúcar indo para o Caribe.
- independencia-do-brasil (ajustar): legenda sobre "monarquia/Bragança"; "Bahia · Maranhão · Pará · Piauí" cortado pela onda; em 390 o texto cai a ~5 px (precisa de layout vertical); sem movimento nem BoardShell; decidir o destino da cena ofuscada.
- segundo-reinado (redesenhar): café e alternância de partidos; Eusébio de Queirós 1850 fecha o tráfico atlântico e intensifica o interprovincial; Guerra do Paraguai 1864–70.
- republica-da-espada (redesenhar): Deodoro fecha o Congresso (1891); Floriano com Armada (Rio) e Federalista (RS) no mapa; Prudente de Morais 1894.
- republica-liberal-democracia (redesenhar): pluralismo de 1946 cercado pela Guerra Fria; PCB cassado 1947; 1954 e 1955.
- republica-liberal-desenvolvimentismo (redesenhar): Plano de Metas e Brasília 1960; Petrobras × montadoras; Jânio, parlamentarismo, plebiscito 1963, golpe 1964.
- regime-militar-i (redesenhar): trilhas paralelas política (AIs, AI-5, censura) × economia (milagre 1968–73), sem causalidade entre elas; dívida como fio pendente.
- regime-militar-ii (redesenhar): abertura (fim do AI-5 1978, anistia 1979); dívida e choque de 1979; Diretas Já, Dante de Oliveira 1984, colégio eleitoral; sem ligar crise e Diretas por causalidade.
Capturas: screenshots/auditoria-2026-09-26/historia/ (108 PNGs).

## Próximos passos propostos

1. **Correções transversais, em um PR pequeno**: definir `--vs-ink-muted` no tema claro e no escuro, alinhar o par de cartões ao `boardPair`, prender a fórmula ao próprio nó, quebrar a frase de relação em linhas e remover o texto meta. Melhora na hora os 47 e os instrumentos de outras matérias.
2. **Retirar o conteúdo sem lastro** listado em "Fidelidade ao resumo".
3. **Redesenhar os 45 em lotes**, como nos Lotes 5 a 10: cena autoral por capítulo em `topic-scenes/families/`, registrada antes do instrumento no roteamento. Ordem sugerida: geopolítica (9) e História (13), onde a cena genérica mais esconde o conteúdo; depois cartografia e natureza (12) e economia e energia (11).
4. **Ajustar Coordenadas e Independência** (esta precisa de um layout vertical no celular, onde o texto cai a ~5 px).
