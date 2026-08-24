# Identidade e idempotência de evidências

## Escopo

Esta entrega implementa somente funções puras para identidade, inserção idempotente, leitura segura do schema conhecido e classificação de referências de catálogo. Não cria repositório, coleção Firestore, adaptadores, flags, backfill ou efeitos sobre domínio.

Depende do contrato `LearningEvidence` versão 1 definido no PR anterior.

## Identidade estável

O ID é o SHA-256 da tupla JSON:

```text
[schemaVersion, source, sourceRecordId, attemptId]
```

O formato armazenável é `le1_<64 caracteres hexadecimais>`. Ele não contém barras, não expõe texto da resposta e possui tamanho fixo.

- `sourceRecordId` identifica a atividade original.
- `attemptId` identifica a ocorrência da tentativa e deve vir do módulo adaptador.
- Um retry reutiliza o mesmo `attemptId`.
- Uma nova resposta recebe outro `attemptId`, mesmo para a mesma questão.
- O motor rejeita identificadores vazios; não usa horário atual, conteúdo da resposta ou heurística como fallback.
- O UID não entra no hash porque a identidade é escopada pelo futuro caminho `users/{uid}/learningEvidence/{id}`.

O hash reduz exposição e respeita limites do Firestore. Colisão lógica ou reutilização indevida do mesmo ID não autoriza sobrescrita: vira conflito observável.

## Inserção idempotente

`appendLearningEvidence` retorna quatro estados:

- `inserted`: ID ausente e contrato válido; acrescenta o evento.
- `duplicate`: mesmo ID e mesmo payload pedagógico; mantém o original.
- `conflict`: mesmo ID e payload pedagógico diferente; mantém o original e expõe o conflito.
- `rejected`: candidato viola o contrato; mantém a coleção e devolve os problemas.

A comparação é canônica e independente da ordem das chaves de objetos. `recordedAt` é o único campo ignorado: ele representa quando a gravação foi tentada e pode mudar num retry offline. `occurredAt`, resultado, apoio, confiança, referências, snapshot, dimensões e metadados permanecem imutáveis e causam conflito se divergirem.

O array de entrada não é modificado. Nenhum conflito é resolvido automaticamente.

## Normalização segura

`normalizeLearningEvidenceRecord` aceita `unknown`, exige o schema 1, confere a estrutura mínima e aplica a validação semântica do contrato.

Registros atuais como `QuestionAttempt`, `RetrievalAttempt` ou `FlashcardReview` não são tratados como `LearningEvidence` legado. Eles exigem adaptadores explícitos nas entregas 3.x. Retornar `null` evita inventar banca, apoio, conceito ou identidade.

Não existe ainda versão persistida anterior de `LearningEvidence`; portanto, esta entrega não cria migração fictícia. Quando houver schema 2, a conversão deverá ser uma função versionada separada.

## Referências de catálogo

`classifyEvidenceCatalogReference` compara tópico e conceitos com três conjuntos explícitos:

- IDs atuais;
- IDs explicitamente removidos;
- todo o restante, considerado não mapeado.

Precedência:

1. qualquer vínculo explicitamente removido → `removed`;
2. qualquer vínculo desconhecido → `unmapped`;
3. todos os vínculos presentes → `resolved`.

Não há fuzzy matching nem inferência por rótulo. A função classifica a resolução atual sem alterar o snapshot histórico do evento.

## Próxima fronteira

A próxima entrega pode criar o repositório usando estas funções como única porta de entrada. Ela deverá tratar transação concorrente, estado offline, observação de sincronização e regras do Firestore sem mudar a semântica deste motor.
