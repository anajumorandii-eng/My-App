// Regenera docs/visual-personalizado/18-matriz-cobertura.{json,md}.
//
// A matriz precisa ser gerada pelo vitest, e não por `tsx scripts/...`: os
// registros de pranchas importam arquivos .css, que o Node puro recusa
// (ERR_UNKNOWN_FILE_EXTENSION). Foi assim que scripts/auditVisualJourney.ts
// parou de rodar quando a prancha de Fungos entrou. O teste de cobertura já
// sabe escrever os dois arquivos quando UPDATE_VISUAL_MATRIX está definido.
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['vitest', 'run', 'src/views/visualCoverage.test.ts'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, UPDATE_VISUAL_MATRIX: '1' },
});
process.exit(result.status ?? 1);
