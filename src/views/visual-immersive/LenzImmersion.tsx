import React, { useRef, useState } from 'react';
import {
  ImmersiveShell, makeParticles, makeSphereSprites, paintBackdrop, placeHotspot, useImmersiveCanvas, useImmersiveState,
  type ImmersiveFrame, type ImmersivePhase, type TemaDaCena,
} from './immersiveStage';
import { COIL_X, HALF, facingPole, flux, inducedCurrent, inducedFieldDirection, magnetAt, motionFor, stillMagnet } from './lenzPhysics';

/**
 * Cena imersiva da lei de Lenz: um ímã, uma espira e o que a espira faz quando
 * o fluxo muda.
 *
 * É a segunda cena nessa linguagem, depois da PCR, e foi escolhida para testar
 * se ela se sustenta fora da Biologia. O capítulo serve porque o fenômeno é
 * espacial (o sentido da corrente só se lê em três dimensões), tem etapas que
 * se contradizem de propósito (aproximar e afastar dão respostas opostas) e
 * guarda a pegadinha clássica na última: fluxo grande com ímã parado não induz
 * nada. Diferente da PCR em Biotecnologia, a cena cobre o capítulo inteiro.
 *
 * O sinal de tudo o que se desenha vem de `lenzPhysics.ts`, que tem teste. A
 * cena não grava nada: evidência continua vindo de Testar e Reconstruir.
 */
export const LENZ_PHASES: readonly ImmersivePhase[] = [
  { title: ['O campo', 'atravessa.'], kicker: '01 / Campo do ímã', rail: 'Campo', text: 'As linhas do campo do ímã saem do polo norte. As que passam por dentro da espira formam o fluxo magnético. Com o ímã parado, ele não muda.', number: 'Φ', unit: 'Fluxo constante', action: 'Aproximar o ímã', label: 'Linhas de campo', detail: 'Fluxo é quanto campo atravessa a área da espira. Depende da intensidade do campo, da área e da inclinação entre os dois.', predict: { question: 'Ao aproximar o polo norte, o fluxo pela espira…', options: ['Aumenta', 'Não muda'], right: 0, why: 'Perto do ímã o campo é mais intenso: mais linhas atravessam a espira.' } },
  { title: ['O fluxo', 'aumenta.'], kicker: '02 / Aproximação', rail: 'Fluxo', text: 'Com o polo norte chegando, o campo dentro da espira fica mais intenso. O fluxo cresce enquanto o ímã se move.', number: 'Φ ↑', unit: 'Fluxo aumentando', action: 'Ver a reação da espira', label: 'Polo norte', detail: 'O que importa para a indução não é o valor do fluxo, e sim a rapidez com que ele varia: quanto mais rápido o ímã, maior a força eletromotriz.', predict: { question: 'O campo criado pela corrente induzida aponta…', options: ['A favor do campo do ímã', 'Contra o campo do ímã'], right: 1, why: 'O fluxo está aumentando, e a corrente induzida se opõe a esse aumento.' } },
  { title: ['A espira', 'reage.'], kicker: '03 / Lei de Lenz', rail: 'Reação', text: 'Surge uma corrente, anti-horária para quem olha do lado do ímã. O campo dela aponta de volta para ele, contra o aumento do fluxo: a face voltada para o ímã vira polo norte e o repele.', number: 'i ↺', unit: 'Anti-horária', action: 'Afastar o ímã', label: 'Campo induzido', detail: 'É a conservação de energia: empurrar o ímã contra a repulsão exige trabalho, e esse trabalho é o que aparece como energia elétrica na espira.', predict: { question: 'Ao afastar o ímã, a corrente induzida…', options: ['Inverte o sentido', 'Mantém o sentido'], right: 0, why: 'Agora o fluxo diminui e a espira tenta mantê-lo: o campo induzido passa a apontar a favor do campo do ímã.' } },
  { title: ['Afastar', 'inverte.'], kicker: '04 / Afastamento', rail: 'Afastar', text: 'O fluxo diminui. A corrente inverte, agora horária para quem olha do lado do ímã, e o campo induzido aponta no mesmo sentido do campo dele. A face voltada para o ímã vira polo sul e o atrai.', number: 'i ↻', unit: 'Horária', action: 'Comparar os cenários', label: 'Campo induzido', detail: 'Nos dois casos a espira se opõe à mudança: repele o ímã que chega e segura o ímã que sai. Ela nunca ajuda o movimento que a provoca.', predict: { question: 'Com o ímã parado bem perto da espira, a corrente é…', options: ['Máxima, porque o fluxo é máximo', 'Nula'], right: 1, why: 'O que induz corrente é a variação do fluxo, não o valor dele.' } },
  { title: ['E se ele', 'parar?'], kicker: '05 / Compare o resultado', rail: 'Comparar', text: 'Em movimento, o fluxo varia o tempo todo e a corrente troca de sentido a cada ida e volta.', number: 'i ≠ 0', unit: 'Fluxo variando', action: 'Rever a experiência', label: 'Espira', detail: 'É assim que um gerador funciona: o movimento relativo entre ímã e espira mantém o fluxo variando, e a corrente alterna.' },
];

