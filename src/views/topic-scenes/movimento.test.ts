import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'families');
const familias = readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'));

describe('Portão do movimento', () => {
  if (familias.length === 0) {
    it('nenhuma família para validar ainda', () => {
      expect(familias).toEqual([]);
    });
  } else {
    it.each(familias)('%s anima por motion/react', (arquivo) => {
      const src = readFileSync(join(dir, arquivo), 'utf8');
      expect(src, `${arquivo} precisa importar motion/react`).toMatch(/from ['"]motion\/react['"]/);
      expect(src, `${arquivo} precisa consumir useSceneMotion()`).toMatch(/useSceneMotion\(\)/);
      expect(src, `${arquivo} não pode ter animação infinita`).not.toMatch(/repeat:\s*Infinity/);
    });
  }
});
