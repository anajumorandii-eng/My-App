vi.mock('../lib/auth', () => ({ authHeaders: async () => ({ Authorization: 'Bearer test-token' }) }));
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
const { generate, auth, loadGuides, saveGuide } = vi.hoisted(() => ({ generate: vi.fn(async () => ({ text: 'Guia do tópico selecionado' })), auth: { user: null as null | { uid: string } }, loadGuides: vi.fn(async () => ({})), saveGuide: vi.fn(async () => {}) }));
vi.mock('../hooks/useStudyTargets', () => ({ useStudyTargets: () => ({ targets: [], loading: false, error: null }) }));
vi.mock('../lib/contentCatalog', () => ({ getLocalQuestionBank: async () => [] }));
// Source selection has its own integration tests; keep these UI actions independent
// of loading the multi-megabyte editorial catalog between interactions.
vi.mock('../data/deepSummaryContent.json', () => ({ default: [] }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: generate }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../lib/strategyGuides', async () => {
  const actual = await vi.importActual('../lib/strategyGuides');
  return { ...actual, loadStrategyGuides: loadGuides, saveStrategyGuide: saveGuide };
});
vi.mock('../lib/printStrategyGuide', async () => ({ ...await vi.importActual('../lib/printStrategyGuide'), printStrategyGuide: vi.fn() }));
import { printStrategyGuide } from '../lib/printStrategyGuide';
import StrategyExplorer from './StrategyExplorer';
import { cacheStrategyGuides } from '../lib/strategyGuides';

beforeEach(async () => { await import('./AiTextRenderer'); localStorage.clear(); auth.user = null; loadGuides.mockResolvedValue({}); saveGuide.mockResolvedValue(); generate.mockResolvedValue({ text: 'Guia do tópico selecionado' }); });

describe('guia por matéria, tópico e banca', () => {
  it('mantém os guias antigos na biblioteca sem listar todos no topo da estratégia', () => {
    const key = JSON.stringify(['Biologia', 'bio_genetica', '', 'UNICAMP']);
    cacheStrategyGuides(null, { [key]: { key, subject: 'Biologia', topicId: 'bio_genetica', topicName: 'Guia fora do recorte', chapter: '', board: 'UNICAMP', text: 'Conteúdo antigo preservado.', savedAt: '2026-10-17T12:00:00Z' } });
    render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
    expect(screen.queryByRole('heading', { name: 'Aprofundamentos salvos' })).toBeNull();
    expect(screen.queryByText('Guia fora do recorte')).toBeNull();
    expect(screen.getByRole('link', { name: 'Meus aprofundamentos (1)' })).toHaveAttribute('href', '/aprofundamentos');
    expect(localStorage.getItem('crivo:strategy-guides:v1:guest')).toContain('Conteúdo antigo preservado.');
  });
  it('seleciona currículo real, apresenta procedimento da matéria e envia recorte completo à IA', async () => {
    render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Química' } });
    fireEvent.change(screen.getByLabelText('Banca do guia'), { target: { value: 'Unicamp' } });
    expect(screen.getAllByText(/mol antes da proporção/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
    await waitFor(() => expect(generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ subject: 'Química', board: 'Unicamp', guideMode: 'strategy' }), expect.any(Function)), { timeout: 5000 });
    await screen.findByText('Guia do tópico selecionado');
    fireEvent.change(screen.getByLabelText('Banca do guia'), { target: { value: 'Fuvest' } });
    expect(screen.queryByText('Guia do tópico selecionado')).toBeNull();
  });
  it('Literatura e Redação usam os tópicos próprios sem oferecer os de gramática', () => {
    render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Redação' } });
    expect(screen.getByLabelText('Tópico do guia').textContent).toContain('Fundamentos da Dissertação');
    expect(screen.getByLabelText('Tópico do guia').textContent).not.toContain('Análise Sintática');
  });
});

it('recupera o aprofundamento após sair e voltar e permite imprimir o conteúdo salvo', async () => {
  const first = render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText('Guia do tópico selecionado', {}, { timeout: 5000 });
  await screen.findByText(/Salvo neste navegador/);
  first.unmount();
  render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
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
  const first = render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText('Salvo na sua conta.');
  expect(saveGuide).toHaveBeenCalledWith('A', expect.objectContaining({ text: 'Guia do tópico selecionado', subject: 'Matemática' }));
  first.unmount();
  auth.user = { uid: 'B' };
  render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  expect(screen.queryByText('Guia do tópico selecionado')).toBeNull();
});
it('avisa quando a sincronização falha e recupera a cópia local', async () => {
  auth.user = { uid: 'offline' };
  saveGuide.mockRejectedValueOnce(new Error('offline'));
  const first = render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText(/Não foi possível sincronizar/);
  first.unmount();
  render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  expect(await screen.findByText('Guia do tópico selecionado')).toBeTruthy();
});

