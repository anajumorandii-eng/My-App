import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,args:['--no-sandbox']});const results=[];
try {for(const [width,theme] of [[1440,'light'],[834,'dark'],[390,'light']]){
const context=await b.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const p=await context.newPage();await p.addInitScript(theme=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme)},theme);await p.goto(`${process.env.CRIVO_URL || 'http://127.0.0.1:3000'}/visual?summary=summary-gramatica-concordancia`);await p.locator('.vs-spatial-lab').waitFor();await p.getByRole('button',{name:'Guardar para comparar'}).click();const r=await new AxeBuilder({page:p}).include('.vs-spatial-lab').include('.vs-scene-bridge').include('.vs-journey').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();results.push({width,theme,violations:r.violations,incomplete:r.incomplete.map(x=>({id:x.id,nodes:x.nodes.length}))});await context.close();}}
finally{await b.close()}
await fs.writeFile('docs/refinamento-profissional-613-2026-10-11/accessibility-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.map(r=>({width:r.width,violations:r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),incomplete:r.incomplete})),null,2));

if (results.some(result => result.violations.length)) process.exitCode = 1;
