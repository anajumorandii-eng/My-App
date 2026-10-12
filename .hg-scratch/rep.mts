import { visualCandidates } from '../src/views/visualRepresentation';
import { sceneFor } from '../src/views/topic-scenes/sceneFor';
import { interactiveSummaries } from '../src/data/interactiveSummaries';
const counts: Record<string, string[]> = {};
for (const s of interactiveSummaries as any[]) {
  if (!/hist|geog|atual/i.test(String(s.subject))) continue;
  const all = visualCandidates(s);
  const c = all[0];
  const sc = sceneFor(s.id);
  const key = `${s.subject}|${c?.kind}|${c?.kind === 'scene' ? sc?.family : c?.id}`;
  (counts[key] ??= []).push(s.id);
}
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1].length - a[1].length)) console.log(v.length, k, process.argv[2] ? v.join(' ') : '');
