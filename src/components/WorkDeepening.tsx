import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStrategyGuides } from '../hooks/useStrategyGuides';
import { useStudyTargets } from '../hooks/useStudyTargets';
import { requestAiTextStream } from '../lib/aiClient';
import { reflectionForTutor } from '../lib/learningReflection';
import { printStrategyGuide } from '../lib/printStrategyGuide';
import { strategyGuideUrl } from '../lib/strategyGuides';
import { buildWorkStudyPacket } from '../lib/studySources';
import type { WorkDossier } from '../types/literaryWorks';
import { AiText } from './AiText';
import { StudySourcesPanel } from './StudySourcesPanel';

export function WorkDeepening(props: { dossier: WorkDossier; title: string; unitId?: string; unitTitle?: string }) {
  const { user } = useAuth();
  return <WorkDeepeningContent key={JSON.stringify([user?.uid, props.dossier.slug, props.unitId])} {...props} uid={user?.uid ?? null} />;
}

function WorkDeepeningContent({ dossier, title, unitId, unitTitle, uid }: { dossier: WorkDossier; title: string; unitId?: string; unitTitle?: string; uid: string | null }) {
  const { guides, persist, saveMessage, error: loadError, reload } = useStrategyGuides(uid);
  const { targets, loading: targetsLoading, error: targetsError } = useStudyTargets();
  const [board, setBoard] = useState('Todas as bancas');
  const [partial, setPartial] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const content = useRef<HTMLDivElement>(null);
  const topicId = `obra:${dossier.slug}`;
  const key = JSON.stringify(['obra', dossier.slug, unitId ?? '', board]);
  const saved = guides[key];
  const targetBoards = board === 'Todas as bancas' ? targets.map(target => target.board) : [board];
  const boards = [...new Set(['FUVEST', 'UNICAMP', ...targets.map(target => target.board)])];
  const scope = unitTitle ?? 'Obra completa';
  const generate = async () => {
    if (lock.current || (board === 'Todas as bancas' && targetsLoading)) return;
    lock.current = true; setBusy(true); setError(''); setPartial('');
    try {
      const packet = buildWorkStudyPacket(dossier, unitId);
      const result = await requestAiTextStream('review-tip', {
        topic: title, subject: 'Literatura', chapter: scope, board, targetBoards,
        guideMode: 'literary-strategy', referenceText: packet.referenceText,
        learnerReflection: reflectionForTutor(uid, topicId), level: 40, daysSinceReview: 0,
      }, delta => setPartial(previous => previous + delta));
      if (!result.text.trim()) throw new Error('Guia vazio');
      await persist({ key, subject: 'Literatura', topicId, topicName: title, chapter: unitTitle ?? '', board, targetBoards,
        workSlug: dossier.slug, ...(unitId ? { workUnitId: unitId } : {}),
        studyPacket: result.serverSources?.length ? { ...packet, sources: [...packet.sources, ...result.serverSources] } : packet,
        text: result.text, savedAt: new Date().toISOString() });
    } catch { setError('Não foi possível aprofundar agora. O conteúdo da obra e o guia salvo anteriormente continuam disponíveis. Tente novamente.'); }
    finally { lock.current = false; setBusy(false); setPartial(''); }
  };
  return <section aria-label="Aprofundamento gerado da obra" className="border-t border-[var(--line)] pt-5 space-y-3">
    <h3 className="font-display text-xl">Aprofundar agora · {scope}</h3>
    <p className="text-sm text-[var(--dim)]">Gere um guia de interpretação, escolhas formais, prioridades de releitura e construção de respostas, usando as fontes publicadas desta obra. O resultado fica em Meus aprofundamentos.</p>
    <label className="block text-sm">Banca do aprofundamento da obra<select className="field block w-full mt-1" disabled={busy} value={board} onChange={event => { setBoard(event.target.value); setError(''); }}><option>Todas as bancas</option>{boards.map(name => <option key={name}>{name}</option>)}</select></label>
    {targetsLoading && <p role="status">Carregando suas bancas…</p>}
    {targetsError && <p role="alert">{targetsError}</p>}
    {board === 'Todas as bancas' && <p className="text-xs text-[var(--dim)]">{targets.length ? `Bancas do seu perfil: ${targetBoards.join(' · ')}.` : 'Sem bancas pessoais carregadas: o guia se limita às fontes disponíveis, sem assumir inscrições ou cobrança oficial.'}</p>}
    {loadError && <div role="alert"><p>{loadError}</p><button type="button" className="text-sm underline" onClick={reload}>Tentar carregar novamente</button></div>}
    <button type="button" disabled={busy || (board === 'Todas as bancas' && targetsLoading)} onClick={() => void generate()} className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm disabled:opacity-50">{busy ? 'Preparando aprofundamento da obra…' : saved ? 'Gerar novo aprofundamento da obra' : unitId ? 'Aprofundar esta unidade e sua interpretação' : 'Aprofundar esta obra e sua interpretação'}</button>
    {busy && <p role="status" className="text-sm">Gerando o guia para {title} · {scope}. Aguarde a conclusão para salvar.</p>}
    {error && <p role="alert" className="text-sm">{error}</p>}
    {saveMessage && <p role="status" className="text-xs text-[var(--dim)]">{saveMessage}</p>}
    <div className="flex flex-wrap gap-3 text-sm">
      <Link to="/aprofundamentos" className="underline">Meus aprofundamentos</Link>
      {saved && <>
        <Link to={strategyGuideUrl(saved)} className="underline">Abrir este guia na biblioteca</Link>
        <button type="button" disabled={busy} className="underline disabled:opacity-50" onClick={() => { try { if (content.current) printStrategyGuide(content.current, `Aprofundamento — ${title} — ${scope} — ${board}`); } catch { setError('Não foi possível abrir a impressão. Tente novamente.'); } }}>Imprimir aprofundamento / Salvar em PDF</button>
        {uid && <button type="button" className="underline" disabled={busy} onClick={() => void persist(saved)}>Salvar novamente na conta</button>}
      </>}
    </div>
    <p className="text-xs text-[var(--dim)]">Guia gerado por IA para seu estudo pessoal. Confira as interpretações nas fontes; ele não altera o dossiê publicado.</p>
    {(partial || saved) && <article ref={content} className="space-y-3" data-print-subject="Literatura" data-print-work={title} data-print-subtopic={scope} data-print-board={saved?.targetBoards?.join(' · ') || board} data-print-purpose="Aprofundamento da obra, interpretação e formas de cobrança na prova">
      <h4 className="font-display text-lg">{title} · {scope} · {board}</h4>
      <AiText text={partial || saved?.text || ''} className="text-sm leading-relaxed" />
      {saved?.studyPacket && !partial && <StudySourcesPanel packet={saved.studyPacket} />}
    </article>}
  </section>;
}
