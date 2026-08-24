// Lê o JSON produzido por scripts/split-chapters.py e grava uma referência
// por tópico na coleção `apostilaReferencias` do Firestore, pra grounding
// da IA (server/ai/prompts.ts). Não roda em CI/build — é um script manual,
// disparado sob demanda cada vez que uma nova matéria termina o pipeline
// de OCR + divisão.
//
// Uso: npx tsx scripts/upload-apostila-references.ts <topicos.json> <topicos-conhecidos.json>
import { readFileSync } from 'node:fs';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '../server/auth/firebaseAuth';
import { referenceDocId } from '../server/ai/apostilaReferenceStore';

// Cap generoso o bastante pra guardar bastante contexto por tópico, mas
// bem abaixo do limite de 1MiB por documento do Firestore.
const MAX_STORED_CHARS = 200_000;

interface SplitChunk {
  chapter: string;
  volume: string;
  startPage: number;
  endPage: number;
  text: string;
}

interface SplitOutput {
  subject: string;
  topics: Record<string, SplitChunk[]>;
}

interface KnownTopic {
  id: string;
  name: string;
}

async function main() {
  const [splitPath, topicsPath] = process.argv.slice(2);
  if (!splitPath || !topicsPath) {
    console.error('Uso: upload-apostila-references.ts <topicos.json> <topicos-conhecidos.json>');
    process.exit(1);
  }

  const split: SplitOutput = JSON.parse(readFileSync(splitPath, 'utf-8'));
  const knownTopics: KnownTopic[] = JSON.parse(readFileSync(topicsPath, 'utf-8'));
  const nameById = new Map(knownTopics.map((t) => [t.id, t.name]));

  const db = getFirestore(getFirebaseAdminApp());
  let written = 0;
  let skipped = 0;

  for (const [topicId, chunks] of Object.entries(split.topics)) {
    if (chunks.length === 0) { skipped++; continue; }
    const topicName = nameById.get(topicId);
    if (!topicName) {
      console.warn(`Tópico desconhecido no JSON de saída: ${topicId} — pulando.`);
      continue;
    }

    const combinedText = chunks.map((c) => c.text).join('\n\n').slice(0, MAX_STORED_CHARS);
    const docId = referenceDocId(split.subject, topicName);
    await db.collection('apostilaReferencias').doc(docId).set({
      subject: split.subject,
      topicName,
      chapters: chunks.map((c) => ({ title: c.chapter, volume: c.volume })),
      text: combinedText,
      updatedAt: new Date().toISOString(),
    });
    written++;
    console.log(`✓ ${docId} (${combinedText.length} chars, ${chunks.length} trecho(s))`);
  }

  console.log(`\n${written} tópico(s) gravado(s), ${skipped} sem conteúdo (pulados).`);
}

main().catch((err) => {
  console.error('Falha ao subir referências da apostila:', err);
  process.exit(1);
});
