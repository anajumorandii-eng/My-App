import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Treino2aFase from './Treino2aFase';

const mocks = vi.hoisted(() => ({ save: vi.fn(), mastery: vi.fn().mockResolvedValue(true), stream: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'student' } }) }));
vi.mock('../hooks/useDiscursiveAttempts', () => ({ useDiscursiveAttempts: () => ({ attempts: [], addAttempt: mocks.save, isPersisted: true }) }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ updateMastery: mocks.mastery }) }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: mocks.stream, aiErrorMessage: () => 'Sem conexão com a IA.' }));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); mocks.save.mockResolvedValue(true); });
const open = () => render(<MemoryRouter><Treino2aFase /></MemoryRouter>);

it('restaura a resposta da mesma questão depois de sair e voltar', () => {
  const first = open();
  fireEvent.change(screen.getByLabelText('Sua resposta (redija com rigor)'), { target: { value: 'Minha hipótese e cada etapa.' } });
  first.unmount(); open();
  expect(screen.getByLabelText('Sua resposta (redija com rigor)')).toHaveValue('Minha hipótese e cada etapa.');
});
it('não afirma que salvou antes da confirmação e permite tentar novamente após falha', async () => {
  let finish!: (saved: boolean) => void;
  mocks.save.mockReturnValueOnce(new Promise(resolve => { finish = resolve; }));
  open(); fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  fireEvent.click(screen.getByRole('button', { name: 'Mediano' }));
  expect(screen.queryByText('Salvo')).toBeNull();
  expect(screen.getByRole('button', { name: 'Forte' })).toBeDisabled();
  await act(async () => { finish(false); });
  expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível salvar a avaliação');
  fireEvent.click(screen.getByRole('button', { name: 'Mediano' }));
  await screen.findByText('Salvo');
  expect(mocks.save).toHaveBeenCalledTimes(2);
});
it('mostra falha da correção e mantém a resposta escrita para nova tentativa', async () => {
  mocks.stream.mockRejectedValue(Error('offline'));
  open();
  fireEvent.change(screen.getByLabelText('Sua resposta (redija com rigor)'), { target: { value: 'Explicação preservada.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  fireEvent.click(screen.getByRole('button', { name: 'Corrigir minha resposta com IA' }));
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Sem conexão com a IA.'));
  expect(screen.getByLabelText('Sua resposta (redija com rigor)')).toHaveValue('Explicação preservada.');
  expect(screen.getByRole('button', { name: 'Corrigir minha resposta com IA' })).toBeEnabled();
});
