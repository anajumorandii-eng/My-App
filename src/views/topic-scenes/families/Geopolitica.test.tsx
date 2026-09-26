import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('Lote 11 — geopolítica regional', () => {
  it.each([
    ['summary-geografia-terrorismo-internacional', /rede hierárquica de 2001 que vira células/, 'resistência legítima', 'Custos além das vítimas', 'liberdades civis'],
    ['summary-geografia-geografia-das-religioes', /Jerusalém sagrada para três religiões/, 'Oriente Médio · origem', 'Laicidade: lei × prática', 'iguais no papel'],
    ['summary-geografia-tensoes-geopoliticas-na-europa', /Finlândia e Suécia na Otan/, 'Checoslováquia', 'Escócia × Catalunha', 'com aval de Londres'],
    ['summary-geografia-geopolitica-e-geoeconomia-da-america-latina', /Mercosul e Aliança do Pacífico/, 'prata · Potosí', 'China e reprimarização', 'agora voltada à Ásia'],
    ['summary-geografia-africa-no-mundo-atual', /fronteiras da Conferência de Berlim/, 'grupo dividido', 'Maldição dos recursos', 'cobalto · RDC'],
  ] as const)('%s abre com a cena autoral e acompanha o último recorte', async (chapterId, name, text, button, after) => {
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
