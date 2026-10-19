import test from 'node:test';
import assert from 'node:assert/strict';
import { needsPdfFile } from './printPlatform';
test('iPad e iPhone usam arquivo PDF em aba normal ou aplicativo instalado', () => {
  assert.equal(needsPdfFile({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)' }), true);
  assert.equal(needsPdfFile({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Version/18 Safari', maxTouchPoints: 5 }), true);
  assert.equal(needsPdfFile({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18)' }), true);
  assert.equal(needsPdfFile({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', maxTouchPoints: 0 }), false);
  assert.equal(needsPdfFile({ userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome' }), false);
});
