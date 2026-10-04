import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {ENGLISH_INSTRUMENTS,type EnglishInstrumentId} from '../../src/lib/englishInstrumentLab';
import {READING_INSTRUMENTS,type ReadingInstrumentId} from '../../src/lib/readingInstrumentLab';

const delivered=JSON.parse(readFileSync(new URL('../../docs/visual-integral-2026-10-04/entrega-b/manifest.json',import.meta.url),'utf8')).chapters as {id:string;title:string;subject:string;config:string}[];
const requested=process.env.CRIVO_B_IDS?.split(',');
const targets=requested?delivered.filter(chapter=>requested.includes(chapter.id)):delivered;

for(const width of [390,834,1366]) for(const theme of ['light','dark']) for(const reducedMotion of ['reduce','no-preference'] as const){
  test(`entrega B ${width}px ${theme} ${reducedMotion}`,async({page},testInfo)=>{
    test.setTimeout(600_000);
    expect(delivered).toHaveLength(29);expect(targets).toHaveLength(requested?.length??29);
    await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion});
    await page.addInitScript(({theme})=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},{theme});
    const errors:string[]=[],results:unknown[]=[],modes:unknown[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400&&/\.(js|css)(\?|$)/.test(response.url()))errors.push(`${response.status()} ${response.url()}`);});
    for(const chapter of targets){
      if(chapter===targets[0])await page.goto(`/visual?summary=${chapter.id}`,{waitUntil:'domcontentloaded'});
      else await page.evaluate(id=>{history.pushState(history.state,'',`/visual?summary=${id}`);dispatchEvent(new PopStateEvent('popstate',{state:history.state}));},chapter.id);
      await expect(page.locator('.vs-topic-identity strong')).toHaveText(chapter.title);
      if(reducedMotion==='no-preference')await page.waitForTimeout(850);
      const english=chapter.subject==='Língua Inglesa';
      const figure=page.locator(english?'[data-english-scene]':'.reading-scene');
      await expect(figure).toBeVisible();
      if(english)await expect(figure).toHaveAttribute('data-english-scene',chapter.config);
      const svg=figure.locator('svg[role="img"]');await expect(svg).toBeVisible();
      if(!english&&width===1366)await expect.poll(()=>figure.locator('.reading-diagram-window').evaluate(e=>e.isConnected?e.clientWidth:0),{message:`${chapter.id}: diagrama completo no desktop`}).toBeGreaterThanOrEqual(360);
      await page.evaluate(()=>document.fonts.ready);
      const annotation=figure.locator(english?'figcaption span':'.reading-annotation');
      await expect.soft.poll(()=>annotation.evaluate(el=>el.isConnected?getComputedStyle(el).fontFamily:''),{message:`${chapter.id}: anotação manuscrita`}).toContain('Kalam');
      const board=page.locator('[data-testid="visual-study-board"]');
      const slider=board.getByRole('slider');
      const maximum=Number(await slider.getAttribute('max'));
      const geometry=async(state:string)=>{
        await page.waitForTimeout(reducedMotion==='reduce'?20:450);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${chapter.id} ${state}: largura da página`).toBeLessThanOrEqual(width+1);
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
        results.push({id:chapter.id,state,issues});
      };
      const verify=async(index:number)=>{
        if(english){
          const state=ENGLISH_INSTRUMENTS[chapter.config as EnglishInstrumentId].states[index];
          await expect(figure.locator('blockquote')).toHaveText(state.example);
          await expect(figure.locator('figcaption')).toContainText(state.annotation);
          const marked=await figure.locator('mark').allTextContents();expect(marked).toEqual(expect.arrayContaining(state.evidence));
        }else{
          const state=READING_INSTRUMENTS[chapter.config as ReadingInstrumentId].states[index];
          await expect(figure.locator('.reading-finding')).toHaveText(state.reading);
          const marked=await figure.locator('mark').allTextContents();expect(marked).toEqual(expect.arrayContaining(state.evidence));
        }
      };
      await verify(0);await geometry('inicial');
      for(let index=0;index<=maximum;index++){
        await slider.fill(String(index));await verify(index);await geometry(`recorte-${index}`);
        if(reducedMotion==='reduce'&&width===1366&&theme==='light')await figure.screenshot({path:testInfo.outputPath(`${chapter.id}-recorte-${index}.png`),style: '.vs-topic-bar,.vs-study-toolbar { visibility:hidden !important; }'});
      }
      await slider.focus();await page.keyboard.press('Home');await expect(slider).toHaveValue('0');await verify(0);await geometry('teclado-min');
      await page.keyboard.press('End');await expect(slider).toHaveValue(String(maximum));await verify(maximum);await geometry('teclado-max');
      const pan=figure.locator('.reading-diagram-window');
      if(await pan.count()){
        await pan.focus();await page.keyboard.press('ArrowRight');
        if(width===390)await expect.poll(()=>pan.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
        await page.keyboard.press('ArrowLeft');
      }
      if(width===390&&theme==='light'&&reducedMotion==='reduce'){
        for(const [name,mode] of [['Testar','testar'],['Reconstruir','reconstruir']] as const){
          const tab=page.getByRole('tab',{name,exact:true});await tab.click();await expect(tab).toHaveAttribute('aria-selected','true');
          await expect(page.getByRole('tabpanel')).toBeVisible();
          expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${chapter.id} ${mode}: largura`).toBeLessThanOrEqual(width+1);
          modes.push({id:chapter.id,mode,opened:true});
        }
        await page.getByRole('tab',{name:'Explorar',exact:true}).click();
      }
      console.log(`B ${width} ${theme} ${reducedMotion}: ${chapter.title}`);
    }
    expect(errors).toEqual([]);
    await testInfo.attach('estados-verificados',{body:Buffer.from(JSON.stringify({results,modes})),contentType:'application/json'});
  });
}
