import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualMap } from '../lib/visualStudy';
import { VisualArtifact } from './VisualArtifact';

const summary = interactiveSummaries.find(item => item.id === 'summary-biologia-biotecnologia')!;
const props = {
  summary, representation: 'instrument' as const, map: buildVisualMap(summary),
  states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [],
  mode: 'explorar' as const, activeIndex: 0, onSelectStep: vi.fn(),
};

describe('Esquema de Biotecnologia', () => {
  it('oferece uma única passagem para a leitura sem repetir a pergunta do desafio', () => {
    const read = vi.fn(), practice = vi.fn();
    render(<VisualArtifact {...props} onReadStep={read} onPractice={practice} />);
    const bridge = screen.getByRole('region', { name: 'Continuar o estudo' });
    expect(within(bridge).queryByText(props.map.recallPrompt!)).not.toBeInTheDocument();
    expect(within(bridge).getAllByRole('button')).toHaveLength(1);
    fireEvent.click(within(bridge).getByRole('button', { name: 'Continuar na leitura' }));
    expect(read).toHaveBeenCalledOnce();
    expect(practice).not.toHaveBeenCalled();
  });
  it('oferece os assuntos do capítulo sem repetir o laboratório da PCR', () => {
    render(<VisualArtifact {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Esquema' }));
    const outline = screen.getByRole('navigation', { name: 'Assuntos do capítulo' });
    const steps = within(outline).getAllByRole('button');
    expect(steps).toHaveLength(5);
    expect(steps[0]).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByText('Amplificação por PCR')).not.toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    expect(screen.queryByText('Resultado do modelo')).not.toBeInTheDocument();
    fireEvent.click(steps[2]);
    expect(props.onSelectStep).toHaveBeenCalledWith(2);
  });

  it('acompanha a etapa da leitura e permite voltar à cena imersiva', async () => {
    const view = render(<VisualArtifact {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Esquema' }));
    view.rerender(<VisualArtifact {...props} activeIndex={2} />);
    expect(within(screen.getByRole('navigation', { name: 'Assuntos do capítulo' })).getAllByRole('button')[2]).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: 'Cena 3D' }));
    expect(await screen.findByRole('region', { name: 'Cena imersiva: reação em cadeia da polimerase' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Assuntos do capítulo' })).not.toBeInTheDocument();
  });
});
