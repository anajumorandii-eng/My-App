import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {chromium,expect} from '@playwright/test';import {renderStudyPdf} from '../server/http/studyPdf.ts';
const base=process.env.CRIVO_AUDIT_URL||'http://127.0.0.1:3138',output=process.env.CRIVO_REVIEW_OUTPUT||'/tmp/crivo-review-validation';await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const answer=String.raw`## Revisão direcionada
Use os recortes escolhidos. Ângulo inscrito: $\beta=\frac{\theta}{2}$. Área: $A=12\pi-9\sqrt{3}$.
## Recuperação ativa
1. Explique o ângulo inscrito.
## Revisão de última hora
Relacione arco, ângulo e área.
## Gabarito da recuperação ativa
1. O ângulo inscrito mede a metade do central.`;
const results=[];
try{for(const [name,width,height] of [['mobile',390,844],['tablet',834,1112],['desktop',1440,1000]]){
 const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();const requests=[];page.setDefaultTimeout(20000);page.on('pageerror',error=>console.log('pageerror',error.message));console.log('opening',name);
 await page.route(base+'/',r=>r.fulfill({contentType:'text/html',body:'<html><body></body></html>'}));
 const stub=async(path,body)=>page.route('**'+path+'*',r=>r.fulfill({contentType:'text/javascript',body}));
 await stub('/src/lib/auth.ts','export const authHeaders=async()=>({});export const getFirebaseIdToken=async()=>null;export const app={};');
 await stub('/src/lib/firestore.ts','export const db={};');
 await stub('/src/context/AuthContext.tsx','export const useAuth=()=>({user:null,loading:false});');
 await stub('/src/hooks/useQuestions.ts','export const useQuestions=()=>({questions:[],loading:false,syncError:null});');
 await stub('/src/hooks/useStudyTargets.ts','export const useStudyTargets=()=>({targets:[],loading:false,error:null});');
 await stub('/src/hooks/useErrorReviewHistory.ts','export const useErrorReviewHistory=()=>({errors:[],loading:false,warning:""});');
 await stub('/src/lib/loadStudyPacket.ts','export async function loadStudyPacket(){return {topicId:"mat_geometria_plana",chapter:"",sources:[],coverage:[],referenceText:"Sem fonte específica: exemplo sintético de validação."};}');
 await stub('/src/lib/aiClient.ts',`export class AiRequestError extends Error{};export async function requestAiTextStream(task,payload,onDelta){window.__reviewRequests.push(payload);if(window.__failNextReview){window.__failNextReview=false;throw new AiRequestError('Falha simulada da validação. Tente novamente.');}await new Promise(resolve=>setTimeout(resolve,100));onDelta(${JSON.stringify(answer)});return {text:${JSON.stringify(answer)}};}`);
 await page.route('**/api/study-pdf',async route=>{const data=route.request().postDataJSON();const pdf=await renderStudyPdf(data.html);await fs.writeFile(output+`/${name}.pdf`,pdf);await route.fulfill({contentType:'application/pdf',body:Buffer.from(pdf)});});
 await page.goto(base);await page.evaluate(async()=>{window.__reviewRequests=[];const {default:r}=await import('/@react-refresh');r.injectIntoGlobalHook(window);window.$RefreshReg$=()=>{};window.$RefreshSig$=()=>t=>t;window.__vite_plugin_react_preamble_installed__=true;const {mountReviewWorkspace}=await import('/scripts/reviewWorkspaceFixture.tsx');mountReviewWorkspace();});
 await expect(page.getByRole('heading',{name:'Criar e retomar revisões'})).toBeVisible();
 await expect(page.getByLabel('Matéria do resumo')).toBeVisible();
 await page.keyboard.press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement?.tagName),'BODY');
 await page.screenshot({path:output+`/${name}-initial.png`,fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 // Full-topic request first.
 console.log('generating',name);await page.getByRole('button',{name:'Gerar resumo de revisão',exact:true}).click();await expect(page.getByRole('link',{name:'Abrir PDF',exact:true})).toBeVisible({timeout:60000});
 let sent=await page.evaluate(()=>window.__reviewRequests);assert.ok(!sent[0].chapters);
 await page.getByRole('button',{name:'Configurar nova revisão'}).click();
 await page.getByLabel('Tópico do resumo').selectOption('mat_geometria_plana');
 await page.getByText('Selecionar subtópicos de Geometria Plana',{exact:true}).click();
 await page.getByLabel('Ângulos na circunferência',{exact:true}).check();await page.getByLabel('Área do círculo',{exact:true}).check();
 await page.getByLabel('Recorte personalizado de Geometria Plana').fill('Minha dificuldade em áreas compostas');await page.getByRole('button',{name:'Adicionar recorte',exact:true}).click();
 await page.getByText('Combinar mais tópicos de Matemática na mesma revisão',{exact:true}).click();await page.getByRole('checkbox',{name:'Funções',exact:true}).check();
 await page.getByText('Selecionar subtópicos de Funções',{exact:true}).click();await page.getByLabel('Função Quadrática',{exact:true}).check();
 await page.screenshot({path:output+`/${name}-selected.png`,fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 console.log('generating',name);await page.getByRole('button',{name:'Gerar resumo de revisão',exact:true}).evaluate(button=>{button.click();button.click();});await expect(page.getByRole('link',{name:'Abrir PDF',exact:true})).toBeVisible({timeout:60000});
 sent=await page.evaluate(()=>window.__reviewRequests);assert.equal(sent.length,2);assert.ok(sent[1].chapters.includes('Ângulos na circunferência + Área do círculo + Minha dificuldade em áreas compostas'));assert.ok(sent[1].chapters.includes('Função Quadrática'));
 await page.getByRole('button',{name:/Geometria Plana \+ Funções · Geral/}).click();await page.getByRole('button',{name:'Editar configurações desta revisão'}).click();
 await expect(page.getByLabel('Área do círculo',{exact:true})).toBeChecked();await expect(page.getByLabel('Função Quadrática',{exact:true})).toBeChecked();
 await page.getByLabel('Buscar revisões').fill('Geometria');await expect(page.getByRole('button',{name:/Aritmética e Proporcionalidade · Geral/})).toHaveCount(0);
 await page.screenshot({path:output+`/${name}-restored.png`,fullPage:true});
 if(name==='desktop'){await page.getByText(/Banca e profundidade ·/).click();await page.getByRole('combobox',{name:/Profundidade/}).selectOption('quick');await page.evaluate(()=>{window.__failNextReview=true;});await page.getByRole('button',{name:'Gerar resumo de revisão',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Falha simulada');await expect(page.getByLabel('Área do círculo',{exact:true})).toBeChecked();await page.screenshot({path:output+'/desktop-error.png',fullPage:true});await page.getByRole('button',{name:'Gerar resumo de revisão',exact:true}).click();await expect(page.getByRole('link',{name:'Abrir PDF',exact:true})).toBeVisible({timeout:60000});}
 await page.getByRole('button',{name:'Fila de revisões',exact:true}).click();await expect(page.getByRole('heading',{name:'Minha fila',exact:true})).toBeVisible();await expect(page.getByText('Sua fila está vazia.',{exact:false})).toBeVisible();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:output+`/${name}-queue.png`,fullPage:true});await page.getByRole('button',{name:'Criar e abrir revisões',exact:true}).click();await page.getByRole('button',{name:'Editar configurações desta revisão'}).click();await expect(page.getByLabel('Área do círculo',{exact:true})).toBeChecked();
 results.push({name,width,requests:sent.length,restored:true,noHorizontalOverflow:true,errorRetry:name==='desktop'});await context.close();
}}finally{await browser.close();}
await fs.writeFile(output+'/results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
