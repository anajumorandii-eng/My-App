import { createHash } from 'node:crypto';
import express, { Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import { decodeBookletPackage } from '../../src/lib/bookletPackage';
import { bookletMetadataPrefix, validateBookletMetadata, type BookletMode } from '../../src/lib/bookletPlan';
import type { StudyPdfStorage } from './studyPdfStorage';

const storageId = (id:string,mode:BookletMode) => createHash('sha256').update(`study-booklet:${id}${mode==='separate'?':separate-v2':''}`).digest('hex');
async function inspect(bytes: Uint8Array, cover=false) {
 if(bytes.length>25*1024*1024 || Buffer.from(bytes.subarray(0,5)).toString()!=='%PDF-')throw new Error('Invalid PDF');
 const pdf=await PDFDocument.load(bytes,{updateMetadata:false}),pages=pdf.getPages();
 if(!pages.length||pages.length>400||(cover?pages.length!==1:pages.length%2!==0)||pages.some(page=>Math.abs(page.getWidth()-841.89)>2||Math.abs(page.getHeight()-595.28)>2))throw new Error('Invalid booklet');
 const subject=pdf.getSubject();
 const metadata=subject?.startsWith(bookletMetadataPrefix)?validateBookletMetadata(JSON.parse(subject.slice(bookletMetadataPrefix.length))):undefined;
 if(!cover&&metadata&&metadata.sheets!==pages.length/2)throw new Error('Invalid sheet count');
 return {sheets:pages.length/2,metadata};
}
async function validate(bytes:Buffer,mode:BookletMode){
 if(mode==='integrated'){
  const info=await inspect(bytes);
  if(info.metadata&&info.metadata.mode!==mode)throw new Error('Invalid mode');
  return info;
 }
 const pack=decodeBookletPackage(bytes),info=await inspect(pack.body);await inspect(pack.cover,true);
 if(!info.metadata||JSON.stringify(info.metadata)!==JSON.stringify(pack.metadata))throw new Error('Mismatched booklet files');
 return info;
}
export function createSavedBookletPdfRouter(storage: StudyPdfStorage) {
 const router=Router();
 router.use('/saved/:documentId/booklet',(req,res,next)=>{
  if(!res.locals.userId)return res.status(401).json({error:'Entre na sua conta para recuperar ou salvar o livreto.'});
  if(!/^[a-f0-9]{64}$/.test(req.params.documentId)||req.query.mode!==undefined&&!['integrated','separate'].includes(String(req.query.mode)))return res.status(400).json({error:'Identificação ou formato de livreto inválido.'});
  res.locals.bookletMode=req.query.mode==='separate'?'separate':'integrated';next();
 });
 router.get('/saved/:documentId/booklet',async(req,res)=>{
  const mode=res.locals.bookletMode as BookletMode;
  try{
   const bytes=await storage.read(res.locals.userId as string,storageId(req.params.documentId,mode),mode==='separate'?'zip':'pdf');
   if(!bytes)return res.status(404).json({error:'Livreto ainda não gerado neste formato.'});
   const info=await validate(bytes,mode);
   res.setHeader('X-Booklet-Sheets',String(info.sheets));res.setHeader('X-Booklet-Layout',info.metadata?'2':'1');
   if(info.metadata)res.setHeader('X-Booklet-Metadata',JSON.stringify(info.metadata));
   return res.type(mode==='separate'?'application/zip':'application/pdf').send(bytes);
  }catch{return res.status(503).json({error:'Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.'});}
 });
 router.put('/saved/:documentId/booklet',express.raw({type:['application/pdf','application/zip'],limit:'25mb'}),async(req,res)=>{
  const mode=res.locals.bookletMode as BookletMode;
  if(!Buffer.isBuffer(req.body))return res.status(400).json({error:'Envie os arquivos do livreto no formato correto.'});
  try{await validate(req.body,mode);}catch{return res.status(400).json({error:'O arquivo não é um livreto A4 válido.'});}
  try{
   await storage.write(res.locals.userId as string,storageId(req.params.documentId,mode),req.body,mode==='separate'?'zip':'pdf');
   return res.status(204).end();
  }catch{return res.status(503).json({error:'Não foi possível salvar o livreto. Tente novamente; o arquivo preparado será mantido.'});}
 });
 router.use((error:{type?:string},_req:express.Request,res:express.Response,next:express.NextFunction)=>{
  if(error.type==='entity.too.large')return res.status(413).json({error:'O livreto excede o limite de 25 MB.'});next(error);
 });
 return router;
}
