const { chromium } = require('playwright');
const fs = require('node:fs');
const root = process.env.CRIVO_LABEL_AUDIT_DIR || 'work/continuidade-design-motion-recortes';
const baseUrl = process.env.CRIVO_VISUAL_URL || 'http://127.0.0.1:3003';
const ids = ["fis-termologia-calor", "summary-biologia-poriferos-e-cnidarios", "summary-geografia-gedeconomia-mundial", "summary-geografia-relevo-brasileiro", "summary-geografia-dominios-morfoclimaticos", "summary-historia-a-historia-e-o-brasil", "summary-historia-grandes-navegacoes-e-conquista-colonial", "summary-historia-a-montagem-da-colonizacao", "summary-historia-dinamica-interna-da-colonizacao", "summary-historia-disputas-europeias-no-brasil-colonial", "summary-historia-a-interiorizacao-da-colonizacao", "summary-historia-a-mineracao-no-brasil-colonial", "summary-historia-a-crise-do-antigo-sistema-colonial", "summary-historia-a-independencia-do-brasil", "summary-quimica-reacoes-de-substituicao"];
(async () => {
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const rows=[];fs.mkdirSync(root,{recursive:true});
 for(const width of [360,834,1440]) for(const theme of ['light','dark']) {
  const context=await browser.newContext({viewport:{width,height:1100},reducedMotion:'reduce'});
  await context.addInitScript(t=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',t);localStorage.setItem('crivo_visual_preferencias',JSON.stringify({fundo:'caderno',cor:'automatica',efeitos:'minimo',fundoRevisto:true}));},theme);
  const page=await context.newPage();let first=true;
  for(const id of ids) {
   const record={id,width,theme,source_commit:process.env.GITHUB_SHA};
   try {
    if(first){await page.goto(baseUrl+'/visual?summary='+id);first=false;}
    else await page.evaluate(id=>{history.pushState({},'','/visual?summary='+id);dispatchEvent(new PopStateEvent('popstate'));},id);
    const frame=page.locator('[data-chapter-scene="'+id+'"]');
    await frame.locator('.vs-chapter-scene-body section').first().waitFor({timeout:60000});
    await frame.getByRole('button',{name:'Explorar em foco',exact:true}).click();
    await page.waitForFunction(id=>document.querySelector('[data-chapter-scene="'+id+'"]')?.getAttribute('role')==='dialog',id);
    await page.evaluate(async()=>{await document.fonts.ready;});
    record.metrics=await frame.evaluate(element=>{
     const broken=[],clipped=[];
     for(const node of element.querySelectorAll('.hu-recortes button')) {
      const boundary=node;
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
    await page.screenshot({path:root+'/' + width+'-'+theme+'-'+id+'.jpg',type:'jpeg',quality:80});
    await page.keyboard.press('Escape');
   } catch(error){record.passed=false;record.error=error.message;}
   rows.push(record);console.log('CRIVO_HEADER_ROW '+JSON.stringify(record));
  }
  await context.close();
 }
 await browser.close();
 fs.writeFileSync(root+'/resultado.json',JSON.stringify(rows,null,2));
 const failed=rows.filter(r=>!r.passed);
 console.log('CRIVO_HEADER_SUMMARY '+JSON.stringify({source_commit:process.env.GITHUB_SHA,expected:ids.length*6,actual:rows.length,failed:failed.length}));
 if(rows.length!==ids.length*6||failed.length)process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
