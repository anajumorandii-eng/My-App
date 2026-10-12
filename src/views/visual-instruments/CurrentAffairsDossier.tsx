import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  EVIDENCE_LENS_LABEL,
  classifyStatement,
  type CurrentAffairsDossierConfig,
  type EvidenceLens,
} from '../../lib/currentAffairsContextLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './GeographyRemainingInstrument.css';
import './CurrentAffairsDossier.css';

const LENS_ORDER: EvidenceLens[] = ['fato', 'contexto', 'interpretacao', 'hipotese'];

/**
 * Cena da COP30: Belém no território amazônico, a linha do tempo desde Paris,
 * o pacote adotado, a rota para os fósseis que o texto não trouxe, os atores
 * que negociam por consenso e a avaliação. Cada peça carrega o tipo de
 * evidência da seção de onde sai; a lente escolhida acende só as do seu tipo.
 *
 * Em Testar e Reconstruir a etiqueta de tipo de cada peça fica em "?" até a
 * afirmação daquele tipo ser classificada certo — a cena só confirma o que a
 * estudante já separou, em vez de entregar a separação pronta.
 */
function Cop30Scene({ config, lens, revealed, onPick }: {
  config: CurrentAffairsDossierConfig;
  lens: EvidenceLens;
  revealed: Set<EvidenceLens>;
  onPick: (lens: EvidenceLens) => void;
}) {
  const reduced = useReducedMotion();
  const label = (id: string) => config.pieces.find((piece) => piece.id === id)?.label ?? id;
  const lensOf = (id: string) => config.pieces.find((piece) => piece.id === id)?.lens ?? 'fato';
  const on = (id: string) => lensOf(id) === lens;
  const tag = (kind: EvidenceLens) => (revealed.has(kind) ? EVIDENCE_LENS_LABEL[kind].toUpperCase() : '?');
  const transition = { duration: reduced ? 0 : 0.25 };
  const piece = (id: string, children: React.ReactNode) => (
    <motion.g
      className="vs-cop-piece"
      data-on={on(id) || undefined}
      initial={false}
      animate={{ opacity: on(id) ? 1 : 0.55 }}
      transition={transition}
      role="button"
      tabIndex={0}
      aria-label={`${label(id)} — ver como ${EVIDENCE_LENS_LABEL[lensOf(id)].toLowerCase()}`}
      onClick={() => onPick(lensOf(id))}
      onKeyDown={(event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPick(lensOf(id)); }
      }}
    >{children}</motion.g>
  );
  const stroke = (id: string) => (on(id) ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)');

  return <svg className="vs-plane vs-cop-scene" viewBox="0 0 360 320" role="group" aria-label={`Dossiê da COP30 com a lente ${EVIDENCE_LENS_LABEL[lens]} em foco`}>
    {/* Linha do tempo: o trecho depois de 2025 é tracejado porque é cenário, não registro. */}
    {piece('paris', <>
      <line x1="26" y1="38" x2="212" y2="38" stroke={stroke('paris')} strokeWidth="3"/>
      <circle cx="26" cy="38" r="5" fill={stroke('paris')}/>
      <text x="26" y="24" fontSize="10" fontWeight="800" fill="var(--vs-ink)">2015 · Acordo de Paris</text>
      <text x="119" y="54" textAnchor="middle" fontSize="9" fill="var(--vs-ink-muted)">10 anos depois</text>
      <text x="22" y="66" fontSize="8" fontWeight="900" fill="var(--vs-burgundy)" letterSpacing=".06em">{tag('contexto')}</text>
    </>)}
    {piece('futuro', <>
      <line x1="218" y1="38" x2="338" y2="38" stroke={stroke('futuro')} strokeWidth="3" strokeDasharray="5 5"/>
      <path d="M332 32 L342 38 L332 44" fill="none" stroke={stroke('futuro')} strokeWidth="3"/>
      <text x="338" y="24" textAnchor="end" fontSize="9.5" fill="var(--vs-ink)" className="vs-cop-hand">efeito futuro?</text>
      <text x="338" y="56" textAnchor="end" fontSize="8" fill="var(--vs-ink-muted)">depende de implementação</text>
      <text x="338" y="66" textAnchor="end" fontSize="8" fontWeight="900" fill="var(--vs-burgundy)" letterSpacing=".06em">{tag('hipotese')}</text>
    </>)}
    {piece('belem', <>
      <circle cx="215" cy="38" r="7" fill="var(--vs-burgundy)" stroke="var(--vs-paper)" strokeWidth="2"/>
      <text x="215" y="24" textAnchor="middle" fontSize="10" fontWeight="900" fill="var(--vs-burgundy)">2025 · COP30</text>
    </>)}

    {/* Território: bacia esquemática, rio correndo para a foz onde fica Belém. */}
    {piece('amazonia', <>
      <path d="M14 118 C 40 96, 92 94, 128 101 C 150 105, 166 109, 170 118 L 170 196 C 140 206, 74 208, 30 196 C 14 170, 10 140, 14 112 Z" fill="color-mix(in srgb, var(--vs-forest) 22%, var(--vs-paper))" stroke={stroke('amazonia')} strokeWidth="2"/>
      <path d="M22 168 C 52 150, 82 160, 110 140 S 150 122, 164 118" fill="none" stroke="var(--vs-blue)" strokeWidth="3" strokeLinecap="round"/>
      <text x="90" y="190" textAnchor="middle" fontSize="11" fill="var(--vs-ink)" className="vs-cop-hand">{label('amazonia')}</text>
      <text x="18" y="214" fontSize="8" fontWeight="900" fill="var(--vs-burgundy)" letterSpacing=".06em">{tag('contexto')}</text>
    </>)}
    {piece('belem', <>
      <path d="M164 118 c0 -12 -12 -14 -12 -22 a12 12 0 0 1 24 0 c0 8 -12 10 -12 22 z" fill="var(--vs-burgundy)"/>
      <circle cx="164" cy="96" r="4" fill="var(--vs-paper)"/>
      <text x="112" y="71" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="var(--vs-ink)">Belém (PA)</text>
      <text x="112" y="82" textAnchor="middle" fontSize="8.5" fill="var(--vs-ink-muted)">10–22 nov. 2025</text>
    </>)}

    {/* O pacote e o que ele contém. */}
    {piece('pacote', <>
      <rect x="190" y="80" width="158" height="58" rx="8" fill="var(--vs-paper)" stroke={stroke('pacote')} strokeWidth={on('pacote') ? 3 : 1.5}/>
      <text x="269" y="98" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="var(--vs-ink)">Pacote Político de Belém</text>
      <text x="269" y="114" textAnchor="middle" fontSize="9" fill="var(--vs-ink)">13 decisões de financiamento</text>
      <text x="269" y="127" textAnchor="middle" fontSize="8" fill="var(--vs-ink-muted)">registro da UNFCCC</text>
      <text x="342" y="133" textAnchor="end" fontSize="8" fontWeight="900" fill="var(--vs-burgundy)" letterSpacing=".06em">{tag('fato')}</text>
    </>)}
    {/* O que o texto não trouxe: caixa tracejada e vazia, porque a ausência é o fato. */}
    {piece('sem-rota', <>
      <rect x="190" y="150" width="158" height="44" rx="8" fill="none" stroke={stroke('sem-rota')} strokeWidth="2" strokeDasharray="6 4"/>
      <text x="269" y="168" textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--vs-ink)">rota formal para deixar os fósseis</text>
      <text x="269" y="183" textAnchor="middle" fontSize="8.5" fill="var(--vs-burgundy)">ausente no texto final</text>
    </>)}
    {piece('avaliacao', <>
      <path d="M352 86 C 360 120, 360 160, 352 190" fill="none" stroke={stroke('avaliacao')} strokeWidth="2"/>
      <text x="280" y="205" textAnchor="middle" fontSize="11.5" fill="var(--vs-ink)" className="vs-cop-hand">avanço real,</text>
      <text x="280" y="220" textAnchor="middle" fontSize="11.5" fill="var(--vs-ink)" className="vs-cop-hand">ambição incompleta</text>
      <text x="280" y="232" textAnchor="middle" fontSize="8" fontWeight="900" fill="var(--vs-burgundy)" letterSpacing=".06em">{tag('interpretacao')}</text>
    </>)}

    {/* Atores: três coalizões que só chegam ao pacote por consenso. */}
    <path d="M60 246 V238 H300 V246 M180 238 V232 H180" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="1.5"/>
    <path d="M180 232 C 180 160, 182 120, 188 110" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="1.5" markerEnd="url(#vs-cop-arrow)"/>
    <defs><marker id="vs-cop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="var(--vs-ink-muted)"/></marker></defs>
    <text x="186" y="228" fontSize="8" fill="var(--vs-ink-muted)">consenso</text>
    {([
      ['vulneraveis', 8, ['países vulneráveis', 'adaptação e', 'financiamento']],
      ['fosseis', 124, ['produtores e', 'consumidores de fósseis', 'divergem na transição']],
      ['sociedade', 240, ['sociedade civil e', 'povos indígenas', 'justiça climática']],
    ] as const).map(([id, x, lines]) => <React.Fragment key={id}>{piece(id, <>
      <rect x={x} y="246" width="112" height="56" rx="8" fill="var(--vs-paper)" stroke={stroke(id)} strokeWidth={on(id) ? 2.5 : 1.2}/>
      {lines.map((line, index) => <text key={line} x={x + 56} y={264 + index * 13} textAnchor="middle" fontSize={index === 0 ? 9 : 8.5} fontWeight={index === 0 ? 800 : 500} fill={index === 0 ? 'var(--vs-ink)' : 'var(--vs-ink-muted)'}>{line}</text>)}
    </>)}</React.Fragment>)}
    <text x="352" y="314" textAnchor="end" fontSize="8" fontWeight="900" fill="var(--vs-burgundy)" letterSpacing=".06em">ATORES · {tag('contexto')}</text>
  </svg>;
}

