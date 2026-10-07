import React from 'react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ObraDetalhe from './ObraDetalhe';
const mocks = vi.hoisted(() => ({ user: { uid: 'ana' } as { uid: string } | null, progress: vi.fn(), save: vi.fn(), work: vi.fn(), dossier: vi.fn(), units: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: mocks.user }) }));
vi.mock('../lib/literaryData', () => ({ getReadingProgress: mocks.progress, saveReadingProgress: mocks.save }));
vi.mock('../lib/workDossiers', () => ({ loadWorkDossier: mocks.dossier, visibleDossier: (d: unknown) => d }));
vi.mock('../lib/literaryCatalog', () => ({ getLiteraryWorkBySlug: mocks.work, getEditions: async () => [], getExamRequirements: async () => [], getWorkUnits: mocks.units }));
function deferred<T>() { let resolve!: (v: T) => void; let reject!: (e: Error) => void; const promise = new Promise<T>((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; }
function App() { const navigate = useNavigate(); return <><button onClick={() => navigate('/obras/b')}>Trocar obra</button><Routes><Route path="/obras/:workSlug" element={<ObraDetalhe />} /></Routes></>; }
function mount() { return render(<MemoryRouter initialEntries={['/obras/a']}><App /></MemoryRouter>); }
async function reading() { fireEvent.click(await screen.findByRole('button', { name: 'Leitura guiada' })); return screen.findByRole('button', { name: /Capítulo/ }); }
beforeEach(() => { vi.resetAllMocks(); mocks.user={uid:'ana'}; mocks.work.mockImplementation(async (slug: string) => ({ id:slug, slug, title:slug, author:'Autora', genre:'romance' })); mocks.units.mockResolvedValue([{ id:'unit', order:1, title:'Capítulo', pdfStartPage:1, pdfEndPage:2 }]); mocks.dossier.mockResolvedValue(null); mocks.progress.mockResolvedValue([{userId:'ana',workId:'a',unitId:'unit',status:'completed',completedAt:'2026-01-01'}]); mocks.save.mockResolvedValue(undefined); });
afterEach(cleanup);
it('desmarca sem undefined no payload e impede gravações concorrentes da unidade', async () => { const pending=deferred<void>(); mocks.save.mockReturnValue(pending.promise); mount(); const button=await reading(); await waitFor(() => expect(button).toHaveAttribute('aria-pressed','true')); fireEvent.click(button); fireEvent.click(button); expect(mocks.save).toHaveBeenCalledTimes(1); expect(mocks.save.mock.calls[0][1]).toEqual({userId:'ana',workId:'a',unitId:'unit',status:'not_started'}); expect(button).toBeDisabled(); await act(async () => pending.resolve()); expect(button).not.toBeDisabled(); });
it('restaura o progresso e permite tentar de novo após falha ao salvar', async () => { mocks.save.mockRejectedValueOnce(new Error('offline')); vi.spyOn(console,'error').mockImplementation(() => {}); mount(); const button=await reading(); await waitFor(() => expect(button).toHaveAttribute('aria-pressed','true')); fireEvent.click(button); expect(await screen.findByRole('alert')).toHaveTextContent(/Não foi possível salvar/); expect(button).toHaveAttribute('aria-pressed','true'); expect(button).not.toBeDisabled(); });
it('ignora a obra e o dossiê antigos que chegam depois da troca de rota', async () => { const old=deferred<unknown>(); const dossier=deferred<unknown>(); mocks.work.mockImplementation((slug: string) => slug==='a' ? old.promise : Promise.resolve({ id:slug,slug,title:slug,author:'Autora',genre:'romance' })); mocks.dossier.mockImplementation((slug: string) => slug==='a' ? dossier.promise : Promise.resolve(null)); mount(); fireEvent.click(screen.getByText('Trocar obra')); await screen.findByRole('heading',{name:'b'}); await act(async () => { old.resolve({id:'a',slug:'a',title:'a',author:'Antiga',genre:'romance'}); dossier.resolve({workId:'a',edition:{label:'Antiga',pdfPageCount:2},modules:[{moduleType:'comece_aqui',editorialStatus:'published',markdown:'Dossiê antigo'}],units:[]}); }); expect(screen.getByRole('heading',{name:'b'})).toBeInTheDocument(); expect(screen.queryByText('Dossiê antigo')).toBeNull(); });
it('limpa progresso ao sair e ignora leitura atrasada do usuário anterior', async () => { const pending=deferred<unknown>(); mocks.progress.mockReturnValue(pending.promise); const view=mount(); const button=await reading(); expect(button).toBeDisabled(); mocks.user=null; view.rerender(<MemoryRouter initialEntries={['/obras/a']}><App /></MemoryRouter>); await act(async () => pending.resolve([{userId:'ana',workId:'a',unitId:'unit',status:'completed'}])); expect(button).toHaveAttribute('aria-pressed','false'); expect(button).toBeDisabled(); });
it('ignora catálogo e progresso atrasados depois da troca de obra', async () => {
  const oldUnits = deferred<unknown>();
  const oldProgress = deferred<unknown>();
  mocks.units.mockImplementation((id: string) => id === 'a' ? oldUnits.promise : Promise.resolve([{ id: 'b-unit', order: 1, title: 'Capítulo novo', pdfStartPage: 1, pdfEndPage: 2 }]));
  mocks.progress.mockImplementation((_uid: string, id: string) => id === 'a' ? oldProgress.promise : Promise.resolve([]));
  mount();
  await screen.findByRole('heading', { name: 'a' });
  fireEvent.click(screen.getByText('Trocar obra'));
  await screen.findByRole('heading', { name: 'b' });
  fireEvent.click(screen.getByRole('button', { name: 'Leitura guiada' }));
  const button = await screen.findByRole('button', { name: /Capítulo novo/ });
  await waitFor(() => expect(button).not.toBeDisabled());
  await act(async () => {
    oldUnits.resolve([{ id: 'old', order: 1, title: 'Capítulo antigo', pdfStartPage: 1, pdfEndPage: 2 }]);
    oldProgress.resolve([{ userId: 'ana', workId: 'a', unitId: 'b-unit', status: 'completed' }]);
  });
  expect(screen.queryByText(/Capítulo antigo/)).toBeNull();
  expect(button).toHaveAttribute('aria-pressed', 'false');
});
it('retira progresso já carregado ao sair da conta', async () => {
  const view = mount();
  const button = await reading();
  await waitFor(() => expect(button).toHaveAttribute('aria-pressed', 'true'));
  mocks.user = null;
  view.rerender(<MemoryRouter initialEntries={['/obras/a']}><App /></MemoryRouter>);
  const signedOutButton = await screen.findByRole('button', { name: /Capítulo/ });
  expect(signedOutButton).toHaveAttribute('aria-pressed', 'false');
  expect(signedOutButton).toBeDisabled();
});

it('recarrega o catálogo após entrar na conta sem remontar a tela', async () => {
  mocks.user = null;
  mocks.work.mockRejectedValueOnce(new Error('permission-denied'));
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const view = mount();
  expect(await screen.findByText(/Não foi possível carregar essa obra/)).toBeInTheDocument();
  mocks.user = { uid: 'ana' };
  view.rerender(<MemoryRouter initialEntries={['/obras/a']}><App /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: 'a' })).toBeInTheDocument();
  expect(screen.queryByText(/Não foi possível carregar essa obra/)).toBeNull();
  expect(mocks.work).toHaveBeenCalledTimes(2);
});
