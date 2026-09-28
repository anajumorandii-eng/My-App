import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BancadaOptica from './BancadaOptica';

const montarBancada = vi.hoisted(() => vi.fn());
vi.mock('./motorBancadaOptica', () => ({ montarBancada }));

const reserva = <div data-testid="reserva">Núcleo do Crivo</div>;

afterEach(() => {
  vi.useRealTimers();
  montarBancada.mockReset();
});

describe('BancadaOptica', () => {
  it('volta à reserva quando o WebGL é negado depois da sonda', () => {
    montarBancada.mockImplementation(() => { throw new Error('limite de contextos WebGL'); });
    render(<BancadaOptica reserva={reserva} />);
    expect(screen.getByTestId('reserva')).toBeTruthy();
    expect(screen.queryByRole('slider')).toBeNull();
  });

  it('o controle ganha da entrada de cena: a animação para no primeiro gesto', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    montarBancada.mockReturnValue({ definirP: vi.fn(), configurar: vi.fn(), destruir: vi.fn() });
    render(<BancadaOptica reserva={reserva} />);
    act(() => { vi.advanceTimersByTime(200); });
    const controle = screen.getByRole('slider') as HTMLInputElement;
    fireEvent.change(controle, { target: { value: '38' } });
    act(() => { vi.advanceTimersByTime(3000); });
    expect(controle.value).toBe('38');
  });
});
