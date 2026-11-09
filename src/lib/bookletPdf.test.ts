import { bookletPrintPlan } from './bookletPlan';
import assert from 'node:assert/strict';
import test from 'node:test';
import { PDFDocument, StandardFonts, PDFRawStream, PDFName } from 'pdf-lib';
import { bookletPageOrder, createBookletPdf } from './bookletPdf';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('ordena frente e verso para dobra central, preenchendo somente o fim com brancos',()=>{
 assert.deepEqual(bookletPageOrder(8),[[7,0],[1,6],[5,2],[3,4]]);
 assert.deepEqual(bookletPageOrder(5),[[null,0],[1,null],[null,2],[3,4]]);
 for(let count=1;count<=100;count++){
  const plan=bookletPageOrder(count),printed=plan.flat().filter((n):n is number=>n!==null);
  assert.deepEqual([...printed].sort((a,b)=>a-b),Array.from({length:count},(_,i)=>i));
  assert.equal(plan.length,Math.ceil(count/4)*2);
 }
 assert.throws(()=>bookletPageOrder(0));assert.throws(()=>bookletPageOrder(1.5));
});

test('gera folhas A4 paisagem com texto nativo na ordem de impressão e preserva o original',async()=>{
 const source=await PDFDocument.create();const font=await source.embedFont(StandardFonts.Helvetica);
 for(let i=1;i<=5;i++)source.addPage([595.28,841.89]).drawText(`PAGE_${i}`,{x:80,y:700,font,size:24});
 const original=await source.save();const copy=original.slice();
 const result=await createBookletPdf(original);const output=await PDFDocument.load(result.bytes);
 assert.equal(result.sheets,2);assert.equal(result.blankPages,2);assert.equal(result.sourcePages,5);
 assert.equal(output.getPageCount(),4);assert.deepEqual(original,copy);
 for(const page of output.getPages()){assert.ok(Math.abs(page.getWidth()-841.89)<.1);assert.ok(Math.abs(page.getHeight()-595.28)<.1);}
 const folder=mkdtempSync(join(tmpdir(),'crivo-booklet-'));
 try{
  const path=join(folder,'booklet.pdf');writeFileSync(path,result.bytes);
  const sides=execFileSync('pdftotext',['-layout',path,'-'],{encoding:'utf8'}).split('\f').filter(s=>s.trim());
  assert.deepEqual(sides.map(s=>s.match(/PAGE_\d/g)),[['PAGE_1'],['PAGE_5','PAGE_2'],['PAGE_3','PAGE_4']]);
 }finally{rmSync(folder,{recursive:true,force:true});}
});

test('preserva páginas originalmente vazias sem deslocar a dobra',async()=>{
 const source=await PDFDocument.create();source.addPage();
 const result=await createBookletPdf(await source.save());
 assert.equal(result.sourcePages,1);assert.equal(result.blankPages,2);assert.equal(result.sheets,1);
 assert.equal((await PDFDocument.load(result.bytes)).getPageCount(),2);
});


