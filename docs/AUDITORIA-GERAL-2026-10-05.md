# Crivo — auditoria de exigências, ferramentas e continuidade

Auditoria solicitada em 05/10/2026 UTC. Base local e `origin/main` confirmadas em
`d7e895ba7853ffcb5e53adce1e16db7cade6326a`; alteração funcional mais recente:
integração da Entrega E/Gramática na PR #260, commit
`523eb2c2c75bdeedf313bb70d220840054ab775a`. O checkout estava sem alterações.

## Resultado e escopo

A continuidade anterior está integrada e a fila é coerente. Os próximos
trabalhos editoriais são Literatura, Humanas e Redação. A auditoria confirmou
dois problemas gerais que receberam prioridade: cache de Resumos misturado
entre contas e contraste insuficiente em controles/textos. Esta proposta
corrige esses problemas, atualiza instruções desatualizadas e deixa um runner
reproduzível de auditoria pública. Não altera o corpus nem promove aprovação
editorial de capítulos.

Foram confrontados código, rotas, scripts, dependências, workflows, instruções,
referências aprovadas, contratos pedagógicos, fila por ID, inventários e
evidências de entregas. O navegador percorreu as 28 rotas públicas do mapa,
em 390/1366 px, claro/escuro e movimento reduzido: 112 configurações. A abertura
de uma rota não certifica todos os estados, atividades ou operações dela.
O detalhe `/obras/:workSlug`, com catálogo autenticado, permanece separado.

As exigências recuperadas são as documentadas no repositório e nesta conversa.
Conversas de outras contas não estão acessíveis aqui; não é possível afirmar
que o repositório contém toda instrução que só tenha existido naquele histórico.

## Inventário reconciliado

| Item | Estado confirmado |
| --- | --- |
| Catálogo interativo | 613 IDs |
| Resumos profundos | 612 registros, todos com cinco seções |
| Revisões editoriais | 496 em revisão 2; dois em revisão 3; 114 em revisão 1 |
| Aprofundamentos restantes | Literatura 37, Redação 58, Sociologia 19 |
| Representações primárias | 8 experimentos, 43 pranchas, 331 instrumentos, 231 cenas |
| Lacunas no resolvedor | Zero; presença não prova fidelidade/qualidade |
| Fila visual | 164 achados tratados, 134 pendentes, 315 mecanismos preservados |
| Qualidade formal | 532 não revisados, 81 em validação, zero aprovações registradas |
| Questões locais | 2.887 |
| Integridade estrutural do banco | Zero IDs duplicados, enunciados/comentários vazios ou gabaritos sem alternativa correspondente |
| Fuvest 2025 | 90 enunciados recuperados; 88 alternativas textuais; 60/69 gráficas |
| Skills versionadas | 36; nenhuma ausente; cópias de SKILL.md iguais nos dois diretórios |
| Dependências | `npm audit`: zero vulnerabilidades conhecidas nesta execução |

A validação `node scripts/validar-fila-visual.mjs` confirmou os 613 IDs,
as contagens, vínculos editoriais, arquivos e evidências. A Entrega E não deve
ser repetida. As PRs abertas #246, #234 e #222 são trabalhos independentes;
nenhuma delas foi integrada por esta rodada.

Na leitura remota, o status Vercel do commit funcional acima retornou sucesso.
O serviço público Cloud Run respondeu HTTP 200 em `/api/health`, com
`status: ok` e OAuth configurado. Isso confirma disponibilidade desse endpoint,
sem comprovar login completo ou que a revisão Cloud Run corresponda ao SHA
auditado; esse health check não informa o commit publicado.

## Exigências e evidências

