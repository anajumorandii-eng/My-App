import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { electricInstrument } from './ElectricInstrument';
import type { ElectricId } from '../../lib/electricLab';

function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de eletrodinâmica', () => {
  it('expõe controles nativos nos cinco capítulos elétricos', () => {
    const chapters: Array<[ElectricId, string]> = [['current', 'summary-fisica-corrente-eletrica'], ['power', 'summary-fisica-potencia-eletrica'], ['resistor', 'summary-fisica-resistores'], ['kirchhoff', 'summary-fisica-eletrodinamica-as-leis-de-kirchhoff'], ['capacitor', 'summary-fisica-capacitores']];
    for (const [id, summaryId] of chapters) { const Component = electricInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); expect(screen.getByRole('img')).toBeInTheDocument(); view.unmount(); }
  });
  it('recalcula a corrente quando a resistência muda', () => { const Component = electricInstrument('resistor'); render(<Component {...props('summary-fisica-resistores')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '6' } }); expect(screen.getAllByText('2 A').length).toBeGreaterThan(0); });
});
