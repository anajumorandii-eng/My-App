// PROTOTYPE engine — Núcleo Instrumental. Throwaway, single-file-adjacent.
'use strict';

// Each subject carries a full palette (not just one accent): primary/secondary
// drive Núcleo + CTA + data-viz; emissive tints the core's center light;
// atmoA/atmoB feed the page-level atmosphere gradient. `rhythm`/`damping`
// multiply the shared spring constants in frame() — this is what makes each
// matéria's motion feel physically different, not just differently colored.
const SUBJECTS = {
  matematica: { label:'Matemática', short:'MAT', geometry:'grid', typo:'mechanical', coreType:'probabilidade',
    rhythm:1.3, damping:1.25,
    palette:{ bg:'#12161A', surface:'#1A2126', primary:'#6E93B3', secondary:'#C9A468', emissive:'#F1EFE9',
      textHighlight:'#D9E4EB', dataPositive:'#7FBF8F', dataWarning:'#D98B4A', atmoA:'#1E2C36', atmoB:'#0B0E11' },
    get accent(){ return this.palette.primary; },
    topic:'Probabilidade e Distribuição', subject:'Matemática', action:'Praticar sem apoio', minutes:30,
    mastery:41, confidence:'média', urgency:'média', recurrence:'baixa', lastAnalysis:'08:02',
    reason:'Erros recorrentes em distribuição binomial nas últimas questões.',
    factors:[{k:'Lacuna de aprendizagem',w:0.30},{k:'Urgência de revisão',w:0.18,dim:true},{k:'Erros recorrentes',w:0.32},{k:'Relevância para a prova',w:0.20}],
    trail:[['Funções do 2º grau','revisar','15 min'],['Sistemas Lineares','reconstruir','45 min'],['Matrizes e Determinantes','revisar','15 min']],
    quiet:[['Progressões','45 min'],['Geometria Analítica','45 min'],['Estatística Descritiva','45 min']] },

  fisica: { label:'Física', short:'FIS', geometry:'field', typo:'vector', coreType:'optica_geometrica',
    rhythm:0.9, damping:0.8,
    palette:{ bg:'#0A0E15', surface:'#121A24', primary:'#4C7FE0', secondary:'#E0B23A', emissive:'#F3F6FF',
      textHighlight:'#CFE0FF', dataPositive:'#6FCF97', dataWarning:'#E0954C', atmoA:'#16264A', atmoB:'#080A0F' },
    get accent(){ return this.palette.primary; },
    topic:'Óptica Geométrica', subject:'Física', action:'Reconstruir a base', minutes:45,
    mastery:15, confidence:'baixa', urgency:'alta', recurrence:'média', lastAnalysis:'13:18',
    reason:'Domínio ainda insuficiente nesse tópico.',
    factors:[{k:'Lacuna de aprendizagem',w:0.41},{k:'Urgência de revisão',w:0.29},{k:'Erros recorrentes',w:0.18},{k:'Relevância para a prova',w:0.12,dim:true}],
    trail:[['Probabilidade e Interpretação de Dados','revisar','15 min'],['Óptica Instrumental e da Visão','reconstruir','45 min'],['Aritmética e Proporcionalidade','revisar','15 min']],
    quiet:[['Eletromagnetismo','45 min'],['Evolução','45 min'],['Eletrostática e Campo Elétrico','45 min']] },

  quimica: { label:'Química', short:'QUI', geometry:'bond', typo:'reactive', coreType:'quimica_rede',
    rhythm:1.2, damping:0.65,
    palette:{ bg:'#0D1714', surface:'#15211D', primary:'#B87545', secondary:'#7C9C74', emissive:'#FBF6EC',
      textHighlight:'#E8D9C8', dataPositive:'#8FBF7F', dataWarning:'#D9773F', atmoA:'#173029', atmoB:'#080D0B' },
    get accent(){ return this.palette.primary; },
    topic:'Equilíbrio Químico', subject:'Química', action:'Revisar para consolidar', minutes:30,
    mastery:48, confidence:'média', urgency:'média', recurrence:'baixa', lastAnalysis:'09:40',
    reason:'Erros recentes em deslocamento de equilíbrio pedem consolidação.',
    factors:[{k:'Lacuna de aprendizagem',w:0.22},{k:'Urgência de revisão',w:0.31},{k:'Erros recorrentes',w:0.30},{k:'Relevância para a prova',w:0.17,dim:true}],
    trail:[['Cinética Química','revisar','20 min'],['Termoquímica','praticar','30 min'],['Soluções','revisar','15 min']],
    quiet:[['Eletroquímica','30 min'],['Química Orgânica I','45 min']] },

  biologia: { label:'Biologia', short:'BIO', geometry:'branch', typo:'organic', coreType:'genetica_helix',
    rhythm:0.65, damping:1.05,
    palette:{ bg:'#0A150F', surface:'#122018', primary:'#54D998', secondary:'#E0876A', emissive:'#F3EFE2',
      textHighlight:'#CDEBD9', dataPositive:'#6FE0A0', dataWarning:'#E0A15F', atmoA:'#0F2E1E', atmoB:'#070C09' },
    get accent(){ return this.palette.primary; },
    topic:'Genética Mendeliana', subject:'Biologia', action:'Revisar para consolidar', minutes:20,
    mastery:71, confidence:'alta', urgency:'baixa', recurrence:'baixa', lastAnalysis:'07:55',
    reason:'Revisão espaçada programada — domínio já alto, só para não esquecer.',
    factors:[{k:'Lacuna de aprendizagem',w:0.10,dim:true},{k:'Urgência de revisão',w:0.46},{k:'Erros recorrentes',w:0.06,dim:true},{k:'Relevância para a prova',w:0.38}],
    trail:[['Biologia Celular','revisar','15 min'],['Divisão Celular','praticar','20 min'],['Ecologia de Populações','revisar','15 min']],
    quiet:[['Fisiologia Animal','30 min'],['Botânica','30 min']] },

  portugues: { label:'Português', short:'POR', geometry:'type', typo:'parsing', coreType:'portugues_concordancia',
    rhythm:1.1, damping:1.1,
    palette:{ bg:'#160B0E', surface:'#231216', primary:'#8A2E3F', secondary:'#C1443D', emissive:'#F4EDE6',
      textHighlight:'#F0D8DA', dataPositive:'#7FBF8F', dataWarning:'#D97A4A', atmoA:'#241A1C', atmoB:'#0C0708' },
    get accent(){ return this.palette.primary; },
    topic:'Concordância Verbal', subject:'Português', action:'Praticar sem apoio', minutes:25,
    mastery:55, confidence:'média', urgency:'média', recurrence:'média', lastAnalysis:'10:10',
    reason:'Erros recorrentes em concordância nas últimas questões.',
    factors:[{k:'Lacuna de aprendizagem',w:0.24},{k:'Urgência de revisão',w:0.22},{k:'Erros recorrentes',w:0.35},{k:'Relevância para a prova',w:0.19,dim:true}],
    trail:[['Regência Verbal e Nominal','revisar','15 min'],['Crase','praticar','20 min']], quiet:[['Pontuação','20 min']] },

  literatura: { label:'Literatura', short:'LIT', geometry:'layer', typo:'contemplative', coreType:'literatura_planos',
    rhythm:0.5, damping:1.35,
    palette:{ bg:'#120810', surface:'#1E1018', primary:'#6E1F30', secondary:'#B5924F', emissive:'#F0E9DD',
      textHighlight:'#E7CFB8', dataPositive:'#7FBF8F', dataWarning:'#C97A4A', atmoA:'#171C26', atmoB:'#08060A' },
    get accent(){ return this.palette.primary; },
    topic:'Memórias Póstumas de Brás Cubas', subject:'Literatura', action:'Reconstruir a base', minutes:35,
    mastery:38, confidence:'baixa', urgency:'média', recurrence:'baixa', lastAnalysis:'11:32',
    reason:'Obra obrigatória com incidência alta na banca priorizada, ainda pouco trabalhada.',
    factors:[{k:'Lacuna de aprendizagem',w:0.38},{k:'Urgência de revisão',w:0.14,dim:true},{k:'Erros recorrentes',w:0.08,dim:true},{k:'Relevância para a prova',w:0.40}],
    trail:[['Dom Casmurro','reconstruir','35 min'],['Quincas Borba','revisar','20 min']], quiet:[['Realismo — contexto histórico','20 min']] },

  redacao: { label:'Redação', short:'RED', geometry:'argument', typo:'structural', coreType:'redacao_arquitetura',
    rhythm:0.85, damping:1.05,
    palette:{ bg:'#150E09', surface:'#221610', primary:'#C9703B', secondary:'#8A3B33', emissive:'#F3ECE1',
      textHighlight:'#F0D9C4', dataPositive:'#7FBF8F', dataWarning:'#D9773F', atmoA:'#1D1815', atmoB:'#0A0706' },
    get accent(){ return this.palette.primary; },
    topic:'Coesão e Argumentação', subject:'Redação', action:'Analisar erros recorrentes', minutes:40,
    mastery:44, confidence:'média', urgency:'alta', recurrence:'média', lastAnalysis:'12:05',
    reason:'As últimas redações perderam pontos por falta de coesão entre parágrafos.',
    factors:[{k:'Lacuna de aprendizagem',w:0.27},{k:'Urgência de revisão',w:0.21},{k:'Erros recorrentes',w:0.37},{k:'Relevância para a prova',w:0.15,dim:true}],
    trail:[['Proposta de Intervenção','praticar','30 min'],['Repertório Sociocultural','revisar','20 min']], quiet:[['Estrutura Dissertativa','20 min']] },

  historia: { label:'História', short:'HIS', geometry:'timeline', typo:'stratified', coreType:'historia_camadas',
    rhythm:0.8, damping:0.55,
    palette:{ bg:'#130F09', surface:'#1F1810', primary:'#9C7A45', secondary:'#A1483A', emissive:'#EAD9A8',
      textHighlight:'#E8D2A8', dataPositive:'#7FBF8F', dataWarning:'#B25A3E', atmoA:'#241A12', atmoB:'#0A0806' },
    get accent(){ return this.palette.primary; },
    topic:'Guerra Fria', subject:'História', action:'Revisar para consolidar', minutes:25,
    mastery:59, confidence:'média', urgency:'baixa', recurrence:'baixa', lastAnalysis:'09:15',
    reason:'Revisão programada antes da prova de humanas.',
    factors:[{k:'Lacuna de aprendizagem',w:0.20,dim:true},{k:'Urgência de revisão',w:0.30},{k:'Erros recorrentes',w:0.10,dim:true},{k:'Relevância para a prova',w:0.40}],
    trail:[['Era Vargas','revisar','20 min']], quiet:[['Ditadura Militar','25 min']] },

  geografia: { label:'Geografia', short:'GEO', geometry:'topo', typo:'cartographic', coreType:'geografia_fluxos',
    rhythm:0.75, damping:1.0,
    palette:{ bg:'#0F130D', surface:'#181F14', primary:'#77804E', secondary:'#B5723F', emissive:'#E9DFC4',
      textHighlight:'#DCE0C4', dataPositive:'#7FBF8F', dataWarning:'#C97A4A', atmoA:'#12262A', atmoB:'#0A0D08' },
    get accent(){ return this.palette.primary; },
    topic:'Geopolítica Contemporânea', subject:'Geografia', action:'Praticar sem apoio', minutes:30,
    mastery:52, confidence:'média', urgency:'média', recurrence:'baixa', lastAnalysis:'08:48',
    reason:'Tema recorrente em atualidades e geopolítica na banca priorizada.',
    factors:[{k:'Lacuna de aprendizagem',w:0.26},{k:'Urgência de revisão',w:0.20,dim:true},{k:'Erros recorrentes',w:0.14,dim:true},{k:'Relevância para a prova',w:0.40}],
    trail:[['Urbanização Brasileira','revisar','20 min']], quiet:[['Matriz Energética','25 min']] },

  atualidades: { label:'Atualidades', short:'ATU', geometry:'pulse', typo:'signal', coreType:'atualidades_campo',
    rhythm:1.45, damping:0.85,
    palette:{ bg:'#101112', surface:'#191B1C', primary:'#D99A3E', secondary:'#C1443D', emissive:'#EFF3F5',
      textHighlight:'#E8DFC8', dataPositive:'#5FBF8A', dataWarning:'#C1443D', atmoA:'#241E14', atmoB:'#0A0A0A' },
    get accent(){ return this.palette.primary; },
    topic:'Conjuntura Internacional', subject:'Atualidades', action:'Analisar erros recorrentes', minutes:20,
    mastery:33, confidence:'baixa', urgency:'alta', recurrence:'alta', lastAnalysis:'13:40',
    reason:'Tópico de alta rotatividade — sinais chegando continuamente.',
    factors:[{k:'Lacuna de aprendizagem',w:0.30},{k:'Urgência de revisão',w:0.33},{k:'Erros recorrentes',w:0.25},{k:'Relevância para a prova',w:0.12,dim:true}],
    trail:[['Blocos Econômicos','revisar','15 min']], quiet:[['Organismos Internacionais','15 min']] },
};

