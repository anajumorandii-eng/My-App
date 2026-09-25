# Finalização das 613 cenas

Data: 25/09/2026. Continuação da reconstrução Motion, incorporando a main em `d641b5b`.

## Estado verificado

- 613 capítulos no inventário, 22 em validação, 591 sem revisão registrada e 0 aprovados.
- Presença de representação não equivale a movimento explicativo nem a aprovação visual.
- Código e evidências novos: `C:\Users\Ana Julia\Documents\CRIVO\My-App`.
- Repositório Git independente; cópia de origem preservada. Dependências reutilizadas por junction em `C:\wt-crivo-ecology-review\node_modules`; cache da prévia em `.scratch/vite-cache`.

## Ordem de execução

1. Fechar os 22 capítulos já reconstruídos: comparar com as referências aprovadas, revisar legibilidade e completar QA pendente. Corrigir antes de aprovar.
2. Física e Química: ler a representação ativa e as fontes de cada capítulo; corrigir primeiro modelos que ensinem relações incorretas. Aproveitar os instrumentos existentes somente quando atendam ao capítulo.
3. Biologia e Matemática: processos, estruturas e relações matemáticas com controles significativos.
4. Geografia, História, Filosofia e Sociologia: mecanismos específicos, recortes e limites explícitos; não inventar causalidade para produzir animação.
5. Literatura, Gramática, Entendimento de Texto, Língua Inglesa e Redação: movimento para leitura, comparação ou construção do argumento, fiel ao conteúdo.
6. Atualidades: conferir o recorte temporal e as fontes antes de finalizar.

A fila completa e única de IDs está em [fila-finalizacao-613.csv](fila-finalizacao-613.csv). O estado canônico por capítulo continua em `27-qualidade-visual.json`, gerado a partir de `visualQualityReviews.ts`. A ordem de prioridade não altera o status de qualidade.

## Critério de conclusão por capítulo

- Mecanismo visual específico e fiel às fontes, conferido contra as referências em `referencias-aprovadas/`.
- Motion explica uma transformação, percurso, seleção ou relação. Ter animação de entrada não satisfaz esse critério.
- Experiência estática completa com movimento reduzido; teclado, foco, temas, mobile, tablet e desktop conferidos.
- Explorar, Testar e Reconstruir preservam diagnóstico e progresso.
- Capturas e análise vinculadas ao ID correto; checagem técnica e aprovação editorial registradas separadamente.
- Marcar aprovado somente com evidência que satisfaça os critérios; nunca por contagem de arquivos, cobertura de rotas ou CI isolada.

## Por matéria

| Matéria | Total | Em validação | Sem revisão |
| --- | ---: | ---: | ---: |
| Física | 85 | 3 | 82 |
| Química | 48 | 3 | 45 |
| Biologia | 72 | 8 | 64 |
| Matemática | 83 | 0 | 83 |
| Geografia | 63 | 6 | 57 |
| História | 49 | 2 | 47 |
| Filosofia | 35 | 0 | 35 |
| Sociologia | 27 | 0 | 27 |
| Literatura | 37 | 0 | 37 |
| Gramática | 26 | 0 | 26 |
| Entendimento de Texto | 12 | 0 | 12 |
| Língua Inglesa | 17 | 0 | 17 |
| Redação | 58 | 0 | 58 |
| Atualidades | 1 | 0 | 1 |

## Lote desta retomada

Ondulatória, ondas eletromagnéticas, som, Termoquímica I e II, evolução dos modelos atômicos e coração/vasos. Detalhes e limites em [expansao-motion-2026-09-25.md](expansao-motion-2026-09-25.md). As demais 591 cenas exigem inspeção individual; esta fila não declara que todas precisam ser reescritas do zero.
