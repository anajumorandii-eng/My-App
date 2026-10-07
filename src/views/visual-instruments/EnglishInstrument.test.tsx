import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { ENGLISH_INSTRUMENTS, type EnglishInstrumentId } from '../../lib/englishInstrumentLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { englishInstrument } from './EnglishInstrument';
import { findInstrument } from './registry';

const CHAPTERS: Array<[EnglishInstrumentId, string]> = [
  ['poetry-reading', 'summary-lingua-inglesa-text-comprehension-songs-and-poems'],
  ['quantity-language', 'summary-lingua-inglesa-text-comprehension-calories-and-energy'],
  ['modal-certainty', 'summary-lingua-inglesa-text-comprehension-earthquakes'],
  ['cause-connectors', 'summary-lingua-inglesa-text-comprehension-ecology-greenhouse-gases'],
  ['research-claims', 'summary-lingua-inglesa-text-comprehension-the-human-brain'],
];

function props(summaryId: string) {
  const summary = interactiveSummaries.find(item => item.id === summaryId);
  if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos de leitura em inglês', () => {
  it('renderiza cinco cenas linguísticas com seletor acessível', () => {
    for (const [id, summaryId] of CHAPTERS) {
      const Component = englishInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('preserva a diferença entre possibilidade, expectativa e previsão categórica', () => {
    const Component = englishInstrument('modal-certainty');
    render(<Component {...props('summary-lingua-inglesa-text-comprehension-earthquakes')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getAllByText('is expected to').length).toBeGreaterThan(0);
    expect(screen.getAllByText('expectativa fundamentada').length).toBeGreaterThan(0);
  });

  it('expõe a generalização causal como pegadinha de leitura científica', () => {
    const Component = englishInstrument('research-claims');
    render(<Component {...props('summary-lingua-inglesa-text-comprehension-the-human-brain')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('causalidade direta').length).toBeGreaterThan(0);
    expect(screen.getByText('afirmar causalidade sem evidência de um desenho causal')).toBeInTheDocument();
    expect(screen.getByText('Inadequada: o desenho observacional não demonstra causalidade.')).toBeInTheDocument();
  });
});

const THEMATIC_CHAPTERS: Array<[EnglishInstrumentId, string]> = [
  ...CHAPTERS,
  ['hurricane-forecast', 'hurricanes'], ['pollution-connectors', 'pollution'],
  ['warming-evidence', 'global-warming'], ['narrative-inference', 'novels-short-stories'],
  ['bacteria-context', 'bacteria'], ['comparison-signals', 'viruses'],
  ['stance-language', 'discrimination-against-women'], ['empowerment-language', 'women-empowerment'],
  ['digital-conditions', 'digital-technology'], ['probiotic-evidence', 'health-probiotics'],
  ['stem-cell-trials', 'stem-cells'], ['taxonomy-hierarchy', 'taxonomy-and-terminology'],
].map(([id, chapter]) => [id, chapter.startsWith('summary-') ? chapter : `summary-lingua-inglesa-text-comprehension-${chapter}`]) as Array<[EnglishInstrumentId, string]>;

describe('evidência e mecanismo dos 17 capítulos LG2', () => {
  it.each(THEMATIC_CHAPTERS)('%s altera trecho, destaques, achado e cena em cada posição do controle', async (id, chapter) => {
    const summary=interactiveSummaries.find(item=>item.id===chapter)!;
    const entry=findInstrument(summary);
    expect(entry, `instrumento publicado de ${chapter}`).toBeDefined();
    const Component = entry!.Component;
    const view = render(<Component {...props(chapter)} />);
    await act(async () => { await vi.dynamicImportSettled(); });
    await waitFor(() => expect(view.container.querySelector('[data-english-scene]')).not.toBeNull());
    const figure = view.container.querySelector('[data-english-scene]');
    expect(figure).not.toBeNull();
    for (const [index, state] of ENGLISH_INSTRUMENTS[id].states.entries()) {
      fireEvent.change(screen.getByRole('slider'), { target: { value: String(index) } });
      expect(figure).toHaveAttribute('data-state', String(index));
      expect(figure?.querySelector('blockquote')?.textContent).toBe(state.example);
      expect(Array.from(figure!.querySelectorAll('mark')).map(mark => mark.textContent)).toEqual(expect.arrayContaining(state.evidence));
      expect(figure?.querySelector('[data-evidence-finding]')).toHaveTextContent(state.annotation);
      expect(screen.getByRole('img')).toHaveAccessibleName(expect.stringContaining(state.reading));
      expect(view.container.querySelector('[data-mechanism-state]')).toHaveAttribute('data-mechanism-state', String(index));
      expect(figure?.querySelector('blockquote')).not.toHaveAttribute('aria-hidden');
    }
    view.unmount();
  });

  it('preserva seleção de diagnóstico no modo reconstruir', () => {
    const Component = englishInstrument('taxonomy-hierarchy');
    const boardProps = { ...props('summary-lingua-inglesa-text-comprehension-taxonomy-and-terminology'), mode: 'reconstruir' as const };
    const view = render(<Component {...boardProps} />);
    fireEvent.click(view.container.querySelector('.vs-concept-card')!);
    expect(boardProps.onSelect).toHaveBeenCalledWith(boardProps.map.nodes[1].id);
  });
});

it('mostra todos os estados completos com movimento reduzido', () => {
  const previous = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({ matches: query.includes('prefers-reduced-motion'), media: query, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  const Component = englishInstrument('digital-conditions');
  const view = render(<Component {...props('summary-lingua-inglesa-text-comprehension-digital-technology')} />);
  for (const index of [0, 1, 2]) {
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(index) } });
    const figure = view.container.querySelector('[data-english-scene]')!;
    expect(figure.querySelector('blockquote')).toHaveTextContent(ENGLISH_INSTRUMENTS['digital-conditions'].states[index].example);
    expect(figure.querySelector('svg path.english-relation')).toBeInTheDocument();
    expect(figure.querySelector('figcaption')).toHaveTextContent(ENGLISH_INSTRUMENTS['digital-conditions'].states[index].annotation);
  }
  view.unmount();
  window.matchMedia = previous;
});
