import {afterEach,expect,it,vi} from 'vitest';
import {loadSavedBookletPdf,saveBookletPdf} from '../lib/savedBookletPdf';
vi.mock('../lib/auth',()=>({authHeaders:async()=>({Authorization:'Bearer test'})}));
afterEach(()=>vi.unstubAllGlobals());
const id='a'.repeat(64),signal=new AbortController().signal;
it('recupera o PDF com a contagem persistida e só considera 404 como ausência',async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce(new Response('%PDF-1.7\nSALVO',{headers:{'Content-Type':'application/pdf','X-Booklet-Sheets':'2'}})).mockResolvedValueOnce(new Response(null,{status:404})).mockResolvedValueOnce(new Response(null,{status:503}));
 vi.stubGlobal('fetch',fetcher);
 const saved=await loadSavedBookletPdf(id,signal);expect(saved?.sheets).toBe(2);expect(await saved?.blob.text()).toBe('%PDF-1.7\nSALVO');
 expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Bearer test');
 expect(await loadSavedBookletPdf(id,signal)).toBeUndefined();await expect(loadSavedBookletPdf(id,signal)).rejects.toThrow('recuperar');
});
it('envia o próprio arquivo binário e informa falha de salvamento',async()=>{
 const blob=new Blob(['%PDF-1.7\nSALVO'],{type:'application/pdf'});
 const fetcher=vi.fn().mockResolvedValueOnce(new Response(null,{status:204})).mockResolvedValueOnce(new Response(null,{status:503}));vi.stubGlobal('fetch',fetcher);
 await saveBookletPdf(id,blob,signal);
 expect(fetcher).toHaveBeenCalledWith(`/api/study-pdf/saved/${id}/booklet`,{method:'PUT',headers:{Authorization:'Bearer test','Content-Type':'application/pdf'},body:blob,signal});
 await expect(saveBookletPdf(id,blob,signal)).rejects.toThrow('arquivo preparado será reaproveitado');
});
it('recusa resposta corrompida sem tratar como arquivo ausente',async()=>{
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('não é PDF',{headers:{'Content-Type':'application/pdf','X-Booklet-Sheets':'2'}})));
 await expect(loadSavedBookletPdf(id,signal)).rejects.toThrow('recuperar');
});

it('salva e recupera Capa e Miolo juntos, sem alterar seus bytes',async()=>{
 const {Blob:NodeBlob}=await import('node:buffer');vi.stubGlobal('Blob',NodeBlob);
 const {bookletPrintPlan}=await import('../lib/bookletPlan');
 const {decodeBookletPackage}=await import('../lib/bookletPackage');
 const metadata=bookletPrintPlan(5,'separate'),body=new Blob(['%PDF-MIOLO'],{type:'application/pdf'}),cover=new Blob(['%PDF-CAPA'],{type:'application/pdf'});
 const fetcher=vi.fn().mockResolvedValueOnce(new Response(null,{status:204}));vi.stubGlobal('fetch',fetcher);
 await saveBookletPdf(id,body,signal,'separate',cover,metadata);
 expect(fetcher.mock.calls[0][0]).toBe(`/api/study-pdf/saved/${id}/booklet?mode=separate`);
 const uploaded=fetcher.mock.calls[0][1].body as Blob;
 expect(uploaded.type).toBe('application/zip');
 const bytes=new Uint8Array(await uploaded.arrayBuffer()),decoded=decodeBookletPackage(bytes);
 expect(new TextDecoder().decode(decoded.body)).toBe('%PDF-MIOLO');expect(new TextDecoder().decode(decoded.cover)).toBe('%PDF-CAPA');
 fetcher.mockResolvedValueOnce(new Response(bytes,{headers:{'Content-Type':'application/zip'}}));
 const saved=await loadSavedBookletPdf(id,signal,'separate');
 expect(await saved?.blob.text()).toBe('%PDF-MIOLO');expect(await saved?.coverBlob?.text()).toBe('%PDF-CAPA');expect(saved?.blankPages).toBe(3);
});
