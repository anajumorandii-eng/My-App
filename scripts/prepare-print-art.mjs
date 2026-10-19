import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

// Bake the existing paper correction into JPEG bytes: Quartz need not print
// an HTML image through a cross-element SVG filter or a compositing mask.
const directory = fileURLToPath(new URL('../src/assets/print/', import.meta.url));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  for (const file of (await fs.readdir(directory)).filter(name => /^atlas-.*\.webp$/.test(name))) {
    const source = `data:image/webp;base64,${(await fs.readFile(`${directory}/${file}`)).toString('base64')}`;
    const encoded = await page.evaluate(async source => {
      const image = new Image(); image.src = source; await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { colorSpace: 'srgb' });
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const paper = [246, 242, 233];
      for (let i = 0; i < pixels.data.length; i += 4) {
        const alpha = pixels.data[i + 3] / 255;
        for (let channel = 0; channel < 3; channel++) {
          const ink = Math.min(255, pixels.data[i + channel] * 1.1) * paper[channel] / 255;
          pixels.data[i + channel] = ink * alpha + paper[channel] * (1 - alpha);
        }
        pixels.data[i + 3] = 255;
      }
      context.putImageData(pixels, 0, 0);
      return canvas.toDataURL('image/jpeg', .94).split(',')[1];
    }, source);
    await fs.writeFile(`${directory}/${file.replace('.webp', '.jpg')}`, Buffer.from(encoded, 'base64'));
    console.log(file.replace('.webp', '.jpg'));
  }
} finally { await browser.close(); }
