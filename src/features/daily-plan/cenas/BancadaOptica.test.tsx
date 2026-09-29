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

  it('parada: nada muda sozinho, só o controle move o objeto', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const definirP = vi.fn();
    montarBancada.mockReturnValue({ definirP, configurar: vi.fn(), destruir: vi.fn() });
    render(<BancadaOptica reserva={reserva} />);
    const controle = screen.getByRole('slider') as HTMLInputElement;
    act(() => { vi.advanceTimersByTime(3000); });
    // A versão com entrada animada começava em 40 cm e deslizava até 25.
    expect(controle.value).toBe('25');
    fireEvent.change(controle, { target: { value: '38' } });
    expect(controle.value).toBe('38');
    expect(definirP).toHaveBeenLastCalledWith(38 / 5);
  });
});
