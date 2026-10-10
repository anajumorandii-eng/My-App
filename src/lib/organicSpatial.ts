import type { Atom, Bond } from '../views/visual-instruments/ScienceObjectView';
import type { SpatialPoint } from './spatialSolid';
import { MOLECULAS } from './geometriaMolecular';

type Element = 'C' | 'O' | 'N' | 'Br' | 'H';
type Site = { element: Element; point: SpatialPoint };
type Edge = [number, number, number];
export type OrganicCase = 'ethane'|'propane'|'butane'|'branched'|'ethanol'|'secondary'|'tertiary'|'ethanal'|'acetone'|'acid'|'ether'|'amine'|'ethene'|'bromoethane'|'glycol'|'polymer';
export interface OrganicModel { name: string; formula: string; group: string; sites: Site[]; edges: Edge[]; atoms: Atom[]; bonds: Bond[]; }

export function organicSpatial(kind: OrganicCase, units = 3): OrganicModel {
  let sites: Site[] = [], edges: Edge[] = [], name='', formula='',group='';
  const add=(element:Element,point:SpatialPoint)=>{sites.push({element,point});return sites.length-1;};
  const chain=(n:number)=>{for(let i=0;i<n;i++){add('C',[(i-(n-1)/2)*42,(i%2?1:-1)*15,0]);if(i)edges.push([i-1,i,1]);}};
  if (kind==='secondary'||kind==='tertiary') {
    add('C',[0,0,0]);
    const directions=MOLECULAS.CH4.ligacoes;
    const count=kind==='secondary'?2:3;
    for(let i=0;i<count;i++)edges.push([0,add('C',directions[i].map(v=>v*48) as SpatialPoint),1]);
    edges.push([0,add('O',directions[3].map(v=>v*48) as SpatialPoint),1]);
    name=kind==='secondary'?'propan-2-ol':'2-metilpropan-2-ol';formula=kind==='secondary'?'C₃H₈O':'C₄H₁₀O';group=kind==='secondary'?'álcool secundário: carbono do OH ligado a 2 carbonos':'álcool terciário: carbono do OH ligado a 3 carbonos';
  } else if (kind==='ethane'||kind==='propane'||kind==='butane'||kind==='branched'||kind==='polymer') {
    const n=kind==='ethane'?2:kind==='propane'||kind==='branched'?3:kind==='butane'?4:2*Math.max(2,Math.min(4,units));chain(n);
    if(kind==='branched'){const i=add('C',[0,36,39]);edges.push([1,i,1]);name='2-metilpropano';formula='C₄H₁₀';group='cadeia ramificada';}
    else {name=kind==='ethane'?'etano':kind==='propane'?'propano':kind==='butane'?'butano':'fragmento de polietileno';formula=kind==='ethane'?'C₂H₆':kind==='propane'?'C₃H₈':kind==='butane'?'C₄H₁₀':'(−CH₂−CH₂−)ₙ';group=kind==='polymer'?'unidade repetitiva — cadeia continua nas bordas':'alcano de cadeia normal';}
  } else if(kind==='ethene'||kind==='glycol') {
    add('C',[-26,0,0]);add('C',[26,0,0]);edges.push([0,1,kind==='ethene'?2:1]);
    if(kind==='glycol'){edges.push([0,add('O',[-45,42,0]),1],[1,add('O',[45,-42,0]),1]);name='etano-1,2-diol';formula='C₂H₆O₂';group='duas hidroxilas em carbonos saturados';}
    else{name='eteno';formula='C₂H₄';group='alceno — uma ligação dupla';}
  } else if(kind==='ether') {
    add('O',[0,0,0]);add('C',[-42,-22,0]);add('C',[42,-22,0]);edges.push([0,1,1],[0,2,1]);name='metoximetano';formula='C₂H₆O';group='éter — C−O−C, sem O−H';
  } else if(kind==='acetone') {
    add('C',[0,0,0]);add('C',[-43,-25,0]);add('C',[43,-25,0]);add('O',[0,50,0]);edges.push([0,1,1],[0,2,1],[0,3,2]);name='propanona';formula='C₃H₆O';group='cetona — carbonila entre carbonos';
  } else {
    add('C',[-30,-12,0]);add('C',[14,12,0]);edges.push([0,1,1]);
    if(kind==='ethanol'){add('O',[48,-21,0]);edges.push([1,2,1]);name='etanol';formula='C₂H₆O';group='álcool — OH em carbono saturado';}
    if(kind==='amine'){add('N',[48,-21,0]);edges.push([1,2,1]);name='etanamina';formula='C₂H₇N';group='amina primária — NH₂ ligado à cadeia';}
    if(kind==='bromoethane'){add('Br',[48,-21,0]);edges.push([1,2,1]);name='bromoetano';formula='C₂H₅Br';group='haleto orgânico — ligação C−Br';}
    if(kind==='ethanal'||kind==='acid'){add('O',[14,61,0]);edges.push([1,2,2]);name=kind==='ethanal'?'etanal':'ácido etanoico';formula=kind==='ethanal'?'C₂H₄O':'C₂H₄O₂';group=kind==='ethanal'?'aldeído — carbonila terminal com H':'ácido carboxílico — C(=O)−OH';if(kind==='acid'){add('O',[56,-12,0]);edges.push([1,3,1]);}}
  }
  // O−H/N−H são explícitos; os H ligados a C são omitidos na representação de bastões.
  const valence: Record<Element,number>={C:4,O:2,N:3,Br:1,H:1};
  for(let i=0;i<sites.length;i++){
    const s=sites[i];if(s.element!=='O'&&s.element!=='N')continue;
    const degree=edges.reduce((n,[a,b,k])=>n+(a===i||b===i?k:0),0);
    for(let h=0;h<valence[s.element]-degree;h++){const j=add('H',[s.point[0]+25,s.point[1]+(h?24:-18),s.point[2]+(h?24:0)]);edges.push([i,j,1]);}
  }
  const extent=Math.max(...sites.flatMap(s=>s.point.map(Math.abs))),scale=Math.min(2.1,102/Math.max(1,extent));
  sites=sites.map(s=>({...s,point:s.point.map(v=>v*scale) as SpatialPoint}));
  let carbon=0;
  const atoms:Atom[]=sites.map(s=>({point:s.point,label:s.element==='C'?`C${++carbon}`:s.element,radius:s.element==='H'?7:13,kind:s.element==='O'?'central':s.element==='N'?'backbone':s.element==='H'?'free':'ligand'}));
  const bonds:Bond[]=edges.map(([a,b,count])=>({from:sites[a].point,to:sites[b].point,count}));
  if(kind==='polymer'){
    const a=sites[0].point,b=sites[sites.length-1].point;
    bonds.push({from:a,to:[a[0]-20,a[1]+12,0]},{from:b,to:[b[0]+20,b[1]-12,0]});
  }
  return {name,formula,group,sites,edges,atoms,bonds};
}

