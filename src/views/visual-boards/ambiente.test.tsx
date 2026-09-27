import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAmbienteDaTela } from './ambiente';
import { ambienteDoCapitulo } from '../../lib/visualAmbiente';

describe('ambiente da tela inteira', () => {
  it('veste o <html> enquanto o capítulo está aberto e devolve o app ao normal ao sair', () => {
    const ambiente = ambienteDoCapitulo({ id: 'summary-fisica-orbitas', subject: 'Física', topic: 'Órbitas' });
    const raiz = document.documentElement;
    const { unmount } = renderHook(() => useAmbienteDaTela(ambiente));
    expect(raiz.dataset.ambiente).toBe('tecnologico');
    expect(raiz.dataset.ambienteNome).toBe('espaço');
    expect(raiz.style.getPropertyValue('--amb-a-neon')).toBe(ambiente.paleta.a);
    unmount();
    // O resto do app não pode herdar a cor do último capítulo visto.
    expect(raiz.dataset.ambiente).toBeUndefined();
    expect(raiz.style.getPropertyValue('--amb-a-neon')).toBe('');
  });

  it('sem ambiente (capítulo sem moldura tecnológica) não toca no <html>', () => {
    renderHook(() => useAmbienteDaTela(null));
    expect(document.documentElement.dataset.ambiente).toBeUndefined();
  });
});
