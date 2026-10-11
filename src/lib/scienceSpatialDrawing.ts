import { G, carnotEfficiency, co2Forcing, collisionVelocities, conductionPower, dopplerPair, iceState, ionizedFraction, keplerSpeedRatio, mirrorImage, newtonAcceleration, photoelectronEnergy, rangeOf, silverChlorideSolubility, type ScienceSpatialKind } from './scienceSpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';

const pi=Math.PI;
const fmt=(n:number,d=2)=>(Math.abs(n)<1e-12?0:n).toLocaleString('pt-BR',{maximumFractionDigits:d});
const sci=(n:number)=>{if(n===0)return '0';const e=Math.floor(Math.log10(Math.abs(n)));return `${fmt(n/10**e,2)}×10${String(e).replace('-','⁻').replace(/\d/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])}`;};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
/** Percursos que só fazem sentido com a passagem do tempo; os demais são estáticos e não exibem controle de tempo. */
export const SCIENCE_MOVING_KINDS:ScienceSpatialKind[]=['heat','frames','uniform','accelerated','newton','vertical','orbit','projectile','shm','impulse','recoil','collision','kinetic-work','track','power','plant','charging','current','loop','wave-types','wave-speed','sound','doppler','wave-phenomena','acid-rain','combustion','addition','esterification','transesterification','equilibrium','photoelectric'];

/**
 * Geometria em XYZ (unidades de desenho, |p| < 125) projetada pela mesma câmera
 * das outras entregas espaciais. As grandezas da leitura saem de scienceSpatialBatch,
 * nunca das coordenadas desenhadas.
 */
