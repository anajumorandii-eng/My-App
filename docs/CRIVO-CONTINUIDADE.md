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

## Limites claros

Este mecanismo preserva o contexto e o estado técnico no repositório e no arquivo de continuidade da conversa. Ele não substitui a conferência do GitHub quando houver mudanças novas, nem permite que uma memória de chat seja automaticamente reescrita a cada push. A fonte canônica é este documento + o instantâneo automático; ambos podem ser consultados diretamente pelo GitHub sem clone.
