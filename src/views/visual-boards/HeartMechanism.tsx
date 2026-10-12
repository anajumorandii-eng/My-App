import React, { useEffect, useMemo, useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { casesRevealing, hiddenRelations, planStageFocus, sentenceWith } from '../../lib/stageFocus';
import type { BoardProps } from './types';
import { StageStepBar } from '../visual-stage/stageCases';

const stops = [
  { label: 'Corpo → veias cavas', text: 'Após as trocas nos tecidos, o sangue com menos O₂ retorna pelas veias cavas ao átrio direito.', x: 160, y: 232, oxygenated: false },
  { label: 'Átrio → ventrículo direito', text: 'O sangue atravessa a valva tricúspide e chega ao ventrículo direito.', x: 166, y: 333, oxygenated: false },
  { label: 'Ventrículo direito → pulmões', text: 'As artérias pulmonares saem do coração levando sangue com menos O₂ aos pulmões.', x: 123, y: 115, oxygenated: false },
  { label: 'Pulmões → átrio esquerdo', text: 'Após ganhar O₂ nos capilares pulmonares, o sangue retorna pelas veias pulmonares ao átrio esquerdo.', x: 348, y: 232, oxygenated: true },
  { label: 'Átrio → ventrículo esquerdo', text: 'O sangue atravessa a valva mitral e chega ao ventrículo esquerdo.', x: 354, y: 333, oxygenated: true },
  { label: 'Ventrículo esquerdo → corpo', text: 'A aorta leva sangue com mais O₂ aos tecidos. A circulação sistêmica se completa pelo retorno venoso.', x: 260, y: 445, oxygenated: true },
];
const routes = [
  [[260,445],[70,445],[70,232],[160,232]],
  [[160,232],[164,282],[166,333]],
  [[166,333],[114,333],[85,176],[123,115]],
  [[123,115],[220,80],[380,115],[422,178],[422,232],[348,232]],
  [[348,232],[350,282],[354,333]],
  [[354,333],[454,333],[454,445],[260,445]],
];
const linha = (r: number[][]) => r.map((p, j) => `${j ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');

/**
 * Estruturas tocáveis do coração. Cada uma tem um trecho do percurso (para a
 * etapa abrir o trecho certo) e os termos com que o capítulo a nomeia (para a
 * explicação sair do texto, nunca de legenda escrita aqui).
 */
const ESTRUTURAS = [
  { id: 'cavas', label: 'Veias cavas', termos: ['veias cavas'], trecho: 0, area: <path d={linha(routes[0])} /> },
  { id: 'ad', label: 'Átrio direito', termos: ['atrio direito'], trecho: 1, area: <rect x="120" y="202" width="132" height="76" rx="18" /> },
  { id: 'vd', label: 'Ventrículo direito', termos: ['ventriculo direito'], trecho: 2, area: <rect x="128" y="281" width="124" height="104" rx="22" /> },
  { id: 'ap', label: 'Artéria pulmonar', termos: ['arteria pulmonar'], trecho: 2, area: <path d={linha(routes[2].slice(1))} /> },
  { id: 'pulmoes', label: 'Pulmões', termos: ['pulmoes'], trecho: 3, area: <path d="M210 62C147 62 115 93 116 137Q157 171 220 139V72M293 62C356 62 388 93 387 137Q346 171 283 139V72" /> },
  { id: 'vp', label: 'Veias pulmonares', termos: ['veias pulmonares'], trecho: 3, area: <path d={linha(routes[3].slice(2))} /> },
  { id: 'ae', label: 'Átrio esquerdo', termos: ['atrio esquerdo'], trecho: 4, area: <rect x="258" y="202" width="132" height="76" rx="18" /> },
  { id: 've', label: 'Ventrículo esquerdo', termos: ['ventriculo esquerdo'], trecho: 5, area: <rect x="258" y="281" width="124" height="104" rx="22" /> },
  { id: 'aorta', label: 'Aorta', termos: ['aorta'], trecho: 5, area: <path d={linha(routes[5])} /> },
  { id: 'capilares', label: 'Capilares', termos: ['capilares'], trecho: 0, area: <rect x="150" y="452" width="220" height="30" rx="10" /> },
] as const;

const sectionsBySummary = new Map(interactiveSummaries.map((summary) => [summary.id, summary.sections]));
const REGRA = 'Artéria sai do coração; veia chega ao coração. Essa classificação depende da direção, não da quantidade de O₂.';

function VascularArea() {
  const [area, setArea] = useState(8);
  const velocity = 8 / area;
  return (
    <section className="vs-heart-area" aria-label="Modelo interativo de área vascular e velocidade">
      <div className="vs-heart-area-head"><span>Experimente · capilares em paralelo</span><strong>{area}× área → {Number.isInteger(velocity) ? velocity : velocity.toFixed(1).replace('.', ',')}× velocidade</strong></div>
      <div className="vs-heart-capillaries" aria-hidden="true">
        {Array.from({ length: area }, (_, index) => <span key={index} />)}
      </div>
      <label htmlFor="heart-vascular-area">Área transversal total relativa: {area}×</label>
      <input id="heart-vascular-area" type="range" min="1" max="8" value={area} onChange={(event) => setArea(Number(event.target.value))} />
      <p>Com vazão constante, v = Q ÷ A. Mais capilares em paralelo aumentam a área total e reduzem a velocidade média; o tempo de contato favorece as trocas.</p>
      <small>Valores relativos de um modelo, não medidas do corpo humano.</small>
    </section>
  );
}

/**
 * Circulação no palco: a etapa abre o trecho e as estruturas que a seção dela
 * discute; tocar numa câmara ou num vaso mostra a frase do capítulo sobre ela.
 * O modelo de área e velocidade, que ficava abaixo da prancha, mora aqui e
 * aparece quando a etapa fala de capilares (ou quando a estudante o abre).
 */
export default function HeartMechanism({ stage }: { stage?: Pick<BoardProps, 'map' | 'activeStep' | 'onStepChange' | 'mode' | 'hiddenEdgeIds'> }) {
  const [active, setActive] = useState(0);
  const [tocada, setTocada] = useState<string | null>(null);
  const [areaManual, setAreaManual] = useState<boolean | null>(null);
  const clock = useMechanismTime();
  const sections = stage ? sectionsBySummary.get(stage.map.summaryId) ?? [] : [];
  const step = stage?.activeStep;
  const plan = useMemo(() => (sections.length ? planStageFocus(ESTRUTURAS.map((e) => ({ label: e.label })), sections) : null), [sections]);
  const foco = step !== undefined && plan ? plan.byStep[step].filter((i) => plan.scores[step][i] > 0) : [];
  const focoKey = foco.join(',');

  // A etapa leva o percurso ao trecho da estrutura que a seção mais cita.
  useEffect(() => {
    if (step === undefined || !plan) return;
    const top = foco[0];
    if (top !== undefined) { clock.seek(0); setActive(ESTRUTURAS[top].trecho); }
    setAreaManual(null);
  }, [step, plan, focoKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const capilaresNaEtapa = foco.some((i) => ESTRUTURAS[i].id === 'capilares');
  const mostrarArea = areaManual ?? capilaresNaEtapa;

  const veladas = useMemo(() => {
    if (!stage || stage.mode !== 'reconstruir' || !stage.hiddenEdgeIds.length) return new Set<number>();
    const rel = hiddenRelations(stage.map.relations, stage.map.edges, stage.hiddenEdgeIds);
    return new Set(casesRevealing([...stops.map((s) => ({ label: s.label, claim: s.text })), { label: 'regra', claim: REGRA }], rel));
  }, [stage]);
  const regraCoberta = veladas.has(stops.length);
  const trechoCoberto = veladas.has(active);

  const estrutura = ESTRUTURAS.find((e) => e.id === tocada) ?? null;
  const explicacao = useMemo(() => {
    if (!estrutura) return null;
    const ordem = step === undefined ? sections.map((_, i) => i) : [step, ...sections.map((_, i) => i).filter((i) => i !== step)];
    for (const i of ordem) {
      const frase = sentenceWith(sections[i].content, [...estrutura.termos]);
      if (frase) return { frase, secao: sections[i].title, etapa: i };
    }
    return null;
  }, [estrutura, step, sections]);

  const route = routes[active];
  const index = Math.min(Math.floor(clock.time * (route.length - 1)), route.length - 2);
  const t = clock.time * (route.length - 1) - index;
  const a = route[index]; const b = route[index + 1];
  const tocar = (id: string) => () => setTocada(id === tocada ? null : id);

  return <MechanismFrame note="Esquema de conexões, não corte anatômico. Azul e vermelho indicam oxigenação relativa; o sangue não é azul." controls={<>
    {stage && step !== undefined && stage.onStepChange && <StageStepBar map={stage.map} step={step} mode={stage.mode} onStepChange={stage.onStepChange}>
      {stage.mode === 'reconstruir' && veladas.size > 0
        ? <p className="stage-lens-mission" role="note"><b>Desafio na cena.</b> Parte do percurso está coberta: siga a hemácia, toque nos vasos e escreva o vínculo na reconstrução do painel.</p>
        : <div className="stage-lens-focus">
          <span>{foco.length ? 'Nesta etapa o texto discute:' : 'O texto desta etapa não cita uma estrutura do desenho: explore livremente.'}</span>
          {foco.length > 0 && <ul>{foco.slice(0, 4).map((i) => <li key={ESTRUTURAS[i].id}><button type="button" aria-pressed={tocada === ESTRUTURAS[i].id} onClick={() => { setTocada(ESTRUTURAS[i].id); clock.seek(0); setActive(ESTRUTURAS[i].trecho); }}>{ESTRUTURAS[i].label}</button></li>)}</ul>}
        </div>}
    </StageStepBar>}
    <h3>Duas circulações, um percurso contínuo.</h3>
    <div className="mechanism-options" role="group" aria-label="Percurso do sangue">{stops.map((stop, i) => <button type="button" key={stop.label} aria-pressed={active === i} data-stage-veiled={veladas.has(i) ? 'true' : undefined} onClick={() => { clock.seek(0); setActive(i); }}>{i + 1}. {stop.label}</button>)}</div>
    <p role="status">{trechoCoberto ? 'Trecho coberto: siga a hemácia na figura e reconstrua o vínculo no painel.' : stops[active].text}</p>
    {regraCoberta
      ? <p className="stage-veiled-claim">A regra que classifica os vasos está coberta: toque nos vasos que saem e nos que chegam ao coração e escreva a regra na reconstrução.</p>
      : <p>{REGRA}</p>}
    {stage && <div className="vs-heart-explain" aria-live="polite">
      {estrutura
        ? explicacao
          ? <><small>{estrutura.label} · {explicacao.secao}</small><p>{explicacao.frase}</p>
            {stage.onStepChange && explicacao.etapa !== step && <button type="button" onClick={() => stage.onStepChange?.(explicacao.etapa)}>Ir à etapa “{explicacao.secao}”</button>}</>
          : <p><strong>{estrutura.label}</strong>: o capítulo não fala desta estrutura em separado.</p>
        : <p className="vs-heart-hint">Toque numa câmara ou num vaso do desenho: a explicação vem do capítulo.</p>}
    </div>}
    <TimeControl clock={clock} label="Percurso do trecho selecionado" />
    <button type="button" className="vs-heart-area-toggle" aria-expanded={mostrarArea} onClick={() => setAreaManual(!mostrarArea)}>{mostrarArea ? 'Fechar área e velocidade' : 'Área dos vasos e velocidade'}</button>
    {mostrarArea && <VascularArea />}
  </>}>
    {/* Com camada de toque, o desenho deixa de ser "img": filhos de img são
        apresentacionais e o leitor de tela não alcançaria as estruturas. */}
    <svg viewBox="0 0 520 510" role={stage ? 'group' : 'img'} aria-label={`Circulação humana: ${stops[active].label}`}>
      <text x="25" y="29" className="mf-heading">SIGA O FLUXO ENTRE AS CAVIDADES</text>
      <path d="M210 62C147 62 115 93 116 137Q157 171 220 139V72M293 62C356 62 388 93 387 137Q346 171 283 139V72" fill="color-mix(in srgb,var(--mf-red) 12%,var(--vs-paper))" stroke="var(--mf-red)" strokeWidth="2" />
      <path d="M252 55V92m0-9-61 39m61-39 61 39" fill="none" stroke="var(--vs-ink)" strokeWidth="3" /><text x="252" y="172" textAnchor="middle">pulmões · trocas gasosas</text>
      <path d="M144 197Q104 211 115 275L147 371Q220 426 255 394V228Q198 181 144 197Z" fill="color-mix(in srgb,var(--mf-blue) 15%,var(--vs-paper))" stroke="var(--mf-blue)" strokeWidth="3" />
      <path d="M255 228Q310 181 366 197 408 211 397 275L367 371Q296 426 255 394Z" fill="color-mix(in srgb,var(--mf-red) 15%,var(--vs-paper))" stroke="var(--mf-red)" strokeWidth="4" />
      {routes.map((r, i) => <path key={i} d={linha(r)} fill="none" stroke={i < 3 ? 'var(--mf-blue)' : 'var(--mf-red)'} strokeWidth={active === i ? 4 : 2} opacity={active === i ? 1 : .28} />)}
      <path d="M127 279H236M274 279H387" stroke="var(--vs-ink)" opacity=".5" strokeDasharray="4 5" />
      <text x="191" y="255" textAnchor="middle">AD</text><text x="193" y="355" textAnchor="middle">VD</text><text x="323" y="255" textAnchor="middle">AE</text><text x="319" y="355" textAnchor="middle">VE</text>
      <circle cx={a[0] + (b[0] - a[0]) * t} cy={a[1] + (b[1] - a[1]) * t} r="7" fill={stops[active].oxygenated ? 'var(--mf-red)' : 'var(--mf-blue)'} stroke="var(--vs-paper)" strokeWidth="2" />
      <text x="260" y="471" textAnchor="middle">corpo · trocas nos tecidos</text><text x="260" y="500" textAnchor="middle" className="mf-small">AD/VD: lado direito · AE/VE: lado esquerdo</text>
      {/* Camada de toque por cima do desenho: só existe no palco, onde há
          capítulo de onde tirar a explicação. */}
      {stage && <g className="vs-heart-hits">
        {ESTRUTURAS.map((e, i) => (
          <g key={e.id} role="button" tabIndex={0} aria-label={e.label} aria-pressed={tocada === e.id}
            className={`vs-heart-hit${foco.includes(i) ? ' vs-heart-hit--foco' : ''}${tocada === e.id ? ' vs-heart-hit--on' : ''}`}
            onClick={tocar(e.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); tocar(e.id)(); } }}>
            {e.area}
          </g>
        ))}
      </g>}
    </svg>
  </MechanismFrame>;
}
