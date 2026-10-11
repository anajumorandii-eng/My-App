/**
 * Lote espacial de Física, Química e Atualidades (11/10/2026).
 * Cada capítulo recebe um objeto próprio; nenhuma geometria é emprestada de outro assunto.
 * As funções numéricas ficam aqui, fora do desenho, para que o teste confira a física
 * sem depender da projeção.
 */
export type ScienceSpatialKind =
  | 'heat'|'greenhouse'|'frames'|'uniform'|'accelerated'|'newton'|'incline'|'gravity'|'vertical'|'orbit'
  | 'projectile'|'shm'|'impulse'|'recoil'|'collision'|'kinetic-work'|'potential'|'track'|'power'|'plant'
  | 'mass-energy'|'lever'|'expansion'|'phase'|'carnot'|'charging'|'current'|'electric-power'|'resistors'|'meters'
  | 'generator'|'receiver'|'loop'|'kirchhoff'|'capacitor'|'pinhole'|'plane-mirror'|'spherical-mirror'|'eye'|'telescope'
  | 'wave-types'|'wave-speed'|'sound'|'intensity'|'wave-phenomena'|'doppler'|'photoelectric'
  | 'acid-rain'|'combustion'|'addition'|'esterification'|'transesterification'|'pka'|'weak-acid'|'solubility'|'equilibrium';
export interface ScienceSpatialLesson {kind:ScienceSpatialKind;title:string;label:string;min:number;max:number;step:number;initial:number;note:string;choices?:[string,string][];}
const make=(kind:ScienceSpatialKind,title:string,label:string,min:number,max:number,step:number,initial:number,note:string,choices?:[string,string][]):ScienceSpatialLesson=>({kind,title,label,min,max,step,initial,note,choices});
const F='summary-fisica-',Q='summary-quimica-';

