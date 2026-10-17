# Avaliação de IA

Escopo aprovado: sessões privadas, captura voluntária das chamadas de texto nas telas existentes, comparação cega de duas respostas para o mesmo prompt, notas humanas e exportação. O roteamento produtivo não muda. Não há observação contínua do computador.

Acesso restrito a administradores verificados. Toda operação usa o UID autenticado no servidor. Dados ficam em aiEvaluationUsers/{uid}/sessions/{sessionId}/runs/{runId}, fora das regras de escrita do cliente. Uma sessão ativa por conta; até 200 registros por sessão. Encerrar interrompe novas capturas. Excluir bloqueia gravações em andamento e remove os registros. Limites de tamanho são explícitos e truncamento fica sinalizado.

Captura guarda tarefa, tela, entrada validada, prompt efetivo e sua versão por hash, resposta, modelo solicitado e reportado, cache/fallback, consumo, primeira emissão e duração. Falha do histórico não interrompe estudo, mas é informada na resposta e na interface.

Comparações são explícitas, consomem duas chamadas da cota existente, ignoram cache e reutilizam um prompt completo previamente capturado. Candidatos vêm da configuração do servidor, nunca de URLs ou credenciais enviadas pelo navegador. A ordem A/B é aleatória. Identidades só são devolvidas depois de avaliar ambas as respostas e registrar a preferência. Exportações seguem a mesma regra. Resultados parciais e erros são preservados, sem aprovar automaticamente qualidade.

Critérios: correção (correta/parcial/incorreta/não conferida), clareza, cumprimento do pedido e utilidade (1–5), observações, resultado posterior e preferência A/B/empate/nenhuma. Resumo mostra amostra, falhas, cache e médias com denominadores; casos cegos não avaliados não revelam modelos. CSV neutraliza fórmulas.

Interface em /avaliacao-ia: iniciar/encerrar sessão, aviso persistente de captura durante navegação, histórico, avaliação, comparação, relatório por tarefa e exportações JSON/CSV. Dados não são enviados para terceiros pela ferramenta de avaliação; as chamadas continuam pelo gateway configurado.

Validação: isolamento de conta, consentimento, parar/excluir com chamada em andamento, cegamento inclusive nas exportações, validação de notas, comparação sem cache e cobrança de duas chamadas, captura JSON/SSE e falhas, regressões do projeto, tipos, build e tela responsiva.
