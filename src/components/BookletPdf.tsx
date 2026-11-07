import { type BookletMode } from '../lib/bookletPlan';
import { useEffect, useRef, useState } from 'react';
import { requestBookletArtwork } from '../lib/bookletArtwork';
import { loadSavedBookletPdf, saveBookletPdf, type SavedBookletPdf } from '../lib/savedBookletPdf';
import type { PrintCoverContext } from '../lib/printCoverSpec';

type ReadyBooklet = { url: string; coverUrl?: string; sheets: number; blankPages?: number; legacy?: boolean };
type Props = {pdf:Blob;filename:string;context?:PrintCoverContext;getSource?:(signal:AbortSignal,mode?:BookletMode)=>Promise<Blob>;documentId?:string};

export function BookletPdf(props:Props){
 const [mode,setMode]=useState<BookletMode>('integrated'),[busy,setBusy]=useState(false);
 return <div className="space-y-3"><fieldset disabled={busy}><legend>Formato do livreto</legend><div className="flex flex-wrap gap-4">
  <label><input type="radio" name={`booklet-format-${props.documentId||props.filename}`} checked={mode==='integrated'} onChange={()=>setMode('integrated')}/> Livreto com capa integrada</label>
  <label><input type="radio" name={`booklet-format-${props.documentId||props.filename}`} checked={mode==='separate'} onChange={()=>setMode('separate')}/> Livreto com capa separada</label>
 </div></fieldset><BookletEdition key={`${props.documentId}-${mode}`} {...props} mode={mode} onBusyChange={setBusy}/></div>;
}

