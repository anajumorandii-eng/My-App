# CRIVO — continuidade operacional

## Rodada seguinte: 30 capítulos de História e Geografia — 2026-10-10

A PR [#296](https://github.com/anajumorandii-eng/My-App/pull/296) está mesclada; sua CI e a CI na main passaram. A PR #298, com checks verdes na sua ponta, foi incorporada nesta rodada, preservando oito correções dirigidas de Física e o avaliador numérico; exige novos checks na união. A rodada atual revisa dez capítulos restantes de História e vinte de Geografia. [Conteúdo, fontes, validação e limites](revisao-pedagogica-historia-geografia-30-2026-10-10/README.md).

Primeira passagem das cinco seções e recuperação: 69/613 revisados, 544 pendentes; História 49/49 e Geografia 20/63. Não constitui aprovação formal: 81 em validação, 532 não revisados, zero aprovados. Os checks da PR atual ainda precisam passar antes do merge.

**Autorização vigente:** a usuária pediu para mesclar cada lote concluído após checks verdes e corrigir o próximo. “Sem merge automático” nos checkpoints históricos abaixo foi substituído por essa instrução. Preservar atualizações recentes da main e não reaplicar PRs mescladas. Próxima rodada: 43 capítulos restantes de Geografia.

## Rodada 2 — Física e recuperação, 2026-10-10

A rodada anterior foi integrada no PR #297; base desta retomada: `8b6b0a43`. Corrigidos oito capítulos de Física, com revisão editorial 3 apenas nesses capítulos, e o avaliador compartilhado para não aprovar números ausentes ou encontrados dentro de valores diferentes. Rótulos de três representações foram alinhados às condições ensinadas. [Correções, fontes, evidências e próximos capítulos](continuidade-rodada-2-2026-10-10/README.md). Estados formais preservados; sem merge automático.

## Lote pedagógico de História — PR #296, 2026-10-10

Proposta na branch `fix/revisao-pedagogica-30-capitulos-2026-10-10`, conciliada com a main `8b6b0a433d681a503dfaa332b5070e9e9589fd94` após #297. Preservados os três textos, o desenho de Montagem, os ajustes de legibilidade e as evidências de #297. A rodada examina 30 capítulos novos de História e retoma quatro de Brasil Colônia; 32 objetos de conteúdo mudam em relação à main atual. [Registro por capítulo, fontes e limites](revisao-pedagogica-lote-30-2026-10-10/README.md).

A primeira passagem completa das cinco seções e recuperação chega a 39/613; restam 574 nessa etapa. Correções dirigidas de Calor e Poríferos/Cnidários em #297 são preservadas, sem inferir nova leitura integral desses capítulos. Nenhuma aprovação formal é promovida: 81 em validação e 532 não revisados. Os checks da ponta de [#296](https://github.com/anajumorandii-eng/My-App/pull/296) determinam seu estado técnico. Continuar em lotes de cerca de 30 capítulos, consultando os deltas e sem reaplicar PRs mescladas. Sem merge automático.

## Retomada Design & Motion Kit — 2026-10-10

Base conferida: `3200ea9b67eb00fdb867b287b9d2fed2ba162765`. As PRs #293, #294 e #295 já estão mescladas; as instruções de merge abaixo são checkpoints históricos, não ações pendentes.

Corrigidos os achados confirmados de calor, Poríferos/Cnidários, Montagem da Colonização e legibilidade dos recortes da Crise do Antigo Sistema Colonial. Somente os três capítulos reescritos passam à revisão editorial 3. [Mudanças, fontes, validação e limites](continuidade-design-motion-2026-10-10/README.md).

A estrutura dos 613 capítulos mantém zero divergências e nenhuma representação fallback. O inventário formal permanece com 81 capítulos em validação e 532 não revisados. Próximo passo: revisar os demais candidatos da triagem e pendências bibliográficas por ID; não inferir aprovação pedagógica integral dos testes. Não reaplicar PRs mescladas. Sem merge automático.

## Auditoria automatizada executada no GitHub — 2026-10-09T23:22:52.027Z

Fonte: `e2bc9c860a53a3ff2fe6e7ee3bc3a4c62d5b7679`; execução 38001813270. Estado técnico: passed; 7356 de 7.356 resultados; 0 reprovações. [Relatório atual](revisao-demais-capitulos-awesome-2026-10-09/README.md), [manifesto](revisao-demais-capitulos-awesome-2026-10-09/execucao/manifesto.json) e [capturas para revisão](revisao-demais-capitulos-awesome-2026-10-09/GALERIA.md).

A execução verifica as correções da PR de continuidade desta branch após a base mesclada da PR #291: cabeçalhos, Geoeconomia, relevo, aromaticidade e correspondência entre perguntas, rótulos e exemplos. A inspeção anterior das 501 aberturas está registrada em revisao-501.json. Aprovação estética/pedagógica não foi inferida dos testes. Os 81 estados em validação e os 532 não revisados do inventário formal foram preservados.

Amostra posterior concluída: 18 IDs nas aberturas em 360/escuro e 1440/claro, sem bloqueios visíveis. [Encerramento](revisao-demais-capitulos-awesome-2026-10-09/ENCERRAMENTO.md) e [registro posterior](revisao-demais-capitulos-awesome-2026-10-09/REVISAO-POSTERIOR.json). Próximo passo: revisão e merge da PR #293 pelo responsável; a #292 foi encerrada como substituída. Não repetir a execução se o código não mudar e não houver falha ou dúvida nova. Não reaplicar #288/#289/#290. Sem merge automático.


## Auditoria automatizada executada no GitHub — 2026-10-09T22:01:37.193Z

Fonte: `2b52cad5ff7d2db078c91b1da0bf94e35e95a0de`; execução 37994256267. Estado técnico: passed; 7356 de 7.356 resultados; 0 reprovações. [Relatório atual](verificacao-awesome-613-2026-10-09/README.md), [manifesto](verificacao-awesome-613-2026-10-09/execucao/manifesto.json) e [capturas para revisão](verificacao-awesome-613-2026-10-09/GALERIA.md).

A execução remota contorna o bloqueio local. O código de produto permanece na base da main após #290; diferenças de branch nesta retomada são documentação e infraestrutura de auditoria. Aprovação estética/pedagógica não foi inferida dos testes. Os 81 estados em validação e os 532 não revisados do inventário formal foram preservados.

Próximo passo: analisar os achados por ID e revisar as capturas com os critérios Awesome Design MD; depois concluir a revisão da PR #291. Não repetir a execução se o código não mudar e não houver falha ou dúvida nova. Não reaplicar #288/#289/#290. Sem merge automático.


## Auditoria automatizada executada no GitHub — 2026-10-09T21:30:49.440Z

Fonte: `6cbcecebded583bd09530744009c6d3c72e24794`; execução 37992764943. Estado técnico: incomplete; 0 de 7.356 resultados; 0 reprovações. [Relatório atual](verificacao-awesome-613-2026-10-09/README.md), [manifesto](verificacao-awesome-613-2026-10-09/execucao/manifesto.json) e [capturas para revisão](verificacao-awesome-613-2026-10-09/GALERIA.md).

A execução remota contorna o bloqueio local. O código de produto permanece na base da main após #290; diferenças de branch nesta retomada são documentação e infraestrutura de auditoria. Aprovação estética/pedagógica não foi inferida dos testes. Os 81 estados em validação e os 532 não revisados do inventário formal foram preservados.

Próximo passo: analisar os achados por ID e revisar as capturas com os critérios Awesome Design MD; depois concluir a revisão da PR #291. Não repetir a execução se o código não mudar e não houver falha ou dúvida nova. Não reaplicar #288/#289/#290. Sem merge automático.


## Verificação estrutural dos 613 capítulos com Awesome Design MD — 09/10/2026

Base confirmada: `0ea6bfd64e4e4631aaf24e546a0ba32aa29cb4cc` na `main`. A PR #290 já foi integrada em `0526aafc5f909e31047285678c8cb48cf9231ef6`; #288 e #289 também estão integradas. Não reaplicar esses trabalhos. O registro de “proposta mais recente” abaixo é histórico.

A conferência pelo GitHub conciliou os 613 IDs/títulos, a matriz de representações e as associações aos 152 objetos, sem divergências estruturais. O inventário formal continua com 81 `em-validacao`, 532 `nao-revisado` e nenhuma aprovação. Isso não substitui as inspeções técnicas anteriores.

[Relatório e critérios Awesome Design MD](verificacao-awesome-613-2026-10-09/README.md) e [resultado por capítulo](verificacao-awesome-613-2026-10-09/resultado-613.json). Referências selecionadas: Claude para hierarquia editorial e Miro para mapas/comparações, adaptadas à identidade existente do Crivo.

**Verificação integral ainda pendente:** o ambiente falhou na inicialização (`snapshot_materialization_failed / gateway_unavailable`); nenhum navegador, lint, teste ou build novo foi executado nesta sessão. O CI anterior e o status de deploy foram consultados, sem nova inspeção da versão publicada. Retomar as verificações atuais de todos os 613 capítulos com ambiente funcional, saída nova vinculada ao SHA e cruzamento de largura/tema/movimento; os resultados antigos não são execuções novas. Manter esta proposta em rascunho até concluir; sem merge automático.


## Proposta mais recente — Biologia e comparação de painéis, 09/10/2026

Prioridade confirmada: Biologia. A branch `redesign/ilustracoes-comparacao` parte de `2928b786`, após a integração das PRs #288 e #289. Revê as aberturas dos 184 capítulos de Biologia, Geografia e História; melhora materiais e desenhos biológicos, corrige a direção das trocas no nefron e permite comparar dois recortes em 103 capítulos de Geografia/História. O modo comparação compacta os painéis sem apagar controles. No desktop há painéis lado a lado; celular e tablet em retrato mantêm painéis empilhados e deslocamento das figuras quando necessário.

Leia [a entrega atual](revisao-biologia-comparacao-2026-10-09/README.md), [a galeria](revisao-biologia-comparacao-2026-10-09/GALERIA.md) e [o guia de continuidade](revisao-biologia-comparacao-2026-10-09/CONTINUIDADE.md). Não reaplique as entregas integradas. Sem merge automático. As evidências de inspeção não promovem aprovação pedagógica.

## Registro — inspeção visual dos 613 capítulos integrada na PR #289, 09/10/2026

O pedido atual é conferir todos os capítulos e corrigir os desvios do visual aprovado, com objetos em relevo relacionados ao assunto. A branch `redesign/inspecao-visual-613` parte de `ac108c60`; Geografia e História já foram integradas pela PR #288 e não devem ser reaplicadas.

A proposta associa os 613 IDs a 152 modelos de objetos, unifica a apresentação das cenas, amplia os controles para toque e melhora a leitura de comparações de Biologia e Química. O percurso de conceitos passa a estar disponível em todas as matérias. Os mecanismos, os textos e os estados de aprovação pedagógica são preservados.

Fonte atual desta entrega: [inspeção visual](inspecao-visual-613-2026-10-09/README.md), [inventário individual](inspecao-visual-613-2026-10-09/inventario-613.json) e [guia de continuidade](inspecao-visual-613-2026-10-09/CONTINUIDADE.md). Os registros abaixo são históricos e não devem substituir esse pedido. Sem merge automático.

## Registro — Entrega O/Redação R1, 06/10/2026

As Entregas L e N foram integradas juntas na PR #269 (a #270 entrou pela
branch de L). A branch `fix/entrega-o-redacao-r1` trata os 16
capítulos R1 de Redação: texto aprofundado para rev 2 e oficinas em
`WritingOperations.tsx`, com cenas montadas a partir de dados do capítulo
(conceito escolhido, lei × prática, palavras do recorte, cinco elementos da
intervenção como condições). O texto de Cidadania e Poder deixou de atribuir
a cidadania regulada a José Murilo de Carvalho. As configurações antigas de
`writingInstrumentLab.ts` para esses 16 ficaram sem uso no registro. Sem
merge automático. Evidências: [Entrega O](visual-integral-2026-10-06/entrega-o/README.md).

