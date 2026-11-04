import { PDFDocument } from 'pdf-lib';

const MAX_PAGES=400;
/** Índices base zero; cada par corresponde a uma face da folha, esquerda/direita. */
export function bookletPageOrder(pageCount:number):(number|null)[][] {
 if(!Number.isInteger(pageCount)||pageCount<1||pageCount>MAX_PAGES)throw new Error(`O livreto aceita de 1 a ${MAX_PAGES} páginas.`);
 const padded=Math.ceil(pageCount/4)*4;
 const page=(index:number)=>index<pageCount?index:null;
 const sides:(number|null)[][]=[];
 for(let sheet=0;sheet<padded/4;sheet++){
  sides.push([page(padded-1-sheet*2),page(sheet*2)]);
  sides.push([page(sheet*2+1),page(padded-2-sheet*2)]);
 }
 return sides;
}

/** Impõe o PDF pronto em A4 paisagem; incorpora páginas vetoriais sem regenerar capa ou conteúdo. */
export async function createBookletPdf(bytes:Uint8Array){
 if(bytes.byteLength>25*1024*1024)throw new Error('O PDF excede o limite de 25 MB para gerar o livreto.');
 const source=await PDFDocument.load(bytes);
 const sourcePages=source.getPageCount(),plan=bookletPageOrder(sourcePages);
 const result=await PDFDocument.create();
 result.setTitle(`${source.getTitle()||'CRIVO'} — Livreto`);
 const width=841.8897637795277,height=595.2755905511812,padding=8.5;
 // Páginas sem Contents são espaços reais: contam na dobra, mas não podem ser incorporadas.
 const embedded=[];
 for(const page of source.getPages())embedded.push(page.node.Contents()?await result.embedPage(page):null);
 for(const side of plan){
  const sheet=result.addPage([width,height]);
  for(const [column,index] of side.entries()){
   if(index===null)continue;
   const page=embedded[index];
   if(!page)continue;
   const scale=Math.min((width/2-2*padding)/page.width,(height-2*padding)/page.height);
   const w=page.width*scale,h=page.height*scale;
   sheet.drawPage(page,{x:column*width/2+(width/2-w)/2,y:(height-h)/2,width:w,height:h});
  }
 }
 return {bytes:await result.save(),sourcePages,blankPages:Math.ceil(sourcePages/4)*4-sourcePages,sheets:plan.length/2};
}