test('incorpora uma segunda ilustração à contracapa e conserva o texto nativo',async()=>{
 const source=await PDFDocument.create();const font=await source.embedFont(StandardFonts.Helvetica);
 const art=await source.embedPng(readFileSync(new URL('../../public/icon-192.png',import.meta.url)));
 const front=source.addPage([595.28,841.89]);front.drawImage(art,{x:150,y:230,width:280,height:280});front.drawText('CAPA ORIGINAL',{x:80,y:700,font,size:24});
 for(let i=1;i<=3;i++)source.addPage([595.28,841.89]).drawText(`CONTEUDO_${i}`,{x:80,y:700,font,size:24});
 const original=await source.save();const copy=original.slice();
 // A contracapa recebe seus próprios pixels PNG e não busca a imagem da frente.
 const backPng=readFileSync(new URL('../../public/icon-512.png',import.meta.url));
 const result=await createBookletPdf(original,backPng);
 assert.equal(result.backCoverHasArtwork,true);assert.equal(result.blankPages,3);assert.deepEqual(original,copy);
 const images=(document:PDFDocument)=>document.context.enumerateIndirectObjects().filter(([,object])=>object instanceof PDFRawStream&&object.dict.get(PDFName.of('Subtype'))===PDFName.of('Image')).length;
 const rearOnly=await PDFDocument.create();await rearOnly.embedPng(backPng);await rearOnly.flush();
 assert.equal(images(await PDFDocument.load(result.bytes)),images(await PDFDocument.load(original))+images(rearOnly));
 const folder=mkdtempSync(join(tmpdir(),'crivo-booklet-cover-'));
 try{
  const path=join(folder,'booklet.pdf');writeFileSync(path,result.bytes);
  const text=execFileSync('pdftotext',['-layout',path,'-'],{encoding:'utf8'}).split('\f');
  assert.match(text[0],/C\s*R\s*I\s*V\s*O/);assert.match(text[0],/CAPA ORIGINAL/);
  for(let i=1;i<=3;i++)assert.equal(text.join('').match(new RegExp(`CONTEUDO_${i}`,'g'))?.length,1);
 }finally{rmSync(folder,{recursive:true,force:true});}
});

test('a face externa não deixa faixas brancas na borda nem na dobra, mesmo com rodapé branco na capa',async()=>{
 const source=await PDFDocument.create();const front=source.addPage([595.28,841.89]);
 front.drawRectangle({x:0,y:3,width:595.28,height:838.89,color:(await import('pdf-lib')).rgb(246/255,242/255,233/255)});
 const result=await createBookletPdf(await source.save());const folder=mkdtempSync(join(tmpdir(),'crivo-booklet-bleed-'));
 try{
  const path=join(folder,'livreto.pdf'),prefix=join(folder,'face');writeFileSync(path,result.bytes);
  execFileSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','600',path,prefix]);
  const ppm=readFileSync(prefix+'.ppm');const header=/^P6\s+(\d+)\s+(\d+)\s+255\s/.exec(ppm.toString('ascii',0,80))!;
  const width=Number(header[1]),height=Number(header[2]),offset=header[0].length;
  for(const x of [0,Math.floor(width/2)-1,Math.floor(width/2),width-1])for(const y of [0,height-1]){
   const pixel=offset+3*(y*width+x);assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[246,242,233],`borda ${x},${y}`);
  }
 }finally{rmSync(folder,{recursive:true,force:true});}
});

 test('sem segunda arte não duplica a ilustração da frente',async()=>{
 const source=await PDFDocument.create();const front=source.addPage();
 front.drawImage(await source.embedPng(readFileSync(new URL('../../public/icon-192.png',import.meta.url))),{x:100,y:100,width:200,height:200});
 const result=await createBookletPdf(await source.save());
 assert.equal(result.backCoverHasArtwork,false);
 });

