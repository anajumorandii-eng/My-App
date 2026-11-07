import assert from 'node:assert/strict';
import test from 'node:test';
import { zipSync, strToU8 } from 'fflate';
import { encodeBookletPackage, decodeBookletPackage } from './bookletPackage';
import { bookletPrintPlan } from './bookletPlan';
test('capa e miolo são recuperados byte a byte da mesma edição',()=>{
 const metadata=bookletPrintPlan(5,'separate'),body=strToU8('%PDF-miolo'),cover=strToU8('%PDF-capa');
 const result=decodeBookletPackage(encodeBookletPackage(body,cover,metadata));
 assert.deepEqual(result.body,body);assert.deepEqual(result.cover,cover);assert.equal(result.metadata.blankPages,3);assert.equal(result.metadata.coverSheets,1);
});
test('rejeita arquivo desconhecido, pacote incompleto e expansão acima do limite antes da descompressão',()=>{
 const base={'miolo.pdf':strToU8('%PDF-body'),'capa.pdf':strToU8('%PDF-cover'),'livreto.json':strToU8(JSON.stringify(bookletPrintPlan(1,'separate')))};
 assert.throws(()=>decodeBookletPackage(zipSync({...base,'outro.txt':strToU8('extra')})));
 assert.throws(()=>decodeBookletPackage(zipSync({'miolo.pdf':base['miolo.pdf']})));
 assert.throws(()=>decodeBookletPackage(zipSync({...base,'miolo.pdf':new Uint8Array(26*1024*1024)},{level:9})));
 assert.throws(()=>decodeBookletPackage(zipSync({...base,'livreto.json':strToU8('{bad}')})));
});
