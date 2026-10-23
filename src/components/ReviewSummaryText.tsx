import { AiText } from './AiText';
import { splitReviewAnswers } from '../lib/strategicReview';
export function ReviewSummaryText({ text }: { text: string }) {
  const { body, answers } = splitReviewAnswers(text);
  return <>
    <AiText text={body} className="text-sm leading-relaxed" />
    {answers && <details key={text} data-review-answer-key className="rounded-lg border border-[var(--line)] p-3">
      <summary className="cursor-pointer font-semibold">Gabarito da recuperação ativa — abrir após tentar</summary>
      <div className="pt-3"><AiText text={answers} className="text-sm leading-relaxed" /></div>
    </details>}
  </>;
}
