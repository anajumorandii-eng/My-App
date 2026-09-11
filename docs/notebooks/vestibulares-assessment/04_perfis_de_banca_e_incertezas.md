# Perfis de banca e incertezas

## FATO DO PRODUTO — estratégias existentes

`src/data/resolutionStrategies.ts` contém:
- método geral de resolução;
- estratégias por matéria;
- perfis por banca;
- protocolos para discursivas.

Essas estratégias são material pedagógico interno. Não devem ser confundidas automaticamente com regras oficiais.

## FATO DO PRODUTO — prioridades por incidência

`src/data/examPriorities.ts` contém percentuais por tema e banca, derivados de relatório analítico de 2023–2025.

O Motor de Eficiência usa relevância da banca e proximidade da prova como multiplicadores de prioridade.

## FATO DO PRODUTO — calendário

`src/data/examCalendar.ts` registra marcos de prova com:
- banca;
- fase;
- data;
- fonte;
- data de verificação;
- confiança.

Esse padrão deve ser reproduzido em toda informação temporal sensível.

## Regra de incerteza

Separar sempre:

### Oficial
Ex.: data publicada, quantidade de fases, regra de redação documentada.

### Observado em provas
Ex.: tipos recorrentes de enunciado, distribuição de conteúdo em janela de anos.

### Estratégia interna
Ex.: protocolo de resolução recomendado pelo CRIVO.

### Hipótese
Ex.: “a banca valoriza mais X que Y” quando não há rubrica ou análise robusta suficiente.

## Perguntas para este notebook

- O que cada banca mede de fato?
- Quais competências atravessam matérias?
- O que muda entre primeira e segunda fase?
- Quais padrões são estáveis e quais são apenas recentes?
- Qual nível de domínio é suficiente para cada tipo de tarefa?
- Como o CRIVO deve reagir quando edital novo contradiz conhecimento anterior?
