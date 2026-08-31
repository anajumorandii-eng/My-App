import React from 'react';
import { RefreshCw } from 'lucide-react';

export function AdaptiveUpdate({ children }: { children: React.ReactNode }) {
  return (
    <aside className="aj-adaptive-update" role="status" aria-live="polite">
      <span className="aj-adaptive-update__icon" aria-hidden="true">
        <RefreshCw size={18} strokeWidth={1.7} />
      </span>
      <span>
        <strong>Prioridade atualizada</strong>
        <span>{children}</span>
      </span>
    </aside>
  );
}
