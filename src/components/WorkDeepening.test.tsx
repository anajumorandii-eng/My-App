vi.mock('../lib/auth', () => ({ authHeaders: async () => ({ Authorization: 'Bearer test-token' }) }));
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import olhos from '../data/obras/dossies/olhos-dagua.json';
import type { WorkDossier } from '../types/literaryWorks';
import { WorkDeepening } from './WorkDeepening';
import { readStrategyGuides } from '../lib/strategyGuides';
import { printStrategyGuide } from '../lib/printStrategyGuide';
const mocks = vi.hoisted(() => ({ generate: vi.fn(), uid: null as string | null, save: vi.fn(), load: vi.fn() }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: mocks.generate }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: mocks.uid ? { uid: mocks.uid } : null }) }));
vi.mock('../hooks/useStudyTargets', () => ({ useStudyTargets: () => ({ targets: [{ board: 'UNICAMP' }, { board: 'UNESP' }], loading: false, error: null }) }));
vi.mock('../lib/strategyGuides', async () => ({ ...await vi.importActual('../lib/strategyGuides'), saveStrategyGuide: mocks.save, loadStrategyGuides: mocks.load }));
vi.mock('../lib/printStrategyGuide', () => ({ printStrategyGuide: vi.fn() }));
const dossier = olhos as WorkDossier;
const open = (unitId?: string) => render(<MemoryRouter><WorkDeepening dossier={dossier} title="Olhos d’água" unitId={unitId} unitTitle={dossier.units.find(unit => unit.id === unitId)?.title} /></MemoryRouter>);
beforeEach(() => { localStorage.clear(); mocks.uid = null; mocks.generate.mockReset().mockResolvedValue({ text: 'Interpretação sustentada nas fontes.' }); mocks.save.mockReset().mockResolvedValue(undefined); mocks.load.mockReset().mockResolvedValue({}); vi.mocked(printStrategyGuide).mockClear(); });

it('gera a obra completa com fontes e bancas pessoais, salva e permite imprimir e recuperar', async () => {
  const view = open();
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar esta obra e sua interpretação' }));
  await screen.findByText('Interpretação sustentada nas fontes.');
  expect(mocks.generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ topic: 'Olhos d’água', chapter: 'Obra completa', guideMode: 'literary-strategy', targetBoards: ['UNICAMP', 'UNESP'], referenceText: expect.stringContaining('[F1]') }), expect.any(Function));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Gerar novo aprofundamento da obra' })).toBeEnabled());
  const saved = Object.values(readStrategyGuides(null))[0];
  expect(saved).toMatchObject({ workSlug: 'olhos-dagua', topicId: 'obra:olhos-dagua', chapter: '', text: 'Interpretação sustentada nas fontes.' });
  expect(saved.studyPacket?.sources.length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole('button', { name: 'Imprimir aprofundamento / Salvar em PDF' }));
  expect(printStrategyGuide).toHaveBeenCalledWith(expect.any(HTMLElement), expect.stringContaining('Obra completa'));
  expect(screen.getByRole('link', { name: 'Abrir este guia na biblioteca' })).toHaveAttribute('href', expect.stringContaining('/aprofundamentos?guia='));
  view.unmount(); open(); expect(screen.getByText('Interpretação sustentada nas fontes.')).toBeInTheDocument();
});

it('separa unidade e banca, sem reaproveitar o guia da obra completa', async () => {
  const view = open();
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar esta obra e sua interpretação' }));
  await screen.findByText('Interpretação sustentada nas fontes.');
  view.unmount(); open('maria');
  expect(screen.queryByText('Interpretação sustentada nas fontes.')).toBeNull();
  fireEvent.change(screen.getByLabelText('Banca do aprofundamento da obra'), { target: { value: 'FUVEST' } });
  fireEvent.click(screen.getByRole('button', { name: 'Aprofundar esta unidade e sua interpretação' }));
  await screen.findByText('Interpretação sustentada nas fontes.');
  expect(mocks.generate).toHaveBeenLastCalledWith('review-tip', expect.objectContaining({ chapter: 'Maria', targetBoards: ['FUVEST'], referenceText: expect.stringContaining('Unidade publicada · Maria') }), expect.any(Function));
  expect(Object.values(readStrategyGuides(null))).toHaveLength(2);
  expect(Object.values(readStrategyGuides(null)).find(item => item.workUnitId === 'maria')?.board).toBe('FUVEST');
});

it('preserva o guia concluído quando uma nova geração falha ou retorna vazia', async () => {
  open(); fireEvent.click(screen.getByRole('button', { name: 'Aprofundar esta obra e sua interpretação' }));
  await screen.findByText('Interpretação sustentada nas fontes.');
  mocks.generate.mockImplementationOnce(async (_task, _payload, delta) => { delta('Texto incompleto'); throw new Error('offline'); });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar novo aprofundamento da obra' }));
  await screen.findByRole('alert');
  expect(screen.getByText('Interpretação sustentada nas fontes.')).toBeInTheDocument();
  expect(screen.queryByText('Texto incompleto')).toBeNull();
  expect(Object.values(readStrategyGuides(null))[0].text).toBe('Interpretação sustentada nas fontes.');
  mocks.generate.mockResolvedValueOnce({ text: '  ' });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar novo aprofundamento da obra' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Gerar novo aprofundamento da obra' })).toBeEnabled());
  expect(Object.values(readStrategyGuides(null))[0].text).toBe('Interpretação sustentada nas fontes.');
});

it('salva na conta e mantém uma cópia local se a sincronização falhar', async () => {
  mocks.uid = 'conta-teste'; mocks.save.mockRejectedValueOnce(new Error('offline'));
  open('maria'); fireEvent.click(screen.getByRole('button', { name: 'Aprofundar esta unidade e sua interpretação' }));
  await screen.findByText(/Não foi possível sincronizar/);
  expect(mocks.save).toHaveBeenCalledWith('conta-teste', expect.objectContaining({ workUnitId: 'maria' }));
  expect(Object.values(readStrategyGuides('conta-teste'))).toHaveLength(1);
  expect(Object.values(readStrategyGuides(null))).toHaveLength(0);
});

it('cria a ilustração automaticamente ao concluir o aprofundamento da obra', async () => {
  mocks.uid = 'capa-obra';
  const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
  const fetch = vi.fn(async (_url, options) => Response.json(options?.method === 'POST' ? { dataUrl: image } : { enabled: true }));
  vi.stubGlobal('fetch', fetch);
  vi.stubGlobal('Image', class { src = ''; decode = async () => {}; });
  try {
    open('maria');
    fireEvent.click(screen.getByRole('button', { name: 'Aprofundar esta unidade e sua interpretação' }));
    await screen.findByText('Ilustração pronta para este material.');
    expect(screen.getByText('Interpretação sustentada nas fontes.').closest('[data-print-work]')).toHaveAttribute('data-print-generated-art', image);
    const post = fetch.mock.calls.find(([, options]) => options?.method === 'POST');
    expect(JSON.parse(post![1]!.body)).toMatchObject({ subject: 'Literatura', work: 'Olhos d’água', subtopic: 'Maria' });
    fireEvent.change(screen.getByLabelText('Banca do aprofundamento da obra'), { target: { value: 'FUVEST' } });
    fireEvent.change(screen.getByLabelText('Banca do aprofundamento da obra'), { target: { value: 'Todas as bancas' } });
    await screen.findByRole('button', { name: 'Personalizar ilustração da capa' });
    expect(fetch.mock.calls.filter(([, options]) => options?.method === 'POST')).toHaveLength(1);
  } finally { vi.unstubAllGlobals(); }
});
