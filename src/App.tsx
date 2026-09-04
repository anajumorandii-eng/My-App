/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NucleoInstrumentalProductionLayout from './components/NucleoInstrumentalProductionLayout';
import { LegacyPrototypeRedirect } from './components/LegacyPrototypeRedirect';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Skeleton } from './components/ui/Skeleton';

// Cada tela é seu próprio chunk: abrir o Dashboard não precisa baixar
// Redação, Podcast, Admin e o resto junto. O layout e o contexto de auth
// continuam no bundle inicial porque toda rota passa por eles.
const Dashboard = lazy(() => import('./views/Dashboard'));
const Plano = lazy(() => import('./views/Plano'));
const RetaFinal = lazy(() => import('./views/RetaFinal'));
const Sessao = lazy(() => import('./views/Sessao'));
const Questoes = lazy(() => import('./views/Questoes'));
const Revisoes = lazy(() => import('./views/Revisoes'));
const Erros = lazy(() => import('./views/Erros'));
const Podcast = lazy(() => import('./views/Podcast'));
const Tutor = lazy(() => import('./views/Tutor'));
const Laboratorio = lazy(() => import('./views/Laboratorio'));
const Evolucao = lazy(() => import('./views/Evolucao'));
const Prioridades = lazy(() => import('./views/Prioridades'));
const Estrategias = lazy(() => import('./views/Estrategias'));
const Conexoes = lazy(() => import('./views/Conexoes'));
const Perfil = lazy(() => import('./views/Perfil'));
const Redacao = lazy(() => import('./views/Redacao'));
const Treino2aFase = lazy(() => import('./views/Treino2aFase'));
const Recuperacao = lazy(() => import('./views/Recuperacao'));
const Diagnostico = lazy(() => import('./views/Diagnostico'));
const Admin = lazy(() => import('./views/Admin'));
const AdminObras = lazy(() => import('./views/AdminObras'));
const AdminConteudo = lazy(() => import('./views/AdminConteudo'));
const Flashcards = lazy(() => import('./views/Flashcards'));
const ObrasObrigatorias = lazy(() => import('./views/ObrasObrigatorias'));
const Obras = lazy(() => import('./views/Obras'));
const ObraDetalhe = lazy(() => import('./views/ObraDetalhe'));
const AgendaView = lazy(() => import('./features/availability/AgendaView'));
const Resumos = lazy(() => import('./views/Resumos'));
const CrivoDesignSystemGallery = lazy(() => import('./prototypes/CrivoDesignSystemGallery'));

// Import Crivo Design System Global Styles
import './design-system/css/nucleo-instrumental-prototype.css';
import './design-system/css/nucleo-instrumental-rail.css';
import './design-system/css/nucleo-instrumental-cores.css';
import './design-system/css/nucleo-instrumental-brand.css';

function RouteFallback() {
  return (
    <div className="space-y-4 p-6" aria-busy="true">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

/**
 * Um erro de renderização numa tela derrubava a árvore inteira e deixava a
 * página em branco. Aqui ele para no boundary da rota: o menu e o layout
 * continuam de pé, e navegar pra outra tela limpa o erro (via resetKey).
 */
function RouteShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<RouteFallback />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <RouteShell>
            <Routes>
              {/* Links compartilhados do mock agora abrem as telas produtivas. */}
              <Route path="/prototipo" element={<LegacyPrototypeRedirect />} />
              <Route path="/crivo-gallery" element={<CrivoDesignSystemGallery />} />
              <Route path="/nucleo-instrumental" element={<LegacyPrototypeRedirect />} />
              <Route path="/prototype/nucleo-instrumental" element={<LegacyPrototypeRedirect />} />

              <Route path="/" element={<NucleoInstrumentalProductionLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="plano" element={<Plano />} />
                <Route path="agenda" element={<AgendaView />} />
                <Route path="reta-final" element={<RetaFinal />} />
                <Route path="sessao" element={<Sessao />} />
                <Route path="questoes" element={<Questoes />} />
                <Route path="resumos" element={<Resumos />} />
                <Route path="revisoes" element={<Revisoes />} />
                <Route path="erros" element={<Erros />} />
                <Route path="podcast" element={<Podcast />} />
                <Route path="tutor" element={<Tutor />} />
                <Route path="laboratorio" element={<Laboratorio />} />
                <Route path="evolucao" element={<Evolucao />} />
                <Route path="prioridades" element={<Prioridades />} />
                <Route path="estrategias" element={<Estrategias />} />
                <Route path="conexoes" element={<Conexoes />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="redacao" element={<Redacao />} />
                <Route path="treino-2a-fase" element={<Treino2aFase />} />
                <Route path="recuperacao" element={<Recuperacao />} />
                <Route path="diagnostico" element={<Diagnostico />} />
                <Route path="flashcards" element={<Flashcards />} />
                <Route path="obras-obrigatorias" element={<ObrasObrigatorias />} />
                <Route path="obras" element={<Obras />} />
                <Route path="obras/:workSlug" element={<ObraDetalhe />} />
                <Route path="admin" element={<Admin />} />
                <Route path="admin/obras" element={<AdminObras />} />
                <Route path="admin/conteudo" element={<AdminConteudo />} />
              </Route>
            </Routes>
          </RouteShell>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
