import { timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';
import { referenceDocId } from '../ai/apostilaReferenceStore';

// Payload já vem pronto do pipeline local (scripts/split-chapters.py +
// scripts/upload-apostila-references.ts) — essa rota só existe pra dar um
// jeito de escrever isso na produção sem exigir credenciais de service
// account fora do próprio Cloud Run, que já tem acesso ao Firestore.
const MAX_STORED_CHARS = 200_000;

interface IngestChunk {
  chapter: string;
  volume: string;
  startPage: number;
  endPage: number;
  text: string;
}

interface IngestBody {
  subject: string;
  topics: Record<string, IngestChunk[]>;
  knownTopics: { id: string; name: string }[];
}

function isValidSecret(provided: unknown, expected: string): boolean {
  if (typeof provided !== 'string' || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export function createApostilaIngestRouter(db: Firestore, ingestSecret: string | undefined): Router {
  const router = Router();

  router.post('/apostila-references', async (req, res) => {
    if (!ingestSecret || !isValidSecret(req.headers['x-ingest-secret'], ingestSecret)) {
      return res.status(401).json({ error: 'Não autorizado.', code: 'INGEST_UNAUTHORIZED' });
    }

    const body = req.body as Partial<IngestBody>;
    if (!body?.subject || !body.topics || !Array.isArray(body.knownTopics)) {
      return res.status(400).json({ error: 'Payload inválido.', code: 'INVALID_INGEST_PAYLOAD' });
    }

    const nameById = new Map(body.knownTopics.map((t) => [t.id, t.name]));
    const written: string[] = [];
    const skipped: string[] = [];

    for (const [topicId, chunks] of Object.entries(body.topics)) {
      if (!chunks || chunks.length === 0) { skipped.push(topicId); continue; }
      const topicName = nameById.get(topicId);
      if (!topicName) { skipped.push(topicId); continue; }

      const combinedText = chunks.map((c) => c.text).join('\n\n').slice(0, MAX_STORED_CHARS);
      const docId = referenceDocId(body.subject!, topicName);
      await db.collection('apostilaReferencias').doc(docId).set({
        subject: body.subject,
        topicName,
        chapters: chunks.map((c) => ({ title: c.chapter, volume: c.volume })),
        text: combinedText,
        updatedAt: new Date().toISOString(),
      });
      written.push(docId);
    }

    res.json({ written, skipped });
  });

  return router;
}
