# Central de revisão — plano de retomada

Objetivo: concluir o último pedido da sessão compartilhada: reunir os recursos de estudo em Revisões, com roteiro ajustado à agenda e às provas, preservando respostas ao alternar atividades.

Autorização: na sessão original, a usuária autorizou execução automática até finalizar e abertura de PR. Execução nesta sessão pelo agente principal.

Arquitetura: Revisoes é a central; ReviewQueue preserva a fila existente. ReviewWorkspace carrega recursos sob demanda e mantém os visitados montados, com navegação local e parâmetros separados por recurso. reviewSessionPlan calcula apenas janelas futuras, limita véspera e distingue modalidades. Atualizações notificam instâncias de hooks da mesma conta; leituras antigas não substituem edições recentes.

Restrições: português brasileiro, tokens do design system, nenhuma alteração em chaves legadas, nenhuma dependência nova, PR sem merge automático. Não apresentar dados de demonstração como pendências pessoais. Não inferir domínio de uma visita ou marcação manual.

## Tarefas

- [x] Roteiro: teste Node para horário passado, janela parcialmente disponível, dia de prova, véspera, primeira/segunda fase e banca desativada. Implementar em src/lib/reviewSessionPlan.ts.
- [x] Central: teste de interface para alternância mantendo resposta, filtros independentes, navegação de obras, troca de conta e carregamento sob demanda. Implementar ReviewWorkspace e Revisoes, mantendo a fila em ReviewQueue.
- [x] Atualização: testar duas instâncias de hooks e leitura atrasada; implementar comunicação de progresso, erros e agenda sem remontar atividades.
- [x] Conferir lint, suíte completa, build e navegador em celular/iPad; documentar resultados, reexecução do timeout e limites.

Publicação prevista: branch `feat/central-revisao`, PR para `main`, sem merge automático.

## Pontos de revisão

Troca de conta limpa sessões abertas. Link de capítulo não altera outra atividade. Nenhum horário passado entra no roteiro. Sem agenda confirmada, não declarar tempo livre pessoal. Avisos de sincronização devem permanecer visíveis. Obra aberta usa parâmetros corretos de rota.
