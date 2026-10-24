import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authHeaders } from '../lib/auth';
import { coverContextKey, readPrintCoverContext } from '../lib/printCoverContext';
import { createStrategyPrintRoot } from '../lib/printStrategyGuide';
import { requestStudyPdf } from '../lib/printPdfFile';
import { printStyles } from '../lib/printStyles';
import { loadSavedStudyPdf, studyPdfDocumentId } from '../lib/savedStudyPdf';

// Reuse the completed file when opening its library entry in this session.
const completedFiles = new Map<string, Blob>();

async function capturePrintableContent(getContent: () => HTMLElement | null, signal: AbortSignal): Promise<HTMLElement> {
  const content = getContent();
  if (!content) throw new Error('O conteúdo do material não está disponível.');
  if (content.querySelector('[data-ai-text-pending]')) {
    await new Promise<void>((resolve, reject) => {
      const finish = (failure?: unknown) => { observer.disconnect(); signal.removeEventListener('abort', aborted); failure ? reject(failure) : resolve(); };
      const aborted = () => finish(signal.reason);
      const observer = new MutationObserver(() => { if (!content.querySelector('[data-ai-text-pending]')) finish(); });
      observer.observe(content, { childList: true, subtree: true });
      signal.addEventListener('abort', aborted, { once: true });
      if (signal.aborted) aborted();
    });
  }
  signal.throwIfAborted();
  return content.cloneNode(true) as HTMLElement;
}

export function DeepeningPdf({ getContent, title, guideKey, revision, generateCover = false, autoGenerate = true, onBusyChange, materialLabel = 'Aprofundamento' }: {
  getContent: () => HTMLElement | null;
  title: string;
  guideKey: string;
  revision: string;
  generateCover?: boolean;
  autoGenerate?: boolean;
  materialLabel?: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const { user } = useAuth();
  const [attempt, setAttempt] = useState(0);
  const [edition,setEdition]=useState('original');
  const [file, setFile] = useState<{ key: string; url: string; blob: Blob }>();
  const [error, setError] = useState('');
  const [idle, setIdle] = useState(false);
  const [requestedKey, setRequestedKey] = useState('');
  const preparedContent = useRef<{ key: string; content: HTMLElement } | undefined>(undefined);
  const documentKey = JSON.stringify(['study-quality-v2',user?.uid,guideKey,revision,materialLabel,title]);
  const cacheKey = JSON.stringify([documentKey,edition]);
  const ready = file?.key === cacheKey ? file : undefined;
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    setFile(undefined); setError(''); setIdle(false); onBusyChange?.(true);
    const previous = preparedContent.current?.key === cacheKey ? preparedContent.current.content : undefined;
    void (async () => {
      try {
        let blob = edition==='original'?completedFiles.get(documentKey):undefined;
        // Library headings may omit the board; identity follows the saved guide.
        const documentId = user ? await studyPdfDocumentId(JSON.stringify(['study-pdf-quality-v2', user.uid, guideKey, revision, materialLabel])) : undefined;
        if (!blob && documentId && edition === 'original') {
          blob = await loadSavedStudyPdf(documentId, AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]));
          controller.signal.throwIfAborted();
        }
        if (!blob && !autoGenerate && requestedKey !== cacheKey && edition === 'original') { setIdle(true); return; }
        if (!blob) {
          const content = previous ?? await capturePrintableContent(getContent, AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]));
          if(!previous){
            content.dataset.printCoverEdition=crypto.randomUUID();
            if(edition!=='original'){delete content.dataset.printGeneratedArt;delete content.dataset.printGeneratedContext;}
          }
          if ((generateCover || edition!=='original') && user && !previous) {
            // An unavailable illustration must not discard the completed study text.
            try {
              const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(160_000)]);
              const headers = await authHeaders();
              const capability = await fetch('/api/cover-illustrations', { headers, signal });
              if (capability.ok && (await capability.json()).enabled === true) {
                const context = readPrintCoverContext(content);
                const response = await fetch('/api/cover-illustrations', {
                  method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
                  body: JSON.stringify(context), signal,
                });
                const data = await response.json();
                if (!response.ok || typeof data.dataUrl !== 'string' || data.dataUrl.length > 8_388_640 ||
                    !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(data.dataUrl)) throw new Error('Ilustração indisponível');
                content.dataset.printGeneratedArt = data.dataUrl;
                content.dataset.printGeneratedContext = coverContextKey(context);
              }
            } catch { /* The PDF retains its illustrated standard cover. */ }
          }
          controller.signal.throwIfAborted();
          preparedContent.current = { key: cacheKey, content };
          const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(45_000)]);
          blob = await requestStudyPdf(createStrategyPrintRoot(content, title), title, printStyles, signal, documentId);
          controller.signal.throwIfAborted();
          completedFiles.set(documentKey, blob);
          if (completedFiles.size > 4) completedFiles.delete(completedFiles.keys().next().value!);
        }
        controller.signal.throwIfAborted();
        objectUrl = URL.createObjectURL(blob);
        setFile({ key: cacheKey, url: objectUrl, blob });
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure instanceof Error && failure.name !== 'TimeoutError' ? failure.message : 'Não foi possível preparar o material. Tente novamente.');
      } finally {
        if (!controller.signal.aborted) onBusyChange?.(false);
      }
    })();
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); onBusyChange?.(false); };
  }, [cacheKey, attempt, generateCover, autoGenerate, requestedKey]);
  const filename = `${title.replace(/[^\p{L}\p{N} ._-]/gu, '').slice(0, 120) || 'Crivo'}.pdf`;
  const shareFile = ready ? new File([ready.blob], filename, { type: 'application/pdf' }) : undefined;
  return <div data-print-exclude className="space-y-2 text-sm">
    {ready ? <>
      <p role="status">{materialLabel === 'Aprofundamento' ? 'Aprofundamento pronto, com capa e índice.' : `${materialLabel} pronta, com capa e índice.`}</p>
      <div className="flex flex-wrap items-center gap-3">
        <a className="rounded-lg border border-[var(--line)] px-4 py-2" href={ready.url} target="_blank" rel="noopener">Abrir PDF</a>
        <a className="underline" href={ready.url} download={filename}>Salvar PDF</a>
        <button type="button" className="underline" onClick={()=>setEdition(crypto.randomUUID())}>Gerar novo PDF</button>
        {shareFile && navigator.canShare?.({ files: [shareFile] }) && navigator.share && <button type="button" className="underline" onClick={() => {
          void navigator.share({ files: [shareFile], title }).catch(failure => {
            if (failure?.name !== 'AbortError') setError('Não foi possível compartilhar. Use Abrir PDF ou Salvar PDF.');
          });
        }}>Compartilhar PDF</button>}
      </div>
    </> : idle ? <button type="button" className="underline" onClick={() => setRequestedKey(cacheKey)}>Exportar {materialLabel.toLowerCase()} em PDF</button> : !error && <p role="status">{materialLabel === 'Aprofundamento' ? 'Preparando seu aprofundamento completo…' : `Preparando ${materialLabel.toLowerCase()} completa…`}</p>}
    {error && <div role="alert" className="space-y-2"><p>{error} {materialLabel === 'Aprofundamento' ? 'O texto do seu aprofundamento continua salvo.' : `O texto de ${materialLabel.toLowerCase()} continua salvo.`}</p>
      {!ready && <button type="button" className="underline" onClick={() => setAttempt(value => value + 1)}>Tentar novamente</button>}
    </div>}
  </div>;
}
