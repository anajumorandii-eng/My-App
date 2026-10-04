import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, 'families');
// A gravura fornece contexto material estático. Os mecanismos e seus recortes
// animados continuam nas quatro famílias históricas que a compõem.
const staticArtwork = new Set(['HistorianIllustration.tsx']);
const familias = readdirSync(dir).filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx') && !staticArtwork.has(f));

function composedSources(file: string, visited = new Set<string>()): string {
  if (visited.has(file)) return '';
  visited.add(file);
  const source = readFileSync(file, 'utf8');
  const dependencies = Array.from(source.matchAll(/from ['"](\.\/[^'"]+)['"]/g)).map(match => join(dirname(file), `${match[1]}.tsx`)).filter(existsSync);
  return [source, ...dependencies.map(dependency => composedSources(dependency, visited))].join('\n');
}

describe('Portão do movimento', () => {
  it.each(familias)('%s aplica a política de movimento na composição', (arquivo) => {
    const source = composedSources(join(dir, arquivo));
    expect(source, `${arquivo} precisa compor movimento por motion/react`).toMatch(/from ['"]motion\/react['"]/);
    expect(source, `${arquivo} precisa consumir useSceneMotion()`).toMatch(/useSceneMotion\(\)/);
    expect(source, `${arquivo} não pode ter animação infinita`).not.toMatch(/repeat:\s*Infinity/);
  });
  it.each(['Antiguidade.tsx','IdadeModerna.tsx','HistoriaMundial.tsx','SeculoXX.tsx'])('%s integra a gravura estática a mecanismos animados', arquivo => {
    const source=readFileSync(join(dir,arquivo),'utf8');
    expect(source).toMatch(/from ['"]\.\/HistorianIllustration['"]/);
    expect(source).toMatch(/from ['"]motion\/react['"]/);
    expect(source).toMatch(/useSceneMotion\(\)/);
  });
});
