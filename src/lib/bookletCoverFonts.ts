import serif from '../assets/print/fonts/cormorant-normal-400.ttf?inline';
import display from '../assets/print/fonts/playfair-normal-700.ttf?inline';
import italic from '../assets/print/fonts/cormorant-italic-400.ttf?inline';
import text from '../assets/print/fonts/LiberationSerif-Regular.ttf?inline';
import type { BookletCoverFonts } from './bookletCoverSpread';

/** Fontes da identidade visual incorporadas no próprio PDF, inclusive fora do app. */
export function bookletCoverFonts(): BookletCoverFonts {
  const decode = (source: string) => Uint8Array.from(atob(source.slice(source.indexOf(',') + 1)), char => char.charCodeAt(0));
  return { serif: decode(serif), display: decode(display), italic: decode(italic), text: decode(text) };
}
