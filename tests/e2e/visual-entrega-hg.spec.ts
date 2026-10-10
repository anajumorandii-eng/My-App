import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

// IDs explícitos da entrega continuam verificáveis depois de sua saída da fila.
const delivered = JSON.parse(readFileSync(new URL('../../docs/FILA-VISUAL-2026-10-03.json', import.meta.url), 'utf8')).chapters
  .filter((c: {subject: string}) => ['História', 'Geografia'].includes(c.subject)) as {id:string; title:string; artifact:string}[];

// Permite repetir um ID com falha; a execução integral deixa esta variável ausente.
const requestedIds=process.env.CRIVO_HG_IDS?.split(',');
const targets=requestedIds ? delivered.filter(c=>requestedIds.includes(c.id)) : delivered;

for (const width of [390,834,1366]) for (const theme of ['light','dark']) for (const reducedMotion of ['reduce','no-preference'] as const) {
  test(`redesenho HG ${width}px ${theme} ${reducedMotion}`, async ({page}, testInfo) => {
    test.setTimeout(900_000);
    expect(delivered).toHaveLength(112);
    expect(targets).toHaveLength(requestedIds?.length ?? 112);
    if(requestedIds) testInfo.annotations.push({type:"escopo dirigido",description:requestedIds.join(", ")});
    await page.setViewportSize({width,height:1000});
    await page.emulateMedia({reducedMotion});
    await page.addInitScript(({theme}) => {
      localStorage.setItem('juju_onboarding','true');
      localStorage.setItem('crivo_theme',theme);
    }, {theme});
    const errors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("console", message => { if(message.type()==="error") consoleErrors.push(message.text()); });
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400 && /\.(js|css)(\?|$)/.test(r.url())) errors.push(`${r.status()}: ${r.url()}`); });
    const results: unknown[] = [];
    for (const chapter of targets) {
      if(targets.indexOf(chapter)%20===0) console.log(`HG ${width} ${theme} ${reducedMotion}: ${targets.indexOf(chapter)+1}/${targets.length}`);
      if(chapter === targets[0]) await page.goto(`/visual?summary=${chapter.id}`, {waitUntil:'domcontentloaded'});
      else await page.evaluate(id => {
        history.pushState(history.state,'',`/visual?summary=${id}`);
        dispatchEvent(new PopStateEvent('popstate',{state:history.state}));
      },chapter.id);
      await expect(page.locator('.vs-topic-identity strong')).toHaveText(chapter.id==='geo-bonus-demografico'?'Estrutura Ativa da População':chapter.title);
      // AnimatePresence termina a saída e entrada de cada capítulo (0,38 s por fase).
      if(reducedMotion==='no-preference') await page.waitForTimeout(850);
      const board = page.locator('[data-testid="visual-study-board"], .tc-scene, .topic-studio').first();
      await expect(board).toBeVisible();
      const svg = board.locator('svg[role="img"], .independence-board__map svg').first();
      await expect(svg).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const handwritten=svg.locator('.ha-hand, .hi-note, .gfi-note, .se-hand, .gi-hand, .brp-hand, .ehi-note').first();
      if(await handwritten.count()) await expect.soft.poll(
        () => handwritten.evaluate(e=>e.isConnected ? getComputedStyle(e).fontFamily : ''),
        {message:`${chapter.id}: fonte das anotações`},
      ).toContain('Kalam');
      const capture = async (state: string) => {
        if(['summary-historia-revolucao-francesa','summary-geografia-dinamica-climatica'].includes(chapter.id) && reducedMotion==='reduce' && ((width===390 && theme==='light') || (width===1366 && theme==='dark'))) {
          await svg.evaluate(el=>el.scrollIntoView({block:'center'}));
          await svg.screenshot({path:testInfo.outputPath(`${chapter.id}-${state}.png`)});
        }
      };
      const geometry = async (state: string) => {
        await page.waitForTimeout(reducedMotion === 'reduce' ? 20 : 450);
        expect(await page.evaluate(() => document.documentElement.scrollWidth), `${chapter.id} ${state} overflow`).toBeLessThanOrEqual(width+1);
        const issues = await svg.evaluate(el => {
          const root = el as SVGSVGElement, v = root.viewBox.baseVal;
          const text = Array.from(root.querySelectorAll('text')).filter(e => {
            const style = getComputedStyle(e); return style.visibility !== 'hidden' && Number(style.opacity) !== 0;
          });
          const inverse = root.getScreenCTM()!.inverse();
          const boxes = text.map(e => {
            const bounds=e.getBoundingClientRect();
            const top=new DOMPoint(bounds.left,bounds.top).matrixTransform(inverse);
            const bottom=new DOMPoint(bounds.right,bounds.bottom).matrixTransform(inverse);
            return {text:e.textContent, box:{x:top.x,y:top.y,width:bottom.x-top.x,height:bottom.y-top.y}};
          });
          const clipped = boxes.filter(({box:b}) => b.x<v.x-2 || b.y<v.y-2 || b.x+b.width>v.x+v.width+2 || b.y+b.height>v.y+v.height+2).map(b => b.text);
          const notes = Array.from(root.querySelectorAll('.vs-plane-note text'));
          const ticks = Array.from(root.querySelectorAll('.vs-plane-axis text'));
          const collisions = notes.flatMap(a => ticks.filter(b => {
            const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();
            return Math.min(x.right,y.right)-Math.max(x.left,y.left)>1 && Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>1;
          }).map(b=>[a.textContent,b.textContent]));
          // SVG text boxes include the font's full ascender/descender even
          // for short glyphs. Compare painted glyph bounds so handwritten
          // lines are checked for actual overlap rather than empty leading.
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
          return {clipped,collisions,allCollisions};
        });
        expect.soft(issues, `${chapter.id} ${state}`).toEqual({clipped:[],collisions:[],allCollisions:[]});
        results.push({id:chapter.id,state,issues});
      };
      await geometry('inicial');
      const pan=board.locator('.hg-figure, .ehi-scroll-window').first();
      if(await pan.count()) {
        await pan.focus(); await page.keyboard.press('ArrowRight');
        if(width===390) await expect.poll(()=>pan.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
        await page.keyboard.press('ArrowLeft');
      }
      const essential = await svg.locator('.ha-label, .ha-small, .ha-hand, .hi-label, .hi-note, .gfi-caption, .gfi-note, .se-small, .se-hand, .gi-label, .gi-small, .brp-text, .brp-small, .ehi-note').evaluateAll(els => els.map(e => {
        const scale=(e as SVGGraphicsElement).getScreenCTM()!;
        return {text:e.textContent, size:parseFloat(getComputedStyle(e).fontSize)*Math.hypot(scale.a,scale.b)};
      }));
      for(const label of essential) expect.soft(label.size, `${chapter.id}: ${label.text}`).toBeGreaterThanOrEqual(11);
      if(chapter.artifact==='eletrizacao-cargas' || chapter.artifact==='imas-campo-terrestre') {
        const contrast=await svg.evaluate(el=>{
          const luminance=(color:string)=>{
            const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;
            ctx.fillStyle=color;ctx.fillRect(0,0,1,1);
            const rgb=Array.from(ctx.getImageData(0,0,1,1).data).slice(0,3).map(v=>{const n=v/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});
            return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
          };
          const body=el.querySelector('.pm-charge-body, [data-physics-system="magnet-field"] rect')!;
          const bg=luminance(getComputedStyle(body).fill);
          const labels=el.querySelectorAll('.pm-label, .pm-electron, [data-physics-system="magnet-field"] > g:first-child text');
          return Array.from(labels).map(label=>{const fg=luminance(getComputedStyle(label).fill);return {text:label.textContent,ratio:(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)};});
        });
        for(const label of contrast) expect(label.ratio,`${chapter.id}: contraste ${label.text}`).toBeGreaterThanOrEqual(4.5);
      }
      if(chapter.artifact==='independencia-brasil'){
        const viewport=board.getByRole('region',{name:'Percorrer a prancha da Independência'});
        await viewport.focus(); await page.keyboard.press('ArrowRight');
        if(width<900) await expect.poll(()=>viewport.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);
        await geometry('pan-teclado');
      }
      // Cada parâmetro por teclado; os demais permanecem no estado atual.
      const sliders = board.getByRole('slider');
      for (let i=0;i<await sliders.count();i++) {
        const slider=sliders.nth(i);
        await slider.focus(); await expect(slider).toBeFocused();
        await slider.press('Home');
        await expect(slider).toHaveValue((await slider.getAttribute('min')) ?? '0');
        await geometry(`controle-${i}-min`);
        await slider.press('End');
        await expect(slider).toHaveValue((await slider.getAttribute('max')) ?? '100');
        await geometry(`controle-${i}-max`);
      }
      if(chapter.artifact==='mineracao-colonial'){ await sliders.first().fill('1'); await geometry('fundicao'); await capture('fundicao'); }
      if(chapter.artifact==='gerador-inducao'){
        for(const phase of [0,90,180,270,360]){
          await board.locator('#generator-phase').fill(String(phase));
          await geometry(`fase-${phase}`); if(phase===90||phase===270) await capture(`fase-${phase}`);
          await expect(board.locator('[data-generator-current]')).toHaveCount(phase%180===0?0:1);
          if(phase%180!==0) await expect(board.locator('[data-generator-current]')).toHaveAttribute('data-generator-current',phase===90?'positive':'negative');
        }
      }
      const mechanisms=board.locator('.hg-controls button, .pm-options button, .vs-history-phase-options button');
      for(let i=0;i<await mechanisms.count();i++) { await mechanisms.nth(i).click(); await geometry(`mecanismo-${i}`); await capture(`mecanismo-${i}`); }
      const selects=board.locator('select');
      for (let i=0;i<await selects.count();i++) {
        const select=selects.nth(i), options=await select.locator('option').evaluateAll(els=>els.map(el=>(el as HTMLOptionElement).value));
        for(const option of options) { await select.selectOption(option); await geometry(`seletor-${i}-${option}`); }
      }
      if (reducedMotion==='reduce' && ((width===390 && theme==='light') || (width===1366 && theme==='dark'))) {
        await svg.evaluate(el=>el.scrollIntoView({block:"center"}));
        await svg.screenshot({path:testInfo.outputPath(`${chapter.id}.png`)});
      }
    }
    expect(errors).toEqual([]);
    await testInfo.attach('console-errors', {body:JSON.stringify(consoleErrors,null,2),contentType:'application/json'});
    await testInfo.attach('estados-verificados', {body:JSON.stringify(results,null,2),contentType:'application/json'});
  });
}