const SUBJECT_ORDER = ['matematica','fisica','quimica','biologia','portugues','literatura','redacao','historia','geografia','atualidades'];

const STATE_LABEL = { idle:'repouso', listening:'recebendo sinais', analyzing:'analisando', converging:'convergindo', ready:'pronto', recalibrating:'recalibrando' };
const STATE_PARAMS = {
  idle:          { spin:0.05, spread:0.34, glow:0.30, tiltX:9,   tiltY:-13, scan:false },
  listening:     { spin:0.10, spread:0.50, glow:0.45, tiltX:11,  tiltY:9,   scan:false },
  analyzing:     { spin:0.30, spread:0.88, glow:0.62, tiltX:-7,  tiltY:22,  scan:true  },
  converging:    { spin:0.55, spread:0.16, glow:0.92, tiltX:4,   tiltY:-9,  scan:false },
  ready:         { spin:0.06, spread:0.32, glow:0.55, tiltX:6,   tiltY:-16, scan:false },
  recalibrating: { spin:0.42, spread:1.10, glow:0.70, tiltX:-11, tiltY:15,  scan:false },
};
// How "resolved" the internal artifact is — every core renderer uses this
// 0..1 scalar to decide scattered/forming (low) vs settled/legible (high).
const STATE_FOCUS_TARGET = { idle:0.65, listening:0.22, analyzing:0.12, converging:0.90, ready:1.0, recalibrating:0.05 };

/* =========================================================================
 * 2. GLOBAL RUNTIME STATE
 * ========================================================================= */
const runtime = {
  theme:'dark', subjectKey:'fisica', state:'ready', reducedMotion:false,
  coreSeed: Math.random()*100,
};

/* =========================================================================
 * 3. SPRING PHYSICS — semi-implicit Euler damped oscillator.
 * ========================================================================= */
