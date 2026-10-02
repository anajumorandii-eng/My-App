# Retomada: progresso confiável e carregamento — 01/10/2026

Base: `6cbc94cdb46048d00947db136ae529e1c6ef41af` em `main`, conferida com `origin/main`. Primeira etapa autorizada após a análise geral. Nenhuma migração de dados reais foi executada, nem houve publicação nesta rodada.

## Progresso de contas novas

`getUserMastery` agora cria apenas a base do catálogo: domínio zero, incerteza alta, nenhuma revisão ou erro inventado. Inicialização e reconciliação usam transação, preservando tentativas que outra aba possa gravar enquanto a conta abre. `updateUserMastery` e `recordUserRecoveryEvidence` também deixaram de usar domínio de demonstração quando o documento não existe.

Contas novas não recebem atrasos de exemplo. A leitura de uma fila inexistente devolve uma fila vazia sem gravar um documento que poderia sobrescrever um cadastro concorrente.

Registros existentes são preservados, incluindo estimativas, repetição espaçada, origem e tópicos antigos. A mudança não tenta deduzir retrospectivamente quais dados salvos eram demonstração: isso poderia apagar avaliações reais. Uma conta anteriormente inicializada com exemplos precisa de revisão explícita antes de qualquer limpeza.

## Troca de usuário e falha de leitura

O hook de domínio só considera persistido o progresso carregado para o UID atual. Enquanto a nova conta carrega, o domínio da anterior fica oculto. Respostas atrasadas de leituras antigas são ignoradas, e ações associadas à conta anterior não gravam depois da troca.

Se o progresso não puder ser carregado, a interface recebe estado vazio e mensagem de falha; atualizações de domínio ficam bloqueadas até a leitura ser confirmada. A demonstração continua disponível quando não há ninguém conectado, inclusive para prática local.

Essa proteção é do domínio e da fila de recuperação. Ela não migra rascunhos ou progresso de resumos armazenados no navegador, nem certifica todas as camadas de sincronização do aplicativo.

## Carregamento da busca

O layout global importava `BuscaRapida`, que por sua vez importava o corpus completo dos 613 capítulos. Isso colocava todo o conteúdo editorial no bundle inicial, mesmo com a busca fechada.

O botão foi separado em um componente leve; o modal e o catálogo agora carregam sob demanda quando a estudante abre a busca. Ctrl/⌘K, busca por sinônimos/conteúdo, recentes e navegação para telas continuam disponíveis. Durante o primeiro download, há aviso de carregamento e opção de fechar por botão ou Escape.

| Artefato do build | Antes | Depois |
| --- | ---: | ---: |
| JavaScript principal `index` | 3.801,04 kB | 66,48 kB |
| Principal gzip | 1.122,26 kB | aproximadamente 23,01 kB |
| Corpus completo | embutido na entrada | chunk separado de 3.730,85 kB |

Isso mede o bundle principal, não todo o tráfego inicial ou um tempo de abertura no iPad. O catálogo continua grande e é necessário ao abrir a busca/Resumos/Visual. O Visual continua com chunk de aproximadamente 2,32 MB; otimizações adicionais e medições no aparelho real permanecem pertinentes.

## Verificação

- Testes do repositório: conta nova sem domínio inventado, primeira tentativa alterando só seu tópico, preservação de histórico/repetição espaçada/tópicos legados e backlog novo vazio.
- Testes do hook: sucesso de leitura, falha sem demonstração persistida, troca de contas com resposta atrasada, ação antiga bloqueada e prática local sem login.
- Chromium sobre build de produção: nenhuma requisição de `BuscaRapida` ou `interactiveSummaries` antes de abrir a busca; catálogo carregado ao abrir; “mitose” encontra Divisão Celular; Escape fecha; “caderno” + Enter navega para `/erros`; Hoje a 390 px sem overflow horizontal.
- Celular, tema escuro e movimento reduzido: primeiro download deliberadamente atrasado, foco no botão Fechar busca, Escape fecha mesmo durante o carregamento, reabertura funciona e não há overflow horizontal.
- Evidências locais: `/workspace/crivo-audit/carregamento.json`, `busca-sob-demanda.png` e `hoje-apos-correcao.png`.
- TypeScript aprovado; build aprovado, mantendo os avisos de chunks grandes; suíte completa aprovada: 779 testes Node e 760 testes Vitest (1.539 ao todo). Os testes focados também passaram após o último ajuste de isolamento de conta.

O Firestore real não foi alterado. A integração com dados pessoais ainda precisa ser conferida com a mesma conta Google/Firebase usada pela estudante. Os alertas de dependências identificados na auditoria geral permanecem para uma etapa própria de atualização e compatibilidade.

## Triagem de dependências para a próxima etapa

A árvore instalada confirma dois ramos de gRPC: `1.14.4` via Firebase Admin/Google Cloud e `1.9.16` via Firebase cliente. O Firestore cliente fixa a série `~1.9.0`; portanto uma atualização transitiva comum não elimina o segundo ramo vulnerável. A recomendação automática de regressar o Firebase para 9.14.0 não foi aplicada.

Versões corretivas existentes no registro foram verificadas: `undici` 7.29.1, `@grpc/grpc-js` 1.14.5 e `brace-expansion` 2.1.7. O requisito de Node do patch de Undici é >=20.18.1, compatível com o Node 22 do CI. A etapa de atualização deve incluir regressões de autenticação, Firestore e cliente HTTP, sobretudo ao substituir a dependência gRPC fixada pelo SDK cliente. Nenhuma dependência ou lockfile foi alterado nesta primeira entrega.
