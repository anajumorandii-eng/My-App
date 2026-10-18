/** Scoped to the temporary print copy; screen themes cannot change paper contrast. */
export const printStyles = `@media print {
  @page { size: A4; margin: 0; }
  html, body { background: white !important; color: #263c3d !important; height: auto !important; overflow: visible !important; color-scheme: light !important; }
  body { margin: 0 !important; padding: 0 !important; }
  body > :not([data-crivo-print-root]) { display: none !important; }
  [data-crivo-print-root] { display: block !important; position: relative; width: 210mm !important; font: 10.5pt/1.5 Georgia, 'Times New Roman', serif; --text: #263c3d; --dim: #465d5d; --line: #d5c6ab; }
  [data-crivo-print-root], [data-crivo-print-root] * { box-sizing: border-box; box-shadow: none !important; text-shadow: none !important; max-height: none !important; overflow: visible !important; }
  [data-print-content], [data-print-content] * { background: transparent !important; color: #263c3d !important; }
  [data-print-content] { display: block !important; padding: 0 !important; margin: 0 !important; border: 0 !important; overflow-wrap: anywhere; }
  [data-print-frame] { display: block !important; position: fixed; top: 0; left: 0; width: 210mm !important; height: 297mm !important; max-width: none !important; object-fit: fill; opacity: .18; z-index: 0; }
  [data-print-veil] { position: fixed; top: 0; left: 0; width: 210mm !important; height: 297mm !important; z-index: 0; }
  [data-print-layout] { position: relative; z-index: 1; width: 210mm !important; table-layout: fixed; border-collapse: collapse; border-spacing: 0; }
  [data-print-layout] > thead { display: table-header-group; }
  [data-print-layout] > tfoot { display: table-footer-group; }
  [data-print-layout] > thead > tr > td { height: 16mm; padding: 0 !important; border: 0 !important; }
  [data-print-layout] > tfoot > tr > td { height: 16mm; padding: 0 !important; border: 0 !important; }
  [data-print-layout] > tbody > tr { break-inside: auto; }
  [data-print-layout] > tbody > tr > td { vertical-align: top; padding: 0 18mm !important; border: 0 !important; }
  [data-print-brand] { position: fixed; z-index: 1; bottom: 5mm; left: 0; width: 210mm; text-align: center; font: 7pt Georgia, serif; letter-spacing: .12em; color: #466266 !important; }
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
}`;
