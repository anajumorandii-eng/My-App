# Catálogo de Resumos e Painel de Evolução — desenho

## Objetivo

Ampliar os três resumos existentes somente com materiais internos rastreáveis e transformar a tela Evolução em um painel acionável derivado do progresso real de Ana Júlia.

## Fontes aceitas

- `src/data/discursiveQuestions.ts`: questões, respostas-modelo, banca, ano e avisos de reconstrução.
- `src/data/resolutionStrategies.ts`: estratégias e pegadinhas por disciplina e banca.
- `src/data/topicDiscursivePrompts.ts` e `src/data/mockData.ts`: apoio conceitual apenas quando o tópico e o material forem identificáveis.
- Os três resumos atuais e seus identificadores permanecem inalterados.

Nesta entrega entram novos resumos apenas para Química, Matemática e Geografia, porque essas disciplinas têm questão de banca, resposta-modelo e estratégia interna convergentes. Lacunas de outras disciplinas aparecem como ausência, não como texto inventado.

## Catálogo e proveniência

Cada fonte interna passa a declarar um `materialId` resolvível por um inventário tipado. Um validador puro rejeita IDs duplicados, seções/perguntas duplicadas, perguntas sem seção e fontes internas desconhecidas. IDs existentes não mudam. Conteúdo removido continua representado pelo snapshot já persistido.

## Painel

`buildSummaryProgressDashboard` recebe catálogo, progresso normalizado e instante explícito. Ele não lê Firestore nem cria números. Produz:

- contagens correta, parcial, incorreta e pendente;
- progresso de leitura por disciplina;
- desempenho por banca e fase, usando apenas perguntas realmente tentadas;
- dificuldades por primeiro mecanismo ausente;
- reincidência quando uma pergunta acumula duas ou mais tentativas não corretas;
- revisões vencidas, futuras e concluídas (tentativas posteriores à primeira);
- prioridades Fuvest, Atualidades e última sessão;
- links profundos para resumo/pergunta, erro e revisão.

Agrupamentos sem evidência usam `null` e mensagens de dados insuficientes, nunca zero demonstrativo. Progresso local também é dado real; a interface identifica se está somente no dispositivo. Falha de sincronização mantém o dado local com alerta.

## Interface

A tela `Evolucao` preserva o domínio já existente, mas coloca primeiro um painel de resumos com filtros por disciplina, banca e fase. Cartões e linhas são links ou botões acessíveis por teclado. Há estados de carregamento, erro, primeiro acesso, filtro vazio, dados parciais e referência removida. Visualizações são listas e barras textuais simples, sempre associadas a uma ação.

## Compatibilidade

A normalização atual continua aceitando registros sem `outcome`, `reviews` ou metadados. Novos campos de catálogo são opcionais quando necessário para ler dados anteriores. Histórico não é apagado nem regravado destrutivamente.

## TDD e validação

Testes de domínio cobrem inventário, IDs, fontes, agregações, fases, reincidência, registros antigos e removidos. Testing Library cobre carregamento, erro, vazio, filtros, navegação, teclado e nomes acessíveis. Cada comportamento será observado vermelho antes da implementação, seguido de verde e refatoração registrada no relatório.
