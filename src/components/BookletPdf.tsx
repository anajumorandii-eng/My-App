import { useEffect, useRef, useState } from 'react';
import { requestBookletArtwork } from '../lib/bookletArtwork';
import type { PrintCoverContext } from '../lib/printCoverSpec';

/** A transformação local reutiliza exatamente o PDF que a estudante já escolheu. */
export function BookletPdf({pdf,filename,context}:{pdf:Blob;filename:string;context?:PrintCoverContext}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [ready,setReady]=useState<{url:string;sheets:number;blankPages:number}>();
 const pending=useRef<AbortController | undefined>(undefined),artwork=useRef<Uint8Array | undefined>(undefined);
 const edition=useRef(context?.edition || crypto.randomUUID());
 const mounted=useRef(false),url=useRef<string | undefined>(undefined);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;pending.current?.abort();if(url.current)URL.revokeObjectURL(url.current);};},[]);
 const generate=async()=>{
  if(busy||ready)return;
  if(pending.current)return;
  const controller=new AbortController();pending.current=controller;
  const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(160_000)]);
  setBusy(true);setError('');
  try{
   if(context&&!artwork.current)artwork.current=await requestBookletArtwork({...context,edition:edition.current},signal);
   signal.throwIfAborted();
   const {createBookletPdf}=await import('../lib/bookletPdf');
   const result=await createBookletPdf(new Uint8Array(await pdf.arrayBuffer()),artwork.current);
   if(!mounted.current)return;
   const file=new Blob([new Uint8Array(result.bytes)],{type:'application/pdf'});
   url.current=URL.createObjectURL(file);
   setReady({url:url.current,sheets:result.sheets,blankPages:result.blankPages});
  }catch(failure){if(mounted.current)setError(`${failure instanceof Error && failure.name==='Error'?failure.message:'Não foi possível gerar o livreto.'} O PDF comum continua disponível. Tente novamente.`);}
  finally{pending.current=undefined;if(mounted.current)setBusy(false);}
 };
 return <div className="space-y-2">
  {ready?<>
   <div className="flex flex-wrap gap-3">
    <a className="underline" href={ready.url} target="_blank" rel="noopener">Abrir livreto</a>
    <a className="underline" href={ready.url} download={filename.replace(/\.pdf$/i,'-livreto.pdf')}>Salvar livreto</a>
   </div>
   <p role="status">Livreto pronto: {ready.sheets} {ready.sheets===1?'folha A4':'folhas A4'}, frente e verso, com capa e contracapa.{ready.blankPages>0?` ${ready.blankPages} ${ready.blankPages===1?'página em branco adicionada':'páginas em branco adicionadas'} para completar a dobra.`:''}</p>
   <p>Imprima em A4, paisagem, tamanho real (100%), frente e verso pela borda curta. Selecione 1 página por face na impressora: o arquivo já está organizado para dobrar ao meio.</p>
  </>:<button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={()=>void generate()}>{busy?'Criando contracapa e preparando livreto…':'Gerar livreto'}</button>}
  {!ready&&<p className="text-xs text-[var(--dim)]">Livreto A5 para dobrar e grampear: duas páginas por face de uma folha A4. Preserva a capa e o conteúdo do PDF pronto e cria uma segunda arte para a contracapa: uma cena diferente que complementa o conteúdo da capa. A criação da contracapa usa uma geração de IA.</p>}
  {error&&<p role="alert">{error}</p>}
 </div>;
}
