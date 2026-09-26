import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';


describe('cenas do Lote 15: cartografia e água', () => {
  it.each([
    ['summary-geografia-sistema-de-fusos-horarios', /Fusos horários vistos do Polo Norte/, '360° ÷ 24 h', 'Linha de Data', 'o calendário avança 1 dia'],
    ['summary-geografia-linguagem-cartografica', /régua de 8 centímetros a 1:50.000/, '= 400.000 cm', 'Curvas de nível', 'leste: espaçadas, suave'],
    ['summary-geografia-cartografia-digital', /camadas do SIG cruzadas/, 'cruzamento', 'Detectar não é impedir', 'detectar não é impedir'],
    ['summary-geografia-representacoes-graficas-e-cartograficas', /elementos do mapa, generalização/, 'sem legenda, a cor vira enigma', 'Gráfico não é mapa', 'o dado, sem a forma do lugar'],
    ['summary-geografia-agua-na-superficie-terrestre', /97% nos oceanos/, 'oceanos · salgada · cerca de 97%', 'Superexplotação', 'o solo afunda (subsidência)'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
    expect(sceneFor(chapterId)).not.toBeNull();
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === chapterId)!;
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
