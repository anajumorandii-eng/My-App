import { MOLECULAS, type IdMolecula, type Vetor } from '../../lib/geometriaMolecular';
import { makeParticles, makeSphereSprites, paintBackdrop, placeHotspot, type ImmersiveFrame } from './immersiveStage';
import { dipoloResultante, ESTAGIOS } from './vseprStages';

export interface MoleculeStage { left: number; right: number; top: number; bottom: number }

/** O palco divide a altura com título e leitura, como a referência da PCR. */
export function measureMoleculeStage(shell: HTMLDivElement | null, frame: Pick<ImmersiveFrame, 'width' | 'mobile'>): MoleculeStage {
  const { width, mobile } = frame;
  if (!shell) return { left: 18, right: width - 18, top: 250, bottom: 440 };
  const origin = shell.getBoundingClientRect();
  const rect = (selector: string) => shell.querySelector(selector)?.getBoundingClientRect();
  const intro = rect('.cr-intro'), tools = rect('.cr-tools'), reading = rect('.cr-temp');
  const bottomHeight = rect('.cr-bottom')?.height ?? 320;
  const top = mobile
    ? Math.max((intro?.bottom ?? origin.top) + 12, (reading?.bottom ?? origin.top) + 4, (tools?.bottom ?? origin.top) + 4) - origin.top
    : 108;
  // No desktop a molécula ocupa a direita do título e da leitura, sem empilhá-los.
  const left = mobile ? 18 : Math.max(width * .42, (intro?.right ?? origin.left + width * .46) - origin.left + 12);
  const right = mobile ? width - 18 : Math.min(width - 38, (tools?.left ?? origin.right - 24) - origin.left - 10);
  const minimumStage = mobile ? 172 : 260;
  // Os primeiros 48/64 px do bloco inferior já são degradê vazio: a etiqueta
  // usa essa faixa, em vez de acrescentar outra entre o objeto e a explicação.
  const required = Math.ceil(Math.max(mobile ? 812 : 820, top + minimumStage + 8 + bottomHeight));
  if (shell.style.minHeight !== `${required}px`) shell.style.minHeight = `${required}px`;
  return { left, right, top, bottom: Math.min(required - bottomHeight - 8, top + (mobile ? 220 : 350)) };
}

type ScreenPoint = { x: number; y: number };
/** Recorta cada traço (inclusive os paralelos) na superfície visível das esferas. */
export function clipBondToSpheres(a: ScreenPoint, b: ScreenPoint, radiusA: number, radiusB: number, offset = 0, stroke = 0) {
  const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
  const start = Math.sqrt(Math.max(0, (radiusA + stroke / 2) ** 2 - offset ** 2));
  const end = Math.sqrt(Math.max(0, (radiusB + stroke / 2) ** 2 - offset ** 2));
  if (length <= start + end) return null;
  const ux = dx / length, uy = dy / length;
  return {
    a: { x: a.x + ux * start - uy * offset, y: a.y + uy * start + ux * offset },
    b: { x: b.x - ux * end - uy * offset, y: b.y - uy * end + ux * offset },
  };
}

export function projectVsepr(direction: Vetor, rotation: number, tilt: number) {
  const x = direction[0] * Math.cos(rotation) + direction[2] * Math.sin(rotation);
  const depth = -direction[0] * Math.sin(rotation) + direction[2] * Math.cos(rotation);
  const y = direction[1] * Math.cos(tilt) - depth * Math.sin(tilt);
  const z = direction[1] * Math.sin(tilt) + depth * Math.cos(tilt);
  const perspective = 5 / (5 + z);
  return { x: x * perspective, y: -y * perspective, z, perspective };
}

const scaleVector = (v: Vetor, scale: number): Vetor => v.map(n => n * scale) as Vetor;
const mixVector = (a: Vetor, b: Vetor, t: number): Vetor => a.map((n, i) => n + (b[i] - n) * t) as Vetor;
const magnitude = (v: Vetor) => Math.hypot(...v);

