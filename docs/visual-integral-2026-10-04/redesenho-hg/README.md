# Redesenho de História e Geografia

Escopo: todos os 112 capítulos, 49 de História e 63 de Geografia. A direção aprovada exige desenhos próprios mais ricos, anotações manuscritas e relações integradas à ilustração. A auditoria anterior de mecanismos continua como registro histórico; sua classificação de “preservar” não constitui aprovação deste redesenho.

As pranchas incluem sociedades, arquitetura, documentos, paisagens, cortes naturais, objetos de produção e rotas próprios de cada assunto. Diagramas analíticos corretos permanecem como segunda escala de leitura. Os 16 capítulos de História do Brasil foram recompostos integralmente; os nove capítulos atendidos por instrumentos ou experimento também receberam desenhos novos. As fontes manuscritas conservam sua família diante da regra global da interface.

IDs, conteúdo aprofundado, histórico de leitura, `expectedElements`, tentativas e diagnóstico permanecem preservados. Os botões seguem a ordem dos recortes de cada capítulo; pranchas largas usam rolagem interna e teclado. Os desenhos permanecem completos sob movimento reduzido.

## Verificação

[Manifesto dos 112 capítulos](manifest.json), [evidência por ID e estado](browser-evidence.json) e [galeria de 35 capturas completas](GALERIA.md).

A matriz Chromium percorreu os 112 capítulos em 390, 834 e 1366 px, temas claro e escuro, com movimento reduzido e normal: 12 configurações e 5.988 estados. Foram verificados recortes, extremos dos controles, seletores, rolagem por teclado, largura da página, limites de texto, colisões entre glifos, fonte manuscrita e tamanho efetivo das legendas essenciais.

A primeira matriz identificou cortes de legendas no comércio externo e na interiorização, rótulos sobrepostos na balança da colonização e duas legendas simultâneas durante a transição da Peste Negra. Esses quatro capítulos foram corrigidos e repetidos nas mesmas 12 configurações. Dois outros capítulos receberam repetição para confirmar a sincronização da leitura da fonte durante a substituição de elementos no navegador. As 12 rechecagens passaram; a evidência consolidada substitui somente os estados desses seis IDs e conserva os resultados dos demais.

Foram capturadas integralmente as 112 pranchas em viewport de 1366 × 2000 e conferidas suas composições; 35 imagens representativas acompanham o registro. Essa captura mais alta documenta o desenho e não substitui os testes de responsividade, executados com altura de 1000 px. Os recortes visíveis no celular dependem da rolagem interna da figura.

TypeScript e build de produção passaram. A suíte geral final passou em 823 testes Node e 952 Vitest (1.775), distribuídos em 152 arquivos da interface; execução com um worker, sem compilação ou navegador concorrentes. O build conserva aviso de chunk grande na tela Visual (2.407 kB minificados, 666 kB gzip), sem benchmark de desempenho nesta entrega. O validador da fila conserva os 613 IDs e a classificação histórica: 234 pendentes, 64 achados tratados e 315 mecanismos preservados. O redesenho é registrado separadamente, sem promover aprovação editorial.

Limites: Chromium em ambiente automatizado; sem certificação de Safari/iPad físico, fluxos autenticados, todas as fases intermediárias das animações ou contraste numérico de cada elemento.

A revisão independente corrigiu associação de recortes históricos, México em vez de Cuba no capítulo de revoluções, Balfour em 1917 e mandato britânico em 1922, distinção entre guerra desde 2014 e invasão em larga escala em 2022, e rótulos cartográficos. A contagem de países da zona do euro está explicitamente situada em 2023–2025; a crise de chips descreve choques globais de oferta e demanda.

Sem alteração de contas reais, Firestore ou chaves de persistência. A Entrega B está preservada e pausada. Sem merge automático.
