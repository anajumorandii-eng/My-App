/** Front matter uses explicit study context; it never guesses an exam board. */
export function createPrintFrontMatter(content: HTMLElement, title: string, artwork: string) {
  const data = content.dataset;
  const cover = document.createElement('section');
  cover.dataset.printCover = '';
  const image = document.createElement('img');
  image.dataset.printFrame = ''; image.src = artwork; image.alt = ''; image.setAttribute('aria-hidden', 'true');
  const panel = document.createElement('div'); panel.dataset.printCoverText = '';
  const brand = document.createElement('p'); brand.textContent = 'CRIVO · CADERNO DE ESTUDO'; brand.dataset.printCoverBrand = '';
  const heading = document.createElement('h1'); heading.textContent = data.printWork || data.printTopic || title;
  const fields = document.createElement('dl');
  const rows = [
    ['Matéria', data.printSubject],
    ['Tópico', data.printWork ? undefined : data.printTopic],
    [data.printWork ? 'Recorte da obra' : 'Subtópico / capítulo', data.printSubtopic || (data.printWork ? 'Obra completa' : undefined)],
    ['Banca / prova', data.printBoard],
    ['Objetivo do material', data.printPurpose || 'Estudo, aprofundamento e revisão'],
  ];
  for (const [label, value] of rows) {
    if (!value?.trim()) continue;
    const row = document.createElement('div');
    const term = document.createElement('dt'); term.textContent = label!;
    const description = document.createElement('dd'); description.textContent = value;
    row.append(term, description); fields.append(row);
  }
  if (heading.textContent.length > 100) cover.dataset.printLongTitle = '';
  panel.append(brand, heading, fields); cover.append(image, panel);

  const toc = document.createElement('section'); toc.dataset.printToc = '';
  const tocHeading = document.createElement('h2'); tocHeading.textContent = 'Sumário';
  const hint = document.createElement('p'); hint.textContent = 'Seções deste material, na ordem de leitura.';
  let headings = [...content.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6, summary, p')]
    .filter(element => element.textContent?.trim() && !element.closest('[hidden], .hidden'))
    .filter(element => element.tagName !== 'P' || (element.children.length === 1 && element.firstElementChild?.matches('strong, b') && element.textContent?.trim() === element.firstElementChild.textContent?.trim() && element.textContent!.length < 160));
  if (headings.length > 1 && headings[0].textContent?.trim() === heading.textContent?.trim()) headings.shift();
  if (!headings.length) {
    const fallback = document.createElement('h2'); fallback.textContent = 'Conteúdo do material';
    content.prepend(fallback); headings = [fallback];
  }
  // Dense outlines keep major sections; never cut the material itself to fit.
  if (headings.length > 36) {
    const levels = headings.map(element => ['SUMMARY', 'P'].includes(element.tagName) ? 4 : Number(element.tagName[1]));
    const levelsInUse = [...new Set(levels)].sort((a, b) => a - b);
    const maximumLevel = levelsInUse[1] ?? levelsInUse[0];
    headings = headings.filter((_, index) => levels[index] <= maximumLevel);
  }
  if (headings.length > 16) toc.dataset.printTocColumns = '';
  const links = document.createElement('ol');
  const occupied = new Set([...content.querySelectorAll('[id]')].map(element => element.id));
  headings.forEach((element, index) => {
    let id = `crivo-print-section-${index + 1}`;
    while (occupied.has(id) || document.getElementById(id)) id += '-entry';
    occupied.add(id);
    // A wrapper anchor preserves existing IDs used by figures and equations.
    const anchor = document.createElement('span'); anchor.id = id; anchor.dataset.printAnchor = '';
    element.before(anchor);
    const item = document.createElement('li');
    const link = document.createElement('a'); link.href = `#${id}`; link.textContent = element.textContent!.trim();
    item.append(link); links.append(item);
  });
  toc.append(tocHeading, hint, links);
  return { cover, toc };
}
