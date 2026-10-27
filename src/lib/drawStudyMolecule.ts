/** The heavy layout library is loaded only for a chemical structure. */
export async function drawStudyMolecule(svg: SVGSVGElement, smiles: string, label: string) {
  const {default: drawer} = await import('smiles-drawer');
  const SvgDrawer = drawer.SvgDrawer;
  const tree = await new Promise<Parameters<InstanceType<typeof SvgDrawer>['draw']>[0]>((resolve,reject) => drawer.parse(smiles,resolve,reject));
  new SvgDrawer({width:400,height:220,bondThickness:1.5,padding:8,explicitHydrogens:true,compactDrawing:false,terminalCarbons:true,themes:{light:{FOREGROUND:'#263b32',BACKGROUND:'#ffffff',C:'#263b32',H:'#37443e',O:'#a12c31',N:'#245b86',F:'#246642',CL:'#246642',BR:'#93410e',I:'#743a89',P:'#93410e',S:'#756000',B:'#93410e',SI:'#93410e'}}}).draw(tree,svg,'light');
  for(const style of svg.querySelectorAll('style')) style.textContent=style.textContent?.replace(/\.(element|sub)\b/g,`#${svg.id} .$1`)||'';
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label',`Estrutura de ${label}`);
  const viewBox=svg.viewBox.baseVal;
  svg.style.width=`${Math.min(400,Math.max(60,viewBox.width*1.15))}px`;
  svg.style.maxWidth='100%'; svg.style.height='auto'; svg.style.margin='0 auto';
}
