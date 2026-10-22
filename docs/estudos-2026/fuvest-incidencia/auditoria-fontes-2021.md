# Auditoria editorial — FUVEST 2021, primeira fase

Revisão em 21/10/2026 por um editor, por leitura das fontes (`single-editor-source-reading`). Foram classificadas as 90 questões da **única primeira fase**, caderno **V**, aplicada em 10/01/2021. A capa física 1 e os rodapés confirmam a versão. Segunda fase, provas específicas e outras versões de ordenação não foram classificadas como provas adicionais.

## Fontes e versionamento

Acervo oficial: <https://www.fuvest.br/acervo-vestibular-2021>.

| Documento | URL oficial | Páginas | Bytes | SHA-256 |
| --- | --- | ---: | ---: | --- |
| Prova, versão V | <https://www.fuvest.br/wp-content/uploads/fuvest_2021_primeira_fase.pdf> | 28 | 5.753.077 | `c263cea2fb60468c6085a84473429a967e21c8bc37f200d6d0fff68722f7d8c3` |
| Gabarito oficial, arquivo v2 | <https://www.fuvest.br/wp-content/uploads/fuvest_2021_primeira_fase_gabarito_v2.pdf> | 2 | 520.919 | `316b8834ad412e619f38c37d43dec4103ef4e71c87eaaaa7c600b9e849aea577` |

Hashes e tamanhos dos arquivos locais foram recalculados e comparados ao inventário `fontes-fuvest-2017-2021.json`. O manifesto do JSON inclui essas duas fontes efetivamente usadas, com seus metadados. O manual não foi utilizado para classificar conteúdo e não foi incluído como fonte lida. O sufixo **v2** identifica a chave obtida; não foi inferido um histórico de alterações não documentado. A primeira página dessa chave traz as respostas de V, K, Q, X e Z; a segunda traz a correspondência entre versões. Ambas as tabelas foram lidas na extração e a primeira página também foi renderizada e inspecionada visualmente.

Na coluna V há uma alternativa A–E para cada questão de 1 a 90, **sem indicação de anulação**. Nenhuma anulação foi encontrada nessa chave oficial lida. Todas as 90 fichas têm `excluded: false`; não se presumiu quantidade de anuladas por comparação com outros anos.

## Contagens

As contagens são de **matéria principal**, uma por questão. Não somam novamente as associações secundárias.

| Matéria principal | Questões |
| --- | ---: |
| Matemática | 13 |
| Geografia | 10 |
| Biologia | 10 |
| História | 11 |
| Física | 11 |
| Inglês | 7 |
| Português | 11 |
| Literatura | 5 |
| Química | 12 |
| **Total** | **90** |

Há três associações secundárias explícitas: questão 15 com História (ditadura militar), 23 com Biologia (ecologia dos biomas) e 30 com Biologia (recifes e calcificação). O critério foi necessidade de conhecimento adicional, não mera presença de tema de outra área. As questões 18, 23, 30, 69, 73, 74, 78 e 86 receberam confiança média para tornar visível a decisão de fronteira editorial; as demais têm confiança alta. Não há confiança baixa nem figura decisiva ilegível.

## Leitura e inspeção das páginas

O PDF foi renderizado com `pdftoppm`, em JPEG com dimensão máxima de 1.600 pixels. As imagens da capa física 1 e de **todas as páginas físicas de questões, 2 a 26**, foram abertas com `view_image`. Os enunciados, alternativas e imagens foram lidos diretamente nos renders. As páginas 27 e 28 são área final/contracapa e não contêm questões classificadas. A numeração registrada em `page` é a página física do PDF, não uma página de texto extraído.

Inventário da leitura visual de elementos gráficos e seus intervalos de questões:

| Página física | Questões | Elementos efetivamente inspecionados |
| --- | --- | --- |
| 2 | 01–04 | Malha e três percursos; cinco gráficos; quadrinho sobre primos; composição de triângulos, quadrados e pentágono |
| 3 | 05–10 | Diagrama de segmentos com triângulo equilátero; disco unitário e região hachurada; caixas de dados |
| 4 | 11–14 | Mapas das projeções Mercator, Gall-Peters e Robinson |
| 5 | 15–17 | Tabela de períodos e implicações; mapa dos membros da OPEP; mapa do terremoto na Bahia |
| 6 | 18 | Todos os pares de imagens/legendas de expansão territorial e transformações urbanas |
| 7 | 19–22 | Esquema de urbanização de Lefebvre e textos das quatro questões |
| 8 | 23–25 | Mapas de biomas, altitude e ocorrências de jararaca; gráfico de decomposição de resíduos |
| 9 | 26–29 | Quatro gráficos populacionais; tabela de efeitos do milho Bt; heredograma; cinco esquemas cromossômicos |
| 10 | 30–33 | Equilíbrios químicos; gráfico e esquema da aromatase; tabela de ISTs |
| 11 | 34–37 | Textos e alternativas das quatro questões; não há figura decisiva |
| 12 | 38–41 | Pintura A Primavera, de Botticelli, e alternativas sobre sua caracterização |
| 13 | 42–43 | Quadro dos distritos e tabela de mortalidade por gripe em São Paulo em 1918 |
| 14 | 44–46 | Foto da garrafa suspensa e diagrama de forças e distâncias dos palitos |
| 15 | 47–50 | Gráfico de aceleração do pêndulo; montagem de corda vibrante; ciclo no plano p–V |
| 16 | 51–53 | Olho míope e cinco traçados corretivos; latas e balões; cinco circuitos com interruptores |
| 17 | 54–58 | Esquema da esfera em campos elétrico e gravitacional; textos e caixas de dados |
| 18 | 59–62 | Texto de redes sociais, letra de canção e quadro com os três provérbios |
| 19 | 63–67 | Textos, destaques e alternativas gramaticais/literárias; não há figura decisiva |
| 20 | 68–71 | Poema de Cecília, canção e excertos de Mayombe; não há figura decisiva |
| 21 | 72–75 | Excerto de Nove noites, palavras destacadas e trecho inicial de Quincas Borba |
| 22 | 76–79 | Tirinha de Mafalda; poemas Remissão e Psicanálise do açúcar; pronome destacado |
| 23 | 80–82 | Fluxograma do açúcar; meme com H e alcalinos; tabela periódica; tabela de corrosão |
| 24 | 83–85 | Limites de HMF; estruturas e setas da conversão da frutose; partículas formando cadeias |
| 25 | 86–87 | Equações, ressonância e modelo orbital do poema; equilíbrio de cobalto e tabelas de ensaios/solubilidade |
| 26 | 88–90 | Estruturas da reação de Maillard e alternativas de aminoácido; esquema do skimmer |

