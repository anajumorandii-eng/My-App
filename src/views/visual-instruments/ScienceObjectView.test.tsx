import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MolecularObjectView } from './ScienceObjectView';
import { biologyInstrument } from './BiologyInstrument';
import AdiabaticBoard from '../visual-boards/AdiabaticBoard';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';

function props(id: string) {
  const summary = interactiveSummaries.find(s => s.id === id)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('objetos de Ciências com profundidade', () => {
  it('conserva geometria e polaridade ao girar e diferencia moléculas simétricas e água', () => {
    render(<MolecularObjectView />);
    fireEvent.click(screen.getByRole('button', { name: 'CH₄' }));
    expect(screen.getByRole('status', { name: 'Leitura molecular' })).toHaveTextContent('tetraédrica · 109,5° · apolar');
    const before = screen.getByRole('status', { name: 'Leitura molecular' }).textContent;
    const geometry = screen.getByRole('img').innerHTML;
    fireEvent.change(screen.getByRole('slider', { name: /Girar a molécula/ }), { target: { value: '140' } });
    expect(screen.getByRole('img').innerHTML).not.toBe(geometry);
    expect(screen.getByRole('status', { name: 'Leitura molecular' }).textContent).toBe(before);
    fireEvent.click(screen.getByRole('button', { name: 'H₂O' }));
    expect(screen.getByRole('status', { name: 'Leitura molecular' })).toHaveTextContent('angular · 104,5° · polar');
    expect(screen.getByRole('status', { name: 'Leitura molecular' })).toHaveTextContent('2 pares livres');
  });

  it('preserva a base entre pareamento e hélice, incluindo RNA e pontes de H', () => {
    const Component = biologyInstrument('nucleic-acids');
    render(<Component {...props('summary-biologia-acidos-nucleicos')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Dupla-hélice 3D' }));
    expect(screen.getByRole('img')).toHaveAccessibleName(/par destacado C–G, 3 pontes.*RNA transcrito: G/);
    const name = screen.getByRole('img').getAttribute('aria-label');
    const geometry = screen.getByRole('img').innerHTML;
    fireEvent.click(screen.getByRole('button', { name: 'Girar +30°' }));
    expect(screen.getByRole('img').innerHTML).not.toBe(geometry);
    expect(screen.getByRole('img')).toHaveAccessibleName(name!);
    fireEvent.click(screen.getByRole('button', { name: /^Pareamento$/ }));
    expect(screen.getByRole('slider')).toHaveValue('2');
    expect(screen.getByRole('img')).toHaveAccessibleName(/DNA complementar: G/);
  });

  it('isola os materiais SVG de duas instâncias do pistão sem IDs duplicados', () => {
    const summary = interactiveSummaries.find(s => s.subject === 'Física' && s.title.toLowerCase().includes('transformações particulares'))!;
    const input = props(summary.id);
    const { container } = render(<><AdiabaticBoard {...input} /><AdiabaticBoard {...input} /></>);
    const ids = Array.from(container.querySelectorAll('.vs-piston defs [id]')).map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(container.querySelectorAll('.vs-piston-casing')).toHaveLength(2);
    expect(container.querySelectorAll('.vs-piston-head')).toHaveLength(2);
  });
});
