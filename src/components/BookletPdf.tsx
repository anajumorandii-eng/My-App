import { useEffect, useRef, useState } from 'react';

/** A transformação local reutiliza exatamente o PDF que a estudante já escolheu. */
export function BookletPdf({pdf,filename}:{pdf:Blob;filename:string}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const [ready,setReady]=useState<{url:string;sheets:number;blankPages:number}>();
 const mounted=useRef(false),url=useRef<string | undefined>(undefined);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;if(url.current)URL.revokeObjectURL(url.current);};},[]);
 const generate=async()=>{
  if(busy||ready)return;
  setBusy(true);setError('');
  try{
   const {createBookletPdf}=await import('../lib/bookletPdf');
   const result=await createBookletPdf(new Uint8Array(await pdf.arrayBuffer()));
   if(!mounted.current)return;
   const file=new Blob([new Uint8Array(result.bytes)],{type:'application/pdf'});
   url.current=URL.createObjectURL(file);
   setReady({url:url.current,sheets:result.sheets,blankPages:result.blankPages});
  }catch{if(mounted.current)setError('Não foi possível gerar o livreto. O PDF comum continua disponível. Tente novamente.');}
  finally{if(mounted.current)setBusy(false);}
 };
 return <div className="space-y-2">
  {ready?<>
   <div className="flex flex-wrap gap-3">
    <a className="underline" href={ready.url} target="_blank" rel="noopener">Abrir livreto</a>
    <a className="underline" href={ready.url} download={filename.replace(/\.pdf$/i,'-livreto.pdf')}>Salvar livreto</a>
   </div>
   <p role="status">Livreto pronto: {ready.sheets} {ready.sheets===1?'folha A4':'folhas A4'}, frente e verso.{ready.blankPages>0?` ${ready.blankPages} ${ready.blankPages===1?'página em branco adicionada':'páginas em branco adicionadas'} para completar a dobra.`:''}</p>
   <p>Imprima em A4, paisagem, tamanho real (100%), frente e verso pela borda curta. Selecione 1 página por face na impressora: o arquivo já está organizado para dobrar ao meio.</p>
  </>:<button type="button" className="underline disabled:opacity-50" disabled={busy} onClick={()=>void generate()}>{busy?'Preparando livreto…':'Gerar livreto'}</button>}
  {!ready&&<p className="text-xs text-[var(--dim)]">Livreto A5 para dobrar e grampear: duas páginas por face de uma folha A4. Reutiliza a capa e o conteúdo do PDF pronto.</p>}
  {error&&<p role="alert">{error}</p>}
 </div>;
}
