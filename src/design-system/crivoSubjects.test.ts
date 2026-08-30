import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_SUBJECT_PROFILE,
  SUBJECT_REGISTRY,
  TYPOGRAPHY_PRESETS,
  getSubjectPalette,
  getSubjectProfile,
} from './crivoSubjects';

const CURRENT_SUBJECTS = ['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'Geografia', 'História', 'Inglês', 'Filosofia', 'Sociologia'];

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

test('crivo subjects: registra todas as matérias reais da tela Hoje e identidades do Crivo', () => {
  assert.deepEqual(Object.keys(SUBJECT_REGISTRY).sort(), [
    'atualidades', 'biologia', 'filosofia', 'fisica', 'geografia', 'historia', 'ingles', 'literatura', 'matematica', 'portugues', 'quimica', 'redacao', 'sociologia',
  ]);
  assert.equal(SUBJECT_REGISTRY.matematica.palettes.dark.primary, '#6E93B3');
  assert.equal(SUBJECT_REGISTRY.biologia.coreType, 'biologia_helix');
  assert.equal(SUBJECT_REGISTRY.portugues.tipografia, 'parsing');
});

test('crivo subjects: cada matéria atual do plano diário tem identidade visual própria nos dois temas', () => {
  const profiles = CURRENT_SUBJECTS.map(getSubjectProfile);
  assert.ok(profiles.every((entry) => !entry.isFallback));
  assert.equal(new Set(profiles.map((entry) => entry.coreType)).size, CURRENT_SUBJECTS.length);
  assert.equal(new Set(profiles.map((entry) => entry.fieldType)).size, CURRENT_SUBJECTS.length);
  for (const entry of profiles) {
    assert.notEqual(entry.palettes.light.bg, entry.palettes.dark.bg);
    assert.ok(entry.palettes.light.primary);
    assert.ok(entry.palettes.dark.primary);
  }
});

test('crivo subjects: expõe as traduções clara e escura exatas das novas identidades', () => {
  assert.deepEqual(SUBJECT_REGISTRY.ingles.palettes, {
    dark: { bg:'#0B1018', surface:'#131C28', primary:'#5D8FD6', secondary:'#D6A85D', emissive:'#F4F7FF', textHighlight:'#D8E7FF', textAccent:'#5D8FD6', focusAccent:'#5D8FD6', dataPositive:'#70C8A0', dataWarning:'#D89A55', atmoA:'#172B45', atmoB:'#070A10' },
    light: { bg:'#FBF8F2', surface:'#F5EFE5', primary:'#5D8FD6', secondary:'#D6A85D', emissive:'#171A18', textHighlight:'#171A18', textAccent:'#4A72AB', focusAccent:'#4A72AB', dataPositive:'#2E7D58', dataWarning:'#9A5E1E', atmoA:'#5D8FD624', atmoB:'#D6A85D18' },
  });
  assert.deepEqual(SUBJECT_REGISTRY.filosofia.palettes, {
    dark: { bg:'#120F18', surface:'#1D1926', primary:'#8A72B5', secondary:'#C5A65A', emissive:'#F2ECFF', textHighlight:'#E2D8F5', textAccent:'#8A72B5', focusAccent:'#8A72B5', dataPositive:'#78B995', dataWarning:'#D18C58', atmoA:'#261D38', atmoB:'#09070D' },
    light: { bg:'#FBF8F2', surface:'#F5EFE5', primary:'#8A72B5', secondary:'#C5A65A', emissive:'#171A18', textHighlight:'#171A18', textAccent:'#7C67A3', focusAccent:'#7C67A3', dataPositive:'#2E7D58', dataWarning:'#9A5E1E', atmoA:'#8A72B524', atmoB:'#C5A65A18' },
  });
  assert.deepEqual(SUBJECT_REGISTRY.sociologia.palettes, {
    dark: { bg:'#0D1415', surface:'#172022', primary:'#4FA3A0', secondary:'#CE7C59', emissive:'#EDF8F7', textHighlight:'#CDE8E6', textAccent:'#4FA3A0', focusAccent:'#4FA3A0', dataPositive:'#76BE8E', dataWarning:'#D68C52', atmoA:'#173033', atmoB:'#070B0C' },
    light: { bg:'#FBF8F2', surface:'#F5EFE5', primary:'#4FA3A0', secondary:'#CE7C59', emissive:'#171A18', textHighlight:'#171A18', textAccent:'#3B7A78', focusAccent:'#3B7A78', dataPositive:'#2E7D58', dataWarning:'#9A5E1E', atmoA:'#4FA3A024', atmoB:'#CE7C5918' },
  });
  assert.equal(getSubjectPalette(SUBJECT_REGISTRY.ingles, 'light'), SUBJECT_REGISTRY.ingles.palettes.light);
  assert.equal(getSubjectPalette(SUBJECT_REGISTRY.ingles, 'dark'), SUBJECT_REGISTRY.ingles.palettes.dark);
});

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test('crivo subjects: acento textual e foco preservam contraste WCAG em todas as matérias e temas', () => {
  for (const profile of [DEFAULT_SUBJECT_PROFILE, ...Object.values(SUBJECT_REGISTRY)]) {
    for (const theme of ['light', 'dark'] as const) {
      const palette = profile.palettes[theme];
      assert.ok(contrastRatio(palette.textAccent, palette.bg) >= 4.5, `${profile.key}/${theme}: texto`);
      assert.ok(contrastRatio(palette.focusAccent, palette.bg) >= 3, `${profile.key}/${theme}: foco`);
    }
  }
});

test('crivo subjects: não expõe o alias legado palette em nenhum perfil público', () => {
  const profiles = [DEFAULT_SUBJECT_PROFILE, ...Object.values(SUBJECT_REGISTRY), getSubjectProfile('Matemática')];
  for (const profile of profiles) assert.equal('palette' in profile, false);
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
