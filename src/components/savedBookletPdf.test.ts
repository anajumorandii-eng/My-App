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
