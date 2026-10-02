import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const chapters=[
  {id:'grupo',route:'o-problema-do-grupo',prefix:'rm',values:[1,3,5]},
  {id:'prob',route:'operacoes-com-probabilidades',prefix:'rm',values:[0,1,2,3]},
  {id:'eventos',route:'eventos-disjuntos-e-eventos-independentes',prefix:'rm',values:[1,2]},
  {id:'trig-poligonos',route:'relacoes-trigonometricas-em-poligonos',prefix:'rm',values:[1,5,8]},
  {id:'trig-outras',route:'outras-razoes-trigonometricas',prefix:'rm',values:[15,45,75]},
  {id:'espaco',route:'o-universo-tridimensional',prefix:'rm',values:[1,2,3]},
  {id:'conicas',route:'introducao-ao-estudo-analitico-das-conicas',prefix:'rm',values:[1,2,3]},
  {id:'bijeção',route:'funcoes-bijetoras',prefix:'rm',values:[2,3,4]},
  {id:'pa',route:'progressao-aritmetica',prefix:'seq',values:[-3,0,2,6]},
  {id:'pg',route:'progressao-geometrica',prefix:'seq',values:[-2,0,2,4]},
];
const analytic=[
  {id:'circunferencia',route:'lugar-geometrico-e-equacao-da-circunferencia',extent:6},
  {id:'ponto-reta',route:'distancia-entre-um-ponto-e-uma-reta',extent:6},
  {id:'complexo',route:'a-geometria-dos-numeros-complexos',extent:5},
];
const configs=['light','dark'].flatMap(theme=>[360,390,768,1440].map(width=>({theme,width,motion:false})));
configs.push({theme:'light',width:390,motion:true},{theme:'dark',width:1440,motion:true});
async function setRange(slider:import('@playwright/test').Locator,value:number){
  await slider.evaluate((element,value)=>{
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(element,String(value));
    element.dispatchEvent(new Event('input',{bubbles:true}));element.dispatchEvent(new Event('change',{bubbles:true}));
  },value);
  expect(Number(await slider.inputValue())).toBeCloseTo(value,6);
}
for(const {theme,width,motion} of configs){
  test(`matemática e acesso: ${theme}, ${width}px${motion?', movimento padrão':''}`,async({page})=>{
    test.setTimeout(240000);
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:motion?'no-preference':'reduce'});
    await page.addInitScript(({theme,motion})=>{
      localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);
      localStorage.setItem('crivo_visual_preferencias',JSON.stringify({cor:'automatica',efeitos:motion?'completo':'minimo',fundo:'caderno',fundoRevisto:true}));
    },{theme,motion});
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400&&/\.(js|css)(\?|$)/.test(r.url()))errors.push(`${r.status()}: ${r.url()}`);});
    const checkBounds=async()=>{
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
      const svg=page.locator('.vs-instrument svg[role="img"]');
      const issues=await svg.evaluate(el=>{
        const root=el as SVGSVGElement,bounds=root.getBoundingClientRect(),issues:string[]=[];
        for(const text of root.querySelectorAll('text')){
          const b=text.getBoundingClientRect();
          if(b.left<bounds.left-2||b.right>bounds.right+2||b.top<bounds.top-2||b.bottom>bounds.bottom+2)issues.push(`rótulo cortado: ${text.textContent}`);
        }
        const notes=Array.from(root.querySelectorAll('.vs-plane-note text'));
        const ticks=Array.from(root.querySelectorAll('.vs-plane-axis text'));
        for(const note of notes)for(const tick of ticks){
          const a=note.getBoundingClientRect(),b=tick.getBoundingClientRect();
          if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)issues.push(`nota sobre graduação: ${note.textContent}/${tick.textContent}`);
        }
        return issues;
      });
      expect(issues).toEqual([]);
    };
    const capture=async(id:string,state:string)=>{
      if(!motion&&((width===390&&theme==='light')||(width===1440&&theme==='dark'))){
        const scene=page.locator('.vs-instrument');await scene.scrollIntoViewIfNeeded();
        await scene.screenshot({path:`docs/visual-integral-2026-10-02/quinto-lote/${id}-${state}-${width}-${theme}.png`});
      }
    };
    for(const chapter of chapters){
      await page.goto(`/visual?summary=summary-matematica-${chapter.route}`,{waitUntil:'domcontentloaded'});
      const slider=page.locator(`#${chapter.prefix}-${chapter.id}`);await expect(slider).toBeVisible();
      await capture(chapter.id,'inicial');
      for(const value of chapter.values){
        await setRange(slider,value);await checkBounds();
        if(chapter.prefix==='rm'){
          const result=await page.locator('.vs-instrument svg').evaluate((el,{id,value})=>{
            const issues:string[]=[],near=(a:number,b:number,name:string)=>{if(!Number.isFinite(a)||Math.abs(a-b)>1e-5)issues.push(name);};
            const node=(s:string)=>{const n=el.querySelector(s);if(!n)throw new Error(`Ausente ${s}`);return n;};
            const n=(e:Element,key:string)=>Number(e.getAttribute(key));
            const points=(s:string)=>node(s).getAttribute('points')!.split(/\s+/).map(p=>p.split(',').map(Number));
            if(id==='grupo')for(const g of el.querySelectorAll('g')){
              const circle=g.querySelector('circle'),text=g.querySelector('text');
              if(circle&&text){near(n(text,'x'),n(circle,'cx'),'número fora da pessoa');near(n(text,'y')-n(circle,'cy'),5,'número fora da pessoa');}
            }
            if(id==='prob'||id==='eventos'){
              const [a,b]=el.querySelectorAll('[data-geometry="event-sets"] circle');
              const d=Math.hypot(n(a,'cx')-n(b,'cx'),n(a,'cy')-n(b,'cy')),ra=n(a,'r'),rb=n(b,'r');
              const zero=id==='prob'?value===0:value===1;
              if(zero&&d<ra+rb)issues.push('interseção zero com sobreposição');
              if(!zero&&d>=ra+rb)issues.push('interseção positiva sem sobreposição');
              if(id==='prob'&&value===3&&d+rb>ra+1e-5)issues.push('B não está contido em A');
              if(id==='prob'){
                const results=Array.from(el.querySelectorAll('[data-outcome]'));
                const membership=results.map(e=>[a,b].map(c=>Math.hypot(n(e,'x')-n(c,'cx'),n(e,'y')-5-n(c,'cy'))<n(c,'r')));
                near(results.length,10,'universo');near(membership.filter(([a])=>a).length,4,'cardinalidade A');
                near(membership.filter(([,b])=>b).length,3,'cardinalidade B');near(membership.filter(([a,b])=>a&&b).length,value,'interseção');
                near(membership.filter(([a,b])=>a||b).length,7-value,'união');
              }
            }
            if(id==='trig-poligonos'){
              const c=node('[data-geometry="circumcircle"]');near(n(c,'r'),12*value,'raio');
              for(const [x,y] of points('[data-geometry="inscribed-triangle"]'))near(Math.hypot(x-n(c,'cx'),y-n(c,'cy')),n(c,'r'),'vértice fora da circunferência');
            }
            if(id==='trig-outras'){
              const [a,b,c]=points('[data-geometry="tangent-triangle"]');near((b[1]-c[1])/(b[0]-a[0]),Math.tan(value*Math.PI/180),'tangente incorreta');
            }
            if(id==='espaco'){
              const paths=Array.from(node('[data-geometry="space-lines"]').children).filter(n=>n.tagName.toLowerCase()==='path');
              const p=paths.map(p=>p.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number));
              const vectors=p.map(([x,y,a,b])=>[a-x,b-y]);
              const cross=vectors[0][0]*vectors[1][1]-vectors[0][1]*vectors[1][0];
              if(value===1)near(cross,0,'retas paralelas');else if(Math.abs(cross)<1e-6)issues.push('retas indevidamente paralelas');
              if(value===3&&!el.querySelector('[data-depth="different-planes"]'))issues.push('profundidade ausente');
              if(value===3){
                const planes=Array.from(el.querySelectorAll('[data-depth="different-planes"] path')).slice(0,2).map(e=>{
                  const ns=e.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);return Array.from({length:ns.length/2},(_,i)=>[ns[i*2],ns[i*2+1]]);
                });
                for(let i=0;i<2;i++)for(const [x,y] of [p[i].slice(0,2),p[i].slice(2,4)]){
                  const signs=planes[i].map(([ax,ay],j)=>{const [bx,by]=planes[i][(j+1)%planes[i].length];return (bx-ax)*(y-ay)-(by-ay)*(x-ax);});
                  if(!signs.every(s=>s>=-1e-5)&&!signs.every(s=>s<=1e-5))issues.push('reta fora do plano');
                }
              }
            }
            if(id==='conicas'){
              const p=node('[data-geometry="cut-plane"]');
              if(value===1&&!(n(p,'y1')<151&&n(p,'y2')>151))issues.push('hipérbole não corta duas folhas');
              if(value===2)near((n(p,'x2')-n(p,'x1'))/(n(p,'y2')-n(p,'y1')),95/118,'parábola não paralela à geratriz');
              if(value===3){near(n(p,'y1'),n(p,'y2'),'elipse plano inclinado');if(n(p,'y1')>=151)issues.push('folha esperada');}
            }
            if(id==='bijeção'){
              const paths=Array.from(el.querySelectorAll('path[data-target]'));
              const ends=paths.map(p=>p.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number).slice(-2).join(','));
              if(new Set(ends).size!==value)issues.push('número de imagens incorreto');
            }
            return issues;
          },{id:chapter.id,value});expect(result,`${chapter.id}=${value}`).toEqual([]);
        }
        if(chapter.id==='pa'||chapter.id==='pg'){
          const result=await page.locator('.vs-instrument svg').evaluate((el,{id,value})=>{
            const nodes=Array.from(el.querySelectorAll('.vs-seq-node'));
            const ys=nodes.map(n=>Number(n.getAttribute('cy')));
            const terms=Array.from({length:5},(_,i)=>id==='pa'?3+i*value:3*value**i);
            const labels=Array.from(el.querySelectorAll('.vs-seq-text')).map(n=>n.textContent);
            const issues:string[]=[];
            for(const y of ys)if(y-15<0||y+15>240)issues.push('nó cortado');
            if(labels.join('|')!==terms.join('|'))issues.push('termos incorretos');
            const j=terms.findIndex(t=>t!==terms[0]);
            if(j>=0){const scale=(ys[0]-ys[j])/(terms[j]-terms[0]);
              if(!(scale>0))issues.push('escala inválida');
              ys.forEach((y,i)=>{if(Math.abs(y-(ys[0]-(terms[i]-terms[0])*scale))>1e-5)issues.push('escala não linear');});}
            return issues;
          },{id:chapter.id,value});expect(result).toEqual([]);
        }
      }
      await slider.focus();await page.keyboard.press('Home');expect(Number(await slider.inputValue())).toBe(chapter.values[0]);
      await page.keyboard.press('End');expect(Number(await slider.inputValue())).toBe(chapter.values.at(-1));
      await capture(chapter.id,'maximo');
    }
    for(const chapter of analytic){
      await page.goto(`/visual?summary=summary-matematica-${chapter.route}`,{waitUntil:'domcontentloaded'});
      const x=page.locator(`#${chapter.id}-x`),y=page.locator(`#${chapter.id}-y`);await expect(x).toBeVisible();
      await checkBounds();await capture(chapter.id,'inicial');
      for(const value of [-chapter.extent,0,chapter.extent]){
        await setRange(x,value);await setRange(y,value);await checkBounds();
      }
      await x.focus();await page.keyboard.press('Home');expect(Number(await x.inputValue())).toBe(-chapter.extent);
      await page.keyboard.press('End');expect(Number(await x.inputValue())).toBe(chapter.extent);
      await capture(chapter.id,'maximo');
    }
    for(const route of ['podcast','treino-2a-fase','tutor','redacao','admin/conteudo']){
      await page.goto(`/${route}`,{waitUntil:'domcontentloaded'});await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('main h1').first()).toBeVisible();
      const results=await new AxeBuilder({page}).include('main').withRules(['button-name','select-name']).analyze();
      expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
      if(!motion&&((width===390&&theme==='light')||(width===1440&&theme==='dark')))
        await page.screenshot({path:`docs/visual-integral-2026-10-02/quinto-lote/${route.replace('/','-')}-${width}-${theme}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

test('arraste analítico e estados dos controles por teclado',async({page})=>{
  test.setTimeout(120000);
  await page.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [theme,width] of [['light',390],['dark',1440]] as const){
    await page.setViewportSize({width,height:900});
    await page.goto('/');await page.evaluate(theme=>localStorage.setItem('crivo_theme',theme),theme);
    for(const chapter of analytic){
      await page.goto(`/visual?summary=summary-matematica-${chapter.route}`,{waitUntil:'domcontentloaded'});
      const svg=page.locator('.vs-instrument svg[role="img"]'),point=svg.locator('.vs-analytic-point circle').last();
      await svg.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
      await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
      const b=await svg.boundingBox(),p=await point.boundingBox();
      expect(b).not.toBeNull();expect(p).not.toBeNull();
      await page.mouse.move(p!.x+p!.width/2,p!.y+p!.height/2);await page.mouse.down();
      const target={x:b!.x+b!.width/2,y:b!.y+b!.height/2};
      await page.mouse.move(target.x,target.y,{steps:8});await page.mouse.up();
      const moved=await point.boundingBox();expect(moved).not.toBeNull();
      expect(Math.abs(moved!.x+moved!.width/2-target.x)).toBeLessThan(2);
      expect(Math.abs(moved!.y+moved!.height/2-target.y)).toBeLessThan(2);
    }
    await page.goto('/treino-2a-fase');const start=page.getByRole('button',{name:'Iniciar cronômetro da questão',exact:true});
    await start.focus();await page.keyboard.press('Enter');await expect(page.getByRole('button',{name:'Pausar cronômetro da questão'})).toBeVisible();
    await page.getByRole('button',{name:'Reiniciar cronômetro da questão'}).click();await expect(start).toBeVisible();
    await page.goto('/tutor');
    await page.getByRole('button',{name:'Corrigir resposta',exact:true}).click();
    await expect(page.getByRole('combobox',{name:'Banca para critério analítico (opcional)'})).toBeVisible();
    await page.getByRole('button',{name:'Criar questão',exact:true}).click();
    await page.getByRole('checkbox',{name:'Questão discursiva (2ª fase)'}).check();
    await expect(page.getByRole('combobox',{name:'Banca da questão discursiva'})).toBeVisible();
    const result=await new AxeBuilder({page}).include('main').withRules(['button-name','select-name']).analyze();expect(result.violations).toEqual([]);
  }
});

test('probabilidades: numerais inteiros dentro das regiões',async({page})=>{
  test.setTimeout(120000);
  await page.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark'])for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    await page.evaluate(theme=>localStorage.setItem('crivo_theme',theme),theme);
    await page.goto('/visual?summary=summary-matematica-operacoes-com-probabilidades');
    const slider=page.locator('#rm-prob');await expect(slider).toBeVisible();
    for(const value of [0,1,2,3]){
      await setRange(slider,value);
      const issues=await page.locator('[data-geometry="event-sets"]').evaluate(el=>{
        const circles=Array.from(el.querySelectorAll('circle')).map(c=>({x:Number(c.getAttribute('cx')),y:Number(c.getAttribute('cy')),r:Number(c.getAttribute('r'))}));
        const issues:string[]=[];
        for(const text of el.querySelectorAll<SVGTextElement>('[data-outcome]')){
          const b=text.getBBox(),samples=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]];
          const x=Number(text.getAttribute('x')),y=Number(text.getAttribute('y'))-5;
          for(const c of circles){
            const inside=Math.hypot(x-c.x,y-c.y)<c.r;
            for(const [px,py] of samples)if((Math.hypot(px-c.x,py-c.y)<c.r)!==inside)issues.push(`numeral ${text.textContent} atravessa círculo`);
          }
        }
        return issues;
      });expect(issues,`${theme}/${width}/interseção${value}`).toEqual([]);
      if((width===390&&theme==='light')||(width===1440&&theme==='dark')){
        if(value===1||value===3){const scene=page.locator('.vs-instrument');await scene.scrollIntoViewIfNeeded();
          await scene.screenshot({path:`docs/visual-integral-2026-10-02/quinto-lote/prob-${value===1?'inicial':'maximo'}-${width}-${theme}.png`});}
      }
    }
  }
});

test('notas analíticas: limites, graduações e nome do ponto',async({page})=>{
  test.setTimeout(180000);
  await page.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark'])for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    await page.evaluate(theme=>localStorage.setItem('crivo_theme',theme),theme);
    for(const chapter of analytic){
      await page.goto(`/visual?summary=summary-matematica-${chapter.route}`);
      const sx=page.locator(`#${chapter.id}-x`),sy=page.locator(`#${chapter.id}-y`);await expect(sx).toBeVisible();
      const verify=async()=>{
        const issues=await page.locator('.vs-instrument svg').evaluate(el=>{
          const issues:string[]=[],bounds=el.getBoundingClientRect();
          const others=Array.from(el.querySelectorAll('.vs-plane-axis text,.vs-analytic-point text'));
          for(const note of el.querySelectorAll('.vs-plane-note text')){
            const a=note.getBoundingClientRect();
            if(a.left<bounds.left-2||a.right>bounds.right+2||a.top<bounds.top-2||a.bottom>bounds.bottom+2)issues.push(`nota cortada: ${note.textContent}`);
            for(const other of others){const b=other.getBoundingClientRect();
              if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)issues.push(`sobreposição: ${note.textContent}/${other.textContent}`);}
          }
          return issues;
        });expect(issues,`${chapter.id}/${theme}/${width}`).toEqual([]);
      };
      await verify();
      const capture=async(state:string)=>{
        if((width===390&&theme==='light')||(width===1440&&theme==='dark')){
          const scene=page.locator('.vs-instrument');await scene.scrollIntoViewIfNeeded();
          await scene.screenshot({path:`docs/visual-integral-2026-10-02/quinto-lote/${chapter.id}-${state}-${width}-${theme}.png`});
        }
      };
      await capture('inicial');
      for(const x of [-chapter.extent,0,chapter.extent])for(const y of [-chapter.extent,0,chapter.extent]){
        await setRange(sx,x);await setRange(sy,y);await verify();
      }
      await capture('maximo');
    }
  }
});
