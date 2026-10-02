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

  const mirrorArrows = () => Array.from(screen.getByRole('img').querySelectorAll('path'))
    .filter(path => /V/.test(path.getAttribute('d') ?? ''))
    .map(path => (path.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).slice(0, 3));

  it.each([[20, 3], [25, 6], [35, -6], [60, -1], [90, -0.5]])('desenha orientação e ampliação corretas para p=%i cm', (distance, magnification) => {
    const Component = opticsInstrument('spherical-mirror');
    render(<Component {...props('summary-fisica-reflexao-em-superficies-esfericas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(distance) } });
    const [object, image] = mirrorArrows();
    expect(object[2]).toBeLessThan(object[1]);
    expect((image[1] - image[2]) / (object[1] - object[2])).toBeCloseTo(magnification, 6);
  });

  it('posiciona foco e imagem na mesma escala horizontal do objeto', () => {
    const Component = opticsInstrument('spherical-mirror');
    render(<Component {...props('summary-fisica-reflexao-em-superficies-esfericas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '90' } });
    const [object, image] = mirrorArrows();
    const scale = (image[0] - object[0]) / (90 - 45);
    const vertex = object[0] + 90 * scale;
    const focus = Number(screen.getByRole('img').querySelector('circle')!.getAttribute('cx'));
    expect(focus).toBeCloseTo(vertex - 30 * scale, 6);
  });

  it('mostra raios refletidos paralelos e nenhuma imagem finita quando p=f', () => {
    const Component = opticsInstrument('spherical-mirror');
    render(<Component {...props('summary-fisica-reflexao-em-superficies-esfericas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '30' } });
    expect(mirrorArrows()).toHaveLength(1);
    const reflected = Array.from(screen.getByRole('img').querySelectorAll('.vs-optics-reflected'))
      .map(path => path.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number));
    expect(reflected).toHaveLength(2);
    const [[x1, y1, x2, y2], [x3, y3, x4, y4]] = reflected;
    expect((y2 - y1) / (x2 - x1)).toBeCloseTo((y4 - y3) / (x4 - x3), 6);
    expect(screen.getByRole('img')).toHaveTextContent('raios paralelos');
  });

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
