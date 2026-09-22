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
- A validação automatizada está parcialmente quebrada: `npm run visual:matrix` não encontra `visualCoverage.test.ts` devido ao `include` do Vitest; `npm run test:vitest` roda em ambiente Node e 33 testes de interface falham por ausência de jsdom; `npm run test:node` teve 701/702 sucessos na cópia parcial, com o único restante exigindo PDFs LFS não baixados.
- `npm audit --omit=dev` aponta 6 vulnerabilidades moderadas na cadeia de `firebase-admin` / storage / uuid, todas com atualização disponível.
- PRs #183 e #90 continuam abertos, não mescláveis e muito atrás de `main`; não devem ser mesclados diretamente.

## Ordem de retomada

1. Reparar o pipeline de testes (Vitest/jsdom e `visual:matrix`) antes de novas integrações.
2. Reduzir os 52 fallbacks de Redação usando instrumentos por família de decisão, não uma ilustração genérica por capítulo.
3. Cobrir Entendimento de Texto e os 11 capítulos restantes de Física.
4. Revisar peso dos chunks e atualizar a cadeia do Firebase depois que a suíte estiver confiável.

## Limites claros

Este mecanismo preserva o contexto e o estado técnico no repositório e no arquivo de continuidade da conversa. Ele não substitui a conferência do GitHub quando houver mudanças novas, nem permite que uma memória de chat seja automaticamente reescrita a cada push. A fonte canônica é este documento + o instantâneo automático; ambos podem ser consultados diretamente pelo GitHub sem clone.
