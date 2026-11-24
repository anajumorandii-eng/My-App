import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { Question } from '../types';
import Provas from './Provas';
import ProvaBanca from './ProvaBanca';

const authHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const addUserErrorLogMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../lib/userData', () => ({ addUserAttempt: addUserAttemptMock, addUserErrorLog: addUserErrorLogMock }));

// Prova sintética de 40 questões, o mínimo para virar simulado.
const question = (n: number, year = 2025): Question => ({
  id: `famerp_${year}_v1_q${String(n).padStart(2, '0')}`, topicId: `t${n % 3}`, subject: n % 2 ? 'Biologia' : 'Física', chapter: `Capítulo ${n % 3}`,
  prompt: `Enunciado ${n}`, options: [{ id: 'a', text: 'Alfa' }, { id: 'b', text: 'Beta' }], correctOptionId: 'a',
  explanation: `Explicação ${n}`, difficulty: 'medium',
  examSource: { board: 'FAMERP', year, questionNumber: n, version: 'V1' },
});
const exam = (year: number) => Array.from({ length: 40 }, (_, i) => question(i + 1, year)).reverse();

const updateMastery = vi.fn();

beforeEach(() => {
  localStorage.clear();
  authHook.mockReturnValue({ user: { uid: 'aj' } });
  masteryHook.mockReturnValue({ updateMastery });
  questionsHook.mockReturnValue({ questions: [...exam(2025), ...exam(2024), ...exam(2023)], loading: false });
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

const renderAt = (path: string) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/provas" element={<Provas />} />
      <Route path="/provas/:slug" element={<ProvaBanca />} />
      <Route path="/provas/:slug/:tab" element={<ProvaBanca />} />
    </Routes>
  </MemoryRouter>,
);

it('lista as bancas com a de estratégia completa primeiro', () => {
  renderAt('/provas');
  const links = screen.getAllByRole('link', { name: /^Abrir / });
  expect(links[0]).toHaveAccessibleName('Abrir Famerp');
  expect(within(links[0]).getByText('Estratégia completa')).toBeInTheDocument();
  expect(within(links[0]).getByText('3 provas para simulado')).toBeInTheDocument();
});

it('a página da Famerp traz estratégia, matérias, prioridades, simulado e discursivas', () => {
  renderAt('/provas/famerp');
  const tabs = screen.getAllByRole('tab').map((t) => t.textContent);
  expect(tabs).toEqual(['Visão geral', 'Estratégia de prova', 'Como cada matéria cobra', 'Teoria do que mais cai', 'O que mais cai', 'Simulado', 'Discursivas e redação']);
});

it('banca sem conteúdo próprio não ganha aba vazia', () => {
  renderAt('/provas/einstein');
  expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['Visão geral']);
});

