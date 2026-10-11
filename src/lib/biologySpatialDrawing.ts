import { aboState, gameteCounts, HEART_ROUTE, mitosisCounts, type BiologySpatialKind } from './biologySpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';
const fmt=(v:number)=>v.toLocaleString('pt-BR',{maximumFractionDigits:2});
const ring=(x:number,y:number,z:number,rx:number,ry=rx):SpatialPoint[]=>Array.from({length:49},(_,i)=>[x+rx*Math.cos(i*Math.PI/24),y+ry*Math.sin(i*Math.PI/24),z]);
const lerp=(a:SpatialPoint,b:SpatialPoint,t:number):SpatialPoint=>a.map((v,i)=>v+(b[i]-v)*t) as SpatialPoint;
export function routePoint(route:SpatialPoint[],time:number):SpatialPoint {const p=Math.max(0,Math.min(1,time))*(route.length-1),i=Math.min(route.length-2,Math.floor(p));return lerp(route[i],route[i+1],p-i);}
export const BIOLOGY_MOVING_KINDS:BiologySpatialKind[]=['protocell','mitochondrion','division','embryo','digestion','immunity','heart','lung','reproduction','phloem','auxin','secretion','enzyme','pcr','nephron','neuron','transpiration'];

/** Original educational XYZ schematics. Read the lesson note before inferring anatomy or scale. */
export function biologySpatialDrawing(kind:BiologySpatialKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const dot=(point:SpatialPoint,role:SpatialDot['role']='body',radius=5)=>dots.push({point,role,radius});
  const label=(point:SpatialPoint,text:string)=>labels.push({point,text});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>line([a,b],role,{arrow:true});
  const ellipse=(x:number,y:number,z:number,rx:number,ry=rx,role:SpatialTrace['role']='body')=>line(ring(x,y,z,rx,ry),role,{closed:true});
  const sphere=(x:number,y:number,z:number,r:number,role:SpatialTrace['role']='body')=>{ellipse(x,y,z,r,r,role);line(Array.from({length:49},(_,i):SpatialPoint=>[x+r*Math.cos(i*Math.PI/24),y,z+r*Math.sin(i*Math.PI/24)]),role);line(Array.from({length:49},(_,i):SpatialPoint=>[x,y+r*Math.cos(i*Math.PI/24),z+r*Math.sin(i*Math.PI/24)]),role);};
  const tube=(x:number,top:number,bottom:number,r:number,role:SpatialTrace['role']='body')=>{for(const y of [top,bottom])line(Array.from({length:49},(_,i):SpatialPoint=>[x+r*Math.cos(i*Math.PI/24),y,r*Math.sin(i*Math.PI/24)]),role);for(const z of [-r,r])line([[x,top,z],[x,bottom,z]],role);};
  const flow=(route:SpatialPoint[],role:SpatialTrace['role']='signal')=>{line(route,role,{arrow:true});dot(routePoint(route,time),role,6);};
  let reading='',legend='Vinho: elemento em destaque · azul: estrutura relacionada · cinza: referência';
  if(kind==='protocell') {
    sphere(0,0,0,value);sphere(0,0,0,value-5,'sum');
    for(let i=0;i<5;i++){const target:SpatialPoint=[(i-2)*9,Math.sin(i)*12,Math.cos(i)*12];dot(lerp([75,(i-2)*15,0],target,time),'signal',4);}
    label([0,-value-17,0],'Vesícula lipídica');
    reading=`Compartimento hipotético de raio visual ${value}; encapsulamento ilustrativo ${fmt(time*100)}%. Não é vida demonstrada.`;
  } else if(kind==='bilayer') {
    for(let i=0;i<value;i++)for(const z of [-15,15])for(const side of [-1,1]){const x=(i-(value-1)/2)*18,y=side*28;dot([x,y,z],'sum',6);for(const dx of [-3,3])line([[x+dx,y-side*5,z],[x+dx+2,side*4,z+2]],'body');}
    label([0,54,0],'Água / cabeças');label([0,-54,0],'Água / cabeças');label([0,0,30],'Caudas');
    reading=`${value} pares no recorte por fileira; cabeças para os dois meios aquosos, caudas voltadas uma à outra.`;
  } else if(kind==='protein') {
    const points=Array.from({length:value},(_,i):SpatialPoint=>choice==='sheet'?[(i-(value-1)/2)*10,i%2?15:-15,(i%4<2?1:-1)*15]:[22*Math.cos(i*1.75),(i-(value-1)/2)*9,22*Math.sin(i*1.75)]);
    line(points);points.forEach(p=>dot(p,'signal',3));
    label([0,-90,0],choice==='sheet'?'Trecho em zigue-zague':'Trecho helicoidal');
    reading=`${value} resíduos por trecho esquemático: ${choice==='sheet'?'folha beta, cadeia estendida':'hélice alfa, cadeia helicoidal'}. Tracejado: interações entre trechos.`;
    if(choice!=='sheet')for(let i=0;i<value-4;i++)line([points[i],points[i+4]],'sum',{dashed:true});
    // A beta sheet includes adjacent backbone strands, not merely one zigzag chain.
    if(choice==='sheet'){const second=points.map(([x,y,z]):SpatialPoint=>[x,y+38,z]);line(second,'sum');for(let i=0;i<value;i+=2)line([points[i],second[i]],'reference',{dashed:true});}
  } else if(kind==='mitochondrion') {
    ellipse(0,0,0,78,40);ellipse(0,0,12,70,32,'sum');
    const inner:SpatialPoint[]=[[-65,-20,12]];for(let i=0;i<value;i++){const x=-50+i*100/(value-1);inner.push([x,-22,12],[x,12,12],[x+8,-22,12]);}inner.push([65,-20,12]);line(inner,'sum');
    label([0,60,0],'Membrana externa');label([0,0,12],'Matriz');
    if(choice==='fermentation'){label([0,-70,0],'Citosol: fermentação');flow([[-55,-80,0],[55,-80,0]]);}
    else {label([0,-62,0],'Membrana interna');dot(routePoint(inner,time),'signal',6);}
    reading=`${value} cristas ilustrativas; ${choice==='fermentation'?'fermentação no citosol regenera NAD⁺':'cadeia respiratória na membrana interna e Krebs na matriz'}; localização ${fmt(time*100)}%.`;
  } else if(kind==='division') {
    const c=mitosisCounts(value),split=35*time;
    ellipse(0,0,0,84,62);for(const side of [-1,1]){dot([side*68,0,0],'sum',5);for(let i=0;i<c.parentChromosomes;i++){const y=(i-(c.parentChromosomes-1)/2)*14,x=side*split;line([[x+side*8,y-6,-4],[x,y,0],[x+side*8,y+6,4]],i%2?'sum':'signal');line([[side*68,0,0],[x,y,0]],'reference');}}
    label([0,82,0],'Separação de irmãs');
    reading=`Antes: ${c.parentChromosomes} cromossomos duplicados, ${c.parentChromatids} cromátides. Cada filha: ${c.daughterChromosomes} cromossomos simples. Separação ${fmt(time*100)}%.`;
  } else if(kind==='abo') {
    ellipse(0,0,0,50,50);ellipse(0,0,15,26,26,'reference');line(ring(0,0,-8,50,50),'body');const s=aboState(choice);
    for(let i=0;i<value;i++){const a=i*2*Math.PI/value,x=55*Math.cos(a),y=55*Math.sin(a);dot([x,y,0],'reference',1.5);if(s.antigens.length){const antigen=s.antigens[i%s.antigens.length];if(antigen==='A')line([[x-4,y-4,8],[x+4,y-4,8],[x,y+5,8]],'signal',{closed:true});else ellipse(x,y,8,5,5,'sum');}}
    label([0,-78,0],`Hemácia ${choice}`);reading=`Grupo ${choice}, ${value} posições visuais. Antígenos: ${s.antigens.join(' e ')||'nenhum A/B'}. Plasma: ${s.antibodies.join(' e ')||'sem anti-A/anti-B esperados'}.`;
    legend='Triângulo vinho: A · círculo azul: B · antígenos ampliados · pontos cinza: posições de referência';
  } else if(kind==='embryo') {
    const depth=value*time;
    for(const z of [-12,12])line(Array.from({length:65},(_,i):SpatialPoint=>{const a=i*Math.PI/32,x=60*Math.cos(a),y=60*Math.sin(a);return [x,y+(y<0?depth*Math.exp(-(x*x)/500):0),z];}),z<0?'body':'sum',{closed:true});
    for(const x of [-45,0,45])line([[x,-Math.sqrt(3600-x*x)+depth*Math.exp(-(x*x)/500),-12],[x,-Math.sqrt(3600-x*x)+depth*Math.exp(-(x*x)/500),12]],'reference');
    label([0,80,0],'Parede da blástula');label([0,-80,0],'Polo de invaginação');
    reading=`Invaginação ilustrativa ${fmt(depth)} de ${value} unidades visuais. A cavidade que se inicia na dobra corresponde ao arquêntero; não é gastrulação humana.`;
  } else if(kind==='digestion') {
    const route:SpatialPoint[]=[[0,85,0],[0,35,0],[-28,18,8],[-15,-8,8]];
    ellipse(-20,17,0,25,28);for(let i=0;i<value*2;i++)route.push([i%2?-32:32,-12-i*7,(i%3-1)*9]);route.push([55,-65,0],[55,0,0],[-55,0,0],[-55,-75,0]);
    line([[0,85,-5],[0,42,-5]]);flow(route);label([-54,49,0],'Estômago');label([0,-95,0],'Delgado / grosso');
    reading=`${value} dobras ilustrativas; conteúdo no trajeto ${fmt(time*100)}%. Absorção de nutrientes sobretudo no delgado; marcador permanece no lúmen.`;
  } else if(kind==='immunity') {
    ellipse(50,0,0,23,52,'sum');const match=choice==='match';
    for(let i=0;i<value;i++){const y=(i-(value-1)/2)*32,x=-55+time*(match?68:25);line([[x-13,y,0],[x,y,0],[x+14,y-7,4]],'signal');line([[x,y,0],[x+14,y+7,-4]],'signal');if(match)line([[27,y+7,-4],[32,y+12,-4],[37,y+7,-4]],'signal');else ellipse(30,y+7,-4,4,4,'reference');}
    label([50,77,0],'Antígeno');reading=`${value} anticorpos; epítopo ${match?'compatível: reconhecimento específico':'diferente: sem ligação específica representada'}; aproximação ${fmt(time*100)}%.`;
  } else if(kind==='heart') {
    const d=value,centers:SpatialPoint[]=[[-d,22,0],[-d,-27,0],[d,22,12],[d,-27,12]];
    centers.forEach((p,i)=>{sphere(...p,i%2?20:16,i<2?'sum':'signal');label(p,['AD','VD','AE','VE'][i]);});
    const route:SpatialPoint[]=[[-70,-75,-8],centers[0],centers[1],[0,78,-10],centers[2],centers[3],[70,-75,-8],[-70,-75,-8]];
    line(route.slice(0,4),'sum',{arrow:true});line(route.slice(3,7),'signal',{arrow:true});line(route.slice(6),'reference',{arrow:true});dot(routePoint(route,time),'body',6);
    label([0,98,-10],'Pulmões');label([0,-98,-8],'Corpo');
    reading=`Separação visual ${value}. ${HEART_ROUTE.join(' → ')}. Percurso funcional ${fmt(time*100)}%; azul: menor oxigenação, vinho: maior.`;
    legend='AD/VD: lado direito anatômico · AE/VE: lado esquerdo · vista funcional, sem anatomia detalhada';
  } else if(kind==='lung') {
    const drop=value*time;for(const x of [-35,35]){ellipse(x,2,0,26+drop*.2,51+drop*.15,'sum');line([[0,76,0],[0,35,0],[x,12,0],[x-12,-16,8]]);line([[x,12,0],[x+12,-16,-8]]);}
    const dia=Array.from({length:25},(_,i):SpatialPoint=>{const x=-65+i*130/24;return[x,-62+18*(1-x*x/4225)-drop,0];});line(dia,'signal');arrow([0,93,0],[0,57,0]);label([0,-99,0],'Diafragma');
    reading=`Amplitude visual ${value}; descida ${fmt(drop)}. Inspiração: volume torácico aumenta, pressão alveolar diminui em relação à atmosfera.`;
  } else if(kind==='reproduction') {
    ellipse(0,-17,0,22,38);line([[0,-55,0],[0,-83,0]]);for(const side of [-1,1]){ellipse(side*(value+15),38,0,11,7,'sum');line([[side*16,15,0],[side*26,39,6],[side*value,47,6],[side*(value+12),43,0]]);}
    const route:SpatialPoint[]=[[value+15,38,0],[value,47,6],[26,39,6],[16,15,0],[8,-20,0]];dot(routePoint(route,time),'signal',5);label([0,80,0],'Ovário → tuba');label([0,-98,0],'Útero / endométrio');
    reading=`Separação visual ${value}; localização ${fmt(time*100)}%. Ovulação no ovário; fecundação usual na ampola da tuba; implantação no endométrio.`;
  } else if(kind==='stem') {
    for(const z of [-15,15])ellipse(0,0,z,66,66);for(let i=0;i<value;i++){const a=i*2*Math.PI/value;for(const [r,role] of [[40,'sum'],[52,'signal']] as const)tube(r*Math.cos(a),r*Math.sin(a)+7,r*Math.sin(a)-7,5,role);}
    label([0,86,0],'Epiderme');label([0,-88,0],'Feixes em anel');reading=`${value} feixes ilustrativos. Xilema interno (azul), floema externo (vinho); caule eudicotiledôneo jovem.`;legend='Azul: xilema · vinho: floema · contorno: epiderme';
  } else if(kind==='leaf') {
    for(const y of [-48,48]){line([[-75,y,-18],[75,y,-18],[75,y,18],[-75,y,18]],'body',{closed:true});}
    for(let i=0;i<value;i++){const x=(i-(value-1)/2)*16;ellipse(x,21,0,6,20,'sum');ellipse(x-4,-20,i%2?10:-10,9,7);}
    ellipse(-8,-49,0,6,5,'signal');ellipse(8,-49,0,6,5,'signal');arrow([0,-68,0],[0,-38,0]);label([0,75,0],'Paliçádico');label([0,-89,0],'Estoma / lacunoso');
    reading=`${value} células paliçádicas no recorte; lacunoso com espaços intercelulares e estoma inferior neste exemplo de folha.`;
  } else if(kind==='phloem') {
    tube(0,65,-65,18);for(const y of [-28,28]){line(Array.from({length:49},(_,i):SpatialPoint=>[18*Math.cos(i*Math.PI/24),y,18*Math.sin(i*Math.PI/24)]),'reference');for(const x of [-9,0,9])dot([x,y,0],'reference',2);}
    ellipse(-48,55,0,17,17,'sum');ellipse(48,-55,0,17,17,'sum');arrow([-29,55,0],[-4,55,0]);arrow([4,-55,0],[29,-55,0]);flow([[0,55,0],[0,-55,0]]);label([-48,84,0],'Fonte');label([48,-84,0],'Dreno');
    reading=`Diferença relativa de pressão ${value}; fonte → dreno, percurso ${fmt(time*100)}%. Valor não fornece vazão física.`;
    for(let i=0;i<value;i++)dot([8,(i-1.5)*17,8],'signal',3);
  } else if(kind==='auxin') {
    const bend=value*time;for(const side of [-1,1])line(Array.from({length:25},(_,i):SpatialPoint=>{const t=i/24;return[side*9+bend*t*t,-60+120*t,side*5];}),side<0?'signal':'body');ellipse(bend,60,0,12,7,'sum');for(const y of [-30,0,30])arrow([80,y,0],[40,y,0],'sum');label([0,-85,0],'Base do caule');label([65,75,0],'Luz');
    reading=`Diferença ilustrativa ${value}; curvatura visual ${fmt(bend)} para a luz. Lado sombreado alonga mais neste recorte de caule.`;
  } else if(kind==='secretion') {
    for(let i=0;i<3;i++){line([[-75,45-i*15,-10],[-30,45-i*15,-10],[-30,45-i*15,10],[-75,45-i*15,10]],'body');for(const x of [-65,-50,-35])dot([x,48-i*15,10],'signal',2);}
    for(let i=0;i<value;i++)line([[-15,20-i*12,-10],[12,25-i*12,0],[25,20-i*12,10]],'sum');sphere(50,-42,0,11,'sum');line([[78,65,-15],[78,-70,-15],[78,-70,15],[78,65,15]],'reference');flow([[-45,35,0],[-20,5,0],[20,-10,0],[50,-42,0],[78,-42,0]]);
    label([-55,70,0],'RER');label([5,52,0],'Golgi');label([50,-76,0],'Vesícula');reading=`${value} cisternas ilustrativas; proteína pela via secretora ${fmt(time*100)}%: RER → Golgi → vesícula → exocitose.`;
  } else if(kind==='cytoskeleton') {
    if(choice==='microtubule'){for(let i=0;i<13;i++){const a=i*2*Math.PI/13;line([[-value,16*Math.cos(a),16*Math.sin(a)],[value,16*Math.cos(a),16*Math.sin(a)]],'sum');}for(const x of [-value,value])line(Array.from({length:49},(_,i):SpatialPoint=>[x,16*Math.cos(i*Math.PI/24),16*Math.sin(i*Math.PI/24)]),'sum');}
    else for(let strand=0;strand<(choice==='actin'?2:4);strand++){const r=choice==='actin'?8:12;line(Array.from({length:49},(_,i):SpatialPoint=>{const a=i*.4+strand*2*Math.PI/(choice==='actin'?2:4);return[-value+2*value*i/48,r*Math.cos(a),r*Math.sin(a)];}),'signal');}
    label([0,-45,0],choice==='microtubule'?'Tubo de tubulina':choice==='actin'?'Filamento de actina':'Organização em corda');reading=`Comprimento visual ${value*2}; ${choice==='microtubule'?'microtúbulo oco':choice==='actin'?'actina em filamento':'filamento intermediário'}. Escala própria, não compara diâmetros.`;
  } else if(kind==='enzyme') {
    const outline:SpatialPoint[]=[[-60,-38,0],[-72,0,0],[-55,40,0],[-15,40,0],[-15,10,0],[5,10,0],[5,40,0],[28,25,0],[25,-30,0],[-10,-45,0]];line(outline,'body',{closed:true});line(outline.map(([x,y]):SpatialPoint=>[x,y,-15]),'reference');
    const phase=time<.5?time*2:(1-time)*2,x=value*(1-phase)-5,y=45-25*phase;line([[x-10,y+10,5],[x+10,y+10,5],[x+10,y-10,5],[x-10,y-10,5]],'signal',{closed:true});if(time>.65)line([[x,y+10,5],[x,y-10,5]],'sum');label([-40,-70,0],'Enzima');label([45,80,0],time>.65?'Produto':'Substrato');
    reading=`Separação inicial visual ${value}; etapa ${time<.35?'E + S':time<.65?'complexo ES':'E + P, enzima disponível'} (${fmt(time*100)}%).`;
  } else if(kind==='nondisjunction') {
    const counts=gameteCounts(value,choice);counts.forEach((count,i)=>{const x=(i%2-.5)*85,y=(i<2?1:-1)*42;sphere(x,y,0,29);for(let j=0;j<count;j++)line([[x+(j-(count-1)/2)*7,y-9,-3],[x+(j-(count-1)/2)*7,y+9,3]],j===count-1&&count>value?'signal':'sum');label([x,y-38,0],`${count} (${count===value?'n':count>value?'n+1':'n−1'})`);});
    reading=`n = ${value}; não disjunção na meiose ${choice}: gametas ${counts.join(', ')} cromossomos.`;
  } else if(kind==='pcr') {
    const stage=time<1/3?0:time<2/3?1:2,sep=stage===0?8+time*75:33;
    for(const side of [-1,1]){line([[-65,side*sep,-8],[65,side*sep,8]],'body');for(let i=0;i<10;i++){const x=-60+i*13;line([[x,side*sep,0],[x,side*(sep-5),0]],'reference');}}
    if(stage>0){line([[-60,sep-9,0],[-38,sep-9,0]],'signal',{arrow:true});line([[60,-sep+9,0],[38,-sep+9,0]],'signal',{arrow:true});}
    if(stage===2){const f=(time-2/3)*3;line([[-38,sep-9,0],[-38+98*f,sep-9,0]],'sum',{arrow:true});line([[38,-sep+9,0],[38-98*f,-sep+9,0]],'sum',{arrow:true});}
    label([0,70,0],['Separar fitas','Anelar primers','Estender 5′ → 3′'][stage]);reading=`${value} ciclos ideais: ${2**value} cópias de um alvo inicial. Ciclo representativo: ${['desnaturação','anelamento','extensão'][stage]} (${fmt(time*100)}%).`;
    legend='Vinho: primers com direção de extensão · azul: novas fitas · cinza: bases sem sequência específica';
  } else if(kind==='nephron') {
    sphere(-52,48,0,23);line(Array.from({length:33},(_,i):SpatialPoint=>[-52+13*Math.cos(i*.8),48+13*Math.sin(i*.8),8*Math.sin(i*.4)]),'signal');
    const route:SpatialPoint[]=[[-30,48,0],[-12,40,8],[-28,27,0],[-7,18,8],[-10,-value,0],[5,-value-8,0],[20,-value,0],[20,12,0],[38,28,8],[48,18,0],[62,32,0],[62,-75,0]];flow(route,'sum');arrow([-10,-12,0],[-35,-12,0],'signal');arrow([43,0,0],[23,0,0],'signal');label([-52,85,0],'Corpúsculo');label([0,-92,0],'Alça');label([69,70,0],'Coletor');
    reading=`Profundidade visual da alça ${value}; filtrado no percurso ${fmt(time*100)}%. Filtração no corpúsculo; setas laterais: reabsorção (sai) e secreção (entra).`;
  } else if(kind==='neuron') {
    sphere(-70,0,0,18);for(const y of [-35,0,35])line([[-83,y,8],[-75,y/2,4],[-70,0,0]]);line([[-52,0,0],[78,0,0]]);const w=120/value;
    for(let i=0;i<value;i++){const x=-43+i*w;for(const z of [-9,9])line([[x,-9,z],[x+w-7,-9,z],[x+w-7,9,z],[x,9,z]],'sum',{closed:true});}
    dot([-48+126*time,0,0],'signal',6);line([[78,0,0],[88,20,8]]);line([[78,0,0],[88,-20,-8]]);label([-65,-52,0],'Soma');label([25,42,0],'Mielina / nós');reading=`${value} internódios ilustrativos; sinal ${fmt(time*100)}%. Regeneração do potencial nos nós, corrente local entre eles.`;
  } else if(kind==='transpiration') {
    tube(0,40,-65,15,'sum');ellipse(0,58,0,60,17);for(const side of [-1,1])ellipse(side*(8+value/2),70,0,8,13,'signal');flow([[0,-60,0],[0,36,0],[12,58,0],[0,79,0],[0,96,0]],'sum');label([0,-90,0],'Xilema');label([65,82,0],'Estoma');
    reading=`Abertura visual ${value}; percurso da água ${fmt(time*100)}%. Tensão-coesão: perda de água foliar e coluna contínua; sem bomba no caule.`;
  }
  return {traces,dots,labels,reading,legend};
}
