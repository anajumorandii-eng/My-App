const {chromium}=require('playwright');
const fs=require('fs');
const all=require('../inspecao-visual-613-2026-10-09/inventario-base.json');
const chapters=['Biologia','Geografia','História','Matemática','Química','Gramática'].map(subject=>all.filter(x=>x.subject===subject).sort((a,b)=>b.title.length-a.title.length)[0]);
const root=process.env.CRIVO_VISUAL_AUDIT_DIR || 'work/verificar-interacoes-motion';fs.mkdirSync(root,{recursive:true});
const baseURL=process.env.CRIVO_VISUAL_BASE_URL || 'http://localhost:3000';fs.mkdirSync(root,{recursive:true});
(async()=>{const browser=await chromium.launch({...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),args:['--no-sandbox']});const records=[];
for(const width of [360,834,1366])for(const theme of ['light','dark']){
const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'no-preference'});
await context.addInitScript(t=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',t);localStorage.setItem('crivo_visual_preferencias',JSON.stringify({fundo:'caderno',cor:'automatica',efeitos:'minimo',fundoRevisto:true}));},theme);
const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&['script','stylesheet','font','image'].includes(r.request().resourceType()))errors.push(r.status()+' '+r.url());});page.on('requestfailed',r=>{if(['script','stylesheet','font','image'].includes(r.resourceType()))errors.push(r.failure()?.errorText+' '+r.url());});let first=true;
for(const ch of chapters){errors=[];const record={id:ch.id,width,theme};try{
if(first){await page.goto(baseURL+'/visual?summary='+ch.id);first=false;}else await page.evaluate(id=>{history.pushState({},'','/visual?summary='+id);dispatchEvent(new PopStateEvent('popstate'));},ch.id);
const frame=page.locator('[data-chapter-scene="'+ch.id+'"]');await frame.locator('.vs-chapter-scene-body section').first().waitFor({timeout:60000});
await frame.getByRole('button',{name:'Explorar em foco',exact:true}).click();await frame.getByRole('button',{name:'Comparar painéis',exact:true}).click();
const compare=frame.getByRole('button',{name:'Comparar recortes',exact:true});if(await compare.count())await compare.click();
const buttons=frame.locator('.bp-stepper button,.hu-recortes button,.bp-process-tabs button,.tc-choices button').filter({visible:true});
if(await buttons.count()>1){await buttons.nth(1).focus();await page.keyboard.press('Enter');record.choice=await buttons.nth(1).getAttribute('aria-pressed')==='true';}
record.noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
record.touch=await frame.evaluate(el=>[...el.querySelectorAll('button,select,summary,input[type=range]')].filter(x=>x.getClientRects().length).every(x=>x.getBoundingClientRect().height>=40));
const focusables=frame.locator('button,select,input,textarea,summary,[tabindex="0"]').filter({visible:true});
await focusables.last().focus();await page.keyboard.press('Tab');record.forwardTrap=await focusables.first().evaluate(x=>x===document.activeElement);
await page.keyboard.press('Shift+Tab');record.backwardTrap=await focusables.last().evaluate(x=>x===document.activeElement);
if(ch.id==='summary-biologia-fisiologia-da-excrecao')await page.screenshot({path:root+'/kidney-'+width+'-'+theme+'.png'});
await page.keyboard.press('Escape');record.escape=await frame.getAttribute('role')!== 'dialog';record.errors=errors;
record.passed=record.noOverflow&&record.touch&&record.forwardTrap&&record.backwardTrap&&record.escape&&record.choice!==false&&!errors.length;
}catch(e){record.error=e.message;record.passed=false;}
records.push(record);fs.writeFileSync(root+'/quality-result.json',JSON.stringify(records,null,2));}
await context.close();console.log(width,theme,records.length,records.filter(x=>!x.passed).length);}
await browser.close();if(records.some(x=>!x.passed))process.exitCode=1;})();
