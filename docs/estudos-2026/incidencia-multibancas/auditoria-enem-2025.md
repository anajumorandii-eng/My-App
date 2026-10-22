# Auditoria ENEM 2025

Edição regular impressa: Caderno 2 Amarelo (dia 1) e Caderno 5 Amarelo (dia 2). Foram lidos os itens em texto extraído com conferência das imagens decisivas. Inglês é a única opção incluída em 01–05. Não foram somadas cores equivalentes, Espanhol, PPL, reaplicações ou versões digitais. São 91 unidades no primeiro caderno (90 objetivas + R) e 90 no segundo.

## Contagens por matéria e caderno

|Caderno|Matéria|Classificadas|Válidas|
|---|---|---:|---:|
|Caderno 2 — Amarelo|Arte|4|4|
|Caderno 2 — Amarelo|Biologia|1|1|
|Caderno 2 — Amarelo|Filosofia|11|11|
|Caderno 2 — Amarelo|Geografia|14|14|
|Caderno 2 — Amarelo|História|13|13|
|Caderno 2 — Amarelo|Inglês|5|5|
|Caderno 2 — Amarelo|Literatura|6|6|
|Caderno 2 — Amarelo|Português|30|30|
|Caderno 2 — Amarelo|Redação|1|1|
|Caderno 2 — Amarelo|Sociologia|6|6|
|Caderno 5 — Amarelo|Biologia|16|15|
|Caderno 5 — Amarelo|Física|14|13|
|Caderno 5 — Amarelo|Matemática|45|44|
|Caderno 5 — Amarelo|Química|15|15|

## Fontes verificadas

Todos os SHA-256 foram recalculados sobre os bytes reais dos PDFs. O dia 1 e ambas as chaves são do repositório Inep; o dia 2 é cópia identificada no espelho LFS do repositório, pareada ao CD5 pela capa, numeração e chave.

- prova-dia1: https://riep.inep.gov.br/bitstreams/a11f89c6-3693-49f0-8164-2794b5dac372/download
  - SHA-256 `fc5afca9bb3c168c9e1ddc97005736a461104b2552bac02bf0f1386af2164ed3`; 32 páginas; 2784620 bytes.

- gabarito definitivo pareado: https://riep.inep.gov.br/bitstreams/355fc4cc-8bf1-4bc9-b5a7-4ce989c01c76/download
  - SHA-256 `10a6daeb38ea518d8428dac0d68820ab1f3062dd4216ca6915a78ce830a2abac`; 1 páginas; 133142 bytes.

- prova-dia2: https://media.githubusercontent.com/media/anajumorandii-eng/My-App/main/provas%20brutas/ENEM/2025/ENEM_2025_dia_2_caderno_amarelo.pdf
  - SHA-256 `6cf3a0361035f86710be6fd8ff6b6848aa99c98fe71730d8ade1ca4ce4f1e560`; 32 páginas; 3122986 bytes.

- gabarito definitivo pareado: https://riep.inep.gov.br/bitstreams/5830254a-fab5-40e4-bd42-245926bcdd10/download
  - SHA-256 `4feea3658a94e20fa226028824b22538cb1b7e405a6a6e547d6a7131e5c97c22`; 1 páginas; 294764 bytes.

## Leitura visual e extração

Dia 1: páginas físicas 2, 8, 10–16, 19–20, 22–23, 26, 28–29 foram inspecionadas visualmente: embalagens de café; retratos; cartazes; poema-rede; capa de revista; nomes regionais de prato; obras em madeira e azulejaria; definição ilustrada; banco indígena; coletânea; Veneza; mapa de CO2; Salvador; ranking agropecuário e charge extrativa. Os demais itens foram lidos em texto. Dia 2: páginas 2–31 inspecionadas visualmente, incluindo todos os gráficos, estruturas químicas, diagramas, planificações e mapas de percurso. As imagens foram vistas em folhas de contato; tabelas e números foram cruzados com o texto. A extração em duas colunas intercalava comandos e omitia estruturas/gráficos; a leitura visual resolveu essas limitações.

## Anulações e redação

A chave definitiva CD5 marca expressamente Anulado em 115, 121 e 178; todos os outros números têm alternativa e nenhuma anulação adicional foi encontrada no CD2. As três fichas permanecem no arquivo, com motivo e excluded=true. Há 178 unidades válidas incluindo a redação, ou 177 objetivas válidas. A proposta R não herda o gabarito objetivo. Não há resposta única para dissertação: o documento solicitado é a própria proposta; não se inventou espelho específico.

## Decisões editoriais e ressalvas

Arte é matéria própria nos itens 11, 35, 36 e 44, com tópico nulo específico: exige análise de produção e significação artística. Textos sobre esporte não foram automaticamente classificados em Educação Física: nos itens 14, 15, 21 e 32 as respostas podem ser obtidas pela tese/contraste explícito, sem técnica corporal externa. Literatura foi separada nos itens 12, 17, 20, 33, 34 e 41. Não se adicionaram matérias secundárias por simples menção temática.
- Dia 1, questão 08: A crônica é literária, mas o comando exige reconhecimento do gênero pela organização comunicativa; manteve-se Português, sem exigir história literária.
- Dia 1, questão 17: A interpretação social de Contos negreiros aproxima-se de leitura geral; adotou-se Literatura Contemporânea por focalizar a construção do narrador e a reiteração expressiva de seus medos.
- Dia 1, questão 58: O texto também permite história das práticas corporais; a comparação exige mudança institucional e mercadológica da religião, classificada em Sociologia.
- Dia 1, questão 70: As fontes atravessam Antiguidade e Idade Média; o principal foi Idade Antiga por dois dos três excertos e pela valorização histórica dos saberes técnicos, sem datar uniformemente todos os documentos.
- Dia 1, questão 85: A taxonomia oferece Geografia Física do Brasil, mas a ocorrência é na Flórida; usou-se tópico nulo específico para processos geomorfológicos gerais.
- Dia 1, questão 90: A transformação agropecuária também cabe em Geografia; o comando decisivo pede consequência sobre polinizadores, por isso Ecologia é principal.
- Dia 2, questão 97: A situação envolve óptica, mas a discriminação das alternativas depende da resposta fisiológica da pupila à iluminação; adotou-se Fisiologia.
- Dia 2, questão 98: O preparo do pescado é aplicado à saúde; o conhecimento decisivo é a localização e termoestabilidade da toxina animal, tratado em Zoologia.
- Dia 2, questão 107: A mortalidade aquática é consequência ecológica; a explicação solicitada depende da solubilidade do gás na água em função da temperatura, classificada em Química.
- Dia 2, questão 130: Há leitura matemática de inclinação, mas ela quantifica sensibilidade de sensor resistivo; mantido Circuitos Elétricos.
- Dia 2, questão 132: A adsorção aproxima-se de propriedades de materiais; a taxonomia não possui separação de misturas como tópico próprio, adotou-se tópico nulo específico em Química.
- Dia 2, questão 153: A codificação não exige teoria de divisibilidade; adotou-se tópico nulo específico de representação numérica, evitando equipará-la a análise combinatória.

## Validação e limites

Validado JSON, 181 identificadores únicos por caderno/número, intervalos físicos de páginas, cobertura das capas, compatibilidade dos topicId com matéria, presença de estratégias específicas, hash das provas e chaves, e concordância de excluded com as anulações da chave. Confiança é editorial, não probabilidade nem dificuldade. Não se alega dupla revisão integral independente.
