import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import WorkStrategiesExplorer from './WorkStrategiesExplorer';

describe('seletor de estratégias literárias', () => {
  it('troca o roteiro junto com a obra e liga ao seu resumo aprofundado', async () => {
    render(<MemoryRouter><WorkStrategiesExplorer /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Obra da estratégia'), { target: { value: 'paixao-segundo-gh' } });
    expect(await screen.findByRole('heading', { name: 'Estratégias de leitura e resolução de A Paixão segundo G.H.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir resumo aprofundado' })).toHaveAttribute('href', '/obras/paixao-segundo-gh?aba=resumo');
    fireEvent.change(screen.getByLabelText('Obra da estratégia'), { target: { value: 'bras-cubas' } });
    expect(await screen.findByRole('heading', { name: 'Estratégias de leitura e resolução de Memórias póstumas de Brás Cubas' })).toBeInTheDocument();
    expect(screen.queryByText(/Siga uma frase repetida entre duas seções/)).toBeNull();
  });
});
