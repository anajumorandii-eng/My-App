# Cronômetro das questões objetivas

O cronômetro aparece junto ao enunciado, inclusive no celular, e começa quando uma questão válida é exibida. Marcar uma alternativa conclui a tentativa e congela o tempo antes da explicação ou do diagnóstico. A próxima questão, a repetição da mesma questão e o reinício do treino começam uma nova contagem. Questões anuladas ficam disponíveis para consulta, sem cronometragem nem tentativa.

A estudante pode pausar e retomar. A aba oculta também pausa automaticamente, e voltar à aba não desfaz uma pausa manual. A duração conta apenas os intervalos ativos, medidos com `performance.now()`, sem depender do número de disparos de `setInterval`. O envio captura o relógio naquele instante. Cliques repetidos não concluem a mesma contagem duas vezes. O leitor de tela não anuncia cada segundo.

## Tempo esperado

A referência inicial é uma **meta de treino**, declarada na interface: 2 minutos para dificuldade fácil, 3 para média e 5 para difícil. Não é limite oficial da banca nem média observada no histórico. A meta pode ser ajustada antes da resposta e a escolha manual vale nas próximas questões do treino. Ultrapassá-la não bloqueia a resolução nem modifica o acerto ou o domínio. A conclusão informa a diferença acima ou abaixo da meta.

O painel **Este treino** mostra a média do tempo ativo das respostas concluídas nesta sessão. Ela não mistura leitura da resolução, questões não concluídas ou tentativas antigas sem duração.

## Registro e compatibilidade

As tentativas salvas da conta recebem `startedAt`, `completedAt`, `durationSeconds` e `expectedDurationSeconds`, junto aos campos existentes de acerto, questão e tópico. Os horários identificam início e fim; a duração desconta pausas. Todos os novos campos são opcionais no contrato, preservando tentativas antigas. Visitantes têm contagem e média nesta sessão, conforme o fluxo existente de questões; a gravação de tentativas continua exigindo conta.

Trocar de conta limpa o treino e a meta manual. Sair da tela encerra os listeners e o intervalo. Uma resolução abandonada ou recarregada não é salva como tentativa concluída. O treino discursivo de segunda fase mantém seu fluxo próprio.

## Validação

- Testes do relógio: duração real, conclusão única, pausas manuais, aba oculta, retorno à aba respeitando a pausa manual, repetição, troca de questão/conta e consulta sem cronometragem.
- Testes da tela: gravação da duração e da meta na tentativa; congelamento durante o feedback; reinício ao repetir; meta ultrapassada sem bloqueio.
- Chromium na tela real de questões, usando apenas questões e adaptadores de conta/persistência sintéticos: avanço do relógio, pausa, retomada, meta ajustada, dados enviados ao adaptador, congelamento, próxima questão e ausência de rolagem horizontal.
- Inspeção visual em [computador](desktop.png), [tablet](tablet.png) e [celular](mobile.png).

Não houve escrita em uma conta real do serviço remoto nesta validação. As capturas não contêm dados de estudantes.

Verificações finais: `npm run lint` sem erros; `npm test -- -- --maxWorkers=2` com 1.324 testes Node aprovados (um ignorado) e 3.400 testes de interface aprovados em 263 arquivos; `npm run build` concluído. Permanecem os avisos de bundles grandes do projeto e os avisos de `scrollTo` no ambiente simulado de testes, sem falhas.