it('mostra o método e as armadilhas da matéria escolhida', () => {
  renderAt('/provas/famerp/materias');
  fireEvent.click(within(screen.getByRole('group', { name: 'Matéria' })).getByRole('button', { name: 'Química' }));
  expect(screen.getByRole('heading', { name: 'Como a Famerp cobra Química' })).toBeInTheDocument();
  expect(screen.getByText('Multiplicar o E° pelo coeficiente da reação.')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Na discursiva de Química' })).toBeInTheDocument();
});

it('faz o simulado na ordem do caderno, sem gabarito antes da entrega, e registra os erros', async () => {
  renderAt('/provas/famerp/simulado');
  fireEvent.click(screen.getByRole('button', { name: 'Começar simulado' }));
  expect(screen.getByText(/Famerp 2023 · 0\/40 respondidas/)).toBeInTheDocument();
  expect(screen.getByText('Enunciado 1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('radio', { name: /Alfa/ }));
  expect(screen.queryByText('Explicação 1')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
  fireEvent.click(screen.getByRole('radio', { name: /Beta/ }));
  fireEvent.click(screen.getByRole('button', { name: /Entregar prova/ }));

  expect(screen.getByRole('heading', { name: 'Famerp 2023: 1 de 40' })).toBeInTheDocument();
  expect(updateMastery).toHaveBeenCalledTimes(1);

  fireEvent.click(screen.getByRole('button', { name: 'Registrar erros e tentativas' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Registrado no Caderno de Erros' })).toBeDisabled());
  expect(addUserAttemptMock).toHaveBeenCalledTimes(2);
  expect(addUserErrorLogMock).toHaveBeenCalledTimes(1);
  expect(addUserErrorLogMock.mock.calls[0][1]).toMatchObject({ type: 'unknown', confidence: 'baixa', questionId: 'famerp_2023_v1_q02' });
});

it('retoma a prova em andamento depois de recarregar', () => {
  const first = renderAt('/provas/famerp/simulado');
  fireEvent.click(screen.getByRole('button', { name: 'Começar simulado' }));
  fireEvent.click(screen.getByRole('radio', { name: /Alfa/ }));
  first.unmount();
  renderAt('/provas/famerp/simulado');
  expect(screen.getByText(/1\/40 respondidas/)).toBeInTheDocument();
});

it('prioridades só com capítulos que se repetem entre os anos', () => {
  renderAt('/provas/famerp/prioridades');
  expect(screen.getByRole('heading', { name: 'O que mais se repete' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'Treinar' }).length).toBe(3);
});

it('endereço de banca inexistente volta para a lista', () => {
  renderAt('/provas/nao-existe');
  expect(screen.getByRole('heading', { name: 'Provas e bancas' })).toBeInTheDocument();
});

it('recupera a prova em andamento salva pela antiga tela da Famerp', () => {
  localStorage.setItem('crivo-famerp-simulado-v1:aj', JSON.stringify({
    year: 2024, minutes: 240, startedAt: new Date().toISOString(), answers: { famerp_2024_v1_q01: 'a' },
  }));
  renderAt('/provas/famerp/simulado');
  expect(screen.getByText(/Famerp 2024 · 1\/40 respondidas/)).toBeInTheDocument();
  expect(localStorage.getItem('crivo-famerp-simulado-v1:aj')).toBeNull();
  expect(JSON.parse(localStorage.getItem('crivo-simulado-v1:aj')!)).toMatchObject({ board: 'FAMERP', version: 'V1', year: 2024 });
});

it('abre a teoria do capítulo pedido, com a resolução escondida até ela tentar', () => {
  const pct = (year: number): Question => ({ ...question(41, year), id: `famerp_${year}_pct`, topicId: 'mat_aritmetica_proporcionalidade', subject: 'Matemática', chapter: 'Porcentagem', examSource: { board: 'FAMERP', year, questionNumber: 41, version: 'V1' } });
  questionsHook.mockReturnValue({ questions: [...exam(2025), ...exam(2024), ...exam(2023), pct(2025), pct(2024), pct(2023)], loading: false });

  renderAt('/provas/famerp/prioridades');
  const link = screen.getByRole('link', { name: 'Teoria' });
  expect(link).toHaveAttribute('href', '/provas/famerp/teoria?capitulo=mat_aritmetica_proporcionalidade%3A%3APorcentagem');
  cleanup();

  renderAt('/provas/famerp/teoria?capitulo=mat_aritmetica_proporcionalidade%3A%3APorcentagem');
  expect(screen.getByRole('button', { name: 'Matemática' })).toHaveAttribute('aria-pressed', 'true');
  const card = screen.getByText('Porcentagem').closest('details')!;
  expect(card).toHaveAttribute('open');
  expect(within(card).getByText(/Como cai na Famerp/)).toBeInTheDocument();
  const solution = within(card).getAllByText('Tente antes; depois veja a resolução')[0].closest('details')!;
  expect(solution).not.toHaveAttribute('open');
});

it('a teoria das discursivas abre na matéria pedida e esconde a resposta-modelo até ela escrever', async () => {
  renderAt('/provas/famerp/teoria?parte=discursivas&materia=Qu%C3%ADmica');
  expect(screen.getByRole('button', { name: 'Química' })).toHaveAttribute('aria-pressed', 'true');
  const card = screen.getByText('Pilhas, baterias, eletrólise e corrosão').closest('details')!;
  fireEvent.click(within(card).getByText('Pilhas, baterias, eletrólise e corrosão'));
  expect(await within(card).findByText('O mecanismo')).toBeInTheDocument();
  expect(within(card).getByText('Treino discursivo')).toBeInTheDocument();
  const model = within(card).getByText(/Escreva sua resposta/).closest('details')!;
  expect(model).not.toHaveAttribute('open');
});

it('a aba Redação abre os modelos dos temas reais, sem a fileira de matérias', () => {
  renderAt('/provas/famerp/teoria?parte=redacao');
  expect(screen.getByRole('tab', { name: /Redação/ })).toHaveAttribute('aria-selected', 'true');
  expect(screen.queryByRole('group', { name: 'Matéria' })).not.toBeInTheDocument();
  const card = screen.getByText(/Racismo ambiental no Brasil/).closest('details')!;
  expect(within(card).getByText('Desenvolvimento 2')).toBeInTheDocument();
  expect(screen.getByText(/zera a redação idêntica ou muito semelhante/)).toBeInTheDocument();
});

it('mostra os tipos de cobrança do capítulo com as questões reais citadas', async () => {
  const pct = (year: number): Question => ({ ...question(41, year), id: `famerp_${year}_pct`, topicId: 'mat_aritmetica_proporcionalidade', subject: 'Matemática', chapter: 'Porcentagem', examSource: { board: 'FAMERP', year, questionNumber: 41, version: 'V1' } });
  questionsHook.mockReturnValue({ questions: [...exam(2025), ...exam(2024), ...exam(2023), pct(2025), pct(2024), pct(2023)], loading: false });
  renderAt('/provas/famerp/teoria?capitulo=mat_aritmetica_proporcionalidade%3A%3APorcentagem');
  const card = screen.getByText('Porcentagem').closest('details')!;
  expect(within(card).getByText('Como a Famerp cobra, tipo por tipo')).toBeInTheDocument();
  expect(within(card).getAllByText('Lucro sobre o custo').length).toBeGreaterThan(0);
  expect(within(card).getByText('2023 q71')).toBeInTheDocument();
});