export const SCIENCE_SPATIAL_LESSONS:Record<string,ScienceSpatialLesson>={
  'fis-termologia-calor':make('heat','Calor: do quente para o frio','Diferença de temperatura em K',10,80,10,40,'Barra de cobre idealizada, 1 m e 1 cm², sem perdas laterais. Convecção e radiação aparecem como mecanismos qualitativos; o valor numérico vale só para a condução.',[['conduction','Condução'],['convection','Convecção'],['radiation','Radiação']]),
  'atu-cop30-belem':make('greenhouse','Gases de efeito estufa e balanço de energia','CO₂ atmosférico em ppm',280,560,20,420,'Forçamento aproximado ΔF = 5,35·ln(C/280) W/m², só para CO₂. Não projeta temperatura, não representa outros gases nem as decisões da COP30, que seguem na leitura do capítulo.'),
  [F+'cinematica-escalar-conceitos-fundamentais']:make('frames','Mesmo movimento, referenciais diferentes','Velocidade do vagão em m/s',2,10,2,6,'Vagão em trilho reto e passageiro sentado. Repouso e movimento dependem do referencial; a trajetória desenhada é a do passageiro.',[['ground','Referencial: solo'],['train','Referencial: vagão']]),
  [F+'movimento-uniforme']:make('uniform','Deslocamentos iguais em tempos iguais','Velocidade em m/s',2,10,2,4,'Marcas a cada 1 s. Velocidade constante, sem aceleração; posição inicial 0. Trilho é escala visual.'),
  [F+'movimento-uniformemente-variado']:make('accelerated','Velocidade muda o mesmo tanto a cada segundo','Aceleração em m/s²',1,5,1,2,'Partida do repouso; marcas a cada 1 s até 4 s. Distâncias sucessivas seguem 1 : 3 : 5 : 7 (Galileu).'),
  [F+'as-leis-de-newton']:make('newton','Força resultante e aceleração','Força aplicada em N',0,40,5,20,'Bloco de 4 kg em piso horizontal, g = 10 m/s², μ = 0,25 quando há atrito. Atrito estático máximo considerado igual ao cinético.',[['smooth','Sem atrito'],['rough','Com atrito']]),
  [F+'plano-inclinado']:make('incline','Rampa: componentes do peso','Inclinação em graus',10,60,5,30,'Rampa lisa, bloco de 2 kg, g = 10 m/s². P·sen θ puxa ao longo da rampa; P·cos θ é equilibrado pela normal.'),
  [F+'leis-da-gravitacao']:make('gravity','Inverso do quadrado da distância','Distância em unidades d',1,4,1,1,'Duas massas fixas. Força relativa a d = 1. Esferas não estão em escala; as forças são par ação-reação, iguais em módulo.'),
  [F+'analisando-movimentos-contidos-em-um-plano-vertical']:make('vertical','Lançamento vertical','Velocidade inicial em m/s',10,30,5,20,'Sem resistência do ar, g = 10 m/s². Subida e descida levam o mesmo tempo; no topo, v = 0 mas a aceleração continua g.'),
  [F+'orbitas']:make('orbit','Órbita elíptica e segunda lei de Kepler','Excentricidade × 100',0,60,10,40,'Estrela em um foco; semieixo fixo. Razão de velocidades periélio/afélio = (1 + e)/(1 − e). Tempo do percurso não é uniforme no ângulo.'),
  [F+'balistica']:make('projectile','Lançamento oblíquo','Ângulo de lançamento em graus',15,75,15,45,'v₀ = 20 m/s, g = 10 m/s², sem ar. Ângulos complementares têm o mesmo alcance; o plano vertical pode ser girado.'),
  [F+'movimento-harmonico-simples-mhs']:make('shm','Massa e mola: MHS','Amplitude em cm',2,10,2,6,'Massa de 0,5 kg e k = 50 N/m, sem atrito: período 2π√(m/k) ≈ 0,63 s, independente da amplitude.'),
  [F+'impulso-e-quantidade-de-movimento']:make('impulse','Impulso muda a quantidade de movimento','Força média em N',10,50,10,30,'Bola de 0,5 kg parada, contato de 0,1 s. I = F·Δt = Δq. Direção do impulso é a da força.'),
  [F+'sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento']:make('recoil','Explosão: quantidade de movimento total nula','Massa do carrinho B em kg',1,4,1,2,'Dois carrinhos em repouso sobre trilho liso, mola comprimida entre eles. A sai a 2 m/s com 1 kg; forças internas não mudam a quantidade de movimento total.'),
  [F+'colisoes']:make('collision','Colisão frontal em trilho','Massa do carrinho B em kg',1,4,1,1,'A: 1 kg a 4 m/s; B parado. Elástica conserva energia cinética; perfeitamente inelástica une os corpos. Ambos conservam quantidade de movimento.',[['elastic','Elástica'],['inelastic','Perfeitamente inelástica']]),
  [F+'trabalho-e-energia-teorema-da-energia-cinetica']:make('kinetic-work','Trabalho da resultante = ΔEc','Deslocamento em m',1,5,1,3,'Bloco de 2 kg partindo do repouso, força resultante de 8 N paralela ao deslocamento.'),
  [F+'trabalho-e-energia-o-teorema-da-energia-potencial']:make('potential','Trabalho do peso e energia potencial','Altura em m',1,5,1,3,'Massa de 2 kg, g = 10 m/s². Subindo, o peso realiza trabalho −mgh; o caminho não altera esse trabalho.',[['straight','Subida vertical'],['ramp','Subida por rampa']]),
  [F+'sistemas-conservativos-e-sistemas-nao-conservativos']:make('track','Pista em U: energia conservada ou dissipada','Altura inicial em m',1,5,1,4,'Esfera de 1 kg, g = 10 m/s². Com atrito, considera-se perda fixa de 20% da energia mecânica por passagem pela base.',[['ideal','Sem atrito'],['friction','Com atrito']]),
  [F+'potencia-maquina-e-rendimento']:make('power','Guindaste: potência útil e rendimento','Tempo de subida em s',2,10,2,4,'Carga de 100 kg sobe 4 m, g = 10 m/s². Motor com rendimento de 80%: potência total = útil ÷ 0,8.'),
  [F+'a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares']:make('plant','Da energia primária à elétrica','Altura da queda em m',20,100,20,60,'Vazão de 10 m³/s e rendimento de 90% na hidrelétrica. A térmica/nuclear mostra a cadeia calor → vapor → turbina, sem cálculo de potência.',[['hydro','Hidrelétrica'],['thermal','Térmica ou nuclear']]),
  [F+'equivalencia-massa-energia']:make('mass-energy','E = Δm·c²','Defeito de massa em mg',1,10,1,1,'c = 3×10⁸ m/s. Compara-se a energia com 1 kWh = 3,6×10⁶ J. Esferas representam núcleos, não estão em escala.'),
  [F+'estatica']:make('lever','Equilíbrio de momentos','Posição da carga B em m',1,4,1,2,'Barra leve apoiada no centro; A = 60 N a 2 m. Equilíbrio de rotação exige soma dos momentos nula.'),
  [F+'dilatacao-ou-contracao-termica-dos-solidos-e-liquidos']:make('expansion','Dilatação linear, superficial e volumétrica','Variação de temperatura em °C',20,200,20,100,'Alumínio com α = 23×10⁻⁶ °C⁻¹, aresta de 1 m. β ≈ 2α e γ ≈ 3α. Aumento desenhado exagerado; valores exatos na leitura.',[['linear','Linear'],['surface','Superficial'],['volume','Volumétrica']]),
  [F+'calor-sensivel-e-calor-latente']:make('phase','Gelo a −10 °C recebendo calor','Calor fornecido em kJ',0,80,5,20,'100 g de água; c(gelo) = 2,1 J/g°C, L(fusão) = 334 J/g, c(água) = 4,18 J/g°C. Patamar: calor sem mudar temperatura.'),
  [F+'maquinas-termicas-e-ciclo-de-carnot']:make('carnot','Ciclo de Carnot entre duas fontes','Temperatura da fonte fria em K',150,450,50,300,'Fonte quente fixa em 600 K. η = 1 − T_F/T_Q é o limite máximo; ciclo desenhado é esquemático no plano p×V.'),
  [F+'eletrostatica-processos-de-eletrizacao-e-aplicacoes']:make('charging','Atrito, contato e indução','Carga inicial da esfera A em nC',2,8,2,4,'Esferas condutoras idênticas no contato; sinais na indução por separação de cargas e aterramento. No atrito, os corpos ficam com cargas opostas de mesmo módulo.',[['friction','Atrito'],['contact','Contato'],['induction','Indução']]),
  [F+'corrente-eletrica']:make('current','Carga atravessando uma seção','Corrente em A',1,5,1,2,'Fio metálico; marcadores representam portadores e o sentido convencional. Carga por intervalo de 10 s; e = 1,6×10⁻¹⁹ C.'),
  [F+'potencia-eletrica']:make('electric-power','Potência dissipada em um resistor','Tensão em V',30,240,30,120,'Resistor ôhmico de 48 Ω. P = U²/R; energia em 1 h de uso.'),
  [F+'resistores']:make('resistors','Associação de resistores','R₂ em Ω',2,12,2,6,'R₁ = 6 Ω, fonte ideal de 12 V. Série soma resistências; paralelo soma inversos.',[['series','Série'],['parallel','Paralelo']]),
  [F+'medidores-eletricos']:make('meters','Amperímetro em série, voltímetro em paralelo','Resistência da carga em Ω',2,10,2,4,'Fonte ideal de 12 V, medidores ideais. Ligado errado, o amperímetro ideal curto-circuitaria a carga.',[['ammeter','Amperímetro'],['voltmeter','Voltímetro']]),
  [F+'geradores']:make('generator','Gerador real: U = ε − r·i','Corrente em A',0,6,1,2,'ε = 12 V, r = 2 Ω. Corrente de curto i = ε/r; potência útil máxima em i = ε/(2r).'),
  [F+'receptores']:make('receiver','Receptor: U = ε′ + r′·i','Corrente em A',0,5,1,2,'Motor com força contraeletromotriz 6 V e r′ = 1 Ω. Rendimento η = ε′/U.'),
  [F+'circuitos-de-malha-unica']:make('loop','Malha única: lei de Pouillet','R₂ em Ω',1,9,2,3,'Gerador ε = 12 V e r = 1 Ω, R₁ = 2 Ω. A mesma corrente percorre toda a malha.'),
  [F+'eletrodinamica-as-leis-de-kirchhoff']:make('kirchhoff','Nós e malhas','Corrente no ramo 2 em A',1,5,1,2,'Ramo 1 fixo em 3 A entrando no nó. Lei dos nós: soma que entra = soma que sai. Malhas: soma de tensões nula.'),
  [F+'capacitores']:make('capacitor','Capacitor de placas paralelas','Distância entre placas em mm',1,5,1,2,'Placas de 0,1 m² no vácuo, ε₀ = 8,85×10⁻¹² F/m, ligado a 100 V. Campo uniforme entre as placas.'),
  [F+'fundamentos-da-optica-geometrica']:make('pinhole','Câmara escura: propagação retilínea','Distância do objeto em cm',20,100,20,40,'Objeto de 30 cm e caixa de 10 cm de profundidade. Raios em linha reta formam imagem invertida; i/o = p′/p.'),
  [F+'reflexao-em-superficies-planas']:make('plane-mirror','Espelho plano: imagem simétrica','Distância do objeto em cm',10,50,10,30,'Imagem virtual, direita, do mesmo tamanho e simétrica em relação ao plano. Raios refletidos parecem vir da imagem.'),
  [F+'reflexao-em-superficies-esfericas']:make('spherical-mirror','Espelho côncavo e equação de Gauss','Distância do objeto em cm',10,60,5,30,'Foco de 20 cm, aproximação paraxial. p′ negativo indica imagem virtual atrás do espelho.'),
  [F+'optica-da-visao']:make('eye','Olho: onde a imagem se forma','Correção em dioptrias',-3,3,1,0,'Olho esquemático. Miopia: imagem antes da retina, corrige-se com lente divergente; hipermetropia: depois, lente convergente.',[['normal','Olho emétrope'],['myopia','Miopia'],['hyperopia','Hipermetropia']]),
  [F+'microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas']:make('telescope','Duas lentes, dois instrumentos','Distância focal da objetiva em cm',20,100,20,60,'Ocular de 5 cm. Luneta: A = f_ob/f_oc. Microscópio usa objetiva curta (fixada em 1 cm) e tubo de 16 cm; o parâmetro só vale para a luneta.',[['telescope','Luneta'],['microscope','Microscópio']]),
  [F+'conceitos-basicos']:make('wave-types','Onda transversal e longitudinal','Amplitude visual',4,16,4,10,'Partículas do meio oscilam em torno da posição de equilíbrio; a energia é que se propaga. Marque um ponto e observe que ele não viaja com a onda.',[['transverse','Transversal'],['longitudinal','Longitudinal']]),
  [F+'equacao-fundamental-da-ondulatoria']:make('wave-speed','v = λ·f','Frequência em Hz',2,10,2,4,'Corda com velocidade fixa de 20 m/s, determinada pelo meio. Mudar a fonte muda f e λ, não v.'),
  [F+'ondulatoria-som-e-suas-propriedades']:make('sound','Som: compressões no ar','Frequência em Hz',100,1000,100,400,'Som no ar a 340 m/s. Altura depende da frequência; intensidade, da amplitude; timbre, da forma da onda.'),
  [F+'intensidade-sonora']:make('intensity','Esferas de mesma potência','Distância da fonte em m',1,8,1,2,'Fonte isotrópica de 0,1 W, sem absorção. I = P/(4πr²); nível β = 10·log(I/10⁻¹²).'),
  [F+'fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia']:make('wave-phenomena','Difração, polarização e ressonância','Ângulo ou abertura',0,90,15,45,'Polarização: lei de Malus I = I₀·cos²θ, θ entre os filtros. Difração: abertura em comprimentos de onda. Ressonância: frequência natural de 4 Hz.',[['polarization','Polarização'],['diffraction','Difração'],['resonance','Ressonância']]),
  [F+'efeito-doppler-descricao-e-estudo-quantitativo']:make('doppler','Fonte em movimento: frentes de onda','Velocidade da fonte em m/s',0,120,20,60,'Som a 340 m/s, fonte de 500 Hz, observadores parados à frente e atrás. Velocidade da fonte abaixo da do som.'),
  [F+'nocoes-basicas-de-fisica-quantica']:make('photoelectric','Efeito fotoelétrico','Frequência da luz × 10¹⁴ Hz',3,12,1,7,'Sódio, função trabalho 2,3 eV; h = 4,14×10⁻¹⁵ eV·s. Abaixo da frequência de corte nenhum elétron sai, qualquer que seja a intensidade.'),
  [Q+'quimica-ambiental']:make('acid-rain','Chuva ácida e calcário','Moléculas de SO₂ emitidas',2,6,1,3,'SO₂ → SO₃ → H₂SO₄ simplificado. Calcário neutraliza parte do ácido. Contagem é simbólica, sem cálculo de pH real.',[['lake','Lago sem calcário'],['limestone','Solo calcário']]),
  [Q+'combustiveis-fosseis']:make('combustion','Combustão completa do metano','Moléculas de CH₄',1,4,1,2,'CH₄ + 2 O₂ → CO₂ + 2 H₂O. Contagem de átomos conservada; não mostra combustão incompleta.'),
  [Q+'reacoes-de-adicao']:make('addition','Adição de Br₂ ao eteno','Ângulo de abertura da dupla',0,60,15,30,'A ligação π se rompe e cada carbono recebe um bromo. Geometria passa de trigonal plana para tetraédrica.'),
  [Q+'acidos-graxos-e-esterificacao']:make('esterification','Esterificação de Fischer','Comprimento da cadeia (carbonos)',2,6,1,4,'Ácido carboxílico + álcool ⇌ éster + água, catálise ácida. Equilíbrio, não reação completa.'),
  [Q+'transesterificacao-alcoolise']:make('transesterification','Triglicerídeo + metanol','Moléculas de metanol adicionadas',0,3,1,1,'Cada metanol libera uma cadeia como éster metílico (biodiesel). Com três, sobra glicerol. Catalisador omitido.'),
  [Q+'acidez-e-basicidade-pka']:make('pka','pH × pKa: fração ionizada','pH da solução',2,8,1,5,'Ácido acético, pKa = 4,75, Henderson-Hasselbalch. Quando pH = pKa, metade está ionizada.'),
  [Q+'equilibrios-ionicos']:make('weak-acid','Ionização de ácido fraco','Concentração em mmol/L',10,100,10,50,'Ka = 1,8×10⁻⁵ (acético), lei de Ostwald aproximada α ≈ √(Ka/C). Diluir aumenta α e reduz [H⁺].',[['plain','Só o ácido'],['common','Com íon comum']]),
  [Q+'equilibrios-ionicos-ii']:make('solubility','Produto de solubilidade e íon comum','Cl⁻ adicionado em mmol/L',0,10,2,0,'AgCl, Kps = 1,8×10⁻¹⁰ a 25 °C. Com Cl⁻ extra, s ≈ Kps/[Cl⁻]. Partículas são simbólicas.'),
  'qui-equilibrio-acidificacao':make('equilibrium','N₂O₄ ⇌ 2 NO₂: Q e K','Q/K inicial',0.25,4,0.25,0.5,'Equilíbrio em recipiente fechado. Q < K avança para produtos; Q > K volta para reagentes. Endotérmico no sentido direto.',[['concentration','Mudar concentração'],['pressure','Aumentar pressão'],['temperature','Aquecer']]),
};

