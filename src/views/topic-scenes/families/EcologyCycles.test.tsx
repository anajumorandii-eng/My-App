import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { biologia } from '../data/biologia';
import { EcologyCycles } from './EcologyCycles';

const entry = (id: string) => biologia.find(item => item.chapterId === id)!;

describe('ciclos ecológicos', () => {
  it('localiza a conversão microbiana e a volta do nitrato à atmosfera', async () => {
    const user = userEvent.setup();
    render(<EcologyCycles entry={entry('bio-ecologia-ciclo-nitrogenio')}/>);
    const diagram = screen.getByRole('img', { name: /N₂.*amônia.*nitrito.*nitrato.*N₂/i });
    expect(diagram).toHaveTextContent('raízes');
    const button = screen.getByRole('button', { name: /Desnitrificação/ });
    button.focus();
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('atmosfera');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('Desnitrificação'));
  });

  it('mostra o bloqueio da luz e o consumo de oxigênio até a anoxia', async () => {
    const user = userEvent.setup();
    render(<EcologyCycles entry={entry('bio-ecologia-eutrofizacao')}/>);
    const diagram = screen.getByRole('img', { name: /nutrientes.*floração.*luz.*oxigênio.*peixes/i });
    expect(diagram).toHaveTextContent('produtoras submersas');
    await user.click(screen.getByRole('button', { name: /Anoxia/ }));
    expect(screen.getByRole('status')).toHaveTextContent('anoxia');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('Anoxia'));
  });
});
