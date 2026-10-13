/** Replays reviewed content, with source and image integrity checks before any write.
 * npx tsx scripts/importar-unicamp-2026.ts <prova.pdf> <gabarito.pdf> [--write]
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';
import { buildReviewedExamQuestions, readComvestQXAnswerKey, type OfficialExamSource, type ReviewedExamItem } from '../src/lib/officialExamExpansion';
import type { Question } from '../src/types';

const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
async function main() {
  const [examFile, keyFile] = process.argv.slice(2).filter(arg => arg !== '--write');
  if (!examFile || !keyFile) throw new Error('Informe os PDFs oficiais da prova Q/X e do gabarito.');
  const source = JSON.parse(await readFile('scripts/data/unicamp-2026-qx-source.json', 'utf8')) as OfficialExamSource & {
    examSha256: string; answerKeySha256: string; answerKeyTextSha256: string;
  };
  const exam = await readFile(examFile); const key = await readFile(keyFile);
  if (!exam.subarray(0, 5).equals(Buffer.from('%PDF-')) || !key.subarray(0, 5).equals(Buffer.from('%PDF-')) ||
      sha256(exam) !== source.examSha256 || sha256(key) !== source.answerKeySha256) {
    throw new Error('PDFs diferem das fontes oficiais conferidas. Nenhum registro foi gravado.');
  }
  for (const media of source.media) {
    if (sha256(await readFile(`public${media.url}`)) !== media.sha256) {
      throw new Error(`Imagem diferente da página conferida: ${media.url}.`);
    }
  }
  const keyText = await readFile('gabaritos/UNICAMP/UNICAMP-2026_Provas_Q_e_X.txt');
  if (sha256(keyText) !== source.answerKeyTextSha256) {
    throw new Error('Texto do gabarito difere da extração conferida contra o PDF oficial.');
  }
  const answers = readComvestQXAnswerKey(keyText.toString('utf8'));
  const items = JSON.parse(await readFile('scripts/data/unicamp-2026-qx.json', 'utf8')) as ReviewedExamItem[];
  const additions = buildReviewedExamQuestions(items, answers, source, mockTopics);
  const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Question[];
  const ids = new Set(bank.map(question => question.id));
  if (ids.size !== bank.length) throw new Error('Banco existente contém ids duplicados.');
  for (const question of additions) {
    const existing = bank.find(item => item.id === question.id);
    if (existing && JSON.stringify(existing) !== JSON.stringify(question)) {
      throw new Error(`Conflito com registro existente: ${question.id}. Não sobrescrevemos conteúdo.`);
    }
    const conflict = bank.find(item => item.id !== question.id &&
      ['UNICAMP', 'COMVEST'].includes(item.examSource?.board.toUpperCase() ?? '') &&
      item.examSource?.year === 2026 && item.examSource?.questionNumber === question.examSource?.questionNumber);
    if (conflict) throw new Error(`Possível questão duplicada: ${conflict.id}. Confira a versão antes de importar.`);
  }
  const fresh = additions.filter(question => !ids.has(question.id));
  console.log(`${fresh.length} novas questões; banco ${bank.length} → ${bank.length + fresh.length}.`);
  if (process.argv.includes('--write') && fresh.length) {
    await writeFile('public/questions.json', JSON.stringify([...bank, ...fresh], null, 2) + '\n');
    console.log('Banco gravado após conferir fontes, imagens, gabarito, currículo e duplicação.');
  } else console.log('Sem alteração no banco.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
