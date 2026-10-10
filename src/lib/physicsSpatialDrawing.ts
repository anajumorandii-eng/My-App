import { atwoodState, circularState, conicalState, contactState, gasState, lensState, makerFocal, standingDisplacement, tubeMode, wireForce, type GasProcess, type PhysicsSpatialKind } from './physicsSpatialBatch';
import type { SpatialPoint } from './spatialSolid';

export interface SpatialTrace { points: SpatialPoint[]; role: 'body'|'signal'|'reference'|'sum'; closed?: boolean; dashed?: boolean; arrow?: boolean; }
export interface SpatialDot { point: SpatialPoint; role: SpatialTrace['role']; radius?: number; }
export interface PhysicsSpatialDrawing { traces: SpatialTrace[]; dots: SpatialDot[]; labels: {point:SpatialPoint;text:string}[]; reading: string; legend: string; }
const fmt=(v:number)=> (Math.abs(v)<1e-9?0:v).toLocaleString('pt-BR',{maximumFractionDigits:2});
const scale=(p:SpatialPoint,s:number):SpatialPoint=>p.map(v=>v*s) as SpatialPoint;
const add=(a:SpatialPoint,b:SpatialPoint):SpatialPoint=>a.map((v,i)=>v+b[i]) as SpatialPoint;
const ring=(r:number,y:number):SpatialPoint[]=>Array.from({length:65},(_,i)=>[r*Math.cos(i*Math.PI/32),y,r*Math.sin(i*Math.PI/32)]);

