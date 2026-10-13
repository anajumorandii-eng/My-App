import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Prioridades from './Prioridades';
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ mastery: [], isPersisted: true, loading: false, syncError: null }) }));
it('abre áreas sem percentuais e preserva os históricos das áreas cobertas', () => {
  render(<MemoryRouter><Prioridades /></MemoryRouter>);
  expect(screen.getByText('18.5%')).toBeInTheDocument();
  for (const area of ['Literatura', 'Redação', 'Filosofia', 'Sociologia']) {
    fireEvent.click(screen.getByRole('button', { name: area }));
    expect(screen.getByText('Não há percentual histórico cadastrado para esta área. Use o roteiro curricular e as evidências pessoais acima.')).toBeInTheDocument();
    expect(screen.queryByText('Não há tópico curricular mapeado para esta matéria.')).toBeNull();
  }
});
