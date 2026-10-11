# Lote espacial — 21 capítulos

Base: `438cd45a2b4765ea8ccdccc0047971085743e9b8`, após a integração da PR #305. Esta rodada trata os 21 candidatos restantes da triagem prioritária: 16 de Geografia, três de Física, um de Biologia e um de Química. Abre modelos próprios sob demanda em Explorar e mantém Testar, Reconstruir e os instrumentos anteriores.

O Design & Motion Kit 1.0.0 e sua referência Claude orientam a continuidade do padrão CRIVO: papel quente, tipografia existente, cores semânticas e interação acessível. Sem novas dependências. São desenhos originais em coordenadas XYZ com projeção ortográfica, câmera por arraste, toque, setas, Home e controles nativos. Não são malhas fotorealistas. Movimento começa por ação do estudante, tem término e pode ser pausado; movimento reduzido entrega o término imediatamente.

| Capítulo | Modelo e manipulação |
| --- | --- |
| Fusos horários | Globo, longitude e UTC teórico; os dois lados de ±180° diferem na data |
| Linguagem cartográfica | Morro cônico e curva de altitude ajustável |
| Projeções | Graticulado de Mercator ou Lambert cilíndrica equivalente e latitude ajustável |
| Cartografia digital | Camadas de terreno, rede e observações com alinhamento x/z |
| Representações gráficas | Regiões fictícias e barras de valores; altura não é relevo |
| Dinâmica climática | Barreira, barlavento, chuva e sotavento; percurso finito |
| Clima mundial | Globo, paralelos e três células idealizadas por hemisfério |
| Geomorfologia mundial | Abertura de placas ou subducção oceânica |
| Biogeografia mundial | Perfis de floresta, savana, deserto e tundra |
| Água na superfície | Divisor, afluentes e aquífero; escoamento ou infiltração |
| Geologia e geomorfologia | Corte aberto de crosta, manto e duas partes do núcleo |
| Relevo brasileiro | Perfil fictício de planalto, depressão e planície |
| Climatologia do Brasil | Transecto conceitual costa–interior; umidade ou frente fria |
| Biogeografia do Brasil I | Florestas, Cerrado e Caatinga |
| Biogeografia do Brasil II | Pantanal inundável, Pampa campestre e manguezal |
| Domínios morfoclimáticos | Recortes de mares de morros, caatingas e araucárias |
| Campo elétrico | Carga positiva/negativa, superfícies equipotenciais e campo radial |
| Ímãs | Polos N/S, linhas externas e retorno interno |
| Lei de Lenz | Espira xy, fluxo externo +z e oposição à sua variação |
| Invasoras e controle biológico | Rede conceitual: agente seletivo ou efeito não alvo |
| Química inorgânica | HCl, NaOH, NaCl em água e CO₂ molecular |

Notas em cada modelo delimitam o recorte: dimensões visuais, símbolos e percursos não fornecem dados cartográficos, climáticos, hidrológicos ou previsões ecológicas. Biogeografia I e II recebem modelos distintos segundo seus capítulos atuais. O comentário histórico e a legenda do contexto geral de II foram corrigidos para não afirmar que o currículo atual é idêntico.

`capitulos.json` fixa os IDs; `lastro.json` registra títulos das seções e hashes dos capítulos. Nenhum texto licenciado, PDF ou figura de referência foi publicado. `continuidade-613.csv` conserva todos os estados editoriais: 130 capítulos em entregas espaciais recentes e 483 a confrontar com instrumentos existentes. Isso não é aprovação pedagógica ou conclusão da verificação integral dos 613 capítulos.

Referências primárias consultadas, sem copiar suas figuras:

- [USGS: projeções cartográficas](https://www.usgs.gov/publications/map-projections-a-working-manual): propriedades de Mercator e projeções equivalentes.
- [NOAA: circulação atmosférica global](https://www.noaa.gov/jetstream/global/global-atmospheric-circulations): células de Hadley, Ferrel e polares.
- [IBGE: biomas](https://www.ibge.gov.br/geociencias/informacoes-ambientais/vegetacao/15842-biomas.html?lang=pt-BR): diferenciação dos recortes de vegetação e biomas.

## Validação

- 1.007 testes de lógica aprovados, incluindo oito invariantes novos.
- 1.651 testes de interface aprovados em 193 arquivos e 13 blocos com um worker, incluindo 22 casos do lote novo. Cada arquivo esperado está presente no relatório.
- Lint e build final aprovados.
- 252/252 verificações no Chrome: 21 capítulos × 360/834/1440 px × claro/escuro × movimento normal/reduzido. Câmera, toque, teclado, condições, parâmetros, pausa, movimento reduzido, alvos de 44 px, geometria, IDs SVG, ausência de seleção involuntária e erros de execução conferidos.
- [Galeria](GALERIA.md): 21 cards em desktop e quatro recortes de celular, com configuração e hash em `capturas.json`. A inspeção de legibilidade/composição está registrada em `inspecao-visual.json`; capturas de celular mostram o viewport, com conteúdo continuando abaixo.

O primeiro bloco amplo de interface terminou com erro de worker e dois arquivos ausentes do relatório. A repetição isolada executou os 16 arquivos e aprovou os 75 testes, recuperando a contagem completa. Relatórios iniciais foram preservados localmente e não somados aos resultados finais. A matriz reutiliza somente registros aprovados do mesmo hash de build, sem contar novamente o smoke de celular.

`validacao.json` e `testes-interface.json` registram o build e os resultados finais. Revisão editorial e pedagógica permanece pendente.
