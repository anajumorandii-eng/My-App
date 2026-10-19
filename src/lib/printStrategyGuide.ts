import { createPrintFrontMatter } from './printFrontMatter';
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
  const { cover, toc } = createPrintFrontMatter(printable, title);
  const brand = document.createElement('span');
  brand.dataset.printBrand = '';
  brand.textContent = 'CRIVO · CADERNO DE ESTUDO';
  const layout = document.createElement('table');
  layout.dataset.printLayout = '';
  layout.setAttribute('role', 'presentation');
  // Repeated groups reserve normal margins on the economical content pages.
  for (const group of [layout.createTHead(), layout.createTFoot()]) {
    const spacer = group.insertRow().insertCell();
    if (group.tagName === 'TFOOT') spacer.append(brand);
    else spacer.setAttribute('aria-hidden', 'true');
  }
  printable.dataset.printContent = '';
  layout.createTBody().insertRow().insertCell().append(printable);
  root.append(cover, toc, layout);
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