export function scienceSpatialDrawing(kind:ScienceSpatialKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const t=clamp(time,0,1);
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>{if(Math.hypot(...b.map((v,i)=>v-a[i]))>1e-6)line([a,b],role,{arrow:true});};
  const dot=(point:SpatialPoint,role:SpatialDot['role']='signal',radius=5)=>dots.push({point,role,radius});
  const label=(point:SpatialPoint,text:string)=>labels.push({point,text});
  const lerp=(a:SpatialPoint,b:SpatialPoint,k:number):SpatialPoint=>a.map((v,i)=>v+(b[i]-v)*k) as SpatialPoint;
  const ring=(r:number,center:SpatialPoint=[0,0,0],plane:'xz'|'xy'|'yz'='xz',role:SpatialTrace['role']='reference',n=48)=>line(Array.from({length:n+1},(_,i):SpatialPoint=>{const a=i*2*pi/n,c=r*Math.cos(a),s=r*Math.sin(a);return plane==='xz'?[center[0]+c,center[1],center[2]+s]:plane==='xy'?[center[0]+c,center[1]+s,center[2]]:[center[0],center[1]+c,center[2]+s];}),role);
  const sphere=(r:number,center:SpatialPoint,role:SpatialTrace['role']='reference')=>{ring(r,center,'xz',role,32);ring(r,center,'xy',role,32);ring(r,center,'yz',role,32);};
  const box=(c:SpatialPoint,s:SpatialPoint,role:SpatialTrace['role']='body')=>{
    const p=Array.from({length:8},(_,i):SpatialPoint=>c.map((v,j)=>v+s[j]*((i>>j&1)?.5:-.5)) as SpatialPoint);
    for(const face of [[0,1,3,2],[4,5,7,6]])line(face.map(i=>p[i]),role,{closed:true});
    for(const [a,b] of [[0,4],[1,5],[2,6],[3,7]])line([p[a],p[b]],role);
  };
  const floor=(y=-40,w=110,d=45)=>line([[-w,y,-d],[w,y,-d],[w,y,d],[-w,y,d]],'reference',{closed:true});
  const route=(points:SpatialPoint[],role:SpatialTrace['role']='signal',r=6)=>{line(points,role,{dashed:true});const p=t*(points.length-1),i=Math.min(points.length-2,Math.floor(p));dot(lerp(points[i],points[i+1],p-i),role,r);};
  const wire=(points:SpatialPoint[],role:SpatialTrace['role']='body')=>line(points,role);
  const resistor=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='body')=>{const n=8,d=b.map((v,i)=>v-a[i]);line(Array.from({length:n+1},(_,i):SpatialPoint=>{const k=i/n,z=(i%2?6:-6)*(i>0&&i<n?1:0);return [a[0]+d[0]*k,a[1]+d[1]*k+z,a[2]+d[2]*k];}),role);};
  const battery=(x:number,y:number,z:number)=>{line([[x-4,y-14,z],[x-4,y+14,z]],'signal');line([[x+4,y-7,z],[x+4,y+7,z]],'signal');label([x,y+24,z],'ε');};
  const molecule=(atoms:[SpatialPoint,string,number][],bonds:[number,number][],role:SpatialTrace['role']='body')=>{for(const [a,b] of bonds)line([atoms[a][0],atoms[b][0]],role);for(const [p,txt,r] of atoms){dot(p,txt==='C'?'body':txt==='O'?'signal':txt==='H'?'reference':'sum',r);if(txt!=='C'&&txt!=='H')label([p[0],p[1]+r+8,p[2]],txt);}};
  let reading='',legend='Vinho: grandeza em destaque · azul: estrutura ou fluxo relacionado · cinza: referência';

  switch(kind){
  case 'heat': {
    if(choice==='conduction'){
      box([0,0,0],[160,14,14]);label([-70,25,0],'quente');label([70,25,0],'frio');
      for(let i=0;i<5;i++){const x=-64+i*32+t*24;arrow([x,0,10],[x+18,0,10],'signal');}
      reading=`Condução: Φ = k·A·ΔT/L = 401 × 10⁻⁴ × ${value} / 1 ≈ ${fmt(conductionPower(value))} W. Energia passa de partícula a partícula, sem transporte de matéria.`;
    } else if(choice==='convection'){
      box([0,-10,0],[120,90,50],'reference');line([[-40,-56,0],[40,-56,0]],'signal');label([0,-72,0],'aquecimento embaixo');
      const loop:SpatialPoint[]=[[0,-45,0],[0,25,0],[45,25,0],[45,-45,0],[0,-45,0]];route(loop,'sum');
      reading=`Convecção: fluido aquecido fica menos denso e sobe; o frio desce. ΔT de ${value} K intensifica a circulação, mas aqui sem cálculo de vazão.`;
    } else {
      sphere(26,[-60,0,0],'signal');box([60,0,0],[10,60,40]);
      for(const a of [-.4,0,.4]){const k=(t*0.8);arrow([-32,26*a,0],[-32+80*Math.max(.2,k),40*a,0],'signal');}
      reading=`Radiação: ondas eletromagnéticas atravessam o vácuo; não precisam de meio. Quanto mais quente o emissor (ΔT = ${value} K neste exemplo), mais energia irradia.`;
    }
    legend='Vinho: fluxo de energia · azul: circulação do fluido · cinza: recipiente'; break;
  }
  case 'greenhouse': {
    sphere(50,[0,0,0],'body');const thick=50+8+(value-280)/28;ring(thick,[0,0,0],'xy','sum');ring(thick,[0,0,0],'xz','sum');
    arrow([-85,75,0],[-36,36,0],'signal');label([-85,90,0],'Sol');
    arrow([30,30,0],[66,66,0],'sum');arrow([thick*.7,thick*.7,0],[40,40,0],'signal');
    reading=`CO₂ = ${value} ppm: forçamento ΔF ≈ 5,35·ln(${value}/280) = ${fmt(co2Forcing(value))} W/m². A camada absorve e reemite parte do infravermelho de volta à superfície.`;
    legend='Vinho: radiação solar e reemitida · azul: camada atmosférica'; break;
  }
  case 'frames': {
    floor(-30);const x=-80+160*t;box([x,-10,0],[60,30,30]);dot([x,0,0],'signal',6);
    if(choice==='ground'){line([[-80,0,0],[x,0,0]],'signal',{dashed:true});reading=`Do solo: passageiro se move com v = ${value} m/s junto com o vagão; trajetória é uma reta.`;}
    else {ring(4,[x,0,0],'xz','signal');reading=`Do vagão: passageiro em repouso (v = 0); o solo é que se afasta a ${value} m/s para trás.`;arrow([40,-34,0],[0,-34,0],'reference');}
    label([0,60,0],choice==='ground'?'observador no solo':'observador no vagão');legend='Vinho: passageiro · cinza: trilho'; break;
  }
  case 'uniform': {
    floor(-20);const n=Math.min(5,Math.floor(t*5+1e-9));
    for(let i=0;i<=4;i++){const x=-90+i*value*4.5;line([[x,-20,-10],[x,-20,10]],'reference');label([x,-36,0],`${i}s`);}
    dot([-90+value*4.5*4*t,-12,0],'signal',8);
    reading=`s = v·t = ${value}·t. A cada 1 s, +${value} m. Em 4 s: ${value*4} m; marcas igualmente espaçadas. Agora: t = ${fmt(4*t,1)} s (${n} marcas).`;break;
  }
  case 'accelerated': {
    floor(-20);const s=(tt:number)=>value*tt*tt/2;const sc=170/s(4);
    for(let i=0;i<=4;i++){const x=-85+s(i)*sc;line([[x,-20,-10],[x,-20,10]],'reference');label([x,-36,0],`${i}s`);}
    const T=4*t;dot([-85+s(T)*sc,-12,0],'signal',8);arrow([-85+s(T)*sc,-2,0],[-85+s(T)*sc+value*T*2,-2,0],'sum');
    reading=`a = ${value} m/s²: v = ${fmt(value*T)} m/s e s = ${fmt(s(T))} m em t = ${fmt(T,1)} s. Distâncias de cada segundo: ${[1,3,5,7].map(k=>fmt(value*k/2)).join(' : ')} m.`;break;
  }
  case 'newton': {
    floor(-30);const a=newtonAcceleration(value,choice==='rough'),T=2*t,x=-40+clamp(a*T*T/2*8,0,90);
    box([x,-15,0],[30,30,30]);arrow([x+15,-15,0],[x+15+value*1.4,-15,0],'signal');arrow([x,-30,0],[x,-70,0],'reference');arrow([x,0,0],[x,40,0],'reference');
    if(choice==='rough'&&value>0)arrow([x-15,-28,0],[x-15-Math.min(value,10)*2.4,-28,0],'sum');
    reading=`F = ${value} N${choice==='rough'?`, atrito ${fmt(Math.min(value,10))} N`:''}: a = F_res/m = ${fmt(a)} m/s². ${a===0?'Sem resultante: repouso (1ª lei).':'Resultante acelera (2ª lei).'} Peso e normal se anulam.`;
    legend='Vinho: força aplicada · azul: atrito · cinza: peso e normal'; break;
  }
  case 'incline': {
    const th=value*pi/180,L=120,h=L*Math.sin(th),b=L*Math.cos(th);
    for(const z of [-25,25])line([[-b/2,-50,z],[b/2,-50,z],[-b/2,-50+h,z]],'body',{closed:true});
    line([[-b/2,-50,-25],[-b/2,-50,25]]);line([[b/2,-50,-25],[b/2,-50,25]]);line([[-b/2,-50+h,-25],[-b/2,-50+h,25]]);
    const p:SpatialPoint=[0,-50+h/2+6,0],u:SpatialPoint=[Math.cos(th),-Math.sin(th),0];dot(p,'body',7);
    arrow(p,[p[0],p[1]-40,0],'reference');arrow(p,[p[0]+u[0]*40*Math.sin(th),p[1]+u[1]*40*Math.sin(th),0],'signal');
    arrow(p,[p[0]-Math.sin(th)*40*Math.cos(th),p[1]-Math.cos(th)*40*Math.cos(th),0],'sum');
    reading=`θ = ${value}°: P·sen θ = ${fmt(20*Math.sin(th))} N ao longo da rampa; P·cos θ = N = ${fmt(20*Math.cos(th))} N. a = g·sen θ = ${fmt(G*Math.sin(th))} m/s².`;
    legend='Vinho: P·sen θ · azul: P·cos θ · cinza: peso'; break;
  }
  case 'gravity': {
    const d=25*value+10;sphere(18,[-d,0,0],'body');sphere(10,[d,0,0],'sum');
    const f=40/(value*value);arrow([-d+18,0,0],[-d+18+f,0,0]);arrow([d-10,0,0],[d-10-f,0,0]);
    label([0,-35,0],`d = ${value}`);
    reading=`F ∝ 1/d²: em d = ${value}, F = F₀/${value*value} = ${fmt(100/(value*value))}% de F₀. As duas setas têm mesmo módulo (ação e reação).`;break;
  }
  case 'vertical': {
    const H=value*value/(2*G),T=2*value/G,tt=t*T,y=value*tt-G*tt*tt/2,sc=100/(30*30/(2*G));
    line([[0,-60,0],[0,-60+H*sc,0]],'reference',{dashed:true});dot([0,-60+y*sc,0],'signal',8);
    const v=value-G*tt;arrow([12,-60+y*sc,0],[12,-60+y*sc+v*1.5,0],'sum');floor(-60,60,40);
    reading=`v₀ = ${value} m/s: h_máx = v₀²/2g = ${fmt(H)} m, voo total ${fmt(T)} s. Agora t = ${fmt(tt)} s, v = ${fmt(v)} m/s, a = −10 m/s² sempre.`;
    legend='Vinho: corpo · azul: velocidade'; break;
  }
  case 'orbit': {
    const e=value/100,a=90,b=a*Math.sqrt(1-e*e),c=a*e;
    line(Array.from({length:65},(_,i):SpatialPoint=>[a*Math.cos(i*pi/32)-c,0,b*Math.sin(i*pi/32)]),'reference');
    dot([0,0,0],'signal',10);
    // Kepler: anomalia média uniforme no tempo → resolve E − e·sen E = M
    const M=2*pi*t;let E=M;for(let k=0;k<20;k++)E=E-(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));
    const p:SpatialPoint=[a*Math.cos(E)-c,0,b*Math.sin(E)];dot(p,'sum',6);line([[0,0,0],p],'sum',{dashed:true});
    reading=`e = ${fmt(e)}: v_periélio/v_afélio = ${fmt(keplerSpeedRatio(e))}. Raio vetor varre áreas iguais em tempos iguais; o planeta corre mais perto da estrela.`;
    legend='Vinho: estrela no foco · azul: planeta e raio vetor'; break;
  }
  case 'projectile': {
    const th=value*pi/180,v0=20,T=2*v0*Math.sin(th)/G,R=rangeOf(v0,value),sc=4;
    floor(-50,100,40);
    const path=Array.from({length:31},(_,i):SpatialPoint=>{const tt=T*i/30;return [-80+v0*Math.cos(th)*tt*sc,-50+(v0*Math.sin(th)*tt-G*tt*tt/2)*sc,0];});
    line(path,'reference',{dashed:true});const tt=T*t;const p:SpatialPoint=[-80+v0*Math.cos(th)*tt*sc,-50+(v0*Math.sin(th)*tt-G*tt*tt/2)*sc,0];dot(p,'signal',7);
    arrow(p,[p[0]+v0*Math.cos(th)*1.5,p[1],0],'sum');arrow(p,[p[0],p[1]+(v0*Math.sin(th)-G*tt)*1.5,0],'signal');
    reading=`θ = ${value}°: alcance v₀²·sen 2θ/g = ${fmt(R)} m, altura ${fmt((v0*Math.sin(th))**2/(2*G))} m, voo ${fmt(T)} s. vₓ = ${fmt(v0*Math.cos(th))} m/s constante.`;
    legend='Azul: componente horizontal constante · vinho: componente vertical e corpo'; break;
  }
  case 'shm': {
    const w=10,x=value*Math.cos(2*pi*t)*5;floor(-25,90,30);line([[-100,-25,0],[-100,20,0]],'body');
    const n=12,start=-100,end=-20+x;line(Array.from({length:n+1},(_,i):SpatialPoint=>[start+(end-start)*i/n,i%2?6:-6,0]),'sum');
    box([end+10,-10,0],[20,30,30],'signal');line([[-20-value*5+10,-35,0],[-20+value*5+10,-35,0]],'reference',{dashed:true});
    reading=`A = ${value} cm, ω = √(k/m) = ${w} rad/s, T = ${fmt(2*pi/w)} s. x = ${fmt(value*Math.cos(2*pi*t))} cm; v_máx = ωA = ${fmt(w*value/100)} m/s no centro.`;
    legend='Azul: mola · vinho: massa'; break;
  }
  case 'impulse': {
    const dv=value*0.1/0.5,x=-60+(t>0.3?(t-0.3)*dv*20:0);floor(-30);sphere(12,[x,-18,0],'signal');
    if(t<0.35)arrow([-100,-18,0],[-74,-18,0],'sum');arrow([x,0,0],[x+dv*3,0,0],'sum');
    reading=`I = F·Δt = ${value} × 0,1 = ${fmt(value*0.1)} N·s = Δq. Bola de 0,5 kg sai a ${fmt(dv)} m/s.`;break;
  }
  case 'recoil': {
    const vB=2*1/value,xa=-15-t*2*25,xb=15+t*vB*25;floor(-30);box([xa,-15,0],[24,24,24],'signal');box([xb,-15,0],[24*Math.cbrt(value),24,24],'sum');
    if(t<.05)line([[-3,-15,0],[3,-15,0]],'reference');
    reading=`q_total = 0 antes e depois: 1·(−2) + ${value}·v_B = 0 ⇒ v_B = ${fmt(vB)} m/s. Carrinho mais pesado sai mais devagar.`;break;
  }
  case 'collision': {
    const [ua,ub]=collisionVelocities(value,choice==='elastic'),tc=.4,sc=14;floor(-30);
    const xa=t<tc?-80+4*sc*t:-80+4*sc*tc+ua*sc*(t-tc),xb=t<tc?-80+4*sc*tc+24:-80+4*sc*tc+24+ub*sc*(t-tc);
    box([xa,-15,0],[24,24,24],'signal');box([xb,-15,0],[24,24,24],'sum');
    const ec0=8,ec1=(ua*ua+value*ub*ub)/2;
    reading=`Depois: v_A = ${fmt(ua)} m/s, v_B = ${fmt(ub)} m/s. q = 4 kg·m/s conservada; Ec ${fmt(ec0)} J → ${fmt(ec1)} J${choice==='elastic'?' (conservada)':' (parte vira calor e deformação)'}.`;break;
  }
  case 'kinetic-work': {
    const d=value*t,v=Math.sqrt(2*8*d/2),sc=30;floor(-30);box([-80+d*sc,-15,0],[24,24,24],'signal');
    arrow([-80+d*sc+12,-15,0],[-80+d*sc+40,-15,0],'sum');line([[-80,-38,0],[-80+value*sc,-38,0]],'reference',{dashed:true});
    reading=`W = F·d = 8 × ${fmt(d)} = ${fmt(8*d)} J = ΔEc; v = ${fmt(v)} m/s. No fim (${value} m): Ec = ${8*value} J.`;break;
  }
  case 'potential': {
    const sc=18;floor(-60,60,40);
    if(choice==='ramp'){line([[-50,-60,0],[50,-60+value*sc,0]],'reference');}else line([[0,-60,0],[0,-60+value*sc,0]],'reference');
    dot(choice==='ramp'?[50,-60+value*sc,0]:[0,-60+value*sc,0],'signal',8);label([70,-60+value*sc,0],`h = ${value} m`);
    reading=`Ep = m·g·h = 2 × 10 × ${value} = ${20*value} J. Trabalho do peso na subida: −${20*value} J, ${choice==='ramp'?'igual pela rampa':'igual pela vertical'}: força conservativa não depende do caminho.`;break;
  }
  case 'track': {
    const sc=18,profile=(x:number)=>-60+(x/90)**2*5*sc;line(Array.from({length:41},(_,i):SpatialPoint=>{const x=-90+i*4.5;return [x,profile(x),0];}),'body');
    const h1=choice==='friction'?value*0.8:value,xL=-90*Math.sqrt(value/5),xR=90*Math.sqrt(h1/5);
    const x=t<.5?xL+(0-xL)*(t*2):(xR)*((t-.5)*2);dot([x,profile(x)+6,0],'signal',7);
    line([[xL,-60+value*sc,0],[xR+20,-60+value*sc,0]],'reference',{dashed:true});
    reading=`Sai de ${value} m: Em = ${10*value} J. ${choice==='friction'?`Atrito dissipa 20%: chega a ${fmt(h1)} m do outro lado.`:'Sem atrito: volta à mesma altura.'} Na base, v = ${fmt(Math.sqrt(2*G*(choice==='friction'?value*0.9:value)))} m/s.`;break;
  }
  case 'power': {
    line([[-60,-60,0],[-60,60,0],[30,60,0]],'body');line([[30,60,0],[30,-40+80*t,0]],'reference');box([30,-50+80*t,0],[22,22,22],'signal');
    const Pu=100*G*4/value;reading=`Útil: mgh/t = 4000/${value} = ${fmt(Pu)} W. Total com η = 80%: ${fmt(Pu/0.8)} W; perdas ${fmt(Pu/0.8-Pu)} W.`;break;
  }
  case 'plant': {
    if(choice==='hydro'){
      const sc=value/100*90;box([-60,-50+sc/2,0],[30,sc,60],'reference');route([[-45,-50+sc,0],[-45,-50,0],[20,-50,0]],'sum');
      ring(14,[30,-50,0],'xy','signal');label([30,-75,0],'turbina');
      reading=`P = η·ρ·Q·g·h = 0,9 × 1000 × 10 × 10 × ${value} = ${fmt(0.9*1000*10*10*value/1e6)} MW. Energia potencial da água → cinética → elétrica.`;
    } else {
      box([-70,-30,0],[30,40,30],'signal');label([-70,0,0],'calor');route([[-55,-30,0],[0,10,0],[40,10,0],[40,-40,0],[-55,-40,0]],'sum');ring(14,[40,10,0],'xy','body');label([40,35,0],'turbina');
      reading='Térmica/nuclear: calor (combustão ou fissão) ferve água; vapor gira a turbina; o condensador fecha o ciclo. Parte do calor é rejeitada obrigatoriamente.';
    }break;
  }
  case 'mass-energy': {
    const E=value*1e-6*9e16;sphere(26,[-40,0,0],'body');sphere(24,[40,0,0],'sum');arrow([-12,0,0],[14,0,0]);
    reading=`Δm = ${value} mg ⇒ E = Δm·c² = ${sci(E)} J ≈ ${sci(E/3.6e6)} kWh. A massa “sumida” sai como energia.`;break;
  }
  case 'lever': {
    const tilt=0;line([[-100,tilt,0],[100,tilt,0]],'body');line([[0,0,0],[-12,-25,0],[12,-25,0],[0,0,0]],'reference',{closed:true});
    const xB=value*25,FB=120/value;arrow([-50,0,0],[-50,-40,0]);arrow([xB,0,0],[xB,-FB*0.6,0],'sum');
    label([-50,-55,0],'60 N · 2 m');label([xB,-FB*.6-15,0],`${fmt(FB)} N`);
    reading=`Σ momentos = 0: 60 × 2 = F_B × ${value} ⇒ F_B = ${fmt(FB)} N. Maior braço, menor força.`;break;
  }
  case 'expansion': {
    const a=23e-6,dL=a*value,ex=1+dL*100;
    const s:SpatialPoint=choice==='linear'?[100*ex,8,8]:choice==='surface'?[80*ex,4,80*ex]:[70*ex,70*ex,70*ex];
    box([0,0,0],choice==='linear'?[100,8,8]:choice==='surface'?[80,4,80]:[70,70,70],'reference');box([0,0,0],s,'signal');
    const k=choice==='linear'?1:choice==='surface'?2:3;
    reading=`ΔT = ${value} °C: Δ = ${k}α·ΔT·inicial = ${sci(k*dL)} (relativo) — ${choice==='linear'?`ΔL = ${fmt(dL*1000,3)} mm em 1 m`:choice==='surface'?`ΔA = ${fmt(2*dL*1e4,2)} cm² em 1 m²`:`ΔV = ${fmt(3*dL*1e6,0)} cm³ em 1 m³`}. Desenho exagerado.`;break;
  }
  case 'phase': {
    const st=iceState(value),warm=2.1,melt=33.4,heat=(80-warm-melt);
    const pts:SpatialPoint[]=[[-90,-40,0],[-90+warm*2.2,-30,0],[-90+(warm+melt)*2.2,-30,0],[-90+80*2.2,-30+heat*1000/418*0.6,0]];
    line(pts,'reference');const x=-90+value*2.2;let y=-40;if(value<=warm)y=-40+value/warm*10;else if(value<=warm+melt)y=-30;else y=-30+(value-warm-melt)*1000/418*.6;
    dot([x,y,0],'signal',7);box([0,50,0],[30*(1-st.meltedFraction)+2,30*(1-st.meltedFraction)+2,30*(1-st.meltedFraction)+2],'sum');
    label([-40,-55,0],'Q →');label([-100,-20,0],'T');
    reading=`Q = ${value} kJ: T = ${fmt(st.temperature,1)} °C, ${fmt(st.meltedFraction*100,0)}% fundido. ${st.meltedFraction>0&&st.meltedFraction<1?'No patamar, calor latente: T fixa em 0 °C.':'Fora do patamar, calor sensível muda a temperatura.'}`;break;
  }
  case 'carnot': {
    // Ciclo ideal com γ = 1,4: isoterma quente, adiabática, isoterma fria e adiabática de volta.
    const g=1.4,Th=600,Tc=value,va=1,vb=2,r=(Th/Tc)**(1/(g-1)),vc=vb*r,vd=va*r;
    const legs:[number,number,number,boolean][]=[[va,vb,Th,true],[vb,vc,Th,false],[vc,vd,Tc,true],[vd,va,Tc,false]];
    const pts:SpatialPoint[]=[],vmax=vc,pmax=Th/va;
    const toP=(v:number,pp:number):SpatialPoint=>[-90+Math.log(v)/Math.log(vmax)*180,-60+pp/pmax*120,0];
    for(const [v0,v1,T,iso] of legs)for(let i=0;i<=12;i++){const v=v0*(v1/v0)**(i/12);const pp=iso?T/v:(T/v0)*(v0/v)**g;pts.push(toP(v,pp));}
    line(pts,'reference',{closed:true});const i=Math.round(t*(pts.length-1));dot(pts[i],'signal',6);
    label([-90,72,0],'p');label([100,-60,0],'ln V');
    reading=`T_Q = 600 K, T_F = ${value} K: η_Carnot = 1 − ${value}/600 = ${fmt(carnotEfficiency(value)*100,1)}%. Nenhuma máquina real entre as mesmas fontes supera esse valor.`;break;
  }
  case 'charging': {
    sphere(20,[-40,0,0],'signal');sphere(20,[40,0,0],'sum');
    if(choice==='contact'){const x=40-t*20;line([[-20,0,0],[x-20,0,0]],'reference');reading=`Contato entre esferas idênticas: ${value} nC + 0 → ${fmt(value/2)} nC em cada. Carga total conservada; mesmo sinal.`;}
    else if(choice==='induction'){label([-40,0,0],'+');label([20,0,0],'−');label([58,0,0],'+');if(t>.5)arrow([60,-20,0],[60,-60,0],'reference');reading=`Indução: A (+${value} nC) atrai elétrons para o lado próximo de B. Aterrando o lado distante e desfazendo, B fica negativa: sinal oposto ao do indutor.`;}
    else {label([-40,0,0],`+${value}`);label([40,0,0],`−${value}`);reading=`Atrito: elétrons passam de um corpo ao outro. Ficam +${value} nC e −${value} nC: mesmos módulos, sinais opostos.`;}
    break;
  }
  case 'current': {
    const r=14;for(const x of [-100,100])ring(r,[x,0,0],'yz','reference');line([[-100,r,0],[100,r,0]],'reference');line([[-100,-r,0],[100,-r,0]],'reference');
    ring(r,[0,0,0],'yz','signal');
    for(let i=0;i<value*2;i++){const x=-100+((i*37+t*200)%200);dot([x,((i*7)%3-1)*6,((i*5)%3-1)*6],'sum',3.5);}
    arrow([-30,30,0],[30,30,0]);
    reading=`i = ${value} A: Q = i·Δt = ${value*10} C em 10 s, ou ${sci(value*10/1.6e-19)} elétrons pela seção destacada.`;legend='Vinho: seção e sentido convencional · azul: portadores';break;
  }
  case 'electric-power': {
    resistor([-50,0,0],[50,0,0]);wire([[-50,0,0],[-90,0,0],[-90,-50,0],[90,-50,0],[90,0,0],[50,0,0]]);battery(0,-50,0);
    const P=value*value/48;ring(10+P/30,[0,0,0],'xy','signal');
    reading=`U = ${value} V, R = 48 Ω: i = ${fmt(value/48)} A, P = U²/R = ${fmt(P)} W, ${fmt(P/1000,3)} kWh por hora. Dobrar U quadruplica P.`;break;
  }
  case 'resistors': {
    const R1=6,R2=value,Req=choice==='series'?R1+R2:R1*R2/(R1+R2);
    wire([[-90,-40,0],[-90,40,0]]);battery(-90,0,0);
    if(choice==='series'){resistor([-90,40,0],[0,40,0]);resistor([0,40,0],[90,40,0]);wire([[90,40,0],[90,-40,0],[-90,-40,0]]);}
    else {wire([[-90,40,0],[-30,40,0]]);resistor([-30,40,-25],[60,40,-25]);resistor([-30,40,25],[60,40,25]);wire([[-30,40,-25],[-30,40,25]]);wire([[60,40,-25],[60,40,25]]);wire([[60,40,0],[90,40,0],[90,-40,0],[-90,-40,0]]);}
    reading=`R₁ = 6 Ω, R₂ = ${R2} Ω ${choice==='series'?'em série':'em paralelo'}: R_eq = ${fmt(Req)} Ω, i_total = ${fmt(12/Req)} A.${choice==='parallel'?' R_eq menor que o menor resistor.':''}`;break;
  }
  case 'meters': {
    wire([[-90,-40,0],[-90,40,0],[90,40,0],[90,-40,0],[-90,-40,0]]);battery(-90,0,0);resistor([20,40,0],[80,40,0]);
    if(choice==='ammeter'){ring(12,[-20,40,0],'xy','signal');label([-20,40,0],'A');reading=`Amperímetro em série: lê i = 12/${value} = ${fmt(12/value)} A. Resistência ideal nula, não altera o circuito.`;}
    else {wire([[20,40,0],[20,80,0],[80,80,0],[80,40,0]],'signal');ring(12,[50,80,0],'xy','signal');label([50,80,0],'V');reading=`Voltímetro em paralelo à carga: lê 12 V. Resistência ideal infinita: não desvia corrente (i = ${fmt(12/value)} A segue pela carga).`;}
    break;
  }
  case 'generator': {
    const U=12-2*value;line([[-90,-60,0],[90,-60,0]],'reference');line([[-90,-60,0],[-90,60,0]],'reference');
    line([[-90,-60+12*9,0],[-90+6*28,-60,0]],'body');dot([-90+value*28,-60+U*9,0],'signal',7);
    label([-90,70,0],'U');label([100,-60,0],'i');
    reading=`i = ${value} A: U = 12 − 2·${value} = ${fmt(U)} V; P_útil = ${fmt(U*value)} W. Curto em i = 6 A; máximo útil em 3 A (18 W).`;break;
  }
  case 'receiver': {
    const U=6+value;line([[-90,-60,0],[90,-60,0]],'reference');line([[-90,-60,0],[-90,60,0]],'reference');
    line([[-90,-60+6*8,0],[-90+5*34,-60+11*8,0]],'body');dot([-90+value*34,-60+U*8,0],'signal',7);
    reading=`i = ${value} A: U = 6 + 1·${value} = ${U} V; P_útil = ε′i = ${6*value} W; η = ${fmt(600/U,1)}%. Receptor consome tensão além de ε′.`;break;
  }
  case 'loop': {
    const i=12/(1+2+value);wire([[-90,-40,0],[-90,40,0]]);battery(-90,0,0);resistor([-90,40,0],[0,40,0]);resistor([0,40,0],[90,40,0]);wire([[90,40,0],[90,-40,0],[-90,-40,0]]);
    const per=[[-90,-40,0],[-90,40,0],[90,40,0],[90,-40,0],[-90,-40,0]] as SpatialPoint[];
    for(let k=0;k<4;k++){const tt=(t+k/4)%1,p=tt*4,j=Math.floor(p);dot(lerp(per[j],per[j+1],p-j),'sum',3.5);}
    reading=`i = ε/(r + R₁ + R₂) = 12/(1 + 2 + ${value}) = ${fmt(i)} A. U(R₂) = ${fmt(i*value)} V; U terminal = ${fmt(12-i)} V.`;break;
  }
  case 'kirchhoff': {
    dot([0,0,0],'signal',7);arrow([-90,0,0],[-8,0,0],'sum');arrow([0,6,0],[0,80,0]);arrow([6,0,0],[90,0,0]);arrow([0,0,0],[0,0,60],'reference');
    const i3=3-value;label([-60,15,0],'3 A');label([20,60,0],`${value} A`);label([70,15,0],`${fmt(Math.abs(i3))} A`);
    reading=`Nó: 3 A entram; ${value} A saem no ramo 2, logo o ramo 3 leva ${fmt(i3)} A${i3<0?' — sinal negativo: o sentido real é entrando no nó':''}. Carga não se acumula no nó.`;break;
  }
  case 'capacitor': {
    const d=value*15;box([0,-d/2,0],[90,2,90],'signal');box([0,d/2,0],[90,2,90],'sum');
    for(const x of [-30,0,30])arrow([x,d/2-2,0],[x,-d/2+2,0],'reference');
    const C=8.85e-12*0.1/(value/1000);
    reading=`d = ${value} mm: C = ε₀A/d = ${sci(C)} F; Q = C·U = ${sci(C*100)} C; E = U/d = ${sci(100/(value/1000))} V/m. Aproximar as placas aumenta C.`;break;
  }
  case 'pinhole': {
    const p=value,ox=-p,img=30*10/p;line([[ox,0,0],[ox,30,0]],'signal');box([25,0,0],[50,70,50],'reference');dot([0,0,0],'reference',2);
    line([[ox,30,0],[50,-img*1.5,0]],'reference');line([[ox,0,0],[50,0,0]],'reference');line([[50,0,0],[50,-img*1.5,0]],'sum');
    reading=`p = ${value} cm, p′ = 10 cm: imagem invertida de ${fmt(img)} cm (i/o = p′/p). Afastar o objeto diminui a imagem.`;break;
  }
  case 'plane-mirror': {
    box([0,0,0],[3,90,90],'reference');line([[-value*2,-20,0],[-value*2,20,0]],'signal',{arrow:true});line([[value*2,-20,0],[value*2,20,0]],'sum',{arrow:true,dashed:true});
    line([[-value*2,20,0],[0,0,25],[-value*2,-40,40]],'reference');line([[0,0,25],[value*2,20,0]],'reference',{dashed:true});
    reading=`Objeto a ${value} cm, imagem virtual a ${value} cm atrás: distância objeto–imagem ${2*value} cm. Mesmo tamanho, direita, revertida.`;break;
  }
  case 'spherical-mirror': {
    const pp=mirrorImage(value),m=Number.isFinite(pp)?-pp/value:Infinity;
    line(Array.from({length:21},(_,i):SpatialPoint=>{const a=-0.5+i*0.05;return [80*Math.cos(a)-80+60,80*Math.sin(a),0];}),'body');
    line([[-110,0,0],[70,0,0]],'reference');dot([60-20*2,0,0],'reference',3);label([20,-12,0],'F');
    const ox=60-value*2;line([[ox,0,0],[ox,20,0]],'signal',{arrow:true});
    if(Number.isFinite(pp)){const ix=60-pp*2,ih=20*m;if(Math.abs(ix)<110&&Math.abs(ih)<90)line([[ix,0,0],[ix,ih,0]],'sum',{arrow:true,dashed:pp<0});}
    reading=Number.isFinite(pp)?`p = ${value} cm, f = 20 cm: p′ = ${fmt(pp)} cm, A = ${fmt(m)}. Imagem ${pp>0?'real e invertida':'virtual e direita'}${Math.abs(m)>1?', ampliada':', reduzida'}.`:'Objeto no foco: raios saem paralelos, imagem imprópria (no infinito).';break;
  }
  case 'eye': {
    sphere(45,[0,0,0],'reference');ring(14,[-40,0,0],'yz','body');
    const shift=choice==='myopia'?-15:choice==='hyperopia'?15:0,corrected=shift+value*(choice==='myopia'?5:choice==='hyperopia'?-5:0);
    const fx=45+corrected;for(const y of [-14,14])line([[-110,y,0],[-40,y,0],[Math.min(fx,90),0,0]],'signal');dot([45,0,0],'sum',4);label([60,-20,0],'retina');
    if(value!==0)ring(16,[-80,0,0],'yz',value<0?'sum':'signal');
    reading=`${choice==='myopia'?'Miopia: foco antes da retina':choice==='hyperopia'?'Hipermetropia: foco além da retina':'Emetropia: foco na retina'}. Lente de ${value} di desloca o foco ${Math.abs(corrected)<1e-9?'para a retina':`para ${corrected<0?'antes':'depois'} dela`}. ${choice==='myopia'?'Corrige com divergente (di < 0).':choice==='hyperopia'?'Corrige com convergente (di > 0).':''}`;break;
  }
  case 'telescope': {
    const tel=choice==='telescope',fo=tel?value:1,L=tel?value+5:16+1+5,sc=200/(tel?105:22);
    line([[-100,0,0],[-100+L*sc,0,0]],'reference');ring(18,[-100,0,0],'yz','signal');ring(10,[-100+L*sc,0,0],'yz','sum');
    for(const y of [-12,12])line([[-120,y,0],[-100,y,0],[-100+fo*sc,0,0]],'signal');
    reading=tel?`Luneta: A = f_ob/f_oc = ${value}/5 = ${fmt(value/5)}×; tubo ≈ ${value+5} cm. Objetiva longa aumenta o aumento angular.`:'Microscópio: objetiva de 1 cm faz imagem real ampliada; ocular de 5 cm age como lupa. A ≈ (16/1)·(25/5) = 80×.';break;
  }
  case 'wave-types': {
    const k=2*pi/80;for(let i=0;i<=24;i++){const x=-100+i*200/24,ph=k*x-2*pi*t*2;
      if(choice==='transverse')dot([x,value*Math.sin(ph),0],i===12?'signal':'sum',i===12?6:3);
      else dot([x+value*.8*Math.sin(ph),0,0],i===12?'signal':'sum',i===12?6:3);}
    arrow([-60,40,0],[60,40,0],'reference');label([0,55,0],'propagação');
    reading=`${choice==='transverse'?'Transversal: oscilação ⟂ propagação':'Longitudinal: oscilação ∥ propagação'}; amplitude ${value}. O ponto vinho oscila no lugar — energia viaja, matéria não.`;break;
  }
  case 'wave-speed': {
    const lam=20/value,sc=18;line(Array.from({length:81},(_,i):SpatialPoint=>{const x=-100+i*2.5;return [x,25*Math.sin(2*pi*((x+100)/(lam*sc)-t*2)),0];}),'sum');
    line([[-100,-40,0],[-100+lam*sc,-40,0]],'signal',{arrow:true});label([-100+lam*sc/2,-55,0],`λ = ${fmt(lam)} m`);
    reading=`v = 20 m/s fixa: f = ${value} Hz ⇒ λ = v/f = ${fmt(lam)} m. Período T = ${fmt(1/value,3)} s.`;break;
  }
  case 'sound': {
    dot([0,0,0],'signal',8);const lam=340/value,gap=clamp(lam*25,12,90);
    for(let k=0;k<6;k++){const r=((k+t)*gap)%110+6;sphere(r,[0,0,0],k%2?'reference':'sum');}
    reading=`f = ${value} Hz no ar: λ = 340/${value} = ${fmt(lam)} m; ${value<300?'som grave':value<700?'som médio':'som agudo'}. Esferas = compressões avançando.`;break;
  }
  case 'intensity': {
    dot([0,0,0],'signal',8);const r=value*12;sphere(r,[0,0,0],'sum');sphere(12,[0,0,0],'reference');
    const I=0.1/(4*pi*value*value),b=10*Math.log10(I/1e-12);
    reading=`r = ${value} m: I = P/4πr² = ${sci(I)} W/m², β = ${fmt(b,1)} dB. Dobrar r divide I por 4 (−6 dB).`;break;
  }
  case 'wave-phenomena': {
    if(choice==='polarization'){const th=value*pi/180;box([-50,0,0],[2,60,60],'reference');line([[-50,-30,0],[-50,30,0]],'sum');
      box([30,0,0],[2,60,60],'reference');line([[30,-30*Math.cos(th),-30*Math.sin(th)],[30,30*Math.cos(th),30*Math.sin(th)]],'signal');
      const I=Math.cos(th)**2;arrow([-100,0,0],[-55,0,0],'sum');arrow([35,0,0],[35+60*I+1,0,0],'signal');
      reading=`θ = ${value}°: I = I₀·cos²θ = ${fmt(I*100,1)}% do que passa pelo primeiro filtro. Só onda transversal se polariza.`;}
    else if(choice==='diffraction'){const w=10+value/2;box([0,w/2+30,0],[4,60,40],'body');box([0,-w/2-30,0],[4,60,40],'body');
      for(let k=1;k<5;k++)line(Array.from({length:21},(_,i):SpatialPoint=>{const a=-pi/2+i*pi/20,r=k*18+t*18;return [r*Math.cos(a),r*Math.sin(a)*(w<30?1:.45),0];}),'sum');
      reading=`Abertura ${fmt(w/10,1)}λ: ${w<30?'comparável ao comprimento de onda, difração forte — a onda se abre':'grande diante de λ, difração fraca — feixe quase reto'}.`;}
    else {const f=value/15,A=1/Math.sqrt((1-(f/4)**2)**2+(0.1*f/4)**2);const x=clamp(A*4,0,60)*Math.sin(2*pi*t*3);line([[0,80,0],[x,0,0]],'body');dot([x,0,0],'signal',8);
      reading=`Excitação ${fmt(f,1)} Hz, natural 4 Hz: amplitude relativa ${fmt(A,1)}. ${Math.abs(f-4)<.6?'Ressonância: transferência máxima.':'Fora da ressonância, resposta pequena.'}`;}
    break;
  }
  case 'doppler': {
    const [fF,fB]=dopplerPair(value),T=1;const xs=-40+value/340*80*t;
    for(let k=0;k<5;k++){const age=(t+k*.2)%1,born=-40+value/340*80*(t-age);sphere(age*60+2,[born,0,0],'sum');}
    dot([xs,0,0],'signal',7);label([100,0,0],'frente');label([-100,0,0],'trás');void T;
    reading=`v_fonte = ${value} m/s: à frente ${fmt(fF,0)} Hz (agudo), atrás ${fmt(fB,0)} Hz (grave). Frentes comprimidas no sentido do movimento.`;break;
  }
  case 'photoelectric': {
    const Ek=photoelectronEnergy(value);box([40,0,0],[6,80,60],'body');
    for(const y of [-20,0,20])arrow([-100,y+40,0],[34,y,0],'signal');
    if(Ek>0)arrow([46,0,0],[46+Ek*25*t+4,20*t,0],'sum');
    reading=`f = ${value}×10¹⁴ Hz: E_fóton = ${fmt(4.14e-15*value*1e14)} eV. ${Ek>0?`Ec_máx = ${fmt(Ek)} eV`:`Abaixo do corte (${fmt(2.3/4.14e-15/1e14)}×10¹⁴ Hz): nenhum elétron`}.`;break;
  }
  case 'acid-rain': {
    floor(-60);box([-80,-40,0],[20,40,20],'body');
    for(let i=0;i<value;i++){const p=lerp([-80,-15,0],[20+i*12,70,0],t);dot(p,'signal',4);}
    for(let i=0;i<value;i++)if(t>.6)arrow([20+i*12,60,0],[20+i*12,-50,0],'sum');
    const buf=choice==='limestone';box([50,-55,0],[90,8,60],buf?'body':'reference');
    reading=`${value} SO₂ → H₂SO₄ na chuva. ${buf?'CaCO₃ do solo consome H⁺ (CaCO₃ + 2 H⁺ → Ca²⁺ + CO₂ + H₂O): pH cai menos.':'Lago sem tampão: H⁺ acumula e o pH cai.'}`;break;
  }
  case 'combustion': {
    const k=t;for(let i=0;i<value;i++){const z=(i-(value-1)/2)*40,ch4:SpatialPoint=lerp([-70,0,z],[0,0,z],Math.min(1,k*2));
      if(k<.5){molecule([[ch4,'C',7],[[ch4[0]+10,ch4[1]+8,z],'H',4],[[ch4[0]-10,ch4[1]+8,z],'H',4],[[ch4[0],ch4[1]-12,z],'H',4],[[ch4[0],ch4[1]+4,z+12],'H',4]],[[0,1],[0,2],[0,3],[0,4]]);
        for(const s of [-1,1])molecule([[[60,s*25,z],'O',6],[[72,s*25,z],'O',6]],[[0,1]]);}
      else {molecule([[[40,0,z],'C',7],[[28,0,z],'O',6],[[52,0,z],'O',6]],[[0,1],[0,2]]);for(const s of [-1,1])molecule([[[-40,s*28,z],'O',6],[[-50,s*28+8,z],'H',4],[[-30,s*28+8,z],'H',4]],[[0,1],[0,2]]);}}
    reading=`${value} CH₄ + ${2*value} O₂ → ${value} CO₂ + ${2*value} H₂O. ${t<.5?'Reagentes':'Produtos'}: C ${value}, H ${4*value}, O ${4*value} — átomos se conservam; ΔH ≈ −890 kJ/mol.`;break;
  }
  case 'addition': {
    const open=t,dz=value/60*20*(1-open);
    const C1:SpatialPoint=[-12,0,0],C2:SpatialPoint=[12,0,0];
    molecule([[C1,'C',8],[C2,'C',8],[[-24,14,dz],'H',4],[[-24,-14,-dz],'H',4],[[24,14,dz],'H',4],[[24,-14,-dz],'H',4]],[[0,1],[0,2],[0,3],[1,4],[1,5]]);
    if(open<.6)line([[-12,4,0],[12,4,0]],'sum',{dashed:true});
    const br=open*1;molecule([[[-12,0,60-48*br],'Br',8],[[12,0,-60+48*br],'Br',8]],br<.95?[[0,1]]:[]);
    reading=`${open<.6?'Eteno: C=C com ligação π (tracejada)':'1,2-dibromoetano: π rompida'}; Br₂ adiciona um bromo a cada carbono (anti). Hibridação sp² → sp³.`;break;
  }
  case 'esterification': {
    const n=value,k=t;const chain=(x0:number,y:number)=>{for(let i=0;i<n;i++)dot([x0-i*12,y+(i%2?5:-5),0],'body',6);line(Array.from({length:n},(_,i):SpatialPoint=>[x0-i*12,y+(i%2?5:-5),0]));};
    chain(-30,20);dot([-18,20,0],'signal',6);dot([-10,30,0],'signal',6);
    const water:SpatialPoint=lerp([0,20,0],[60,-50,0],k);dot(water,'sum',7);label([water[0],water[1]+14,0],'H₂O');
    dot(lerp([40,20,0],[0,20,0],k),'signal',6);dot(lerp([52,20,0],[12,20,0],k),'body',6);
    reading=`Ácido com ${n} carbonos + metanol ⇌ éster + H₂O. ${k<.5?'Reagentes':'Éster formado'}; o O da água vem da hidroxila do ácido. Retirar água desloca para o éster.`;break;
  }
  case 'transesterification': {
    line([[-80,-30,0],[-80,30,0]],'body');for(const y of [-30,0,30])dot([-80,y,0],'signal',6);
    for(let i=0;i<3;i++){const y=-30+i*30,free=i<value;const end:SpatialPoint=free?lerp([-70,y,0],[40,y,0],t):[-70,y,0];line([end,[end[0]+50,y,0]],free?'sum':'body');dot(end,free?'sum':'body',5);}
    reading=`${value} metanol: ${value} cadeias viram ésteres metílicos (biodiesel). ${value===3?'Sobra glicerol livre.':'Ainda há glicerídeo parcial (mono/di).'}`;break;
  }
  case 'pka': {
    const a=ionizedFraction(value);for(let i=0;i<20;i++){const x=-90+(i%5)*45,z=Math.floor(i/5)*25-40,ion=i<Math.round(a*20);dot([x,0,z],ion?'signal':'reference',ion?5:7);}
    reading=`pH ${value} e pKa 4,75: ${fmt(a*100,1)}% ionizado (A⁻). ${value>4.75?'pH > pKa: predomina A⁻':value<4.75?'pH < pKa: predomina HA':'metade e metade'}.`;break;
  }
  case 'weak-acid': {
    const C=value/1000,Ka=1.8e-5,alpha=choice==='common'?Ka/0.1:Math.sqrt(Ka/C);const al=clamp(alpha,0,1);
    for(let i=0;i<30;i++){const x=-90+(i%6)*36,z=Math.floor(i/6)*20-40,ion=i<Math.max(1,Math.round(al*30*5));dot([x,0,z],ion?'signal':'reference',ion?4:6);}
    const H=choice==='common'?Ka*C/0.1:Math.sqrt(Ka*C);
    reading=`C = ${value} mmol/L${choice==='common'?' + 0,1 mol/L de acetato':''}: α ≈ ${fmt(al*100,2)}%, [H⁺] ≈ ${sci(H)} mol/L, pH ≈ ${fmt(-Math.log10(H))}. ${choice==='common'?'Íon comum desloca para o ácido não ionizado.':'Diluir aumenta α.'} Pontos ionizados ampliados 5× para leitura.`;break;
  }
  case 'solubility': {
    box([0,-60,0],[60,20,60],'body');const s=silverChlorideSolubility(value),n=Math.max(1,Math.round(Math.log10(s/1e-9)*2));
    for(let i=0;i<n;i++)dot([-40+i*18,20,0],'signal',5);for(let i=0;i<Math.round(value/2);i++)dot([-40+i*18,45,20],'sum',5);
    reading=`[Cl⁻] adicionado = ${value} mmol/L: s(AgCl) = ${sci(s)} mol/L. ${value>0?'Íon comum reduz a solubilidade (Kps fixo).':'Em água pura, s = √Kps.'}`;break;
  }
  case 'equilibrium': {
    const shift=choice==='concentration'?(value<1?1:-1):choice==='pressure'?-1:1;
    const k=t;const n2o4=Math.round(4-shift*2*k),no2=Math.round(4+shift*4*k);
    for(let i=0;i<n2o4;i++)molecule([[[-90+i*18,20,0],'N',5],[[-90+i*18,30,0],'N',5]],[[0,1]],'reference');
    for(let i=0;i<no2;i++)dot([20+(i%4)*20,10+Math.floor(i/4)*20,0],'signal',5);
    box([0,20,0],[220,80,60],'reference');
    const dir=shift>0?'produtos (NO₂)':'reagentes (N₂O₄)';
    reading=`${choice==='concentration'?`Q/K = ${fmt(value)}`:choice==='pressure'?'Pressão ↑: favorece menos mols gasosos':'Aquecer: favorece o sentido endotérmico'} → desloca para ${dir}. ${choice==='temperature'?'K muda com T.':'K não muda.'}`;break;
  }
  }
  return {traces,dots,labels,reading,legend};
}
