# Primeira publicação de Brás Cubas

Branch `fix/publicar-bras-cubas`, base `origin/main` 69f7e1dc. As PRs #273, #275 e #276 já integraram os dossiês e suas abas, mas todos os blocos continuavam em `needs_review`. Esta revisão libera o conteúdo de **uma obra**, sem remover o filtro editorial para as outras 17.

## Decisão editorial e alcance

Aprovados os oito módulos, 23 cartões de evidência e 161 guias compactos (prólogo e 160 capítulos). A decisão considera a leitura integral anterior, a revisão dos resumos, procedimentos, tensões e microperguntas, a consulta de fontes críticas e oficiais e a conferência literal após as correções. Não é aprovação por contagem ou teste técnico.

Os guias conservam cinco componentes breves. Não certificamos o aprofundamento em quinze componentes por capítulo exigido pelo modelo avançado da habilidade; essa ampliação é uma próxima edição, declarada em Fontes. A publicação é uma primeira edição de estudo do conteúdo efetivamente apresentado, e não uma edição crítica ou levantamento de toda a fortuna crítica. As outras obras não receberam aprovação automática.

A versão dos oito módulos foi incrementada, com data e identificação do registro de revisão. IDs e ordem de unidades, cartões e módulos permanecem os mesmos, preservando as referências de progresso.

## Revisão textual realizada

- Conferidos os guias do prólogo e dos 160 capítulos, as 23 citações e os oito módulos. A leitura primária integral está em `leitura-bras-cubas.md`; as notas autorais de todos os capítulos estão em `rascunhos/bras-cubas-notas-1-160.txt`.
- Corrigida a localização dos rabiscos gráficos: capítulo XXVI, p. 42, antes da abertura de XXVII na mesma página.
- Distinguidos três procedimentos: LIII tem título pontilhado e corpo em prosa; LV é diálogo por pontuação; CXXXIX tem corpo pontilhado. Não inventar falas ou causas para preencher silêncios.
- Corrigidas as evidências de Eugênia: ela encara Brás com dignidade; o narrador conclui que não aceitaria esmola, mas não há oferta seguida de recusa verbal.
- Qualificada a alegação de franqueza póstuma: independência da opinião não garante imparcialidade. Tornada precisa a coordenação entre duração e custo no episódio de Marcela, sem depender de rótulo gramatical discutível.
- Reformulada a interpretação da barretina para incluir o recuo político de Brás, e a da morte de Quincas para não deduzir um diagnóstico ou alvo filosófico único.
- Removidos superlativos sem fundamento e a caracterização do enredo como banal.
- As cinco questões continuam autorais e sem gabarito imediato; suas alternativas aparecem em itens separados para leitura no celular.
- Quando o catálogo não possui edição, a tela mostra a edição de referência do dossiê publicado e a paginação usada nas citações, em vez de declarar processamento pendente. Não há alteração de dados do Firestore.

## Pesquisa incorporada

Três artigos integrais: Couto (2020), Stringuetti (2018), Corrêa (2019). Consultas parciais: Pereira (2023), dissertação de Roseira (2012), tese de Ridolfi (defesa 2018, PDF 2017, publicação digital 2019) e ensaio de referência de Schwarz (2004). A matriz completa e os intervalos lidos estão em `pesquisa-bras-cubas-publicacao.md` e em Fontes no app. Nenhuma monografia citada por esses pesquisadores foi contada como leitura direta.

Schwarz e Couto aparecem em contraponto, preservando o reconhecimento da tradição humorística europeia por Schwarz. O estudo de Corrêa fundamenta a análise da cadeia de trabalho que o Humanitismo subordina ao apetite; os estudos de Prudêncio qualificam a diferença entre cena, fala senhorial e inferência. A abordagem não afirma consenso entre os pesquisadores.

Fontes oficiais consultadas nesta revisão:

| Fonte | Leitura efetiva | Uso |
| --- | --- | --- |
| Notícia Unicamp/Comvest de 25/03/2025 | Corpo e lista 2027 | Exigência de Brás Cubas |
| Programa Unicamp 2027 | PDF p. 1–5 | Fonte, forma, evidência, vida social e obra completa |
| Respostas esperadas Unicamp 2026 | PDF p. 1–3; questões 3 e 4 na p. 2 | Episódios e perspectivas no cumprimento de subitens; não são questões de Brás Cubas |
| Guia de Provas FUVEST 2027 | PDF p. 1–6, 8, 12; p. 8 utilizada no módulo | Habilidades gerais de compreensão e articulação; apenas transferência |

Os onze registros têm URL, citação, recorte lido, contribuição e limites. `sourceRefs` aponta para registros reais em `WorkDossier.sources`. No modo estudante, só fontes referidas pelos módulos publicados são disponibilizadas.

## Verificação e limites operacionais

- `python3 scripts/conferir-dossie.py conferir bras-cubas`: passou depois das correções.
- Teste focado: 25 testes passaram. Inclui o percurso completo no endereço normal, sem `?revisao=1`, e a retenção de fontes de módulos em revisão.
- Navegador Chromium: abas conferidas no componente real, sem modo revisão, em desktop (1365 × 900) e celular (390 × 844), com dez alternativas objetivas em itens separados, indicação da edição de referência e sem exceções JavaScript. Autenticação e metadados de catálogo foram simulados a partir do seed curado; nenhum progresso ou dado real foi gravado. Capturas locais em `/workspace/artifacts/bras-cubas-publicacao/`.
- A consulta pública REST do documento de catálogo de Brás Cubas retornou `403 PERMISSION_DENIED`. Isso confirma que a sessão não pode validar o banco sem autenticação; não prova ausência de catálogo nem falha para a estudante autenticada. Não executar seed sobrescrevendo metadados existentes para contornar essa limitação.
- O registro GitHub/Vercel confirma deployment de Production bem-sucedido do commit 69f7e1dc em 06/10/2026 às 22:45 UTC. A versão antiga já foi implantada: o bloqueio editorial existia no código, não era explicado por ausência desse deploy. A renderização autenticada em produção e o Firestore com a conta da estudante continuam sem validação nesta sessão. A PR deve ser integrada e implantada antes de esta primeira publicação chegar ao app. Não realizar merge automático.
- PDFs e extrações primárias e críticas permanecem ignorados, sem inclusão no diff público.

Verificação final: `npm run lint`, `npm test` e `npm run build` passaram. A suíte completa terminou com saída 0: 922 testes de servidor/bibliotecas e 1.363 do Vitest, em 175 arquivos (2.285 testes ao todo). O build manteve apenas o aviso de tamanho de chunks já conhecido. `git diff --check` passou.

## Conferência crítica independente

As atribuições dos módulos Análise, Crítica e debate e Fontes foram conferidas contra os estudos consultados, inclusive autores, páginas, datas e recortes. Nenhuma obra reconstruída por fonte secundária foi declarada leitura direta. A história editorial foi qualificada: Stringuetti registra o folhetim de 1880, sem afirmar consulta ao periódico original.
