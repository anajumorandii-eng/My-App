import assert from 'node:assert/strict';
import test from 'node:test';
import { pcmToWav } from '../../server/podcast/ttsService';
import { mergePodcastWav } from './podcastChunks';
import { activePodcastCue, podcastWavDuration, readPodcastCues, withPodcastCues } from './podcastTiming';

test('duração usa os dados PCM e as marcações não alteram os samples ou o WAV final', () => {
 const wave=pcmToWav(Buffer.alloc(24000*2*3));
 const cues=[{start:0,end:1,text:'Primeiro trecho.',speaker:1 as const},{start:1.2,end:3,text:'Segundo trecho.',speaker:2 as const}];
 const annotated=new Uint8Array(withPodcastCues(wave,cues));
 assert.equal(podcastWavDuration(annotated),3);assert.deepEqual(readPodcastCues(annotated),cues);
 assert.deepEqual(new Uint8Array(mergePodcastWav([annotated])),new Uint8Array(wave));
 assert.equal(new DataView(annotated.buffer).getUint32(4,true),annotated.length-8);
 assert.deepEqual(readPodcastCues(wave),[]);
});
test('marcações fora da faixa, sobrepostas ou sem texto são ignoradas sem quebrar o áudio', () => {
 const wav=pcmToWav(Buffer.alloc(48000));
 for(const cues of [[{start:0,end:2,text:'Fora.'}],[{start:-1,end:.5,text:'Antes.'}],[{start:0,end:.8,text:'A.'},{start:.5,end:1,text:'B.'}],[{start:0,end:1,text:''}]]){
  const annotated=new Uint8Array(withPodcastCues(wav,cues));assert.deepEqual(readPodcastCues(annotated),[]);assert.equal(podcastWavDuration(annotated),1);
 }
 assert.throws(()=>podcastWavDuration(new Uint8Array(44)));
 assert.throws(()=>podcastWavDuration(wav.subarray(0,50)));
});
test('trecho ativo segue o tempo da mídia, inclusive pausas entre falas e saltos para trás', () => {
 const cues=[{start:0,end:4,text:'A'},{start:4.2,end:8,text:'B'},{start:8,end:10,text:'C'}];
 assert.equal(activePodcastCue(cues,0),0);assert.equal(activePodcastCue(cues,4.1),0);
 assert.equal(activePodcastCue(cues,4.2),1);assert.equal(activePodcastCue(cues,9),2);
 assert.equal(activePodcastCue(cues,2),0);assert.equal(activePodcastCue(cues,10),2);
 assert.equal(activePodcastCue([],1),-1);assert.equal(activePodcastCue(cues,NaN),-1);
});
