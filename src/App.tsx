/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// View Placeholders
import Dashboard from './views/Dashboard';
import Plano from './views/Plano';
import Sessao from './views/Sessao';
import Questoes from './views/Questoes';
import Revisoes from './views/Revisoes';
import Erros from './views/Erros';
import Podcast from './views/Podcast';
import Tutor from './views/Tutor';
import Laboratorio from './views/Laboratorio';
import Evolucao from './views/Evolucao';
import Conexoes from './views/Conexoes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="plano" element={<Plano />} />
          <Route path="sessao" element={<Sessao />} />
          <Route path="questoes" element={<Questoes />} />
          <Route path="revisoes" element={<Revisoes />} />
          <Route path="erros" element={<Erros />} />
          <Route path="podcast" element={<Podcast />} />
          <Route path="tutor" element={<Tutor />} />
          <Route path="laboratorio" element={<Laboratorio />} />
          <Route path="evolucao" element={<Evolucao />} />
          <Route path="conexoes" element={<Conexoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

