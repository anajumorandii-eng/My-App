import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Estrategias from './Estrategias';
import { resolutionReadingContent } from '../lib/studyReading';
import { generalResolutionMethod, subjectStrategies, bancaStrategies, secondPhaseProtocols } from '../data/resolutionStrategies';
vi.mock('../components/StrategyExplorer', () => ({ default: () => null }));
vi.mock('../components/WorkStrategiesExplorer', () => ({ default: () => null }));
afterEach(cleanup);

it.each(['Método Geral', 'Por Matéria', 'Por Banca', '2ª Fase (Discursiva)'])('oferece leitura para a estratégia %s', (name) => {
  render(<Estrategias />);fireEvent.click(screen.getByRole('button', { name }));expect(screen.getByRole('button', { name: 'Leitura Crivo' })).toBeEnabled();
});
it('leva ao guia as matérias e os protocolos recolhidos, sem depender da expansão na tela', () => {
  const data = { method: generalResolutionMethod, subjects: subjectStrategies, boards: bancaStrategies, protocols: secondPhaseProtocols };
  const subjects = resolutionReadingContent('materia', data);for (const subject of subjectStrategies) { expect(subjects.textContent).toContain(subject.subject);expect(subjects.textContent).toContain(subject.tips.at(-1)); }
  const protocols = resolutionReadingContent('segunda-fase', data);for (const protocol of secondPhaseProtocols) expect(protocols.textContent).toContain(protocol.steps.at(-1)!.description);
});