| Exigência recuperada | Conferência e situação |
| --- | --- |
| Produto para vestibulares de Medicina; interface em português; nome CRIVO | Rotas, catálogos e contratos conferidos. Nomes antigos em documentos históricos não são identidade atual. |
| Diagnóstico → plano viável → prática → evidência → erro/revisão/recuperação | Mapa funcional e módulos presentes; suíte geral cobre regras. Uso completo com dados reais segue pendente. |
| Leitura/tempo de sessão não equivalem automaticamente a domínio | Contrato de evidências e regras de projeção preservados; heurísticas não são prova científica de eficácia. |
| Preservar tentativas, progresso e IDs legados | Sem reset/migração remota. As seis chaves legadas permanecem. Correção do cache por UID descrita abaixo. |
| Conta nova sem domínio demonstrativo persistido | Correção anterior continua em `userData`/`useUserMastery`; testes de isolamento e carregamento presentes. |
| Resumo aprofundado, cinco seções, mecanismo completo, armadilhas corrigidas e dois problemas | 498 têm revisão editorial; 114 ainda aguardam os lotes. O marcador de revisão não substitui releitura editorial. |
| Representação específica por matéria/tópico; não preencher com arte alheia | Todos os IDs resolvem um artefato, mas 134 achados continuam na fila. A antiga restrição a Ciências foi removida das instruções vigentes. |
| Explorar/Testar/Reconstruir com a mesma evidência de Resumos/Caderno | Resolvedor, `visualStudy`, `applySummaryAttempt` e contratos conferidos; não foi criado histórico paralelo. |
| Movimento explica mecanismo; estático/reduzido conserva informação | `motion/react`, hooks de visibilidade/redução e testes presentes. A matriz atual usa redução; interações normais são verificadas separadamente nas telas afetadas. |
| Papel/caderno integrado, cores e identidade autoral | Referências e CSS confrontados. Controles passam a usar pares de tokens semânticos, preservando a cor decorativa da matéria. |
| Celular/tablet/desktop sem rolagem horizontal; nomes, foco e teclado | Base: 112 aberturas sem overflow/exceções; 44 combinações distintas de contraste reproduzidas. Validação final e limites abaixo. |
| IA como hipótese, com relato da estudante e confirmação explícita | Contratos, prompts, parsers e testes presentes; chamadas reais aos provedores não foram realizadas. |
| Podcast personalizado, vozes distintas, fontes, cancelamento e biblioteca por UID | Implementação e testes presentes; não foi gerado áudio pago nem certificado o som real nesta auditoria. |
| Calendar/Drive e dados privados no servidor | Firebase Auth, OAuth e regras Firestore conferidos; login real/consentimento externo continuam sem certificação nesta rodada. |
| Repositório público sem PDFs/textos/pixels de marcas d'água pessoais | `.gitignore`, OCR obrigatório e pipeline conservador presentes. Não houve ingestão de material/licença nem nova imagem de apostila. Capturas escolhidas usam demonstração. |
| Branch, PR automática e checks antes de push; sem merge automático | Base remota/PRs conferidas antes da edição; publicação desta proposta segue esse fluxo. |
| Continuidade por delta, sem reiniciar tarefas concluídas | Gramática reconciliada como integrada; números/fontes atuais corrigidos. Auditoria nova foi explicitamente solicitada. |

## Ferramentas e arquitetura

| Ferramenta/camada | Uso existente e o que foi verificado |
| --- | --- |
| React 19, TypeScript, Vite, Tailwind, Express/esbuild | Cliente com rotas lazy e servidor separado. `lint` é TypeScript, sem ESLint. Build de produção conferida. |
| Firebase Auth/Firestore/Admin | Dados sob `users/{uid}`; catálogos compartilhados de leitura autenticada; escrita administrativa no servidor. Admin exige e-mail verificado e token com verificação de revogação. |
| IA do app | 13 tarefas em tipos, rotas, validação e prompts; camada neutra admite OmniRoute e Gemini. Credenciais/configuração de produção não foram inferidas a partir de arquivos de exemplo. |
| Áudio | Google Cloud Text-to-Speech com identidade do serviço; provedor alternativo, segmentação/WAV/cache/cancelamento. Integração real depende do ambiente publicado. |
| OAuth/Calendar/Drive | Consentimento, tokens de servidor e endpoints protegidos; grants/states sem acesso direto do cliente nas regras. |
| Web Push | VAPID, assinaturas por conta e lembretes protegidos por segredo de cron; entrega real não foi exercitada. |
| Motion, SVG, Canvas/Three.js | Cenas autorais e laboratórios manipuláveis; redução de movimento, visibilidade e shaders já têm correções. Performance física no iPad permanece pendente. |
| node:test, Vitest/jsdom, Testing Library | Testes de regras, servidor, hooks e interface. Firestore inerte nos testes de UI, sem usar histórico real. |
| Playwright/Chromium e axe-core | Auditoria nesta rodada em `/usr/bin/chromium`, sem instalação de navegador. Relatórios geométricos, contraste, erros/rede e capturas. |
| Git/GitHub Actions/gh | Fetch, histórico, PRs e CI consultados. CI da integração #260 estava aprovado. Node 22 é a versão dos workflows; ambiente local usa Node 24.19.0/npm 11.9.0. |
| Scripts de conteúdo e auditoria | Importadores conservadores, hash obrigatório Fuvest, OCR de rodapé, aprofundamento versionado, matrizes e fila por ID. Nenhum importador de conteúdo foi reexecutado. |
| Skills e notebooks | 36 skills do lockfile presentes e cópias equivalentes; disponibilidade não significa uso de todas nesta sessão. Notebooks são fontes de pesquisa, com lacunas científicas explícitas; importação externa não foi comprovada. |

