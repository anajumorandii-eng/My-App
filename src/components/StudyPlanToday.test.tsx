import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { StudyPlanToday } from './StudyPlanToday';
import { parseStudyPlan } from '../lib/studyPlan';

// Cronograma fictício: o real mora só na conta.
const plan = parseStudyPlan({
  version: 1, title: 'Teste',
  exams: [{ label: 'Prova X', date: '2026-03-05' }],
  deadlines: [], phases: [{ id: 'f', label: 'Fase · Prova X', start: '2026-03-01', end: '2026-03-05', focus: 'Foco na prova X.' }],
  rules: ['Corrigir logo após o bloco.'], eveChecklist: ['Documento'],
  days: {
    '2026-03-02': { title: 'Segunda, 02/03', kind: 'study', blocks: [
      { start: '14:00', end: '16:00', label: 'Bloco A', activity: 'Biologia', questions: 20, resource: 'questoes', path: '/questoes?board=X' },
      { start: '20:30', end: '21:00', label: 'Revisão espaçada', activity: 'Erros de 1, 3 e 7 dias', resource: 'erros' },
    ] },
    '2026-03-04': { title: 'Quarta, 04/03 — véspera', kind: 'eve', blocks: [] },
  },
})!;

beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); });
afterEach(() => { vi.useRealTimers(); });

it('mostra o dia, marca o bloco em andamento e abre a atividade filtrada', () => {
  vi.setSystemTime(new Date('2026-03-02T18:00:00Z')); // 15h em São Paulo
  const open = vi.fn();
  render(<StudyPlanToday plan={plan} open={open} />);
  expect(screen.getByRole('heading', { name: 'Segunda, 02/03' })).toBeVisible();
  expect(screen.getByText(/Fase · Prova X · prova em 3 dias/)).toBeVisible();
  expect(screen.getByText('Bloco A').closest('li')).toHaveAttribute('aria-current', 'step');
  fireEvent.click(screen.getByRole('button', { name: 'Abrir questões' }));
  expect(open).toHaveBeenCalledWith('questoes', '/questoes?board=X');
  fireEvent.click(screen.getByRole('button', { name: 'Abrir caderno de erros' }));
  expect(open).toHaveBeenLastCalledWith('erros', undefined);
});

it('na véspera mostra o checklist, e em dia sem entrada diz isso', () => {
  vi.setSystemTime(new Date('2026-03-04T15:00:00Z'));
  const { unmount } = render(<StudyPlanToday plan={plan} open={vi.fn()} />);
  expect(screen.getByText('Checklist da véspera')).toBeVisible();
  expect(screen.getByText('Documento')).toBeVisible();
  unmount();
  vi.setSystemTime(new Date('2026-03-03T15:00:00Z'));
  render(<StudyPlanToday plan={plan} open={vi.fn()} />);
  expect(screen.getByText('O cronograma não tem atividades marcadas para hoje.')).toBeVisible();
});
