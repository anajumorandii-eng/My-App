import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './ui/Button';
import { Panel } from './ui/Panel';
import { MenuBase } from './ui/MenuBase';
vi.mock('motion/react', async (original) => ({
  ...await original<typeof import('motion/react')>(), useReducedMotion: () => true,
}));
describe('shared controls with reduced motion', () => {
  it('renders chemistry content without blur or travel', () => {
    render(<Panel subject="Química" initial="hidden" animate="visible">Conteúdo legível</Panel>);
    expect(screen.getByText('Conteúdo legível')).toHaveStyle({ opacity: '1', filter: 'none' });
  });
  it('opens readable menu items and executes their action', () => {
    const action = vi.fn();
    render(<MenuBase subject="Química" trigger={<button>Abrir</button>}
      items={[{ id: 'review', label: 'Revisar agora', onClick: action }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const item = screen.getByRole('button', { name: 'Revisar agora' });
    expect(item).toHaveStyle({ opacity: '1', filter: 'none' });
    fireEvent.click(item);
    expect(action).toHaveBeenCalledTimes(1);
  });
  it('blocks duplicate submissions with a static loading indicator', () => {
    const action = vi.fn();
    render(<Button loading onClick={action}>Salvar</Button>);
    const button = screen.getByRole('button', { name: 'Salvar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('svg')).toHaveClass('motion-reduce:animate-none');
    fireEvent.click(button);
    expect(action).not.toHaveBeenCalled();
  });
});