Na auditoria atual foram efetivamente usados shell, Git/gh, scripts locais,
Python para inventários/documentação, testes e Playwright/axe. Não houve uso de
ferramentas de geração de imagens, alteração de serviços externos, migração de
dados reais ou instalação de plugins. A skill de revisão por diff foi lida
para verificar aplicabilidade; esta auditoria de estado não foi executada como
revisão de uma PR por aquela skill.

## Correções desta proposta

### Resumos: fronteira entre contas

Antes, `useSummaryProgress` lia `juju_summary_progress_v1` para qualquer UID,
mesclava com o remoto e escrevia de volta na mesma chave. Uma conta nova podia
mostrar capítulos de outra conta e enviar aquele mapa para seu próprio
Firestore. Durante a troca, ações e falhas antigas também podiam atingir a
interface atual. `isCloudSynced` significava apenas que havia login.

Agora, cada UID tem chave adicional `juju_summary_progress_v1:<uid>`. A chave
antiga continua disponível no estudo sem login, intacta: sua origem não é
atribuída automaticamente a uma conta. Dados remotos já existentes não são
limpos nem recalculados. A troca esconde o estado anterior imediatamente;
leituras, ações e falhas antigas não publicam na sessão atual, inclusive no
ciclo A→B→A. Ações são bloqueadas até o carregamento terminar. Falha de leitura
permite cache local do próprio UID, mas impede sobrescrever um mapa remoto
ainda desconhecido. Escritas solicitadas são seriadas no UID original e não
ocorrem dentro de um atualizador React, evitando duplicação pelo modo estrito.
A indicação de sincronização depende de leitura confirmada, ausência de erro
e conclusão das gravações.

Oito regressões cobrem chave legada, troca/retorno/logout, ações/leituras
antigas, falhas, carregamento e gravações seriadas no modo estrito. As seis
regressões iniciais falharam na base e passaram após a correção.

Limite: a chave legada sem UID permanece como cópia recuperável, não como
progresso automaticamente atribuído ao login. Conciliação de alterações
contemporâneas em vários dispositivos não foi redesenhada nesta entrega;
o armazenamento remoto ainda recebe snapshots completos.

### Contraste

A base reproduziu **94 ocorrências em 44 combinações distintas de
rota/regra/alvo**, em 11 rotas. Principais causas: texto creme sobre tinta
ciano a 4,09:1; texto escuro sobre acento cobre a 3,74:1; texto branco no botão
Visual a 4,41:1 no claro e 2,19:1 no escuro; cinza auxiliar a 3,67:1 na Agenda
e Administração; branco sobre verde administrativo a 3,65:1.

Os controles preenchidos passam a usar `--action-primary`/`--text-inverse`
em vez do acento decorativo `--primary` e de uma tinta constante. A tinta de
ação do Caderno foi escurecida sem mudar a tinta decorativa da matéria. O
botão de diagnóstico Visual segue o mesmo par semântico. Agenda/Administração
usam cinza mais legível por tema; ações administrativas deixam o verde fixo.

### Instruções e continuidade

`CLAUDE.md` foi reconciliado com a integração #260: números editoriais/visuais,
escopo de todas as matérias, caminho do Chromium, carregamento de fontes por
ambiente e permissões reais do hook de instalação. O mapa funcional passa a
incluir `/visual`. O notebook de Assessment deixa de apresentar os enunciados
Fuvest 2025 como lacuna ainda não tratada. Os registros históricos permanecem
como histórico, sem redefinir a fila atual.

## Validação e evidências

Base: `npm run lint`, `npm run build` e `npm test` passaram; 922 testes Node +
1.114 Vitest = **2.036 testes**, zero falhas. A build continua avisando sobre
chunks grandes. O chunk inicial tem 68,82 kB (23,69 kB gzip); Visual tem
2.577,90 kB (724,78 kB gzip), e o corpus profundo 3.717,97 kB
(1.101,83 kB gzip). Isso mede artefatos, não tempo de uso no iPad.

