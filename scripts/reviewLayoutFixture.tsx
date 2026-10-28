import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
import {ReviewSummaryText} from '../src/components/ReviewSummaryText';
import {StudySourcesPanel} from '../src/components/StudySourcesPanel';
import {normalizeReviewOptions,reviewDepths,reviewSelectionLabel} from '../src/lib/strategicReview';
import {describeStudySelection} from '../src/lib/topicCuts';
import type {StrategyGuide} from '../src/lib/strategyGuides';
/** Mount the saved source, with the same metadata and references as the reader. */
export function mountReviewLayout(guide: StrategyGuide) {
 const options=normalizeReviewOptions(guide.reviewOptions);
 const cuts=guide.selections?.map(describeStudySelection).join(' · ')||guide.chapter||'Visão geral';
 const content=document.createElement('article');
 Object.assign(content.dataset,{printSubject:guide.subject,printTopic:guide.topicName,printSubtopic:cuts,printBoard:reviewSelectionLabel(options),printPurpose:reviewDepths[options.depth]});
 document.body.replaceChildren(content);
 createRoot(content).render(<MemoryRouter><h3>{guide.subject} · {guide.chapter||guide.topicName}</h3><p>{reviewSelectionLabel(options)} · {reviewDepths[options.depth]}</p><p>Recortes: {cuts}</p><ReviewSummaryText text={guide.text}/>{guide.studyPacket&&<details data-review-sources><summary>Conferir as fontes deste resumo</summary><StudySourcesPanel packet={guide.studyPacket}/></details>}</MemoryRouter>);
 return content;
}
