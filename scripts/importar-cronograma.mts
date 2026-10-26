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

// Compara o arquivo com o que o leitor do app aceitou, campo a campo: contar
// itens não basta, porque uma dica longa demais some sem mudar a contagem.
// Só a ordem (blocos, provas e prazos são ordenados) não conta como perda.
const lost: string[] = [];
const byKey = (key: string) => (a: Record<string, string>, b: Record<string, string>) => String(a?.[key]).localeCompare(String(b?.[key]));
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, canonical(v)]));
  return value;
}
const input = structuredClone(raw);
input.exams?.sort(byKey('date'));
input.deadlines?.sort(byKey('date'));
for (const day of Object.values(input.days ?? {}) as { blocks?: Record<string, string>[] }[]) day.blocks?.sort(byKey('start'));
function diff(a: unknown, b: unknown, where: string) {
  if (JSON.stringify(canonical(a)) === JSON.stringify(canonical(b))) return;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) diff((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${where}.${key}`);
  } else lost.push(`${where.slice(1)}: ${String(JSON.stringify(a)).slice(0, 80)} não foi aceito`);
}
diff(input, plan, '');
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
