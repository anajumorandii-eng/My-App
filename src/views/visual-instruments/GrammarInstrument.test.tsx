import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import type { GrammarInstrumentId } from '../../lib/grammarInstrumentLab';
import { grammarInstrument } from './GrammarInstrument';

function props(summaryId: string) {
  const summary = interactiveSummaries.find((item) => item.id === summaryId);
  if (!summary) throw new Error(`Resumo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos de Gramática', () => {
  it('renderiza cinco operações linguísticas com controle acessível', () => {
    const chapters: Array<[GrammarInstrumentId, string]> = [
      ['noun-phrase', 'summary-gramatica-artigo-numeral-e-adjetivo-no-sintagma-nominal'],
      ['agreement', 'summary-gramatica-concordancia'],
      ['comma-scope', 'summary-gramatica-pontuacao-i-principios-para-o-uso-da-virgula'],
      ['crasis', 'summary-gramatica-crase'],
      ['verbal-voice', 'summary-gramatica-vozes-verbais'],
    ];
    for (const [id, summaryId] of chapters) {
      const Component = grammarInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });
  it('mostra que o par de vírgulas amplia o alcance da afirmação', () => {
    const Component = grammarInstrument('comma-scope');
    render(<Component {...props('summary-gramatica-pontuacao-i-principios-para-o-uso-da-virgula')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getByText('todos os alunos')).toBeInTheDocument();
    expect(screen.getAllByText('Os alunos, que estudaram, passaram.').length).toBeGreaterThan(0);
  });
  it('distingue crase de artigo feminino sem preposição', () => {
    const Component = grammarInstrument('crasis');
    render(<Component {...props('summary-gramatica-crase')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getAllByText('o verbo não exige preposição').length).toBeGreaterThan(0);
  });
});
