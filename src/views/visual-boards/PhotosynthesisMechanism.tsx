import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../../design-system/motion/tokens';
import './PhotosynthesisMechanism.css';

const steps = [
  { label: 'Reações fotoquímicas', title: 'A energia chega como luz.', text: 'Nas membranas dos tilacoides, as reações fotoquímicas produzem ATP e NADPH. A água fornece elétrons; o oxigênio liberado vem da água.' },
  { label: 'Fixação de carbono', title: 'O carbono chega como CO₂.', text: 'No estroma, o ciclo de Calvin usa ATP e NADPH para incorporar CO₂ em moléculas orgânicas. Não depende diretamente de fótons, mas depende dos produtos das reações fotoquímicas.' },
  { label: 'Quimiossíntese', title: 'Outra fonte de energia; carbono inorgânico.', text: 'Certos procariontes obtêm energia oxidando substâncias inorgânicas, como compostos reduzidos de nitrogênio ou enxofre. Essa energia sustenta a fixação de CO₂, sem luz e sem cloroplasto.' },
] as const;

/** A finite flow drawing: reduced motion immediately shows every arrow. */
function Route({ d, color, replay }: { d: string; color: string; replay: string }) {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, '');
  return <g style={{ color }}>
    <defs><marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 8 4 0 8Z" fill="currentColor" /></marker></defs>
    <path d={d} fill="none" stroke="currentColor" opacity=".18" strokeWidth="3" markerEnd={`url(#${id})`} />
    <motion.path key={replay} d={d} fill="none" stroke="currentColor" strokeWidth="3" markerEnd={`url(#${id})`} initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : MOTION_DURATION.mechanism, ease: MOTION_EASE }} />
  </g>;
}

