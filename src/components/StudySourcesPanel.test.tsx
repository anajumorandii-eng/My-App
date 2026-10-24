import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { StudySourcesPanel } from './StudySourcesPanel';
import type { StudyPacket } from '../lib/studySources';

afterEach(cleanup);
const packet: StudyPacket = {
  topicId: 'mat_geometria', chapter: '', coverage: [], referenceText: '',
  sources: [
    { id: 'F1', title: 'Resumo editorial', kind: 'resumo', content: 'A soma dos ângulos de um triângulo é 180°.', excerpt: false },
    { id: 'AS1', title: 'Apostila: matemática — Geometria Plana', kind: 'resumo', content: 'Dq MO NKrAO < 80 >\nOpen Save Rec Play exe Prefs\n43 Ângulos em polígonos', excerpt: true },
  ],
};
it('recupera a extração do AS1 salvo e renderiza as fórmulas sem imagens de páginas', async () => {
  // Verify formatting after the lazy module is available, independently of cold-load speed.
  await import('./AiTextRenderer');
  render(<MemoryRouter><StudySourcesPanel packet={packet} /></MemoryRouter>);
  expect(screen.getByText(/\[AS1\] Apostila/)).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('texto da apostila foi corrigido');
  expect(screen.getByRole('status')).toHaveTextContent('Gere um novo aprofundamento');
  await waitFor(() => expect(document.querySelectorAll('.katex').length).toBeGreaterThan(0), { timeout: 5000 });
  expect(screen.queryByRole('img', { hidden: true })).toBeNull();
  expect(screen.getByRole('link', { name: 'Conferir origem cadastrada', hidden: true })).toHaveAttribute('href', expect.stringContaining('1LY2wYXIO2vQnoq5yunu4jFe7BR2sIx1k'));
  expect(document.querySelector('.katex-error')).toBeNull();
  expect(screen.queryByText(/Open Save/)).toBeNull();
  expect(screen.getByText('A soma dos ângulos de um triângulo é 180°.')).toBeInTheDocument();
});
it('mantém a apostila legível disponível para conferência', () => {
  render(<MemoryRouter><StudySourcesPanel packet={{ ...packet, sources: [{ ...packet.sources[1], content: 'A área do triângulo é metade do produto da base pela altura.' }] }} /></MemoryRouter>);
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText(/A área do triângulo/)).toBeInTheDocument();
});

it('continua sinalizando apostilas sem extração conferida', () => {
  render(<MemoryRouter><StudySourcesPanel packet={{ ...packet, sources: [{ ...packet.sources[1], title: 'Apostila: matemática — Funções' }] }} /></MemoryRouter>);
  expect(screen.getByRole('status', { hidden: true })).toHaveTextContent('erros de extração');
  expect(screen.queryByText(/Open Save/)).toBeNull();
});
