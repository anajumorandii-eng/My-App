import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Loader2, Search } from 'lucide-react';
import { LiteraryWork, ExamBoard, ExamRequirement } from '../types/literaryWorks';
import { getLiteraryWorks, getAllExamRequirements } from '../lib/literaryCatalog';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

type BoardFilter = 'todas' | ExamBoard;

const LIT_PALETTE = PALETTES.Literatura;

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

  const LitIcon = SUBJECT_ICONS['Literatura'] ?? BookOpen;

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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <LitIcon className="w-3 h-3" />
          </span>
          LITERATURA
        </span>
        <i />
        <b>OBRAS OBRIGATÓRIAS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Dossiê literário do ciclo 2027.</h1>
          <p>Leitura guiada, análise analítica e treino de prova para FUVEST e Unicamp/Comvest.</p>
        </div>
        <div className="ni-state">
          <i /> perfil {LIT_PALETTE.family} · catálogo ativo
        </div>
      </div>

      {/* Filters */}
      <div className="ni-subjects">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--dim)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar obra ou autor..."
            className="w-full pl-8 pr-3 py-1 rounded bg-[var(--surface2)] text-[var(--text)] text-xs border border-[var(--line)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>
        {(['todas', 'FUVEST', 'UNICAMP'] as const).map((b) => {
          const active = boardFilter === b;
          return (
            <button
              key={b}
              onClick={() => setBoardFilter(b)}
              style={
                active
                  ? { backgroundColor: LIT_PALETTE.primary, color: LIT_PALETTE.wash, borderRadius: '4px', padding: '2px 8px' }
                  : { display: 'inline-flex', alignItems: 'center' }
              }
            >
              {b === 'todas' ? 'Todas' : b}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {loadError && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 p-4 text-sm">{loadError}</div>
      )}

      {/* Loading */}
      {!works && !loadError && (
        <div className="flex items-center justify-center py-16 text-[var(--dim)]">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando catálogo...
        </div>
      )}

      {/* Empty */}
      {works && filtered.length === 0 && (
        <div className="text-center py-16 text-[var(--dim)]">
          Nenhuma obra encontrada com esse filtro.
        </div>
      )}

      {/* Grid */}
      {works && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {filtered.map((w) => {
            const reqs = (requirementsByWork[w.id] ?? []).filter((r) => r.active);
            return (
              <Link key={w.id} to={`/obras/${w.slug}`} className="block h-full">
                <Panel
                  subject="Literatura"
                  interactive
                  className="ni-panel p-5 h-full flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {reqs.map((r) => (
                        <span
                          key={r.id}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: LIT_PALETTE.primary, color: LIT_PALETTE.wash }}
                        >
                          {r.board}
                        </span>
                      ))}
                      {reqs.length === 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface2)] text-[var(--dim)]">—</span>
                      )}
                    </div>
                    <LitIcon className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  </div>
                  <p className="font-display text-base font-semibold text-[var(--text)] leading-snug">{w.title}</p>
                  <p className="text-[11px] font-mono text-[var(--dim)] mt-1">{w.author} · {w.genre}</p>
                  {reqs[0]?.requiredScope && reqs[0].requiredScope !== 'obra completa' && (
                    <p className="text-[11px] text-[var(--primary)] mt-auto pt-3 border-t border-[var(--line)] line-clamp-2">
                      {reqs[0].requiredScope}
                    </p>
                  )}
                </Panel>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
