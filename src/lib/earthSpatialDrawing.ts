import { inducedFieldSign, projectionY, theoreticalUtc, type EarthSpatialKind } from './earthSpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';
const pi=Math.PI,fmt=(n:number)=>n.toLocaleString('pt-BR',{maximumFractionDigits:2});
export const EARTH_MOVING_KINDS:EarthSpatialKind[]=['rain','plates','basin','brazil-air','lenz','invasive','inorganic'];
export function earthSpatialDrawing(kind:EarthSpatialKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const dot=(point:SpatialPoint,role:SpatialDot['role']='signal',radius=5)=>dots.push({point,role,radius});
  const label=(point:SpatialPoint,text:string)=>labels.push({point,text});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>line([a,b],role,{arrow:true});
  const ring=(r:number,y=0,role:SpatialTrace['role']='body')=>line(Array.from({length:49},(_,i):SpatialPoint=>[r*Math.cos(i*pi/24),y,r*Math.sin(i*pi/24)]),role);
  const globe=(r:number)=>{for(const lat of [-60,-30,0,30,60]){const a=lat*pi/180;ring(r*Math.cos(a),r*Math.sin(a),'reference');}for(let mer=0;mer<180;mer+=30){const a=mer*pi/180;line(Array.from({length:49},(_,i):SpatialPoint=>[r*Math.cos(i*pi/24)*Math.cos(a),r*Math.sin(i*pi/24),r*Math.cos(i*pi/24)*Math.sin(a)]),'reference');}};
  const box=(x:number,y:number,z:number,w:number,h:number,d:number,role:SpatialTrace['role']='body')=>{for(const depth of [z-d/2,z+d/2])line([[x-w/2,y,depth],[x+w/2,y,depth],[x+w/2,y+h,depth],[x-w/2,y+h,depth]],role,{closed:true});for(const xx of [x-w/2,x+w/2])for(const yy of [y,y+h])line([[xx,yy,z-d/2],[xx,yy,z+d/2]],role);};
  const route=(points:SpatialPoint[],role:SpatialTrace['role']='signal')=>{line(points,role,{arrow:true});const p=Math.max(0,Math.min(1,time))*(points.length-1),i=Math.min(points.length-2,Math.floor(p));dot(points[i].map((v,j)=>v+(points[i+1][j]-v)*(p-i)) as SpatialPoint,role,6);};
  const ground=(y=-30)=>box(0,y-8,0,155,8,70,'reference');
  const plant=(x:number,z:number,style:string,size=1,y=-22)=>{const h=(style==='forest'?48:style==='savanna'?30:style==='caatinga'?25:style==='mangrove'?30:style==='araucaria'?42:style==='desert'?16:10)*size;line([[x,y,z],[x,y+h,z]]);if(style==='araucaria'){for(const level of [18,27,36])line([[x-12,y+level,z],[x,y+level+5,z],[x+12,y+level,z]],'sum');}else if(style==='forest'||style==='savanna'){for(const dx of [-12,12])line([[x,y+h*.6,z],[x+dx,y+h,z],[x+dx*1.4,y+h*.8,z+8]],'sum');dot([x,y+h,z],'sum',style==='forest'?12:7);}else if(style==='desert'){line([[x-6,y+h*.7,z],[x-6,y+h*.4,z],[x,y+h*.4,z],[x+6,y+h*.55,z],[x+6,y+h*.8,z]],'sum');}else if(style==='caatinga'){line([[x-8,y+h*.65,z],[x,y+h*.4,z],[x+8,y+h*.85,z]],'sum');}else if(style==='mangrove'){for(const dx of [-10,10])line([[x,y+12,z],[x+dx,y-8,z+8]],'sum');dot([x,y+h,z],'sum',9);}else {for(const dx of [-6,6])line([[x,y,z],[x+dx,y+h,z]],'sum');}};
  let reading='';
  const legend='Vinho: destaque · azul: estrutura ou fluxo relacionado · cinza: referência';
  if(kind==='zones') {
    globe(70);const a=value*pi/180;line(Array.from({length:25},(_,i):SpatialPoint=>[70*Math.cos(-pi/2+i*pi/24)*Math.sin(a),70*Math.sin(-pi/2+i*pi/24),70*Math.cos(-pi/2+i*pi/24)*Math.cos(a)]),'signal');
    label([0,92,0],'N');label([0,-92,0],'S');
    const utc=theoreticalUtc(value);reading=`Longitude ${value}°: UTC${utc>=0?'+':''}${utc} no sistema teórico; leste adianta, oeste atrasa. 360° ÷ 24 h = 15°/h.`;
  } else if(kind==='contours') {
    ground(-50);for(const h of [20,40,60,80])ring(70*(1-h/100),-50+h*.8,'reference');
    for(const a of [0,pi/2,pi,pi*1.5])line([[70*Math.cos(a),-50,70*Math.sin(a)],[0,30,0]]);
    ring(70*(1-value/100),-50+value*.8,'signal');label([0,65,0],'Curva = mesma altitude');
    reading=`Curva destacada na altitude ${value} do modelo; raio ${fmt(70*(1-value/100))}. Neste morro, subir reduz o raio; curvas não se cruzam.`;
  } else if(kind==='projection') {
    const equal=choice==='equal-area',y=(lat:number)=>projectionY(lat,equal)*38;
    for(const lat of [-75,-60,-30,0,30,60,75])line([[-85,y(lat),0],[85,y(lat),0]],'reference');
    for(const x of [-85,-42.5,0,42.5,85])line([[x,y(-75),0],[x,y(75),0]],'reference');
    line([[-85,y(value),0],[85,y(value),0]],'signal');dot([0,y(value),0]);
    label([0,-100,0],equal?'Lambert equivalente':'Mercator conforme');
    reading=`Latitude ${value}°; ordenada projetada ${fmt(projectionY(value,equal))} radianos de referência. ${equal?'y = sen φ: conserva áreas, comprime a separação dos paralelos perto dos polos.':'y = ln tan(π/4 + φ/2): amplia a separação dos paralelos perto dos polos.'}`;
  } else if(kind==='layers') {
    for(let layer=0;layer<3;layer++){const y=-30+layer*value;box(0,y,0,135,1,75,layer===0?'body':layer===1?'sum':'reference');if(layer===1)line([[-55,y+2,-25],[-10,y+2,10],[50,y+2,-15]],'sum');if(layer===2)for(const [x,z] of [[-10,10],[50,-15]])dot([x,y+3,z]);}
    for(const [x,z] of [[-10,10],[50,-15]])line([[x,-30,z],[x,-30+2*value,z]],'reference',{dashed:true});
    reading=`Camadas separadas visualmente por ${value}: terreno, rede e observações. Linhas de alinhamento mantêm as coordenadas x/z ao separar as camadas.`;
  } else if(kind==='graphs') {
    ground(-45);for(const [i,n] of [3,6,value].entries()){const x=(i-1)*48;box(x,-37,0,30,n*9,30,i===2?'signal':'sum');label([x,-60,0],['A','B','C'][i]);}
    reading=`Regiões fictícias A = 3, B = 6, C = ${value}; barra C ${value>6?'maior que':value===6?'igual a':'menor que'} B. Base representa território; altura representa valor, não altitude.`;
  } else if(kind==='rain') {
    ground(-40);for(const z of [-25,25])line([[-70,-32,z],[0,value-32,z],[70,-32,z]],'body');line([[0,value-32,-25],[0,value-32,25]]);
    route([[-78,-12,0],[-30,value-10,0],[0,value+5,0],[68,-12,0]]);
    for(const x of [-35,-20])arrow([x,value-5,15],[x,-25,15],'sum');label([-52,-65,0],'Barlavento');label([52,-65,0],'Sotavento');
    reading=`Barreira de altura visual ${value}; percurso ${fmt(time*100)}%. Ar sobe a barlavento, precipita e desce a sotavento; não é chuva calculada.`;
  } else if(kind==='circulation') {
    globe(65);ring(65*Math.cos(value*pi/180),65*Math.sin(value*pi/180),'signal');
    for(const side of [-1,1])for(const [i,[lo,hi]] of [[0,30],[30,60],[60,90]].entries()){const points=Array.from({length:33},(_,j):SpatialPoint=>{const a=j*pi/16,lat=side*((lo+hi)/2-(hi-lo)/2*Math.cos(a))*pi/180,r=68+5*(1+Math.sin(a));return [r*Math.cos(lat),r*Math.sin(lat),0];});line(i===1?points.reverse():points,'sum',{arrow:true});}
    label([-65,-92,0],'0° · 30° · 60°');reading=`Referência ${value}° N: ${value<30?'faixa tropical / Hadley':value<60?'médias latitudes / Ferrel':'transição subpolar'}. Circulação média simplificada em três células por hemisfério; não determina sozinha um tipo climático.`;
  } else if(kind==='plates') {
    const d=value*time,div=choice==='diverge';box(-40+(div?-d:d),-25,0,65,12,55);box(40+(div?d:-d),-25,0,65,12,55,'sum');
    if(div){arrow([-30,-5,0],[-65,-5,0]);arrow([30,-5,0],[65,-5,0]);route([[0,-70,0],[0,-12,0]],'sum');}else {line([[-25+d,-25,0],[10,-48,0],[40,-65,0]],'signal');arrow([-65,8,0],[-28,8,0]);arrow([65,8,0],[28,8,0]);}
    reading=`${div?'Divergência: placas se afastam, ascensão no limite.':'Convergência: uma placa oceânica mergulha sob a outra.'} Deslocamento máximo visual ${value}; etapa ${fmt(time*100)}%.`;
  } else if(kind==='biomes'||kind==='brazil-vegetation') {
    ground();for(let i=0;i<value;i++)plant((i-(value-1)/2)*18,(i%2?1:-1)*17,choice);
    const meanings:Record<string,string>={forest:'estratos arbóreos e copas',savanna:'árvores espaçadas e estrato herbáceo',desert:'vegetação esparsa; disponibilidade de água limita cobertura',tundra:'vegetação baixa; frio e curta estação de crescimento',caatinga:'ramos e formas simplificadas; adaptações à sazonalidade hídrica'};
    if(choice==='desert')for(const d of dots)d.radius=2;
    reading=`${value} indivíduos simbólicos; ${meanings[choice]||meanings.forest}. Quantidade ilustrativa, sem inferir riqueza de espécies ou delimitar um bioma.`;
  } else if(kind==='basin') {
    ground(-25);for(const z of [-30,30])line([[-65,30,z],[0,-15,z],[65,15,z]],'body');
    line([[-55,12,-25],[0,-15,0],[65,-15,0]],'sum');line([[-55,12,25],[0,-15,0]],'sum');box(0,-25-value,0,130,10,60,'sum');
    route(choice==='ground'?[[-30,45,0],[-30,-17,0],[-30,-25-value+7,0],[55,-25-value+7,0]]:[[-55,12,-25],[0,-15,0],[65,-15,0]]);
    label([0,68,0],'Divisor → bacia');reading=`Aquífero em profundidade visual ${value}; ${choice==='ground'?'infiltração e fluxo entre poros':'afluentes convergem para o canal principal'}; etapa ${fmt(time*100)}%. Modelo sem vazão calculada.`;
  } else if(kind==='earth') {
    const opening=value*pi/180;
    for(const [r,role] of [[72,'body'],[62,'sum'],[34,'signal'],[16,'reference']] as const){for(const axis of [0,1,2])line(Array.from({length:49},(_,i):SpatialPoint=>{const a=opening+(2*pi-opening)*i/48;return axis===0?[r*Math.cos(a),r*Math.sin(a),0]:axis===1?[r*Math.cos(a),0,r*Math.sin(a)]:[0,r*Math.cos(a),r*Math.sin(a)];}),role);}
    label([0,95,0],'Crosta · manto');label([0,-95,0],'Núcleo externo / interno');reading=`Abertura visual ${value}°; crosta, manto, núcleo externo e interno. Raios exagerados: não medir profundidades pela figura.`;
  } else if(kind==='relief') {
    box(-50,-45,0,45,value,55);box(0,-45,0,45,18,55,'signal');box(50,-45,0,45,25,55,'sum');
    label([-50,value-30,0],'Planalto');label([0,-7,0],'Depressão');label([50,0,0],'Planície');arrow([-67,value-25,20],[-40,value-37,20]);arrow([32,5,20],[56,-10,20],'sum');
    reading=`Planalto com altura visual ${value}; depressão rebaixada em relação ao entorno; planície com deposição. Altitude isolada não basta para classificar uma unidade.`;
  } else if(kind==='brazil-air') {
    ground(-40);box(-55,-32,0,35,1,65,'sum');box(40,-32,0,45,12,65);route(choice==='cold'?[[70,15,-20],[20,15,0],[-60,15,20]]:[[-65,10,0],[0,25,0],[value,10,0]]);
    label([-55,-60,0],'Costa');label([50,-60,0],'Interior');reading=`Distância visual costa–interior ${value}; ${choice==='cold'?'avanço conceitual de ar frio':'transporte conceitual de umidade oceânica'}; etapa ${fmt(time*100)}%. Sem previsão de chuva ou posição real de massas de ar.`;
  } else if(kind==='wetlands') {
    ground();if(choice!=='pampa')box(0,-30+value,0,145,1,65,'sum');
    for(let i=0;i<5;i++)plant((i-2)*24,(i%2?1:-1)*15,choice==='mangrove'?'mangrove':choice==='pampa'?'tundra':'savanna',choice==='pampa'?.6+value/20:1);
    reading=`${choice==='pampa'?'Altura da vegetação':'Nível da água'} visual ${value}; ${choice==='pampa'?'Pampa: perfil campestre, sem representar planície inundada':choice==='mangrove'?'manguezal: raízes em área costeira sujeita a marés':'Pantanal: planície sujeita a pulso de inundação'}. Sem dado hidrológico real.`;
  } else if(kind==='domains') {
    ground(-45);for(const z of [-25,25]){const points=Array.from({length:25},(_,i):SpatialPoint=>{const x=-72+i*6,y=choice==='hills'?-30+value*(.5+.5*Math.sin(i*pi/6)):choice==='plateau'?-30+value:-30+value*.15*Math.sin(i*pi/4);return [x,y,z];});line(points);}
    for(const x of [-45,0,45])plant(x,0,choice==='dry'?'caatinga':choice==='plateau'?'araucaria':'forest',.65,choice==='plateau'?-30+value:choice==='dry'?-30:-30+value*(.5+.5*Math.sin(((x+72)/6)*Math.PI/6)));
    reading=`Amplitude visual ${value}; ${choice==='hills'?'mares de morros: relevo mamelonar e contexto úmido':choice==='dry'?'caatingas: contexto semiárido, cobertura e sazonalidade hídrica':'araucárias: planaltos e contexto subtropical'}. Recorte não equivale apenas à vegetação e não delimita território.`;
  } else if(kind==='electric') {
    globe(65);for(const r of [28,48,68]){ring(r,0,'sum');line(Array.from({length:49},(_,i):SpatialPoint=>[r*Math.cos(i*pi/24),r*Math.sin(i*pi/24),0]),'sum');}
    dot([0,0,0],choice==='negative'?'sum':'signal',5+value);for(const direction of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const a=direction.map(x=>x*38) as SpatialPoint,b=direction.map(x=>x*82) as SpatialPoint;arrow(choice==='negative'?b:a,choice==='negative'?a:b);}
    reading=`Q = ${choice==='negative'?'-':''}${value} nC; em r = 1 m, V ≈ ${choice==='negative'?'-':''}${9*value} V. Campo ${choice==='negative'?'aponta para':'sai de'} Q e é perpendicular às superfícies equipotenciais.`;
  } else if(kind==='magnet') {
    box(0,-10,0,75,20,20);label([-42,25,0],'N');label([42,25,0],'S');
    for(let i=0;i<value;i++){const y=25+i*12;for(const side of [-1,1])line([[-40,0,0],[-55,side*y,12],[0,side*(y+15),20],[55,side*y,12],[40,0,0]],'sum',{arrow:true});}
    arrow([30,0,0],[-30,0,0]);reading=`${value} linhas por face ilustrada: fora N → S; dentro S → N. Linhas fechadas, sem monopolo isolado; contagem de linhas não mede intensidade.`;
  } else if(kind==='lenz') {
    ring(42);const increasing=choice==='increase',sign=inducedFieldSign(increasing),external=25+value*8*(increasing?time:1-time);
    arrow([0,0,-55],[0,0,external],'sum');arrow([15,0,0],[15,0,sign*55]);
    // Coil lies in xz here: y is its normal, so rotate all construction points to xy.
    const coil=Array.from({length:49},(_,i):SpatialPoint=>[42*Math.cos(i*pi/24),42*Math.sin(i*pi/24),0]);traces[0].points=coil;
    const angle=(increasing?-1:1)*2*pi*time;dot([42*Math.cos(angle),42*Math.sin(angle),0]);label([0,72,0],'Espira no plano xy');
    reading=`Variação relativa ${value}; fluxo externo +z ${increasing?'aumenta':'diminui'}; B induzido ${sign<0?'−z, corrente horária':' +z, corrente anti-horária'}, visto de +z. Etapa ${fmt(time*100)}%.`;
  } else if(kind==='invasive') {
    ground(-45);dot([-55,35,0],'body',10);label([-55,65,0],'Agente');dot([55,35,0],'sum',10);label([55,65,0],'Não alvo');
    for(let i=0;i<value;i++)dot([(i-(value-1)/2)*17,-20,(i%2?1:-1)*18]);label([0,-70,0],'Invasora');
    route(choice==='nontarget'?[[-55,35,0],[55,35,0]]:[[-55,35,0],[0,-20,0]]);
    reading=`${value} invasoras simbólicas; ${choice==='nontarget'?'agente alcança organismo não alvo: efeito indesejado':'agente alcança a invasora no exemplo seletivo'}; etapa ${fmt(time*100)}%. Sem previsão de população ou recomendação de introdução.`;
  } else if(kind==='inorganic') {
    for(let i=0;i<value;i++){const x=(i-(value-1)/2)*29;if(choice==='oxide'){dot([x,0,0],'body',5);for(const side of [-1,1]){line([[x,0,0],[x,side*18,0]],'sum');dot([x,side*18,0],'sum',5);}}else {dot([x,-10-25*time,-12*time],'signal',5);dot([x,10+25*time,12*time],'sum',6);line([[x,-10-25*time,-12*time],[x,10+25*time,12*time]],'reference',{dashed:true});}}
    const names:Record<string,string>={acid:'H₃O⁺ e Cl⁻: ionização de HCl em água',base:'Na⁺ e OH⁻: dissociação de NaOH',salt:'Na⁺ e Cl⁻: dissociação de NaCl',oxide:'CO₂ molecular: O=C=O linear; nenhum íon mostrado'};
    reading=`${value} unidades de exemplo; ${names[choice]||names.acid}; etapa visual ${fmt(time*100)}%. Separação entre símbolos não mede concentração ou distância real.`;
    label([0,75,0],choice==='oxide'?'CO₂ molecular':'Íons em solução');if(choice!=='oxide'){label([0,-65,0],choice==='acid'?'Vinho: H₃O⁺': 'Vinho: Na⁺');label([0,55,0],choice==='base'?'Azul: OH⁻':'Azul: Cl⁻');}
  }
  return {traces,dots,labels,reading,legend};
}
