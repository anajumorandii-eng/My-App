# Entrega E — 26 capítulos de Gramática

Continuidade após a integração do PR #259, base `abba293c6c671f7b21bf1b34d536300fa28ac9d3`. LG1 contém 26 capítulos e seus 26 textos. [Manifesto](manifest.json) · [Galeria](GALERIA.md) · [Navegador](browser-evidence.json) · [Revisão e decisões](REVISAO.md) · [Retomada](RETOMADA.md).

## Conteúdo e representação

25 instrumentos e uma cena de Variação Linguística receberam composição própria. Referentes ligam-se às palavras do texto; aspecto delimita eventos na linha do tempo; escopo altera conjuntos; crase mostra origens distintas; sintagma preserva núcleo e satélites; voz passiva conserva a direção agente→paciente independentemente da ordem textual. Cenas de discurso, léxico, classes nominais e formação lexical usam objetos e exemplos próprios. Variação compara contexto e registro, sem hierarquia de valor entre falantes.

16 aplicações completam os mecanismos centrais dos recalls: norma/adequação, exemplo→conceito→tese, escopo/modalização, caso/próclise, predicativos, regência do relativo, se apassivador/indeterminador, consecutiva, explicativa/causal, processos de formação, relações lexicais, vocativo, futuro do pretérito, pontuação e cujo com preposição. Cada aplicação usa relações, exemplos e desenhos correspondentes ao próprio capítulo. A revisão conceitual corrigiu ambiguidades e distinções descritas no registro de decisões.

Os 26 textos passaram a `rev: 2`, com **130 seções de 900–1.052 caracteres**, armadilhas corrigidas e dois problemas resolvidos por capítulo; 26 recalls foram alinhados. Comparação com a base: exatamente 26 registros alterados, todos de Gramática, mantendo 612 registros. Os IDs de capítulo e as chaves de persistência foram preservados. IDs de seção/recall seguem o mecanismo existente de revisão editorial, sem apagar respostas anteriores ou progresso de outros capítulos.

## Navegador e layout

Chromium na build de produção: 390/834/1366 × 1000 px, claro/escuro, movimento normal/reduzido, mais 360 px nos dois temas com movimento reduzido. **14 configurações, 2.770 estados e 2.520 estados SVG**, todos os 26 capítulos e estados discretos dos controles. Nos estados medidos não houve overflow da página, corte ou sobreposição de rótulos, nem fonte efetiva abaixo de 11 px. A fonte Kalam carregada é registrada em cada configuração.

A rolagem do desenho é interna, com foco, setas de teclado e botões equivalentes. A referência React ausente no elemento de rolagem foi conectada após regressão RED/GREEN. O mínimo intrínseco do grid foi contido; uma classe estável de Gramática conserva a regra ao trocar de Essencial para Relações, quando a cena sai do DOM. Foram corrigidos espaçamentos de anotações, dimensões da variação e predicativo. Em telas pequenas a largura do SVG é 560 px, preservando o tamanho mínimo das legendas e a possibilidade de percorrer a prancha.

A matriz verifica controles iniciais, extremos e todos os valores, seleções de registro, pan por teclado e idas/voltas das abas móveis. Testar/Reconstruir são abertos na configuração móvel clara com fixtures locais, sem envio de respostas reais. A galeria contém 78 capturas iniciais: os 26 capítulos em celular claro e desktop claro/escuro. Barras fixas são ocultadas apenas durante a captura. A rodada integral terminou com nove configurações aprovadas e três falhas de prazo do runner (duas durante capturas e uma ao aguardar o capítulo). As três configurações foram repetidas integralmente em execução serial, com prazo ampliado e os mesmos critérios. A evidência mantém a rodada inicial e usa, por configuração, o último resultado aprovado. As etapas de depuração anteriores não são apresentadas como rodadas aprovadas.

## Verificação final e fila

`npm run lint`, `npm run build` e `npm test` passaram: **922 testes Node + 1.114 Vitest = 2.036 testes**, sem falhas, em 169 arquivos de interface. `npm run visual:matrix` passou em 13 testes e `npm run visual:quality` em quatro; os relatórios gerados não tiveram delta. O validador da fila confirmou JSON, CSV, IDs, fontes e evidências. As regressões conceituais, de cobertura e de rolagem tiveram ciclos RED/GREEN antes da suíte final.

A fila desta proposta mantém 613 IDs: **164 achados tratados, 134 pendentes e 315 mecanismos preservados**, em sete lotes restantes. Restam 114 aprofundamentos editoriais; 496 registros estão na revisão 2 e dois na revisão 3. A promoção refere-se aos achados deste lote; nenhuma aprovação editorial formal integral foi acrescentada. JSON/CSV/fontes/evidências são conferidos pelo validador da fila.

## Limites

Verificação em Chromium e fixtures locais; Safari/iPad físico e fluxos autenticados não foram certificados. Os 12 instrumentos morfológicos trocam estados completos imediatamente; seu wrapper de opacidade constante não é animação instrutiva. Esse refinamento menor está registrado na revisão. LG3/Literatura continua pendente. A publicação é uma proposta em branch/PR, sem merge automático.
