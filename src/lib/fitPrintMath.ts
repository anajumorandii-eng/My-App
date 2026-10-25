/** Runs after embedded fonts load, in the isolated PDF document. */
export function fitPrintMath() {
 for(const math of document.querySelectorAll<HTMLElement>('[data-print-content] .katex')) {
  const container=math.closest<HTMLElement>('td,th,p,li,figure,[data-print-content]');
  const visual=math.querySelector<HTMLElement>('.katex-html');
  if(!container||!visual)continue;
  const style=getComputedStyle(container);
  const available=container.clientWidth-parseFloat(style.paddingLeft||'0')-parseFloat(style.paddingRight||'0');
  const width=Math.max(visual.getBoundingClientRect().width,visual.scrollWidth);
  if(available>0&&width>available){
   math.style.fontSize=`${parseFloat(getComputedStyle(math).fontSize)*(available-2)/width}px`;
   math.dataset.printMathFitted='';
  }
 }
}
