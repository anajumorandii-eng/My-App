import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { magnetismInstrument } from './MagnetismInstrument';
import type { MagnetismId } from '../../lib/magnetismLab';

function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de magnetismo', () => {
  it('renderiza as cinco situações físicas distintas', () => {
    const chapters: Array<[MagnetismId, string]> = [
      ['fio-espira', 'summary-fisica-campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes'],
      ['carga-em-b', 'summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme'],
      ['fios-paralelos', 'summary-fisica-analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas'],
      ['lenz', 'summary-fisica-inducao-eletromagnetica-lei-de-lenz'],
      ['gerador', 'summary-fisica-inducao-eletromagnetica-analise-da-corrente-induzida-em-geradores'],
    ];
    for (const [id, summaryId] of chapters) { const Component = magnetismInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); }
  });
  it('atualiza a força quando o ângulo entre velocidade e campo muda', () => {
    const Component = magnetismInstrument('carga-em-b'); render(<Component {...props('summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } }); expect(screen.getAllByText('0 N').length).toBeGreaterThan(0);
  });
});


describe('geometria da carga positiva em B uniforme', () => {
  it('mostra projeções da hélice, círculo perpendicular e reta paralela com vetores coerentes', () => {
    const Component = magnetismInstrument('carga-em-b');
    const { container } = render(<Component {...props('summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme')} />);
    const slider = screen.getByRole('slider');
    const scene = () => container.querySelector('[data-charge-motion]')!;
    const circle = () => container.querySelector('[data-orbit]')!;
    expect(scene()).toHaveAttribute('data-charge-motion', 'helix');
    expect(screen.getByText(/projeções da hélice/i)).toBeInTheDocument();
    expect(Number(circle().getAttribute('r'))).toBeCloseTo(42 * Math.sin(Math.PI / 3));
    const velocity = container.querySelector('[data-vector="velocity-perpendicular"]')!;
    const force = container.querySelector('[data-vector="force"]')!;
    expect(velocity.getAttribute('y1')).toBe(velocity.getAttribute('y2'));
    expect(force.getAttribute('x1')).toBe(force.getAttribute('x2'));
    expect(Number(force.getAttribute('y2'))).toBeLessThan(Number(force.getAttribute('y1')));
    fireEvent.change(slider, { target: { value: '0' } });
    expect(scene()).toHaveAttribute('data-charge-motion', 'straight');
    expect(container.querySelector('[data-orbit]')).toBeNull();
    expect(container.querySelector('[data-vector="force"]')).toBeNull();
    expect(container.querySelector('[data-vector="velocity-perpendicular"]')).toBeNull();
    expect(screen.getAllByText('0 N').length).toBeGreaterThan(0);
    fireEvent.change(slider, { target: { value: '10' } });
    expect(scene()).toHaveAttribute('data-charge-motion', 'helix');
    expect(Number(circle().getAttribute('r'))).toBeCloseTo(42 * Math.sin(Math.PI / 18));
    const shortForce = container.querySelector('[data-vector="force"]')!;
    const forceHead = shortForce.nextElementSibling!;
    const headBaseY = Number(forceHead.getAttribute('d')!.match(/^M[\d.]+ ([\d.]+)/)![1]);
    expect(headBaseY).toBeLessThan(Number(shortForce.getAttribute('y1')));
    const forceLength = 32 * Math.sin(Math.PI / 18);
    expect(Number(forceHead.getAttribute('data-size'))).toBeLessThanOrEqual(forceLength * .4);
    const perpendicularLabel = screen.getByText('v⊥');
    const forceLabel = screen.getByText('F');
    expect(Math.abs(Number(perpendicularLabel.getAttribute('y')) - Number(forceLabel.getAttribute('y')))).toBeGreaterThanOrEqual(18);
    fireEvent.change(slider, { target: { value: '20' } });
    expect(Number(circle().getAttribute('r'))).toBeCloseTo(42 * Math.sin(Math.PI / 9));
    expect(Math.abs(Number(perpendicularLabel.getAttribute('y')) - Number(forceLabel.getAttribute('y')))).toBeGreaterThanOrEqual(18);
    fireEvent.change(slider, { target: { value: '90' } });
    expect(scene()).toHaveAttribute('data-charge-motion', 'circle');
    expect(circle()).toHaveAttribute('r', '42');
    expect(container.querySelector('[data-vector="velocity-parallel"]')).toBeNull();
    expect(screen.getAllByText('0,6 N').length).toBeGreaterThan(0);
  });
});

it('inverte corrente e campo com movimento e remove indução em repouso', () => {
  const Component = magnetismInstrument('lenz');
  const { container } = render(<Component {...props('summary-fisica-inducao-eletromagnetica-lei-de-lenz')} />);
  expect(container.querySelector('[data-lenz-mode="retreat"]')).toBeInTheDocument();
  expect(screen.getByRole('slider')).toHaveAttribute('min', '0.1');
  expect(screen.getByRole('slider')).toHaveAttribute('max', '2');
  expect(screen.getByRole('slider')).toHaveAttribute('step', '0.1');
  expect(screen.getByRole('img')).toHaveAccessibleName(/horário.*ímã/i);
  const initial = container.querySelector('[data-vector="induced-field"]')?.getAttribute('x2');
  fireEvent.change(screen.getByRole('combobox', { name: /movimento do ímã/i }), { target: { value: 'approach' } });
  expect(screen.getByRole('img')).toHaveAccessibleName(/anti-horário/i);
  expect(container.querySelector('[data-vector="induced-field"]')?.getAttribute('x2')).not.toBe(initial);
  const size = container.querySelector('[data-vector="induced-field"]')?.getAttribute('x2');
  fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
  expect(container.querySelector('[data-vector="induced-field"]')?.getAttribute('x2')).not.toBe(size);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'stationary' } });
  expect(container.querySelector('[data-vector="induced-field"]')).toBeNull();
  expect(container.querySelector('[data-current-arrow]')).toBeNull();
  expect(screen.getAllByText('0 V').length).toBeGreaterThan(0);
  expect(container.querySelector('[data-vector="external-field"]')).toBeInTheDocument();
});