/** Dois H₂O: geometria angular e uma ligação de hidrogênio O−H···O. */
export function waterPair(distance = 70) {
  const angle=104.5*Math.PI/180,length=30;
  const points:SpatialPoint[]=[[0,0,0],[length,0,0],[length*Math.cos(angle),length*Math.sin(angle),0], [distance,0,0],[distance+length*Math.cos(angle/2),length*Math.sin(angle/2),0],[distance+length*Math.cos(angle/2),-length*Math.sin(angle/2),0]];
  const center=(points[0][0]+points[3][0])/2;
  const shifted=points.map(p=>[p[0]-center,p[1],p[2]] as SpatialPoint);
  const atoms:Atom[]=shifted.map((point,i)=>({point,label:i%3===0?'O':'H',radius:i%3===0?14:8,kind:i%3===0?'central':'free'}));
  const bonds:Bond[]=[[0,1],[0,2],[3,4],[3,5]].map(([a,b])=>({from:shifted[a],to:shifted[b]}));
  bonds.push({from:shifted[1],to:shifted[3],kind:'hydrogen'});
  return {atoms,bonds,angle:104.5,distance};
}

/** Colar esquemático com igual número de nucleossomos; condensação muda a organização. */
export function chromatinSpatial(compaction:number) {
  const centers:SpatialPoint[]=Array.from({length:8},(_,i)=>[(i-3.5)*(27-16*compaction), Math.sin(i*Math.PI/2)*18*compaction,Math.cos(i*Math.PI/2)*30*compaction]);
  const atoms:Atom[]=centers.map(point=>({point,label:'',radius:10,kind:'backbone'}));
  const paths=centers.map(c=>Array.from({length:45},(_,i):SpatialPoint=>{const a=i/44*3.3*Math.PI;return[c[0]+13*Math.cos(a),c[1]+(i/44-.5)*12,c[2]+13*Math.sin(a)];}));
  const bonds:Bond[]=[];
  paths.forEach((p,i)=>{for(let k=1;k<p.length;k++)bonds.push({from:p[k-1],to:p[k],kind:'hydrogen'});if(i)bonds.push({from:paths[i-1].at(-1)!,to:p[0],kind:'hydrogen'});});
  return {atoms,bonds,centers};
}
