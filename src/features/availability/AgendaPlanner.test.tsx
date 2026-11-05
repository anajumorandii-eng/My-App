import { useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { AgendaPlanner } from './AgendaPlanner';
import { createInitialWeeklySchedule } from './weeklyScheduleSeed';
import type { StudyPlan } from '../../lib/studyPlan';

afterEach(cleanup);
const plan: StudyPlan = {
  version: 1, title: 'Cronograma de teste', phases: [], rules: ['Preservar as pausas.'], eveChecklist: [], deadlines: [],
  exams: [{ label: 'Prova de exemplo', date: '2026-01-04', time: '13h–17h' }],
  days: {
    '2026-01-01': { title: 'Leitura e escrita', kind: 'study', blocks: [{ start: '14:00', end: '15:00', label: 'Treino de leitura', activity: 'Interpretar um texto.', resource: 'questoes', path: '/questoes?board=ENEM' }] },
    '2026-01-04': { title: 'Prova de exemplo', kind: 'exam', blocks: [], notes: ['Conferir a convocação.'] },
  },
};
function Example() {
  const [date, setDate] = useState('2026-01-01');
  return <AgendaPlanner localDate={date} today="2026-01-01" onDateChange={setDate} plan={plan} planLoading={false} planError={null} />;
}

it('abre atividades do cronograma real sem inventar conclusão de estudo', () => {
  render(<Example />);
  expect(screen.getByRole('link', { name: 'Abrir Treino de leitura' })).toHaveAttribute('href', '/questoes?board=ENEM');
  expect(screen.getByRole('heading', { name: 'Leitura e escrita' })).toBeInTheDocument();
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
});

it('atravessa a virada do ano na visão semanal e abre o dia de prova sem usar a rotina comum', () => {
  render(<Example />);
  fireEvent.click(screen.getByRole('button', { name: 'Semana' }));
  expect(screen.getByText('29 de dezembro a 4 de janeiro')).toBeInTheDocument();
  const selected = screen.getByRole('button', { name: /Ver quinta-feira, 1 de janeiro/ });
  expect(selected).toHaveAttribute('aria-current', 'date');
  fireEvent.click(screen.getByRole('button', { name: /Ver domingo, 4 de janeiro/ }));
  const routine = screen.getByRole('region', { name: 'Minha rotina' });
  expect(within(routine).getByText('Dia de prova. Confira os horários e preserve o descanso.')).toBeInTheDocument();
  expect(screen.getByText('Conferir a convocação.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Hoje' }));
  expect(screen.getByRole('heading', { name: 'Leitura e escrita' })).toBeInTheDocument();
});

it('recorre à semana salva quando não há cronograma e informa falha de carregamento', () => {
  render(<AgendaPlanner localDate="2026-01-01" today="2026-01-01" onDateChange={vi.fn()} plan={null} planLoading={false} planError="Cronograma indisponível." schedule={createInitialWeeklySchedule('2026-01-01T12:00:00Z')} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Cronograma indisponível.');
  expect(screen.getByRole('heading', { name: 'Rotina recorrente' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Aulas no cursinho' })).toBeInTheDocument();
});
