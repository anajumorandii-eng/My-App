# Fluxo de estudo do Visual — 12/11/2026

A organização validada em Biotecnologia agora atende a todos os capítulos:

- Explorar oferece uma continuação para a leitura da etapa atual.
- Testar concentra pergunta, resposta, correção e os próximos caminhos.
- Reconstruir começa pelo exercício. A cena e o mapa ficam em uma consulta fechada, montada somente ao abrir e desmontada ao fechar. Biotecnologia mantém apenas o mapa nessa consulta.
- As representações específicas de cada capítulo e o mascaramento das relações continuam disponíveis.

A correção da reconstrução atualiza a evidência sem substituir as lacunas da rodada em andamento. Reiniciar limpa as respostas e seleciona a próxima rodada com base nas prioridades atuais.

## Conferência no navegador

`node --import tsx scripts/verify-unified-study-flow.mjs`

Foram percorridos 16 capítulos de 14 matérias, cobrindo prancha, experimento, cena e instrumento, temas claro e escuro e larguras de 360, 390, 834 e 1366 px. A distribuição por capítulo está em [browser-results.json](./browser-results.json).

O percurso confere foco por teclado, leitura → Testar → correção → Reconstruir, escolha e correção das lacunas, desfazer, consulta sob demanda, preservação da resposta e revisão da leitura. Não houve erro de página, resposta HTTP de erro ou transbordamento horizontal nas páginas conferidas. O fallback continua coberto pelos testes de componente.

As capturas `0-*`, `1-*`, `2-*` e `3-*` mostram, respectivamente, Física, Matemática, História e Geografia, nos estados Testar, Reconstruir e consulta aberta.

## Regressões automatizadas

Os testes de componente verificam a consulta inicialmente desmontada em Física, Matemática e História, a navegação de volta à biblioteca e a estabilidade da rodada após uma atualização real da evidência. O teste de navegador de continuidade acompanha os rótulos e o caminho de revisão atualizados.

Os quatro testes de `visual-refinement-continuation.spec.ts` passaram em Chromium. A auditoria com axe de seis recortes (Explorar e Testar, nas larguras de 1440, 834 e 360 px) terminou sem violações após escurecer o feedback no tema claro. Permanecem seis verificações inconclusivas do axe, referentes ao contador da leitura e à seta decorativa; esse resultado não constitui uma aprovação de acessibilidade de toda a aplicação.

Validação da entrega: `npm run lint`, `npm test`, `npm run build` e a conferência de navegador acima. Os scripts de captura e auditoria também acompanham os novos caminhos e rótulos.
