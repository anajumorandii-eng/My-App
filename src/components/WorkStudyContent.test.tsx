import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import olhos from '../data/obras/dossies/olhos-dagua.json';
import type { WorkDossier } from '../types/literaryWorks';
import { WorkStudyContent } from './WorkStudyContent';
import { printStrategyGuide } from '../lib/printStrategyGuide';

vi.mock('../lib/printStrategyGuide', () => ({ printStrategyGuide: vi.fn() }));

describe('estratégias e resumo aprofundado por obra', () => {
  it('liga o resumo às unidades, aos efeitos formais e à edição da passagem', () => {
    render(<MemoryRouter><WorkStudyContent dossier={olhos as WorkDossier} mode="summary" /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Resumo aprofundado de Olhos d’água' })).toBeInTheDocument();
    expect(screen.getByText('A moldura de memória e continuidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Escopo do estudo da obra')).toHaveValue('');
    expect(screen.queryByText(olhos.units[0].guide.summary)).toBeNull();
    fireEvent.change(screen.getByLabelText('Escopo do estudo da obra'), { target: { value: olhos.units[0].id } });
    expect(screen.getByText(olhos.units[0].guide.summary)).toBeInTheDocument();
    expect(screen.getByText(olhos.evidence[0].effect)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Escopo do estudo da obra'), { target: { value: 'maria' } });
    expect(screen.getByText(olhos.units.find(unit => unit.id === 'maria')!.guide.summary)).toBeInTheDocument();
    expect(screen.queryByText(olhos.units[0].guide.summary)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Voltar à visão geral da obra completa' }));
    expect(screen.getByText('A moldura de memória e continuidade')).toBeInTheDocument();
    expect(screen.queryByText(olhos.units.find(unit => unit.id === 'maria')!.guide.summary)).toBeNull();
  });
  it('oferece estratégias próprias da obra, treino por banca e pegadinhas', () => {
    render(<MemoryRouter><WorkStudyContent dossier={olhos as WorkDossier} mode="strategy" /></MemoryRouter>);
    expect(screen.getByText(/Compare abertura e encerramento do volume/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evite estas leituras' })).toBeInTheDocument();
    expect(screen.getByLabelText('Escopo do estudo da obra')).toHaveValue('');
    fireEvent.change(screen.getByLabelText('Escopo do estudo da obra'), { target: { value: 'maria' } });
    expect(screen.getByText(olhos.units.find(unit => unit.id === 'maria')!.guide.summary)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Banca da estratégia de obra'), { target: { value: 'UNICAMP' } });
    expect(screen.getByText(/Separe os itens do comando/)).toBeInTheDocument();
  });
  it('restaura a unidade pelo endereço e oferece retorno explícito ao conjunto', () => {
    render(<MemoryRouter initialEntries={['/obras/olhos-dagua?aba=resumo&unidade=maria']}><WorkStudyContent dossier={olhos as WorkDossier} mode="summary" /></MemoryRouter>);
    expect(screen.getByLabelText('Escopo do estudo da obra')).toHaveValue('maria');
    expect(screen.getByRole('link', { name: 'Ver estratégias desta obra' })).toHaveAttribute('href', '/obras/olhos-dagua?aba=estrategias&unidade=maria');
    fireEvent.click(screen.getByRole('button', { name: 'Voltar à visão geral da obra completa' }));
    expect(screen.getByLabelText('Escopo do estudo da obra')).toHaveValue('');
  });
  it('não expõe módulos ou passagens ainda em revisão', () => {
    const draft = structuredClone(olhos) as WorkDossier;
    draft.modules.forEach(module => { module.editorialStatus = 'needs_review'; });
    render(<MemoryRouter><WorkStudyContent dossier={draft} mode="summary" /></MemoryRouter>);
    expect(screen.queryByText(olhos.units[0].guide.summary)).toBeNull();
    expect(screen.getByText(/ainda não está disponível/)).toBeInTheDocument();
  });
  it('imprime o escopo escolhido e recupera a visão geral para unidade indisponível', () => {
    render(<MemoryRouter initialEntries={['/obras/olhos-dagua?aba=resumo&unidade=removida']}><WorkStudyContent dossier={olhos as WorkDossier} mode="summary" /></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('Mostrando a visão geral da obra completa');
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
    expect(printStrategyGuide).toHaveBeenLastCalledWith(expect.any(HTMLElement), expect.stringContaining('obra completa'));
    fireEvent.change(screen.getByLabelText('Escopo do estudo da obra'), { target: { value: 'maria' } });
    fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
    expect(printStrategyGuide).toHaveBeenLastCalledWith(expect.any(HTMLElement), expect.stringContaining('Maria'));
  });
});
