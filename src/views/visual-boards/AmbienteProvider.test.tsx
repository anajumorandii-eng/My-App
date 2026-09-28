import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { AmbienteProvider, useAmbienteApp } from '../../design-system/ambiente/AmbienteProvider';
import { useAmbienteDaTela } from './ambiente';
import { ambienteDoCapitulo } from '../../lib/visualAmbiente';

const orbitas = ambienteDoCapitulo({ id: 'summary-fisica-orbitas', subject: 'Física', topic: 'Órbitas' });

function Tela({ ambiente }: { ambiente: typeof orbitas | null }) {
  useAmbienteDaTela(ambiente);
  return null;
}

let mudar: ((m: { cor: 'Solar' | 'Floresta' }) => void) | undefined;
let automatico: string | undefined;
function Espiao() {
  const app = useAmbienteApp();
  mudar = app?.mudarPreferencias;
  automatico = app?.sobreposto?.nome;
  return null;
}

describe('AmbienteProvider', () => {
  beforeEach(() => localStorage.clear());

  it('sem tela pedindo nada, o app inteiro fica no ambiente padrão', () => {
    render(<AmbienteProvider><Tela ambiente={null} /></AmbienteProvider>);
    expect(document.documentElement.dataset.ambiente).toBe('tecnologico');
    expect(document.documentElement.dataset.ambienteNome).toBe('Crivo');
  });

  it('a tela com conteúdo pede a cor dele e, ao sair, o app volta ao padrão', () => {
    const { rerender } = render(<AmbienteProvider><Tela ambiente={orbitas} /></AmbienteProvider>);
    expect(document.documentElement.dataset.ambienteNome).toBe('espaço');
    rerender(<AmbienteProvider><Tela ambiente={null} /></AmbienteProvider>);
    // Um escritor só: antes, a limpeza do Visual apagava o ambiente do app.
    expect(document.documentElement.dataset.ambiente).toBe('tecnologico');
    expect(document.documentElement.dataset.ambienteNome).toBe('Crivo');
  });

  it('a paleta escolhida no Personalizar vale fora das telas de conteúdo', () => {
    render(<AmbienteProvider><Espiao /><Tela ambiente={null} /></AmbienteProvider>);
    act(() => mudar?.({ cor: 'Solar' }));
    expect(document.documentElement.dataset.ambienteNome).toBe('Solar');
  });

  it('com paleta fixa, a tela aplica a escolha mas o painel ainda vê o automático', () => {
    render(<AmbienteProvider><Espiao /><Tela ambiente={orbitas} /></AmbienteProvider>);
    act(() => mudar?.({ cor: 'Floresta' }));
    expect(document.documentElement.dataset.ambienteNome).toBe('Floresta');
    // Era o defeito apontado na revisão: o "Automática" do painel mostrava a
    // Floresta como se viesse da matéria.
    expect(automatico).toBe('espaço');
  });
});
