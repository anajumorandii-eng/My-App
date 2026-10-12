import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import ThermochemMechanism from './ThermochemMechanism';
import { StageCaseLens, bridgeFromBoard, useStageCases, VEILED_CLAIM } from '../visual-stage/stageCases';
import { GIBBS_CASES } from './stageCaseItems';

/**
 * ΔG = ΔH − TΔS como reta em T. No palco a etapa escolhe o que a reta mostra:
 * o intercepto (ΔH, em T = 0 K), a inclinação (−ΔS) ou o cruzamento ΔG = 0. O
 * cursor de temperatura percorre a reta e a leitura do sinal sai da posição do
 * ponto, não de um texto fixo — antes o desenho era estático e trocar de etapa
 * não mudava nada.
 */
function GibbsScene({ stage }: { stage?: BoardProps }) {
  const casos = useStageCases(GIBBS_CASES, 2, bridgeFromBoard(stage));
  const [t, setT] = React.useState(0.25);
  const ativo = casos.active;
  const coberto = casos.veiled.has(ativo);
  const x = 42 + 220 * t;
  const y = 88 + 160 * t;
  // Fora do palco a prancha segue estática, como sempre foi (MechanismExpansion).
  const palco = casos.stage !== null;
  const sinal = Math.abs(y - 168) < 4 ? 'ΔG = 0 · equilíbrio' : y < 168 ? 'ΔG > 0 · não espontânea' : 'ΔG < 0 · espontânea';
  return <div className="vs-gibbs">
    <StageCaseLens cases={casos} items={GIBBS_CASES} />
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" aria-label={palco ? `Balanço de energia livre de Gibbs: ΔG = ΔH − TΔS; ponto na temperatura escolhida: ${sinal}` : 'Balanço de energia livre de Gibbs: entalpia menos temperatura vezes entropia determina a espontaneidade'}>
      <text x="160" y="42" textAnchor="middle" className="vs-scene-caption">ΔG = ΔH − TΔS</text>
      <path d="M42 168H278M42 62V276" fill="none" stroke="var(--vs-ink)" strokeWidth="1.5" />
      <text x="267" y="190" className="vs-part-sub">T aumenta</text>
      <text x="18" y="72" className="vs-part-sub">ΔG</text>
      <text x="49" y="190" className="vs-part-sub">T = 0 K</text>
      <text x="35" y="92" textAnchor="end" className={ativo === 0 ? 'vs-part-label' : 'vs-part-sub'}>ΔH</text>
      {ativo === 0 && <circle cx="42" cy="88" r="9" fill="none" stroke="var(--vs-amber)" strokeWidth="3" />}
      <path d="M42 88L262 248" fill="none" stroke="var(--vs-blue)" strokeWidth={ativo === 1 ? 6 : 4} />
      {ativo === 1 && <><path d="M120 145h50v36" fill="none" stroke="var(--vs-amber)" strokeWidth="2" strokeDasharray="4 3" /><text x="176" y="166" className="vs-part-sub">inclinação −ΔS</text></>}
      <circle cx="152" cy="168" r={ativo === 2 ? 9 : 6} fill={ativo === 2 ? 'var(--vs-amber)' : 'none'} stroke="var(--vs-ink)" />
      {ativo === 2 && <text x="170" y="153" className="vs-part-label">ΔG = 0 · equilíbrio</text>}
      <text x="74" y="65" className="vs-part-label">ΔG &gt; 0</text>
      <text x="204" y="268" className="vs-part-label">ΔG &lt; 0</text>
      <text x="74" y="80" className="vs-part-sub">não espontânea</text>
      <text x="204" y="284" className="vs-part-sub">espontânea</text>
      {palco && <><path d={`M${x} 168V${y}`} stroke="var(--vs-amber)" strokeDasharray="3 3" />
      <circle cx={x} cy={y} r="7" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="2" /></>}
      <text x="160" y="304" textAnchor="middle" className="vs-scene-caption">para ΔS &gt; 0, elevar T favorece a espontaneidade</text>
    </svg>
    {palco && <>
    <label className="vs-gibbs-control">Temperatura (esquemática)
      <input type="range" min={0} max={1} step={0.01} value={t} onChange={(event) => setT(Number(event.target.value))} aria-valuetext={sinal} />
    </label>
    <div className="mechanism-options" role="group" aria-label="O que a reta mostra">
      {GIBBS_CASES.map((item, i) => <button type="button" key={item.label} aria-pressed={ativo === i} onClick={() => casos.choose(i)}>{item.label}</button>)}
    </div>
    <p role="status"><strong>{sinal}.</strong> {coberto ? VEILED_CLAIM : GIBBS_CASES[ativo].claim}</p>
    </>}
  </div>;
}

