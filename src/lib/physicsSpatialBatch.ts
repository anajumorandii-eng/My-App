import type { SpatialPoint } from './spatialSolid';

export type PhysicsSpatialKind = 'circular' | 'acceleration' | 'conical' | 'weight' | 'resultant' | 'contact' | 'atwood' | 'work' | 'gas' | 'hydro' | 'snell' | 'lens' | 'maker' | 'echo' | 'reflection' | 'interference' | 'standing' | 'string' | 'tube' | 'wire';
export interface PhysicsSpatialLesson { kind: PhysicsSpatialKind; title: string; label: string; min: number; max: number; step: number; initial: number; note: string; }
const lesson = (kind: PhysicsSpatialKind, title: string, label: string, min: number, max: number, step: number, initial: number, note: string): PhysicsSpatialLesson => ({kind,title,label,min,max,step,initial,note});
const plane = 'Exemplo plano inserido no espaço; girar a câmera não cria componentes físicas. Setas de grandezas diferentes têm escalas próprias.';
const circle = lesson('circular','Uma volta: velocidade tangente','Rapidez (m/s)',1,6,.5,3,'R = 2 m; movimento circular uniforme. A vista mostra uma volta completa, não um segundo fixo. '+plane);
const gas = (title:string) => lesson('gas',title,'Razão final / inicial',.5,2,.1,1.5,'Gás ideal monoatômico, p₀ = 100 kPa, V₀ = 1 L, T₀ = 300 K, quantidade fixa. Processo quase estático; W positivo na expansão, Q = ΔU + W. No caso isocórico o controle altera T/T₀; nos demais, V/V₀. Sem colisões moleculares ou tempo físico de aquecimento.');
const lens = (title:string) => lesson('lens',title,'Distância do objeto (cm)',30,90,5,60,'Lente fina convergente no ar, f = 20 cm; objeto de 10 cm. Recorte p > f: imagens reais invertidas. 1/f = 1/p + 1/p′; A = −p′/p. Raios paraxiais no plano meridional; espessura e aberrações omitidas, anel representa abertura.');
const standing = (kind:'standing'|'string',title:string) => lesson(kind,title,'Harmônico da corda',1,4,1,2,'Corda de L = 1 m fixa nas duas pontas; v = 100 m/s. y = 2A sen(nπx/L) cos(2πfₙt), A = 0,02 m, fₙ = nv/(2L). Nós marcados permanecem imóveis; oscilação mostrada em um período, sem simular a força de excitação. '+plane);
export const PHYSICS_SPATIAL_LESSONS: Record<string,PhysicsSpatialLesson> = {
  'summary-fisica-o-movimento-circular': circle,
  'summary-fisica-aceleracao-vetorial': {...circle,kind:'acceleration',title:'Rapidez constante, direção variável',note:'Caso MCU: aceleração tangencial nula e centrípeta v²/R. Não representa todos os movimentos acelerados. '+circle.note},
  'summary-fisica-dinamica-do-movimento-circular': lesson('conical','Pêndulo cônico: tração e peso','Inclinação do fio (graus)',15,60,5,35,'Fio ideal de 2 m, m = 1 kg, g = 10 m/s². R = L sen θ; T cos θ = mg; T sen θ = mv²/R. Só peso e tração são forças reais; resultante radial é sua soma. Demonstração de uma volta.'),
  'summary-fisica-forca-e-seus-tipos': lesson('weight','Peso e normal no mesmo bloco','Massa do bloco (kg)',1,8,1,2,'Superfície horizontal fixa; repouso, sem outras forças verticais. N = mg nesta situação, não em todo contato. Peso e normal atuam no mesmo corpo, portanto não são um par ação–reação. g = 10 m/s².'),
  'summary-fisica-resultante-de-um-sistema-de-forcas': lesson('resultant','Duas forças e sua soma','Ângulo entre as forças (graus)',0,180,15,90,'Duas forças concorrentes de 10 N. Resultante pelo paralelogramo; zero em 180°. Construção vetorial, sem trajetória ou análise de torque. '+plane),
  'summary-fisica-a-forca-de-contato': lesson('contact','Contato: normal e atrito','Força horizontal aplicada (N)',0,30,1,8,'Bloco de 2 kg; g = 10 m/s², μₑ = 0,5 e μc = 0,3. Repouso até F = 10 N; acima, deslizamento com atrito de 6 N. Cada reprodução começa do repouso e percorre 0,5 s. Mudança de parâmetro reinicia a demonstração.'),
  'summary-fisica-sistema-de-corpos-interagindo-e-os-elementos-transmissores-de-forca': lesson('atwood','Atwood: dois corpos, um fio','Massa m₂ (kg)',1,5,.5,3,'m₁ = 2 kg, g = 10 m/s²; fio e polia ideais. a = (m₂−m₁)g/(m₁+m₂), positivo para m₂ descendo; T igual nos dois lados. Movimento a partir do repouso em 0,5 s, sem atingir os limites do suporte.'),
  'summary-fisica-trabalho-e-energia-trabalho-de-uma-forca': lesson('work','Só a componente paralela realiza trabalho','Ângulo força / deslocamento (graus)',0,180,15,60,'F = 10 N, deslocamento prescrito de 2 m. W = Fd cos θ: positivo, nulo ou negativo. O percurso não é uma solução da dinâmica da força resultante; representa o trabalho desta força durante o deslocamento dado. '+plane),
  'summary-fisica-gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas': gas('Gás no cilindro: p, V e T'),
  'summary-fisica-trabalho-da-forca-de-pressao-do-gas': gas('Êmbolo: expansão e trabalho'),
  'summary-fisica-primeira-lei-da-termodinamica': gas('Calor, energia interna e trabalho'),
  'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares': gas('Compare quatro transformações ideais'),
  'summary-fisica-hidrostatica-densidade-e-pressao': lesson('hydro','Pressão depende da profundidade','Profundidade na água (m)',0,4,.5,2,'Água parada, ρ = 1000 kg/m³, g = 10 m/s², p₀ = 100 kPa. p = p₀ + ρgh; pontos no mesmo nível têm a mesma pressão. Setas horizontais opostas indicam a pressão isotrópica, sem escala de intensidade. Não modela empuxo nem escoamento.'),
  'summary-fisica-refracao-fundamentos-leis-e-aplicacoes': lesson('snell','Refração: plano de incidência','Ângulo de incidência (graus)',0,75,5,45,'Ar (n = 1) → vidro (n = 1,5). Ângulos medidos em relação à normal; n₁ sen i = n₂ sen r. Neste sentido não há reflexão total. Raio e normal no mesmo plano; plano da interface tem profundidade espacial.'),
  'summary-fisica-lentes-esfericas-estudo-grafico': lens('Raios notáveis encontram a imagem'),
  'summary-fisica-estudo-analitico-das-lentes-esfericas': lens('Imagem: geometria e equação concordam'),
  'summary-fisica-equacao-do-fabricante-de-lentes-e-associacao-de-lentes': lesson('maker','A mesma lente em outro meio','Índice do meio',1,1.4,.05,1,'Lente fina biconvexa, n = 1,5; R₁ = +20 cm e R₂ = −20 cm na convenção cartesiana adotada. 1/f = (n/nₘ−1)(1/R₁−1/R₂). Meio uniforme; raio paraxial. Recorte nₘ < n: foco finito positivo. Não representa associação de lentes.'),
  'summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas': lesson('echo','Eco: ida e volta até a parede','Distância à parede (m)',20,80,5,40,'Fonte e ouvinte no mesmo ponto, c = 340 m/s. Δt = 2d/c. Marcador representa o percurso do sinal, não uma partícula de ar. Reflexão única; atenuação, reverberação e refração omitidas.'),
  'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas': lesson('reflection','Pulso refletido: extremidade fixa ou livre','Largura ilustrativa do pulso',8,20,2,12,'Comparação de um pulso incidente e seu retorno: extremidade fixa inverte; livre conserva o sinal. Percurso finito com superposição durante a reflexão. Escalas esquemáticas; não calcula transmissão na emenda nem velocidade por tensão/densidade.'),
  'summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento': lesson('interference','Superposição: fase e amplitude resultante','Defasagem (graus)',0,180,15,90,'Duas ondas de mesma amplitude A = 0,02 m, frequência e sentido. Resultante = 2A cos(φ/2) sen(kx−ωt+φ/2). Curvas auxiliares afastadas em profundidade apenas para comparação; soma no plano central. Não representa batimentos de frequências diferentes.'),
  'summary-fisica-um-caso-particular-de-interferencia-onda-estacionaria': standing('standing','Nós imóveis, ventres oscilantes'),
  'summary-fisica-ondas-estacionarias-em-cordas': standing('string','Comprimento da corda seleciona harmônicos'),
  'summary-fisica-ondas-estacionarias-em-tubos': lesson('tube','Tubo: deslocamento do ar e extremidades','Ordem do modo permitido',1,4,1,1,'L = 1 m, c = 340 m/s. Tubo aberto: fₙ = nc/(2L). Fechado à esquerda: fₙ = (2n−1)c/(4L). Curva mostra amplitude de deslocamento longitudinal, afastada transversalmente para leitura; não é a trajetória do ar nem a pressão. Extremidade aberta é ventre de deslocamento e nó de pressão. Correção de extremidade omitida.'),
  'summary-fisica-analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas': lesson('wire','Corrente, campo e força: três direções','Ângulo corrente / campo (graus)',0,180,15,90,'Fio retilíneo de 1 m com i = 2 A, B = 0,5 T uniforme ao longo de +y. F = iL × B, módulo iLB sen θ. Corrente convencional no plano xy; força em z. Setas têm escalas próprias; não modela dois fios, espira ou torque.'),
};

