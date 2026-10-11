# Lote espacial — 24 capítulos de Química

Base: `c2aba0a55e37254bdbb777e78a37f04d4c2e15f8`, depois da PR #303 integrada. O suplemento abre somente em Explorar, sob demanda, preservando o instrumento atual, Testar e Reconstruir. Sem dependências novas.

O Design & Motion Kit 1.0.0 orienta a continuidade do padrão editorial CRIVO, seguindo a referência Claude já adotada: superfícies quentes, tipografia existente, cores semânticas, contraste nos dois temas e movimento finito iniciado pelo estudante. Não altera a identidade do produto.

| Capítulos | Objeto e manipulação | Limite explícito |
| --- | --- | --- |
| Modelos atômicos; tabela periódica | Esfera de Dalton, carga difusa de Thomson e núcleo de Rutherford; terceiro período e distribuição por camadas | Modelo histórico e anéis localizadores; sem órbitas eletrônicas, orbitais quânticos ou escala nuclear real |
| Radioatividade | Fração restante de uma coleção espacial e comparação de leis de emissão alfa/beta | Valor esperado; não prevê quais núcleos decaem |
| Estados físicos; dois capítulos de gases | Recipiente com marcadores conservados, volume ajustável e composição da mistura | Deslocamentos ilustrativos, sem colisões resolvidas ou velocidade molecular em escala |
| Separação de misturas | Funil, filtro e recipiente com areia retida e sal no filtrado | Sem previsão de vazão, tamanho real dos poros ou pureza |
| Balanceamento; mol; fórmulas; dois capítulos de estequiometria | Moléculas, balança, contagem de elementos e barras espaciais em mols | Conservação e contabilidade; não é mecanismo de reação ou contagem real de moléculas |
| Equações iônicas; oxirredução | Formação de rede iônica e comparação de oxidação/redução | Pares ampliados são sítios esquemáticos; seta redox é contabilidade, não elétrons na solução |
| Dispersões; efeitos coligativos | Recipiente com soluto e feixe de luz; comparação de fatores i | Espalhamento qualitativo e solução ideal diluída; não calcula intensidade nem i experimental |
| Termoquímica I/II; cinética | Caminhos de Hess, termos de Gibbs e barras/curva de primeira ordem | Processo genérico ou hipotético; entalpia não é energia de ativação; ordem suposta experimentalmente |
| Pilhas e baterias; processos espontâneos | Daniell, eletrodos, fio e ponte salina, com fluxos separados | Condições padrão; não prevê tensão fora do padrão ou duração da pilha |
| Processos não espontâneos; Faraday | Fonte externa, cobre nos eletrodos e depósito ampliado | Eficiência ideal 100%, sem descarga competitiva ou espessura calculada |
| Deslocamento de equilíbrio | Compressão de N₂O₄ ⇌ 2 NO₂ e reequilíbrio com conservação | Gases ideais, isotérmico, Kc fixo; tempo normalizado não é cinética |

A câmera projeta coordenadas XYZ sem alterar as leituras. Parâmetros reiniciam o percurso no próprio evento. Arraste, toque, setas, Home, controles de giro/inclinação e restauração dão acesso ao mesmo objeto. Movimento reduzido entrega o estado final. Geometrias planas permanecem planas. Contagens arredondadas do desenho são distinguidas dos valores quantitativos.

## Lastro e continuidade

`capitulos.json` fixa os 24 IDs, confrontados com o conteúdo e mecanismos atuais. `lastro.json` registra títulos de seções e hashes de entradas existentes; nenhum PDF ou extrato foi acrescentado. `continuidade-613.csv` preserva 613 IDs e estados editoriais. As entregas espaciais recentes passam a 85 capítulos; 528 seguem a confrontar com seus instrumentos existentes. Isso não representa revisão pedagógica integral nem aprovação formal.

Referências primárias de conferência: [OpenStax — lei de velocidade](https://openstax.org/books/chemistry-2e/pages/12-3-rate-laws), [pilhas galvânicas](https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells), [efeitos coligativos](https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties) e [deslocamento de equilíbrio](https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle). Texto e desenhos próprios; não copia figuras dessas fontes.

## Validação

Lint e build aprovados. A suíte completa de lógica passou com **992/992 testes**, incluindo nove testes novos de conservação, meia-vida, primeira ordem, Faraday, sinais dos eletrodos, compressão/Kc e geometria finita. A suíte integral de interface passou com **1604/1604 testes** em 191 arquivos e 12 blocos; inclui os 24 modelos, reinício do percurso ao alterar parâmetros e preservação independente da câmera. Os blocos estão em `testes-interface.json`.

A matriz final passou com **288/288 verificações reais no Chrome**: 24 capítulos × 360/834/1440 px × claro/escuro × movimento reduzido/normal. Verifica navegação entre capítulos na mesma sessão, teclado, Home, mouse, toque, controles nativos, condições alternativas, reprodução finita/pausa, estado final em movimento reduzido, altura mínima de 44 px, ausência de overflow, IDs SVG duplicados, geometria fora do canvas, erros de página e animações infinitas. Títulos H3 preservam a fonte existente de 26 px. `validacao.json` vincula os resultados ao hash do build.

`capturas.json` identifica 12 exemplos: oito cartões completos em viewport de 1440 × 1800 px e quatro imagens de celular. A inspeção visual incluiu modelos atômicos, filtração, balanceamento, estequiometria, Hess, pilha, eletrólise, equilíbrio, tabela periódica, gases e efeitos coligativos. Não equivale à aprovação pedagógica integral.

Lighthouse do plugin ECC no snapshot móvel da pilha com suplemento aberto: **acessibilidade 100, boas práticas 100**, SEO 60 e navegação por agentes 50. `lighthouse-pilha.json` contém o relatório. Escores dessa página/configuração; excluem performance e não são extrapolados para os demais capítulos.

Para reproduzir, execute `npm run build`, `npm run preview -- --host 127.0.0.1 --port 3008` e, em outro terminal, `node docs/lote-quimica-24-2026-10-10/capturar.cjs`. `capturar-exemplos.cjs` registra os cartões completos. O capturador usa o Chrome local e permite configurar a saída por `CRIVO_SPATIAL_EVIDENCE`; resultados antigos só são reutilizados se aprovados e vinculados ao mesmo hash do build.

A primeira tentativa de captura encontrou o servidor local desligado. Esse registro foi preservado em `C:/crivo-audit-evidence-20261010/quimica-24-final/preview-indisponivel.json`; a matriz final foi executada após reiniciar a prévia. Nenhuma aprovação foi inferida desse erro de ambiente.
