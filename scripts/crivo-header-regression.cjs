const { chromium } = require('playwright');
const fs = require('node:fs');
const ids = [
 'summary-biologia-arquitetura-corporal-dos-animais-e-o-filo-dos-platelmintos-e-dos-nematodeos',
 'summary-biologia-introducao-aos-cordados-e-os-peixes',
 'summary-biologia-reproducao-humana-e-metodos-contraceptivos',
 'summary-historia-a-mineracao-no-brasil-colonial',
 'summary-lingua-inglesa-text-comprehension-earthquakes',
 'summary-lingua-inglesa-text-comprehension-pollution',
 'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
 'summary-redacao-organizando-as-ideias-brainstorm-e-mind-maps',
 'summary-redacao-tangenciamento-e-fuga-a-fronteira-do-tema',
 'summary-filosofia-o-metodo-socratico-e-a-maieutica',
 'summary-literatura-literatura-lusofona-contemporanea',
 'summary-sociologia-movimentos-sociais-classicos-e-contemporaneos'
];
(async () => {
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const rows=[];fs.mkdirSync('work/cabecalhos',{recursive:true});
 for(const width of [360,834,1440]) for(const theme of ['light','dark']) {
  const context=await browser.newContext({viewport:{width,height:1100},reducedMotion:'reduce'});
  await context.addInitScript(t=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',t);localStorage.setItem('crivo_visual_preferencias',JSON.stringify({fundo:'caderno',cor:'automatica',efeitos:'minimo',fundoRevisto:true}));},theme);
  const page=await context.newPage();let first=true;
  for(const id of ids) {
   const record={id,width,theme,source_commit:process.env.GITHUB_SHA};
   try {
    if(first){await page.goto('http://127.0.0.1:3003/visual?summary='+id);first=false;}
    else await page.evaluate(id=>{history.pushState({},'','/visual?summary='+id);dispatchEvent(new PopStateEvent('popstate'));},id);
    const frame=page.locator('[data-chapter-scene="'+id+'"]');
    await frame.locator('.vs-chapter-scene-body section').first().waitFor({timeout:60000});
    await frame.getByRole('button',{name:'Explorar em foco',exact:true}).click();
    await page.waitForFunction(id=>document.querySelector('[data-chapter-scene="'+id+'"]')?.getAttribute('role')==='dialog',id);
    await page.evaluate(async()=>{await document.fonts.ready;});
    record.metrics=await frame.evaluate(element=>{
     const broken=[],clipped=[];
     for(const node of element.querySelectorAll('.vs-q-callout strong,.vs-q-callout > span,.vs-board-head h2')) {
      const boundary=node.closest('.vs-q-callout')||node.closest('.vs-study-board');
      const box=boundary.getBoundingClientRect();
      const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()) {
       const text=walker.currentNode;
       for(const match of text.textContent.matchAll(/[A-Za-zÀ-ÿ]{3,}/g)) {
        const range=document.createRange();range.setStart(text,match.index);range.setEnd(text,match.index+match[0].length);
        const rects=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);
        const lines=new Set(rects.map(r=>Math.round(r.top)));
        if(lines.size>1)broken.push({word:match[0],selector:node.tagName});
        if(rects.some(r=>r.left<box.left-2||r.right>box.right+2||r.top<box.top-2||r.bottom>box.bottom+2))clipped.push({word:match[0],selector:node.tagName});
       }
      }
     }
     return {broken,clipped,pageOverflow:document.documentElement.scrollWidth>innerWidth};
    });
    record.passed=!record.metrics.broken.length&&!record.metrics.clipped.length&&!record.metrics.pageOverflow;
    await page.screenshot({path:'work/cabecalhos/'+width+'-'+theme+'-'+id+'.jpg',type:'jpeg',quality:80});
    await page.keyboard.press('Escape');
   } catch(error){record.passed=false;record.error=error.message;}
   rows.push(record);console.log('CRIVO_HEADER_ROW '+JSON.stringify(record));
  }
  await context.close();
 }
 await browser.close();
 fs.writeFileSync('work/cabecalhos/resultado.json',JSON.stringify(rows,null,2));
 const failed=rows.filter(r=>!r.passed);
 console.log('CRIVO_HEADER_SUMMARY '+JSON.stringify({source_commit:process.env.GITHUB_SHA,expected:ids.length*6,actual:rows.length,failed:failed.length}));
 if(rows.length!==ids.length*6||failed.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
