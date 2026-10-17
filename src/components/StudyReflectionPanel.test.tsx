import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StudyReflectionPanel } from './StudyReflectionPanel';
import { reflectionForTutor } from '../lib/learningReflection';
const { account, saveVoice, readVoice } = vi.hoisted(() => ({ account: { user: { uid: 'A' } as { uid: string } | null }, saveVoice: vi.fn(async () => {}), readVoice: vi.fn(async () => null) }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => account }));
vi.mock('../lib/learningReflection', async original => ({ ...await original<typeof import('../lib/learningReflection')>(), saveReflectionVoice: saveVoice, readReflectionVoice: readVoice }));
beforeEach(() => { localStorage.clear(); account.user = { uid: 'A' }; });
afterEach(() => vi.unstubAllGlobals());
it('preserva a autoexplicação entre visitas e não mistura contas', () => {
  const first = render(<StudyReflectionPanel topicId="bio_genetica" topicName="Genética" />);
  fireEvent.change(screen.getByLabelText('Antes de consultar: o que consigo explicar? — Genética'), { target: { value: 'Penso que os alelos se separam, mas não sei justificar.' } });
  expect(reflectionForTutor('A', 'bio_genetica')).toContain('não sei justificar');
  first.unmount();
  const second = render(<StudyReflectionPanel topicId="bio_genetica" topicName="Genética" />);
  expect(screen.getByDisplayValue(/não sei justificar/)).toBeInTheDocument();
  second.unmount();
  account.user = { uid: 'B' };
  render(<StudyReflectionPanel topicId="bio_genetica" topicName="Genética" />);
  expect(screen.queryByDisplayValue(/não sei justificar/)).toBeNull();
});
it('só abre o microfone após a ação e guarda um áudio reproduzível ao encerrar', async () => {
  const stopTrack = vi.fn();
  const getUserMedia = vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] }));
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  class Recorder {
    state = 'inactive'; mimeType = 'audio/webm'; ondataavailable: any; onstop: any; onerror: any;
    start() { this.state = 'recording'; }
    stop() { this.state = 'inactive'; this.ondataavailable({ data: new Blob(['minha explicação']) }); this.onstop(); }
  }
  vi.stubGlobal('MediaRecorder', Recorder);
  URL.createObjectURL = vi.fn(() => 'blob:recording'); URL.revokeObjectURL = vi.fn();
  render(<StudyReflectionPanel topicId="bio_genetica" topicName="Genética" />);
  expect(getUserMedia).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Gravar o que lembro antes de estudar' }));
  fireEvent.click(await screen.findByRole('button', { name: 'Encerrar gravação' }));
  await waitFor(() => expect(saveVoice).toHaveBeenCalled());
  expect(stopTrack).toHaveBeenCalled();
  expect(screen.getByLabelText('Minha lembrança em áudio de Genética')).toHaveAttribute('src', 'blob:recording');
});

it('faz perguntas sobre o mecanismo da matéria e não reduz o registro a acertar questões', () => {
  render(<StudyReflectionPanel topicId="bio_genetica" topicName="Genética" subject="Biologia" />);
  expect(screen.getByRole('list', { name: 'Perguntas para pensar em Biologia' })).toHaveTextContent('estrutura, processo e função');
  expect(screen.getByLabelText('Depois do estudo: o que mudou na minha explicação? — Genética')).toBeInTheDocument();
  expect(screen.getByLabelText('Como vou verificar se compreendi? — Genética')).toBeInTheDocument();
});
