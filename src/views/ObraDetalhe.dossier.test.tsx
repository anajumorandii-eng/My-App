import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import martha from '../data/obras/dossies/memorias-de-martha.json';
import brasCubas from '../data/obras/dossies/bras-cubas.json';
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
    const sourceIds = new Set(dossier.sources?.map(source => source.id));
    expect(sourceIds.size).toBe(dossier.sources?.length ?? 0);
    for (const source of dossier.sources ?? []) {
      expect(source.citation.trim().length).toBeGreaterThan(0);
      expect(source.pagesRead.trim().length).toBeGreaterThan(0);
      expect(source.limitations.trim().length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^https:\/\//);
    }
    dossier.units.forEach((unit, index) => {
      expect(unit.order).toBe(index + 1);
      expect(unit.pdfStartPage).toBeLessThanOrEqual(unit.pdfEndPage);
      expect(unit.pdfEndPage).toBeLessThanOrEqual(dossier.edition.pdfPageCount);
      // Igual é permitido: em Canção para Ninar Menino Grande, capítulos de
      // uma página começam na mesma página do PDF que o anterior. Voltar
      // para trás, não.
      if (index > 0) expect(unit.pdfStartPage).toBeGreaterThanOrEqual(dossier.units[index - 1].pdfStartPage);
      // A parte anterior pode terminar na página em que esta começa, nunca
      // depois: o Opúsculo dava a LVIII–LX até a p. 158 e a "conclusão" desde
      // a p. 155, e o cap. LXI, ainda sobre os indígenas, caía nas duas.
      if (index > 0) expect(dossier.units[index - 1].pdfEndPage, unit.id).toBeLessThanOrEqual(unit.pdfStartPage);
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
      // Uma referência só entra depois de existir uma fonte rastreável, com
      // o recorte efetivamente lido; os demais dossiês seguem sem crítica.
      for (const ref of module.sourceRefs) expect(sourceIds.has(ref), ref).toBe(true);
      if (module.editorialStatus === 'published') {
        expect(module.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        for (const ref of module.evidenceRefs) {
          expect(dossier.evidence.find(card => card.id === ref)?.editorialStatus).toBe('published');
        }
      }
    }
    // Cada aba da tela lê um tipo de módulo: catorze dossiês chegaram a ter
    // só três, e as abas de bancas, questões e revisão ficavam pendentes.
    expect(dossier.modules.map((m) => m.moduleType)).toEqual([
      'comece_aqui', 'analise_integral', 'critica_debate', 'fuvest', 'unicamp', 'questoes', 'revisao_ativa', 'fontes',
    ]);
  });

  it('a estudante só recebe o que foi publicado', () => {
    const visible = visibleDossier(martha as WorkDossier, false);
    expect(visible.modules).toEqual([]);
    expect(visible.units).toEqual([]);
    expect(visible.evidence).toEqual([]);
    expect(visibleDossier(martha as WorkDossier, true).evidence.length).toBe(martha.evidence.length);
  });

  it('fontes de módulos ainda em revisão não entram na bibliografia da estudante', () => {
    const dossier = structuredClone(brasCubas) as WorkDossier;
    dossier.modules.forEach(module => {
      if (module.moduleType !== 'comece_aqui') module.editorialStatus = 'needs_review';
    });
    const visible = visibleDossier(dossier, false);
    expect(visible.sources?.map(source => source.id)).toEqual([
      'bras-comvest-lista-2027', 'bras-comvest-programa-2027',
    ]);
    expect(visibleDossier(dossier, true).sources).toHaveLength(11);
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
  it('Brás Cubas publicado mostra o percurso de estudo sem depender do modo revisão', async () => {
    renderAt('/obras/bras-cubas');
    await screen.findByText('Percurso de estudo.');
    expect(screen.getByText(/Machado de Assis, Memórias póstumas de Brás Cubas\. Brasília/)).toBeInTheDocument();
    expect(screen.getByText(/Páginas do arquivo de referência:/).parentElement).toHaveTextContent('134');
    expect(screen.queryByText(/O material-fonte desta obra ainda está sendo processado/)).toBeNull();
    expect(screen.queryByText(/Modo revisão/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Análise' }));
    expect(await screen.findByText('Voz, forma e classe: duas hipóteses')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Leitura guiada' }));
    expect(screen.getByText('0 de 161 unidades concluídas')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Passagens-chave' }));
    expect(screen.getByText('cap. I, p. 9')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bancas' }));
    expect(screen.getByText(/F.O.R.M.A./)).toBeInTheDocument();
    expect(screen.getByText(/F.O.N.T.E./)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Questões' }));
    expect(screen.getByText(/Não há gabarito neste módulo/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Revisão ativa' }));
    expect(screen.getByText('Verificação de precisão:')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fontes' }));
    expect(screen.getByText('Bibliografia comentada e leitura efetiva')).toBeInTheDocument();
    expect(screen.queryByText('em revisão', { exact: true })).toBeNull();
  });

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

  // Gonzaga traz os oito tipos de módulo; antes, questões, revisão ativa,
  // bancas e crítica ficavam no JSON sem nenhuma aba que os mostrasse.
  it('em revisão, mostra bancas, questões, revisão ativa e crítica de um dossiê completo', async () => {
    renderAt('/obras/gonzaga-de-sa?revisao=1');
    await screen.findByText(/Modo revisão/);
    fireEvent.click(screen.getByRole('button', { name: 'Análise' }));
    expect(await screen.findByText('Crítica e debate')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bancas' }));
    expect(screen.getByText('FUVEST')).toBeInTheDocument();
    expect(screen.getByText('Unicamp')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Questões' }));
    expect(screen.getByText(/Questões autorais/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Revisão ativa' }));
    expect(screen.getByText(/24 horas:/)).toBeInTheDocument();
  });

  // Sem modo revisão, nenhum módulo em needs_review chega à tela: a aba
  // precisa mostrar o aviso de pendência, não ficar vazia.
  it('sem módulo publicado de questões, mostra o aviso de pendência, não uma aba vazia', async () => {
    renderAt('/obras/memorias-de-martha');
    fireEvent.click(await screen.findByRole('button', { name: 'Questões' }));
    expect(screen.getByText(/O banco de questões autorais ainda está em elaboração/)).toBeInTheDocument();
  });
});
