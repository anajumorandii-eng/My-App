# Avaliação de IA no CRIVO

## Uso

1. Entre com uma conta verificada presente em `ADMIN_EMAILS` e abra `/avaliacao-ia` no menu Administrar.
2. Dê um nome à sessão e confirme a gravação. Nada é capturado antes disso.
3. Use as telas habituais. O aviso de gravação permanece visível; ele permite encerrar a sessão.
4. Volte à avaliação e atualize o histórico. Leia as entradas e respostas, confira gabarito/rubrica e dê notas.
5. Para uma comparação, escolha um registro concluído e dois candidatos. Duas novas gerações usam exatamente o prompt salvo, sem cache. As duas chamadas são debitadas da cota diária; tentativas de reserva podem consumir cota mesmo se uma etapa posterior falhar.
6. Avalie A e B e registre preferência, empate ou nenhuma. Somente então o servidor revela os modelos. A avaliação inicial é imutável para preservar a primeira escolha; o resultado posterior no estudo pode ser atualizado.
7. Exporte JSON/CSV ou exclua a sessão. Exportações também ocultam identidades de comparações ainda não avaliadas. JSON é a fonte completa; CSV facilita análise em planilhas.

## Configuração

Não muda `AI_PROVIDER`, o endereço do gateway, as credenciais ou a seleção de modelos do estudo. Quando existem dois modelos distintos nas variáveis `AI_DEEP_MODEL` e `AI_FAST_MODEL`, eles formam o catálogo inicial Principal/Rápido. Comparações usam exclusivamente o gateway já configurado no servidor.

Para cadastrar outros candidatos, configure `AI_EVALUATION_MODELS` como um array JSON com 2–8 objetos. Cada objeto contém **somente** `id`, `label` e `model`; IDs e modelos devem ser distintos. `model` é o identificador exato retornado pelo gateway após conectar a conta desejada. Não há identificadores de modelos nem credenciais fixados no código desta funcionalidade. Não é permitido cadastrar URLs, chaves ou cabeçalhos pelo navegador. Configuração inválida desabilita comparações, mantendo captura e estudo disponíveis.

O backend precisa ter acesso ao Firestore pela identidade do Cloud Run, como já ocorre com quotas e métricas. Não é preciso abrir regras de leitura/escrita do cliente: `aiEvaluationUsers` fica na raiz e não casa com as permissões de `users/{uid}`. As rotas usam autenticação administrativa com checagem de revogação, e o UID vem exclusivamente do token verificado.

## Dados e limites

- Uma sessão ativa por conta; no máximo 50 sessões e 200 registros por sessão.
- Captura: tarefa, caminho da tela, entrada validada, prompt efetivo e hash, texto, modelo solicitado e modelo reportado pelo adaptador, tempos, uso de tokens quando disponível, cache, fallback e falhas. O gateway pode traduzir modelos internamente; o campo reportado não é uma verificação independente do provedor final.
- Primeiro texto é medido apenas em streaming; resposta JSON não inventa esse tempo.
- Prompt limitado a 100.000 bytes; cada resposta, a 64.000 bytes, com truncamento sinalizado. Prompt truncado não pode ser reutilizado em comparação.
- Encerrar impede novas capturas; chamadas iniciadas anteriormente ainda podem concluir seus registros. Excluir marca a sessão antes da remoção, impedindo recriação por respostas em andamento.
- A espera por cada operação de captura é limitada a dois segundos; uma gravação que excedeu esse prazo pode terminar no servidor depois do aviso. Falhas de captura não derrubam o estudo: o cliente recebe um indicador e o aviso de gravação informa o problema. O console não registra o conteúdo do histórico ou credenciais.
- Falhas de comparação são guardadas por candidato. Nenhuma delas é convertida em resposta aprovada.
- Registros sem conclusão por mais de dez minutos aparecem como interrompidos, sem inventar resposta ou tempo.
- O áudio de podcasts, navegação fora do aplicativo e a tela do computador não são gravados. O roteiro de podcast passa pela captura normal de texto.
- Dados só existem no Firestore do projeto e nas exportações explicitamente baixadas; nada é enviado automaticamente a esta conversa. O acompanhamento pelo assistente depende de uma consulta autorizada ou da exportação compartilhada pela usuária.

## Leitura dos resultados

O relatório separa tarefa, tela, tipo de teste e modelo, informa os denominadores e conta prompts distintos para identificar repetições. Respostas em cache e gerações incompletas ficam fora das médias de tempo. A utilidade é uma nota humana, e a contagem de correção exclui os casos não conferidos. Resultados de A/B sem avaliação permanecem agrupados como ocultos. Não há migração, decisão de vencedor ou alteração de roteamento automática.

Comece registrando o caminho atual, depois conecte outros provedores no gateway e configure os candidatos. Use entradas representativas com gabarito ou rubrica. Repetições do mesmo caso são amostras correlacionadas; as contagens do relatório não equivalem a casos independentes nem demonstram superioridade estatística.

## Publicação

Revisar e integrar a PR pelo fluxo do projeto, então publicar uma revisão do Cloud Run pelo processo habitual. O endereço definitivo e os segredos existentes permanecem. Testar em ambiente separado antes de disponibilizar: iniciar sessão, gerar em duas telas, encerrar, conferir ausência de nova captura, avaliar A/B, exportar e excluir. Não fazer merge ou implantação automaticamente.