function makeSpring(initial) { return { v:0, x:initial }; }
function stepSpring(s, target, dt, k=70, d=13) {
  const accel = -k * (s.x - target) - d * s.v;
  s.v += accel * dt;
  s.x += s.v * dt;
  return s.x;
}
function hexToRgb(hex) { const v = parseInt(hex.replace('#',''), 16); return [(v>>16)&255, (v>>8)&255, v&255]; }
function rgba(rgb, a) { return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`; }

/* =========================================================================
 * 4. CANVAS SETUP
 * ========================================================================= */
const canvas = document.getElementById('coreCanvas');
const ctx = canvas.getContext('2d');
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let cw = 0, ch = 0;

const core = {
  spin: makeSpring(0.05), spread: makeSpring(0.32), glow: makeSpring(0.5),
  tiltX: makeSpring(6), tiltY: makeSpring(-16), focus: makeSpring(0.7),
  angle: 0, scanAngle: 0,
};

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  cw = rect.width; ch = rect.height;
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
}
new ResizeObserver(resizeCanvas).observe(canvas.parentElement);

/* =========================================================================
 * 4.5 CAMPO AMBIENTE — background field, one per matéria (keyed by
 *    subj.geometry). This is the piece that makes the *whole interface*
 *    feel like it belongs to that área do conhecimento — not just the
 *    Núcleo. Full-bleed, low-opacity, z1 (strictly behind Núcleo/text/nav).
 *    Every renderer reacts to `focus` so it breathes with the same physical
 *    process as the core: scattered while forming, settled once resolved.
 * ========================================================================= */
const fieldCanvas = document.getElementById('fieldCanvas');
const fctx = fieldCanvas.getContext('2d');
let fdpr = Math.min(window.devicePixelRatio || 1, 2);
let fw = 0, fh = 0;
function resizeFieldCanvas() {
  const r = fieldCanvas.getBoundingClientRect();
  fw = r.width; fh = r.height;
  fieldCanvas.width = Math.round(fw * fdpr);
  fieldCanvas.height = Math.round(fh * fdpr);
}
window.addEventListener('resize', resizeFieldCanvas);
resizeFieldCanvas();

function drawFieldGrid(t, rgb, focus) { // Matemática — perspective grid, vanishing point, mechanical
  const vpX = fw*0.76, vpY = fh*0.06;
  fctx.strokeStyle = rgba(rgb, 0.05+0.025*focus); fctx.lineWidth = 1;
  const cols = 16;
  for (let i=0;i<=cols;i++){
    const x = (i/cols)*fw*1.1 - fw*0.05;
    fctx.beginPath(); fctx.moveTo(x, fh*1.05); fctx.lineTo(vpX+(x-vpX)*0.1, vpY); fctx.stroke();
  }
  const rows = 9;
  for (let j=0;j<=rows;j++){
    const p = j/rows, y = fh - p*p*fh*0.98;
    fctx.beginPath();
    for (let i=0;i<=cols;i++){
      const x = (i/cols)*fw*1.1 - fw*0.05;
      const yy = y + (vpY-y)*Math.min(1, p*0.4);
      i===0 ? fctx.moveTo(x,yy) : fctx.lineTo(x,yy);
    }
    fctx.stroke();
  }
  const travel = (Math.sin(t*0.18)*0.5+0.5);
  const mx = vpX+(fw*0.2-vpX)*travel, my = vpY+(fh*0.9-vpY)*travel;
  fctx.fillStyle = rgba(rgb, 0.14); fctx.beginPath(); fctx.arc(mx,my,2.2,0,7); fctx.fill();
}

function drawFieldVectors(t, rgb, focus) { // Física — vector field of drifting arrows + energy lines
  const cols=9, rows=6;
  for (let i=0;i<cols;i++) for (let j=0;j<rows;j++){
    const x=(i+0.5)/cols*fw, y=(j+0.5)/rows*fh;
    const ang = Math.sin(x*0.006+t*0.25)+Math.cos(y*0.007+t*0.2);
    const len = 13+4*Math.sin(i*1.3+j*0.7+t*0.4);
    fctx.save(); fctx.translate(x,y); fctx.rotate(ang);
    fctx.strokeStyle = rgba(rgb, 0.045+0.03*focus); fctx.lineWidth=1;
    fctx.beginPath(); fctx.moveTo(-len,0); fctx.lineTo(len,0); fctx.lineTo(len-5,-4); fctx.moveTo(len,0); fctx.lineTo(len-5,4); fctx.stroke();
    fctx.restore();
  }
  for (let k=0;k<3;k++){
    const py = fh*(0.2+k*0.3) + Math.sin(t*0.3+k)*fh*0.05;
    fctx.strokeStyle = rgba(rgb, 0.06); fctx.lineWidth=1.2;
    fctx.beginPath();
    for (let i=0;i<=20;i++){ const x=i/20*fw; const y=py+Math.sin(i*0.6+t*0.5+k*2)*22; i===0?fctx.moveTo(x,y):fctx.lineTo(x,y); }
    fctx.stroke();
  }
}

function drawFieldChamber(t, rgb, focus) { // Química — floating molecules in a reactive chamber
  const n=14;
  for (let i=0;i<n;i++){
    const seed=i*13.7;
    const x = ((Math.sin(seed)*0.5+0.5)*1.2-0.1)*fw + Math.sin(t*0.4+seed)*10;
    const y = ((Math.cos(seed*1.3)*0.5+0.5)*1.2-0.1)*fh + Math.cos(t*0.35+seed)*10;
    const r = 5+((i*7)%5);
    const jitter = (1-focus)*3*Math.sin(t*1.2+seed);
    fctx.fillStyle = rgba(rgb, 0.055);
    fctx.beginPath(); fctx.arc(x+jitter,y,r,0,7); fctx.fill();
    fctx.beginPath(); fctx.arc(x+r*1.6+jitter,y+r*0.3,r*0.7,0,7); fctx.fill();
    fctx.strokeStyle = rgba(rgb, 0.09); fctx.lineWidth=1;
    fctx.beginPath(); fctx.moveTo(x+jitter,y); fctx.lineTo(x+r*1.6+jitter,y+r*0.3); fctx.stroke();
  }
  const vg = fctx.createRadialGradient(fw*0.5,fh*0.5,0,fw*0.5,fh*0.5,Math.max(fw,fh)*0.7);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1, rgba(rgb,0.05));
  fctx.fillStyle=vg; fctx.fillRect(0,0,fw,fh);
}

function branchRec(x,y,ang,len,depth,t,rgb,seed) {
  if (depth<=0 || len<3) return;
  const x2=x+Math.cos(ang)*len, y2=y+Math.sin(ang)*len;
  fctx.strokeStyle = rgba(rgb, 0.05+0.02*depth); fctx.lineWidth = depth*0.6;
  fctx.beginPath(); fctx.moveTo(x,y); fctx.lineTo(x2,y2); fctx.stroke();
  const wobble = Math.sin(t*0.6+seed)*0.25;
  branchRec(x2,y2, ang-0.45+wobble, len*0.72, depth-1, t, rgb, seed*1.3+1);
  branchRec(x2,y2, ang+0.45+wobble, len*0.72, depth-1, t, rgb, seed*1.7+2);
}
function drawFieldOrganic(t, rgb, focus) { // Biologia — branching, breathing organic network
  const roots = [[fw*0.08, fh*1.02, -1.25], [fw*0.95, fh*1.05, -1.95], [fw*0.5, -fh*0.05, 1.6]];
  roots.forEach(([x,y,ang], i) => branchRec(x,y,ang, 90+focus*20, 5, t, rgb, i*7.3));
}

function drawFieldType(t, rgb, focus) { // Português — ruled baseline grid + segmentation brackets
  const rows = 12;
  fctx.strokeStyle = rgba(rgb, 0.05); fctx.lineWidth = 1;
  for (let j=0;j<rows;j++){
    const y = (j+0.5)/rows*fh;
    fctx.beginPath(); fctx.moveTo(0,y); fctx.lineTo(fw,y); fctx.stroke();
  }
  const n=7;
  for (let i=0;i<n;i++){
    const seed=i*5.1;
    const x = ((i+0.5)/n)*fw + Math.sin(t*0.3+seed)*14;
    const y = fh*(0.15+0.7*((Math.sin(seed*2)*0.5+0.5)));
    const w = 22+10*focus;
    fctx.strokeStyle = rgba(rgb, 0.1); fctx.lineWidth=1.4;
    fctx.beginPath(); fctx.moveTo(x-w,y-8); fctx.lineTo(x-w,y+8); fctx.moveTo(x-w,y); fctx.lineTo(x-w+5,y); fctx.stroke();
    fctx.beginPath(); fctx.moveTo(x+w,y-8); fctx.lineTo(x+w,y+8); fctx.moveTo(x+w,y); fctx.lineTo(x+w-5,y); fctx.stroke();
  }
}

function drawFieldLayers(t, rgb, focus) { // Literatura — slow drifting editorial planes, contemplative
  const n=4;
  for (let i=0;i<n;i++){
    const speed = 0.05+i*0.02;
    const y = fh*(0.15+i*0.22);
    const drift = Math.sin(t*speed+i*2)*fw*0.08;
    const grad = fctx.createLinearGradient(0,y-fh*0.09,0,y+fh*0.09);
    grad.addColorStop(0,'rgba(0,0,0,0)'); grad.addColorStop(0.5, rgba(rgb, 0.045+0.01*i)); grad.addColorStop(1,'rgba(0,0,0,0)');
    fctx.fillStyle = grad;
    fctx.fillRect(drift-fw*0.15, y-fh*0.09, fw*1.3, fh*0.18);
  }
}

function drawFieldTruss(t, rgb, focus) { // Redação — architectural scaffold/truss, structural
  const cols = 8, w = fw/cols;
  fctx.strokeStyle = rgba(rgb, 0.055+0.02*focus); fctx.lineWidth = 1;
  for (let i=0;i<=cols;i++){
    const x = i*w;
    fctx.beginPath(); fctx.moveTo(x,0); fctx.lineTo(x,fh); fctx.stroke();
  }
  for (let i=0;i<cols;i++){
    const x1=i*w, x2=(i+1)*w;
    fctx.beginPath();
    if (i%2===0){ fctx.moveTo(x1,0); fctx.lineTo(x2,fh); } else { fctx.moveTo(x2,0); fctx.lineTo(x1,fh); }
    fctx.stroke();
  }
}

function drawFieldBipolar(t, rgb, focus) { // História — two opposing fields in unstable equilibrium
  const rgb2 = [123,150,168]; // fixed cool counter-tone: the "other side"
  const tension = (1-focus)*fh*0.09;
  const g1 = fctx.createLinearGradient(0,0,fw*0.6,0);
  g1.addColorStop(0, rgba(rgb,0.09)); g1.addColorStop(1,'rgba(0,0,0,0)');
  fctx.fillStyle=g1; fctx.fillRect(0,0,fw*0.62,fh);
  const g2 = fctx.createLinearGradient(fw,0,fw*0.4,0);
  g2.addColorStop(0, rgba(rgb2,0.09)); g2.addColorStop(1,'rgba(0,0,0,0)');
  fctx.fillStyle=g2; fctx.fillRect(fw*0.38,0,fw*0.62,fh);
  fctx.strokeStyle = rgba([200,200,200], 0.09); fctx.lineWidth=1.4;
  fctx.beginPath();
  for (let i=0;i<=30;i++){
    const py=i/30*fh;
    const x = fw*0.5 + Math.sin(py*0.02+t*0.4)*tension;
    i===0?fctx.moveTo(x,py):fctx.lineTo(x,py);
  }
  fctx.stroke();
}

function drawFieldTopo(t, rgb, focus) { // Geografia — topographic contours + coordinate ticks
  for (let ring=0; ring<7; ring++){
    const rr = 40+ring*46;
    fctx.beginPath();
    for (let i=0;i<=48;i++){
      const a=(i/48)*Math.PI*2;
      const wob = 1+0.08*Math.sin(a*5+ring*1.3+t*0.15);
      const x = fw*0.5+Math.cos(a)*rr*wob*1.3, y=fh*0.55+Math.sin(a)*rr*wob*0.62;
      i===0?fctx.moveTo(x,y):fctx.lineTo(x,y);
    }
    fctx.closePath();
    fctx.strokeStyle = rgba(rgb, 0.045+0.008*ring); fctx.lineWidth=1; fctx.stroke();
  }
  fctx.strokeStyle = rgba(rgb,0.08); fctx.lineWidth=1;
  for (let i=0;i<12;i++){ const x=(i/12)*fw; fctx.beginPath(); fctx.moveTo(x,0); fctx.lineTo(x,10); fctx.moveTo(x,fh-10); fctx.lineTo(x,fh); fctx.stroke(); }
}

function drawFieldPulse(t, rgb, focus) { // Atualidades — propagating ripples, global signal
  const origins = [[fw*0.2,fh*0.3],[fw*0.75,fh*0.6],[fw*0.5,fh*0.15]];
  origins.forEach(([ox,oy], i) => {
    const speed = 55+i*10;
    for (let k=0;k<3;k++){
      const age = ((t*speed + i*90 + k*140) % 420);
      const r = age;
      const alpha = Math.max(0, 0.12*(1-age/420));
      fctx.strokeStyle = rgba(rgb, alpha); fctx.lineWidth=1.2;
      fctx.beginPath(); fctx.arc(ox,oy,r,0,7); fctx.stroke();
    }
  });
}

const FIELD_REGISTRY = {
  grid: drawFieldGrid, field: drawFieldVectors, bond: drawFieldChamber, branch: drawFieldOrganic,
  type: drawFieldType, layer: drawFieldLayers, argument: drawFieldTruss, timeline: drawFieldBipolar,
  topo: drawFieldTopo, pulse: drawFieldPulse,
};
let fieldFrozenT = 0;
function renderField(t) {
  fctx.save(); fctx.scale(fdpr, fdpr);
  fctx.clearRect(0,0,fw,fh);
  const subj = SUBJECTS[runtime.subjectKey];
  const fn = FIELD_REGISTRY[subj.geometry] || FIELD_REGISTRY.grid;
  const rgb = hexToRgb((currentPalette || subj.palette).primary);
  const useT = runtime.reducedMotion ? fieldFrozenT : t;
  fn(useT, rgb, whyOpen ? 0.3 : core.focus.x);
  fctx.restore();
}

/* Generic orbiting "signal" particles — only used by the default/fallback
   network core (subjects without a bespoke semantic core yet). */
let particles = [];
function seedParticles() {
  particles = [];
  for (let i = 0; i < 5; i++) {
    particles.push({ angle:(i/5)*Math.PI*2+Math.random()*0.3, angleSpeedMul:0.7+Math.random()*0.6,
      radius:makeSpring(1.0), size:3+Math.random()*2, phase:Math.random()*Math.PI*2 });
  }
}
seedParticles();

function drawSignal(x, y, r, angleRad, geometry, rgb) {
  const [R,G,B] = rgb;
  ctx.save(); ctx.translate(x, y); ctx.rotate(angleRad);
  ctx.fillStyle = `rgba(${R},${G},${B},0.9)`; ctx.strokeStyle = `rgba(${R},${G},${B},0.9)`; ctx.lineWidth = 1.4;
  switch (geometry) {
    case 'grid': ctx.strokeRect(-r*0.6,-r*0.6,r*1.2,r*1.2); ctx.beginPath(); ctx.moveTo(0,-r*1.1); ctx.lineTo(0,r*1.1); ctx.stroke(); break;
    case 'field': ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(r,0); ctx.lineTo(r*0.45,-r*0.5); ctx.moveTo(r,0); ctx.lineTo(r*0.45,r*0.5); ctx.stroke(); break;
    case 'bond': ctx.beginPath(); ctx.arc(-r*0.6,0,r*0.42,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(r*0.6,0,r*0.42,0,7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-r*0.2,0); ctx.lineTo(r*0.2,0); ctx.stroke(); break;
    case 'branch': ctx.beginPath(); ctx.moveTo(0,r); ctx.quadraticCurveTo(0,0,-r*0.8,-r*0.7); ctx.moveTo(0,0); ctx.quadraticCurveTo(0,-r*0.2,r*0.8,-r*0.7); ctx.stroke(); ctx.beginPath(); ctx.arc(0,r,r*0.28,0,7); ctx.fill(); break;
    case 'type': ctx.font = `${Math.round(r*1.6)}px "JetBrains Mono", monospace`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('a', 0, 0); break;
    case 'layer': for (let i=0;i<3;i++){ ctx.strokeRect(-r*0.8,-r*0.6+i*r*0.35,r*1.6,r*0.5); } break;
    case 'argument': ctx.beginPath(); ctx.arc(0,0,r*0.4,0,7); ctx.fill(); ctx.beginPath(); ctx.moveTo(-r,-r*0.6); ctx.lineTo(0,0); ctx.lineTo(-r,r*0.6); ctx.stroke(); break;
    case 'timeline': ctx.fillRect(-r,-r*0.18,r*2,r*0.36); ctx.beginPath(); ctx.moveTo(0,-r*0.5); ctx.lineTo(0,r*0.5); ctx.stroke(); break;
    case 'topo': for (let i=0;i<3;i++){ ctx.beginPath(); ctx.arc(0,0,r*(0.4+i*0.3),0.3,2.6); ctx.stroke(); } break;
    case 'pulse': for (let i=0;i<2;i++){ ctx.beginPath(); ctx.arc(0,0,r*(0.5+i*0.5),0,7); ctx.globalAlpha=1-i*0.5; ctx.stroke(); } ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(0,0,r*0.3,0,7); ctx.fill(); break;
    default: ctx.beginPath(); ctx.arc(0,0,r*0.5,0,7); ctx.fill();
  }
  ctx.restore();
}

/* =========================================================================
 * 5. NÚCLEO SYSTEM — two layers per the visual-direction brief:
 *    (a) external shell: shared Crivo identity (containment rings, central
 *        light point, small metallic mount) — drawExternalShell/drawCenterLight.
 *    (b) internal artifact: the subject/topic-specific object. Every
 *        renderer takes the same `g` context and reacts to `g.focus`
 *        (0 = scattered/forming, 1 = resolved/legible) — that single
 *        parameter is what makes idle/listening/analyzing/converging/ready/
 *        recalibrating all read as one coherent physical process instead of
 *        a hard cut between poses.
 * ========================================================================= */
function drawExternalShell(g) {
  const { cx, cy, baseR, spread, glow, rgb, squashY, skewX } = g;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR*(1.6+spread*0.6));
  grad.addColorStop(0, rgba(rgb, 0.20*glow));
  grad.addColorStop(1, rgba(rgb, 0));
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(cx, cy, baseR*(1.7+spread*0.6), 0, 7); ctx.fill();

  for (let i=0;i<3;i++){
    const ringR = baseR*(0.95+i*0.34)*(1+spread*0.45);
    ctx.save(); ctx.translate(cx,cy); ctx.transform(1,0,skewX*0.5,squashY,0,0);
    ctx.beginPath(); ctx.ellipse(0,0,ringR,ringR*0.4,0,0,Math.PI*2);
    ctx.strokeStyle = i===1 ? rgba(rgb,0.5) : 'rgba(210,225,218,0.13)';
    ctx.lineWidth = i===1 ? 1.3 : 0.9;
    ctx.stroke(); ctx.restore();
  }

  // metallic mount — the fixed "brand" piece every core is set into.
  ctx.save(); ctx.translate(cx,cy); ctx.transform(1,0,skewX*0.3,squashY,0,0);
  const mr = baseR*0.13;
  ctx.beginPath();
  for (let i=0;i<6;i++){ const a=i/6*Math.PI*2; const px=Math.cos(a)*mr, py=Math.sin(a)*mr; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py); }
  ctx.closePath();
  const mgrad = ctx.createLinearGradient(-mr,-mr,mr,mr);
  mgrad.addColorStop(0,'rgba(232,224,206,0.85)'); mgrad.addColorStop(1, rgba(rgb,0.45));
  ctx.fillStyle=mgrad; ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.45)'; ctx.lineWidth=0.8; ctx.stroke();
  ctx.restore();
}

function drawCenterLight(g) {
  const { cx, cy, baseR, glow, rgb, emissive } = g;
  const r = baseR*0.045*(0.7+glow*0.6);
  const em = rgba(emissive, 0.95);
  const lg = ctx.createRadialGradient(cx,cy,0,cx,cy,r*3.2);
  lg.addColorStop(0, em);
  lg.addColorStop(1, rgba(rgb,0));
  ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(cx,cy,r*3.2,0,7); ctx.fill();
  ctx.fillStyle = em; ctx.beginPath(); ctx.arc(cx,cy,r,0,7); ctx.fill();
}

function localFrame(g, fn) {
  ctx.save(); ctx.translate(g.cx, g.cy); ctx.transform(1,0,g.skewX*0.3,g.squashY,0,0);
  fn(); ctx.restore();
}

// --- 1. Óptica Geométrica: lenses, prism, refracting rays, focal point ---
function drawOptica(g) {
  const { baseR, focus, t, rgb, seed } = g;
  const scatter = 1-focus;
  localFrame(g, () => {
    const lensW = baseR*0.30, lensH = baseR*0.58;
    ctx.save(); ctx.rotate(scatter*0.35*Math.sin(t*0.7+seed));
    const lg = ctx.createLinearGradient(-lensW,-lensH,lensW,lensH);
    lg.addColorStop(0,'rgba(230,240,255,0.42)'); lg.addColorStop(0.5, rgba(rgb,0.22)); lg.addColorStop(1,'rgba(200,220,255,0.14)');
    ctx.fillStyle=lg; ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(0,0,lensW,lensH,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.restore();

    ctx.save(); ctx.translate(-baseR*0.5, baseR*0.05); ctx.rotate(-0.25+scatter*0.3);
    ctx.beginPath(); ctx.moveTo(0,-baseR*0.2); ctx.lineTo(baseR*0.18,baseR*0.12); ctx.lineTo(-baseR*0.18,baseR*0.12); ctx.closePath();
    ctx.fillStyle = rgba(rgb,0.28); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=0.8; ctx.stroke();
    ctx.restore();

    const focalX = baseR*0.72, focalY = 0;
    const nRays = 5;
    for (let i=0;i<nRays;i++){
      const spreadAngle = -0.8+i*(1.6/(nRays-1));
      const jitter = scatter*0.55*Math.sin(i*2.1+t*0.8+seed);
      const ang = spreadAngle+jitter;
      const startR = baseR*1.55;
      const sx = -Math.cos(ang)*startR, sy = Math.sin(ang)*startR*0.5;
      const hitX = -lensW*0.75, hitY = sy*0.35;
      const fy = focalY + scatter*Math.sin(i-t*0.5+seed)*baseR*0.32;
      [[255,90,90],[255,255,255],[110,170,255]].forEach((c,ci)=>{
        const off = (ci-1)*scatter*4;
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.5)`; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(sx,sy+off); ctx.lineTo(hitX,hitY+off); ctx.lineTo(focalX,fy+off); ctx.stroke();
      });
    }
    const fr = baseR*(0.07+focus*0.2);
    const fg = ctx.createRadialGradient(focalX,focalY,0,focalX,focalY,fr*2.4);
    fg.addColorStop(0, `rgba(255,238,205,${0.9*focus+0.1})`); fg.addColorStop(1,'rgba(255,238,205,0)');
    ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(focalX,focalY,fr*2.4,0,7); ctx.fill();
    ctx.fillStyle=`rgba(255,245,220,${0.6+0.4*focus})`; ctx.beginPath(); ctx.arc(focalX,focalY,fr*0.5+1,0,7); ctx.fill();
  });
}

