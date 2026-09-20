import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { electrostaticsInstrument } from './ElectrostaticsInstrument';
import type { ElectrostaticsId } from '../../lib/electrostaticsLab';
function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de eletrostática', () => {
  it('dá a cada um dos cinco fenômenos um controle acessível', () => { const chapters: Array<[ElectrostaticsId, string]> = [['coulomb', 'summary-fisica-forca-eletrica-lei-de-coulomb'], ['field', 'summary-fisica-campo-eletrico'], ['potential', 'summary-fisica-energia-potencial-e-potencial-eletrico'], ['uniform-field', 'summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial'], ['charge-dynamics', 'summary-fisica-dinamica-das-cargas-eletricas']]; for (const [id, summaryId] of chapters) { const Component = electrostaticsInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); } });
  it('atualiza a queda de potencial entre placas', () => { const Component = electrostaticsInstrument('uniform-field'); render(<Component {...props('summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '5' } }); expect(screen.getAllByText('20 V').length).toBeGreaterThan(0); });
});
