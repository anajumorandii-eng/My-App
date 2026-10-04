import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { ReadingInstrumentId } from '../../lib/readingInstrumentLab';
import { accent, Caixa, dim, green, ink, paper, Pontas, Seta, T } from './sceneKit';
import { READING_INSTRUMENTS, readingState } from '../../lib/readingInstrumentLab';
import './ReadingInstrument.css';

// Auditoria 34: os 11 capítulos de Entendimento de Texto tinham rótulos
// certos, mas três formas genéricas para todos — fileira de caixas, degraus
// ou caixa com círculo. Nenhuma mostrava o objeto de leitura. Aqui cada
// capítulo desenha o objeto: o texto com as pistas, os dois textos em
// diálogo, a tira cômica, o quadro com o corte. Os dois estados de cada
// oficina trocam a operação em foco sobre o mesmo objeto.

/** Linhas de texto genéricas; `marcas` destaca as linhas-pista. */
function Pagina({ x, y, w, h, linhas = 7, marcas = [], cor = accent }: { x: number; y: number; w: number; h: number; linhas?: number; marcas?: number[]; cor?: string }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={paper} stroke={dim} strokeWidth="2" />
    {Array.from({ length: linhas }, (_, k) => {
      const ly = y + 18 + k * ((h - 26) / (linhas - 1 || 1));
      const lw = w - 24 - (k % 3) * 14;
      const marcada = marcas.includes(k);
      return <path key={k} d={`M${x + 12} ${ly}h${lw}`} stroke={marcada ? cor : dim} strokeWidth={marcada ? 5 : 2} strokeLinecap="round" opacity={marcada ? 0.85 : 0.5} />;
    })}
  </g>;
}

