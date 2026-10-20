import { Children, type ReactNode } from 'react';
import { studyParagraphs } from '../lib/studyParagraphs';

/** Inline math and emphasis are opaque nodes: only plain text can be divided. */
export function StudyParagraph({children}: {children?: ReactNode}) {
  const groups: ReactNode[][] = [[]];
  Children.forEach(children, child => {
    if (typeof child !== 'string') { groups.at(-1)!.push(child); return; }
    if (!child.trim()) { groups.at(-1)!.push(child); return; }
    studyParagraphs(child).forEach((part, index) => {
      if (index) groups.push([]);
      groups.at(-1)!.push(part);
    });
  });
  return <>{groups.map((group, index) => <p key={index} className="leading-relaxed">{group}</p>)}</>;
}
