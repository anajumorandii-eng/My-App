import biology from '../assets/print/atlas-biology.jpg?inline';
import blood from '../assets/print/atlas-blood.jpg?inline';
import chemistry from '../assets/print/atlas-chemistry.jpg?inline';
import physics from '../assets/print/atlas-physics.jpg?inline';
import mathematics from '../assets/print/atlas-mathematics.jpg?inline';
import geography from '../assets/print/atlas-geography.jpg?inline';
import history from '../assets/print/atlas-history.jpg?inline';
import literature from '../assets/print/atlas-literature.jpg?inline';
import { selectCoverTheme, type PrintCoverContext } from './printCoverSpec';
const plates = { biology, blood, chemistry, physics, mathematics, geography, history, literature };
export function coverMaterial(context: PrintCoverContext) {
  return /^revis[aã]o\b/i.test(context.purpose || '') ? 'review' : 'study';
}
export function coverEditionSeed(context: PrintCoverContext, edition: string) {
  const value=JSON.stringify([context.subject,context.topic,context.subtopic,context.work,context.board,context.purpose,edition]);
  let seed=2166136261;
  for(const char of value)seed=Math.imul(seed^char.charCodeAt(0),16777619);
  return seed>>>0;
}
/** Compose an edition-specific plate even when the illustration service is offline.
 * The diagrams are decorative: their geometry never represents measured study data. */
export function printCoverArt(context: PrintCoverContext, edition = '') {
  const key = selectCoverTheme(context), review=coverMaterial(context)==='review';
  const seed=coverEditionSeed(context,edition), angle=seed%360;
  const ink=review?'#31546a':'#45614b', accent=review?'#b58149':'#8d4f4c';
  const dots=Array.from({length:12},(_,index)=>{
    const theta=(angle+index*30)*Math.PI/180;
    const radius=160+((seed>>>(index%24))&15);
    return `<circle cx="${(200+Math.cos(theta)*radius).toFixed(2)}" cy="${(225+Math.sin(theta)*radius).toFixed(2)}" r="${index%3===0?3:1.5}" fill="${index%2?ink:accent}"/>`;
  }).join('');
  const source=plates[key].replaceAll('&','&amp;').replaceAll('"','&quot;');
  const image = `<image href="${source}" width="400" height="500"/>${review ? '' : `<ellipse cx="200" cy="225" rx="181" ry="204" fill="none" stroke="${ink}" stroke-width=".5" stroke-dasharray="${8+seed%9} ${4+seed%5}"/>`}`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">${image}${dots}<g transform="translate(200 225) rotate(${angle})" fill="none" stroke="${accent}" stroke-width=".8"><path d="M-181 0h14M167 0h14M0 -204v14M0 190v14"/></g></svg>`;
  return {key,src:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`};
}
