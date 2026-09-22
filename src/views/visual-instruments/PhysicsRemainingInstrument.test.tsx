import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { physicsRemainingInstrument } from './PhysicsRemainingInstrument';
import type { PhysicsRemainingId } from '../../lib/physicsRemainingLab';

const props = (id: string) => ({ map: buildVisualMap(interactiveSummaries.find(item => item.id === id)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const });

describe('instrumento de ondas e física moderna', () => {
  it('expõe uma cena e um controle de faixa para cada capítulo', () => {
    const chapters: Array<[PhysicsRemainingId, string]> = [
      ['echo', 'summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas'],
      ['diffraction', 'summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia'],
      ['tube-harmonics', 'summary-fisica-ondas-estacionarias-em-tubos'],
      ['quantum-photon', 'summary-fisica-nocoes-basicas-de-fisica-quantica'],
      ['circular-motion', 'summary-fisica-o-movimento-circular'],
      ['electric-field-map', 'summary-fisica-mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais'],
      ['electric-meters', 'summary-fisica-medidores-eletricos'],
      ['generator', 'summary-fisica-geradores'],
      ['receiver', 'summary-fisica-receptores'],
      ['magnet-field', 'summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre'],
      ['geometric-optics', 'summary-fisica-fundamentos-da-optica-geometrica'],
      ['optical-instruments', 'summary-fisica-microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas'],
      ['wave-basics', 'summary-fisica-conceitos-basicos'],
      ['rope-boundary', 'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas'],
      ['string-standing-wave', 'summary-fisica-um-caso-particular-de-interferencia-onda-estacionaria'],
    ];
    for (const [id, chapter] of chapters) { const Component = physicsRemainingInstrument(id); const view = render(<Component {...props(chapter)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); }
  });

  it('troca a regra visual entre ligação fixa e livre de uma corda', () => {
    const Component = physicsRemainingInstrument('rope-boundary');
    render(<Component {...props('summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas')} />);
    expect(screen.getAllByText('invertido').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getAllByText('sem inversão').length).toBeGreaterThan(0);
  });

  it('recalcula a distância quando o eco demora mais para voltar', () => {
    const Component = physicsRemainingInstrument('echo');
    render(<Component {...props('summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.4' } });
    expect(screen.getAllByText('68 m').length).toBeGreaterThan(0);
  });

  it('desenha os dois semiperfis opostos da onda estacionária no tubo', () => {
    const Component = physicsRemainingInstrument('tube-harmonics');
    const { container } = render(<Component {...props('summary-fisica-ondas-estacionarias-em-tubos')} />);
    const upper = container.querySelector('[data-harmonic-profile="upper"]')?.getAttribute('d');
    const lower = container.querySelector('[data-harmonic-profile="lower"]')?.getAttribute('d');
    expect(upper).toBeTruthy();
    expect(lower).toBeTruthy();
    expect(upper).not.toBe(lower);
    // No primeiro quarto do modo fundamental, um perfil sobe e o outro desce.
    const upperY = Number(upper!.match(/^M\s+43\s+150\s+L\s+[\d.]+\s+([\d.]+)/)?.[1]);
    const lowerY = Number(lower!.match(/^M\s+43\s+150\s+L\s+[\d.]+\s+([\d.]+)/)?.[1]);
    expect(upperY).toBeLessThan(150);
    expect(lowerY).toBeGreaterThan(150);
  });
});
