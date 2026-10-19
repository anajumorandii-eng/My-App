import regular from '../assets/print/fonts/cormorant-normal-400.woff?inline';
import medium from '../assets/print/fonts/cormorant-normal-600.woff?inline';
import italic from '../assets/print/fonts/cormorant-italic-400.woff?inline';
import display from '../assets/print/fonts/playfair-normal-700.woff?inline';
const fonts = [
  { family: 'Crivo Cover Serif', src: regular, weight: '400', style: 'normal' },
  { family: 'Crivo Cover Serif', src: medium, weight: '600', style: 'normal' },
  { family: 'Crivo Cover Serif', src: italic, weight: '400', style: 'italic' },
  { family: 'Crivo Cover Display', src: display, weight: '700', style: 'normal' },
];
export const printCoverFontStyles = fonts.map(font => `@font-face { font-family: '${font.family}'; src: url('${font.src}') format('woff'); font-weight: ${font.weight}; font-style: ${font.style}; font-display: block; }`).join('\n');
// Warm bundled bytes before a click; print() still executes synchronously.
if (typeof FontFace !== 'undefined' && typeof document !== 'undefined' && document.fonts) {
  for (const font of fonts) {
    const face = new FontFace(font.family, `url('${font.src}')`, { weight: font.weight, style: font.style });
    void face.load().then(loaded => document.fonts.add(loaded)).catch(() => { /* Local serif fallback remains printable. */ });
  }
}
