import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import MendelBoard from './MendelBoard';
import BloodTypeBoard from './BloodTypeBoard';
import ThermochemBoard from './ThermochemBoard';

function props(id: string) {
  const summary = interactiveSummaries.find((item) => item.id === id)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('lote científico de Biologia e Química', () => {
  it('inicia a Segunda Lei no cruzamento dihíbrido 9:3:3:1', () => {
    render(<MendelBoard {...props('summary-biologia-segunda-lei-de-mendel')} />);
    expect(screen.getByRole('img', { name: /4 por 4.*9:3:3:1/i })).toBeInTheDocument();
    expect(screen.getByText(/9 : 3 : 3 : 1 — contando as casas/i)).toBeInTheDocument();
  });

  it('representa a interação complementar como via em duas etapas e razão 9:7', () => {
    render(<MendelBoard {...props('summary-biologia-segunda-lei-de-mendel-e-interacao-genica')} />);
    expect(screen.getByRole('img', { name: /genes complementares.*nove.*sete/i })).toBeInTheDocument();
    expect(screen.getByText(/precursor —A→ intermediário/i)).toBeInTheDocument();
    expect(screen.getByText(/intermediário —B→ pigmento/i)).toBeInTheDocument();
  });

  it('compara vacina e soro por origem, tempo de ação e memória', () => {
    render(<BloodTypeBoard {...props('summary-biologia-sangue-e-imunologia')} />);
    expect(screen.getByRole('img', { name: /vacina.*células de memória/i })).toBeInTheDocument();
    expect(screen.getByText(/Vacina ensina o organismo; soro entrega o produto pronto/i)).toBeInTheDocument();
    expect(screen.getByText(/sem memória imunológica/i)).toBeInTheDocument();
  });

  it('abre Termoquímica II em Gibbs e entropia, não em Hess', () => {
    render(<ThermochemBoard {...props('summary-quimica-termoquimica-ii')} />);
    expect(screen.getByRole('img', { name: /energia livre de Gibbs/i })).toBeInTheDocument();
    expect(screen.getAllByText(/ΔG = ΔH − TΔS/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Lei de Hess/i)).not.toBeInTheDocument();
  });
});
