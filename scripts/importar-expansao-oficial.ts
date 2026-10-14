/** npx tsx scripts/importar-expansao-oficial.ts <manifest.json> <prova.pdf> <gabarito.pdf> [--write] */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';
import { buildReviewedOfficialQuestions, type ReviewedExamItem } from '../src/lib/officialExamExpansion';
import { readOfficialAnswerKey, type OfficialBatchSource } from '../src/lib/officialAnswerKeys';
import { appendReviewedQuestions } from '../src/lib/officialExamImport';
import type { Question } from '../src/types';

const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
async function main() {
  const [manifest, examFile, keyFile] = process.argv.slice(2).filter(arg => arg !== '--write');
  if (!manifest || !examFile || !keyFile) throw new Error('Informe manifesto, PDF da prova e PDF do gabarito pareado.');
  const source = JSON.parse(await readFile(manifest, 'utf8')) as OfficialBatchSource;
  const exam = await readFile(examFile), key = await readFile(keyFile);
  if (!exam.subarray(0,5).equals(Buffer.from('%PDF-')) || !key.subarray(0,5).equals(Buffer.from('%PDF-')) ||
      sha256(exam) !== source.examSha256 || sha256(key) !== source.answerKeySha256) {
    throw new Error('PDFs diferem das fontes oficiais conferidas. Nenhum registro foi gravado.');
  }
  for (const media of source.media) {
    if (!/^\/question-media\/oficiais\/[a-z0-9-]+\/p\d+\.webp$/.test(media.url) ||
        sha256(await readFile(`public${media.url}`)) !== media.sha256) throw new Error(`Mídia diferente da página conferida: ${media.url}.`);
  }
  const keyText = await readFile(source.answerKeyTextFile);
  if (sha256(keyText) !== source.answerKeyTextSha256) throw new Error('Texto do gabarito difere da extração conferida.');
  const answers = readOfficialAnswerKey(keyText.toString('utf8'), source);
  const items = JSON.parse(await readFile(source.itemsFile,'utf8')) as ReviewedExamItem[];
  const additions = buildReviewedOfficialQuestions(items, answers, source, mockTopics);
  const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Question[];
  const merged = appendReviewedQuestions(bank, additions);
  console.log(`${source.board} ${source.year}: ${merged.length - bank.length} novas questões; banco ${bank.length} → ${merged.length}.`);
  if (process.argv.includes('--write') && merged.length > bank.length) {
    await writeFile('public/questions.json', JSON.stringify(merged,null,2) + '\n');
  } else console.log('Sem alteração no banco.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
