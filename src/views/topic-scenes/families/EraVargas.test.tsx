import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('Lote 6: Era Vargas e Brasil atual', () => {
  it.each([
    ['summary-historia-a-era-vargas', /da Revolução de 1930.*até a Constituição de 1934/, '1932 · SP em armas', 'Constituição de 1934', 'voto feminino'],
    ['summary-historia-a-era-vargas-o-governo-constitucional-1934-1937', /AIB e ANL em disputa.*Plano Cohen forjado/, 'Plínio Salgado, 1932', 'Golpe de 1937', 'eleição de 1938 evitada'],
    ['summary-historia-a-era-vargas-o-estado-novo', /ditadura dentro do país e tropas brasileiras contra o fascismo/, 'DIP (1939): censura e propaganda', 'Queda de Vargas', 'Vargas volta eleito em 1950'],
    ['summary-historia-o-brasil-atual', /combinados, reduzem a desigualdade nos anos 2000/, 'Constituição Cidadã', 'Nenhum fator isolado', '3 de 3'],
    ['summary-historia-a-historia-e-o-brasil', /encontro de 1500 narrado do navio.*e da aldeia/, 'cartas e crônicas', 'Deslocamento historiográfico', 'quem tem autoridade'],
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
