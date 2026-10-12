import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import HeartMechanism from '../visual-boards/HeartMechanism';
import AcidTheoryMechanism from '../visual-boards/AcidTheoryMechanism';
import { findBoard } from '../visual-boards/registry';
import type { BoardProps } from '../visual-boards/types';

function props(id: string, over: Partial<BoardProps> = {}): BoardProps {
  const summary = interactiveSummaries.find((item) => item.id === id)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar', activeStep: 0, onStepChange: vi.fn(), ...over };
}

describe('palco → pranchas de Biologia e Química', () => {
  it('Coração: a etapa de vasos abre os capilares e o modelo de área; tocar numa câmara explica com o capítulo', () => {
    const id = 'summary-biologia-coracao-e-vasos-sanguineos';
    const summary = interactiveSummaries.find((item) => item.id === id)!;
    const view = render(<HeartMechanism stage={props(id)} />);
    expect(screen.queryByRole('region', { name: /área vascular/ })).toBeNull();
    view.rerender(<HeartMechanism stage={props(id, { activeStep: 1 })} />);
    expect(screen.getByRole('region', { name: /área vascular/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ventrículo esquerdo' }));
    const frase = view.container.querySelector('.vs-heart-explain p')!.textContent!;
    expect(summary.sections.some((section) => section.content.includes(frase))).toBe(true);
  });

  it('Coração fora do palco continua desenho (img) sem camada de toque', () => {
    render(<HeartMechanism />);
    expect(screen.getByRole('img', { name: /Circulação humana/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aorta' })).toBeNull();
  });

  it('Teorias ácido-base: trocar de etapa troca a teoria aberta', () => {
    const summary = interactiveSummaries.find((item) => findBoard(item)?.id === 'acido-base')!;
    const view = render(<AcidTheoryMechanism stage={props(summary.id)} />);
    const abertos = new Set<string>();
    for (let step = 0; step < summary.sections.length; step++) {
      view.rerender(<AcidTheoryMechanism stage={props(summary.id, { activeStep: step })} />);
      const grupo = screen.getByRole('group', { name: 'Teoria ou representação' });
      grupo.querySelectorAll('[aria-pressed="true"]').forEach((b) => abertos.add(b.textContent ?? ''));
    }
    expect(abertos.size).toBeGreaterThan(1);
  });
});
