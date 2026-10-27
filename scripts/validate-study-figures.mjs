import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {renderStudyPdf} from '../server/http/studyPdf.ts';
import {parseStudyVisual} from '../src/lib/studyVisual.ts';
const output=process.env.CRIVO_FIGURES_OUTPUT||'/tmp/crivo-study-figures';await fs.mkdir(output,{recursive:true});
const input=process.env.CRIVO_FIGURES_INPUT?await fs.readFile(process.env.CRIVO_FIGURES_INPUT,'utf8'):undefined;
const visuals=input?[...input.matchAll(/```study-visual\s*\n([\s\S]*?)```/g)].map(m=>parseStudyVisual(m[1])).filter(Boolean):undefined;
const expectedFigures=visuals?.length??5;const expectedMolecules=visuals?.reduce((total,v)=>total+(v.type==='molecule'?1:v.type==='reaction'?v.molecules.length:0),0)??7;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const [name,width,height] of [['celular',390,844],['tablet',834,1112],['computador',1440,1000]]){
  const page=await browser.newPage({viewport:{width,height}});const base=process.env.CRIVO_AUDIT_URL||'http://127.0.0.1:3138';
  await page.route(base+'/',r=>r.fulfill({contentType:'text/html',body:'<html><body></body></html>'}));await page.goto(base);
  await page.evaluate(async()=>{const {default:r}=await import('/@react-refresh');r.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>t=>t;window.__vite_plugin_react_preamble_installed__=true;await import('/src/index.css');});
  await page.evaluate(async(input)=>{const {mountStudyFigures}=await import('/scripts/studyFiguresFixture.tsx');mountStudyFigures(input);},input);
  await page.waitForSelector('[data-study-visual="reaction"]');
  await page.waitForFunction(()=>!document.querySelector('[data-ai-text-pending]'));

  const report=await page.evaluate(()=>({figures:document.querySelectorAll('[data-study-visual]').length,molecules:document.querySelectorAll('[data-study-molecule]').length,failures:[...document.querySelectorAll('[role="status"]')].map(n=>n.textContent),overflow:document.documentElement.scrollWidth>window.innerWidth,svgFailures:[...document.querySelectorAll('[data-study-molecule] svg')].filter(n=>!n.querySelector('path,line')).length,externalImages:[...document.images].filter(n=>!n.src.startsWith('data:')).length}));
  assert.equal(report.failures.length,0);assert.equal(report.overflow,false);assert.equal(report.svgFailures,0);assert.equal(report.figures,expectedFigures);assert.equal(report.molecules,expectedMolecules);
  await page.screenshot({path:`${output}/${name}.png`,fullPage:true});
  if(name==='celular') await page.locator('[data-study-visual="reaction"]').first().screenshot({path:`${output}/reacao.png`});
  if(name==='computador' && await page.locator('[data-study-visual="line"]').count()) await page.locator('[data-study-visual="line"]').first().screenshot({path:`${output}/grafico.png`});await fs.writeFile(`${output}/${name}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({name,width,...report}));
  if(name==='computador'){
   const html=await page.evaluate(async()=>{const {createStrategyPrintRoot}=await import('/src/lib/printStrategyGuide.ts');const {printStyles}=await import('/src/lib/printStyles.ts');const root=createStrategyPrintRoot(document.querySelector('article'),'Estruturas e gráficos no resumo');for(const image of root.querySelectorAll('img')){const response=await fetch(image.src);const blob=await response.blob();image.src=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.readAsDataURL(blob);});}return `<html lang="pt-BR"><meta charset="utf-8"><style>${printStyles}</style><body>${root.outerHTML}</body></html>`;});
   await fs.writeFile(`${output}/source.html`,html);
   
   await fs.writeFile(`${output}/revisao-figuras.pdf`,await renderStudyPdf(html));
  }
  await page.close();
 }
}finally{await browser.close();}
