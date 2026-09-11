# Baseline funcional do CRIVO

## Categoria proposta

Sistema Adaptativo de Decisão para Aprendizagem.

O produto não se limita a conteúdo, cronograma ou tutor. A arquitetura funcional conecta evidência de desempenho a decisão de estudo.

## Capacidades existentes no repositório

### Decisão
- prioridade diária;
- explicação de recomendação;
- orçamento de tempo;
- ações adiadas;
- prioridade por domínio, revisão, erros, energia e prova.

### Diagnóstico
- auto-relato;
- objetivo + discursivo;
- domínio com incerteza;
- origem da evidência.

### Estudo
- sessão;
- questões;
- resumos profundos;
- flashcards;
- podcast;
- tutor;
- laboratório de métodos.

### Correção
- diagnóstico de erro;
- caderno de erros;
- intervenção;
- acompanhamento de resultado.

### Adaptação
- repetição espaçada;
- domínio;
- revisão urgente;
- proximidade da prova;
- incidência por banca;
- metas e disponibilidade.

### Vestibular
- questões reais;
- treino de 2ª fase;
- redação;
- estratégias por banca;
- calendário;
- obras obrigatórias.

### Transparência
- fatores da recomendação;
- confiança/incerteza;
- estados de sincronização;
- fallback quando IA falha.

## Baseline técnico

Cliente React + TypeScript + Vite, servidor Express e Firestore para dados do estudante. IA é exposta por rotas de tarefa e validada por contratos/parsers.

## Regra competitiva

Um concorrente não é “melhor” por possuir mais funcionalidades. Comparar capacidade de gerar aprendizagem útil por unidade de tempo, atenção e esforço.
