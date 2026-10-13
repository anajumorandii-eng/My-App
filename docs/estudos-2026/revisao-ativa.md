# Revisão ativa e questões reais

A expansão verificada reúne 72 questões da primeira fase Unicamp 2026, versão Q/X, com prova e gabarito oficiais. O banco completo tem 2.959 itens, preservando os IDs anteriores. O caderno de 99 páginas está em `/real-exams/unicamp-2026.pdf`; fontes e validações estão em `fontes-expansao-questoes.md`.

Depois de qualquer alternativa marcada, Questões apresenta a alternativa correta e seu comentário. Acertar não oculta a explicação. A resolução complementar por IA continua opcional e não substitui as páginas originais das questões visuais.

Em Revisões, escolha matéria, banca e capítulo e reserve 15, 30 ou 45 minutos. A fila recomenda até um tópico por 15 minutos. Cada treino usa:

1. Resposta escrita sem consulta, antes de revelar o modelo.
2. Comparação com a resposta-modelo e marcação dos critérios que já estavam na resposta original.
3. Aplicação em uma questão do mesmo capítulo, respeitando a banca escolhida e priorizando questões reais.
4. Explicação do gabarito no acerto e no erro; indicação do que reconstruir ou transferir.
5. Registro confirmado e ajuste do intervalo pelo mecanismo de repetição espaçada existente.

Sem exercício de recuperação, o recorte não pode ser registrado. Sem questão de aplicação compatível, a limitação é explícita e o resultado é apenas de recuperação, sem nota forte. Critérios ausentes ou erro na aplicação impedem nota forte; o erro recebe resultado fraco. A comparação dos critérios é autoavaliação, não correção automática de texto. A recomendação de duração é uma estimativa, não um cronômetro nem uma promessa de completar todo o conteúdo.

A sessão fixa sua questão ao iniciar. Atualizações remotas do banco não trocam o exercício durante a tentativa. Falha de gravação preserva a resposta e permite tentar novamente. Resumos agendados e revisitas de erros continuam integrados à página.

## Adicionar revisão

Na aba Revisões, use **Adicionar revisão**, escolha matéria, tópico, capítulo opcional, banca opcional e data, e pressione **Salvar revisão**. O formulário lista capítulos que já dispõem de recuperação ativa. A data considera São Paulo; agendamentos novos começam hoje ou em uma data futura. Um recorte idêntico na mesma data não é adicionado novamente.

As revisões manuais aparecem em ordem de data, com **Abrir revisão** para iniciar o treino. Agendar não conta como revisão feita nem altera domínio. Na conta conectada, os agendamentos ficam no Firestore privado da conta. A conclusão grava o resultado de domínio e o status da revisão na mesma transação, uma única vez por ID, mesmo em uma repetição após falha ou em outra aba. Sem login, os agendamentos ficam somente neste navegador, isolados dos dados da conta; o progresso do treino permanece em demonstração.
