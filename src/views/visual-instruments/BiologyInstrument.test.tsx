import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { BiologyInstrumentId } from '../../lib/biologyInstrumentLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { biologyInstrument } from './BiologyInstrument';

const CHAPTERS: Array<[BiologyInstrumentId, string]> = [['nucleic-acids', 'summary-biologia-acidos-nucleicos'], ['linkage', 'summary-biologia-ligacao-genica'], ['circulation', 'summary-biologia-coracao-e-vasos-sanguineos'], ['respiration', 'summary-biologia-fisiologia-da-respiracao'], ['plant-hormones', 'summary-biologia-fisiologia-vegetal-hormonios-vegetais']];
function props(summaryId: string) { const summary = interactiveSummaries.find((item) => item.id === summaryId); if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`); return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumentos de biologia', () => {
  it('renderiza cinco mecanismos com controle acessível', () => { for (const [id, summaryId] of CHAPTERS) { const Component = biologyInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toHaveAccessibleName(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); } });
  it('recalcula o gradiente alvéolo-capilar', () => { const Component = biologyInstrument('respiration'); render(<Component {...props('summary-biologia-fisiologia-da-respiracao')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } }); expect(screen.getAllByText('40 mmHg').length).toBeGreaterThan(0); });
});