// --- 2. Probabilidade: particles scattering into a distribution curve ---
function bellY(x, baseR) { return -Math.exp(-(x*x)/(2*0.16))*baseR*0.65; }
function drawProbabilidade(g) {
  const { baseR, focus, t, rgb, seed } = g;
  localFrame(g, () => {
    ctx.strokeStyle='rgba(210,225,218,0.25)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-baseR*0.9,baseR*0.3); ctx.lineTo(baseR*0.9,baseR*0.3); ctx.stroke();
    ctx.beginPath();
    for (let i=0;i<=40;i++){
      const x=-0.9+i*(1.8/40), y=bellY(x,baseR)*focus+baseR*0.3;
      i===0?ctx.moveTo(x*baseR,y):ctx.lineTo(x*baseR,y);
    }
    ctx.strokeStyle = rgba(rgb, 0.4+0.35*focus); ctx.lineWidth=1.3; ctx.stroke();
    const n=16;
    for (let i=0;i<n;i++){
      const xn=-0.85+(i/(n-1))*1.7;
      const targetX=xn*baseR, targetY=bellY(xn,baseR)+baseR*0.3;
      const scatterX=Math.sin(i*12.9+seed)*baseR*0.85, scatterY=Math.cos(i*7.3+seed+t*0.3)*baseR*0.5;
      const px=targetX*focus+scatterX*(1-focus), py=targetY*focus+scatterY*(1-focus);
      ctx.fillStyle = rgba(rgb, 0.85);
      ctx.beginPath(); ctx.arc(px,py,baseR*0.035,0,7); ctx.fill();
    }
  });
}

// --- 3. Genética: double helix, unzips when unresolved ---
function drawGenetica(g) {
  const { baseR, focus, t, rgb, seed } = g;
  localFrame(g, () => {
    const h=baseR*1.25, turns=2.5, n=28, gapBoost=(1-focus)*baseR*0.3;
    const A=[], B=[];
    for (let i=0;i<=n;i++){
      const yy=-h/2+(i/n)*h;
      const phase=(i/n)*turns*Math.PI*2 + t*0.6*(1-focus*0.7);
      const rx=baseR*0.26;
      A.push([Math.sin(phase)*rx - gapBoost*Math.sign(Math.sin(phase)||1)*0.5, yy]);
      B.push([Math.sin(phase+Math.PI)*rx + gapBoost*Math.sign(Math.sin(phase+Math.PI)||1)*0.5, yy]);
    }
    ctx.strokeStyle = rgba(rgb, 0.3+0.45*focus); ctx.lineWidth=1;
    for (let i=0;i<A.length;i+=2){ ctx.beginPath(); ctx.moveTo(A[i][0],A[i][1]); ctx.lineTo(B[i][0],B[i][1]); ctx.stroke(); }
    [A,B].forEach((s,si)=>{
      ctx.beginPath(); s.forEach(([x,y],i)=> i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
      ctx.strokeStyle = si===0? rgba(rgb,0.85) : 'rgba(210,225,218,0.55)'; ctx.lineWidth=1.6; ctx.stroke();
    });
  });
}

// --- 4. Literatura: a FRAGMENTING OPEN BOOK — pages fan from a bound spine
// (the unmistakable anchor: this is a book), justified manuscript text on
// every page, and the two outermost pages tear loose with a ragged edge —
// the narrative literally breaking apart, not just cards fanning. ---
function drawLiteratura(g) {
  const { baseR, focus, seed, t, rgb, rgb2 } = g;
  localFrame(g, () => {
    const hingeY = baseR*0.42;
    const n=5, pageW=baseR*0.58, pageH=baseR*0.86;
    for (let i=0;i<n;i++){
      const p = i-(n-1)/2; // -2..2, 0 = center page
      const restAngle = p*0.30; // resting open-book fan
      const scatterAngle = p*0.55 + Math.sin(seed+i*1.9+t*0.4)*0.55;
      const ang = restAngle*focus + scatterAngle*(1-focus);
      const drift = (1-focus)*baseR*0.16*Math.sin(i*2.1+seed);
      ctx.save();
      ctx.translate(0, hingeY); ctx.rotate(ang); ctx.translate(0, -pageH*0.52-drift);

      ctx.fillStyle='rgba(0,0,0,0.22)';
      ctx.beginPath(); ctx.ellipse(3, pageH*0.5+5, pageW*0.4, 5, 0,0,7); ctx.fill();

      const grad = ctx.createLinearGradient(-pageW/2,0,pageW/2,0);
      grad.addColorStop(0, rgba(rgb, 0.30-0.03*Math.abs(p))); grad.addColorStop(1, rgba(rgb2, 0.13));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-pageW/2,-pageH/2); ctx.lineTo(pageW/2,-pageH/2);
      const torn = Math.abs(p)===2; // the two outermost pages tear loose
      if (torn) {
        const steps=7;
        for (let s=1;s<=steps;s++){
          const yy=-pageH/2+(pageH*s/steps);
          const jag = Math.sin(s*3.3+seed+i)*pageW*0.06*(1-focus);
          ctx.lineTo(pageW/2+jag, yy);
        }
      } else { ctx.lineTo(pageW/2,pageH/2); }
      ctx.lineTo(-pageW/2,pageH/2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(210,225,218,0.28)'; ctx.lineWidth=0.9; ctx.stroke();

      // justified manuscript text — dense enough to read unmistakably as a written page
      ctx.strokeStyle='rgba(210,225,218,0.22)'; ctx.lineWidth=1.1;
      for (let li=0; li<8; li++){
        const ly=-pageH/2+pageH*0.11+li*pageH*0.098;
        const lw=pageW*(0.60+0.26*Math.sin(li*2.4+seed+i));
        ctx.beginPath(); ctx.moveTo(-pageW/2+pageW*0.14, ly); ctx.lineTo(-pageW/2+pageW*0.14+lw, ly); ctx.stroke();
      }
      ctx.strokeStyle = rgba(rgb2, 0.3); ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(-pageW/2+4,-pageH/2+3); ctx.lineTo(pageW/2-4,-pageH/2+3); ctx.stroke();
      ctx.restore();
    }
    // bound spine — small stitching marks at the hinge; the one thing that
    // never fragments, so the object still reads as "a book" at any focus.
    ctx.strokeStyle = rgba(rgb,0.7); ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(0,hingeY-baseR*0.05); ctx.lineTo(0,hingeY+baseR*0.05); ctx.stroke();
    for (let s=-2;s<=2;s++){
      ctx.fillStyle=rgba(rgb,0.55);
      ctx.beginPath(); ctx.arc(0, hingeY+s*baseR*0.022, 1.4, 0, 7); ctx.fill();
    }
  });
}

// --- 5. Redação: a thesis COLUMN carrying argument EVIDENCE-CARDS — the
// column has a manuscript-ruler texture (this is writing, not a girder) and
// each strut ends in a small note-card with greeked text, not a plain dot.
// Struts carry visible weight under real light; the base locks like a
// keystone once the conclusion closes the system. ---
function drawRedacao(g) {
  const { baseR, focus, t, rgb, rgb2, seed } = g;
  localFrame(g, () => {
    ctx.fillStyle='rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(0, baseR*0.66, baseR*0.5, baseR*0.09, 0,0,7); ctx.fill();

    function beam(x1,y1,x2,y2,width,color,alpha=1){
      const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy)||1, nx=-dy/len, ny=dx/len;
      ctx.save(); ctx.globalAlpha=alpha;
      const grad = ctx.createLinearGradient(x1-nx*width/2,y1-ny*width/2,x1+nx*width/2,y1+ny*width/2);
      grad.addColorStop(0, rgba(color,0.9)); grad.addColorStop(0.5, rgba(color,0.5)); grad.addColorStop(1, rgba(color,0.22));
      ctx.fillStyle=grad;
      ctx.beginPath();
      ctx.moveTo(x1-nx*width/2,y1-ny*width/2); ctx.lineTo(x2-nx*width*0.3,y2-ny*width*0.3);
      ctx.lineTo(x2+nx*width*0.3,y2+ny*width*0.3); ctx.lineTo(x1+nx*width/2,y1+ny*width/2);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.28)'; ctx.lineWidth=0.8;
      ctx.beginPath(); ctx.moveTo(x1-nx*width/2,y1-ny*width/2); ctx.lineTo(x2-nx*width*0.3,y2-ny*width*0.3); ctx.stroke();
      ctx.restore();
    }

    beam(0,-baseR*0.72, 0,baseR*0.58, baseR*0.085, rgb);
    // manuscript-column ticks running up the spine — the cue that this is
    // TEXT under construction, not a generic girder.
    ctx.strokeStyle='rgba(0,0,0,0.32)'; ctx.lineWidth=1;
    for (let r=0;r<9;r++){
      const yy=-baseR*0.6+r*(baseR*1.12/9);
      ctx.beginPath(); ctx.moveTo(-baseR*0.022,yy); ctx.lineTo(baseR*0.022,yy); ctx.stroke();
    }
    const kg = ctx.createRadialGradient(0,-baseR*0.72,0,0,-baseR*0.72,baseR*0.1);
    kg.addColorStop(0,'rgba(255,245,225,0.95)'); kg.addColorStop(1, rgba(rgb,0.15));
    ctx.fillStyle=kg; ctx.beginPath(); ctx.arc(0,-baseR*0.72,baseR*0.075,0,7); ctx.fill();

    const struts=4;
    for (let i=0;i<struts;i++){
      const yy=-baseR*0.36+i*(baseR*0.8/(struts-1));
      const side=i%2===0?1:-1;
      const disc=(1-focus)*baseR*0.4;
      const nodeX=side*(baseR*0.48+disc*Math.sin(i+seed+t*0.5));
      const nodeY=yy+(1-focus)*Math.cos(i*2+seed)*baseR*0.15;
      const col = i%2===0?rgb:rgb2;
      beam(0,yy,nodeX,nodeY, baseR*0.04, col, 0.35+0.55*focus);
      // evidence card — a small note-card with greeked text, not a plain dot
      ctx.save(); ctx.translate(nodeX,nodeY); ctx.rotate(side*0.12*(1-focus));
      const cw=baseR*0.17, ch=baseR*0.095;
      ctx.fillStyle=rgba(col,0.4); ctx.strokeStyle=rgba(col,0.85); ctx.lineWidth=1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-cw/2,-ch/2,cw,ch,3); else ctx.rect(-cw/2,-ch/2,cw,ch);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle=rgba(col,0.9); ctx.lineWidth=ch*0.22;
      ctx.beginPath(); ctx.moveTo(-cw*0.30,0); ctx.lineTo(cw*0.26,0); ctx.stroke();
      ctx.restore();
    }

    // conclusion keystone — swings loose while unresolved, locks flush once focus closes the system
    ctx.save(); ctx.translate(0,baseR*0.58);
    ctx.rotate((1-focus)*0.6);
    ctx.globalAlpha = 0.35+0.65*focus;
    const cg = ctx.createLinearGradient(-baseR*0.1,-baseR*0.1,baseR*0.1,baseR*0.1);
    cg.addColorStop(0,'rgba(232,224,206,0.9)'); cg.addColorStop(1, rgba(rgb,0.35));
    ctx.fillStyle=cg;
    ctx.beginPath(); ctx.moveTo(0,-baseR*0.09); ctx.lineTo(baseR*0.085,baseR*0.055); ctx.lineTo(-baseR*0.085,baseR*0.055); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=0.8; ctx.stroke();
    ctx.restore();
  });
}

