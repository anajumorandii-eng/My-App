import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CenaDaMateria } from './CenaDaMateria';

vi.mock('./BancadaOptica', () => ({ default: () => <div>Cena de Física</div> }));

describe('carregamento do laboratório', () => {
  it('abre a cena solicitada sem agendar a carga de todas as outras matérias', async () => {
    const idle = vi.fn();
    vi.stubGlobal('requestIdleCallback', idle);
    const loseContext = vi.fn();
    const context = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      getExtension: () => ({ loseContext }),
    } as unknown as WebGLRenderingContext);
    try {
      render(<CenaDaMateria materia="Física" reserva={<p>Reserva</p>} />);
      expect(await screen.findByText('Cena de Física')).toBeVisible();
      expect(loseContext).toHaveBeenCalledOnce();
      expect(idle).not.toHaveBeenCalled();
      expect(screen.queryByText('Reserva')).toBeNull();
    } finally {
      context.mockRestore();
      vi.unstubAllGlobals();
    }
  });
});
