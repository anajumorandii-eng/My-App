const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const buildSha256=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../../dist/index.html'))).digest('hex');
const chapters=require('../../docs/lote-fisica-24-2026-10-10/capitulos.json').chapters;
const root=process.env.CRIVO_SPATIAL_EVIDENCE||'C:/crivo-audit-evidence-20261010/fisica-24-final';
fs.mkdirSync(root,{recursive:true});
const records=fs.existsSync(path.join(root,'result.json'))?JSON.parse(fs.readFileSync(path.join(root,'result.json'),'utf8')).filter(r=>r.passed&&r.build_sha256===buildSha256):[];
(async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const widths=process.env.CRIVO_SPATIAL_SMOKE?[360]:[360,834,1440];
  for(const width of widths)for(const theme of ['light','dark'])for(const motion of ['reduce','no-preference']) {
    const context=await browser.newContext({viewport:{width,height:1100},reducedMotion:motion,hasTouch:width<900});
    await context.addInitScript(theme=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);localStorage.setItem('crivo_visual_preferencias',JSON.stringify({fundo:'caderno',cor:'automatica',efeitos:'minimo',fundoRevisto:true}));},theme);
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    for(const chapter of chapters) {
      if(records.some(r=>r.id===chapter.id&&r.width===width&&r.theme===theme&&r.motion===motion))continue;
      const r={id:chapter.id,width,theme,motion,build_sha256:buildSha256};errors.length=0;
      try {
        if(page.url()==='about:blank')await page.goto('http://127.0.0.1:3008/visual?summary='+chapter.id);
        else await page.evaluate(id=>{history.pushState(history.state,'','/visual?summary='+id);dispatchEvent(new PopStateEvent('popstate',{state:history.state}));},chapter.id);
        await page.locator('.vs-topic-identity strong').filter({hasText:chapter.title}).first().waitFor({timeout:60000});
        const frame=page.locator(`[data-chapter-scene="${chapter.id}"]`);
        await frame.locator('.vs-chapter-scene-body section').first().waitFor({timeout:60000});
        await frame.getByRole('button',{name:'Explorar em foco',exact:true}).click();
        await frame.locator('.vs-chapter-spatial-supplement').getByRole('button',{name:'Explorar modelo 3D',exact:true}).click();
        const lab=frame.locator('.vs-spatial-lab'),drawing=lab.locator('svg[data-physics-spatial]');
        await drawing.waitFor({timeout:20000});r.kind=await drawing.getAttribute('data-physics-spatial');
        r.heading=await lab.locator('header h3').evaluate(el=>({tag:el.tagName,text:el.textContent,fontSize:getComputedStyle(el).fontSize}));
        assert.equal(r.heading.tag,'H3');assert.equal(r.heading.fontSize,'26px');
        const reading=lab.getByRole('status',{name:'Leitura do modelo espacial'}),before=await reading.textContent();
        const view=()=>drawing.evaluate(s=>({yaw:s.dataset.viewYaw,pitch:s.dataset.viewPitch,html:s.innerHTML}));
        const initial=await view();await drawing.focus();await drawing.press('ArrowRight');await drawing.press('ArrowUp');
        assert.notEqual((await view()).html,initial.html);assert.equal(await reading.textContent(),before);r.cameraPreservesPhysics=true;
        await drawing.press('Home');assert.equal((await view()).html,initial.html);r.keyboard=true;
        await drawing.scrollIntoViewIfNeeded();const box=await drawing.boundingBox();
        await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.55,{steps:5});await page.mouse.up();
        assert.notEqual((await view()).yaw,initial.yaw);r.mouse=true;await drawing.focus();await drawing.press('Home');
        if(width<900) {
          const b=await drawing.boundingBox(),cdp=await context.newCDPSession(page),x=b.x+b.width*.5,y=b.y+b.height*.5;
          await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+32,y:y+16}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          assert.notEqual((await view()).yaw,initial.yaw);r.touch=true;await cdp.detach();await drawing.focus();await drawing.press('Home');
        }
        const parameter=lab.locator('input[id$="-parameter"]'),timeline=lab.getByRole('slider',{name:'Percurso finito do modelo'});
        const end=async()=>{if(await timeline.count())await timeline.fill('1');};
        await parameter.focus();await parameter.press('Home');await end();const min=await reading.textContent();
        await parameter.focus();await parameter.press('End');await end();assert.notEqual(await reading.textContent(),min);r.parameter=true;
        r.conditions=[];
        for(const button of await lab.locator('[aria-pressed]').all()) {
          await button.click();await end();assert.equal(await button.getAttribute('aria-pressed'),'true');r.conditions.push({label:await button.textContent(),reading:await reading.textContent()});
        }
        if(await timeline.count()) {
          await timeline.fill('0.37');const middle=await view();await timeline.fill('0');assert.notEqual((await view()).html,middle.html);r.scrubbing=true;
          await lab.getByRole('button',{name:'Reproduzir movimento',exact:true}).click();
          if(motion==='reduce') {assert.equal(await timeline.inputValue(),'1');assert.equal(await lab.getByRole('button',{name:'Pausar movimento',exact:true}).count(),0);r.reduced=true;}
          else {await lab.getByRole('button',{name:'Pausar movimento',exact:true}).click();r.pause=true;}
          await timeline.fill(r.kind==='reflection'?'0.8':r.kind==='gas'?'1':'0.13');
        }
        await drawing.evaluate(svg=>svg.scrollIntoView({block:'center'}));
        r.metrics=await frame.evaluate(el=>({overflow:document.documentElement.scrollWidth>innerWidth,small:[...el.querySelectorAll('button,input[type=range]')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.height&&b.height<43.9;}).map(e=>e.textContent||e.id),loops:el.getAnimations({subtree:true}).filter(a=>a.playState==='running'&&a.effect?.getTiming().iterations===Infinity).length,duplicates:[...el.querySelectorAll('svg [id]')].map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i)}));
        assert.equal(r.metrics.overflow,false);assert.deepEqual(r.metrics.small,[]);assert.equal(r.metrics.loops,0);assert.deepEqual(r.metrics.duplicates,[]);
        r.geometry=await drawing.evaluate(s=>[...s.querySelectorAll('path:not(defs path),circle')].map(e=>e.getBBox()).filter(b=>b.width+b.height>0&&(b.x<0||b.y<0||b.x+b.width>320||b.y+b.height>300)).length);assert.equal(r.geometry,0);
        r.screenshot=path.join(root,`${width}-${theme}-${motion}-${chapter.id}.jpg`);await page.screenshot({path:r.screenshot,type:'jpeg',quality:80});
        r.errors=[...errors];assert.deepEqual(errors,[]);r.passed=true;
      }catch(e){r.passed=false;r.error=e.message.slice(0,1600);r.errors=[...errors];}
      records.push(r);fs.writeFileSync(path.join(root,'result.json'),JSON.stringify(records,null,2));console.log(JSON.stringify({...r,screenshot:undefined}));
    }
    await context.close();
  }
  await browser.close();const summary={expected:chapters.length*widths.length*4,actual:records.length,passed:records.filter(r=>r.passed).length,failures:records.filter(r=>!r.passed)};
  fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));if(summary.failures.length||summary.actual!==summary.expected)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
