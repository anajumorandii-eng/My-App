import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AdaptiveUpdate } from './AdaptiveUpdate';
import { FocusToday } from './FocusToday';

describe('AJ decision surfaces', () => {
  it('lets the student understand and act on the current priority', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();

    render(
      <FocusToday
        priorityLabel="Prioridade 1"
        topic="Função exponencial"
        subject="Matemática"
        actionLabel="Praticar sem apoio"
        durationMinutes={35}
        diagnosticReason="Há uma lacuna recorrente neste tópico."
        reasons={[
          'Alta recorrência de erro.',
          'Pré-requisito para logaritmos.',
          'Intervenção estimada em 35 min.',
        ]}
        confidence="moderada"
        onStart={onStart}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Função exponencial' })).toBeInTheDocument();
    expect(screen.getByText('35 min')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Começar' }));
    expect(onStart).toHaveBeenCalledOnce();

    const whyButton = screen.getByRole('button', { name: 'Por que isso?' });
    expect(whyButton).toHaveAttribute('aria-expanded', 'false');
    await user.click(whyButton);
    expect(whyButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Pré-requisito para logaritmos.')).toBeVisible();
    expect(screen.getByText('Confiança moderada')).toBeVisible();
  });

  it('captures a structured disagreement instead of exposing a dead link', async () => {
    const user = userEvent.setup();
    const onDisagree = vi.fn();

    render(
      <FocusToday
        priorityLabel="Prioridade 1"
        topic="Mecânica"
        subject="Física"
        actionLabel="Reconstruir a base"
        durationMinutes={30}
        diagnosticReason="Ainda não há evidências suficientes de aplicação."
        reasons={['Domínio ainda insuficiente.']}
        onStart={() => undefined}
        onDisagree={onDisagree}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Por que isso?' }));
    await user.click(screen.getByRole('button', { name: 'Discordo' }));
    await user.click(screen.getByRole('button', { name: 'Já domino isso' }));

    expect(onDisagree).toHaveBeenCalledWith('ja_estudei');
  });

  it('announces an adaptive update as a causal status change', () => {
    render(
      <AdaptiveUpdate>
        Seu desempenho nas últimas questões alterou a ordem recomendada.
      </AdaptiveUpdate>,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Prioridade atualizada');
    expect(screen.getByRole('status')).toHaveTextContent('alterou a ordem recomendada');
  });
});
