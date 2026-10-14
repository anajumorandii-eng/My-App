# FUVEST 2026 — pesquisa primária para expansão

Consulta em 14/10/2026. Escopo: primeira fase, caderno **V1**, aplicação em 23/11/2025. Nenhuma alteração no banco ou código.

## Fontes oficiais e integridade

- [Prova V1, FUVEST](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-prova-V1.pdf). Arquivo local: `/tmp/expansao-fuvest-2026/prova-V1.pdf`. SHA-256: `93b417ad6ea7e81a3b6adc46337920fd71c213306849846723f13583074f9025`.
- [Gabarito oficial retificado, FUVEST](https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-gabarito.pdf). Arquivo local: `/tmp/expansao-fuvest-2026/gabarito.pdf`. SHA-256: `a9e1084a125fa35bcefb875610328c0a8cb9b1a298880f2f0c75b928bd860e8e`.

O rodapé do gabarito informa **“Retificado em 25/11/2025”**. A questão **V1 03 está anulada** (`*`), equivalendo a V2 70, V3 48 e V4 30. Excluir de qualquer expansão com resposta única. A primeira página é o gabarito; a segunda fornece correspondência entre versões. Todas as respostas abaixo usam exclusivamente V1.

## Banco examinado e duplicações

Snapshot de `public/questions.json`: **2.959 registros**, SHA-256 `54a1d8e07c3c2fee4c68cad82d1404327f61eba09e1d5ebcce52e816dbe9c503`.

São **40 registros** com `examSource.board=FUVEST`, `examSource.year=2026` e identidade `fuvest_2026_qNN`:

`01, 02, 06, 08, 09, 11, 12, 15, 16, 26, 29, 31, 32, 38, 41, 49, 50, 51, 54, 56, 57, 62, 63, 64, 65, 66, 68, 69, 70, 77, 78, 79, 80, 81, 82, 83, 86, 87, 88, 90`.

Esses números devem ser excluídos da expansão. Comparação textual normalizada com o PDF confirma as cinco alternativas de **37 dos 40 registros**. Nos outros três, há diferenças de extração tipográfica: Q29 e Q32 tiveram três alternativas com correspondência normalizada integral; Q77 teve quatro. Não são candidatas novas e esse teste não constitui auditoria da qualidade dos enunciados existentes. Um filtro por simples ocorrência de “fuvest” e “2026” em todo JSON retornou 55 registros: **não utilizar esse filtro**, pois mistura anos/atribuições mencionados no texto.

Restam 50 números ausentes por identidade; descontada Q03 anulada, são **49 possibilidades válidas**:

`04, 05, 07, 10, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 30, 33, 34, 35, 36, 37, 39, 40, 42, 43, 44, 45, 46, 47, 48, 52, 53, 55, 58, 59, 60, 61, 67, 71, 72, 73, 74, 75, 76, 84, 85, 89`.

## Seleção recomendada: 16 novas questões

As páginas abaixo são posições físicas do PDF, contando a capa como página 1. Enunciado e alternativas estão no PDF oficial; respostas na página 1 do gabarito oficial acima. A divisão disciplinar é uma proposta curricular, pois a prova é interdisciplinar.

