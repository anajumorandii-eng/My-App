import { AVOGADRO, colligativeState, compressedEquilibrium, copperMass, firstOrderState, idealGas, stoichiometricState, type ChemistrySpatialKind } from './chemistrySpatialBatch';
import type { PhysicsSpatialDrawing, SpatialTrace, SpatialDot } from './physicsSpatialDrawing';
import type { SpatialPoint } from './spatialSolid';
const fmt=(v:number)=> (Math.abs(v)<1e-9?0:v).toLocaleString('pt-BR',{maximumFractionDigits:3});
const ring=(x:number,y:number,r:number):SpatialPoint[]=>Array.from({length:49},(_,i)=>[x+r*Math.cos(i*Math.PI/24),y,r*Math.sin(i*Math.PI/24)]);
const grid=(i:number):SpatialPoint=>[(i%4-1.5)*27,(Math.floor(i/4)%2-.5)*30,(Math.floor(i/8)-.5)*32];

/** Topic-specific XYZ objects. All dimensions are illustrative unless the reading assigns units. */
export function chemistrySpatialDrawing(kind:ChemistrySpatialKind,value:number,time:number,choice:string):PhysicsSpatialDrawing {
  const traces:SpatialTrace[]=[],dots:SpatialDot[]=[],labels:PhysicsSpatialDrawing['labels']=[];
  const line=(points:SpatialPoint[],role:SpatialTrace['role']='body',extra:Partial<SpatialTrace>={})=>traces.push({points,role,...extra});
  const dot=(point:SpatialPoint,role:SpatialDot['role']='body',radius=6)=>dots.push({point,role,radius});
  const label=(point:SpatialPoint,text:string)=>labels.push({point,text});
  const arrow=(a:SpatialPoint,b:SpatialPoint,role:SpatialTrace['role']='signal')=>line([a,b],role,{arrow:true});
  const box=(x:number,y:number,w:number,h:number,d=35)=>{
    const p=Array.from({length:8},(_,i):SpatialPoint=>[x+w*((i&1)? .5:-.5),y+h*((i&2)? .5:-.5),d*((i&4)? .5:-.5)]);
    for(const f of [[0,1,3,2],[0,1,5,4],[1,3,7,5]])line(f.map(i=>p[i]),'body',{closed:true});
    p.forEach((point,i)=>[0,1,2].forEach(j=>{if(!(i>>j&1))line([point,p[i|1<<j]]);}));
  };
  const vessel=(x=0,r=48,bottom=-55,top=55)=>{line(ring(x,bottom,r));line(ring(x,top,r),'reference');for(const z of [-r,r])line([[x,bottom,z],[x,top,z]]);};
  const water=(x:number,y=0,r=48)=>line(ring(x,y,r),'sum',{closed:true});
  const molecule=(x:number,y:number,z:number,waterMolecule=false)=>{
    dot([x,y,z],waterMolecule?'signal':'body',7);
    for(const dx of [-9,9]){const p:SpatialPoint=[x+dx,y+8,z];line([[x,y,z],p]);dot(p,'sum',4);}
  };
  const electrodes=(powered:boolean)=>{
    vessel(-55,32,-50,20);vessel(55,32,-50,20);water(-55,-8,32);water(55,-8,32);
    box(-55,10,12,62,12);box(55,10,12,62,12);
    line([[-55,42,0],[-55,70,0],[55,70,0],[55,42,0]],'body');
    line([[-25,-15,0],[-25,36,0],[25,36,0],[25,-15,0]],'sum');
    label([-55,-73,0],powered?'Cu (+)':'Zn (−)');label([55,-73,0],'Cu '+(powered?'(−)':'(+)'));
    if(powered){box(0,70,28,18,12);label([-9,70,0],'+');label([9,70,0],'−');}
    label([0,95,0],powered?'Fonte externa':'Fio: e⁻ →');
    arrow([-20,70,0],[20,70,0]);
    if(!powered){arrow([-6,36,0],[-25,36,0],'sum');arrow([6,36,0],[25,36,0],'sum');}
  };
  let reading='',legend='Vinho: entidade em destaque · azul: comparação · cinza: referência';
  if(kind==='atomic') {
    for(const [end,name] of [[[ -65,-60,0],'x'],[[-85,-40,0],'y'],[[-85,-60,20],'z']] as [SpatialPoint,string][]){line([[-85,-60,0],end],'reference');label(end,name);}
    if(choice==='dalton'){dot([0,0,0],'body',value);reading=`Dalton: esfera sem estrutura interna no modelo histórico; raio visual ${fmt(value)}.`;}
    else {
      for(const axis of [0,1,2])line(Array.from({length:49},(_,i):SpatialPoint=>{const a=i*Math.PI/24;return axis===0?[value*Math.cos(a),value*Math.sin(a),0]:axis===1?[value*Math.cos(a),0,value*Math.sin(a)]:[0,value*Math.cos(a),value*Math.sin(a)];}),'reference',{dashed:choice==='rutherford'});
      if(choice==='rutherford')dot([0,0,0],'signal',9);
      for(let i=0;i<6;i++){const a=i*Math.PI/3;dot([value*.65*Math.cos(a),value*.4*Math.sin(a),value*.3*Math.sin(2*a)],'sum',5);}
      reading=`${choice==='thomson'?'Thomson: carga positiva difusa':'Rutherford: carga positiva no núcleo ampliado'}; seis elétrons esquemáticos; raio visual ${fmt(value)}.`;
    }
    legend='Azul: elétrons nos modelos com estrutura · núcleo ampliado em vinho; esfera externa não é orbital. Eixos externos apenas orientam a vista; esfera homogênea é invariante à rotação';
  } else if(kind==='periodic') {
    const names=['Na','Mg','Al','Si','P','S','Cl','Ar'],valence=value-10;
    for(let shell=1;shell<=3;shell++){
      const count=shell===1?2:shell===2?8:valence,r=shell*23;
      line(Array.from({length:49},(_,i):SpatialPoint=>[r*Math.cos(i*Math.PI/24),r*Math.sin(i*Math.PI/24),0]),'reference',{dashed:true});
      for(let i=0;i<count;i++){const a=i*2*Math.PI/count;dot([r*Math.cos(a),r*Math.sin(a),0],shell===3?'signal':'sum',4);}
    }
    dot([0,0,0],'body',12);label([0,0,0],names[value-11]);
    reading=`${names[value-11]}, Z = ${value}; 3º período; grupo ${valence<=2?valence:valence+10}; camadas: 2, 8, ${valence}; ${value} elétrons no átomo neutro.`;
    legend='Vinho: elétrons da camada externa · azul: camadas internas; anéis são localizadores';
  } else if(kind==='decay') {
    const remaining=32*2**(-value*time);
    for(let i=0;i<32;i++)dot([(i%8-3.5)*18,(Math.floor(i/8)-1.5)*22,((i%3)-1)*12],i<Math.round(remaining)?'signal':'reference',5);
    reading=`t/t½ = ${fmt(value*time)}; fração restante esperada ${fmt(100*remaining/32)}%; ${fmt(remaining)} de 32 unidades esperadas. ${choice==='alpha'?'²¹⁰Po → ²⁰⁶Pb + ⁴He: A −4, Z −2.':'¹⁴C → ¹⁴N + e⁻ + antineutrino: A constante, Z +1.'}`;
    legend='Vinho: fração restante arredondada no desenho · cinza: decaída; leitura conserva valor esperado exato';
  } else if(kind==='phase'||kind==='gas'||kind==='mixture') {
    const volume=kind==='gas'?value:2,r=kind==='gas'?30*Math.sqrt(volume):48;
    vessel(0,r);if(kind==='phase'&&choice!=='gas')water(0,-12,r);
    for(let i=0;i<12;i++){
      const p=grid(i);let q:SpatialPoint;
      if(kind==='phase'&&choice==='solid')q=[p[0]*.8+value*Math.sin(time*2*Math.PI+i),p[1]-20,p[2]];
      else if(kind==='phase'&&choice==='liquid')q=[p[0]*.8+value*Math.sin(time*2*Math.PI+i),-35+(i%3)*8,p[2]];
      else {const phase=time*2*Math.PI*(kind==='phase'?value/4:1);q=[r*.6*Math.sin(i*2.4+phase),38*Math.sin(i*1.7+phase),r*.6*Math.cos(i*1.4+phase)];}
      dot(q,kind==='mixture'&&i>=Math.round(12*value)?'sum':'signal',5);
    }
    if(kind==='phase')reading=`Estado ${choice==='solid'?'sólido':choice==='liquid'?'líquido':'gasoso'}; 12 marcadores conservados; amplitude ilustrativa ${fmt(value)}; percurso ${fmt(time*100)}%.`;
    else {const state=idealGas(volume,kind==='mixture'?value:.5);reading=kind==='gas'?`V = ${fmt(volume)} L; n = 0,10 mol; T = 300 K; p = ${fmt(state.pressure)} kPa; nRT = ${fmt(state.pressure*volume)} kPa·L.`:`xA = ${fmt(value)}; xB = ${fmt(1-value)}; pA = ${fmt(state.partialA)} kPa; pB = ${fmt(state.partialB)} kPa; ptotal = ${fmt(state.pressure)} kPa.`;}
    legend=kind==='mixture'?'Vinho: gás A · azul: gás B; quantidades ilustrativas arredondadas':'Marcadores no recipiente: quantidade conservada; movimento esquemático sem velocidade em escala';
  } else if(kind==='filter') {
    line([[-55,60,-12],[55,60,-12],[10,-5,-12],[-10,-5,-12],[-55,60,-12]],'body');line([[-55,60,12],[55,60,12],[10,-5,12],[-10,-5,12],[-55,60,12]],'reference');
    line([[-35,30,-12],[35,30,-12],[0,-3,0],[-35,30,-12]],'sum',{closed:true});
    vessel(0,38,-85,-25);water(0,-60,38);
    for(let i=0;i<value;i++)dot([(i-(value-1)/2)*6,18,0],'body',5);
    dot([0,12-time*65,0],'signal',5);dot([8,18-time*65,5],'sum',3);
    reading=`${value} unidades de areia retidas; filtrado contém água e sal dissolvido; passagem ilustrativa ${fmt(time*100)}%.`;
    legend='Cinza: areia retida · vinho: solvente · azul: soluto dissolvido; filtro em corte esquemático';
  } else if(kind==='balance') {
    for(let i=0;i<2*value;i++){const y=48-i*17;line([[-90,y,0],[-76,y,0]],'sum');dot([-90,y,0],'sum',4);dot([-76,y,0],'sum',4);}
    for(let i=0;i<value;i++){const y=20-i*23;line([[-38,y,0],[-22,y,0]],'signal');dot([-38,y,0],'signal',6);dot([-22,y,0],'signal',6);}
    for(let i=0;i<2*value;i++)molecule(64,48-i*17,(i%2)*8,true);
    arrow([-5,0,0],[22,0,0]);
    reading=`${2*value} H₂ + ${value} O₂ → ${2*value} H₂O; cada lado: ${4*value} H e ${2*value} O; menor razão 2:1:2.`;
    legend='Azul: H · vinho: O; conjuntos separados por seta de reação, sem percurso temporal';
  } else if(kind==='mol') {
    box(0,-60,105,18);vessel(0,35,-50,20);water(0,-25,35);for(let i=0;i<6;i++)molecule((i%3-1)*18,-10-Math.floor(i/3)*18,0,true);
    label([0,-82,0],`${fmt(value*18)} g`);reading=`n = ${fmt(value)} mol de H₂O; m ≈ ${fmt(value*18)} g; N = ${(value*AVOGADRO/1e23).toLocaleString('pt-BR',{maximumFractionDigits:4})} × 10²³ moléculas.`;
    legend='Recipiente sobre balança: leitura de massa; seis moléculas ampliadas apenas ilustram a identidade da água';
  } else if(kind==='formula') {
    for(let i=0;i<value;i++){dot([-45,40-i*35,0],'body',9);dot([0,40-i*35,-8],'sum',4);dot([0,40-i*35,8],'sum',4);dot([45,40-i*35,0],'signal',8);}
    label([-45,-70,0],'C');label([0,-70,0],'H');label([45,-70,0],'O');
    reading=`Fórmula mínima CH₂O; molecular C${value}H${2*value}O${value}; razão C:H:O = 1:2:1; M ≈ ${30*value} g/mol. Sem conectividade definida.`;
    legend='Colunas contam C, H e O; espaçamento não representa ligações químicas';
  } else if(kind==='stoichiometry') {
    const m=stoichiometricState(value,time);
    for(const [x,n,role] of [[-65,m.hydrogen,'sum'],[0,m.oxygen,'signal'],[65,m.water,'body']] as [number,number,SpatialTrace['role']][]){if(n>1e-9)box(x,-50+7*n,32,n*14);else line([[x-16,-50,0],[x+16,-50,0]],role);label([x,-82,0],x===-65?'H₂':x===0?'O₂':'H₂O');}
    reading=`ξ = ${fmt(m.extent)} mol; restante H₂ = ${fmt(m.hydrogen)} mol, O₂ = ${fmt(m.oxygen)} mol; H₂O = ${fmt(m.water)} mol; massa total ≈ ${fmt(m.mass)} g; limitante ${value<4?'H₂':value>4?'O₂':'ambos na razão exata'}.`;
    legend='Barras espaciais em escala comum de mols: não são volume de líquido ou tamanho de moléculas';
  } else if(kind==='ionic') {
    vessel(0,55);water(0,0,55);
    for(let i=0;i<value;i++){const x=(i-(value-1)/2)*20;dot([x,25-65*time,-12],'signal',6);dot([x,12-45*time,12],'sum',6);line([[x,25-65*time,-12],[x,12-45*time,12]],'reference',{dashed:true});dot([x,32,-28],'reference',4);dot([x,32,28],'reference',4);}
    reading=`Ag⁺ + Cl⁻ → AgCl(s); ${value} pares ilustrativos; Na⁺ e NO₃⁻ permanecem em solução; formação ilustrativa ${fmt(time*100)}%.`;
    legend='Vinho: Ag⁺ · azul: Cl⁻ · cinza: espectadores; ao final os pares representam sítios de uma rede, não moléculas isoladas';
  } else if(kind==='redox') {
    box(-55,0,25,45);box(55,0,25,45);arrow([-35,35,0],[35,35,0]);
    for(const z of [-8,8])dot([-35+70*time,35,z],'signal',4);
    label([-55,-50,0],'Zn → Zn²⁺');label([55,-50,0],'Cu²⁺ → Cu');
    reading=`Avanço representado ${fmt(value*time)} mol; Zn perde ${fmt(2*value*time)} mol e⁻, Cu²⁺ recebe a mesma quantidade; oxidação Zn, redução Cu²⁺.`;
    legend='Dois marcadores sobre seta de contabilidade eletrônica; não são elétrons transportados pela solução';
  } else if(kind==='dispersion'||kind==='colligative') {
    vessel(0,50);water(0,5,50);
    const count=kind==='colligative'?Math.round(value*8)*(choice==='salt'?2:1):8;
    for(let i=0;i<count;i++){const p=grid(i);dot([p[0],p[1]-8,p[2]],i%2===0?'signal':'sum',kind==='dispersion'?(choice==='colloid'?value:2):4);}
    if(kind==='dispersion'){
      line([[-80,0,0],[80,0,0]],'signal',{dashed:true});if(choice==='colloid')for(const side of [-1,1])arrow([0,0,0],[0,35,side*35],'sum');
      reading=`${choice==='colloid'?'Coloide: espalhamento lateral ilustrativo':'Solução: feixe lateral não destacado neste esquema'}; raio visual ${fmt(value)}; não é previsão óptica quantitativa.`;
      legend='Linha vinho: luz incidente · azul: espalhamento lateral qualitativo no coloide';
    } else {const m=colligativeState(value,choice==='salt');reading=`b = ${fmt(value)} mol/kg; i = ${m.factor}; ΔTf = ${fmt(m.depression)} °C; T congelamento ≈ ${fmt(m.freezing)} °C; 1 kg de água fixo.`;legend='Marcadores de soluto: não eletrólito ou pares de íons dissociados; contagem ilustrativa arredondada';}
  } else if(kind==='enthalpy'||kind==='gibbs') {
    if(kind==='enthalpy'){
      const a:SpatialPoint=[-65,30,0],b:SpatialPoint=[65,-30,0],middle:SpatialPoint=[0,30+value,28];
      line([a,b],'signal');line([a,middle,b],'sum');for(const p of [a,b,middle])dot(p,'body',4);
      label([-65,46,0],'A');label([65,-48,0],'B');label([0,48+value,28],'I');
      reading=`ΔH₁ = ${fmt(value)} kJ/mol; ΔH₂ = ${fmt(-60-value)} kJ/mol; soma = −60 kJ/mol = ΔH direto.`;
      legend='Vinho: caminho direto · azul: duas etapas; eixo vertical representa entalpia, não energia de ativação';
    } else {
      const g=30-.1*value;box(-55,-20,24,60);box(0,-50+.1*value,24,.2*value);box(55,-50+g,24,Math.max(1,Math.abs(2*g)));
      line([[-80,-50,0],[80,-50,0]],'reference',{dashed:true});
      label([-55,-105,0],'ΔH');label([0,-105,0],'TΔS');label([55,-105,0],'ΔG');
      reading=`T = ${value} K; ΔH = +30 kJ/mol; TΔS = ${fmt(.1*value)} kJ/mol; ΔG = ${fmt(g)} kJ/mol; ${g<0?'termodinamicamente espontâneo':g>0?'não espontâneo no sentido indicado':'ΔG = 0: condição de equilíbrio'}.`;
      legend='Barras representam termos energéticos; geometria não é trajetória de partículas ou mecanismo';
    }
  } else if(kind==='kinetics') {
    const m=firstOrderState(value,time);box(-45,-40+80*m.a/2,30,80*m.a);box(45,-40+80*m.b/2,30,Math.max(1,80*m.b));
    label([-45,-65,0],'A');label([45,-65,0],'B');
    line(Array.from({length:41},(_,i):SpatialPoint=>[-70+i*3.5,65-40*(1-Math.exp(-value*i/8)),30]),'signal');
    dot([-70+140*time,65-40*(1-m.a),30],'signal',4);
    reading=`t = ${fmt(m.time)} s; [A] = ${fmt(m.a)} mol/L; [B] = ${fmt(m.b)} mol/L; v = ${fmt(m.rate)} mol/(L·s); [A] + [B] = 1 mol/L.`;
    legend='Barras: concentrações em escala comum · curva vinho: [A] versus tempo, domínio 0 a 5 s';
  } else if(kind==='cell'||kind==='electrolysis'||kind==='faraday') {
    const powered=kind!=='cell';electrodes(powered);
    dot([-45+90*time,70,0],'signal',4);
    if(kind==='cell'){
      dot([-6-19*time,36,0],'sum',4);dot([6+19*time,36,0],'sum',4);
      reading=`Zn: ânodo (−), oxidação; Cu: cátodo (+), redução; E° = 1,10 V; avanço ilustrado ${fmt(value*time)} mol; ${fmt(2*value*time)} mol e⁻ transferidos no circuito externo.`;
      legend='Vinho: elétrons no fio · azul: íons na ponte salina; sinais da pilha não são os da eletrólise';
    } else {
      const charge=(kind==='faraday'?2*value:value)*time,mass=copperMass(charge);
      box(66,10,Math.max(1,mass*20),55,12);
      reading=`Cátodo Cu (−): redução; ânodo Cu (+): oxidação; Q = ${fmt(charge)} C; m(Cu) = ${fmt(mass)} g${kind==='faraday'?`; I = 2 A; t = ${fmt(value*time)} s`:''}; fonte externa, rendimento 100%.`;
      legend='Vinho: fluxo eletrônico forçado pela fonte · camada no cátodo é depósito ampliado, sem escala de espessura';
    }
  } else if(kind==='equilibrium') {
    const m=compressedEquilibrium(value,time);vessel(0,35+value*12);
    const pairs=Math.round(m.a*value*4),singles=12-2*pairs;
    for(let i=0;i<pairs;i++){const p:SpatialPoint=[(i%3-1)*28,Math.floor(i/3)*24-18,-15];dot(p,'signal',5);dot([p[0]+9,p[1],p[2]],'signal',5);line([p,[p[0]+9,p[1],p[2]]]);}
    for(let i=0;i<singles;i++)dot([(i%3-1)*26,Math.floor(i/3)*24-18,22],'sum',5);
    dot([-60+120*time,-75,0],'reference',3);
    arrow([-70,-75,0],[-25,-75,0],'sum');arrow([70,-75,0],[25,-75,0],'signal');
    reading=`V = ${fmt(value)} L; Qc após compressão = ${fmt(m.initialQuotient)} mol/L; [N₂O₄] = ${fmt(m.a)} mol/L; [NO₂] = ${fmt(m.b)} mol/L; Qc atual = ${fmt(m.quotient)} mol/L; Kc = 1 mol/L; avanço = ${fmt(m.extent)} mol.`;
    legend='Pares vinho: N₂O₄ · azul: NO₂, contagem ilustrativa arredondada conserva 12 unidades NO₂; ponto cinza: progresso normalizado, não uma molécula';
  }
  return {traces,dots,labels,reading,legend};
}
