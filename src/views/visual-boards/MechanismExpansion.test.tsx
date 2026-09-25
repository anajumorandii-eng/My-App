import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { visualCandidates } from '../visualRepresentation';
import { findBoard } from './registry';
import { wavelength, waveValue } from './WaveMechanism';
import { enthalpyProfile } from './ThermochemMechanism';
import AtomMechanism, { hydrogenEnergy } from './AtomMechanism';

vi.mock('motion/react', async importOriginal => ({ ...await importOriginal<typeof import('motion/react')>(), useReducedMotion: () => true }));
afterEach(cleanup);

const cases = [
  ['fisica-equacao-fundamental-da-ondulatoria', 'Onda transversal'],
  ['fisica-ondulatoria-ondas-eletromagneticas', 'Onda eletromagnética'],
  ['fisica-ondulatoria-som-e-suas-propriedades', 'Som longitudinal'],
  ['quimica-termoquimica-i', 'Perfil exotérmico'],
  ['quimica-termoquimica-ii', 'Lei de Hess'],
  ['quimica-evolucao-dos-modelos-atomicos', 'Experimento de Rutherford'],
  ['biologia-coracao-e-vasos-sanguineos', 'Circulação humana'],
] as const;

describe('expansão de mecanismos por capítulo', () => {
  it.each(cases)('mostra a cena específica em %s e mantém quadro final sem movimento', (suffix, name) => {
    const summary = interactiveSummaries.find(item => item.id === `summary-${suffix}`)!;
    expect(summary).toBeDefined();
    const board = findBoard(summary)!;
    expect(visualCandidates(summary)[0]).toEqual({ kind: 'board', id: board.id });
    const Component = board.Component;
    render(<Component map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByRole('img', { name: new RegExp(name) })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir movimento' }));
    expect(screen.getByRole('slider', { name: /Fração de um período|Percurso|Avanço|Demonstração/ })).toHaveValue('1');
    expect(screen.queryByRole('button', { name: 'Pausar movimento' })).toBeNull();
  });
  it('conserva v = λf e periodicidade da onda', () => {
    for (const frequency of [1, 2, 3]) {
      expect(wavelength(frequency) * frequency).toBe(240);
      expect(waveValue(31, frequency, 0)).toBeCloseTo(waveValue(31, frequency, 1));
      expect(waveValue(31, frequency, .25)).toBeCloseTo(waveValue(31 + wavelength(frequency), frequency, .25));
    }
  });
  it('separa saldo de entalpia da barreira e calcula a energia do fóton', () => {
    expect(enthalpyProfile(0, false)).toBe(155);
    expect(enthalpyProfile(1, false)).toBeCloseTo(275);
    expect(enthalpyProfile(0, true)).toBe(275);
    expect(enthalpyProfile(1, true)).toBeCloseTo(155);
    expect(enthalpyProfile(.5, false)).toBe(75);
    expect(enthalpyProfile(.5, true)).toBe(75);
    expect(Math.abs(hydrogenEnergy(2) - hydrogenEnergy(3))).toBeCloseTo(1.8889, 4);
  });
  it('mantém o elétron em níveis permitidos durante emissão e absorção', () => {
    render(<AtomMechanism />);
    fireEvent.click(screen.getByRole('button', { name: 'Níveis de Bohr' }));
    const slider = screen.getByRole('slider', { name: 'Demonstração da transição' });
    for (const phase of [.1, .49, .5, .75, 1]) {
      fireEvent.change(slider, { target: { value: String(phase) } });
      expect(screen.getByLabelText(`Elétron no nível ${phase < .5 ? 3 : 2}`)).toHaveAttribute('cy', String(358 - (hydrogenEnergy(phase < .5 ? 3 : 2) + 13.6) * 20));
    }
    fireEvent.click(screen.getByRole('button', { name: 'Absorção 2 → 3' }));
    expect(slider).toHaveValue('0');
    expect(screen.getByLabelText('Elétron no nível 2')).toBeInTheDocument();
    fireEvent.change(slider, { target: { value: '.75' } });
    expect(screen.getByLabelText('Elétron no nível 3')).toBeInTheDocument();
  });
});