const PARADO = {
  text: 'Parado, mesmo bem perto, o ímã mantém o fluxo constante. Há campo atravessando a espira, mas não há corrente.',
  detail: 'Um ímã encostado numa bobina não acende nada. Sem variação de fluxo não há força eletromotriz, por mais intenso que o campo seja.',
  reading: { number: 'i = 0', unit: 'Fluxo constante' },
};

const TINTA: Record<TemaDaCena, { norte: string; sul: string; cobre: string; campo: string; campoForte: string }> = {
  noite: { norte: '#e58f7c', sul: '#83c6ce', cobre: '#e2ac72', campo: '#cfe6c333', campoForte: '#d9f0cc99' },
  caderno: { norte: '#b23f3a', sul: '#2f6f93', cobre: '#a8672a', campo: '#3a302633', campoForte: '#3a302699' },
};

type P3 = { x: number; y: number; z: number };
const RING = 46, TURNS = 4, GAP = 7;
/** Centro do que se desenha, no eixo: entre o ímã longe e a espira. */
const MID_X = -52;

// `onPractice` faz parte do contrato do registro, mas a página não o passa mais
// (a saída da cena é a faixa "Próximo passo"); esta cena não o usa.
export default function LenzImmersion({ temaInicial }: { temaInicial?: TemaDaCena; onPractice?: () => void }) {
  const state = useImmersiveState(LENZ_PHASES, temaInicial);
  const [moving, setMoving] = useState(true);
  const hotspot = useRef<HTMLButtonElement>(null);
  const scenario = useRef({ moving }); scenario.current.moving = moving;
  // Guardados fora do React: são reescritos a cada quadro.
  const tools = useRef({ particles: makeParticles(), sprite: makeSphereSprites(), magnetX: -150, shown: 0, start: 0 });

  const draw = (frame: ImmersiveFrame) => {
    const { ctx, width, mobile, pal, tema } = frame, cor = TINTA[tema], kit = tools.current;
    const phase = state.phase, motion = motionFor(phase, scenario.current.moving);
    // Cada etapa começa a sua passada do início: com o relógio corrido da cena,
    // a etapa podia abrir no meio do sumiço entre uma passada e outra.
    if (frame.changed) { kit.shown = 0; kit.start = frame.elapsed; }
    const target = frame.still ? stillMagnet(motion) : magnetAt(motion, frame.elapsed - kit.start);
    // Trocar de etapa leva o ímã até o novo movimento em vez de teleportá-lo.
    kit.shown = Math.min(1, kit.shown + (frame.still ? 1 : frame.delta * 2.4));
    kit.magnetX += (target.x - kit.magnetX) * (kit.shown >= 1 || frame.still ? 1 : frame.ease * 2.2);
    const xm = kit.magnetX, alpha = frame.still ? 1 : target.alpha;
    const current = phase >= 2 ? inducedCurrent(xm, target.v) : 0;

    paintBackdrop(frame, kit.particles);

    // Balanço leve em vez de giro contínuo: de lado a espira vira um traço e o
    // sentido da corrente deixa de ser legível.
    const rot = frame.rotation + (frame.still || frame.dragging ? 0 : Math.sin(frame.elapsed * .28) * .1);
    const cosR = Math.cos(rot), sinR = Math.sin(rot), cosT = Math.cos(frame.tilt), sinT = Math.sin(frame.tilt);
    const base = (mobile ? Math.min(width / 355, 1.28) * .95 : Math.min(width / 440, 2.05)) * frame.zoom;
    const cx = width * (mobile ? .52 : .63), cy = mobile ? 268 : 318;
    const project = (p: P3) => {
      const x0 = p.x - MID_X;
      const rx = x0 * cosR + p.z * sinR, rz = -x0 * sinR + p.z * cosR;
      const ry = p.y * cosT - rz * sinT, z = p.y * sinT + rz * cosT;
      const scale = base * (800 / (800 + z));
      return { x: cx + rx * scale, y: cy - ry * scale, z, scale };
    };

    // Linhas de campo: laços que saem à frente do polo norte e voltam ao sul.
    // As que alcançam a espira por dentro dela são desenhadas mais fortes — é
    // a contagem delas que faz o fluxo crescer à vista quando o ímã chega.
    ctx.lineCap = 'round';
    for (let k = 1; k <= 4; k++) {
      const a = HALF + 26 * k, b = a * .5;
      for (let j = 0; j < 6; j++) {
        const phi = j * Math.PI / 3 + .35;
        const cosAtCoil = (COIL_X - xm) / a;
        const crosses = Math.abs(cosAtCoil) < 1 && b * Math.sqrt(1 - cosAtCoil * cosAtCoil) < RING;
        ctx.strokeStyle = crosses ? cor.campoForte : cor.campo; ctx.lineWidth = crosses ? 1.3 : .9; ctx.globalAlpha = alpha;
        ctx.beginPath();
        let mid = { x: 0, y: 0 }, after = { x: 0, y: 0 };
        for (let s = 0; s <= 28; s++) {
          const theta = .1 * Math.PI + s / 28 * .8 * Math.PI, rho = b * Math.sin(theta);
          const q = project({ x: xm + a * Math.cos(theta), y: rho * Math.cos(phi), z: rho * Math.sin(phi) });
          if (s === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
          if (s === 14) mid = q; if (s === 15) after = q;
        }
        ctx.stroke();
        // Fora do ímã o campo vai do norte para o sul.
        if (j % 2 === 0) arrowHead(ctx, mid, after, crosses ? 5 : 4, crosses ? cor.campoForte : cor.campo);
      }
    }
    ctx.globalAlpha = 1;

    type Item = { z: number; paint: () => void };
    const items: Item[] = [];
    const segment = (a: P3, b: P3, color: string, w: number, opacity = 1) => {
      const p = project(a), q = project(b);
      items.push({ z: (p.z + q.z) / 2, paint: () => {
        ctx.globalAlpha = opacity; ctx.strokeStyle = color; ctx.lineWidth = w * (p.scale + q.scale) / 2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        ctx.strokeStyle = pal.fio; ctx.lineWidth = w * .22 * p.scale; ctx.beginPath(); ctx.moveTo(p.x - 1, p.y - 1); ctx.lineTo(q.x - 1, q.y - 1); ctx.stroke();
      } });
    };
    const ringPoint = (turn: number, angle: number): P3 => ({ x: COIL_X + turn * GAP + (angle / (2 * Math.PI)) * GAP, y: RING * Math.cos(angle), z: RING * Math.sin(angle) });

    // A espira: quatro voltas de fio de cobre.
    for (let turn = 0; turn < TURNS; turn++) for (let s = 0; s < 40; s++) {
      segment(ringPoint(turn, s / 40 * 2 * Math.PI), ringPoint(turn, (s + 1) / 40 * 2 * Math.PI), cor.cobre, 3.4);
    }

    // O ímã: duas metades de uma barra, cada face sombreada pela sua direção.
    const half = 13;
    const box = (x0: number, x1: number, color: string) => {
      const v = (x: number, y: number, z: number): P3 => ({ x, y, z });
      const faces: [P3[], number][] = [
        [[v(x0, -half, -half), v(x1, -half, -half), v(x1, half, -half), v(x0, half, -half)], .78],
        [[v(x0, -half, half), v(x1, -half, half), v(x1, half, half), v(x0, half, half)], .78],
        [[v(x0, half, -half), v(x1, half, -half), v(x1, half, half), v(x0, half, half)], 1],
        [[v(x0, -half, -half), v(x1, -half, -half), v(x1, -half, half), v(x0, -half, half)], .55],
        [[v(x0, -half, -half), v(x0, half, -half), v(x0, half, half), v(x0, -half, half)], .66],
        [[v(x1, -half, -half), v(x1, half, -half), v(x1, half, half), v(x1, -half, half)], .9],
      ];
      for (const [corners, light] of faces) {
        const pts = corners.map(project);
        items.push({ z: pts.reduce((sum, p) => sum + p.z, 0) / 4 + .5, paint: () => {
          ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath(); ctx.fill();
          ctx.globalAlpha = alpha * (1 - light) * .7; ctx.fillStyle = pal.esfera[2]; ctx.fill();
          ctx.globalAlpha = alpha * .5; ctx.strokeStyle = pal.esfera[1]; ctx.lineWidth = .8; ctx.stroke();
        } });
      }
    };
    box(xm - HALF, xm, cor.sul); box(xm, xm + HALF, cor.norte);

    // A corrente: cargas andando pelo fio no sentido que a lei de Lenz manda.
    // Com a cena parada elas não andam, então o sentido fica nas setas abaixo.
    const strength = Math.abs(current);
    // O sentido precisa ser legível também longe da espira, onde a corrente é
    // fraca: a intensidade aparece na velocidade das cargas, não em apagá-las.
    const visivel = alpha * Math.min(1, .72 + strength);
    if (strength > .04) {
      const direction = current > 0 ? -1 : 1;
      for (let turn = 0; turn < TURNS; turn++) for (let d = 0; d < 6; d++) {
        const angle = d / 6 * 2 * Math.PI + turn * .5 + direction * frame.elapsed * (1.1 + strength * 2.2);
        const p = project(ringPoint(turn, ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)));
        const size = 4.4 * p.scale * 2.3;
        items.push({ z: p.z - 1, paint: () => { ctx.globalAlpha = visivel; ctx.drawImage(kit.sprite(pal.acento, tema), p.x - size / 2, p.y - size / 2, size, size); } });
      }
    }

    items.sort((a, b) => b.z - a.z);
    for (const item of items) item.paint();
    ctx.globalAlpha = 1;

    // Polos do ímã, sempre legíveis por cima da barra.
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const north = project({ x: xm + HALF / 2, y: 0, z: 0 }), south = project({ x: xm - HALF / 2, y: 0, z: 0 });
    ctx.globalAlpha = alpha; ctx.fillStyle = tema === 'noite' ? '#0b1f1c' : '#fffaf0'; ctx.font = `700 ${Math.round(14 * north.scale + 2)}px Inter, Arial, sans-serif`;
    ctx.fillText('N', north.x, north.y); ctx.fillText('S', south.x, south.y);
    ctx.globalAlpha = 1;

    // Sentido da corrente, o campo que ela cria e o polo que a face vira.
    const fieldDirection = inducedFieldDirection(current), center = COIL_X + TURNS * GAP / 2;
    let fieldTip = project({ x: center, y: 0, z: 0 });
    if (fieldDirection !== 0) {
      ctx.globalAlpha = visivel;
      const direction = current > 0 ? -1 : 1;
      for (const angle of [.5 * Math.PI, 1.17 * Math.PI, 1.83 * Math.PI]) {
        const from = project(ringPoint(0, angle)), to = project(ringPoint(0, angle + direction * .14));
        arrowHead(ctx, from, to, 9, pal.acento);
      }
      const tail = project({ x: center - fieldDirection * 6, y: 0, z: 0 });
      fieldTip = project({ x: center + fieldDirection * (30 + 34 * strength), y: 0, z: 0 });
      ctx.strokeStyle = pal.acento; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tail.x, tail.y); ctx.lineTo(fieldTip.x, fieldTip.y); ctx.stroke();
      arrowHead(ctx, tail, fieldTip, 11, pal.acento);
      // Contorno na cor do fundo: a legenda passa por cima dos fios da espira.
      const write = (text: string, rawX: number, y: number) => { const halfText = ctx.measureText(text).width / 2 + 8, x = Math.max(halfText, Math.min(width - halfText, rawX)); ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = pal.fundo; ctx.strokeText(text, x, y); ctx.fillStyle = pal.texto; ctx.fillText(text, x, y); };
      ctx.font = '600 14px Inter, Arial, sans-serif';
      write('B induzido', fieldTip.x, fieldTip.y + (fieldDirection < 0 ? -18 : 24));
      const pole = facingPole(current), face = project({ x: COIL_X - 8, y: -RING - 16, z: 0 });
      if (pole) { ctx.font = '700 14px Inter, Arial, sans-serif'; write(`face ${pole}`, face.x, face.y); }
      ctx.globalAlpha = 1;
    }
    ctx.textBaseline = 'alphabetic';

    // A etiqueta aponta para o topo da espira nas etapas da corrente: apontada
    // para a ponta da seta, ela cobria justamente o "B induzido" que comenta.
    const anchor = phase === 0 ? project({ x: xm + HALF + 26, y: 30, z: 0 })
      : phase === 1 ? project({ x: xm + HALF, y: half, z: 0 })
      : project(ringPoint(TURNS - 1, 0));
    void fieldTip;
    placeHotspot(frame, anchor, hotspot.current, { minY: mobile ? 224 : 196, minX: mobile ? 122 : undefined });
  };

  const { shell, canvas } = useImmersiveCanvas({ state, variant: moving ? 'vaivem' : 'parado', camera: { rotation: .62, tilt: .2, tiltLimit: .5 }, draw });
  const parado = state.phase === 4 && !moving;
  // Trocar de etapa volta ao cenário em movimento: chegar à comparação já no
  // ímã parado esconderia o lado com que ela precisa ser comparada.
  const goTo = (value: number) => { setMoving(true); state.goTo(value); };

  return <ImmersiveShell
    state={{ ...state, goTo }} phases={LENZ_PHASES} refs={{ shell, canvas, hotspot }}
    sectionLabel="Cena imersiva: lei de Lenz"
    canvasLabel="Modelo tridimensional esquemático de um ímã em barra diante de uma espira. As etapas mostram o fluxo do campo pela espira, a corrente induzida ao aproximar e ao afastar o ímã, e a ausência de corrente com o ímã parado."
    eyebrow="Lei de Lenz · Indução eletromagnética" indicator="Exploração do campo" watermark="Φ" objeto="cena"
    reading={parado ? PARADO.reading : undefined} text={parado ? PARADO.text : undefined} detailText={parado ? PARADO.detail : undefined}
    hotspotHint={state.phase === 4 ? 'Compare na cena' : undefined}>
    {state.phase === 4 && <div className="cr-compare" role="group" aria-label="Cenário do ímã">
      <button type="button" className="cr-choice" aria-pressed={moving} onClick={() => setMoving(true)}>Ímã em movimento</button>
      <button type="button" className="cr-choice" aria-pressed={!moving} onClick={() => setMoving(false)}>Ímã parado</button>
    </div>}
  </ImmersiveShell>;
}

function arrowHead(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }, size: number, color: string) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - size * Math.cos(angle - .42), to.y - size * Math.sin(angle - .42));
  ctx.lineTo(to.x - size * Math.cos(angle + .42), to.y - size * Math.sin(angle + .42));
  ctx.closePath(); ctx.fill();
}
