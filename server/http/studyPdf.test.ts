import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { createStudyPdfRouter } from './studyPdf';

test('salva o PDF exato e o recupera em outra sessão, isolado por conta', async () => {
 const files = new Map<string, Buffer>();
 let failWrite = false, failRead = false, renders = 0;
 const storage = {read: async (uid:string,id:string) => { if(failRead) throw new Error('private details'); return files.get(`${uid}/${id}`) ?? null; },
   write: async (uid:string,id:string,pdf:Buffer) => { if(failWrite) throw new Error('private details'); files.set(`${uid}/${id}`,pdf); }};
 const id = 'a'.repeat(64);
 const app = express(); app.use(express.json());
 app.use((req,res,next)=>{res.locals.userId=req.headers['x-test-user'];next();});
 app.use(createStudyPdfRouter(async () => Buffer.from(`%PDF-1.7\nCAPA ESCOLHIDA ${++renders}`),storage));
 const server=app.listen(0,'127.0.0.1'); await new Promise<void>(resolve=>server.once('listening',resolve));
 const url=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;
 try {
   const generated=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-test-user':'A'},body:JSON.stringify({title:'Revisão',html:'<p>Texto</p>',documentId:id})});
   assert.equal(generated.status,200);
   const saved=await fetch(`${url}/saved/${id}`,{headers:{'x-test-user':'A'}});
   assert.equal(saved.status,200); assert.equal(await saved.text(),await generated.text());
   assert.equal(saved.headers.get('cache-control'),'no-store');
   assert.equal(renders,1);
   assert.equal((await fetch(`${url}/saved/${id}`,{headers:{'x-test-user':'B'}})).status,404);
   assert.equal((await fetch(`${url}/saved/${id}`)).status,401);
   failWrite=true;
   const failed=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','x-test-user':'A'},body:JSON.stringify({title:'Revisão',html:'<p>Texto</p>',documentId:id})});
   assert.equal(failed.status,503); assert.doesNotMatch(await failed.text(),/private details/);
   assert.equal(await (await fetch(`${url}/saved/${id}`,{headers:{'x-test-user':'A'}})).text(),'%PDF-1.7\nCAPA ESCOLHIDA 1');
   failRead=true;
   assert.equal((await fetch(`${url}/saved/${id}`,{headers:{'x-test-user':'A'}})).status,503);
 } finally { await new Promise<void>(resolve=>server.close(()=>resolve())); }
});

async function withServer(render: (html: string) => Promise<Uint8Array>, run: (url: string) => Promise<void>) {
  const app = express(); app.use(express.json()); app.use(createStudyPdfRouter(render));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  try { await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`); }
  finally { await new Promise<void>(resolve => server.close(() => resolve())); }
}
test('entrega PDF privado com corpo e nome limitados', async () => {
  let received = '';
  await withServer(async html => { received = html; return Buffer.from('%PDF-1.7\n'); }, async url => {
    const result = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'Ecologia', html: '<article>Explicação original</article>' }) });
    assert.equal(result.status, 200); assert.equal(result.headers.get('content-type'), 'application/pdf');
    assert.equal(result.headers.get('cache-control'), 'no-store'); assert.match(result.headers.get('content-disposition')!, /attachment/);
    assert.match(received, /Explicação original/); assert.equal(await result.text(), '%PDF-1.7\n');
  });
});
test('recusa contrato inválido e não chama o renderizador', async () => {
  let calls = 0;
  await withServer(async () => { calls++; return new Uint8Array(); }, async url => {
    for (const body of [{}, { title: 'x', html: 4 }, { title: 'x', html: '<p>x</p>', url: 'http://example.invalid' }, { title: 'x'.repeat(301), html: 'x' }]) {
      const result = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      assert.equal(result.status, 400);
    }
    assert.equal(calls, 0);
  });
});
test('limita a uma renderização por processo e libera o recurso após falha', async () => {
  let finish!: () => void;
  const waiting = new Promise<void>(resolve => { finish = resolve; });
  let started!: () => void; const entered = new Promise<void>(resolve => { started = resolve; });
  await withServer(async () => { started(); await waiting; throw new Error('private details'); }, async url => {
    const send = () => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'x', html: '<p>x</p>' }) });
    const first = send();
    await entered;
    const busy = await send(); assert.equal(busy.status, 503); finish();
    const failure = await first; assert.equal(failure.status, 502); assert.doesNotMatch(await failure.text(), /private details/);
    assert.equal((await send()).status, 502);
  });
});

test('renderizador real preserva texto e não executa scripts nem acessa a rede', async context => {
  const { existsSync } = await import('node:fs');
  if (!['/usr/bin/chromium', '/usr/bin/google-chrome'].some(existsSync) && !process.env.CHROMIUM_PATH) { context.skip('Chromium não está instalado neste executor.'); return; }
  const { renderStudyPdf } = await import('./studyPdf');
  const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { execFileSync } = await import('node:child_process');
  let hits = 0;
  const trap = express(); trap.use((_req, res) => { hits++; res.end('unexpected'); });
  const listener = trap.listen(0, '127.0.0.1'); await new Promise<void>(resolve => listener.once('listening', resolve));
  const url = `http://127.0.0.1:${(listener.address() as AddressInfo).port}`;
  const directory = await mkdtemp(`${tmpdir()}/crivo-pdf-test-`);
  try {
    const pdf = await renderStudyPdf(`<html><head><style>body { background-image: url('${url}'); }</style></head><body><script>fetch('${url}')</script><h1>Texto preservado</h1></body></html>`);
    assert.equal(Buffer.from(pdf).subarray(0, 5).toString(), '%PDF-'); assert.equal(hits, 0);
    await writeFile(`${directory}/test.pdf`, pdf);
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: pdf });
    try { assert.match((await parser.getText()).text, /Texto preservado/); }
    finally { await parser.destroy(); }
  } finally { await rm(directory, { recursive: true, force: true }); await new Promise<void>(resolve => listener.close(() => resolve())); }
});

test('sumário usa destinos reais e estabiliza mesmo com várias páginas de entradas', async context => {
  if (!process.env.CHROMIUM_PATH) { context.skip('Defina CHROMIUM_PATH para a validação de paginação.'); return; }
  const { renderStudyPdf } = await import('./studyPdf');
  const { readSectionPages } = await import('./studyPdfPagination');
  const { PDFParse } = await import('pdf-parse');
  const ids = Array.from({length: 60}, (_, index) => `section-${index}`);
  const html = `<style>@page{size:A4;margin:20mm}li{break-inside:avoid;margin-bottom:4mm}h2{break-after:avoid}article{break-before:page}</style><h1>Sumário</h1><ol>${ids.map(id => `<li><a href="#${id}">${id}</a> Página <span data-toc-page="${id}">…</span></li>`).join('')}</ol><article>${ids.map(id => `<h2 id="${id}">${id}</h2><p>${'Conteúdo integral preservado. '.repeat(15)}</p>`).join('')}</article>`;
  const pdf = await renderStudyPdf(html);
  const destinations = await readSectionPages(pdf, ids);
  const parser = new PDFParse({data:pdf});
  try {
    const {text} = await parser.getText();
    for (const id of ids) assert.match(text, new RegExp(`${id}\\s+Página\\s+${destinations[id]}\\b`));
  } finally { await parser.destroy(); }
});
