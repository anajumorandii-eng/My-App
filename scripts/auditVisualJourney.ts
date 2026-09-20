// Substituído por `npm run visual:matrix` (src/views/visualCoverage.ts).
//
// Este script deixou de rodar quando a prancha de Fungos passou a importar um
// .css: os registros de pranchas puxam esses arquivos e o Node puro recusa
// (ERR_UNKNOWN_FILE_EXTENSION). O CI não executa scripts/, então a quebra
// passou despercebida. O campo `anchorScene` que ele gravava também misturava
// cena, prancha e instrumento; a matriz nova separa os tipos e sai do mesmo
// resolvedor que a tela usa. O arquivo 04-cobertura-percurso.json fica como
// registro histórico e não é mais regenerado.
console.error('scripts/auditVisualJourney.ts foi substituído. Rode: npm run visual:matrix');
process.exit(1);
