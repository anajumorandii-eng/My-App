import assert from 'node:assert/strict';
import test from 'node:test';
import { GeminiTtsService, pcmToWav, sampleRateFromMimeType } from './ttsService';

test('gera um cabeçalho RIFF/WAVE válido de 44 bytes com os campos corretos', () => {
  const pcm = Buffer.from(new Uint8Array(1000)); // 1000 bytes of silence
  const wav = pcmToWav(pcm, 24000, 1, 16);

  assert.equal(wav.length, 44 + pcm.length);
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt32LE(4), 36 + pcm.length);
  assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.toString('ascii', 12, 16), 'fmt ');
  assert.equal(wav.readUInt32LE(16), 16); // fmt chunk size
  assert.equal(wav.readUInt16LE(20), 1); // PCM format
  assert.equal(wav.readUInt16LE(22), 1); // channels
  assert.equal(wav.readUInt32LE(24), 24000); // sample rate
  assert.equal(wav.readUInt32LE(28), 24000 * 1 * 2); // byte rate
  assert.equal(wav.readUInt16LE(32), 2); // block align
  assert.equal(wav.readUInt16LE(34), 16); // bit depth
  assert.equal(wav.toString('ascii', 36, 40), 'data');
  assert.equal(wav.readUInt32LE(40), pcm.length);
});

test('preserva os bytes originais do PCM após o cabeçalho', () => {
  const pcm = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
  const wav = pcmToWav(pcm);
  assert.deepEqual(wav.subarray(44), pcm);
});

test('calcula corretamente byte rate e block align para outras configurações', () => {
  const pcm = Buffer.alloc(10);
  const wav = pcmToWav(pcm, 16000, 2, 16); // estéreo, 16kHz
  assert.equal(wav.readUInt16LE(22), 2); // channels
  assert.equal(wav.readUInt32LE(24), 16000); // sample rate
  assert.equal(wav.readUInt16LE(32), 4); // block align = channels * bitDepth/8
  assert.equal(wav.readUInt32LE(28), 16000 * 4); // byte rate
});

test('lê a taxa de amostragem declarada pela Gemini em vez de assumir 24 kHz', () => {
  // Se o modelo mudar a taxa, assumir 24000 não faz o áudio falhar: ele toca
  // acelerado ou arrastado, sintoma bem mais difícil de rastrear que um erro.
  assert.equal(sampleRateFromMimeType('audio/L16;codec=pcm;rate=16000'), 16000);
  assert.equal(sampleRateFromMimeType('audio/L16;codec=pcm;rate=24000'), 24000);
  // Sem taxa declarada, ou com lixo no lugar dela, cai no padrão do modelo.
  assert.equal(sampleRateFromMimeType('audio/L16;codec=pcm'), 24000);
  assert.equal(sampleRateFromMimeType(undefined), 24000);
  assert.equal(sampleRateFromMimeType('audio/L16;rate=abc'), 24000);
  assert.equal(sampleRateFromMimeType('audio/L16;rate=0'), 24000);
});

test('o cache em memória para de crescer no limite de bytes', () => {
  // Regressão: o limite era de 200 entradas, e um WAV de episódio pesa
  // megabytes — o cache sozinho passava de 1 GB, contra os 512 MiB padrão do
  // Cloud Run. Descartar por tamanho é o que impede a instância de estourar.
  const service = new GeminiTtsService(undefined);
  const lembrar = (service as unknown as {
    rememberInMemory(k: string, b: Buffer): void;
    cache: Map<string, Buffer>;
    cacheBytes: number;
  });

  const oitoMb = Buffer.alloc(8 * 1024 * 1024);
  for (let i = 0; i < 20; i += 1) lembrar.rememberInMemory(`chave-${i}`, oitoMb);

  assert.ok(lembrar.cacheBytes <= 64 * 1024 * 1024, `cache ficou com ${lembrar.cacheBytes} bytes`);
  assert.ok(lembrar.cache.size < 20, 'entradas antigas deveriam ter sido descartadas');
  // A última a entrar tem de continuar lá: descartar o recém-gravado deixaria
  // o cache sem serventia nenhuma.
  assert.ok(lembrar.cache.has('chave-19'));
});

test('uma entrada maior que o limite inteiro ainda é guardada', () => {
  const service = new GeminiTtsService(undefined);
  const interno = (service as unknown as {
    rememberInMemory(k: string, b: Buffer): void;
    cache: Map<string, Buffer>;
  });
  interno.rememberInMemory('gigante', Buffer.alloc(80 * 1024 * 1024));
  assert.ok(interno.cache.has('gigante'), 'sem isso ela seria gravada e removida no mesmo passo');
});
