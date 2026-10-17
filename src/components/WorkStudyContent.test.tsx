import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import olhos from '../data/obras/dossies/olhos-dagua.json';
import type { WorkDossier } from '../types/literaryWorks';
import { WorkStudyContent } from './WorkStudyContent';

vi.mock('../lib/printStrategyGuide', () => ({ printStrategyGuide: vi.fn() }));

describe('estratégias e resumo aprofundado por obra', () => {
  it('liga o resumo às unidades, aos efeitos formais e à edição da passagem', () => {
    render(<MemoryRouter><WorkStudyContent dossier={olhos as WorkDossier} mode="summary" /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Resumo aprofundado de Olhos d’água' })).toBeInTheDocument();
    expect(screen.getByText('A moldura de memória e continuidade')).toBeInTheDocument();
    expect(screen.getByText(olhos.units[0].guide.summary)).toBeInTheDocument();
    expect(screen.getByText(olhos.evidence[0].effect)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Unidade do resumo'), { target: { value: 'maria' } });
    expect(screen.getByText(olhos.units.find(unit => unit.id === 'maria')!.guide.summary)).toBeInTheDocument();
    expect(screen.queryByText(olhos.units[0].guide.summary)).toBeNull();
  });
  it('oferece estratégias próprias da obra, treino por banca e pegadinhas', () => {
    render(<MemoryRouter><WorkStudyContent dossier={olhos as WorkDossier} mode="strategy" /></MemoryRouter>);
    expect(screen.getByText(/Compare abertura e encerramento do volume/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evite estas leituras' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Banca da estratégia de obra'), { target: { value: 'UNICAMP' } });
    expect(screen.getByText(/Separe os itens do comando/)).toBeInTheDocument();
  });
  it('não expõe módulos ou passagens ainda em revisão', () => {
    const draft = structuredClone(olhos) as WorkDossier;
    draft.modules.forEach(module => { module.editorialStatus = 'needs_review'; });
    render(<MemoryRouter><WorkStudyContent dossier={draft} mode="summary" /></MemoryRouter>);
    expect(screen.queryByText(olhos.units[0].guide.summary)).toBeNull();
    expect(screen.getByText(/ainda não está disponível/)).toBeInTheDocument();
  });
});
