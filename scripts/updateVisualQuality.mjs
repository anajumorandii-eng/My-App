// O resolvedor carrega pranchas com CSS; Vitest processa esses imports.
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['vitest', 'run', 'src/views/visualQuality.test.ts', '--maxWorkers=1'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, UPDATE_VISUAL_QUALITY: '1' },
});
process.exit(result.status ?? 1);
