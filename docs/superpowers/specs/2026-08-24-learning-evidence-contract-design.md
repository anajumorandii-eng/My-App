# Contrato unificado de evidências de aprendizagem

## Escopo

Esta especificação define o vocabulário e o contrato mínimo do ciclo adaptativo da JUJU. A entrega inclui somente tipos TypeScript e validação pura. Não cria coleção no Firestore, adaptadores, backfill, projeção de domínio, interface ou gravação paralela.

O objetivo é permitir que os módulos atuais produzam eventos auditáveis sem substituir seus modelos de uma só vez:

```text
Hoje → Estudar → Gerar evidência → Atualizar projeções
     → Registrar erro → Agendar revisão → Demonstrar recuperação
```

## Vocabulário normativo

- **Tentativa:** interação da estudante com uma atividade. Pode não ser avaliada e ainda não constitui evidência de domínio.
- **Evidência:** evento imutável e datado que preserva origem, contexto, resultado, apoio e confiança. Uma nova tentativa sempre é outro evento.
- **Erro:** projeção derivada de uma ou mais evidências malsucedidas. Não é a fonte de verdade da tentativa.
- **Domínio:** projeção reconstruível a partir de evidências elegíveis. Nunca sobrescreve a trilha histórica.
- **Revisão:** ação futura derivada de evidências e disponibilidade de conteúdo. A agenda não faz parte do evento original; `nextReviewAt` continuará em uma projeção própria.
- **Recuperação:** evidência posterior, preferencialmente independente e em ocasião distinta, que responde ao mesmo conceito ou erro. Não apaga o erro anterior.

## Taxonomia e referências

Os IDs canônicos continuam nos catálogos existentes. Esta entrega não renomeia `mockTopics` nem cria uma taxonomia paralela.

- `disciplineId`: slug estável da disciplina; pode ser `null` para legado ainda não mapeado.
- `topicId`: `Topic.id`; pode ser `null` quando o material não possui correspondência segura.
- `conceptIds`: IDs conceituais futuros, estáveis e mais finos que tópico. Um array vazio significa “ainda não mapeado”, nunca ausência de aprendizagem.
- `catalogStatus`: `resolved`, `unmapped` ou `removed` explicita a qualidade do vínculo.
- `snapshot`: rótulos e enunciado mínimos preservam inteligibilidade quando o catálogo muda.

Não se inventa um tópico ou conceito para preencher lacunas. O catálogo deve resolver aliases explicitamente, usando migrações como `legacyTopics.ts`; aproximação por texto não é aceita como vínculo canônico.

## Identidade, idempotência e retenção

`LearningEvidence.id` identifica um evento imutável. `sourceRecordId` identifica a atividade ou registro de origem e pode se repetir em tentativas diferentes.

A Entrega 2.2 definirá a construção determinística do ID. O contrato exige que essa construção considere, no mínimo, usuária no escopo do repositório, origem, registro de origem e identidade da tentativa. Reenviar a mesma tentativa deve produzir o mesmo ID; responder novamente deve produzir outro ID.

`userId` não é duplicado no documento: o escopo de persistência será `users/{uid}/learningEvidence/{evidenceId}`. A fronteira de repositório recebe o UID separadamente e impede leitura ou escrita fora desse escopo.

Eventos originais são append-only. Correções editoriais geram metadados versionados ou eventos de retificação em entrega futura; não reescrevem resposta, resultado, apoio ou timestamps originais. Não há expiração automática. Conteúdo removido altera apenas a resolução do catálogo e o link, preservando snapshot e histórico.

## Contrato

O contrato canônico está em `src/types/learningEvidence.ts`, versão 1.

### Origens

- `objective-question`
- `discursive-answer`
- `summary-retrieval`
- `flashcard`
- `recovery-exercise`
- `literary-work`
- `essay`
- `verified-session`

### Resultado