const panorama=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAKklEQVR4nGNgGAWjYIABo1Fm6P+BdADTQFo+6oBRB4w6YNQBo2AUDAoAAAS6AgP2cc2iAAAAAElFTkSuQmCC','base64');
const coverFonts=()=>({
 serif:readFileSync(new URL('../assets/print/fonts/cormorant-normal-400.ttf',import.meta.url)),
 display:readFileSync(new URL('../assets/print/fonts/playfair-normal-700.ttf',import.meta.url)),
 italic:readFileSync(new URL('../assets/print/fonts/cormorant-italic-400.ttf',import.meta.url)),
 text:readFileSync(new URL('../assets/print/fonts/LiberationSerif-Regular.ttf',import.meta.url)),
});
test('capas integradas usam uma só imagem na dobra e fontes incorporadas; miolo e PDF comum são preservados',async()=>{
 const source=await PDFDocument.create(),font=await source.embedFont(StandardFonts.Helvetica);
 const first=source.addPage([595.28,841.89]);first.drawText('OLD_COVER',{x:80,y:700,font,size:24});
 first.drawImage(await source.embedPng(readFileSync(new URL('../../public/icon-192.png',import.meta.url))),{x:100,y:100,width:200,height:200});
 for(let i=1;i<=4;i++)source.addPage([595.28,841.89]).drawText(`BODY_${i}`,{x:80,y:700,font,size:24});
 const original=await source.save(),copy=original.slice();
 const result=await createBookletPdf(original,panorama,{subject:'Física',topic:'Termodinâmica',subtopic:'Variação ΔG',board:'ENEM',purpose:'Revisão aprofundada'},coverFonts());
 assert.deepEqual(original,copy);assert.equal(result.sourcePages,5);assert.equal(result.sheets,2);assert.equal(result.backCoverHasArtwork,true);
 const output=await PDFDocument.load(result.bytes);
 const images=output.context.enumerateIndirectObjects().filter(([,object])=>object instanceof PDFRawStream&&object.dict.get(PDFName.of('Subtype'))===PDFName.of('Image'));
 assert.equal(images.length,2,'uma imagem panorâmica e sua máscara alfa; sem incorporar a imagem antiga');
 const folder=mkdtempSync(join(tmpdir(),'crivo-booklet-pair-'));
 try{
  const path=join(folder,'booklet.pdf'),prefix=join(folder,'outside');writeFileSync(path,result.bytes);
  const text=execFileSync('pdftotext',['-layout',path,'-'],{encoding:'utf8'});
  assert.doesNotMatch(text,/OLD_COVER/);assert.match(text,/ΔG/);
  for(let i=1;i<=4;i++)assert.equal(text.match(new RegExp(`BODY_${i}`,'g'))?.length,1);
  const fontList=execFileSync('pdffonts',['-f','1','-l','1',path],{encoding:'utf8'});
  assert.match(fontList,/Cormorant/);assert.match(fontList,/Playfair/);
  assert.ok(fontList.split('\n').filter(line=>/Cormorant|Playfair|LiberationSerif/.test(line)).every(line=>/yes\s+(?:no|yes)\s+yes/.test(line)));
  execFileSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','600',path,prefix]);
  const ppm=readFileSync(prefix+'.ppm'),header=/^P6\s+(\d+)\s+(\d+)\s+255\s/.exec(ppm.toString('ascii',0,80))!;
  const width=Number(header[1]),height=Number(header[2]),offset=header[0].length;
  for(const [x,y] of [[width*.1,height*.1],[width*.9,height*.25],[width*.1,height*.9],[width*.9,height*.9]]){
   const pixel=offset+3*(Math.floor(y)*width+Math.floor(x));
   assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[246,242,233],'arte opaca não cobre as regiões nativas dos títulos e rodapés');
  }
  for(const x of [width*.04,width*.96]){
   const pixel=offset+3*(Math.floor(height*.5)*width+Math.floor(x));
   assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[50,105,85],'a arte ocupa a largura útil até perto das molduras');
  }
  for(const x of [width/2-3,width/2-1,width/2,width/2+1,width/2+3]){
   const pixel=offset+3*(Math.floor(height/2)*width+Math.floor(x));assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[50,105,85],'a arte atravessa a dobra sem faixa nem redimensionamento separado');
  }
  for(const x of [0,width-1])for(const y of [0,height-1]){
   const pixel=offset+3*(y*width+x);assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[246,242,233],`borda ${x},${y}`);
  }
 }finally{rmSync(folder,{recursive:true,force:true});}
});

