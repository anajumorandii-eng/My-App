import { useState } from 'react';
import { CrivoMark } from './CrivoMark';

/** Mantém a marca visível quando o Safari não consegue carregar o ícone. */
export function CrivoAppMark() {
  const [failed, setFailed] = useState(false);
  return failed
    ? <CrivoMark className="ni-brand-fallback" />
    : <img src="/icon-192.png?v=3" alt="" onError={() => setFailed(true)} />;
}
