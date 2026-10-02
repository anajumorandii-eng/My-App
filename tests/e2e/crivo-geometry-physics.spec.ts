import { expect, test } from '@playwright/test';

const chapters = [
  { id:'fundamentos', route:'matematica-introducao-a-geometria-plana', control:'planar', values:[25,65,155], initial:65 },
  { id:'angulos-triangulo', route:'matematica-angulos-em-triangulos', control:'planar', values:[25,50,90,115], initial:50 },
  { id:'angulos-circunferencia', route:'matematica-angulos-e-circunferencias', control:'planar', values:[40,100,180,240], initial:100 },
  { id:'semelhanca', route:'matematica-semelhanca-de-triangulos', control:'planar', values:[.5,1.5,2.5], initial:1.5 },
  { id:'triangulo-retangulo', route:'matematica-triangulo-retangulo', control:'area', values:[4,9,21], initial:9 },
  { id:'areas-poligonos', route:'matematica-areas-de-poligonos', control:'area', values:[3,6,10], initial:6 },
  { id:'area-circulo', route:'matematica-area-do-circulo-e-de-suas-partes', control:'area', values:[2,6,9], initial:6 },
  { id:'razoes-areas', route:'matematica-razoes-entre-areas-de-figuras-planas', control:'area', values:[.5,4/3,3], initial:4/3 },
  { id:'areas-compostas', route:'matematica-areas-de-figuras-planas', control:'area', values:[1,3,7], initial:3 },
  { id:'carga-em-b', route:'fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme', control:'magnetism', values:[0,10,60,90], initial:60 },
  { id:'gas-work', route:'fisica-trabalho-da-forca-de-pressao-do-gas', control:'thermo', values:[-4,0,4,8], initial:4 },
];

