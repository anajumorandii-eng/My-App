export const nativeMathPrintStyles = `.katex .katex-mathml { display: none !important; } .katex-display { margin: 3mm 0; max-width: 100%; } .katex { text-indent: 0; } .katex:not(.katex-display > .katex) { display: inline-block; } [data-print-content] .katex svg { height: inherit; max-height: none !important; max-width: none !important; } [data-print-content] .katex .hide-tail, [data-print-content] .katex .katex-stretchy, [data-print-content] .katex .pstrut { overflow: hidden !important; }`;
/** Prepares a file without opening a dialog or requiring a second generation. */
export async function requestStudyPdf(root: HTMLElement, title: string, styles: string, signal: AbortSignal, documentId?: string): Promise<Blob> {
  for (const image of root.querySelectorAll<HTMLImageElement>('img')) {
    if (image.src.startsWith('data:')) continue;
    const response = await fetch(image.src, { credentials: 'omit', signal });
    if (!response.ok) throw new Error('Não foi possível incluir uma figura do material. Tente novamente.');
    const blob = await response.blob();
    if (!blob.type.startsWith('image/') || blob.size > 6 * 1024 * 1024) throw new Error('Uma figura do material excede o tamanho permitido.');
    image.src = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(blob);
    });
  }
  const { authHeaders } = await import('./auth');
  const titleNode = document.createElement('title'); titleNode.textContent = title;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">${titleNode.outerHTML}<style>${styles}\n${nativeMathPrintStyles}</style></head><body>${root.outerHTML}</body></html>`;
  const response = await fetch('/api/study-pdf', { method: 'POST', headers: { ...(await authHeaders()), 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title.slice(0, 300), html, ...(documentId ? { documentId } : {}) }), signal });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Não foi possível preparar o PDF. Tente novamente.');
  }
  const blob = await response.blob();
  if (!blob.type.startsWith('application/pdf') || await blob.slice(0, 5).text() !== '%PDF-') throw new Error('O arquivo recebido não é um PDF válido. Tente novamente.');
  return blob;
}
let closeActive: (() => void) | undefined;

/** A second, explicit tap opens/shares the file; no async popup loses iOS activation. */
export function openStudyPdf(root: HTMLElement, title: string, styles: string): void {
  closeActive?.();
  const controller = new AbortController();
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'PDF para impressão');
  Object.assign(overlay.style, { position: 'fixed', inset: '0', zIndex: '2147483647', display: 'grid', placeItems: 'center', padding: '20px', background: 'rgba(0,0,0,.45)' });
  const panel = document.createElement('div'); panel.className = 'ni-panel';
  Object.assign(panel.style, { padding: '24px', maxWidth: '520px', width: '100%', background: 'var(--surface-primary, #f6f2e9)', color: 'var(--text, #1c3028)' });
  const heading = document.createElement('h2'); heading.textContent = 'Seu PDF';
  const status = document.createElement('p'); status.setAttribute('role', 'status'); status.textContent = 'Preparando capa, sumário e conteúdo…';
  const actions = document.createElement('div'); Object.assign(actions.style, { display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px 0' });
  const close = document.createElement('button'); close.type = 'button'; close.dataset.pdfClose = ''; close.textContent = 'Fechar';
  let objectUrl: string | undefined;
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
  const cleanup = () => {
    controller.abort(); overlay.remove();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    window.removeEventListener('pagehide', cleanup);
    if (closeActive === cleanup) closeActive = undefined;
    previousFocus?.focus();
  };
  closeActive = cleanup; close.onclick = cleanup;
  overlay.onkeydown = event => {
    if (event.key === 'Escape') { event.preventDefault(); cleanup(); }
    if (event.key === 'Tab') {
      const controls = [...overlay.querySelectorAll<HTMLElement>('a, button')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };
  panel.append(heading, status, actions, close); overlay.append(panel); document.body.append(overlay); close.focus();
  window.addEventListener('pagehide', cleanup, { once: true });
  const timeout = setTimeout(() => controller.abort(), 45_000);
  void (async () => {
    try {
      const blob = await requestStudyPdf(root, title, styles, controller.signal);
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob);
      const filename = `${title.replace(/[^\p{L}\p{N} ._-]/gu, '').slice(0, 120) || 'Crivo'}.pdf`;
      status.textContent = 'PDF pronto, com sumário paginado. Abra para imprimir ou salve o arquivo. No iPad, use Compartilhar → Imprimir ou Salvar em Arquivos.';
      const open = document.createElement('a'); open.href = objectUrl; open.target = '_blank'; open.rel = 'noopener'; open.textContent = 'Abrir PDF para imprimir';
      const download = document.createElement('a'); download.href = objectUrl; download.download = filename; download.textContent = 'Salvar PDF';
      actions.append(open, download);
      const file = new File([blob], filename, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        const share = document.createElement('button'); share.type = 'button'; share.textContent = 'Compartilhar PDF';
        share.onclick = () => { void navigator.share({ files: [file], title }).catch(error => {
          if (error?.name !== 'AbortError') status.textContent = 'Não foi possível compartilhar. Use Abrir PDF ou Salvar PDF.';
        }); };
        actions.append(share);
      }
      open.focus();
    } catch (error) {
      if (!overlay.isConnected) return;
      status.setAttribute('role', 'alert');
      status.textContent = controller.signal.aborted ? 'A preparação demorou demais. Feche e tente novamente; seu material continua salvo.' : error instanceof Error ? error.message : 'Não foi possível preparar o PDF. Seu material continua salvo.';
    } finally { clearTimeout(timeout); }
  })();
}
