import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import EnzymeBoard from './EnzymeBoard';

describe('EnzymeBoard', () => {
  it('liga encaixe e desnaturação aos nós rastreáveis do capítulo', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'summary-biologia-proteinas-enzimas')!;
    const map = buildVisualMap(summary);
    const onSelect = vi.fn();
    render(<EnzymeBoard map={map} states={{}} selectedId={null} onSelect={onSelect} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByRole('img', { name: /recebendo um substrato.*energia de ativação/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Encaixe induzido/i }));
    expect(onSelect).toHaveBeenCalledWith(map.nodes[1].id);
  });
});
