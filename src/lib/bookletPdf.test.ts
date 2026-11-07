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
  assert.deepEqual(sides.map(s=>s.match(/PAGE_\d/g)),[['PAGE_1'],['PAGE_2'],['PAGE_3'],['PAGE_4','PAGE_5']]);
 }finally{rmSync(folder,{recursive:true,force:true});}
});

test('preserva páginas originalmente vazias sem deslocar a dobra',async()=>{
 const source=await PDFDocument.create();source.addPage();
 const result=await createBookletPdf(await source.save());
 assert.equal(result.sourcePages,1);assert.equal(result.blankPages,2);assert.equal(result.sheets,1);
 assert.equal((await PDFDocument.load(result.bytes)).getPageCount(),2);
});


test('mantém a contracapa do lado de fora, com os brancos antes dela, para qualquer tamanho',()=>{
 for(let count=1;count<=400;count++){
  const plan=bookletPageOrder(count,true);
  assert.deepEqual(plan[0],[count,0]);
  assert.deepEqual(plan.flat().filter((n):n is number=>n!==null).sort((a,b)=>a-b),Array.from({length:count+1},(_,i)=>i));
  assert.equal(plan.length,Math.ceil((count+1)/4)*2);
 }
 assert.deepEqual(bookletPageOrder(5,true),[[5,0],[1,null],[null,2],[3,4]]);
 assert.deepEqual(bookletPageOrder(4,true),[[4,0],[1,null],[null,2],[3,null]]);
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
  for(const x of [width/2-3,width/2-1,width/2,width/2+1,width/2+3]){
   const pixel=offset+3*(Math.floor(height/2)*width+Math.floor(x));assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[50,105,85],'a arte atravessa a dobra sem faixa nem redimensionamento separado');
  }
  for(const x of [0,width-1])for(const y of [0,height-1]){
   const pixel=offset+3*(y*width+x);assert.deepEqual([...ppm.subarray(pixel,pixel+3)],[246,242,233],`borda ${x},${y}`);
  }
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
