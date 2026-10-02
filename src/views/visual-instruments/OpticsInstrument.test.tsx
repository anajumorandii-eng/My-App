import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { opticsInstrument } from './OpticsInstrument';
import type { OpticsId } from '../../lib/opticsLab';

const props = (id: string) => ({ map: buildVisualMap(interactiveSummaries.find(item => item.id === id)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const });

describe('instrumento de óptica', () => {
  const rayPoints = () => {
    const values = screen.getByRole('img').querySelector('path')!.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    return [[values[0], values[1]], [values[2], values[3]], [values[4], values[5]]];
  };

  it.each([10, 35, 75])('reflete no mesmo lado do espelho e mede %i° em relação à normal', (angle) => {
    const Component = opticsInstrument('plane-mirror');
    render(<Component {...props('summary-fisica-reflexao-em-superficies-planas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(angle) } });
    const [incoming, contact, reflected] = rayPoints();
    expect(incoming[0]).toBeLessThan(contact[0]);
    expect(reflected[0]).toBeLessThan(contact[0]);
    expect(incoming[1]).toBeLessThan(contact[1]);
    expect(reflected[1]).toBeGreaterThan(contact[1]);
    for (const point of [incoming, reflected]) {
      const drawnAngle = Math.atan2(Math.abs(point[1] - contact[1]), Math.abs(point[0] - contact[0])) * 180 / Math.PI;
      expect(drawnAngle).toBeCloseTo(angle, 6);
    }
  });

  it.each([5, 45, 75])('mantém a direção tangencial e a lei de Snell na refração a %i°', (angle) => {
    const Component = opticsInstrument('refraction');
    render(<Component {...props('summary-fisica-refracao-fundamentos-leis-e-aplicacoes')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(angle) } });
    const [incoming, contact, refracted] = rayPoints();
    expect((contact[0] - incoming[0]) * (refracted[0] - contact[0])).toBeGreaterThan(0);
    expect(incoming[1]).toBeLessThan(contact[1]);
    expect(refracted[1]).toBeGreaterThan(contact[1]);
    const sine = (point: number[]) => Math.abs(point[0] - contact[0]) / Math.hypot(point[0] - contact[0], point[1] - contact[1]);
    expect(sine(incoming)).toBeCloseTo(Math.sin(angle * Math.PI / 180), 6);
    expect(sine(incoming)).toBeCloseTo(1.5 * sine(refracted), 6);
  });

  it('expõe quatro mecanismos com controles de faixa nativos', () => {
    const chapters: Array<[OpticsId, string]> = [
      ['plane-mirror', 'summary-fisica-reflexao-em-superficies-planas'],
      ['spherical-mirror', 'summary-fisica-reflexao-em-superficies-esfericas'],
      ['refraction', 'summary-fisica-refracao-fundamentos-leis-e-aplicacoes'],
      ['vision', 'summary-fisica-optica-da-visao'],
    ];
    for (const [id, chapter] of chapters) {
      const Component = opticsInstrument(id);
      const view = render(<Component {...props(chapter)} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('atualiza o ângulo refratado quando a incidência muda', () => {
    const Component = opticsInstrument('refraction');
    render(<Component {...props('summary-fisica-refracao-fundamentos-leis-e-aplicacoes')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '30' } });
    expect(screen.getAllByText('19,5°').length).toBeGreaterThan(0);
  });
});
