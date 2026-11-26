import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Treino2aFase from './Treino2aFase';

const mocks = vi.hoisted(() => ({ save: vi.fn(), mastery: vi.fn().mockResolvedValue(true), stream: vi.fn(), errorLog: vi.fn().mockResolvedValue(undefined) }));
vi.mock('../lib/userData', () => ({ addUserErrorLog: mocks.errorLog }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'student' } }) }));
vi.mock('../hooks/useDiscursiveAttempts', () => ({ useDiscursiveAttempts: () => ({ attempts: [], addAttempt: mocks.save, isPersisted: true }) }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ updateMastery: mocks.mastery }) }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: mocks.stream, aiErrorMessage: () => 'Sem conexão com a IA.' }));
beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); mocks.save.mockResolvedValue(true); mocks.mastery.mockResolvedValue(true); mocks.errorLog.mockResolvedValue(undefined); });
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
it('na Famerp mostra o que o corretor confere por item e manda a lista para a correção', async () => {
  mocks.stream.mockResolvedValue({ text: 'ok' });
  render(<MemoryRouter initialEntries={['/treino-2a-fase?banca=Famerp']}><Treino2aFase /></MemoryRouter>);
  // A primeira da Famerp é avulsa, fora dos cadernos de 2022–2026; abre-se uma do caderno.
  fireEvent.click(screen.getByRole('button', { name: /Ciclo de máquina térmica no diagrama P × V/ }));
  fireEvent.change(screen.getByLabelText('Sua resposta (redija com rigor)'), { target: { value: 'Resposta.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  expect(screen.getByText('O que o corretor confere')).toBeInTheDocument();
  expect(screen.getAllByText('Item a').length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Corrigir minha resposta com IA' }));
  await waitFor(() => expect(mocks.stream).toHaveBeenCalled());
  const payload = mocks.stream.mock.calls[0][1];
  expect(payload.modelAnswer.some((m: string) => m.startsWith('Item a, o corretor confere:'))).toBe(true);
});
it('corrige critério por critério, exige dizer onde errou e salva a nota estimada', async () => {
  render(<MemoryRouter initialEntries={['/treino-2a-fase?banca=Famerp']}><Treino2aFase /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Ciclo de máquina térmica no diagrama P × V/ }));
  expect(screen.getByText('Como corrigir uma dissertativa')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  const save = screen.getByRole('button', { name: 'Salvar correção' });
  expect(save).toBeDisabled();
  const groups = screen.getAllByRole('radiogroup');
  groups.forEach((g, i) => fireEvent.click(within(g).getByRole('radio', { name: i === groups.length - 1 ? 'Faltou' : 'Completo' })));
  // Critério perdido sem "onde" não deixa salvar.
  expect(save).toBeDisabled();
  fireEvent.change(screen.getByRole('combobox', { name: 'Onde perdeu o ponto?' }), { target: { value: 'calculation' } });
  expect(screen.getByText(/^Nota estimada:/, { selector: 'p' })).toHaveTextContent('3 de 4');
  fireEvent.click(save);
  await screen.findByText(/Correção salva: nota estimada 3 de 4/);
  const attempt = mocks.save.mock.calls.at(-1)![0];
  expect(attempt.selfRating).toBe('mediano');
  expect(attempt.grading.items[1].checks[1]).toEqual({ text: 'Potência = 60 W.', verdict: 'faltou', where: 'calculation' });
});
it('manda os pontos perdidos ao Caderno mesmo se ela avança de questão durante o salvamento', async () => {
  let finish!: (saved: boolean) => void;
  mocks.save.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
  render(<MemoryRouter initialEntries={['/treino-2a-fase?banca=Famerp']}><Treino2aFase /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Ciclo de máquina térmica no diagrama P × V/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  const groups = screen.getAllByRole('radiogroup');
  groups.forEach((g, i) => fireEvent.click(within(g).getByRole('radio', { name: i === groups.length - 1 ? 'Faltou' : 'Completo' })));
  fireEvent.change(screen.getByRole('combobox', { name: 'Onde perdeu o ponto?' }), { target: { value: 'calculation' } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar correção' }));
  // Troca de tópico: com o filtro num tópico de uma questão só, "Próxima" voltaria à mesma.
  fireEvent.click(screen.getByRole('button', { name: /Óvulo vegetal × animal/ }));
  await act(async () => { finish(true); });
  await waitFor(() => expect(mocks.errorLog).toHaveBeenCalledTimes(1));
  expect(mocks.errorLog.mock.calls[0][1]).toMatchObject({ type: 'calculation', breakPoint: 'Potência = 60 W.' });
});
it('destaca a nota estimada que volta da correção por IA', async () => {
  const text = 'Item a: correto.\nItem b: faltou a unidade.\n**Nota estimada: 3 de 4**\n**Avaliação: Mediano**';
  mocks.stream.mockResolvedValue({ text });
  render(<MemoryRouter initialEntries={['/treino-2a-fase?banca=Famerp']}><Treino2aFase /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Ciclo de máquina térmica no diagrama P × V/ }));
  fireEvent.change(screen.getByLabelText('Sua resposta (redija com rigor)'), { target: { value: 'Resposta.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  fireEvent.click(screen.getByRole('button', { name: 'Corrigir minha resposta com IA' }));
  expect(await screen.findByText(/Nota estimada pela IA:/)).toHaveTextContent('3 de 4');
});
it('a correção por IA marca os critérios e preenche a correção guiada, que ela confere e salva', async () => {
  const json = { criterios: [
    { id: 'a1', veredito: 'completo' }, { id: 'a2', veredito: 'completo' },
    { id: 'b1', veredito: 'completo' }, { id: 'b2', veredito: 'faltou', onde: 'calculation' },
  ] };
  const text = `Item b: faltou a potência.\n**Nota estimada: 3 de 4**\n**Avaliação: Mediano**\n\`\`\`json\n${JSON.stringify(json)}\n\`\`\``;
  mocks.stream.mockResolvedValue({ text });
  render(<MemoryRouter initialEntries={['/treino-2a-fase?banca=Famerp']}><Treino2aFase /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /Ciclo de máquina térmica no diagrama P × V/ }));
  fireEvent.change(screen.getByLabelText('Sua resposta (redija com rigor)'), { target: { value: 'Resposta.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Revelar gabarito comentado' }));
  fireEvent.click(screen.getByRole('button', { name: 'Corrigir minha resposta com IA' }));
  expect(await screen.findByText(/A correção por IA marcou 4 de 4 critérios/)).toBeInTheDocument();
  // O payload levou os critérios numerados.
  expect(mocks.stream.mock.calls.at(-1)![1].criteria).toEqual(['a1: Temperatura em kelvin (330 K).', 'a2: PV/T constante: T_C = 440 K.', 'b1: Trabalho = área do ciclo = 45 J.', 'b2: Potência = 60 W.']);
  // O bloco JSON não aparece no texto da correção.
  expect(screen.queryByText(/"criterios"/)).toBeNull();
  expect(screen.getByText(/^Nota estimada:/, { selector: 'p' })).toHaveTextContent('3 de 4');
  expect(screen.getByRole('combobox', { name: 'Onde perdeu o ponto?' })).toHaveValue('calculation');
  fireEvent.click(screen.getByRole('button', { name: 'Salvar correção' }));
  await screen.findByText(/Correção salva: nota estimada 3 de 4/);
  expect(mocks.save.mock.calls.at(-1)![0].grading.items[1].checks[1]).toEqual({ text: 'Potência = 60 W.', verdict: 'faltou', where: 'calculation' });
});
