import React from 'react';
import { readFileSync } from 'node:fs';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { SolidConfigId } from '../../lib/solidInstruments';
import { buildVisualMap } from '../../lib/visualStudy';
import { solidInstrument } from './SolidInstrument';

function montar(id: SolidConfigId, topico: string) {
  const summary = interactiveSummaries.find((item) => item.subject === 'Matemática' && item.topic === topico)!;
  const Board = solidInstrument(id);
  render(<Board map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={() => undefined} hiddenEdgeIds={[]} mode="explorar" />);
}

/** O valor exibido para uma leitura: o dd que acompanha o dt com esse rótulo. */
function leitura(rotulo: string): string {
  return screen.getByText(rotulo, { selector: 'dt' }).nextElementSibling?.textContent ?? '';
}

function mover(rotulo: RegExp, valor: number) {
  fireEvent.change(screen.getByLabelText(rotulo), { target: { value: String(valor) } });
}

describe('instrumento de sólidos', () => {
  it('bloco: abre com o exemplo do capítulo (3 x 4 x 12), cuja diagonal principal é 13', () => {
    montar('bloco', 'Cubos e Paralelepípedos');
    expect(screen.getByRole('img', { name: /Bloco retangular.*3.*4.*12/i })).toBeInTheDocument();
    expect(leitura('Diagonal principal')).toBe('13');
    expect(leitura('Volume')).toBe('144');
  });

  it('bloco: mexer na altura recalcula a diagonal e o desenho acompanha', () => {
    montar('bloco', 'Cubos e Paralelepípedos');
    mover(/altura/i, 6);
    expect(leitura('Diagonal principal')).toBe('7,81');
    expect(screen.getByRole('img', { name: /3.*4.*6/ })).toBeInTheDocument();
  });

  it('prisma: inclinar mantém o volume e troca as áreas pela aresta lateral', () => {
    montar('prisma', 'Prismas');
    const volume = leitura('Volume');
    expect(screen.getByText('Área lateral', { selector: 'dt' })).toBeInTheDocument();

    mover(/inclinação/i, 3);
    expect(leitura('Volume')).toBe(volume);
    expect(leitura('Aresta lateral')).toBe('5,83');
    expect(screen.queryByText('Área lateral', { selector: 'dt' })).not.toBeInTheDocument();
  });

  it('pirâmide: o corte revela a pirâmide menor e o tronco', () => {
    montar('piramide', 'Pirâmides');
    expect(screen.queryByText('Pirâmide menor', { selector: 'dt' })).not.toBeInTheDocument();
    expect(leitura('Volume')).toBe('48');

    mover(/posição do corte/i, 0.5);
    expect(leitura('Pirâmide menor')).toBe('6');
    expect(leitura('Tronco')).toBe('42');
  });

  it('sólidos de revolução: a esfera dispensa a altura e troca as leituras', () => {
    montar('revolucao', 'Sólidos de Revolução');
    expect(screen.getByLabelText(/altura/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Esfera'));
    expect(screen.queryByLabelText(/altura/i)).not.toBeInTheDocument();
    expect(screen.getByText('Área da superfície', { selector: 'dt' })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Cone'));
    expect(leitura('Fração do cilindro de mesma base e altura')).toBe('1/3');
  });

  it('razões entre volumes: dobrar a razão de semelhança multiplica o volume por 8', () => {
    montar('semelhanca', 'Razões entre Volumes de Sólidos');
    mover(/razão de semelhança/i, 2);
    expect(leitura('Razão de áreas k²')).toBe('4');
    expect(leitura('Razão de volumes k³')).toBe('8');
  });

  it('todo controle é um campo com rótulo, faixa e passo declarados', () => {
    montar('prisma', 'Prismas');
    for (const campo of screen.getAllByRole('slider')) {
      expect(campo).toHaveAttribute('min');
      expect(campo).toHaveAttribute('max');
      expect(campo).toHaveAttribute('step');
      expect(campo).toHaveAccessibleName();
    }
  });

  it('o bordô do instrumento tem contraste de texto (4,5:1) sobre o cartão nos dois temas', () => {
    // O bordô do tema (#852636) fica com cerca de 2:1 sobre o fundo escuro: os
    // valores dos controles e o preenchimento dos sliders somem. Só a captura
    // no navegador tinha mostrado isso.
    const visual = readFileSync('src/views/Visual.css', 'utf8');
    const solidos = readFileSync('src/views/visual-instruments/SolidInstrument.css', 'utf8');
    const cor = (css: string, seletor: RegExp, variavel: string) => new RegExp(`${variavel}:\\s*(#[0-9a-fA-F]{6})`).exec(seletor.exec(css)?.[0] ?? '')?.[1];
    const luminancia = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contraste = (a: string, b: string) => {
      const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
      return (claro + 0.05) / (escuro + 0.05);
    };

    const cartaoClaro = cor(visual, /\.crivo-visual \{[^}]*\}/, '--vs-paper-strong')!;
    const bordoClaro = cor(visual, /\.crivo-visual \{[^}]*\}/, '--vs-burgundy')!;
    expect(contraste(bordoClaro, cartaoClaro), 'tema claro').toBeGreaterThanOrEqual(4.5);

    const cartaoEscuro = cor(visual, /\.dark \.crivo-visual \{[^}]*\}/, '--vs-paper-strong')!;
    const bordoEscuro = cor(solidos, /\.dark \.crivo-visual \.vs-solid-instrument \{[^}]*\}/, '--vs-burgundy');
    expect(bordoEscuro, 'o instrumento precisa clarear o bordô no tema escuro').toBeDefined();
    expect(contraste(bordoEscuro!, cartaoEscuro), 'tema escuro').toBeGreaterThanOrEqual(4.5);
  });

  it('o desenho declara o viewBox que a geometria usa', () => {
    montar('bloco', 'Cubos e Paralelepípedos');
    expect(screen.getByRole('img', { name: /Bloco retangular/i })).toHaveAttribute('viewBox', '0 0 320 300');
  });
});
