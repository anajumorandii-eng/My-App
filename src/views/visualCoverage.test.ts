import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { visualCoverageFor, type VisualCoverageKind } from './visualCoverage';

const KINDS: VisualCoverageKind[] = [
  'illustrated-board',
  'interactive-experiment',
  'anchor-scene',
  'instrument',
  'fallback',
];

describe('visualCoverageFor', () => {
  it('classifica todos os capítulos em exatamente uma forma de cobertura', () => {
    const counts = Object.fromEntries(KINDS.map(kind => [kind, 0])) as Record<VisualCoverageKind, number>;
    for (const summary of interactiveSummaries) counts[visualCoverageFor(summary).kind] += 1;
    expect(Object.values(counts).reduce((sum, value) => sum + value, 0)).toBe(interactiveSummaries.length);
  });

  it('não chama fallback de visual dedicado', () => {
    const summary = interactiveSummaries.find(item => item.id === 'atu-cop30-belem')!;
    expect(visualCoverageFor(summary)).toEqual({ kind: 'fallback', id: null, dedicated: false });
  });

  it('reconhece experimento registrado por id exato', () => {
    const summary = interactiveSummaries.find(
      item => item.id === 'summary-redacao-projeto-de-texto-em-favor-da-progressao-textual',
    )!;
    const coverage = visualCoverageFor(summary);
    expect(coverage.kind).toBe('interactive-experiment');
    expect(coverage.id).toBe('argument');
    expect(coverage.dedicated).toBe(true);
  });
});