// --- 6. História: an ARCHIVAL LEDGER — chronology layers rendered as
// engraved plaques (parchment tone, fibre lines), each carrying two SEALS
// (heraldic ring + pennant, one per opposing side — the bipolar reading, not
// geology's mineral banding) and a torn-seam rift instead of a rock fault. ---
function drawHistoria(g) {
  const { baseR, focus, seed, t, rgb, rgb2 } = g;
  localFrame(g, () => {
    const n=4, pts=[], bandH=baseR*0.20, depth=baseR*0.09;
    for (let i=0;i<n;i++){
      const yy=-baseR*0.48+i*(baseR*0.30);
      const misalign=(1-focus)*baseR*0.45;
      const xOff=misalign*Math.sin(i*1.7+seed);
      const w=baseR*(1.1-i*0.08);
      ctx.save(); ctx.translate(xOff, yy);

      // side face — 3D plaque depth, not a flat rule
      ctx.fillStyle = rgba(rgb, 0.14+0.03*i);
      ctx.beginPath();
      ctx.moveTo(w/2,-bandH/2); ctx.lineTo(w/2+depth*0.4,-bandH/2+depth*0.5);
      ctx.lineTo(w/2+depth*0.4,bandH/2+depth*0.5); ctx.lineTo(w/2,bandH/2); ctx.closePath(); ctx.fill();

      // front face — engraved plaque/parchment tone (archival, not sediment)
      const grad = ctx.createLinearGradient(0,-bandH/2,0,bandH/2);
      grad.addColorStop(0, rgba(rgb, 0.04));
      grad.addColorStop(0.5, rgba(rgb, 0.20+0.04*i));
      grad.addColorStop(1, rgba(rgb, 0.04));
      ctx.fillStyle = grad;
      ctx.fillRect(-w/2, -bandH/2, w, bandH);
      // fine parchment fibre lines — paper texture, not rock banding
      ctx.strokeStyle = rgba(rgb, 0.07); ctx.lineWidth=0.6;
      for (let f=0; f<3; f++){ const fy=-bandH/2+bandH*(f+0.5)/3; ctx.beginPath(); ctx.moveTo(-w/2,fy); ctx.lineTo(w/2,fy); ctx.stroke(); }
      ctx.strokeStyle = rgba(rgb, 0.4+0.1*i); ctx.lineWidth=1;
      ctx.strokeRect(-w/2,-bandH/2,w,bandH);

      // two seals per layer — one per opposing side, the bipolar reading
      const t1 = (Math.sin(i*2.3+seed)*0.32)*w, t2 = (Math.cos(i*1.6+seed+1.7)*0.32)*w;
      [[t1,rgb],[t2,rgb2]].forEach(([tx,col]) => {
        ctx.strokeStyle = rgba(col,0.9); ctx.lineWidth=1.3;
        ctx.beginPath(); ctx.arc(tx,0,baseR*0.034,0,7); ctx.stroke();
        ctx.fillStyle = rgba(col,0.85);
        ctx.beginPath(); ctx.moveTo(tx,-baseR*0.017); ctx.lineTo(tx+baseR*0.014,baseR*0.014); ctx.lineTo(tx-baseR*0.014,baseR*0.014); ctx.closePath(); ctx.fill();
      });
      pts.push([xOff+t1, yy], [xOff+t2, yy]);
      ctx.restore();
    }

    // torn seam — a rift between the two opposing sides, not a mineral fault;
    // heals into a straight seam as focus resolves (tension settling)
    const jag = (1-focus)*baseR*0.16;
    ctx.strokeStyle = `rgba(18,12,8,${0.3+0.3*(1-focus)})`; ctx.lineWidth=1.8;
    ctx.setLineDash([2,2.5]);
    ctx.beginPath();
    for (let i=0;i<=n;i++){
      const yy=-baseR*0.58+i*(baseR*0.30);
      const xx = Math.sin(i*2.7+seed+t*0.6)*jag;
      i===0?ctx.moveTo(xx,yy):ctx.lineTo(xx,yy);
    }
    ctx.stroke();

    // cause -> consequence connectors, propagating along the fault's tension
    ctx.strokeStyle = rgba(rgb, 0.1+0.4*focus); ctx.lineWidth=1; ctx.setLineDash([3,3]);
    for (let i=0;i<pts.length-2;i+=2){
      ctx.beginPath(); ctx.moveTo(pts[i][0],pts[i][1]); ctx.lineTo(pts[i+2][0],pts[i+2][1]); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pts[i+1][0],pts[i+1][1]); ctx.lineTo(pts[i+3]?pts[i+3][0]:pts[i+1][0], pts[i+3]?pts[i+3][1]:pts[i+1][1]); ctx.stroke();
    }
    ctx.setLineDash([]);
  });
}

