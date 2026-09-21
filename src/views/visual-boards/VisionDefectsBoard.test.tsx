import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import VisionDefectsBoard from './VisionDefectsBoard';

describe('VisionDefectsBoard', () => {
  it('desenha os dois defeitos e suas correções em relação à retina', () => {
    const summary = interactiveSummaries.find(item => item.id === 'summary-fisica-optica-da-visao');
    const view = render(<VisionDefectsBoard map={buildVisualMap(summary!)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByRole('img', { name: /miopia e hipermetropia/i })).toBeInTheDocument();
    expect(screen.getAllByText('foco antes da retina').length).toBeGreaterThan(0);
    expect(screen.getAllByText('foco depois da retina').length).toBeGreaterThan(0);
    expect(view.container.querySelectorAll('[data-vision-defect]').length).toBe(2);
  });
});
