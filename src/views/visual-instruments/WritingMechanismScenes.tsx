import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { WritingInstrumentId } from '../../lib/writingInstrumentLab';

// Auditoria 34: onze fichas de Redação caíam na cena `theme` — "EIXO amplo →
// delimitar → TESE focada", com a legenda fixa "fator → consequência →
// posição". Isso só descreve recorte de tema. "Coerência interna" é sobre as
// partes do próprio texto não se contradizerem; concessão, refutação,
// clareza, intervenção e direitos também não têm eixo a delimitar. A cena
// estava errada para o conteúdo, não só genérica.
//
// Aqui cada ficha desenha o próprio mecanismo nos três estados da oficina:
// 0 = o defeito descrito no primeiro estado, 1 = a versão corrigida, 2 = a
// mesma versão com o vínculo conferido. Os textos curtos vêm dos exemplos de
// `writingInstrumentLab.ts`.

export const WRITING_MECHANISM_IDS = new Set<WritingInstrumentId>([
  'internal-coherence', 'quasi-logic', 'concession', 'refutation', 'language-clarity',
  'intervention-agents', 'intervention-feasibility', 'intervention-coherence', 'intervention-rights',
  'rights-generations', 'rights-social',
]);

import { accent, Caixa, dim, green, ink, paper, Pontas, Selo, Seta, T } from './sceneKit';

