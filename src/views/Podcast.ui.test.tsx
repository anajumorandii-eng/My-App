import React, { useState } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Podcast from './Podcast';
import { requestAiTextStream } from '../lib/aiClient';
import { synthesizePodcastAudio } from '../lib/podcastAudio';
vi.mock('../hooks/useUserProfile', () => ({ useUserProfile: () => { const [profile, updateProfile] = useState({}); return { profile, updateProfile }; } }));
vi.mock('../hooks/usePodcastVoices', () => ({ usePodcastVoices: () => ({ voices: ['Achernar', 'Enceladus', 'Aoede', 'Zubenelgenubi', 'Algenib', 'Kore', 'Puck'].map(name => ({ value: `pt-BR-Chirp3-HD-${name}`, label: name })).concat([{ value: 'pt-BR-Wavenet-D', label: 'Wavenet-D' }]) }) }));
vi.mock('../hooks/usePodcastEpisodes', () => ({ usePodcastEpisodes: () => ({ episodes: [] }) }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: vi.fn() }));
vi.mock('../lib/podcastAudio', () => ({ synthesizePodcastAudio: vi.fn(), podcastAudioErrorMessage: () => 'Voz natural indisponível' }));
vi.mock('../hooks/usePersonalPodcasts', () => ({ usePersonalPodcasts: () => { const [episodes, set] = useState<any[]>([]); return { episodes, saveEpisode: async (ep: any) => set(old => [ep, ...old]) }; } }));
afterEach(cleanup);
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  URL.createObjectURL = vi.fn(() => 'blob:podcast'); URL.revokeObjectURL = vi.fn();
  vi.mocked(requestAiTextStream).mockResolvedValue({ text: 'Host1: Vamos aprender.\nHost2: Explique um exemplo.' });
  vi.mocked(synthesizePodcastAudio).mockResolvedValue(new Blob(['audio']));
});
it('gera usando escolhas de duração, foco e material; mantém a configuração do episódio no áudio', async () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Osmose do zero' } });
  fireEvent.change(screen.getByLabelText('Duração aproximada em minutos'), { target: { value: '12' } });
  fireEvent.change(screen.getByLabelText('Seu material de estudo (opcional)'), { target: { value: 'A membrana é seletiva.' } });
  fireEvent.change(screen.getByLabelText('O que você quer aprender? (opcional)'), { target: { value: 'Explique osmose com exemplos' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  await waitFor(() => expect(requestAiTextStream).toHaveBeenCalled());
  expect(vi.mocked(requestAiTextStream).mock.calls[0][1]).toMatchObject({ speakers: 2, durationMinutes: 12, sourceText: expect.stringContaining('membrana é seletiva'), focus: 'Explique osmose com exemplos' });
  fireEvent.click(await screen.findByRole('button', { name: 'Reproduzir episódio Osmose do zero' }));
  await waitFor(() => expect(synthesizePodcastAudio).toHaveBeenCalled());
  expect(vi.mocked(synthesizePodcastAudio).mock.calls[0][2]).toMatchObject({ speakers: 2, secondVoice: 'pt-BR-Chirp3-HD-Enceladus' });
  expect(await screen.findByLabelText('Velocidade de reprodução')).toBeInTheDocument();
});
it('mostra falha de geração sem disponibilizar roteiro incompleto', async () => {
  vi.mocked(requestAiTextStream).mockImplementation(async (_ep, _payload, delta) => { delta('Trecho parcial'); throw new Error('Serviço indisponível'); });
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Teste' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Serviço indisponível');
  expect(screen.queryByRole('button', { name: 'Reproduzir episódio Teste' })).not.toBeInTheDocument();
});
it('uma pessoa oculta a segunda voz e vozes iguais impedem gerar diálogo', () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Voz da pessoa 2'), { target: { value: 'pt-BR-Chirp3-HD-Achernar' } });
  expect(screen.getByRole('button', { name: 'Gerar meu podcast' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Uma pessoa' }));
  expect(screen.queryByLabelText('Voz da pessoa 2')).not.toBeInTheDocument();
});

it('permite gerar apenas pelo tema sem exigir material ou instruções', async () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Osmose' } });
  expect(screen.getByText('Você pode gerar o episódio só com o tema. Resumos e materiais são opcionais; se quiser, use-os para direcionar a explicação.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  await waitFor(() => expect(requestAiTextStream).toHaveBeenCalled());
  expect(vi.mocked(requestAiTextStream).mock.calls[0][1]).toMatchObject({ title: 'Osmose', sourceText: '', focus: '' });
});

it('o player gera o áudio do roteiro pronto antes de disponibilizar os controles de reprodução', async () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Osmose com som' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  await screen.findByRole('heading', { name: 'Osmose com som', level: 2 });
  expect(screen.getByLabelText('Áudio de Osmose com som')).not.toHaveAttribute('controls');
  fireEvent.click(screen.getByRole('button', { name: 'Gerar áudio e ouvir' }));
  await waitFor(() => expect(synthesizePodcastAudio).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByLabelText('Áudio de Osmose com som')).toHaveAttribute('src', 'blob:podcast'));
  expect(screen.getByLabelText('Áudio de Osmose com som')).toHaveAttribute('controls');
});
it('prévia bloqueada por política de autoplay mantém o áudio pronto para um toque no play', async () => {
  vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new DOMException('Requires a user gesture', 'NotAllowedError'));
  render(<Podcast />);
  fireEvent.click(screen.getByRole('button', { name: 'Ouvir voz da pessoa 1' }));
  await waitFor(() => expect(synthesizePodcastAudio).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByLabelText(/Áudio de Amostra/)).toHaveAttribute('src', 'blob:podcast'));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('Áudio pronto. Toque no play para ouvir.');
});

