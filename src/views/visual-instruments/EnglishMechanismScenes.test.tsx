import React from 'react';
import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

it('redução de movimento mantém a seta estática e retira o traçado animado', async () => {
  const original = window.matchMedia;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion'), media: query,
    addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
  try {
    const { EnglishMechanismScene } = await import('./EnglishMechanismScenes');
    const view = render(<EnglishMechanismScene id="hurricane-forecast" selected={1} />);
    expect(view.container.querySelector('figure')).toHaveAttribute('data-motion', 'reduced');
    expect(view.container.querySelector('.english-relation')).toBeInTheDocument();
    expect(view.container.querySelector('.english-relation-trace')).toBeNull();
    expect(view.container.querySelector('blockquote')).toHaveTextContent('because a storm surge is expected tonight');
    expect(view.container.querySelector('figcaption')).toHaveTextContent('decisão preventiva de agora');
    view.unmount();
  } finally { window.matchMedia = original; }
});
