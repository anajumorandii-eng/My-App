import { describe, expect, it } from 'vitest';
import { routePresentationFor } from './routePresentation';

describe('routePresentationFor', () => {
  it('makes only Hoje immersive', () => {
    expect(routePresentationFor('/').immersive).toBe(true);
    expect(routePresentationFor('/sessao').immersive).toBe(false);
    expect(routePresentationFor('/diagnostico').immersive).toBe(false);
  });
});
