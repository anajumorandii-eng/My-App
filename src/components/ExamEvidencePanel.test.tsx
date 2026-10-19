import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { ExamEvidencePanel } from './ExamEvidencePanel';
it('separa recortes completos e amostras e mostra análises com origem e comandos', async () => {
  render(<MemoryRouter><ExamEvidencePanel subject="Biologia" topicIds={['bio_ecologia', 'bio_evolucao']} /></MemoryRouter>);
  expect(screen.queryByText('18.5%')).toBeNull();
  expect(screen.getByText(/UNICAMP 2026.*1ª fase.*Recorte completo da matéria/)).toBeInTheDocument();
  expect(screen.getByText(/UNESP 2025.*Amostra selecionada/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Banca das evidências'), { target: { value: 'UNICAMP' } });
  fireEvent.change(screen.getByLabelText('Fase das evidências'), { target: { value: '2a' } });
  expect(await screen.findByText(/questão 11: Plumagem de pavões/)).toBeInTheDocument();
  expect(screen.getByText('Seleção sexual e predação.')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: 'Gabarito / respostas esperadas' })[0]).toHaveAttribute('href', expect.stringContaining('comvest.unicamp.br'));
  expect(screen.queryByText(/UNESP 2025/)).toBeNull();
});
it('falta de dados permanece explícita sem transferir percentuais de outra matéria', async () => {
  render(<MemoryRouter><ExamEvidencePanel subject="Área sem classificação" /></MemoryRouter>);
  expect(screen.getByText(/Ainda não há recorte classificado/)).toBeInTheDocument();
  expect(await screen.findByText(/Sem exemplo analisado/)).toBeInTheDocument();
});
