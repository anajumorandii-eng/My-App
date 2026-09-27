import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { quantitiesInstrument } from './QuantitiesInstrument';
import type { QuantitiesConfigId } from '../../lib/quantitiesLab';

const cases: [QuantitiesConfigId, string, string][] = [
  ['razao', 'Razão e Proporção', '4/10 = 8/20'],
  ['porcentagem', 'Porcentagem', '30% = 30/100 = 0,3'],
  ['decimal', 'O Sistema de Numeração Decimal', '3 × 1000 = 3000'],
  ['inteiros', 'Introdução à Teoria dos Números Inteiros', '21 + 2 = 23'],
  ['medias', 'Médias', '6 + 8 + 8 + 8'],
];
describe('cinco mecanismos quantitativos', () => {
  for (const [id, topic, relation] of cases) it(`desenha a relação de ${topic}`, () => {
    const chapter = interactiveSummaries.find(s => s.subject === 'Matemática' && s.topic.toLowerCase() === topic.toLowerCase())!;
    const Component = quantitiesInstrument(id);
    const view = render(<Component map={buildVisualMap(chapter)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByRole('img').textContent).toContain(relation);
    if (id === 'inteiros') {
      fireEvent.change(screen.getByRole('slider'), { target: { value: '-8' } });
      expect(screen.getByRole('img').textContent).toContain('−14 + 6 = −8');
    }
    view.unmount();
  });
});
