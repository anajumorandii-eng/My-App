import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canvasContext } from '../../../testSetup';
import { SubjectAtmosphere } from './SubjectAtmosphere';

const useReducedMotionMock = vi.hoisted(() => vi.fn(() => false));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, useReducedMotion: useReducedMotionMock };
});

describe('SubjectAtmosphere', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    useReducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => document.documentElement.classList.remove('dark'));

  it('keeps the field inside an isolated visible layer', () => {
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);
    const atmosphere = screen.getByTestId('subject-atmosphere');
    expect(atmosphere).toHaveAttribute('data-subject', 'fisica');
    expect(atmosphere).toHaveClass('isolate');
    expect(atmosphere.querySelector('canvas')).toHaveClass('z-0');
    expect(atmosphere).toHaveStyle({ backgroundColor: 'var(--subject-bg)' });
  });

  it('keeps both theme translations local to the active subject', () => {
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);

    const style = screen.getByTestId('subject-atmosphere').style;
    expect(style.getPropertyValue('--subject-light-bg')).toBe('#FBF8F2');
    expect(style.getPropertyValue('--subject-dark-bg')).toBe('#0A0E15');
    expect(style.getPropertyValue('--subject-light-field-css')).not.toBe('');
    expect(style.getPropertyValue('--subject-dark-field-css')).not.toBe('');
  });

  it('redraws the resolved final field after theme and subject changes when motion is reduced', async () => {
    useReducedMotionMock.mockReturnValue(true);
    const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const node = element as HTMLElement;
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      return {
        getPropertyValue: (property: string) => {
          const token = property.replace('--subject-', '');
          return node.style.getPropertyValue(`--subject-${theme}-${token}`);
        },
      } as CSSStyleDeclaration;
    });
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    const clearRect = vi.mocked(canvasContext.clearRect);
    const initialDrawCount = clearRect.mock.calls.length;
    const { rerender } = render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);
    const atmosphere = screen.getByTestId('subject-atmosphere');

    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(initialDrawCount));
    const lightDrawCount = clearRect.mock.calls.length;
    document.documentElement.classList.add('dark');
    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(lightDrawCount));

    const darkDrawCount = clearRect.mock.calls.length;
    rerender(<SubjectAtmosphere subject="Biologia"><p>Decisão</p></SubjectAtmosphere>);
    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(darkDrawCount));

    expect(atmosphere.style.getPropertyValue('--subject-dark-bg')).toBe('#0A150F');
    expect(getComputedStyleSpy).toHaveBeenCalledWith(atmosphere);
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
    getComputedStyleSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });
});
