import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { canvasContext } from '../../testSetup';
import { TINTA_BASE, type ImmersiveFrame } from './immersiveStage';
import { clipBondToSpheres, makeVseprPainter, measureMoleculeStage, projectVsepr } from './vseprCanvas';
import { MOLECULAS } from '../../lib/geometriaMolecular';
import MoleculeImmersion, { VSEPR_PHASES } from './MoleculeImmersion';
import { SEQUENCIA } from './vseprStages';

// Os testes de texto exercitam a casca; o desenho recebe um contexto 2D controlado.
const etapas = () => screen.getAllByRole('button', { name: /^0[1-5]/ });
const leitura = (container: HTMLElement) => container.querySelector('.cr-temp-number')?.textContent;
const graus = (valor: number) => `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°`;

describe('cena imersiva de geometria molecular', () => {
  it('cada etapa mostra o ângulo que a biblioteca dá para a molécula dela', () => {
    const { container } = render(<MoleculeImmersion />);
    expect(etapas()).toHaveLength(5);
    SEQUENCIA.forEach((id, index) => {
      fireEvent.click(etapas()[index]);
      expect(leitura(container)).toBe(graus(MOLECULAS[id].anguloGraus));
    });
  });

  it('as quatro previsões têm a resposta da repulsão das nuvens', () => {
    const certas = VSEPR_PHASES.filter(phase => phase.predict).map(phase => phase.predict!.options[phase.predict!.right]);
    expect(certas).toEqual(['120°', 'Não, sai do plano', 'Fecha', 'Angular']);
    expect(VSEPR_PHASES[4].predict).toBeUndefined();
  });

  it('errar que o par livre abre o ângulo explica por que ele fecha', () => {
    render(<MoleculeImmersion />);
    fireEvent.click(etapas()[2]);
    fireEvent.click(screen.getByRole('button', { name: 'Abre' }));
    expect(etapas()[3]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('status')).toHaveTextContent(/Não foi isso\..*empurra as ligações/);
  });

  // A pegadinha de prova: ligação polar nas duas, molécula polar em uma só.
  it('na última etapa compara a água polar com o CO₂ apolar', () => {
    const { container } = render(<MoleculeImmersion />);
    fireEvent.click(etapas()[4]);
    expect(screen.getByText(/se somam: a molécula é polar/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'CO₂, linear' }));
    expect(leitura(container)).toBe('μ = 0');
    expect(screen.getByText(/a soma é zero e a molécula é apolar/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CO₂, linear' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('voltar a outra etapa recomeça a comparação pela água', () => {
    const { container } = render(<MoleculeImmersion />);
    fireEvent.click(etapas()[4]);
    fireEvent.click(screen.getByRole('button', { name: 'CO₂, linear' }));
    fireEvent.click(etapas()[0]);
    fireEvent.click(etapas()[4]);
    expect(leitura(container)).toBe(graus(MOLECULAS.H2O.anguloGraus));
  });

  it('descreve a molécula em texto para quem não vê a cena', () => {
    render(<MoleculeImmersion />);
    fireEvent.click(etapas()[3]);
    expect(screen.getByRole('img', { name: /NH₃.*4 nuvens.*1 par livre.*piramidal.*polar/ })).toBeInTheDocument();
  });

  it('usa a casca comum: tinta, pausa e aproximação', () => {
    render(<MoleculeImmersion temaInicial="caderno" />);
    expect(screen.getByRole('button', { name: /Ver em noite/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pausar movimento/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aproximar molécula' })).toBeInTheDocument();
  });
});


describe('palco Canvas 2D de geometria molecular', () => {
  const stage = { left: 18, right: 342, top: 260, bottom: 476 };
  const drawing = () => ({ ...canvasContext, drawImage: vi.fn(), fillText: vi.fn(), ellipse: vi.fn(), closePath: vi.fn(), stroke: vi.fn() });
  const frame = (ctx: CanvasRenderingContext2D, more: Partial<ImmersiveFrame> = {}): ImmersiveFrame => ({
    ctx, width: 360, height: 900, mobile: true, delta: .016, elapsed: 0, rotation: .82, tilt: .55,
    zoom: 1, ease: 1, still: true, changed: true, pal: TINTA_BASE.caderno, tema: 'caderno', dragging: false, ...more,
  });

  it('desenha átomos identificados e pares livres de cada molécula canônica', () => {
    SEQUENCIA.forEach(id => {
      const ctx = drawing(), molecule = MOLECULAS[id];
      makeVseprPainter()(frame(ctx as unknown as CanvasRenderingContext2D), id, false, stage, null);
      expect(ctx.drawImage).toHaveBeenCalledTimes(1 + molecule.paresLigantes);
      expect(ctx.fillText.mock.calls.map(call => call[0]).sort()).toEqual([molecule.central, ...Array(molecule.paresLigantes).fill(molecule.ligante)].sort());
      expect(ctx.ellipse).toHaveBeenCalledTimes(molecule.paresNaoLigantes);
    });
  });

  it('mantém os átomos no espaço reservado ao girar e aproximar no celular', () => {
    SEQUENCIA.forEach(id => {
      for (const rotation of [0, .82, 1.8, 3.2, 5]) {
        const ctx = drawing();
        makeVseprPainter()(frame(ctx as unknown as CanvasRenderingContext2D, { rotation, zoom: 1.25 }), id, true, stage, null);
        for (const [, x, y, width, height] of ctx.drawImage.mock.calls) {
          expect(x).toBeGreaterThanOrEqual(stage.left);
          expect(y).toBeGreaterThanOrEqual(stage.top);
          expect(x + width).toBeLessThanOrEqual(stage.right);
          expect(y + height).toBeLessThanOrEqual(stage.bottom);
        }
      }
    });
  });

  it('na água desenha a resultante; no CO₂ ficam só os dois dipolos opostos', () => {
    for (const [id, expected] of [['H2O', 3], ['CO2', 2]] as const) {
      const ctx = drawing();
      makeVseprPainter()(frame(ctx as unknown as CanvasRenderingContext2D), id, true, stage, null);
      expect(ctx.closePath).toHaveBeenCalledTimes(expected);
    }
  });

  it('compartilha a altura com o título no desktop e reserva o palco no celular', () => {
    const shell = document.createElement('div');
    shell.innerHTML = '<div class="cr-intro"></div><div class="cr-tools"></div><div class="cr-temp"></div><div class="cr-bottom"></div>';
    vi.spyOn(shell, 'getBoundingClientRect').mockReturnValue({ top: 100, left: 0, right: 728 } as DOMRect);
    const intro = vi.spyOn(shell.querySelector('.cr-intro')!, 'getBoundingClientRect').mockReturnValue({ bottom: 360, right: 373 } as DOMRect);
    const tools = vi.spyOn(shell.querySelector('.cr-tools')!, 'getBoundingClientRect').mockReturnValue({ bottom: 280, left: 660 } as DOMRect);
    const reading = vi.spyOn(shell.querySelector('.cr-temp')!, 'getBoundingClientRect').mockReturnValue({ bottom: 473 } as DOMRect);
    const bottom = vi.spyOn(shell.querySelector('.cr-bottom')!, 'getBoundingClientRect').mockReturnValue({ height: 490 } as DOMRect);
    const desktop = measureMoleculeStage(shell, { width: 728, mobile: false });
    expect(desktop.left).toBeGreaterThan(373);
    expect(desktop.top).toBeLessThan(260);
    expect(desktop.right).toBeLessThan(660);
    expect(Number.parseInt(shell.style.minHeight)).toBeLessThanOrEqual(950);
    intro.mockReturnValue({ bottom: 193 } as DOMRect);
    tools.mockReturnValue({ bottom: 347 } as DOMRect);
    reading.mockReturnValue({ bottom: 319 } as DOMRect);
    bottom.mockReturnValue({ height: 466 } as DOMRect);
    const mobile = measureMoleculeStage(shell, { width: 354, mobile: true });
    expect(mobile.top).toBeGreaterThan(247);
    expect(mobile.bottom - mobile.top).toBeGreaterThanOrEqual(172);
    expect(Number.parseInt(shell.style.minHeight)).toBeLessThanOrEqual(900);
    bottom.mockReturnValue({ height: 580 } as DOMRect);
    const detail = measureMoleculeStage(shell, { width: 354, mobile: true });
    expect(detail).toEqual(mobile);
    expect(Number.parseInt(shell.style.minHeight)).toBeGreaterThan(900);
  });

  it('recorta ligações simples e duplas fora de ambas as esferas, incluindo as pontas arredondadas', () => {
    for (const offset of [-5, 0, 5]) {
      const segment = clipBondToSpheres({ x: 50, y: 70 }, { x: 140, y: 190 }, 24, 18, offset, 6)!;
      expect(Math.hypot(segment.a.x - 50, segment.a.y - 70) - 3).toBeGreaterThanOrEqual(23.9);
      expect(Math.hypot(segment.b.x - 140, segment.b.y - 190) - 3).toBeGreaterThanOrEqual(17.9);
    }
    expect(clipBondToSpheres({ x: 0, y: 0 }, { x: 10, y: 0 }, 24, 18)).toBeNull();
  });

  it('pinta todos os símbolos depois das ligações, do arco e do fio da etiqueta', () => {
    const ctx = drawing();
    makeVseprPainter()(frame(ctx as unknown as CanvasRenderingContext2D), 'BF3', false, stage, null);
    expect(Math.min(...ctx.fillText.mock.invocationCallOrder)).toBeGreaterThan(Math.max(...ctx.stroke.mock.invocationCallOrder));
  });

  it('a projeção conserva profundidade e muda com a câmera', () => {
    const front = projectVsepr([0, 0, -1], 0, 0), back = projectVsepr([0, 0, 1], 0, 0);
    expect(front.perspective).toBeGreaterThan(back.perspective);
    expect(projectVsepr([0, 0, 1], .8, .55).x).not.toBeCloseTo(back.x);
    expect(projectVsepr([0, 0, 1], .8, .55).y).not.toBeCloseTo(back.y);
  });

  it('uma mudança explícita desenha o resultado completo mesmo com a cena parada', () => {
    const paint = makeVseprPainter(), ctx = drawing(), f = frame(ctx as unknown as CanvasRenderingContext2D);
    paint(f, 'CO2', false, stage, null);
    ctx.drawImage.mockClear(); ctx.fillText.mockClear();
    paint(f, 'NH3', false, stage, null);
    expect(ctx.drawImage).toHaveBeenCalledTimes(4);
    expect(ctx.fillText.mock.calls.map(call => call[0])).toContain('N');
    expect(ctx.ellipse).toHaveBeenCalledTimes(1);
  });

  it('renderiza um canvas 2D, sem um segundo palco sobreposto', () => {
    const { container } = render(<MoleculeImmersion />);
    expect(container.querySelectorAll('canvas')).toHaveLength(1);
    expect(screen.getByRole('img')).toHaveClass('cr-canvas');
    expect(container.querySelector('.cr-stage3d')).toBeNull();
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d', { alpha: false });
  });

  it('oferece a saída para o desafio real somente na última etapa', () => {
    const onPractice = vi.fn();
    render(<MoleculeImmersion onPractice={onPractice} />);
    expect(screen.queryByRole('button', { name: 'Testar o que entendi' })).toBeNull();
    fireEvent.click(etapas()[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Testar o que entendi' }));
    expect(onPractice).toHaveBeenCalledOnce();
    fireEvent.click(etapas()[1]);
    expect(screen.queryByRole('button', { name: 'Testar o que entendi' })).toBeNull();
  });
});
