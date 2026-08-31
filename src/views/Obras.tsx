import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Library, Loader2, Search } from 'lucide-react';
import { LiteraryWork, ExamBoard, ExamRequirement } from '../types/literaryWorks';
import { getLiteraryWorks, getAllExamRequirements } from '../lib/literaryCatalog';
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';
import { getMotionConfigForSubject } from '../design-system/crivoMotionPresets';
import { motion } from 'motion/react';

type BoardFilter = 'todas' | ExamBoard;

export default function Obras() {
  const [works, setWorks] = useState<LiteraryWork[] | null>(null);
  const [requirementsByWork, setRequirementsByWork] = useState<Record<string, ExamRequirement[]>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [boardFilter, setBoardFilter] = useState<BoardFilter>('todas');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getLiteraryWorks()
      .then(async (ws) => {
        setWorks(ws);
        setRequirementsByWork(await getAllExamRequirements(ws.map((w) => w.id)));
      })
      .catch((error) => {
        console.error('Failed to load literary catalog:', error);
        setLoadError('Não foi possível carregar o catálogo de obras. Tente recarregar a página.');
      });
  }, []);

  const filtered = useMemo(() => {
    if (!works) return [];
    const term = search.trim().toLowerCase();
    return works.filter((w) => {
      const reqs = requirementsByWork[w.id] ?? [];
      const boardMatch = boardFilter === 'todas' || reqs.some((r) => r.board === boardFilter && r.active);
      const searchMatch = !term || w.title.toLowerCase().includes(term) || w.author.toLowerCase().includes(term);
      return boardMatch && searchMatch;
    });
  }, [works, requirementsByWork, boardFilter, search]);

  return (
    <SubjectAtmosphere subject="literatura" focus={0.4}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" data-geometry="layer">
      <header>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Dossiês Literários · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <Library className="w-7 h-7 text-action-primary" />
          Obras Obrigatórias — Ciclo 2027
        </h1>
        <p className="text-text-secondary mt-1 max-w-2xl text-base">
          Leitura guiada, análise analítica e treino de prova para as obras exigidas por FUVEST e Unicamp/Comvest.
        </p>
      </header>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por obra ou autor..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-border-subtle bg-surface-default text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-focus-ring"
          />
        </div>
        <div className="flex gap-2">
          {(['todas', 'FUVEST', 'UNICAMP'] as const).map((b) => {
            const active = boardFilter === b;
            return (
              <button
                key={b}
                onClick={() => setBoardFilter(b)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                  active
                    ? 'bg-action-primary text-warm-50 font-bold shadow-sm ring-1 ring-white/20'
                    : 'border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary bg-surface-default/70'
                }`}
              >
                {b.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {loadError && (
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm">{loadError}</div>
      )}

      {!works && !loadError && (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando catálogo...
        </div>
      )}

      {works && filtered.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
          Nenhuma obra encontrada com esse filtro.
        </div>
      )}

      {works && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w, index) => {
            const reqs = (requirementsByWork[w.id] ?? []).filter((r) => r.active);
            const mConfig = getMotionConfigForSubject('literatura');
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={mConfig.hoverProps.whileHover}
                whileTap={mConfig.hoverProps.whileTap}
              >
                <Link
                  to={`/obras/${w.slug}`}
                  className="block h-full bg-surface-default border border-border-subtle rounded-xl p-5 shadow-soft-sm hover:border-action-primary/40 transition-colors"
                >
                  <p className="font-semibold text-text-primary leading-snug">{w.title}</p>
                  <p className="text-xs font-mono text-text-muted mt-1">{w.author} · {w.genre}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {reqs.map((r) => (
                      <span key={r.id} className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-secondary text-text-muted">
                        {r.board}
                      </span>
                    ))}
                  </div>
                  {reqs[0]?.requiredScope && reqs[0].requiredScope !== 'obra completa' && (
                    <p className="text-xs text-ember-600 dark:text-ember-400 mt-2 line-clamp-2">{reqs[0].requiredScope}</p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </SubjectAtmosphere>
  );
}
