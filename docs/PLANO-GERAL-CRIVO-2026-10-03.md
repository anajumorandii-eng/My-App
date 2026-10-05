# Crivo: fila completa e execução em lotes maiores

Estado de referência: main `683a573204f92adc247d1493caaa08ad9de9b799`, em 05/10/2026 UTC. As PRs #252, #254, #255, #256, #257, #258, #259, #260 e #261 já foram incorporadas, assim como #242–#245 e #247–#251. Não repetir esses reparos. A PR #246 (guia de troca de conta) e os rascunhos #234/#222 são trabalhos separados; não integrar automaticamente.

A execução anterior ficou fragmentada em lotes pequenos para o tamanho da fila. A nova unidade de entrega será uma família de problemas, com arquivos sob responsabilidade explícita e validação conjunta. A auditoria existente foi reconciliada por ID com as correções documentadas; não foram repetidas as 613 aberturas de tela.

A Entrega A foi integrada em #254: [evidências dos 25 capítulos](visual-integral-2026-10-03/entrega-a/README.md). A Entrega B foi integrada em #256: [29 capítulos e resumos](visual-integral-2026-10-04/entrega-b/README.md). A Entrega C foi integrada em #258: [24 pranchas e oito resumos](visual-integral-2026-10-04/entrega-c/README.md). A tabela de lotes mantém o escopo original; F1/M1/HG1/LG2/H1 estão tratados. A Entrega D foi integrada no PR #259: [21 capítulos F2/F3](visual-integral-2026-10-04/entrega-d/README.md). A Entrega E foi integrada na PR #260 e trata LG1/Gramática: [26 capítulos e resumos](visual-integral-2026-10-05/entrega-e/README.md). Após a integração de E, restavam 134 IDs em sete lotes. A [Entrega F](visual-integral-2026-10-05/entrega-f/README.md) propõe oito fundamentos de LG3/Literatura, tratados junto aos textos e operações autorais: a fila desta proposta passa a 126 IDs em sete lotes, sem encerrar os 29 restantes de Literatura. A Entrega F foi integrada na PR #262. A [Entrega G](visual-integral-2026-10-05/entrega-g/README.md) propõe oito capítulos do século XIX (Romantismo, Realismo, Naturalismo, Eça, Parnasianismo, Simbolismo e Pré-Modernismo): a fila passa a 118 IDs, com 21 restantes em LG3. A Entrega G foi integrada na PR #263. A [Entrega H](visual-integral-2026-10-05/entrega-h/README.md) propõe Machado de Assis, Vanguardas, Semana de 22, primeira e segunda gerações modernistas (poesia e prosa), Fernando Pessoa e Drummond: a fila passa a 110 IDs, com 13 restantes em LG3. A Entrega H foi integrada na PR #264. A [Entrega I](visual-integral-2026-10-05/entrega-i/README.md) propõe Graciliano, João Cabral, Clarice, Guimarães Rosa, Poesia Concreta e poesia e prosa de 1960-1980: a fila passa a 103 IDs, com 6 restantes em LG3. O redesenho dos 112 capítulos de História/Geografia foi integrado em #255.

## Quanto falta

| Matéria | Capítulos no catálogo | Achados tratados depois da auditoria | Capítulos ainda na fila | Resumos ainda sem aprofundamento |
| --- | ---: | ---: | ---: | ---: |
| Física | 85 | 47 | 0 | 0 |
| Matemática | 83 | 28 | 0 | 0 |
| Biologia | 72 | 4 | 0 | 0 |
| Química | 48 | 2 | 0 | 0 |
| História | 49 | 3 | 0 | 0 |
| Geografia | 63 | 1 | 0 | 0 |
| Filosofia | 35 | 16 | 19 | 0 |
| Sociologia | 27 | 8 | 19 | 19 |
| Redação | 58 | 0 | 58 | 58 |
| Gramática | 26 | 26 | 0 | 0 |
| Língua Inglesa | 17 | 17 | 0 | 0 |
| Literatura | 37 | 31 | 6 | 6 |
| Entendimento de Texto | 12 | 12 | 0 | 0 |
| Atualidades | 1 | 0 | 1 | — |
| **Total** | **613** | **195** | **103** | **83** |

Os outros **315 capítulos tinham recomendação de preservar o mecanismo central**. Nenhuma destas categorias significa aprovação editorial integral: “tratado” refere-se ao achado registrado, e a fila contém recomendações que precisam ser reproduzidas antes da correção. Não são 103 bugs recém-reproduzidos. Um capítulo pode ter texto aprofundado e ainda precisar de representação visual, como os 19 de Filosofia ainda na fila.

