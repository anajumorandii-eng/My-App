import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BuscaRapida, buscarCapitulos, registrarRecente } from './BuscaRapida';
import { lerPreferencias, PREFERENCIAS_PADRAO } from '../../hooks/usePreferenciasVisual';

describe('busca rápida', () => {
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
  });
});
