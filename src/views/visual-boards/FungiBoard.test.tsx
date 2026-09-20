import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import FungiBoard from './FungiBoard';

describe('FungiBoard', () => {
  it('explica o fluxo material do micélio e liga a diversidade a um nó do capítulo', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'summary-biologia-fungos')!;
    const map = buildVisualMap(summary);
    const onSelect = vi.fn();
    render(<FungiBoard map={map} states={{}} selectedId={null} onSelect={onSelect} hiddenEdgeIds={[]} mode="explorar" />);

    expect(screen.getByRole('img', { name: /micélio.*enzimas no solo.*micorriza/i })).toBeInTheDocument();
    expect(screen.getByText(/O fungo começa onde você não vê/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /O grupo se reconhece pela estrutura reprodutiva/i }));
    expect(onSelect).toHaveBeenCalledWith(map.nodes[1].id);
  });
});
