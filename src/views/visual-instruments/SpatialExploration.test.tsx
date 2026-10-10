import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MolecularObjectView } from './ScienceObjectView';
import { StereochemistryView } from './StereochemistryView';
import { GeographicGlobeView } from './GeographicGlobeView';
import { MagneticTrajectoryView } from './MagneticTrajectoryView';
import MembraneMechanism from '../visual-boards/MembraneMechanism';
import WaveMechanism from '../visual-boards/WaveMechanism';
import { MagneticFieldView } from './MagneticFieldView';
import { EarthSeasonsView } from './EarthSeasonsView';
import { CarbonAllotropyView } from './CarbonAllotropyView';

describe('exploração espacial por teclado', () => {
  it('inclina e restaura a câmera molecular sem alterar geometria e polaridade', () => {
    render(<MolecularObjectView />);
    const drawing = screen.getByRole('img');
    const reading = screen.getByRole('status', { name: 'Leitura molecular' }).textContent;
    fireEvent.keyDown(drawing, { key: 'ArrowUp' });
    expect(drawing).toHaveAttribute('data-view-pitch', '17');
    fireEvent.keyDown(drawing, { key: 'ArrowRight', shiftKey: true });
    expect(drawing).toHaveAttribute('data-view-yaw', '40');
    expect(screen.getByRole('status', { name: 'Leitura molecular' }).textContent).toBe(reading);
    fireEvent.keyDown(drawing, { key: 'Home' });
    expect(drawing).toHaveAttribute('data-view-pitch', '12');
    expect(drawing).toHaveAttribute('data-view-yaw', '25');
  });

  it('trocar cis por trans conserva a câmera e altera a configuração, não a conectividade', () => {
    render(<StereochemistryView />);
    fireEvent.change(screen.getByRole('slider', { name: /Girar o modelo/ }), { target: { value: '120' } });
    fireEvent.click(screen.getByRole('button', { name: 'trans-but-2-eno' }));
    expect(screen.getByRole('img')).toHaveAttribute('data-view-yaw', '120');
    expect(screen.getByRole('img')).toHaveAccessibleName(/trans-but-2-eno/);
    expect(screen.getByRole('img').querySelectorAll('.vs-science-bond.multiple')).toHaveLength(1);
    expect(screen.getByRole('status', { name: 'Leitura estereoquímica' })).toHaveTextContent('lados opostos');
  });

  it('o ponto pode passar ao hemisfério oculto sem mudar seu endereço', () => {
    render(<GeographicGlobeView latitude={20} longitude={30} />);
    fireEvent.change(screen.getByRole('slider', { name: /Girar o globo/ }), { target: { value: '180' } });
    expect(screen.getByRole('img')).toHaveAccessibleName(/hemisfério oculto/);
    expect(screen.getByRole('status', { name: 'Leitura do globo' })).toHaveTextContent('Latitude 20°; longitude 30°');
    fireEvent.click(screen.getByRole('button', { name: 'Restaurar vista' }));
    expect(screen.getByRole('img')).toHaveAccessibleName(/Ponto visível/);
  });

  it('a bicamada usa o mesmo modo e percurso da bomba, preservando a câmera', () => {
    render(<MembraneMechanism />);
    fireEvent.click(screen.getByRole('button', { name: 'Explorar bicamada 3D' }));
    const drawing = screen.getByRole('img');
    fireEvent.keyDown(drawing, { key: 'ArrowRight' });
    fireEvent.click(screen.getByRole('button', { name: 'Bomba Na⁺/K⁺' }));
    fireEvent.change(screen.getByRole('slider', { name: 'Percurso na membrana' }), { target: { value: '1' } });
    expect(drawing).toHaveAttribute('data-view-yaw', '35');
    expect(drawing).toHaveAccessibleName(/três Na⁺ saem e dois K⁺ entram/);
  });

  it('mudar o ângulo magnético zera o percurso e conserva a rotação da vista', () => {
    const { rerender } = render(<MagneticTrajectoryView theta={60} />);
    fireEvent.change(screen.getByRole('slider', { name: 'Posição ao longo da trajetória' }), { target: { value: '.5' } });
    fireEvent.keyDown(screen.getByRole('img'), { key: 'ArrowRight' });
    rerender(<MagneticTrajectoryView theta={90} />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/circular/);
    expect(screen.getByRole('img')).toHaveAttribute('data-view-yaw', '40');
    expect(screen.getByRole('slider', { name: 'Posição ao longo da trajetória' })).toHaveValue('0');
    expect(screen.getByRole('status', { name: 'Leitura da trajetória' })).toHaveTextContent('0,60 N');
  });

  it('a onda 3D conserva frequência, comprimento e posição do laboratório', () => {
    render(<WaveMechanism kind="electromagnetic" />);
    fireEvent.change(screen.getByRole('slider', { name: /Frequência relativa/ }), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Explorar campos 3D' }));
    expect(screen.getByRole('img')).toHaveAccessibleName(/Frequência relativa 3, comprimento de onda 80/);
    const drawing = screen.getByRole('img');
    const before = drawing.innerHTML;
    fireEvent.change(screen.getByRole('slider', { name: 'Fração de um período' }), { target: { value: '.25' } });
    expect(drawing.innerHTML).not.toBe(before);
    fireEvent.keyDown(drawing, { key: 'ArrowUp' });
    expect(drawing).toHaveAttribute('data-view-pitch', '25');
    expect(screen.getByRole('status', { name: 'Leitura da onda' })).toHaveTextContent('λ = 80');
  });

  it('zerar a corrente remove o campo; escolher a espira conserva a câmera', () => {
    const { rerender } = render(<MagneticFieldView current={4} />);
    const drawing = screen.getByRole('img');
    fireEvent.keyDown(drawing, { key: 'ArrowRight' });
    fireEvent.click(screen.getByRole('button', { name: 'Espira circular' }));
    expect(drawing).toHaveAccessibleName(/campo no centro em \+z/);
    expect(drawing).toHaveAttribute('data-view-yaw', '30');
    expect(drawing.querySelectorAll('path[marker-end]')).toHaveLength(2);
    rerender(<MagneticFieldView current={0} />);
    expect(drawing).toHaveAccessibleName(/sem campo/);
    expect(drawing.querySelectorAll('path[marker-end]')).toHaveLength(0);
  });

  it('estações mudam com a data, enquanto a câmera conserva a leitura física', () => {
    render(<EarthSeasonsView />);
    const reading = screen.getByRole('status', { name: 'Leitura das estações' });
    const june = reading.textContent;
    fireEvent.keyDown(screen.getByRole('img'), { key: 'ArrowUp' });
    expect(reading.textContent).toBe(june);
    fireEvent.change(screen.getByRole('slider', { name: /Data no ano/ }), { target: { value: '355' } });
    expect(reading.textContent).not.toBe(june);
    expect(reading).toHaveTextContent('23.44°');
    fireEvent.change(screen.getByRole('slider', { name: 'Fração de uma rotação diária' }), { target: { value: '.5' } });
    expect(screen.getByRole('img')).toHaveAccessibleName(/rotação diária 180 graus/);
    expect(reading).toHaveTextContent('23.44°');
  });

  it('deslizar a folha do grafite altera posições, conserva ligações e reinicia ao trocar de alótropo', () => {
    render(<CarbonAllotropyView />);
    fireEvent.click(screen.getByRole('button', { name: 'Grafite' }));
    const drawing = screen.getByRole('img');
    const bonds = drawing.querySelectorAll('.vs-science-bond').length;
    const before = drawing.innerHTML;
    fireEvent.change(screen.getByRole('slider', { name: 'Deslizamento ilustrativo da camada superior' }), { target: { value: '1' } });
    expect(drawing.innerHTML).not.toBe(before);
    expect(drawing.querySelectorAll('.vs-science-bond')).toHaveLength(bonds);
    fireEvent.click(screen.getByRole('button', { name: 'Diamante' }));
    expect(drawing).toHaveAccessibleName(/quatro vizinhos tetraédricos/);
    fireEvent.click(screen.getByRole('button', { name: 'Grafite' }));
    expect(screen.getByRole('slider', { name: 'Deslizamento ilustrativo da camada superior' })).toHaveValue('0');
  });
});
