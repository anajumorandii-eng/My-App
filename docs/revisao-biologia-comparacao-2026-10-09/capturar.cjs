const {chromium}=require('playwright');
const fs=require('fs');
const chapters=require('../inspecao-visual-613-2026-10-09/inventario-base.json').filter(x=>['Biologia','História','Geografia'].includes(x.subject));
const root=process.env.CRIVO_VISUAL_AUDIT_DIR || 'work/revisao-biologia-comparacao';
const baseURL=process.env.CRIVO_VISUAL_BASE_URL || 'http://localhost:3000';fs.mkdirSync(root+'/captures',{recursive:true});
(async()=>{
const browser=await chromium.launch({...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),args:['--no-sandbox']});
const records=[];
chapters.sort((a,b)=>Number(!['summary-biologia-fisiologia-da-excrecao','summary-biologia-fisiologia-da-digestao','summary-historia-a-era-vargas','summary-geografia-cartografia-digital','summary-geografia-relevo-brasileiro'].includes(a.id))-Number(!['summary-biologia-fisiologia-da-excrecao','summary-biologia-fisiologia-da-digestao','summary-historia-a-era-vargas','summary-geografia-cartografia-digital','summary-geografia-relevo-brasileiro'].includes(b.id))); 
for(const [width,theme] of [[1440,'light'],[390,'dark']]){
let context,page,errors=[],first=true;
async function reset(){first=true;if(context)await context.close();context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});await context.addInitScript(t=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',t);localStorage.setItem('crivo_visual_preferencias',JSON.stringify({fundo:'caderno',cor:'automatica',efeitos:'minimo',fundoRevisto:true}));},theme);page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));}
await reset();
for(const [i,ch] of chapters.entries()){
const record={...ch,width,theme};errors=[];
try{
if(i&&i%40===0)await reset();
if(first){await page.goto(baseURL+'/visual?summary='+ch.id);first=false;}else await page.evaluate(id=>{history.pushState({},'', '/visual?summary='+id);dispatchEvent(new PopStateEvent('popstate'));},ch.id);
const frame=page.locator('[data-chapter-scene="'+ch.id+'"]');
await frame.locator('.vs-chapter-scene-body section').first().waitFor({timeout:60000});
await frame.getByRole('button',{name:'Explorar em foco',exact:true}).click();
await frame.getByRole('button',{name:'Comparar painéis',exact:true}).click();
await page.evaluate(async()=>await document.fonts.ready);
const compare=frame.getByRole('button',{name:'Comparar recortes',exact:true});
if(await compare.count()){await compare.click();record.pair=true;await frame.locator('.hg-figure-group--pair').waitFor();}
record.metrics=await frame.evaluate(el=>{
const boxes=[...el.querySelectorAll('.hg-figure-panel,.bp-board,.bp-detail,.bp-process-figure,.bp-process-detail')].map(x=>{const r=x.getBoundingClientRect();return {class:x.className,x:r.x,y:r.y,width:r.width,height:r.height};});
const ids=[...el.querySelectorAll('[id]')].map(x=>x.id);
return {pageOverflow:document.documentElement.scrollWidth>innerWidth,boxes,duplicateIds:ids.filter((x,i)=>ids.indexOf(x)!==i),missingMaterials:[...el.querySelectorAll('*')].flatMap(x=>{const css=getComputedStyle(x);return [css.fill,css.markerEnd,css.markerStart,css.clipPath];}).filter(x=>x.includes('url(')).filter(x=>{const m=x.match(/#([^"\)]+)/);return m&&!document.getElementById(m[1]);})};});
record.errors=errors;record.passed=!record.metrics.pageOverflow&&!record.metrics.duplicateIds.length&&!record.metrics.missingMaterials.length&&!errors.length;
await page.screenshot({path:root+'/captures/'+ch.id+'-'+width+'.png'});
await page.keyboard.press('Escape');
if(await frame.getAttribute('role')==='dialog')throw new Error('Escape não fechou o foco');
}catch(e){record.error=e.message;record.passed=false;await reset();}
records.push(record);fs.writeFileSync(root+'/audit-result.json',JSON.stringify(records,null,2));
if(i%10===0)console.log(width,i,ch.subject,record.passed);
}
await context.close();
}
await browser.close();console.log('FINAL',records.length,'fail',records.filter(x=>!x.passed).length);if(records.some(x=>!x.passed))process.exitCode=1;
})();