test('o PDF conserva marcadores nas extremidades da arte que precisa de encaixe',async()=>{
 // Camada transparente: magenta no topo dos objetos e azul na base, fora das reservas originais.
 const marked=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAGQAAAA8CAYAAACQPx/OAAAA2klEQVR4nO3bsQnDQBBFQdXkXlyE+y9ABocHjmyx78R8ePmxEynQcZiZmZnZxTuP89yx6btdtunDAln2eD3PHZu+22WbPiyQZdOHBbJs+rBAlk0fFsiy6cMCWTZ9WCDLpg/7K8j099Dfv6OmDwvkZiDT7/j1/UAiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBiAYkFJBaQWEBifQU5Pr/o7thd3g8kkpnZlnsD14IeshtH7ocAAAAASUVORK5CYII=','base64');
 const source=await PDFDocument.create();source.addPage();
 const result=await createBookletPdf(await source.save(),marked,{subject:'Química',topic:'Polaridade'},coverFonts());
 const folder=mkdtempSync(join(tmpdir(),'crivo-cover-fit-'));
 try{
  const path=join(folder,'livreto.pdf'),prefix=join(folder,'outside');writeFileSync(path,result.bytes);
  execFileSync('pdftoppm',['-f','1','-l','1','-singlefile','-scale-to','600',path,prefix]);
  const ppm=readFileSync(prefix+'.ppm'),header=/^P6\s+(\d+)\s+(\d+)\s+255\s/.exec(ppm.toString('ascii',0,80))!;
  let magenta=0,blue=0;
  for(let i=header[0].length;i<ppm.length;i+=3){
   if(ppm[i]>240&&ppm[i+1]<10&&ppm[i+2]>240)magenta++;
   if(ppm[i]<10&&ppm[i+1]<10&&ppm[i+2]>240)blue++;
  }
  assert.ok(magenta>10,'o topo dos objetos deve continuar visível');
  assert.ok(blue>10,'a base dos objetos deve continuar visível');
 }finally{rmSync(folder,{recursive:true,force:true});}
});

test('recusa arte vertical para a composição integrada, sem publicar duas cenas desconectadas',async()=>{
 const source=await PDFDocument.create();source.addPage();
 await assert.rejects(createBookletPdf(await source.save(),readFileSync(new URL('../../public/icon-192.png',import.meta.url)),{subject:'Geografia',topic:'Climatologia'},coverFonts()),/panorâmica/);
});

test('mantém 11 pt físicos no miolo A5, sem uma segunda redução na imposição',async()=>{
 const source=await PDFDocument.create(),font=await source.embedFont(StandardFonts.Helvetica);
 source.addPage([420.94488,595.27559]).drawText('CAPA',{x:40,y:500,font,size:18});
 source.addPage([420.94488,595.27559]).drawText('LEITURA_11_PT',{x:40,y:500,font,size:11});
 const result=await createBookletPdf(await source.save());
 const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
 const task=getDocument({data:Uint8Array.from(result.bytes),useSystemFonts:true,isEvalSupported:false});
 try{
  const document=await task.promise;let measured=0;
  for(let i=1;i<=document.numPages;i++)for(const item of (await(await document.getPage(i)).getTextContent()).items){
   if('str' in item&&item.str==='LEITURA_11_PT')measured=Math.hypot(item.transform[0],item.transform[1]);
  }
  assert.ok(measured>10.9&&measured<11.1,`fonte física esperada: 11 pt; obtida: ${measured}`);
 }finally{await task.destroy();}
});


/** Simula a leitura das folhas encaixadas: frente direita, verso esquerdo,
 * folhas internas, verso direito e frente esquerda. Não repete a fórmula de imposição. */
