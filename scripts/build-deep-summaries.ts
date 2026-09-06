import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { summaryCurriculum } from '../src/data/summaryCurriculum';

// Editorial markdown is the source of truth; JSON is committed for the browser.
const folder = 'src/data/deep-summaries';
const chapters = readdirSync(folder).filter(f => f.endsWith('.md')).flatMap(file => {
  const text = readFileSync(`${folder}/${file}`, 'utf8');
  return text.split(/^# /m).filter(Boolean).map(block => {
    const [header, ...parts] = block.split(/^## /m);
    const [subject, topic] = header.trim().split(' | ');
    if (!summaryCurriculum.some(s => s.subject === subject && s.topics.some(t => t.title === topic))) {
      throw new Error(`Unknown curriculum chapter: ${subject} / ${topic}`);
    }
    const sections = parts.map(part => {
      const newline = part.indexOf('\n');
      return { title: part.slice(0, newline).trim(), content: part.slice(newline+1).trim() };
    });
    if (sections.length !== 5 || sections.some(s => s.content.split(/\s+/).length < 35)) {
      throw new Error(`Incomplete editorial chapter: ${topic}`);
    }
    return { subject, topic, sections };
  });
});
const keys = chapters.map(c => `${c.subject}|${c.topic}`);
if (new Set(keys).size !== keys.length) throw new Error('Duplicate editorial chapter');
writeFileSync('src/data/deepSummaryContent.json', JSON.stringify(chapters, null, 2)+'\n');
console.log(`${chapters.length} editorial chapters compiled.`);