it('usa a autoexplicação escrita para orientar o aprofundamento sem supor que ouviu áudio', async () => {
  render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.change(screen.getByRole('textbox', { name: /Antes de consultar/ }), { target: { value: 'Lembro a regra, mas não entendo por que funciona.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await waitFor(() => expect(generate).toHaveBeenCalled());
  expect(generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ learnerReflection: expect.stringContaining('não entendo por que funciona') }), expect.any(Function));
});

it('combina Ecologia e Evolução, envia os dois recortes e recupera o guia sem substituir o individual', async () => {
  const view = render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Biologia' } });
  fireEvent.change(screen.getByLabelText('Tópico do guia'), { target: { value: 'bio_ecologia' } });
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText('Guia do tópico selecionado');
  fireEvent.click(screen.getByText('Combinar mais tópicos de Biologia no mesmo aprofundamento'));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Evolução' }));
  expect(screen.queryByText('Guia do tópico selecionado')).toBeNull();
  fireEvent.click(screen.getByLabelText('Mecanismos da Evolução Biológica'));
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await waitFor(() => expect(generate).toHaveBeenLastCalledWith('review-tip', expect.objectContaining({ topic: 'Ecologia + Evolução', guideMode: 'combined-strategy', chapters: expect.stringContaining('Mecanismos da Evolução Biológica'), referenceText: expect.stringContaining('Recortes solicitados: Ecologia') }), expect.any(Function)));
  await screen.findByText('Guia do tópico selecionado');
  await screen.findByText(/Salvo neste navegador/);
  const saved = JSON.parse(localStorage.getItem('crivo:strategy-guides:v1:guest')!) as Record<string, { selections?: unknown[] }>;
  expect(Object.keys(saved)).toHaveLength(2);
  expect(Object.values(saved).find((item: any) => item.selections)?.selections).toHaveLength(2);
  view.unmount();
  render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Biologia' } });
  fireEvent.change(screen.getByLabelText('Tópico do guia'), { target: { value: 'bio_ecologia' } });
  expect(screen.getByText('Guia do tópico selecionado')).toBeInTheDocument();
});

it('informa quando o navegador recusa imprimir e preserva o guia para tentar novamente', async () => {
  render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
  await screen.findByText('Guia do tópico selecionado');
  vi.mocked(printStrategyGuide).mockImplementationOnce(() => { throw new Error('Printing unavailable'); });
  fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível abrir a impressão');
  expect(screen.getByText('Guia do tópico selecionado')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
  expect(screen.queryByRole('alert')).toBeNull();
});


it('conclui em uma entrega única com PDF pronto, capa e índice', async () => {
  auth.user = { uid: 'material-completo-estrategia' };
  const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
  const fetch = vi.fn(async (url, options) => String(url).startsWith('/api/study-pdf/saved/') ? new Response(null, {status:404}) : url === '/api/study-pdf' ? new Response('%PDF-1.7\n', { headers: { 'Content-Type': 'application/pdf' } }) : Response.json(options?.method === 'POST' ? { dataUrl: image } : { enabled: true }));
  vi.stubGlobal('fetch', fetch);
  vi.stubGlobal('URL', class extends URL { static createObjectURL = () => 'blob:strategy'; static revokeObjectURL = () => {}; });
  try {
    render(<MemoryRouter><StrategyExplorer /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
    await screen.findByRole('link', { name: 'Abrir PDF' }, { timeout: 5000 });
    expect(screen.getByRole('link', { name: 'Salvar PDF' })).toHaveAttribute('href', 'blob:strategy');
    expect(screen.queryByRole('button', { name: 'Personalizar ilustração da capa' })).toBeNull();
    const sent = JSON.parse(fetch.mock.calls.find(([url]) => url === '/api/study-pdf')![1].body);
    expect(sent.html).toContain(image); expect(sent.html).toContain('Sumário');
    expect(sent.html).toContain('Guia do tópico selecionado');
  } finally { vi.unstubAllGlobals(); }
});