export function currentAffairsDossier(config: CurrentAffairsDossierConfig) {
  return function CurrentAffairsBoard(props: BoardProps) {
    const [lens, setLens] = useState<EvidenceLens>('fato');
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, EvidenceLens>>({});
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    const info = config.lenses.find((item) => item.lens === lens)!;
    const statement = config.statements[step];
    const answer = answers[statement.id];
    const verdict = answer ? classifyStatement(statement, answer) : null;
    const done = config.statements.filter((item) => answers[item.id] === item.lens).length;

    // Em Explorar a cena mostra o tipo de cada peça; nos desafios, só o tipo
    // que a estudante já acertou ao classificar.
    const revealed = new Set<EvidenceLens>(props.mode === 'explorar'
      ? LENS_ORDER
      : config.statements.filter((item) => answers[item.id] === item.lens).map((item) => item.lens));

    const answerWith = (choice: EvidenceLens) => {
      setAnswers((current) => ({ ...current, [statement.id]: choice }));
      // A cena passa a mostrar o tipo certo, acerte ou erre: a correção é visual também.
      setLens(statement.lens);
    };

    return <BoardShell kicker="Dossiê de atualidades" title={config.title} subtitle={config.question}
      condition={{ label: 'Lente', value: EVIDENCE_LENS_LABEL[lens] }}
      ariaLabel={`Dossiê de atualidades: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument vs-cop">
        <Cop30Scene config={config} lens={lens} revealed={revealed} onPick={setLens}/>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <p>Leia o caso por tipo de evidência:</p>
          <div className="vs-geography-options" role="group" aria-label="Tipo de evidência em foco">
            {LENS_ORDER.map((item) => <button key={item} type="button" aria-pressed={lens === item} onClick={() => setLens(item)}>{EVIDENCE_LENS_LABEL[item]}</button>)}
          </div>
        </div></div>
        <dl className="vs-cop-readout" aria-live="polite">
          <div><dt>Critério</dt><dd>{info.rule}</dd></div>
          <div data-pivot="true"><dt>No caso</dt><dd>{info.reading}</dd></div>
        </dl>
        <section className="vs-cop-sort" aria-labelledby="vs-cop-sort-title">
          <header>
            <h4 id="vs-cop-sort-title">Classifique a afirmação</h4>
            <span>{done} de {config.statements.length} certas</span>
          </header>
          <p className="vs-cop-statement">“{statement.text}”</p>
          <div className="vs-geography-options" role="group" aria-label="Que tipo de evidência é esta afirmação?">
            {LENS_ORDER.map((item) => <button key={item} type="button" aria-pressed={answer === item} onClick={() => answerWith(item)}>{EVIDENCE_LENS_LABEL[item]}</button>)}
          </div>
          <p className="vs-cop-verdict" role="status" data-correct={verdict ? String(verdict.correct) : undefined}>
            {verdict ? <><strong>{verdict.correct ? 'Certo.' : `É ${EVIDENCE_LENS_LABEL[verdict.expected].toLowerCase()}.`}</strong> {statement.why}</> : 'Escolha um tipo; a cena acende as peças dele.'}
          </p>
          <div className="vs-cop-steps">
            <button type="button" onClick={() => setStep((step + config.statements.length - 1) % config.statements.length)} aria-label="Afirmação anterior">←</button>
            <span>{step + 1} / {config.statements.length}</span>
            <button type="button" onClick={() => setStep((step + 1) % config.statements.length)} aria-label="Próxima afirmação">→</button>
          </div>
          <p className="vs-instrument-dica">Treino de leitura: não conta como tentativa. A resposta avaliada continua no formulário de {props.mode === 'reconstruir' ? 'Reconstruir' : 'Testar'}.</p>
        </section>
        <p className="vs-instrument-dica">{config.caution}</p>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? config.question, formula: 'contexto: onde, quando, entre quem' }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? info.reading, formula: 'atores negociam por consenso' }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Leitura de atualidades', general: config.relation, condition: EVIDENCE_LENS_LABEL[lens], reduced: info.rule }}
      closing={config.closing} />;
  };
}