export default function PhotosynthesisMechanism() {
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const id = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : MOTION_DURATION.mechanism, ease: MOTION_EASE };
  const key = `${step}-${replay}`;
  const chemo = step === 2;
  return <div className="photo-mechanism">
    <div className="photo-art">
      <svg viewBox="0 0 520 500" role="img" aria-label={chemo ? 'Procarionte: oxidação inorgânica fornece energia para fixação de CO₂' : `Cloroplasto em corte: ${steps[step].label}`}>
        <defs>
          <linearGradient id={`${id}-green`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="var(--photo-light)" /><stop offset="1" stopColor="var(--photo-body)" /></linearGradient>
        </defs>
        <text x="28" y="34" className="photo-eyebrow">{chemo ? 'UM PROCARIONTE QUIMIOAUTOTRÓFICO' : 'DENTRO DO CLOROPLASTO'}</text>
        {chemo ? <>
          <path d="M126 202C85 255 94 355 166 378H362C433 367 442 265 398 216 358 173 166 162 126 202Z" fill={`url(#${id}-green)`} className="photo-envelope" />
          <path d="M136 215C101 261 111 340 173 363H355C414 352 424 272 387 226 352 188 170 178 136 215Z" className="photo-inner" />
          <path d="M162 329Q201 261 241 317T330 304Q366 258 380 307" className="photo-dna" />
          {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={153 + i * 39} cy={238 + i % 2 * 18} r="3" className="photo-dot" />)}
          <text x="26" y="87" className="photo-label">Substância inorgânica</text>
          <text x="26" y="109" className="photo-small">reduzida · fonte de energia</text>
          <Route d="M90 124Q83 194 155 223" color="var(--photo-gold)" replay={key} />
          <text x="145" y="277" className="photo-label">oxidação → energia</text>
          <text x="373" y="95" className="photo-label">CO₂</text>
          <Route d="M393 107Q399 169 315 219" color="var(--photo-blue)" replay={key} />
          <Route d="M336 340Q426 383 416 429" color="var(--photo-green)" replay={key} />
          <text x="279" y="453" className="photo-label">matéria orgânica</text>
          <text x="28" y="490" className="photo-small">Esquema metabólico; sem cloroplasto e sem luz.</text>
        </> : <>
          <path d="M43 277C22 203 92 148 240 160 389 143 488 189 483 280 479 368 365 395 220 381 102 386 53 347 43 277Z" fill={`url(#${id}-green)`} className="photo-envelope" />
          <path d="M55 278C36 214 99 164 239 175 381 158 474 198 468 280 465 353 363 380 222 367 111 372 65 339 55 278Z" className="photo-inner" />
          {Array.from({ length: 28 }, (_, i) => <circle key={i} cx={90 + i * 37 % 338} cy={192 + i * 23 % 139} r={i % 3 === 0 ? 1.8 : 1} fill="var(--photo-green)" opacity=".22" />)}
          <path d="M99 287Q145 260 211 282T331 278" className="photo-lamella" />
          {[0, 1, 2].map(stack => <g key={stack} transform={`translate(${93 + stack * 61} ${251 + stack % 2 * 17})`}>
            {[0, 1, 2, 3, 4].map(layer => <motion.ellipse key={`${layer}-${key}`} cx="0" cy={layer * 9} rx="24" ry="7" className="photo-thylakoid" initial={reduced ? false : { opacity: .6 }} animate={{ opacity: 1 }} transition={transition} />)}
          </g>)}
          <text x="97" y="338" className="photo-small">grana · tilacoides</text>
          <text x="347" y="343" className="photo-small">estroma</text>
          <motion.g animate={{ opacity: step === 0 ? 1 : .8 }} transition={transition}>
            <circle cx="94" cy="93" r="19" fill="var(--photo-gold)" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <path key={i} d="M94 61V51" transform={`rotate(${i * 45} 94 93)`} stroke="var(--photo-gold)" strokeWidth="2" />)}
            <text x="125" y="100" className="photo-label">luz</text>
            <Route d="M96 126 130 222" color="var(--photo-gold)" replay={key} />
            <text x="25" y="409" className="photo-label">H₂O</text>
            <Route d="M62 391Q44 330 77 289" color="var(--photo-blue)" replay={key} />
            <Route d="M147 316Q168 382 141 421" color="var(--photo-blue)" replay={key} />
            <text x="125" y="448" className="photo-label">O₂</text>
          </motion.g>
          <Route d="M241 251Q285 214 319 251" color="var(--photo-gold)" replay={key} />
          <text x="233" y="203" className="photo-small">ATP + NADPH</text>
          <Route d="M322 304Q285 341 243 304" color="var(--photo-gold)" replay={key} />
          <text x="227" y="360" className="photo-tiny">ADP + Pi · NADP⁺</text>
          <motion.g animate={{ opacity: step === 1 ? 1 : .8 }} transition={transition}>
            <circle cx="367" cy="269" r="43" fill="none" stroke="var(--photo-green)" strokeWidth="1.5" strokeDasharray="3 4" />
            <Route d="M338 240A40 40 0 1 1 328 271" color="var(--photo-green)" replay={key} />
            <text x="367" y="265" textAnchor="middle" className="photo-small">ciclo de</text><text x="367" y="282" textAnchor="middle" className="photo-small">Calvin</text>
            <text x="378" y="102" className="photo-label">CO₂</text>
            <Route d="M399 115Q417 176 386 221" color="var(--photo-blue)" replay={key} />
            <Route d="M399 299Q454 357 423 416" color="var(--photo-green)" replay={key} />
            <text x="315" y="445" className="photo-label">açúcares</text>
          </motion.g>
          <text x="28" y="490" className="photo-small">Esquema ampliado; fluxos não representam velocidades.</text>
        </>}
      </svg>
      <button type="button" className="photo-replay" onClick={() => setReplay(value => value + 1)}>Repetir os fluxos</button>
    </div>
    <div className="photo-reading">
      <div className="photo-steps" role="group" aria-label="Etapas da bioenergética">
        {steps.map((item, index) => <button key={item.label} type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span>0{index + 1}</span>{item.label}</button>)}
      </div>
      <div role="status"><h3>{steps[step].title}</h3><p>{steps[step].text}</p></div>
      <p className="photo-distinction"><strong>Energia ≠ carbono.</strong> Luz e oxidação inorgânica são fontes de energia. CO₂ é a fonte de carbono mostrada nos dois processos.</p>
    </div>
  </div>;
}
