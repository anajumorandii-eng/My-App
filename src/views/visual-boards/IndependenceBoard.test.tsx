import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import IndependenceBoard from './IndependenceBoard';

describe('IndependenceBoard', () => {
  it('mantém guerras e continuidades na mesma leitura do processo de independência', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'summary-historia-a-independencia-do-brasil')!;
    const map = buildVisualMap(summary); const onSelect = vi.fn();
    render(<IndependenceBoard map={map} states={{}} selectedId={null} onSelect={onSelect} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByRole('img', { name: /Cortes recolonizadoras.*consolidação da Bahia.*escravidão, terra concentrada e monarquia/i })).toBeInTheDocument();
    expect(screen.getByText(/7 de setembro é uma passagem no processo/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /1822 não encerra o processo/i }));
    expect(onSelect).toHaveBeenCalledWith(map.nodes[1].id);
  });
});
