import React, { useId, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MOLECULAS, ehPolar, momentoResultante, type IdMolecula } from '../../../lib/geometriaMolecular';
import { rotateSpatialPoint, type SpatialPoint } from '../../../lib/spatialSolid';
import { sentenceWith, normalizeFocusText } from '../../../lib/stageFocus';
import { useSpatialRotation } from '../../../hooks/useSpatialRotation';
import { StageCaseLens, useStageCases, VEILED_CLAIM } from '../../visual-stage/stageCases';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import { MolecularGlyph } from '../MolecularGlyph';
import './GeometriaMolecularStage.css';

/**
 * Geometria Molecular dentro do palco: a molécula girável é a cena, e a galeria
 * de geometrias, a leitura de polaridade e os controles de rotação vivem nela.
 *
 * Antes eram dois blocos empilhados — o modelo 3D (MolecularObjectView) e, abaixo,
 * a galeria de seis cartões — que rolavam juntos e nunca conversavam: escolher
 * "Angular (H2O)" na galeria não mudava a molécula de cima. Agora o caso
 * escolhido (pela etapa ou pelo toque) é a molécula girada, e cada parte dela
 * (átomo central, ligante, ligação, par isolado) é um ponto tocável explicado
 * por uma frase do próprio capítulo.
 */

// O caso da cena aponta para a molécula do módulo puro; SO2 não tem modelo
// espacial lá, então fica no desenho plano em vez de ganhar coordenadas
// inventadas aqui.
const MOLECULA_DO_CASO: Record<string, IdMolecula | null> = {
  Linear: 'CO2',
  'Trigonal plana': 'BF3',
  'Angular (SO2)': null,
  'Tetraédrica': 'CH4',
  'Piramidal trigonal': 'NH3',
  'Angular (H2O)': 'H2O',
};

type Parte = 'central' | 'ligante' | 'ligacao' | 'par';

// Termos procurados no capítulo para explicar cada parte. A frase sai do texto
// da etapa ativa primeiro; sem ocorrência ali, das outras seções, em ordem.
const TERMOS: Record<Parte, string[]> = {
  central: ['atomo central'],
  ligante: ['pares ligantes', 'par ligante'],
  ligacao: ['momento dipolar', 'momentos dipolares', 'ligacoes polares', 'ligacoes covalentes'],
  par: ['pares isolados', 'par isolado'],
};
const NOME: Record<Parte, string> = { central: 'Átomo central', ligante: 'Átomo ligante', ligacao: 'Ligação', par: 'Par isolado' };

function encurtar(frase: string) {
  if (frase.length <= 280) return frase;
  const corte = frase.slice(0, 276);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
}

