import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMechanismTime } from './MechanismFrame';

const animation = vi.hoisted(() => ({ listeners: new Set<() => void>(), reduced: false, calls: 0, stop: vi.fn(), update: (_value: number) => {}, complete: () => {} }));
vi.mock('motion/react', () => ({
  animate: (_from: number, _to: number, options: { onUpdate: (value: number) => void; onComplete: () => void }) => {
    animation.calls += 1; animation.update = options.onUpdate; animation.complete = options.onComplete;
    return { stop: animation.stop };
  },
}));
function Demonstration() {
  const clock = useMechanismTime();
  return <>
    <output aria-label="Tempo observado">{clock.time}</output>
    <input type="range" min="0" max="1" step="0.01" value={clock.time} aria-label="Percurso" onChange={event => clock.seek(Number(event.target.value))} />
    <button onClick={clock.playing ? clock.stop : clock.play}>{clock.playing ? 'Pausar' : 'Reproduzir'}</button>
  </>;
}
beforeEach(() => {
  animation.reduced = false; animation.calls = 0; animation.stop.mockClear(); animation.listeners.clear();
  vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
    get matches() { return animation.reduced; }, media: '(prefers-reduced-motion: reduce)', onchange: null,
    addEventListener: (_type: string, listener: () => void) => animation.listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => animation.listeners.delete(listener),
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => true,
  } as unknown as MediaQueryList));
});
afterEach(() => vi.restoreAllMocks());
describe('percurso sob controle da estudante', () => {
  it('reproduz sem animar quando a preferência muda antes da notificação', () => {
    render(<Demonstration />);
    animation.reduced = true;
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    expect(screen.getByLabelText('Tempo observado')).toHaveTextContent('1');
    expect(animation.calls).toBe(0);
  });
  it('preserva o valor manual e um callback antigo não termina uma nova reprodução', () => {
    render(<Demonstration />);
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    const oldUpdate = animation.update, oldComplete = animation.complete;
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.5' } });
    act(() => oldUpdate(.8));
    expect(screen.getByLabelText('Tempo observado')).toHaveTextContent('0.5');
    expect(animation.stop).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    act(oldComplete);
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
  });
  it('pausa no estado observado ao mudar a preferência e avança sem animar na próxima reprodução', () => {
    render(<Demonstration />);
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    act(() => animation.update(.37));
    const oldUpdate = animation.update;
    animation.reduced = true;
    act(() => animation.listeners.forEach(notify => notify()));
    act(() => oldUpdate(.9));
    expect(screen.getByLabelText('Tempo observado')).toHaveTextContent('0.37');
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    expect(screen.getByLabelText('Tempo observado')).toHaveTextContent('1');
    expect(animation.calls).toBe(1);
  });
  it('preserva o percurso ao sair da página e aguarda uma nova ação ao retornar', () => {
    render(<Demonstration />);
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir' }));
    act(() => animation.update(.45));
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument();
    visibility.mockReturnValue('visible'); fireEvent(document, new Event('visibilitychange'));
    expect(screen.getByLabelText('Tempo observado')).toHaveTextContent('0.45');
    expect(screen.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument();
  });
});
