import { comb, conicType, diceWays, factorial, systemSolution, type MathSpatialKind } from './mathSpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';

const pi=Math.PI,rad=(d:number)=>d*pi/180;
const fmt=(n:number,d=2)=>(Math.abs(n)<1e-12?0:n).toLocaleString('pt-BR',{maximumFractionDigits:d});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
/** Percursos com significado no tempo; os demais recebem a varredura do parâmetro no laboratório. */
export const MATH_MOVING_KINDS:MathSpatialKind[]=['triangle-angles','circle-area','unit-circle','sine-wave','complex-rotation','balance','linear-model','decay','congruence','centroid','composition','queue','tree'];

/** Prancha matemática no espaço: x para a direita, y para cima, z para fora do quadro. U = unidades de desenho por unidade matemática. */
export function mathSpatialDrawing(kind:MathSpatialKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const t=clamp(time,0,1);
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const face=(points:SpatialPoint[],role:SpatialTrace['role']='sum')=>line(points,role,{closed:true});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>{if(Math.hypot(...b.map((v,i)=>v-a[i]))>1e-6)line([a,b],role,{arrow:true});};
  const dot=(point:SpatialPoint,role:SpatialDot['role']='signal',radius=5)=>dots.push({point,role,radius});
  const label=(point:SpatialPoint,text:string)=>labels.push({point,text});
  const cube=(x:number,y:number,z:number,s:number,role:SpatialTrace['role']='sum')=>{
    const p=(dx:number,dy:number,dz:number):SpatialPoint=>[x+dx*s,y+dy*s,z+dz*s];
    face([p(0,0,0),p(1,0,0),p(1,1,0),p(0,1,0)],role);face([p(0,1,0),p(1,1,0),p(1,1,1),p(0,1,1)],role);face([p(1,0,0),p(1,0,1),p(1,1,1),p(1,1,0)],role);
    face([p(0,0,1),p(1,0,1),p(1,1,1),p(0,1,1)],role);
  };
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,role:SpatialTrace['role']='sum')=>{
    const p=(dx:number,dy:number,dz:number):SpatialPoint=>[x+dx*w,y+dy*h,z+dz*d];
    face([p(0,0,1),p(1,0,1),p(1,1,1),p(0,1,1)],role);face([p(0,1,0),p(1,1,0),p(1,1,1),p(0,1,1)],role);face([p(1,0,0),p(1,0,1),p(1,1,1),p(1,1,0)],role);
  };
  const U=16;
  const P=(x:number,y:number,z=0):SpatialPoint=>[x*U,y*U,z];
  /** Plano cartesiano como prancha: moldura translúcida, grade a cada unidade e eixos com seta. */
  const board=(x0=-6,x1=6,y0=-4,y1=5)=>{
    face([P(x0,y0,-2),P(x1,y0,-2),P(x1,y1,-2),P(x0,y1,-2)],'reference');
    // Grade a cada 2 unidades e tracejada: com uma linha por unidade, a grade pesava mais que o gráfico.
    for(let x=Math.ceil(x0/2)*2;x<=x1;x+=2)if(x)line([P(x,y0,-1),P(x,y1,-1)],'reference',{dashed:true});for(let y=Math.ceil(y0/2)*2;y<=y1;y+=2)if(y)line([P(x0,y,-1),P(x1,y,-1)],'reference',{dashed:true});
    arrow(P(x0,0),P(x1+.6,0),'body');arrow(P(0,y0),P(0,y1+.6),'body');label(P(x1+.9,-.6),'x');label(P(-.6,y1+.9),'y');
  };
  const curve=(f:(x:number)=>number,x0:number,x1:number,role:SpatialTrace['role']='signal',lo=-4.5,hi=5.5)=>{
    let seg:SpatialPoint[]=[];
    for(let i=0;i<=80;i++){const x=x0+(x1-x0)*i/80,y=f(x);if(Number.isFinite(y)&&y>=lo&&y<=hi)seg.push(P(x,y,1));else{if(seg.length>1)line(seg,role);seg=[];}}
    if(seg.length>1)line(seg,role);
  };
  const polygon=(pts:[number,number][],role:SpatialTrace['role']='sum',z=0)=>face(pts.map(([x,y])=>P(x,y,z)),role);
  const ringPts=(r:number,cx=0,cy=0,n=64,a0=0,a1=2*pi):SpatialPoint[]=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return P(cx+r*Math.cos(a),cy+r*Math.sin(a),1);});
  const tower=(x:number,h:number,role:SpatialTrace['role']='sum',w=12)=>box(x-w/2,-60,-w/2,w,Math.max(1,h),w,role);
  let reading='',legend='Vinho: destaque · azul: objeto · cinza: referência';

  switch(kind){
  case 'powers':{const a=value,s=Math.min(18,90/a);for(let i=0;i<a;i++)for(let j=0;j<a;j++)for(let k=0;k<(choice==='cube'?a:1);k++)cube((i-a/2)*s,-50+k*s,(j-a/2)*s,s*.94,k===a-1&&choice==='cube'||choice==='square'?'signal':'sum');
    reading=choice==='cube'?`a³ = ${a}³ = ${a**3} cubos; ∛${a**3} = ${a}.`:`a² = ${a}² = ${a*a} cubos numa camada; √${a*a} = ${a}.`;break;}
  case 'ratio':{const k=value;box(-80,-50,-15,24,30,20,'sum');box(10,-50,-15*k,24*k,30*k,20*k,'signal');label([-68,-62,0],'1');label([10+12*k,-62,0],`k = ${fmt(k)}`);
    reading=`Arestas 24:30:20 e ${fmt(24*k)}:${fmt(30*k)}:${fmt(20*k)}. Razão entre correspondentes = ${fmt(k)}; a proporção interna (4:5) é a mesma.`;break;}
  case 'percent':{const n=Math.round(value);for(let i=0;i<100;i++){const r=Math.floor(i/10),c=i%10;cube(-80+c*16,-50,-80+r*16,14,i<n?'signal':'reference');}
    reading=`${n} de 100 cubos = ${n}% = ${fmt(n/100)}.`;break;}
  case 'decimal':{const n=Math.round(value),c=Math.floor(n/100),d=Math.floor(n/10)%10,u=n%10;
    for(let i=0;i<c;i++)box(-100+i*3,-50,-30,30,30,3,'signal');for(let i=0;i<d;i++)box(-10+i*7,-50,-30,5,30,5,'sum');for(let i=0;i<u;i++)cube(70+(i%3)*7,-50+Math.floor(i/3)*7,-10,5,'body');
    label([-85,-68,0],`${c} centenas`);label([20,-68,0],`${d} dezenas`);label([80,-68,0],`${u} unidades`);
    reading=`${n} = ${c}×100 + ${d}×10 + ${u}.`;break;}
  case 'divisors':{const n=value,pairs:[number,number][]=[];for(let a=1;a*a<=n;a++)if(n%a===0)pairs.push([a,n/a]);
    pairs.forEach(([a,b],k)=>{const s=Math.min(8,150/b);for(let i=0;i<a;i++)for(let j=0;j<b;j++)cube(-b*s/2+j*s,-60+k*14,-a*s/2+i*s-k*0,s*.9,k===pairs.length-1?'signal':'sum');});
    const divs=pairs.flatMap(([a,b])=>a===b?[a]:[a,b]).sort((x,y)=>x-y);
    reading=`${n} = ${pairs.map(([a,b])=>`${a}×${b}`).join(', ')}. Divisores: ${divs.join(', ')}${divs.length===2?' — primo.':'.'}`;break;}
  case 'figurate':{const tri=choice==='triangular';let total=0;for(let n=1;n<=value;n++){const x=-100+(n-1)*(n+1)*2.2;for(let i=0;i<n;i++)for(let j=0;j<(tri?i+1:n);j++)cube(x+j*7,-50+i*7,0,6,n===value?'signal':'sum');total=tri?n*(n+1)/2:n*n;}
    reading=`Termo ${value}: ${tri?`${value}(${value}+1)/2`:`${value}²`} = ${total}.`;break;}
  case 'arithmetic':{for(let n=0;n<6;n++)tower(-75+n*30,(2+n*value)*5,n===5?'signal':'sum');line([[-75,-60+2*5,8],[75,-60+(2+5*value)*5,8]],'reference',{dashed:true});
    reading=`aₙ = 2 + (n − 1)·${value}: ${Array.from({length:6},(_,n)=>2+n*value).join(', ')}. Diferença constante ${value}.`;break;}
  case 'geometric':{const q=value/10,terms=Array.from({length:6},(_,n)=>2*q**n),sc=110/terms[5];terms.forEach((v,n)=>tower(-75+n*30,v*sc,n===5?'signal':'sum'));
    reading=`aₙ = 2·${fmt(q)}ⁿ⁻¹: ${terms.map(v=>fmt(v,1)).join(', ')}. Razão constante ${fmt(q)}.`;break;}
  case 'fibonacci':{const f=[1,1];while(f.length<value)f.push(f[f.length-1]+f[f.length-2]);const total=f[f.length-1]+(f[f.length-2]||0),s=150/total;
    // Espiral de quadrados: cada novo quadrado encosta no retângulo acumulado, girando direita → cima → esquerda → baixo.
    let x0=0,y0=0,x1=f[0],y1=f[0];const sq:[number,number,number][]=[[0,0,f[0]]];
    for(let i=1;i<f.length;i++){const L=f[i],side=i%4;let x=0,y=0;if(side===1){x=x1;y=y0;x1+=L;}else if(side===2){x=x0;y=y1;y1+=L;}else if(side===3){x=x0-L;y=y0;x0-=L;}else{x=x0;y=y0-L;y0-=L;}sq.push([x,y,L]);}
    const cx=(x0+x1)/2,cy=(y0+y1)/2;sq.forEach(([x,y,L],i)=>box((x-cx)*s,(y-cy)*s,-4,L*s-1,L*s-1,8,i===sq.length-1?'signal':'sum'));
    reading=`${f.join(', ')}. Razão ${f[f.length-1]}/${f[f.length-2]} = ${fmt(f[f.length-1]/f[f.length-2],3)} → 1,618…`;break;}
  case 'system2':{board();curve(x=>4-x,-6,6,'sum');curve(x=>value*x+1,-6,6,'signal');const s=systemSolution(value);
    if(s&&Math.abs(s[0])<=6&&s[1]>=-4&&s[1]<=5){dot(P(s[0],s[1],2),'signal',6);label(P(s[0]+.8,s[1]+.8),`(${fmt(s[0])}; ${fmt(s[1])})`);}
    reading=s?`Solução única: x = ${fmt(s[0])}, y = ${fmt(s[1])}.`:'Retas paralelas: sistema sem solução.';break;}
  case 'matrix':{const A=[[2,5,3],[4,1,6],[3,3,2]];A.forEach((row,i)=>row.forEach((v,j)=>box(-45+j*32,-60,-45+i*32,22,v*14,22,i+1===value?'signal':'sum')));
    reading=`Linha ${value}: (${A[value-1].join(', ')}). A é 3×3; a${value}${2} = ${A[value-1][1]}.`;break;}
  case 'matmul':{const A=[[1,2,3],[0,1,4]],B=[[2,1],[1,0],[0,3]],i=value-1;
    A[i].forEach((v,k)=>box(-90+k*20,-60,-10,14,v*15,14,'signal'));B.map(r=>r[0]).forEach((v,k)=>box(20+k*20,-60,-10,14,v*15,14,'sum'));
    const c=A[i].reduce((s,v,k)=>s+v*B[k][0],0);label([-70,-75,0],`linha ${value} de A`);label([40,-75,0],'coluna 1 de B');
    reading=`c${value}1 = ${A[i].map((v,k)=>`${v}·${B[k][0]}`).join(' + ')} = ${c}.`;break;}
  case 'determinant':{board(-1,6,-1,4);polygon([[0,0],[3,0],[3+value,2],[value,2]],'signal');arrow(P(0,0,1),P(3,0,1),'sum');arrow(P(0,0,1),P(value,2,1),'sum');
    reading=`det [[3, ${fmt(value)}], [0, 2]] = 3·2 − ${fmt(value)}·0 = 6. Cisalhar não muda a área.`;break;}
  case 'planes':{const s=value,pl=(y:(x:number,z:number)=>number,role:SpatialTrace['role'])=>face([[-60,y(-60,-60),-60],[60,y(60,-60),-60],[60,y(60,60),60],[-60,y(-60,60),60]].map(([x,yy,z])=>[x,clamp(yy,-90,90),z] as SpatialPoint),role);
    pl(()=>0,'reference');pl((x)=>x*.6,'sum');
    if(choice==='spd'){pl((x,z)=>z*.8*s+5,'signal');dot([0,0,0],'signal',6);reading=`Terceiro plano com inclinação ${fmt(s)}: um único ponto comum, solução única.`;}
    else if(choice==='spi'){pl((x,z)=>x*.3,'signal');line([[0,0,-60],[0,0,60]],'signal');reading=`Os três planos contêm a mesma reta (inclinação ${fmt(s)} não altera): infinitas soluções.`;}
    else{pl((x)=>x*.6+30+20*s,'signal');reading=`Terceiro plano paralelo ao segundo, deslocado ${fmt(30+20*s)}: nenhum ponto satisfaz as três.`;}break;}
  case 'means':{const v=[3,4,5,6,value],mean=v.reduce((a,b)=>a+b,0)/5,sorted=[...v].sort((a,b)=>a-b),level=choice==='median'?sorted[2]:mean;
    v.forEach((h,i)=>tower(-70+i*35,h*8,'sum'));face([[-90,-60+level*8,-20],[90,-60+level*8,-20],[90,-60+level*8,20],[-90,-60+level*8,20]],'signal');
    reading=`Média ${fmt(mean)}; mediana ${sorted[2]}. ${choice==='median'?'A mediana não muda com o valor extremo.':'A média acompanha o valor extremo.'}`;break;}
  case 'tree':{const n=value,show=Math.ceil(t*2*n)||2*n;dot([-90,0,0],'body',6);for(let a=0;a<2;a++){const pa:SpatialPoint=[-30,a?40:-40,0];line([[-90,0,0],pa],'sum');dot(pa,'sum',5);
      for(let b=0;b<n;b++){const k=a*n+b,pb:SpatialPoint=[50,pa[1]+(b-(n-1)/2)*18,(b-(n-1)/2)*10];if(k<show){line([pa,pb],'signal');dot(pb,'signal',4);}}}
    reading=`2 × ${n} = ${2*n} caminhos completos.`;break;}
  case 'queue':{const n=value,filled=Math.ceil(t*n);for(let i=0;i<n;i++){box(-90+i*32,-60,-12,24,4,24,'reference');if(i<filled||t===0){dot([-78+i*32,-35,0],i<filled?'signal':'sum',8);}label([-78+i*32,-72,0],`${n-i}`);}
    reading=`Opções por posição: ${Array.from({length:n},(_,i)=>n-i).join(' × ')} = ${factorial(n)} filas.`;break;}
  case 'group':{const k=value;for(let i=0;i<6;i++){const a=i*pi/3;dot([60*Math.cos(a),0,60*Math.sin(a)],i<k?'signal':'sum',9);}
    reading=`C(6, ${k}) = ${comb(6,k)} grupos. Como a ordem não conta, divide-se 6·5·… por ${k}! = ${factorial(k)}.`;break;}
  case 'anagram':{const r=value;for(let i=0;i<6;i++){cube(-75+i*26,-40,-10,20,i<r?'signal':'sum');label([-65+i*26,-55,0],i<r?'A':'BCDEF'[i-r]??'?');}
    reading=`6!/${r}! = ${factorial(6)}/${factorial(r)} = ${factorial(6)/factorial(r)} anagramas.`;break;}
  case 'union':{const i=value,ox=40-i*5;line(ringPts(3,-ox/U,0),'sum');line(ringPts(3,ox/U,0),'signal');
    const pa=8/20,pb=8/20,pab=i/20;reading=`P(A∪B) = ${fmt(pa)} + ${fmt(pb)} − ${fmt(pab)} = ${fmt(pa+pb-pab)}. Sem subtrair, a interseção contaria duas vezes.`;break;}
  case 'independence':{face([[-60,-60,0],[60,-60,0],[60,60,0],[-60,60,0]],'reference');const a=value/100;
    if(choice==='independent'){face([[-60,-60,1],[-60+120*a,-60,1],[-60+120*a,60,1],[-60,60,1]],'sum');face([[-60,-60,2],[60,-60,2],[60,0,2],[-60,0,2]],'signal');
      reading=`Independentes: P(A∩B) = ${fmt(a)}·0,5 = ${fmt(a*.5)}, a área sobreposta.`;}
    else{face([[-60,-60,1],[-60+120*a,-60,1],[-60+120*a,60,1],[-60,60,1]],'sum');face([[60-60,-60,2],[60,-60,2],[60,60,2],[0,60,2]],'signal');
      reading=`Disjuntos: P(A∩B) = 0, logo P(A∪B) = ${fmt(a)} + 0,5 = ${fmt(Math.min(1,a+.5))}. Disjuntos com P > 0 não são independentes.`;}
    break;}
  case 'histogram':{const sk=value,freqs=[2,5,9,10,7,4,3].map((f,i)=>Math.max(1,f+(sk>0?(i>3?sk:-sk*.3*(i<3?1:0)):(i<3?-sk:sk*.3*(i>3?1:0)))));
    const total=freqs.reduce((a,b)=>a+b,0);let mean=0;freqs.forEach((f,i)=>{tower(-90+i*30,f*8,'sum',24);mean+=f*i;});mean/=total;
    let acc=0,med=0;for(let i=0;i<7;i++){acc+=freqs[i];if(acc>=total/2){med=i;break;}}
    line([[-90+mean*30,-60,20],[-90+mean*30,40,20]],'signal');line([[-90+med*30,-60,22],[-90+med*30,40,22]],'body',{dashed:true});
    reading=`Média na classe ${fmt(mean+1,1)}, mediana na classe ${med+1}. ${sk>0?'Cauda à direita: média > mediana.':sk<0?'Cauda à esquerda: média < mediana.':'Simétrica.'}`;break;}
  case 'plane-basics':{face([[-90,0,-70],[90,0,-70],[90,0,70],[-90,0,70]],'reference');const a=rad(value);
    line([[-90,0,0],[90,0,0]],'sum');line([[-80*Math.cos(a),0,-80*Math.sin(a)],[80*Math.cos(a),0,80*Math.sin(a)]],'signal');dot([0,0,0],'body',5);
    reading=`Ângulos: ${value}°, ${180-value}°, ${value}°, ${180-value}°. Opostos pelo vértice são iguais; adjacentes somam 180°.`;break;}
  case 'triangle-angles':{const A=value,B=50,C=180-A-B,L0=8*Math.sin(rad(B))/Math.sin(rad(C)),k=Math.min(1,5.5/(L0*Math.sin(rad(A)))),ax=-4*k,bx=4*k,ang=rad(A),cx=ax+L0*k*Math.cos(ang),cy=L0*k*Math.sin(ang);
    polygon([[ax,-2],[bx,-2],[cx,cy-2]],'sum');const fold=t;dot(P(ax+(cx-ax)*fold*.5,-2+(cy)*fold*.5,2),'signal',4);
    label(P(ax+.6,-1.5),`${A}°`);label(P(bx-.8,-1.5),`${B}°`);label(P(cx,cy-2.7),`${C}°`);
    reading=`${A}° + ${B}° + ${C}° = 180°.`;break;}
  case 'polygon-angles':{const n=value,pts=Array.from({length:n},(_,i)=>[3.5*Math.cos(i*2*pi/n+pi/2),3.5*Math.sin(i*2*pi/n+pi/2)] as [number,number]);polygon(pts,'sum');
    for(let i=1;i<n-1;i++)line([P(...pts[0],1),P(...pts[i+1],1)],'reference',{dashed:true});
    reading=`Soma interna (${n} − 2)·180° = ${(n-2)*180}°; cada ângulo ${fmt((n-2)*180/n,1)}°; externo ${fmt(360/n,1)}°. ${n-2} triângulos.`;break;}
  case 'inscribed':{line(ringPts(4),'reference');const a=rad(value),A:SpatialPoint=P(4,0,1),B:SpatialPoint=P(4*Math.cos(a),4*Math.sin(a),1),V:SpatialPoint=P(4*Math.cos(a/2+pi),4*Math.sin(a/2+pi),1);
    line(ringPts(4,0,0,40,0,a),'signal');line([A,P(0,0,1),B],'sum');line([A,V,B],'signal');dot(V,'signal',4);
    reading=`Arco ${value}°: central ${value}°, inscrito ${fmt(value/2,1)}°.`;break;}
  case 'congruence':{const tri:[number,number][]=[[-4,0],[-1,0],[-3,3]];polygon(tri,'sum');let img:[number,number][];
    if(choice==='reflection'){const c=2*value-1;img=tri.map(([x,y])=>[2*c-x,y]);line([P(c,-4),P(c,5)],'reference',{dashed:true});}
    else if(choice==='rotation'){const a=pi*value*t||pi*value;img=tri.map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]);dot(P(0,0,1),'body',4);}
    else{const d=6*value*(t||1);img=tri.map(([x,y])=>[x+d,y]);}
    polygon(img,'signal',2);reading=`${choice==='reflection'?`Reflexão no eixo x = ${fmt(2*value-1)}: inverte a orientação.`:choice==='rotation'?`Rotação de ${fmt(180*value)}°.`:'Translação.'} Lados 3, √13 e √10 preservados: figuras congruentes.`;break;}
  case 'axes-symmetry':{const n=value,pts=Array.from({length:n},(_,i)=>[3.5*Math.cos(i*2*pi/n+pi/2),3.5*Math.sin(i*2*pi/n+pi/2)] as [number,number]);polygon(pts,'sum');
    for(let i=0;i<n;i++){const a=i*pi/n+pi/2;line([P(4.5*Math.cos(a),4.5*Math.sin(a),2),P(-4.5*Math.cos(a),-4.5*Math.sin(a),2)],'signal',{dashed:true});}
    reading=`${n} lados, ${n} eixos de simetria.`;break;}
  case 'rotational':{const n=value,pts:[number,number][]=[];for(let i=0;i<2*n;i++){const r=i%2?1.6:4,a=i*pi/n+pi/2;pts.push([r*Math.cos(a),r*Math.sin(a)]);}polygon(pts,'sum');
    line(ringPts(4.5,0,0,40,pi/2,pi/2+2*pi/n),'signal');reading=`Menor rotação que preserva a estrela: 360°/${n} = ${fmt(360/n,1)}°; ordem ${n}.`;break;}
  case 'thales':{const ys=[-3,-1,-1+value];ys.forEach(y=>line([P(-6,y,1),P(6,y,1)],'reference'));
    const t1=(y:number)=>-3+(y+3)*.4,t2=(y:number)=>1+(y+3)*.6;line([P(t1(-3.5),-3.5,1),P(t1(ys[2]+.5),ys[2]+.5,1)],'sum');line([P(t2(-3.5),-3.5,1),P(t2(ys[2]+.5),ys[2]+.5,1)],'signal');
    reading=`Distâncias 2 e ${fmt(value)} nas paralelas: segmentos em cada transversal na razão 2 : ${fmt(value)} = ${fmt(2/value)}.`;break;}
  case 'similar':{const k=value;polygon([[-6,-3],[-3,-3],[-6,1]],'sum');polygon([[0,-3],[3*k,-3],[0,-3+4*k]].map(([x,y])=>[x,Math.min(y,5)]) as [number,number][],'signal');
    reading=`Lados 3-4-5 e ${fmt(3*k)}-${fmt(4*k)}-${fmt(5*k)}. Perímetro ×${fmt(k)}; área 6 → ${fmt(6*k*k)} (×${fmt(k*k)}).`;break;}
  case 'centroid':{const A:[number,number]=[-4,-3],B:[number,number]=[4,-3],C:[number,number]=[value/U,4];polygon([A,B,C],'sum');
    const G:[number,number]=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3];const mid=(p:[number,number],q:[number,number]):[number,number]=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
    [[A,mid(B,C)],[B,mid(A,C)],[C,mid(A,B)]].forEach(([p,q])=>line([P(...p,1),P(...q,1)],'reference',{dashed:true}));
    dot(P(...G,2+20*Math.sin(t*pi)),'signal',6);label(P(G[0]+.7,G[1]+.5),'G');
    reading=`G = (${fmt(G[0])}; ${fmt(G[1])}), média dos vértices. Cada mediana fica dividida 2:1 a partir do vértice.`;break;}
  case 'pythagoras':{const a=value,b=4,c=Math.hypot(a,b),s=.55;polygon([[0,0],[b*s,0],[0,a*s]],'body');
    polygon([[0,0],[0,a*s],[-a*s,a*s],[-a*s,0]],'sum');polygon([[0,0],[b*s,0],[b*s,-b*s],[0,-b*s]],'sum');
    polygon([[b*s,0],[0,a*s],[a*s,a*s+b*s],[b*s+a*s,b*s]],'signal');
    reading=`${a}² + 4² = ${a*a} + 16 = ${a*a+16} = ${fmt(c)}².`;break;}
  case 'metric':{const mm=value,n=9-mm,h=Math.sqrt(mm*n),s=.75;polygon([[-4.5*s,-2],[4.5*s,-2],[(-4.5+mm)*s,-2+h*s]],'sum');line([P((-4.5+mm)*s,-2,1),P((-4.5+mm)*s,-2+h*s,1)],'signal');
    reading=`m = ${mm}, n = ${n}: h² = m·n = ${mm*n}, h = ${fmt(h)}. Catetos √(9·${mm}) = ${fmt(Math.sqrt(9*mm))} e √(9·${n}) = ${fmt(Math.sqrt(9*n))}.`;break;}
  case 'shear-area':{const d=value/U;polygon([[-4,-2],[4,-2],[d,3]],'sum');line([P(-6,3,1),P(6,3,1)],'reference',{dashed:true});line([P(d,-2,1),P(d,3,1)],'signal',{dashed:true});
    reading=`Vértice em x = ${fmt(d)}. Base 8, altura 5: A = 8·5/2 = 20, para qualquer posição na paralela.`;break;}
  case 'circle-area':{const n=value,r=3,k=t;
    // Cada setor desliza do círculo para a fileira: vértice e bissetriz interpolados até alternarem para cima e para baixo.
    for(let i=0;i<n;i++){const a0=i*2*pi/n,a1=(i+1)*2*pi/n,mid=(a0+a1)/2,up=i%2===0;
      const fx=-pi*r/2+(i+.5)*pi*r/n,fy=up?-r/2:r/2,target=up?pi/2:-pi/2;let d=target-mid;while(d>pi)d-=2*pi;while(d<-pi)d+=2*pi;
      const ax=fx*k,ay=fy*k,rot=d*k,half=pi/n;
      const pts:[number,number][]=[[ax,ay],...Array.from({length:7},(_,j)=>{const a=mid+rot-half+2*half*j/6;return [ax+r*Math.cos(a),ay+r*Math.sin(a)] as [number,number];})];
      polygon(pts,up?'signal':'sum');}
    reading=`A = πr² = π·9 ≈ ${fmt(pi*9)}. ${n} setores formam quase um retângulo de base πr ≈ ${fmt(pi*3)} e altura r = 3.`;break;}
  case 'area-ratio':{const hex=(k:number,cx:number):[number,number][]=>Array.from({length:6},(_,i)=>[cx+1.4*k*Math.cos(i*pi/3),1.4*k*Math.sin(i*pi/3)]);polygon(hex(1,-4),'sum');polygon(hex(value,2),'signal');
    reading=`Lado ×${fmt(value)} ⇒ área ×${fmt(value*value)}.`;break;}
  case 'trapezoid':{const b=value;polygon([[-5,-3],[5,-3],[b/2,3],[-b/2,3]],'sum');line([P(-5,-3,1),P(b/2,3,1)],'signal',{dashed:true});
    reading=`A = (10 + ${b})·6/2 = ${(10+b)*3}.`;break;}
  case 'trig-ramp':{const th=rad(value),c=10*Math.cos(th),s=10*Math.sin(th),k=.7;for(const z of [-20,20])face([[-c*U*k/2,-50,z],[c*U*k/2,-50,z],[c*U*k/2,-50+s*U*k,z]],'sum');
    line([[c*U*k/2,-50,22],[c*U*k/2,-50+s*U*k,22]],'signal');line([[-c*U*k/2,-50,22],[c*U*k/2,-50,22]],'body');
    reading=`θ = ${value}°: sen = ${fmt(Math.sin(th),3)}, cos = ${fmt(Math.cos(th),3)}, tg = ${fmt(Math.tan(th),3)}. Oposto ${fmt(s)}, adjacente ${fmt(c)}.`;break;}
  case 'law-cosines':{const C=rad(value),k=.45,a=8*k,b=6*k;const pts:[number,number][]=[[0,0],[a,0],[b*Math.cos(C),b*Math.sin(C)]];polygon(pts.map(([x,y])=>[x-2,y-1.5]),'sum');
    const c=Math.sqrt(64+36-96*Math.cos(C));line([P(a-2,-1.5,1),P(b*Math.cos(C)-2,b*Math.sin(C)-1.5,1)],'signal');
    reading=`c² = 64 + 36 − 96·cos ${value}° ⇒ c = ${fmt(c)}.`;break;}
  case 'unit-circle':{const R=4,a=rad(value)*(t||1);board(-5,5,-5,5);line(ringPts(R),'sum');const p:[number,number]=[R*Math.cos(a),R*Math.sin(a)];
    line([P(0,0,1),P(...p,1)],'body');line([P(p[0],0,1),P(...p,1)],'signal');line([P(0,0,1),P(p[0],0,1)],'sum');dot(P(...p,2),'signal',6);
    reading=`x = ${fmt(value*(t||1),0)}°: cos = ${fmt(Math.cos(a),3)}, sen = ${fmt(Math.sin(a),3)} (quadrante ${Math.floor(((value*(t||1))%360)/90)+1}).`;break;}
  case 'tangent':{const R=3,a=rad(value);board(-4,6,-4,6);line(ringPts(R),'sum');line([P(R,-4,1),P(R,6,1)],'reference');const tg=Math.tan(a);
    line([P(0,0,1),P(R,Math.min(6,R*tg),1)],'signal');dot(P(R,Math.min(6,R*tg),2),'signal',5);
    reading=`x = ${value}°: tg = ${fmt(tg,3)}, sec = ${fmt(1/Math.cos(a),3)}, cotg = ${fmt(1/tg,3)}.`;break;}
  case 'fundamental':{const R=4,a=rad(value),c=R*Math.cos(a),s=R*Math.sin(a);line(ringPts(R),'reference');polygon([[0,0],[c,0],[c,s]],'body');
    polygon([[0,0],[c,0],[c,-c],[0,-c]],'sum');polygon([[c,0],[c+s,0],[c+s,s],[c,s]],'signal');
    reading=`cos² ${value}° + sen² ${value}° = ${fmt(Math.cos(a)**2,3)} + ${fmt(Math.sin(a)**2,3)} = 1.`;break;}
  case 'angle-sum':{const R=4,a=rad(40),b=rad(value);line(ringPts(R),'reference');arrow(P(0,0,1),P(R*Math.cos(a),R*Math.sin(a),1),'sum');arrow(P(0,0,1),P(R*Math.cos(a+b),R*Math.sin(a+b),1),'signal');
    line(ringPts(R*.4,0,0,20,a,a+b),'signal');reading=`cos(40° + ${value}°) = ${fmt(Math.cos(a+b),3)} = cos 40°·cos ${value}° − sen 40°·sen ${value}°.`;break;}
  case 'sine-wave':{const A=value,ph=2*pi*(t||.25);line(ringPts(A,-4.5,0,48),'sum');const p:[number,number]=[-4.5+A*Math.cos(ph),A*Math.sin(ph)];dot(P(...p,2),'signal',5);
    line([P(...p,1),P(-1+ph/(2*pi)*6,A*Math.sin(ph),1)],'reference',{dashed:true});
    curve(x=>A*Math.sin((x+1)/6*2*pi),-1,-1+ph/(2*pi)*6,'signal');arrow(P(-1,0),P(5.6,0),'body');
    reading=`f(x) = ${fmt(A)}·sen x: amplitude ${fmt(A)}, período 2π, imagem [−${fmt(A)}, ${fmt(A)}].`;break;}
  case 'space-point':{const s=18;arrow([0,0,0],[100,0,0],'body');arrow([0,0,0],[0,100,0],'body');arrow([0,0,0],[0,0,100],'body');label([110,0,0],'x');label([0,110,0],'z');label([0,0,110],'y');
    const p:SpatialPoint=[3*s,value*s,2*s];dot(p,'signal',6);line([[3*s,0,2*s],p],'reference',{dashed:true});line([[3*s,0,0],[3*s,0,2*s],[0,0,2*s]],'reference',{dashed:true});
    reading=`P = (3, 2, ${value}). ${value===0?'Pertence ao plano xy.':value>0?'Acima do plano xy.':'Abaixo do plano xy.'} Distância à origem: ${fmt(Math.hypot(3,2,value))}.`;break;}
  case 'distance':{board();const A:[number,number]=[-2,1],B:[number,number]=[value,4];line([P(...A,1),P(...B,1)],'signal');line([P(...A,1),P(B[0],A[1],1),P(...B,1)],'reference',{dashed:true});dot(P(...A,2),'sum',5);dot(P(...B,2),'signal',5);
    reading=`d = √(${fmt(B[0]+2)}² + 3²) = ${fmt(Math.hypot(B[0]+2,3))}.`;break;}
  case 'circle-eq':{board();line(ringPts(value,1,1),'signal');dot(P(1,1,2),'body',4);line([P(1,1,1),P(1+value,1,1)],'sum');
    reading=`(x − 1)² + (y − 1)² = ${fmt(value*value)}; todos os pontos a ${fmt(value)} do centro.`;break;}
  case 'line-eq':{board();curve(x=>value*x+1,-6,6,'signal');line([P(0,1,1),P(1,1,1),P(1,1+value,1)],'sum',{dashed:true});
    reading=`y = ${fmt(value)}x + 1: ângulo de ${fmt(Math.atan(value)*180/pi,1)}° com o eixo x; sobe ${fmt(value)} a cada 1 em x.`;break;}
  case 'two-lines':{board();curve(x=>2*x,-6,6,'sum');curve(x=>value*x-2,-6,6,'signal');
    reading=value===2?'m₁ = m₂ = 2: retas paralelas.':Math.abs(value*2+1)<1e-9?'m₁·m₂ = −1: perpendiculares.':`Concorrentes em x = ${fmt(-2/(2-value))}.`;break;}
  case 'point-line':{board();curve(x=>.75*x,-6,6,'sum');const p:[number,number]=[2,value],d=Math.abs(6-4*value)/5,t0=(p[0]*4+p[1]*3)/25;
    line([P(...p,1),P(4*t0,3*t0,1)],'signal');dot(P(...p,2),'signal',5);reading=`d = |3·2 − 4·${value}|/5 = ${fmt(d)}.`;break;}
  case 'line-circle':{board();line(ringPts(3),'sum');line([P(-6,value,1),P(6,value,1)],'signal');const k=Math.abs(value);
    if(k<=3){const x=Math.sqrt(9-value*value);dot(P(x,value,2),'signal',4);dot(P(-x,value,2),'signal',4);}
    reading=k<3?'Distância ao centro menor que o raio: secante (2 pontos).':k===3?'Distância igual ao raio: tangente.':'Distância maior que o raio: exterior.';break;}
  case 'conics':{const H=80;for(const s of [1,-1]){for(let i=0;i<=4;i++){const y=s*H*i/4;line(Array.from({length:49},(_,k):SpatialPoint=>{const a=k*2*pi/48,r=Math.abs(y);return [r*Math.cos(a),y,r*Math.sin(a)];}),'reference');}
      for(let k=0;k<8;k++){const a=k*pi/4;line([[0,0,0],[H*Math.cos(a),s*H,H*Math.sin(a)]],'reference');}}
    const th=rad(value),y0=30,pts:SpatialPoint[]=[];
    for(let k=0;k<=96;k++){const a=k*2*pi/96;const c=Math.cos(a),sn=Math.sin(a);const den=1-Math.tan(th)*c;if(den<=0.02)continue;const r=y0/den;const p:SpatialPoint=[r*c,y0+Math.tan(th)*r*c,r*sn];if(Math.abs(p[1])<=H&&Math.hypot(p[0],p[2])<=H)pts.push(p);else if(pts.length>1){line([...pts],'signal');pts.length=0;}}
    if(pts.length>1)line(pts,'signal');face([[-90,y0-90*Math.tan(th),-70],[90,y0+90*Math.tan(th),-70],[90,y0+90*Math.tan(th),70],[-90,y0-90*Math.tan(th),70]].map(([x,y,z])=>[x,clamp(y,-95,95),z] as SpatialPoint),'sum');
    reading=`Plano a ${value}° da base: ${conicType(value)}.`;break;}
  case 'half-plane':{board();polygon([[-6,-6+value],[6,6+value],[-6,6+value]].map(([x,y])=>[x,clamp(y,-4,5)]) as [number,number][],'signal');curve(x=>x+value,-6,6,'body');
    reading=`y ≥ x + ${value}: fronteira inclusa (reta cheia); (0, 0) ${0>=value?'satisfaz':'não satisfaz'}.`;break;}
  case 'complex-rotation':{board(-5,5,-4,5);let z:[number,number]=[value,2];const k=Math.floor(t*4);for(let i=0;i<=k;i++){arrow(P(0,0,1),P(z[0],z[1],1),i===k?'signal':'sum');z=[-z[1],z[0]];}
    reading=`z = ${value} + 2i; multiplicado por i ${k}× gira ${k*90}°, módulo ${fmt(Math.hypot(value,2))} preservado.`;break;}
  case 'binomial':{const a=4,b=value,s=12,c3=choice==='cube';const seg=[[0,a],[a,b]] as const;
    for(const [x0,w] of seg)for(const [z0,d] of seg)for(const [y0,h] of c3?seg:[[0,1] as const]){const big=(w===a?1:0)+(d===a?1:0)+(c3?(h===a?1:0):0);box(-60+x0*s,-60+y0*s,-40+z0*s,w*s-1,(c3?h:1)*s-1,d*s-1,big===(c3?3:2)?'sum':big===0?'signal':'reference');}
    reading=c3?`(${a}+${b})³ = ${a**3} + 3·${a*a}·${b} + 3·${a}·${b*b} + ${b**3} = ${(a+b)**3}.`:`(${a}+${b})² = ${a*a} + 2·${a*b} + ${b*b} = ${(a+b)**2}.`;break;}
  case 'balance':{const x=value,L=2*x+1,R=7,tilt=clamp((R-L)*3*(t||1),-25,25);line([[0,-60,0],[0,0,0]],'body');line([[-70,-tilt,0],[70,tilt,0]],'body');
    box(-85,-tilt-14,-12,30,12,24,'sum');box(55,tilt-14,-12,30,12,24,'signal');label([-70,-tilt+14,0],`2·${x} + 1`);label([70,tilt+14,0],'7');
    reading=L===R?`x = ${x}: 2·${x} + 1 = 7, equilíbrio.`:`x = ${x}: ${L} ${L>R?'>':'<'} 7, balança desnivelada.`;break;}
  case 'inequality':{const L=3*value-2,tilt=clamp((7-L)*3,-25,25);line([[0,-60,0],[0,0,0]],'body');line([[-70,-tilt,0],[70,tilt,0]],'body');box(-85,-tilt-14,-12,30,12,24,'signal');box(55,tilt-14,-12,30,12,24,'sum');
    reading=`x = ${value}: 3x − 2 = ${L} ${L>7?'> 7 — satisfaz':'≤ 7 — não satisfaz'}. Solução: x > 3.`;break;}
  case 'linear-model':{const T=10*(t||1),V=10+value*T;box(-40,-60,-30,80,Math.min(120,V*1.6),60,'sum');box(-40,-60,-30,80,120,60,'reference');
    reading=`V(t) = 10 + ${value}t; em t = ${fmt(T,1)} min, V = ${fmt(V,1)} L.`;break;}
  case 'complete-square':{const b=value,h=b/2,s=7,x=Math.sqrt(16+h*h)-h;box(-50,-50,0,x*s,x*s,4,'sum');box(-50+x*s,-50,0,h*s,x*s,4,'signal');box(-50,-50+x*s,0,x*s,h*s,4,'signal');box(-50+x*s,-50+x*s,0,h*s,h*s,4,'reference');
    reading=`x² + ${b}x + ${h*h} = 16 + ${h*h} ⇒ (x + ${h})² = ${16+h*h} ⇒ x = ${fmt(x)}.`;break;}
  case 'max-area':{const w=value,h=20-w,s=4.5;box(-w*s/2,-60,-h*s/2,w*s,8,h*s,w===10?'signal':'sum');
    reading=`${w} × ${h} = ${w*h} m²; máximo 100 m² em 10 × 10.`;break;}
  case 'function-map':{for(let i=1;i<=4;i++){const a:SpatialPoint=[-60,60-i*25,0],b:SpatialPoint=[60,60-i*25,0];dot(a,i===value?'signal':'sum',6);label([-80,60-i*25,0],`${i}`);dot(b,'body',4);label([82,60-i*25,0],`${2*i+1}`);arrow(a,[52,60-i*25,0],i===value?'signal':'reference');}
    reading=`f(${value}) = ${2*value+1}. Uma flecha sai de cada elemento do domínio.`;break;}
  case 'graph-transform':{board();curve(x=>x*x/2,-6,6,'reference');const f=choice==='vertical'?(x:number)=>x*x/2+value:choice==='horizontal'?(x:number)=>(x-value)**2/2:(x:number)=>value*x*x/2;curve(f,-6,6,'signal');
    reading=choice==='vertical'?`Desloca ${fmt(value)} na vertical.`:choice==='horizontal'?`Desloca ${fmt(value)} na horizontal (sinal oposto dentro).`:`${value<0?'Reflete e ':''}dilata por ${fmt(Math.abs(value))}.`;break;}
  case 'composition':{const x=value,fx=x+1,gfx=2*fx,s=[-80,0,80];[x,fx,gfx].forEach((v,i)=>{dot([s[i],0,0],'signal',8);label([s[i],-18,0],`${v}`);});
    const k=t||1;arrow([s[0],0,0],[s[0]+(s[1]-s[0]-8)*Math.min(1,k*2),0,0],'sum');if(k>.5)arrow([s[1],0,0],[s[1]+(s[2]-s[1]-8)*Math.min(1,(k-.5)*2),0,0],'signal');
    label([-40,20,0],'f');label([40,20,0],'g');reading=`(g∘f)(${x}) = g(${fx}) = ${gfx}; (f∘g)(${x}) = ${2*x+1}.`;break;}
  case 'inverse':{board(-4,6,-4,6);curve(x=>x,-4,6,'reference');curve(x=>value*x+1,-4,6,'signal');curve(x=>(x-1)/value,-4,6,'sum');
    reading=`f(x) = ${fmt(value)}x + 1; f⁻¹(x) = (x − 1)/${fmt(value)}.`;break;}
  case 'bijection':{const n=value;for(let i=0;i<4;i++){dot([-60,45-i*30,0],'sum',6);}for(let j=0;j<n;j++)dot([60,45-j*(120/(n-1||1)),0],'body',6);
    for(let i=0;i<4;i++)arrow([-60,45-i*30,0],[52,45-Math.min(i,n-1)*(120/(n-1||1)),0],'signal');
    reading=n===4?'4 → 4, cada imagem atingida uma vez: bijetora.':n<4?`4 → ${n}: duas entradas com mesma imagem (não injetora).`:`4 → ${n}: sobra imagem (não sobrejetora).`;break;}
  case 'affine':{board();curve(x=>value*x+1,-6,6,'signal');dot(P(0,1,2),'body',4);if(value)dot(P(-1/value,0,2),'sum',4);
    reading=value===0?'a = 0: função constante y = 1.':`Zero em x = ${fmt(-1/value)}; ${value>0?'crescente':'decrescente'}.`;break;}
  case 'quadratic':{board();if(value)curve(x=>value*(x-1)**2-2,-6,6,'signal');dot(P(1,-2,2),'signal',5);
    reading=value===0?'a = 0: não é quadrática.':`Vértice (1, −2); ${value>0?'mínimo':'máximo'} −2; raízes ${value>0?`1 ± ${fmt(Math.sqrt(2/value))}`:'inexistentes'}.`;break;}
  case 'sign':{board();const f=(x:number)=>(x+2)*(x-value)/2;curve(f,-6,6,'signal');const lo=Math.min(-2,value),hi=Math.max(-2,value);polygon([[lo,0],[hi,0],[hi,-.15],[lo,-.15]],'sum');
    reading=`f < 0 em (${fmt(lo)}, ${fmt(hi)}); f > 0 fora das raízes.`;break;}
  case 'exponential':{const r=1+value/100,terms=Array.from({length:7},(_,n)=>r**n),sc=110/terms[6];terms.forEach((v,n)=>tower(-90+n*30,v*sc,n===6?'signal':'sum'));
    reading=`(${fmt(r)})⁶ = ${fmt(r**6)}: crescimento de ${fmt((r**6-1)*100,0)}% em 6 períodos.`;break;}
  case 'log':{const L=Math.log2(value);for(let i=0;i<=5;i++)tower(-75+i*30,2**i*3,2**i<=value?'sum':'reference');dot([-75+L*30,-60+value*3+6,0],'signal',6);
    reading=`log₂ ${value} = ${fmt(L,3)}: 2^${fmt(L,3)} = ${value}.`;break;}
  case 'log-exp':{board(-4,6,-4,6);curve(x=>x,-4,6,'reference');curve(x=>value**x,-4,6,'signal');curve(x=>x>0?Math.log(x)/Math.log(value):NaN,.01,6,'sum');
    reading=`y = ${fmt(value)}ˣ passa por (0, 1); log passa por (1, 0). Simétricas em y = x.`;break;}
  case 'decay':{const T=value,now=10*(t||1),mass=100*.5**(now/T);for(let i=0;i<=10;i+=2)tower(-80+i*16,100*.5**(i/T),i<=now?'sum':'reference');dot([-80+now*16,-60+mass+8,0],'signal',6);
    reading=`t = ${fmt(now,1)} anos: m = 100·(1/2)^(${fmt(now,1)}/${T}) = ${fmt(mass,1)} g.`;break;}
  case 'absolute':{board();curve(x=>Math.abs(x),-6,6,'sum');line([P(0,-.5,1),P(value,-.5,1)],'signal');dot(P(value,Math.abs(value),2),'signal',5);
    reading=`|${fmt(value)}| = ${fmt(Math.abs(value))}: distância de ${fmt(value)} até 0.`;break;}
  case 'complex-polar':{board(-4,4,-4,4);line(ringPts(3),'reference');const a=rad(value);arrow(P(0,0,1),P(3*Math.cos(a),3*Math.sin(a),1),'signal');line(ringPts(.8,0,0,30,0,a),'sum');
    reading=`z = 3(cos ${value}° + i·sen ${value}°) = ${fmt(3*Math.cos(a))} + ${fmt(3*Math.sin(a))}i.`;break;}
  case 'polynomial':{board();curve(x=>(x+2)*(x-1)*(x-value)/2,-6,6,'signal');for(const r of [-2,1,value])dot(P(r,0,2),'sum',4);
    reading=`Raízes −2, 1 e ${fmt(value)}${value===1||value===-2?' (raiz dupla)':''}; grau 3 corta o eixo até 3 vezes.`;break;}
  case 'girard':{board();const p=(x:number)=>(x**3-2*x*x-5*x+value)/4;curve(p,-6,6,'signal');
    const roots:number[]=[];for(let x=-6;x<6;x+=.01)if(p(x)*p(x+.01)<=0)roots.push(x+.005);roots.forEach(r=>dot(P(r,0,2),'sum',4));
    reading=`Soma das raízes = 2; produto = ${-value}. Reais encontradas: ${roots.map(r=>fmt(r,2)).join('; ')||'nenhuma no quadro'}.`;break;}
  case 'dice':{for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)cube(-60+(i-1)*20,-60,-60+(j-1)*20,16,i+j===value?'signal':'reference');
    reading=`Soma ${value}: ${diceWays(value)} de 36 casos; P = ${fmt(diceWays(value)/36,3)}.`;break;}
  }
  return {traces,dots,labels,reading,legend};
}