export const G=10;
export function conductionPower(deltaT:number):number {return 401*1e-4*deltaT/1;}
export function co2Forcing(ppm:number):number {return 5.35*Math.log(ppm/280);}
export function newtonAcceleration(force:number,rough:boolean):number {const fr=rough?Math.min(force,0.25*4*G):0;return (force-fr)/4;}
export function rangeOf(v0:number,angle:number):number {return v0*v0*Math.sin(2*angle*Math.PI/180)/G;}
export function keplerSpeedRatio(e:number):number {return (1+e)/(1-e);}
export function collisionVelocities(mB:number,elastic:boolean):[number,number] {const mA=1,v=4;if(!elastic){const u=mA*v/(mA+mB);return [u,u];}return [(mA-mB)/(mA+mB)*v,2*mA/(mA+mB)*v];}
export function iceState(kJ:number):{temperature:number;meltedFraction:number} {
  const q=kJ*1000,m=100,warm=m*2.1*10,melt=m*334;
  if(q<=warm)return {temperature:-10+q/(m*2.1),meltedFraction:0};
  if(q<=warm+melt)return {temperature:0,meltedFraction:(q-warm)/melt};
  return {temperature:Math.min(100,(q-warm-melt)/(m*4.18)),meltedFraction:1};
}
export function carnotEfficiency(cold:number,hot=600):number {return 1-cold/hot;}
export function mirrorImage(p:number,f=20):number {return Math.abs(p-f)<1e-9?Infinity:1/(1/f-1/p);}
export function dopplerPair(vs:number,f=500,v=340):[number,number] {return [f*v/(v-vs),f*v/(v+vs)];}
export function photoelectronEnergy(f14:number):number {return Math.max(0,4.14e-15*f14*1e14-2.3);}
export function ionizedFraction(pH:number,pKa=4.75):number {return 1/(1+10**(pKa-pH));}
export function silverChlorideSolubility(chloride_mM:number):number {const ksp=1.8e-10,c=chloride_mM/1000;return c>0?ksp/c:Math.sqrt(ksp);}