function unfold<T>(sides:T[][]){
 const reading:T[]=[];
 for(let i=0;i<sides.length;i+=2)reading.push(sides[i][1],sides[i+1][0]);
 for(let i=sides.length-2;i>=0;i-=2)reading.push(sides[i+1][1],sides[i][0]);
 return reading;
}
test('simulação da dobra conserva a sequência para todas as contagens e separa a folha da capa',()=>{
 for(let count=1;count<=399;count++)for(const mode of ['integrated','separate'] as const){
  const plan=bookletPrintPlan(count,mode),reading=unfold(plan.sides),body=Array.from({length:count},(_,i)=>i),padding=Array<null>((4-count%4)%4).fill(null);
  assert.deepEqual(reading,mode==='separate'?[...body,...padding]:['front',null,...body,...padding,null,'back']);
  assert.equal(plan.sides.length,plan.sheets*2);
  assert.equal(plan.sheets+(mode==='separate'?1:0),Math.ceil(count/4)+1);
  assert.equal(plan.blankPages,padding.length+(mode==='integrated'?2:0));
  assert.deepEqual(reading.filter(item=>typeof item==='number'),body);
  if(mode==='integrated'){assert.deepEqual(plan.sides[0],['back','front']);assert.deepEqual(plan.sides[1],[null,null]);}
 }
 assert.throws(()=>bookletPrintPlan(0,'separate'));assert.throws(()=>bookletPrintPlan(1.5,'integrated'));
});
test('PDFs finais simulam a montagem sem perder, duplicar ou inverter conteúdo e preservam fonte vetorial',async()=>{
 const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
 const cap=await PDFDocument.create(),font=await cap.embedFont(StandardFonts.Helvetica),outside=cap.addPage([841.8897637795277,595.2755905511812]);
 outside.drawText('BACK',{x:40,y:500,font,size:16});outside.drawText('FRONT',{x:460,y:500,font,size:16});const capBytes=await cap.save();
 for(const count of [1,2,3,4,5,7,8,9,15,16,17]){
  const source=await PDFDocument.create(),textFont=await source.embedFont(StandardFonts.Helvetica);
  source.addPage([420.94488,595.27559]).drawText('SOURCE_COVER',{x:30,y:500,font:textFont,size:11});
  for(let i=1;i<=count;i++){const page=source.addPage([420.94488,595.27559]);if(count===5&&i===2)continue;page.drawText(`P${i}_TOP`,{x:35,y:540,font:textFont,size:11});page.drawText(`P${i}_BOTTOM`,{x:35,y:35,font:textFont,size:11});}
  const original=await source.save(),copy=original.slice();
  for(const mode of ['integrated','separate'] as const){
   const result=await createBookletPdf(original,undefined,undefined,undefined,mode,capBytes);
   assert.deepEqual(original,copy);assert.deepEqual(result.coverBytes,capBytes);
   const task=getDocument({data:Uint8Array.from(result.bytes),useSystemFonts:true,isEvalSupported:false});
   try{
    const pdf=await task.promise,sides:(string|number|null)[][]=[];let markers=0;
    for(let p=1;p<=pdf.numPages;p++){
     const page=await pdf.getPage(p),content=await page.getTextContent(),half=page.getViewport({scale:1}).width/2,side:(string|number|null)[]=[null,null];
     for(const item of content.items)if('str'in item){
      assert.doesNotMatch(item.str,/SOURCE_COVER/);
      const column=item.transform[4]>=half?1:0,match=/^P(\d+)_TOP$/.exec(item.str);
      if(match){side[column]=Number(match[1]);markers++;assert.ok(item.transform[5]>500);assert.ok(Math.abs(Math.hypot(item.transform[0],item.transform[1])-11)<.1);}
      if(/_BOTTOM$/.test(item.str))assert.ok(item.transform[5]<50);
      if(item.str==='FRONT'||item.str==='BACK')side[column]=item.str;
     }
     sides.push(side);
    }
    const body=Array.from({length:count},(_,i)=>count===5&&i===1?null:i+1),padding=Array<null>((4-count%4)%4).fill(null);
    assert.equal(markers,count-(count===5?1:0));
    assert.deepEqual(unfold(sides),mode==='separate'?[...body,...padding]:['FRONT',null,...body,...padding,null,'BACK']);
    if(mode==='integrated')assert.deepEqual(sides[1],[null,null]);
   }finally{await task.destroy();}
   if(mode==='separate')assert.equal((await PDFDocument.load(result.coverBytes)).getPageCount(),1);
  }
 }
});
test('mantém páginas originalmente vazias na posição de leitura, além dos brancos de preenchimento',async()=>{
 const source=await PDFDocument.create(),font=await source.embedFont(StandardFonts.Helvetica);source.addPage([420.94488,595.27559]);
 for(let i=1;i<=5;i++){const page=source.addPage([420.94488,595.27559]);if(i!==2)page.drawText(`READ_${i}`,{x:35,y:500,font,size:11});}
 for(const mode of ['separate','integrated'] as const){const result=await createBookletPdf(await source.save(),undefined,undefined,undefined,mode);assert.equal(result.contentPages,5);assert.equal(result.blankPages,mode==='separate'?3:5);}
});
