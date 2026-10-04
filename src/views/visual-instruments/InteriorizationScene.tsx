import React from 'react';
import { ExceptionalHumanitiesDrawing } from './ExceptionalHumanitiesIllustration';

export function InteriorizationScene({ selected }: { selected: number }) {
  return <g className="it" data-history-system="interiorization" transform="scale(.457142857 .457142857)"><ExceptionalHumanitiesDrawing kind="interiorization" index={selected}/></g>;
}
