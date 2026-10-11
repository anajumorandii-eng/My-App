const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const buildSha256=require('node:crypto').createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../../dist/index.html'))).digest('hex');
const root=process.env.CRIVO_SPATIAL_EXAMPLES||'C:/crivo-audit-evidence-20261010/biologia-24-exemplos';
fs.mkdirSync(root,{recursive:true});
(async()=>{
  const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const context=await browser.newContext({viewport:{width:1440,height:1800},reducedMotion:'reduce'});
  await context.addInitScript(()=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme','dark');localStorage.setItem('crivo_visual_preferencias',JSON.stringify({fundo:'caderno',cor:'automatica',efeitos:'minimo',fundoRevisto:true}));});
  const page=await context.newPage(),records=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const suffix of ['composicao-quimica-celular-carboidratos-e-lipidios','composicao-quimica-celular-proteinas-e-sua-funcao-estrutural','divisao-celular','coracao-e-vasos-sanguineos','citoplasma-estrutura-e-componentes-i','fisiologia-da-excrecao','fisiologia-da-coordenacao-nervosa-i','fisiologia-vegetal-transporte-no-floema']) {
    const id='summary-biologia-'+suffix;
    await page.goto('http://127.0.0.1:3008/visual?summary='+id);
    const frame=page.locator(`[data-chapter-scene="${id}"]`);
    await frame.getByRole('button',{name:'Explorar em foco',exact:true}).click();
    await frame.locator('.vs-chapter-spatial-supplement').getByRole('button',{name:'Explorar modelo 3D',exact:true}).click();
    const lab=frame.locator('.vs-spatial-lab');await lab.locator('svg[data-biology-spatial]').waitFor();
    if(suffix==='composicao-quimica-celular-proteinas-e-sua-funcao-estrutural')await lab.getByRole('button',{name:'Folha beta',exact:true}).click();

    const timeline=lab.getByRole('slider',{name:'Percurso finito do modelo'});if(await timeline.count())await timeline.fill('1');
    await lab.evaluate(el=>el.scrollIntoView({block:'center'}));
    const file=path.join(root,suffix+'.jpg');await lab.screenshot({path:file,type:'jpeg',quality:88});
    records.push({id,viewport:{width:1440,height:1800},theme:'dark',motion:'reduce',parameter:await lab.locator('input[id$="-parameter"]').inputValue(),reading:await lab.getByRole('status',{name:'Leitura do modelo espacial'}).textContent(),screenshot:file});
  }
  await browser.close();fs.writeFileSync(path.join(root,'result.json'),JSON.stringify({build_sha256:buildSha256,records,errors},null,2));if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
