import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DeleteStudyMaterial } from './DeleteStudyMaterial';
afterEach(cleanup);
it('só exclui após confirmação e mantém disponível quando a conta falha', async () => {
  const remove = vi.fn().mockRejectedValueOnce(Error('offline')).mockResolvedValueOnce(undefined);
  const done = vi.fn();
  render(<DeleteStudyMaterial title="Fisiologia" remove={remove} onDeleted={done} />);
  fireEvent.click(screen.getByRole('button', { name: 'Excluir material: Fisiologia' }));
  expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Excluir material: Fisiologia' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Ele continua disponível');
  expect(done).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  await waitFor(() => expect(done).toHaveBeenCalledOnce());
});
