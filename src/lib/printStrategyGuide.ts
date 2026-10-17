/** Prints the rendered guide, including its Markdown and mathematical notation. */
export function printStrategyGuide(content: HTMLElement, title: string) {
  const frame = document.createElement('iframe');
  frame.title = 'Impressão do aprofundamento';
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;';
  document.body.appendChild(frame);
  const target = frame.contentDocument;
  if (!target) { frame.remove(); throw new Error('Impressão indisponível'); }
  target.open();
  target.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"></head><body></body></html>');
  target.close();
  target.title = title;
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
  const pending = styles.map(style => new Promise<void>(resolve => {
    const clone = style.cloneNode(true) as HTMLElement;
    if (clone.tagName === 'LINK') { clone.onload = () => resolve(); clone.onerror = () => resolve(); }
    target.head.appendChild(clone);
    if (clone.tagName !== 'LINK') resolve();
  }));
  const printStyle = target.createElement('style');
  printStyle.textContent = '@page{margin:18mm} body{background:white!important;color:black!important;font:12pt/1.6 sans-serif;padding:0} body *{color:black!important} h1,h2,h3,h4{break-after:avoid} pre{white-space:pre-wrap} img,svg{max-width:100%}';
  target.head.appendChild(printStyle);
  const printable = content.cloneNode(true) as HTMLElement;
  printable.querySelectorAll('[data-print-exclude]').forEach(element => element.remove());
  printable.querySelectorAll<HTMLElement>('[data-print-only]').forEach(element => { element.style.display = 'block'; });
  printable.querySelectorAll('details').forEach(element => { element.open = true; });
  target.body.appendChild(printable);
  void Promise.all(pending).then(() => target.fonts?.ready).then(() => {
    const view = frame.contentWindow;
    if (!view) { frame.remove(); return; }
    view.addEventListener('afterprint', () => frame.remove(), { once: true });
    view.focus();
    view.print();
  });
}
