# Lote Linguagens — 150 capítulos com modelo 3D (Inglês 17, Redação 58, Gramática 26, Literatura 37, Entendimento de Texto 12)

Base: main após a PR #311. Encerra a continuidade espacial: os 613 capítulos têm modelo 3D no palco comum (`SpatialStage`), com câmera, "Girar o modelo" e movimento iniciado pela estudante. Texto não tem objeto físico, então o modelo é a estrutura da leitura ou da escrita:

- **Frase** (molde novo `sentence`): os termos viram blocos em fila e arcos de dependência ligam cada termo ao núcleo de que depende; a partícula percorre o arco do item em destaque (coesão referencial, regência, concordância, crase, colocação pronominal).
- **Redação** (molde novo `essay`): parágrafos empilhados como folhas, do projeto de texto à proposta de intervenção; a leitura mostra a função de cada parágrafo.
- Reaproveitados dos moldes de Humanas: comparação (escolas literárias, gêneros, estratégias de leitura), linha do tempo (periodização), círculos (repertório), fluxos, ciclo, meio-termo, espiral dialética (Barroco) e blocos (heterônimos de Pessoa).

Os exemplos de frase são próprios, escritos para o modelo. Testes conferem que os 150 conteúdos são distintos, as contagens por matéria, que cada molde recebe o número de itens que desenha, que os arcos ligam itens existentes e que tudo cabe no quadro.

