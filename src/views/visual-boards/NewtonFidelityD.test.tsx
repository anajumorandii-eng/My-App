import React from 'react';
import {render,screen} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import NewtonBoard from './NewtonBoard';
import {interactiveSummaries} from '../../data/interactiveSummaries';
import {buildVisualMap} from '../../lib/visualStudy';
it('condiciona N maior que P à aceleração para cima, independentemente do sentido da velocidade',()=>{
 const summary=interactiveSummaries.find(s=>s.id==='summary-fisica-as-leis-de-newton')!;
 render(<NewtonBoard map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
 expect(screen.getByText('acelerando para cima')).toBeInTheDocument();
 expect(screen.queryByText('subindo')).not.toBeInTheDocument();
});