| V1 | Disciplina sugerida | Conteúdo verificável / assinatura do enunciado | Página / coluna | Resposta | Elementos a preservar |
|---|---|---|---|---|---|
| 48 | Português | Mwando, Sarnau e a intertextualidade bíblica em *Balada de amor ao vento*, Paulina Chiziane | 22 / esquerda | B | Excerto completo; não requer imagem |
| 89 | Português | Família de Neide e sobrenome “Paranhos”, *Canção para ninar menino grande*, Conceição Evaristo | 37 / esquerda | C | Excerto completo; não requer imagem |
| 20 | História | Manuel González Prada, “Nuestros índios”: exploração indígena sob a República peruana | 9 / direita | A | Texto e atribuição bibliográfica |
| 21 | História | Rafael Chambouleyron: catequização de crianças e alianças na colonização portuguesa | 9 / direita | B | Texto e atribuição bibliográfica |
| 23 | Geografia | Atlas da Mata Atlântica: 143,66 km² perdidos em 2024; série histórica desde 1985 | 10 / direita | D | **Gráfico obrigatório** |
| 24 | Geografia | Ilhas Shetlands do Sul: cobertura vegetal de 0,86 para 11,95 km²; NDVI/TCG | 11 / esquerda | C | **Mapa, fotografia e gráficos obrigatórios** |
| 18 | Matemática | Startup, crescimento exponencial `M(t)=200×(1,1)^t`; limiar de 300 mil | 9 / esquerda | E | Logaritmos de “Note e adote”; corrigir expoente na transcrição |
| 55 | Matemática | Números perfeitos; proposição de Euclides e sequência `2^n−1` | 25 / direita | B | Expoentes e domínio `n∈N*` |
| 60 | Física | Buraco negro com massa solar; raio de Schwarzschild e razão das densidades | 27 / esquerda | D | Fórmula, potências e todos os dados de “Note e adote” |
| 61 | Física | Efeito fotoelétrico: energia cinética, frequência e função trabalho | 27 / esquerda | C | Fórmula `E=hf`; não requer imagem |
| 67 | Química | Espectrometria de massas: `[C44H69NO12Ca]2+`, 843,444 g/mol e m/z 421,722 | 29 / esquerda | A | **Espectro obrigatório**, cargas e índices da fórmula |
| 34 | Química / Geografia | Hidroquímica amazônica; Harald Sioli, SIS/MOD e classificação das águas | 15 / esquerda | E | **Mapa obrigatório**; classificar como Geografia se a taxonomia local privilegiar bacias hidrográficas |
| 84 | Biologia | Células estomáticas; seta Z e diminuição da concentração de solutos | 35 / direita | B | **Diagrama obrigatório**; seta Z vai do estômato aberto ao fechado |
| 85 | Biologia | Sobreposição de nichos; área N e competição intra/interespecífica | 36 / esquerda | A | **Diagrama obrigatório** |
| 25 | Inglês | *Ice shelves*, princípio de Arquimedes e velocidade das geleiras antárticas | 11 / direita | C | Texto inglês completo; manter imagem do enunciado |
| 59 | Inglês | Adam Riess, James Webb e discrepância da constante de Hubble | 26 / direita | C | **Texto compartilhado das Q58–59**, disponível acima da Q58 na mesma coluna |

**Atenção à distribuição:** Q34 é interdisciplinar e sua cobrança principal é geográfica. O material ausente com foco inequívoco em Química inclui Q67; Q31/32/62/63/82/83 já estão no banco. Não reclassificar Q30 como Química por mencionar alumínio: sua pergunta cobra volume do cilindro. Se houver exigência estrita de duas questões de Química, a cobertura desse exame deve respeitar essa limitação, em vez de forçar rótulos.

## Comparação das candidatas com todo o banco

Para as 16 candidatas, comparou-se enunciado e alternativas contra os 2.959 registros, após retirar acentos, pontuação e normalizar espaços. A medida auxiliar é a interseção de conjuntos de sequências de cinco palavras, dividida pelo tamanho do menor conjunto. **Nenhuma candidata tem correspondência textual integral**; maior medida encontrada: **3,5714%**, Q18 contra `q_mat_sequencias_matrizes_15`. Esses valores baixos refletem fragmentos comuns, não duplicação do item. Q89 compartilha 1,6194% com Q90 do mesmo romance: são números oficiais e perguntas diferentes. Q67 e Q48 não compartilham nenhuma sequência de cinco palavras com o banco.

O resultado detalhado, com os três itens mais próximos de cada candidata, está em `/tmp/expansao-fuvest-2026/comparacao-textual.json`. Similaridade não substitui identidade editorial: a seleção foi feita pelos **números oficiais, enunciados específicos, alternativas e respostas**, não por palavras genéricas.

## Artefatos disponíveis para implementação

- `/tmp/expansao-fuvest-2026/prova-layout.txt`: extração `pdftotext -layout`, auxiliar.
- `/tmp/expansao-fuvest-2026/prova-colunas.txt`: PyMuPDF `get_text('text', clip=..., sort=True)`, por página e coluna; respeita a ordem esquerda→direita.
- `/tmp/expansao-fuvest-2026/questoes-segmentadas.json`: 90 números segmentados pelos marcadores `{NN}` e terminados em `#####`; sem misturar textos de apoio seguintes. SHA-256 `6eaa10d9275c4c47b8a0581264a74eb60af1c7a099126ecde57f6deacbee1654`.
- `/tmp/expansao-fuvest-2026/localizacoes.json`: página/coluna de cada número.
- `/tmp/expansao-fuvest-2026/texto-apoio-q58-q59.txt`: texto inglês compartilhado, separado para Q59.
- `/tmp/expansao-fuvest-2026/gabarito.txt`: gabarito e correspondência extraídos.
- `/tmp/expansao-fuvest-2026/pagina-NN.png`: páginas **09, 10, 11, 15, 22, 25, 26, 27, 29, 35, 36 e 37** renderizadas em escala 1,8 (aprox. 130 dpi).

A segmentação automática não recupera gráficos nem garante tipografia matemática; na importação, conferir índices/expoentes pelo PNG/PDF. As questões 52 e 53 usam região de largura especial na prova e não devem ser importadas por esse recorte de meia página; não fazem parte da seleção. Os PNGs preservam a página inteira e permitem recortar visualmente os suportes necessários.
