import assert from 'node:assert/strict';
import test from 'node:test';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '../auth/firebaseAuth';
import { studyPdfStorage } from './studyPdfStorage';

test('usa o bucket configurado do aplicativo e mantém objetos privados separados por conta', async t => {
 const previous=process.env.FIREBASE_STORAGE_BUCKET; delete process.env.FIREBASE_STORAGE_BUCKET;
 t.after(()=>{if(previous===undefined)delete process.env.FIREBASE_STORAGE_BUCKET;else process.env.FIREBASE_STORAGE_BUCKET=previous;});
 const files=new Map<string,Buffer>(); const buckets:string[]=[]; let privateWrite=false;
 t.mock.method(getStorage(getFirebaseAdminApp()),'bucket',((name:string)=>{
   buckets.push(name);
   return {file:(path:string)=>({
     save:async (pdf:Buffer,options:{private:boolean})=>{privateWrite=options.private;files.set(path,pdf);},
     download:async()=>{const pdf=files.get(path);if(!pdf)throw Object.assign(new Error('not found'),{code:404});return [pdf];},
   })};
 }) as any);
 const id='a'.repeat(64), pdf=Buffer.from('%PDF-1.7\nCapa escolhida');
 await studyPdfStorage.write('A',id,pdf);
 assert.deepEqual(await studyPdfStorage.read('A',id),pdf);
 assert.equal(await studyPdfStorage.read('B',id),null);
 assert.equal(privateWrite,true);
 assert.equal(buckets[0],'gen-lang-client-0346381323.firebasestorage.app');
 assert.match([...files.keys()][0],/^study-pdfs\/[a-f0-9]{64}\/[a-f0-9]{64}\.pdf$/);
 process.env.FIREBASE_STORAGE_BUCKET='configured-private-bucket';
 await studyPdfStorage.read('A',id);
 assert.equal(buckets.at(-1),'configured-private-bucket');
});