Runner reproduzível: `scripts/audit-app.mjs`. Espera o conteúdo da rota, não
ociosidade de rede, pois Sessão pode manter atividade de rede. A tentativa
inicial com `networkidle` foi interrompida por essa condição e não é a matriz
final. Resultados de base em `tests/e2e/.artifacts/audit-app/baseline/`.
O runner não autentica nem envia respostas/formulários.

Validação final: TypeScript, build e `npm test` passaram, com **922 testes
Node + 1.122 Vitest = 2.044 testes**, em 170 arquivos de interface. A última
execução usou dois workers do Vitest, sem reduzir arquivos/casos. As matrizes
visual (13 testes) e qualidade (quatro) passaram sem delta; a fila permaneceu
íntegra. Não houve alteração editorial ou de registro de artefatos.

A varredura de produção concluiu **168 configurações**: as 28 rotas em
390/834/1366 px, claro/escuro e movimento reduzido. Zero violações automáticas,
exceções de página, requisições fracassadas ou overflow. O último ajuste foi de
hover; a build foi refeita e os estados/interações foram revalidados depois,
sem repetir os estados de repouso que esse ajuste não modifica.

O runner de interações concluiu **oito configurações**: 360/834 px,
claro/escuro, movimento normal/reduzido e efeitos completos. Verificou cinco
fundos, limites do painel, Esc/foco, contenção e retorno de foco da busca,
resultado por “mitose” e persistência local de Importante após recarregar.
A matriz de cores mediu **180 pares** de seis paletas × cinco fundos × três
estados de ação × dois temas, com mínimo **4,69:1**. Largura/movimento não
mudam esses tokens; o mesmo cálculo não foi duplicado nos oito cenários.

Tentativas anteriores de interação esgotaram o prazo ao abrir Personalizar
durante a inicialização; o runner final aguarda load e o conteúdo do Hoje,
com prazo de 60 segundos. Os mesmos critérios e efeitos completos foram
mantidos. As tentativas intermediárias também reproduziram o tom Solar claro,
a regra específica do CTA do Hoje e o hover Neon escuro abaixo de 4,5:1;
foram corrigidos antes da matriz final. Não são apresentados como aprovados.

Capturas do Hoje/Agenda antes e depois e Resumos foram inspecionadas. Inter,
Kalam, Newsreader e Space Grotesk têm FontFace carregados nos cenários de
interação; isso não certifica todas as variantes/pesos. Evidências públicas
selecionadas em [auditoria-geral-2026-10-05](auditoria-geral-2026-10-05/), com
manifesto, JSON de rotas/interações e seis capturas. Os arquivos completos de
trabalho continuam no diretório ignorado dos runners.

Axe registrou 9.527 avaliações não conclusivas de contraste, com duplicação
entre configurações e fundos compostos. Elas não são 9.527 bugs confirmados;
exigem conferência humana quando o estado for revisado. Zero violações
automáticas não significa certificação integral de acessibilidade.

Publicação preparada na branch `fix/auditoria-continuidade-acessibilidade`,
com PR automática para revisão; nenhum merge automático.

## Continuidade após esta entrega

1. Integrar esta proposta pelo fluxo de revisão da responsável; nenhum merge
   automático. Reconciliar o novo delta antes da próxima branch.
2. LG3/Literatura: 37 capítulos e 37 aprofundamentos, com operações de leitura
   em exemplos autorais. Fichas descritivas isoladas não encerram o requisito.
3. H2/H3: 38 achados e 19 textos de Sociologia; A1/COP30 junto a Humanas, com
   fontes datadas. Filosofia não requer reescrita editorial indiscriminada.
4. R1/R2/R3: 58 capítulos/textos; conter Competências no celular e conferir
   referências, tese, consequência e intervenção próprias.
5. Conferir Safari/iPad físico, performance, login/sincronização reais,
   diagnóstico/Testar/Reconstruir e serviços externos em cenário autorizado.
   Esta rodada não envia respostas na conta real nem gera custo de IA/voz.
6. Qualidade editorial de questões e pesquisa científica continuam frentes
   próprias. Não reabrir Fuvest, Gramática, Física nem História/Geografia como
   se as correções integradas ainda fossem inéditas.

A fila de capítulos permanece 134 e os aprofundamentos 114: as correções
gerais desta proposta não são capítulos editoriais concluídos.
