import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_AFFAIRS_THEMES } from './currentAffairsThemes';

test('cada tema de atualidades tem fatos datados, cabe no campo de material e não repete id', () => {
  assert.equal(new Set(CURRENT_AFFAIRS_THEMES.map(t => t.id)).size, CURRENT_AFFAIRS_THEMES.length);
  for (const theme of CURRENT_AFFAIRS_THEMES) {
    assert.match(theme.verifiedAt, /^\d{4}-\d{2}-\d{2}$/, theme.id);
    assert.ok(theme.text.includes('FATOS VERIFICADOS'), theme.id);
    // O campo de material aceita 12 mil caracteres, com a nota de fontes somada.
    assert.ok(theme.text.length + theme.sources.join(' ; ').length + 80 <= 12000, theme.id);
    assert.ok(theme.title.length <= 300, theme.id);
    assert.ok(theme.sources.every(url => url.startsWith('https://')), theme.id);
  }
});
