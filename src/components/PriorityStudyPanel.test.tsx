import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PriorityStudyPanel } from './PriorityStudyPanel';
const state = vi.hoisted(() => ({ persisted: true }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ isPersisted: state.persisted, loading: false, mastery: [{ topicId: 'bio_genetica', level: 20, uncertainty: 0.5, origin: 'observed', lastReviewed: '2026-10-01T12:00:00Z', errorSignals: 1 }, { topicId: 'bio_estrutura_fisio_celular', level: 15, uncertainty: 0.4, origin: 'observed', lastReviewed: '2026-10-01T12:00:00Z', errorSignals: 0 }], syncError: null }) }));
describe('prioridades práticas', () => {
  it('expõe fatores, tempo, pré-requisitos e links com o recorte correto', () => {
    state.persisted = true;
    render(<MemoryRouter><PriorityStudyPanel subject="Biologia" /></MemoryRouter>);
    expect(screen.getAllByText(/Domínio registrado/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/tem domínio registrado abaixo de 50%/).length).toBeGreaterThan(0);
    fireEvent.change(screen.getByRole('combobox', { name: 'Tempo do bloco' }), { target: { value: '15' } });
    expect(screen.getAllByLabelText(/Bloco de 15 minutos/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Resolver questões deste tópico' })[0]).toHaveAttribute('href', expect.stringContaining('/questoes?topic='));
    fireEvent.change(screen.getByRole('combobox', { name: 'Banca das prioridades' }), { target: { value: 'ENEM' } });
    expect(screen.getByText(/Não há recorte completo classificado de ENEM/)).toBeInTheDocument();
  });
  it('não atribui dados demo ao desempenho pessoal', () => {
    state.persisted = false;
    render(<MemoryRouter><PriorityStudyPanel subject="Biologia" /></MemoryRouter>);
    expect(screen.getByText(/Sem evidência pessoal carregada/)).toBeInTheDocument();
    expect(screen.queryByText(/Domínio registrado/)).toBeNull();
  });
  it('oferece roteiro para áreas sem incidência cadastrada', () => {
    render(<MemoryRouter><PriorityStudyPanel subject="Filosofia" /></MemoryRouter>);
    expect(screen.queryByText('Não há tópico curricular mapeado para esta matéria.')).toBeNull();
    expect(screen.getAllByText(/Diagnosticar antes de decidir/).length).toBeGreaterThan(0);
  });
});


it('encaminha Literatura para o catálogo de Literatura', () => {
  render(<MemoryRouter><PriorityStudyPanel subject="Literatura" /></MemoryRouter>);
  expect(screen.getAllByRole('link', { name: 'Abrir resumos da matéria' })[0]).toHaveAttribute('href', '/resumos?subject=Literatura');
});

it('permite demonstrar entendimento sem começar por uma lista de exercícios', () => {
  render(<MemoryRouter><PriorityStudyPanel subject="Biologia" /></MemoryRouter>);
  expect(screen.getByLabelText('Como vou demonstrar compreensão')).toHaveValue('explicar');
  expect(screen.getAllByText(/Reconstrua o mecanismo com suas palavras/).length).toBeGreaterThan(0);
  fireEvent.change(screen.getByLabelText('Como vou demonstrar compreensão'), { target: { value: 'ensinar' } });
  expect(screen.getAllByText(/Grave ou explique em voz alta/).length).toBeGreaterThan(0);
});
