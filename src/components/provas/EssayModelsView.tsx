import { Link } from 'react-router-dom';
import { AlertTriangle, BookOpen, Target } from 'lucide-react';
import { Panel } from '../ui/Panel';
import type { EssayModel } from '../../data/examTheory';

const LINK = 'text-sm underline underline-offset-2 hover:text-[var(--action-primary)]';

/**
 * Uma redação-modelo por tema real. Cada parágrafo vem com o que ele garante na
 * grade da banca, porque o ganho está em ver a decisão, e não em decorar o
 * texto: a Vunesp zera redação muito semelhante a modelo.
 */
export function EssayModelsView({ boardName, essays }: { boardName: string; essays: EssayModel[] }) {
  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-2">
        <h3 className="font-semibold">Redações-modelo nos temas reais da {boardName}</h3>
        <p className="text-sm">Cada modelo foi escrito pelo CRIVO no padrão de nota máxima da grade da Vunesp (Tema, Estrutura, Língua e Coesão), em quatro parágrafos e cerca de 28 linhas. Ao lado de cada parágrafo está o que ele garante na correção.</p>
        <p className="text-sm flex items-start gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden /><span>Use os modelos para estudar decisões, não para decorar: o edital zera a redação idêntica ou muito semelhante a um modelo.</span></p>
        <Link className={LINK} to="/redacao">Critérios do edital, o que zera e exercícios: aba Redação</Link>
      </Panel>

      {essays.map((e) => (
        <details key={e.year} className="ni-panel p-4 space-y-3">
          <summary className="cursor-pointer flex flex-wrap items-baseline gap-2">
            <span className="text-xs">{e.year}</span>
            <span className="font-semibold">{e.theme}</span>
          </summary>

          <section className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><Target className="w-4 h-4" aria-hidden />Forma do tema e tese</h4>
            <p className="text-sm">{e.shape}</p>
            <p className="text-sm"><b>Tese:</b> {e.thesis}</p>
          </section>

          <section className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" aria-hidden />Onde a fuga parcial acontece</h4>
            <ul className="text-sm list-disc pl-5 space-y-0.5">{e.recorteTraps.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>

          <section className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><BookOpen className="w-4 h-4" aria-hidden />A redação, parágrafo por parágrafo</h4>
            {e.paragraphs.map((p) => (
              <div key={p.role} className="grid gap-2 md:grid-cols-[3fr_2fr]">
                <div>
                  <p className="text-xs font-semibold">{p.role}</p>
                  <p className="text-sm leading-relaxed" style={{ textIndent: '1.5em' }}>{p.text}</p>
                </div>
                <ul className="text-xs list-disc pl-5 space-y-0.5 border-l border-[var(--line)] md:pl-6">{p.doesWhat.map((d) => <li key={d}>{d}</li>)}</ul>
              </div>
            ))}
          </section>

          <section className="space-y-1">
            <h4 className="text-sm font-semibold">Repertório e o que cada um prova</h4>
            <ul className="text-sm list-disc pl-5 space-y-0.5">{e.repertoire.map((r) => <li key={r.item}><b>{r.item}:</b> {r.proves}.</li>)}</ul>
          </section>
        </details>
      ))}
    </div>
  );
}
