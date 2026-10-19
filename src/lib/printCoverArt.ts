import biology from '../assets/print/atlas-biology.webp?inline';
import blood from '../assets/print/atlas-blood.webp?inline';
import chemistry from '../assets/print/atlas-chemistry.webp?inline';
import physics from '../assets/print/atlas-physics.webp?inline';
import mathematics from '../assets/print/atlas-mathematics.webp?inline';
import geography from '../assets/print/atlas-geography.webp?inline';
import history from '../assets/print/atlas-history.webp?inline';
import literature from '../assets/print/atlas-literature.webp?inline';
import { selectCoverTheme, type PrintCoverContext } from './printCoverSpec';
const plates = { biology, blood, chemistry, physics, mathematics, geography, history, literature };
export function printCoverArt(context: PrintCoverContext) {
  const key = selectCoverTheme(context);
  return { key, src: plates[key] };
}
