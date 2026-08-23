import React, { useCallback, useEffect, useState } from 'react';
import { BookOpen, Upload, ScanSearch, ListChecks, ShieldCheck } from 'lucide-react';
import { getFirebaseIdToken } from '../lib/auth';
import { LiteraryWork, WorkEdition, WorkUnit, ExamRequirement, ExamBoard, AuditStatus, WorkUnitType } from '../../src/types/literaryWorks';

// Painel administrativo da Fase 1 do roteiro de Obras Obrigatórias — cobre a
// esteira Etapa A (upload) → B (auditoria) → C (segmentação, com validação
// humana antes de persistir) → registro de ExamRequirement. Só existe
// alguma coisa pra administrar quando LITERARY_WORKS_ENABLED=true no
// servidor (ver server.ts); com a flag desligada, todo fetch aqui recebe 404
// e a tela mostra a orientação abaixo em vez de quebrar.

interface UnitCandidate {
  type: WorkUnitType;
  order: number;
  title: string;
  pdfStartPage: number;
  pdfEndPage: number;
  extractionConfidence: 'high' | 'medium' | 'low';
}

async function adminFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin/literary${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error || `Falha em ${path} (${response.status})`;
    throw new Error(body.detail ? `${message} — ${body.detail}` : message);
  }
  return body as T;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminObras() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [works, setWorks] = useState<LiteraryWork[]>([]);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const [editions, setEditions] = useState<WorkEdition[]>([]);
  const [units, setUnits] = useState<WorkUnit[]>([]);
  const [candidates, setCandidates] = useState<UnitCandidate[] | null>(null);
  const [segmentingEditionId, setSegmentingEditionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selectedWork = works.find((w) => w.id === selectedWorkId) ?? null;

  const loadWorks = useCallback(async (t: string) => {
    setWorks(await adminFetch<LiteraryWork[]>('/works', t));
  }, []);

  const loadWorkDetail = useCallback(async (t: string, workId: string) => {
    const [eds, us] = await Promise.all([
      adminFetch<WorkEdition[]>(`/works/${workId}/editions`, t),
      adminFetch<WorkUnit[]>(`/works/${workId}/units`, t),
    ]);
    setEditions(eds);
    setUnits(us);
    setCandidates(null);
  }, []);

  useEffect(() => {
    getFirebaseIdToken().then(async (t) => {
      if (!t) throw new Error('Entre na conta administrativa.');
      setToken(t);
      await loadWorks(t);
    }).catch((cause) => setError(cause.message));
  }, [loadWorks]);

  useEffect(() => {
    if (token && selectedWorkId) loadWorkDetail(token, selectedWorkId).catch((cause) => setError(cause.message));
  }, [token, selectedWorkId, loadWorkDetail]);

  async function withBusy(fn: () => Promise<void>) {
    setError('');
    setBusy(true);
    try { await fn(); } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  function handleSeed() {
    withBusy(async () => {
      if (!token) return;
      const result = await adminFetch<{ works: number; examRequirements: number }>('/seed', token, { method: 'POST' });
      await loadWorks(token);
      window.alert(`Catálogo semeado: ${result.works} obras e ${result.examRequirements} exigências de banca.`);
    });
  }

  function handleCreateWork(form: HTMLFormElement) {
    const data = new FormData(form);
    withBusy(async () => {
      if (!token) return;
      const work = await adminFetch<LiteraryWork>('/works', token, {
        method: 'POST',
        body: JSON.stringify({
          slug: data.get('slug'), title: data.get('title'), author: data.get('author'),
          genre: data.get('genre'), language: data.get('language') || 'pt-BR',
        }),
      });
      await loadWorks(token);
      setSelectedWorkId(work.id);
      form.reset();
    });
  }

  function handleUploadEdition(form: HTMLFormElement) {
    const data = new FormData(form);
    const file = data.get('file') as File | null;
    withBusy(async () => {
      if (!token || !selectedWorkId || !file) return;
      const fileBase64 = await fileToBase64(file);
      await adminFetch(`/works/${selectedWorkId}/editions`, token, {
        method: 'POST',
        body: JSON.stringify({
          fileBase64, mimeType: file.type || undefined,
          publisher: data.get('publisher') || undefined, edition: data.get('edition') || undefined,
          rightsStatus: data.get('rightsStatus'),
        }),
      });
      await loadWorkDetail(token, selectedWorkId);
      form.reset();
    });
  }

  function handleAuditPatch(editionId: string, patch: Partial<Pick<WorkEdition, 'integrityStatus' | 'extractionStatus'>>) {
    withBusy(async () => {
      if (!token || !selectedWorkId) return;
      await adminFetch(`/works/${selectedWorkId}/editions/${editionId}/audit`, token, { method: 'PATCH', body: JSON.stringify(patch) });
      await loadWorkDetail(token, selectedWorkId);
    });
  }

  function handleOpenReadUrl(editionId: string) {
    withBusy(async () => {
      if (!token || !selectedWorkId) return;
      const { url } = await adminFetch<{ url: string }>(`/works/${selectedWorkId}/editions/${editionId}/read-url`, token);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  function handleSegment(editionId: string) {
    withBusy(async () => {
      if (!token || !selectedWorkId) return;
      setSegmentingEditionId(editionId);
      const { candidates: found } = await adminFetch<{ candidates: UnitCandidate[] }>(`/works/${selectedWorkId}/editions/${editionId}/segment`, token, { method: 'POST' });
      setCandidates(found);
    });
  }

  function handleConfirmUnits() {
    withBusy(async () => {
      if (!token || !selectedWorkId || !candidates) return;
      await adminFetch(`/works/${selectedWorkId}/units`, token, { method: 'POST', body: JSON.stringify({ units: candidates }) });
      await loadWorkDetail(token, selectedWorkId);
    });
  }

  function handleCreateExamRequirement(form: HTMLFormElement) {
    const data = new FormData(form);
    withBusy(async () => {
      if (!token || !selectedWorkId) return;
      const req: Omit<ExamRequirement, 'id' | 'workId'> = {
        board: data.get('board') as ExamBoard,
        examCycle: String(data.get('examCycle')),
        officialListUrl: String(data.get('officialListUrl')),
        officiallyVerifiedAt: new Date().toISOString().slice(0, 10),
        requiredScope: String(data.get('requiredScope')),
        active: true,
      };
      await adminFetch(`/works/${selectedWorkId}/exam-requirements`, token, { method: 'POST', body: JSON.stringify(req) });
      form.reset();
    });
  }

  return <div className="space-y-8">
    <header>
      <h1 className="text-3xl font-bold flex items-center"><ShieldCheck className="w-7 h-7 mr-3 text-indigo-500" />Obras Obrigatórias — Administração</h1>
      <p className="text-zinc-500 mt-2">Ingestão, auditoria e segmentação (Fase 1 do roteiro). Ativo só quando LITERARY_WORKS_ENABLED=true no servidor.</p>
    </header>
    {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}

    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold flex items-center mb-4"><BookOpen className="w-5 h-5 mr-2" />Obras</h2>
      {works.length === 0 && (
        <button disabled={busy} onClick={handleSeed} className="mb-4 bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm disabled:opacity-50">
          Semear as 18 obras do ciclo 2027 (Fase 0)
        </button>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {works.map((w) => (
          <button key={w.id} onClick={() => setSelectedWorkId(w.id)}
            className={`px-3 py-1.5 rounded-lg text-sm border ${selectedWorkId === w.id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-zinc-200 dark:border-zinc-700'}`}>
            {w.title}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateWork(e.currentTarget); }} className="grid sm:grid-cols-5 gap-2 text-sm">
        <input name="slug" placeholder="slug" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <input name="title" placeholder="Título" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <input name="author" placeholder="Autor" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <input name="genre" placeholder="Gênero (ex.: romance)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <button disabled={busy} className="bg-indigo-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50">Cadastrar obra</button>
      </form>
    </section>

    {selectedWork && <>
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <h2 className="font-semibold flex items-center mb-4"><Upload className="w-5 h-5 mr-2" />Edições — {selectedWork.title}</h2>
        {editions.map((ed) => (
          <div key={ed.id} className="border-b border-zinc-100 dark:border-zinc-800 py-3 text-sm space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span>{ed.publisher || 'sem editora informada'} {ed.edition ? `— ${ed.edition}` : ''}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">integridade: {ed.integrityStatus}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">extração: {ed.extractionStatus}</span>
              <span className="text-xs text-zinc-500">{ed.pdfPageCount} págs.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button disabled={busy} onClick={() => handleOpenReadUrl(ed.id)} className="px-2 py-1 rounded-lg border text-xs">Ler PDF (URL assinada)</button>
              {(['pending', 'needs_review', 'verified', 'rejected'] as AuditStatus[]).map((s) => (
                <button key={s} disabled={busy} onClick={() => handleAuditPatch(ed.id, { integrityStatus: s })}
                  className="px-2 py-1 rounded-lg border text-xs">integridade→{s}</button>
              ))}
              <button disabled={busy} onClick={() => handleSegment(ed.id)} className="px-2 py-1 rounded-lg border text-xs flex items-center">
                <ScanSearch className="w-3.5 h-3.5 mr-1" />Segmentar
              </button>
            </div>
            {segmentingEditionId === ed.id && candidates && (
              <div className="mt-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-xs space-y-1">
                <p className="font-medium">{candidates.length} unidades candidatas (confira antes de confirmar):</p>
                <ul className="max-h-48 overflow-y-auto space-y-0.5">
                  {candidates.map((c, i) => (
                    <li key={i}>{c.order}. {c.title} — págs. {c.pdfStartPage}-{c.pdfEndPage} <em>({c.extractionConfidence})</em></li>
                  ))}
                </ul>
                <button disabled={busy} onClick={handleConfirmUnits} className="mt-1 bg-emerald-600 text-white rounded-lg px-3 py-1">Confirmar e salvar unidades</button>
              </div>
            )}
          </div>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); handleUploadEdition(e.currentTarget); }} className="grid sm:grid-cols-4 gap-2 text-sm mt-3">
          <input name="publisher" placeholder="Editora" className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
          <input name="edition" placeholder="Edição" className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
          <select name="rightsStatus" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800">
            <option value="authorized">authorized</option>
            <option value="pending_review">pending_review</option>
            <option value="restricted">restricted</option>
          </select>
          <input name="file" type="file" accept="application/pdf,.docx" required className="text-xs" />
          <button disabled={busy} className="sm:col-span-4 bg-indigo-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50">Enviar edição (PDF ou .docx)</button>
        </form>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <h2 className="font-semibold flex items-center mb-4"><ListChecks className="w-5 h-5 mr-2" />Unidades confirmadas ({units.length})</h2>
        <ul className="text-sm space-y-1 max-h-64 overflow-y-auto">
          {units.map((u) => <li key={u.id}>{u.order}. {u.title} — págs. {u.pdfStartPage}-{u.pdfEndPage} <em>({u.extractionConfidence})</em></li>)}
        </ul>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Nova exigência de banca (ExamRequirement)</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateExamRequirement(e.currentTarget); }} className="grid sm:grid-cols-2 gap-2 text-sm">
          <select name="board" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800">
            <option value="FUVEST">FUVEST</option>
            <option value="UNICAMP">UNICAMP</option>
          </select>
          <input name="examCycle" placeholder="Ciclo (ex.: 2027)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
          <input name="officialListUrl" placeholder="URL oficial" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" />
          <input name="requiredScope" placeholder="Recorte exigido (ex.: obra completa)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" />
          <button disabled={busy} className="sm:col-span-2 bg-indigo-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50">Cadastrar exigência</button>
        </form>
      </section>
    </>}
  </div>;
}
