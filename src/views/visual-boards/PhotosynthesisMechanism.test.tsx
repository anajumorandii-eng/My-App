import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PhotosynthesisMechanism from './PhotosynthesisMechanism';

vi.mock('motion/react', async importOriginal => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, useReducedMotion: () => true };
});

describe('Bioenergética em movimento reduzido', () => {
  it('mantém os fluxos completos e troca o cloroplasto pelo procarionte na quimiossíntese', () => {
    const { container } = render(<PhotosynthesisMechanism />);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('Cloroplasto');
    const flows = container.querySelectorAll('path[pathLength]');
    expect(flows.length).toBeGreaterThan(0);
    flows.forEach(path => {
      expect(path.getAttribute('stroke-dasharray')).toBe('1 1');
      expect(path.getAttribute('stroke-dashoffset')).toBe('0');
    });
    fireEvent.click(screen.getByRole('button', { name: /Fixação de carbono/ }));
    expect(screen.getByRole('status').textContent).toContain('depende dos produtos das reações fotoquímicas');
    fireEvent.click(screen.getByRole('button', { name: /Quimiossíntese/ }));
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('Procarionte');
    expect(screen.getByRole('status').textContent).toContain('sem luz e sem cloroplasto');
    expect(screen.queryByText('grana · tilacoides')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Repetir os fluxos' }));
    expect(screen.getByRole('button', { name: /Quimiossíntese/ }).getAttribute('aria-pressed')).toBe('true');
  });
});
