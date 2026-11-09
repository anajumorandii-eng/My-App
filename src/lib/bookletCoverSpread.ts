import { rgb, pushGraphicsState, rectangle, clip, endPath, popGraphicsState, type PDFPage, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { PNG } from 'pdf-lib/cjs/utils/png.js';
import type { PrintCoverContext } from './printCoverSpec';
import { bookletCoverLayout as layout, fitBookletArtwork } from './bookletCoverLayout';

export interface BookletCoverFonts { serif: Uint8Array; display: Uint8Array; italic: Uint8Array; text: Uint8Array; }

/** Uma única imagem atravessa a dobra; os títulos continuam texto nativo. */
export async function drawBookletCoverSpread(page: PDFPage, illustration: Uint8Array, context: PrintCoverContext, fonts: BookletCoverFonts) {
  const document = page.doc;
  document.registerFontkit(fontkit);
  const art = await document.embedPng(illustration);
  if (art.width <= art.height) throw new Error('A arte das capas precisa ser panorâmica. Tente gerar o livreto novamente.');
  const { width, height } = page.getSize(), half = width / 2;
  // Usa o mesmo leitor PNG da incorporação para medir a arte, sem cortar ou editar seus pixels.
  const png = PNG.load(illustration);
  const fit = fitBookletArtwork(png.alphaChannel, png.width, png.height, width);
  // A incorporação integral mantém os contornos após espaços nas fontes da identidade.
  const serif = await document.embedFont(fonts.serif);
  const bold = await document.embedFont(fonts.display);
  const italic = await document.embedFont(fonts.italic);
  const sans = await document.embedFont(fonts.text);
  const paper = rgb(246/255,242/255,233/255), ink = rgb(28/255,48/255,40/255), gold = rgb(166/255,130/255,75/255), wine = rgb(122/255,31/255,36/255);
  // Os metadados do PDF comum permanecem intactos. A tipografia da nova capa usa o alfabeto da fonte nativa.
  const printable = (text: string, font: PDFFont) => [...text.normalize('NFC').replace(/[\r\n\t]+/g, ' ')].map(char => font.getCharacterSet().includes(char.codePointAt(0)!) ? char : '?').join('');
  const centered = (text: string, center: number, y: number, size: number, font = serif, color = ink, maxWidth = half - 50) => {
    const value = printable(text, font);
    const fit = Math.min(size, size * maxWidth / Math.max(1, font.widthOfTextAtSize(value, size)));
    page.drawText(value, { x: center - font.widthOfTextAtSize(value, fit) / 2, y, size: fit, font, color });
  };
  const wrapped = (text: string, center: number, top: number, font: PDFFont, size: number, maxWidth: number, maxLines: number, color = ink) => {
    const words = printable(text, font).split(/\s+/).filter(Boolean), lines: string[] = [];
    let line = '';
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) { lines.push(line); line = word; }
      else line = candidate;
    }
    if (line) lines.push(line);
    const visible = lines.slice(0, maxLines);
    if (lines.length > maxLines) visible[maxLines - 1] = visible[maxLines - 1].replace(/\s+\S+$/, '') + '…';
    visible.forEach((value, index) => centered(value, center, top - index * size * 1.4, size, font, color, maxWidth));
  };
  page.drawRectangle({ x: -1, y: -1, width: width + 2, height: height + 2, color: paper });
  // Molduras comuns e alinhadas; a arte passa por cima do filete central.
  for (const inset of [16, 20]) {
    page.drawRectangle({ x: inset, y: inset, width: width - 2 * inset, height: height - 2 * inset, borderColor: gold, borderWidth: inset === 16 ? .5 : .2 });
    page.drawLine({ start: { x: half + inset - 18, y: inset }, end: { x: half + inset - 18, y: height - inset }, color: gold, thickness: .25 });
  }
  for (const x of [25, half - 9, half + 9, width - 25]) for (const y of [25, height - 25]) {
    for (const r of [4, 1.5]) page.drawCircle({ x, y, size: r, borderColor: gold, borderWidth: .3 });
    for (let i = 0; i < 8; i++) { const angle = i * Math.PI / 4; page.drawLine({ start: { x: x + Math.cos(angle) * 3, y: y + Math.sin(angle) * 3 }, end: { x: x + Math.cos(angle) * 6, y: y + Math.sin(angle) * 6 }, color: gold, thickness: .25 }); }
  }
  centered('C R I V O', half / 2, height * .87, 20);
  centered('C R I V O', half * 1.5, height - 51, 17);
  const collection = /^revis[aã]o/i.test(context.purpose || '') ? 'CADERNOS DE REVISÃO' : 'CADERNOS DE ESTUDO';
  centered(collection, half * 1.5, height - 69, 6.5, sans, gold);
  centered((context.subject || 'CRIVO').toLocaleUpperCase('pt-BR'), half * 1.5, height * .78, 52, bold);
  const topic = [context.work || context.topic, context.subtopic && !/^(vis[aã]o geral|obra completa|t[oó]pico completo)$/i.test(context.subtopic) ? context.subtopic : ''].filter(Boolean).join(' · ');
  wrapped(topic.toLocaleUpperCase('pt-BR'), half * 1.5, height * .72, sans, 12, half - 150, 2, wine);
  for (const center of [half / 2, half * 1.5]) page.drawLine({ start: { x: center - 85, y: height * (center < half ? .826 : .752) }, end: { x: center + 85, y: height * (center < half ? .826 : .752) }, color: gold, thickness: .45 });
  // Duas massas verticais em posições próprias; só um detalhe delicado cruza a dobra.
  // A camada de arte usa as coordenadas da capa aberta inteira, sem achatamento em faixa.
  // A arte ocupa a folha inteira; mesmo uma saída opaca não pode apagar os títulos.
  // As regiões se encontram na dobra, mantendo a conexão sem reduzir cada lado.
  page.pushOperators(
    pushGraphicsState(),
    rectangle(layout.frameInset, height * (1 - layout.artworkBottom), half - layout.frameInset, height * (layout.artworkBottom - layout.leftArtworkTop)),
    rectangle(half, height * (1 - layout.artworkBottom), half - layout.frameInset, height * (layout.artworkBottom - layout.rightArtworkTop)),
    clip(), endPath(),
  );
  page.drawImage(art, { x: width * fit.left, y: height * (1 - fit.top - fit.scale), width: width * fit.scale, height: height * fit.scale });
  page.pushOperators(popGraphicsState());
  for (const center of [half / 2, half * 1.5]) {
    page.drawLine({ start: { x: center - 103, y: height * .143 }, end: { x: center + 103, y: height * .143 }, color: gold, thickness: .4 });
    centered('CRIVO · MATERIAL DE ESTUDO', center, 36, 5.5, sans, gold);
  }
  centered('Conhecimento que se constrói.', half / 2, height * .10, 14, italic, wine);
  centered('Recordar · Conectar · Aplicar', half * 1.5, height * .10, 14, italic, wine);
  wrapped([context.board, context.purpose].filter(Boolean).join(' · '), half * 1.5, 42, sans, 6, half - 65, 2);
}
