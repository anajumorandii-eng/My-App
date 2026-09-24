import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EcologyCycles } from './EcologyCycles';
import { biologia } from '../data/biologia';

afterEach(() => vi.useRealTimers());
const entry = biologia.find(item => item.chapterId === 'bio-ecologia-eutrofizacao')!;

describe('reprodução do mecanismo ecológico', () => {
  it('avança a seleção real e para no final sem reiniciar sozinho', () => {
    vi.useFakeTimers();
    render(<EcologyCycles entry={entry}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir etapas' }));
    for (let i = 1; i < entry.items.length; i++) {
      act(() => vi.advanceTimersByTime(4200));
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining(entry.items[i].label));
    }
    act(() => vi.advanceTimersByTime(4200));
    expect(screen.getByRole('button', { name: 'Reproduzir etapas' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('Mortandade'));
  });

  it('a escolha manual interrompe a reprodução e mantém o lastro da etapa escolhida', () => {
    vi.useFakeTimers();
    render(<EcologyCycles entry={entry}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir etapas' }));
    fireEvent.click(screen.getByRole('button', { name: /Bloqueio da luz/ }));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('Bloqueio da luz'));
    expect(screen.getByRole('status')).toHaveTextContent(entry.items[1].quote);
    expect(screen.getByRole('button', { name: 'Reproduzir etapas' })).toHaveAttribute('aria-pressed', 'false');
  });
});