## Decisões editoriais e casos de fronteira

- **13:** percurso na esfera ficou em Matemática (arcos), embora use Equador e meridianos. **14** exige Cartografia; a decisão não foi inferida da proximidade das questões.
- **15:** Geografia principal pela ocupação amazônica e conflitos territoriais; História secundária é necessária para datar a política na ditadura. **18:** Geografia principal pela fronteira do capital e gentrificação; não foi forçado ID histórico para a Marcha para o Oeste, pois o catálogo não tem recorte específico adequado à expansão estadunidense do século XIX.
- **23:** Geografia principal pelo cruzamento dos dois mapas e distribuição altimétrica; Biologia secundária por ecologia da Mata Atlântica. **24–26** são Ecologia: adaptações aos biomas, persistência/destinação de resíduos e balanço populacional, respectivamente.
- **30:** Química principal pelo equilíbrio ácido-base/carbonato; Biologia secundária pela associação de corais com estruturas calcárias. **32:** Fisiologia Animal pela determinação sexual e aromatase, sem cálculo de herança. **33:** Microbiologia e Virologia pelos agentes das ISTs e prevenção vacinal.
- **34:** Camões fornece descrição clínica do escorbuto; identificar deficiência de vitamina C dispensa conhecer Os Lusíadas. Ficou em Biologia, sem Literatura secundária. **41** é História da arte renascentista. **42** é História da Primeira República e desigualdade urbana em uma epidemia documentada; as taxas estão fornecidas e não demandam uma técnica matemática externa.
- **55:** equivalência massa–energia pertence ao tópico de Dinâmica Energética da taxonomia adotada, que a inclui expressamente. Não foi rotulada como Física Moderna apenas por envolver fusão solar.
- **56–62:** conhecimentos de astronomia, trabalho ou redes sociais são assuntos dos textos em inglês; as respostas são recuperadas por compreensão linguística. Não foram incluídas secundárias por tema incidental.
- **66, 71, 73, 75 e 76:** Literatura, respectivamente por plano maior de Angústia, contextualização das duas falas de Mayombe, caráter investigativo de Nove noites, construção de Quincas Borba e lirismo reflexivo de Claro enigma. A relação com a obra é constitutiva da pergunta.
- **68–69, 72, 74, 77–79:** Português porque os problemas são flexão verbal, imagens e contraste no poema reproduzido, substituição lexical, reação do narrador na cena, polissemia, conclusão do poema e referenciação pronominal. A autoria literária não foi usada como prova de necessidade de conhecer a obra. As fronteiras **69, 73, 74 e 78** estão explicitadas nas notas das fichas.
- **70:** História contemporânea brasileira, pois a canção de 1973 atualiza Tiradentes no contexto da ditadura. **80:** Química, pois a metáfora poética é julgada por cristalização, centrifugação e sublimação, não por conhecimento de A Educação pela Pedra.
- **82:** Oxirredução/corrosão pela comparação das taxas das ligas. **86:** questão com três conteúdos internos à Química; Oxirredução foi escolhida pela corrosão ser a única proposição correta. A avaliação também distingue respiração de fotossíntese e modelo orbital de Thomson; essa composição consta na ficha. **89:** interações e solubilidade, sem necessidade de conhecimento biológico de aquários. **90:** separação de misturas/volatilização, incluída no tópico de Análises Quantitativas e Estequiometria do catálogo.

## Limitações e validação

A extração original com `pdftotext -layout` contém ampla corrupção de glifos das fontes internas: não constitui transcrição confiável. Uma passagem de OCR em inglês foi gerada como apoio local, mas a decisão editorial se apoiou na leitura visual de todos os enunciados e alternativas. Não se declarou leitura de elementos apenas inferidos por OCR. Não foi necessário inventar informação de diagrama ilegível ou produzir transcrição longa de enunciado. Resumos, justificativas, estratégias e armadilhas são redação própria.

A validação do JSON verifica: leitura sintática; exatamente um paper de primeira fase V; 90 números únicos e consecutivos `01`–`90`; páginas dentro de 1–28 e correspondência com os intervalos lidos; IDs existentes e matérias compatíveis na taxonomia; associações secundárias compatíveis; campos editoriais específicos preenchidos; duas estratégias por questão; valores de confiança válidos e notas nos casos de confiança média; zero exclusões. Hashes e bytes também foram conferidos. Trata-se de uma revisão editorial integral de fonte por um editor, **não de dupla revisão independente**.
