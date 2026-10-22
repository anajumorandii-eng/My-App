# Auditoria editorial — FUVEST 2020, primeira fase

Revisão em 21/10/2026 por leitura editorial única das 90 questões. Não houve dupla revisão integral. O arquivo `scripts/data/fuvest-incidence/2020.json` contém exclusivamente o caderno V da primeira fase, aplicado em 24/11/2019. A capa foi visualmente conferida: grupo V, 90 questões. Outros tipos de caderno do gabarito são permutações, não novas provas; segunda fase e provas específicas não foram classificadas.

## Fontes e integridade

- Prova oficial: https://www.fuvest.br/wp-content/uploads/fuvest_2020_primeira_fase_prova_V.pdf — 9.251.739 bytes, 26 páginas físicas. SHA-256: `546ee1a55bc49575b425808ea621a28d3844e7640392294e4d4affc71c3fcd5a`.
- Gabarito oficial: https://www.fuvest.br/wp-content/uploads/fuvest_2020_primeira_fase_gabaritos.pdf — 512.040 bytes, duas páginas. SHA-256: `32bc137985ce5f318d4a02e385820d0deb86f46cfc88f56c46183717e93d6c8b`.
- Acervo: https://www.fuvest.br/acervo-vestibular-2020. Metadados provenientes do inventário local de fontes; hashes dos PDFs locais conferidos novamente nesta revisão.

A primeira página do gabarito foi lida em texto e imagem, incluindo as duas colunas do caderno V (01–45 e 46–90); a segunda contém correspondência entre versões. Há letras de resposta para todas as 90 questões. Não foi encontrada indicação de anulação nessa fonte: 90 fichas incluídas, zero excluídas. Isso descreve o arquivo oficial consultado, sem supor a existência de retificação não examinada.

## Cobertura e contagens

Numeração única e contínua 01–90, páginas físicas 2–25; a contagem total do PDF é 26. Cada ficha contém assunto, subtema específico, operação exigida, resumo autoral, justificativa, dois passos de estratégia e uma armadilha contextualizada.

| Matéria principal | Fichas |
|---|---:|
| Biologia | 9 |
| Física | 13 |
| Geografia | 12 |
| História | 11 |
| Inglês | 7 |
| Literatura | 5 |
| Matemática | 12 |
| Português | 11 |
| Química | 10 |
| Total | 90 |

As contagens seguem o conhecimento decisivo, sem impor divisão igual por matérias. Por isso, a Q08 é Física (conservação do momento), com reação orgânica secundária; Q12 é Química (neutralização/pH) com probabilidade secundária; Q24 é Matemática com leitura em inglês necessária. Q48 é Geografia, pois a pergunta exige o problema da coordenação multinacional diante do isolacionismo, e não mecanismos de resistência microbiana. Q82 combina leitura espacial de corredor e reconhecimento da febre amarela, com Biologia secundária.

## Inspeção visual e limitações da extração

O texto integral foi lido preservando as quebras físicas de página. As páginas foram renderizadas com `pdftoppm`; inspecionaram-se efetivamente as imagens das páginas 1–9, 15, 17–25. Os visuais decisivos conferidos são:

- p.2: fotografia do café/algodão-doce e tabela periódica; p.3: estruturas de pigmentos, gráfico de reação e diluições; p.4: série radioativa, desenhos da colisão e estruturas heme/biliverdina/bilirrubina; p.5: reação com hidrazina, alternativas estruturais e diagrama de fases.
- p.6: tabela de pH, escala do indicador, rede de probabilidades e rolo de fita; p.7: paralelogramo e equações que tiveram símbolos perdidos na extração; p.8: tabela pluviométrica e quadrinhos de Calvin; p.9: meme com a ambiguidade de `buy her flowers`.
- p.15: cinco curvas de crescimento, célula vegetal, heredograma e células especializadas; p.17: comércio transaariano e mapa de Agnese.
- p.19: gráfico de atenuação do sinal; p.20: três circuitos e gráfico logarítmico de resolução; p.21: solenoide, vetores e alternativas de força, trajetórias do pacote e sistema frontal; p.22: demonstração de Eratóstenes e mapa epidemiológico; p.23: cartogramas de agricultura e rede mundial de telecomunicações; p.25: corte de escorregamento e pisos do Chimborazo.

A capa e a primeira página do gabarito também foram vistas. Páginas 18 e 24 foram visualizadas, embora predominantemente textuais. As páginas 10–14 e 16 foram lidas no texto extraído; não se atribui a elas inspeção visual. Não se usou OCR ausente como evidência para identificar fórmulas: nas questões matemáticas da p.7 e nas estruturas químicas, a imagem supriu a perda de caracteres. As estratégias são autorais e não reproduzem resoluções externas.

## Decisões e ambiguidades concretas

- Q32, Q34, Q35, Q42 e Q44 são Literatura: dependem de contexto de Claro Enigma, Angústia, Sagarana e Quincas Borba. Q33, Q37–40, Q46 e Q47 ficam em Português, pois a operação é interpretação dos excertos, comparação ou ironia, sem depender de leitura externa da obra.
- Q65: confiança média. O gabarito oficial indica C. A alternativa A também contextualiza 1984 nas Diretas Já; o alcance político atribuído à letra exige cautela. A classificação em transição democrática permanece segura e essa tensão não é apresentada como anulação.
- Q22: a equação descreve a circunferência; o texto usa a palavra círculo, mas as alternativas contam interseções da fronteira com as bissetrizes. Nota editorial registra a terminologia; assunto e contagem pretendida são identificáveis.
- Q58: povoamento americano pré-colombiano não possui tópico próprio na taxonomia; alocado em Idade Antiga, com subtema específico e nota. Q60: história africana do século XV alocada em Idade Média pela mesma limitação de cobertura.
- Q49: a taxonomia inclui fungos em Botânica. A alocação segue esse agrupamento curricular e não afirma que fungos sejam plantas.
- Q70: `topicId: null`, com tópico humano de análise dimensional. A fórmula de Planck é fornecida e o conhecimento decisivo é unidade de grandeza, não física quântica; não há identificador específico para isso.
- Q79 usa gravitação/período e dilatação térmica como tópico relacionado da própria Física. Q87 é urbanização geral aplicada a Barcelona; o identificador disponível tem Brasil no nome, limitação explicitada na ficha.

A validação local verifica JSON, 90 números sem repetição, páginas válidas, tópicos existentes e compatíveis com a matéria principal, referências secundárias válidas, estratégias de dois a quatro passos e campos obrigatórios. Trata-se de classificação editorial, não de resolução oficial comentada nem de revisão externa independente.

Harmonização de integração da questão 42: Guimarães Rosa foi vinculado a `por_lit_contemporanea`, que contém seu capítulo no currículo, mantendo o Modernismo como enquadramento histórico da obra. Essa alteração muda o agrupamento editorial de assunto, não a matéria Literatura.