function Textualidade({ selected }: { selected: number }) {
  const reduced=useReducedMotion();
  return <g>
    <rect x="30" y="55" width="78" height="146" rx="5" fill={paper} stroke={ink} strokeWidth="3" />
    <circle cx="89" cy="130" r="3" fill={ink} />
    <circle cx="69" cy="93" r="20" fill="none" stroke={accent} strokeWidth="3" />
    <path d="M54 78L84 108" stroke={accent} strokeWidth="4" />
    <T x={69} y={229} tam={12}>proíbe entrar</T>
    <path d="M117 130H207" fill="none" stroke={selected===0?accent:green} strokeWidth="3" markerEnd={selected===0?'url(#wm-acc)':'url(#wm-ok)'} />
    {!reduced && <motion.path key={selected} d="M117 130H207" fill="none" stroke={selected===0?accent:green} strokeWidth="5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.45}} />}
    <circle cx="254" cy="106" r="12" fill={paper} stroke={ink} strokeWidth="2" />
    <path d="M254 118V156M254 133L237 143M254 133L269 143M254 156L241 179M254 156L269 179" stroke={ink} strokeWidth="3" fill="none" />
    {selected===0 ? <path d="M226 181L279 213M226 213L279 181" stroke={accent} strokeWidth="4" /> : <path d="M226 195L241 210L279 181" fill="none" stroke={green} strokeWidth="4" />}
    <T x={254} y={231} tam={12}>{selected===0?'autorizar contradiz':'aguardar é compatível'}</T>
  </g>;
}

function Nivel({ selected }: { selected: number }) {
  const inferir = selected === 1;
  return <g>
    <Pagina x={24} y={60} w={150} h={170} marcas={inferir ? [1, 5] : [3]} />
    {inferir ? <>
      <Seta d="M170 90Q220 100 228 136" cor="acc" /><Seta d="M170 200Q220 190 228 156" cor="acc" />
      <circle cx="250" cy="146" r="30" fill={`color-mix(in srgb, ${accent} 15%, ${paper})`} stroke={accent} strokeWidth="3" strokeDasharray="5 4" />
      <T x={250} y={151} cor={accent} tam={12}>inferência</T>
      <T x={250} y={200} cor={dim} tam={11} peso={600}>fora do texto,</T><T x={250} y={214} cor={dim} tam={11} peso={600}>apoiada nele</T>
    </> : <>
      <circle cx="120" cy="138" r="26" fill="none" stroke={green} strokeWidth="4" /><path d="M139 157l24 24" stroke={green} strokeWidth="6" strokeLinecap="round" />
      <T x={236} y={140} cor={green} tam={12}>está escrito:</T><T x={236} y={156} cor={green} tam={12}>localizar</T>
    </>}
  </g>;
}

function Intertexto({ selected }: { selected: number }) {
  const parodia = selected === 1;
  return <g>
    <Pagina x={20} y={70} w={110} h={140} linhas={6} marcas={[2]} cor={ink} />
    <T x={75} y={62} tam={11}>texto A</T>
    <Pagina x={190} y={70} w={110} h={140} linhas={6} marcas={[2]} cor={parodia ? accent : ink} />
    <T x={245} y={62} tam={11}>{parodia ? 'texto C' : 'texto B'}</T>
    {parodia
      ? <><path d="M120 116C150 80 170 160 200 116" stroke={accent} strokeWidth="3" fill="none" markerEnd="url(#wm-acc)" /><T x={160} y={232} cor={accent} tam={12}>a forma volta deslocada: humor ou crítica</T></>
      : <><Seta d="M120 116H200" cor="ok" larg={3} /><T x={160} y={106} cor={green} tam={16} peso={900}>“ ”</T><T x={160} y={232} cor={green} tam={12}>a fonte fica reconhecível</T></>}
  </g>;
}

function Generos({ selected }: { selected: number }) {
  const opiniao = selected === 1;
  return <g>
    {/* Notícia: manchete, colunas e a fonte. Artigo: uma voz, uma tese. */}
    <g opacity={opiniao ? 0.35 : 1}>
      <rect x="20" y="56" width="130" height="170" rx="6" fill={paper} stroke={opiniao ? dim : accent} strokeWidth={opiniao ? 2 : 3.5} />
      <path d="M32 76h106" stroke={ink} strokeWidth="7" />
      {[0, 1].map((c) => Array.from({ length: 7 }, (_, k) => <path key={`${c}${k}`} d={`M${32 + c * 56} ${98 + k * 13}h46`} stroke={dim} strokeWidth="2" />))}
      <T x={85} y={218} cor={accent} tam={11}>fonte: …</T>
      <T x={85} y={244} tam={12}>notícia</T>
    </g>
    <g opacity={opiniao ? 1 : 0.35}>
      <rect x="170" y="56" width="130" height="170" rx="6" fill={paper} stroke={opiniao ? accent : dim} strokeWidth={opiniao ? 3.5 : 2} />
      <circle cx="192" cy="80" r="11" fill="none" stroke={ink} strokeWidth="2" /><path d="M210 76h72M210 88h50" stroke={ink} strokeWidth="2" />
      <rect x="182" y="104" width="106" height="22" rx="4" fill={`color-mix(in srgb, ${accent} 18%, ${paper})`} /><T x={235} y={119} cor={accent} tam={11}>tese</T>
      {Array.from({ length: 5 }, (_, k) => <path key={k} d={`M182 ${142 + k * 14}h${96 - (k % 2) * 20}`} stroke={dim} strokeWidth="2" />)}
      <T x={235} y={244} tam={12}>artigo de opinião</T>
    </g>
  </g>;
}

function Narrativa({ selected }: { selected: number }) {
  const observador = selected === 1;
  const Pessoa = ({ x, y, cor }: { x: number; y: number; cor: string }) => <g><circle cx={x} cy={y} r="9" fill={paper} stroke={cor} strokeWidth="2.5" /><path d={`M${x} ${y + 9}v26m-14-16h28m-14 16l-10 18m10-18l10 18`} stroke={cor} strokeWidth="2.5" fill="none" /></g>;
  return <g>
    <rect x="40" y="70" width="170" height="140" rx="10" fill={`color-mix(in srgb, ${dim} 8%, ${paper})`} stroke={dim} strokeWidth="2" />
    <T x={125} y={62} tam={11}>a cena</T>
    <Pessoa x={90} y={120} cor={observador ? dim : accent} /><Pessoa x={160} y={120} cor={dim} />
    {observador ? <>
      <path d="M252 140q18-14 36 0q-18 14-36 0Z" fill={paper} stroke={accent} strokeWidth="2.5" /><circle cx="270" cy="140" r="5" fill={accent} />
      <Seta d="M250 140H214" cor="acc" tracejada />
      <T x={270} y={176} cor={accent} tam={11}>narra de fora:</T><T x={270} y={190} cor={accent} tam={11}>“ele”, “ela”</T>
    </> : <>
      <path d="M100 96q30-30 70-26q-12 16-50 22Z" fill={paper} stroke={accent} strokeWidth="2" /><T x={140} y={86} cor={accent} tam={11}>“eu”</T>
      <T x={262} y={140} cor={accent} tam={11}>conta de</T><T x={262} y={154} cor={accent} tam={11}>dentro: vê</T><T x={262} y={168} cor={accent} tam={11}>só sua parte</T>
    </>}
  </g>;
}

function NaoVerbal({ selected }: { selected: number }) {
  const ausencia = selected === 1;
  return <g>
    <defs><clipPath id="reading-poster-crop"><rect x="38" y="58" width={ausencia ? 168 : 244} height="158" /></clipPath></defs>
    <rect x="38" y="58" width={ausencia ? 168 : 244} height="158" fill={paper} stroke={accent} strokeWidth="3" />
    <g clipPath="url(#reading-poster-crop)">
      <path d="M38 198Q150 182 282 198V216H38Z" fill={`color-mix(in srgb, ${green} 22%, ${paper})`} />
      <path d="M139 190V120M139 148L116 126M139 156L163 130" fill="none" stroke={ink} strokeWidth="7" />
      <path d="M91 127Q69 102 93 85Q98 63 126 73Q151 58 170 80Q198 82 184 111Q189 137 160 140Q125 152 91 127Z" fill={`color-mix(in srgb, ${green} 32%, ${paper})`} stroke={green} strokeWidth="2" />
      <circle cx="241" cy="158" r="10" fill={paper} stroke={ink} strokeWidth="2" />
      <path d="M241 168V193M241 176L223 184M241 176L258 181M241 193L229 209M241 193L252 209" stroke={ink} strokeWidth="3" fill="none" />
      <path d="M222 184L206 187L215 198L229 194Z" fill={accent} />
    </g>
    {ausencia && <><path d="M241 158v49" stroke={dim} strokeWidth="2" strokeDasharray="4 4" /><T x={259} y={253} cor={accent} tam={11}>cuidador fora</T></>}
    <T x={160} y={236} cor={dim} tam={12} peso={600}>{ausencia ? 'o corte seleciona o que se vê' : 'o olhar é conduzido primeiro aqui'}</T>
  </g>;
}

function Funcoes({ selected }: { selected: number }) {
  const apelativa = selected === 1;
  return <g>
    <Caixa x={20} y={110} w={80} h={48} linhas={['emissor']} />
    <Caixa x={120} y={110} w={80} h={48} linhas={['mensagem']} />
    <Caixa x={220} y={110} w={80} h={48} linhas={['destinatário', apelativa ? '“faça!”' : '']} estado={apelativa ? 'falha' : 'neutro'} />
    <Seta d="M100 134H118" /><Seta d="M200 134H218" />
    <Caixa x={120} y={196} w={80} h={40} linhas={['referente']} estado={apelativa ? 'neutro' : 'falha'} />
    <path d="M160 158V194" stroke={apelativa ? dim : accent} strokeWidth={apelativa ? 2 : 3.5} />
    <T x={160} y={86} cor={accent} tam={12}>{apelativa ? 'o foco é convocar quem lê' : 'o foco é o assunto e o contexto'}</T>
  </g>;
}

function Poetica({ selected }: { selected: number }) {
  const arranjo = selected === 1;
  const versos = [[40, 70, 60], [50, 40, 80], [60, 60, 40], [44, 80, 50]];
  return <g>
    {versos.map((v, k) => {
      let x = 50;
      return <g key={k}>{v.map((w, j) => {
        const desloc = arranjo && k === 2 && j === 1;
        const el = <rect key={j} x={x} y={70 + k * 36 + (desloc ? -14 : 0)} width={w} height="16" rx="5" fill={desloc ? `color-mix(in srgb, ${accent} 30%, ${paper})` : `color-mix(in srgb, ${dim} 18%, ${paper})`} stroke={desloc ? accent : 'none'} strokeWidth="2" transform={desloc ? `rotate(-8 ${x + w / 2} ${78 + k * 36})` : undefined} />;
        x += w + 8;
        return el;
      })}{!arranjo && <circle cx={52 + v[0] - 4} cy={78 + k * 36} r="6" fill={accent} />}</g>;
    })}
    {!arranjo && <path d="M92 78Q70 120 88 150Q70 190 92 222" stroke={accent} strokeWidth="2" fill="none" strokeDasharray="4 4" />}
    <T x={160} y={236} cor={accent} tam={12}>{arranjo ? 'palavra fora do lugar previsto: estranhamento' : 'o mesmo som volta: ritmo e insistência'}</T>
  </g>;
}

function Figuras({ selected }: { selected: number }) {
  const ironia = selected === 1;
  if (!ironia) return <g>
    <circle cx="90" cy="140" r="46" fill={`color-mix(in srgb, ${dim} 12%, ${paper})`} stroke={dim} strokeWidth="2" /><T x={90} y={144} tam={11}>campo A</T>
    <circle cx="230" cy="140" r="46" fill={`color-mix(in srgb, ${accent} 12%, ${paper})`} stroke={accent} strokeWidth="2" /><T x={230} y={144} tam={11}>campo B</T>
    <path d="M218 104Q160 60 102 104" stroke={accent} strokeWidth="3" fill="none" markerEnd="url(#wm-acc)" />
    <circle cx="232" cy="118" r="6" fill={accent} /><circle cx="96" cy="118" r="6" fill={accent} />
    <T x={160} y={72} cor={accent} tam={11}>uma qualidade atravessa</T>
    <T x={160} y={218} cor={dim} tam={12} peso={600}>metáfora: aproximação por semelhança</T>
  </g>;
  return <g>
    <path d="M40 74h120a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H86l-16 18v-18H40a10 10 0 0 1-10-10V84a10 10 0 0 1 10-10Z" fill={paper} stroke={ink} strokeWidth="2.5" />
    <T x={100} y={108} tam={14} peso={900}>“Que rapidez!”</T>
    <rect x="190" y="84" width="110" height="100" rx="8" fill={`color-mix(in srgb, ${dim} 14%, ${paper})`} stroke={accent} strokeWidth="2.5" />
    <circle cx="245" cy="116" r="23" fill={paper} stroke={dim} strokeWidth="2" />
    <path d="M245 99v17l16 8" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
    {[218, 244, 270].map(x => <g key={x}><circle cx={x} cy="150" r="4" fill={ink} /><path d={`M${x} 155v9m-5-5h10`} stroke={ink} strokeWidth="2" /></g>)}
    <T x={245} y={178} cor={accent} tam={11}>2 horas na fila</T>
    <T x={170} y={124} cor={accent} tam={20} peso={900}>≠</T>
    <T x={160} y={218} cor={dim} tam={12} peso={600}>ironia: o contexto contraria o dito</T>
  </g>;
}

function Distorcoes({ selected }: { selected: number }) {
  const hipotese = selected === 1;
  return <g>
    <Pagina x={20} y={70} w={130} h={150} linhas={7} marcas={hipotese ? [1, 4] : []} cor={green} />
    <circle cx="250" cy="200" r="16" fill={paper} stroke={ink} strokeWidth="2.5" />
    {hipotese ? <>
      <Caixa x={190} y={80} w={112} h={50} linhas={['hipótese', 'explica as marcas']} estado="ok" />
      <Seta d="M150 90H188" cor="ok" /><Seta d="M150 146Q170 140 190 118" cor="ok" />
      <T x={236} y={250} cor={green} tam={11}>testa no texto</T>
    </> : <>
      <path d="M196 76q-8-20 16-22q10-16 32-6q22-8 30 12q20 6 8 24q4 20-22 18h-50q-26-4-14-26Z" fill={`color-mix(in srgb, ${accent} 15%, ${paper})`} stroke={accent} strokeWidth="2.5" />
      <T x={236} y={96} cor={accent} tam={11}>o que eu já</T><T x={236} y={110} cor={accent} tam={11}>achava</T>
      <circle cx="232" cy="160" r="4" fill={accent} /><circle cx="242" cy="178" r="5" fill={accent} />
      <path d="M156 146h20" stroke={accent} strokeWidth="3" /><T x={166} y={138} cor={accent} tam={14} peso={900}>✕</T>
      <T x={236} y={250} cor={accent} tam={11}>sem evidência</T>
    </>}
  </g>;
}

function Comico({ selected }: { selected: number }) {
  const quebra = selected === 1;
  return <g>
    {[0, 1, 2].map((k) => {
      const ativo = quebra ? k === 2 : k < 2;
      return <g key={k}>
        <rect x={20 + k * 96} y={70} width="88" height="120" rx="6" fill={paper} stroke={ativo ? accent : dim} strokeWidth={ativo ? 3.5 : 2} />
        <circle cx={64 + k * 96} cy={140} r="12" fill="none" stroke={ink} strokeWidth="2" />
        <path d={`M${64 + k * 96} 152v22`} stroke={ink} strokeWidth="2" />
        {k < 2 && <path d={`M${40 + k * 96} 88h48v18H${54 + k * 96}l-6 8v-8h-8Z`} fill={paper} stroke={dim} strokeWidth="1.5" />}
        {k === 2 && <T x={64 + k * 96} y={106} cor={accent} tam={26} peso={900}>!</T>}
      </g>;
    })}
    <path d="M40 206H180" stroke={quebra ? dim : accent} strokeWidth="3" markerEnd={quebra ? 'url(#wm-ink)' : 'url(#wm-acc)'} />
    <T x={110} y={226} cor={quebra ? dim : accent} tam={11}>a regra esperada se arma</T>
    <T x={256} y={226} cor={quebra ? accent : dim} tam={11}>a virada desloca</T>
    <T x={160} y={250} cor={ink} tam={12}>{quebra ? 'que contradição a virada expõe?' : 'qual hábito o começo ativa?'}</T>
  </g>;
}

function Tdic({ selected }: { selected: number }) {
  const situado = selected === 1;
  const reduzir = useReducedMotion();
  return <g>
    <rect x="130" y="112" width="60" height="96" rx="10" fill={paper} stroke={ink} strokeWidth="3" /><circle cx="160" cy="196" r="4" fill={ink} />
    <T x={160} y={228} tam={11}>ferramenta</T>
    <motion.g initial={false} animate={{ opacity: situado ? 1 : 0.18 }} transition={reduzir ? { duration: 0 } : { duration: 0.3 }}>
      {[[60, 90], [260, 90], [60, 190], [260, 190]].map(([x, y], k) => <g key={k}><circle cx={x} cy={y} r="12" fill={paper} stroke={accent} strokeWidth="2.5" /><path d={`M${x < 160 ? x + 14 : x - 14} ${y}L${x < 160 ? 128 : 192} ${160}`} stroke={accent} strokeWidth="2" strokeDasharray="4 4" /></g>)}
      <T x={60} y={66} cor={accent} tam={11}>uso</T><T x={260} y={66} cor={accent} tam={11}>acesso</T>
      <T x={60} y={222} cor={accent} tam={11}>trabalho</T><T x={260} y={222} cor={accent} tam={11}>poder</T>
    </motion.g>
    <T x={160} y={252} cor={situado ? accent : dim} tam={12}>{situado ? 'quem usa, com que acesso, e quem é afetado' : 'descrever o recurso não basta'}</T>
  </g>;
}

function ReadingDiagram({ id, selected }: { id: ReadingInstrumentId; selected: number }) {
  const cenas: Record<ReadingInstrumentId, React.ReactNode> = {
    textuality: <Textualidade selected={selected} />,
    levels: <Nivel selected={selected} />, intertext: <Intertexto selected={selected} />, genres: <Generos selected={selected} />,
    narrative: <Narrativa selected={selected} />, nonverbal: <NaoVerbal selected={selected} />, functions: <Funcoes selected={selected} />,
    poetic: <Poetica selected={selected} />, figures: <Figuras selected={selected} />, distortions: <Distorcoes selected={selected} />,
    comic: <Comico selected={selected} />, tdic: <Tdic selected={selected} />,
  };
  return <g><Pontas />{cenas[id]}</g>;
}

function Evidence({ text, clues }: { text: string; clues: string[] }) {
  const parts: React.ReactNode[] = [];
  let rest = text;
  while (rest) {
    const next = clues.map(clue => ({clue, at:rest.indexOf(clue)})).filter(match => match.at >= 0)
      .sort((a,b) => a.at-b.at || b.clue.length-a.clue.length)[0];
    if (!next) { parts.push(rest); break; }
    if (next.at) parts.push(rest.slice(0,next.at));
    parts.push(<mark key={parts.length}>{next.clue}</mark>);
    rest=rest.slice(next.at+next.clue.length);
  }
  return <>{parts}</>;
}

export function ReadingMechanismScene({ id, selected }: { id: ReadingInstrumentId; selected: number }) {
  const config=READING_INSTRUMENTS[id], state=readingState(id,selected);
  const reduced=useReducedMotion();
  return <figure className="reading-scene" data-motion={reduced ? 'reduced' : 'normal'}>
    <div className="reading-documents">{config.documents.map(document => <article key={document.label}>
      <h3>{document.label}</h3>
      <blockquote>{document.lines.map((line,i) => <p key={i}><Evidence text={line} clues={state.evidence} /></p>)}</blockquote>
    </article>)}</div>
    {id==='distortions' && <p className={selected===0 ? 'reading-rejected' : 'reading-supported'}>
      {selected===0 ? 'Todos aprendem melhor sozinhos.' : 'Alguns alunos desta turma leram melhor na condição descrita.'}
    </p>}
    <div className="reading-diagram-window" role="region" aria-label="Percorrer o esquema de leitura com as setas" tabIndex={0}
      onKeyDown={event => {
        if(event.key==='ArrowRight'||event.key==='ArrowLeft') {
          event.preventDefault();event.currentTarget.scrollBy({left:event.key==='ArrowRight'?100:-100,behavior:'instant'});
        }
      }}>
      <svg className="reading-diagram" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${state.label}: ${state.diagnosis}`}>
        <ReadingDiagram id={id} selected={selected} />
        <text x="160" y="278" textAnchor="middle" className="reading-diagram-caption">{state.label}</text>
      </svg>
    </div>
    <figcaption><p className="reading-annotation">{state.annotation}</p><p className="reading-finding">{state.reading}</p></figcaption>
  </figure>;
}