Fila na proposta: 255 achados tratados, 43 pendentes e 315 preservados.
Conteúdo: 568 revisões 2, duas revisões 3, 42 pendentes (Redação R2 e R3).
Próximo passo: R2 (15), R3 (27) e A1 (COP30).

## Registro — Entrega N/Sociologia H2, 06/10/2026

A Entrega L (19 de Filosofia) está na PR #269. A branch
`fix/entrega-n-sociologia-h2`, empilhada sobre L, trata os 12 capítulos de
Sociologia do H2: texto aprofundado para rev 2, com casos autorais, e oficinas
em `SociologyOperations.tsx`. Nas tipologias o tipo escolhido redesenha o caso;
nas cadeias, retirar um elo muda desenho e veredito. As citações de nove cenas
antigas foram reancoradas no texto novo. Humanas fica sem pendências. Sem merge
automático. Evidências: [Entrega N](visual-integral-2026-10-06/entrega-n/README.md).

Fila na proposta: 239 achados tratados, 59 pendentes e 315 preservados.
Conteúdo: 552 revisões 2, duas revisões 3, 58 pendentes (todos de Redação).
Cobertura: 8 experimentos, 43 pranchas, 375 instrumentos, 187 cenas, zero
lacunas; aprovação formal não promovida.
Próximo passo: R1/R2/R3 (Redação) e A1 (COP30).

## Registro — Entrega L/Filosofia, 06/10/2026

A Entrega K foi integrada na PR #268. A branch `fix/entrega-l-filosofia-h3`
trata os 19 capítulos de Filosofia (oito do H3 e onze do H2) com oficinas de
argumento (`PhilosophyOperations.tsx`) ancoradas em frases literais dos textos
rev 2, que já estavam aprofundados. O experimento Mito/Logos passa a usar a
oficina. Sem merge automático. Evidências:
[Entrega L](visual-integral-2026-10-06/entrega-l/README.md).

Fila na proposta: 227 achados tratados, 71 pendentes e 315 preservados.
Conteúdo inalterado: 540 revisões 2, duas revisões 3, 70 pendentes (Redação 58,
Sociologia 12). Cobertura: 8 experimentos, 43 pranchas, 363 instrumentos,
199 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: os 12 de Sociologia do H2, que encerram Humanas.

## Registro — Entrega K/Sociologia H3, 06/10/2026

A Entrega J foi integrada na PR #267; Literatura está concluída. A branch
`fix/entrega-k-sociologia-h3` trata os sete capítulos de Sociologia do H3
(fato social, solidariedade, anomia, identidade, mobilidade, cidadania e
sociedade da informação), com texto em revisão 2 e caso autoral. A oficina da
Literatura foi generalizada (`OperationWorkshop`) para servir à Sociologia.
Sem merge automático. Evidências: [Entrega K](visual-integral-2026-10-06/entrega-k/README.md).

Fila na proposta: 208 achados tratados, 90 pendentes e 315 preservados.
Conteúdo: 540 revisões 2, duas revisões 3, 70 pendentes (Redação 58,
Sociologia 12). Cobertura: 8 experimentos, 43 pranchas, 345 instrumentos,
217 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: H2 (11 Filosofia + 12 Sociologia) e 8 de Filosofia do H3.

