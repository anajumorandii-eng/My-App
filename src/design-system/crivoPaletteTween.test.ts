import assert from 'node:assert/strict';
import test from 'node:test';
import { lerpColor, pickContrastTextColor, relLuminance, tweenPalette } from './crivoPaletteTween';
import type { CrivoPalette } from './crivoSubjects';

const dark: CrivoPalette = { bg:'#000000', surface:'#000000', primary:'#000000', secondary:'#000000', emissive:'#000000', textHighlight:'#000000', dataPositive:'#000000', dataWarning:'#000000', atmoA:'#000000', atmoB:'#000000' };
const light: CrivoPalette = { bg:'#FFFFFF', surface:'#FFFFFF', primary:'#FFFFFF', secondary:'#FFFFFF', emissive:'#FFFFFF', textHighlight:'#FFFFFF', dataPositive:'#FFFFFF', dataWarning:'#FFFFFF', atmoA:'#FFFFFF', atmoB:'#FFFFFF' };

test('crivo palette: interpola uma cor e todos os dez tokens em cada frame', () => {
  assert.equal(lerpColor('#000000', '#FFFFFF', 0.5), '#808080');
  assert.equal(tweenPalette(dark, light, 0.25).atmoB, '#404040');
  assert.equal(Object.keys(tweenPalette(dark, light, 0.5)).length, 10);
});

test('crivo palette: escolhe texto de contraste discretamente pela luminância relativa', () => {
  assert.equal(relLuminance('#000000'), 0);
  assert.equal(pickContrastTextColor('#111111'), '#FFFFFF');
  assert.equal(pickContrastTextColor('#F1EFE9'), '#000000');
});

test('crivo palette: normaliza progresso não finito sem propagar NaN', () => {
  assert.equal(lerpColor('#000000', '#FFFFFF', Number.NaN), '#000000');
  assert.equal(tweenPalette(dark, light, Number.POSITIVE_INFINITY).primary, '#FFFFFF');
  assert.equal(tweenPalette(dark, light, Number.NEGATIVE_INFINITY).primary, '#000000');
});
