import React, { useId, useState } from 'react';
import { MOLECULAS, ORDEM, ehPolar, momentoResultante, type IdMolecula } from '../../lib/geometriaMolecular';
import { DNA_B, parNaPosicao } from '../../lib/duplaHelice';
import { basePair } from '../../lib/biologyInstrumentLab';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import './ScienceObjectView.css';

type Atom = { point: SpatialPoint; label: string; kind: 'central' | 'ligand' | 'free' | 'backbone'; radius: number };
type Bond = { from: SpatialPoint; to: SpatialPoint; kind?: 'hydrogen' | 'backbone'; count?: number };

/** Ordenação em profundidade mantém ligações e átomos atrás ou à frente ao girar. */
export function ScienceObjectDrawing({ atoms, bonds, yaw, description }: { atoms: Atom[]; bonds: Bond[]; yaw: number; description: string }) {
  const uid = useId().replace(/:/g, '');
  const project = (p: SpatialPoint) => {
    const [x, y, z] = rotateSpatialPoint(p, yaw, 12);
    return { x: 160 + x, y: 150 - y, z };
  };
  const objects = [
    ...bonds.map((bond, index) => {
      const a = project(bond.from), b = project(bond.to);
      // Ligações terminam na superfície das esferas, sem cobrir símbolos químicos.
      const radius = (point: SpatialPoint) => atoms.find(atom => atom.point.every((v, i) => Math.abs(v - point[i]) < 1e-6))?.radius ?? 0;
      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      const ra = radius(bond.from), rb = radius(bond.to);
      const visible = distance > ra + rb;
      const ux = distance ? (b.x - a.x) / distance : 0, uy = distance ? (b.y - a.y) / distance : 0;
      const start = { x: a.x + ux * ra, y: a.y + uy * ra };
      const end = { x: b.x - ux * rb, y: b.y - uy * rb };
      return { depth: (a.z + b.z) / 2, element: <g key={'bond-' + index} className={'vs-science-bond ' + (bond.kind ?? '')}>
        {Array.from({ length: visible ? (bond.count ?? 1) : 0 }, (_, i) => <line key={i} x1={start.x} y1={start.y + (i - ((bond.count ?? 1) - 1) / 2) * 4} x2={end.x} y2={end.y + (i - ((bond.count ?? 1) - 1) / 2) * 4} />)}
      </g> };
    }),
    ...atoms.map((atom, index) => {
      const p = project(atom.point);
      return { depth: p.z, element: <g key={'atom-' + index} className={'vs-science-atom ' + atom.kind} transform={`translate(${p.x} ${p.y})`}>
        <circle r={atom.radius} fill={`url(#${uid}-${atom.kind})`} />
        {atom.label && <text textAnchor="middle" y="4">{atom.label}</text>}
      </g> };
    }),
  ].sort((a, b) => a.depth - b.depth);
  return <svg className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" aria-label={description}>
    <defs>{(['central', 'ligand', 'free', 'backbone'] as const).map(kind => <radialGradient key={kind} id={`${uid}-${kind}`} cx="30%" cy="24%" r="80%">
      <stop className={`vs-science-${kind}-light`} /><stop offset=".5" className={`vs-science-${kind}-mid`} /><stop offset="1" className={`vs-science-${kind}-dark`} />
    </radialGradient>)}</defs>
    <ellipse cx="160" cy="278" rx="92" ry="11" className="vs-science-ground" />
    {objects.map(object => object.element)}
  </svg>;
}

