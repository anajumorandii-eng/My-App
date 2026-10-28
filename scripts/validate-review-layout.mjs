import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {chromium} from '@playwright/test';
import {renderStudyPdf} from '../server/http/studyPdf.ts';
import {readSectionPages} from '../server/http/studyPdfPagination.ts';
const output=process.env.CRIVO_LAYOUT_OUTPUT||'/tmp/crivo-review-layout/results';await fs.mkdir(output,{recursive:true});
const inputFiles=process.argv.slice(2);assert.ok(inputFiles.length,'Pass source HTML files, never PDF page images.');
const baseline=new URL('../src/lib/printStylesBaseline.audit.ts',import.meta.url);
await fs.writeFile(baseline,execFileSync('git',['show',(process.env.CRIVO_LAYOUT_BASE_REF||'f0c78e4b')+':src/lib/printStyles.ts']),{flag:'wx'});
let browser;
try{
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:794,height:1123}});const base='http://127.0.0.1:3138';await page.route(base+'/',r=>r.fulfill({contentType:'text/html',body:'<body></body>'}));await page.goto(base);
 const styles=await page.evaluate(async()=>{const math=(await import('/src/lib/printPdfFile.ts')).nativeMathPrintStyles;return {before:(await import('/src/lib/printStylesBaseline.audit.ts')).printStyles+'\n'+math,after:(await import('/src/lib/printStyles.ts')).printStyles+'\n'+math};});
 const results=[];
 for(const [index,file] of inputFiles.entries()){
  const source=await fs.readFile(file,'utf8');const reports=[];
  for(const version of ['before','after']){
   const data=await page.evaluate(({source,css,version})=>{
    const doc=new DOMParser().parseFromString(source,'text/html');doc.querySelector('style').textContent=css;
    const root=doc.querySelector('[data-crivo-print-root]');root.toggleAttribute('data-print-review-compact',version==='after');
    const content=doc.querySelector('[data-print-content]');
    if(version==='after') content.before(doc.querySelector('[data-print-toc]'));
    else root.insertBefore(doc.querySelector('[data-print-toc]'),doc.querySelector('[data-print-layout]'));
    const snapshot={text:content.textContent,svg:[...content.querySelectorAll('svg')].map(n=>n.outerHTML),tables:[...content.querySelectorAll('table')].map(n=>n.textContent),headings:[...content.querySelectorAll('h1,h2,h3,h4,summary')].map(n=>n.textContent),toc:[...doc.querySelectorAll('[data-toc-page]')].map(n=>n.dataset.tocPage)};
    return {html:doc.documentElement.outerHTML,snapshot};
   },{source,css:styles[version],version});
   await page.setContent(data.html);await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
   const type=await page.locator('[data-print-content] p').first().evaluate(p=>({size:getComputedStyle(p).fontSize,lineHeight:getComputedStyle(p).lineHeight}));
   const pdf=await renderStudyPdf(data.html);const stem=`${index+1}-${version}`;await fs.writeFile(`${output}/${stem}.pdf`,pdf);await fs.writeFile(`${output}/${stem}.html`,data.html);
   const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');const task=getDocument({data:Uint8Array.from(pdf),useSystemFonts:true,isEvalSupported:false});const document=await task.promise;const toc=await readSectionPages(pdf,data.snapshot.toc);
   const pages=[];const matched=new Set();
   for(let n=1;n<=document.numPages;n++){
    const p=await document.getPage(n);const viewport=p.getViewport({scale:1});assert.ok(Math.abs(viewport.width-595.28)<2&&Math.abs(viewport.height-841.89)<2);
    const items=(await p.getTextContent()).items.filter(i=>'str' in i);const text=items.map(i=>i.str).join(' ');pages.push({number:n,characters:text.length});
    for(const annotation of await p.getAnnotations()) {
     const id=typeof annotation.dest==='string'?annotation.dest:null;
     if(id&&toc[id]&&items.some(item=>item.str.trim()===String(toc[id])&&item.transform[5]>=annotation.rect[1]-3&&item.transform[5]<=annotation.rect[3]+3))matched.add(id);
    }
   }
   assert.ok(data.snapshot.toc.every(id=>matched.has(id)),'Every index entry must show the actual destination page on its own row.');
   const report={version,pages:document.numPages,type,toc,links:matched.size,pageContent:pages};await task.destroy();reports.push({...report,snapshot:data.snapshot});
  }
  assert.deepEqual(reports[0].snapshot,reports[1].snapshot,'Content, formulas and diagrams must remain identical.');assert.equal(reports[0].type.size,reports[1].type.size);assert.ok(reports[1].pages<reports[0].pages,'Layout must reduce pages.');
  const result={case:index+1,before:reports[0].pages,after:reports[1].pages,font:reports[1].type.size,contentIdentical:true,details:reports.map(({snapshot,...r})=>r)};results.push(result);console.log(JSON.stringify(result));
 }
 await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
}finally{await browser?.close();await fs.unlink(baseline);}
