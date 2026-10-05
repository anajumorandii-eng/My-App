import {expect,test} from '@playwright/test';
import {readFileSync,writeFileSync} from 'node:fs';
const chapters=JSON.parse(readFileSync(new URL('../../docs/FILA-VISUAL-2026-10-03.json',import.meta.url),'utf8')).chapters.filter((c:{batch:string;resolution?:{delivery:string}})=>c.batch==='LG1'||c.resolution?.delivery==='entrega-e') as {id:string;title:string;artifact:string}[];
const requested=process.env.CRIVO_E_IDS?.split(',');
const targets=requested?chapters.filter(c=>requested.includes(c.id)):chapters;
const captureStyle='.crivo-production-top,.crivo-mobile-toolbar,.crivo-visual-menu-header,.ni-production-mobile,.ni-top{visibility:hidden!important}';
const widths=process.env.CRIVO_E_WIDTHS?.split(',').map(Number)??[390,834,1366];
for(const width of widths)for(const theme of ['light','dark'])for(const reducedMotion of ['reduce','no-preference'] as const){
 test(`entrega E ${width}px ${theme} ${reducedMotion}`,async({page},info)=>{
  test.setTimeout(600000);expect(chapters).toHaveLength(26);expect(targets).toHaveLength(requested?.length??26);
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion});
  await page.addInitScript(({theme})=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},{theme});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/\.(js|css)(\?|$)/.test(r.url()))errors.push(`${r.status()} ${r.url()}`);});
  const results:unknown[]=[];
  try {for(const [index,c] of targets.entries()){
   if(!index)await page.goto(`/visual?summary=${c.id}`,{waitUntil:'domcontentloaded'});
   else await page.evaluate(id=>{history.pushState({},'',`/visual?summary=${id}`);dispatchEvent(new PopStateEvent('popstate'));},c.id);
   await expect(page.locator('.vs-topic-identity strong')).toHaveText(c.title,{timeout:30000});
   await page.evaluate(()=>document.fonts.ready);
   expect.soft(await page.evaluate(()=>Array.from(document.fonts).some(font=>font.status==='loaded'&&font.family==='Kalam')),`${c.id} fonte manuscrita carregada`).toBe(true);
   if(reducedMotion==='no-preference')await page.waitForTimeout(850);
   const board=c.artifact==='variation'?page.locator('.topic-studio'):page.getByRole('region',{name:`Instrumento de gramática: ${c.title}`,exact:true});await expect(board).toBeVisible();
   const measure=async(state:string)=>{
    await page.waitForTimeout(reducedMotion==='reduce'?25:350);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${c.id} ${state} page`).toBeLessThanOrEqual(width+1);
    if(width>=900){
     const layouts=await board.locator('.vs-instrument > .grammar-drawing-wrap').evaluateAll(drawings=>drawings.map(drawing=>{
      const instrument=drawing.parentElement!,box=drawing.getBoundingClientRect(),parent=instrument.getBoundingClientRect();
      return{drawingLeft:box.left,parentLeft:parent.left,parentWidth:parent.width};
     }));
     for(const layout of layouts)expect.soft(layout.drawingLeft,`${c.id} ${state} drawing before controls`).toBeLessThanOrEqual(layout.parentLeft+layout.parentWidth*.25);
    }
    const issues=await board.locator('svg[role="img"]').evaluateAll(roots=>roots.filter(root=>root.getBoundingClientRect().width>0).map(el=>{
     const root=el as SVGSVGElement,v=root.viewBox.baseVal;
     const labels=Array.from(root.querySelectorAll('text')).filter(e=>getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none');
     const bounds=labels.map(e=>{const box=e.getBBox(),m=root.getCTM()!.inverse().multiply(e.getCTM()!);const corners=[[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));const xs=corners.map(p=>p.x),ys=corners.map(p=>p.y);const b={x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};return{text:e.textContent,b};});
     const clipped=bounds.filter(({b})=>b.x<v.x-2||b.y<v.y-2||b.x+b.width>v.x+v.width+2||b.y+b.height>v.y+v.height+2).map(e=>e.text);
     const collisions=labels.flatMap((a,i)=>labels.slice(i+1).filter(b=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.min(x.right,y.right)-Math.max(x.left,y.left)>1&&Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>1;}).map(b=>[a.textContent,b.textContent]));
     const small=labels.flatMap(e=>{const s=e.getScreenCTM()!,size=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(s.a,s.b);return size<10.99?[{text:e.textContent,size}]:[];});
     return{label:root.getAttribute('aria-label'),clipped,collisions,small};
    }));
    const hintCollisions=await board.locator('.physics-drawing-hint').evaluateAll(hints=>hints.flatMap(hint=>Array.from(hint.closest('.vs-viewport-janela')?.querySelectorAll('.vs-force-note')??[]).filter(note=>{const a=hint.getBoundingClientRect(),b=note.getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;}).map(note=>[hint.textContent,note.textContent])));
    expect.soft(hintCollisions,`${c.id} ${state} scroll hint collision`).toEqual([]);
    results.push({id:c.id,state,issues});
    for(const issue of issues){expect.soft(issue.clipped,`${c.id} ${state} cut`).toEqual([]);expect.soft(issue.collisions,`${c.id} ${state} collision`).toEqual([]);expect.soft(issue.small,`${c.id} ${state} font`).toEqual([]);}
   };
   const capture=async(state:string)=>{if(reducedMotion==='reduce'&&((width===390&&theme==='light')||(width===1366))){await board.screenshot({path:info.outputPath(`${c.id}-${state}.png`),style:captureStyle});}};
   await measure('initial');await capture('initial');
   const sliders=board.getByRole('slider');
   for(let i=0;i<await sliders.count();i++){
    const s=sliders.nth(i);if(!await s.isVisible())continue;
    const initial=await s.inputValue(),min=Number(await s.getAttribute('min')??0),max=Number(await s.getAttribute('max')??100);
    await s.focus();await page.keyboard.press('Home');await expect(s).toHaveValue(String(min));await measure(`slider-${i}-min`);
    await page.keyboard.press('End');await expect(s).toHaveValue(String(max));await measure(`slider-${i}-max`);
    for(let value=min;value<=max;value++){await s.fill(String(value));await measure(`slider-${i}-state-${value}`);}
    await s.fill(initial);
   }
   const choices=board.locator('.grammar-options button,.ts-choices button');
   for(let i=0;i<await choices.count();i++){if(!await choices.nth(i).isVisible())continue;await choices.nth(i).click();await measure(`choice-${i}`);}
   const pans=board.locator('.grammar-drawing-window');for(let i=0;i<await pans.count();i++){const pan=pans.nth(i);await pan.evaluate(e=>e.scrollLeft=0);await pan.focus();await page.keyboard.press('ArrowRight');if(width<=390)await expect.poll(()=>pan.evaluate(e=>e.scrollLeft),{message:`${c.id} keyboard-pan`}).toBeGreaterThan(0);await measure('keyboard-pan');}
   const face=board.getByRole('tab',{name:'Relações',exact:true});if(width<900&&await face.count()){await face.focus();await page.keyboard.press('Enter');await expect(face).toHaveAttribute('aria-selected','true');await expect(board.locator('.vs-equation-strip')).toBeVisible();await measure('relations-face');await board.getByRole('tab',{name:'Essencial',exact:true}).click();}
   if(width===390&&theme==='light'&&reducedMotion==='reduce')for(const mode of ['Testar','Reconstruir']){await page.getByRole('tab',{name:mode,exact:true}).click();await expect(page.locator('.vs-topic-identity strong')).toHaveText(c.title,{timeout:30000});await page.getByRole('tab',{name:'Explorar',exact:true}).click();}
   await capture('final');
  }} finally {const path=info.outputPath('verified-states.json');writeFileSync(path,JSON.stringify(results));await info.attach('estados-verificados',{path,contentType:'application/json'});}
  expect(errors).toEqual([]);
  await info.attach('fontes-carregadas',{body:JSON.stringify(await page.evaluate(()=>Array.from(new Set(Array.from(document.fonts).filter(font=>font.status==='loaded').map(font=>font.family))))),contentType:'application/json'});
 });
}
