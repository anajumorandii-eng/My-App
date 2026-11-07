import { createHash } from 'node:crypto';
import express, { Router } from 'express';
import { PDFDocument } from 'pdf-lib';
import type { StudyPdfStorage } from './studyPdfStorage';

const storageId = (id: string) => createHash('sha256').update(`study-booklet:${id}`).digest('hex');

async function sheetCount(bytes: Buffer) {
  if (bytes.length > 25 * 1024 * 1024 || bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Invalid PDF');
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = pdf.getPages();
  if (!pages.length || pages.length > 400 || pages.length % 2 || pages.some(page => Math.abs(page.getWidth() - 841.89) > 2 || Math.abs(page.getHeight() - 595.28) > 2)) throw new Error('Invalid booklet');
  return pages.length / 2;
}

/** Guarda os bytes finais do livreto na mesma conta, em um objeto separado do PDF comum. */
export function createSavedBookletPdfRouter(storage: StudyPdfStorage) {
  const router = Router();
  router.use('/saved/:documentId/booklet', (req, res, next) => {
    if (!res.locals.userId) return res.status(401).json({ error: 'Entre na sua conta para recuperar ou salvar o livreto.' });
    if (!/^[a-f0-9]{64}$/.test(req.params.documentId)) return res.status(400).json({ error: 'Identificação de livreto inválida.' });
    next();
  });
  router.get('/saved/:documentId/booklet', async (req, res) => {
    try {
      const pdf = await storage.read(res.locals.userId as string, storageId(req.params.documentId));
      if (!pdf) return res.status(404).json({ error: 'Livreto ainda não gerado.' });
      const sheets = await sheetCount(pdf);
      return res.type('application/pdf').setHeader('X-Booklet-Sheets', String(sheets)).send(pdf);
    } catch { return res.status(503).json({ error: 'Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.' }); }
  });
  router.put('/saved/:documentId/booklet', express.raw({ type: 'application/pdf', limit: '25mb' }), async (req, res) => {
    if (!Buffer.isBuffer(req.body)) return res.status(400).json({ error: 'Envie o livreto em PDF.' });
    try { await sheetCount(req.body); }
    catch { return res.status(400).json({ error: 'O arquivo não é um livreto A4 válido.' }); }
    try {
      await storage.write(res.locals.userId as string, storageId(req.params.documentId), req.body);
      return res.status(204).end();
    } catch { return res.status(503).json({ error: 'Não foi possível salvar o livreto. Tente novamente; o arquivo preparado será mantido.' }); }
  });
  router.use((error: { type?: string }, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'O livreto excede o limite de 25 MB.' });
    next(error);
  });
  return router;
}
