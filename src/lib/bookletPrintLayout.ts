/** Páginas já compostas no tamanho final da dobra, com texto de 11 pt. */
export const bookletPrintLayout = `
@media print {
 @page { size: 148.5mm 210mm; margin: 0; }
 [data-print-booklet-source] { font-size: 11pt !important; }
 [data-print-booklet-source] [data-print-cover] { height: 209mm; width: auto; padding: 12mm; font-size: 11pt; }
 [data-print-booklet-source] [data-print-layout] { width: 148.5mm !important; }
 [data-print-booklet-source] [data-print-layout] > thead > tr > td,
 [data-print-booklet-source] [data-print-layout] > tfoot > tr > td { height: 10mm; }
 [data-print-booklet-source] [data-print-layout] > tbody > tr > td { padding: 0 10mm !important; }
 [data-print-booklet-source] [data-print-content] { font-size: 11pt !important; }
 [data-print-booklet-source] [data-print-content] p,
 [data-print-booklet-source] [data-print-content] li { font-size: 11pt !important; line-height: 1.3 !important; orphans: 2; widows: 2; }
 [data-print-booklet-source] [data-print-content] p { margin: 0 0 1.6mm !important; }
 [data-print-booklet-source] [data-print-content] h1 { margin: 0 0 3mm !important; }
 [data-print-booklet-source] [data-print-content] :is(h2, h3) { margin: 3mm 0 1.5mm !important; }
 [data-print-booklet-source] [data-print-content] :is(h4, summary) { margin: 2.5mm 0 1mm !important; }
 [data-print-booklet-source] [data-print-content] :is(ul, ol) { margin: 1.5mm 0 2mm !important; }
 [data-print-booklet-source] [data-print-content] li { margin-bottom: .8mm; }
 [data-print-booklet-source] [data-print-content] :is(section, details, figure, .crivo-figure) { margin-bottom: 2mm !important; }
 [data-print-booklet-source] [data-print-content] :is(th, td) { padding: 1.3mm 1.6mm; }
 [data-print-booklet-source] [data-print-content] :is(table, th, td) { font-size: 10.5pt !important; }
 [data-print-booklet-source] [data-print-content] pre { font-size: 10.5pt !important; }
 [data-print-booklet-source] [data-print-content] :is(img, svg) { max-height: 175mm !important; }
 [data-print-booklet-source] [data-print-toc] { page: auto; min-height: 0; padding: 0; margin: 0 0 4mm; break-after: auto; }
 [data-print-booklet-source] [data-print-toc] h2 { font-size: 16pt; margin: 0 0 2mm; }
 [data-print-booklet-source] [data-print-toc] > p { display: none; }
 [data-print-booklet-source] [data-print-toc] ol { columns: auto; }
 [data-print-booklet-source] [data-print-toc] li { font-size: 10.5pt; line-height: 1.15; margin: 0 0 .6mm; gap: 2mm; }
 [data-print-booklet-source] [data-print-toc] li[data-toc-level="2"] { font-size: 10.5pt; padding-left: 3mm; }
 [data-print-booklet-source] [data-toc-page] { width: 7mm; }
 [data-print-booklet-source] [data-print-content] [data-print-answer-key] { break-before: auto !important; }
 [data-print-booklet-source] [data-print-content] .crivo-reaction { flex-wrap: wrap !important; }
}
`;
