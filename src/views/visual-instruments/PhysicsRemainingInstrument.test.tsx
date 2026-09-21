import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { physicsRemainingInstrument } from './PhysicsRemainingInstrument';
import type { PhysicsRemainingId } from '../../lib/physicsRemainingLab';

const props = (id: string) => ({ map: buildVisualMap(interactiveSummaries.find(item => item.id === id)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const });

describe('instrumento de ondas e física moderna', () => {
  it('expõe uma cena e um controle de faixa para cada capítulo', () => {
    const chapters: Array<[PhysicsRemainingId, string]> = [
      ['echo', 'summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas'],
      ['diffraction', 'summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia'],
      ['tube-harmonics', 'summary-fisica-ondas-estacionarias-em-tubos'],
      ['quantum-photon', 'summary-fisica-nocoes-basicas-de-fisica-quantica'],
    ];
    for (const [id, chapter] of chapters) { const Component = physicsRemainingInstrument(id); const view = render(<Component {...props(chapter)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); }
  });

  it('recalcula a distância quando o eco demora mais para voltar', () => {
    const Component = physicsRemainingInstrument('echo');
    render(<Component {...props('summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.4' } });
    expect(screen.getAllByText('68 m').length).toBeGreaterThan(0);
  });
});