| Capítulo (ID) | Modelo (molde) |
| --- | --- |
| `summary-lingua-inglesa-text-comprehension-taxonomy-and-terminology` | Taxonomy: from broad to specific (pyramid) |
| `summary-lingua-inglesa-text-comprehension-songs-and-poems` | Reading songs and poems (compare) |
| `summary-lingua-inglesa-text-comprehension-calories-and-energy` | Calories and energy (flows) |
| `summary-lingua-inglesa-text-comprehension-earthquakes` | Earthquakes (flows) |
| `summary-lingua-inglesa-text-comprehension-hurricanes` | Hurricanes (cycle) |
| `summary-lingua-inglesa-text-comprehension-ecology-greenhouse-gases` | Greenhouse gases (compare) |
| `summary-lingua-inglesa-text-comprehension-pollution` | Types of pollution (compare) |
| `summary-lingua-inglesa-text-comprehension-the-human-brain` | The human brain (compare) |
| `summary-lingua-inglesa-text-comprehension-global-warming` | Global warming (flows) |
| `summary-lingua-inglesa-text-comprehension-novels-short-stories` | Plot structure (timeline) |
| `summary-lingua-inglesa-text-comprehension-bacteria` | Bacteria (concentric) |
| `summary-lingua-inglesa-text-comprehension-viruses` | Viruses (cycle) |
| `summary-lingua-inglesa-text-comprehension-discrimination-against-women` | Gender gaps (compare) |
| `summary-lingua-inglesa-text-comprehension-women-empowerment` | Women's rights milestones (timeline) |
| `summary-lingua-inglesa-text-comprehension-digital-technology` | Digital technology (flows) |
| `summary-lingua-inglesa-text-comprehension-health-probiotics` | Probiotics (compare) |
| `summary-lingua-inglesa-text-comprehension-stem-cells` | Stem cell potency (pyramid) |
| `summary-redacao-a-dissertacao-no-vestibular-mitos-e-verdades` | Mitos e verdades (compare) |
| `summary-redacao-o-que-se-avalia-na-dissertacao-competencias-e-habilidades` | Cinco competências (ENEM) (compare) |
| `summary-redacao-organizando-as-ideias-brainstorm-e-mind-maps` | Mapa mental (flows) |
| `summary-redacao-projeto-de-texto-em-favor-da-progressao-textual` | Projeto de texto (essay) |
| `summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso` | Repertório produtivo (compare) |
| `summary-redacao-qual-sera-o-tema-deste-ano-grandes-eixos-tematicos` | Eixos temáticos (concentric) |
| `summary-redacao-diferentes-graus-de-adequacao-a-proposta` | Graus de adequação (pyramid) |
| `summary-redacao-tangenciamento-e-fuga-a-fronteira-do-tema` | Fronteira do tema (concentric) |
| `summary-redacao-generos-e-sua-relacao-com-a-estrutura-do-texto` | Gênero e estrutura (compare) |
| `summary-redacao-estrutura-classica-do-texto-dissertativo` | Estrutura clássica (essay) |
| `summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-i` | Ler a coletânea (compare) |
| `summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-ii` | Relações entre textos (flows) |
| `summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-i` | Coletânea × texto autoral (compare) |
| `summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-ii` | Do texto motivador ao argumento (cycle) |
| `summary-redacao-incrementando-o-repertorio-meio-ambiente` | Repertório: meio ambiente (concentric) |
| `summary-redacao-analisando-tema-de-redacao-meio-ambiente` | Tema: meio ambiente (essay) |
| `summary-redacao-incrementando-o-repertorio-educacao-e-trabalho` | Repertório: educação e trabalho (concentric) |
| `summary-redacao-analisando-tema-de-redacao-educacao-e-trabalho` | Tema: educação e trabalho (essay) |
| `summary-redacao-incrementando-o-repertorio-temas-abstratos` | Repertório: temas abstratos (concentric) |
| `summary-redacao-analisando-tema-abstrato-de-redacao` | Tema: tema abstrato (essay) |
| `summary-redacao-incrementando-o-repertorio-corpo-saude-e-sexualidade` | Repertório: corpo e saúde (concentric) |
| `summary-redacao-analisando-tema-de-redacao-corpo-saude-e-sexualidade` | Tema: corpo e saúde (essay) |
| `summary-redacao-incrementando-o-repertorio-violencia-leis-e-punicao` | Repertório: violência e punição (concentric) |
| `summary-redacao-analisando-tema-de-redacao-violencia-leis-e-punicao` | Tema: violência (essay) |
| `summary-redacao-incrementando-o-repertorio-cidadania-e-poder` | Repertório: cidadania e poder (concentric) |
| `summary-redacao-analisando-tema-de-redacao-cidadania-e-poder` | Tema: cidadania (essay) |
| `summary-redacao-incrementando-o-repertorio-arte-cultura-e-relacoes-sociais` | Repertório: arte e cultura (concentric) |
| `summary-redacao-analisando-o-tema-de-redacao-arte-cultura-e-relacoes-sociais` | Tema: arte e cultura (essay) |
| `summary-redacao-incrementando-o-repertorio-midia-e-sociedade` | Repertório: mídia e sociedade (concentric) |
| `summary-redacao-analisando-tema-de-redacao-midia-e-sociedade` | Tema: mídia (essay) |
| `summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao` | Introdução que delimita (essay) |
| `summary-redacao-paragrafo-de-introducao-como-contextualizar` | Estratégias de contextualização (compare) |
| `summary-redacao-argumentacao-auditorio-particular-e-universal` | Auditórios (Perelman) (concentric) |
| `summary-redacao-argumentacao-quase-logica-e-efeito-de-verdade` | Argumento quase-lógico (flows) |
| `summary-redacao-argumentacao-e-coerencia-interna` | Coerência interna (flows) |
| `summary-redacao-argumentacao-e-coerencia-externa` | Coerência externa (compare) |
| `summary-redacao-recursos-argumentativos-dados-numericos-e-exemplos` | Dados e exemplos (compare) |
| `summary-redacao-recursos-argumentativos-vozes-prestigiadas` | Argumento de autoridade (compare) |
| `summary-redacao-ressalvando-o-ponto-de-vista-contrario` | Concessão (mean) |
| `summary-redacao-refutando-o-ponto-contrario` | Refutação (flows) |
| `summary-redacao-recursos-argumentativos-interdiscursividade-e-intertextualidade` | Intertexto × interdiscurso (compare) |
| `summary-redacao-recursos-argumentativos-temas-de-redacao-ja-analisados` | Temas do ENEM (exemplos) (timeline) |
| `summary-redacao-recursos-argumentativos-fatos-da-atualidade` | Fato da atualidade (compare) |
| `summary-redacao-recursos-argumentativos-multiplos-dominios-do-saber` | Múltiplos saberes (concentric) |
| `summary-redacao-conclusao-por-sintese-ou-retomada-da-tese` | Conclusão por síntese (essay) |
| `summary-redacao-conclusao-sumarizacao-focalizacao-e-expressividade` | Tipos de fecho (compare) |
| `summary-redacao-proposta-de-intervencao-atores-sociais-e-cidadania` | Elementos da intervenção (compare) |
| `summary-redacao-proposta-de-intervencao-viabilizacao-e-inovacao` | Viabilidade (mean) |
| `summary-redacao-proposta-de-intervencao-coerencia-argumentativa` | Intervenção coerente (flows) |
| `summary-redacao-proposta-de-intervencao-respeito-aos-direitos-humanos` | Respeito aos direitos humanos (compare) |
| `summary-redacao-recursos-de-coesao-referencial-no-texto-dissertativo` | Coesão referencial (sentence) |
| `summary-redacao-recursos-de-coesao-sequencial-no-texto-dissertativo` | Conectivos (compare) |
| `summary-redacao-coesao-no-texto-dissertativo-analise-de-problemas` | Problemas de coesão (compare) |
| `summary-redacao-recursos-linguisticos-norma-clareza-e-expressividade` | Norma, clareza, expressividade (compare) |
| `summary-redacao-os-direitos-humanos-de-1-geracao-direitos-individuais` | Direitos de 1ª geração (compare) |
| `summary-redacao-os-direitos-humanos-de-2-e-3-geracao-direitos-sociais-coletivos-e-difusos` | Gerações de direitos (timeline) |
| `summary-redacao-redacoes-nota-1000-trunfos-a-inspirar` | Trunfos de redações nota 1000 (compare) |
| `summary-redacao-redacoes-na-midia-como-aprimorar` | Reescrever para melhorar (cycle) |
| `summary-gramatica-lingua-um-sistema-complexo` | Níveis da língua (pyramid) |
| `summary-gramatica-variacao-linguistica` | Variação linguística (compare) |
| `summary-gramatica-substantivo-os-nomes-e-a-visao-do-enunciador` | Nomear é avaliar (sentence) |
| `summary-gramatica-tipos-de-texto-explorando-elementos-concretos-e-conceitos-abstratos` | Concreto × abstrato (compare) |
| `summary-gramatica-artigo-numeral-e-adjetivo-no-sintagma-nominal` | Sintagma nominal (sentence) |
| `summary-gramatica-pronomes` | Pronome retoma (sentence) |
| `summary-gramatica-verbo` | Tempos do indicativo (timeline) |
| `summary-gramatica-adverbio-e-locucoes-adverbiais-circunstanciadores` | Advérbio circunstancia (sentence) |
| `summary-gramatica-verbo-e-sintaxe-da-oracao` | Verbo organiza a oração (sentence) |
| `summary-gramatica-concordancia` | Concordância verbal (sentence) |
| `summary-gramatica-significados-implicitos` | Implícitos (compare) |
| `summary-gramatica-tipos-de-discurso` | Discursos (compare) |
| `summary-gramatica-pontuacao-i-principios-para-o-uso-da-virgula` | Vírgula e ordem (sentence) |
| `summary-gramatica-pontuacao-ii-virgula-entre-oracoes-e-outros-sinais-de-pontuacao` | Vírgula entre orações (sentence) |
| `summary-gramatica-o-lexico-em-contexto-variadas-possibilidades-semanticas` | Sentidos em contexto (compare) |
| `summary-gramatica-ambiguidade-duplicidade-no-lexico-e-na-sintaxe` | Ambiguidade sintática (sentence) |
| `summary-gramatica-mecanismo-de-regencia` | Regência (sentence) |
| `summary-gramatica-crase` | Crase = a + a (sentence) |
| `summary-gramatica-processos-de-formacao-de-palavras` | Formação de palavras (compare) |
| `summary-gramatica-funcoes-sintaticas-nominais-e-vocativo` | Funções nominais (sentence) |
| `summary-gramatica-tipos-de-sujeito` | Tipos de sujeito (compare) |
| `summary-gramatica-vozes-verbais` | Voz passiva analítica (sentence) |
| `summary-gramatica-oracoes-substantivas` | Oração substantiva (sentence) |
| `summary-gramatica-oracoes-adjetivas` | Oração adjetiva (sentence) |
| `summary-gramatica-oracoes-adverbiais` | Oração adverbial (sentence) |
| `summary-gramatica-oracoes-coordenadas` | Coordenadas (compare) |
| `summary-literatura-a-arte-e-suas-linguagens` | Linguagens da arte (compare) |
| `summary-literatura-texto-literario-x-texto-nao-literario` | Literário × não literário (compare) |
| `summary-literatura-trovadorismo-e-humanismo` | Cantigas trovadorescas (compare) |
| `summary-literatura-renascimento-e-camoes` | Camões (compare) |
| `summary-literatura-brasil-primeiros-registros` | Primeiros registros (timeline) |
| `summary-literatura-a-estetica-barroca` | Conflitos barrocos (dialectic) |
| `summary-literatura-a-estetica-neoclassica` | Arcadismo (compare) |
| `summary-literatura-a-estetica-romantica-poesia` | Gerações românticas (timeline) |
| `summary-literatura-elementos-da-narrativa` | Elementos da narrativa (compare) |
| `summary-literatura-a-estetica-romantica-prosa` | Romance romântico (compare) |
| `summary-literatura-a-estetica-realista` | Romantismo × Realismo (compare) |
| `summary-literatura-machado-de-assis` | Machado de Assis (timeline) |
| `summary-literatura-naturalismo` | Determinismo naturalista (flows) |
| `summary-literatura-realismo-portugues-eca-de-queiros` | Eça de Queirós (compare) |
| `summary-literatura-parnasianismo` | Parnasianismo (compare) |
| `summary-literatura-simbolismo` | Simbolismo (concentric) |
| `summary-literatura-pre-modernismo` | Pré-Modernismo (compare) |
| `summary-literatura-vanguardas-artisticas` | Vanguardas europeias (compare) |
| `summary-literatura-fernando-pessoa` | Pessoa e heterônimos (blocs) |
| `summary-literatura-semana-de-arte-moderna` | Semana de 1922 (timeline) |
| `summary-literatura-modernismo-no-brasil-primeira-geracao` | Primeira geração (compare) |
| `summary-literatura-segunda-geracao-modernista-prosa` | Romance de 30 (compare) |
| `summary-literatura-graciliano-ramos` | Graciliano Ramos (compare) |
| `summary-literatura-segunda-geracao-modernista-poesia` | Poesia de 30 (compare) |
| `summary-literatura-carlos-drummond-de-andrade` | Drummond (timeline) |
| `summary-literatura-joao-cabral-de-melo-neto` | João Cabral (compare) |
| `summary-literatura-poesia-concreta` | Poesia concreta (concentric) |
| `summary-literatura-clarice-lispector` | Clarice Lispector (compare) |
| `summary-literatura-guimaraes-rosa` | Guimarães Rosa (compare) |
| `summary-literatura-poesia-brasileira-1960-1980` | Poesia 1960–1980 (compare) |
| `summary-literatura-prosa-brasileira-1960-1980` | Prosa 1960–1980 (compare) |
| `summary-literatura-literatura-lusofona-contemporanea` | Literatura lusófona (compare) |
| `summary-literatura-poesia-brasileira-contemporanea` | Poesia contemporânea (compare) |
| `summary-literatura-prosa-brasileira-contemporanea` | Prosa contemporânea (compare) |
| `summary-literatura-artes-plasticas-brasileiras` | Artes plásticas (timeline) |
| `summary-literatura-teatro-brasileiro` | Teatro brasileiro (timeline) |
| `summary-literatura-cancioneiro-popular-brasileiro` | Canção popular (timeline) |
| `summary-entendimento-de-texto-fatores-de-textualidade` | Fatores de textualidade (compare) |
| `summary-entendimento-de-texto-os-dois-niveis-da-leitura` | Níveis de leitura (pyramid) |
| `summary-entendimento-de-texto-intertextualidade-e-interdiscursividade` | Diálogo entre textos (flows) |
| `summary-entendimento-de-texto-generos-textuais` | Gêneros textuais (compare) |
| `summary-entendimento-de-texto-generos-narrativos-e-niveis-de-compreensao` | Gêneros narrativos (compare) |
| `summary-entendimento-de-texto-generos-nao-verbais-fundamentos-de-leitura` | Ler imagens (compare) |
| `summary-entendimento-de-texto-funcoes-da-linguagem` | Funções (Jakobson) (flows) |
| `summary-entendimento-de-texto-funcao-poetica-e-linguagem-literaria` | Função poética (concentric) |
| `summary-entendimento-de-texto-figuras-de-linguagem` | Figuras de linguagem (compare) |
| `summary-entendimento-de-texto-modelos-de-leitura-e-distorcoes-interpretativas` | Leitura adequada (mean) |
| `summary-entendimento-de-texto-leitura-de-textos-comicos` | Mecanismo do humor (flows) |
| `summary-entendimento-de-texto-tecnologias-digitais-da-informacao-e-comunicacao-tdic-impactos-sociais` | TDIC (flows) |
