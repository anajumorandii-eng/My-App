import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSpatialRotation } from './useSpatialRotation';

const animation = vi.hoisted(() => ({ listeners: new Set<() => void>(), reduced: false, stop: vi.fn(), update: (_value: number) => {}, complete: () => {} }));
vi.mock('motion/react', () => ({
  animate: (_from: number, _to: number, options: { onUpdate: (value: number) => void; onComplete: () => void }) => {
    animation.update = options.onUpdate;
    animation.complete = options.onComplete;
    return { stop: animation.stop };
  },
}));

function Camera() {
  const camera = useSpatialRotation(25, 20);
  return <>
    <svg {...camera.interaction} role="img" aria-label="Modelo" data-yaw={camera.yaw} data-pitch={camera.pitch} />
    <label>Girar<input type="range" min="0" max="360" value={camera.yaw} onChange={e => camera.setYaw(Number(e.target.value))} /></label>
    <label>Inclinar<input type="range" min="-50" max="65" value={camera.pitch} onChange={e => camera.setPitch(Number(e.target.value))} /></label>
    <button onClick={camera.toggleSpin}>{camera.spinning ? 'Pausar' : 'Girar automaticamente'}</button>
  </>;
}

beforeEach(() => {
  animation.reduced = false; animation.stop.mockClear(); animation.listeners.clear();
  vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
    get matches() { return animation.reduced; }, media: '(prefers-reduced-motion: reduce)', onchange: null,
    addEventListener: (_type: string, listener: () => void) => animation.listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => animation.listeners.delete(listener),
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => true,
  } as unknown as MediaQueryList));
});
afterEach(() => vi.restoreAllMocks());
describe('prioridade da câmera manual', () => {
  it('não aplica outro quadro quando a preferência muda antes de o React receber a notificação', () => {
    render(<Camera />);
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    act(() => animation.update(30));
    animation.reduced = true;
    act(() => animation.update(90));
    expect(screen.getByRole('img')).toHaveAttribute('data-yaw', '55');
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
  });
  it('a ação respeita a preferência atual antes da notificação da consulta de mídia', () => {
    render(<Camera />);
    animation.reduced = true;
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    expect(screen.getByRole('img')).toHaveAttribute('data-yaw', '115');
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
  });
  it('respeita a preferência atual mesmo quando a consulta criada anteriormente mantém um valor antigo', () => {
    const cached = window.matchMedia('(prefers-reduced-motion: reduce)');
    vi.mocked(window.matchMedia).mockImplementationOnce(() => ({ ...cached, matches: false }));
    render(<Camera />);
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    animation.reduced = true;
    act(() => animation.listeners.forEach(notify => notify()));
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
  });
  it.each(['Girar', 'Inclinar'])('interrompe o giro pelo controle %s e ignora atualizações antigas', label => {
    render(<Camera />);
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    act(() => animation.update(30));
    const lateUpdate = animation.update;
    fireEvent.change(screen.getByRole('slider', { name: label }), { target: { value: '40' } });
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
    expect(animation.stop).toHaveBeenCalled();
    act(() => lateUpdate(180));
    expect(screen.getByRole('img')).toHaveAttribute(label === 'Girar' ? 'data-yaw' : 'data-pitch', '40');
    if (label === 'Inclinar') expect(screen.getByRole('img')).toHaveAttribute('data-yaw', '55');
  });
  it('interrompe pelo teclado e um callback antigo não encerra um novo giro', () => {
    render(<Camera />);
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    const staleComplete = animation.complete;
    fireEvent.keyDown(screen.getByRole('img'), { key: 'ArrowRight' });
    expect(screen.getByRole('img')).toHaveAttribute('data-yaw', '30');
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    act(staleComplete);
    expect(screen.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
  });
  it('pausa ao ocultar a página e ao ativar movimento reduzido', () => {
    render(<Camera />);
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    fireEvent(document, new Event('visibilitychange'));
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
    visibility.mockRestore();
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    animation.reduced = true;
    act(() => animation.listeners.forEach(notify => notify()));
    expect(screen.getByRole('button', { name: 'Girar automaticamente' })).toBeInTheDocument();
    const before = Number(screen.getByRole('img').getAttribute('data-yaw'));
    fireEvent.click(screen.getByRole('button', { name: 'Girar automaticamente' }));
    expect(screen.getByRole('img')).toHaveAttribute('data-yaw', String((before + 90) % 360));
  });
});
