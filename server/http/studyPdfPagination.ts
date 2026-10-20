/** Read Chromium's actual link destinations, never estimate page numbers from height. */
export async function readSectionPages(pdf: Uint8Array, ids: string[]): Promise<Record<string, number>> {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const task = getDocument({ data: Uint8Array.from(pdf), useSystemFonts: true, isEvalSupported: false });
  try {
    const document = await task.promise;
    const pages: Record<string, number> = {};
    for (const id of ids) {
      const destination = await document.getDestination(id);
      if (!destination) throw new Error(`Missing PDF destination: ${id}`);
      const ref = destination[0];
      pages[id] = (typeof ref === 'number' ? ref : await document.getPageIndex(ref)) + 1;
    }
    return pages;
  } finally { await task.destroy(); }
}
