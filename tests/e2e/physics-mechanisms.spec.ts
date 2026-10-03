import { expect, test } from '@playwright/test';

const scenes = [
  { name: 'lenz', chapter: 'inducao-eletromagnetica-lei-de-lenz', slider: '#magnetism-lenz', values: [0.1, 0.5, 1, 2] },
  { name: 'doppler', chapter: 'efeito-doppler-descricao-e-estudo-quantitativo', slider: '#waves-doppler', values: [0,10,20,30,40,50,60,70,80] },
  { name: 'luneta', chapter: 'microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas', slider: '#physics-remaining-optical-instruments', values: [400,600,800,1000,1200,1400,1600] },
];
for (const width of [390,834,1366]) for (const theme of ['light','dark']) for (const reducedMotion of ['reduce','no-preference'] as const) {
  for (const scene of scenes) test(`${scene.name} ${width} ${theme} ${reducedMotion}`, async ({page}, testInfo) => {
    await page.setViewportSize({width,height:1000});
    await page.emulateMedia({reducedMotion});
    await page.addInitScript(theme => { localStorage.setItem('juju_onboarding','true'); localStorage.setItem('crivo_theme',theme); }, theme);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/visual?summary=summary-fisica-${scene.chapter}`);
    const svg = page.locator('svg.vs-plane[role="img"]');
    await expect(svg).toBeVisible();
    const slider = page.locator(scene.slider);
    await expect(slider).toBeVisible();
    for (const mode of scene.name === 'lenz' ? ['approach','retreat','stationary'] : ['default']) {
      if (scene.name === 'lenz') await page.locator('#lenz-motion').selectOption(mode);
      for (const value of scene.values) {
        await slider.fill(String(value));
        if (scene.name === 'lenz') {
          await expect(page.locator('[data-lenz-mode]')).toHaveAttribute('data-lenz-mode',mode);
          await expect(page.locator('[data-current-arrow]')).toHaveCount(mode === 'stationary' ? 0 : 1);
          const vector = page.locator('[data-vector="induced-field"]');
          if (mode !== 'stationary') { const direction = await vector.evaluate(el => Number(el.getAttribute('x2'))-Number(el.getAttribute('x1'))); expect(Math.sign(direction)).toBe(mode === 'approach' ? -1 : 1); }
        } else if (scene.name === 'doppler') {
          const fronts = await page.locator('[data-doppler-front]').evaluateAll(els => els.map(el => ({x:Number(el.getAttribute('cx')),r:Number(el.getAttribute('r')),age:Number(el.getAttribute('data-age'))})));
          expect(fronts).toHaveLength(4);
          for (const front of fronts) { expect(front.x).toBeCloseTo(150-value*front.age*32); expect(front.r).toBeCloseTo(340*front.age*32); }
        } else {
          await expect(page.locator('[data-luneta-length]')).toHaveAttribute('data-luneta-length',String(value+8));
          await expect(page.locator('[data-luneta-magnification]')).toHaveAttribute('data-luneta-magnification',String(-value/8));
          const slopes = await page.locator('[data-exit-slope]').evaluateAll(els => els.map(el => Number(el.getAttribute('data-exit-slope'))));
          expect(slopes).toHaveLength(3); for (const slope of slopes) expect(slope).toBeCloseTo(-value/8*0.0003,8);
        }
        const escaped = await svg.locator('text').evaluateAll(els => els.filter(el => { const b=(el as SVGGraphicsElement).getBBox(); return b.x < -1 || b.y < -1 || b.x+b.width >321 || b.y+b.height >301; }).map(el => el.textContent));
        expect(escaped).toEqual([]);
        const collisions = await svg.locator('text').evaluateAll(els => {
          const boxes = els.map(el => ({text:el.textContent,box:(el as SVGGraphicsElement).getBBox()}));
          return boxes.flatMap((a,i) => boxes.slice(i+1).filter(b => Math.min(a.box.x+a.box.width,b.box.x+b.box.width)-Math.max(a.box.x,b.box.x)>1 && Math.min(a.box.y+a.box.height,b.box.y+b.box.height)-Math.max(a.box.y,b.box.y)>1).map(b => [a.text,b.text]));
        });
        expect(collisions).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
      }
    }
    await slider.focus(); await page.keyboard.press('Home'); await expect(slider).toHaveValue(String(scene.values[0]));
    await page.keyboard.press('End'); await expect(slider).toHaveValue(String(scene.values.at(-1)));
    expect(errors).toEqual([]);
    if (reducedMotion === 'reduce') {
      await page.locator('.vs-instrument').evaluate(el => el.scrollIntoView({block:'center'}));
      await page.locator('.vs-instrument').screenshot({path:testInfo.outputPath(`${scene.name}-${width}-${theme}.png`)});
      if (scene.name === 'lenz') {
        await page.locator('#lenz-motion').selectOption('approach'); await slider.fill('0.1');
        await page.locator('.vs-instrument').screenshot({path:testInfo.outputPath(`lenz-approach-${width}-${theme}.png`)});
      }
    }
  });
}
