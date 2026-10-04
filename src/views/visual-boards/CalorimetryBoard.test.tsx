import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import CalorimetryBoard from './CalorimetryBoard';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
it('distingue temperatura de energia em trânsito e desenha três mecanismos de transferência completos', () => {
  const summary = interactiveSummaries.find(item => item.id === 'fis-termologia-calor')!;
  const { container } = render(<CalorimetryBoard map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
  expect(screen.getByText(/Calor: energia em trânsito/)).toBeInTheDocument();
  expect(screen.getByText(/Temperatura: estado térmico/)).toBeInTheDocument();
  expect(screen.getByText(/273,15 K/)).toBeInTheDocument();
  for (const kind of ['conduction', 'convection', 'radiation']) {
    const mechanism = container.querySelector(`[data-heat-transfer="${kind}"]`)!;
    expect(mechanism).not.toBeNull();
    expect(mechanism.querySelector('[marker-end]')).not.toBeNull();
  }
  const current = container.querySelector('[data-heat-transfer="convection"]')!;
  expect(current).toHaveTextContent('quente sobe');
  expect(current).toHaveTextContent('frio desce');
  expect(container.querySelector('[data-heat-transfer="radiation"]')).toHaveTextContent('vácuo');
  expect(screen.getByText(/água pura a 1 atm/i)).toBeInTheDocument();
  expect(screen.getByText(/Q em escala esquemática/i)).toBeInTheDocument();
});