/** Rótulo do topo e, no estado 2, a marca de conferência. */
function Moldura({ titulo, selected, children, rodape }: { titulo: string; selected: number; children: React.ReactNode; rodape: string }) {
  const reduzir = useReducedMotion();
  return <g>
    <Pontas />
    <T x={24} y={34} ancora="start" cor={accent} tam={14} peso={800}>{titulo}</T>
    <motion.g key={selected} initial={reduzir ? false : { opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>{children}</motion.g>
    {selected === 2 && <g><rect x="24" y="252" width="272" height="24" rx="12" fill={`color-mix(in srgb, ${green} 14%, ${paper})`} /><T x={160} y={268} cor={ink} tam={11}>vínculo relido à luz da tese: se mantém</T></g>}
    {selected !== 2 && <T x={160} y={268} cor={dim} tam={11} peso={600}>{rodape}</T>}
  </g>;
}

// ---------------------------------------------------------------------------
function CoerenciaInterna({ selected }: { selected: number }) {
  const ok = selected > 0;
  const passos = ok ? [['causa', 'falta de informação'], ['consequência', 'reduz o acesso'], ['resposta', 'mediação escolar']] : [['causa', 'desigualdade'], ['consequência', '?'], ['resposta', 'campanha']];
  return <Moldura titulo="cada parte responde à anterior" selected={selected} rodape={ok ? 'nenhuma conclusão sem premissa' : 'a solução não deriva da causa: salto'}>
    {passos.map(([nome, ex], k) => <Caixa key={nome} x={20 + k * 100} y={104} w={84} h={72} linhas={[nome, ex]} estado={!ok && k === 1 ? 'falha' : ok ? 'ok' : 'neutro'} tracejada={!ok && k === 1} />)}
    {ok ? <><Seta d="M104 140H118" cor="ok" /><Seta d="M204 140H218" cor="ok" /></>
      : <><Seta d="M60 108Q160 40 258 106" cor="acc" larg={3} /><T x={160} y={64} cor={accent} tam={12}>salto</T></>}
    <Selo x={160} y={214} ok={ok} />
  </Moldura>;
}

function QuaseLogica({ selected }: { selected: number }) {
  const ok = selected > 0;
  return <Moldura titulo="parecer igual não é ser comparável" selected={selected} rodape={ok ? 'o critério da comparação fica à vista' : 'semelhança de superfície esconde a diferença'}>
    {[40, 190].map((x, k) => <g key={x}>
      <rect x={x} y={80} width="90" height="110" rx="12" fill={paper} stroke={dim} strokeWidth="2" />
      <T x={x + 45} y={100} tam={11}>{k === 0 ? 'caso A' : 'caso B'}</T>
      <circle cx={x + 45} cy={135} r="18" fill="none" stroke={dim} strokeWidth="2" />
      {/* O que decide fica no fundo da caixa: igual nos dois só quando há critério. */}
      <rect x={x + 20} y={162} width="50" height="18" rx="4" fill={ok || k === 0 ? `color-mix(in srgb, ${green} 25%, ${paper})` : `color-mix(in srgb, ${accent} 25%, ${paper})`} stroke={ok ? green : k === 0 ? green : accent} />
    </g>)}
    <T x={160} y={140} cor={ok ? green : accent} tam={22} peso={900}>{ok ? '=' : '≟'}</T>
    {ok ? <><path d="M110 171H210" stroke={green} strokeWidth="3" /><T x={160} y={214} cor={green} tam={11}>mesma barreira de acesso</T></>
      : <T x={160} y={214} cor={accent} tam={11}>a condição decisiva difere</T>}
  </Moldura>;
}

function Concessao({ selected }: { selected: number }) {
  const ok = selected > 0;
  // Gangorra: sem retorno, a objeção é o único peso e o lado dela desce; com
  // a ressalva, o "mas" devolve o peso à tese. Só a barra gira — as caixas
  // ficam de pé, penduradas na altura calculada de cada ponta.
  const ang = ok ? 8 : -12;
  const alt = (x: number) => 206 + (x - 160) * Math.sin((ang * Math.PI) / 180);
  return <Moldura titulo="conceder e voltar à tese" selected={selected} rodape={ok ? 'a concessão deixa a tese mais precisa' : 'a objeção passa a ocupar o centro'}>
    <path d="M160 210l-16 26h32Z" fill={paper} stroke={ink} strokeWidth="2" />
    <path d="M40 206H280" stroke={ink} strokeWidth="4" strokeLinecap="round" transform={`rotate(${ang} 160 206)`} />
    <Caixa x={30} y={alt(80) - 56} w={100} h={52} linhas={['embora', 'haja avanços']} estado={ok ? 'neutro' : 'falha'} />
    {ok ? <Caixa x={190} y={alt(240) - 72} w={100} h={68} linhas={['mas a barreira continua']} estado="ok" />
      : <><rect x={190} y={alt(240) - 56} width="100" height="52" rx="10" fill="none" stroke={dim} strokeWidth="2" strokeDasharray="6 5" /><T x={240} y={alt(240) - 64} cor={accent} tam={11}>tese não volta</T></>}
    {ok && <T x={240} y={alt(240) - 80} cor={green} tam={11}>tese reafirmada</T>}
  </Moldura>;
}

function Refutacao({ selected }: { selected: number }) {
  const ok = selected > 0;
  return <Moldura titulo="mostrar onde o contraponto falha" selected={selected} rodape={ok ? 'o limite é demonstrado com critério' : 'discordar não é dar razão'}>
    <Caixa x={24} y={78} w={120} h={46} linhas={['contraponto', 'a medida resolve']} />
    <Seta d="M144 101H176" />
    <Caixa x={180} y={78} w={116} h={46} linhas={['premissa', 'alcança todos']} estado={ok ? 'falha' : 'neutro'} />
    {ok ? <>
      <path d="M232 76l6 12-6 10 8 12-4 14" stroke={accent} strokeWidth="3" fill="none" />
      <Seta d="M238 176V132" cor="acc" larg={3} />
      <Caixa x={140} y={176} w={156} h={64} linhas={['critério', 'não chega a quem enfrenta a barreira']} estado="ok" />
    </> : <g transform="rotate(-8 90 190)"><rect x={40} y={166} width="110" height="42" rx="6" fill="none" stroke={accent} strokeWidth="3" /><T x={95} y={193} cor={accent} tam={14} peso={900}>“ESTÁ ERRADO”</T></g>}
  </Moldura>;
}

function Clareza({ selected }: { selected: number }) {
  const ok = selected > 0;
  if (!ok) return <Moldura titulo="a forma a favor do sentido" selected={selected} rodape="encaixes em série e termos vagos">
    {/* Um período só, com orações encaixadas umas nas outras. */}
    {[0, 1, 2, 3].map((k) => <rect key={k} x={24 + k * 16} y={72 + k * 14} width={272 - k * 32} height={140 - k * 28} rx="8" fill="none" stroke={k === 3 ? accent : dim} strokeWidth="2" />)}
    <T x={160} y={146} cor={accent} tam={12}>isso · coisa · questão</T>
    <T x={160} y={232} cor={dim} tam={11} peso={600}>um período, quatro encaixes</T>
  </Moldura>;
  return <Moldura titulo="a forma a favor do sentido" selected={selected} rodape="sujeito, relação e termo específico">
    {[0, 1].map((f) => <g key={f}>
      {[['sujeito', 16, 76], ['relação', 116, 76], ['complemento', 216, 92]].map(([nome, x, w]) =>
        <Caixa key={String(nome)} x={Number(x)} y={78 + f * 76} w={Number(w)} h={44} linhas={[String(nome)]} estado="ok" />)}
      <Seta d={`M94 ${100 + f * 76}H112`} cor="ok" /><Seta d={`M194 ${100 + f * 76}H212`} cor="ok" />
    </g>)}
    <T x={160} y={236} cor={dim} tam={11} peso={600}>duas unidades, cada uma com sua relação</T>
  </Moldura>;
}

// Proposta de intervenção: o objeto é o mesmo nas quatro fichas, então a
// estrutura é compartilhada de propósito. O que muda é qual elemento quebra:
// o agente, o meio, o elo com a causa ou o limite dos direitos.
const INTERVENCAO: Record<string, { titulo: string; falha: [string, string]; ok: [string, string]; elo: 'agente' | 'meio' | 'causa' | 'limite'; rodape: [string, string] }> = {
  'intervention-agents': { titulo: 'quem executa a ação?', falha: ['agente', '“a sociedade”'], ok: ['agente', 'escola + rede local'], elo: 'agente', rodape: ['sem competência nem ação verificável', 'agente e capacidade coerentes'] },
  'intervention-feasibility': { titulo: 'como a proposta sai do papel?', falha: ['meio', '?'], ok: ['meio', 'formação e canal'], elo: 'meio', rodape: ['verbo sem meio: “criar uma política”', 'a execução pode ser avaliada'] },
  'intervention-coherence': { titulo: 'a ação enfrenta a causa?', falha: ['ação', 'campanha'], ok: ['ação', 'remove a barreira'], elo: 'causa', rodape: ['diagnostica acesso, propõe campanha', 'cada ação responde a uma causa'] },
  'intervention-rights': { titulo: 'combater sem violar direitos', falha: ['meio', 'restringe um grupo'], ok: ['meio', 'amplia acesso e escuta'], elo: 'limite', rodape: ['eficiência não justifica violação', 'a dignidade fica como limite'] },
};

function Intervencao({ id, selected }: { id: string; selected: number }) {
  const c = INTERVENCAO[id];
  const ok = selected > 0;
  const slots: Array<[string, string]> = [['agente', 'nomeado'], ['ação', 'verbo'], ['meio', 'como'], ['finalidade', 'para quê']];
  const alvo = c.elo === 'agente' ? 0 : c.elo === 'causa' ? 1 : 2;
  return <Moldura titulo={c.titulo} selected={selected} rodape={ok ? c.rodape[1] : c.rodape[0]}>
    {c.elo === 'causa' && <>
      <Caixa x={24} y={58} w={120} h={40} linhas={['causa analisada', 'falta de acesso']} />
      <Seta d={ok ? 'M84 98Q96 118 116 128' : 'M84 98Q60 118 40 126'} cor={ok ? 'ok' : 'acc'} larg={3} tracejada={!ok} />
    </>}
    {c.elo === 'limite' && <rect x="14" y="120" width="292" height="92" rx="14" fill="none" stroke={ok ? green : accent} strokeWidth="2.5" strokeDasharray="7 5" />}
    {c.elo === 'limite' && <T x={296} y={116} ancora="end" cor={ok ? green : accent} tam={11}>dignidade e liberdade</T>}
    {slots.map(([nome, dica], k) => {
      const e = k === alvo;
      const linhas = e ? (ok ? c.ok : c.falha) : [nome, dica];
      const fora = e && !ok && c.elo === 'limite';
      return <g key={nome} transform={fora ? 'translate(0 54)' : undefined}>
        <Caixa x={8 + k * 78} y={126} w={72} h={78} linhas={[linhas[0], linhas[1]]} estado={e ? (ok ? 'ok' : 'falha') : 'neutro'} tracejada={e && !ok && c.elo === 'meio' && id === 'intervention-feasibility'} />
      </g>;
    })}
    {[0, 1, 2].map((k) => <Seta key={k} d={`M${80 + k * 78} 164H${86 + k * 78}`} />)}
  </Moldura>;
}

function DireitosIndividuais({ selected }: { selected: number }) {
  const ok = selected > 0;
  if (!ok) return <Moldura titulo="liberdade de quem, contra o quê?" selected={selected} rodape="sem titular nem situação, não há conflito a avaliar">
    <T x={160} y={150} cor={accent} tam={26} peso={900}>“liberdade”</T>
    <T x={160} y={190} cor={dim} tam={12} peso={600}>titular? situação? limite?</T>
  </Moldura>;
  return <Moldura titulo="liberdade de quem, contra o quê?" selected={selected} rodape="o direito individual ganha sentido concreto">
    <circle cx="96" cy="112" r="14" fill={paper} stroke={ink} strokeWidth="2.5" />
    <path d="M96 126v44m-22-30h44m-22 30l-16 28m16-28l16 28" stroke={ink} strokeWidth="2.5" fill="none" />
    <T x={96} y={222} tam={11}>titular</T>
    <path d="M140 92q22 10 22 50t-22 50" fill={`color-mix(in srgb, ${green} 20%, ${paper})`} stroke={green} strokeWidth="3" />
    <T x={168} y={80} cor={green} tam={11}>garantia</T>
    <Seta d="M286 142H176" cor="acc" larg={3} />
    <T x={292} y={130} ancora="end" cor={accent} tam={11}>interferência</T>
    <T x={292} y={160} ancora="end" cor={accent} tam={11}>arbitrária</T>
    <T x={230} y={214} cor={dim} tam={11} peso={600}>igual perante a lei</T>
  </Moldura>;
}

function DireitosSociais({ selected }: { selected: number }) {
  const ok = selected > 0;
  return <Moldura titulo="todo direito tem quem o assegure" selected={selected} rodape={ok ? 'a dimensão coletiva fica visível' : 'quem deve assegurar o direito?'}>
    <Caixa x={104} y={146} w={112} h={64} linhas={['grupo alcançado', 'saúde, ambiente']} estado={ok ? 'ok' : 'neutro'} />
    <Caixa x={24} y={60} w={100} h={46} linhas={['poder público', 'política']} estado={ok ? 'ok' : 'neutro'} tracejada={!ok} />
    <Caixa x={196} y={60} w={100} h={46} linhas={['participação', 'social']} estado={ok ? 'ok' : 'neutro'} tracejada={!ok} />
    {ok ? <><Seta d="M84 106L126 144" cor="ok" larg={3} /><Seta d="M236 106L194 144" cor="ok" larg={3} /><T x={160} y={232} cor={green} tam={11}>prestação + participação</T></>
      : <><T x={160} y={132} cor={accent} tam={22} peso={900}>?</T><T x={160} y={232} cor={accent} tam={11}>direito sem obrigação</T></>}
  </Moldura>;
}

export function WritingMechanismScene({ id, selected }: { id: WritingInstrumentId; selected: number }) {
  if (id === 'internal-coherence') return <CoerenciaInterna selected={selected} />;
  if (id === 'quasi-logic') return <QuaseLogica selected={selected} />;
  if (id === 'concession') return <Concessao selected={selected} />;
  if (id === 'refutation') return <Refutacao selected={selected} />;
  if (id === 'language-clarity') return <Clareza selected={selected} />;
  if (id === 'rights-generations') return <DireitosIndividuais selected={selected} />;
  if (id === 'rights-social') return <DireitosSociais selected={selected} />;
  return <Intervencao id={id} selected={selected} />;
}
