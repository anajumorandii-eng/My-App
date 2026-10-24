import { preparedCoverIllustration, readPrintCoverContext } from './printCoverContext';
import { coverMaterial, printCoverArt } from './printCoverArt';
import { buildPrintCoverSpec, type PrintCoverContext } from './printCoverSpec';

const svgNode = (tag: string, attributes: Record<string, string> = {}) => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
};
function coverDivider(diamond = false) {
  const node = svgNode('svg', { viewBox: '0 0 140 5', 'aria-hidden': 'true' });
  node.dataset.printCoverDivider = '';
  node.append(svgNode('path', { d: 'M0 2.5H66 M74 2.5H140', stroke: '#A6824B', 'stroke-width': '.22', fill: 'none' }));
  if (diamond) node.append(svgNode('path', { d: 'M70 .8L71.7 2.5L70 4.2L68.3 2.5Z', stroke: '#A6824B', 'stroke-width': '.2', fill: 'none' }));
  else for (const r of ['1.7', '.7']) node.append(svgNode('circle', { cx: '70', cy: '2.5', r, stroke: '#A6824B', 'stroke-width': '.2', fill: 'none' }));
  return node;
}
/** The same native frame and type system is shared by every cover. */
export function createPrintFrontMatter(content: HTMLElement, title: string) {
  const data = content.dataset;
  const context: PrintCoverContext = readPrintCoverContext(content);
  const spec = buildPrintCoverSpec(context, title);
  const cover = document.createElement('section'); cover.dataset.printCover = '';
  const edition=data.printCoverEdition || crypto.randomUUID();
  cover.dataset.printCoverEdition=edition; cover.dataset.printMaterial=coverMaterial(context);
  const foundation = svgNode('svg', { viewBox: '0 0 210 296', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
  foundation.dataset.printCoverBase = '';

  foundation.append(svgNode('rect', { width: '210', height: '296', fill: '#F6F2E9' }));
  foundation.append(svgNode('rect', { x: '12', y: '12', width: '186', height: '272', fill: 'none', stroke: '#A6824B', 'stroke-width': '.22' }));
  // Compass geometry is drawn once, never reinterpreted by an image generator.
  for (const x of [17, 193]) for (const y of [17, 279]) {
    for (const r of ['3.5', '2', '.6']) foundation.append(svgNode('circle', { cx: String(x), cy: String(y), r, stroke: '#A6824B', 'stroke-width': '.13', fill: 'none' }));
    const points = Array.from({ length: 8 }, (_, i) => `${x + Math.cos(i * Math.PI / 4) * 4.6},${y + Math.sin(i * Math.PI / 4) * 4.6}`);
    foundation.append(svgNode('polygon', { points: [0, 3, 6, 1, 4, 7, 2, 5].map(i => points[i]).join(' '), stroke: '#A6824B', 'stroke-width': '.1', fill: 'none' }));
  }
  for (const y of [12, 284]) {
    foundation.append(svgNode('circle', { cx: '105', cy: String(y), r: '3', fill: '#F6F2E9' }));
    for (const r of ['2', '1']) foundation.append(svgNode('circle', { cx: '105', cy: String(y), r, fill: 'none', stroke: '#A6824B', 'stroke-width': '.15' }));
    foundation.append(svgNode('path', { d: `M101.5 ${y}H108.5 M105 ${y - 3.5}V${y + 3.5}`, stroke: '#A6824B', 'stroke-width': '.13', fill: 'none' }));
  }
  // Generated artwork already has its own composition; preserve its clear margins.
  const generated = preparedCoverIllustration(content);
  const header = document.createElement('header'); header.dataset.printCoverHeader = '';
  const brand = document.createElement('p'); brand.textContent = spec.brand_header; brand.dataset.printCoverBrand = '';
  const collection = document.createElement('p'); collection.textContent = spec.collection_subtitle; collection.dataset.printCoverCollection = '';
  header.append(brand, collection);
  const panel = document.createElement('div'); panel.dataset.printCoverText = '';
  const subject = document.createElement('p'); subject.dataset.printCoverSubject = ''; subject.textContent = spec.subject_title;
  if (subject.textContent.length > 14) cover.dataset.printLongSubject = '';
  const titleBlock = document.createElement('div'); titleBlock.dataset.printCoverTitle = '';
  const heading = document.createElement('h1'); heading.textContent = spec.topic_subtitle;
  titleBlock.append(subject, coverDivider(), heading);
  const art = printCoverArt(context); cover.dataset.printArt = art.key;
  if (generated) cover.dataset.printGenerated = '';
  const illustration = document.createElement('div'); illustration.dataset.printCoverArt = '';
  const plate = document.createElement('div'); plate.dataset.printCoverPlate = '';
  const image = document.createElement('img'); image.dataset.printIllustration = ''; image.src = generated || art.src;
  image.alt = ''; image.setAttribute('aria-hidden', 'true'); plate.append(image);
  for (const [position, vignette] of Object.entries(generated || coverMaterial(context)==='review' ? {} : spec.visual_spec.vignettes)) {
    const caption = document.createElement('p'); caption.dataset.printVignette = position; caption.textContent = vignette.label; plate.append(caption);
  }
  illustration.append(plate);
  const plaque = document.createElement('section'); plaque.dataset.printCoverCartouche = '';
  const plaqueFrame = svgNode('svg', { viewBox: '0 0 160 60', preserveAspectRatio: 'none', 'aria-hidden': 'true' }); plaqueFrame.dataset.printCartoucheFrame = '';
  for (const d of ['M8 2H152Q152 8 158 8V52Q152 52 152 58H8Q8 52 2 52V8Q8 8 8 2Z', 'M9 3.5H151Q151 9 156.5 9V51Q151 51 151 56.5H9Q9 51 3.5 51V9Q9 9 9 3.5Z']) plaqueFrame.append(svgNode('path', { d, fill: 'none', stroke: '#A6824B', 'stroke-width': '.65', 'vector-effect': 'non-scaling-stroke' }));
  for (const [x, y] of [[80, 2], [80, 58], [2, 30], [158, 30]]) plaqueFrame.append(svgNode('path', { d: `M${x} ${y - 1.5}L${x + 1.5} ${y}L${x} ${y + 1.5}L${x - 1.5} ${y}Z`, fill: '#F6F2E9', stroke: '#A6824B', 'stroke-width': '.65', 'vector-effect': 'non-scaling-stroke' }));
  const fields = document.createElement('dl');
  const rows = [
    ['board', 'Banca / prova', spec.exam_board],
    ['keywords', 'Palavras-chave', spec.triad_keywords.join(' · ')],
    ['purpose', 'Objetivo do material', spec.footer_tagline],
    ['scope', data.printWork ? 'Recorte da obra' : 'Subtópico / capítulo', data.printSubtopic || (data.printWork ? 'Obra completa' : undefined)],
  ];
  for (const [key, label, value] of rows) {
    if (!value?.trim()) continue;
    const row = document.createElement('div'); row.dataset.printCoverField = key;
    const term = document.createElement('dt'); term.textContent = label!;
    const description = document.createElement('dd'); description.textContent = value;
    if (key === 'keywords') description.append(coverDivider(true));
    row.append(term, description); fields.append(row);
  }
  if (!data.printBoard?.trim()) fields.dataset.printSingleColumn = '';
  if (heading.textContent.length > 65) cover.dataset.printLongTitle = '';
  if ([heading.textContent, ...rows.map(row => row[2] || '')].join(' ').length > 420) cover.dataset.printDenseCover = '';
  plaque.append(plaqueFrame, fields);
  const signature = document.createElement('p'); signature.dataset.printCoverSignature = ''; signature.textContent = spec.footer_signature;
  panel.append(titleBlock, illustration, plaque, signature); cover.append(foundation, header, panel);

  const toc = document.createElement('section'); toc.dataset.printToc = '';
  const tocHeading = document.createElement('h2'); tocHeading.textContent = 'Sumário';
  const hint = document.createElement('p'); hint.textContent = 'Seções deste material, na ordem de leitura.';
  let headings = [...content.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6, summary')]
    .filter(element => element.textContent?.trim() && !element.closest('[hidden], .hidden'))
    .filter(element => !element.closest('li, table, blockquote, [data-toc-exclude]'));
  if (headings.length > 1 && headings[0].textContent?.trim() === heading.textContent?.trim()) headings.shift();
  if (!headings.length) {
    const fallback = document.createElement('h2'); fallback.textContent = 'Conteúdo do material';
    content.prepend(fallback); headings = [fallback];
  }
  const level = (element: HTMLElement) => Number(element.dataset.headingLevel || (element.tagName === 'SUMMARY' ? 3 : element.tagName[1]));
  const levels = [...new Set(headings.map(level))].sort((a, b) => a - b);
  // Navigation has two semantic levels, independently of document length.
  headings = headings.filter(element => level(element) <= (levels[1] ?? levels[0]));
  const links = document.createElement('ol');
  const occupied = new Set([...content.querySelectorAll('[id]')].map(element => element.id));
  headings.forEach((element, index) => {
    let id = `crivo-print-section-${index + 1}`;
    while (occupied.has(id) || document.getElementById(id)) id += '-entry';
    occupied.add(id);
    // Anchor the heading itself: a zero-height sibling can remain on the previous page.
    if (element.id) id = element.id;
    else element.id = id;
    const item = document.createElement('li');
    item.dataset.tocLevel = String(level(element) === levels[0] ? 1 : 2);
    const link = document.createElement('a'); link.href = `#${id}`; link.textContent = element.textContent!.trim();
    const page = document.createElement('span'); page.dataset.tocPage = id; page.textContent = '…';
    item.append(link, page); links.append(item);
  });
  toc.append(tocHeading, hint, links);
  return { cover, toc };
}
