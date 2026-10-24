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
/** Standard art is a contingency, not a generated illustration for this file. */
export function printCoverArt(context: PrintCoverContext) {
  const key = selectCoverTheme(context);
  return {key, src: plates[key]};
}
