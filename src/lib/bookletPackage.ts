import { zipSync, unzipSync, strToU8, strFromU8 } from 'fflate';
import { validateBookletMetadata, type BookletMetadata } from './bookletPlan';
const MAX=25*1024*1024;

/** Um único objeto privado publica Capa e Miolo da mesma edição de forma atômica. */
export function encodeBookletPackage(body: Uint8Array, cover: Uint8Array, metadata: BookletMetadata) {
 if(metadata.mode!=='separate')throw new Error('Formato de livreto inválido.');
 const manifest=validateBookletMetadata(metadata);
 if(body.length+cover.length>MAX-4096)throw new Error('O livreto completo excede 25 MB.');
 return zipSync({'miolo.pdf':body,'capa.pdf':cover,'livreto.json':strToU8(JSON.stringify(manifest))},{level:0});
}
export function decodeBookletPackage(bytes: Uint8Array) {
 if(bytes.length>MAX)throw new Error('O livreto completo excede 25 MB.');
 let total=0;const names=new Set<string>();
 const files=unzipSync(bytes,{filter:file=>{
  total+=file.originalSize;
  if(!['miolo.pdf','capa.pdf','livreto.json'].includes(file.name)||names.has(file.name)||total>MAX||file.name==='livreto.json'&&file.originalSize>4096)throw new Error('Pacote de livreto inválido.');
  names.add(file.name);return true;
 }});
 if(names.size!==3||!files['livreto.json']||!files['capa.pdf']||!files['miolo.pdf'])throw new Error('Pacote de livreto incompleto.');
 const metadata=validateBookletMetadata(JSON.parse(strFromU8(files['livreto.json'])));
 if(metadata.mode!=='separate')throw new Error('Formato de livreto inválido.');
 return {body:files['miolo.pdf'],cover:files['capa.pdf'],metadata};
}
