# Integração do trabalho local com as publicações do cloud

## Escopo recuperado

- `da5503b`: reconstrução de cenas de Ecologia, fotossíntese e humanas, com movimento explicativo e capturas.
- `5a386ed`: sete capítulos de ondas, termoquímica, modelos atômicos e circulação; controles de reprodução e roteiro dos 613 capítulos.
- `7c11dec`: raios reais e prolongamentos virtuais de lentes; comparação logarítmica de pH.
- `151ed6c`: checkpoint do esboço de recursos comuns e quinto. Preservado na branch `backup/local-motion-before-cloud`; não faz parte do código entregue, pois não estava validado e parte foi superada pelo cloud.

## Reconciliação

A main já contém as PRs #212 e #213. Foram mantidas integralmente as versões publicadas de HistoriaGeografia, GeographyContextDiagrams, HistoryInstrument e seus testes, incluindo os novos componentes de engenho, interiorização e mineração. As capturas e revisões dos lotes 1 e 2 foram preservadas. Biologia conserva a revisão local em validação, correspondente aos componentes reconstruídos; não reutiliza aprovação de uma versão anterior.

Inventário combinado: 613 capítulos; 28 em validação, 585 sem revisão, nenhum marcado aprovado. História e Geografia permanecem a prioridade de continuidade. Isso não declara finalizadas essas matérias.

## Verificação da integração

- `npm run visual:quality`: 4 testes passaram; relatório regenerado.
- `npm run lint`: passou.
- `npm test`: etapa Node com 705/706 testes passando. `summaryCatalog.test.ts` falha pela ausência local de 14 PDFs de apostilas; Vitest executado separadamente.
- As evidências de navegador incluídas pertencem aos respectivos lotes anteriores. A integração não equivale a nova aprovação visual de todas as cenas.
