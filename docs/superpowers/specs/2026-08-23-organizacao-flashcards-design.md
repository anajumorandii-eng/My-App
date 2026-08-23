# Organização Pedagógica dos Flashcards

## Objetivo

Organizar os flashcards de matérias em uma navegação obrigatória por matéria, tópico, prioridade e tipo de treino antes do início da sessão, preservando IDs, revisões SM-2 e arquivos existentes.

## Escopo

A mudança cobre os flashcards de matérias carregados de `public/flashcards/{materia}.json`. Os flashcards de Obras Obrigatórias permanecem no fluxo literário separado. Não haverá geração ou reescrita de conteúdo por IA, mudança no algoritmo SM-2 nem alteração dos IDs dos cartões.

## Navegação

O fluxo será:

1. Escolher matéria.
2. Escolher tópico específico.
3. Escolher prioridade: Essencial, Alta ou Regular.
4. Escolher tipo de treino: Objetivos, Discursivos, Interpretação, Pegadinhas ou Padrões das bancas.
5. Iniciar a sessão apenas com os cartões vencidos do recorte escolhido.

Na tela do tópico, cada combinação mostrará quantidade total e quantidade vencida. Também haverá a ação “Revisar todos os vencidos deste tópico”, cuja ordenação será Essencial, Alta e Regular. Dentro de uma mesma prioridade, a ordem continuará estável conforme o arquivo de origem.

Cartões sem `topicId` válido aparecerão num grupo explícito “Outros tópicos”, sem serem descartados nem associados por adivinhação.

## Taxonomia

### Prioridade

O tipo `Flashcard` passará a aceitar o campo explícito:

```ts
type FlashcardPriority = 'essencial' | 'alta' | 'regular';
```

Para cartões de `sistema_priorizado`, a prioridade será derivada das tags já existentes `prioridade_essencial`, `prioridade_alta` e `prioridade_regular`.

Para cartões legados de `lembre_se`, a prioridade será `regular`. Essa classificação será marcada como herdada para permitir auditoria, sem alterar o progresso da estudante.

### Tipo de treino

O tipo `Flashcard` passará a aceitar:

```ts
type FlashcardTrainingType =
  | 'objetivos'
  | 'discursivos'
  | 'interpretacao'
  | 'pegadinhas'
  | 'padroes_bancas';
```

Os cartões do `sistema_priorizado` serão classificados por regras determinísticas baseadas nas tags de modelo existentes:

- `objetivos`: conceitos, vocabulário, aplicação direta, decisão sob tempo e eliminação de alternativas;
- `discursivos`: estruturas de resposta da Fuvest 2ª fase, Comvest e Vunesp;
- `interpretacao`: gráficos, tabelas, mapas, textos, fontes e experimentos;
- `pegadinhas`: fronteiras conceituais, distratores, confusões recorrentes e autópsia do erro;
- `padroes_bancas`: padrões específicos de Fuvest, Unicamp, Unesp/Vunesp e ENEM que não sejam prioritariamente discursivos.

Quando uma tag puder corresponder a mais de um tipo, uma tabela central de precedência decidirá o resultado. A precedência será: Discursivos, Interpretação, Pegadinhas, Padrões das bancas e Objetivos. Assim cada cartão pertence a exatamente um tipo e não é duplicado numa sessão.

Cartões `lembre_se` serão classificados inicialmente como `objetivos`. A origem herdada continuará visível nos metadados; nenhuma heurística de IA tentará reinterpretá-los.

## Materialização dos metadados

Será criado um script determinístico de classificação que lê os JSONs existentes e grava `priority`, `trainingType` e `classificationOrigin` em cada cartão. O script deve:

- preservar `id`, `topicId`, conteúdo, mídia, tags e source;
- produzir resultado idempotente;
- falhar de forma explícita diante de prioridade ausente ou conflitante em cartões `sistema_priorizado`;
- gerar um relatório por matéria com totais por tópico, prioridade, tipo e origem;
- nunca remover cartões não classificados.

A materialização é preferida à interpretação em tempo de execução porque permite auditoria, testes de integridade e carregamento simples na interface.

## Componentes e responsabilidades

### Classificador puro

Um módulo puro converterá tags e origem em `priority`, `trainingType` e `classificationOrigin`. Ele não acessará arquivos nem React e será coberto por testes unitários.

### Script de migração estática

Um script aplicará o classificador aos dez arquivos de matérias. Ele poderá ser executado repetidamente sem mudar IDs ou produzir diferenças adicionais.

### Índice da matéria

Após carregar o JSON de uma matéria, uma função pura agrupará os cartões por `topicId`, prioridade e tipo. Os nomes dos tópicos virão de `mockTopics`, mantendo uma única fonte de verdade para o catálogo.

### Interface de seleção

`Flashcards.tsx` passará a controlar quatro estados de seleção: matéria, tópico, prioridade e tipo. A sessão atual só será montada depois das quatro escolhas ou pela ação “todos os vencidos do tópico”. A navegação de retorno preservará o nível anterior, evitando voltar diretamente à grade inicial.

### Sessão e revisões

`FlashcardSession` e `FlashcardReview` continuarão usando `card.id`. Como IDs não mudam, revisões já salvas no Firestore serão reaproveitadas automaticamente. A classificação organiza o acesso, mas não aumenta domínio nem altera agendamento.

## Estados vazios e erros

- Tópico sem cartões vencidos: mostrar “Nenhum cartão vencido neste tópico” e permitir voltar.
- Combinação sem cartões: desabilitar a entrada e mostrar contagem zero.
- Cartão com tópico desconhecido: incluir em “Outros tópicos”.
- Falha ao carregar a matéria: manter a mensagem atual e oferecer retorno à seleção.
- Metadado inválido em produção: não descartar o cartão; colocá-lo em Regular + Objetivos com indicação de fallback, enquanto o teste de integridade impede que novos arquivos inválidos sejam publicados.

## Compatibilidade e migração

A migração é estática, automática, idempotente e não destrutiva. Nenhum documento Firestore precisa ser migrado porque a revisão é indexada somente por `cardId`. Os IDs existentes não serão alterados. Campos novos serão aceitos pelo tipo e materializados nos arquivos, mantendo compatibilidade de leitura com cartões antigos por meio do fallback Regular + Objetivos.

## Testes

Serão adicionados testes para:

- cada tag de prioridade e cada família de tipo;
- precedência quando um cartão tiver tags de mais de uma família;
- fallback `lembre_se` como Regular + Objetivos;
- preservação de IDs e quantidade total após classificação;
- idempotência do script;
- nenhum cartão perdido ou duplicado nos agrupamentos;
- tópico desconhecido em “Outros tópicos”;
- ordenação Essencial, Alta e Regular;
- filtragem de vencidos sem alterar SM-2;
- regressão da navegação Matéria → Tópico → Prioridade → Tipo → Sessão.

A entrega será validada com `npm test`, `npm run lint`, `npm run build` e auditoria do diff por um segundo agente.

## Fora de escopo

- Reclassificação editorial individual dos 7.125 cartões `lembre_se`;
- classificação por IA;
- mudança do algoritmo de repetição espaçada;
- mistura de flashcards de Obras Obrigatórias com matérias;
- alteração automática de domínio por tópico a partir do simples consumo de cartões.