- `correct`: os critérios avaliados foram atendidos.
- `partial`: parte relevante foi demonstrada, mas existe pelo menos um elo ausente.
- `incorrect`: a resposta não demonstra o mecanismo mínimo esperado.
- `unassessed`: houve execução ou produção, mas não existe avaliação válida.

“Não respondida” não gera evidência de tentativa. Pode existir como pendência em projeções. Uma entrega vazia deliberadamente registrada pode ser `unassessed`, desde que o adaptador preserve esse fato nos metadados.

### Apoio

- `independent`: sem pista ou solução consultada antes da resposta.
- `hint`: pista curta, sem expor o encadeamento completo.
- `guided`: solução parcial, andaime ou correção passo a passo.
- `solution-exposed`: gabarito ou solução substancialmente exposta antes da demonstração.
- `unknown`: legado sem informação confiável; reduz a confiança e não pode ser promovido silenciosamente a independente.

### Efeito sobre domínio

- `eligible`: pode ser consumido pelo futuro projetor, sem garantia de aumento.
- `execution-only`: prova atividade, leitura ou hábito, não aprendizagem.
- `none`: não deve entrar na projeção de domínio.

São invariantes do contrato:

1. sessão verificada é sempre `execution-only`;
2. progresso de leitura literária é sempre `execution-only`;
3. resultado `unassessed` nunca é `eligible`;
4. resposta após `solution-exposed` nunca é `eligible`;
5. `hint` e `guided` podem ser elegíveis com peso menor, decidido apenas pelo projetor futuro;
6. evidência elegível não altera `TopicMastery` nesta entrega.

### Confiança

`confidence` varia de 0 a 1 ou é `null` quando não há estimativa defensável. Mede confiança na avaliação do evento, não domínio global. Autoavaliação isolada, heurística textual e correção por IA devem registrar confiança inferior a uma correção objetiva determinística ou humana confirmada.

### Dimensões

`dimensions` preserva avaliações que não cabem em certo/errado. Exemplos:

- Unicamp: comando, fonte, conceito e relação;
- Unesp: direto, conceito/cálculo, explicação e aplicação;
- redação: tema, argumentação, repertório, coesão, linguagem e intervenção;
- obras: compreensão, análise formal, contexto e articulação.

O `outcome` global é uma síntese; as dimensões continuam auditáveis. Pontuações só são registradas quando a escala real é conhecida.

## Matriz dos módulos atuais

| Módulo atual | Origem | Atividade | Registro-fonte | Informação preservada |
|---|---|---|---|---|
| `QuestionAttempt` | `objective-question` | `attempt` | `questionId` | alternativa em `metadata`, resultado, tópico, fonte de prova e link |
| `DiscursiveAttempt` | `discursive-answer` | `attempt` | `questionId` | autoavaliação, banca, fase, C-F-C-R/D-C-E-A em dimensões quando disponíveis |
| `RetrievalAttempt` | `summary-retrieval` | `retrieval` | `summaryId:questionId` | elementos reconhecidos, primeiro elo ausente, seção, materiais e link profundo |
| `FlashcardReview` | `flashcard` | `review` | `cardId` | qualidade da lembrança, apoio, origem do baralho e agendamento em projeção separada |
| `RecoveryEvidence` | `recovery-exercise` | `recovery` | `backlogItemId` | difícil/com ajuda/independente, tópico e ocasião |
| leitura/avaliação literária | `literary-work` | `reading-progress` ou `assessment` | obra/unidade/tentativa | leitura separada de domínio e fontes preservadas |
| rascunho/correção de redação | `essay` | `assessment` | redação/tentativa | banca, competências, feedback e versão; rascunho sem avaliação não demonstra domínio |
| `StudySessionRecord` | `verified-session` | `session` | `session.id` | duração, ação e verificação; sempre execução, nunca domínio direto |

Todos os modelos atuais cabem no contrato. Campos específicos que ainda não possuem semântica canônica permanecem em `metadata` até a entrega do adaptador correspondente; campos pedagógicos essenciais não devem ser escondidos ali quando já existem no contrato.

