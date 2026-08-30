import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

const canvasGradient = { addColorStop: vi.fn() };
export const canvasContext = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  rect: vi.fn(),
  roundRect: vi.fn(),
  arc: vi.fn(),
  ellipse: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  rotate: vi.fn(),
  setLineDash: vi.fn(),
  createLinearGradient: vi.fn(() => canvasGradient),
  createRadialGradient: vi.fn(() => canvasGradient),
  createConicGradient: vi.fn(() => canvasGradient),
} as unknown as CanvasRenderingContext2D;

if (typeof HTMLCanvasElement !== 'undefined') {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(canvasContext);
}

if (typeof ResizeObserver === 'undefined') {
  class ImmediateResizeObserver implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}

    observe(target: Element) {
      const rect = target.getBoundingClientRect();
      this.callback([{ target, contentRect: rect } as ResizeObserverEntry], this);
    }

    unobserve() {}
    disconnect() {}
  }

  globalThis.ResizeObserver = ImmediateResizeObserver;
}

afterEach(cleanup);
