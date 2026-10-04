import React from 'react';
import { ExceptionalHumanitiesDrawing } from './ExceptionalHumanitiesIllustration';

export function MiningColonyScene({ selected }: { selected: number }) {
  return <g className="mc" data-history-system="mining-colony" transform="scale(.457142857 .457142857)"><ExceptionalHumanitiesDrawing kind="mining" index={selected}/></g>;
}
