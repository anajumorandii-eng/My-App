import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';import {renderStudyPdf} from '../server/http/studyPdf.ts';import {fitPrintMath} from '../src/lib/fitPrintMath.ts';
const output=process.env.CRIVO_MATH_OUTPUT||'/tmp/crivo-math-validation';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:794,height:1123}});const base=process.env.CRIVO_AUDIT_URL||'http://127.0.0.1:3138';
 await page.route(base+'/',r=>r.fulfill({contentType:'text/html',body:'<html><body></body></html>'}));await page.goto(base);
 await page.evaluate(async()=>{const {default:r}=await import('/@react-refresh');r.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>t=>t;window.__vite_plugin_react_preamble_installed__=true;});
 const html=await page.evaluate(async()=>{const {reviewMathFixture}=await import('/scripts/reviewMathFixture.tsx');return reviewMathFixture();});
 await fs.writeFile(output+'/source.html',html);await page.setContent(html);await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
 const before=await page.locator('.katex-html').evaluateAll(nodes=>nodes.filter(n=>{const cell=n.closest('td');return cell&&n.getBoundingClientRect().width>cell.clientWidth-12;}).length);
 await page.evaluate(fitPrintMath);
 const results=await page.evaluate(()=>({math:document.querySelectorAll('.katex').length,errors:document.querySelectorAll('.katex-error').length,embeddedFonts:[...document.fonts].filter(f=>f.family.includes('KaTeX')&&f.status==='loaded').map(f=>f.family),fitted:document.querySelectorAll('[data-print-math-fitted]').length,overflow:[...document.querySelectorAll('.katex-html')].filter(n=>{const cell=n.closest('td');return cell&&n.getBoundingClientRect().width>cell.clientWidth-12;}).length}));
 console.log(JSON.stringify({before,...results,tables:await page.locator('[data-print-content] table').count()}));
 assert.equal(results.errors,0);assert.ok(results.math>=60);assert.ok(results.embeddedFonts.includes('KaTeX_Math'));assert.ok(before>0,'Fixture must reproduce narrow-cell overflow');assert.equal(results.overflow,0);assert.ok(results.fitted>0);
 await page.screenshot({path:output+'/layout.png',fullPage:true});await fs.writeFile(output+'/matematica.pdf',await renderStudyPdf(html));await fs.writeFile(output+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}
