import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { mockTopics } from '../data/mockData';
import Revisoes from './Revisoes';

// Doze tópicos, todos vencidos: o bastante para passar do primeiro lote.
const topicos = mockTopics.slice(0, 12);
let mastery = topicos.map((topic) => ({
  topicId: topic.id,
  level: 40,
  uncertainty: 0.4,
  lastReviewed: '2026-01-01',
  errorSignals: 0,
}));

const { stream } = vi.hoisted(() => ({ stream: vi.fn(async () => ({ text: 'Revisão detalhada gerada' })) }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: () => ({ questions: [], loading: false, syncError: null }) }));
vi.mock('../components/ReviewDayContext', () => ({ default: () => <div>Revisão na rotina</div> }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: stream }));

vi.mock('../hooks/useUserMastery', () => ({
  useUserMastery: () => ({ mastery, updateMastery: vi.fn(), isPersisted: true, syncError: null }),
}));
vi.mock('../hooks/useSummaryProgress', () => ({
  useSummaryProgress: () => ({ progress: {}, update: vi.fn(), loading: false, syncError: null, isCloudSynced: false }),
}));

describe('Revisões', () => {
  it('mostra a fila em lotes, das mais urgentes, e abre o resto a pedido', () => {
    render(<MemoryRouter><Revisoes /></MemoryRouter>);

    const visiveis = () => topicos.filter((topic) => screen.queryByRole('heading', { name: topic.name })).length;
    expect(visiveis()).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar mais 2 de 2 restantes' }));
    expect(visiveis()).toBe(12);
  });
});


it('envia banca e subtópico selecionados e não reutiliza revisão de outra banca', async () => {
  render(<MemoryRouter><Revisoes /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Banca da revisão'), { target: { value: 'Fuvest' } });
  const chapter = topicos[0].chapters![0];
  fireEvent.change(screen.getAllByLabelText('Tópico da revisão')[0], { target: { value: chapter } });
  fireEvent.click(screen.getAllByRole('button', { name: 'Revisão por banca e tópico' })[0]);
  await waitFor(() => expect(stream).toHaveBeenCalledWith('review-tip', expect.objectContaining({
    board: 'Fuvest', topic: topicos[0].name, subject: topicos[0].subject, chapter,
  }), expect.any(Function)));
  await screen.findByText('Revisão detalhada gerada');
  fireEvent.change(screen.getByLabelText('Banca da revisão'), { target: { value: 'ENEM / Inep' } });
  expect(screen.queryByText('Revisão detalhada gerada')).toBeNull();
});


it('mantém a tentativa iniciada quando o progresso reordena a fila fora dos dez primeiros', () => {
  const original = mastery;
  const { rerender } = render(<MemoryRouter><Revisoes /></MemoryRouter>);
  fireEvent.click(screen.getAllByRole('button', { name: 'Iniciar revisão ativa · 10–15 min' })[0]);
  fireEvent.change(screen.getByLabelText('Sua explicação sem consulta'), { target: { value: 'Minha resposta preservada' } });
  mastery = original.map((entry, index) => index === 0 ? { ...entry, level: 100, uncertainty: 0, lastReviewed: new Date().toISOString() } : entry);
  rerender(<MemoryRouter><Revisoes /></MemoryRouter>);
  expect(screen.getByLabelText('Sua explicação sem consulta')).toHaveValue('Minha resposta preservada');
  mastery = original;
});
