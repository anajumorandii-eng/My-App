import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { topicExperiments } from './topic-experiments/catalog';
import { sceneFor } from './topic-scenes/sceneFor';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';
import { resolveVisualRepresentation } from './visualRepresentation';

describe('resolveVisualRepresentation', () => {
  it('prefere um experimento de capítulo exato a representações por palavra-chave', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'bio-ecologia-introducao')!;
    expect(resolveVisualRepresentation(summary)).toBe('experiment');
  });

  it('mantém prancha e instrumento como artefatos únicos quando são o melhor encaixe', () => {
    const board = interactiveSummaries.find((item) => findBoard(item) && !topicExperiments[item.id])!;
    const instrument = interactiveSummaries.find((item) => findInstrument(item) && !findBoard(item) && !topicExperiments[item.id])!;
    expect(resolveVisualRepresentation(board)).toBe('board');
    expect(resolveVisualRepresentation(instrument)).toBe('instrument');
  });

  it('recorre à cena exata e depois ao fallback, sem reutilizar uma prancha alheia', () => {
    const scene = interactiveSummaries.find((item) => sceneFor(item.id) && !findBoard(item) && !findInstrument(item) && !topicExperiments[item.id])!;
    // A referência deve permanecer uma lacuna real; Física recebeu
    // instrumentos dedicados nesta rodada.
    const fallback = interactiveSummaries.find((item) => item.id === 'summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao')!;
    expect(resolveVisualRepresentation(scene)).toBe('scene');
    expect(resolveVisualRepresentation(fallback)).toBe('fallback');
  });
});
