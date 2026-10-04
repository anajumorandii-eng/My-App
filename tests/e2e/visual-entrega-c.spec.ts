import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {CONTRAST_PLATES} from '../../src/views/topic-scenes/contrast-plates';
import {filosofia} from '../../src/views/topic-scenes/data/filosofia';
import {sociologia} from '../../src/views/topic-scenes/data/sociologia';
const chapters=JSON.parse(readFileSync(new URL('../../docs/visual-integral-2026-10-04/entrega-c/manifest.json',import.meta.url),'utf8')).chapters as {id:string;title:string;subject:string}[];
const requested=process.env.CRIVO_C_IDS?.split(',');
const targets=requested?chapters.filter(c=>requested.includes(c.id)):chapters;
for(const width of [390,834,1366])for(const theme of ['light','dark'])for(const reducedMotion of ['reduce','no-preference'] as const){
 test(`entrega C ${width}px ${theme} ${reducedMotion}`,async({page},testInfo)=>{
  test.setTimeout(600_000);
  expect(chapters).toHaveLength(24);expect(targets).toHaveLength(requested?.length??24);
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion});
  await page.addInitScript(({theme})=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},{theme});
  const errors:string[]=[],results:unknown[]=[],modes:unknown[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const chapter of targets){
   if(chapter===targets[0])await page.goto(`/visual?summary=${chapter.id}`,{waitUntil:'domcontentloaded'});
   else await page.evaluate(id=>{history.pushState(history.state,'',`/visual?summary=${id}`);dispatchEvent(new PopStateEvent('popstate',{state:history.state}));},chapter.id);
   await expect(page.locator('.vs-topic-identity strong')).toHaveText(chapter.title);
   const figure=page.locator(`[data-contrast-plate="${chapter.id}"]`),scene=page.locator('.cp-composition');
   await expect(figure).toBeVisible();
   await page.evaluate(()=>document.fonts.ready);
   const svg=figure.locator('svg[role="img"]'),pan=figure.locator('.cp-drawing-window');
   const plate=CONTRAST_PLATES.find(p=>p.chapterId===chapter.id)!;
   const entry=[...filosofia,...sociologia].find(e=>e.chapterId===chapter.id)!;
   const geometry=async(state:string)=>{
    if(reducedMotion==='no-preference')await page.waitForTimeout(650);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${chapter.id} ${state}: página contida`).toBeLessThanOrEqual(width+1);
const issues=await svg.evaluate(el=>{
          const root=el as SVGSVGElement,v=root.viewBox.baseVal;
          const text=Array.from(root.querySelectorAll('text')).filter(e=>getComputedStyle(e).visibility!=='hidden'&&Number(getComputedStyle(e).opacity)!==0);
          const inverse=root.getScreenCTM()!.inverse();
          const clipped=text.filter(e=>{
            const r=e.getBoundingClientRect(),a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse);
            return a.x<v.x-2||a.y<v.y-2||b.x>v.x+v.width+2||b.y>v.y+v.height+2;
          }).map(e=>e.textContent);
          const collisions:unknown[]=[];
          const ctx=document.createElement('canvas').getContext('2d')!;
          const inkBounds=(e:SVGTextElement)=>{
            const rootFont=getComputedStyle(e).font;
            const glyphs:{value:string;font:string}[]=[];
            const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);
            while(walker.nextNode()) {
              const node=walker.currentNode,font=getComputedStyle(node.parentElement!).font;
              for(const value of (node.textContent??'').replace(/\s+/g,' ')) {
                if(value===' ' && (!glyphs.length || glyphs[glyphs.length-1].value===' ')) continue;
                glyphs.push({value,font});
              }
            }
            while(glyphs.at(-1)?.value===' ') glyphs.pop();
            if(glyphs.length!==e.getNumberOfChars()) return e.getBoundingClientRect();
            const matrix=e.getScreenCTM()!;
            const points:DOMPoint[]=[];
            for(let i=0;i<e.getNumberOfChars();i++){
              ctx.font=glyphs[i]?.font??rootFont;
              const m=ctx.measureText(glyphs[i]?.value??'M'),p=e.getStartPositionOfChar(i);
              if(!m.actualBoundingBoxAscent&&!m.actualBoundingBoxDescent) continue;
              const x=p.x-m.actualBoundingBoxLeft,y=p.y-m.actualBoundingBoxAscent;
              const right=p.x+m.actualBoundingBoxRight,bottom=p.y+m.actualBoundingBoxDescent;
              points.push(new DOMPoint(x,y).matrixTransform(matrix),new DOMPoint(right,y).matrixTransform(matrix),new DOMPoint(x,bottom).matrixTransform(matrix),new DOMPoint(right,bottom).matrixTransform(matrix));
            }
            return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
          };
          const visible = text.filter(e => { let node: Element | null = e; while(node && node !== root){ if(Number(getComputedStyle(node).opacity)<.05) return false; node=node.parentElement; } return true; });
          const painted=visible.map(e=>({text:e.textContent,box:inkBounds(e)}));
          const allCollisions=painted.flatMap((a,i)=>painted.slice(i+1).filter(b=>{
            const x=a.box,y=b.box;
            return Math.min(x.right,y.right)-Math.max(x.left,y.left)>1 && Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>1;
          }).map(b=>[a.text,b.text]));

          const small=text.filter(e=>{const m=e.getScreenCTM()!;return parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.a,m.b)<11;}).map(e=>e.textContent);
          return {clipped,allCollisions,small};
        });

    expect.soft(issues,`${chapter.id} ${state}`).toEqual({clipped:[],allCollisions:[],small:[]});
    expect(await figure.locator('.cp-annotation').evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Kalam');
    expect(await svg.locator('text').first().evaluate(e=>getComputedStyle(e).fontFamily)).toContain('Kalam');
    results.push({id:chapter.id,state,issues});
   };
   await expect(scene.getByRole('status')).toHaveCount(0);await geometry('inicial');
   const capture=(width===1366||(width===390&&theme==='light'))&&reducedMotion==='reduce';
   if(capture)await scene.screenshot({path:testInfo.outputPath(`${chapter.id}-inicial.png`),style:'.vs-topic-bar,.vs-study-toolbar,.crivo-mobile-toolbar,.crivo-production-top,div.fixed:has(button[aria-label="Abrir menu"]){visibility:hidden!important;}'});
   for(let i=0;i<entry.items.length;i++){
    const button=scene.getByRole('button',{name:entry.items[i].label,exact:true});await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(scene.getByRole('status')).toContainText(plate.positions[i].reading);
    for(const mark of plate.positions[i].focus)await expect(figure.locator(`[data-contrast-mark="${mark}"]`)).toHaveAttribute('data-active','true');
    await geometry(`posição-${i}`);
    if(capture&&width===1366&&theme==='light'&&i===entry.items.length-1)await scene.screenshot({path:testInfo.outputPath(`${chapter.id}-foco.png`),style:'.vs-topic-bar,.vs-study-toolbar,.crivo-mobile-toolbar,.crivo-production-top,div.fixed:has(button[aria-label="Abrir menu"]){visibility:hidden!important;}'});
   }
   await scene.getByRole('button',{name:'Ver o trecho do capítulo',exact:true}).click();
   await expect(scene.locator('blockquote')).toContainText(entry.items.at(-1)!.quote);
   await scene.getByRole('button',{name:entry.items.at(-1)!.label,exact:true}).click();
   await expect(scene.getByRole('status')).toHaveCount(0);await geometry('comparação completa');
   const first=scene.getByRole('button',{name:entry.items[0].label,exact:true});await first.focus();await page.keyboard.press('Enter');
   await expect(first).toHaveAttribute('aria-pressed','true');await geometry('teclado');
   await pan.focus();await page.keyboard.press('ArrowRight');
   if(width===390)await expect.poll(()=>pan.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
   await pan.evaluate(e=>e.scrollLeft=e.scrollWidth);
   await expect(svg).toBeVisible();
   if(width===390&&theme==='light'&&reducedMotion==='reduce'){
    for(const name of ['Testar','Reconstruir']){const tab=page.getByRole('tab',{name,exact:true});await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');await expect(page.getByRole('tabpanel')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);modes.push({id:chapter.id,mode:name});}
    await page.getByRole('tab',{name:'Explorar',exact:true}).click();
   }
   console.log(`C ${width} ${theme} ${reducedMotion}: ${chapter.title}`);
  }
  expect(errors).toEqual([]);
  await testInfo.attach('estados-verificados',{body:Buffer.from(JSON.stringify({results,modes})),contentType:'application/json'});
 });
}
