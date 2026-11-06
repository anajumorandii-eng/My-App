import {afterEach,expect,it,vi} from 'vitest';
import {requestBookletArtwork} from '../lib/bookletArtwork';
vi.mock('../lib/auth',()=>({authHeaders:async()=>({Authorization:'Bearer session'})}));
afterEach(()=>vi.unstubAllGlobals());
it('solicita apenas a contracapa para o conteúdo e edição escolhidos',async()=>{
 const context={subject:'Geografia',topic:'Climatologia',subtopic:'Ilhas de calor',edition:'c8d8a3ac-3a14-4ea3-8e88-e177de5cebf5'};
 const fetcher=vi.fn(async()=>Response.json({dataUrl:'data:image/png;base64,AQID'}));vi.stubGlobal('fetch',fetcher);
 const signal=new AbortController().signal;
 expect(await requestBookletArtwork(context,signal)).toEqual(new Uint8Array([1,2,3]));
 expect(fetcher).toHaveBeenCalledTimes(1);
 const [url,options]=fetcher.mock.calls[0] as unknown as [string,RequestInit];
 expect(url).toBe('/api/cover-illustrations');expect(JSON.parse(String(options.body))).toEqual({...context,side:'back'});expect(options.signal).toBe(signal);
});
it('recusa imagens remotas, formatos ativos e falha do serviço',async()=>{
 for(const dataUrl of ['https://example.test/art.png','data:image/svg+xml;base64,AQID','invalid']){
  vi.stubGlobal('fetch',vi.fn(async()=>Response.json({dataUrl})));
  await expect(requestBookletArtwork({subject:'Biologia',topic:'Ecologia'},new AbortController().signal)).rejects.toThrow('inválida');
 }
 vi.stubGlobal('fetch',vi.fn(async()=>Response.json({error:'Limite atingido'},{status:429})));
 await expect(requestBookletArtwork({subject:'Biologia',topic:'Ecologia'},new AbortController().signal)).rejects.toThrow('Limite atingido');
});
