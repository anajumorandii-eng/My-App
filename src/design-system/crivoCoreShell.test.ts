import assert from 'node:assert/strict';
import test from 'node:test';
import { drawExternalShell, drawCenterLight, drawScanSweep } from './crivoCoreShell';
import { SUBJECT_REGISTRY } from './crivoSubjects';

function fakeContext() {
  const context: Record<string, unknown> = {};
  const noop = () => undefined;
  const gradient = () => ({ addColorStop: noop });
  Object.assign(context, {
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, ellipse: noop,
    fill: noop, stroke: noop, save: noop, restore: noop, translate: noop, transform: noop,
    createRadialGradient: gradient, createLinearGradient: gradient, createConicGradient: gradient,
  });
  return context;
}

const pose = { cx: 40, cy: 40, baseR: 24, spread: 0.5, glow: 0.6, squashY: 0.85, skewX: -0.15 };

test('crivo core shell: casca externa e luz central não lançam para nenhuma matéria', () => {
  const ctx = fakeContext();
  for (const profile of Object.values(SUBJECT_REGISTRY)) {
    assert.doesNotThrow(() => drawExternalShell(ctx, pose, profile.palette));
    assert.doesNotThrow(() => drawCenterLight(ctx, pose, profile.palette));
  }
});

test('crivo core shell: scan sweep não lança quando createConicGradient existe ou não', () => {
  const ctx = fakeContext();
  assert.doesNotThrow(() => drawScanSweep(ctx, 40, 40, 24, 1.2, SUBJECT_REGISTRY.matematica.palette));
  delete (ctx as Record<string, unknown>).createConicGradient;
  assert.doesNotThrow(() => drawScanSweep(ctx, 40, 40, 24, 1.2, SUBJECT_REGISTRY.matematica.palette));
});
