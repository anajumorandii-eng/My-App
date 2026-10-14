// Confere o banco publicado no build de produção. Cada cenário seleciona uma
// questão real pela resposta de /questions.json; não testa contagens dos filtros.
import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const outputDir=join(tmpdir(),'crivo-pr328-browser');
fs.mkdirSync(outputDir,{recursive:true});
const bank=JSON.parse(fs.readFileSync('public/questions.json','utf8'));
const curated=JSON.parse(fs.readFileSync('scripts/data/recortes-oficiais-revisados.json','utf8'));
const ids=[...new Set([...bank.filter(q=>q.id.startsWith('famerp_2025_v1')||q.id.startsWith('unifesp_2025_v1')||q.id.startsWith('enem_2022_d2_cd5')).map(q=>q.id),...curated.map(row=>row.questionId),'unicamp_2025_q06','unicamp_2025_q36','unicamp_2025_q38','ap_fis_unicamp_018','ap_bio_fuvest_026','anglo_geo_v1_c3_q1'])];
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']});
const report=[];
try {
 for(const viewport of [{width:390,height:844},{width:834,height:1112}]) {
  const context=await browser.newContext({viewport});
  await context.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
  const page=await context.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  let selected;
  await page.route('**/questions.json',route=>route.fulfill({json:[selected]}));
  for(const id of ids) {
   selected=bank.find(q=>q.id===id);
   await page.goto(`${process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4173'}/questoes`,{waitUntil:'domcontentloaded'});
   await page.waitForSelector('.ni-question',{timeout:15000});
   const normalize=text=>text.replace(/\s+/g,' ').trim();
   assert.equal(normalize(await page.locator('.ni-question').innerText()),normalize(selected.prompt),id);
   const images=await page.locator('.ni-question img').evaluateAll(nodes=>Promise.all(nodes.map(async image=>{
    image.loading='eager';await image.decode();return {src:image.getAttribute('src'),width:image.naturalWidth,height:image.naturalHeight,linked:!!image.closest('a')};
   })));
   const expected=selected.figures??(selected.statementComplete?[]:selected.originalPages??[]);
   assert.deepEqual(images.map(i=>i.src),expected.map(i=>i.url),id);
   assert.ok(images.every(i=>i.width>0&&i.height>0&&!i.linked),id);
   assert.equal(await page.locator('.ni-options button').count(),selected.options.length,id);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,id+' overflow');
   const wrong=selected.options.findIndex(option=>option.id!==selected.correctOptionId);
   await page.locator('.ni-options button').nth(wrong).click();
   await page.getByText('Por que a alternativa correta está certa',{exact:true}).waitFor();
   assert.ok((await page.locator('body').innerText()).includes(selected.explanation.split('\n')[0]),id+' feedback');
   if(['famerp_2025_v1_q55','unifesp_2025_v1_q25','ap_fis_unicamp_018'].includes(id))await page.screenshot({path:join(outputDir,`${id}-${viewport.width}.png`),fullPage:true});
   report.push({id,viewport,images:images.length,options:selected.options.length,feedback:true});
  }
  assert.deepEqual(errors,[]);
  await context.close();console.log(`${viewport.width}: ${ids.length} questões conferidas`);
 }
 fs.writeFileSync(join(outputDir,'report.json'),JSON.stringify(report,null,2));
 console.log(`OK: ${report.length} cenários; texto, figuras, alternativas, feedback e largura conferidos.`);
}finally{await browser.close();}
