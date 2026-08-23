import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookMarked, Loader2, CheckCircle2, Circle, Construction } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiteraryWork, WorkEdition, ExamRequirement, WorkUnit, ReadingProgress } from '../types/literaryWorks';
import { getLiteraryWorkBySlug, getEditions, getExamRequirements, getWorkUnits } from '../lib/literaryCatalog';
import { getReadingProgress, saveReadingProgress } from '../lib/literaryData';

type TabId = 'comece_aqui' | 'leitura_guiada' | 'analise' | 'passagens_chave' | 'fontes';

const TABS: { id: TabId; label: string }[] = [
  { id: 'comece_aqui', label: 'Comece aqui' },
  { id: 'leitura_guiada', label: 'Leitura guiada' },
  { id: 'analise', label: 'Análise' },
  { id: 'passagens_chave', label: 'Passagens-chave' },
  { id: 'fontes', label: 'Fontes' },
];

// Conteúdo analítico (dossiê, close readings, crítica) ainda não existe pra
// nenhuma obra — Fase 3/5 do roteiro. Até lá essas abas mostram esse estado
// "em elaboração" em vez de fingir que há conteúdo publicado.
function ContentPendingState({ label }: { label: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center text-zinc-500">
      <Construction className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
      <p className="text-sm">{label} ainda está em elaboração pra esta obra.</p>
    </div>
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
      <div className="flex items-center justify-center py-16 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando obra...
      </div>
    );
  }

  if (loadError) {
    return <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm">{loadError}</div>;
  }

  if (work === null) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
        Obra não encontrada. <Link to="/obras" className="text-indigo-600 dark:text-indigo-400 underline">Voltar ao catálogo</Link>.
      </div>
    );
  }

  const completedCount = units.filter((u) => progressByUnit.get(u.id)?.status === 'completed').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/obras" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar ao catálogo
      </Link>

      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <BookMarked className="w-7 h-7 mr-3 text-indigo-500" />
          {work.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">{work.author} · {work.genre}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {requirements.map((r) => (
            <span key={r.id} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
              {r.board} {r.examCycle}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.id ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'comece_aqui' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-3">
          {edition ? (
            <>
              <p className="text-sm"><strong>Edição:</strong> {edition.publisher || 'não informada'}{edition.year ? `, ${edition.year}` : ''}</p>
              <p className="text-sm"><strong>Páginas:</strong> {edition.pdfPageCount || 'ainda não contadas'}</p>
              <p className="text-sm">
                <strong>Status de auditoria:</strong>{' '}
                {edition.integrityStatus === 'verified' ? 'material conferido' : 'em processo de auditoria — pode ter ajustes pendentes'}
              </p>
            </>
          ) : (
            <p className="text-sm text-zinc-500">O material-fonte desta obra ainda está sendo processado.</p>
          )}
          {requirements.some((r) => r.requiredScope !== 'obra completa') && (
            <p className="text-sm text-amber-700 dark:text-amber-400">
              <strong>Atenção ao recorte exigido:</strong> {requirements.find((r) => r.requiredScope !== 'obra completa')?.requiredScope}
            </p>
          )}
        </div>
      )}

      {tab === 'leitura_guiada' && (
        units.length === 0 ? (
          <ContentPendingState label="A divisão em capítulos/unidades de leitura" />
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 text-sm text-zinc-500">
              {completedCount} de {units.length} unidades concluídas
            </div>
            {units.map((u) => {
              const done = progressByUnit.get(u.id)?.status === 'completed';
              return (
                <button
                  key={u.id}
                  onClick={() => toggleUnitDone(u)}
                  disabled={!user}
                  className="w-full flex items-center justify-between p-4 text-left border-b border-zinc-100 dark:border-zinc-800 last:border-0 disabled:opacity-60"
                >
                  <span className="flex items-center text-sm">
                    {done ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500 shrink-0" /> : <Circle className="w-4 h-4 mr-2 text-zinc-300 dark:text-zinc-600 shrink-0" />}
                    {u.order}. {u.title}
                  </span>
                  <span className="text-xs text-zinc-400">págs. {u.pdfStartPage}-{u.pdfEndPage}</span>
                </button>
              );
            })}
          </div>
        )
      )}

      {tab === 'analise' && <ContentPendingState label="A análise integral" />}
      {tab === 'passagens_chave' && <ContentPendingState label="O mapeamento de passagens-chave" />}
      {tab === 'fontes' && <ContentPendingState label="A bibliografia comentada" />}
    </div>
  );
}
