# Lote espacial — 24 capítulos de Biologia

Base: `b09428b9e3c9491b7bfee49539ea7cf2f008e6ed`, após a PR #304 integrada. Os modelos abrem sob demanda em Explorar, preservando o instrumento existente, Testar e Reconstruir. Sem dependências novas ou alteração dos textos dos capítulos.

O Design & Motion Kit 1.0.0 orienta a continuidade do padrão CRIVO pela referência Claude já adotada: superfícies quentes, tipografia existente, cores semânticas, controles acessíveis e movimento finito iniciado pelo estudante. Geometrias próprias em XYZ, projetadas por câmera ortográfica; não são malhas anatômicas fotorealistas ou simulações clínicas.

| Capítulos | Recorte espacial | Manipulação e limite |
| --- | --- | --- |
| Origem da vida | Vesícula lipídica hipotética | Tamanho e encapsulamento; não representa coacervado, vida comprovada ou sequência histórica |
| Carboidratos e lipídios | Bicamada de fosfolipídios | Cabeças para água, caudas internas; recorte de lipídios, sem estrutura de carboidratos |
| Proteínas estruturais | Hélice alfa e dois trechos de folha beta | Comprimento e comparação; backbone esquemático, sem átomos ou dobramento previsto |
| Fermentação e respiração | Mitocôndria, cristas e citosol | Cristas e localização; fermentação fora da cadeia mitocondrial |
| Divisão celular | Cromossomos, fuso e separação de irmãs | 2n ajustável; conservação por filha, recorte de mitose |
| Grupos sanguíneos | Hemácia e antígenos A/B | Quatro grupos; leitura distingue antígenos de anticorpos, sem decisão transfusional |
| Embriologia | Blástula em corte com invaginação | Profundidade da dobra; exemplo de equinodermo, sem embrião humano ou mesoderma completo |
| Digestão | Estômago, delgado e grosso | Conteúdo no lúmen; sem absorção quantitativa |
| Sangue e imunologia | Anticorpos em Y e epítopos | Compatível versus forma diferente; sem prever afinidade ou proteção clínica |
| Coração | Quatro câmaras e circuitos ligados | Percurso funcional e oxigenação relativa; sem válvulas/pressões |
| Respiração | Brônquios, pulmões e diafragma | Inspiração finita; sem valores clínicos |
| Reprodução | Ovários, tubas e útero | Localização das etapas; sem dias do ciclo ou eficácia contraceptiva |
| Histologia vegetal | Caule eudicotiledôneo jovem | Feixes em anel, xilema interno/floema externo; sem generalizar para todas as plantas |
| Caules e folhas | Folha dorsiventral em corte | Paliçádico, lacunoso e estoma inferior neste exemplo; sem escala anatômica |
| Floema | Fonte, dreno e tubo crivado | Pressão relativa e percurso em um sentido por tubo; sem vazão calculada |
| Hormônios vegetais | Caule jovem em fototropismo | Alongamento desigual e curvatura para luz; não extrapolar para raízes |
| Citoplasma I | RER, Golgi, vesícula e membrana | Via secretora; preserva a correspondência atual do capítulo |
| Citoplasma II | Microtúbulo, actina e filamento intermediário | Organizações distintas e escalas independentes; não comparar diâmetros |
| Enzimas | Sítio ativo, complexo e produto | Enzima permanece disponível; sem cinética calculada |
| Mutações e gametogênese | Quatro gametas e cromossomos | n ajustável e erro na meiose I/II; sem diagnóstico |
| Biotecnologia | Fitas, primers e extensão de PCR | Ciclos ideais e três etapas; amplificação, sem edição gênica |
| Excreção | Corpúsculo, túbulos, alça e coletor | Filtrado e setas de reabsorção/secreção; sem cálculo de urina |
| Coordenação nervosa I | Soma, axônio, mielina e nós | Sinal em progressão; marcador não é elétron ou molécula viajando |
| Transpiração | Xilema, folha e estoma | Ascensão por tensão-coesão; sem bomba no caule |

Todos oferecem arraste, toque, setas, Home, giro/inclinação e restauração da câmera. A câmera não muda contagens ou leituras. Nos 17 modelos com percurso, alterar parâmetros ou condições reinicia o percurso no evento; movimento reduzido entrega o estado final sem animação. Os demais recortes são estruturais, com movimento da câmera e alterações de parâmetros/condições.

## Lastro e continuidade

