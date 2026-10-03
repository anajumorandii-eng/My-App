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
  it('acompanha a seleção da Primeira Lei e retorna ao padrão dihíbrido ao limpar', () => {
    const base = props('summary-biologia-segunda-lei-de-mendel');
    const { rerender } = render(<MendelBoard {...base} selectedId={base.map.nodes[1].id} />);
    expect(screen.getByRole('img', { name: /2 por 2.*3:1/i })).toBeInTheDocument();
    expect(screen.getByLabelText('cruzamento Aa × Aa')).toBeInTheDocument();
    rerender(<MendelBoard {...base} selectedId={base.map.nodes[2].id} />);
    expect(screen.getByRole('img', { name: /4 por 4.*9:3:3:1/i })).toBeInTheDocument();
    expect(screen.getByLabelText('cruzamento AaBb × AaBb')).toBeInTheDocument();
    rerender(<MendelBoard {...base} />);
    expect(screen.getByRole('img', { name: /4 por 4.*9:3:3:1/i })).toBeInTheDocument();
  });

  it('mantém a interação complementar dihíbrida ao selecionar qualquer etapa', () => {
    const base = props('summary-biologia-segunda-lei-de-mendel-e-interacao-genica');
    const { rerender } = render(<MendelBoard {...base} selectedId={base.map.nodes[1].id} />);
    expect(screen.getByRole('img', { name: /genes complementares.*nove.*sete/i })).toBeInTheDocument();
    rerender(<MendelBoard {...base} selectedId={base.map.nodes[2].id} />);
    expect(screen.getByRole('img', { name: /genes complementares.*nove.*sete/i })).toBeInTheDocument();
  });

  it('mostra equilíbrio de Gibbs em T positivo e intercepto de entalpia positivo', () => {
    render(<ThermochemBoard {...props('summary-quimica-termoquimica-ii')} />);
    const svg = screen.getByRole('img', { name: /energia livre de Gibbs/i });
    const axes = svg.querySelector('path[stroke="var(--vs-ink)"]')!.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const curve = svg.querySelector('path[stroke="var(--vs-blue)"]')!.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const equilibrium = svg.querySelector('circle')!;
    const x = Number(equilibrium.getAttribute('cx'));
    const y = Number(equilibrium.getAttribute('cy'));
    expect(x).toBeGreaterThan(axes[3]);
    expect(y).toBe(axes[1]);
    expect(curve[0]).toBe(axes[3]);
    expect(curve[1]).toBeLessThan(axes[1]);
    expect(curve[3]).toBeGreaterThan(axes[1]);
    expect(curve[1] + (x - curve[0]) * (curve[3] - curve[1]) / (curve[2] - curve[0])).toBeCloseTo(y);
    expect(screen.getByText('T = 0 K')).toBeInTheDocument();
  });

  it('preserva o apoio de entalpia e ativação em Termoquímica I', () => {
    render(<ThermochemBoard {...props('summary-quimica-termoquimica-i')} />);
    expect(screen.getByText('ΔH não é energia de ativação')).toBeInTheDocument();
    expect(screen.queryByText('Espontaneidade não é velocidade')).not.toBeInTheDocument();
    expect(screen.queryByText(/ΔG informa a tendência/)).not.toBeInTheDocument();
  });

});
