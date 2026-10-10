# Continuidade espacial: 24 capítulos de Física

Este lote acrescenta suplementos sob demanda em Explorar para 24 IDs, preservando os instrumentos existentes, Testar e Reconstruir. É continuação da PR #302 e depende da correção que mantém chaves React distintas para suplemento e experimento.

O Design & Motion Kit 1.0.0 orienta a continuidade do padrão CRIVO: papel editorial, cores semânticas existentes, leitura explícita e movimento finito iniciado pelo estudante. A geometria é definida em XYZ e projetada em SVG; mouse, toque, setas, Home e controles de câmera giram a vista sem alterar as grandezas. Nenhuma biblioteca nova foi instalada.

## Modelos e limites

| Conteúdos | Representação e manipulação |
| --- | --- |
| Movimento circular e aceleração vetorial | Uma volta de MCU; velocidade tangente, aceleração radial e rapidez ajustável. Não acrescenta aceleração tangencial fictícia. |
| Dinâmica circular | Pêndulo cônico com fio de comprimento constante, peso e tração; inclinação altera raio, velocidade e tração de forma consistente. |
| Forças, resultante, contato, corpos interagindo e trabalho | Bloco apoiado; paralelogramo de duas forças; transição de atrito estático para cinético; Atwood com fio ideal; projeção da força sobre um deslocamento prescrito. |
| Gases e termodinâmica, quatro capítulos | Cilindro e êmbolo com processos isotérmico, isobárico, isocórico e adiabático. Quantidade de gás fixa e contabilidade Q = ΔU + W. O caso monoatômico e o processo quase estático estão explícitos. |
| Hidrostática | Coluna de água com dois pontos à mesma profundidade; pressão absoluta e manométrica. Sem escoamento ou empuxo. |
| Refração e lentes, quatro capítulos | Interface espacial e plano de incidência; lente fina, raios e imagem real calculada; mesma lente em meios de índices diferentes. Recorte paraxial e p > f; não cobre todos os casos de imagens virtuais ou associações. |
| Ondas, seis capítulos | Eco com ida e volta; pulso refletido em extremidade fixa/livre; soma de ondas com defasagem; nós imóveis de cordas; modos de tubos abertos/fechados. O perfil longitudinal do tubo não é apresentado como trajetória transversal do ar. |
| Força magnética em fios | Fio, corrente, campo e produto vetorial em três direções; força nula quando paralelos. Sem motor, torque ou interação de dois fios. |

As representações são compartilhadas entre capítulos que tratam do mesmo fenômeno. Os modelos planos permanecem planos ao girar. Tempo de reprodução, progresso de uma volta e comparação quase estática são distinguidos de tempo físico nas legendas. Movimento reduzido entrega o estado final sem animação automática.

## Evidência e continuidade

`capitulos.json` fixa os 24 IDs; `lastro.json` registra títulos de seções e hashes do conteúdo já versionado, sem publicar extratos ou PDFs. `continuidade-613.csv` preserva todos os 613 IDs e os status editoriais. As entregas espaciais recentes passam de 37 para 61 capítulos; os outros 552 continuam a confrontar com seus mecanismos existentes, sem declarar lacuna ou revisão editorial concluída.

Lint e build aprovados. A suíte de lógica passou com **983 testes**; as invariantes dos dez testes novos foram repetidas após o ajuste de Atwood. A suíte integral de interface passou com **1579/1579 testes**, em 190 arquivos e 12 blocos. Após as correções finais, 58 testes de integração foram repetidos, incluindo os modelos novos, os suplementos anteriores e a preservação de estado dos artefatos. `testes-interface.json` registra os blocos da suíte.

A matriz final passou com **288/288 verificações**: 24 capítulos × 360/834/1440 px × claro/escuro × movimento reduzido/normal. Confere câmera independente dos valores físicos; teclado, Home, mouse e toque; limites dos parâmetros; condições alternativas; percurso manual, reprodução e pausa; foco, overflow, 44 px de altura, IDs SVG únicos, geometria dentro do canvas, ausência de erros de página e animações infinitas. Todos os títulos dos suplementos são H3 com a fonte existente de 26 px. A navegação também troca capítulos na mesma sessão. `validacao.json` vincula os resultados ao hash do build, e `capturar.cjs` permite reproduzir a matriz após `npm run build` e `npm run preview -- --host 127.0.0.1 --port 3008`.

Lighthouse/ECC no snapshot móvel do modelo de fio em campo magnético aberto: **acessibilidade 100, boas práticas 100**, SEO 60 e navegação por agentes 50. O salto H2 → H4 encontrado na primeira passagem foi corrigido para H3 no frame compartilhado, preservando o estilo. Estes escores pertencem a essa página/configuração; não são uma auditoria de performance nem de todos os capítulos.

A inspeção das capturas levou à separação maior dos corpos de Atwood e aos rótulos m₁/m₂. A troca de condição reinicia o percurso no próprio evento, evitando descartar um ajuste imediato do estudante. Depois dessas correções, a matriz foi repetida no build final; evidências anteriores permanecem no diretório local `C:/crivo-audit-evidence-20261010`. Dez capturas selecionadas estão em `capturas/`, identificadas em `capturas.json`; dois exemplos têm viewport de 1440 × 1800 px para mostrar o cartão inteiro. `capturar-exemplos.cjs` reproduz esses exemplos adicionais.
