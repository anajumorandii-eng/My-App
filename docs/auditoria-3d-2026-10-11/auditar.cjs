const {chromium}=require('/home/user/My-App/node_modules/playwright');
const fs=require('fs'),csv=fs.readFileSync('/home/user/My-App/docs/lote-ciencias-56-2026-10-11/continuidade-613.csv','utf8').trim().split('\n').slice(1);
const ids=csv.map(l=>l.split(',')).map(c=>({id:c[0],batch:c.slice(-3)[0]})).filter(x=>x.batch!=='a-confrontar');
const OUT=process.argv[2];
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
 const c=await b.newContext({viewport:{width:1440,height:1000}});await c.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
 const p=await c.newPage();let errs=[];p.on('pageerror',e=>errs.push(e.message));
 const res=[];
 for(const {id,batch} of ids){errs=[];const r={id,batch};
  try{
   await p.goto('http://localhost:3000/visual?summary='+id,{waitUntil:'networkidle',timeout:30000});
   await p.waitForTimeout(800);
   r.explorarButtons=await p.locator('button').filter({hasText:/3D/}).allInnerTexts();
   const sv=p.locator('svg[data-view-yaw]').first();
   r.has3d=await sv.count()>0;
   if(r.has3d){
    await sv.scrollIntoViewIfNeeded();
    const lab=sv.locator('xpath=ancestor::section[1]');
    r.title=await lab.locator('h3').first().innerText().catch(()=>'' );
    const before=await sv.innerHTML(),y0=await sv.getAttribute('data-view-yaw');
    await sv.focus().catch(()=>{});await sv.press('ArrowRight').catch(()=>{});
    r.rotates=(await sv.getAttribute('data-view-yaw'))!==y0&&(await sv.innerHTML())!==before;
    const sliders=lab.locator('input[type=range]');const ns=await sliders.count();r.sliders=ns;
    const h1=await sv.innerHTML();let paramChanges=false;
    for(let i=0;i<ns;i++){const s=sliders.nth(i);const id2=await s.getAttribute('id')||'';const lbl=await s.getAttribute('aria-label')||'';if(/yaw|pitch/.test(id2))continue;const max=await s.getAttribute('max');await s.fill(max).catch(()=>{});if((await sv.innerHTML())!==h1){paramChanges=true;break;}}
    r.parameterChangesModel=paramChanges;
    r.motion=await lab.getByRole('button',{name:/Reproduzir|Animar|Iniciar/}).count()>0||await lab.getByRole('slider',{name:/Percurso|Fração|Posição|Etapa/}).count()>0;
    r.choices=await lab.locator('button[aria-pressed]').count();
    const bb=await sv.evaluate(s=>{const vb=s.viewBox.baseVal;let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const el of s.querySelectorAll('path,circle,line,polyline,polygon,rect,ellipse')){const g=el.getBBox();if(!g.width&&!g.height)continue;if(el.tagName==='rect'&&g.width>=vb.width*.95)continue;x0=Math.min(x0,g.x);y0=Math.min(y0,g.y);x1=Math.max(x1,g.x+g.width);y1=Math.max(y1,g.y+g.height);}return {fill:((x1-x0)*(y1-y0))/(vb.width*vb.height),out:x0<vb.x-2||y0<vb.y-2||x1>vb.x+vb.width+2||y1>vb.y+vb.height+2};});
    Object.assign(r,bb);
    await lab.screenshot({path:`${OUT}/${id}.jpg`,type:'jpeg',quality:60});
   }
  }catch(e){r.error=String(e).slice(0,150);}
  r.pageErrors=errs.slice(0,2);res.push(r);process.stdout.write('.');
 }
 fs.writeFileSync(OUT+'/result.json',JSON.stringify(res,null,1));await b.close();
})();
