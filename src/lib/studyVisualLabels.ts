import { parseStudyVisual } from './studyVisual';

type Part = { text: string; source?: string; opening?: string; closing?: string };
// Process whole fenced blocks so examples inside ordinary code remain literal.
function parts(text: string): Part[] {
  const lines = text.split(/(?<=\n)/), result: Part[] = [];
  let prose = '';
  for (let i = 0; i < lines.length; i++) {
    const open = /^ {0,3}(`{3,}|~{3,})([^\n]*)\n$/.exec(lines[i]);
    if (!open) { prose += lines[i]; continue; }
    if (prose) { result.push({ text: prose }); prose = ''; }
    const opening = lines[i], body: string[] = [];
    const close = new RegExp(`^ {0,3}${open[1][0]}{${open[1].length},}[ \\t]*(?:\\n)?$`);
    while (++i < lines.length && !close.test(lines[i])) body.push(lines[i]);
    const closing = lines[i] ?? '';
    result.push({ text: opening + body.join('') + closing, ...(open[2].trim() === 'study-visual' && closing ? { source: body.join(''), opening, closing } : {}) });
  }
  if (prose) result.push({ text: prose });
  return result;
}
const questionPrefix = /^(?:V\s*(\d+)[.):]\s*|Questão de verificação\s+(\d+)\s*[.\-:–—)]?\s*)/i;

/** Presentation only: saved Markdown and source/exam identifiers stay intact. */
export function prepareStudyVisualLabels(text: string): string {
  const blocks = parts(text), legacy = new Map<string, number>();
  let number = 0;
  for (const block of blocks) {
    if (!block.source) continue;
    const visual = parseStudyVisual(block.source);
    if (!visual) continue;
    number++;
    const prefix = questionPrefix.exec(visual.question);
    if (prefix?.[1]) legacy.set(prefix[1], number);
    visual.figureNumber = number;
    visual.question = visual.question.replace(questionPrefix, '');
    visual.title = visual.title.replace(/^Figura\s+\d+\s*[.\-:–—]\s*/i, '');
    block.text = block.opening + JSON.stringify(visual) + '\n' + block.closing;
  }
  if (!number) return text;
  let inVisualAnswers = false;
  return blocks.map(block => {
    if (block.opening || block.source || /^ {0,3}(?:`{3,}|~{3,})/.test(block.text)) return block.text;
    return block.text.split(/(?<=\n)/).map(line => {
      if (/^#{1,6}\s+.*(?:Respostas|Gabarito).*(?:perguntas visuais|questões de verificação)/i.test(line)) {
        inVisualAnswers = true;
        return line.replace(/(?:Respostas|Gabarito)\s+(?:das?\s+)?perguntas visuais/i, 'Respostas das questões de verificação');
      }
      if (/^#{1,6}\s/.test(line)) inVisualAnswers = false;
      // Only explicit legacy answer labels, never formulas, inline code or prose.
      if (inVisualAnswers) return line.replace(/^(\s*(?:(?:[-*+]\s+)|(?:\d+[.)]\s+))?(?:\*\*)?)V(\d+)([.):])(?=\s|\*\*|$)/, (all, before, id, punctuation) => {
        const index = legacy.get(id);
        return index ? `${before}Resposta da questão de verificação ${index}${punctuation}` : all;
      });
      return line;
    }).join('');
  }).join('');
}
