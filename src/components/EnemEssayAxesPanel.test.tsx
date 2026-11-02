import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { EnemEssayAxesPanel } from './EnemEssayAxesPanel';
import { enemEssayAxes, enemEssayThemes } from '../data/enemEssay2026';

it('mostra os oito temas e entrega a proposta do eixo ao treino', () => {
  const onPractice = vi.fn();
  render(<EnemEssayAxesPanel onPractice={onPractice} />);
  expect(enemEssayThemes.map(t => t.year)).toEqual([2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]);
  expect(screen.getByText(/Perspectivas acerca do envelhecimento/)).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', { name: 'Treinar esta proposta' })[0]);
  expect(onPractice).toHaveBeenCalledWith(enemEssayAxes[0].practice);
});

it('eixos não repetem o grupo dos três últimos temas e todo repertório cita fonte conferível', () => {
  const recent = /mulher|herança africana|envelhecimento|idos/i;
  for (const axis of enemEssayAxes) {
    expect(axis.title).not.toMatch(recent);
    expect(axis.repertoire.length).toBeGreaterThanOrEqual(3);
    // Sem estatística de memória: percentuais e "milhões" ficam para a coletânea.
    expect(axis.repertoire.join(' ')).not.toMatch(/\d+\s?%|milh(ão|ões)/);
  }
});
