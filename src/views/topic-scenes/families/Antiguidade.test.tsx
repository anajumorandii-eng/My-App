import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('pranchas da Antiguidade e da Idade Média', () => {
  it.each([
    ['summary-historia-antiguidade-classica-o-mundo-grego', /Mundo grego: mapa esquemático das póleis/, 'fora: mulheres, escravizados, metecos', 'Mosaico helênico', 'fragmentação política'],
    ['summary-historia-antiguidade-classica-o-mundo-romano', /poder repartido na República.*concentrado em Augusto/, '509 a.C. · República', 'Augusto', 'Otávio Augusto'],
    ['summary-historia-alta-idade-media-e-feudalismo', /senhorio com as obrigações do servo/, 'corveia: trabalho grátis no domínio', 'Vínculos distintos', 'serviço militar e conselho'],
    ['summary-historia-baixa-idade-media', /Peste Negra, escassez de mão de obra/, 'entre um terço e metade da população morre', 'Abalo do trabalho servil', 'melhores condições e remuneração'],
    ['summary-historia-vida-urbana-e-renascimento-cultural', /da riqueza comercial ao mecenato/, 'condição necessária, não suficiente', 'Arte', 'perspectiva linear: Brunelleschi'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(text);
    const target = screen.getByRole('button', { name: button });
    await user.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent(after);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(`recorte ${entry.items.length}`));
  });
});
