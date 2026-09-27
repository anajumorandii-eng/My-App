import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LITERARY_TRAITS, type LiteraryTraitId } from '../../lib/literaryTraitLab';
import { LITERARY_FACET_ICONS } from './LiteraryFacetIcons';
import { literaryAuthorInstrument } from './LiteraryAuthorInstrument';
import { LITERARY_AUTHORS, type LiteraryAuthorId } from '../../lib/literaryAuthorLab';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';

const html = (el: React.ReactNode) => { const { container, unmount } = render(<svg>{el}</svg>); const h = container.innerHTML; unmount(); return h; };

// Auditoria 35: 22 estéticas desenhadas como três retângulos iguais e seis
// autores com a mesma ficha — Clarice e Machado eram visualmente idênticos.
describe('Literatura: desenho por faceta e por autor', () => {
  it('toda estética tem três desenhos, e nenhum se repete entre capítulos', () => {
    const ids = Object.keys(LITERARY_TRAITS) as LiteraryTraitId[];
    const todos = ids.flatMap((id) => {
      expect(LITERARY_FACET_ICONS[id], id).toHaveLength(LITERARY_TRAITS[id].cases.length);
      return LITERARY_FACET_ICONS[id].map((icone) => html(icone));
    });
    expect(new Set(todos).size).toBe(todos.length);
  });

  it('as fichas de autor deixam de ser idênticas', () => {
    const ids = Object.keys(LITERARY_AUTHORS) as LiteraryAuthorId[];
    const cenas = ids.map((id) => {
      const Board = literaryAuthorInstrument(id);
      const chapter = interactiveSummaries.find((s) => s.id === LITERARY_AUTHORS[id].chapterId)!;
      const { container, unmount } = render(<Board map={buildVisualMap(chapter)} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode="explorar" />);
      const svg = container.querySelector('svg.vs-plane')!.innerHTML.replace(/aria-label="[^"]*"|data-literary-author="[^"]*"|<text[^>]*>[^<]*<\/text>/g, '');
      unmount();
      return svg;
    });
    expect(new Set(cenas).size).toBe(ids.length);
  });
});
