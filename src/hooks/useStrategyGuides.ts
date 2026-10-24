import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { deletedStrategyGuide } from '../lib/strategyGuides';
import { cacheStrategyGuides, loadStrategyGuides, mergeStrategyGuides, readStrategyGuides, saveStrategyGuide, STRATEGY_GUIDES_CHANGED, strategyGuidesStorageKey, type StrategyGuide } from '../lib/strategyGuides';

/** Shares the existing account/cache collection; no migration or duplicate store. */
export function useStrategyGuides(uid: string | null) {
  const [guides, setGuides] = useState(() => readStrategyGuides(uid));
  const current = useRef(guides);
  const [loading, setLoading] = useState(!!uid);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const update = useCallback((next: typeof guides) => { current.current = next; setGuides(next); }, []);
  useEffect(() => {
    const refresh = () => update(mergeStrategyGuides(current.current, readStrategyGuides(uid)));
    const sameTab = (event: Event) => { if ((event as CustomEvent).detail === uid) refresh(); };
    const otherTab = (event: StorageEvent) => { if (event.key === strategyGuidesStorageKey(uid)) refresh(); };
    window.addEventListener(STRATEGY_GUIDES_CHANGED, sameTab);
    window.addEventListener('storage', otherTab);
    return () => { window.removeEventListener(STRATEGY_GUIDES_CHANGED, sameTab); window.removeEventListener('storage', otherTab); };
  }, [uid, update]);
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setLoading(true); setError('');
    void loadStrategyGuides(uid).then(remote => {
      if (cancelled) return;
      const merged = mergeStrategyGuides(remote, current.current);
      update(merged);
      try { cacheStrategyGuides(uid, merged); } catch { /* Account copy remains readable. */ }
    }).catch(() => {
      if (!cancelled) setError('Não foi possível carregar os guias da conta. As cópias deste navegador continuam disponíveis.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [uid, attempt, update]);
  const persist = async (guide: StrategyGuide) => {
    const next = mergeStrategyGuides(current.current, { [guide.key]: guide });
    if (next[guide.key] !== guide) return;
    update(next);
    let cached = false;
    try { cacheStrategyGuides(uid, next); cached = true; } catch { /* Surface the storage failure below. */ }
    if (!uid) {
      setSaveMessage(cached ? 'Salvo neste navegador. Entre na sua conta para salvar guias na conta.' : 'Não foi possível salvar neste navegador. Imprima o guia antes de sair.');
      return;
    }
    setSaveMessage(cached ? 'Salvo neste navegador. Sincronizando com sua conta...' : 'Salvando na sua conta...');
    try { await saveStrategyGuide(uid, guide); setSaveMessage('Salvo na sua conta.'); }
    catch { setSaveMessage(cached ? 'Salvo neste navegador. Não foi possível sincronizar com sua conta; tente salvar novamente.' : 'Não foi possível salvar. Imprima ou tente salvar novamente antes de sair.'); }
  };
  const remove = async (key: string) => {
    const guide = current.current[key];
    if (!guide || guide.deletedAt) return;
    const marker = deletedStrategyGuide(guide);
    // Account failure leaves the material readable and lets the student retry.
    if (uid) await saveStrategyGuide(uid, marker);
    const next = mergeStrategyGuides(current.current, { [key]: marker });
    if (!uid) cacheStrategyGuides(uid, next);
    update(next);
    if (uid) {
      try { cacheStrategyGuides(uid, next); }
      catch { setSaveMessage('Excluído da conta. Não foi possível atualizar a cópia deste navegador; conecte-se antes de consultá-la novamente.'); }
    }
  };
  const visible = useMemo(() => Object.fromEntries(Object.entries(guides).filter(([, guide]) => !guide.deletedAt)), [guides]);
  return { guides: visible, loading, error, saveMessage, setSaveMessage, persist, remove, reload: () => setAttempt(value => value + 1) };
}
