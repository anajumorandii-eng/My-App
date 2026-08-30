import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { canvasContext } from '../testSetup';
import { CrivoCore } from './CrivoCore';

const useReducedMotionMock = vi.hoisted(() => vi.fn(() => false));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, useReducedMotion: useReducedMotionMock };
});

function rectangularBounds(width: number, height: number): DOMRect {
  return {
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('CrivoCore hero surface', () => {
  it('exposes hero scale and a decorative canvas without a duplicate accessible image', () => {
    render(<CrivoCore state="ready" subject="Física" topicId="fis-optica" size="fill" scale="hero" decorative />);

    expect(screen.getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('keeps an accessible state label when it is not decorative', () => {
    render(<CrivoCore state="listening" subject="Biologia" size={96} />);

    expect(screen.getByRole('img', { name: /Lendo seu histórico — Biologia/ })).toBeInTheDocument();
  });

  it('draws one static frame without scheduling animation when motion is reduced', () => {
    useReducedMotionMock.mockReturnValue(true);
    const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');

    render(<CrivoCore state="ready" subject="Física" size={96} />);

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledOnce();
    expect(canvasContext.clearRect).toHaveBeenCalledOnce();
  });

  it('keeps the Núcleo legible as an orbital instrument when Canvas 2D is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValueOnce(null);

    render(<CrivoCore state="ready" subject="Física" size="fill" scale="hero" decorative />);

    const fallback = screen.getByTestId('crivo-core-fallback');
    expect(fallback).toHaveAttribute('data-static-artifact', 'orbital');
    expect(fallback.querySelectorAll('[data-static-ring]')).toHaveLength(3);
    expect(fallback.querySelector('[data-static-center]')).toBeInTheDocument();
  });

  it('keeps a fluid hero square and clamps its bitmap at DPR 2 in a rectangular wrapper', () => {
    const boundsSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rectangularBounds(320, 180));
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 });

    render(<CrivoCore state="ready" subject="Física" size="fill" scale="hero" decorative />);

    const core = screen.getByTestId('crivo-core');
    const canvas = core.querySelector('canvas');
    expect(core).toHaveStyle({ width: '100%', height: '100%' });
    expect(canvas).toHaveStyle({ width: '180px', height: '180px' });
    expect(canvas).toHaveAttribute('width', '360');
    expect(canvas).toHaveAttribute('height', '360');

    boundsSpy.mockRestore();
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });
  });

  it.each([
    ['is unavailable', undefined],
    ['throws while being created', vi.fn(function () { throw new Error('ResizeObserver unavailable'); })],
  ])('keeps the initial square canvas when ResizeObserver %s', (_case, ResizeObserverMock) => {
    useReducedMotionMock.mockReturnValue(true);
    const boundsSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rectangularBounds(200, 120));
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    render(<CrivoCore state="ready" subject="Física" size="fill" scale="hero" decorative />);

    const core = screen.getByTestId('crivo-core');
    const canvas = core.querySelector('canvas');
    expect(core).toHaveStyle({ width: '100%', height: '100%' });
    expect(canvas).toHaveAttribute('width', '120');
    expect(canvas).toHaveAttribute('height', '120');

    boundsSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
