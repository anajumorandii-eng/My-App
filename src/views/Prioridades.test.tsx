import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Prioridades from './Prioridades';
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ mastery: [], isPersisted: true, loading: false, syncError: null }) }));
it('substitui percentuais sem denominador por recortes e explicita áreas sem dados', () => {
  render(<MemoryRouter><Prioridades /></MemoryRouter>);
  expect(screen.queryByText('18.5%')).toBeNull();
  expect(screen.getByText(/UNICAMP 2026.*1ª fase.*Recorte completo da matéria/)).toBeInTheDocument();
  for (const area of ['Literatura', 'Redação', 'Filosofia', 'Sociologia']) {
    fireEvent.click(screen.getByRole('button', { name: area }));
    if (area === 'Redação') expect(screen.getByText(/FUVEST 2022.*2ª fase.*dia 1.*Recorte completo da matéria/)).toBeInTheDocument();
    expect(screen.queryByText('Não há tópico curricular mapeado para esta matéria.')).toBeNull();
  }
});
