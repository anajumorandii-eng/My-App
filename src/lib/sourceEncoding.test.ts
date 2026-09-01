import assert from 'node:assert/strict';
import test from 'node:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

// Regressão: src/views/ObraDetalhe.tsx foi comitado com UTF-8 duplo-codificado
// (mojibake) na migração visual — a acentuação virava lixo na tela. tsc e os
// testes de comportamento passam com o arquivo corrompido, então a única
// defesa é olhar os bytes: quando texto latino é relido como Windows-1252 e
// regravado como UTF-8, sobram sequências com U+00C3/U+00C2 seguidos de um
// caractere Latin-1, ou o trio U+00E2 U+20AC.
const C3 = String.fromCharCode(0x00c3); // Ã
const C2 = String.fromCharCode(0x00c2); // Â
const E2AC = String.fromCharCode(0x00e2) + String.fromCharCode(0x20ac); // â€
const MOJIBAKE = new RegExp(`${C3}[\\u0080-\\u00ff]|${C2}[\\u00a0-\\u00bf]|${E2AC}`);

// npm scripts rodam da raiz do projeto (mesma convenção de flashcardDataIntegrity.test.ts).
const SRC_ROOT = path.resolve('src');
const SELF = path.resolve('src', 'lib', 'sourceEncoding.test.ts');

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walk(full);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      yield full;
    }
  }
}

test('nenhum arquivo-fonte tem texto com mojibake (UTF-8 duplo-codificado)', () => {
  const offenders: string[] = [];
  for (const file of walk(SRC_ROOT)) {
    if (path.resolve(file) === SELF) continue;
    const content = readFileSync(file, 'utf8');
    const match = content.match(MOJIBAKE);
    if (match) {
      const line = content.slice(0, match.index).split('\n').length;
      offenders.push(`${path.relative(SRC_ROOT, file)}:${line} → ${JSON.stringify(match[0])}`);
    }
  }
  assert.deepEqual(offenders, [], `arquivos com acentuação corrompida:\n${offenders.join('\n')}`);
});
