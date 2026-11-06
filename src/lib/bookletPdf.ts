import { PDFDocument, pushGraphicsState, rectangle, clip, endPath, popGraphicsState } from 'pdf-lib';
import { appendBookletBackCover } from './bookletBackCover';

const MAX_PAGES=400;
/** Índices base zero; cada par corresponde a uma face da folha, esquerda/direita. */
export function bookletPageOrder(pageCount:number,withBackCover=false):(number|null)[][] {
 if(!Number.isInteger(pageCount)||pageCount<1||pageCount>MAX_PAGES)throw new Error(`O livreto aceita de 1 a ${MAX_PAGES} páginas.`);
 const padded=Math.ceil((pageCount+(withBackCover?1:0))/4)*4;
 const page=(index:number)=>withBackCover&&index===padded-1?pageCount:index<pageCount?index:null;
 const sides:(number|null)[][]=[];
 for(let sheet=0;sheet<padded/4;sheet++){
  sides.push([page(padded-1-sheet*2),page(sheet*2)]);
  sides.push([page(sheet*2+1),page(padded-2-sheet*2)]);
 }
 return sides;
}

/** Impõe o PDF em A4 paisagem e reserva a última página lógica para a contracapa. */
export async function createBookletPdf(bytes:Uint8Array,backIllustration?:Uint8Array){
 if(bytes.byteLength>25*1024*1024)throw new Error('O PDF excede o limite de 25 MB para gerar o livreto.');
 const source=await PDFDocument.load(bytes);
 const sourcePages=source.getPageCount(),plan=bookletPageOrder(sourcePages,true);
 const backCover=await appendBookletBackCover(source,backIllustration);
 const result=await PDFDocument.create();
 result.setTitle(`${source.getTitle()||'CRIVO'} — Livreto`);
 const width=841.8897637795277,height=595.2755905511812,padding=8.5;
 // Páginas sem Contents são espaços reais: contam na dobra, mas não podem ser incorporadas.
 await source.flush();
 const pages=source.getPages();
 const printed=await result.embedPages(pages.filter(page=>page.node.Contents()));
 let cursor=0;
 const embedded=pages.map(page=>page.node.Contents()?printed[cursor++]:null);
 for(const side of plan){
  const sheet=result.addPage([width,height]);
  for(const [column,index] of side.entries()){
   if(index===null)continue;
   const page=embedded[index];
   if(!page)continue;
   const cover=index===0||index===sourcePages;
   // A capa do app pode trazer 1 mm branco no rodapé. A sangria fica dentro do respiro da moldura.
   const fullBleed=cover&&Math.abs(page.width/page.height-(width/2)/height)<.01;
   const scale=fullBleed?Math.max((width/2)/page.width,height/page.height)*1.01:Math.min((width/2-2*padding)/page.width,(height-2*padding)/page.height);
   const w=page.width*scale,h=page.height*scale;
   if(fullBleed)sheet.pushOperators(pushGraphicsState(),rectangle(column*width/2,0,width/2,height),clip(),endPath());
   sheet.drawPage(page,{x:column*width/2+(width/2-w)/2,y:(height-h)/2,width:w,height:h});
   if(fullBleed)sheet.pushOperators(popGraphicsState());
  }
 }
 return {bytes:await result.save(),sourcePages,blankPages:Math.ceil((sourcePages+1)/4)*4-sourcePages-1,sheets:plan.length/2,backCoverHasArtwork:backCover.hasArtwork};
}
