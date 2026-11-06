import { lazy, Suspense, useEffect, useId, useRef, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { prepareStudyReading, type ReadingSection } from '../lib/studyReading';
const StudyReader = lazy(() => import('./StudyReader'));

export function StudyReaderButton({ title, getContent, disabled = false, label = 'Leitura Crivo' }: { title: string; getContent: () => HTMLElement | null; disabled?: boolean; label?: string }) {
  const id = useId().replace(/:/g, '');
  const opener = useRef<HTMLButtonElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [reading, setReading] = useState<{ content: HTMLElement; sections: ReadingSection[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => controller.current?.abort(), []);
  const open = async () => {
    if (busy) return;
    const abort = new AbortController(); controller.current = abort; setBusy(true); setError('');
    try {
      let content = getContent(); if (!content) throw new Error('Sem conteúdo');
      if (content.querySelector('[data-ai-text-pending]')) await new Promise<void>((resolve, reject) => {
        const finish = (failed?: boolean) => { observer.disconnect(); clearTimeout(timer); abort.signal.removeEventListener('abort', cancel); failed ? reject(new Error('Leitura indisponível')) : resolve(); };
        const cancel = () => finish(true);
        const observer = new MutationObserver(() => { const next = getContent(); if (next && !next.querySelector('[data-ai-text-pending]')) { content = next; finish(); } });
        const timer = setTimeout(() => finish(true), 15_000);
        observer.observe(content!, { childList: true, subtree: true }); observer.observe(document.body, { childList: true, subtree: true }); abort.signal.addEventListener('abort', cancel, { once: true });
        if (!content!.querySelector('[data-ai-text-pending]')) finish();
      });
      if (!abort.signal.aborted) setReading(prepareStudyReading(content!, `reading-${id}`));
    } catch { if (!abort.signal.aborted) setError('Não foi possível abrir a leitura agora. Tente novamente.'); }
    finally { if (!abort.signal.aborted) setBusy(false); }
  };
  return <span data-print-exclude className="inline-flex flex-wrap items-center gap-2">
    <button ref={opener} type="button" disabled={disabled || busy} onClick={() => void open()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2 text-sm disabled:opacity-50"><BookOpen aria-hidden="true" className="h-4 w-4" />{busy ? 'Preparando leitura…' : label}</button>
    {error && <span role="alert" className="text-sm">{error}</span>}
    {reading && <Suspense fallback={<span role="status">Abrindo leitura…</span>}><StudyReader title={title} content={reading.content} sections={reading.sections} onClose={() => { setReading(null); opener.current?.focus(); }} /></Suspense>}
  </span>;
}
