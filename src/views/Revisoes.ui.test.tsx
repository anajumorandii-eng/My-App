import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { mockTopics } from '../data/mockData';
import Revisoes from './Revisoes';

// Doze tópicos, todos vencidos: o bastante para passar do primeiro lote.
const topicos = mockTopics.slice(0, 12);
const mastery = topicos.map((topic) => ({
  topicId: topic.id,
  level: 40,
  uncertainty: 0.4,
  lastReviewed: '2026-01-01',
  errorSignals: 0,
}));

vi.mock('../hooks/useUserMastery', () => ({
  useUserMastery: () => ({ mastery, updateMastery: vi.fn(), isPersisted: true, syncError: null }),
}));
vi.mock('../hooks/useSummaryProgress', () => ({
  useSummaryProgress: () => ({ progress: {}, update: vi.fn(), loading: false, syncError: null, isCloudSynced: false }),
}));

describe('Revisões', () => {
  it('mostra a fila em lotes, das mais urgentes, e abre o resto a pedido', () => {
    render(<MemoryRouter><Revisoes /></MemoryRouter>);

    const visiveis = () => topicos.filter((topic) => screen.queryByText(topic.name)).length;
    expect(visiveis()).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar mais 2 de 2 restantes' }));
    expect(visiveis()).toBe(12);
  });
});
