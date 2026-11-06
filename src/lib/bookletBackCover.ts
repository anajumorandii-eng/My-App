import { PDFDict, PDFName, PDFNumber, PDFRawStream, PDFRef, StandardFonts, rgb, pushGraphicsState, translate, scale as scaleOperator, drawObject, popGraphicsState, type PDFDocument } from 'pdf-lib';

/** Reutiliza o XObject da ilustração, inclusive sua transparência; não rasteriza a página da capa. */
function coverIllustration(document: PDFDocument) {
  let best: { ref: PDFRef; area: number; width: number; height: number } | undefined;
  const visited = new Set<unknown>();
  const visit = (resources: PDFDict | undefined, depth: number) => {
    if (!resources || depth > 6 || visited.size > 256 || visited.has(resources)) return;
    visited.add(resources);
    const objects = resources.lookupMaybe(PDFName.of('XObject'), PDFDict);
    if (!objects) return;
    for (const [, ref] of objects.entries()) {
      if (!(ref instanceof PDFRef)) continue;
      const object = document.context.lookup(ref);
      if (!(object instanceof PDFRawStream)) continue;
      const subtype = object.dict.get(PDFName.of('Subtype'));
      if (subtype === PDFName.of('Image')) {
        const width = object.dict.lookupMaybe(PDFName.of('Width'), PDFNumber)?.asNumber() ?? 0;
        const height = object.dict.lookupMaybe(PDFName.of('Height'), PDFNumber)?.asNumber() ?? 0;
        if (width * height > (best?.area ?? 0)) best = { ref, area: width * height, width, height };
      } else if (subtype === PDFName.of('Form')) visit(object.dict.lookupMaybe(PDFName.of('Resources'), PDFDict), depth + 1);
    }
  };
  visit(document.getPage(0).node.Resources(), 0);
  return best;
}

/** Contracapa coordenada com a edição: arte original, outra hierarquia e acabamento vetorial. */
export async function appendBookletBackCover(document: PDFDocument) {
  const art = coverIllustration(document);
  const { width, height } = document.getPage(0).getSize();
  const page = document.addPage([width, height]);
  const serif = await document.embedFont(StandardFonts.TimesRoman);
  const italic = await document.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await document.embedFont(StandardFonts.Helvetica);
  const paper = rgb(246/255,242/255,233/255), forest = rgb(28/255,48/255,40/255), gold = rgb(166/255,130/255,75/255), wine = rgb(122/255,31/255,36/255);
  const unit = width / 595.28;
  const center = (text: string, y: number, size: number, font = serif, color = forest) => page.drawText(text, { x: (width - font.widthOfTextAtSize(text, size * unit)) / 2, y: y * height, size: size * unit, font, color });
  page.drawRectangle({ x: 0, y: 0, width, height, color: paper });
  for (const inset of [34, 39]) page.drawRectangle({ x: inset * unit, y: inset * unit, width: width - 2 * inset * unit, height: height - 2 * inset * unit, borderColor: gold, borderWidth: (inset === 34 ? .6 : .2) * unit });
  for (const x of [43 * unit, width - 43 * unit]) for (const y of [43 * unit, height - 43 * unit]) {
    for (const r of [7, 4, 1.2]) page.drawCircle({ x, y, size: r * unit, borderColor: gold, borderWidth: .35 * unit });
    for (let index = 0; index < 8; index++) { const angle = index * Math.PI / 4; page.drawLine({ start: { x: x + Math.cos(angle) * 5 * unit, y: y + Math.sin(angle) * 5 * unit }, end: { x: x + Math.cos(angle) * 10 * unit, y: y + Math.sin(angle) * 10 * unit }, color: gold, thickness: .3 * unit }); }
  }
  center('C R I V O', .882, 27);
  center('CADERNOS DE ESTUDO', .851, 7.5, sans, gold);
  page.drawLine({ start: { x: width * .35, y: height * .818 }, end: { x: width * .65, y: height * .818 }, color: gold, thickness: .5 * unit });
  if (art) {
    const scale = Math.min(width * .67 / art.width, height * .52 / art.height);
    const w = art.width * scale, h = art.height * scale;
    const name = page.node.newXObject('BookletIllustration', art.ref);
    page.pushOperators(pushGraphicsState(), translate((width - w) / 2, height * .29 + (height * .52 - h) / 2), scaleOperator(w, h), drawObject(name), popGraphicsState());
  } else {
    // O texto continua imprimível mesmo quando a capa de origem não contém imagem.
    page.drawCircle({ x: width / 2, y: height * .55, size: 58 * unit, borderColor: gold, borderWidth: .6 * unit });
    center('C', .527, 58, italic);
  }
  for (const side of [-1, 1]) page.drawLine({ start: { x: width * .5 + side * 10 * unit, y: height * .255 }, end: { x: width * .5 + side * 118 * unit, y: height * .255 }, color: gold, thickness: .45 * unit });
  page.drawCircle({ x: width / 2, y: height * .255, size: 2.3 * unit, borderColor: gold, borderWidth: .6 * unit });
  center('Recordar · Conectar · Aplicar', .205, 14, italic, wine);
  center('Conhecimento que se constrói.', .164, 10, serif);
  center('CRIVO · MATERIAL DE ESTUDO', .079, 7, sans, gold);
  return { hasArtwork: Boolean(art) };
}
