import { StudyActivityVisibleContext } from '../context/StudyActivityContext';
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Router, Routes, Route, UNSAFE_LocationContext, UNSAFE_RouteContext, useNavigate, useSearchParams, createPath, type To } from 'react-router-dom';
import { reviewResources } from '../lib/reviewResources';
import { ErrorBoundary } from './ErrorBoundary';
import { BEFORE_ASSET_RELOAD } from '../lib/assetRecovery';
const ObraDetalhe = lazy(()=>import('../views/ObraDetalhe'));
const resourceRouteContext = { outlet: null, matches: [], isDataRoute: false };

export function ReviewWorkspace({ header }: { header?: (open: (resource: string, path?: string) => void, active: string) => React.ReactNode }) {
  const outerNavigate = useNavigate();
  const [params] = useSearchParams();
  const initial = reviewResources.find(r=>r.id===params.get('recurso')) ?? reviewResources[0];
  const requestedPath = params.get('destino');
  const initialPath = requestedPath && (requestedPath.split(/[?#]/)[0] === initial.path || requestedPath.startsWith(`${initial.path}/`)) ? requestedPath : initial.path;
  const [active,setActive]=useState(initial.id);
  const [locations,setLocations]=useState<Record<string,string>>({[initial.id]:initialPath});
  const open = (id: string, path?: string) => {
    const resource=reviewResources.find(r=>r.id===id);
    if (!resource) return;
    setLocations(previous=>previous[id] ? previous : {...previous,[id]:path ?? resource.path});
    setActive(id);
  };
  const navigator=useMemo(()=>{
    const resourceFor=(path:string)=>reviewResources.find(r=>path.split(/[?#]/)[0]===r.path || path.startsWith(`${r.path}/`));
    const pathFor=(to:To)=>typeof to==='string' ? to : createPath(to);
    const move=(to:To)=>{
      const path=pathFor(to);
      const resource=resourceFor(path);
      if (!resource) { outerNavigate(path); return; }
      setLocations(previous=>({...previous,[resource.id]:path}));
      setActive(resource.id);
    };
    return { push:move, replace:move, go:()=>{}, createHref:(to:To)=>{
      const path=pathFor(to); const resource=resourceFor(path);
      return resource ? `/revisoes?${new URLSearchParams({recurso:resource.id,destino:path})}` : path;
    } };
  },[outerNavigate]);
  useEffect(() => {
    const preserveLocation = () => {
      if (!/^\/revisoes\/?$/.test(window.location.pathname)) return;
      const url = new URL(window.location.href);
      url.searchParams.set('recurso', active);
      url.searchParams.set('destino', locations[active]);
      window.history.replaceState(window.history.state, '', url);
    };
    window.addEventListener(BEFORE_ASSET_RELOAD, preserveLocation);
    return () => window.removeEventListener(BEFORE_ASSET_RELOAD, preserveLocation);
  }, [active, locations]);
  const selected=reviewResources.find(r=>r.id===active)!;
  return <>
    <section className="space-y-3" aria-label="Recursos da central de revisão">
      <nav aria-label="Atividades de revisão" className="flex flex-wrap gap-2">{reviewResources.filter(r=>['fila','resumos-banca','erros','flashcards'].includes(r.id)).map(r=><button key={r.id} type="button" aria-pressed={active===r.id} onClick={()=>open(r.id)} className={`min-h-11 px-4 py-2 text-sm rounded-lg ${active===r.id?'bg-[var(--text)] text-[var(--ink)]':'text-[var(--dim)] hover:bg-[var(--surface-secondary)]'}`}>{r.id==='resumos-banca'?'Criar e abrir revisões':r.label}</button>)}</nav>
      <details className="border-b border-[var(--line)] pb-3"><summary className="cursor-pointer py-2 text-sm text-[var(--dim)]">Outras ferramentas de estudo</summary>
        <label className="block text-sm mt-2">Recurso de revisão<select aria-label="Recurso de revisão" className="field mt-1 block w-full min-h-11" value={active} onChange={e=>open(e.target.value)}>{reviewResources.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <p className="mt-2 text-xs text-[var(--dim)]">{selected.description}</p>
        <details className="mt-3"><summary className="cursor-pointer py-2 text-sm">Guias e orientação de uso</summary><p className="text-xs text-[var(--dim)] mt-2">As atividades abertas permanecem nesta aba ao alternar recursos.</p><div className="flex flex-wrap gap-4 text-sm mt-2"><a href="/study-guide.html" target="_blank" rel="noreferrer" className="underline">Guia de estudo</a><a href="/real-exams/unicamp-2026.pdf" target="_blank" rel="noreferrer" className="underline">Caderno Unicamp 2026</a></div></details>
      </details>
    </section>
    {header?.(open, active)}
    {reviewResources.filter(r=>locations[r.id]).map(resource=>{
      const Component=resource.Component;
      return <div key={resource.id} hidden={active!==resource.id} className="mt-4 min-w-0 [&_.ni-main]:p-0" aria-label={resource.label}>
        {/* Each retained activity has its own URL. A link opened from errors
            must not change the query or destroy a draft in another activity. */}
        <StudyActivityVisibleContext.Provider value={active===resource.id}>
        <UNSAFE_LocationContext.Provider value={null!}>
        <UNSAFE_RouteContext.Provider value={resourceRouteContext}>
          <Router location={locations[resource.id]} navigator={navigator}>
            <ErrorBoundary resetKey={locations[resource.id]}><Suspense fallback={<p role="status">Carregando {resource.label.toLowerCase()}...</p>}>
              <Routes>
                {resource.id==='obras' && <Route path="/obras/:workSlug" element={<ObraDetalhe />} />}
                <Route path="*" element={<Component />} />
              </Routes>
            </Suspense></ErrorBoundary>
          </Router>
        </UNSAFE_RouteContext.Provider>
        </UNSAFE_LocationContext.Provider>
        </StudyActivityVisibleContext.Provider>
      </div>;
    })}
  </>;
}
