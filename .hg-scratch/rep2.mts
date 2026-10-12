import { visualCandidates } from '../src/views/visualRepresentation';
import { sceneFor } from '../src/views/topic-scenes/sceneFor';
import { interactiveSummaries } from '../src/data/interactiveSummaries';
import { HISTORIA_GEOGRAFIA_IDS } from '../src/views/topic-scenes/families/HistoriaGeografia';
let hg = 0; const other: string[] = [];
for (const s of interactiveSummaries as any[]) {
  if (!/hist|geog|atual/i.test(String(s.subject))) continue;
  const c = visualCandidates(s)[0];
  if (c?.kind === 'scene' && HISTORIA_GEOGRAFIA_IDS.has(s.id)) hg++;
  else other.push(`${c?.kind} ${c?.kind === 'scene' ? sceneFor(s.id)?.family : c?.id} ${s.id} items=${sceneFor(s.id)?.items.length}`);
}
console.log('HG family', hg); console.log(other.join('\n'));
