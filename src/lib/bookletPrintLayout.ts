/** Páginas já compostas no tamanho final da dobra, com texto de 12 pt. */
export const bookletPrintLayout = `
@media print {
 @page { size: 148.5mm 210mm; margin: 0; }
 @page crivo-toc { size: 148.5mm 210mm; margin: 12mm; }
 [data-print-booklet-source] { font-size: 12pt !important; }
 [data-print-booklet-source] [data-print-cover] { height: 209mm; width: auto; padding: 12mm; font-size: 12pt; }
 [data-print-booklet-source] [data-print-layout] { width: 148.5mm !important; }
 [data-print-booklet-source] [data-print-layout] > thead > tr > td,
 [data-print-booklet-source] [data-print-layout] > tfoot > tr > td { height: 12mm; }
 [data-print-booklet-source] [data-print-layout] > tbody > tr > td { padding: 0 12mm !important; }
 [data-print-booklet-source] [data-print-content] { font-size: 12pt !important; }
 [data-print-booklet-source] [data-print-content] p,
 [data-print-booklet-source] [data-print-content] li { font-size: 12pt !important; line-height: 1.5 !important; }
 [data-print-booklet-source] [data-print-content] :is(table, th, td) { font-size: 10.5pt !important; }
 [data-print-booklet-source] [data-print-content] pre { font-size: 10.5pt !important; }
 [data-print-booklet-source] [data-print-content] :is(img, svg) { max-height: 175mm !important; }
 [data-print-booklet-source] [data-print-toc] { padding: 0; }
 [data-print-booklet-source] [data-print-toc] ol { columns: auto; }
 [data-print-booklet-source] [data-print-toc] li { font-size: 11pt; line-height: 1.4; }
 [data-print-booklet-source] [data-print-toc] li[data-toc-level="2"] { font-size: 10.5pt; }
 [data-print-booklet-source] [data-print-toc] > p { font-size: 10.5pt; }
 [data-print-booklet-source] [data-print-content] .crivo-reaction { flex-wrap: wrap !important; }
}
`;