## Registro — Entrega J/Literatura concluída, 05/10/2026

A Entrega I foi integrada na PR #266. A branch
`fix/entrega-j-literatura-final` trata os seis últimos capítulos LG3 (poesia
e prosa contemporâneas, literatura lusófona, artes plásticas, teatro e
cancioneiro). Com ela, os 37 capítulos de Literatura têm texto em revisão 2 e
operação autoral própria. Sem merge automático.
Evidências: [Entrega J](visual-integral-2026-10-05/entrega-j/README.md).

Fila na proposta: 201 achados tratados, 97 pendentes e 315 preservados.
Conteúdo: 533 revisões 2, duas revisões 3, 77 pendentes (Redação 58,
Sociologia 19). Cobertura: 8 experimentos, 43 pranchas, 339 instrumentos,
223 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: H2/H3, R1/R2/R3 e A1, conforme o plano geral.

## Registro — Entrega I/Literatura de 45 a 1980, 05/10/2026

A Entrega H foi integrada na PR #264, e o teste instável do Plano diário que
derrubou o CI da main depois dela foi corrigido na PR #265. A branch
`fix/entrega-i-literatura-45-80` trata sete capítulos LG3 (Graciliano, João
Cabral, Clarice, Guimarães Rosa, Poesia Concreta, poesia e prosa de 1960-1980),
com texto e operação autoral juntos. Sem merge automático.
Evidências: [Entrega I](visual-integral-2026-10-05/entrega-i/README.md).

Fila na proposta: 195 achados tratados, 103 pendentes e 315 preservados.
Conteúdo: 527 revisões 2, duas revisões 3, 83 pendentes (Literatura 6,
Redação 58, Sociologia 19). Cobertura: 8 experimentos, 43 pranchas, 337
instrumentos, 225 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: os 6 restantes de LG3, depois Humanas/Redação.

## Registro — Entrega H/Machado e Modernismo, 05/10/2026

A Entrega G foi integrada na PR #263. A branch
`fix/entrega-h-literatura-modernismo` trata oito capítulos LG3 (Machado,
Vanguardas, Semana de 22, primeira geração, segunda geração em poesia e prosa,
Fernando Pessoa e Drummond), com texto e operação autoral juntos. Sem merge
automático. Evidências: [Entrega H](visual-integral-2026-10-05/entrega-h/README.md).

Fila na proposta: 188 achados tratados, 110 pendentes e 315 preservados.
Conteúdo: 520 revisões 2, duas revisões 3, 90 pendentes (Literatura 13,
Redação 58, Sociologia 19). Cobertura: 8 experimentos, 43 pranchas, 336
instrumentos, 226 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: os 13 restantes de LG3, depois Humanas/Redação.

## Registro — Entrega G/Literatura do século XIX, 05/10/2026

A Entrega F foi integrada na PR #262. A branch
`fix/entrega-g-literatura-seculo-xix` trata oito capítulos LG3 (Romantismo
poesia/prosa, Realismo, Naturalismo, Eça, Parnasianismo, Simbolismo,
Pré-Modernismo), com texto e operação autoral juntos. Sem merge automático.
Evidências: [Entrega G](visual-integral-2026-10-05/entrega-g/README.md).

Fila na proposta: 180 achados tratados, 118 pendentes e 315 preservados.
Conteúdo: 512 revisões 2, duas revisões 3, 98 pendentes (Literatura 21,
Redação 58, Sociologia 19). Cobertura: 8 experimentos, 43 pranchas, 333
instrumentos, 229 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: LG3 do Modernismo em diante (21), depois Humanas/Redação.

## Registro — Entrega F/Literatura, 05/10/2026

Base: `683a573204f92adc247d1493caaa08ad9de9b799`. A PR #261 foi integrada;
CI e preview aprovados. Não repetir o isolamento de progresso nem o contraste
como reparos inéditos. A branch `fix/entrega-f-literatura` entrega oito
fundamentos de LG3, com texto e operação autoral juntos; os outros 29 capítulos
de Literatura continuam pendentes. Sem merge automático.

Evidências e revisão: [Entrega F](visual-integral-2026-10-05/entrega-f/README.md).
São 40 seções em revisão 2, 936–1.096 caracteres, seis armadilhas corrigidas e
dois problemas resolvidos por capítulo. Só os oito capítulos mudaram de revisão;
títulos e recalls foram preservados. Sem reset, migração ou escrita real.

Matriz local: 128 configurações Chromium, em 360/390/834/1366, temas claro/escuro
e movimento normal/reduzido, com operações, modificadores, pan por teclado,
diagnóstico e Testar/Reconstruir. Contagem final de testes e limites no relatório.
Safari/iPad físico e serviços autenticados reais não foram certificados.

Fila na proposta: 172 achados tratados, 126 pendentes e 315 preservados.
Conteúdo: 504 revisões 2, duas revisões 3, 106 pendentes (Literatura 29,
Redação 58, Sociologia 19). Cobertura primária: 8 experimentos, 43 pranchas,
332 instrumentos, 230 cenas, zero lacunas; aprovação formal não promovida.
Próximo passo: conferir integração desta entrega e continuar LG3 nos 29
capítulos restantes, depois Humanas/Redação conforme o plano. Não reabrir os
oito fundamentos nem Gramática, Física ou História/Geografia sem novo achado.

## Registro histórico — auditoria e continuidade, 05/10/2026

Base auditada e confirmada com `origin/main`:
`d7e895ba7853ffcb5e53adce1e16db7cade6326a`. A Entrega E/Gramática está
integrada em #260. Relatório atual:
[AUDITORIA-GERAL-2026-10-05.md](AUDITORIA-GERAL-2026-10-05.md).

A proposta `fix/auditoria-continuidade-acessibilidade` isola o cache de
Resumos por UID, mantém a chave legada, ignora retornos de contas antigas e
evita gravação remota sem leitura confirmada. Oito regressões passaram.
Também trata as 44 combinações de contraste reproduzidas em 11 rotas,
usando pares de tokens de ação/texto e tons auxiliares por tema. Não houve
reset, migração ou escrita no histórico real.

Validação: TypeScript, build e 2.044 testes gerais (922 Node + 1.122 Vitest);
matrizes visual/qualidade sem delta; fila íntegra. Chromium: 168 aberturas de
28 rotas em 390/834/1366 claro/escuro, sem violações automáticas, exceções ou
overflow. Oito cenários de interação em 360/834, normal/reduzido, e 180 pares
de cores/estados com contraste mínimo 4,69:1. Capturas/resultados no relatório.
Resultados axe incompletos, Safari/iPad físico e serviços autenticados reais
continuam sem certificação integral. Health público respondeu 200/OAuth
configurado; não comprova o login nem o SHA do Cloud Run.

Fila preservada: 134 achados visuais, 114 aprofundamentos, 613 IDs. Próxima
entrega editorial/visual: LG3/Literatura (37), depois Humanas e Redação.
Conferir a integração desta proposta e o delta antes de retomar; não repetir
Gramática, Física ou História/Geografia. Branch/PR automática permanece
autorizada, sem merge automático. Os registros abaixo são históricos.

Este arquivo é a fonte curta de contexto do projeto. Ele existe para que sessões futuras trabalhem por **delta**, consultando o GitHub, sem baixar nem reanalisar o aplicativo inteiro.

## Regra de trabalho

1. Leia este arquivo e `docs/CONTINUIDADE-ESTADO.json`.
2. Consulte a ponta de `main` e os commits posteriores ao `source_commit` do estado.
3. Baixe apenas os arquivos envolvidos na tarefa ou no delta; não faça clone completo por padrão.
4. Faça uma auditoria nova somente quando solicitada e grave seu resultado nesta fonte, com SHA completo e data.
5. Atualize este documento ao encerrar alterações relevantes de produto, arquitetura, testes, CI ou cobertura visual.