/** Geometria em XYZ, depois projetada por uma câmera sem alterar grandezas. */
export function physicsSpatialDrawing(kind:PhysicsSpatialKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>{ if(Math.hypot(...b.map((v,i)=>v-a[i]))>1e-8)line([a,b],role,{arrow:true}); };
  const dot=(point:SpatialPoint,role:SpatialDot['role']='body',radius=5)=>dots.push({point,role,radius});
  const box=(center:SpatialPoint,size:SpatialPoint)=>{
    const points=Array.from({length:8},(_,i):SpatialPoint=>center.map((v,j)=>v+size[j]*((i>>j&1)? .5:-.5)) as SpatialPoint);
    for(const face of [[0,1,3,2],[0,1,5,4],[1,3,7,5]])line(face.map(i=>points[i]),'body',{closed:true});
    points.forEach((p,i)=>[0,1,2].forEach(j=>{if(!(i>>j&1))line([p,points[i|(1<<j)]]);}));
  };
  const floor=()=>line([[-100,-35,-40],[100,-35,-40],[100,-35,40],[-100,-35,40],[-100,-35,-40]],'reference',{closed:true});
  let reading='',legend='Vinho: grandeza em destaque · azul: referência';
  if(kind==='circular'||kind==='acceleration') {
    const m=circularState(value,time),p=scale(m.position,32);
    line(ring(64,0),'reference');dot([0,0,0],'reference',3);dot(p);
    arrow(p,add(p,scale(m.velocity,8)),'signal');arrow(p,add(p,scale(m.acceleration,3)),'sum');
    reading=`v = ${fmt(value)} m/s; aₜ = 0; a꜀ = ${fmt(value*value/2)} m/s²; período ${fmt(m.period)} s; percurso ${fmt(time*360)}°.`;
    legend='Vinho: velocidade tangente · azul: aceleração para o centro';
  } else if(kind==='conical') {
    const m=conicalState(value,time),p=add(scale(m.position,40),[0,45,0]);
    line(ring(m.radius*40,p[1]),'reference',{dashed:true});line([[0,45,0],p]);dot([0,45,0],'reference',3);dot(p);
    const tensionDirection=scale(m.position,-1/2);
    arrow(p,add(p,scale(tensionDirection,m.tension*2)),'signal');arrow(p,add(p,[0,-20,0]),'sum');
    reading=`R = ${fmt(m.radius)} m; v = ${fmt(m.speed)} m/s; T = ${fmt(m.tension)} N; T cos θ = 10 N; T sen θ = ${fmt(m.radial)} N.`;
    legend='Vinho: tração ao longo do fio · azul: peso vertical';
  } else if(kind==='weight'||kind==='contact'||kind==='work') {
    floor();
    const displacement=kind==='contact'?contactState(value,time).displacement:kind==='work'?2*time:0;
    const x=-45+displacement*42,p:SpatialPoint=[x,-17,0];box(p,[30,36,30]);
    if(kind==='weight') {
      arrow(p,add(p,[0,-value*7,0]),'signal');arrow(p,add(p,[0,value*7,0]),'sum');
      reading=`m = ${fmt(value)} kg; P = ${fmt(value*10)} N; N = ${fmt(value*10)} N; resultante = 0 N.`;
      legend='Vinho: peso · azul: normal; mesmo corpo, equilíbrio';
    } else if(kind==='contact') {
      const m=contactState(value,time);
      arrow(p,add(p,[value*2,0,0]));arrow(p,add(p,[-m.friction*2,0,0]),'sum');
      arrow(p,add(p,[0,40,0]),'reference');arrow(p,add(p,[0,-40,0]),'reference');
      reading=`${m.sliding?'Deslizamento':'Repouso'}; N = 20 N; atrito = ${fmt(m.friction)} N; a = ${fmt(m.acceleration)} m/s²; t = ${fmt(.5*time)} s; Δx = ${fmt(m.displacement)} m.`;
      legend='Vinho: força aplicada · azul: atrito · cinza: peso e normal';
    } else {
      const a=value*Math.PI/180;arrow(p,add(p,[55*Math.cos(a),55*Math.sin(a),0]));
      arrow([-45,-50,0],[39,-50,0],'sum');
      reading=`W no percurso atual = ${fmt(20*time*Math.cos(a))} J; W final = ${fmt(20*Math.cos(a))} J; deslocamento = ${fmt(2*time)} m.`;
      legend='Vinho: força · azul: deslocamento prescrito';
    }
  } else if(kind==='resultant') {
    const a=value*Math.PI/180,b:SpatialPoint=[55*Math.cos(a),55*Math.sin(a),0],sum=add([55,0,0],b);
    arrow([0,0,0],[55,0,0]);arrow([0,0,0],b);arrow([0,0,0],sum,'sum');
    line([[55,0,0],sum,b],'reference',{dashed:true});
    reading=`Rx = ${fmt(10+10*Math.cos(a))} N; Ry = ${fmt(10*Math.sin(a))} N; |R| = ${fmt(20*Math.abs(Math.cos(a/2)))} N.`;
    legend='Vinho: forças de 10 N · azul: soma, zero em 180°';
  } else if(kind==='atwood') {
    const m=atwoodState(value,time),dy=m.displacement*65;
    line(ring(28,0).map(([x,,z]):SpatialPoint=>[x,z+65,0]));
    line([[-28,65,0],[-28,-5+dy,0]]);line([[28,65,0],[28,-5-dy,0]]);
    box([-28,-20+dy,0],[22,30,18]);box([28,-20-dy,0],[22,30,18]);
    labels.push({point:[-28,-20+dy,0],text:'m₁'},{point:[28,-20-dy,0],text:'m₂'});
    arrow([-45,-20+dy,0],[-45,-20+dy+m.tension*.7,0],'sum');arrow([45,-20-dy,0],[45,-20-dy-value*7,0]);
    reading=`m₁ = 2 kg; m₂ = ${fmt(value)} kg; a₂ (para baixo) = ${fmt(m.acceleration)} m/s²; T = ${fmt(m.tension)} N; Δy₂ = ${fmt(m.displacement)} m; t = ${fmt(.5*time)} s.`;
    legend='Vinho: peso de m₂ · azul: tração em m₁; fio ideal';
  } else if(kind==='gas') {
    const ratio=1+(value-1)*time,m=gasState(choice as GasProcess,ratio),bottom=-70,top=bottom+60*m.volume;
    line(ring(36,bottom));line(ring(36,60),'reference',{dashed:true});line(ring(36,top),'signal');
    for(const z of [-36,36])line([[0,bottom,z],[0,60,z]]);
    for(const x of [-36,36])line([[x,bottom,0],[x,60,0]]);
    line(ring(36,top+6),'signal');line([[0,top+6,0],[0,top+28,0]],'signal');
    reading=`V = ${fmt(m.volume)} L; p = ${fmt(m.pressure)} kPa; T = ${fmt(m.temperature)} K; W = ${fmt(m.work)} J; ΔU = ${fmt(m.deltaU)} J; Q = ${fmt(m.heat)} J.`;
    legend='Vinho: êmbolo móvel · contorno: cilindro · percurso quase estático';
  } else if(kind==='hydro') {
    box([0,0,0],[100,140,80]);line([[-50,60,-40],[50,60,-40],[50,60,40],[-50,60,40],[-50,60,-40]],'sum',{closed:true});
    const y=60-value*28;line([[-46,y,0],[46,y,0]],'reference',{dashed:true});dot([-25,y,0]);dot([25,y,0]);
    arrow([-25,y,0],[-45,y,0]);arrow([25,y,0],[45,y,0]);
    line([[-65,60,0],[-65,y,0]],'signal');
    reading=`h = ${fmt(value)} m; pressão manométrica = ${fmt(10*value)} kPa; pressão absoluta nos dois pontos = ${fmt(100+10*value)} kPa.`;
    legend='Azul: superfície livre · vinho: dois pontos no mesmo nível';
  } else if(kind==='snell') {
    const i=value*Math.PI/180,r=Math.asin(Math.sin(i)/1.5);
    line([[-95,0,-55],[95,0,-55],[95,0,55],[-95,0,55],[-95,0,-55]],'reference',{closed:true});
    line([[0,-95,0],[0,95,0]],'sum',{dashed:true});
    arrow([-85*Math.sin(i),85*Math.cos(i),0],[0,0,0]);arrow([0,0,0],[85*Math.sin(r),-85*Math.cos(r),0]);
    reading=`i = ${fmt(value)}°; r = ${fmt(r*180/Math.PI)}°; sen i / sen r = 1,5 (fora de i = 0°). Ar acima; vidro abaixo.`;
    legend='Vinho: raio incidente e refratado · azul: normal';
  } else if(kind==='lens'||kind==='maker') {
    const f=kind==='maker'?makerFocal(value):20,p=kind==='maker'?0:value;
    const extent=kind==='maker'?Math.max(100,f):Math.max(p,lensState(p).image),s=100/extent;
    // Anel da abertura no plano yz; raios meridionais no plano xy.
    line(ring(26,0).map(([x,,z]):SpatialPoint=>[0,x,z]),'body');
    line([[-105,0,0],[105,0,0]],'reference',{dashed:true});
    if(kind==='maker') {
      for(const y of [-18,18]) {line([[-85,y,0],[0,y,0],[f*s,0,0]],'signal');}
      dot([f*s,0,0],'sum');reading=`nₘ = ${fmt(value)}; f = ${fmt(f)} cm; vergência = ${fmt(100/f)} D; mesma lente, R₁ = +20 cm e R₂ = −20 cm.`;
      legend='Vinho: raios paraxiais · azul: foco calculado';
    } else {
      const m=lensState(p);arrow([-p*s,0,0],[-p*s,10*s,0],'body');arrow([m.image*s,0,0],[m.image*s,m.height*s,0],'sum');
      line([[-p*s,10*s,0],[0,10*s,0],[m.image*s,m.height*s,0]],'signal');line([[-p*s,10*s,0],[0,0,0],[m.image*s,m.height*s,0]],'signal');
      dot([20*s,0,0],'reference',3);dot([-20*s,0,0],'reference',3);
      reading=`p = ${fmt(p)} cm; p′ = ${fmt(m.image)} cm; A = ${fmt(m.magnification)}; h′ = ${fmt(m.height)} cm; imagem real e invertida.`;
      legend='Contorno: objeto e abertura · vinho: raios · azul: imagem';
    }
  } else if(kind==='echo') {
    const wall=value*1.1,position=time<.5?-65+(wall+65)*2*time:wall-(wall+65)*(2*time-1);
    box([wall,0,0],[6,95,60]);box([-65,0,0],[18,25,20]);
    line([[-65,0,0],[wall,0,0]],'reference',{dashed:true});dot([position,0,0],'signal',7);
    reading=`d = ${fmt(value)} m; percurso total = ${fmt(2*value)} m; retorno em ${fmt(2*value/340)} s; instante do sinal = ${fmt(2*value*time/340)} s.`;
    legend='Vinho: sinal em ida e volta · contorno: fonte e parede';
  } else if(kind==='reflection') {
    const center=-80+320*time,sign=choice==='free'?1:-1;
    const curve=Array.from({length:101},(_,i):SpatialPoint=>{const x=-100+i*2;return [x,26*(Math.exp(-(((x-center)/value)**2))+sign*Math.exp(-(((x-(200-center))/value)**2))),0];});
    line(curve,'signal');line([[-100,0,0],[100,0,0]],'reference',{dashed:true});
    if(choice==='free') {line([[100,-25,0],[100,25,0]]);dot([100,curve.at(-1)![1],0]);} else box([103,0,0],[6,60,20]);
    reading=`Extremidade ${choice==='free'?'livre: retorno sem inversão':'fixa: retorno invertido'}; progresso ${fmt(100*time)}%; largura ${fmt(value)} u.a.`;
    legend='Vinho: soma do pulso incidente e refletido · contorno: limite';
  } else if(kind==='interference') {
    const phi=value*Math.PI/180;
    for(const [z,offset,role] of [[-30,0,'reference'],[30,phi,'reference'],[0,-1,'signal']] as const) {
      line(Array.from({length:101},(_,i):SpatialPoint=>{const a=i/100*4*Math.PI-2*Math.PI*time;return [-100+i*2,offset<0?22*(Math.sin(a)+Math.sin(a+phi)):22*Math.sin(a+offset),z];}),role);
    }
    reading=`φ = ${fmt(value)}°; amplitude resultante = ${fmt(.04*Math.abs(Math.cos(phi/2)))} m; ${value===180?'cancelamento':value===0?'reforço máximo':'superposição parcial'}.`;
    legend='Cinza em profundidade: duas ondas · vinho: soma no plano central';
  } else if(kind==='standing'||kind==='string') {
    line(Array.from({length:101},(_,i):SpatialPoint=>[-100+i*2,standingDisplacement(i/100,value,time)*1000,0]),'signal');
    box([-104,0,0],[8,45,20]);box([104,0,0],[8,45,20]);
    for(let i=0;i<=value;i++)dot([-100+200*i/value,0,0],'reference',3);
    reading=`n = ${value}; fₙ = ${50*value} Hz; λ = ${fmt(2/value)} m; ${value+1} nós incluindo as pontas; distância entre nós = ${fmt(1/value)} m.`;
    legend='Vinho: corda · pontos: nós imóveis · contorno: suportes';
  } else if(kind==='tube') {
    const closed=choice==='closed',m=tubeMode(value,closed);
    for(const y of [-28,28])line([[-100,y,-18],[100,y,-18],[100,y,18],[-100,y,18]],'body');
    if(closed)line([[-100,-28,-18],[-100,28,-18],[-100,28,18],[-100,-28,18],[-100,-28,-18]],'body',{closed:true});
    line(Array.from({length:101},(_,i):SpatialPoint=>[-100+i*2,20*(closed?Math.sin(m.waveNumber*i/100):Math.cos(m.waveNumber*i/100))*Math.cos(2*Math.PI*time),0]),'signal');
    reading=`Tubo ${closed?'fechado à esquerda':'aberto nas duas pontas'}; modo ${value}; f = ${fmt(m.frequency)} Hz; λ = ${fmt(340/m.frequency)} m; curva de deslocamento, não pressão.`;
    legend='Contorno: tubo · vinho: perfil de amplitude longitudinal';
  } else if(kind==='wire') {
    const a=value*Math.PI/180,d:SpatialPoint=[Math.sin(a),Math.cos(a),0],force=wireForce(value);
    line([scale(d,-60),scale(d,60)]);arrow(scale(d,-30),scale(d,30),'signal');arrow([0,0,0],[0,65,0],'reference');arrow([0,0,0],scale(force,75),'sum');
    reading=`θ = ${fmt(value)}°; i = 2 A; B = 0,5 T; F = ${fmt(force[2])} N${Math.abs(force[2])<1e-9?' (força nula, sem direção definida)':' na direção +z'}.`;
    legend='Vinho: corrente · cinza: campo +y · azul: força +z';
  }
  return {traces,dots,labels,reading,legend};
}
