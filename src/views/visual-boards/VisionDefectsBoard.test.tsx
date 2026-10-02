import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import VisionDefectsBoard from './VisionDefectsBoard';

describe('VisionDefectsBoard', () => {
  const map = buildVisualMap(interactiveSummaries.find(item => item.id === 'summary-fisica-optica-da-visao')!);
  const show = (selectedId: string | null = null) => render(<VisionDefectsBoard map={map} states={{}} selectedId={selectedId} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);

  it.each([null, map.nodes[1].id, map.nodes[2].id])('mantém os dois olhos legíveis com seleção %s', (selectedId) => {
    const view = show(selectedId);
    for (const eye of view.container.querySelectorAll('[data-vision-defect]')) {
      expect(Number(eye.getAttribute('opacity') ?? 1)).toBe(1);
    }
  });

  it('não desenha lente corretiva no estado sem correção', () => {
    show();
    expect(screen.getByRole('img').querySelectorAll('path[fill*="--vs-burgundy"]')).toHaveLength(0);
  });

  it('leva os dois focos à curva da retina ao aplicar as lentes corretivas', () => {
    const view = show();
    fireEvent.click(screen.getByRole('button', { name: 'Com correção' }));
    for (const eye of view.container.querySelectorAll('[data-vision-defect]')) {
      const retina = eye.querySelector('path[stroke-width="6"]')!.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
      const retinalAxis = (retina[0] + 2 * retina[2] + retina[4]) / 4;
      const cross = Array.from(eye.querySelectorAll('path')).find(path => /128\s*V172/.test(path.getAttribute('d') ?? ''))!;
      const focus = Number(cross.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)![0]);
      expect(focus).toBeCloseTo(retinalAxis, 6);
    }
    expect(screen.getByRole('img').querySelectorAll('path[fill*="--vs-burgundy"]')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Com correção' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Sem correção' }));
    expect(screen.getByRole('img').querySelectorAll('path[fill*="--vs-burgundy"]')).toHaveLength(0);
  });

  it('desenha os dois defeitos e suas correções em relação à retina', () => {
    const summary = interactiveSummaries.find(item => item.id === 'summary-fisica-optica-da-visao');
    const view = render(<VisionDefectsBoard map={buildVisualMap(summary!)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByRole('img', { name: /miopia e hipermetropia/i })).toBeInTheDocument();
    expect(screen.getAllByText('foco antes da retina').length).toBeGreaterThan(0);
    expect(screen.getAllByText('foco depois da retina').length).toBeGreaterThan(0);
    expect(view.container.querySelectorAll('[data-vision-defect]').length).toBe(2);
  });
});
