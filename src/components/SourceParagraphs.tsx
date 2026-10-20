import { studyParagraphs } from '../lib/studyParagraphs';
/** Preserve sentences and split only at editorial boundaries or explicit transitions. */
export function SourceParagraphs({ text }: { text: string }) {
  return <div className="space-y-3">{studyParagraphs(text).map((part, index) =>
    <p key={index} className="text-sm whitespace-pre-wrap leading-relaxed mt-3">{part}</p>)}</div>;
}
