import { figureInk, figureSerif } from './figureInk';

/** The heavy layout library is loaded only for a chemical structure. */
export async function drawStudyMolecule(svg: SVGSVGElement, smiles: string, label: string) {
  const {default: drawer} = await import('smiles-drawer');
  const SvgDrawer = drawer.SvgDrawer;
  const tree = await new Promise<Parameters<InstanceType<typeof SvgDrawer>['draw']>[0]>((resolve,reject) => drawer.parse(smiles,resolve,reject));
  // Tinta e serifa da casa no lugar do tema padrão da biblioteca (Helvetica,
  // vermelho e azul puros, fundo branco), que destoava das cenas do Visual.
  const { ink, oxygen, nitrogen, sulfur, halogen } = figureInk;
  new SvgDrawer({width:400,height:200,bondThickness:1.4,padding:18,explicitHydrogens:true,compactDrawing:false,terminalCarbons:true,fontFamily:figureSerif,themes:{crivo:{FOREGROUND:ink,BACKGROUND:'transparent',C:ink,H:ink,O:oxygen,N:nitrogen,F:halogen,CL:halogen,BR:halogen,I:halogen,P:sulfur,S:sulfur,B:sulfur,SI:sulfur}}}).draw(tree,svg,'crivo');
  for(const style of svg.querySelectorAll('style')) style.textContent=style.textContent?.replace(/\.(element|sub)\b/g,`#${svg.id} .$1`)||'';
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label',`Estrutura de ${label}`);
  const viewBox=svg.viewBox.baseVal;
  svg.style.width=`${Math.min(360,Math.max(72,viewBox.width*1.4))}px`;
  svg.style.maxWidth='100%'; svg.style.height='auto';
}
