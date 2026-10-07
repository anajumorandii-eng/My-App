import { createElement, lazy, Suspense, type ComponentType } from 'react';
import type { BoardProps } from './types';

/** Catalog lookup stays synchronous; only the selected drawing is downloaded. */
export function lazyBoard(load: () => Promise<{ default: ComponentType<BoardProps> }>): ComponentType<BoardProps> {
  const Component = lazy(load);
  return function DeferredBoard(props: BoardProps) {
    return createElement(Suspense, {
      fallback: createElement('p', { role: 'status', className: 'p-4 text-sm' }, 'Carregando representação…'),
    }, createElement(Component, props));
  };
}

export function lazyBoardFactory<Args extends unknown[]>(load: () => Promise<{ default: (...args: Args) => ComponentType<BoardProps> }>): (...args: Args) => ComponentType<BoardProps> {
  return (...args) => lazyBoard(async () => ({ default: (await load()).default(...args) }));
}
