# Modelo de assessment do CRIVO

## FATO DO PRODUTO — múltiplas formas de evidência

O CRIVO usa:
- questões objetivas;
- questões discursivas;
- redação;
- recuperação ativa em resumos;
- flashcards;
- autoavaliação;
- checagem pós-sessão;
- caderno de erros;
- diagnóstico inicial/adaptativo.

Essas evidências alimentam domínio, revisão e priorização.

## FATO DO PRODUTO — avaliação não é só acerto/erro

O estado de domínio contém:
- nível;
- incerteza;
- origem;
- erros recentes;
- histórico de revisão.

A intenção é evitar reduzir “sei/não sei” a um único marcador binário.

## FATO DO PRODUTO — segunda fase

A rota `/treino-2a-fase` trabalha com:
- questões discursivas;
- tempo;
- protocolos;
- autoavaliação;
- atualização do agendamento de revisão.

`src/data/resolutionStrategies.ts` mantém protocolos gerais, por matéria e por banca, incluindo estratégias específicas para respostas discursivas.

## FATO DO PRODUTO — redação

`src/data/essayModule.ts` modela:
- estrutura;
- critérios;
- regras de anulação;
- particularidades por banca;
- incerteza quando pesos/formato variam por ano.

O módulo diferencia ENEM, FUVEST, Comvest, Vunesp, Famerp e Unifesp.

## HIPÓTESES A VALIDAR

- O domínio geral de um tópico prediz desempenho na banca?
- A competência necessária para 1ª fase e 2ª fase deve ser modelada separadamente?
- Acertar questão objetiva simples deveria aumentar domínio no mesmo grau que justificar uma resposta discursiva?
- O modelo precisa separar conhecimento factual, procedimental, interpretação e transferência?
- Qual evidência deve encerrar uma intervenção e declarar “já há domínio suficiente”?

## Consequência para o produto

O notebook deve ajudar o CRIVO a migrar de uma noção genérica de “domínio do tópico” para um modelo de domínio sensível à tarefa, fase e exigência real da prova.
