import {chromium, webkit, devices} from '@playwright/test';
import fs from 'node:fs/promises';
const isWebKit = process.env.CRIVO_BROWSER === 'webkit';
const browser = await (isWebKit ? webkit : chromium).launch({ executablePath: process.env.CRIVO_BROWSER_EXECUTABLE || undefined, args: isWebKit ? [] : ['--no-sandbox'], headless: true });
const out=process.env.CRIVO_VISUAL_OUTPUT || 'docs/refinamento-profissional-613-2026-10-11';await fs.mkdir(out,{recursive:true});
const results=[];
try {
const profiles = isWebKit ? [['webkit-ipad',834,1112,'dark',true],['webkit-ipad-landscape',1194,834,'light',true],['webkit-mobile',390,844,'light',true]] : [['desktop',1440,1000,'light',false],['ipad',834,1112,'dark',true],['mobile',390,844,'light',true],['small',360,800,'dark',true]];
for(const [name,width,height,theme,touch] of profiles){
 const page=await browser.newPage({...(isWebKit ? devices['iPad Pro 11'] : {}),viewport:{width,height},hasTouch:touch,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(theme=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},theme);
 await page.goto(`${process.env.CRIVO_URL || 'http://127.0.0.1:3000'}/visual?summary=summary-gramatica-concordancia`,{waitUntil:'domcontentloaded'});
 const lab=page.locator('.vs-spatial-lab');await lab.waitFor({timeout:120000});
 const save = lab.getByRole('button',{name:'Guardar para comparar'});
 if (touch) await save.tap(); else await save.click();
 const frozen=await lab.locator('.vs-spatial-reference-figure svg').innerHTML();
 const parameter=lab.getByRole('slider').first();await parameter.fill('3');
 if(await lab.locator('.vs-spatial-reference-figure svg').innerHTML()!==frozen)throw Error('Referência mudou');
 const before=await lab.getByRole('status',{name:'Leitura do modelo espacial'}).innerText();
 await lab.getByRole('img').focus();await page.keyboard.press('ArrowRight');
 if(await lab.getByRole('status',{name:'Leitura do modelo espacial'}).innerText()!==before)throw Error('Câmera mudou conteúdo');
 await lab.screenshot({style:'.ni-production-mobile, .crivo-mobile-toolbar, .crivo-skip-link { visibility: hidden !important; }',path:`${out}/${name}-${theme}-comparacao.png`});
 await page.locator('.vs-scene-bridge').screenshot({style:'.ni-production-mobile, .crivo-mobile-toolbar, .crivo-skip-link { visibility: hidden !important; }',path:`${out}/${name}-${theme}-integracao.png`});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 if(overflow)throw Error(`${name}: overflow`);
 const read = page.getByRole('button',{name:'Entender esta etapa'});
 if (touch) await read.tap(); else await read.click();
 if(await page.locator('#visual-chapter-reading').evaluate(e=>e!==document.activeElement))throw Error('Foco não chegou à leitura');
 const challenge = page.getByRole('button',{name:'Responder ao desafio'});
 if (touch) await challenge.tap(); else await challenge.click();
 await page.getByRole('heading',{name:'Recuperação sem consulta'}).waitFor();
 if(await page.locator('.vs-spatial-lab').count())throw Error('Consulta presente no teste');
 results.push({name,width,height,theme,touch,overflow,errors});await page.close();
}
}finally{await browser.close();}
await fs.writeFile(`${out}/${isWebKit ? 'webkit-' : ''}browser-results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));

if (results.some(result => result.errors.length)) process.exitCode = 1;