export default function ThermochemBoard(props: BoardProps) {
  const par = boardPair(props);
  const gibbs = props.map.summaryId === 'summary-quimica-termoquimica-ii';
  return <BoardShell
    title={gibbs ? 'Espontaneidade: entalpia e entropia' : 'Entalpia e o sinal de ΔH'}
    subtitle={gibbs ? 'Espontânea não significa rápida: significa ΔG negativo.' : 'O sinal é do sistema, não de quem sente o calor.'}
    condition={{ label: gibbs ? 'critério' : 'referência', value: gibbs ? 'ΔG < 0' : 'o sistema' }}
    ariaLabel={gibbs ? 'Prancha de termoquímica sobre entropia e energia livre de Gibbs' : 'Prancha de termoquímica: entalpia e energia de ativação'}
    scene={gibbs ? <GibbsScene stage={props} /> : <ThermochemMechanism stage={props} />} sceneFirst emphasis={par.emphasis}
    left={gibbs ? { label: 'Entalpia · ΔH', headline: 'Favorece quando diminui.', detail: 'Um ΔH negativo contribui para tornar ΔG negativo, mas não decide sozinho: a contribuição entrópica depende da temperatura.', formula: 'ΔG = ΔH − TΔS' } : { label: 'Exotérmica', headline: 'Os produtos ficam abaixo.', detail: 'O sistema libera calor para a vizinhança. O sinal de ΔH se refere à variação de entalpia do sistema.', formula: 'ΔH < 0 · Hprodutos < Hreagentes' }}
    right={gibbs ? { label: 'Entropia · ΔS', headline: 'Pesa mais em temperatura alta.', detail: 'Se ΔS é positivo, o termo −TΔS reduz ΔG cada vez mais à medida que a temperatura absoluta aumenta.', formula: 'T em kelvin · ΔS em J·K⁻¹' } : { label: 'Endotérmica', headline: 'Os produtos ficam acima.', detail: 'O sistema absorve calor. A decomposição térmica do carbonato de cálcio é um exemplo; dissoluções podem ser endo ou exotérmicas.', formula: 'ΔH > 0 · Hprodutos > Hreagentes' }}
    leftState={par.leftState} rightState={par.rightState} leftSelected={par.leftSelected} rightSelected={par.rightSelected} onSelectLeft={par.selectLeft} onSelectRight={par.selectRight}
    equation={{ label: gibbs ? 'Critério de Gibbs' : 'Definição', general: gibbs ? 'ΔG = ΔH − TΔS' : 'ΔH = Hprod − Hreag', condition: gibbs ? 'pressão e T constantes' : 'exotérmica', reduced: gibbs ? 'ΔG < 0: espontânea' : 'ΔH < 0' }}
    supports={<><section className="vs-formula-note"><span className="vs-note-title">Condições importam</span><strong>{gibbs ? 'Use kelvin e unidades compatíveis' : 'Estado físico e quantidade'}</strong><p>{gibbs ? 'Converta ΔH para joules se ΔS estiver em J·K⁻¹·mol⁻¹. O ponto ΔG = 0 marca equilíbrio, não reação encerrada.' : 'Ao combinar dados, mantenha estados físicos, temperatura e quantidades compatíveis com a reação pretendida.'}</p></section><section className="vs-formula-note"><span className="vs-note-title">Não confunda</span><strong>{gibbs ? 'Espontaneidade não é velocidade' : 'ΔH não é energia de ativação'}</strong><p>{gibbs ? 'ΔG informa a tendência termodinâmica. A energia de ativação e o caminho cinético determinam se a transformação ocorre rapidamente.' : 'A barreira influencia a velocidade; ΔH é o saldo entre produtos e reagentes. A análise de espontaneidade exige outras informações.'}</p></section></>}
    closing={gibbs ? 'entalpia e entropia competem no mesmo saldo; a temperatura multiplica a contribuição entrópica e pode inverter o sinal de ΔG.' : 'produto abaixo significa ΔH negativo; produto acima significa ΔH positivo, sempre do ponto de vista do sistema.'}
  />;
}