export type GasProcess = 'isotherm'|'isobar'|'isochor'|'adiabat';
export function gasState(process:GasProcess, ratio:number) {
  const v=process==='isochor'?1:ratio;
  const p=process==='isotherm'?100/ratio:process==='adiabat'?100/ratio**(5/3):process==='isochor'?100*ratio:100;
  const temperature=300*p*v/100;
  const deltaU=150*(temperature/300-1);
  const work=process==='isochor'?0:process==='isotherm'?100*Math.log(ratio):process==='adiabat'?-deltaU:100*(ratio-1);
  return {volume:v,pressure:p,temperature,deltaU,work,heat:deltaU+work};
}
export function circularState(speed:number,phase:number) {
  const a=2*Math.PI*phase;
  const position:SpatialPoint=[2*Math.cos(a),0,2*Math.sin(a)];
  const velocity:SpatialPoint=[-speed*Math.sin(a),0,speed*Math.cos(a)];
  const acceleration:SpatialPoint=[-(speed**2)/2*Math.cos(a),0,-(speed**2)/2*Math.sin(a)];
  return {position,velocity,acceleration,period:4*Math.PI/speed};
}
export function conicalState(angle:number,phase:number) {
  const theta=angle*Math.PI/180,radius=2*Math.sin(theta),tension=10/Math.cos(theta),speed=Math.sqrt(10*radius*Math.tan(theta));
  const a=2*Math.PI*phase;
  const position:SpatialPoint=[radius*Math.cos(a),-2*Math.cos(theta),radius*Math.sin(a)];
  return {position,radius,tension,speed,radial:tension*Math.sin(theta)};
}
export function contactState(force:number,phase:number) {
  const sliding=force>10,friction=sliding?6:force,acceleration=(force-friction)/2,time=.5*phase;
  return {sliding,friction,acceleration,displacement:.5*acceleration*time*time};
}
export function atwoodState(mass:number,phase:number) {
  const acceleration=(mass-2)*10/(mass+2),tension=2*(10+acceleration),time=.5*phase;
  return {acceleration,tension,displacement:.5*acceleration*time*time};
}
export function lensState(distance:number,focal=20) {
  const image=focal*distance/(distance-focal),magnification=-image/distance;
  return {image,magnification,height:10*magnification};
}
export function makerFocal(medium:number) { return 10/(1.5/medium-1); }
export function standingDisplacement(x:number,mode:number,phase:number) { return .04*Math.sin(mode*Math.PI*x)*Math.cos(2*Math.PI*phase); }
export function tubeMode(mode:number,closed:boolean) { return {frequency:(closed?2*mode-1:2*mode)*85,waveNumber:(closed?2*mode-1:2*mode)*Math.PI/2}; }
export function wireForce(angle:number):SpatialPoint { return [0,0,Math.sin(angle*Math.PI/180)]; }
