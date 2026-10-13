# Expansão de questões reais — Unicamp 2026

Entrega de 13/10/2026: **72 novas questões**, correspondentes à primeira fase completa da Unicamp 2026, provas **Q/X**. O banco local passa de **2.887 a 2.959 registros**. O lote contém apenas questões dessa edição; não anuncia expansão nova de ENEM, Fuvest, Unesp, Famerp ou Unifesp.

## Como estudar

Em **Questões**, selecione **Banca: UNICAMP** e **Ano da prova: 2026**. Acrescente matéria, tópico e subtópico para treino dirigido; mantenha todas as matérias para percorrer as 72 questões na sequência do caderno. O cabeçalho distingue a posição no treino do número original da prova.

Leia a questão indicada nas páginas originais, incluindo os textos e figuras, antes de marcar. Toque na página para ampliar. A identificação do tema é editorial; o enunciado original está na imagem da prova. As alternativas textuais foram conferidas; a questão 13 conserva quatro alternativas gráficas, identificadas pelas letras, na página original.

Após responder, cada comentário oferece conceito/pré-requisitos, resolução em **cinco passos** (dados, estratégia, aplicação, justificativa, conferência), padrão de cobrança/pegadinha, **duas perguntas de recuperação** e **um exercício autoral de transferência com critérios**. São **144 perguntas de recuperação** e **72 exercícios de transferência**, distintos das 72 questões oficiais. Os comentários são próprios, não resoluções oficiais da banca.

Uma sequência de uso: resolver sem consultar; conferir o comentário; nomear o erro no caderno; no dia seguinte responder às perguntas de recuperação sem reler; depois executar a transferência e verificar seus critérios. Se houver dificuldade, voltar ao conceito e refazer uma questão do mesmo capítulo. Para literatura, os itens 62 e 64 exigem conhecimento das obras: o comentário não substitui sua leitura.

## Cobertura curricular do lote

A classificação usa o currículo do aplicativo e identifica um tópico principal por questão. Itens interdisciplinares podem receber classificação diferente dos blocos do caderno: Q32 trata integração econômica em Geografia; Q47 usa escala cartográfica em Geografia. Os números abaixo **não são uma matriz oficial de distribuição nem uma estatística de incidência**.

| Matéria no aplicativo | Questões |
|---|---:|
| Português, incluindo literatura | 12 |
| Matemática | 11 |
| Geografia | 9 |
| Inglês | 7 |
| Física | 7 |
| Biologia | 7 |
| Química | 7 |
| História | 6 |
| Sociologia | 3 |
| Filosofia | 3 |
| **Total** | **72** |

São **46 tópicos** e **63 capítulos**. Dificuldade é estimativa editorial, não parâmetro medido pela Comvest. COMVEST e UNICAMP são reunidas nos filtros; VUNESP permanece separada das instituições para as quais organiza provas. Ano desconhecido continua desconhecido.

## Fontes e integridade

