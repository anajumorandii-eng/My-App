import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SUBJECT_PROFILE, SUBJECT_REGISTRY, TYPOGRAPHY_PRESETS, getSubjectProfile } from './crivoSubjects';

test('crivo subjects: cada tipografia registrada tem um preset, e todo perfil aponta pra um deles', () => {
  const typographies = new Set(Object.values(SUBJECT_REGISTRY).map((p) => p.tipografia));
  typographies.add(DEFAULT_SUBJECT_PROFILE.tipografia);
  for (const typography of typographies) {
    const preset = TYPOGRAPHY_PRESETS[typography];
    assert.ok(preset, `sem preset para tipografia "${typography}"`);
    assert.ok(preset.stagger > 0 && preset.duration > 0);
    assert.equal(preset.ease.length, 4);
  }
  assert.deepEqual(TYPOGRAPHY_PRESETS.neutral, TYPOGRAPHY_PRESETS[DEFAULT_SUBJECT_PROFILE.tipografia]);
});

test('crivo subjects: registra as dez matérias reais da tela Hoje', () => {
  assert.deepEqual(Object.keys(SUBJECT_REGISTRY).sort(), [
    'biologia', 'filosofia', 'fisica', 'geografia', 'historia', 'ingles', 'matematica', 'portugues', 'quimica', 'sociologia',
  ]);
  assert.equal(SUBJECT_REGISTRY.matematica.palette.primary, '#6E93B3');
  assert.equal(SUBJECT_REGISTRY.biologia.coreType, 'biologia_helix');
  assert.equal(SUBJECT_REGISTRY.portugues.tipografia, 'parsing');
});

test('crivo subjects: perfis pendentes são fallback explícito, não desconhecidos', () => {
  for (const subject of ['Inglês', 'Filosofia', 'Sociologia']) {
    const profile = getSubjectProfile(subject);
    assert.equal(profile.isFallback, true);
    assert.equal(profile.palette.bg, DEFAULT_SUBJECT_PROFILE.palette.bg);
  }
});

test('crivo subjects: normaliza acentos e avisa uma vez para matéria desconhecida', () => {
  const originalWarn = console.warn;
  const warnings: unknown[][] = [];
  console.warn = (...args: unknown[]) => warnings.push(args);
  try {
    assert.equal(getSubjectProfile('  Matemática ').key, 'matematica');
    assert.equal(getSubjectProfile('Astronomia').key, DEFAULT_SUBJECT_PROFILE.key);
    assert.equal(getSubjectProfile('Astronomia').key, DEFAULT_SUBJECT_PROFILE.key);
    assert.equal(warnings.length, 1);
  } finally {
    console.warn = originalWarn;
  }
});
