import stationery from '../assets/print/aquarela-crivo.webp?inline';
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
  const header = document.createElement('header');
  header.dataset.printMasthead = '';
  const art = document.createElement('img');
  art.src = stationery; art.alt = ''; art.setAttribute('aria-hidden', 'true');
  const brand = document.createElement('span');
  brand.textContent = 'CRIVO · CADERNO DE ESTUDO';
  header.append(art, brand);
  printable.dataset.printContent = '';
  root.append(header, printable);
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
