import { Router } from 'express';
import { Firestore } from 'firebase-admin/firestore';

export function createAdminRouter(db: Firestore): Router {
  const router = Router();
  router.get('/metrics', async (_req, res) => {
    try {
      const dates = Array.from({ length: 7 }, (_, offset) => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() - offset);
        return date.toISOString().slice(0, 10);
      });
      const days = await Promise.all(dates.map(async (date) => {
        const snapshot = await db.collection('aiMetricDays').doc(date).collection('segments').get();
        const segments = snapshot.docs.map((doc) => doc.data());
        return {
          date,
          requests: segments.reduce((sum, item) => sum + (item.requests ?? 0), 0),
          failures: segments.reduce((sum, item) => sum + (item.failures ?? 0), 0),
          cached: segments.reduce((sum, item) => sum + (item.cached ?? 0), 0),
          fallbacks: segments.reduce((sum, item) => sum + (item.fallbacks ?? 0), 0),
          totalTokens: segments.reduce((sum, item) => sum + (item.totalTokens ?? 0), 0),
          estimatedCostUsd: segments.reduce((sum, item) => sum + (item.estimatedCostUsd ?? 0), 0),
        };
      }));
      res.json({ days });
    } catch (error) {
      console.error('Admin metrics read failed:', error);
      res.status(500).json({ error: 'Não foi possível carregar as métricas.', code: 'ADMIN_METRICS_FAILED' });
    }
  });
  return router;
}