// --- 7. Geografia: topographic contours + flow arrows, chaotic→coherent ---
function drawGeografia(g) {
  const { baseR, focus, t, rgb, seed } = g;
  localFrame(g, () => {
    for (let ring=0; ring<3; ring++){
      const rr=baseR*(0.35+ring*0.25);
      ctx.beginPath();
      for (let i=0;i<=40;i++){
        const a=(i/40)*Math.PI*2;
        const wob=1+0.12*Math.sin(a*4+ring+seed)*(1+(1-focus)*1.5);
        const x=Math.cos(a)*rr*wob, y=Math.sin(a)*rr*wob*0.55;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle = rgba(rgb, 0.2+0.1*ring); ctx.lineWidth=1; ctx.stroke();
    }
    const nA=6;
    for (let i=0;i<nA;i++){
      const a=(i/nA)*Math.PI*2, r=baseR*0.72;
      const x=Math.cos(a)*r, y=Math.sin(a)*r*0.55;
      const coherent=-Math.PI/3;
      const chaos=a+Math.PI/2+Math.sin(i+seed+t*0.4)*1.4;
      const ang=coherent*focus+chaos*(1-focus);
      ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
      ctx.strokeStyle = rgba(rgb,0.6); ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(-baseR*0.09,0); ctx.lineTo(baseR*0.09,0); ctx.lineTo(baseR*0.03,-baseR*0.04); ctx.moveTo(baseR*0.09,0); ctx.lineTo(baseR*0.03,baseR*0.04); ctx.stroke();
      ctx.restore();
    }
  });
}

// --- fallback: default "network" core for subjects without a bespoke one ---
function drawDefaultNetwork(g) {
  const { baseR, focus, t, rgb, seed, subj } = g;
  localFrame(g, () => {
    const n=5, pts=[];
    for (let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2+seed, rr=baseR*0.55, jitter=(1-focus)*baseR*0.22;
      pts.push([Math.cos(a)*rr+Math.sin(i*3+t*0.6+seed)*jitter, Math.sin(a)*rr*0.6+Math.cos(i*2+t*0.5+seed)*jitter*0.6]);
    }
    ctx.strokeStyle = rgba(rgb,0.22+0.25*focus); ctx.lineWidth=1;
    for (let i=0;i<pts.length;i++){
      const [x1,y1]=pts[i], [x2,y2]=pts[(i+1)%pts.length];
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
    pts.forEach(([x,y],i)=> drawSignal(x,y, baseR*0.09, i, subj.geometry, rgb));
  });
}

// --- 8. Química: molecular network that reacts — bonds break/reform, only
// settling into a stable ring (benzene-like) once focus resolves. ---
function drawQuimica(g) {
  const { baseR, focus, t, rgb, rgb2, seed } = g;
  localFrame(g, () => {
    const n = 6, r = baseR*0.5;
    const pts = [];
    for (let i=0;i<n;i++){
      const a = (i/n)*Math.PI*2;
      const jitter = (1-focus)*baseR*0.16;
      const jx = Math.sin(i*3.1+t*1.3+seed)*jitter, jy = Math.cos(i*2.4+t*1.1+seed)*jitter;
      pts.push([Math.cos(a)*r+jx, Math.sin(a)*r*0.85+jy]);
    }
    for (let i=0;i<n;i++){
      const [x1,y1]=pts[i], [x2,y2]=pts[(i+1)%n];
      // per-bond activation: flickers while reacting (low focus), locks solid at high focus
      const activation = focus > 0.7 ? 1 : (Math.sin(i*5.2+t*3.4+seed)*0.5+0.5) * (0.3+focus*0.7);
      if (activation > 0.35) {
        ctx.strokeStyle = rgba(rgb, 0.25+0.5*activation); ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      } else {
        // breaking bond: a small energy tick where the bond used to be
        const mx=(x1+x2)/2, my=(y1+y2)/2;
        ctx.strokeStyle = rgba(rgb2, 0.5); ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(mx-4,my-4); ctx.lineTo(mx+4,my+4); ctx.moveTo(mx-4,my+4); ctx.lineTo(mx+4,my-4); ctx.stroke();
      }
    }
    // alternating inner "double bond" lines, only visible once mostly resolved
    if (focus > 0.5) {
      ctx.strokeStyle = rgba(rgb, (focus-0.5)*1.4); ctx.lineWidth=1;
      for (let i=0;i<n;i+=2){
        const [x1,y1]=pts[i], [x2,y2]=pts[(i+1)%n];
        const mx=(x1+x2)/2*0.82, my=(y1+y2)/2*0.82;
        ctx.beginPath(); ctx.moveTo(x1*0.82,y1*0.82); ctx.lineTo(x2*0.82,y2*0.82); ctx.stroke();
      }
    }
    pts.forEach(([x,y]) => {
      ctx.fillStyle = rgba(rgb, 0.85);
      ctx.beginPath(); ctx.arc(x,y, baseR*0.055, 0, 7); ctx.fill();
    });
  });
}

// --- 9. Português: a SYNTAX/DEPENDENCY DIAGRAM — the real visual convention
// linguistics already uses to show agreement: word-tokens (greeked text, no
// literal letters) sit on a sentence baseline, sujeito/verbo drift off-axis
// while they disagree, and a dependency arc connects them — jagged and low
// while unresolved, one clean arc with an agreement mark once they concord. ---
function drawPortugues(g) {
  const { baseR, focus, t, rgb, rgb2, seed } = g;
  localFrame(g, () => {
    const disagree = 1-focus;
    const baseY = baseR*0.34;

    // the sentence's own baseline — the axis every word sits on
    ctx.strokeStyle = rgba(rgb, 0.25); ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(-baseR*0.78, baseY); ctx.lineTo(baseR*0.78, baseY); ctx.stroke();

    // dim satellite words — this is a real sentence, not two isolated tokens
    [-0.66,-0.10,0.62].forEach((p,i) => {
      const x = p*baseR, w = baseR*(0.11+0.05*Math.sin(i*3+seed));
      ctx.strokeStyle = rgba(rgb, 0.2); ctx.lineWidth = baseR*0.045;
      ctx.beginPath(); ctx.moveTo(x-w/2, baseY); ctx.lineTo(x+w/2, baseY); ctx.stroke();
    });

    const subjX=-baseR*0.40, verbX=baseR*0.26;
    const subjY = baseY - Math.abs(Math.sin(seed*2+t*0.3))*baseR*0.30*disagree;
    const verbY = baseY - Math.abs(Math.cos(seed*1.7+t*0.35))*baseR*0.26*disagree;
    const subjRot = Math.sin(seed+t*0.4)*0.22*disagree;
    const verbRot = -Math.cos(seed*1.3+t*0.32)*0.22*disagree;

    // a word-token: a chip carrying greeked micro-text — language as its own
    // material, never a literal letter, never a generic block either.
    function token(x,y,rot,w,color) {
      const h = baseR*0.15;
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
      ctx.fillStyle='rgba(0,0,0,0.22)';
      ctx.beginPath(); ctx.ellipse(2,h*0.85,w*0.48,h*0.16,0,0,7); ctx.fill();
      const grad=ctx.createLinearGradient(-w/2,-h/2,w/2,h/2);
      grad.addColorStop(0, rgba(color,0.34)); grad.addColorStop(1, rgba(color,0.12));
      ctx.fillStyle=grad; ctx.strokeStyle=rgba(color,0.85); ctx.lineWidth=1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-w/2,-h/2,w,h,h*0.4); else ctx.rect(-w/2,-h/2,w,h);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle=rgba(color,0.9); ctx.lineWidth=h*0.24;
      ctx.beginPath(); ctx.moveTo(-w*0.3,0); ctx.lineTo(w*0.26,0); ctx.stroke();
      ctx.restore();
      return [x, y-h/2];
    }
    const subjTop = token(subjX, subjY, subjRot, baseR*0.30, rgb);
    const verbTop = token(verbX, verbY, verbRot, baseR*0.24, rgb2);

    // dependency arc — the linguistic convention itself: clean and high once
    // concordância resolves, low/jittery/mismatched while they disagree.
    const midX=(subjTop[0]+verbTop[0])/2;
    const archH = baseR*0.46*focus + disagree*(baseR*0.18+Math.sin(t*3+seed)*baseR*0.1);
    ctx.strokeStyle = rgba(rgb, 0.3+0.55*focus); ctx.lineWidth = 1.2+0.5*focus;
    ctx.beginPath();
    ctx.moveTo(subjTop[0], subjTop[1]);
    ctx.quadraticCurveTo(midX, subjTop[1]-archH, verbTop[0], verbTop[1]);
    ctx.stroke();

    // agreement mark — appears at the arc's apex only once resolved
    if (focus > 0.55) {
      const a=(focus-0.55)/0.45;
      ctx.globalAlpha=a;
      ctx.fillStyle='rgba(255,250,235,0.95)';
      ctx.beginPath(); ctx.arc(midX, subjTop[1]-archH, baseR*0.024, 0, 7); ctx.fill();
      ctx.globalAlpha=1;
    }
  });
}

// --- 10. Atualidades: campo global — centros geopolíticos conectados, sinais
// chegando continuamente (independente do foco), impacto se propagando. ---
function drawAtualidades(g) {
  const { baseR, focus, t, rgb, rgb2 } = g;
  localFrame(g, () => {
    // faint globe-curvature arcs
    ctx.strokeStyle = rgba(rgb, 0.14); ctx.lineWidth=1;
    for (let i=0;i<3;i++){
      ctx.beginPath(); ctx.ellipse(0,0, baseR*0.85, baseR*(0.25+i*0.22), 0, 0, Math.PI*2); ctx.stroke();
    }
    const nodes = [0,1,2,3,4].map(i => {
      const a = (i/5)*Math.PI*2 + 0.3;
      return [Math.cos(a)*baseR*0.68, Math.sin(a)*baseR*0.42];
    });
    // connections: solid+stable once focus resolves, dashed/tentative while arriving
    for (let i=0;i<nodes.length;i++){
      const [x1,y1]=nodes[i], [x2,y2]=nodes[(i+2)%nodes.length];
      const resolved = focus > 0.6;
      ctx.strokeStyle = rgba(rgb, resolved?0.4:0.18); ctx.lineWidth = resolved?1.2:1;
      ctx.setLineDash(resolved ? [] : [3,4]);
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }
    ctx.setLineDash([]);
    // continuous impact ripples — atualidades never fully rests, signals keep arriving
    nodes.forEach(([x,y], i) => {
      const age = ((t*1.6 + i*1.3) % 3);
      const rr = age*baseR*0.22;
      ctx.strokeStyle = rgba(rgb2, Math.max(0,0.35*(1-age/3)));
      ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x,y,rr,0,7); ctx.stroke();
      const isCurrent = i===0;
      ctx.fillStyle = rgba(rgb, isCurrent ? 0.55+0.35*focus : 0.6);
      ctx.beginPath(); ctx.arc(x,y, baseR*(isCurrent?0.07:0.045), 0, 7); ctx.fill();
    });
  });
}

const CORE_REGISTRY = {
  optica_geometrica:   { label:'Núcleo óptico',            draw:drawOptica,          useGenericParticles:false },
  quimica_rede:        { label:'Rede molecular',           draw:drawQuimica,         useGenericParticles:false },
  portugues_concordancia: { label:'Concordância',          draw:drawPortugues,       useGenericParticles:false },
  atualidades_campo:   { label:'Campo global',             draw:drawAtualidades,     useGenericParticles:false },
  probabilidade:       { label:'Distribuição',              draw:drawProbabilidade,   useGenericParticles:false },
  genetica_helix:      { label:'Hélice genética',           draw:drawGenetica,        useGenericParticles:false },
  literatura_planos:   { label:'Planos narrativos',         draw:drawLiteratura,      useGenericParticles:false },
  redacao_arquitetura: { label:'Arquitetura argumentativa', draw:drawRedacao,         useGenericParticles:false },
  historia_camadas:    { label:'Camadas temporais',         draw:drawHistoria,        useGenericParticles:false },
  geografia_fluxos:    { label:'Fluxos e topografia',       draw:drawGeografia,       useGenericParticles:false },
  default_network:     { label:'Rede — padrão da matéria',  draw:drawDefaultNetwork,  useGenericParticles:true  },
};
const MISSING_VARIANTS_LOGGED = new Set();
function resolveCoreType(subj) {
  if (subj.coreType && CORE_REGISTRY[subj.coreType]) return subj.coreType;
  const key = subj.subject + ' / ' + subj.topic;
  if (!MISSING_VARIANTS_LOGGED.has(key)) {
    MISSING_VARIANTS_LOGGED.add(key);
    console.warn('[Núcleo] sem variante semântica registrada, usando núcleo padrão da matéria:', key);
  }
  return 'default_network';
}

function drawScanSweep(cx, cy, baseR, angle, rgb) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const grad = ctx.createConicGradient ? ctx.createConicGradient(angle, cx, cy) : null;
  if (grad) {
    grad.addColorStop(0, rgba(rgb,0)); grad.addColorStop(0.02, rgba(rgb,0.35)); grad.addColorStop(0.06, rgba(rgb,0)); grad.addColorStop(1, rgba(rgb,0));
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, baseR*1.6, 0, 7); ctx.fill();
  }
  ctx.restore();
}

let whyOpen = false;
let factorAnchors = [];

