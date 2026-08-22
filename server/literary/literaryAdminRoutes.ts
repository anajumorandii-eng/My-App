import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';
import { LiteraryWork, WorkEdition, ExamRequirement, WorkUnit, AuditStatus } from '../../src/types/literaryWorks';
import { uploadWorkEditionSource, computeFileHash, getSignedReadUrl, downloadWorkEditionSource } from './literaryStorage';
import { extractPagesText, segmentIntoUnits } from './literarySegmenter';

// A obra declara o gênero em texto livre (LiteraryWork.genre, ex.: "poesia",
// "romance", "canção/poesia musicada") — o segmentador só precisa saber se
// deve priorizar o heurístico de poema/canção quando não achar capítulo
// numerado (ver segmentIntoUnits).
function segmenterHintFromGenre(genre: string): 'chapter' | 'poem' | 'song' {
  const g = genre.toLowerCase();
  if (g.includes('canção') || g.includes('cancao')) return 'song';
  if (g.includes('poesia')) return 'poem';
  return 'chapter';
}

// Painel de ingestão/auditoria (Fase 1 do roteiro) — protegido por
// requireAdmin no mount (ver server.ts), já que só quem cura o conteúdo
// (a própria Ana ou eu) deve poder subir/alterar material de obra.
export function createLiteraryAdminRouter(db: Firestore): Router {
  const router = Router();

  router.post('/works', async (req, res) => {
    const { slug, title, author, originalYear, genre, language } = req.body ?? {};
    if (!slug || !title || !author || !genre || !language) {
      return res.status(400).json({ error: 'Campos obrigatórios: slug, title, author, genre, language.', code: 'INVALID_WORK' });
    }
    const work: LiteraryWork = { id: randomUUID(), slug, title, author, originalYear, genre, language };
    await db.collection('literaryWorks').doc(work.id).set(work);
    res.json(work);
  });

  router.get('/works', async (_req, res) => {
    const snap = await db.collection('literaryWorks').get();
    res.json(snap.docs.map((d) => d.data()));
  });

  // Recebe o PDF em base64 — Etapa A (recebimento): hash, checagem de
  // duplicata e registro de direitos/proveniência antes de qualquer
  // processamento de conteúdo.
  router.post('/works/:workId/editions', async (req, res) => {
    const { workId } = req.params;
    const { fileBase64, mimeType, publisher, edition, year, isbn, translator, organizer, printedPageCount, rightsStatus } = req.body ?? {};
    if (!fileBase64 || !rightsStatus) {
      return res.status(400).json({ error: 'Campos obrigatórios: fileBase64, rightsStatus.', code: 'INVALID_EDITION' });
    }
    const workDoc = await db.collection('literaryWorks').doc(workId).get();
    if (!workDoc.exists) {
      return res.status(404).json({ error: 'Obra não encontrada.', code: 'WORK_NOT_FOUND' });
    }

    const fileBuffer = Buffer.from(fileBase64, 'base64');
    const fileHash = computeFileHash(fileBuffer);

    const dup = await db.collectionGroup('editions').where('fileHash', '==', fileHash).limit(1).get();
    if (!dup.empty) {
      return res.status(409).json({ error: 'Esse arquivo já foi enviado antes (mesmo hash).', code: 'DUPLICATE_FILE', existingEditionId: dup.docs[0].id });
    }

    const editionId = randomUUID();
    // Quase toda edição é PDF; "Canções Escolhidas" (Paulo César Pinheiro)
    // chegou como .docx — ver literaryStorage.ts.
    const { sourceFileId } = await uploadWorkEditionSource(workId, editionId, fileBuffer, mimeType || 'application/pdf');

    // Contagem de páginas fica pra Etapa B (auditoria) — precisa abrir o PDF
    // de verdade; aqui só registra o esqueleto administrativo.
    const editionData: WorkEdition = {
      id: editionId,
      workId,
      publisher,
      edition,
      year,
      isbn,
      translator,
      organizer,
      printedPageCount,
      pdfPageCount: 0,
      sourceFileId,
      fileHash,
      rightsStatus,
      integrityStatus: 'pending',
      extractionStatus: 'pending',
    };
    await db.collection('literaryWorks').doc(workId).collection('editions').doc(editionId).set(editionData);
    res.json(editionData);
  });

  router.get('/works/:workId/editions', async (req, res) => {
    const snap = await db.collection('literaryWorks').doc(req.params.workId).collection('editions').get();
    res.json(snap.docs.map((d) => d.data()));
  });

  // URL assinada temporária pra revisão manual do PDF durante a auditoria —
  // nunca fica pública nem em cache.
  router.get('/works/:workId/editions/:editionId/read-url', async (req, res) => {
    const editionDoc = await db.collection('literaryWorks').doc(req.params.workId).collection('editions').doc(req.params.editionId).get();
    if (!editionDoc.exists) {
      return res.status(404).json({ error: 'Edição não encontrada.', code: 'EDITION_NOT_FOUND' });
    }
    const edition = editionDoc.data() as WorkEdition;
    const url = await getSignedReadUrl(edition.sourceFileId);
    res.json({ url, expiresInMinutes: 15 });
  });

  // Etapa B (auditoria documental): status final por edição —
  // rejected/needs_review/verified, conforme a seção 2.2/Etapa B do roteiro.
  router.patch('/works/:workId/editions/:editionId/audit', async (req, res) => {
    const { integrityStatus, extractionStatus, pdfPageCount, printedPageCount } = req.body ?? {};
    const validStatuses: AuditStatus[] = ['pending', 'needs_review', 'verified', 'rejected'];
    if (integrityStatus && !validStatuses.includes(integrityStatus)) {
      return res.status(400).json({ error: 'integrityStatus inválido.', code: 'INVALID_STATUS' });
    }
    if (extractionStatus && !validStatuses.includes(extractionStatus)) {
      return res.status(400).json({ error: 'extractionStatus inválido.', code: 'INVALID_STATUS' });
    }
    const ref = db.collection('literaryWorks').doc(req.params.workId).collection('editions').doc(req.params.editionId);
    const patch: Partial<WorkEdition> = {};
    if (integrityStatus) patch.integrityStatus = integrityStatus;
    if (extractionStatus) patch.extractionStatus = extractionStatus;
    if (pdfPageCount) patch.pdfPageCount = pdfPageCount;
    if (printedPageCount) patch.printedPageCount = printedPageCount;
    await ref.set(patch, { merge: true });
    const updated = await ref.get();
    res.json(updated.data());
  });

  // Etapa C (extração estruturada): roda o segmentador heurístico sobre o
  // PDF já ingerido e devolve unidades CANDIDATAS — nada é salvo aqui. Quem
  // cura confirma/ajusta e persiste de fato via POST /works/:workId/units
  // (seção 7/Etapa C do roteiro: "validação humana do começo e fim de cada
  // unidade" antes de virar WorkUnit definitivo).
  router.post('/works/:workId/editions/:editionId/segment', async (req, res) => {
    const workDoc = await db.collection('literaryWorks').doc(req.params.workId).get();
    if (!workDoc.exists) {
      return res.status(404).json({ error: 'Obra não encontrada.', code: 'WORK_NOT_FOUND' });
    }
    const editionDoc = await db.collection('literaryWorks').doc(req.params.workId).collection('editions').doc(req.params.editionId).get();
    if (!editionDoc.exists) {
      return res.status(404).json({ error: 'Edição não encontrada.', code: 'EDITION_NOT_FOUND' });
    }
    const work = workDoc.data() as LiteraryWork;
    const edition = editionDoc.data() as WorkEdition;
    if (!edition.sourceFileId.endsWith('.pdf')) {
      return res.status(400).json({ error: 'Segmentação automática só funciona com fonte em PDF; cadastre as unidades manualmente via POST /units.', code: 'UNSUPPORTED_SOURCE_FORMAT' });
    }
    try {
      const buffer = await downloadWorkEditionSource(edition.sourceFileId);
      const pages = await extractPagesText(buffer);
      const candidates = segmentIntoUnits(pages, segmenterHintFromGenre(work.genre));
      res.json({ candidates });
    } catch (cause) {
      res.status(500).json({ error: 'Falha ao processar o PDF pra segmentação.', code: 'SEGMENT_FAILED', detail: String(cause) });
    }
  });

  router.post('/works/:workId/exam-requirements', async (req, res) => {
    const { board, examCycle, officialListUrl, officiallyVerifiedAt, requiredScope, active } = req.body ?? {};
    if (!board || !examCycle || !officialListUrl || !officiallyVerifiedAt || !requiredScope) {
      return res.status(400).json({ error: 'Campos obrigatórios: board, examCycle, officialListUrl, officiallyVerifiedAt, requiredScope.', code: 'INVALID_REQUIREMENT' });
    }
    const requirement: ExamRequirement = {
      id: randomUUID(), workId: req.params.workId, board, examCycle, officialListUrl,
      officiallyVerifiedAt, requiredScope, active: active ?? true,
    };
    await db.collection('literaryWorks').doc(req.params.workId).collection('examRequirements').doc(requirement.id).set(requirement);
    res.json(requirement);
  });

  // Etapa C (extração estruturada): unidades registradas manualmente ou por
  // um segmentador — sempre com validação humana do começo/fim de cada uma
  // antes de virar 'verified' (o segmentador em si ainda depende de ter
  // PDFs reais pra processar, ver literarySegmenter.ts).
  router.post('/works/:workId/units', async (req, res) => {
    const units = req.body?.units as Partial<WorkUnit>[] | undefined;
    if (!Array.isArray(units) || units.length === 0) {
      return res.status(400).json({ error: 'Campo obrigatório: units (array).', code: 'INVALID_UNITS' });
    }
    const batch = db.batch();
    const saved: WorkUnit[] = [];
    for (const u of units) {
      if (!u.title || !u.type || u.order === undefined || u.pdfStartPage === undefined || u.pdfEndPage === undefined) {
        return res.status(400).json({ error: 'Cada unidade precisa de title, type, order, pdfStartPage, pdfEndPage.', code: 'INVALID_UNIT' });
      }
      const unit: WorkUnit = {
        id: randomUUID(), workId: req.params.workId, parentUnitId: u.parentUnitId,
        type: u.type, order: u.order, title: u.title,
        pdfStartPage: u.pdfStartPage, pdfEndPage: u.pdfEndPage,
        printedStartPage: u.printedStartPage, printedEndPage: u.printedEndPage,
        requiredByExam: u.requiredByExam ?? true,
        extractionConfidence: u.extractionConfidence ?? 'medium',
      };
      const ref = db.collection('literaryWorks').doc(req.params.workId).collection('units').doc(unit.id);
      batch.set(ref, unit);
      saved.push(unit);
    }
    await batch.commit();
    res.json(saved);
  });

  router.get('/works/:workId/units', async (req, res) => {
    const snap = await db.collection('literaryWorks').doc(req.params.workId).collection('units').orderBy('order').get();
    res.json(snap.docs.map((d) => d.data()));
  });

  return router;
}
