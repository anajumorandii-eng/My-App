import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { PDFDocument } from 'pdf-lib';
import { createStudyPdfRouter } from './studyPdf';

test('guarda o livreto exato separado do PDF comum e o recupera apenas na conta dona',async()=>{
 const files=new Map<string,Buffer>();let failRead=false,failWrite=false,renders=0;
 const storage={read:async(uid:string,id:string)=>{if(failRead)throw new Error('private');return files.get(`${uid}/${id}`)??null;},write:async(uid:string,id:string,bytes:Buffer)=>{if(failWrite)throw new Error('private');files.set(`${uid}/${id}`,bytes);}};
 const app=express();app.use(express.json());app.use((req,res,next)=>{res.locals.userId=req.headers['x-user'];next();});app.use(createStudyPdfRouter(async()=>{renders++;return Buffer.from('%PDF-common');},storage));
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));
 const base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`,id='a'.repeat(64),url=`${base}/saved/${id}/booklet`;
 const pdf=await PDFDocument.create();pdf.addPage([841.89,595.28]);pdf.addPage([841.89,595.28]);const bytes=Buffer.from(await pdf.save());
 const headers={'x-user':'A','Content-Type':'application/pdf'};
 try{
  await storage.write('A',id,Buffer.from('%PDF-common'));
  assert.equal((await fetch(url,{headers})).status,404);
  assert.equal((await fetch(url,{method:'PUT',headers,body:bytes})).status,204);
  const saved=await fetch(url,{headers});assert.equal(saved.status,200);assert.equal(saved.headers.get('x-booklet-sheets'),'1');assert.equal(saved.headers.get('cache-control'),'no-store');assert.deepEqual(Buffer.from(await saved.arrayBuffer()),bytes);
  assert.equal((await fetch(url,{headers:{'x-user':'B'}})).status,404);
  assert.equal((await fetch(url)).status,401);assert.equal((await fetch(url,{method:'PUT',headers:{'Content-Type':'application/pdf'},body:bytes})).status,401);
  assert.equal((await fetch(`${base}/saved/${id}`,{headers})).status,200);assert.equal(files.get(`A/${id}`)!.toString(),'%PDF-common');assert.equal(files.size,2);assert.equal(renders,0);
  failRead=true;assert.equal((await fetch(url,{headers})).status,503);failRead=false;
  pdf.setTitle('Nova edição');const replacement=Buffer.from(await pdf.save());
  failWrite=true;assert.equal((await fetch(url,{method:'PUT',headers,body:replacement})).status,503);
  assert.deepEqual(Buffer.from(await(await fetch(url,{headers})).arrayBuffer()),bytes);
  failWrite=false;assert.equal((await fetch(url,{method:'PUT',headers,body:replacement})).status,204);
  assert.deepEqual(Buffer.from(await(await fetch(url,{headers})).arrayBuffer()),replacement);
  for(const body of [Buffer.from('not-pdf'),Buffer.from('%PDF-malformed')])assert.equal((await fetch(url,{method:'PUT',headers,body})).status,400);
  const portrait=await PDFDocument.create();portrait.addPage();assert.equal((await fetch(url,{method:'PUT',headers,body:Buffer.from(await portrait.save())})).status,400);
  assert.equal((await fetch(`${base}/saved/invalid/booklet`,{headers})).status,400);
  assert.deepEqual(Buffer.from(await(await fetch(url,{headers})).arrayBuffer()),replacement);
 }finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}
});

test('publica o par Capa/Miolo atomicamente e mantém os formatos e contas isolados',async()=>{
 const {createBookletPdf}=await import('../../src/lib/bookletPdf');
 const {encodeBookletPackage,decodeBookletPackage}=await import('../../src/lib/bookletPackage');
 const files=new Map<string,Buffer>();let failWrite=false;
 const storage={read:async(uid:string,id:string)=>files.get(`${uid}/${id}`)??null,write:async(uid:string,id:string,bytes:Buffer)=>{if(failWrite)throw new Error('private');files.set(`${uid}/${id}`,bytes);}};
 const app=express();app.use((req,res,next)=>{res.locals.userId=req.headers['x-user'];next();});app.use(createStudyPdfRouter(async()=>{throw new Error('Render must not run');},storage));
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));
 const root=`http://127.0.0.1:${(server.address() as AddressInfo).port}/saved/${'b'.repeat(64)}/booklet`,url=root+'?mode=separate';
 const source=await PDFDocument.create();for(let i=0;i<6;i++)source.addPage([420.94488,595.27559]);
 const bytes=await source.save(),integrated=await createBookletPdf(bytes),separate=await createBookletPdf(bytes,undefined,undefined,undefined,'separate');
 const pack=Buffer.from(encodeBookletPackage(separate.bytes,separate.coverBytes,separate)),headers={'x-user':'A','Content-Type':'application/zip'};
 try{
  assert.equal((await fetch(url,{method:'PUT',headers,body:pack})).status,204);
  assert.equal((await fetch(root,{headers})).status,404);
  assert.equal((await fetch(root,{method:'PUT',headers:{...headers,'Content-Type':'application/pdf'},body:Buffer.from(integrated.bytes)})).status,204);
  const saved=await fetch(url,{headers});assert.equal(saved.headers.get('content-type'),'application/zip');assert.equal(saved.headers.get('x-booklet-layout'),'2');
  const recovered=decodeBookletPackage(new Uint8Array(await saved.arrayBuffer()));
  assert.deepEqual(recovered.body,separate.bytes);assert.deepEqual(recovered.cover,separate.coverBytes);assert.equal(recovered.metadata.blankPages,3);
  const other=await fetch(root,{headers});assert.equal(JSON.parse(other.headers.get('x-booklet-metadata')!).mode,'integrated');
  assert.deepEqual(new Uint8Array(await other.arrayBuffer()),integrated.bytes);
  assert.equal((await fetch(url,{headers:{'x-user':'B'}})).status,404);assert.equal((await fetch(url)).status,401);
  assert.equal((await fetch(url+'&bad=x',{method:'PUT',headers,body:Buffer.from('not-zip')})).status,400);
  failWrite=true;assert.equal((await fetch(url,{method:'PUT',headers,body:pack})).status,503);failWrite=false;
  assert.deepEqual(Buffer.from(await(await fetch(url,{headers})).arrayBuffer()),pack);
  assert.equal(files.size,2);
 }finally{await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