const configurations = ['light','dark'].flatMap(theme => [360,390,768,1440].map(width => ({theme,width,motion:false})));
configurations.push({theme:'light',width:390,motion:true},{theme:'dark',width:1440,motion:true});
for (const {theme,width,motion} of configurations) {
  test(`geometria e física: ${theme}, ${width}px${motion ? ', movimento padrão' : ''}`, async ({page}) => {
    test.setTimeout(180000);
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:motion ? 'no-preference' : 'reduce'});
    await page.addInitScript(({theme,motion}) => {
      localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);
      localStorage.setItem('crivo_visual_preferencias',JSON.stringify({cor:'automatica',efeitos:motion ? 'completo' : 'minimo',fundo:'caderno',fundoRevisto:true}));
    },{theme,motion});
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',response=>{if(response.status()>=400 && /\.(js|css)(\?|$)/.test(response.url())) errors.push(`${response.status()}: ${response.url()}`);});
    for (const chapter of chapters) {
      await page.goto(`/visual?summary=summary-${chapter.route}`,{waitUntil:'domcontentloaded'});
      const slider=page.locator(`#${chapter.control}-${chapter.id}`);
      await expect(slider).toBeVisible();
      expect(Number(await slider.inputValue())).toBeCloseTo(chapter.initial,6);
      for (const value of chapter.values) {
        await slider.evaluate((element,value)=>{
          Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(element,String(value));
          element.dispatchEvent(new Event('input',{bubbles:true}));element.dispatchEvent(new Event('change',{bubbles:true}));
        },value);
        expect(Number(await slider.inputValue())).toBeCloseTo(value,6);
        const svg=page.locator('.vs-instrument svg[role="img"]');
        const problems=await svg.evaluate((element,{id,value})=>{
          const root=element as SVGSVGElement, issues:string[]=[];
          const check=(ok:boolean,message:string)=>{if(!ok)issues.push(message);};
          const near=(actual:number,wanted:number,message:string)=>check(Number.isFinite(actual)&&Math.abs(actual-wanted)<1e-5,`${message}: ${actual} vs ${wanted}`);
          const node=(selector:string)=>{const result=root.querySelector(selector);if(!result)throw new Error(`Ausente: ${selector}`);return result;};
          const attr=(selector:string,name:string)=>Number(node(selector).getAttribute(name));
          const points=(selector:string)=>node(selector).getAttribute('points')!.split(/\s+/).map(p=>p.split(',').map(Number));
          const distance=(a:number[],b:number[])=>Math.hypot(a[0]-b[0],a[1]-b[1]);
          const angle=(a:number[],b:number[],c:number[])=>Math.acos(Math.max(-1,Math.min(1,((a[0]-b[0])*(c[0]-b[0])+(a[1]-b[1])*(c[1]-b[1]))/(distance(a,b)*distance(c,b)))))*180/Math.PI;
          const area=(p:number[][])=>Math.abs(p.reduce((sum,a,i)=>{const b=p[(i+1)%p.length];return sum+a[0]*b[1]-a[1]*b[0];},0))/2;
          if(id==='fundamentos')near(Math.atan2(attr('[data-geometry="transversal"]','y1')-attr('[data-geometry="transversal"]','y2'),attr('[data-geometry="transversal"]','x2')-attr('[data-geometry="transversal"]','x1'))*180/Math.PI,value,'inclinação α');
          if(id==='angulos-triangulo'){const [a,b,c]=points('[data-geometry="angle-triangle"]');near(angle(b,a,c),value,'A');near(angle(a,b,c),40,'B');near(angle(a,c,b),140-value,'C');}
          if(id==='angulos-circunferencia'){
            const [a,b,c]=points('[data-geometry="inscribed-rays"]');near(angle(a,b,c),value/2,'inscrito');
            const numbers=node('[data-geometry="selected-arc"]').getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
            near(numbers[5],value>180?1:0,'arco maior');
          }
          if(id==='semelhanca'||id==='razoes-areas'){
            const a=points(id==='semelhanca'?'[data-geometry="similarity-source"]':'.vs-area-reference');
            const b=points(id==='semelhanca'?'[data-geometry="similarity-copy"]':'.vs-area-scaled');
            for(let i=0;i<3;i++)near(distance(b[i],b[(i+1)%3])/distance(a[i],a[(i+1)%3]),value,'razão de lados');
            near(area(b)/area(a),value*value,'razão de áreas');
          }
          if(id==='triangulo-retangulo'){
            const [a,b,c]=points('.vs-area-triangle');near(angle(a,c,b),90,'ângulo reto');
            near((a[1]-c[1])/distance(a,b),Math.sqrt(value*(25-value))/25,'altura/hipotenusa');
          }
          if(id==='areas-poligonos'){
            const p=points('.vs-area-polygon');near(p.length,value,'número de lados');
            for(let i=0;i<p.length;i++)near(distance(p[i],p[(i+1)%p.length]),56,'lado fixo');
          }
          if(id==='area-circulo')near(attr('.vs-area-inner-circle','r')/attr('.vs-area-outer-circle','r'),value/10,'raios na mesma escala');
          if(id==='areas-compostas'){
            near(attr('.vs-area-terrain','width')/attr('.vs-area-terrain','height'),20/15,'proporção terreno');
            near(attr('.vs-area-opening','r')/attr('.vs-area-terrain','width'),value/20,'raio/terreno');
          }
          if(id==='carga-em-b'){
            const expected=value===0?'straight':value===90?'circle':'helix';check(node('[data-charge-motion]').getAttribute('data-charge-motion')===expected,'tipo da trajetória');
            const orbit=root.querySelector('[data-orbit]');
            if(value===0){check(!orbit,'órbita ausente em θ0');check(!root.querySelector('[data-vector="force"]'),'força ausente em θ0');}
            else{
              near(Number(orbit!.getAttribute('r')),42*Math.sin(value*Math.PI/180),'raio perpendicular');
              near(attr('[data-vector="force"]','x1'),attr('[data-vector="force"]','x2'),'força radial');
              near(attr('[data-vector="velocity-perpendicular"]','y1'),attr('[data-vector="velocity-perpendicular"]','y2'),'velocidade tangente');
              check(attr('[data-vector="force"]','y2')<attr('[data-vector="force"]','y1'),'força para o centro');
            }
            const parallel=root.querySelector('[data-vector="velocity-parallel"]');
            if(value===90)check(!parallel,'componente paralela nula em θ90');
            else near(Number(parallel!.getAttribute('x2'))-Number(parallel!.getAttribute('x1')),110*Math.cos(value*Math.PI/180),'componente paralela');
          }
          if(id==='gas-work'){
            near(attr('[data-work-area]','width'),16*Math.abs(value),'largura área');
            near(attr('[data-work-area]','x'),Math.min(125,45+16*(5+value)),'posição área');
            near(attr('[data-work-area]','y')+attr('[data-work-area]','height'),230,'área até eixo V');
            near(attr('[data-isobar]','y1'),110,'isóbara');
            check(node('[data-gas-work]').getAttribute('data-work-sign')===(value===0?'zero':value>0?'positive':'negative'),'sinal do trabalho');
          }
          const bounds=root.getBoundingClientRect();
          for(const text of root.querySelectorAll('text')){
            const b=text.getBoundingClientRect();
            check(b.left>=bounds.left-2&&b.right<=bounds.right+2&&b.top>=bounds.top-2&&b.bottom<=bounds.bottom+2,`rótulo cortado: ${text.textContent}`);
            check(parseFloat(getComputedStyle(text).fontSize)*bounds.width/root.viewBox.baseVal.width>=9,`rótulo pequeno: ${text.textContent}`);
          }
          return issues;
        },{id:chapter.id,value});
        expect(problems,`${chapter.id}=${value}`).toEqual([]);
        const scene=page.locator('.vs-instrument');
        const bounds=await scene.boundingBox();expect(bounds!.x).toBeGreaterThanOrEqual(0);expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width+1);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
        if(!motion&&((width===390&&theme==='light')||(width===1440&&theme==='dark'))){
          if(value===chapter.initial||(width===390&&value===chapter.values.at(-1))){
            await scene.evaluate(el=>el.scrollIntoView({block:'center'}));
            await scene.screenshot({path:`docs/visual-integral-2026-10-02/quarto-lote/${chapter.id}-${value===chapter.initial?'inicial':'maximo'}-${width}-${theme}.png`});
          }
        }
      }
      await slider.focus();await page.keyboard.press('Home');expect(Number(await slider.inputValue())).toBeCloseTo(chapter.values[0],6);
      await page.keyboard.press('End');expect(Number(await slider.inputValue())).toBeCloseTo(chapter.values.at(-1)!,6);
    }
    expect(errors).toEqual([]);
  });
}
