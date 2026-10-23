import { printCoverFontStyles } from './printCoverFonts';
import { printBodyFontStyles } from './printBodyFonts';

/** Scoped to the temporary print copy; screen themes cannot change paper contrast. */
export const printStyles = `${printCoverFontStyles}\n${printBodyFontStyles}
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: white !important; color: #263c3d !important; height: auto !important; overflow: visible !important; color-scheme: light !important; }
  body { margin: 0 !important; padding: 0 !important; }
  body > :not([data-crivo-print-root]) { display: none !important; }
  [data-crivo-print-root] { display: block !important; position: relative; width: 210mm !important; font: 10.5pt/1.5 Georgia, 'Times New Roman', serif; --text: #263c3d; --dim: #465d5d; --line: #d5c6ab; }
  [data-crivo-print-root], [data-crivo-print-root] * { box-sizing: border-box; box-shadow: none !important; text-shadow: none !important; max-height: none !important; overflow: visible !important; }
  [data-print-content], [data-print-content] * { background: transparent !important; color: #263c3d !important; }
  [data-print-content] { display: block !important; padding: 0 !important; margin: 0 !important; border: 0 !important; overflow-wrap: anywhere; }
  [data-print-cover] { position: relative; display: flex; flex-direction: column; height: 296mm; padding: 20mm 22mm 18mm; break-after: page; overflow: hidden !important; font-family: 'Crivo Cover Serif', Georgia, serif; }
  [data-print-cover], [data-print-cover] * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  [data-print-cover-base] { position: absolute; inset: 0; width: 210mm; height: 296mm; }
  [data-print-cover-header] { position: relative; flex: none; text-align: center; margin-bottom: 5mm; }
  [data-print-cover-brand] { font: 600 20pt/1.1 'Crivo Cover Serif', Georgia, serif; letter-spacing: .32em; color: #1C3028; margin: 0 0 2mm; }
  [data-print-cover-collection] { font: 600 8.5pt/1.4 'Crivo Cover Serif', Georgia, serif; letter-spacing: .22em; color: #3A4A42; margin: 0; }
  [data-print-cover-text] { position: relative; display: flex; flex: 1; flex-direction: column; min-height: 0; text-align: center; overflow-wrap: anywhere; }
  [data-print-cover-title] { flex: none; }
  [data-print-cover-subject] { font: 700 64pt/1.05 'Crivo Cover Display', Georgia, serif; letter-spacing: .035em; text-transform: uppercase; color: #1C3028; margin: 0; }
  [data-print-long-subject] [data-print-cover-subject] { font-size: 34pt; }
  [data-print-cover-divider] { display: block; width: 76%; height: 4mm; margin: 2mm auto; }
  [data-print-material="review"] [data-print-cover-subject], [data-print-material="review"] [data-print-cover-brand] { color: #31546a; }
  [data-print-material="review"] [data-print-cover-collection] { letter-spacing: .3em; color: #76512c; }
  [data-print-cover] h1 { font: 600 15.5pt/1.2 'Crivo Cover Serif', Georgia, serif; letter-spacing: .18em; text-transform: uppercase; color: #7A1F24; margin: 0; }
  [data-print-long-title] h1 { font-size: 13pt; line-height: 1.2; letter-spacing: .03em; }
  [data-print-cover-art] { position: relative; flex: 1; min-height: 30mm; margin: 2mm 0; overflow: hidden !important; }
  [data-print-cover-plate] { position: absolute; top: 0; left: 50%; height: 100%; aspect-ratio: 4 / 5; max-width: 100%; transform: translateX(-50%); }
  [data-print-illustration] { position: absolute; inset: 0; width: 100% !important; height: 100% !important; object-fit: contain; }
  [data-print-vignette] { position: absolute; width: 28%; transform: translateX(-50%); font: italic 11pt/1.1 'Crivo Cover Serif', Georgia, serif; color: #7A1F24; margin: 0; }
  [data-print-vignette="top_left"] { left: 15%; top: 36%; }
  [data-print-vignette="top_right"] { left: 85%; top: 36%; }
  [data-print-vignette="bottom_left"] { left: 15%; top: 94%; }
  [data-print-vignette="bottom_right"] { left: 85%; top: 94%; }
  [data-print-cover-cartouche] { position: relative; flex: none; width: 140mm; max-width: 100%; padding: 4mm 7mm; margin: 0 auto; }
  [data-print-cartouche-frame] { position: absolute; inset: 0; width: 100%; height: 100%; }
  [data-print-cover] dl { position: relative; display: block; margin: 0; }
  [data-print-cover] dl > div { margin: 0 0 1.5mm; }
  [data-print-cover] dl > div:last-child { margin-bottom: 0; }
  [data-print-cover] dt { font: 400 6.5pt/1.1 'Crivo Cover Serif', Georgia, serif; text-transform: uppercase; letter-spacing: .08em; color: #7A1F24; }
  [data-print-cover] dd { font: 400 10pt/1.2 'Crivo Cover Serif', Georgia, serif; color: #1C3028; margin: 1mm 0 0; }
  [data-print-cover-field="board"] dd { font-weight: 600; font-size: 20pt; letter-spacing: .12em; }
  [data-print-cover-field="keywords"] dt { display: none; }
  [data-print-cover-field="keywords"] dd { color: #7A1F24; font-size: 11.5pt; letter-spacing: .05em; }
  [data-print-cover-field="purpose"] dd { font-style: italic; font-size: 11pt; color: #3A4A42; }
  [data-print-cover-signature] { flex: none; font: 600 8pt/1.2 'Crivo Cover Serif', Georgia, serif; letter-spacing: .24em; color: #6E5A3B; margin: 3mm 0 0; }
  [data-print-dense-cover] [data-print-cover-subject] { font-size: 38pt; }
  [data-print-dense-cover] h1 { font-size: 12.5pt; letter-spacing: .01em; }
  [data-print-dense-cover] [data-print-cover-cartouche] { width: 100%; padding-top: 3mm; padding-bottom: 3mm; }
  [data-print-dense-cover] dd { font-size: 9.5pt; }
  [data-print-dense-cover] [data-print-cover-field="board"] dd { font-size: 15pt; }
  [data-print-toc] { min-height: 296mm; padding: 22mm 22mm 18mm; break-after: page; }
  [data-print-toc] h2 { font: normal 25pt/1.2 Georgia, serif; color: #145a60; margin: 0 0 5mm; }
  [data-print-toc] p { color: #465d5d; font-size: 10pt; margin: 0 0 10mm; }
  [data-print-toc] ol { padding: 0 0 0 6mm; margin: 0; }
  [data-print-toc] li { font-size: 11pt; line-height: 1.4; margin: 0 0 3mm; break-inside: avoid; }
  [data-print-toc] a { color: #263c3d; text-decoration: none; overflow-wrap: anywhere; }
  [data-print-toc-columns] ol { columns: 2; column-gap: 12mm; }
  [data-print-toc-columns] li { font-size: 9.5pt; margin-bottom: 2mm; }
  [data-print-anchor] { display: block; height: 0; break-after: avoid; }
  [data-print-layout] { position: relative; z-index: 1; width: 210mm !important; table-layout: fixed; border-collapse: collapse; border-spacing: 0; }
  [data-print-layout] > thead { display: table-header-group; }
  [data-print-layout] > tfoot { display: table-footer-group; }
  [data-print-layout] > thead > tr > td { height: 16mm; padding: 0 !important; border: 0 !important; }
  [data-print-layout] > tfoot > tr > td { height: 16mm; padding: 0 !important; border: 0 !important; }
  [data-print-layout] > tbody > tr { break-inside: auto; }
  [data-print-layout] > tbody > tr > td { vertical-align: top; padding: 0 18mm !important; border: 0 !important; }
  [data-print-brand] { display: block; text-align: center; font: 7pt Georgia, serif; letter-spacing: .12em; color: #466266 !important; }
  [data-print-content] h1, [data-print-content] h2, [data-print-content] h3, [data-print-content] h4, [data-print-content] summary { font-family: Georgia, 'Times New Roman', serif !important; color: #145a60 !important; line-height: 1.25 !important; break-after: avoid; page-break-after: avoid; }
  [data-print-content] h1 { font-size: 23pt !important; margin: 0 0 6mm !important; font-weight: normal !important; }
  [data-print-content] h2 { font-size: 15.5pt !important; margin: 6mm 0 3mm !important; font-weight: normal !important; }
  [data-print-content] h3 { font-size: 14pt !important; margin: 6mm 0 3mm !important; }
  [data-print-content] h4, [data-print-content] summary { font-size: 12pt !important; margin: 5mm 0 2mm !important; }
  [data-print-content] p, [data-print-content] li { font-size: 10.5pt !important; line-height: 1.5 !important; orphans: 3; widows: 3; }
  [data-print-content] p { margin: 0 0 3mm !important; }
  [data-print-content] section, [data-print-content] details { display: block !important; margin: 0 0 4mm !important; padding: 0 !important; border: 0 !important; }
  [data-print-content] summary { list-style: none; }
  [data-print-content] summary::-webkit-details-marker { display: none; }
  [data-print-content] ul, [data-print-content] ol { margin: 3mm 0 4mm !important; padding-left: 6mm !important; }
  [data-print-content] ul { list-style: disc; } [data-print-content] ol { list-style: decimal; }
  [data-print-content] li { margin-bottom: 2mm; }
  [data-print-content] blockquote { border-left: .6pt solid #b8c7c4 !important; padding: 1mm 0 1mm 5mm !important; margin: 3mm 0 !important; }
  [data-print-content] a { color: #145a60 !important; text-decoration: underline; }
  [data-print-content] pre { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 9pt !important; }
  [data-print-content] img, [data-print-content] svg { max-width: 100% !important; height: auto; break-inside: avoid; }
  [data-print-content] table { width: 100% !important; border-collapse: collapse; font-size: 9pt !important; }
  [data-print-content] th, [data-print-content] td { border: .5pt solid #c9b58e; padding: 2mm; vertical-align: top; }
  [data-print-content] thead { display: table-header-group; }
  [data-print-content] tr { break-inside: avoid; }
  [data-print-content] button, [data-print-content] select, [data-print-content] input, [data-print-content] textarea, [data-print-content] audio, [data-print-content] nav { display: none !important; }
  /* Content units may flow; only small related units request an intact break. */
  /* A 210mm ancestor on the narrower named index page makes Chromium shrink
     the entire PDF, including its cover and body. Each page owns its width. */
  [data-crivo-print-root] { display: contents !important; width: auto !important; }
  [data-crivo-print-root], [data-print-content] h1, [data-print-content] h2,
  [data-print-content] h3, [data-print-content] h4, [data-print-content] h5,
  [data-print-content] h6, [data-print-content] summary, [data-print-toc] h2,
  [data-print-brand] { font-family: 'Liberation Serif', Georgia, 'Times New Roman', serif !important; }
  [data-print-content] div, [data-print-content] section, [data-print-content] details,
  [data-print-content] blockquote, [data-print-content] ul, [data-print-content] ol {
    display: block !important; break-inside: auto !important; height: auto !important; min-height: 0 !important;
  }
  [data-print-content] p, [data-print-content] li { white-space: normal; }
  [data-print-content] strong, [data-print-content] b { font-weight: 700; }
  [data-print-content] h1, [data-print-content] h2, [data-print-content] h3,
  [data-print-content] h4, [data-print-content] h5, [data-print-content] h6,
  [data-print-content] summary { break-inside: avoid; break-after: avoid; }
  [data-print-content] p:has(+ ul), [data-print-content] p:has(+ ol) { break-after: avoid; }
  [data-print-content] li { break-inside: auto; }
  [data-print-content] [data-print-answer-key] { break-before: page !important; }
  [data-print-content] [data-print-keep] { break-inside: avoid !important; }
  [data-print-content] [data-print-split] { break-inside: auto !important; }
  [data-print-content] table { min-width: 0 !important; table-layout: fixed; break-inside: auto; }
  [data-print-content] th, [data-print-content] td { overflow-wrap: anywhere; }
  [data-print-content] tbody { break-inside: auto; }
  [data-print-content] thead { break-inside: avoid; break-after: avoid; }
  [data-print-content] math, [data-print-content] .katex { break-inside: avoid; white-space: nowrap; }
  [data-print-content] .katex-display { break-inside: avoid !important; }
  [data-print-content] figure { margin: 3mm 0; break-inside: avoid; }
  [data-print-content] figcaption { break-before: avoid; }
  [data-print-content] img, [data-print-content] svg { max-height: 245mm !important; object-fit: contain; }
  @page crivo-toc { size: A4; margin: 20mm 22mm; }
  [data-print-toc] { page: crivo-toc; min-height: 0; padding: 0; break-inside: auto; }
  [data-print-toc] h2, [data-print-toc] > p { break-after: avoid; }
  [data-print-toc] ol { list-style: none; padding: 0; columns: auto; }
  [data-print-toc] li { display: flex; align-items: baseline; gap: 3mm; }
  [data-print-toc] li[data-toc-level="2"] { padding-left: 6mm; font-size: 10pt; }
  [data-print-toc] li[data-toc-level="1"]:has(+ li[data-toc-level="2"]) { break-after: avoid; }
  [data-print-toc] a { flex: 1; }
  [data-toc-page] { flex: none; width: 9mm; text-align: right; font-variant-numeric: tabular-nums; }
}`;