Os 83 resumos pendentes estão nos 612 registros de `deepSummaryContent.json`; COP30 é o capítulo adicional do catálogo. Eles foram vinculados aos IDs e aos mesmos lotes visuais para executar conteúdo e representação juntos. Há 527 registros com `rev: 2` e dois com `rev: 3`; não precisam ser reescritos indiscriminadamente. As revisões 3 corrigem dois defeitos concretos de Kant/Rawls, com releitura isolada. O inventário formal de qualidade continua separado: 532 sem revisão formal, 81 em validação, nenhuma aprovação registrada.

Fontes consultáveis: [fila completa JSON](FILA-VISUAL-2026-10-03.json), [planilha dos 134 pendentes](FILA-VISUAL-2026-10-03.csv), [auditoria histórica](REVISAO-VISUAL-INTEGRAL-2026-10-02.md). A fila guarda ID, matéria, lote, arquivos, achados e evidência de resolução; o JSON também vincula os 114 resumos pendentes. Verificar integridade com `node scripts/validar-fila-visual.mjs`.

## Lotes definidos

| Lote | Capítulos | Entrega |
| --- | ---: | --- |
| F1 | 17 | Eletricidade e magnetismo: corrente, potência, resistores, nós/malhas, capacitores, forças/campos, potencial, geradores/receptores e indução. |
| F2 | 11 | Mecânica: referencial/percurso, aceleração vetorial, forças, sistemas, movimento vertical, MHS, energia e equilíbrio. Newton exige rechecagem integral, não redesenho presumido. |
| F3 | 10 | Calor/transferência, dilatação, balanço da Primeira Lei, máquina/Carnot, lentes estáticas completas, ondas eletromagnéticas, intensidade, polarização/ressonância e quantização. |
| M1 | 4 | Matrizes: operador de soma e coluna vertical; funções: separar anotação de raiz das graduações em dois capítulos. |
| HG1 | 4 | Independência sem overflow externo; rótulos legíveis em Colonização/Mineração; título da população coerente com o conteúdo. |
| LG1 — tratado na Entrega E | 26 | Gramática: integração editorial das transformações; corrigir recorte das funções nominais e aprofundar os 26 textos. |
| LG2 | 29 | Inglês + Entendimento de Texto: exemplos do próprio assunto, operações de leitura/evidência e aprofundamento dos 29 textos. |
| LG3 | 37 | Escopo original; oito fundamentos na Entrega F (#262) oito do século XIX na Entrega G (#263) oito de Machado ao Modernismo de 30 na Entrega H (#264) e sete de 45 a 1980 na Entrega I, 6 restantes. Literatura: demonstrar procedimentos em exemplos autorais; substituir fichas genéricas quando inadequadas; aprofundar os 37 textos. |
| H1 | 24 | Filosofia/Sociologia: comparação de posições com situações próprias, na família de contraste. |
| H2 | 23 | Causalidade, camadas e tipologias: relações concretas, retorno materialista quando pertinente e classificações com critérios. |
| H3 | 15 | Escalas/critérios/eixos e casos próprios: meio-termo, diálogo/aporia, dialética, genealogia, mito/logos e Solidariedade. |
| R1 | 16 | Oito pares de repertório/análise: referência, tese e consequência específicas; aprofundamento junto à cena. |
| R2 | 15 | Projeto/gênero/introdução/conclusão, competências e modelos de texto; incluir contenção móvel de Competências. |
| R3 | 27 | Coletânea, argumento, dados, coesão, intervenção, direitos e revisão; mostrar operações em texto próprio e detalhamento da intervenção. |
| A1 | 1 | COP30: atores, contexto de Belém, decisões e limites com fontes datadas. Pode integrar uma entrega maior de Humanas. |
| **Total original** | **259** | F1/M1/HG1/LG2/H1/F2/F3/LG1 entregues: 125; fila restante: 134. |

A profundidade dos 27 textos de Sociologia acompanha H1/H2/H3, conforme os IDs vinculados na fila. Os lotes pequenos M1/HG1/A1 serão integrados a entregas maiores; não devem gerar novas rodadas de quatro ou de um capítulo por padrão.

## Primeiras entregas e paralelismo

1. **Entrega A: 25 capítulos — F1 + M1 + HG1.** Corrigir eletricidade/magnetismo e fechar os achados menores de Matemática, História e Geografia na mesma rodada. Dividir F1 em circuitos, eletrostática e magnetismo; M1/HG1 têm arquivos próprios.
2. **Entrega B: 29 capítulos — LG2.** Corrigir temas trocados de Inglês e ligar o aprofundamento aos mecanismos de leitura. Implementada e validada nesta proposta; conferir sua integração antes de repetir LG2.
3. **Entrega C: 24 capítulos — H1, concluída nesta proposta.** Casos e relações próprias por capítulo, oito resumos de Sociologia aprofundados e dois defeitos filosóficos pontuais corrigidos. [Evidências](visual-integral-2026-10-04/entrega-c/README.md).
4. Depois: LG3/Literatura, R1/R2/R3 e H2/H3, após LG1/Gramática validado na Entrega E. Integrar A1 a Humanas. A ordem pode mudar por defeito confirmado ou pela rotina mais usada da estudante; registrar o delta, sem reiniciar a auditoria.

Cada entrega produz uma PR automaticamente; o merge fica com a responsável. As três primeiras entregas têm **78 capítulos de escopo**, não 78 correções já executadas nem uma promessa de conclusão numa única sessão.

## História e Geografia: o que os números significam

Os quatro achados específicos da auditoria foram tratados na Entrega A (#254), com o ID demográfico preservado e título correspondente ao conteúdo efetivo. Depois, os 112 capítulos receberam o redesenho autoral aprovado em #255: [registro e galeria](visual-integral-2026-10-04/redesenho-hg/README.md). As capturas completas e a matriz Chromium estão documentadas. A classificação histórica dos outros 108 mecanismos permanece preservada; aprovação editorial integral, exercícios e uso autenticado continuam frentes separadas. Não repetir o redesenho nem os quatro reparos como pendências novas.

## Trabalho geral fora da contagem de capítulos

- **Contraste/acessibilidade:** as 44 combinações distintas de rota/regra/alvo foram reproduzidas e tratadas na PR #261, integrada; [auditoria de 05/10](AUDITORIA-GERAL-2026-10-05.md). Não repetir como reparos inéditos: 168 aberturas sem violações automáticas e 180 pares de ação/tema/fundo/estado acima de 4,5:1. Resultados axe incompletos e estados autenticados permanecem fora dessa certificação. Os 15 nomes de botão e nove nomes de select foram tratados no quinto lote; revalidar regressão, sem contabilizá-los como 24 novos reparos.
- **Layout:** Independência e os rótulos históricos foram tratados; Competências permanece no lote R2. Personalizar, busca, Administração e navegação do iPad já têm reparos integrados; não repetir como pendências novas.
- **Texto:** executar os 83 aprofundamentos em conjunto com suas cenas, mantendo exemplos originais e a revisão de seções/recall. Histórico de tentativas permanece; a revisão editorial muda apenas os IDs de seções dos capítulos efetivamente reescritos conforme o mecanismo já existente.
- **Fluxos com dados reais:** conferir sincronização/isolamento por conta, diagnóstico, Testar/Reconstruir, Caderno de Erros e telas com catálogo remoto em cenários autorizados. Falta de login na auditoria não prova bug de produção. Não enviar formulários, gerar custo externo ou limpar dados para “validar” uma tela sem uma ação explicitamente autorizada.
- **Desempenho e compatibilidade:** medir abertura de capítulos/busca e interação no iPad/Safari real; reduzir custos de chunks carregados quando a medição justificar. O carregamento inicial já foi melhorado; o aviso de chunks grandes continua. Não declarar compatibilidade Safari a partir de Chromium.
- **Concluído nesta sequência:** atualizações de dependências, recuperação de Fuvest 2025, leitura autorizada do histórico sem reset, reparos de podcasts/vozes e os lotes científicos integrados. A qualidade editorial geral do banco de questões e de toda a aplicação não foi certificada por esses reparos.

## Como acelerar mantendo resultados verificáveis

- Distribuir por arquivos/famílias, não por capítulos isolados. Quem altera uma família recebe todos os IDs pertinentes e suas diferenças de conteúdo. Reutilizar composição; não repetir o mesmo exemplo genérico em dezenas de assuntos.
- Um integrador cuida de `registry.ts`, catálogo/IDs, `deepSummaryContent.json`, `TopicExperiment.tsx`, `BoardShell`, tokens e continuidade. Os responsáveis entregam deltas; não editar esses arquivos simultaneamente. Separar worktrees quando houver PRs concorrentes.
- Testes dirigidos por frente; revisão conjunta antes de uma única sequência de TypeScript, build, navegador e suíte geral por entrega estabilizada. Repetir somente o necessário após mudança/falha real. Antes de cada push, cumprir os checks obrigatórios do repositório.
- Navegador percorre todos os IDs alterados, reutilizando contexto/cache por tema/largura e retomando verificações interrompidas. Testar inicial/extremos e estados decisivos, geometria/leituras, colisões, teclado e redução de movimento. Não abrir novamente os 613 capítulos a cada lote.
- Conferir capturas representativas de cada mecanismo e exceção, além das medições dos demais estados. Não usar aprovação de uma amostra como aprovação dos outros capítulos.
- Enquanto o CI de uma PR executa, avançar a preparação/implementação de uma frente independente em worktree separado. Nenhum merge automático; atualizar a base se a responsável integrar outra PR.

Roteiro técnico da execução: [plano de implementação](superpowers/plans/2026-10-03-lotes-ampliados.md). A execução está autorizada pela instrução de prosseguir; não requer nova escolha de método a cada lote.
