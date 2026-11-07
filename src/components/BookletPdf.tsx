import { useEffect, useRef, useState } from 'react';
import { requestBookletArtwork } from '../lib/bookletArtwork';
import { loadSavedBookletPdf, saveBookletPdf, type SavedBookletPdf } from '../lib/savedBookletPdf';
import type { PrintCoverContext } from '../lib/printCoverSpec';

type ReadyBooklet = { url: string; sheets: number; blankPages?: number };

/** Recupera o livreto exato da conta; outra edição nasce apenas por escolha explícita. */
export function BookletPdf({pdf,filename,context,getSource,documentId}:{pdf:Blob;filename:string;context?:PrintCoverContext;getSource?:(signal:AbortSignal)=>Promise<Blob>;documentId?:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [loading,setLoading]=useState(Boolean(documentId)),[loadFailed,setLoadFailed]=useState(false),[readAttempt,setReadAttempt]=useState(0);
 const [ready,setReady]=useState<ReadyBooklet>();
 const pending=useRef<AbortController | undefined>(undefined),artwork=useRef<Uint8Array | undefined>(undefined);
 const repaginated=useRef<Blob | undefined>(undefined),prepared=useRef<SavedBookletPdf | undefined>(undefined);
 const replacing=useRef(false),edition=useRef(context?.edition || crypto.randomUUID());
 const mounted=useRef(false),url=useRef<string | undefined>(undefined);
 const publish=(file:SavedBookletPdf)=>{
  const nextUrl=URL.createObjectURL(file.blob);
  if(url.current)URL.revokeObjectURL(url.current);
  url.current=nextUrl;setReady({url:nextUrl,sheets:file.sheets,blankPages:file.blankPages});
 };
 useEffect(()=>{
  mounted.current=true;
  const controller=new AbortController();let active=true;
  setReady(undefined);setError('');setBusy(false);setLoadFailed(false);setLoading(Boolean(documentId));
  artwork.current=undefined;repaginated.current=undefined;prepared.current=undefined;replacing.current=false;
  edition.current=context?.edition || crypto.randomUUID();
  if(documentId)void (async()=>{
   try{
    const saved=await loadSavedBookletPdf(documentId,AbortSignal.any([controller.signal,AbortSignal.timeout(15_000)]));
    if(active&&saved)publish(saved);
   }catch{if(active){setLoadFailed(true);setError('Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.');}}
   finally{if(active)setLoading(false);}
  })();
  return()=>{active=false;mounted.current=false;controller.abort();pending.current?.abort();pending.current=undefined;if(url.current){URL.revokeObjectURL(url.current);url.current=undefined;}};
 },[documentId,readAttempt]);
 const generate=async(replace=false)=>{
  if(busy||loading||loadFailed||pending.current)return;
  if(ready&&!replace)return;
  if(replace&&!replacing.current){
   replacing.current=true;edition.current=crypto.randomUUID();artwork.current=undefined;repaginated.current=undefined;prepared.current=undefined;
  }
  const controller=new AbortController();pending.current=controller;
  const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(240_000)]);
  setBusy(true);setError('');
  try{
   if(!prepared.current){
    if(getSource&&!repaginated.current){
     const source=await getSource(AbortSignal.any([signal,AbortSignal.timeout(45_000)]));signal.throwIfAborted();repaginated.current=source;
    }
    signal.throwIfAborted();
    if(context&&!artwork.current){
     const art=await requestBookletArtwork({...context,edition:edition.current},signal);signal.throwIfAborted();artwork.current=art;
    }
    signal.throwIfAborted();
    const {createBookletPdf}=await import('../lib/bookletPdf');
    const fonts=context&&artwork.current?(await import('../lib/bookletCoverFonts')).bookletCoverFonts():undefined;
    const result=await createBookletPdf(new Uint8Array(await (repaginated.current||pdf).arrayBuffer()),artwork.current,context,fonts);
    signal.throwIfAborted();
    prepared.current={blob:new Blob([new Uint8Array(result.bytes)],{type:'application/pdf'}),sheets:result.sheets,blankPages:result.blankPages};
   }
   if(documentId)await saveBookletPdf(documentId,prepared.current.blob,AbortSignal.any([signal,AbortSignal.timeout(30_000)]));
   signal.throwIfAborted();
   if(!mounted.current)return;
   publish(prepared.current);prepared.current=undefined;replacing.current=false;
  }catch(failure){if(mounted.current&&!controller.signal.aborted)setError(`${failure instanceof Error && failure.name==='Error'?failure.message:'Não foi possível gerar o livreto.'} ${ready?'Você ainda pode abrir o livreto anterior nesta tela.':'O PDF comum continua disponível. Tente novamente.'}`);}
  finally{if(pending.current===controller){pending.current=undefined;if(mounted.current)setBusy(false);}}
 };
 return <div className="space-y-2">
  {loading?<p role="status">Recuperando livreto salvo…</p>:ready?<>
   <div className="flex flex-wrap gap-3">
    <a className="underline" href={ready.url} target="_blank" rel="noopener">Abrir livreto</a>
    <a className="underline" href={ready.url} download={filename.replace(/\.pdf$/i,'-livreto.pdf')}>Salvar livreto</a>
    <button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={()=>void generate(true)}>{busy?'Preparando novo livreto…':prepared.current?'Tentar salvar livreto':'Gerar novo livreto'}</button>
   </div>
   <p role="status">{documentId?'Livreto salvo na sua conta':'Livreto pronto'}: {ready.sheets} {ready.sheets===1?'folha A4':'folhas A4'}, frente e verso, com capa e contracapa.{(ready.blankPages??0)>0?` ${ready.blankPages} ${ready.blankPages===1?'página em branco adicionada':'páginas em branco adicionadas'} para completar a dobra.`:''}</p>
   <p>Imprima em A4, paisagem, tamanho real (100%), frente e verso pela borda curta. Selecione 1 página por face na impressora: o arquivo já está organizado para dobrar ao meio.</p>
  </>:!loadFailed&&<button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={()=>void generate()}>{busy?'Preparando livreto com diagramação compacta…':prepared.current?'Tentar salvar livreto':'Gerar livreto'}</button>}
  {!loading&&!ready&&!loadFailed&&<p className="text-xs text-[var(--dim)]">Livreto A5 para dobrar e grampear: duas páginas por face de uma folha A4, com fonte de 11 pt e espaçamento compacto. Capa e contracapa são criadas juntas, com duas cenas diferentes ligadas por uma única arte contínua.{documentId?' O arquivo fica salvo na sua conta e só é substituído quando você escolhe Gerar novo livreto.':''} A criação das capas usa uma geração de IA.</p>}
  {error&&<p role="alert">{error}</p>}
  {loadFailed&&<button type="button" className="underline" onClick={()=>setReadAttempt(value=>value+1)}>Tentar recuperar livreto</button>}
 </div>;
}
