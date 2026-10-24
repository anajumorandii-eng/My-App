import { useEffect, useRef, useState } from 'react';

export function DeleteStudyMaterial({ title, remove, disabled = false, onDeleted }: {
  title: string; remove: () => Promise<void>; disabled?: boolean; onDeleted?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const cancel = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (confirming) cancel.current?.focus(); }, [confirming]);
  const close = () => { setConfirming(false); setError(''); trigger.current?.focus(); };
  return <div className="space-y-2" data-print-exclude>
    <button ref={trigger} type="button" className="text-sm underline disabled:opacity-50" disabled={disabled || busy} aria-expanded={confirming} onClick={() => setConfirming(true)}>Excluir material: {title}</button>
    {confirming && <div role="group" aria-label={`Confirmar exclusão de ${title}`} className="rounded-lg border border-[var(--line)] p-3 space-y-3" onKeyDown={event => { if (event.key === 'Escape' && !busy) close(); }}>
      <p className="text-sm">Excluir “{title}” da sua biblioteca? Você poderá gerar outro. PDFs já baixados permanecem no dispositivo. Seu progresso de estudo será preservado.</p>
      <div className="flex flex-wrap gap-4">
        <button ref={cancel} type="button" className="text-sm underline" disabled={busy} onClick={close}>Cancelar</button>
        <button type="button" className="text-sm underline disabled:opacity-50" disabled={busy || disabled} onClick={async () => {
          setBusy(true); setError('');
          try { await remove(); setConfirming(false); onDeleted?.(); }
          catch { setError('Não foi possível excluir o material. Ele continua disponível. Tente novamente.'); }
          finally { setBusy(false); }
        }}>{busy ? 'Excluindo…' : 'Confirmar exclusão'}</button>
      </div>
      {error && <p role="alert" className="text-sm">{error}</p>}
    </div>}
  </div>;
}
