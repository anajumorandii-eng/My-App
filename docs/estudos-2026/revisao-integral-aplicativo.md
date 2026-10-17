# Revisão transversal do aplicativo — 17/10/2026

## Escopo e critérios

A revisão percorre as rotas de planejamento, agenda, reta final, recuperação, sessão, questões, revisão, flashcards, segunda fase, redação, caderno de erros, resumos, visual, podcast, tutor, laboratório, estratégias, evolução, prioridades, obras, conexões, perfil e administração. Inclui um dossiê publicado, avaliação de IA e recuperação de endereço inexistente.

O critério de melhoria é preservar o raciocínio do estudante e sua continuidade entre atividades. Abrir uma página sem erro não comprova qualidade pedagógica; os achados abaixo foram confirmados por código, testes de comportamento e/ou interações no navegador. Os testes de navegação usam estados públicos/demonstração, não as credenciais pessoais da estudante.

## Problemas tratados

| Área | Problema confirmado | Resultado |
| --- | --- | --- |
| Tutor | Cada mensagem era enviada isoladamente, sem as perguntas e respostas anteriores | Histórico recente validado acompanha a solicitação; o tutor pede hipóteses e justificativas e faz uma pergunta por vez |
| Tutor | Conversas, explicações, respostas e correções se perdiam ao sair ou mudar de modo | Registros locais por conta, tópico, capítulo e modo; questões geradas também separam banca e tipo |
| Tutor | Conteúdo de um tópico podia continuar visível depois da troca | Painéis são isolados por contexto; atualizações tardias de um contexto abandonado não substituem o atual |
| Resumos | Resposta ainda não enviada desaparecia ao sair | Rascunhos de recuperação persistidos; registro reflexivo e caminhos para o mesmo capítulo em outras atividades |
| Resumos | A apresentação destacava Fuvest independentemente das outras bancas | Cartões exibem as bancas e fases cadastradas; prioridade é identificada como editorial |
| Redação | Era necessário lembrar de salvar manualmente o texto atual | Rascunho, planejamento e reescrita são salvos automaticamente; o botão manual cria versões; correções permanecem disponíveis |
| Segunda fase | Resposta escrita se perdia, falhas de IA ficavam apenas no console e “Salvo” aparecia antes da confirmação | Rascunho por questão, erro visível e nova tentativa; avaliação aguarda o servidor; demonstração não afirma persistência remota |
| Revisão ativa | Recuperação escrita desaparecia ao sair | Texto recuperado ao retomar o mesmo recorte, sem transformar rascunho em revisão concluída |
| Laboratório | Exemplos só usavam um “ponto fraco” escolhido automaticamente e não persistiam | Assunto selecionável, exemplos por tema/conta, falha visível e registro antes/durante/depois |
| Sessão | Figuras eram omitidas; banco que chegava depois do plano deixava a atividade vazia | Enunciado usa o componente de texto e figuras originais; primeira carga popula a atividade sem reembaralhar sincronizações posteriores |
| Sessão | Faltava continuidade com os materiais fora do cronômetro | Registro de compreensão e links para o assunto em resumo, visual, tutor, estratégia, podcast e questões |
| Domínio | Autoavaliação de tópico sem registro anterior não criava uma linha | Primeiro registro é criado com incerteza, usando os limites de ganho da autoavaliação existentes |
| Impressão | Textos editáveis podiam ser exportados com o valor inicial e regiões de rolagem cortadas | Exportação fixa os valores atuais, expande conteúdo e retira botões/menus; disponível em tutor, resumo, redação e discursivas |
| Navegação contextual | Questões e Resumos só liam o assunto no primeiro carregamento | Links novos atualizam o recorte mesmo quando a tela já está montada, inclusive na central de revisão |
| Navegação | Endereço inexistente podia deixar uma tela vazia | Página de recuperação com caminhos para Hoje, Resumos e Revisões |
| Acessibilidade | Avisos de Plano, Segunda Fase e etiquetas do Laboratório tinham contraste insuficiente no tema claro | Cores apropriadas por tema; correções do tutor e redação também recebem cores legíveis |

A busca textual e a recuperação da questão original de G6PD permanecem na mesma PR. O teste histórico do banco protege os outros 2.958 registros contra alteração, com a exceção específica documentada e testada para essa questão conferida no original.

## Verificação reproduzível

- `npm run lint`, `npm test` e `npm run build`.
- `scripts/audit-app.mjs`: rotas em 390 e 1366 pixels, temas claro e escuro; erros de execução, largura e verificações automáticas de acessibilidade. Informe `CRIVO_AUDIT_URL` e `CRIVO_AUDIT_OUTPUT` para uma prévia local.
- `scripts/audit-study-continuity.mjs`: recuperação de mensagem, mudança de modo, tópico/capítulo entre atividades, resposta de resumo, autosave de redação, resposta discursiva, assunto no laboratório e caminho inexistente. Não envia respostas nem solicita IA.
- Testes controlados cobrem contexto socrático, limites do histórico, separação entre contas/assuntos, retorno tardio, falha de armazenamento e confirmação de gravação.

## Resultado da validação

Suíte completa: 1.141 testes Node e 3.198 testes de interface em 237 arquivos passaram. Os cinco testes focados adicionais de gravação/reconciliação e segunda fase também passaram. TypeScript e build de produção passaram.

## Resultado da varredura estável

31 rotas em 124 configurações de tema/tela: zero erros de execução, zero transbordamentos horizontais e zero violações automáticas de acessibilidade nos estados verificados. O percurso de continuidade passou em 390 e 1366 pixels. Quatro verificações adicionais com explicação/correção simuladas do tutor e redação passaram nos dois temas. A evidência resumida está em `revisao-integral-resultados.json`; isso não constitui certificação geral de acessibilidade.

## Limites

Rascunhos e conversas novos ficam neste navegador, separados por conta; não são sincronizados entre dispositivos. Se o armazenamento falhar, o texto permanece aberto e a interface avisa. Áudios continuam locais, sem transcrição automática. A conversa enviada à IA usa até 12 mensagens e 12 mil caracteres de histórico, com indicação de trechos cortados. Respostas interrompidas e mensagens de falha não integram esse histórico.

Salvar uma reflexão não aumenta o domínio nem conclui uma revisão. A exportação usa a opção de impressão do navegador. Os testes de IA usam provedores controlados, sem certificar fatos de respostas reais. A auditoria de rotas não certifica todos os estados autenticados, todas as operações administrativas ou a revisão editorial de cada questão e capítulo. Achados e cobertura devem ser apresentados com os resultados efetivamente obtidos, sem chamar o aplicativo de perfeito.
