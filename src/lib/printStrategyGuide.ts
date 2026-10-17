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
  root.appendChild(printable);
  const style = document.createElement('style');
  style.textContent = `@media print {
    @page { margin: 18mm; }
    html, body { background: white !important; color: black !important; height: auto !important; overflow: visible !important; }
    body > :not([data-crivo-print-root]) { display: none !important; }
    [data-crivo-print-root] { display: block !important; font: 12pt/1.6 sans-serif; }
    [data-crivo-print-root], [data-crivo-print-root] * { color: black !important; background: transparent !important; box-shadow: none !important; max-height: none !important; overflow: visible !important; }
    [data-crivo-print-root] h1, [data-crivo-print-root] h2, [data-crivo-print-root] h3, [data-crivo-print-root] h4 { break-after: avoid; }
    [data-crivo-print-root] pre { white-space: pre-wrap; overflow-wrap: anywhere; }
    [data-crivo-print-root] img, [data-crivo-print-root] svg { max-width: 100%; height: auto; }
    [data-crivo-print-root] button, [data-crivo-print-root] select, [data-crivo-print-root] input { display: none !important; }
  }`;
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
