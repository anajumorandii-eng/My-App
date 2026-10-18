import stationery from '../assets/print/aquarela-crivo.jpg?inline';
import { printStyles } from './printStyles';

let activePrint: (() => void) | undefined;

/** Prints in the current window so browsers do not have to print a hidden frame. */
export function printStrategyGuide(content: HTMLElement, title: string) {
  activePrint?.();
  const previousTitle = document.title;
  const root = document.createElement('div');
  root.dataset.crivoPrintRoot = '';
  root.style.display = 'none';
  const printable = content.cloneNode(true) as HTMLElement;
  printable.querySelectorAll('[data-print-exclude]').forEach(element => element.remove());
  printable.querySelectorAll<HTMLElement>('[data-print-only]').forEach(element => { element.hidden = false; element.style.display = 'block'; element.classList.remove('hidden'); });
  printable.querySelectorAll('details').forEach(element => { element.open = true; });
  // Inline artwork is available at the click: printing must not wait on a fetch.
  const art = document.createElement('img');
  art.dataset.printFrame = '';
  art.src = stationery; art.alt = ''; art.setAttribute('aria-hidden', 'true');
  // A printed vector veil keeps the reading column clear even when background
  // graphics are disabled; CSS masks are ignored by some print renderers.
  const veil = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  veil.dataset.printVeil = '';
  veil.setAttribute('viewBox', '0 0 210 297');
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = '<defs><linearGradient id="crivo-paper-veil"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="8.57%" stop-color="white" stop-opacity=".84"/><stop offset="91.43%" stop-color="white" stop-opacity=".84"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="210" height="297" fill="url(#crivo-paper-veil)"/>';
  const brand = document.createElement('span');
  brand.dataset.printBrand = '';
  brand.textContent = 'CRIVO · CADERNO DE ESTUDO';
  const layout = document.createElement('table');
  layout.dataset.printLayout = '';
  layout.setAttribute('role', 'presentation');
  // Repeated groups reserve normal margins on each sheet; the artwork
  // fills the paper behind the text instead of consuming reading space.
  for (const group of [layout.createTHead(), layout.createTFoot()]) {
    const spacer = group.insertRow().insertCell();
    spacer.setAttribute('aria-hidden', 'true');
  }
  printable.dataset.printContent = '';
  layout.createTBody().insertRow().insertCell().append(printable);
  root.append(art, veil, layout, brand);
  const style = document.createElement('style');
  style.textContent = printStyles;
  const cleanup = () => {
    root.remove(); style.remove(); document.title = previousTitle;
    window.removeEventListener('afterprint', cleanup);
    if (activePrint === cleanup) activePrint = undefined;
  };
  activePrint = cleanup;
  document.body.appendChild(root); document.head.appendChild(style);
  document.title = title;
  window.addEventListener('afterprint', cleanup, { once: true });
  // Keep this synchronous with the user's click. Waiting on copied styles or
  // fonts can lose user activation or leave the print action pending forever.
  try { window.print(); } catch (error) { cleanup(); throw error; }
}
