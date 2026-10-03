import assert from 'node:assert/strict';
import test from 'node:test';
import { CloudTtsService } from './cloudTtsService';
import { pcmToWav } from './ttsService';
const names = ['pt-BR-Chirp3-HD-Kore', 'pt-BR-Chirp3-HD-Puck'];
function fixture() {
  const requests: any[] = [];
  const client = { listVoices: async () => ({ voices: [...names.map(name => ({ name, languageCodes: ['pt-BR'], ssmlGender: 'FEMALE' })), { name: 'en-US-Neural2-A', languageCodes: ['en-US'] }] }), synthesize: async (body: unknown) => { requests.push(body); return { audioContent: pcmToWav(Buffer.from([1, 2])).toString('base64') }; } };
  const service = new CloudTtsService({ client, cache: { read: async () => null, write: async () => {} } });
  return { service, requests, client };
}
test('catálogo expõe só vozes brasileiras e resolve preferências antigas sem inventar vozes', async () => {
  const { service } = fixture();
  assert.deepEqual((await service.getVoices()).map(v => v.value), names);
  assert.equal(await service.resolveVoice('Kore'), names[0]);
  await assert.rejects(service.resolveVoice('pt-BR-voz-inexistente'));
});
test('diálogo envia cada fala com sua voz e une os WAV sem pronunciar rótulos', async () => {
  const { service, requests } = fixture();
  const result = await service.synthesize('Host1: O que é osmose?\nHost2: Vamos usar um exemplo.', 'Kore', { speakers: 2, secondVoice: 'Puck', pace: 'tranquilo', tone: 'acolhedor' });
  assert.equal(requests.length, 2);
  assert.equal(requests[0].voice.name, names[0]); assert.equal(requests[1].voice.name, names[1]);
  assert.equal(requests[0].input.text, 'O que é osmose?');
  assert.equal(requests[0].audioConfig.audioEncoding, 'LINEAR16');
  assert.equal(requests[0].audioConfig.sampleRateHertz, 24000);
  assert.equal(requests[0].audioConfig.speakingRate, 0.9);
  assert.ok(result.buffer.length > 44);
  await service.synthesize('Host1: O que é osmose?\nHost2: Vamos usar um exemplo.', 'Kore', { speakers: 2, secondVoice: 'Puck', pace: 'tranquilo', tone: 'acolhedor' });
  assert.equal(requests.length, 2);
});
test('vozes equivalentes e roteiro de diálogo inválido são recusados antes de gerar áudio', async () => {
  const { service, requests } = fixture();
  await assert.rejects(service.synthesize('Host1: Explicação.\nHost2: Pergunta.', 'Kore', { speakers: 2, secondVoice: names[0], pace: 'natural', tone: 'objetivo' }));
  await assert.rejects(service.synthesize('Sem identificação de falante', 'Kore', { speakers: 2, secondVoice: 'Puck', pace: 'natural', tone: 'objetivo' }));
  assert.equal(requests.length, 0);
});
test('falha no segundo participante não devolve um episódio parcial', async () => {
  const { service, client } = fixture();
  let n = 0;
  client.synthesize = async () => { if (++n === 2) throw Error('quota'); return { audioContent: pcmToWav(Buffer.from([0, 0])).toString('base64') }; };
  await assert.rejects(service.synthesize('Host1: Explicação.\nHost2: Pergunta.', 'Kore', { speakers: 2, secondVoice: 'Puck', pace: 'natural', tone: 'objetivo' }), /quota/);
});

test('requisições simultâneas compartilham uma única síntese paga', async () => {
  const { service, requests } = fixture();
  await Promise.all([service.synthesize('Explicação concorrente.', 'Kore'), service.synthesize('Explicação concorrente.', 'Kore')]);
  assert.equal(requests.length, 1);
});
test('nova tentativa reutiliza falas concluídas antes da falha', async () => {
  const { service, client } = fixture(); let calls = 0;
  client.synthesize = async () => { if (++calls === 2) throw Error('temporário'); return { audioContent: pcmToWav(Buffer.from([0, 0])).toString('base64') }; };
  const options = { speakers: 2 as const, secondVoice: 'Puck', pace: 'natural' as const, tone: 'objetivo' as const };
  await assert.rejects(service.synthesize('Host1: Uma explicação.\nHost2: Outra explicação.', 'Kore', options));
  await service.synthesize('Host1: Uma explicação.\nHost2: Outra explicação.', 'Kore', options);
  assert.equal(calls, 3);
});
