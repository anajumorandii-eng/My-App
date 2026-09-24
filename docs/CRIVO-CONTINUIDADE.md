# CRIVO — continuidade operacional

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
