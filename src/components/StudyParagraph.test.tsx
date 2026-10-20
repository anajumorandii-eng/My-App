import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { StudyParagraph } from './StudyParagraph';
import { createElement } from 'react';
it('divide por mudança de ideia sem duplicar ou perder ênfase e matemática', () => {
  const formula = (symbol: string) => createElement('math', null, createElement('mi', null, symbol));
  const {container} = render(<StudyParagraph>Primeira ideia. Além disso, confira <strong>os dados</strong> e {formula('x')}{' '}{formula('y')}.</StudyParagraph>);
  expect(container.querySelectorAll('p')).toHaveLength(2);
  expect(container.textContent).toBe('Primeira ideia.Além disso, confira os dados e x y.');
  expect(container.querySelectorAll('math')).toHaveLength(2);
});
