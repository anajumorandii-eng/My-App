import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStrategyGuides } from '../hooks/useStrategyGuides';
import { printStrategyGuide } from '../lib/printStrategyGuide';
import { isStudyPacket } from '../lib/studySources';
import { canonicalExamBoard } from '../lib/questionExamFilters';
import type { StrategyGuide } from '../lib/strategyGuides';
import { AiText } from '../components/AiText';
import { StudySourcesPanel } from '../components/StudySourcesPanel';

const PAGE_SIZE = 12;
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const guideBoards = (guide: StrategyGuide) => [...new Set([guide.board, ...(Array.isArray(guide.targetBoards) ? guide.targetBoards.filter(item => typeof item === 'string') : [])].map(canonicalExamBoard))];
const dateLabel = (value: string) => Number.isNaN(Date.parse(value)) ? 'Data não informada' : new Date(value).toLocaleString('pt-BR');

export default function Aprofundamentos() {
  const { user } = useAuth();
  return <GuideLibrary key={user?.uid ?? 'guest'} uid={user?.uid ?? null} />;
}

function GuideLibrary({ uid }: { uid: string | null }) {
  const { guides, loading, error, reload, persist, saveMessage } = useStrategyGuides(uid);
  const [params, setParams] = useSearchParams();
  const [printError, setPrintError] = useState('');
  const [saving, setSaving] = useState(false);
  const printContent = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const all = Object.values(guides);
  const subjects = [...new Set(all.map(guide => guide.subject))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const boards = [...new Set(all.flatMap(guideBoards))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  const query = params.get('busca') ?? '';
  const subject = params.get('materia') ?? '';
  const board = canonicalExamBoard(params.get('banca') ?? '');
  const order = params.get('ordem') === 'assunto' ? 'assunto' : 'recentes';
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const filtered = all.filter(guide => (!subject || guide.subject === subject) && (!board || guideBoards(guide).includes(board)) &&
    terms.every(term => normalize([guide.subject, guide.topicName, guide.chapter, guide.board, guide.text].join(' ')).includes(term)))
    .sort((a, b) => order === 'assunto' ? (a.chapter || a.topicName).localeCompare(b.chapter || b.topicName, 'pt-BR') || b.savedAt.localeCompare(a.savedAt) : b.savedAt.localeCompare(a.savedAt));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number.parseInt(params.get('pagina') ?? '1', 10) || 1));
  const requestedKey = params.get('guia');
  const selected = requestedKey && Object.hasOwn(guides, requestedKey) ? guides[requestedKey] : undefined;
  const back = new URLSearchParams(params); back.delete('guia');
  const backUrl = `/aprofundamentos${back.size ? `?${back}` : ''}`;
  const updateFilter = (field: string, value: string) => setParams(previous => {
    const next = new URLSearchParams(previous); next.delete('pagina'); next.delete('guia');
    if (value) next.set(field, value); else next.delete(field);
    return next;
  }, { replace: true });
  const guideUrl = (guide: StrategyGuide) => { const next = new URLSearchParams(params); next.set('guia', guide.key); return `/aprofundamentos?${next}`; };
  const contextUrl = selected ? `/estrategias?${new URLSearchParams({ topic: selected.topicId, ...(selected.chapter ? { chapter: selected.chapter } : {}), board: selected.board })}` : '/estrategias';
  useEffect(() => {
    if (selected) { heading.current?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }, [selected?.key]);

  return <div className="ni-main space-y-5">
    <div className="ni-route"><span>Biblioteca</span><i /><b>MEUS APROFUNDAMENTOS</b></div>
    <div className="ni-title"><div><h1 ref={heading} tabIndex={-1}>{selected ? selected.chapter || selected.topicName : 'Meus aprofundamentos'}</h1><p>{selected ? `${selected.subject} · ${selected.topicName} · ${selected.board}` : 'Seus guias gerados, organizados para consultar, retomar e imprimir.'}</p></div></div>
    {loading && <p role="status" className="text-sm">Carregando os aprofundamentos da sua conta…</p>}
    {error && <div role="alert" className="ni-panel p-4 space-y-2"><p>{error}</p><button className="underline text-sm" onClick={reload}>Tentar carregar novamente</button></div>}
    {requestedKey ? <>
      <Link to={backUrl} className="text-sm underline">Voltar à biblioteca de aprofundamentos</Link>
      {selected ? <>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm" onClick={() => {
            if (!printContent.current) return;
            try { printStrategyGuide(printContent.current, `Aprofundamento — ${selected.subject} — ${selected.chapter || selected.topicName}`); setPrintError(''); }
            catch { setPrintError('Não foi possível abrir a impressão. Tente novamente.'); }
          }}>Imprimir / Salvar em PDF</button>
          <Link to={contextUrl} className="text-sm underline">Voltar à estratégia deste tópico</Link>
          {uid && <button type="button" disabled={saving} className="text-sm underline disabled:opacity-50" onClick={async () => { setSaving(true); try { await persist(selected); } finally { setSaving(false); } }}>{saving ? 'Salvando…' : 'Salvar novamente na conta'}</button>}
        </div>
        {saveMessage && <p role="status" className="text-xs text-[var(--dim)]">{saveMessage}</p>}
        {printError && <p role="alert" className="text-sm">{printError}</p>}
        <article ref={printContent} className="ni-panel p-5 space-y-4">
          <h2 className="font-display text-xl">{selected.subject} · {selected.chapter || selected.topicName}</h2>
          <p className="text-sm text-[var(--dim)]">{selected.topicName} · {selected.board} · Salvo em {dateLabel(selected.savedAt)}</p>
          <AiText text={selected.text} className="text-sm leading-relaxed" />
          {isStudyPacket(selected.studyPacket) && <StudySourcesPanel packet={selected.studyPacket} />}
        </article>
      </> : !loading && <div className="ni-panel p-5 space-y-3"><h2 className="font-semibold">Guia não encontrado nas cópias disponíveis</h2><p className="text-sm">Confira se você está na mesma conta em que gerou o aprofundamento. Os outros guias continuam na biblioteca.</p></div>}
    </> : <>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[var(--dim)]">{uid ? 'Guias da sua conta e cópias deste navegador.' : 'Guias salvos neste navegador. Entre na sua conta para acessar também os guias da conta.'}</p><Link to="/estrategias" className="text-sm underline">Criar novo aprofundamento</Link></div>
      <section aria-label="Filtros dos aprofundamentos" className="ni-panel p-4 space-y-3">
        <label className="block text-sm">Buscar nos aprofundamentos<input type="search" className="field block w-full mt-1" value={query} maxLength={200} onChange={event => updateFilter('busca', event.target.value)} placeholder="Matéria, tópico, capítulo ou palavra do guia" /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">Matéria<select className="field block w-full mt-1" value={subject} onChange={event => updateFilter('materia', event.target.value)}><option value="">Todas as matérias</option>{subjects.map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="block text-sm">Banca<select className="field block w-full mt-1" value={board} onChange={event => updateFilter('banca', event.target.value)}><option value="">Todos os recortes de banca</option>{boards.map(value => <option key={value} value={value}>{value === 'TODAS AS BANCAS' ? 'Guias multibanca' : value}</option>)}</select></label>
          <label className="block text-sm">Ordenar por<select className="field block w-full mt-1" value={order} onChange={event => updateFilter('ordem', event.target.value)}><option value="recentes">Mais recentes</option><option value="assunto">Assunto (A–Z)</option></select></label>
        </div>
        <p role="status" className="text-sm text-[var(--dim)]">{filtered.length} {filtered.length === 1 ? 'guia encontrado' : 'guias encontrados'}</p>
        {(query || subject || board) && <button type="button" className="text-sm underline" onClick={() => setParams({})}>Limpar filtros</button>}
      </section>
      {filtered.length ? <>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(guide => <Link key={guide.key} to={guideUrl(guide)} aria-label={`Abrir aprofundamento: ${guide.chapter || guide.topicName} · ${guide.subject} · ${guide.board}`} className="ni-panel block p-4 space-y-2 hover:border-[var(--primary)]">
          <p className="text-xs text-[var(--dim)]">{guide.subject} · {guide.board}</p><h2 className="font-display text-lg">{guide.chapter || guide.topicName}</h2>{guide.chapter && <p className="text-sm text-[var(--dim)]">{guide.topicName}</p>}<p className="text-xs text-[var(--dim)]">{dateLabel(guide.savedAt)}</p><span className="text-sm underline">Ler aprofundamento</span>
        </Link>)}</div>
        {totalPages > 1 && <nav aria-label="Páginas dos aprofundamentos" className="flex flex-wrap items-center justify-center gap-4"><button type="button" disabled={page === 1} className="text-sm underline disabled:opacity-50" onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('pagina', String(page - 1)); return next; })}>Anterior</button><span className="text-sm">Página {page} de {totalPages}</span><button type="button" disabled={page === totalPages} className="text-sm underline disabled:opacity-50" onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.set('pagina', String(page + 1)); return next; })}>Próxima</button></nav>}
      </> : !loading && <div className="ni-panel p-5 space-y-3"><h2 className="font-semibold">{all.length ? 'Nenhum guia corresponde aos filtros' : 'Sua biblioteca ainda não tem aprofundamentos'}</h2><p className="text-sm">{all.length ? 'Tente outro termo ou limpe os filtros.' : 'Ao aprofundar um tópico em Estratégias, o guia será salvo aqui automaticamente.'}</p></div>}
    </>}
  </div>;
}
