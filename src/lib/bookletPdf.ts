import { bookletPrintPlan, bookletMetadataPrefix, type BookletMode } from './bookletPlan';
import { PDFDocument, type PDFEmbeddedPage, type PDFPage, pushGraphicsState, rectangle, clip, endPath, popGraphicsState } from 'pdf-lib';
import { appendBookletBackCover } from './bookletBackCover';
import { drawBookletCoverSpread, type BookletCoverFonts } from './bookletCoverSpread';
import type { PrintCoverContext } from './printCoverSpec';

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


const width=841.8897637795277,height=595.2755905511812,padding=8.5;
function drawHalf(sheet: PDFPage, page: PDFEmbeddedPage, column: number, cover: boolean) {
   // A capa do app pode trazer 1 mm branco no rodapé. A sangria fica dentro do respiro da moldura.
   const fullBleed=cover&&Math.abs(page.width/page.height-(width/2)/height)<.01;
   const nativeA5=page.width<430&&page.height<610&&Math.abs(page.width/page.height-(width/2)/height)<.01;
   const scale=fullBleed?Math.max((width/2)/page.width,height/page.height)*1.01:nativeA5?Math.min((width/2)/page.width,height/page.height):Math.min((width/2-2*padding)/page.width,(height-2*padding)/page.height);
   const w=page.width*scale,h=page.height*scale;
   if(fullBleed)sheet.pushOperators(pushGraphicsState(),rectangle(column*width/2,0,width/2,height),clip(),endPath());
   sheet.drawPage(page,{x:column*width/2+(width/2-w)/2,y:(height-h)/2,width:w,height:h});
   if(fullBleed)sheet.pushOperators(popGraphicsState());
}

/** Extrai apenas a arte externa; o miolo sempre vem da sequência nativa, antes da imposição. */
export async function extractBookletCover(bytes: Uint8Array) {
 const source=await PDFDocument.load(bytes,{updateMetadata:false}),result=await PDFDocument.create();
 const [page]=await result.copyPages(source,[0]);result.addPage(page);
 return result.save();
}

/** A primeira página da fonte é a reserva de capa; todas as seguintes pertencem ao miolo. */
export async function createBookletPdf(bytes:Uint8Array,backIllustration?:Uint8Array,context?:PrintCoverContext,fonts?:BookletCoverFonts,mode:BookletMode='integrated',existingCover?:Uint8Array){
 if(bytes.byteLength>25*1024*1024)throw new Error('O PDF excede o limite de 25 MB para gerar o livreto.');
 const source=await PDFDocument.load(bytes),sourcePages=source.getPageCount();
 const plan=bookletPrintPlan(sourcePages-1,mode);
 const paired=Boolean(backIllustration&&context);
 if(paired&&!fonts&&!existingCover)throw new Error('Não foi possível carregar as fontes das capas. Tente novamente.');
 const cover=existingCover?await PDFDocument.load(existingCover,{updateMetadata:false}):await PDFDocument.create();
 let backCoverHasArtwork=Boolean(existingCover)||paired;
 if(!existingCover){
  const page=cover.addPage([width,height]);
  if(paired)await drawBookletCoverSpread(page,backIllustration!,context!,fonts!);
  else{
   const rear=await appendBookletBackCover(source,backIllustration);backCoverHasArtwork=rear.hasArtwork;
   await source.flush();
   const [front,back]=await cover.embedPages([source.getPage(0),source.getPage(sourcePages)].filter(p=>Boolean(p.node.Contents())));
   // Uma reserva de capa originalmente vazia continua vazia.
   if(source.getPage(0).node.Contents()){
    if(front)drawHalf(page,front,1,true);if(back)drawHalf(page,back,0,true);
   }else if(front)drawHalf(page,front,0,true);
  }
 }
 if(cover.getPageCount()!==1 || Math.abs(cover.getPage(0).getWidth()-width)>2 || Math.abs(cover.getPage(0).getHeight()-height)>2)throw new Error('A capa deve conter uma única página A4 em paisagem.');
 const result=await PDFDocument.create();result.setTitle(`${source.getTitle()||'CRIVO'} — ${mode==='separate'?'Miolo':'Livreto'}`);
 await source.flush();
 const body=Array.from({length:sourcePages-1},(_,index)=>source.getPage(index+1));
 const included=body.map(page=>Boolean(page.node.Contents()));
 const printed=await result.embedPages(body.filter((_,index)=>included[index]));let cursor=0;
 const embedded=body.map((_,index)=>included[index]?printed[cursor++]:null);
 for(const side of plan.sides){
  if(side[0]==='back'&&side[1]==='front'){
   const [outside]=await result.copyPages(cover,[0]);result.addPage(outside);continue;
  }
  const sheet=result.addPage([width,height]);
  for(const [column,index] of side.entries())if(typeof index==='number'&&embedded[index])drawHalf(sheet,embedded[index]!,column,false);
 }
 const metadata={layoutVersion:plan.layoutVersion,mode,contentPages:plan.contentPages,blankPages:plan.blankPages,sheets:plan.sheets,coverSheets:plan.coverSheets};
 result.setSubject(bookletMetadataPrefix+JSON.stringify(metadata));
 return {bytes:await result.save(),coverBytes:existingCover||await cover.save(),sourcePages,backCoverHasArtwork,...metadata};
}