export function GeometriaMolecularStage({ entry }: { entry: SceneEntry }) {
  const cases = useStageCases(entry.items, Math.max(0, entry.items.findIndex((it) => it.label === 'Piramidal trigonal')));
  const t = useSceneMotion();
  const rotation = useSpatialRotation(25, 14);
  const uid = useId().replace(/:/g, '');
  const [parte, setParte] = useState<Parte | null>(null);
  const [vetoresManual, setVetoresManual] = useState<boolean | null>(null);
  const item = entry.items[cases.active];
  const id = MOLECULA_DO_CASO[item.label] ?? null;
  const m = id ? MOLECULAS[id] : null;
  const coberto = cases.veiled.has(cases.active);
  const sections = cases.stage?.sections ?? [];
  const textoEtapa = sections[cases.step]?.content ?? '';

  // Os vetores de ligação aparecem sozinhos quando a etapa fala de momento
  // dipolar (aplicação e pegadinhas, neste capítulo); a estudante pode ligar ou
  // desligar à mão, e a escolha dela vale até trocar de etapa.
  const etapaFalaDePolaridade = /dipol|polar/.test(normalizeFocusText(textoEtapa));
  const [etapaDaEscolha, setEtapaDaEscolha] = useState(cases.step);
  if (etapaDaEscolha !== cases.step) { setEtapaDaEscolha(cases.step); setVetoresManual(null); }
  const vetores = vetoresManual ?? etapaFalaDePolaridade;

  const explicacao = useMemo(() => {
    if (!parte) return null;
    const ordem = [cases.step, ...sections.map((_, i) => i).filter((i) => i !== cases.step)];
    for (const i of ordem) {
      const frase = sections[i] && sentenceWith(sections[i].content, TERMOS[parte]);
      if (frase) return { frase: encurtar(frase), secao: sections[i].title };
    }
    return null;
  }, [parte, cases.step, sections]);

  const escala = 82;
  const project = (p: SpatialPoint) => {
    const [x, y, z] = rotateSpatialPoint(p.map((v) => v * escala) as SpatialPoint, rotation.yaw, rotation.pitch);
    return { x: 160 + x, y: 145 - y, z };
  };

  const tocar = (alvo: Parte) => (event: React.SyntheticEvent) => { event.stopPropagation(); setParte(alvo); };
  const parteProps = (alvo: Parte, rotulo: string) => ({
    role: 'button' as const, tabIndex: 0, 'aria-label': rotulo, 'aria-pressed': parte === alvo,
    className: `gm-part gm-part--${alvo}${parte === alvo ? ' gm-part--on' : ''}`,
    // O arraste da molécula começa no <svg>; tocar numa parte não pode virar
    // giro, senão a captura do ponteiro engole o clique.
    onPointerDown: (event: React.PointerEvent) => event.stopPropagation(),
    onClick: tocar(alvo),
    onKeyDown: (event: React.KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); tocar(alvo)(event); } },
  });

  const objetos: { depth: number; el: React.ReactNode }[] = [];
  if (m) {
    const c = project([0, 0, 0]);
    m.ligacoes.forEach((v, i) => {
      const p = project(v);
      const dupla = m.id === 'CO2';
      const dx = p.x - c.x, dy = p.y - c.y, d = Math.hypot(dx, dy) || 1;
      const ux = dx / d, uy = dy / d;
      // A ligação termina na superfície das esferas: atravessá-las riscava o
      // símbolo do ligante (o "H" da amônia ficava cortado ao meio).
      const a = { x: c.x + ux * 23, y: c.y + uy * 23 }, z = { x: p.x - ux * 17, y: p.y - uy * 17 };
      const visivel = d > 42;
      const ox = -uy * 3.5, oy = ux * 3.5;
      objetos.push({ depth: (c.z + p.z) / 2 - 1, el: <g key={`b${i}`} {...parteProps('ligacao', `Ligação ${m.central}–${m.ligante}`)}>
        <line x1={c.x} y1={c.y} x2={p.x} y2={p.y} className="gm-hit" />
        {visivel && (dupla ? <><line x1={a.x + ox} y1={a.y + oy} x2={z.x + ox} y2={z.y + oy} className="gm-bond" /><line x1={a.x - ox} y1={a.y - oy} x2={z.x - ox} y2={z.y - oy} className="gm-bond" /></>
          : <line x1={a.x} y1={a.y} x2={z.x} y2={z.y} className="gm-bond" />)}
      </g> });
      objetos.push({ depth: p.z, el: <g key={`l${i}`} transform={`translate(${p.x} ${p.y})`} {...parteProps('ligante', `Átomo ligante ${m.ligante}`)}>
        <circle r={17} className="gm-atom gm-atom--ligante" /><text y={5} textAnchor="middle" className="gm-symbol">{m.ligante}</text>
      </g> });
    });
    m.paresLivres.forEach((v, i) => {
      const p = project(v.map((n) => n * 0.78) as SpatialPoint);
      objetos.push({ depth: p.z, el: <g key={`p${i}`} transform={`translate(${p.x} ${p.y})`} {...parteProps('par', 'Par isolado do átomo central')}>
        <ellipse rx={19} ry={14} className="gm-pair" /><circle cx={-5} r={3} className="gm-dot" /><circle cx={5} r={3} className="gm-dot" />
      </g> });
    });
    objetos.push({ depth: c.z, el: <g key="c" transform={`translate(${c.x} ${c.y})`} {...parteProps('central', `Átomo central ${m.central}`)}>
      <circle r={23} className="gm-atom gm-atom--central" /><text y={6} textAnchor="middle" className="gm-symbol gm-symbol--central">{m.central}</text>
    </g> });
    objetos.sort((a, b) => a.depth - b.depth);
  }

  // Soma dos vetores das ligações (convenção do módulo puro: todos no sentido
  // da ligação, ligantes iguais). Desenhada sem ponta de seta: o sentido do
  // dipolo químico depende de eletronegatividade, que esta cena não modela.
  const soma = m ? m.ligacoes.reduce<SpatialPoint>((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]) : null;
  const polar = m ? ehPolar(m) : null;
  const resultante = m ? momentoResultante(m) : 0;

  return (
    <section className="tc-scene tc-chem-scene gm-stage" aria-label={entry.question}>
      <header><small>CRIVO · modelo químico</small><h4>{entry.question}</h4></header>
      <StageCaseLens cases={cases} items={entry.items} />
      <div className="gm-layout">
        <div className="gm-viewer">
          {m ? (
            <svg {...rotation.interaction} viewBox="0 0 320 290" className="gm-svg" role="group"
              aria-label={`${m.formula}, ${coberto ? 'geometria a reconstruir' : `geometria ${m.geometria}, ${m.anguloGraus.toLocaleString('pt-BR')}°`}. Arraste ou use as setas para girar; toque numa parte para a explicação do capítulo.`}
              data-view-yaw={rotation.yaw} data-molecule={m.id}>
              <defs>
                <radialGradient id={`${uid}-c`} cx="32%" cy="26%" r="80%"><stop offset="0" className="gm-g-light" /><stop offset="1" className="gm-g-central" /></radialGradient>
              </defs>
              <ellipse cx="160" cy="272" rx="96" ry="10" className="gm-ground" />
              {objetos.map((o) => o.el)}
              {vetores && soma && (() => {
                const c = project([0, 0, 0]);
                const ponta = project(soma.map((n) => n * 0.9) as SpatialPoint);
                return <g className="gm-vectors" aria-hidden="true">
                  {m.ligacoes.map((v, i) => { const p = project(v.map((n) => n * 0.62) as SpatialPoint); return <line key={i} x1={c.x} y1={c.y} x2={p.x} y2={p.y} className="gm-vector" />; })}
                  {polar ? <motion.line x1={c.x} y1={c.y} initial={false} animate={{ x2: ponta.x, y2: ponta.y }} transition={t} className="gm-resultant" />
                    : <circle cx={c.x} cy={c.y} r={30} className="gm-cancel" />}
                </g>;
              })()}
            </svg>
          ) : (
            <div className="gm-flat" role="img" aria-label={`${item.label}: desenho plano`}>
              <MolecularGlyph label={item.label} />
              <p>Sem modelo espacial desta molécula no CRIVO: o desenho plano mostra as três regiões, com o par isolado.</p>
            </div>
          )}
          {m && <div className="gm-camera" role="group" aria-label="Câmera do modelo">
            <button type="button" onClick={() => rotation.setYaw((v) => (v + 330) % 360)}>Girar −30°</button>
            <button type="button" onClick={() => rotation.setYaw((v) => (v + 30) % 360)}>Girar +30°</button>
            <button type="button" aria-pressed={rotation.spinning} onClick={rotation.toggleSpin}>{rotation.spinning ? 'Pausar giro' : 'Volta completa'}</button>
            <button type="button" onClick={rotation.reset}>Restaurar</button>
            <button type="button" aria-pressed={vetores} onClick={() => setVetoresManual(!vetores)}>Vetores de ligação</button>
          </div>}
        </div>

        <div className="gm-side">
          <div className="gm-reading" role="status" aria-live="polite">
            <strong>{item.label}{m ? ` · ${m.formula}` : ''}</strong>
            {coberto
              ? <p className="stage-veiled-claim">{VEILED_CLAIM}</p>
              : <>
                <p>{item.claim}</p>
                {m && <p className="gm-numbers">{m.paresLigantes} ligantes · {m.paresNaoLigantes} pares isolados · soma dos vetores {resultante.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} → {polar ? 'polar' : 'apolar'}</p>}
              </>}
          </div>
          <div className="gm-explain" aria-live="polite">
            {explicacao
              ? <><small>{parte ? NOME[parte] : ''} · {explicacao.secao}</small><p>{explicacao.frase}</p></>
              : <p className="gm-hint">{m ? 'Toque no átomo central, num ligante, numa ligação ou num par isolado: a explicação vem do capítulo.' : 'Escolha uma geometria com modelo espacial para tocar nas partes.'}</p>}
          </div>
          <div className="gm-gallery" role="group" aria-label="Molécula do modelo">
            {entry.items.map((it, i) => (
              <button key={it.label} type="button" className="tc-chem-card gm-card" aria-pressed={cases.active === i}
                data-stage-focus={cases.stage && cases.focus.includes(i) ? 'true' : undefined} data-stage-veiled={cases.veiled.has(i) ? 'true' : undefined}
                onClick={() => { setParte(null); cases.choose(i); }}>
                <span className="tc-chem-visual"><MolecularGlyph label={it.label} /></span>
                <strong>{it.label}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
      {!coberto && <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>}
      <p className="qf-nota">Modelo esquemático: esferas fora de escala; a rotação conserva os ângulos. Pares isolados indicam regiões eletrônicas, não átomos.</p>
    </section>
  );
}
