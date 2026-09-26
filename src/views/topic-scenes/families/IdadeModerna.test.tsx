import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('cenas autorais da Idade Moderna (lote 7B)', () => {
  it.each([
    ['summary-historia-a-primeira-globalizacao', /Primeira Globalização em camadas/, 'metais = riqueza', 'Tráfico transatlântico', 'abolição gradual,'],
    ['summary-historia-america-espanhola', /pirâmide de castas/, 'nascidos na América', 'Peninsulares', 'na própria Espanha'],
    ['summary-historia-reforma-religiosa', /Reforma Religiosa em três tempos/, 'justificação pela fé', 'Concílio de Trento', 'nem a Igreja de antes, nem a simples recusa'],
    ['summary-historia-absolutismo', /direito divino de Bossuet e o contrato de Hobbes/, 'Leviatã', 'Convergência', 'mesma conclusão'],
    ['summary-historia-iluminismo', /mesma base racionalista/, 'O Espírito das Leis · 1748', 'Base racionalista comum', 'mesma base, propostas diferentes'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(text);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('recorte 1'));
    const target = screen.getByRole('button', { name: button });
    await user.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent(after);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(`recorte ${entry.items.length}`));
  });
});