function frame(dt) {
  const params = STATE_PARAMS[runtime.state];
  const focusTarget = STATE_FOCUS_TARGET[runtime.state];
  const dtc = Math.min(dt, 0.033);
  const subj = SUBJECTS[runtime.subjectKey];
  // rhythm/damping are the matéria's "laws of motion" — same state targets,
  // physically different feel (mechanical/crisp vs. organic/slow vs. tense).
  const rk = subj.rhythm, rd = subj.damping;

  if (runtime.reducedMotion) {
    core.spin.x=params.spin*0.15; core.spin.v=0;
    core.spread.x=params.spread; core.spread.v=0;
    core.glow.x=params.glow; core.glow.v=0;
    core.tiltX.x=params.tiltX; core.tiltX.v=0;
    core.tiltY.x=params.tiltY; core.tiltY.v=0;
    core.focus.x=focusTarget; core.focus.v=0;
  } else {
    stepSpring(core.spin, params.spin, dtc, 40*rk, 9*rd);
    stepSpring(core.spread, params.spread, dtc, 55*rk, 11*rd);
    stepSpring(core.glow, params.glow, dtc, 60*rk, 12*rd);
    stepSpring(core.tiltX, params.tiltX, dtc, 45*rk, 10*rd);
    stepSpring(core.tiltY, params.tiltY, dtc, 45*rk, 10*rd);
    stepSpring(core.focus, focusTarget, dtc, 50*rk, 11*rd);
  }
  core.angle += core.spin.x*dtc*2.2;
  core.scanAngle += dtc*3.4;

  renderField(performance.now()/1000);

  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.save(); ctx.scale(dpr, dpr);

  const cx = cw/2, cy = ch/2 + (whyOpen ? -ch*0.06 : 0);
  const baseR = Math.min(cw, ch) * (whyOpen ? 0.22 : 0.30);
  // Canvas colors track the SAME tweened palette as the CSS side (currentPalette,
  // updated by tweenPalette) — so the Núcleo's own hue eases across a subject
  // change instead of snapping, matching "iluminação muda gradualmente".
  const pal = currentPalette || subj.palette;
  const rgb = hexToRgb(pal.primary);
  const squashY = 1 - Math.min(0.5, Math.abs(core.tiltX.x)/40);
  const skewX = core.tiltY.x/90;

  const g = {
    cx, cy, baseR, spread: core.spread.x, glow: core.glow.x,
    focus: whyOpen ? 0.32 : core.focus.x,
    t: performance.now()/1000, rgb, seed: runtime.coreSeed, squashY, skewX, subj,
    rgb2: hexToRgb(pal.secondary), emissive: hexToRgb(pal.emissive),
  };

  drawExternalShell(g);
  const coreTypeKey = resolveCoreType(subj);
  const entry = CORE_REGISTRY[coreTypeKey];
  entry.draw(g);
  if (params.scan) drawScanSweep(cx, cy, baseR, core.scanAngle, rgb);
  drawCenterLight(g);

  document.getElementById('coreTypeTag').textContent = entry.label + (entry===CORE_REGISTRY.default_network ? ' · sem variante própria ainda' : '');

  if (entry.useGenericParticles) {
    particles.forEach((p) => {
      const target = whyOpen ? 1.5 : 1 * (1 + (runtime.reducedMotion?0:0.06*Math.sin(p.phase + performance.now()/900)));
      if (runtime.reducedMotion) { p.radius.x = target; p.radius.v = 0; }
      else stepSpring(p.radius, target, dtc, 50, 10);
      if (!runtime.reducedMotion) p.angle += dtc * 0.5 * p.angleSpeedMul * subj.rhythm * (whyOpen?0.15:1);
      const r = baseR * (1.15 + p.radius.x * 0.9);
      const px = cx + Math.cos(p.angle) * r;
      const py = cy + Math.sin(p.angle) * r * squashY * 0.42;
      ctx.save(); ctx.strokeStyle = rgba(rgb,0.22); ctx.lineWidth = 1; ctx.setLineDash([2,3]);
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(px,py); ctx.stroke(); ctx.restore();
      drawSignal(px, py, p.size*1.8, p.angle, subj.geometry, rgb);
    });
  }

  if (whyOpen) {
    const nf = subj.factors.length;
    factorAnchors = subj.factors.map((f,i) => {
      const a = -1.15 + (i/(Math.max(1,nf-1)))*1.9;
      return { x: cx + Math.cos(a)*baseR*1.35, y: cy + Math.sin(a)*baseR*1.35*squashY };
    });
    factorAnchors.forEach((pt) => {
      ctx.fillStyle = rgba(rgb, 0.6);
      ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.5, 0, 7); ctx.fill();
    });
  }

  ctx.restore();
}

let lastT = performance.now();
function loop(t) {
  const dt = (t - lastT) / 1000;
  lastT = t;
  frame(dt);
  requestAnimationFrame(loop);
}
resizeCanvas();
requestAnimationFrame(loop);
window.addEventListener('resize', resizeCanvas);

/* =========================================================================
 * 6. KINETIC HEADLINE — the título's *comportamento* changes per matéria
 *    (this is one of the things that must change per the visual profile;
 *    the typeface itself stays Newsreader, per brand identity). Each `typo`
 *    key below is a genuinely distinct choreography, not a timing tweak.
 * ========================================================================= */
const TYPO_CHAR = {
  mechanical:    { from:{opacity:0,transform:'translateY(6px)'}, dur:160, stagger:14,  easing:'linear' },
  vector:        { from:{opacity:0,transform:'translateX(-14px) rotate(-6deg)'}, dur:260, stagger:18, easing:'cubic-bezier(.2,1.6,.4,1)' },
  reactive:      { from:{opacity:0,transform:'scale(2.1)'}, dur:220, stagger:(i)=> 10+((i*37)%40), easing:'cubic-bezier(.3,1.8,.4,1)' },
  organic:       { from:{opacity:0,transform:'scale(.7) translateY(4px)'}, dur:340, stagger:26, easing:'cubic-bezier(.25,.8,.3,1)' },
  contemplative: { from:{opacity:0,transform:'none'}, dur:520, stagger:34, easing:'ease-out' },
  structural:    { from:{opacity:0,transform:'translateY(16px)'}, dur:260, stagger:20, easing:'cubic-bezier(.2,1.3,.3,1)' },
  cartographic:  { from:{opacity:0,transform:'scale(1.7)'}, dur:280, stagger:16, easing:'cubic-bezier(.3,.9,.3,1)' },
  signal:        { from:{opacity:0}, dur:90, stagger:(i)=> (i*53)%260, flicker:true, easing:'steps(2,end)' },
};

function playKineticHeadline(text, typo) {
  const el = document.getElementById('headline');
  el.innerHTML = '';
  if (runtime.reducedMotion) { el.textContent = text; return; }

  if (typo === 'parsing') { playParsingHeadline(el, text); return; }
  if (typo === 'stratified') { playStratifiedHeadline(el, text); return; }

  const cfg = TYPO_CHAR[typo] || TYPO_CHAR.mechanical;
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch === ' ' ? ' ' : ch;
    el.appendChild(span);
    const delay = typeof cfg.stagger === 'function' ? cfg.stagger(i) : i*cfg.stagger;
    const frames = cfg.flicker
      ? [{opacity:0},{opacity:1,offset:.3},{opacity:.15,offset:.55},{opacity:1}]
      : [cfg.from, { opacity:1, transform:'none' }];
    span.animate(frames, { duration:cfg.dur, delay, easing:cfg.easing, fill:'both' });
  });
}

// Português — sujeito/verbo (metade esquerda/direita da frase) chegam de
// direções opostas e "encaixam" no centro quando a concordância converge.
function playParsingHeadline(el, text) {
  const words = text.split(' ');
  const mid = Math.ceil(words.length/2);
  words.forEach((word, wi) => {
    const wrap = document.createElement('span');
    wrap.className = 'ch';
    wrap.textContent = word;
    el.appendChild(wrap);
    if (wi < words.length-1) el.appendChild(document.createTextNode(' '));
    const fromLeft = wi < mid;
    wrap.animate(
      [{ opacity:0, transform:`translateX(${fromLeft?-26:26}px)` }, { opacity:1, transform:'translateX(0)' }],
      { duration:420, delay:180+wi*70, easing:'cubic-bezier(.2,.9,.25,1.15)', fill:'both' }
    );
  });
}

// História — as camadas temporais se revelam em varredura (wipe), como uma
// linha do tempo se desenrolando, não caractere a caractere.
function playStratifiedHeadline(el, text) {
  el.textContent = text;
  el.style.clipPath = 'inset(0 100% 0 0)';
  el.animate([{ clipPath:'inset(0 100% 0 0)' }, { clipPath:'inset(0 0% 0 0)' }],
    { duration:620, easing:'cubic-bezier(.3,.7,.2,1)', fill:'forwards' }
  ).onfinish = () => { el.style.clipPath = ''; };
}

/* =========================================================================
 * 7. RENDER: telemetry, factors, trail, subject rail
 * ========================================================================= */
function interpolateNumber(el, from, to, suffix, ms=650) {
  const start = performance.now();
  function step(t) {
    const p = Math.min(1, (t-start)/ms);
    const eased = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(from + (to-from)*eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

let lastMastery = 0;
// Semantic tint (never the only signal — text label always stays) using the
// matéria's own dataPositive/dataWarning tokens, not a fixed red/green.
function semanticColor(value, positiveWhenHigh) {
  if (value === 'média') return '';
  const warn = positiveWhenHigh ? value === 'baixa' : value === 'alta';
  return `style="color:var(${warn ? '--data-warning' : '--data-positive'})"`;
}

function renderTelemetry(subj) {
  const wrap = document.getElementById('telemetry');
  wrap.innerHTML = `
    <div class="tele-item"><div class="tele-k">Domínio</div><div class="tele-v mono" id="teleMastery">0%</div><div class="tele-scale"><div class="tele-fill" id="teleMasteryFill" style="width:0%"></div></div></div>
    <div class="tele-item"><div class="tele-k">Confiança</div><div class="tele-v mono" ${semanticColor(subj.confidence, true)}>${subj.confidence}</div></div>
    <div class="tele-item"><div class="tele-k">Urgência</div><div class="tele-v mono" ${semanticColor(subj.urgency, false)}>${subj.urgency}</div></div>
    <div class="tele-item"><div class="tele-k">Recorrência</div><div class="tele-v mono">${subj.recurrence}</div></div>
    <div class="tele-item"><div class="tele-k">Tempo</div><div class="tele-v mono">${subj.minutes}<small> min</small></div></div>
    <div class="tele-item"><div class="tele-k">Última análise</div><div class="tele-v mono">${subj.lastAnalysis}</div></div>
  `;
  const mEl = document.getElementById('teleMastery'), fEl = document.getElementById('teleMasteryFill');
  interpolateNumber(mEl, lastMastery, subj.mastery, '%');
  requestAnimationFrame(()=>{ fEl.style.width = subj.mastery + '%'; });
  lastMastery = subj.mastery;
}

function renderFactors(subj) {
  const list = document.getElementById('factorList');
  list.innerHTML = subj.factors.map(f => `
    <div class="factor-row ${f.dim?'dim':''}">
      <span class="factor-dot"></span>
      <div class="factor-body"><div class="factor-name">${f.k}</div><div class="factor-meta">peso relativo desta recomendação</div></div>
      <span class="factor-w">${f.w.toFixed(2)}</span>
    </div>
  `).join('');
  drawConnectors();
}

// Connector lines never touch the hero above: the anchor is the small
// "núcleo echo" dot at the top of the bay (not the real core canvas), and
// the whole thing lives inside .why-bay's overflow:hidden — short, curved,
// contained. Each line is a calculated quadratic curve, not a raw diagonal.
function drawConnectors() {
  const svg = document.getElementById('connector-svg');
  if (!whyOpen) { svg.innerHTML=''; return; }
  const bay = document.getElementById('whyBay');
  const echoDot = document.querySelector('#whyEcho .echo-dot');
  const rows = document.querySelectorAll('.factor-row');
  if (!bay || !echoDot || !rows.length) { svg.innerHTML=''; return; }
  const bayRect = bay.getBoundingClientRect();
  const er = echoDot.getBoundingClientRect();
  const ex = er.left - bayRect.left + er.width/2, ey = er.top - bayRect.top + er.height/2;
  let html = '';
  rows.forEach((row) => {
    const dot = row.querySelector('.factor-dot');
    const r = dot.getBoundingClientRect();
    const x2 = r.left - bayRect.left + r.width/2, y2 = r.top - bayRect.top + r.height/2;
    const cx = ex + (x2-ex)*0.15, cy = ey + (y2-ey)*0.65;
    const d = `M${ex},${ey} Q${cx},${cy} ${x2},${y2}`;
    html += `<path class="glow" d="${d}"></path><path class="line" d="${d}"></path>`;
  });
  svg.innerHTML = html;
}
setInterval(()=>{ if (whyOpen) drawConnectors(); }, 120);

function renderTrail(subj) {
  const flow = document.getElementById('flow');
  const items = subj.trail.map((t,i)=>`
    <div class="flow-node"><div class="flow-no">0${i+2}</div><div class="flow-dot"></div><div class="flow-t">${t[0]}</div><div class="flow-m">${t[1]} · ${t[2]}</div></div>
  `).join('');
  const quiet = subj.quiet.map(t=>`
    <div class="flow-node quiet"><div class="flow-dot"></div><div class="flow-t">${t[0]}</div><div class="flow-m">${t[1]}</div></div>
  `).join('');
  flow.innerHTML = items + quiet;
  document.getElementById('trailHeadMeta').textContent = `${subj.trail.length} depois disso · ${subj.quiet.length} podem esperar`;
}

function renderSubjectRail() {
  const rail = document.getElementById('subjectRail');
  rail.innerHTML = SUBJECT_ORDER.map(key => {
    const s = SUBJECTS[key];
    return `<button class="subject-pill ${key===runtime.subjectKey?'active':''}" data-subject="${key}" style="--accent:${s.accent}">${s.short}</button>`;
  }).join('');
  rail.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => transitionSubject(btn.dataset.subject)));
}

/* =========================================================================
 * 7.5 SISTEMA CROMÁTICO — full per-matéria palette, applied to the whole
 *    page (not just the Núcleo): background atmosphere, CTA, data-viz,
 *    text emphasis. Colors are TWEENED across a subject transition (see
 *    tweenPalette) so lighting changes gradually, never a hard cut.
 * ========================================================================= */
const PALETTE_KEYS = ['bg','surface','primary','secondary','emissive','textHighlight','dataPositive','dataWarning','atmoA','atmoB'];
const PALETTE_CSS_VAR = { bg:'--sub-bg', surface:'--sub-surface', primary:'--accent', secondary:'--secondary',
  emissive:'--emissive', textHighlight:'--text-highlight', dataPositive:'--data-positive', dataWarning:'--data-warning',
  atmoA:'--atmo-a', atmoB:'--atmo-b' };

function relLuminance(hex) {
  const lin = (c) => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  const [r,g,b] = hexToRgb(hex);
  return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
}
function hexLerpStr(a, b, t) {
  const ca = hexToRgb(a), cb = hexToRgb(b);
  const c = [0,1,2].map(i => Math.round(ca[i] + (cb[i]-ca[i])*t).toString(16).padStart(2,'0'));
  return `#${c.join('')}`;
}
function setPaletteVars(palette) {
  const root = document.documentElement.style;
  PALETTE_KEYS.forEach(k => root.setProperty(PALETTE_CSS_VAR[k], palette[k]));
  // CTA text is a discrete black/white choice, snapped to the target (never
  // tweened) so contrast never dips into a muddy mid-tone mid-transition.
  root.setProperty('--cta-text', relLuminance(palette.primary) > 0.42 ? '#0A0B0A' : '#FBF0EC');
}
let currentPalette = null;
function tweenPalette(toPalette, duration=900) {
  if (runtime.reducedMotion || !currentPalette) { setPaletteVars(toPalette); currentPalette = {...toPalette}; return; }
  const fromPalette = {...currentPalette};
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now-start)/duration);
    const eased = p<0.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
    const mixed = {};
    PALETTE_KEYS.forEach(k => mixed[k] = hexLerpStr(fromPalette[k], toPalette[k], eased));
    setPaletteVars(mixed);
    currentPalette = mixed; // canvas (frame/renderField) reads this live — must track every step, not just the end
    if (p < 1) requestAnimationFrame(step); else currentPalette = {...toPalette};
  }
  requestAnimationFrame(step);
}

