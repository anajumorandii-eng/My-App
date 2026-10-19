import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DeepeningPdf } from './DeepeningPdf';
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'prepared-pdf-test' } }) }));
vi.mock('../lib/auth', () => ({ authHeaders: async () => ({ Authorization: 'Bearer test' }) }));
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
const pdf = () => new Response('%PDF-1.7\n', { headers: { 'Content-Type': 'application/pdf' } });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function setup(guideKey: string, fetch: ReturnType<typeof vi.fn>) {
  vi.stubGlobal('fetch', fetch);
  vi.stubGlobal('URL', class extends URL { static createObjectURL = vi.fn(() => 'blob:prepared'); static revokeObjectURL = vi.fn(); });
  const root = document.createElement('article');
  root.dataset.printSubject = 'Matemática'; root.dataset.printTopic = 'Probabilidade';
  root.innerHTML = '<h2>Probabilidade</h2><p>Conteúdo completo.</p><h3>Exercícios</h3><p>Última seção.</p>';
  const props = { getContent: () => root, title: 'Aprofundamento', guideKey, revision: 'v1', generateCover: true };
  return { root, props };
}
it('só mostra pronto após gerar o PDF com ilustração, índice e conteúdo; abrir não gera novamente', async () => {
  let finish!: (response: Response) => void;
  const fetch = vi.fn(async (url, options) => {
    if (url === '/api/study-pdf') return new Promise<Response>(resolve => { finish = resolve; });
    return Response.json(options?.method === 'POST' ? { dataUrl: image } : { enabled: true });
  });
  const { props } = setup('complete', fetch);
  render(<DeepeningPdf {...props} />);
  await waitFor(() => expect(finish).toBeDefined());
  expect(screen.getByRole('status')).toHaveTextContent('Preparando seu aprofundamento completo');
  expect(screen.queryByRole('link', { name: 'Abrir PDF' })).toBeNull();
  const sent = JSON.parse(fetch.mock.calls.find(([url]) => url === '/api/study-pdf')![1].body);
  expect(sent.html).toContain(image); expect(sent.html).toContain('Sumário');
  expect(sent.html).toContain('Última seção.'); expect(sent.html).toContain('data-print-cover');
  finish(pdf());
  expect(await screen.findByRole('link', { name: 'Abrir PDF' })).toHaveAttribute('href', 'blob:prepared');
  expect(screen.getByRole('status')).toHaveTextContent('Aprofundamento pronto, com capa e índice');
  expect(screen.getByRole('link', { name: 'Salvar PDF' })).toHaveAttribute('download', 'Aprofundamento.pdf');
  expect(screen.queryByRole('button', { name: /ilustração/ })).toBeNull();
  expect(fetch).toHaveBeenCalledTimes(3);
  cleanup();
  render(<DeepeningPdf {...props} generateCover={false} />);
  await screen.findByRole('link', { name: 'Abrir PDF' });
  expect(fetch).toHaveBeenCalledTimes(3);
});
it('falha da ilustração usa a capa padrão e ainda conclui o PDF', async () => {
  const fetch = vi.fn(async (url, options) => url === '/api/study-pdf' ? pdf() :
    options?.method === 'POST' ? Response.json({}, { status: 503 }) : Response.json({ enabled: true }));
  const { props } = setup('fallback', fetch);
  render(<DeepeningPdf {...props} />);
  await screen.findByRole('link', { name: 'Abrir PDF' });
  const sent = JSON.parse(fetch.mock.calls.find(([url]) => url === '/api/study-pdf')![1].body);
  expect(sent.html).toContain('data-print-cover'); expect(sent.html).toContain('Sumário');
  expect(sent.html).not.toContain(image);
});
it('falha do PDF não anuncia pronto e a nova tentativa reutiliza a capa', async () => {
  let calls = 0;
  const fetch = vi.fn(async (url, options) => {
    if (url === '/api/study-pdf') return ++calls === 1 ? Response.json({ error: 'Renderizador indisponível.' }, { status: 503 }) : pdf();
    return Response.json(options?.method === 'POST' ? { dataUrl: image } : { enabled: true });
  });
  const { props } = setup('retry', fetch);
  render(<DeepeningPdf {...props} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('O texto do seu aprofundamento continua salvo');
  expect(screen.queryByRole('link')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByRole('link', { name: 'Abrir PDF' });
  expect(fetch.mock.calls.filter(([url, options]) => url === '/api/cover-illustrations' && options?.method === 'POST')).toHaveLength(1);
});
it('descarta a preparação anterior quando a seleção muda', async () => {
  let finish!: (response: Response) => void;
  let signal!: AbortSignal;
  const fetch = vi.fn(async (url, options) => {
    if (url === '/api/study-pdf') { signal = options.signal; return new Promise<Response>(resolve => { finish = resolve; }); }
    return Response.json({ enabled: false });
  });
  const { props } = setup('cancel', fetch);
  const view = render(<DeepeningPdf {...props} />);
  await waitFor(() => expect(finish).toBeDefined());
  view.unmount(); expect(signal.aborted).toBe(true);
  finish(pdf());
  expect(screen.queryByRole('link')).toBeNull();
});
