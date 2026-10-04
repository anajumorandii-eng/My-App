import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ENGLISH_INSTRUMENTS, englishInstrumentState, type EnglishInstrumentId } from '../../lib/englishInstrumentLab';

function Words({ x, y, children, anchor = 'start', accent = false }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end'; accent?: boolean }) {
  return <text x={x} y={y} textAnchor={anchor} className={accent ? 'english-diagram-accent' : undefined}>{children.split('|').map((line, i) => <tspan x={x} dy={i ? 20 : 0} key={i}>{line}</tspan>)}</text>;
}
function Arrow({ d, selected, dashed = false }: { d: string; selected: number; dashed?: boolean }) {
  const reduced = useReducedMotion();
  return <>
    <path d={d} className="english-relation" strokeDasharray={dashed ? '5 5' : undefined} />
    {!reduced && <motion.path key={`${selected}-${d}`} d={d} className="english-relation english-relation-trace" aria-hidden="true" initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: 0 }} transition={{ pathLength: { duration: .5 }, opacity: { delay: .55, duration: .15 } }} />}
  </>;
}
function EvidenceText({ text, clues }: { text: string; clues: string[] }) {
  const sorted = [...clues].sort((a, b) => b.length - a.length);
  const segments: React.ReactNode[] = [];
  let rest = text, key = 0;
  while (rest) {
    const matches = sorted.map(clue => ({ clue, at: rest.indexOf(clue) })).filter(match => match.at >= 0).sort((a, b) => a.at - b.at);
    const next = matches[0];
    if (!next) { segments.push(rest); break; }
    if (next.at) segments.push(rest.slice(0, next.at));
    segments.push(<mark key={key++}>{next.clue}</mark>);
    rest = rest.slice(next.at + next.clue.length);
  }
  return <>{segments}</>;
}

