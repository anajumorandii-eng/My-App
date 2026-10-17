import { useEffect, useState } from 'react';
import { workStudyGuides } from '../data/workStudyGuides';
import { loadWorkDossier } from '../lib/workDossiers';
import type { WorkDossier } from '../types/literaryWorks';
import { WorkStudyContent } from './WorkStudyContent';

const works = Object.entries(workStudyGuides).sort((a, b) => a[1].title.localeCompare(b[1].title, 'pt-BR'));
export default function WorkStrategiesExplorer() {
  const [slug, setSlug] = useState(works[0][0]);
  const [state, setState] = useState<{ slug: string; dossier?: WorkDossier; error?: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setState(null);
    void loadWorkDossier(slug).then(dossier => {
      if (cancelled) return;
      setState(dossier ? { slug, dossier } : { slug, error: 'O dossiê desta obra não está disponível.' });
    }).catch(() => { if (!cancelled) setState({ slug, error: 'Não foi possível carregar as estratégias desta obra.' }); });
    return () => { cancelled = true; };
  }, [slug, attempt]);
  return <section className="space-y-4">
    <div className="ni-panel p-5 space-y-3">
      <h2 className="font-display text-xl">Estratégias por obra</h2>
      <p className="text-sm text-[var(--dim)]">Escolha a obra para planejar a leitura, interpretar passagens e construir respostas. Cada roteiro acompanha um resumo aprofundado com análise e evidências do dossiê.</p>
      <label className="text-sm block">Obra da estratégia<select className="field block w-full mt-1" value={slug} onChange={event => setSlug(event.target.value)}>{works.map(([id, work]) => <option key={id} value={id}>{work.title}</option>)}</select></label>
    </div>
    {(!state || state.slug !== slug) ? <p role="status">Carregando estratégias da obra...</p> : state.dossier ? <WorkStudyContent key={slug} dossier={state.dossier} mode="strategy" /> : <div role="alert" className="ni-panel p-5 space-y-3"><p>{state.error}</p><button type="button" onClick={() => setAttempt(value => value + 1)} className="text-sm underline">Tentar novamente</button></div>}
  </section>;
}
