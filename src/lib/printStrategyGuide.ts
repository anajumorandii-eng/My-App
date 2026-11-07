import { preparedCoverIllustration, coverContextKey, readPrintCoverContext } from './printCoverContext';
import { createPrintFrontMatter } from './printFrontMatter';
import { printStyles } from './printStyles';

import { openStudyPdf } from './printPdfFile';



/** Builds the shared cover, semantic index and full content for the PDF renderer. */
export function createStrategyPrintRoot(content: HTMLElement, title: string) {
  const root = document.createElement('div');
  root.dataset.crivoPrintRoot = '';
  root.style.display = 'none';
  const printable = content.cloneNode(true) as HTMLElement;
  const existingArt = preparedCoverIllustration(printable);
  printable.dataset.printCoverEdition ||= crypto.randomUUID();
  if (existingArt) printable.dataset.printGeneratedContext = coverContextKey(readPrintCoverContext(printable));
  printable.querySelectorAll('[data-print-exclude]').forEach(element => element.remove());
  printable.querySelectorAll<HTMLElement>('[data-print-only]').forEach(element => { element.hidden = false; element.style.display = 'block'; element.classList.remove('hidden'); });
  // References stay readable without exporting raw OCR and internal analytical sheets.
  printable.querySelectorAll('[data-study-source] [data-source-content]').forEach(element => element.remove());
  printable.querySelectorAll('details').forEach(element => { element.open = true; });
  printable.querySelectorAll<HTMLElement>('[data-review-sources]').forEach(element => {
    element.querySelector('summary')!.textContent = 'Fontes da revisão';
    const panel = element.querySelector('[aria-label="Fontes do estudo"]');
    panel?.querySelector(':scope > h3')?.remove();
    panel?.querySelectorAll(':scope > p').forEach(paragraph => {
      if (paragraph.textContent?.startsWith('Questões com figuras e enunciados extensos permanecem')) paragraph.remove();
    });
  });
  printable.querySelectorAll<HTMLElement>('[data-review-answer-key]').forEach(element => {
    element.dataset.printAnswerKey = '';
    element.querySelector('summary')!.textContent = 'Gabarito da recuperação ativa';
    printable.append(element);
  });
  const { cover, toc } = createPrintFrontMatter(printable, title);
  if (cover.dataset.printMaterial === 'review') root.dataset.printReviewCompact = '';
  else if (/^aprofundamento\b/i.test(printable.dataset.printPurpose || '')) root.dataset.printDeepeningCompact = '';

  // The selected cover already owns these bytes; duplicating them in body
  // metadata can double the PDF request and exceed its size limit.
  delete printable.dataset.printGeneratedArt;
  delete printable.dataset.printGeneratedContext;
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
  const cell = layout.createTBody().insertRow().insertCell();
  if (root.hasAttribute('data-print-review-compact') || root.hasAttribute('data-print-deepening-compact')) {
    cell.append(toc, printable);
    root.append(cover, layout);
  } else {
    cell.append(printable);
    root.append(cover, toc, layout);
  }
  return root;
}

/** Recompõe o mesmo texto para A5; a capa definitiva é desenhada na imposição. */
export function createBookletSourceRoot(content: HTMLElement, title: string) {
  const root = createStrategyPrintRoot(content, title);
  root.dataset.printBookletSource = '';
  delete root.dataset.printReviewCompact;
  delete root.dataset.printDeepeningCompact;
  const toc = root.querySelector('[data-print-toc]');
  const cell = root.querySelector('[data-print-layout] > tbody > tr > td');
  if (toc && cell) {
    // As fichas continuam completas no corpo, agrupadas sob a seção de fontes.
    const sourceIds = new Set([...root.querySelectorAll<HTMLElement>('[data-print-content] [data-study-source][id], [data-print-content] [data-study-source] [id]')].map(element => element.id));
    for (const link of toc.querySelectorAll('a')) {
      if (sourceIds.has(link.getAttribute('href')!.slice(1))) link.closest('li')!.remove();
    }
    // O CSS do livreto usa page:auto: índice e texto compartilham as mesmas
    // margens, sem a página nomeada que reduziria a escala dentro da tabela.
    cell.prepend(toc);
  }
  // A arte conjunta já é responsabilidade do livreto: não carregar outra imagem para esta reserva.
  const cover = root.querySelector<HTMLElement>('[data-print-cover]');
  if (cover) { const heading = document.createElement('p'); heading.textContent = title; cover.replaceChildren(heading); }
  return root;
}

/** One prepared file gives every platform the final, verified table of contents. */
export function printStrategyGuide(content: HTMLElement, title: string) {
  openStudyPdf(createStrategyPrintRoot(content, title), title, printStyles);
}
