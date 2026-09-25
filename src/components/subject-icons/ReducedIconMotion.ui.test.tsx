import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FisicaIcon, RedacaoIcon, HistoriaIcon, InglesIcon } from './SubjectIcons';
import { GenerativeTopicIcon } from './GenerativeTopicIcon';
import { iconTarget, iconTransition } from './iconMotion';
import { useIconMotion } from './useIconMotion';
const visibility = vi.hoisted(() => ({ reduced: true, inView: true, pageInView: true }));
vi.mock('motion/react', async original => ({
  ...await original<typeof import('motion/react')>(),
  useReducedMotion: () => visibility.reduced,
  useInView: () => visibility.inView,
  usePageInView: () => visibility.pageInView,
}));
beforeEach(() => Object.assign(visibility, { reduced: true, inView: true, pageInView: true }));
describe('readable static icon frames', () => {
  it('keeps the physics orbital planes distinct', async () => {
    const { container } = render(<FisicaIcon />);
    await waitFor(() => {
      const ellipses = container.querySelectorAll('ellipse');
      expect(ellipses[1].style.transform).toContain('60deg');
      expect(ellipses[2].style.transform).toContain('120deg');
    });
  });
  it('keeps writing strokes and hourglass sand visible', async () => {
    const { container } = render(<><RedacaoIcon /><HistoriaIcon /><InglesIcon /></>);
    await waitFor(() => {
      expect(container.querySelector('text')).toHaveStyle({ opacity: '1' });
      for (const line of container.querySelectorAll('line')) expect(line).toHaveStyle({ opacity: '1' });
      expect(container.querySelector('line')).toHaveAttribute('y2', '10');
    });
  });
  it('renders deterministic topic shapes without removing their geometry', () => {
    const { container } = render(<GenerativeTopicIcon topic="Óptica geométrica" aria-label="Óptica" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
    expect(container.querySelectorAll('path, circle, rect, polygon, ellipse').length).toBeGreaterThan(0);
  });
  it('retains the normal animation and cancels all repeating/delayed transitions when reduced', () => {
    const transition = { repeat: Infinity, duration: 3, delay: 1 };
    expect(iconTransition(transition, false)).toBe(transition);
    expect(iconTransition(transition, true)).toEqual({ duration: 0, delay: 0, repeat: 0 });
    const target = { opacity: [0, 1, 0], pathLength: [0, 1], y: [0, -5], scale: [1, 1.3, 1] };
    expect(iconTarget(target, false)).toBe(target);
    expect(iconTarget(target, true)).toEqual({ opacity: 1, pathLength: 1, y: 0, scale: 1 });
  });
  it.each(['outside the viewport', 'in a background tab'])('holds icon motion %s and resumes on return', (state) => {
    function MotionState() {
      const { iconRef, still } = useIconMotion();
      return <svg ref={iconRef} data-still={still} />;
    }
    visibility.reduced = false;
    const { container, rerender } = render(<MotionState />);
    expect(container.querySelector('svg')).toHaveAttribute('data-still', 'false');
    if (state === 'outside the viewport') visibility.inView = false;
    else visibility.pageInView = false;
    rerender(<MotionState />);
    expect(container.querySelector('svg')).toHaveAttribute('data-still', 'true');
    visibility.inView = true;
    visibility.pageInView = true;
    rerender(<MotionState />);
    expect(container.querySelector('svg')).toHaveAttribute('data-still', 'false');
  });
});
