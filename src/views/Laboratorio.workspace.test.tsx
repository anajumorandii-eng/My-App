import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Laboratorio from './Laboratorio';
import { mockStudyMethods } from '../data/mockData';

const mocks = vi.hoisted(() => ({ stream: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'student' } }) }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ mastery: [] }) }));
vi.mock('../hooks/useStudyMethods', () => ({ useStudyMethods: () => ({ studyMethods: mockStudyMethods }) }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: mocks.stream, aiErrorMessage: () => 'Não foi possível gerar.' }));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });
const open = () => render(<MemoryRouter><Laboratorio /></MemoryRouter>);
it('aplica o método ao assunto escolhido, preserva o exemplo e não o mistura com outro assunto', async () => {
  mocks.stream.mockResolvedValue({ text: 'Explique a herança do X sem olhar e compare dois casos.' });
  open();
  fireEvent.change(screen.getByLabelText('Assunto para aplicar os métodos'), { target: { value: 'bio_genetica' } });
  fireEvent.click(screen.getByRole('button', { name: 'Exemplo aplicado a Genética' }));
  await screen.findByText('Explique a herança do X sem olhar e compare dois casos.');
  expect(mocks.stream.mock.calls[0][1].topic).toBe('Genética');
  fireEvent.change(screen.getByLabelText('Assunto para aplicar os métodos'), { target: { value: 'bio_ecologia' } });
  expect(screen.queryByText('Explique a herança do X sem olhar e compare dois casos.')).toBeNull();
  fireEvent.change(screen.getByLabelText('Assunto para aplicar os métodos'), { target: { value: 'bio_genetica' } });
  expect(screen.getByText('Explique a herança do X sem olhar e compare dois casos.')).toBeInTheDocument();
});
