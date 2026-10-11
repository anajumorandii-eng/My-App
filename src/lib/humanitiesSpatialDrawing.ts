import type { HumanitiesLesson, HumanitiesTemplate } from './humanitiesSpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';

const pi=Math.PI;
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
/** Moldes com percurso próprio (o movimento é o processo); os outros percorrem os itens. */
export const HUMANITIES_MOVING:HumanitiesTemplate[]=['flows','cycle','cave','dialectic'];

/** Rótulo curto para caber no palco; o texto completo vai para a leitura. */
const short=(s:string)=>s.length>18?s.slice(0,17)+'…':s;

export function humanitiesSpatialDrawing(lesson:HumanitiesLesson,value:number,time:number):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const t=clamp(time,0,1),items=lesson.items,n=items.length,sel=clamp(Math.round(value),1,n)-1;
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const face=(points:SpatialPoint[],role:SpatialTrace['role']='sum')=>line(points,role,{closed:true});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>{if(Math.hypot(...b.map((v,i)=>v-a[i]))>1e-6)line([a,b],role,{arrow:true});};
  const dot=(p:SpatialPoint,role:SpatialDot['role']='signal',r=5)=>dots.push({point:p,role,radius:r});
  const label=(p:SpatialPoint,text:string)=>labels.push({point:p,text:short(text)});
  const lerp=(a:SpatialPoint,b:SpatialPoint,k:number):SpatialPoint=>a.map((v,i)=>v+(b[i]-v)*k) as SpatialPoint;
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,role:SpatialTrace['role']='sum')=>{
    const p=(dx:number,dy:number,dz:number):SpatialPoint=>[x+dx*w,y+dy*h,z+dz*d];
    face([p(0,0,1),p(1,0,1),p(1,1,1),p(0,1,1)],role);face([p(0,1,0),p(1,1,0),p(1,1,1),p(0,1,1)],role);face([p(1,0,0),p(1,0,1),p(1,1,1),p(1,1,0)],role);
  };
  const roleOf=(i:number):SpatialTrace['role']=>i===sel?'signal':'sum';
  const ringPts=(r:number,y=0,k=48):SpatialPoint[]=>Array.from({length:k+1},(_,i)=>[r*Math.cos(i*2*pi/k),y,r*Math.sin(i*2*pi/k)]);

  switch(lesson.template){
  case 'timeline':{line([[-100,-50,0],[100,-50,0]],'reference');for(let i=0;i<n;i++){const x=-90+i*180/Math.max(1,n-1),h=i<=sel?24+i*10:10;box(x-7,-50,-7,14,h,14,i===sel?'signal':i<sel?'sum':'reference');label([x,-66-(i%2)*14,0],items[i][0]);}break;}
  case 'pyramid':{for(let i=0;i<n;i++){const w=50+i*130/Math.max(1,n-1),h=110/n,y=50-(i+1)*h;box(-w/2,y,-w/4,w,h-3,w/2,roleOf(i));label([w/2+22,y+h/2,0],items[i][0]);}break;}
  case 'compare':{const maxW=Math.max(...items.map(it=>it[2]??3));for(let i=0;i<n;i++){const x=-80+i*160/Math.max(1,n-1),h=(items[i][2]??3)/maxW*100;box(x-12,-60,-12,24,h,24,roleOf(i));label([x,-76-(i%2)*14,0],items[i][0]);}break;}
  case 'flows':{const P=items.map((_,i):SpatialPoint=>{const a=i*2*pi/n-pi/2;return [70*Math.cos(a),(i%2?12:-12),70*Math.sin(a)];});
    P.forEach((p,i)=>{dot(p,i===sel?'signal':'sum',i===sel?12:9);label([p[0],p[1]+22,p[2]],items[i][0]);});
    for(const [a,b] of lesson.links??[]){const A=P[a],B=P[b],u=lerp(A,B,.15),v=lerp(A,B,.85);arrow(u,v,a===sel||b===sel?'signal':'reference');dot(lerp(u,v,(t+a*.17)%1),'body',3);}break;}
  case 'cycle':{line(ringPts(65),'reference');items.forEach((it,i)=>{const a=i*2*pi/n;const p:SpatialPoint=[65*Math.cos(a),0,65*Math.sin(a)];dot(p,i===sel?'signal':'sum',i===sel?11:8);label([p[0]*1.25,14,p[2]*1.25],it[0]);
      const a2=(i+.85)*2*pi/n;arrow([65*Math.cos(a+.25),0,65*Math.sin(a+.25)],[65*Math.cos(a2),0,65*Math.sin(a2)],'reference');});
    const a=t*2*pi;dot([65*Math.cos(a),6,65*Math.sin(a)],'body',5);break;}
  case 'concentric':{items.forEach((it,i)=>{const r=18+i*(90/n);face(ringPts(r,-i*4,40),roleOf(i));label([r,-i*4+10,0],it[0]);});break;}
  case 'cave':{face([[-100,-50,-40],[60,-50,-40],[60,-50,40],[-100,-50,40]],'reference');face([[-100,-50,-40],[-100,40,-40],[-100,40,40],[-100,-50,40]],'reference');
    for(let i=0;i<3;i++)dot([-60,-40,-20+i*20],'body',7);dot([20,-30,0],'signal',10);line([[-10,-50,-30],[-10,-25,-30],[-10,-25,30],[-10,-50,30]],'body');
    face([[-100,-40,-30],[-100,0,-30],[-100,0,30],[-100,-40,30]],sel===0?'signal':'reference');line([[60,-50,0],[100,30,0]],'sum');dot([110,70,0],'signal',sel===3?16:9);
    const route:SpatialPoint[]=[[-60,-40,0],[20,-30,0],[60,-50,0],[100,30,0]];const p=t*(route.length-1),k=Math.min(route.length-2,Math.floor(p));dot(lerp(route[k],route[k+1],p-k),'sum',6);
    label([-100,10,0],'sombras');label([20,-8,0],'fogo');label([100,90,0],'sol');break;}
  case 'divided-line':{const seg=[18,30,24,40];let y=-60;seg.forEach((h,i)=>{box(-10,y,-10,20,h-2,20,roleOf(i));label([60,y+h/2,0],items[i][0]);y+=h;});line([[-30,-60+48,0],[30,-60+48,0]],'reference',{dashed:true});label([-55,-40,0],'doxa');label([-55,40,0],'episteme');break;}
  case 'mean':{line([[0,-60,0],[0,-10,0]],'body');const tilt=(sel-1)*18;line([[-90,-10-tilt,0],[90,-10+tilt,0]],'body');
    items.forEach((it,i)=>{const x=-80+i*80,y=-10+(i-1)*tilt;dot([x,y+10,0],i===1?'signal':'sum',i===1?11:8);label([x,y+30,0],it[0]);});break;}
  case 'dialectic':{const pts:SpatialPoint[]=Array.from({length:61},(_,i)=>{const a=i*pi/10;return [50*Math.cos(a),-60+i*2,50*Math.sin(a)];});line(pts,'reference');
    for(let lvl=0;lvl<2;lvl++)items.forEach((it,i)=>{const k=lvl*30+i*10,p=pts[k];dot(p,i===sel?'signal':i===2?'body':'sum',i===2?9:7);if(lvl===0)label([p[0]*1.3,p[1]+12,p[2]*1.3],it[0]);});
    const k=Math.round(t*60);dot(pts[k],'signal',4);break;}
  case 'blocs':{const groups=[...new Set(items.map(it=>it[3]??0))];items.forEach((it,i)=>{const g=groups.indexOf(it[3]??0),same=items.filter(x=>(x[3]??0)===(it[3]??0)),j=same.indexOf(it);
      const p:SpatialPoint=[g===0?-55:55,-20+j*30-(same.length-1)*15,0];dot(p,i===sel?'signal':g===0?'sum':'body',8+(it[2]??3)*1.5);label([p[0]+(g===0?-34:34),p[1],0],it[0]);});
    line([[0,-70,-30],[0,70,-30],[0,70,30],[0,-70,30]],'reference',{dashed:true});break;}
  }
  const [name,detail]=items[sel];
  return {traces,dots,labels,reading:`${name}: ${detail}`,legend:'Vinho: item em destaque · azul: demais itens · cinza: estrutura'};
}