it('a prévia prepara a sessão de mídia e remove mudo ou volume zero antes de tocar', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'audioSession');
  const session = { type: 'ambient' };
  Object.defineProperty(navigator, 'audioSession', { configurable: true, value: session });
  try {
    render(<Podcast />);
    const audio = screen.getByLabelText('Áudio de podcast') as HTMLAudioElement;
    audio.muted = true; audio.volume = 0;
    fireEvent.click(screen.getByRole('button', { name: 'Ouvir voz da pessoa 1' }));
    await waitFor(() => expect(audio).toHaveAttribute('src', 'blob:podcast'));
    expect(audio.muted).toBe(false);
    expect(audio.volume).toBe(1);
    expect(session.type).toBe('playback');
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  } finally {
    if (descriptor) Object.defineProperty(navigator, 'audioSession', descriptor);
    else Reflect.deleteProperty(navigator, 'audioSession');
  }
});

it('não inicia áudio do episódio anterior enquanto cria um novo roteiro', async () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Primeiro episódio' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  await screen.findByRole('heading', { name: 'Primeiro episódio', level: 2 });
  vi.mocked(requestAiTextStream).mockImplementation(() => new Promise(() => {}));
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Novo episódio' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  const listen = screen.getByRole('button', { name: 'Gerar áudio e ouvir' });
  expect(listen).toBeDisabled();
  fireEvent.click(listen);
  expect(synthesizePodcastAudio).not.toHaveBeenCalled();
});

it('mostra apenas as seis vozes escolhidas e inicia com Achernar e Enceladus', () => {
  render(<Podcast />);
  const first = screen.getByLabelText('Voz da pessoa 1') as HTMLSelectElement;
  const second = screen.getByLabelText('Voz da pessoa 2') as HTMLSelectElement;
  const expected = ['pt-BR-Chirp3-HD-Achernar', 'pt-BR-Chirp3-HD-Enceladus', 'pt-BR-Chirp3-HD-Aoede', 'pt-BR-Chirp3-HD-Zubenelgenubi', 'pt-BR-Wavenet-D', 'pt-BR-Chirp3-HD-Algenib'];
  expect(Array.from(first.options, option => option.value)).toEqual(expected);
  expect(Array.from(second.options, option => option.value)).toEqual(expected);
  expect(first.value).toBe(expected[0]);
  expect(second.value).toBe(expected[1]);
  fireEvent.click(screen.getByRole('button', { name: 'Uma pessoa' }));
  fireEvent.change(first, { target: { value: expected[2] } });
  expect(first.value).toBe('pt-BR-Chirp3-HD-Aoede');
});
