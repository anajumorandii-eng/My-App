import React, { useEffect, useRef } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { CrivoMark } from './CrivoMark';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onStartDiagnostic: () => void;
}

export function OnboardingModal({ open, onClose, onStartDiagnostic }: OnboardingModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = 'onboarding-title';

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const firstFocusable = dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    return () => {
      previouslyFocused.current?.focus();
    };
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="bg-surface-elevated border border-border-subtle rounded-panel shadow-soft-lg max-w-xl w-full overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-card bg-surface-secondary text-action-primary flex items-center justify-center">
              <CrivoMark className="w-6 h-6" />
            </div>
            <IconButton aria-label="Fechar" onClick={onClose}>
              <X className="w-5 h-5" aria-hidden="true" />
            </IconButton>
          </div>

          <h2 id={titleId} className="font-display text-2xl font-semibold text-text-primary mb-3">
            Bem-vindo ao Crivo
          </h2>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Não é um jogo — não há streaks nem pontos. O objetivo é separar o que você já domina do que ainda tem
            lacuna, e priorizar sua <strong className="text-text-primary">autonomia</strong> e seu{' '}
            <strong className="text-text-primary">domínio real</strong> até o dia da prova.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center mr-4 shrink-0 font-semibold text-text-muted">
                1
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Diagnóstico inicial</h3>
                <p className="text-sm text-text-secondary mt-1">Definimos de onde você parte para montar o plano de hoje.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center mr-4 shrink-0 font-semibold text-text-muted">
                2
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Conecte sua agenda</h3>
                <p className="text-sm text-text-secondary mt-1">O tempo disponível hoje ajusta o plano automaticamente.</p>
              </div>
            </div>
          </div>

          <Button onClick={onStartDiagnostic} className="w-full">
            Iniciar diagnóstico
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
