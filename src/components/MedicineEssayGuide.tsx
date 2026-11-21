import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Panel } from './ui/Panel';
import {
  medicineEssayGuides,
  vunespEssayDrills,
  vunespEssaySteps,
  vunespWeeklyPlan,
  vunespZeroChecklist,
  type MedicineEssayBoard,
} from '../data/vunespMedicineEssayGuide';

const BOARDS: MedicineEssayBoard[] = ['Famerp', 'Unifesp'];
const H2 = 'font-display font-medium text-sm text-[var(--text)] mb-2';
const TEXT = 'text-xs text-[var(--dim)] leading-relaxed';

export function MedicineEssayGuide() {
  const [board, setBoard] = useState<MedicineEssayBoard>('Famerp');
  const guide = medicineEssayGuides[board];

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label="Vestibular" className="flex gap-2">
        {BOARDS.map((b) => (
          <button
            key={b}
            role="tab"
            aria-selected={board === b}
            onClick={() => setBoard(b)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${board === b ? 'bg-[var(--action-primary)] text-[var(--text-inverse)] border-transparent' : 'border-[var(--line)] text-[var(--text)]'}`}
          >
            {b}
          </button>
        ))}
      </div>

      <Panel subject="Português" className="ni-panel p-4 space-y-2">
        <h2 className={H2}>Como é a prova</h2>
        <p className={TEXT}>{guide.when}</p>
        <p className={TEXT}><b className="text-[var(--text)]">Pontuação:</b> {guide.scoring}</p>
        <p className={`text-[11px] flex items-start gap-1.5 ${guide.confirmed ? 'text-[var(--dim)]' : 'text-amber-900 dark:text-amber-200'}`}>
          {!guide.confirmed && <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
          <span>Fonte: {guide.sourceNote}</span>
        </p>
      </Panel>

      <section>
        <h2 className={H2}>Os quatro critérios {guide.confirmed ? 'do edital' : 'da Vunesp'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {guide.criteria.map((c) => (
            <Panel key={c.id} subject="Português" className="ni-panel p-4 space-y-1.5">
              <h3 className="font-semibold text-xs text-[var(--text)]">{c.name}</h3>
              <p className={TEXT}>{c.whatIsEvaluated}</p>
              <p className="text-xs text-[var(--text)] leading-relaxed"><b>Como garantir:</b> {c.howToSecure}</p>
            </Panel>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Panel subject="Português" className="ni-panel p-4">
          <h2 className={`${H2} flex items-center gap-1.5`}><XCircle className="w-3.5 h-3.5 text-[#e08391]" />O que zera a redação</h2>
          <ul className="space-y-1">{guide.zeroRules.map((r) => <li key={r} className={TEXT}>• {r}</li>)}</ul>
        </Panel>
        <Panel subject="Português" className="ni-panel p-4 space-y-3">
          <div>
            <h2 className={H2}>Extensão e penalidades</h2>
            <ul className="space-y-1">{guide.lengthRules.map((r) => <li key={r} className={TEXT}>• {r}</li>)}</ul>
          </div>
          <div>
            <h2 className={H2}>O que não é exigido</h2>
            <ul className="space-y-1">{guide.notRequired.map((r) => <li key={r} className={TEXT}>• {r}</li>)}</ul>
          </div>
        </Panel>
      </div>

      <section>
        <h2 className={H2}>Temas reais ({guide.themes.length} provas)</h2>
        <div className="space-y-2">
          {guide.themes.map((t) => (
            <Panel key={t.year} subject="Português" className="ni-panel p-3">
              <p className="text-xs text-[var(--text)]"><b>{t.year}</b> — {t.theme}</p>
              <p className="text-[11px] text-[var(--dim)] mt-0.5">Forma: {t.shape}. Recortes possíveis: {t.possibleAngles.join('; ')}.</p>
            </Panel>
          ))}
        </div>
      </section>

      <section>
        <h2 className={H2}>Passo a passo em 60 minutos</h2>
        <ol className="space-y-2">
          {vunespEssaySteps.map((s) => (
            <li key={s.title}>
              <Panel subject="Português" className="ni-panel p-3">
                <p className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{s.minutes} min · {s.title}</p>
                <ul className="mt-1 space-y-0.5">{s.actions.map((a) => <li key={a} className={TEXT}>• {a}</li>)}</ul>
              </Panel>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className={H2}>Exercícios por critério</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vunespEssayDrills.map((d) => (
            <Panel key={d.id} subject="Português" className="ni-panel p-4 space-y-1.5">
              <h3 className="font-semibold text-xs text-[var(--text)]">{d.title} <span className="font-normal text-[var(--dim)]">· {d.criterion} · {d.minutes} min</span></h3>
              <ol className="list-decimal pl-4 space-y-0.5">{d.instructions.map((i) => <li key={i} className={TEXT}>{i}</li>)}</ol>
              <p className="text-[11px] text-[var(--text)]"><b>Pronto quando:</b> {d.doneWhen}</p>
            </Panel>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Panel subject="Português" className="ni-panel p-4">
          <h2 className={H2}>Roteiro semanal</h2>
          <ul className="space-y-1">{vunespWeeklyPlan.map((w) => <li key={w.day} className={TEXT}><b className="text-[var(--text)]">{w.day}:</b> {w.task}</li>)}</ul>
        </Panel>
        <Panel subject="Português" className="ni-panel p-4">
          <h2 className={H2}>Antes de entregar</h2>
          <ul className="space-y-1">
            {vunespZeroChecklist.map((c) => (
              <li key={c} className={`${TEXT} flex items-start gap-1.5`}><CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />{c}</li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
