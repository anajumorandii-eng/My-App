import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Tutor from './Tutor';

const mocks = vi.hoisted(() => ({ uid: 'a', stream: vi.fn(), text: vi.fn(), mastery: vi.fn().mockResolvedValue(true) }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: mocks.uid } }) }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ updateMastery: mocks.mastery }) }));
vi.mock('../lib/aiClient', () => ({ requestAiText: mocks.text, requestAiTextStream: mocks.stream, aiErrorMessage: () => 'Falha ao gerar' }));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); mocks.uid = 'a'; mocks.stream.mockResolvedValue({ text: 'De quem o filho recebe o X?' }); });
const open = (route = '/tutor?topic=bio_genetica') => render(<MemoryRouter initialEntries={[route]}><Tutor /></MemoryRouter>);

it('abre o tópico solicitado, preserva conversa e envia raciocínio anterior à IA', async () => {
  const first = open();
  expect(screen.getByLabelText('Tópico para o tutor')).toHaveValue('bio_genetica');
  fireEvent.change(screen.getByLabelText('Sua explicação para o tutor'), { target: { value: 'A condição está ligada ao X.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem ao tutor' }));
  await screen.findByText('De quem o filho recebe o X?');
  first.unmount(); open();
  expect(screen.getByText('A condição está ligada ao X.')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Sua explicação para o tutor'), { target: { value: 'Da mãe.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem ao tutor' }));
  await waitFor(() => expect(mocks.stream).toHaveBeenCalledTimes(2));
  expect(mocks.stream.mock.calls[1][1].history).toEqual(expect.arrayContaining([
    { role: 'user', content: 'A condição está ligada ao X.' },
    { role: 'assistant', content: 'De quem o filho recebe o X?' },
  ]));
});

it('troca de matéria e conta sem misturar rascunhos; voltar recupera o anterior', () => {
  open();
  fireEvent.change(screen.getByLabelText('Sua explicação para o tutor'), { target: { value: 'Meu raciocínio em genética.' } });
  fireEvent.change(screen.getByLabelText('Tópico para o tutor'), { target: { value: 'bio_ecologia' } });
  expect(screen.getByLabelText('Sua explicação para o tutor')).toHaveValue('');
  fireEvent.change(screen.getByLabelText('Tópico para o tutor'), { target: { value: 'bio_genetica' } });
  expect(screen.getByLabelText('Sua explicação para o tutor')).toHaveValue('Meu raciocínio em genética.');
});

it('uma geração tardia não aparece no assunto selecionado depois', async () => {
  let finish!: (value: { text: string }) => void;
  mocks.stream.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  open();
  fireEvent.change(screen.getByLabelText('Sua explicação para o tutor'), { target: { value: 'Genética.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem ao tutor' }));
  fireEvent.change(screen.getByLabelText('Tópico para o tutor'), { target: { value: 'bio_ecologia' } });
  await act(async () => { finish({ text: 'Resposta antiga.' }); });
  expect(screen.queryByText('Resposta antiga.')).not.toBeInTheDocument();
});
