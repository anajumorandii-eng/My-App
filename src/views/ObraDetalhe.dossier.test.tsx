import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import martha from '../data/obras/dossies/memorias-de-martha.json';
import { DOSSIER_SLUGS, loadWorkDossier, visibleDossier } from '../lib/workDossiers';
import type { WorkDossier } from '../types/literaryWorks';
import ObraDetalhe from './ObraDetalhe';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: null }) }));
vi.mock('../lib/literaryCatalog', () => ({
  getLiteraryWorkBySlug: async (slug: string) => ({ id: slug, slug, title: 'Memórias de Martha', author: 'Júlia Lopes de Almeida', genre: 'romance', language: 'pt-BR' }),
  getEditions: async () => [],
  getExamRequirements: async () => [],
  getWorkUnits: async () => [],
}));
vi.mock('../lib/literaryData', () => ({ getReadingProgress: async () => [], saveReadingProgress: async () => {} }));
afterEach(cleanup);

const STATUSES = ['draft', 'needs_review', 'published', 'rejected'];

describe('dossiês das obras: integridade', () => {
  it.each(DOSSIER_SLUGS)('%s tem referências, páginas e estados coerentes', async slug => {
    const dossier = (await loadWorkDossier(slug))!;
    expect(dossier.slug).toBe(slug);
    const unitIds = new Set(dossier.units.map(u => u.id));
    const evidenceIds = new Set(dossier.evidence.map(e => e.id));
    dossier.units.forEach((unit, index) => {
      expect(unit.order).toBe(index + 1);
      expect(unit.pdfStartPage).toBeLessThanOrEqual(unit.pdfEndPage);
      expect(unit.pdfEndPage).toBeLessThanOrEqual(dossier.edition.pdfPageCount);
      if (index > 0) expect(unit.pdfStartPage).toBeGreaterThan(dossier.units[index - 1].pdfStartPage);
      expect(STATUSES).toContain(unit.guide.editorialStatus);
    });
    for (const card of dossier.evidence) {
      expect(unitIds.has(card.unitId), card.id).toBe(true);
      // A página é o que torna a citação conferível; citação sem página é
      // exatamente o que o modelo de evidência existe para impedir.
      expect(card.location, card.id).toMatch(/p\. \d+/);
      // Trecho curto: o dossiê comenta a obra, não a reproduz.
      expect(card.quote.split(/\s+/).length, card.id).toBeLessThanOrEqual(30);
      expect(card.evidenceLayer).toBe('textual_evidence');
      expect(STATUSES).toContain(card.editorialStatus);
    }
    for (const module of dossier.modules) {
      expect(STATUSES).toContain(module.editorialStatus);
      for (const ref of module.evidenceRefs) expect(evidenceIds.has(ref), ref).toBe(true);
      // Nenhuma fonte crítica foi lida; sourceRefs só entra com CriticalSource real.
      expect(module.sourceRefs).toEqual([]);
    }
  });

  it('a estudante só recebe o que foi publicado', () => {
    const visible = visibleDossier(martha as WorkDossier, false);
    expect(visible.modules).toEqual([]);
    expect(visible.units).toEqual([]);
    expect(visible.evidence).toEqual([]);
    expect(visibleDossier(martha as WorkDossier, true).evidence.length).toBe(martha.evidence.length);
  });
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/obras/:workSlug" element={<ObraDetalhe />} /></Routes>
    </MemoryRouter>,
  );
}

describe('ObraDetalhe com dossiê', () => {
  it('sem publicação, a estudante continua vendo o aviso de conteúdo pendente', async () => {
    renderAt('/obras/memorias-de-martha');
    fireEvent.click(await screen.findByRole('button', { name: 'Análise' }));
    expect(screen.getByText(/A análise integral ainda está em elaboração/)).toBeInTheDocument();
    expect(screen.queryByText('Modo revisão', { exact: false })).toBeNull();
  });

  it('em revisão, mostra análise, capítulos e passagens marcados como em revisão', async () => {
    renderAt('/obras/memorias-de-martha?revisao=1');
    expect(await screen.findByText(/Modo revisão/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Análise' }));
    expect(await screen.findByText('Narradora em dois tempos')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Leitura guiada' }));
    expect(screen.getByText(/0 de 12 unidades concluídas/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Passagens-chave' }));
    expect(screen.getByText('cap. I, p. 8')).toBeInTheDocument();
    expect(screen.getAllByText('em revisão').length).toBeGreaterThan(0);
  });
});
