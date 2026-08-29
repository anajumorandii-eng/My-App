import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveInitialTheme, applyTheme, ThemeTarget } from './theme';

function fakeTarget() {
  const classes = new Set<string>();
  const attrs = new Map<string, string>();
  const target: ThemeTarget = {
    documentElement: {
      classList: {
        toggle: (name: string, force: boolean) => {
          if (force) classes.add(name);
          else classes.delete(name);
        },
      },
    },
    getElementById: (id: string) =>
      id === 'theme-color-meta'
        ? { setAttribute: (name: string, value: string) => attrs.set(name, value) }
        : null,
  };
  return { target, classes, attrs };
}

test('resolveInitialTheme: valor guardado sempre vence, mesmo contra a preferência do sistema', () => {
  assert.equal(resolveInitialTheme('light', true), 'light');
  assert.equal(resolveInitialTheme('dark', false), 'dark');
});

test('resolveInitialTheme: sem valor guardado, segue a preferência do sistema', () => {
  assert.equal(resolveInitialTheme(null, true), 'dark');
  assert.equal(resolveInitialTheme(null, false), 'light');
});

test('applyTheme: aplica a classe dark e a cor do theme-color meta quando o tema é dark', () => {
  const { target, classes, attrs } = fakeTarget();
  applyTheme('dark', target);
  assert.ok(classes.has('dark'));
  assert.equal(attrs.get('content'), '#10251F');
});

test('applyTheme: remove a classe dark e usa a cor clara quando o tema é light', () => {
  const { target, classes, attrs } = fakeTarget();
  applyTheme('dark', target);
  applyTheme('light', target);
  assert.ok(!classes.has('dark'));
  assert.equal(attrs.get('content'), '#FBF8F2');
});
