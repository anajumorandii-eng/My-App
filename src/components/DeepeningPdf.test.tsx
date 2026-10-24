import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DeepeningPdf } from './DeepeningPdf';
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: { uid: 'prepared-pdf-test' } }) }));
vi.mock('../lib/auth', () => ({ authHeaders: async () => ({ Authorization: 'Bearer test' }) }));
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
const pdf = () => new Response('%PDF-1.7\n', { headers: { 'Content-Type': 'application/pdf' } });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function setup(guideKey: string, fetch: (url: string, options?: RequestInit) => Promise<Response>, readSaved: typeof fetch = async () => new Response(null, {status:404})) {
  vi.stubGlobal('fetch', (url: string, options?: RequestInit) => url.startsWith('/api/study-pdf/saved/') ? readSaved(url, options) : fetch(url, options));
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
  expect(screen.getByText(/capa padrão provisória/)).toBeVisible();
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
it('não reaproveita o PDF de aprofundamento numa revisão com a mesma chave e versão',async()=>{
 const fetch=vi.fn(async (url, _options?: {body:string})=>url==='/api/study-pdf'?pdf():Response.json({enabled:false}));
 const {root,props}=setup('different-materials',fetch);
 render(<DeepeningPdf {...props} generateCover={false}/>);
 await screen.findByRole('link',{name:'Abrir PDF'});cleanup();
 root.dataset.printPurpose='Revisão estratégica';
 render(<DeepeningPdf {...props} generateCover={false} materialLabel="Revisão"/>);
 await screen.findByRole('link',{name:'Abrir PDF'});
 const calls=fetch.mock.calls.filter(([url])=>url==='/api/study-pdf');
 expect(calls).toHaveLength(2);
 expect(JSON.parse(calls[1][1]!.body).html).toContain('CADERNOS DE REVISÃO');
});
it('gerar novo PDF cria outra capa sem regenerar ao abrir ou salvar o arquivo pronto',async()=>{
 const fetch=vi.fn(async(url,options)=>url==='/api/study-pdf'?pdf():Response.json(options?.method==='POST'?{dataUrl:image}:{enabled:true}));
 const {props}=setup('new-cover',fetch);
 render(<DeepeningPdf {...props}/>);
 await screen.findByRole('link',{name:'Abrir PDF'});
 fireEvent.click(screen.getByRole('button',{name:'Gerar novo PDF'}));
 await screen.findByRole('link',{name:'Abrir PDF'});
 const calls=fetch.mock.calls.filter(([url])=>url==='/api/study-pdf');
 expect(calls).toHaveLength(2);
 expect(JSON.parse(calls[0][1].body).html).not.toBe(JSON.parse(calls[1][1]!.body).html);
 expect(fetch.mock.calls.filter(([url,options])=>url==='/api/cover-illustrations'&&options?.method==='POST')).toHaveLength(2);
});
it('recupera da conta o arquivo exato de uma sessão anterior sem pedir outra capa ou PDF', async () => {
 const fetch = vi.fn(async (_url: string) => pdf());
 const { props } = setup('persisted-account-file', fetch, fetch);
 render(<DeepeningPdf {...props} />);
 await screen.findByRole('link', {name:'Abrir PDF'});
 expect(fetch).toHaveBeenCalledTimes(1);
 expect(fetch.mock.calls[0][0]).toMatch(/^\/api\/study-pdf\/saved\/[a-f0-9]{64}$/);
});
it('não substitui a capa salva quando falha a consulta à conta', async () => {
 const fetch = vi.fn(async () => Response.json({}, {status:503}));
 const { props } = setup('unavailable-account-file', fetch, fetch);
 render(<DeepeningPdf {...props} />);
 expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível recuperar');
 expect(fetch).toHaveBeenCalledTimes(1);
});
it('revisão sem PDF aguarda exportação explícita e envia a identificação para salvar na conta', async () => {
 const fetch = vi.fn(async (url: string, _options?: RequestInit) => url === '/api/study-pdf' ? pdf() : Response.json({enabled:false}));
 const {props} = setup('not-yet-exported', fetch);
 render(<DeepeningPdf {...props} autoGenerate={false} materialLabel="Revisão"/>);
 fireEvent.click(await screen.findByRole('button',{name:'Exportar revisão em PDF'}));
 await screen.findByRole('link',{name:'Abrir PDF'});
 const call=fetch.mock.calls.find(([url])=>url==='/api/study-pdf')!;
 expect(JSON.parse(String(call[1]?.body)).documentId).toMatch(/^[a-f0-9]{64}$/);
});
it('abre a mesma capa ao passar da geração para a biblioteca, mesmo com título de tela diferente', async () => {
 const files = new Map<string, string>();
 const fetch=vi.fn(async(url:string,options?:RequestInit)=>{
   if(url.startsWith('/api/study-pdf/saved/')) return files.has(url.split('/').at(-1)!) ? pdf() : new Response(null,{status:404});
   if(url==='/api/study-pdf'){const body=JSON.parse(String(options?.body));files.set(body.documentId,body.html);return pdf();}
   return Response.json({enabled:false});
 });
 const {props}=setup('stable-library-file',fetch,fetch);
 render(<DeepeningPdf {...props} title="Aprofundamento — Matemática — Probabilidade — FUVEST"/>);
 await screen.findByRole('link',{name:'Abrir PDF'}); cleanup();
 render(<DeepeningPdf {...props} title="Aprofundamento — Matemática — Probabilidade"/>);
 await screen.findByRole('link',{name:'Abrir PDF'});
 expect(fetch.mock.calls.filter(([url])=>url==='/api/study-pdf')).toHaveLength(1);
});
it('aguarda o renderizador de matemática antes de capturar uma revisão nova',async()=>{
 const fetch=vi.fn(async (url:string, _options?:RequestInit)=>url==='/api/study-pdf'?pdf():Response.json({enabled:false}));
 const {props}=setup('wait-for-math',fetch);
 const content=props.getContent()!;
 content.innerHTML='<div data-ai-text-pending>Fórmula ainda em texto puro</div>';
 render(<DeepeningPdf {...props} getContent={()=>content} materialLabel="Revisão"/>);
 await waitFor(()=>expect(screen.getByRole('status')).toHaveTextContent('Preparando revisão'));
 expect(fetch.mock.calls.some(([url])=>url==='/api/study-pdf')).toBe(false);
 content.innerHTML='<p>Fórmula pronta</p><math><mi>A</mi></math>';
 await screen.findByRole('link',{name:'Abrir PDF'});
 const sent=JSON.parse(String(fetch.mock.calls.find(([url])=>url==='/api/study-pdf')![1]?.body));
 expect(sent.html).toContain('<math>');expect(sent.html).not.toContain('ainda em texto puro');
});
it('gera capas por arquivo e envia o tipo e o recorte próprios de cada material', async () => {
 const fetch=vi.fn(async(url,options)=>url==='/api/study-pdf'?pdf():Response.json(options?.method==='POST'?{dataUrl:image}:{enabled:true}));
 const first=setup('inspired-study-file',fetch);
 first.root.dataset.printPurpose='Aprofundamento';
 first.root.dataset.printSubtopic='Eventos independentes';
 render(<DeepeningPdf {...first.props}/>);
 await screen.findByRole('link',{name:'Abrir PDF'});
 cleanup();
 const second=setup('inspired-review-file',fetch);
 second.root.dataset.printPurpose='Revisão estratégica';
 second.root.dataset.printSubtopic='Probabilidade condicional';
 render(<DeepeningPdf {...second.props} materialLabel="Revisão"/>);
 await screen.findByRole('link',{name:'Abrir PDF'});
 const requests=fetch.mock.calls.filter(([url,options])=>url==='/api/cover-illustrations'&&options?.method==='POST').map(([,options])=>JSON.parse(options.body));
 expect(requests).toEqual([
  expect.objectContaining({purpose:'Aprofundamento',subtopic:'Eventos independentes'}),
  expect.objectContaining({purpose:'Revisão estratégica',subtopic:'Probabilidade condicional'}),
 ]);
});
