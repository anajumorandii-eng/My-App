import { describe, expect, it } from 'vitest';
import { routePresentationFor } from './routePresentation';
import { PRODUCTION_ROUTE_VISUAL_COUNT, routeVisualFor } from '../../design-system/routeVisuals';

describe('routePresentationFor', () => {
  it('makes only Hoje immersive', () => {
    expect(routePresentationFor('/').immersive).toBe(true);
    expect(routePresentationFor('/sessao').immersive).toBe(false);
    expect(routePresentationFor('/diagnostico').immersive).toBe(false);
  });
});

describe('routeVisualFor', () => {
  it('covers the 28 production screens and keeps work details literary', () => {
    expect(PRODUCTION_ROUTE_VISUAL_COUNT).toBe(28);
    expect(routeVisualFor('/sessao')).toMatchObject({ subject: 'Matemática', kind: 'practice' });
    expect(routeVisualFor('/obras/memorias-postumas')).toMatchObject({ subject: 'Literatura', kind: 'library' });
    expect(routeVisualFor('/admin/conteudo')).toMatchObject({ kind: 'admin' });
  });
});