export function MolecularObjectView() {
  const [id, setId] = useState<IdMolecula>('NH3');
  const [yaw, setYaw] = useState(25);
  const m = MOLECULAS[id], polar = ehPolar(m);
  const position = (v: SpatialPoint): SpatialPoint => v.map(n => n * 82) as SpatialPoint;
  const atoms: Atom[] = [{ point: [0, 0, 0], label: m.central, kind: 'central', radius: 24 },
    ...m.ligacoes.map(v => ({ point: position(v), label: m.ligante, kind: 'ligand' as const, radius: 18 })),
    ...m.paresLivres.map(v => ({ point: position(v), label: '••', kind: 'free' as const, radius: 20 }))];
  const bonds: Bond[] = m.ligacoes.map(v => ({ from: [0, 0, 0], to: position(v) }));
  const uid = useId();
  return <section className="vs-science-card" aria-label="Modelo molecular tridimensional">
    <header><small>QUÍMICA · MODELO ESPACIAL</small><h4>Gire para entender a geometria</h4></header>
    <div className="vs-science-choices" role="group" aria-label="Molécula do modelo">
      {ORDEM.map(mid => <button key={mid} type="button" aria-pressed={id === mid} onClick={() => setId(mid)}>{MOLECULAS[mid].formula}</button>)}
    </div>
    <ScienceObjectDrawing atoms={atoms} bonds={bonds} yaw={yaw} description={`${m.formula}: geometria ${m.geometria}, ângulo ${m.anguloGraus.toLocaleString('pt-BR')} graus; ${polar ? 'polar' : 'apolar'}. As esferas claras com dois pontos representam pares livres.`} />
    <label className="vs-science-rotation" htmlFor={uid}>Girar a molécula <output>{yaw}°</output></label>
    <input id={uid} type="range" min="0" max="360" value={yaw} onChange={event => setYaw(Number(event.target.value))} />
    <p className="vs-science-reading" role="status" aria-label="Leitura molecular"><strong>{m.geometria} · {m.anguloGraus.toLocaleString('pt-BR')}° · {polar ? 'polar' : 'apolar'}</strong><br />{m.paresLigantes} ligantes · {m.paresNaoLigantes} pares livres. Soma dos vetores de ligação: {momentoResultante(m).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}.</p>
    <p className="vs-science-caption">Modelo esquemático: ligantes iguais têm o mesmo peso na soma. Esferas não estão em escala; a rotação conserva os ângulos. Os pares livres indicam regiões eletrônicas, não átomos.</p>
  </section>;
}

export function NucleicObjectView({ value }: { value: number }) {
  const [yaw, setYaw] = useState(25);
  const selected = basePair(value);
  const atoms: Atom[] = [], bonds: Bond[] = [];
  const tracks: [SpatialPoint[], SpatialPoint[]] = [[], []];
  for (let i = 0; i < 10; i++) {
    const angle = i * 2 * Math.PI / DNA_B.paresPorVolta;
    const y = (i - 4.5) * DNA_B.subidaPorParNm * 55;
    const a: SpatialPoint = [Math.cos(angle) * 55, y, Math.sin(angle) * 55];
    const b: SpatialPoint = [-a[0], y, -a[2]];
    const pair = i === 5 ? selected : parNaPosicao(i);
    const template = 'template' in pair ? pair.template : pair.molde;
    const complementary = 'dna' in pair ? pair.dna : pair.complementar;
    const count = 'hydrogenBonds' in pair ? pair.hydrogenBonds : pair.pontesDeHidrogenio;
    tracks[0].push(a); tracks[1].push(b);
    atoms.push({ point: a, label: i === 5 ? template : '', kind: 'central', radius: i === 5 ? 14 : 8 }, { point: b, label: i === 5 ? complementary : '', kind: 'ligand', radius: i === 5 ? 14 : 8 });
    bonds.push({ from: a, to: b, kind: 'hydrogen', count: i === 5 ? count : 1 });
    if (i > 0) tracks.forEach(track => bonds.push({ from: track[i - 1], to: track[i], kind: 'backbone' }));
  }
  return <div className="vs-nucleic-object">
    <ScienceObjectDrawing atoms={atoms} bonds={bonds} yaw={yaw} description={`Dupla-hélice esquemática de DNA-B; par destacado ${selected.template}–${selected.dna}, ${selected.hydrogenBonds} pontes de hidrogênio. RNA transcrito: ${selected.rna}.`} />
    <div className="vs-science-choices" role="group" aria-label="Rotação do DNA">
      <button type="button" onClick={() => setYaw((yaw + 330) % 360)}>Girar −30°</button>
      <button type="button" onClick={() => setYaw((yaw + 30) % 360)}>Girar +30°</button>
      <button type="button" onClick={() => setYaw(25)}>Restaurar vista</button>
    </div>
    <p className="vs-science-caption">DNA-B: aproximadamente 10 pares por volta. Sequência ilustrativa; o controle de base altera o par destacado. Traços entre bases representam pontes de H; as fitas são antiparalelas. Consulte “Pareamento” para comparar DNA e RNA.</p>
  </div>;
}
