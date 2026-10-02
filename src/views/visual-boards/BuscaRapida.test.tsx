import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BuscaRapida, buscarCapitulos, registrarRecente } from './BuscaRapida';
import { lerPreferencias, PREFERENCIAS_PADRAO } from '../../hooks/usePreferenciasVisual';
import userEvent from '@testing-library/user-event';

describe('busca rápida', () => {
  it('mantém Tab e Shift+Tab dentro do diálogo', async () => {
    const user = userEvent.setup();
    render(<><button>Anterior</button><BuscaRapida aberta onFechar={vi.fn()} onAbrir={vi.fn()} /><button>Próximo</button></>);
    const campo = screen.getByRole('combobox');
    campo.focus();
    await user.tab();
    expect(campo).toHaveFocus();
    await user.tab({ shift: true });
    expect(campo).toHaveFocus();
  });

  it('Esc fecha mesmo após perda de foco e a desmontagem devolve o foco à origem', async () => {
    const user = userEvent.setup();
    const onFechar = vi.fn();
    const origin = document.createElement('button');
    document.body.append(origin);
    origin.focus();
    const view = render(<BuscaRapida aberta onFechar={onFechar} onAbrir={vi.fn()} />);
    try {
      await screen.findByRole('combobox');
      origin.focus();
      await user.keyboard('{Escape}');
      expect(onFechar).toHaveBeenCalledTimes(1);
      screen.getByRole('combobox').focus();
      view.unmount();
      expect(origin).toHaveFocus();
    } finally { view.unmount(); origin.remove(); }
  });

  it('devolve o foco ao botão original quando a busca veio de um carregamento intermediário', () => {
    const origin = document.createElement('button');
    const loading = document.createElement('button');
    document.body.append(origin, loading);
    loading.focus();
    const view = render(<BuscaRapida aberta onFechar={vi.fn()} onAbrir={vi.fn()} focoDeRetorno={{ current: origin }} />);
    try {
      screen.getByRole('combobox').focus();
      view.unmount();
      expect(origin).toHaveFocus();
    } finally { view.unmount(); origin.remove(); loading.remove(); }
  });

  it('acha o capítulo pelo texto, não só pelo título: "mitose" leva a Divisão Celular', () => {
    const topicos = buscarCapitulos('mitose').map((item) => item.topic);
    expect(topicos).toContain('Divisão Celular');
  });

  it('ignora acento e ordem das palavras', () => {
    expect(buscarCapitulos('orbitas').map((item) => item.id)).toContain('summary-fisica-orbitas');
    expect(buscarCapitulos('massa equivalencia').map((item) => item.id)).toContain('summary-fisica-equivalencia-massa-energia');
  });

  it('Enter abre o resultado em destaque e fecha a busca', () => {
    const onAbrir = vi.fn();
    const onFechar = vi.fn();
    render(<BuscaRapida aberta onFechar={onFechar} onAbrir={onAbrir} />);
    const campo = screen.getByRole('combobox', { name: 'Buscar capítulo' });
    fireEvent.change(campo, { target: { value: 'órbitas' } });
    fireEvent.keyDown(campo, { key: 'Enter' });
    expect(onAbrir).toHaveBeenCalledWith('summary-fisica-orbitas');
    expect(onFechar).toHaveBeenCalled();
  });

  it('sem texto, mostra os capítulos abertos por último', () => {
    registrarRecente('summary-fisica-orbitas');
    render(<BuscaRapida aberta onFechar={vi.fn()} onAbrir={vi.fn()} />);
    expect(screen.getByText('Abertos por último')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Órbitas/i })).toBeInTheDocument();
  });
});

describe('preferências do Visual', () => {
  it('valor desconhecido ou JSON quebrado cai no padrão, sem quebrar a tela', () => {
    expect(lerPreferencias('{"cor":"Arco-íris","efeitos":"turbo","fundo":"xadrez"}')).toEqual(PREFERENCIAS_PADRAO);
    expect(lerPreferencias('{quebrado')).toEqual(PREFERENCIAS_PADRAO);
    expect(lerPreferencias('{"cor":"Solar","efeitos":"suave","fundo":"grade"}')).toEqual({ cor: 'Solar', efeitos: 'suave', fundo: 'grade' });
    // "Aurora" gravado antes do caderno era o padrão antigo, não escolha: passa ao caderno.
    expect(lerPreferencias('{"cor":"automatica","efeitos":"completo","fundo":"aurora"}').fundo).toBe('caderno');
    // Escolhido depois do caderno existir, fica.
    expect(lerPreferencias('{"cor":"automatica","efeitos":"completo","fundo":"aurora","fundoRevisto":true}').fundo).toBe('aurora');
  });
});
