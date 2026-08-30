import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { canvasContext } from '../testSetup';
import { CrivoCore } from './CrivoCore';

const useReducedMotionMock = vi.hoisted(() => vi.fn(() => false));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, useReducedMotion: useReducedMotionMock };
});

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
});