function Mechanism({ id, selected }: { id: EnglishInstrumentId; selected: number }) {
  const reduced = useReducedMotion();
  const arrow = (d: string, dashed = false) => <Arrow d={d} selected={selected} dashed={dashed} />;
  if (id === 'taxonomy-hierarchy') {
    const group = selected === 0 ? ['VERTEBRADOS', 'RÉPTEIS', 'COBRAS'] : ['VERTEBRADOS', 'MAMÍFEROS', selected === 2 ? 'MORCEGOS' : 'amamentam filhotes'];
    return <>
      <path d="M16 28H304V213H16Z M40 75H280V197H40Z M70 126H250V181H70Z" className="english-outline" />
      <Words x={28} y={52}>{group[0]}</Words><Words x={52} y={100}>{group[1]}</Words><Words x={160} y={151} anchor="middle" accent>{group[2]}</Words>
      {arrow('M258 164V61m-6 8 6-8 6 8')}
      <Words x={20} y={238} accent>{selected === 2 ? 'include → exemplo; which → bats' : 'membro → grupo, sem inverter'}</Words>
    </>;
  }
  if (id === 'poetry-reading') return <>
    <path d="M40 37V167M34 37H46M34 167H46" className="english-outline" />
    <Words x={62} y={64} accent>{selected === 0 ? 'Still I wait.' : selected === 1 ? 'loud → exterior' : 'Hope → ideia'}</Words>
    <Words x={62} y={124} accent>{selected === 0 ? 'Still I listen.' : selected === 1 ? 'quiet → interior' : 'door → imagem'}</Words>
    {arrow(selected === 0 ? 'M61 73H111M61 133H111M190 64C246 74 246 108 190 122' : selected === 1 ? 'M183 70L183 115m-6-8 6 8 6-8' : 'M182 65Q256 82 182 120m7-11-7 11 13-2')}
    <Words x={40} y={198}>{selected === 0 ? 'retorno → persistência' : selected === 1 ? 'oposição → tensão' : 'abertura → possibilidade'}</Words>
    <Words x={40} y={232}>{'A forma sustenta a leitura.'}</Words>
  </>;
  if (id === 'quantity-language') return <>
    <Words x={20} y={31} accent>{selected === 2 ? 'A = 2 × B' : 'INTAKE · energia consumida'}</Words>
    {selected === 2 ? <>
      <Words x={18} y={74}>{'B'}</Words><rect x={48} y={53} width={100} height={30} className="english-fill" /><Words x={162} y={75}>{'300 kcal'}</Words>
      <Words x={18} y={126}>{'A'}</Words><rect x={48} y={106} width={100} height={30} className="english-fill" /><rect x={151} y={106} width={100} height={30} className="english-fill" /><Words x={48} y={166}>{'600 kcal · mesma unidade'}</Words>
    </> : <>
      <path d="M24 122H296M24 112V132M160 104V144M296 112V132" className="english-outline" />
      {arrow(selected === 0 ? 'M160 86H34m10-7-10 7 10 7' : 'M160 86H286m-10-7 10 7-10 7')}
      <circle cx={160} cy={122} r={8} className="english-fill" /><Words x={24} y={166}>{'0'}</Words><Words x={160} y={166} anchor="middle" accent>{'300 kcal'}</Words>
      <Words x={160} y={202} anchor="middle">{selected === 0 ? '≤ teto' : '≥ piso'}</Words>
    </>}
    <Words x={20} y={238}>{'Consumo ≠ gasto do organismo'}</Words>
  </>;
  if (id === 'hurricane-forecast') return <>
    <path d="M239 37Q207 73 239 112T239 196L307 205V28Z" className="english-land" />
    <path d="M47 158Q140 64 233 60L230 162Q130 127 47 158Z" className="english-risk" />
    {arrow(selected === 2 ? 'M50 158Q143 109 231 112m-9-7 9 7-11 4' : 'M50 158Q142 121 232 89m-12-3 12 3-7 10', selected !== 2)}
    <circle cx={50} cy={158} r={15} className="english-outline" /><path d="M40 158Q50 143 60 158T40 158" className="english-outline" />
    <Words x={20} y={27} accent>{selected === 2 ? 'CHEGADA RELATADA' : 'TRAJETÓRIA ESQUEMÁTICA'}</Words>
    <Words x={20} y={207}>{'oceano'}</Words><Words x={261} y={183} anchor="middle">{'costa'}</Words>
    <Words x={18} y={237} accent>{selected === 0 ? 'faixa de risco ≠ dano ocorrido' : selected === 1 ? 'risco esperado → evacuar agora' : 'ontem → relato nesta manhã'}</Words>
  </>;
  if (id === 'modal-certainty') return <>
    <path d="M20 157H300M18 102L72 133L131 80L193 131L243 91L303 113" className="english-outline" />
    <Words x={20} y={30} accent>{'APÓS O TREMOR PRINCIPAL'}</Words>
    <Words x={160} y={64} anchor="middle">{'aftershocks → futuro no trecho'}</Words>
    <motion.circle cx={selected * 112 + 48} cy={157} r={12} className="english-fill" initial={false} animate={{ cx: selected * 112 + 48 }} transition={{ duration: reduced ? 0 : .35 }} />
    <Words x={48} y={196} anchor="middle">{'possível'}</Words><Words x={160} y={196} anchor="middle">{'esperado'}</Words><Words x={272} y={196} anchor="middle">{'previsto'}</Words>
    <Words x={160} y={237} anchor="middle" accent>{'Força da frase ≠ fato passado'}</Words>
  </>;
  if (id === 'cause-connectors') return <>
    <Words x={20} y={28} accent>{'MECANISMO · não ordem verbal'}</Words>
    <path d="M23 162Q160 114 297 162M23 170Q160 122 297 170" className="english-outline" />
    <path d="M38 76H282" className="english-atmosphere" /><Words x={160} y={58} anchor="middle">{'gases na atmosfera'}</Words>
    {arrow('M78 157L107 84L162 149L201 86m-12 5 12-5 2 13')}
    <Words x={227} y={109}>{'calor'}</Words><Words x={160} y={204} anchor="middle" accent>{'mais retenção → aquecimento'}</Words>
    <Words x={160} y={237} anchor="middle">{['efeito because causa', 'causa; therefore, efeito', 'efeito as a result of causa'][selected]}</Words>
  </>;
  if (id === 'pollution-connectors') return <>
    <Words x={20} y={26} accent>{selected === 0 ? 'MOST · alcance parcial' : selected === 1 ? 'FONTE → TRANSPORTE' : 'INTERVENÇÃO PROPOSTA'}</Words>
    <path d="M32 79Q123 132 73 188M78 62Q167 107 126 187" className="english-river" />
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={55 + i * 12} y={94 + i * 15} width={7} height={9} className="english-fill" />)}
    {selected === 2 && <path d="M54 138L138 138M65 124V155M83 124V155M101 124V155M119 124V155" className="english-outline" />}
    {selected === 1 && arrow('M197 74L106 112m9-1-9 1 5-9')}
    <Words x={172} y={88}>{selected === 0 ? 'maioria|'+'não reciclada' : selected === 1 ? 'resíduos|a montante' : 'filtro: may|reduce'}</Words>
    <Words x={20} y={232} accent>{selected === 0 ? 'Most deixa exceções possíveis.' : selected === 1 ? 'O rio carrega; a fonte despeja.' : 'Propor ≠ adotar ≠ eliminar'}</Words>
  </>;
  if (id === 'warming-evidence') return <>
    <Words x={20} y={27} accent>{['CLIMA · período longo', 'FUTURO · cenário declarado', 'RESPOSTAS · alvos distintos'][selected]}</Words>
    {selected < 2 ? <>
      <path d="M39 56V179H298" className="english-outline" />
      <path d="M46 157L84 133L116 145L157 103L190 113" className="english-outline" />
      {arrow(selected === 0 ? 'M46 161L279 71' : 'M190 113L279 60', selected === 1)}
      <Words x={160} y={208} anchor="middle">{selected === 0 ? 'variações + tendência' : 'if emissions remain high'}</Words>
    </> : <>
      <Words x={25} y={72}>{'emissões'}</Words><Words x={202} y={72}>{'danos'}</Words>
      {arrow('M114 65H178m-9-7 9 7-9 7')}
      <path d="M70 88V142M242 88V142" className="english-outline" />
      <Words x={70} y={168} anchor="middle" accent>{'mitigação'}</Words><Words x={242} y={168} anchor="middle" accent>{'adaptação'}</Words>
      <Words x={160} y={208} anchor="middle">{'cortar causas ≠ reduzir danos'}</Words>
    </>}
    <Words x={20} y={241}>{'Esquema sem valores medidos'}</Words>
  </>;
  if (id === 'research-claims') return <>
    <Words x={20} y={28} accent>{'ESTUDO OBSERVACIONAL FICTÍCIO'}</Words>
    <path d="M45 166V75M45 166H163" className="english-outline" />
    {[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={59 + i * 17} cy={147 - i * 11 + (i % 2) * 17} r={5} className="english-fill" />)}
    <Words x={45} y={198}>{'sono × memória'}</Words>
    <Words x={183} y={93}>{selected === 0 ? 'variam|juntos' : selected === 1 ? 'hipótese|parcial' : 'causa|afirmada'}</Words>
    {arrow('M164 134H278', selected === 0)}
    <Words x={20} y={237} accent>{selected === 0 ? 'associação ≠ direção causal' : selected === 1 ? 'may exige mais evidência' : 'causes excede o desenho'}</Words>
  </>;
  if (id === 'narrative-inference') return <>
    <Words x={20} y={29} accent>{'QUEM FALA? QUE PISTA SUSTENTA?'}</Words>
    <path d="M37 62H283V177H37M49 77H65M49 96H65" className="english-outline" />
    <Words x={82} y={96}>{selected === 0 ? 'Narrador: angry' : selected === 1 ? 'sorriso' : 'Personagem: “Fine”'}</Words>
    <Words x={82} y={148} accent>{selected === 0 ? 'estado nomeado' : selected === 1 ? 'mas mãos tensas' : 'sem erguer o olhar'}</Words>
    {selected !== 0 && arrow('M244 108V130m-6-8 6 8 6-8')}
    <Words x={20} y={210}>{selected === 0 ? 'informação explícita' : 'pistas → tensão sugerida'}</Words>
    <Words x={20} y={239}>{'Não invente a motivação.'}</Words>
  </>;
  if (id === 'bacteria-context' || id === 'lexical-inference') return <>
    <Words x={20} y={29} accent>{['DEFINIÇÃO · organização celular', 'DIVERSIDADE · papéis diferentes', 'SELEÇÃO · quem se reproduz?'][selected]}</Words>
    <rect x={33} y={73} width={103} height={68} rx={34} className="english-outline" />
    <path d="M51 101Q65 85 76 105T108 108M50 130V158M74 141V161M122 116L143 125" className="english-outline" />
    <Words x={176} y={88}>{selected === 0 ? 'DNA, sem|núcleo|delimitado' : selected === 1 ? 'algumas: doença|outras:|decomposição' : 'resistentes|podem|sobreviver'}</Words>
    {selected === 2 && <><rect x={182} y={160} width={35} height={24} rx={12} className="english-fill" /><rect x={236} y={160} width={35} height={24} rx={12} className="english-fill" />{arrow('M138 128Q158 170 181 173')}</>}
    <Words x={20} y={232} accent>{selected === 0 ? 'bactéria = organismo unicelular' : selected === 1 ? 'Some ≠ all' : 'bactéria resistente ≠ pessoa'}</Words>
  </>;
  if (id === 'comparison-signals') return <>
    <Words x={20} y={27} accent>{'COMPARE UMA PROPRIEDADE'}</Words>
    <rect x={25} y={63} width={97} height={59} rx={29} className="english-outline" /><Words x={74} y={155} anchor="middle">{'bactéria'}</Words>
    <path d="M237 60L265 78V108L237 125L210 107V77Z" className="english-outline" /><circle cx={237} cy={93} r={9} className="english-fill" /><Words x={237} y={155} anchor="middle">{'vírus'}</Words>
    <Words x={160} y={190} anchor="middle" accent>{selected === 0 ? 'vírus → célula hospedeira' : selected === 1 ? 'alguns podem causar doença' : 'alvos bacterianos ausentes'}</Words>
    <Words x={160} y={231} anchor="middle">{selected === 1 ? 'semelhança parcial ≠ identidade' : 'diferença preservada no conector'}</Words>
    {arrow(selected === 1 ? 'M133 85H187M133 98H187' : 'M144 74L175 109M175 74L144 109')}
  </>;
  if (id === 'stance-language') return <>
    <Words x={20} y={28} accent>{['RELATO · empresa fictícia', 'AVALIAÇÃO · contraste explícito', 'PROPOSTA · obrigação'][selected]}</Words>
    {selected === 0 ? <>{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={40 + i % 5 * 55} cy={77 + Math.floor(i / 5) * 55} r={14} className={i < 4 ? 'english-fill' : 'english-outline'} />)}<Words x={160} y={190} anchor="middle">{'4 de 10 → 40% deste grupo'}</Words></> : selected === 1 ? <><Words x={28} y={83}>{'qualificação semelhante'}</Words><path d="M28 98H286" className="english-outline" /><Words x={28} y={132}>{'promoção menos provável'}</Words><Words x={28} y={177} accent>{'despite → contraste; unfair → juízo'}</Words></> : <><path d="M32 111H146M163 64V169M182 111H283" className="english-outline" />{arrow('M46 143H269m-10-7 10 7-10 7')}<Words x={160} y={199} anchor="middle">{'must remove barriers'}</Words></>}
    <Words x={20} y={239}>{'Relato ≠ avaliação ≠ mudança feita'}</Words>
  </>;
  if (id === 'empowerment-language') return <>
    <Words x={20} y={28} accent>{'AUTONOMIA · dimensões distintas'}</Words>
    <path d="M25 179H112V140H200V100H295" className="english-outline" />
    <Words x={25} y={206}>{'educação'}</Words><Words x={116} y={166}>{'recursos'}</Words><Words x={212} y={76}>{'voz'}</Words>
    <motion.circle cx={[70, 155, 244][selected]} cy={[165, 126, 86][selected]} r={9} className="english-fill" initial={false} animate={{ cx: [70, 155, 244][selected], cy: [165, 126, 86][selected] }} transition={{ duration: reduced ? 0 : .35 }} />
    <Words x={20} y={240} accent>{selected === 0 ? 'necessária ≠ suficiente' : selected === 1 ? 'presença ≠ pleno poder' : 'if → condição da influência'}</Words>
  </>;
  if (id === 'digital-conditions') return <>
    <Words x={20} y={27} accent>{'ARQUITETURA DO ARGUMENTO'}</Words>
    <path d="M94 45H226V115H94ZM145 115V130H175V115M84 130H236" className="english-outline" />
    <path d="M122 70Q160 48 198 70M133 82Q160 65 187 82M146 94Q160 84 174 94" className="english-outline" />
    {arrow('M132 141L73 179m0-10 0 10 10-2')}{arrow('M188 141L247 179m-10-2 10 2 0-10')}
    <Words x={22} y={205} accent>{selected === 2 ? 'coleta de dados' : 'acesso ampliado'}</Words>
    <Words x={298} y={205} anchor="end">{selected === 2 ? 'risco à privacidade' : 'barreira de acesso'}</Words>
    <Words x={160} y={242} anchor="middle">{selected === 0 ? 'although conserva duas pontas' : selected === 1 ? 'provided that exige condição' : 'This retoma a ação de coletar'}</Words>
  </>;
  if (id === 'probiotic-evidence') return <>
    <Words x={20} y={27} accent>{'LEIA O ESCOPO DA EVIDÊNCIA'}</Words>
    {selected === 0 ? <><path d="M25 55H295L265 99H55ZM55 109H265L226 151H94ZM94 161H226L193 194H127Z" className="english-outline" /><Words x={160} y={81} anchor="middle">{'uma cepa + dose testada'}</Words><Words x={160} y={136} anchor="middle">{'alguns adultos'}</Words><Words x={160} y={183} anchor="middle" accent>{'may benefit'}</Words></> : selected === 1 ? <><Words x={25} y={85} accent>{'promising'}</Words><Words x={164} y={139}>{'inconclusive'}</Words>{arrow('M107 86Q180 70 193 112')}<path d="M183 162H282M205 153L193 174M243 153L231 174" className="english-outline" /><Words x={25} y={199}>{'precisa de mais pesquisa'}</Words></> : <><circle cx={64} cy={85} r={20} className="english-outline" /><Words x={105} y={90}>{'microrganismos vivos'}</Words><Words x={25} y={148}>{'+ quantidade adequada'}</Words><Words x={25} y={195} accent>{'+ benefício demonstrado'}</Words></>}
    <Words x={20} y={238}>{'Não generalize nem prescreva.'}</Words>
  </>;
  // stem-cell-trials: differentiation, research milestones, and attributed perspectives.
  return <>
    <Words x={20} y={27} accent>{['CAPACIDADE SOB CONDIÇÕES', 'ENSAIO ≠ CURA DISPONÍVEL', 'POSIÇÕES ATRIBUÍDAS'][selected]}</Words>
    {selected === 0 ? <><circle cx={67} cy={98} r={26} className="english-outline" /><circle cx={67} cy={98} r={10} className="english-fill" />{arrow('M78 66C142 23 151 111 102 113m9-6-9 6 10 3')}{arrow('M100 123L207 161m-9-8 9 8-13 1')}<circle cx={222} cy={164} r={16} className="english-outline" /><path d="M249 172L271 143L293 172Z" className="english-outline" /><Words x={130} y={87}>{'autorrenovação'}</Words><Words x={24} y={210}>{'diferenciação → tipos celulares'}</Words></> : selected === 1 ? <><path d="M24 167H112V129H204V90H296" className="english-outline" /><Words x={24} y={196}>{'ensaio inicial'}</Words><Words x={118} y={153}>{'segurança'}</Words><Words x={208} y={64}>{'mais estudos'}</Words><circle cx={78} cy={150} r={10} className="english-fill" /></> : <><path d="M160 55V191" className="english-outline" /><Words x={25} y={90}>{'Some|researchers|embrionárias'}</Words><Words x={184} y={90}>{'others|induzidas|pluripotentes'}</Words><Words x={22} y={211}>{'whereas → contraste de recortes'}</Words></>}
    <Words x={20} y={241} accent>{selected === 0 ? 'can / may preservam potencial' : selected === 1 ? 'promising não salta etapas' : 'discussão ≠ opinião do autor'}</Words>
  </>;
}

export function EnglishMechanismScene({ id, selected }: { id: EnglishInstrumentId; selected: number }) {
  const config = ENGLISH_INSTRUMENTS[id];
  const state = englishInstrumentState(id, selected);
  const reduced = useReducedMotion();
  return <figure className="english-reading-scene" data-english-scene={id} data-state={selected} data-motion={reduced ? 'reduced' : 'full'}>
    <div className="english-source-note"><span>01 / trecho original</span><small>{config.context}</small></div>
    <blockquote lang="en"><EvidenceText text={state.example} clues={state.evidence} /></blockquote>
    <div className="english-diagram-title">02 / relação que o trecho permite</div>
    <svg className="english-diagram" viewBox="0 0 320 265" role="img" aria-label={`${config.name}; ${state.label}: ${state.reading}`}>
      <g data-mechanism-state={selected}><Mechanism id={id} selected={selected} /></g>
    </svg>
    <figcaption data-evidence-finding><span>↳ Achado de leitura</span>{state.annotation}</figcaption>
  </figure>;
}
