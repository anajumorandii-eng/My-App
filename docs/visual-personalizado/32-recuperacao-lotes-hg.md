# Recuperação dos lotes de História e Geografia

Em 26/09/2026, os arquivos não publicados da sessão de nuvem foram preservados pelo visualizador da própria sessão e integrados sobre `b6407fb`, base da PR #219. A sequência dos números de linha e o fim de cada arquivo recuperado foram conferidos. As cópias de origem ficam em `.scratch/cloud-recovery/`, fora do Git.

## Escopo integrado

Os lotes 11 a 19 acrescentam 45 cenas próprias, com dados, componentes, estilos e testes. Os capítulos de História e Geografia totalizam 112 na matriz; 103 usam cena como representação primária, e os nove restantes têm experimento, prancha ou instrumento. Coordenadas Geográficas recebeu o ajuste da sessão de nuvem; Independência recebeu ajuste local de rolagem por teclado e movimento reduzido, preservando o conteúdo da prancha. O teste do lote 14 não existia na sessão e foi criado nesta integração.

| Lote | Tema | Cenas |
| --- | --- | ---: |
| 11 | Geopolítica | 5 |
| 12 | Ásia e Oriente Médio | 4 |
| 13 | História mundial e colonial | 7 |
| 14 | Brasil República | 6 |
| 15 | Cartografia e água | 5 |
| 16 | Águas e biomas | 4 |
| 17 | Ambiente e energia | 6 |
| 18 | Globalização | 4 |
| 19 | Economia brasileira | 4 |

O resolvedor rejeitou zero das 45 entradas por falta de lastro literal. A matriz de cobertura e o inventário de qualidade foram regenerados. Todas as cenas novas permanecem `nao-revisado` no inventário de qualidade até revisão editorial; cobertura e testes não equivalem a aprovação estética.

## Validação local

- `npm run lint`, `npm run build`, `npm run visual:matrix` e `npm run visual:quality` passaram.
- 70 testes direcionados dos lotes, lastro e roteamento passaram. Após atualizar os inventários, os 27 testes de cobertura, qualidade e roteamento passaram.
- A suíte geral de interface chegou a 699/700 testes; sua única falha era o inventário de qualidade ainda não regenerado, corrigido e testado separadamente.
- `npm test` executou 706 testes Node: 705 passaram; um teste de catálogo falhou porque 14 PDFs licenciados não estão presentes neste checkout. Essa ausência já era conhecida antes da integração e não foi causada pelas cenas.
- Inspeção manual no aplicativo local: Regime Militar II em claro e escuro, incluindo o recorte Diretas Já por teclado; Hidrogeografia do Brasil em claro. O restante das 45 cenas ainda precisa de revisão visual editorial completa em desktop e celular.

## Publicação e acompanhamento

Antes do push, conferir se `claude/hopeful-ritchie-hu0skx` continua em `b6407fb`: a sessão original está configurada para retomar automaticamente quando o limite de uso for renovado. Se ela avançar, integrar a diferença sem sobrescrever trabalho remoto. O commit desta recuperação deve atualizar a PR #219. A revisão editorial dos recortes continua pendente e não deve ser declarada aprovada por CI.

Uma repetição da suíte geral sofreu timeouts sob carga concorrente. Os cinco arquivos afetados foram repetidos com um único worker: 83/83 testes passaram. Commit de recuperação publicado como atualização da PR #219; revisão visual completa continua pendente.
