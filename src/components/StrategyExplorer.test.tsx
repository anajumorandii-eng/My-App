import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
const { generate, auth, loadGuides, saveGuide } = vi.hoisted(() => ({ generate: vi.fn(async () => ({ text: 'Guia do tópico selecionado' })), auth: { user: null as null | { uid: string } }, loadGuides: vi.fn(async () => ({})), saveGuide: vi.fn(async () => {}) }));
vi.mock('../hooks/useStudyTargets', () => ({ useStudyTargets: () => ({ targets: [], loading: false, error: null }) }));
vi.mock('../lib/contentCatalog', () => ({ getLocalQuestionBank: async () => [] }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: generate }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../lib/strategyGuides', async () => {
  const actual = await vi.importActual('../lib/strategyGuides');
  return { ...actual, loadStrategyGuides: loadGuides, saveStrategyGuide: saveGuide };
});
vi.mock('../lib/printStrategyGuide', () => ({ printStrategyGuide: vi.fn() }));
import { printStrategyGuide } from '../lib/printStrategyGuide';
import StrategyExplorer from './StrategyExplorer';

beforeEach(() => { localStorage.clear(); auth.user = null; loadGuides.mockResolvedValue({}); saveGuide.mockResolvedValue(); generate.mockResolvedValue({ text: 'Guia do tópico selecionado' }); });

describe('guia por matéria, tópico e banca', () => {
  it('seleciona currículo real, apresenta procedimento da matéria e envia recorte completo à IA', async () => {
    render(<StrategyExplorer />);
    fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Química' } });
    fireEvent.change(screen.getByLabelText('Banca do guia'), { target: { value: 'Unicamp' } });
    expect(screen.getAllByText(/mol antes da proporção/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
    await waitFor(() => expect(generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ subject: 'Química', board: 'Unicamp', guideMode: 'strategy' }), expect.any(Function)));
    await screen.findByText('Guia do tópico selecionado');
    fireEvent.change(screen.getByLabelText('Banca do guia'), { target: { value: 'Fuvest' } });
    expect(screen.queryByText('Guia do tópico selecionado')).toBeNull();
  });
  it('Literatura e Redação usam os tópicos próprios sem oferecer os de gramática', () => {
    render(<StrategyExplorer />);
    fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Redação' } });
    expect(screen.getByLabelText('Tópico do guia').textContent).toContain('Fundamentos da Dissertação');
    expect(screen.getByLabelText('Tópico do guia').textContent).not.toContain('Análise Sintática');
  });
});

it('recupera o aprofundamento após sair e voltar e permite imprimir o conteúdo salvo', async () => {
  const first = render(<StrategyExplorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText('Guia do tópico selecionado');
  await screen.findByText(/Salvo neste navegador/);
  first.unmount();
  render(<StrategyExplorer />);
  expect(await screen.findByText('Guia do tópico selecionado')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
  expect(printStrategyGuide).toHaveBeenCalledWith(expect.any(HTMLElement), expect.stringContaining('Matemática'));
  expect(vi.mocked(printStrategyGuide).mock.calls[0][0].textContent).toContain('Guia do tópico selecionado');
  generate.mockRejectedValueOnce(new Error('offline'));
  fireEvent.click(screen.getByRole('button', { name: 'Gerar novo aprofundamento' }));
  await screen.findByRole('alert');
  expect(screen.getByText('Guia do tópico selecionado')).toBeTruthy();
});

it('salva na conta e mantém os guias separados entre usuários', async () => {
  auth.user = { uid: 'A' };
  const first = render(<StrategyExplorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText('Salvo na sua conta.');
  expect(saveGuide).toHaveBeenCalledWith('A', expect.objectContaining({ text: 'Guia do tópico selecionado', subject: 'Matemática' }));
  first.unmount();
  auth.user = { uid: 'B' };
  render(<StrategyExplorer />);
  expect(screen.queryByText('Guia do tópico selecionado')).toBeNull();
});
it('avisa quando a sincronização falha e recupera a cópia local', async () => {
  auth.user = { uid: 'offline' };
  saveGuide.mockRejectedValueOnce(new Error('offline'));
  const first = render(<StrategyExplorer />);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText(/Não foi possível sincronizar/);
  first.unmount();
  render(<StrategyExplorer />);
  expect(await screen.findByText('Guia do tópico selecionado')).toBeTruthy();
});

it('usa a autoexplicação escrita para orientar o aprofundamento sem supor que ouviu áudio', async () => {
  render(<StrategyExplorer />);
  fireEvent.change(screen.getByRole('textbox', { name: /Antes de consultar/ }), { target: { value: 'Lembro a regra, mas não entendo por que funciona.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await waitFor(() => expect(generate).toHaveBeenCalled());
  expect(generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ learnerReflection: expect.stringContaining('não entendo por que funciona') }), expect.any(Function));
});
