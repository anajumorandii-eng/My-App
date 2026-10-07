import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BookOpen, Loader2, CheckCircle2, Circle, Construction } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiteraryWork, WorkEdition, ExamRequirement, WorkUnit, ReadingProgress, WorkDossier, EditorialStatus, ContentModuleType } from '../types/literaryWorks';
import { loadWorkDossier, visibleDossier } from '../lib/workDossiers';
import AiTextRenderer from '../components/AiTextRenderer';
import { getLiteraryWorkBySlug, getEditions, getExamRequirements, getWorkUnits } from '../lib/literaryCatalog';
import { getReadingProgress, saveReadingProgress } from '../lib/literaryData';
import { Panel } from '../components/ui/Panel';
import { SUBJECT_ICONS } from './Dashboard';

type TabId = 'comece_aqui' | 'leitura_guiada' | 'analise' | 'passagens_chave' | 'bancas' | 'questoes' | 'revisao' | 'fontes';

const TABS: { id: TabId; label: string }[] = [
  { id: 'comece_aqui', label: 'Comece aqui' },
  { id: 'leitura_guiada', label: 'Leitura guiada' },
  { id: 'analise', label: 'Análise' },
  { id: 'passagens_chave', label: 'Passagens-chave' },
  { id: 'bancas', label: 'Bancas' },
  { id: 'questoes', label: 'Questões' },
  { id: 'revisao', label: 'Revisão ativa' },
  { id: 'fontes', label: 'Fontes' },
];


/** Em revisão, todo bloco ainda não publicado leva o selo: é o que separa o
 *  que a aluna verá do que só a revisão enxerga. */
function ReviewBadge({ status }: { status: EditorialStatus }) {
  if (status === 'published') return null;
  return <span className="inline-block text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full border border-[var(--line)] text-[var(--dim)]">em revisão</span>;
}

/** Um módulo do dossiê em Markdown, com o selo de revisão. Os dossiês mais
 *  completos trazem oito tipos de módulo, mas a tela só lia três: questões,
 *  revisão ativa, bancas e crítica ficavam nos dados sem nunca aparecer. */
function ModuleBlock({ module, title }: { module: WorkDossier['modules'][number]; title?: string }) {
  return (
    <div className="space-y-2">
      {title && <h2 className="text-sm font-semibold text-[var(--text)]">{title}</h2>}
      <ReviewBadge status={module.editorialStatus} />
      <AiTextRenderer text={module.markdown} className="text-sm text-[var(--text)]" />
    </div>
  );
}

function ContentPendingState({ label }: { label: string }) {
  return (
    <Panel subject="Literatura" className="ni-panel p-8 text-center text-[var(--dim)]">
      <Construction className="w-6 h-6 mx-auto mb-2 text-[var(--dim)]" />
      <p className="text-sm">{label} ainda está em elaboração pra esta obra.</p>
    </Panel>
  );
}