function applySubjectContent(subj, animateHeadline=true) {
  document.body.dataset.geometry = subj.geometry; // drives the per-matéria surface material (CSS)
  document.getElementById('eyebrowText').textContent = `Foco de hoje · ${subj.subject}`;
  document.getElementById('decisionLine').innerHTML = `${subj.action} em <b>${subj.subject}</b> — ${subj.reason} <b>${subj.minutes} min</b> estimados.`;
  if (animateHeadline) playKineticHeadline(subj.topic, subj.typo); else document.getElementById('headline').textContent = subj.topic;
  renderTelemetry(subj);
  renderFactors(subj);
  renderTrail(subj);
  renderSubjectRail();
}

/* =========================================================================
 * 8. STATE / SUBJECT TRANSITIONS
 * ========================================================================= */
function setState(next) {
  runtime.state = next;
  document.getElementById('stateLabel').textContent = STATE_LABEL[next];
  document.querySelectorAll('#devbar [data-act^="state:"]').forEach(b => b.classList.toggle('on', b.dataset.act === 'state:'+next));
}

function wait(ms) { return new Promise(r => setTimeout(r, runtime.reducedMotion ? Math.min(ms,80) : ms)); }

// The subject swap happens mid-"recalibrando", once the outgoing artifact
// has already dissolved (focus spring near its low target) — so the actual
// object-swap is hidden inside a moment that already reads as "unresolved",
// and what the viewer sees is: old instrument dissolves → new one assembles,
// never a hard cut/fade between two finished objects.
async function transitionSubject(key) {
  if (key === runtime.subjectKey || document.body.dataset.busy) return;
  document.body.dataset.busy = '1';
  // 9-step metamorphosis: 1) ambiente perde energia + 2) núcleo se desmonta
  // both fall out of `focus` already dropping toward its recalibrating target
  // (core AND campo ambiente read the same focus value, so both go inert together).
  setState('recalibrating');
  await wait(650);
  // 3) swap happens at the trough (already-dissolved, nothing legible to cut) —
  runtime.subjectKey = key;
  runtime.coreSeed = Math.random()*100;
  const subj = SUBJECTS[key];
  // 4) iluminação muda gradualmente — palette tween runs concurrently with
  //    the converging phase below, not an instant swap.
  tweenPalette(subj.palette, 900);
  // 5) campo da nova matéria + 6) núcleo reconstrói: renderField/frame already
  //    read runtime.subjectKey live, so both pick up the new geometry now.
  // 7) tipografia assume o comportamento da matéria + 8) indicadores recalibram:
  applySubjectContent(subj, true);
  seedParticles();
  setState('converging');
  await wait(550);
  setState('ready'); // 9) nova recomendação estabiliza
  delete document.body.dataset.busy;
}

// Opening choreography (per correction): 1) core dims slightly (via `focus`
// dropping while whyOpen, already read in frame()) 2) bay area appears
// 3) lines draw only inside the bay 4) nodes appear 5) labels last.
function toggleWhy(forceOpen) {
  whyOpen = typeof forceOpen === 'boolean' ? forceOpen : !whyOpen;
  document.getElementById('whyPanel').classList.toggle('open', whyOpen);
  document.getElementById('whyChevron').textContent = whyOpen ? '▴' : '▾';
  if (!whyOpen) { document.getElementById('connector-svg').innerHTML = ''; return; }

  const echo = document.getElementById('whyEcho');
  if (!runtime.reducedMotion) {
    echo.animate(
      [{ opacity:0, transform:'translateY(-6px) scale(.8)' }, { opacity:1, transform:'none' }],
      { duration:260, easing:'cubic-bezier(.2,.7,.3,1)', fill:'both' }
    );
  }
  const delay = runtime.reducedMotion ? 0 : 200;
  setTimeout(() => { drawConnectors(); revealFactors(); }, delay);
}

function revealFactors() {
  document.querySelectorAll('.factor-row').forEach((row, i) => {
    if (runtime.reducedMotion) return;
    const dot = row.querySelector('.factor-dot');
    const rest = [row.querySelector('.factor-name'), row.querySelector('.factor-meta'), row.querySelector('.factor-w')];
    dot.animate([{ transform:'scale(0)' }, { transform:'scale(1)' }],
      { duration:200, delay:i*90, easing:'cubic-bezier(.3,1.5,.5,1)', fill:'both' });
    rest.forEach((el, j) => el && el.animate(
      [{ opacity:0, transform:'translateX(-4px)' }, { opacity:1, transform:'none' }],
      { duration:220, delay:i*90+90+j*30, easing:'ease-out', fill:'both' }
    ));
  });
}

/* =========================================================================
 * 9. WIRING
 * ========================================================================= */
document.getElementById('whyLink').addEventListener('click', () => toggleWhy());
document.getElementById('ctaBtn').addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height) * 1.4;
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(ripple);
  ripple.animate([{ transform:'scale(0)', opacity:1 }, { transform:'scale(1)', opacity:0 }], { duration:450, easing:'ease-out' });
  setTimeout(()=>ripple.remove(), 460);
});

document.querySelectorAll('.spot').forEach(el => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', (e.clientX-r.left)+'px');
    el.style.setProperty('--sy', (e.clientY-r.top)+'px');
  });
});

function setTheme(t) {
  runtime.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  document.querySelectorAll('#devbar [data-act^="theme:"]').forEach(b => b.classList.toggle('on', b.dataset.act === 'theme:'+t));
}
function setReducedMotion(on) {
  runtime.reducedMotion = on;
  document.body.classList.toggle('reduced', on);
  document.querySelectorAll('#devbar [data-act^="rm:"]').forEach(b => b.classList.toggle('on', b.dataset.act === (on?'rm:on':'rm:off')));
}

document.getElementById('devbar').addEventListener('click', async (e) => {
  const btn = e.target.closest('button'); if (!btn) return;
  const [group, val] = btn.dataset.act.split(':');
  if (group === 'theme') setTheme(val);
  else if (group === 'state') setState(val);
  else if (group === 'rm') setReducedMotion(val === 'on');
  else if (btn.dataset.act === 'demo') runDemo();
});

/* =========================================================================
 * 10. FULL DEMO SEQUENCE
 * ========================================================================= */
window.__demoRunning = false;
async function runDemo() {
  if (window.__demoRunning) return;
  window.__demoRunning = true;
  setState('idle'); await wait(900);
  setState('listening'); await wait(1100);
  setState('analyzing'); await wait(1300);
  setState('converging'); await wait(850);
  setState('ready'); await wait(900);
  toggleWhy(true); await wait(1600);
  toggleWhy(false); await wait(400);
  setState('recalibrating'); await wait(900);
  setState('ready'); await wait(600);
  setTheme('light'); await wait(1300);
  setTheme('dark'); await wait(500);
  // Sequenced so the 5 required pairs land as consecutive transitions:
  // Matemática→Biologia, Física/Óptica→Português, Literatura→História,
  // Geografia→Atualidades, Redação→Química — while still passing through
  // all 10 matérias (bridge transitions in between are not required pairs
  // but keep every subject's palette/core/field validated once each).
  await transitionSubject('matematica'); await wait(1500);
  await transitionSubject('biologia');   await wait(1700); // ← Matemática→Biologia
  await transitionSubject('fisica');     await wait(1500);
  await transitionSubject('portugues');  await wait(1700); // ← Física/Óptica→Português
  await transitionSubject('literatura'); await wait(1500);
  await transitionSubject('historia');   await wait(1700); // ← Literatura→História
  await transitionSubject('geografia');  await wait(1500);
  await transitionSubject('atualidades');await wait(1700); // ← Geografia→Atualidades
  await transitionSubject('redacao');    await wait(1500);
  await transitionSubject('quimica');    await wait(1700); // ← Redação→Química
  window.__demoRunning = false;
  window.__demoDone = true;
}

/* =========================================================================
 * 11. INIT
 * ========================================================================= */
tweenPalette(SUBJECTS[runtime.subjectKey].palette, 0); // instant — no prior state to tween from
applySubjectContent(SUBJECTS[runtime.subjectKey], false);
setState('ready');
