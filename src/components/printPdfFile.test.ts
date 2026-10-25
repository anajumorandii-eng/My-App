import { afterEach, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { printStrategyGuide } from '../lib/printStrategyGuide';
import { coverContextKey, readPrintCoverContext } from '../lib/printCoverContext';
vi.mock('../lib/auth', () => ({ authHeaders: async () => ({ Authorization: 'Bearer test-user' }) }));
afterEach(() => { document.querySelector<HTMLButtonElement>('[data-pdf-close]')?.click(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it('no iPad entrega arquivo PDF com capa e texto sem depender de window.print', async () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)');
  const native = vi.spyOn(window, 'print').mockImplementation(() => {});
  const create = vi.fn(() => 'blob:pdf-test'); const revoke = vi.fn();
  vi.stubGlobal('URL', class extends URL { static createObjectURL = create; static revokeObjectURL = revoke; });
  const fetchMock = vi.fn().mockResolvedValue(new Response('%PDF-1.7\n', { headers: { 'Content-Type': 'application/pdf' } }));
  vi.stubGlobal('fetch', fetchMock);
  const content = document.createElement('article'); content.dataset.printSubject = 'Biologia'; content.dataset.printTopic = 'Ecologia'; content.innerHTML = '<h2>Relações ecológicas</h2><p>Explicação preservada.</p>';
  content.dataset.printGeneratedArt = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
  content.dataset.printGeneratedContext = coverContextKey(readPrintCoverContext(content));
  printStrategyGuide(content, 'Ecologia');
  const link = await screen.findByRole('link', { name: 'Abrir PDF para imprimir' });
  expect(link).toHaveAttribute('href', 'blob:pdf-test'); expect(native).not.toHaveBeenCalled();
  expect(fetchMock.mock.calls[0][0]).toBe('/api/study-pdf');
  const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(sent.html).not.toContain('data-print-generated-art');
  expect(sent.html).toContain('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB');
  expect(content.dataset.printGeneratedArt).toBeTruthy();
  expect(sent.html).toContain('Explicação preservada.'); expect(sent.html).toContain('data-print-cover'); expect(sent.html).toContain('Sumário');
  fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));
  expect(revoke).toHaveBeenCalledWith('blob:pdf-test'); expect(screen.queryByRole('dialog')).toBeNull();
});
it('falha de geração não cria download inválido e mantém o material original', async () => {
  vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPad');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Tente novamente.' }), { status: 503, headers: { 'Content-Type': 'application/json' } })));
  const content = document.createElement('article'); content.innerHTML = '<h2>Texto salvo</h2>';
  printStrategyGuide(content, 'Estudo');
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Tente novamente.'));
  expect(screen.queryByRole('link')).toBeNull(); expect(content.textContent).toBe('Texto salvo');
});

it('inclui KaTeX e fontes matemáticas incorporadas no HTML exportado',async()=>{
 vi.stubGlobal('URL',class extends URL {static createObjectURL=()=> 'blob:math';static revokeObjectURL=()=>{};});
 const send=vi.fn().mockResolvedValue(new Response('%PDF-1.7\n',{headers:{'Content-Type':'application/pdf'}}));vi.stubGlobal('fetch',send);
 const article=document.createElement('article');article.innerHTML='<p><span class="katex"><span class="katex-mathml"><math><mi>α</mi></math></span><span class="katex-html">α</span></span></p>';
 printStrategyGuide(article,'Matemática');await screen.findByRole('link',{name:'Abrir PDF para imprimir'});
 const html=JSON.parse(send.mock.calls[0][1].body).html;
 expect(html.includes('KaTeX_Math')).toBe(true);expect(html.includes('data:font/woff2;base64,')).toBe(true);
 expect(html).not.toContain('.katex-html { display: none !important; }');
 expect(html).not.toMatch(/url\(["']?fonts\/KaTeX/);
});
