import React from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, Stethoscope } from 'lucide-react';
import '../../../src/index.css';
import { CrivoCore } from '../../../src/components/CrivoCore';
import { Button } from '../../../src/components/ui/Button';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Skeleton } from '../../../src/components/ui/Skeleton';
import { SubjectAtmosphere } from '../../../src/features/daily-plan/components/SubjectAtmosphere';

type HarnessState = 'loading' | 'no-diagnosis' | 'no-urgent-action';

function readState(): HarnessState {
  const candidate = new URLSearchParams(window.location.search).get('state');
  if (candidate === 'no-diagnosis' || candidate === 'no-urgent-action') return candidate;
  return 'loading';
}

function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Lendo seu histórico para montar o plano de hoje…</span>
      <div className="flex items-center gap-4 rounded-card border border-border-subtle bg-surface-elevated p-6 sm:p-8">
        <CrivoCore state="listening" size={56} />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

function EmptyDecision({ state }: { state: Exclude<HarnessState, 'loading'> }) {
  const noDiagnosis = state === 'no-diagnosis';
  return (
    <SubjectAtmosphere>
      <div className="crivo-today-stage">
        <div className="crivo-today-empty">
          <header>
            <p className="crivo-decision-eyebrow">Hoje</p>
            <h1 className="font-display text-3xl font-semibold text-text-primary">Seu plano de estudo</h1>
          </header>
          {noDiagnosis ? (
            <EmptyState
              icon={Stethoscope}
              title="Ainda não há um diagnóstico seu"
              description="O plano de hoje é montado a partir do seu diagnóstico inicial. Sem ele, não há uma base real para recomendar prioridades — em vez de inventar uma, preferimos pedir o diagnóstico primeiro."
              action={<Button>Iniciar diagnóstico</Button>}
            />
          ) : (
            <EmptyState
              icon={CheckCircle2}
              title="Não precisa fazer nada extra hoje"
              description="Com base no seu histórico, você já tem evidências suficientes de domínio nos tópicos ativos e nenhuma revisão urgente pendente."
            />
          )}
        </div>
      </div>
    </SubjectAtmosphere>
  );
}

function Harness() {
  const state = readState();
  return (
    <main data-testid="crivo-state-harness" data-state={state} className="min-h-screen bg-background-base p-6 sm:p-10">
      {state === 'loading' ? <LoadingState /> : <EmptyDecision state={state} />}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Harness />);
