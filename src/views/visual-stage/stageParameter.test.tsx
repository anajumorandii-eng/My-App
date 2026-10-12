import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { biologyRemainingInstrument } from '../visual-instruments/BiologyRemainingInstrument';
import { chemistryInstrument } from '../visual-instruments/ChemistryInstrument';
import type { BoardProps } from '../visual-boards/types';

function props(id: string, over: Partial<BoardProps> = {}): BoardProps {
  const summary = interactiveSummaries.find((item) => item.id === id)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar', activeStep: 0, onStepChange: vi.fn(), ...over };
}

describe('palco → laboratórios de Química e Biologia', () => {
  it('Poríferos e Cnidários: a etapa leva o cursor ao grupo que o texto dela trata', () => {
    const Board = biologyRemainingInstrument('cnidarians');
    const id = 'summary-biologia-poriferos-e-cnidarios';
    const view = render(<Board {...props(id)} />);
    const cursor = () => (screen.getByRole('slider') as HTMLInputElement).value;
    expect(cursor()).toBe('0');
    view.rerender(<Board {...props(id, { activeStep: 1 })} />);
    expect(cursor()).toBe('1');
    expect(screen.getByRole('group', { name: 'Etapa no palco' })).toHaveTextContent('cnidário: tecidos verdadeiros');
  });

  it('número citado na etapa move o cursor contínuo; a estudante ainda move à mão', () => {
    const Board = chemistryInstrument('formula');
    const id = 'summary-quimica-determinacao-de-formulas-quimicas';
    const view = render(<Board {...props(id)} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(screen.getByRole('group', { name: 'Etapa no palco' })).toHaveTextContent('não cita um valor');
    view.rerender(<Board {...props(id, { activeStep: 4 })} />);
    expect(slider.value).toBe('180');
    fireEvent.change(slider, { target: { value: '90' } });
    expect(slider.value).toBe('90');
  });

  it('Reconstruir pede ação no laboratório e não abre segunda porta de resposta', () => {
    const Board = biologyRemainingInstrument('cnidarians');
    render(<Board {...props('summary-biologia-poriferos-e-cnidarios', { mode: 'reconstruir' })} />);
    expect(screen.getByRole('note')).toHaveTextContent('escreva, na reconstrução do painel');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('fora do palco (sem etapa), o laboratório não mostra a faixa', () => {
    const Board = biologyRemainingInstrument('cnidarians');
    render(<Board {...props('summary-biologia-poriferos-e-cnidarios', { activeStep: undefined, onStepChange: undefined })} />);
    expect(screen.queryByRole('group', { name: 'Etapa no palco' })).toBeNull();
  });
});