## Erros, reincidência e recuperação

O futuro Caderno de Erros agrupará por `conceptId` e, enquanto ele não existir, por `topicId + error.code`. A pergunta original permanece uma evidência individual.

- `error.firstBreak` registra o primeiro ponto observável de ruptura.
- `error.type` usa a taxonomia comum conceitual, procedimental, leitura, expressão, atenção ou tempo.
- `error.code` é estável dentro do catálogo conceitual; texto livre não deve virar código automaticamente.
- Duas falhas no mesmo conceito são reincidência mesmo em formatos diferentes.
- Reenvio do mesmo evento não conta novamente.
- Recuperação mínima exige evento posterior, resultado correto, sem solução exposta e em tentativa distinta.
- Recuperação independente é mais forte que recuperação com pista; nenhuma apaga evidências anteriores.
- “Acertou depois de ver a solução” registra prática, mas não fecha o erro como recuperação independente.

## Agendamento de revisão

O evento preserva os insumos; a agenda é uma projeção mutável e reconstruível. O futuro motor considera resultado, apoio, confiança, reincidência, última recuperação, banca/fase, proximidade da prova e formatos realmente disponíveis.

Não há `nextReviewAt` em `LearningEvidence` para evitar duas fontes de verdade com `SummaryReviewSchedule`, `FlashcardReview` e `TopicMastery`. Durante a migração, os agendamentos atuais continuam autoritativos em seus módulos; a agenda unificada será comparada em modo sombra antes da troca.

## Fontes de verdade durante a transição

| Informação | Fonte atual | Fonte futura |
|---|---|---|
| catálogo de tópicos | `mockTopics` + migrações explícitas | manifesto curricular versionado |
| resposta original | registro de tentativa do módulo | evento `LearningEvidence` imutável |
| domínio | `TopicMastery` | projeção por conceito, reconstruível |
| erro | `ErrorLog` e derivados de resumo | projeção global sobre evidências |
| próxima revisão | agendas de cada módulo | projeção multimodal única |
| conteúdo/enunciado | catálogo interno/Firestore | catálogo editorial; snapshot no evento |
| identidade da usuária | caminho `users/{uid}` | permanece no caminho, não no evento |

Até a leitura unificada ser validada, os modelos atuais continuam sendo fonte operacional. Nenhuma interface deve misturar agregações antigas e novas sem declarar a origem.

## Compatibilidade e migração futura

1. Leitores antigos não recebem alterações nesta entrega.
2. Campos ausentes em registros legados serão normalizados por adaptadores, nunca por cast direto.
3. `unknown`, `unmapped`, arrays vazios e `null` representam insuficiência explícita; não acionam inferência silenciosa.
4. O backfill futuro será repetível, terá dry-run e gravará somente IDs determinísticos ausentes.
5. Divergências entre evento e modelo antigo serão métricas de comparação, não correções automáticas.
6. Conteúdo removido conserva snapshot e recebe `contextLink: null`.
7. A remoção dos caminhos antigos só pode ocorrer em entrega posterior, depois de equivalência observada.

## Segurança e privacidade

- Respostas podem conter dados livres da estudante; não entram em logs de IA ou métricas agregadas.
- `metadata` não deve armazenar tokens, e-mail, UID, prompts de sistema ou segredos.
- Regras do Firestore deverão restringir a coleção ao UID do caminho.
- Métricas operacionais usam contagens e latências, não conteúdo de respostas.

## Critérios de aceite desta fundação

- As oito origens atuais são representáveis.
- Resultado, apoio, contexto, banca/fase, snapshots e dimensões têm semântica explícita.
- Leitura e sessão não demonstram domínio.
- Conteúdo removido permanece legível sem link quebrado.
- Contratos inconsistentes são rejeitados por validação pura.
- Nenhum dado é persistido, migrado ou duplicado nesta entrega.
- Identidade determinística, normalização legada e repositório permanecem como próximas entregas independentes.