- [Prova Q/X original](https://www.comvest.unicamp.br/vest2026/F1/f12026Q_X.pdf).
- [Gabarito Q/X oficial](https://www.comvest.unicamp.br/wp-content/uploads/2025/10/Q_X-gabarito.pdf).
- [Índice oficial da edição](https://www.comvest.unicamp.br/ingresso-2026/vestibular-2026/provas-e-gabaritos-vestibular-2026/).
- [Pesquisa de fontes para outras bancas e edições](fontes-expansao-questoes.md).

Foram baixados os PDFs primários e conferidos seus hashes; a prova coincide com o objeto identificado pelo ponteiro local. O gabarito baixado foi comparado ao TXT do repositório, sem divergências nas 72 respostas. Não há anuladas no gabarito Q/X consultado. Cada resposta é associada ao **número**, não à ordem de extração.

Foram preservadas **24 páginas em WebP**, reutilizadas por questões da mesma página, sem publicar os PDFs intermediários. Páginas de continuação e textos compartilhados foram incluídos: entre outros, Q7, Q12, Q15, Q24, Q27, Q30, Q33, Q38, Q41, Q48, Q56, Q60 e Q64. A paginação das imagens é a posição física no PDF, incluindo capa e rascunho, não o número impresso no rodapé. Todas passaram pelo verificador de marcas d'água: **24 verificadas, zero ocorrências**.

Identidade nova: instituição, edição, fase, versão e número original; links distintos para prova e gabarito. O importador é idempotente, recusa alteração de registro existente e possíveis duplicações identificadas da mesma edição/número. Não se afirma que todos os itens antigos de apostila sem ano foram identificados individualmente.

## Reprodução da importação

Fichas editoriais: `scripts/data/unicamp-2026-qx.json`. URLs, hashes dos PDFs e das imagens: `scripts/data/unicamp-2026-qx-source.json`. Os arquivos de origem devem ser baixados das duas URLs oficiais acima para uma pasta temporária.

```sh
npx tsx scripts/importar-unicamp-2026.ts /caminho/prova.pdf /caminho/gabarito.pdf
```

A execução acima confere fontes, mídias, currículo, alternativas, comentário, numeração e possíveis conflitos, mas não grava. `--write` acrescenta apenas registros ausentes. Repetir o comando depois desta entrega informa **0 novas questões**, sem sobrescrever o banco. Mudanças editoriais exigem revisão explícita; o importador recusa divergências.

## Revisão e verificação

Uma revisão independente leu as 72 fichas, cruzou os gabaritos, examinou figuras e recalculou uma amostra de Física, Matemática e Química, incluindo os critérios das transferências. Foram corrigidos o comentário do distrator C em Q15 e os capítulos de Q50, Q57 e Q61. A conferência editorial identificou e corrigiu a interpretação de Q23 para o gabarito D antes da publicação.

Os testes de conteúdo verificam identidade, respostas, imagens e contexto; os de interface cobrem banca/ano, contagens, tópicos, limpeza de resposta e links distintos. O endpoint textual de IA continua sem interpretar páginas: os comentários completos deste lote são locais e não dependem de geração nem de serviço externo.

Resultados finais:

- `npm run test:node`: **1.065 testes passaram**.
- `npm run test:vitest -- --maxWorkers=4`: **216 arquivos, 3.103 testes passaram**. Juntos, os dois comandos executam os componentes de `npm test`.
- Na primeira rodada concorrente com build/Node, quatro testes preexistentes sofreram atrasos/timeouts de carregamento. Os 175 testes dos quatro arquivos passaram isoladamente; a suíte completa foi repetida e passou. Não foram alterados limites de tempo nem testes visuais para esconder falhas.
- Inspeção no Chromium instalado: iPad 834×1112 e tela estreita 390×844; banca/ano, contagem de 72, recorte por matéria/tópico, resposta e comentário, imagem e links oficiais. Zero erros de página e nenhum transbordamento horizontal nessas verificações.
- Verificador de mídia: 24 imagens conferidas, zero marcas d'água. Importação repetida: zero novos registros.
- `git diff --check`: passou.
- `npm run lint`: passou após a versão final.
- `npm run build`: passou; permanecem os avisos de tamanho de chunks e de imports do projeto.
- Integridade final: as 2.887 entradas anteriores foram comparadas por id e conteúdo; **zero registros anteriores alterados**, 72 acrescentados. O TXT de gabarito também tem hash próprio, preservando a extração que foi conferida contra o PDF primário.

## Caderno em PDF

[Caderno Unicamp 2026 — 99 páginas](../../public/real-exams/unicamp-2026.pdf), também oferecido para download na tela de Questões quando o recorte é Unicamp/2026.

- Páginas 1–2: orientação e localização por matéria.
- Páginas 3–26: as 24 páginas originais da prova, mantidas em formato vetorial.
- Página 27: gabarito oficial.
- Páginas 28–99: uma resolução e revisão por questão; a questão n fica na página 27 + n.

Inclui marcadores de navegação para cada questão original e cada resolução. A prova/gabarito foram incorporados sem alterar seus fluxos de conteúdo; o verificador compara essas páginas com os PDFs primários. Os 72 comentários foram comparados integralmente com o banco, normalizando apenas espaços: nenhuma perda de texto, fórmula ou critério na impressão. Foram inspecionadas a orientação e resoluções, incluindo a questão de cinemática com mais texto.

Para reproduzir:

```sh
npx tsx scripts/generateRealExamWorkbook.ts /tmp/editorial.html
```

Exporte esse HTML para `/tmp/editorial.pdf` com Chromium, respeitando o tamanho/margens definidos no CSS, com fundos e sem cabeçalhos/rodapés automáticos. A parte editorial deve ter 74 páginas. Depois, com `pypdf` instalado:

```sh
python3 scripts/montar-caderno-unicamp-2026.py /tmp/editorial.pdf /caminho/prova.pdf /caminho/gabarito.pdf public/real-exams/unicamp-2026.pdf
```

O montador confere hashes das fontes, paginação, gabaritos por número e todo o texto editorial antes de montar, e confirma 99 páginas e integridade dos originais no resultado. Os PDFs de entrada são temporários; o caderno comentado é o artefato publicado.

O download do PDF foi integrado ao recorte Unicamp/2026 e coberto pelos testes da tela. Tipos, testes direcionados e build foram conferidos novamente após essa integração. O artefato empacotado tem o mesmo hash do caderno publicado.
