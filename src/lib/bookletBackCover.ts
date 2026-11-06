import { StandardFonts, rgb, type PDFDocument } from 'pdf-lib';

/** Contracapa coordenada com a edição: segunda arte, outra hierarquia e acabamento vetorial. */
export async function appendBookletBackCover(document: PDFDocument, illustration?: Uint8Array) {
  const art = illustration ? await document.embedPng(illustration) : undefined;
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
    const scale = Math.min(width * .87 / art.width, height * .58 / art.height);
    const w = art.width * scale, h = art.height * scale;
    page.drawImage(art, { x: (width - w) / 2, y: height * .255 + (height * .58 - h) / 2, width: w, height: h });
  } else {
    // Uso local sem segunda arte: acabamento tipográfico, sem duplicar a imagem da frente.
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
