import assert from 'node:assert/strict';
import test from 'node:test';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { bookletPageOrder, createBookletPdf } from './bookletPdf';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
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
 assert.equal(result.sheets,2);assert.equal(result.blankPages,3);assert.equal(result.sourcePages,5);
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
 assert.equal(result.sourcePages,1);assert.equal(result.blankPages,3);assert.equal(result.sheets,1);
 assert.equal((await PDFDocument.load(result.bytes)).getPageCount(),2);
});