`capitulos.json` fixa os 24 IDs e `lastro.json` registra títulos de seções e hashes das entradas existentes. Nenhum PDF, extrato ou imagem licenciada foi acrescentado. `continuidade-613.csv` conserva IDs e estados editoriais: 109 capítulos nas entregas espaciais recentes e 504 a confrontar com instrumentos existentes. Esses números não representam aprovação pedagógica ou auditoria integral concluída.

Referências primárias consultadas para conferir os recortes, sem copiar figuras:

- [OpenStax: células eucarióticas](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells): compartimentos, organelas e citoesqueleto.
- [Proteínas](https://openstax.org/books/biology-2e/pages/3-4-proteins) e [ciclo celular](https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle): estruturas secundárias e separação de cromátides.
- [Desenvolvimento embrionário](https://openstax.org/books/biology-2e/pages/43-6-fertilization-and-early-embryonic-development): recorte de gastrulação.
- [Gastrulação no ouriço-do-mar — estudo científico](https://pmc.ncbi.nlm.nih.gov/articles/PMC7941261/): invaginação do arquêntero e limites do recorte escolhido.
- [Coração](https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy), [ventilação](https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing) e [néfron](https://openstax.org/books/anatomy-and-physiology-2e/pages/25-4-microscopic-anatomy-of-the-kidney): rotas e compartimentos funcionais.
- [Sistema reprodutor ovariano](https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system): ovário, tuba e útero.
- [Resposta imune](https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response), [neurônios](https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate) e [biotecnologia](https://openstax.org/books/biology-2e/pages/17-1-biotechnology): reconhecimento, sinal e PCR.
- [Transporte vegetal](https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants): fonte/dreno, floema e tensão-coesão.

## Validação

Lint e build aprovados. A suíte integral de lógica passou com **999/999 testes**, incluindo sete novos testes de conservação na mitose, distribuição de gametas, ABO, circulação dupla, percurso finito, PCR e geometria em câmeras extremas. A suíte integral de interface passou com **1629/1629 testes** em 192 arquivos e 12 blocos. Após o ajuste de título e seleção de rótulos, os sete testes de lógica do lote e os 25 de interface foram repetidos e passaram; são regressões desses mesmos testes, não contagens adicionais de cobertura.

A matriz final passou com **288/288 perfis reais no Chrome**: 24 capítulos × 360/834/1440 px × claro/escuro × movimento normal/reduzido. Verifica navegação entre capítulos na mesma sessão, teclado, Home, mouse, toque, parâmetros, condições alternativas, reprodução/pausa, avanço manual, estado final em movimento reduzido, controles com pelo menos 44 px, ausência de overflow, IDs SVG duplicados, geometria fora do canvas, erros de página/console e animações infinitas. Verifica também que o arraste não seleciona texto. Títulos H3 mantêm 26 px. `validacao.json` vincula os resultados e fontes ao build `36f987fa5b26085753a7ededa537903127fa9e51f838f7330b9f67edd4e4b40c`.

[Galeria com 12 exemplos](GALERIA.md): oito cartões completos em 1440 × 1800 px e quatro capturas de celular. `capturas.json` registra tema, viewport e movimento; `testes-interface.json` identifica os blocos executados. A inspeção visual incluiu bicamada, estruturas secundárias, mitose, coração, via secretora, néfron, neurônio, floema e exemplos móveis de ABO, respiração, enzimas e transpiração. Não equivale à revisão pedagógica integral.

Lighthouse do plugin ECC, em snapshot com configuração móvel no modelo cardíaco aberto: **acessibilidade 100, boas práticas 100**, SEO 67 e navegação por agentes 50. `lighthouse-coracao.json` contém o relatório. Metadados de descrição, robots.txt e llms.txt permanecem limitados na prévia; o relatório exclui performance e não é extrapolado para outros capítulos.

Para reproduzir, execute `npm run build`, `npm run preview -- --host 127.0.0.1 --port 3008` e, em outro terminal, `node docs/lote-biologia-24-2026-10-10/capturar.cjs`. `capturar-exemplos.cjs` registra os cartões completos. Os capturadores usam Chrome local e aceitam `CRIVO_SPATIAL_EVIDENCE` / `CRIVO_SPATIAL_EXAMPLES` para configurar a saída. Resultados só são reutilizados quando aprovados e vinculados ao mesmo build.

A primeira matriz também passou, mas a inspeção detectou seleção de rótulos durante o arraste. A seleção foi desativada somente dentro do desenho de Biologia, mantendo leituras e controles externos. A matriz e as capturas foram repetidas no build final; o registro anterior permanece privado em `C:/crivo-audit-evidence-20261010/biologia-24-final/antes-da-correcao-de-selecao.json`.