export default function ObraDetalhe() {
  const { workSlug } = useParams<{ workSlug: string }>();
  const { user } = useAuth();
  const [work, setWork] = useState<LiteraryWork | null | undefined>(undefined);
  const [editions, setEditions] = useState<WorkEdition[]>([]);
  const [requirements, setRequirements] = useState<ExamRequirement[]>([]);
  const [units, setUnits] = useState<WorkUnit[]>([]);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('comece_aqui');
  const [searchParams] = useSearchParams();
  const review = searchParams.get('revisao') === '1';
  const [rawDossier, setRawDossier] = useState<WorkDossier | null>(null);

  const uid = user?.uid;
  const [progressReady, setProgressReady] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingUnits, setSavingUnits] = useState<Set<string>>(new Set());
  const savingRef = useRef(new Set<string>());
  const contextRef = useRef({ workSlug, uid });
  contextRef.current = { workSlug, uid };

  useEffect(() => {
    let cancelled = false;
    setRawDossier(null);
    if (!workSlug) return;
    loadWorkDossier(workSlug)
      .then((value) => { if (!cancelled) setRawDossier(value); })
      .catch((error) => { if (!cancelled) console.error('Failed to load dossier:', error); });
    return () => { cancelled = true; };
  }, [workSlug]);

  const dossier = useMemo(() => (rawDossier ? visibleDossier(rawDossier, review) : null), [rawDossier, review]);
  const moduleOf = (type: ContentModuleType) => dossier?.modules.find((m) => m.moduleType === type);
  // As unidades confirmadas no Firestore têm precedência; sem elas, a leitura
  // guiada usa os capítulos do dossiê, que já trazem páginas conferidas.
  const readingUnits: (WorkUnit | (WorkDossier['units'][number] & { workId: string }))[] = units.length > 0
    ? units
    : (dossier?.units ?? []).map((u) => ({ ...u, workId: dossier!.workId }));
  const guideOf = (unitId: string) => dossier?.units.find((u) => u.id === unitId)?.guide;

  useEffect(() => {
    let cancelled = false;
    setWork(undefined);
    setLoadError(null);
    setEditions([]);
    setRequirements([]);
    setUnits([]);
    if (!workSlug) { setWork(null); return; }
    getLiteraryWorkBySlug(workSlug)
      .then(async (w) => {
        if (cancelled) return;
        setWork(w);
        if (!w) return;
        const [eds, reqs, us] = await Promise.all([
          getEditions(w.id), getExamRequirements(w.id), getWorkUnits(w.id),
        ]);
        if (cancelled) return;
        setEditions(eds);
        setRequirements(reqs.filter((r) => r.active));
        setUnits(us);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load obra detail:', error);
        setLoadError('Não foi possível carregar essa obra. Tente recarregar a página.');
      });
    return () => { cancelled = true; };
  }, [workSlug, uid]);

  useEffect(() => {
    let cancelled = false;
    setProgress([]);
    setProgressReady(false);
    setSaveError(null);
    savingRef.current = new Set();
    setSavingUnits(new Set());
    if (!uid || !work || work.slug !== workSlug) return;
    getReadingProgress(uid, work.id)
      .then((value) => {
        if (cancelled) return;
        setProgress(value);
        setProgressReady(true);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to load reading progress:', error);
        setSaveError('Não foi possível carregar seu progresso. Tente recarregar a página.');
      });
    return () => { cancelled = true; };
  }, [uid, work, workSlug]);

  const progressByUnit = useMemo(() => new Map(progress.map((p) => [p.unitId, p])), [progress]);
  const edition = editions[0];
  const LitIcon = SUBJECT_ICONS['Literatura'] ?? BookOpen;

  async function toggleUnitDone(unit: { id: string }) {
    if (!uid || !work || !progressReady || savingRef.current.has(unit.id)) return;
    const context = contextRef.current;
    const locks = savingRef.current;
    const current = progressByUnit.get(unit.id);
    const done = current?.status === 'completed';
    const next: ReadingProgress = {
      ...current,
      userId: uid, workId: work.id, unitId: unit.id,
      status: done ? 'not_started' : 'completed',
    };
    if (done) delete next.completedAt;
    else next.completedAt = new Date().toISOString();
    locks.add(unit.id);
    setSavingUnits(new Set(locks));
    setSaveError(null);
    setProgress((prev) => [...prev.filter((p) => p.unitId !== unit.id), next]);
    const active = () => contextRef.current.uid === context.uid && contextRef.current.workSlug === context.workSlug && savingRef.current === locks;
    try {
      await saveReadingProgress(uid, next);
    } catch (error) {
      if (!active()) return;
      console.error('Failed to save reading progress:', error);
      setProgress((prev) => [...prev.filter((p) => p.unitId !== unit.id), ...(current ? [current] : [])]);
      setSaveError('Não foi possível salvar seu progresso. Tente novamente.');
    } finally {
      locks.delete(unit.id);
      if (active()) setSavingUnits(new Set(locks));
    }
  }

  if (work === undefined && !loadError) {
    return (
      <div className="flex items-center justify-center py-16 text-[var(--dim)]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando obra...
      </div>
    );
  }

  if (loadError) {
    return <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 p-4 text-sm">{loadError}</div>;
  }

  if (work === null) {
    return (
      <div className="text-center py-16 text-[var(--dim)]">
        Obra não encontrada.{' '}
        <Link to="/obras" className="subject-text underline">Voltar ao catálogo</Link>.
      </div>
    );
  }

  const completedCount = readingUnits.filter((u) => progressByUnit.get(u.id)?.status === 'completed').length;

  return (
    <div className="ni-main">
      {/* Breadcrumb */}
      <div className="ni-route">
        <span>Biblioteca</span>
        <i />
        <Link to="/obras" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--action-primary)] text-[var(--text-inverse)]">
            <LitIcon className="w-3 h-3" />
          </span>
          OBRAS
        </Link>
        <i />
        <b>{work.title.toUpperCase()}</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>{work.title}</h1>
          <p>{work.author} · {work.genre}</p>
        </div>
        <div className="ni-state">
          <i />
          {requirements.map((r) => r.board).join(' · ')} · ciclo 2027
        </div>
      </div>

      {review && (
        <p role="status" className="ni-panel p-3 text-xs text-[var(--text)]">
          Modo revisão: blocos marcados como “em revisão” ainda não aparecem para a estudante.
        </p>
      )}

      {/* Banca badges */}
      {requirements.length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {requirements.map((r) => (
            <span
              key={r.id}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)' }}
            >
              {r.board} {r.examCycle}
            </span>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="ni-subjects" style={{ borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={active ? 'subject-text' : undefined}
              style={active
                ? { borderBottom: '2px solid var(--primary)', paddingBottom: '6px', marginBottom: '-1px' }
                : { color: 'var(--dim)', paddingBottom: '6px', marginBottom: '-1px', borderBottom: '2px solid transparent' }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {saveError && <p role="alert" className="ni-panel p-3 text-sm text-[var(--text)]">{saveError}</p>}
      {/* Tab content */}
      {tab === 'comece_aqui' && (
        <Panel subject="Literatura" className="ni-panel p-6 space-y-3">
          {edition ? (
            <>
              <p className="text-sm text-[var(--text)]"><b>Edição:</b> {edition.publisher || 'não informada'}{edition.year ? `, ${edition.year}` : ''}</p>
              <p className="text-sm text-[var(--text)]"><b>Páginas:</b> {edition.pdfPageCount || 'ainda não contadas'}</p>
              <p className="text-sm text-[var(--text)]">
                <b>Status de auditoria:</b>{' '}
                {edition.integrityStatus === 'verified' ? 'material conferido' : 'em processo de auditoria — pode ter ajustes pendentes'}
              </p>
            </>
          ) : dossier && moduleOf('comece_aqui') ? (
            <>
              <p className="text-sm text-[var(--text)]"><b>Edição do dossiê:</b> {dossier.edition.label}</p>
              <p className="text-sm text-[var(--text)]"><b>Páginas do arquivo de referência:</b> {dossier.edition.pdfPageCount}</p>
              <p className="text-sm text-[var(--dim)]">As citações usam a paginação desta edição; ela pode diferir da do seu exemplar.</p>
            </>
          ) : (
            <p className="text-sm text-[var(--dim)]">O material-fonte desta obra ainda está sendo processado.</p>
          )}
          {moduleOf('comece_aqui') && (
            <div className="pt-2 border-t border-[var(--line)] space-y-2">
              <ReviewBadge status={moduleOf('comece_aqui')!.editorialStatus} />
              <AiTextRenderer text={moduleOf('comece_aqui')!.markdown} className="text-sm text-[var(--text)]" />
            </div>
          )}
          {requirements.some((r) => r.requiredScope !== 'obra completa') && (
            <p className="subject-text text-sm">
              <b>Atenção ao recorte exigido:</b> {requirements.find((r) => r.requiredScope !== 'obra completa')?.requiredScope}
            </p>
          )}
        </Panel>
      )}

      {tab === 'leitura_guiada' && (
        readingUnits.length === 0 ? (
          <ContentPendingState label="A divisão em capítulos/unidades de leitura" />
        ) : (
          <Panel subject="Literatura" className="ni-panel overflow-hidden">
            <div className="p-4 border-b border-[var(--line)] text-sm text-[var(--dim)]">
              {completedCount} de {readingUnits.length} unidades concluídas
            </div>
            {readingUnits.map((u) => {
              const done = progressByUnit.get(u.id)?.status === 'completed';
              const guide = guideOf(u.id);
              return (
                <div key={u.id} className="border-b border-[var(--line)] last:border-0">
                  <button
                    onClick={() => toggleUnitDone(u)}
                    disabled={!uid || !progressReady || savingUnits.has(u.id)}
                    aria-pressed={done}
                    className="w-full flex items-center justify-between p-4 text-left disabled:opacity-60 hover:bg-[var(--surface2)] transition-colors"
                  >
                    <span className="flex items-center text-sm text-[var(--text)]">
                      {done
                        ? <CheckCircle2 className="subject-text w-4 h-4 mr-2 shrink-0" />
                        : <Circle className="w-4 h-4 mr-2 text-[var(--dim)] shrink-0" />}
                      {u.order}. {u.title}
                    </span>
                    <span className="text-xs text-[var(--dim)] shrink-0 ml-3">págs. {u.pdfStartPage}–{u.pdfEndPage}</span>
                  </button>
                  {guide && (
                    <div className="px-4 pb-4 pl-10 space-y-2 text-sm text-[var(--text)]">
                      <ReviewBadge status={guide.editorialStatus} />
                      <p className="leading-relaxed">{guide.summary}</p>
                      <ul className="list-disc pl-5 space-y-1 text-[var(--dim)]">
                        {guide.observe.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </Panel>
        )
      )}

      {tab === 'analise' && (moduleOf('analise_integral') ? (
        <Panel subject="Literatura" className="ni-panel p-6 space-y-6">
          <ModuleBlock module={moduleOf('analise_integral')!} />
          {moduleOf('critica_debate') && (
            <div className="pt-4 border-t border-[var(--line)]">
              <ModuleBlock module={moduleOf('critica_debate')!} title="Crítica e debate" />
            </div>
          )}
        </Panel>
      ) : <ContentPendingState label="A análise integral" />)}

      {tab === 'passagens_chave' && (dossier && dossier.evidence.length > 0 ? (
        <div className="grid gap-3">
          {dossier.evidence.map((card) => (
            <Panel key={card.id} subject="Literatura" className="ni-panel p-5 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-[var(--dim)]">{card.location}</span>
                <ReviewBadge status={card.editorialStatus} />
              </div>
              <blockquote className="border-l-2 border-[var(--primary)] pl-3 italic text-sm text-[var(--text)]">“{card.quote}”</blockquote>
              <dl className="grid gap-2 text-sm text-[var(--text)]">
                <div><dt className="font-semibold">Contexto</dt><dd className="text-[var(--dim)]">{card.context}</dd></div>
                <div><dt className="font-semibold">Recurso</dt><dd className="text-[var(--dim)]">{card.formalDevice}</dd></div>
                <div><dt className="font-semibold">Efeito</dt><dd className="text-[var(--dim)]">{card.effect}</dd></div>
                <div><dt className="font-semibold">Relação com a obra</dt><dd className="text-[var(--dim)]">{card.wholeRelation}</dd></div>
              </dl>
            </Panel>
          ))}
        </div>
      ) : <ContentPendingState label="O mapeamento de passagens-chave" />)}

      {tab === 'bancas' && (moduleOf('fuvest') || moduleOf('unicamp') ? (
        <Panel subject="Literatura" className="ni-panel p-6 space-y-6">
          {moduleOf('fuvest') && <ModuleBlock module={moduleOf('fuvest')!} title="FUVEST" />}
          {moduleOf('unicamp') && (
            <div className={moduleOf('fuvest') ? 'pt-4 border-t border-[var(--line)]' : undefined}>
              <ModuleBlock module={moduleOf('unicamp')!} title="Unicamp" />
            </div>
          )}
        </Panel>
      ) : <ContentPendingState label="A preparação por banca" />)}

      {tab === 'questoes' && (moduleOf('questoes') ? (
        <Panel subject="Literatura" className="ni-panel p-6"><ModuleBlock module={moduleOf('questoes')!} /></Panel>
      ) : <ContentPendingState label="O banco de questões autorais" />)}

      {tab === 'revisao' && (moduleOf('revisao_ativa') ? (
        <Panel subject="Literatura" className="ni-panel p-6"><ModuleBlock module={moduleOf('revisao_ativa')!} /></Panel>
      ) : <ContentPendingState label="O roteiro de revisão ativa" />)}

      {tab === 'fontes' && (moduleOf('fontes') ? (
        <Panel subject="Literatura" className="ni-panel p-6 space-y-3">
          <ReviewBadge status={moduleOf('fontes')!.editorialStatus} />
          <AiTextRenderer text={moduleOf('fontes')!.markdown} className="text-sm text-[var(--text)]" />
        </Panel>
      ) : <ContentPendingState label="A bibliografia comentada" />)}
    </div>
  );
}
