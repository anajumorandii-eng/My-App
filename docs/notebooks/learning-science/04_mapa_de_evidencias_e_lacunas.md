# Mapa de evidências e lacunas científicas

## Já citado/assumido no repositório

### Repetição espaçada
O código cita SM-2/Wozniak e a curva de esquecimento de Ebbinghaus como fundamento histórico do agendamento.

**Status:** referência conceitual no código, mas os trabalhos originais/revisões não estão versionados como fontes acadêmicas.

### Retrieval practice
Respostas a questões e checagens de aprendizagem alimentam o cronograma de revisão.

**Status:** mecanismo implementado; falta uma base bibliográfica curada no repositório.

### Interleaving
`src/lib/efficiencyEngine.ts` importa `interleaveBySubject`.

**Status:** estratégia implementada; precisa de evidência sobre quando interleaving ajuda, quando prejudica e como depende do nível de domínio.

### Metacognição
Autoavaliação e opção “não sei” aparecem no diagnóstico e em atividades discursivas.

**Status:** implementação coerente com calibração, mas sem validação interna de acurácia metacognitiva.

### Pré-requisitos
Tópicos têm `prerequisites`; domínio abaixo de 50 em pré-requisito pode gerar motivo `prerequisito_bloqueado`.

**Status:** regra de produto; falta validar o limiar e a estrutura do grafo.

## Prioridade de aquisição de fontes externas

1. Retrieval practice — revisões e meta-análises.
2. Spacing — efeito do intervalo, dificuldade e atraso.
3. Feedback e correção de erros.
4. Interleaving vs blocked practice.
5. Metacognitive monitoring/calibration.
6. Transfer e varied practice.
7. Cognitive load e expertise reversal.
8. Mastery learning e formative assessment.
9. Worked examples e fading.
10. Prerequisite knowledge / knowledge component models.

## Regra para incorporar pesquisa

Para cada fonte adicionada, registrar:
- pergunta que ela responde;
- população estudada;
- tipo de tarefa;
- tamanho do efeito quando disponível;
- limitações;
- condições em que o efeito muda;
- relevância para vestibular;
- qual regra do CRIVO ela apoia, contradiz ou deixa incerta.

Nunca converter “efeito médio em um estudo” em regra universal de produto.
