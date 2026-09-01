/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { LegacyPrototypeRedirect } from './components/LegacyPrototypeRedirect';
import { AuthProvider } from './context/AuthContext';

import Dashboard from './views/Dashboard';
import Plano from './views/Plano';
import RetaFinal from './views/RetaFinal';
import Sessao from './views/Sessao';
import Questoes from './views/Questoes';
import Revisoes from './views/Revisoes';
import Erros from './views/Erros';
import Podcast from './views/Podcast';
import Tutor from './views/Tutor';
import Laboratorio from './views/Laboratorio';
import Evolucao from './views/Evolucao';
import Prioridades from './views/Prioridades';
import Estrategias from './views/Estrategias';
import Conexoes from './views/Conexoes';
import Perfil from './views/Perfil';
import Redacao from './views/Redacao';
import Treino2aFase from './views/Treino2aFase';
import Recuperacao from './views/Recuperacao';
import Diagnostico from './views/Diagnostico';
import Admin from './views/Admin';
import AdminObras from './views/AdminObras';
import AdminConteudo from './views/AdminConteudo';
import Flashcards from './views/Flashcards';
import ObrasObrigatorias from './views/ObrasObrigatorias';
import Obras from './views/Obras';
import ObraDetalhe from './views/ObraDetalhe';
import AgendaView from './features/availability/AgendaView';
import Resumos from './views/Resumos';
import CrivoDesignSystemGallery from './prototypes/CrivoDesignSystemGallery';

// Import Crivo Design System Global Styles
import './design-system/css/nucleo-instrumental-prototype.css';
import './design-system/css/nucleo-instrumental-rail.css';
import './design-system/css/nucleo-instrumental-cores.css';
import './design-system/css/nucleo-instrumental-brand.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Links compartilhados do mock agora abrem as telas produtivas. */}
          <Route path="/prototipo" element={<LegacyPrototypeRedirect />} />
          <Route path="/crivo-gallery" element={<CrivoDesignSystemGallery />} />
          <Route path="/nucleo-instrumental" element={<LegacyPrototypeRedirect />} />
          <Route path="/prototype/nucleo-instrumental" element={<LegacyPrototypeRedirect />} />
          
          <Route path="/" element={<Layout />}>
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
      </BrowserRouter>
    </AuthProvider>
  );
}
