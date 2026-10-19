import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
const output=process.env.CRIVO_PRINT_CONTEXT_OUTPUT || '/tmp/crivo-print-contexts';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const cases=[
{ id:'sangue',printSubject:'Biologia',printTopic:'Sangue e imunologia',printSubtopic:'Circulação, defesa e memória imunológica',printBoard:'FUVEST 2027',printPurpose:'Aprofundamento e raciocínio de prova',art:'blood' },
{ id:'quimica',printSubject:'Química',printTopic:'Química orgânica',printSubtopic:'Funções orgânicas, isomeria e reações',printBoard:'FUVEST 2027',printPurpose:'Relacionar estrutura, propriedades e transformações',art:'chemistry' },
{ id:'matematica',printSubject:'Matemática',printTopic:'Geometria plana',printBoard:'FUVEST · UNICAMP',printPurpose:'Relacionar propriedades e demonstrar o raciocínio',art:'mathematics' },
{ id:'geografia',printSubject:'Geografia',printTopic:'População e urbanização',printBoard:'UNICAMP',printPurpose:'Interpretar dados e relações espaciais',art:'geography' },
{ id:'historia',printSubject:'História',printTopic:'Revolução Francesa',printBoard:'FUVEST 2027',printPurpose:'Relacionar contexto, processos e consequências',art:'history' },
{ id:'fisica',printSubject:'Física',printTopic:'Ondulatória e óptica',printBoard:'FUVEST 2027',printPurpose:'Conectar fenômenos, representação e modelos físicos',art:'physics' },
{ id:'obra',printSubject:'Literatura',printWork:'A vida não é útil',printBoard:'UNICAMP',printPurpose:'Interpretar tese, forma e contexto',art:'literature' },
{ id:'combinado',printSubject:'Biologia',printTopic:'Ecologia de populações e comunidades · Evolução e seleção natural · Genética de populações · Biodiversidade e conservação',printSubtopic:'Dinâmica populacional e relações ecológicas; especiação e adaptação; equilíbrio de Hardy-Weinberg e deriva genética; impactos ambientais e conservação dos ecossistemas brasileiros',printBoard:'FUVEST 2027 · UNICAMP · UNESP · ENEM',printPurpose:'Relacionar os quatro tópicos em situações de prova, explicar passo a passo a leitura de gráficos e distinguir observação, hipótese e mecanismo biológico',art:'biology' },
{ id:'sem-banca',printSubject:'Língua Portuguesa',printTopic:'Interpretação de textos',printPurpose:'Relacionar argumentos e evidências do texto',art:'literature' }
];
const results=[];
try{for(const context of cases){
 const page=await browser.newPage();await page.routeWebSocket('**', socket => socket.close());
  await page.goto(process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3138', { waitUntil: 'networkidle' });
 await page.evaluate(async context=>{const {printStrategyGuide}=await import('/src/lib/printStrategyGuide.ts');window.print=()=>{};
 const article=document.createElement('article');Object.assign(article.dataset,context);article.innerHTML='<h2>Conceitos fundamentais</h2><p>Conteúdo demonstrativo para conferir a diagramação; este exemplo não é material de estudo.</p><h2>Aplicação na prova</h2><p>Texto sintético para conferir o sumário e a continuação.</p>';
 printStrategyGuide(article,'Crivo — demonstração de diagramação');},context);
 await page.emulateMedia({media:'print'});await page.locator('[data-print-illustration]').evaluate(img=>img.decode());await page.evaluate(()=>document.fonts.ready);
 expect(await page.locator('[data-print-cover]').getAttribute('data-print-art')).toBe(context.art);
 const bounds=await page.locator('[data-print-cover]').evaluate(c=>({height:c.getBoundingClientRect().height,panelBottom:c.querySelector('[data-print-cover-text]').getBoundingClientRect().bottom-c.getBoundingClientRect().top,artHeight:c.querySelector('[data-print-cover-art]').getBoundingClientRect().height}));
 expect(bounds.panelBottom).toBeLessThan(bounds.height-12);expect(bounds.artHeight).toBeGreaterThan(100);
 const file=`${output}/capa-${context.id}.pdf`;await page.pdf({path:file,preferCSSPageSize:true,printBackground:false});
 const pages=execFileSync('pdftotext',['-raw',file,'-'],{encoding:'utf8'}).split('\f').filter(p=>p.trim());expect(pages).toHaveLength(3);expect(pages[1]).toContain('Sumário');
 const normalized=s=>s.normalize('NFKC').toUpperCase().replace(/\s/g,'');const text=normalized(pages[0]);
 for(const value of [context.printTopic||context.printWork,context.printPurpose,context.printSubtopic,context.printBoard].filter(Boolean))expect(text).toContain(normalized(value));
 if(context.id==='sangue')for(const label of ['Hemácias','Defesa','Anticorpos','Circulação'])expect(pages[0]).toContain(label);
 results.push({id:context.id,art:context.art,...bounds,pages:pages.length,allMetadata:true});await page.close();
}}finally{await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));await browser.close();}
console.log(JSON.stringify(results,null,2));
