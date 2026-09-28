import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
for (const [w,h] of [[390,844],[1194,834]]) for (const rm of ['reduce','no-preference']) {
const p = await (await b.newContext({ viewport: { width: w, height: h }, reducedMotion: rm })).newPage();
await p.addInitScript(() => { localStorage.setItem('juju_onboarding','true'); localStorage.setItem('crivo_theme','dark'); });
await p.goto('http://127.0.0.1:3210/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
console.log(w, rm, await p.evaluate(() => { const c=document.querySelector('.crivo-observatorio-visual-support canvas'); const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let n=0; for(let i=3;i<d.length;i+=4) if(d[i]>10) n++; return `${c.width}x${c.height} pintados=${(100*n/(c.width*c.height)).toFixed(1)}%`; }));
}
await b.close();
