import { authHeaders } from './auth';
import { validateBookletMetadata, type BookletMode, type BookletMetadata } from './bookletPlan';

export type SavedBookletPdf = { blob: Blob; sheets: number; blankPages?: number; coverBlob?: Blob; contentPages?: number; layoutVersion?: 2; legacy?: boolean };
const path=(id:string,mode:BookletMode)=>`/api/study-pdf/saved/${id}/booklet${mode==='separate'?'?mode=separate':''}`;
const readError=()=>new Error('Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.');
export async function loadSavedBookletPdf(documentId:string,signal:AbortSignal,mode:BookletMode='integrated'):Promise<SavedBookletPdf|undefined>{
 const response=await fetch(path(documentId,mode),{headers:await authHeaders(),signal});
 if(response.status===404)return undefined;
 if(!response.ok)throw readError();
 const blob=await response.blob();
 if(mode==='separate'){
  if(!blob.type.startsWith('application/zip'))throw readError();
  const {decodeBookletPackage}=await import('./bookletPackage');
  const pack=decodeBookletPackage(new Uint8Array(await blob.arrayBuffer()));
  return {blob:new Blob([new Uint8Array(pack.body)],{type:'application/pdf'}),coverBlob:new Blob([new Uint8Array(pack.cover)],{type:'application/pdf'}),...pack.metadata};
 }
 const sheets=Number(response.headers.get('X-Booklet-Sheets'));
 if(!blob.type.startsWith('application/pdf')||await blob.slice(0,5).text()!=='%PDF-'||!Number.isInteger(sheets)||sheets<1||sheets>200)throw readError();
 const raw=response.headers.get('X-Booklet-Metadata');
 const metadata=raw?validateBookletMetadata(JSON.parse(raw)):undefined;
 if(metadata&&(metadata.mode!==mode||metadata.sheets!==sheets))throw readError();
 return {blob,sheets,...metadata,legacy:response.headers.get('X-Booklet-Layout')==='1'};
}
export async function saveBookletPdf(documentId:string,blob:Blob,signal:AbortSignal,mode:BookletMode='integrated',coverBlob?:Blob,metadata?:BookletMetadata):Promise<void>{
 let body=blob;
 if(mode==='separate'){
  if(!coverBlob||!metadata)throw new Error('Capa e miolo devem ser salvos juntos.');
  const {encodeBookletPackage}=await import('./bookletPackage');
  const bytes=encodeBookletPackage(new Uint8Array(await blob.arrayBuffer()),new Uint8Array(await coverBlob.arrayBuffer()),metadata);
  body=new Blob([new Uint8Array(bytes)],{type:'application/zip'});
 }
 const response=await fetch(path(documentId,mode),{method:'PUT',headers:{...(await authHeaders()),'Content-Type':mode==='separate'?'application/zip':'application/pdf'},body,signal});
 if(!response.ok)throw new Error('Não foi possível salvar o livreto na sua conta. Tente salvar novamente; o arquivo preparado será reaproveitado.');
}
