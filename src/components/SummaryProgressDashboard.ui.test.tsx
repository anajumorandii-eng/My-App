import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import SummaryProgressDashboard from './SummaryProgressDashboard';
import type { SummaryProgressDashboardModel } from '../lib/summaryProgressDashboard';

const emptyModel: SummaryProgressDashboardModel = {
  hasStudyData: false, overallAccuracy: null,
  answers: { correct: 0, partial: 0, incorrect: 0, pending: 6 },
  subjects: [], boards: [], phases: [], difficulties: [], recurrences: [],
  reviews: { overdue: 0, upcoming: 0, completed: 0 }, priorities: [], currentAffairs: [],
  continueStudy: null, brokenReferences: 0,
};

const model: SummaryProgressDashboardModel = {
  ...emptyModel, hasStudyData: true, overallAccuracy: 50,
  answers: { correct: 1, partial: 1, incorrect: 0, pending: 4 },
  subjects: [{ key: 'Biologia', attempted: 2, correct: 1, accuracy: 50, href: '/resumos?subject=Biologia' }],
  boards: [{ key: 'Fuvest', attempted: 1, correct: 0, accuracy: 0, href: '/resumos?board=Fuvest' }],
  phases: [{ key: 'segunda', attempted: 1, correct: 0, accuracy: 0, href: '/resumos?phase=segunda' }],
  difficulties: [{ label: 'mecanismo', count: 2, href: null }],
  recurrences: [{ summaryId: 'bio-real', questionId: 'q1', title: 'Resumo real', attempts: 2, href: '/resumos?summary=bio-real&question=q1' }],
  reviews: { overdue: 1, upcoming: 1, completed: 1 },
  priorities: [{ id: 'bio-real', title: 'Resumo real', subject: 'Biologia', progress: 50, href: '/resumos?summary=bio-real' }],
  currentAffairs: [{ id: 'atu-real', title: 'Atualidade verificada', subject: 'Atualidades', progress: 0, href: '/resumos?summary=atu-real' }], continueStudy: { title: 'Resumo real', href: '/resumos?summary=bio-real' }, brokenReferences: 1,
};

describe('Painel de evolução dos resumos', () => {
  it('trata carregamento, erro e primeiro acesso sem métricas fictícias', () => {
    const { rerender } = render(<MemoryRouter><SummaryProgressDashboard model={emptyModel} loading /></MemoryRouter>);
    expect(screen.getByRole('status')).toHaveTextContent('Carregando evolução');
    rerender(<MemoryRouter><SummaryProgressDashboard model={emptyModel} error="Falha de sincronização" /></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent('Falha de sincronização');
    expect(screen.getByText('Comece por uma recuperação ativa')).toBeInTheDocument();
    expect(screen.queryByText(/% de acerto/)).not.toBeInTheDocument();
  });

  it('expõe métricas acionáveis e links profundos com nomes acessíveis', () => {
    render(<MemoryRouter><SummaryProgressDashboard model={model} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Evolução dos resumos de Ana Júlia' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Continuar Resumo real/ })).toHaveAttribute('href', '/resumos?summary=bio-real');
    expect(screen.getByRole('link', { name: /Retomar erro reincidente/ })).toHaveAttribute('href', '/resumos?summary=bio-real&question=q1');
    expect(screen.getByRole('link', { name: 'Abrir Caderno de Erros' })).toHaveAttribute('href', '/erros');
    expect(screen.getByRole('link', { name: 'Abrir Revisões Automáticas' })).toHaveAttribute('href', '/revisoes');
    expect(screen.getByRole('link', { name: /Atualidade verificada/ })).toHaveAttribute('href', '/resumos?summary=atu-real');
    expect(screen.getByRole('alert')).toHaveTextContent('1 referência histórica');
  });

  it('filtra agrupamentos por teclado e apresenta estado vazio do filtro', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><SummaryProgressDashboard model={model} /></MemoryRouter>);
    const filter = screen.getByRole('combobox', { name: 'Agrupar evolução por' });
    await user.selectOptions(filter, 'banca');
    expect(screen.getByRole('link', { name: /Fuvest/ })).toBeInTheDocument();
    await user.selectOptions(filter, 'fase');
    expect(screen.getByRole('link', { name: /2ª fase/ })).toBeInTheDocument();
    const withoutPhase = { ...model, phases: [] };
    render(<MemoryRouter><SummaryProgressDashboard model={withoutPhase} initialGroup="fase" /></MemoryRouter>);
    expect(screen.getByText('Ainda não há tentativas com fase identificada.')).toBeInTheDocument();
  });
});
