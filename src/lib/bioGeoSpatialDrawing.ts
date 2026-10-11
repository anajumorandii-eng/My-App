import { alleleAfter, gini, logisticN, recombinantFraction, type BioGeoKind } from './bioGeoSpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';

const pi=Math.PI;
const fmt=(n:number,d=2)=>(Math.abs(n)<1e-12?0:n).toLocaleString('pt-BR',{maximumFractionDigits:d});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
/** Fenômenos com percurso próprio no tempo; os demais usam a varredura do parâmetro. */
export const BIO_GEO_MOVING_KINDS:BioGeoKind[]=['carbon','nitrogen','water-cycle','air-inversion','bioremediation','protists','annelid','fungi','bacterium','virus','synapse','endocrine-axis','life-cycles','seed-fruit','globalization','tourism','fordism','biofuel-cycle','br-industry','fiscal-war','landscape','polarity','migration','flying-geese','sponge-cnidarian'];

export function bioGeoSpatialDrawing(kind:BioGeoKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const t=clamp(time,0,1);
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const face=(points:SpatialPoint[],role:SpatialTrace['role']='sum')=>line(points,role,{closed:true});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>{if(Math.hypot(...b.map((v,i)=>v-a[i]))>1e-6)line([a,b],role,{arrow:true});};
  const dot=(point:SpatialPoint,role:SpatialDot['role']='signal',radius=5)=>dots.push({point,role,radius});
  const label=(point:SpatialPoint,text:string)=>labels.push({point,text});
  const lerp=(a:SpatialPoint,b:SpatialPoint,k:number):SpatialPoint=>a.map((v,i)=>v+(b[i]-v)*k) as SpatialPoint;
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,role:SpatialTrace['role']='sum')=>{
    const p=(dx:number,dy:number,dz:number):SpatialPoint=>[x+dx*w,y+dy*h,z+dz*d];
    face([p(0,0,1),p(1,0,1),p(1,1,1),p(0,1,1)],role);face([p(0,1,0),p(1,1,0),p(1,1,1),p(0,1,1)],role);face([p(1,0,0),p(1,0,1),p(1,1,1),p(1,1,0)],role);
  };
  const tower=(x:number,h:number,role:SpatialTrace['role']='sum',w=14,z=0)=>box(x-w/2,-60,z-w/2,w,Math.max(1,h),w,role);
  const ring=(r:number,c:SpatialPoint=[0,0,0],plane:'xz'|'xy'='xz',role:SpatialTrace['role']='reference',n=40,a0=0,a1=2*pi)=>line(Array.from({length:n+1},(_,i):SpatialPoint=>{const a=a0+(a1-a0)*i/n;return plane==='xz'?[c[0]+r*Math.cos(a),c[1],c[2]+r*Math.sin(a)]:[c[0]+r*Math.cos(a),c[1]+r*Math.sin(a),c[2]];}),role);
  const disc=(r:number,c:SpatialPoint,role:SpatialTrace['role']='sum',plane:'xz'|'xy'='xz')=>face(Array.from({length:33},(_,i):SpatialPoint=>{const a=i*2*pi/32;return plane==='xz'?[c[0]+r*Math.cos(a),c[1],c[2]+r*Math.sin(a)]:[c[0]+r*Math.cos(a),c[1]+r*Math.sin(a),c[2]];}),role);
  const ground=(y=-60,w=100,d=50)=>face([[-w,y,-d],[w,y,-d],[w,y,d],[-w,y,d]],'reference');
  const route=(pts:SpatialPoint[],role:SpatialTrace['role']='signal',r=6)=>{line(pts,role,{dashed:true});const p=t*(pts.length-1),i=Math.min(pts.length-2,Math.floor(p));dot(lerp(pts[i],pts[i+1],p-i),role,r);};
  const tree=(x:number,z:number,h:number,crown=10,role:SpatialTrace['role']='sum')=>{line([[x,-60,z],[x,-60+h,z]],'body');dot([x,-60+h,z],role,crown);};
  const node=(p:SpatialPoint,text:string,role:SpatialDot['role']='sum',r=8)=>{dot(p,role,r);label([p[0],p[1]-r-10,p[2]],text);};
  const timeline=(items:string[],active:number)=>{line([[-100,-30,0],[100,-30,0]],'reference');items.forEach((txt,i)=>{const x=-90+i*180/(items.length-1||1);tower(x,i<active?30+i*8:10,i===active-1?'signal':i<active?'sum':'reference',12);label([x,-80+(i%2)*-12,0],txt);});};
  let reading='',legend='Vinho: destaque · azul: estrutura ou fluxo · cinza: referência';

  switch(kind){
  // ───────────── Biologia ─────────────
  case 'eco-levels':{const names=['Indivíduo','População','Comunidade','Ecossistema','Biosfera'];for(let i=0;i<5;i++)ring(18+i*20,[0,-20+i*4,0],'xz',i+1===value?'signal':'reference',48);
    for(let i=0;i<6;i++)dot([12*Math.cos(i),-18,12*Math.sin(i)],'sum',4);label([0,90,0],names[value-1]);reading=`${names[value-1]}: inclui ${value>1?names.slice(0,value-1).join(', ').toLowerCase():'só o organismo'}.`;break;}
  case 'logistic':{for(let k=0;k<10;k++){const n=logisticN(value,k*2);tower(-90+k*20,n,k===9?'signal':'sum',12);}face([[-100,40,-12],[100,40,-12],[100,40,12],[-100,40,12]],'reference');label([90,52,0],'K');
    reading=`r = ${fmt(value)}: N(18) = ${fmt(logisticN(value,18),0)} de K = 100; crescimento máximo perto de K/2.`;break;}
  case 'succession':{ground();const st=value;for(let i=0;i<14;i++){const x=-90+i*14,z=(i%3-1)*25;if(st>=1)line([[x,-60,z],[x,-52,z]],'sum');if(st>=2&&i%2===0)tree(x,z,18,4);if(st>=3&&i%3===0)tree(x+4,z,34,8);if(st>=4&&i%4===0)tree(x+6,z,62,14,'signal');}
    reading=['Pioneiras: liquens e musgos sobre rocha.','Herbáceas: solo começa a se formar.','Arbustos: mais nichos e espécies.','Clímax: floresta estável, biomassa e diversidade altas.'][st-1];break;}
  case 'carbon':{const R:Record<string,SpatialPoint>={atm:[0,60,0],plant:[-60,-30,0],ocean:[60,-40,0],fossil:[0,-70,30]};
    node(R.atm,'Atmosfera','reference',16);node(R.plant,'Plantas','sum',14);node(R.ocean,'Oceano','sum',14);node(R.fossil,'Fóssil','body',12);
    const path=choice==='photosynthesis'?[R.atm,R.plant]:choice==='respiration'?[R.plant,R.atm]:[R.fossil,R.atm];for(let k=0;k<value;k++){const tt=(t+k/value)%1;dot(lerp(path[0],path[1],tt),'signal',3);}arrow(path[0],path[1]);
    reading=`${choice==='photosynthesis'?'Fotossíntese retira CO₂ da atmosfera':choice==='respiration'?'Respiração devolve CO₂':'Combustão libera carbono que estava fora do ciclo rápido'}; intensidade ${value}.`;break;}
  case 'nitrogen':{const P:SpatialPoint[]=[[0,60,0],[-70,-20,0],[-20,-50,20],[50,-40,0],[60,20,0]];['N₂','NH₄⁺','NO₂⁻','NO₃⁻','Planta'].forEach((s,i)=>node(P[i],s,i===0?'reference':'sum',10));
    for(let i=0;i<4;i++)arrow(P[i],P[i+1],i===0?'signal':'sum');arrow(P[3],P[0],'reference');route([...P.slice(0,4),P[0]]);
    reading=`${value} unidades de bactérias fixadoras convertem N₂ em amônio; nitrificantes levam a nitrato; desnitrificantes fecham o ciclo.`;break;}
  case 'water-cycle':{ground();line([[-90,-60,0],[-30,10,0],[10,-60,0]],'body');face([[30,-60,-40],[100,-60,-40],[100,-60,40],[30,-60,40]],'sum');
    route([[60,-55,0],[60,50,0],[-40,60,0],[-40,0,0],[0,-55,0],[40,-58,0]],'sum');for(let i=0;i<value;i++)dot([10+i*12+t*20,-56,8],'signal',3);
    reading=`Água evapora do oceano, condensa, precipita e escoa. Poluente (${value}) segue o escoamento até o mar; a evaporação deixa os solutos para trás.`;break;}
  case 'eutrophication':{face([[-90,-60,-40],[90,-60,-40],[90,-60,40],[-90,-60,40]],'sum');for(let i=0;i<value*6;i++)dot([-80+(i*29)%160,-55,(i*17)%60-30],'reference',3);
    const o2=Math.max(0,8-value*1.6);for(let i=0;i<Math.round(o2);i++)dot([-60+i*15,-90+40,0],'sum',3);tower(80,o2*8,'signal',10,40);
    reading=`Nutrientes ${value}: proliferação de algas; O₂ dissolvido relativo ${fmt(o2,1)} de 8. Abaixo de ~3, peixes morrem.`;break;}
  case 'air-inversion':{ground();box(-80,-60,-8,16,50,16,'body');const top=choice==='inversion'?-10:80;face([[-100,top,-50],[100,top,-50],[100,top,50],[-100,top,50]],choice==='inversion'?'signal':'reference');
    for(let i=0;i<value*3;i++){const h=-10-60+((i*23+t*120)%(top+70));dot([-72+(i%5)*8+h*.3,Math.min(h,top-4),(i%3-1)*8],'body',4);}
    reading=choice==='inversion'?'Ar frio junto ao solo, quente acima: a fumaça fica presa embaixo.':'Ar mais quente embaixo sobe e dispersa a fumaça.';break;}
  case 'biomagnification':{for(let i=0;i<4;i++){const w=140-i*32;box(-w/2,-60+i*26,-w/4,w,22,w/2,i+1===value?'signal':'sum');label([w/2+16,-50+i*26,0],`×${10**i}`);}
    reading=`Nível ${value}: concentração ${10**(value-1)}× a do produtor, embora a biomassa seja menor.`;break;}
  case 'bioremediation':{box(-60,-60,-30,120,70,60,'reference');const left=Math.round(12*(1-t));for(let i=0;i<12;i++)dot([-50+(i%6)*20,-40+Math.floor(i/6)*25,0],i<left?'signal':'reference',i<left?5:2);for(let i=0;i<6;i++)dot([-45+i*18,-20,15],'sum',3);
    reading=`Tratamento ${fmt(t*100,0)}%: ${left} de 12 unidades do poluente restam; microrganismos convertem em CO₂ e água.`;break;}
  case 'photosynthesis':{for(let g=0;g<3;g++)for(let k=0;k<4;k++)disc(14,[-50+g*50,-40+k*10,0],'sum');
    if(choice==='photo'){for(let i=0;i<value;i++)arrow([-90+i*20,90,0],[-60+i*15,-5,0],'signal');reading=`Luz ${value}: fase clara nos tilacoides (ATP, NADPH, O₂); ciclo de Calvin fixa CO₂.${value===0?' Sem luz, não há fase clara.':''}`;}
    else{dot([80,-50,0],'signal',8);label([80,-30,0],'H₂S, NH₃, Fe²⁺');reading='Quimiossíntese: bactérias oxidam compostos inorgânicos e usam a energia para fixar CO₂, sem luz.';}break;}
  case 'chromosomes':{const alle=[['A','A'],['B','b'],['C','c'],['D','D']];for(const s of [-1,1]){line([[s*20,-70,0],[s*20,70,0]],'sum');}
    alle.forEach(([a,b],i)=>{const y=50-i*35;dot([-20,y,0],i+1===value?'signal':'body',7);dot([20,y,0],i+1===value?'signal':'body',7);label([-40,y,0],a);label([40,y,0],b);});
    const [a,b]=alle[value-1];reading=`Locus ${value}: ${a}${b} — ${a===b?'homozigoto':'heterozigoto'}.`;break;}
  case 'sex-linked':{const kids=choice==='carrier'?['XᴬY','XᵃY','XᴬXᴬ','XᴬXᵃ']:['XᴬY','XᴬY','XᴬXᵃ','XᴬXᵃ'];kids.slice(0,value).forEach((k,i)=>{node([-60+i*40,0,0],k,k.includes('ᵃY')?'signal':k.includes('ᵃ')?'sum':'body',10);});
    reading=choice==='carrier'?'Mãe portadora: 50% dos filhos homens afetados; 50% das filhas portadoras.':'Pai afetado: todas as filhas portadoras, nenhum filho afetado.';break;}
  case 'dihybrid':{const gam=['AB','Ab','aB','ab'];const counts=[0,0,0,0];for(let i=0;i<4;i++)for(let j=0;j<4;j++){const A=gam[i][0]==='A'||gam[j][0]==='A',Bd=gam[i][1]==='B'||gam[j][1]==='B',c=A&&Bd?0:A?1:Bd?2:3;counts[c]++;box(-60+i*30,-60,-60+j*30,26,[40,25,25,12][c],26,c+1===value?'signal':'sum');}
    reading=`Classe ${['A_B_','A_bb','aaB_','aabb'][value-1]}: ${counts[value-1]}/16. Total 9:3:3:1.`;break;}
  case 'epistasis':{const gam=['AB','Ab','aB','ab'];const counts:number[]=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++){const A=gam[i][0]==='A'||gam[j][0]==='A',Bd=gam[i][1]==='B'||gam[j][1]==='B';
      const c=choice==='recessive'?(A&&Bd?0:A?1:2):(A&&Bd?0:1);counts[c]=(counts[c]||0)+1;box(-60+i*30,-60,-60+j*30,26,[40,25,15][c],26,c+1===value?'signal':'sum');}
    const v=Math.min(value,counts.length);reading=`${choice==='recessive'?'9:3:4':'9:7'}; classe ${v}: ${counts[v-1]}/16.`;break;}
  case 'linkage':{const r=recombinantFraction(value);for(const z of [-10,10]){line([[-80,-20,z],[80,-20,z]],'sum');}dot([-50,-20,-10],'body',6);dot([-50+value*2.4,-20,-10],'body',6);dot([-50,-20,10],'signal',6);dot([-50+value*2.4,-20,10],'signal',6);
    if(value>0)line([[-50+value*1.2-6,-20,-10],[-50+value*1.2+6,-20,10]],'signal');reading=`${value} cM: ~${fmt(r*100,0)}% recombinantes, ${fmt((1-r)*100,0)}% parentais.`;break;}
  case 'mutation':{const seq=['ATG','GCA','TTC','GGA','CTA','TAA'];let out=[...seq].join('');const p=(value-1)*3;
    if(choice==='substitution')out=out.slice(0,p+1)+'C'+out.slice(p+2);else if(choice==='insertion')out=out.slice(0,p+1)+'G'+out.slice(p+1);else out=out.slice(0,p+1)+out.slice(p+2);
    const cod=out.match(/.{1,3}/g)||[];cod.slice(0,7).forEach((c,i)=>{box(-100+i*29,-20,-10,26,20,20,i===value-1?'signal':i>=value-1&&choice!=='substitution'?'reference':'sum');label([-87+i*29,10,0],c);});
    reading=choice==='substitution'?`Um códon alterado (posição ${value}); os demais intactos.`:`A leitura se desloca a partir do códon ${value}: todos os seguintes mudam.`;break;}
  case 'lamarck-darwin':{for(let i=0;i<6;i++){const base=20+(i%3)*8,h=choice==='lamarck'?base+value*6:(base>=28?base+value*8:Math.max(0,base-value*4));if(h>0)tower(-75+i*30,h,'sum',10);}tree(80,0,90,16);
    reading=choice==='lamarck'?'Lamarck: o esforço alonga o pescoço e o ganho é herdado (hipótese refutada).':'Darwin: pescoços já variavam; os mais longos deixam mais descendentes.';break;}
  case 'selection':{for(let g=0;g<=10;g++){const p=alleleAfter(value,g);tower(-90+g*18,p*120,g===10?'signal':'sum',10);}
    reading=`s = ${fmt(value)}: frequência do alelo vantajoso vai de 10% a ${fmt(alleleAfter(value,10)*100,0)}% em 10 gerações.`;break;}
  case 'br-biomes':{ground();const spec:Record<string,[number,number,string]>={amazon:[70,3,'alta'],atlantic:[55,3,'alta'],cerrado:[25,2,'média, com seca'],caatinga:[15,1,'baixa e irregular'],pampa:[6,2,'regular'],pantanal:[22,2,'com cheias sazonais']};
    const [h,rain,txt]=spec[choice]||spec.amazon;for(let i=0;i<value;i++)tree(-70+i*28,(i%2?1:-1)*15,h,h>40?13:7,'sum');for(let i=0;i<rain*3;i++)arrow([-80+i*18,90,30],[-80+i*18,70,30],'reference');
    if(choice==='pantanal')face([[-100,-56,-50],[100,-56,-50],[100,-56,50],[-100,-56,50]],'sum');reading=`Chuva ${txt}; vegetação ${h>40?'arbórea densa':h>20?'savânica/arbustiva':'baixa'}.`;break;}
  case 'cladogram':{const tips=['Peixes','Anfíbios','Répteis','Aves','Mamíferos'];const nodes:SpatialPoint[]=[[-70,-50,0],[-35,-20,0],[0,10,0],[35,40,0]];
    line([[-90,-70,0],[nodes[3][0]+25,70,0]],'sum');tips.forEach((tp,i)=>{const n=nodes[Math.min(i,3)];const tip:SpatialPoint=[-80+i*40,80,0];line([i===0?[-90,-70,0]:nodes[i-1],tip],'reference');label([tip[0],tip[1]+12,0],tp);});
    nodes.forEach((n,i)=>dot(n,i+1===value?'signal':'sum',6));const novel=['mandíbula e vértebras','quatro membros','ovo amniótico','penas e endotermia (aves) / pelos (mamíferos)'];
    reading=`Nó ${value}: ${novel[value-1]} — compartilhada por todos à direita.`;break;}
  case 'protists':{const tt=t*value;if(choice==='amoeba'){const pts=Array.from({length:25},(_,i):SpatialPoint=>{const a=i*2*pi/24,r=30+8*Math.sin(3*a+tt*4)+(Math.cos(a)>.7?18*t:0);return [r*Math.cos(a)+tt*10,r*Math.sin(a),0];});face(pts,'sum');}
    else{disc(18,[tt*10,0,0],'sum','xy');if(choice==='flagellate')line(Array.from({length:20},(_,i):SpatialPoint=>[-18-i*3+tt*10,6*Math.sin(i+tt*8),0]),'signal');else for(let i=0;i<16;i++){const a=i*2*pi/16;line([[18*Math.cos(a)+tt*10,18*Math.sin(a),0],[24*Math.cos(a+Math.sin(tt*6)*.2)+tt*10,24*Math.sin(a),0]],'signal');}}
    dot([tt*10,0,4],'body',5);reading=choice==='amoeba'?'Pseudópodes: citoplasma flui e projeta a célula.':choice==='flagellate'?'Flagelo bate em onda e empurra a célula.':'Cílios batem em sincronia (onda metacrônica).';break;}
  case 'sponge-cnidarian':{if(choice==='sponge'){for(let k=0;k<6;k++)ring(25+k*2,[0,-50+k*16,0],'xz','sum');for(let i=0;i<value;i++){const a=i*2*pi/value;route([[40*Math.cos(a),-20,40*Math.sin(a)],[0,-10,0],[0,60,0]],'signal',3);}reading='Água entra pelos poros, coanócitos filtram, sai pelo ósculo.';}
    else if(choice==='polyp'){for(let k=0;k<5;k++)ring(18,[0,-60+k*18,0],'xz','sum');for(let i=0;i<8;i++){const a=i*pi/4;line([[0,20,0],[30*Math.cos(a),45+5*Math.sin(t*6+i),30*Math.sin(a)]],'signal');}reading='Pólipo fixo, boca e tentáculos para cima; cavidade gastrovascular com uma abertura.';}
    else{const s=1+.15*Math.sin(t*pi*4);line(Array.from({length:21},(_,i):SpatialPoint=>{const a=i*pi/20;return [40*s*Math.cos(a),20*Math.sin(a),0];}),'sum');ring(40*s,[0,0,0],'xz','sum');for(let i=0;i<8;i++){const a=i*pi/4;line([[38*Math.cos(a),0,38*Math.sin(a)],[38*Math.cos(a),-50,38*Math.sin(a)]],'signal');}reading='Medusa livre, boca para baixo; contração da umbrela impulsiona.';}
    break;}
  case 'body-cavity':{disc(60,[0,0,0],'reference','xy');disc(60-value*4,[0,0,2],'body','xy');if(choice!=='acoelom'){disc(40,[0,0,4],choice==='coelom'?'signal':'sum','xy');}disc(15,[0,0,6],'sum','xy');
    reading=choice==='acoelom'?'Mesoderma preenche tudo entre ecto e endoderma.':choice==='pseudo'?'Cavidade entre mesoderma e endoderma.':'Celoma totalmente revestido por mesoderma.';break;}
  case 'mollusc':{const k=Math.log(70/4)/(value*2*pi),pts=Array.from({length:Math.round(value*40)},(_,i):SpatialPoint=>{const a=i*pi/20,r=4*Math.exp(k*a);return [r*Math.cos(a),i*.8-40,r*Math.sin(a)];});line(pts,'sum');dot(pts[pts.length-1],'signal',5);
    reading=`${fmt(value,1)} voltas: raio cresce na mesma proporção a cada volta (espiral logarítmica).`;break;}
  case 'annelid':{const n=value;for(let i=0;i<n;i++){const ph=2*pi*(i/n-t*2),r=12+4*Math.sin(ph);ring(r,[-90+i*180/n,0,0],'xy','sum',24);}line([[-90,0,0],[90,0,0]],'reference',{dashed:true});
    reading=`${n} segmentos (metâmeros) com celoma próprio; a onda de contração percorre o corpo.`;break;}
  case 'arthropod':{const s=value*.3+.7;if(choice==='insect'){[-40,0,40].forEach((x,i)=>disc([10,14,20][i]*s,[x*s,0,0],'sum','xy'));for(let i=0;i<3;i++)for(const z of [-1,1])line([[(-8+i*8)*s,0,0],[(-8+i*8)*s,-25*s,z*20*s]],'body');reading='Inseto: 3 tagmas, 6 patas, 1 par de antenas.';}
    else if(choice==='crustacean'){disc(26*s,[-15*s,0,0],'sum','xy');disc(14*s,[25*s,0,0],'sum','xy');for(let i=0;i<5;i++)for(const z of [-1,1])line([[(-30+i*8)*s,0,0],[(-30+i*8)*s,-22*s,z*22*s]],'body');reading='Crustáceo (decápode): cefalotórax, 10 patas, 2 pares de antenas.';}
    else{for(let i=0;i<10;i++){disc(6*s,[(-60+i*13)*s,0,0],'sum','xy');for(const z of [-1,1])line([[(-60+i*13)*s,0,0],[(-60+i*13)*s,-10*s,z*12*s]],'body');}reading='Miriápode: muitos segmentos iguais com 1 ou 2 pares de patas cada.';}break;}
  case 'arachnid':{disc(18,[-15,0,0],'sum','xy');disc(26,[22,0,0],'sum','xy');for(let i=0;i<4;i++)for(const z of [-1,1]){const a=(-30+i*20)*pi/180;line([[-15,0,0],[-15+Math.sin(a)*40,-10-value*.4,z*(30+value)]],'body');}
    reading='4 pares de patas no cefalotórax; quelíceras e pedipalpos; sem antenas.';break;}
  case 'echinoderm':{const rot=value*pi/180;const pts:SpatialPoint[]=[];for(let i=0;i<10;i++){const r=i%2?18:60,a=rot+i*pi/5+pi/2;pts.push([r*Math.cos(a),0,r*Math.sin(a)]);}face(pts,'sum');
    reading=`Rotação ${value}°: ${value%72===0?'coincide com a posição original':'ainda não coincide'} — simetria de ordem 5.`;break;}
  case 'chordate':{line(Array.from({length:21},(_,i):SpatialPoint=>[-90+i*9,10*Math.sin(i/3),0]),'sum');const parts:[string,SpatialPoint][]=[['Notocorda',[-20,0,0]],['Tubo nervoso dorsal',[-20,14,0]],['Fendas faríngeas',[-60,-6,0]],['Cauda pós-anal',[80,0,0]]];
    parts.forEach(([n,p],i)=>{dot(p,i+1===value?'signal':'reference',i+1===value?7:4);});line([[-80,0,0],[60,0,0]],value===1?'signal':'body');line([[-80,14,0],[60,14,0]],value===2?'signal':'reference');
    reading=`${parts[value-1][0]}: presente ao menos no embrião de todo cordado.`;break;}
  case 'heart-chambers':{const n=choice==='fish'?2:choice==='bird'?4:3;for(let i=0;i<n;i++)box(-50+(i%2)*50,-40+Math.floor(i/2)*45,-15,44,40,30,i%2?'signal':'sum');
    if(choice==='reptile')face([[0,-40,-15],[0,-40+value*40,-15],[0,-40+value*40,15],[0,-40,15]],'reference');
    reading=choice==='fish'?'Peixe: 1 átrio + 1 ventrículo, circulação simples.':choice==='amphibian'?'Anfíbio: 2 átrios + 1 ventrículo, mistura de sangue.':choice==='reptile'?'Réptil: septo ventricular parcial, mistura reduzida.':'Ave/mamífero: 4 cavidades, sem mistura; endotermia.';break;}
  case 'fungi':{ground();const grow=t||1;const branch=(x:number,z:number,a:number,len:number,d:number)=>{if(d>3)return;const x2=x+Math.cos(a)*len*grow,z2=z+Math.sin(a)*len*grow;line([[x,-58,z],[x2,-58,z2]],'sum');branch(x2,z2,a-.6,len*.7,d+1);branch(x2,z2,a+.6,len*.7,d+1);};
    for(let k=0;k<4;k++)branch(0,0,k*pi/2,35,0);line([[0,-58,0],[0,-58+40*grow,0]],'body');disc(20*grow,[0,-58+40*grow,0],'signal');reading='Hifas se ramificam no substrato (micélio); o cogumelo é o corpo de frutificação.';break;}
  case 'algae-depth':{box(-60,-60,-40,120,120,80,'reference');const light=Math.exp(-value/20);face([[-60,60-value*2,-40],[60,60-value*2,-40],[60,60-value*2,40],[-60,60-value*2,40]],'signal');
    reading=`${value} m: luz relativa ${fmt(light*100,0)}%. ${light>.1?'Ainda há luz para fotossíntese.':'Pouca luz: poucas algas.'}`;break;}
  case 'life-cycles':{const phases=choice==='haplontic'?['n adulto','gametas n','zigoto 2n','meiose → n']:choice==='diplontic'?['2n adulto','meiose → gametas n','fecundação','zigoto 2n']:['esporófito 2n','meiose → esporos n','gametófito n','gametas → zigoto 2n'];
    phases.forEach((p,i)=>{const a=i*pi/2;node([60*Math.cos(a),0,60*Math.sin(a)],p,p.includes('2n')?'signal':'sum',9);});ring(60,[0,0,0],'xz','reference',48);const a=(value||t)*2*pi;dot([60*Math.cos(a),8,60*Math.sin(a)],'body',5);
    reading=choice==='haplontic'?'Meiose zigótica: só o zigoto é 2n.':choice==='diplontic'?'Meiose gamética: só gametas são n (como em animais).':'Meiose espórica: alternância entre esporófito e gametófito.';break;}
  case 'bryo-pterido':{ground();if(choice==='bryophyte'){for(let i=0;i<12;i++)tree(-60+i*11,(i%3-1)*14,6*value*.6+4,3,'sum');reading='Briófita: sem vasos, baixa; depende de água para a fecundação.';}
    else{for(let i=0;i<5;i++){line([[-40+i*20,-60,0],[-40+i*20,-60+value*14,0]],'signal');for(let k=1;k<4;k++)line([[-40+i*20,-60+value*14*k/4,0],[-40+i*20+10,-56+value*14*k/4,8]],'sum');}reading='Pteridófita: xilema e floema permitem crescer mais; esporos sob as folhas.';}break;}
  case 'seed-fruit':{const k=value||t;if(choice==='gymno'){for(let i=0;i<6;i++)line([[0,i*10-30,0],[18*Math.cos(i),i*10-35,18*Math.sin(i)]],'sum');dot([0,-40+60*k,20],'signal',5);reading='Gimnosperma: óvulo exposto na escama; semente sem fruto.';}
    else{for(let i=0;i<5;i++){const a=i*2*pi/5;line([[0,0,0],[30*(1-k)*Math.cos(a),20*(1-k),30*(1-k)*Math.sin(a)]],'sum');}dot([0,0,0],'signal',8+k*18);reading=`Angiosperma: após a fecundação, o ovário cresce e vira fruto (${fmt(k*100,0)}%).`;}break;}
  case 'bacterium':{const k=value||t,sep=k*40;for(const s of k>.5?[-1,1]:[0]){const cx=s*sep;face(Array.from({length:33},(_,i):SpatialPoint=>{const a=i*2*pi/32;return [cx+(k>.5?30:40+sep*.5)*Math.cos(a),18*Math.sin(a),0];}),'sum');dot([cx,0,3],'signal',5);}
    line(Array.from({length:12},(_,i):SpatialPoint=>[50+sep+i*4,4*Math.sin(i),0]),'body');reading=`Fissão binária ${fmt(k*100,0)}%: DNA circular duplica, célula alonga e se divide em duas idênticas.`;break;}
  case 'virus':{const k=value||t;const pos:SpatialPoint=k<.25?lerp([0,80,0],[0,20,0],k*4):[0,20,0];disc(14,pos,'signal','xy');for(let i=0;i<8;i++){const a=i*pi/4;line([[pos[0]+14*Math.cos(a),pos[1]+14*Math.sin(a),0],[pos[0]+20*Math.cos(a),pos[1]+20*Math.sin(a),0]],'signal');}
    ring(60,[0,-30,0],'xz','sum',40);const n=k>.5?Math.round((k-.5)*16):0;for(let i=0;i<n;i++)dot([-40+(i%4)*25,-40+Math.floor(i/4)*14,0],'signal',4);
    reading=['Adsorção à membrana.','Penetração e liberação do material genético.','Replicação usando a maquinaria da célula.','Montagem de novos vírus.','Liberação de novos vírus, muitas vezes com lise da célula.'][Math.min(4,Math.floor(k*5))];break;}
  case 'lever-arm':{const a=value*pi/180;line([[0,0,0],[0,-70,0]],'body');line([[0,0,0],[70*Math.sin(a),-70*Math.cos(a)+0*0,0].map((v,i)=>i===1?70*Math.cos(pi-a):v) as SpatialPoint],'sum');
    const hand:SpatialPoint=[70*Math.sin(a),70*Math.cos(pi-a),0];dot(hand,'signal',8);arrow(hand,[hand[0],hand[1]-30,0],'signal');line([[0,-50,0],[8*Math.sin(a),8*Math.cos(pi-a),0]],'signal');
    reading=`Torque do peso: 50 N × 0,35 m × sen ${value}° = ${fmt(50*.35*Math.sin(a))} N·m. Como o bíceps atua a 4 cm, precisa de ~${fmt(50*35/4,0)} N: a alavanca troca força por amplitude.`;break;}
  case 'synapse':{disc(30,[-40,0,0],'sum','xy');face([[20,-40,0],[30,-40,0],[30,40,0],[20,40,0]],'reference');const k=t;for(let i=0;i<value;i++){const p=lerp([-25,(i-value/2)*10,2],[18,(i-value/2)*10,2],k);dot(p,'signal',4);}
    for(let i=0;i<4;i++)dot([24,-30+i*20,4],'sum',3);reading=`${value} unidades liberadas: ligação aos receptores ${k>.9?'concluída':'em andamento'}; enzimas e recaptação encerram o sinal.`;break;}
  case 'senses':{if(choice==='hearing'){const pts=Array.from({length:60},(_,i):SpatialPoint=>{const a=i*pi/12,r=50*Math.exp(-.12*a);return [r*Math.cos(a),r*Math.sin(a),i*.6];});line(pts,'sum');dot(pts[Math.round((5-value)*11.8)],'signal',6);
      reading=`Frequência ${value} (1 = grave, 5 = agudo): vibra a região ${value>=4?'basal':value<=2?'apical':'média'} da cóclea.`;}
    else{ring(40,[0,0,0],'xy','reference');disc(10,[-36,0,0],'sum','xy');for(const y of [-10,10])line([[-100,y*value/3,0],[-36,y,0],[40,0,0]],'signal');reading='Cristalino ajusta a curvatura (acomodação) para focalizar na retina.';}break;}
  case 'endocrine-axis':{const P:SpatialPoint[]=[[0,60,0],[0,20,0],[0,-30,0]];['Hipotálamo (TRH)','Hipófise (TSH)','Tireoide (T3/T4)'].forEach((n,i)=>node(P[i],n,'sum',12));arrow(P[0],P[1]);arrow(P[1],P[2]);
    line([[0,-30,0],[60,-30,0],[60,60,0],[12,60,0]],'reference',{dashed:true});route([P[0],P[1],P[2]]);tower(80,value*14,'signal',10);
    reading=`T3/T4 em ${value}: ${value>=4?'inibem TRH e TSH (retroalimentação negativa)':value<=2?'estímulo a TRH/TSH aumenta':'eixo em equilíbrio'}.`;break;}
  case 'glycemia':{tower(-40,value*.5,'sum',24);const hi=value>99,lo=value<70;if(hi)arrow([40,40,0],[40,-20,0],'signal');if(lo)arrow([40,-20,0],[40,40,0],'signal');label([40,55,0],hi?'insulina':lo?'glucagon':'equilíbrio');
    reading=`${value} mg/dL: ${hi?'insulina promove captação e glicogênese':lo?'glucagon promove glicogenólise':'dentro da faixa de jejum'}.`;break;}

  // ───────────── Geografia ─────────────
  case 'env-pressures':{ring(50,[0,0,0],'xy','sum');ring(50,[0,0,0],'xz','sum');const items=['Desmatamento','Emissões','Água','Resíduos'];items.forEach((n,i)=>{const a=i*pi/2+pi/4;const p:SpatialPoint=[50*Math.cos(a),50*Math.sin(a),0];arrow([p[0]*(1.2+value*.08),p[1]*(1.2+value*.08),0],p,'signal');label([p[0]*1.6,p[1]*1.6,0],n);});
    reading=`Intensidade ${value}: pressões se somam e se reforçam (ex.: desmatamento eleva emissões).`;break;}
  case 'env-diplomacy':{for(let i=0;i<6;i++){const dev=i<3,h=choice==='kyoto'?(dev?value*12:4):value*(dev?12:8);tower(-75+i*30,h,dev?'signal':'sum');}label([-45,-75,0],'desenvolvidos');label([45,-75,0],'em desenvolvimento');
    reading=choice==='kyoto'?'Kyoto: metas obrigatórias só para desenvolvidos.':'Paris: todos apresentam metas (NDCs), com ambições diferentes.';break;}
  case 'shared-basin':{line([[-90,30,0],[90,-40,0]],'sum');box(-10,-10,-15,8,30,30,'body');tower(-50,40,'reference',30,40);tower(50,40,'reference',30,40);label([-50,-75,0],'montante');label([50,-75,0],'jusante');
    const flow=5-value;for(let i=0;i<flow;i++)dot([20+i*14,-15-i*5,0],'signal',4);reading=`Barragem retém ${value}: chegam ${flow}/5 unidades a jusante.`;break;}
  case 'river-profile':{const s=value;line(Array.from({length:21},(_,i):SpatialPoint=>{const x=-90+i*9;return [x,60*Math.exp(-(i/20)*s/2)-50,0];}),'sum');['alto','médio','baixo'].forEach((n,i)=>label([-70+i*70,-70,0],n));
    reading=`Declividade ${s}: erosão no alto curso, transporte no médio, deposição no baixo.`;break;}
  case 'polarity':{const n=Math.round(value*(t||1))||2;for(let i=0;i<n;i++){const a=i*2*pi/n;dot([60*Math.cos(a),0,60*Math.sin(a)],i<2?'signal':'sum',n<=2?18:12);}
    reading=n<=2?'Bipolar: dois blocos dominantes.':`Multipolar: ${n} centros de poder.`;break;}
  case 'globalization':{const P:SpatialPoint[]=Array.from({length:6},(_,i)=>[70*Math.cos(i*pi/3),i%2?20:-20,70*Math.sin(i*pi/3)]);P.forEach(p=>dot(p,'sum',7));
    for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)if((i+j)%(6-value>0?6-value:1)===0||j===i+1){line([P[i],P[j]],'reference');const k=(t+i*.1)%1;dot(lerp(P[i],P[j],k),'signal',3);}
    reading=`Fluxos de intensidade ${value}: mais conexões, mais circulação de capital, bens e informação.`;break;}
  case 'networks':{const hubs=Array.from({length:value},(_,i):SpatialPoint=>[(i-(value-1)/2)*50,0,0]);hubs.forEach(h=>dot(h,'signal',10));
    for(let i=0;i<14;i++){const h=hubs[i%value],a=i*2.3;const p:SpatialPoint=[h[0]+40*Math.cos(a),25*Math.sin(a),40*Math.sin(a*1.3)];dot(p,'sum',4);line([h,p],'reference');}
    for(let i=0;i<value-1;i++)line([hubs[i],hubs[i+1]],'signal');reading=`${value} hub(s): ${value===1?'falha central derruba a rede':'redundância reduz a vulnerabilidade'}.`;break;}
  case 'lateralism':{const P=Array.from({length:value},(_,i):SpatialPoint=>[60*Math.cos(i*2*pi/value),0,60*Math.sin(i*2*pi/value)]);P.forEach(p=>dot(p,'sum',7));
    if(choice==='uni'){dot([0,0,0],'signal',14);P.forEach(p=>arrow([0,0,0],p));reading='Uma potência decide e impõe.';}else{for(let i=0;i<value;i++)for(let j=i+1;j<value;j++)line([P[i],P[j]],'reference');reading=`${value} países negociam em fóruns comuns.`;}break;}
  case 'integration-stages':{const names=['Livre comércio','União aduaneira','Mercado comum','União econômica'];names.forEach((n,i)=>{box(-80+i*40,-60+i*20,-20,36,20,40,i<value?(i===value-1?'signal':'sum'):'reference');label([-62+i*40,-30+i*20,0],n);});
    reading=`${names[value-1]}: ${['tarifas internas zeradas','+ tarifa externa comum','+ livre circulação de pessoas e capitais','+ moeda e política econômica comuns'][value-1]}.`;break;}
  case 'eu-circles':{disc(70,[0,-20,0],value>=1?'sum':'reference');disc(45,[-15,-10,0],value>=2?'signal':'reference');disc(50,[20,0,0],value>=3?'body':'reference');label([0,60,0],'UE');label([-30,30,0],'Euro');label([40,40,0],'Schengen');
    reading='Membros da UE, zona do euro e Schengen são conjuntos diferentes: há membros fora do euro e países fora da UE no Schengen.';break;}
  case 'inequality':{const c=value,shares=[1,2,3,4,5].map(i=>Math.pow(i,1+c*3));const tot=shares.reduce((a,b)=>a+b,0);shares.forEach((s,i)=>tower(-60+i*30,s/tot*150,i===4?'signal':'sum'));
    reading=`20% mais ricos ficam com ${fmt(shares[4]/tot*100,0)}% da renda; Gini do modelo ${fmt(gini(shares),2)}.`;break;}
  case 'migration':{tower(-60,20,'reference',30);tower(60,20+value*10,'sum',30);for(let i=0;i<value;i++){const k=(t+i/value)%1;dot(lerp([-60,-20,0],[60,-20,0],k),'signal',4);}arrow([-40,-20,0],[40,-20,0]);
    reading=`Diferença ${value}: repulsão na origem e atração no destino aumentam o fluxo.`;break;}
  case 'tourism':{const m=Math.round(value*(t||1))||value;for(let i=1;i<=12;i++){const f=10+40*Math.max(0,Math.cos((i-1)*pi/6));tower(-88+i*15,f,i===m?'signal':'sum',10);}
    reading=`Mês ${m}: ${[12,1,2].includes(m)?'alta temporada':'fluxo menor'}. Sazonalidade concentra emprego e infraestrutura.`;break;}
  case 'agri-systems':{const ints=choice==='intensive';for(let i=0;i<value;i++)box(-80+i*32,-60,-20,28,ints?50:15,40,ints?'signal':'sum');
    reading=`${value} unidades de área: ${ints?'alta produtividade por hectare, uso de máquinas e insumos':'baixa produtividade, mais área por produção'}.`;break;}
  case 'industrial-revolutions':{const n=['Vapor','Eletricidade','Informática','Automação em rede'];n.forEach((s,i)=>{tower(-75+i*50,20+i*20,i+1===value?'signal':i<value?'sum':'reference',30);label([-75+i*50,-75,0],s);});reading=`${value}ª fase: ${n[value-1]} como base técnica da produção.`;break;}
  case 'fordism':{const ford=choice==='ford';for(let i=0;i<6;i++)box(-90+i*30,-60,-10,20,10,20,'reference');const k=t;dot([-90+k*170,-45,0],'signal',6);
    tower(80,(ford?value*15:5),'sum',24);reading=ford?`Produção em massa: estoque ${value*15} acumulado.`:'Just-in-time: estoque mínimo, produz conforme a demanda.';break;}
  case 'core-periphery':{disc(25,[0,0,0],'signal');ring(55,[0,0,0],'xz','sum',48);ring(85,[0,0,0],'xz','reference',48);const r=[25,55,85][value-1];dot([r,6,0],'body',6);
    reading=['Centro: tecnologia, capital e serviços avançados.','Semiperiferia: industrialização intermediária.','Periferia: exportação de produtos primários.'][value-1];break;}
  case 'cell-network':{const n=value;if(choice==='hierarchy'){dot([0,60,0],'signal',10);for(let i=0;i<n;i++){const p:SpatialPoint=[-70+i*140/(n-1||1),0,0];dot(p,'sum',6);line([[0,60,0],p],'reference');}reading='Hierarquia: remover o topo desorganiza tudo.';}
    else{const P=Array.from({length:n},(_,i):SpatialPoint=>[60*Math.cos(i*2*pi/n),20*Math.sin(i*3),60*Math.sin(i*2*pi/n)]);P.forEach(p=>dot(p,'sum',6));for(let i=0;i<n;i++)line([P[i],P[(i+1)%n]],'reference');reading=`Rede de ${n} células: sem centro único, mais difícil de desarticular.`;}break;}
  case 'religion-diffusion':{const uni=choice==='universal';dot([0,0,0],'signal',8);for(let k=1;k<=value;k++)ring(k*(uni?20:8),[0,0,0],'xz',k===value?'sum':'reference',48);
    reading=uni?`Difusão ampla (alcance ${value}): conversão e expansão além do povo de origem.`:'Étnica: permanece ligada a um povo e território.';break;}
  case 'europe-tensions':{disc(50,[-35-20*(1-value),0,0],'sum');disc(50,[35+20*(1-value),0,0],'signal');reading=`Sobreposição ${fmt(value*100,0)}%: zona de fronteira disputada entre esferas de influência.`;break;}
  case 'latam-trade':{tower(-40,value*15,'sum',30);tower(40,45,'signal',30);label([-40,-75,0],'exporta primários');label([40,-75,0],'importa industrializados');
    reading=`Preço ${value}: saldo ${value*15>45?'positivo':'negativo'} — dependência do ciclo das commodities.`;break;}
  case 'africa-borders':{face([[-80,-50,0],[80,-50,0],[80,50,0],[-80,50,0]],'reference');for(let g=0;g<value;g++)disc(22,[-70+g*28,(g%2?1:-1)*15,1],'sum','xy');line([[-10,-50,2],[-10,50,2]],'signal');line([[30,-50,2],[30,50,2]],'signal');
    reading=`${value} grupos culturais cortados por fronteiras retilíneas.`;break;}
  case 'flying-geese':{const names=['Japão','Tigres','Novos tigres','China'];names.forEach((n,i)=>{tower(-75+i*50,i<value?60-i*10:8,i===value-1?'signal':'sum',30);label([-75+i*50,-75,0],n);});reading=`Etapa ${value}: indústria se desloca para ${names[value-1]}.`;break;}
  case 'middle-east-resources':{tower(-40,90,'body',30);tower(40,90-value*15,'sum',30);label([-40,-75,0],'petróleo');label([40,-75,0],'água disponível');reading=`Escassez ${value}: água disputada; petróleo concentrado.`;break;}
  case 'palestine-timeline':{timeline(['1947','1948','1967','1993','2005'],value);reading=['1947: ONU aprova plano de partilha.','1948: criação de Israel; deslocamento de palestinos (Nakba).','1967: Guerra dos Seis Dias; ocupação de Cisjordânia, Gaza e outros territórios.','1993: Acordos de Oslo; Autoridade Palestina.','2005: retirada israelense de Gaza.'][value-1];break;}
  case 'arab-spring':{timeline(['Tunísia','Egito','Líbia','Síria'],value);reading=['Dez. 2010: protestos na Tunísia.','2011: queda de Mubarak no Egito.','2011: guerra civil e intervenção na Líbia.','2011: guerra civil na Síria.'][value-1];break;}
  case 'landscape':{ground();const k=value||t;for(let i=0;i<8;i++)tree(-80+i*22,-20,30,8,'sum');for(let i=0;i<Math.round(k*6);i++)box(-80+i*28,-60,10,18,20+i*6,18,'signal');
    reading=`Ocupação ${fmt(k*100,0)}%: elementos humanos se somam aos naturais; a paisagem guarda tempos diferentes.`;break;}
  case 'soil-horizons':{const H=[['O',6],['A',14],['B',18+value*4],['C',22],['R',20]] as [string,number][];let y=60;H.forEach(([n,h],i)=>{box(-40,y-h,-30,80,h,60,i===2?'signal':i%2?'sum':'reference');label([60,y-h/2,0],n);y-=h;});
    reading=`Intemperismo ${value}: horizonte B mais espesso; perfil mais desenvolvido.`;break;}
  case 'protected-areas':{disc(70,[0,0,0],value===2?'signal':'sum');disc(35,[0,2,0],value===1?'signal':'reference');label([0,30,0],'Proteção integral');label([60,30,0],'Uso sustentável');
    reading=value===1?'Proteção integral: parques, reservas biológicas — uso indireto.':'Uso sustentável: APAs, reservas extrativistas — uso direto controlado.';break;}
  case 'br-rivers':{const plateau=choice==='plateau';line(Array.from({length:11},(_,i):SpatialPoint=>[-90+i*18,plateau?40-i*8-(i%3===0?value*3:0):-20-i*1.5,0]),'sum');if(plateau)box(-10,-30,-15,8,30,30,'signal');else dot([20,-30,0],'signal',8);
    reading=plateau?'Planalto: desníveis e quedas favorecem hidrelétricas.':'Planície: pouco declive, rio navegável.';break;}
  case 'energy-matrix':{const ren=value,non=100-ren;tower(-30,ren*1.2,'sum',40);tower(30,non*1.2,'body',40);label([-30,-75,0],'renovável');label([30,-75,0],'não renovável');
    reading=`${choice==='brazil'?'Brasil':'Mundo'} (controle em ${ren}%). Referência: Brasil ≈ metade renovável; mundo bem menos.`;break;}
  case 'biofuel-cycle':{const eth=choice==='ethanol';node([0,60,0],'CO₂ atmosfera','reference',12);node([-60,-40,0],eth?'Cana':'Poço','sum',10);node([60,-40,0],'Motor','signal',10);
    route(eth?[[0,60,0],[-60,-40,0],[60,-40,0],[0,60,0]]:[[-60,-40,0],[60,-40,0],[0,60,0]]);reading=eth?'Ciclo fechado: a cana absorve o CO₂ que o motor emite.':'Carbono fóssil entra na atmosfera sem retorno no ciclo curto.';break;}
  case 'power-sources':{ground();const c=choice;if(c==='wind'){line([[0,-60,0],[0,40,0]],'body');for(let i=0;i<3;i++){const a=i*2*pi/3+value;line([[0,40,0],[40*Math.cos(a),40+40*Math.sin(a),0]],'sum');}}
    else if(c==='solar'){for(let i=0;i<3;i++)face([[-60+i*40,-50,-20],[-30+i*40,-50,-20],[-30+i*40,-30,20],[-60+i*40,-30,20]],'sum');}else if(c==='hydro'){box(-10,-60,-40,20,70,80,'body');face([[-100,0,-40],[-10,0,-40],[-10,0,40],[-100,0,40]],'sum');}
    else{box(-30,-60,-20,60,50,40,'body');line([[0,-10,0],[0,40,0]],'reference');dot([0,50,0],'reference',8+value*2);}
    reading={thermal:'Térmica: queima combustível; emite CO₂.',nuclear:'Nuclear: fissão; baixa emissão, resíduo radioativo.',hydro:'Hidrelétrica: queda d’água; alaga áreas.',wind:'Eólica: depende do vento; intermitente.',solar:'Solar: fotovoltaica; só durante o dia.'}[c]||'';break;}
  case 'br-electricity':{tower(-40,value*18,'sum',40);tower(40,(6-value)*10,'signal',40);label([-40,-75,0],'hidrelétrica');label([40,-75,0],'térmicas acionadas');
    reading=`Reservatórios ${value}/5: ${value<=2?'seca — térmicas compensam (energia mais cara)':'hidrelétricas dominam'}.`;break;}
  case 'open-pit':{for(let k=0;k<value+1;k++)ring(80-k*14,[0,-k*14,0],'xz',k===value?'signal':'sum',40);reading=`Cava com ${value} bancadas; mais profunda, mais estéril removido e maior impacto.`;break;}
  case 'land-structure':{for(let i=0;i<12;i++){box(-90+(i%6)*30,-60,-40+Math.floor(i/6)*40,26,4,36,'reference');}box(-90,-58,-40,90*(1+value),6,80,'signal');
    reading=`Concentração ${fmt(value)}: poucos grandes estabelecimentos ocupam a maior parte da área.`;break;}
  case 'br-industry':{const k=value||t;tower(-50,80-k*40,'signal',40);for(let i=0;i<3;i++)tower(10+i*35,10+k*25,'sum',25);label([-50,-75,0],'Sudeste');label([45,-75,0],'outras regiões');
    reading=`Tempo ${fmt(k*100,0)}%: participação do Sudeste cai, sem perder a liderança.`;break;}
  case 'fiscal-war':{tower(-60,30,'reference',30);tower(60,30,'sum',30);const move=value>=3;box(move?45:-75,-30,-10,20,15,20,'signal');if(move)arrow([-60,0,0],[50,0,0]);
    reading=`Incentivo ${value}: ${move?'fábrica se desloca':'mudança não compensa'}.`;break;}
  case 'age-pyramid':{const shapes=[[10,9,8,6,4,3,2,1],[9,9,8,7,6,4,3,2],[7,7,8,8,7,6,5,3],[5,6,6,7,7,7,6,5]][value-1];shapes.forEach((w,i)=>{box(-w*6,-60+i*16,-10,w*12,14,20,i<3?'sum':i<6?'signal':'body');});
    reading=['Natalidade e mortalidade altas: base larga.','Mortalidade cai: população cresce.','Natalidade cai: base estreita.','População envelhecida: topo alargado.'][value-1];break;}
  case 'migration-waves':{const n=['Indígenas','Africanos','Europeus/asiáticos','Migração interna'];n.forEach((s,i)=>{arrow([-90+i*45,60,0],[-80+i*45,0,0],i===value-1?'signal':'reference');label([-90+i*45,72,0],s);});reading=`Período ${value}: ${n[value-1]} na formação da população.`;break;}
  case 'urbanization':{const pts:[number,number][]=[[1950,36],[1960,45],[1970,56],[1980,68],[1991,75],[2000,81],[2010,84]];pts.forEach(([y,p])=>tower(-90+(y-1950)*3,p,y<=value?'sum':'reference',10));
    const p=pts.reduce((a,b)=>Math.abs(b[0]-value)<Math.abs(a[0]-value)?b:a)[1];reading=`${value}: ~${p}% da população em cidades.`;break;}
  case 'urban-hierarchy':{const lv=[['Metrópole',18],['Capital regional',12],['Centro sub-regional',8],['Centro local',5]] as [string,number][];lv.forEach(([n,r],i)=>{for(let k=0;k<i+1;k++)dot([-60+k*40,60-i*35,0],i+1===value?'signal':'sum',r);label([90,60-i*35,0],n);});
    reading=`${lv[value-1][0]}: mais níveis abaixo, mais serviços concentrados.`;break;}
  case 'transport-modes':{const cost={road:3,rail:2,water:1}[choice as 'road']||3;for(let i=0;i<value;i++)box(-90+i*30,-60,-10,24,14,20,'sum');tower(80,cost*25,'signal',20);
    reading=`${choice==='road'?'Rodoviário':choice==='rail'?'Ferroviário':'Hidroviário'}: custo relativo ${cost} por t·km.`;break;}
  case 'trade-balance':{tower(-40,value*10,'sum',40);tower(40,50,'signal',40);reading=`Exportações ${value} − importações 5 = ${value-5} (${value>5?'superávit':value<5?'déficit':'equilíbrio'}).`;break;}
  case 'demographic-bonus':{const young=[45,35,25,20][value-1],old=[5,8,12,22][value-1],adult=100-young-old;tower(-50,young,'sum',30);tower(0,adult,'signal',30);tower(50,old,'body',30);
    reading=`Razão de dependência ${fmt((young+old)/adult*100,0)}%. ${value===3?'Bônus: muitos adultos produtivos.':''}`;break;}
  }
  // Leitura sempre acompanha o controle: nestes modelos o parâmetro muda o desenho e precisa aparecer no texto.
  const suffix:Partial<Record<BioGeoKind,(v:number)=>string>>={
    'biomagnification':v=>` Biomassa relativa no nível ${v}: ${fmt(100/10**(v-1),2)}%.`,
    'air-inversion':v=>` Emissão ${v}: ${v*3} parcelas de fumaça.`,
    'body-cavity':v=>` Mesoderma com espessura ${v}.`,
    'arachnid':v=>` Patas abertas ${v}°.`,
    'arthropod':v=>` Tamanho relativo ${v}.`,
    'br-biomes':v=>` ${v} indivíduos no recorte.`,
    'life-cycles':v=>` Etapa ${fmt(v*100,0)}% do ciclo.`,
    'heart-chambers':v=>choice==='reptile'?` Septo cobre ${fmt(v*100,0)}% do ventrículo.`:` Mistura relativa ${fmt(v*100,0)}%.`,
    'lamarck-darwin':v=>` Após ${v} geração(ões).`,
    'fungi':v=>` Crescimento ${fmt(v*100,0)}%.`,
    'sex-linked':v=>` ${v} descendente(s) mostrado(s).`,
    'bryo-pterido':v=>` Altura relativa ${v}.`,
    'seed-fruit':v=>` Etapa ${fmt(v*100,0)}%.`,
    'sponge-cnidarian':v=>` Fluxo ${v}.`,
    'protists':v=>` Velocidade relativa ${v}.`,
    'transport-modes':v=>` ${v} unidade(s) de carga.`,
    'biofuel-cycle':v=>` Etapa ${fmt(v*100,0)}%.`,
    'power-sources':v=>` Potência relativa ${v}.`,
    'env-diplomacy':v=>` Compromisso relativo ${v}.`,
    'br-rivers':v=>` Desnível ${v}.`,
    'eu-circles':v=>` Nível de integração destacado: ${['UE','euro','Schengen'][v-1]}.`,
    'lateralism':v=>` ${v} países no modelo.`,
  };
  reading+=suffix[kind]?.(value)??'';
  return {traces,dots,labels,reading,legend};
}