type Cloud = { direction: Vetor; bond: number; pair: number };
export function makeVseprPainter() {
  const particles = makeParticles(14), sphere = makeSphereSprites();
  let current: Cloud[] | undefined;
  return (frame: ImmersiveFrame, id: IdMolecula, dipoles: boolean, stage: MoleculeStage, hotspot: HTMLButtonElement | null) => {
    const { ctx, pal, tema } = frame;
    paintBackdrop(frame, particles);
    const target = ESTAGIOS[id], molecule = MOLECULAS[id];
    if (!current) current = target.nuvens.map(n => ({ direction: [...n.direcao], bond: Number(n.tipo === 'ligacao'), pair: Number(n.tipo === 'par') }));
    current.forEach((cloud, index) => {
      const next = target.nuvens[index];
      cloud.direction = mixVector(cloud.direction, next.direcao, frame.ease);
      cloud.bond += (Number(next.tipo === 'ligacao') - cloud.bond) * frame.ease;
      cloud.pair += (Number(next.tipo === 'par') - cloud.pair) * frame.ease;
    });
    const project = (v: Vetor) => projectVsepr(v, frame.rotation, frame.tilt);
    const result = dipoles ? dipoloResultante(target) : null;
    // A aproximação usa a folga disponível sem ultrapassar o palco medido.
    const extents = current.filter(c => c.bond + c.pair > .005).map(c => project(c.direction));
    if (result) extents.push(project(scaleVector(result, 1.04)));
    const extentX = Math.max(.7, ...extents.map(p => Math.abs(p.x) + .32 * p.perspective));
    const extentY = Math.max(.7, ...extents.map(p => Math.abs(p.y) + .32 * p.perspective));
    const radius = Math.min((stage.right - stage.left) / (2 * extentX), (stage.bottom - stage.top) / (2 * extentY)) * Math.min(1, .9 + (frame.zoom - 1) * .4);
    const cx = (stage.left + stage.right) / 2, cy = (stage.top + stage.bottom) / 2;
    const point = (v: Vetor) => {
      const p = project(v);
      return { ...p, x: cx + p.x * radius, y: cy + p.y * radius };
    };
    type Point = ReturnType<typeof point>;
    type Item = { z: number; draw: () => void };
    const items: Item[] = [], atoms: Item[] = [];
    const symbols: (() => void)[] = [];
    const center = point([0, 0, 0]);
    const line = (a: Point, b: Point, color: string, width: number, alpha = 1) => {
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.globalAlpha = 1;
    };
    const atom = (p: Point, size: number, color: string, text: string, alpha = 1, central = false) => {
      const r = size * p.perspective;
      atoms.push({ z: p.z, draw: () => {
        ctx.globalAlpha = alpha;
        ctx.drawImage(sphere(color, tema), p.x - r * 1.14, p.y - r * 1.14, r * 2.28, r * 2.28);
      } });
      symbols.push(() => {
        ctx.globalAlpha = alpha;
        ctx.font = `650 ${Math.max(13, r * .75)}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = central && tema === 'caderno' ? pal.esfera[0] : pal.esfera[2];
        ctx.fillText(text, p.x, p.y + 1); ctx.globalAlpha = 1;
      });
    };
    const atomSize = Math.max(16, Math.min(27, radius * .23));
    current.forEach(cloud => {
      const p = point(cloud.direction);
      if (cloud.bond > .005) {
        const bond = cloud.bond;
        items.push({ z: p.z / 2, draw: () => {
          const width = Math.max(5, radius * .065) * (1 + p.perspective) / 2;
          const clipped = (offset: number, stroke: number, color: string) => {
            const segment = clipBondToSpheres(center, p, atomSize * 1.1, atomSize * .85 * p.perspective, offset, stroke);
            if (segment) line({ ...center, ...segment.a }, { ...p, ...segment.b }, color, stroke, bond);
          };
          if (id === 'CO2') for (const side of [-1, 1]) clipped(side * width * .65, width * .55, pal.poeira);
          else clipped(0, width, pal.poeira);
          clipped(0, 1, pal.fio);
        } });
        atom(p, atomSize * .85, pal.poeiraGrande, molecule.ligante, bond);
      }
      if (cloud.pair > .005) {
        const pair = cloud.pair, q = point(scaleVector(cloud.direction, .75));
        items.push({ z: q.z, draw: () => {
          ctx.save(); ctx.translate(q.x, q.y);
          ctx.rotate(Math.atan2(q.y - cy, q.x - cx));
          ctx.globalAlpha = pair * .16; ctx.fillStyle = pal.acento;
          ctx.beginPath(); ctx.ellipse(0, 0, atomSize * 1.5, atomSize * .85, 0, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = pair * .55; ctx.strokeStyle = pal.acento; ctx.lineWidth = 1; ctx.stroke();
          ctx.globalAlpha = pair; ctx.fillStyle = pal.acento;
          for (const offset of [-5, 5]) { ctx.beginPath(); ctx.arc(0, offset, 3, 0, Math.PI * 2); ctx.fill(); }
          ctx.restore();
        } });
      }
    });
    atom(center, atomSize * 1.1, pal.acento, molecule.central, 1, true);
    items.sort((a, b) => b.z - a.z).forEach(item => item.draw());
    atoms.sort((a, b) => b.z - a.z).forEach(item => item.draw());

    const bindings = target.nuvens.filter(n => n.tipo === 'ligacao');
    // O arco acompanha duas direções reais, mesmo quando a câmera as projeta.
    const a = bindings[0].direcao, b = bindings[1].direcao;
    const angle = molecule.anguloGraus * Math.PI / 180;
    let ortho: Vetor = angle > Math.PI - .001 ? [0, 1, 0] : b.map((v, i) => v - a[i] * Math.cos(angle)) as Vetor;
    ortho = scaleVector(ortho, 1 / (magnitude(ortho) || 1));
    const arc = (t: number) => point(a.map((v, i) => (v * Math.cos(t) + ortho[i] * Math.sin(t)) * .39) as Vetor);
    ctx.strokeStyle = pal.guia; ctx.lineWidth = 1.4; ctx.beginPath();
    for (let i = 0; i <= 32; i++) { const q = arc(angle * i / 32); if (i === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); }
    ctx.stroke();
    let anchor = arc(angle / 2);
    if (id === 'NH3') anchor = point(scaleVector(target.nuvens[0].direcao, .75));
    const arrow = (from: Vetor, to: Vetor, width = 2) => {
      const p = point(from), q = point(to), theta = Math.atan2(q.y - p.y, q.x - p.x);
      if (Math.hypot(q.x - p.x, q.y - p.y) < 4) return;
      line(p, q, pal.acento, width);
      ctx.fillStyle = pal.acento; ctx.beginPath(); ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x - 9 * Math.cos(theta - .42), q.y - 9 * Math.sin(theta - .42));
      ctx.lineTo(q.x - 9 * Math.cos(theta + .42), q.y - 9 * Math.sin(theta + .42)); ctx.closePath(); ctx.fill();
      // A cruz marca o lado positivo do dipolo elétrico.
      const x = p.x + Math.cos(theta) * 4, y = p.y + Math.sin(theta) * 4;
      line({ ...p, x: x - Math.sin(theta) * 4, y: y + Math.cos(theta) * 4 }, { ...p, x: x + Math.sin(theta) * 4, y: y - Math.cos(theta) * 4 }, pal.acento, 1.5);
    };
    if (dipoles) {
      bindings.forEach(n => {
        const v = n.direcao;
        // O deslocamento separa a seta da ligação que ela descreve.
        const offset = scaleVector([v[2], 0, -v[0]], .28 / (Math.hypot(v[0], v[2]) || 1));
        const at = (k: number): Vetor => v.map((x, i) => x * k + offset[i]) as Vetor;
        if (id === 'H2O') arrow(at(.85), at(.24)); else arrow(at(.24), at(.85));
      });
      if (result) {
        arrow(scaleVector(result, .2), scaleVector(result, 1.04), 3);
        anchor = point(scaleVector(result, 1.04));
      } else anchor = center;
    }
    placeHotspot(frame, anchor, hotspot, { minY: stage.bottom + 28, minX: frame.mobile ? 18 : Math.min(stage.left, frame.width - 264) });
    if (hotspot) hotspot.style.zIndex = '5';
    // Os símbolos ficam acima também do arco, dos dipolos e do fio da etiqueta.
    symbols.forEach(draw => draw());
  };
}