## Registro automático

O workflow `.github/workflows/continuity-state.yml` cria/atualiza `docs/CONTINUIDADE-ESTADO.json` depois de cada push de uma pessoa para `main`. O instantâneo contém:

- SHA de origem e horário UTC;
- lista de arquivos alterados naquele envio;
- instrução operacional para recuperar somente o necessário.

O commit automático do bot não se reprocessa, evitando loops de CI.

## Estado inicial confirmado

- Repositório canônico: `anajumorandii-eng/My-App`
- Branch: `main`
- Ponta confirmada antes desta infraestrutura: `99ff9a2d649c52394936ea3af0adfc0a5d06a5f5` (2026-09-21 23:26 UTC)
- Última integração conhecida: cobertura de 28 capítulos de Literatura com instrumentos de traço e de autor (PR #195).
- Integrações imediatamente anteriores: Gramática, Geografia/Atualidades e Língua Inglesa, com regeneração da matriz visual.
- A cobertura visual precisa ser tratada como dado verificável no código: números de auditorias antigas não são estado atual.

## Auditoria independente — 22 de setembro de 2026

- Ponta da `main` auditada: `6bbe30da32c1095fe87b9d22599d05bf594e9860`; é o commit automático de continuidade. A última mudança funcional/visual é `99ff9a2d649c52394936ea3af0adfc0a5d06a5f5` (Literatura).
- Houve 25 commits entre `f866a889afdcf10f27432277fcd549af8a0d3b9d` e `99ff9a2d649c52394936ea3af0adfc0a5d06a5f5`, cobrindo Biologia/Fisiologia, Física, Geografia/Atualidades, História, Gramática, Inglês e Literatura.
- Status atual do deploy Vercel: sucesso. A falha observada durante a criação da continuidade foi de um commit intermediário e não persiste na ponta.
- A matriz rastreada e os testes isolados de visual são coerentes: 613 capítulos; 11 experimentos, 43 pranchas, 299 instrumentos, 186 cenas e 74 lacunas honestas. Os 59 testes isolados de representação, cobertura e registros passaram.
- Lacunas reais: Redação 52, Entendimento de Texto 11 e Física 11; todas as outras matérias estão sem fallback.
- `npm run lint` e `npm run build` passam. O build avisa chunks grandes: Visual ~1,04 MB minificado e useSummaryProgress ~3,74 MB.
- O bloqueio de validação foi corrigido no commit `2b478efdbc88edade002ca900cf86c51621da7c8`: Vitest usa jsdom e o setup de testes; `visualCoverage.test.ts` voltou ao include. Revalidação: `npm run test:vitest` 94/94 e `npm run visual:matrix` 13/13. `npm run test:node` teve 701/702 sucessos na cópia parcial; o único restante exige PDFs LFS não baixados.
- `npm audit --omit=dev` aponta 6 vulnerabilidades moderadas na cadeia de `firebase-admin` / storage / uuid, todas com atualização disponível.
- PRs #183 e #90 continuam abertos, não mescláveis e muito atrás de `main`; não devem ser mesclados diretamente.

## Ordem de retomada

1. Concluído: reparar o pipeline de testes (Vitest/jsdom e `visual:matrix`).
2. Próximo: reduzir os 52 fallbacks de Redação usando instrumentos por família de decisão, não uma ilustração genérica por capítulo.
3. Cobrir Entendimento de Texto e os 11 capítulos restantes de Física.
4. Revisar peso dos chunks e atualizar a cadeia do Firebase depois que a suíte estiver confiável.

## Limites claros

Este mecanismo preserva o contexto e o estado técnico no repositório e no arquivo de continuidade da conversa. Ele não substitui a conferência do GitHub quando houver mudanças novas, nem permite que uma memória de chat seja automaticamente reescrita a cada push. A fonte canônica é este documento + o instantâneo automático; ambos podem ser consultados diretamente pelo GitHub sem clone.

## Reconstrução visual em andamento — 23/09/2026

A responsável rejeitou a qualidade das imagens e a ausência de movimento na aba Visual dos capítulos. Lote local em `C:\wt-crivo-motion-rebuild`, branch `codex/visual-motion-rebuild`, base `aa9bf2c`: 15 capítulos de Biologia, História e Geografia reconstruídos com cenas e fluxos em `motion/react`. Sem publicação e sem aprovação estética presumida. Os seis registros antigos de Ecologia foram reabertos como `em-validacao`.

Detalhes, evidências e próximos pontos: [reconstrucao-motion-2026-09-23.md](visual-personalizado/reconstrucao-motion-2026-09-23.md). Há 150 verificações de largura em cinco tamanhos e dois temas; isso não representa revisão estética completa do catálogo. O bloqueio de `npm test` por 14 PDFs licenciados ausentes permanece separado dos testes de interface.
## Retomada Motion — 24 de setembro de 2026

- Base: `aa9bf2c`; branch `codex/motion-recovery`.
- Recuperada a correção da rodada anterior, cujo worktree/commit temporário não persistiu entre mensagens.
- Button, Panel e MenuBase consultam movimento reduzido. Presets estáticos removem blur, deslocamentos e stagger; indicador de carregamento respeita a preferência. Identidades normais por matéria preservadas.
- Testes UI/unitários recebem referência inerte em `src/testSetup.ts` no lugar do banco Firestore real. Testes de repositório continuam fornecendo seus próprios mocks.
- Validação: 537 testes Vitest e 706 testes Node aprovados; build aprovado. Três testes de regressão cobrem conteúdo legível, ação do menu e bloqueio de envio duplicado.
- QA em navegador pendente: Chromium ausente e download retornou arquivo inválido. Esta rodada não certifica a revisão visual dos 613 capítulos nem altera sua cobertura.

## Continuidade de Motion — ícones e inspeção publicada

- PR #208 integrada em `3e995da2c1f7ca53945ef2bd540da73bb69655d6`; CI #412, verificação da PR e Vercel aprovados.
- Base desta rodada: `2f7a6d5006d068c767d0ff1b609f482dd4bcdcdd`; branch `codex/motion-followup`.
- Ícones de disciplinas e tópicos da tela Visual passam a consultar movimento reduzido. Alvos estáticos preservam letras, traços completos, areia da ampulheta e os três planos orbitais de Física. Transições reduzidas não repetem nem aguardam atrasos.
- Quatro testes novos: órbitas distintas, legibilidade de traços/letras, geometria de tópicos e preservação do modo normal.
- Validação: 541 testes Vitest e 706 testes Node aprovados; TypeScript aprovado.
- Inspeção de produção: catálogo, filtro de Física e abertura do capítulo de calorimetria; desktop 1363×936, temas claro/escuro, sem overflow horizontal. Capturas em `docs/visual-personalizado/screenshots/motion-followup/`.
- As capturas registram a versão publicada anterior à correção de ícones. Não são aprovação visual da nova implementação. A API do navegador disponível não expõe redimensionamento/emulação; mobile/tablet e reduced motion em navegador permanecem pendentes.

## Continuidade de Motion — visibilidade dos ícones, 25 de setembro de 2026

- Base: `0fdae42` após a integração da PR #209; branch `codex/motion-qa-20260925`.
- Os ícones de disciplinas e os ícones generativos de tópicos animam somente quando seu SVG está visível na viewport e a aba está ativa. Fora dessas condições, usam o mesmo quadro estático legível já definido para movimento reduzido; ao retornar, retomam o movimento. A preferência de movimento reduzido continua prioritária.
- O setup de testes fornece `IntersectionObserver` para o jsdom. Dois casos novos exercitam a ida e volta da viewport e da aba.
- Validação local: 543 testes Vitest, 706 testes Node, TypeScript e build aprovados.
- Revisão visual desta nova versão em produção, mobile/tablet e preferência de movimento reduzido em navegador continuam pendentes até a publicação e uma sessão de navegador com emulação.

## Física — medidores elétricos, 25 de setembro de 2026

- Após a integração da PR #210, a matriz de cobertura marca 0 lacunas honestas entre 613 capítulos (Física: 85 capítulos, 14 pranchas, 63 instrumentos e 8 cenas). Isso mede presença de artefato, não aprovação visual; o inventário de qualidade ainda registra a maioria como não revisada.
- No capítulo de medidores elétricos, o desenho anterior não ligava claramente o voltímetro aos dois lados do resistor. O circuito agora tem um único caminho principal com fonte e resistor: o amperímetro entra em série nesse caminho, e o voltímetro mede o resistor por um ramo paralelo com contatos visíveis. O título comum dos instrumentos passa a dizer apenas “Laboratório de Física”.
- A primeira inspeção na prévia Vercel revelou símbolos vazios e legendas sobrepostas no SVG. O preenchimento dos medidores e a tipografia das legendas foram corrigidos. A prévia corrigida foi conferida em 1363 × 936 px: amperímetro e voltímetro no tema claro, voltímetro no tema escuro, sem transbordamento horizontal. Capturas em `docs/visual-personalizado/screenshots/physics-meter-2026-09-25/`.
- O teste de topologia e alternância passou; 544 testes Vitest, TypeScript e build passaram no primeiro commit. Larguras móveis/tablet, tema escuro para o amperímetro e movimento reduzido ainda requerem conferência; o capítulo não foi marcado como aprovado no inventário de qualidade.

## Continuação das 613 cenas no perfil Ana Júlia — 25/09/2026

Trabalho retomado em `C:\Users\Ana Julia\Documents\CRIVO\My-App`, com Git independente e origem preservada. A main `d641b5b`, incluindo as correções da outra frente Motion, foi incorporada. Sete cenas pendentes recuperadas e revisadas: três de ondas/som, duas de termoquímica, modelos atômicos e circulação. O inventário registra 22 em validação, 591 sem revisão e zero aprovados.

Plano, critérios e fila completa de IDs: [plano-finalizacao-613.md](visual-personalizado/plano-finalizacao-613.md). Evidências e limites: [expansao-motion-2026-09-25.md](visual-personalizado/expansao-motion-2026-09-25.md). Esta retomada permanece local, sem publicação.

## Auditoria geral de retomada — 01/10/2026

- Estado auditado: `6cbc94cdb46048d00947db136ae529e1c6ef41af`, confirmado com `origin/main`. Última mudança funcional: `f9f0883cc4bf6efe4b6dcdc28301f216534411a1` (#241).
- Relatório: [ANALISE-GERAL-2026-10-01.md](ANALISE-GERAL-2026-10-01.md). Nenhuma funcionalidade alterada; sem commit, push ou publicação nesta rodada.
- TypeScript, build e 1.534 testes aprovados (776 Node + 758 Vitest). CI e status Vercel da última alteração funcional aprovados.
- 28 telas abertas em Chromium desktop; seis em 390 px; nenhuma exceção de página ou rolagem horizontal nessas aberturas. Amostra visual não equivale à aprovação dos 613 capítulos ou à validação das integrações autenticadas.
- Matriz atual: 613 representações, zero lacunas; inventário de qualidade: 534 não revisados, 79 em validação e zero aprovações formalmente registradas. Resumos: 435 de 612 na revisão editorial 2; 177 restantes. Questões: 2.887, das quais 90 de Fuvest 2025 com texto de marcador.
- Prioridades: revisar inicialização de usuário novo com `mockMastery` persistido; triar 12 ocorrências de dependências (6 altas, 6 moderadas); reduzir chunks inicial/Visual; concluir revisão visual e conteúdo. Nietzsche ainda usa a família genérica criticada em setembro.
- As filas antigas deste documento são históricas. Retomar pela análise atual e por deltas do GitHub. Conversas da conta anterior não foram recuperadas; exigências que só existam nelas permanecem desconhecidas.

## Primeira etapa da retomada — 01/10/2026

- Mudanças locais em `main`, sobre `6cbc94cdb46048d00947db136ae529e1c6ef41af`. Relatório: [RETOMADA-PROGRESSO-CARREGAMENTO-2026-10-01.md](RETOMADA-PROGRESSO-CARREGAMENTO-2026-10-01.md).
- Contas novas começam com domínio sem evidência e backlog vazio, inclusive nos caminhos de atualização e recuperação. Registros existentes são preservados; nenhuma limpeza ou migração de dados reais foi executada.
- O domínio carregado é isolado por UID; leituras e ações antigas não contaminam a conta atual. Falha de leitura deixa o estado vazio e bloqueia atualização; demonstração permanece disponível sem login.
- Busca global carrega o corpus de 613 capítulos somente ao abrir. Bundle principal: 3.801,04 kB → 66,48 kB (gzip 1.122,26 → 23,01 kB); isso não mede todo o tráfego inicial nem desempenho no iPad.
- TypeScript, build, 779 testes Node e 760 testes Vitest aprovados. Chromium confirmou download sob demanda, busca por mitose, teclado, fechamento durante download lento, navegação para Caderno e celular claro/escuro com movimento reduzido.
- Próximo: conferir a sessão real Google/Firebase e a origem de eventuais exemplos antigos; atualizar dependências com revisão do gRPC fixado pelo cliente Firestore; medir desempenho no aparelho real. Sem publicação nesta etapa.

## Dependências e histórico — 01/10/2026

- A consulta autorizada ao histórico do Crivo foi concluída somente em leitura. A estudante confirmou que o domínio baixo corresponde ao início do uso; isso não justifica recalcular ou limpar seu progresso. Dados e credenciais dessa consulta ficam fora do repositório público.
- Dependências atualizadas dentro das versões principais existentes. Firebase 12.19.0, Firebase Admin 14.5.0, Undici 7.30.0 e jsdom 30.1.1; overrides restritos de gRPC para Firestore e uuid para gaxios 6. Relatório e limites: [ATUALIZACAO-DEPENDENCIAS-2026-10-01.md](ATUALIZACAO-DEPENDENCIAS-2026-10-01.md).
- Auditoria npm passou de 12 dependências afetadas para zero vulnerabilidades conhecidas na data. Instalação limpa, TypeScript, build, integração Auth/Firestore em emuladores no Node 22 e HTTP/multipart locais aprovados. Busca e dez aberturas de telas em desktop/celular sem exceções ou transbordamento.
- Suíte completa após as atualizações: 779 testes Node e 760 testes Vitest aprovados (1.539 no total), com zero falhas.
- Próximas prioridades de produto: revisão visual/pedagógica do inventário, enunciados de Fuvest 2025 e revisão editorial dos resumos. As alterações seguem locais, sem publicação.

## Conteúdo e conferência de Ciências — 01/10/2026

- Recuperados os 90 enunciados da prova V1 da Fuvest 2025. Alternativas textuais de 88 questões restauradas; 60 e 69 mantêm alternativas gráficas na página original. Os textos-base de 13 questões e as notas de apoio foram preservados. As 2.797 outras questões, imagens, IDs e comentários não mudaram; os 90 gabaritos foram conferidos sem alterações.
- Receita em `scripts/recuperar-fuvest-2025.py`, com hash obrigatório do PDF. PDF e intermediários fora do Git. Se reutilizar o importador antigo de páginas, rodar a recuperação depois; a suíte agora recusa os antigos marcadores.
- Revisados osmose e estudo gráfico de lentes: 36 estados em 390/768/1440, claro/escuro e movimento reduzido. Corrigida a colisão entre “objeto” e “imagem” na lente divergente. Teclado, animação finita e alternância dos modos conferidos em desktop.
- Inventário: 532 sem revisão, 81 em validação, zero aprovados. Os dois novos registros são validação técnica; aprovação editorial continua pendente. Não declarar concluídas Ciências ou as 613 representações.
- Suíte: 782 testes Node e 760 Vitest aprovados, além dos testes específicos de mecanismos/inventário. Evidências e limites: [REVISAO-CONTEUDO-CIENCIAS-2026-10-01.md](REVISAO-CONTEUDO-CIENCIAS-2026-10-01.md). Alterações locais, sem publicação ou escrita no histórico real.

### Revisão visual integral — 02/10/2026 (UTC)

Relatório canônico: `docs/REVISAO-VISUAL-INTEGRAL-2026-10-02.md`; inventário em `docs/visual-integral-2026-10-02/capitulos.json` e `.csv`. Revisão da build local, sem login ou alteração de progresso: 613 capítulos/3.678 configurações, 28 telas/224 configurações, capturas e fonte confrontadas. Recomendações do mecanismo central: 315 preservar, 170 ajustar, 128 redesenhar; nenhuma aprovação editorial foi promovida.

Priorizar fidelidade de diagramas de Física/Matemática e associações de conteúdo; depois painel Personalizar fora da borda móvel, overflows em Independência/Competências/Admin Conteúdo, nomes acessíveis, foco da busca e contraste. Os 128 redesenhos incluem mecanismos genéricos sem explicação do assunto: não equivalem a 128 bugs de execução. Diagnóstico/persistência, todas as animações/combinações e telas dependentes de conteúdo autenticado não receberam certificação integral. Evidências completas e galeria local: `/workspace/crivo-visual-review-2026-10-02/`; imagens selecionadas sem material privado no diretório do relatório. Nenhum código do app foi alterado neste pedido de revisão.

## Publicação e primeiro lote visual — 02/10/2026

O trabalho anterior, as dependências, a recuperação de Fuvest 2025 e os relatórios de revisão integral foram publicados em `main` no commit `b22f4439`. A execução começou por quatro achados confirmados: reflexão plana, refração, limites do painel Personalizar no celular e gerenciamento de foco da busca, incluindo o carregamento sob demanda.

O [registro do primeiro lote](visual-integral-2026-10-02/primeiro-lote/README.md) reúne comportamento corrigido, capturas, regressões e limites. Validação final: 1.551 testes gerais, lint, build, 48 verificações de geometria no navegador e nove testes de navegação na build de produção aprovados. Os demais achados da revisão integral continuam pendentes; não tratar a presença de uma prancha ou este lote como aprovação editorial geral.

O primeiro CI remoto detectou uma incompatibilidade de `npm ci` (npm 10) com o seletor de override de gaxios. A regra foi corrigida sem trocar as versões do lockfile e verificada em instalações limpas completas e de produção. Ver [compatibilidade de dependências](ATUALIZACAO-DEPENDENCIAS-2026-10-01.md).

## Segundo lote visual por PR — 02/10/2026

A estudante autorizou nesta etapa publicar em outra branch e abrir PR automaticamente, em vez de enviar diretamente à `main`. A branch `fix/optica-espelhos-visao`, baseada em `05412f4b`, corrige o espelho côncavo (equação de Gauss, ampliação, foco e raios paralelos) e a prancha de miopia/hipermetropia efetivamente usada pelo capítulo (comparação sem/com correção, lentes externas e raios completos). O [registro do segundo lote](visual-integral-2026-10-02/segundo-lote/README.md) inclui capturas, regressões, modelos e limites. Estas mudanças são uma proposta para integração por PR; não estão incorporadas à `main` por este registro. Os demais achados do inventário permanecem pendentes.

## Terceiro lote visual por PR — 02/10/2026

A PR #242 foi incorporada em 02/10/2026; a nova base é `cfd4e13e`. O fluxo autorizado de branch e PR continua em `fix/matematica-sistemas-determinantes`: Sistemas agora representa as duas equações que se encontram em `(6,4)`; Determinantes mostra o paralelogramo das colunas da matriz, área e orientação, inclusive o caso singular `c = 10/3`. O [registro do terceiro lote](visual-integral-2026-10-02/terceiro-lote/README.md) reúne regressões, capturas e limites. Estas alterações serão propostas por PR; não representam merge automático nem aprovação editorial dos outros capítulos.

## Quarto lote visual ampliado por PR — 02/10/2026

A PR #243 foi incorporada em 02/10/2026. A estudante pediu mais correções por passo, para reduzir o tempo total; agrupar achados independentes e validar o lote em conjunto, mantendo branch e PR automáticas. A branch `fix/diagramas-geometria-fisica`, baseada em `1d22bc89`, reúne 11 capítulos: quatro de ângulos/semelhança, cinco de áreas/medidas e dois de Física (carga em B e trabalho do gás). O [registro do quarto lote](visual-integral-2026-10-02/quarto-lote/README.md) documenta relações, capturas, regressões e limites. É uma proposta por PR, sem merge automático. Não executar TypeScript junto ao navegador nesta infraestrutura: a combinação pode atingir o limite de memória e interromper verificações. Os demais achados e a aprovação editorial integral continuam pendentes.

## Quinto lote visual ampliado por PR — 02/10/2026

A PR #244 foi incorporada em 02/10/2026; base atual `b61b0518`. Mantido o pedido de lotes maiores e PR automática na branch `fix/matematica-probabilidades-sequencias`: 13 capítulos de probabilidades, trigonometria, geometria espacial, funções, sequências e anotações analíticas, mais acesso aos controles de Podcast, Treino da 2ª Fase, Tutor, Redação e Administração de Conteúdo. O [registro do quinto lote](visual-integral-2026-10-02/quinto-lote/README.md) reúne modelos, capturas, regressões e limites. Nenhum histórico real ou conteúdo autenticado foi alterado. Esta etapa é uma proposta por PR; não realizar merge automático nem considerar concluídos os outros achados do inventário.

## Retomada após a integração da PR #247

- Base de trabalho: `25cafa0dc60895e29cbe4727c118f9179f0d13aa`, após a integração das PRs #247 (pranchas científicas) e #248 (reprodução de podcasts). O CI e o deploy da PR #247 foram confirmados verdes.
- Três apontamentos da revisão de #247 foram reproduzidos e corrigidos: seleção da Primeira Lei no capítulo da Segunda Lei; origem de temperatura de Gibbs à esquerda do equilíbrio, com intercepto positivo; apoio de Termoquímica I separado do conteúdo de Gibbs.
- Quatro regressões de componente e oito cenários de interação no Chromium ampliam a cobertura existente. Capturas e reprodução: [complemento do sexto lote](visual-integral-2026-10-02/sexto-lote/README.md#ajustes-após-a-revisão-da-pr-247).
- A correção de podcasts já incorporada em #248 foi preservada. Esta rodada não altera autenticação, histórico real, Firestore ou aprovação editorial de outros capítulos.

- Validação da retomada: 806 testes Node e 895 testes Vitest passaram; 32 cenários Chromium e oito rechecagens de Gibbs passaram. Um timeout de `pairContract.test.tsx` observado durante execução concorrente não se repetiu isoladamente nem na suíte completa sem Chromium em paralelo. O limite original de 15 segundos foi preservado.

## Conferência de atualizações e navegação do iPad — 03/10/2026

A estudante enviou capturas de sobreposição da lateral e autorizou corrigir e prosseguir após conferir as atualizações. Base atual conferida: `f89ab5af`, incluindo o merge da PR #249 (`ee1a6e6f`) e a atualização automática de continuidade. As PRs #247, #248 e #249 já foram incorporadas. A branch da PR #250 foi atualizada sobre essa main, preservando as correções de Mendel/Gibbs e os dois registros de continuidade. Não repetir o sexto lote científico nem as correções já integradas. O próximo lote de mecanismos recomendado segue em Física (Lenz, Doppler e telescópio), após consultar o estado efetivo.

Na branch `fix/ipad-navigation-layout`, a coluna da grade acompanha o trilho expandido, a marca tem alternativa SVG em falha de carregamento e a gaveta ganhou entrada/contenção/restauração de foco, Escape e limpeza ao mudar para paisagem desktop. Evidências, limites e regressões: [navegação do iPad](visual-integral-2026-10-03/navegacao-ipad/README.md). Publicação por PR autorizada, sem merge automático. Histórico e chaves de persistência preservados.

## Lenz, Doppler e luneta após as integrações #250/#251 — 03/10/2026

- Main conferida novamente: `9dbdd3210fb32c7f92ba0713fc0bcf904bb2c8e0`. #250 (navegação do iPad) e #251 (geração de podcasts/seis vozes) estão incorporadas; checks e deploy da main passaram. As PRs #246, #234 e #222 continuam separadas deste trabalho.
- A branch `fix/fisica-lenz-doppler-luneta` resolve os três achados ainda presentes: Lenz compara aproximação/afastamento/fluxo constante com observador explícito; Doppler usa círculos das posições anteriores de emissão; luneta de Kepler usa foco comum, saída paralela invertida e escalas separadas declaradas. A cena não pretende modelar o microscópio.
- Revisão independente corrigiu a afirmação de proporcionalidade da seta de Lenz: ela tem comprimento esquemático declarado, enquanto as leituras de FEM permanecem quantitativas. Diagramas e demais modos foram preservados.
- Chromium: 36 cenários/336 estados em 390/834/1366 px, dois temas e movimento normal/reduzido; contenção e colisão de textos, geometria, controles Home/End, overflow e exceções de página passaram. TypeScript, build e matriz visual (13 testes, catálogo inalterado) passaram. Suíte geral: 819 testes Node + 898 Vitest (1.717) passaram, sem falhas.
- Modelos, regressões, capturas e limites: [lote de Física](visual-integral-2026-10-03/fisica-lenz-doppler-luneta/README.md). Histórico real, persistência e aprovação editorial permanecem preservados. Branch/PR automática autorizadas; nenhum merge automático.
- Próxima retomada: conferir esta PR e o delta efetivo de main; depois revalidar no código atual os achados de Corrente Elétrica, Potência Elétrica, Dilatação Térmica e Aceleração Vetorial da auditoria de 02/10 antes de compor o próximo lote. Não repetir os mecanismos já integrados e não tratar a auditoria histórica como estado atual.

## Fila completa e aceleração por famílias — 03/10/2026

A responsável pediu visão de tudo que falta e lotes maiores, incluindo História, Geografia e outras matérias. Main reconciliada: `42589657df0d802c60e19c38383682a6e49573f9`; #252 já incorporada. A próxima execução substitui a sequência de dois/três capítulos por entregas de famílias e validação conjunta.

Fonte operacional nova: [plano geral](PLANO-GERAL-CRIVO-2026-10-03.md), [fila por ID](FILA-VISUAL-2026-10-03.json), [CSV dos pendentes](FILA-VISUAL-2026-10-03.csv) e [roteiro técnico](superpowers/plans/2026-10-03-lotes-ampliados.md). Não repetir uma auditoria de 613 telas para reconstruir o contexto. São 315 mecanismos a preservar, 39 achados tratados após a auditoria e 259 capítulos na fila a revalidar/corrigir, divididos em 15 lotes sem duplicação. Os 177 resumos ainda sem revisão editorial 2 foram vinculados aos mesmos IDs/lotes; aprofundar texto e representação juntos nessas matérias. Os 112 capítulos de História/Geografia têm quatro achados específicos, mas aprovação editorial integral continua aberta.

Primeiras entregas: A=25 (eletricidade/magnetismo + quatro Matemática + quatro História/Geografia); B=29 (Inglês/Entendimento, incluindo seus textos); C=24 (comparações Filosofia/Sociologia). Frentes independentes podem avançar em worktrees separados, com um responsável pelos dados/registros/estilos compartilhados. Não tratar o escopo de 78 capítulos como trabalho já concluído. PR automática por entrega, sem merge automático; validar o lote estabilizado uma vez e repetir somente o que mudanças/falhas invalidarem, cumprindo os checks antes de push.

Verificação desta consolidação: `node scripts/validar-fila-visual.mjs` confere os 613 IDs, fontes/evidências presentes, totais/lotes e os 177 vínculos editoriais. TypeScript e os 819 testes Node + 898 Vitest passaram. Não houve mudança no produto, no histórico real ou em aprovações de qualidade. A fila é reconciliação com o delta e confronto de causas representativas em fonte, sem nova certificação visual de todos os capítulos. Contraste (44 alvos históricos), fluxos autenticados, Safari/iPad real, desempenho e composição integral permanecem frentes gerais separadas.

## Entrega A — 25 capítulos, após a integração #253 — 03–04/10/2026

Main conferida antes do trabalho e novamente antes da publicação: `af401453397d773ddf8ff5ae65df1e3f1559afc6`. #253 está incorporada; #246/#234/#222 seguem separadas. A branch `fix/entrega-a-eletricidade-matematica-historia` reúne os 17 IDs F1, quatro M1 e quatro HG1, preservando os mecanismos anteriores de Lenz/luneta, IDs e chaves de progresso.

Circuitos e vetores passam a distinguir sentidos, valores nulos e escalas; eletrização mostra mecanismos físicos próprios; o gerador permite observar a inversão de corrente. Matrizes/raízes e contenção/leitura histórica foram corrigidas. O título de população acompanha o conteúdo existente. Revisão independente encontrou e corrigiu o fio desviando do resistor, distância do ponto P não proporcional a r e símbolo de corrente preservado em zero.

[Registro, resultados por ID e 68 capturas](visual-integral-2026-10-03/entrega-a/README.md): build/TypeScript passaram; Chromium passou em 12 configurações com 25 IDs/1.032 estados, mais 12 rechecagens dirigidas/84 estados após ajustes de contraste. A suíte geral final passou em 823 testes Node + 940 Vitest (1.763), com os limites de tempo originais, sem navegador/compilação concorrentes. A matriz visual mantém os 613 IDs; o inventário de qualidade apenas sincroniza o título, sem promover aprovação.

A fila desta proposta contém 64 achados tratados, 234 pendentes e 315 mecanismos preservados, em 12 lotes restantes; os 177 aprofundamentos editoriais continuam pendentes. Nenhum histórico real, Firestore ou fluxo autenticado foi alterado. PR automática autorizada, sem merge automático. Conferir a integração e o delta de main na retomada; o próximo escopo planejado é B/LG2: 29 capítulos e seus aprofundamentos, Inglês/Entendimento de Texto. Não repetir F1/M1/HG1 se esta proposta estiver incorporada.

## Redesenho integral de História e Geografia — 04/10/2026

Após a Entrega A (#254), a responsável reabriu o desenho dos 112 capítulos de História e Geografia e aprovou a direção de pranchas autorais mais ricas, com ilustração central, anotações manuscritas e relações integradas. A branch `fix/redesenho-historia-geografia`, baseada em `d842f69b`, implementa os 49 capítulos de História e os 63 de Geografia, incluindo nove instrumentos/experimentos. A classificação da auditoria anterior continua histórica e não equivale à aprovação deste redesenho.

[Registro técnico, manifesto por ID e galeria](visual-integral-2026-10-04/redesenho-hg/README.md): a matriz Chromium e a repetição dirigida cobrem 112 IDs, 12 configurações e 5.988 estados. Foram corrigidos cortes de legendas móveis e sobreposição durante troca de recorte. As composições dos 112 desenhos foram conferidas em capturas completas; 35 imagens representativas acompanham a proposta. A revisão independente conferiu recortes e marcos históricos. IDs, conteúdo aprofundado, diagnóstico e chaves de progresso estão preservados; aprovação editorial integral permanece aberta.

O redesenho foi integrado em #255. A Entrega B foi retomada em worktree próprio a partir de `f9b7e12f`; o stash da pausa permanece como cópia preservada e não deve ser reaplicado indiscriminadamente. Sem merge automático. Os resultados finais da suíte e os limites da verificação estão no registro técnico.


## Entrega B — 29 capítulos de leitura e seus resumos — 04/10/2026

Base conferida: `f9b7e12f6ef69f1524a34358243856ab95d63b0e`, após #254/#255; #246/#234/#222 seguem separados. A branch `fix/entrega-b-ingles-entendimento` substitui exemplos transplantados entre assuntos por situações próprias em 17 capítulos de Inglês e 12 de Entendimento de Texto. Taxonomy e Textualidade usam seus instrumentos específicos; passagens originais, pistas, relações e achados manuscritos acompanham as mudanças de estado.

Os 29 registros aprofundados passam a revisão 2: 145 seções, práticas/pegadinhas e recuperação alinhadas. Os outros 583 registros permaneceram iguais à base; IDs publicados, chaves de progresso e tentativas anteriores foram preservados. Revisões independentes corrigiram nove ambiguidades editoriais e três desencontros entre exemplo, seta e documento. A composição móvel e a grade do desktop foram corrigidas durante a conferência das capturas.

[Registro técnico, resultados por estado e galeria](visual-integral-2026-10-04/entrega-b/README.md): Chromium cobre 29 IDs em 12 configurações, 1.944 estados SVG e 58 aberturas de Testar/Reconstruir, sem envio de respostas. 75 capturas estáticas foram inspecionadas e 31 acompanham a proposta. Duas interrupções de execução — carregamento inicial e medição durante transição — foram registradas e as configurações completas passaram na repetição, sem ampliação do limite de tempo.

A fila validada desta proposta contém 93 achados tratados, 205 pendentes, 315 mecanismos preservados e 148 resumos ainda sem revisão 2. Não há promoção de aprovação editorial integral. Conferir a integração desta branch e o delta de main antes de repetir LG2; o próximo escopo planejado é C/H1, com 24 comparações de Filosofia/Sociologia e oito aprofundamentos sociológicos. Publicação automática autorizada; merge permanece com a responsável.

Validação geral final de B: TypeScript/build passaram; 870 testes Node + 1.001 Vitest (1.871) passaram, com 154 arquivos de interface e sem falhas. Matrizes de cobertura/qualidade sincronizadas; estados de aprovação preservados. Testes, build e navegador foram executados em sequência.

## Entrega C — 24 pranchas de Filosofia/Sociologia — 04/10/2026

Base conferida: `120c7b9dfb6d22e71bf3d499b60319ae57c81d62`, com a Entrega B integrada em #256 e a correção de contraste de #257 preservada. A branch `fix/entrega-c-filosofia-sociologia` refaz 16 pranchas filosóficas e oito sociológicas com situações, objetos e relações próprios. A seleção destaca uma leitura sem apagar as demais; teclado, rolagem interna e movimento reduzido foram verificados.

Os oito resumos sociológicos passam à revisão 2, com 40 seções aprofundadas, seis pegadinhas e dois problemas resolvidos por capítulo. Duas falhas concretas em Kant e Rawls passam à revisão 3; os outros 602 registros editoriais permanecem iguais à base. IDs, chaves de progresso e tentativas anteriores estão preservados.

[Registro técnico e galeria](visual-integral-2026-10-04/entrega-c/README.md): Chromium passou nas 12 configurações de largura/tema/movimento, com 1.656 estados SVG e 48 aberturas de Testar/Reconstruir. A repetição final de mais-valia passou em 72 estados adicionais. Foram inspecionadas 96 capturas finais; 36 acompanham a proposta. TypeScript/build passaram e a suíte geral final passou em 885 testes Node + 1.031 Vitest (1.916), sem falhas.

A fila validada contém 117 achados tratados, 181 pendentes e 315 mecanismos preservados, em dez lotes restantes. Restam 140 aprofundamentos editoriais; 470 registros estão na revisão 2 e dois na revisão 3. A aprovação editorial formal permanece aberta. Conferir a integração desta proposta e o delta de main antes de repetir H1; os próximos lotes estão no plano ampliado, começando por F2/F3. Publicação automática autorizada; merge permanece com a responsável.

## Entrega D — checkpoint retomado e validado (5 de outubro de 2026 UTC)

O checkpoint `f3e519df` foi retomado no PR #259, branch `fix/entrega-d-fisica-f2-f3`, base main `7d169534`. Os 21 capítulos F2/F3 estão validados nesta proposta: [resultado e evidências](visual-integral-2026-10-04/entrega-d/README.md). Foram corrigidos contenção móvel, coluna desktop, mola comprimida, colisões e fonte em 360 px. TypeScript, build, 1.943 testes gerais e matrizes visual/qualidade passaram. Navegador: 14 configurações, 1.868 estados SVG, 192 idas e voltas por teclado e 63 capturas definitivas.

A fila da branch contém 138 tratados, 160 pendentes e 315 preservados, mantendo 613 IDs e oito lotes: LG1, LG3, H2, H3, R1, R2, R3 e A1. Permanecem 140 resumos pendentes, 470 revisões 2 e duas revisões 3; nenhuma promoção editorial formal. Conferir a integração do PR e o delta de main antes de continuar; não repetir F2/F3. Manter o PR rascunho e nenhum merge automático. Capturas preliminares permanecem como histórico; as definitivas estão na galeria.

## 05/10 — Entrega E: Gramática após integração de #259

O PR #259 foi integrado em `abba293c6c671f7b21bf1b34d536300fa28ac9d3`. A branch `fix/entrega-e-gramatica` continua por LG1: [26 pranchas e seus 26 textos](visual-integral-2026-10-05/entrega-e/README.md), com 130 seções rev2 e recalls alinhados. As relações centrais incluem referência, escopo, norma/adequação, predicação, regência, crase e transformações de estrutura. As decisões e o refinamento menor de movimento ficam no registro de revisão; a aprovação editorial formal permanece aberta.

Chromium: 14 configurações, 2.770 estados, 2.520 estados SVG e 78 capturas. Três configurações com falha de prazo do runner foram repetidas integralmente em execução serial; a evidência usa a última configuração aprovada e conserva a rodada inicial. A situação final de TypeScript, build, matrizes e suíte geral está no README da entrega.

Fila validada da proposta: 164 tratados, 134 pendentes e 315 preservados, mantendo 613 IDs e sete lotes. Restam 114 aprofundamentos editoriais; 496 registros estão na revisão 2 e dois na revisão 3. O próximo lote é LG3/Literatura (37). Confirmar a integração da Entrega E e o delta de main antes de iniciar, sem repetir Gramática. Publicação em branch/PR autorizada; nenhum merge automático. [Retomada na nuvem](visual-integral-2026-10-05/entrega-e/RETOMADA.md).
