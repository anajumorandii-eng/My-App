import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, Loader2, CheckCircle2, Circle, Construction } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiteraryWork, WorkEdition, ExamRequirement, WorkUnit, ReadingProgress } from '../types/literaryWorks';
import { getLiteraryWorkBySlug, getEditions, getExamRequirements, getWorkUnits } from '../lib/literaryCatalog';
import { getReadingProgress, saveReadingProgress } from '../lib/literaryData';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

type TabId = 'comece_aqui' | 'leitura_guiada' | 'analise' | 'passagens_chave' | 'fontes';

const TABS: { id: TabId; label: string }[] = [
  { id: 'comece_aqui', label: 'Comece aqui' },
  { id: 'leitura_guiada', label: 'Leitura guiada' },
  { id: 'analise', label: 'Análise' },
  { id: 'passagens_chave', label: 'Passagens-chave' },
  { id: 'fontes', label: 'Fontes' },
];

const LIT_PALETTE = PALETTES.Literatura;

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

  useEffect(() => {
    if (!workSlug) return;
    getLiteraryWorkBySlug(workSlug)
      .then(async (w) => {
        setWork(w);
        if (!w) return;
        const [eds, reqs, us] = await Promise.all([
          getEditions(w.id),
          getExamRequirements(w.id),
          getWorkUnits(w.id),
        ]);
        setEditions(eds);
        setRequirements(reqs.filter((r) => r.active));
        setUnits(us);
        if (user) setProgress(await getReadingProgress(user.uid, w.id));
      })
      .catch((error) => {
        console.error('Failed to load obra detail:', error);
        setLoadError('Não foi possível carregar essa obra. Tente recarregar a página.');
      });
  }, [workSlug, user]);

  const progressByUnit = useMemo(() => new Map(progress.map((p) => [p.unitId, p])), [progress]);
  const edition = editions[0];
  const LitIcon = SUBJECT_ICONS['Literatura'] ?? BookOpen;

  function toggleUnitDone(unit: WorkUnit) {
    if (!user || !work) return;
    const current = progressByUnit.get(unit.id);
    const next: ReadingProgress = {
      userId: user.uid, workId: work.id, unitId: unit.id,
      status: current?.status === 'completed' ? 'not_started' : 'completed',
      completedAt: current?.status === 'completed' ? undefined : new Date().toISOString(),
    };
    setProgress((prev) => [...prev.filter((p) => p.unitId !== unit.id), next]);
    saveReadingProgress(user.uid, next).catch((error) => console.error('Failed to save reading progress:', error));
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
        <Link to="/obras" className="text-[var(--primary)] underline">Voltar ao catálogo</Link>.
      </div>
    );
  }

  const completedCount = units.filter((u) => progressByUnit.get(u.id)?.status === 'completed').length;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': LIT_PALETTE.primary,
        '--secondary': LIT_PALETTE.secondary,
        '--wash': LIT_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Breadcrumb */}
      <div className="ni-route">
        <span>LIBRARY</span>
        <i />
        <Link to="/obras" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
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

      {/* Banca badges */}
      {requirements.length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {requirements.map((r) => (
            <span
              key={r.id}
              className="text-[10px] font-mono px-2.5 py-1 rounded-full"
              style={{ backgroundColor: LIT_PALETTE.primary, color: PALETTE_INK }}
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
              style={active
                ? { color: LIT_PALETTE.primary, borderBottom: `2px solid ${LIT_PALETTE.primary}`, paddingBottom: '6px', marginBottom: '-1px' }
                : { color: 'var(--dim)', paddingBottom: '6px', marginBottom: '-1px', borderBottom: '2px solid transparent' }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

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
          ) : (
            <p className="text-sm text-[var(--dim)]">O material-fonte desta obra ainda está sendo processado.</p>
          )}
          {requirements.some((r) => r.requiredScope !== 'obra completa') && (
            <p className="text-sm" style={{ color: LIT_PALETTE.primary }}>
              <b>Atenção ao recorte exigido:</b> {requirements.find((r) => r.requiredScope !== 'obra completa')?.requiredScope}
            </p>
          )}
        </Panel>
      )}

      {tab === 'leitura_guiada' && (
        units.length === 0 ? (
          <ContentPendingState label="A divisão em capítulos/unidades de leitura" />
        ) : (
          <Panel subject="Literatura" className="ni-panel overflow-hidden">
            <div className="p-4 border-b border-[var(--line)] text-sm text-[var(--dim)]">
              {completedCount} de {units.length} unidades concluídas
            </div>
            {units.map((u) => {
              const done = progressByUnit.get(u.id)?.status === 'completed';
              return (
                <button
                  key={u.id}
                  onClick={() => toggleUnitDone(u)}
                  disabled={!user}
                  className="w-full flex items-center justify-between p-4 text-left border-b border-[var(--line)] last:border-0 disabled:opacity-60 hover:bg-[var(--surface2)] transition-colors"
                >
                  <span className="flex items-center text-sm text-[var(--text)]">
                    {done
                      ? <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" style={{ color: LIT_PALETTE.primary }} />
                      : <Circle className="w-4 h-4 mr-2 text-[var(--dim)] shrink-0" />}
                    {u.order}. {u.title}
                  </span>
                  <span className="text-xs text-[var(--dim)]">págs. {u.pdfStartPage}–{u.pdfEndPage}</span>
                </button>
              );
            })}
          </Panel>
        )
      )}

      {tab === 'analise' && <ContentPendingState label="A análise integral" />}
      {tab === 'passagens_chave' && <ContentPendingState label="O mapeamento de passagens-chave" />}
      {tab === 'fontes' && <ContentPendingState label="A bibliografia comentada" />}
    </div>
  );
}
