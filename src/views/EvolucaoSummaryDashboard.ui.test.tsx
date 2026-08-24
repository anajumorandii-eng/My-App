import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Evolucao from './Evolucao';

vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: vi.fn() }));
vi.mock('../hooks/useSummaryProgress', () => ({ useSummaryProgress: vi.fn() }));
vi.mock('recharts', () => ({
  BarChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>, Bar: () => null, Cell: () => null,
  XAxis: () => null, YAxis: () => null, CartesianGrid: () => null, Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>, RadarChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  PolarGrid: () => null, PolarAngleAxis: () => null, PolarRadiusAxis: () => null, Radar: () => null,
}));

import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { useUserMastery } from '../hooks/useUserMastery';
const mockedProgress = vi.mocked(useSummaryProgress);
const mockedMastery = vi.mocked(useUserMastery);

describe('integração do painel com Evolução', () => {
  beforeEach(() => {
    mockedProgress.mockReturnValue({ progress: {}, update: vi.fn(), loading: false, syncError: null, isCloudSynced: true });
    mockedMastery.mockReturnValue({
      mastery: [],
      isPersisted: false,
      syncError: null,
      updateMastery: vi.fn(),
      acceptCommittedMastery: vi.fn(),
      loading: false,
      syncing: false,
    });
  });

  it('mostra primeiro acesso com dados reais do hook, sem usar o domínio demonstrativo', () => {
    render(<MemoryRouter><Evolucao /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Evolução dos resumos de Ana Júlia' })).toBeInTheDocument();
    expect(screen.getByText('Comece por uma recuperação ativa')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Domínio médio geral' })).not.toBeInTheDocument();
  });
});