/** Recupera o livreto exato da conta; outra edição nasce apenas por escolha explícita. */
function BookletEdition({pdf,filename,context,getSource,documentId,mode,onBusyChange}:Props&{mode:BookletMode;onBusyChange:(busy:boolean)=>void}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [loading,setLoading]=useState(Boolean(documentId)),[loadFailed,setLoadFailed]=useState(false),[readAttempt,setReadAttempt]=useState(0);
 const [ready,setReady]=useState<ReadyBooklet>();
 const pending=useRef<AbortController | undefined>(undefined),artwork=useRef<Uint8Array | undefined>(undefined);
 const repaginated=useRef<Blob | undefined>(undefined),prepared=useRef<SavedBookletPdf | undefined>(undefined),published=useRef<SavedBookletPdf | undefined>(undefined);
 const replacing=useRef(false),edition=useRef(context?.edition || crypto.randomUUID());
 const mounted=useRef(false),url=useRef<string | undefined>(undefined),coverUrl=useRef<string | undefined>(undefined),existingCover=useRef<Uint8Array | undefined>(undefined);
 useEffect(()=>{onBusyChange(busy);return()=>onBusyChange(false);},[busy,onBusyChange]);
 const publish=(file:SavedBookletPdf)=>{
  const nextUrl=URL.createObjectURL(file.blob);published.current=file;
  if(url.current)URL.revokeObjectURL(url.current);
  if(coverUrl.current)URL.revokeObjectURL(coverUrl.current);
  coverUrl.current=file.coverBlob?URL.createObjectURL(file.coverBlob):undefined;
  url.current=nextUrl;setReady({url:nextUrl,coverUrl:coverUrl.current,sheets:file.sheets,blankPages:file.blankPages,legacy:file.legacy});
 };
 useEffect(()=>{
  mounted.current=true;
  const controller=new AbortController();let active=true;
  setReady(undefined);setError('');setBusy(false);setLoadFailed(false);setLoading(Boolean(documentId));
  artwork.current=undefined;repaginated.current=undefined;prepared.current=undefined;replacing.current=false;existingCover.current=undefined;
  edition.current=context?.edition || crypto.randomUUID();
  if(documentId)void (async()=>{
   try{
    const saved=await loadSavedBookletPdf(documentId,AbortSignal.any([controller.signal,AbortSignal.timeout(15_000)]),mode);
    if(active&&saved)publish(saved);
   }catch{if(active){setLoadFailed(true);setError('Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.');}}
   finally{if(active)setLoading(false);}
  })();
  return()=>{active=false;mounted.current=false;controller.abort();pending.current?.abort();pending.current=undefined;if(url.current){URL.revokeObjectURL(url.current);url.current=undefined;}if(coverUrl.current){URL.revokeObjectURL(coverUrl.current);coverUrl.current=undefined;}};
 },[documentId,readAttempt]);
 const generate=async(replace=false,keepCover=false)=>{
  if(busy||loading||loadFailed||pending.current)return;
  if(ready&&!replace)return;
  if(replace&&!replacing.current){
   replacing.current=true;edition.current=crypto.randomUUID();artwork.current=undefined;repaginated.current=undefined;prepared.current=undefined;existingCover.current=undefined;
  }
  const controller=new AbortController();pending.current=controller;
  const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(240_000)]);
  setBusy(true);setError('');
  try{
   if(!prepared.current){
    if(keepCover&&!existingCover.current&&published.current){
     const {extractBookletCover}=await import('../lib/bookletPdf');
     const prior=published.current;const cover=prior.coverBlob?new Uint8Array(await prior.coverBlob.arrayBuffer()):await extractBookletCover(new Uint8Array(await prior.blob.arrayBuffer()));
     signal.throwIfAborted();existingCover.current=cover;
    }
    if(documentId&&!replace&&!existingCover.current&&!artwork.current){
     const other=await loadSavedBookletPdf(documentId,signal,mode==='integrated'?'separate':'integrated');
     if(other){
      const {extractBookletCover}=await import('../lib/bookletPdf');
      const cover=other.coverBlob?new Uint8Array(await other.coverBlob.arrayBuffer()):await extractBookletCover(new Uint8Array(await other.blob.arrayBuffer()));
      signal.throwIfAborted();existingCover.current=cover;
     }
    }
    if(getSource&&!repaginated.current){
     const source=await getSource(AbortSignal.any([signal,AbortSignal.timeout(45_000)]),mode);signal.throwIfAborted();repaginated.current=source;
    }
    signal.throwIfAborted();
    if(context&&!artwork.current&&!existingCover.current){
     const art=await requestBookletArtwork({...context,edition:edition.current},signal);signal.throwIfAborted();artwork.current=art;
    }
    signal.throwIfAborted();
    const {createBookletPdf}=await import('../lib/bookletPdf');
    const fonts=context&&artwork.current&&!existingCover.current?(await import('../lib/bookletCoverFonts')).bookletCoverFonts():undefined;
    const result=await createBookletPdf(new Uint8Array(await (repaginated.current||pdf).arrayBuffer()),artwork.current,context,fonts,mode,existingCover.current);
    signal.throwIfAborted();
    prepared.current={blob:new Blob([new Uint8Array(result.bytes)],{type:'application/pdf'}),sheets:result.sheets,blankPages:result.blankPages,contentPages:result.contentPages,layoutVersion:result.layoutVersion,coverBlob:mode==='separate'?new Blob([new Uint8Array(result.coverBytes)],{type:'application/pdf'}):undefined};
   }
   if(documentId)await saveBookletPdf(documentId,prepared.current.blob,AbortSignal.any([signal,AbortSignal.timeout(30_000)]),mode,prepared.current.coverBlob,prepared.current.layoutVersion?{layoutVersion:2,mode,contentPages:prepared.current.contentPages!,blankPages:prepared.current.blankPages!,sheets:prepared.current.sheets,coverSheets:mode==='separate'?1:0}:undefined);
   signal.throwIfAborted();
   if(!mounted.current)return;
   publish(prepared.current);prepared.current=undefined;replacing.current=false;
  }catch(failure){if(mounted.current&&!controller.signal.aborted)setError(`${failure instanceof Error && failure.name==='Error'?failure.message:'Não foi possível gerar o livreto.'} ${ready?'Você ainda pode abrir o livreto anterior nesta tela.':'O PDF comum continua disponível. Tente novamente.'}`);}
  finally{if(pending.current===controller){pending.current=undefined;if(mounted.current)setBusy(false);}}
 };
 return <div className="space-y-2">
  {loading?<p role="status">Recuperando livreto salvo…</p>:ready?<>
   <div className="flex flex-wrap gap-3">
    {mode==='separate'&&ready.coverUrl&&<>
     <a className="underline" href={ready.coverUrl} target="_blank" rel="noopener">Abrir Capa</a>
     <a className="underline" href={ready.coverUrl} download={filename.replace(/\.pdf$/i,'-capa.pdf')}>Salvar Capa</a>
    </>}
    <a className="underline" href={ready.url} target="_blank" rel="noopener">{mode==='separate'?'Abrir Miolo':'Abrir livreto'}</a>
    <a className="underline" href={ready.url} download={filename.replace(/\.pdf$/i,mode==='separate'?'-miolo.pdf':'-livreto.pdf')}>{mode==='separate'?'Salvar Miolo':'Salvar livreto'}</a>
    <button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={()=>void generate(true,Boolean(ready.legacy))}>{busy?'Preparando novo livreto…':prepared.current?'Tentar salvar livreto':ready.legacy?'Corrigir montagem mantendo capa':'Gerar novo livreto'}</button>
   </div>
   <p role="status">{documentId?'Livreto salvo na sua conta':'Livreto pronto'}: {ready.sheets+(mode==='separate'?1:0)} {ready.sheets+(mode==='separate'?1:0)===1?'folha A4':'folhas A4'} no total.{mode==='separate'?` Capa: 1 folha. Miolo: ${ready.sheets} ${ready.sheets===1?'folha':'folhas'}.`:''}</p>
   {ready.legacy?<p>Este arquivo é anterior à correção da montagem. Use Corrigir montagem mantendo capa para atualizar a ordem; o arquivo anterior continua disponível.</p>:<>
    <p>{ready.blankPages??0} páginas de leitura A5 em branco adicionadas{mode==='separate'?' somente ao final do miolo.':': duas nas faces internas da capa e as demais ao final do miolo.'}</p>
    {mode==='separate'?<>
     <p><strong>Capa:</strong> A4 em paisagem, tamanho real (100%), somente na frente. Contracapa à esquerda e capa à direita. Deixe o verso inteiro em branco (uma face A4, equivalente a duas páginas A5).</p>
     <p><strong>Miolo:</strong> A4 em paisagem, tamanho real (100%), frente e verso com virada pela borda curta. Mantenha a ordem das folhas, dobre e encaixe dentro da capa.</p>
    </>:<p><strong>Livreto com capa integrada:</strong> A4 em paisagem, tamanho real (100%), frente e verso com virada pela borda curta. Imprima o arquivo completo, incluindo a face interna da capa em branco, mantenha a ordem, dobre e encaixe as folhas.</p>}
    <p>Use uma página do PDF por face da folha: a imposição já está pronta. Não selecione novamente “Livreto” nem “2 páginas por folha” no leitor de PDF. Mantenha a impressão das faces em branco para preservar a montagem.</p>
   </>}

  </>:!loadFailed&&<button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={()=>void generate()}>{busy?'Preparando livreto com diagramação compacta…':prepared.current?'Tentar salvar livreto':'Gerar livreto'}</button>}
  {!loading&&!ready&&!loadFailed&&<p className="text-xs text-[var(--dim)]">Livreto A5 para dobrar e grampear: duas páginas por face de uma folha A4, com fonte de 11 pt e espaçamento compacto. Capa e contracapa são criadas juntas, com duas cenas diferentes ligadas por uma única arte contínua.{documentId?' O arquivo fica salvo na sua conta e só é substituído quando você escolhe Gerar novo livreto.':''} Os dois formatos ficam salvos separadamente. Ao preparar o outro formato, a capa já salva é reaproveitada. A criação de novas artes usa uma geração de IA.</p>}
  {error&&<p role="alert">{error}</p>}
  {loadFailed&&<button type="button" className="underline" onClick={()=>setReadAttempt(value=>value+1)}>Tentar recuperar livreto</button>}
 </div>;
}
