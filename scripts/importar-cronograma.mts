// Importa um cronograma de estudos para users/{uid}/data/studyPlan.
//
//   npx tsx scripts/importar-cronograma.mts --cronograma <arquivo.json> \
//     --credencial <conta-de-servico.json> --email <conta do app> [--gravar]
//
// Sem --gravar, só confere e resume o que seria gravado.
//
// O cronograma e a credencial ficam FORA do repositório: ele é público, e o
// cronograma traz a rotina da estudante. Por isso os dois chegam por caminho
// de arquivo, e nenhum exemplo real mora aqui.
//
// Como os outros scripts que editam dados, este recusa a entrada inteira em
// vez de gravar pela metade: o leitor do app descarta item inválido em
// silêncio (para não quebrar a tela), e um bloco descartado na importação
// seria uma tarde de estudo que some sem aviso.
import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { parseStudyPlan } from '../src/lib/studyPlan';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const planPath = arg('cronograma');
const credentialPath = arg('credencial');
const email = arg('email');
const write = process.argv.includes('--gravar');
if (!planPath || !credentialPath || !email) {
  console.error('Uso: --cronograma <arquivo.json> --credencial <conta-de-servico.json> --email <conta> [--gravar]');
  process.exit(2);
}

const raw = JSON.parse(readFileSync(planPath, 'utf8'));
const plan = parseStudyPlan(raw);
if (!plan) {
  console.error('Recusado: o arquivo não tem a forma de um cronograma (version 1, title, days).');
  process.exit(1);
}

const lost: string[] = [];
const count = (value: unknown) => Array.isArray(value) ? value.length : 0;
for (const key of ['exams', 'deadlines', 'phases', 'rules', 'eveChecklist'] as const) {
  if (count(raw[key]) !== plan[key].length) lost.push(`${key}: ${count(raw[key]) - plan[key].length} item(ns) inválido(s)`);
}
for (const [date, day] of Object.entries(raw.days as Record<string, { blocks?: unknown[] }>)) {
  if (!plan.days[date]) { lost.push(`dia ${date} inválido`); continue; }
  const dropped = count(day.blocks) - plan.days[date].blocks.length;
  if (dropped) lost.push(`dia ${date}: ${dropped} bloco(s) inválido(s)`);
  for (const block of (day.blocks ?? []) as { resource?: string; path?: string; start?: string }[]) {
    const parsed = plan.days[date].blocks.find((b) => b.start === block.start);
    if (block.resource && parsed && parsed.resource !== block.resource) lost.push(`dia ${date} ${block.start}: recurso "${block.resource}" desconhecido`);
    if (block.path && parsed && parsed.path !== block.path) lost.push(`dia ${date} ${block.start}: caminho "${block.path}" fora do recurso`);
  }
}
if (lost.length) {
  console.error(`Recusado, nada foi gravado:\n- ${lost.join('\n- ')}`);
  process.exit(1);
}

const dates = Object.keys(plan.days).sort();
console.log(`${plan.title}: ${dates.length} dias (${dates[0]} a ${dates.at(-1)}), ${plan.exams.length} provas, ${plan.deadlines.length} prazos, ${plan.phases.length} fases.`);

initializeApp({ credential: cert(JSON.parse(readFileSync(credentialPath, 'utf8'))) });
const user = await getAuth().getUserByEmail(email);
const ref = getFirestore().doc(`users/${user.uid}/data/studyPlan`);
if (!write) {
  console.log(`Conferido para ${email}. Rode de novo com --gravar para gravar.`);
  process.exit(0);
}
await ref.set({ ...plan, importedAt: FieldValue.serverTimestamp() });
console.log(`Gravado em users/${user.uid}/data/studyPlan.`);
