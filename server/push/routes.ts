import { timingSafeEqual } from 'node:crypto';
import { Router, RequestHandler } from 'express';
import { Firestore } from 'firebase-admin/firestore';
import { FirestorePushSubscriptionStore, PushSubscriptionJson } from './subscriptionStore';
import { pendingReviewCount } from '../../src/lib/reviewUrgency';
import { TopicMastery } from '../../src/types';
import { VapidConfig, webPush } from './webPush';

function isValidSubscription(body: unknown): body is PushSubscriptionJson {
  const value = body as Partial<PushSubscriptionJson> | null;
  return Boolean(
    value &&
    typeof value.endpoint === 'string' &&
    value.keys &&
    typeof value.keys.p256dh === 'string' &&
    typeof value.keys.auth === 'string',
  );
}

export function createPushRouter(db: Firestore, vapidPublicKey: string | undefined, requireAuth: RequestHandler): Router {
  const router = Router();
  const store = new FirestorePushSubscriptionStore(db);

  router.get('/vapid-public-key', (_req, res) => {
    if (!vapidPublicKey) return res.status(503).json({ error: 'Notificações push não configuradas.', code: 'PUSH_UNAVAILABLE' });
    res.json({ publicKey: vapidPublicKey });
  });

  router.post('/subscribe', requireAuth, async (req, res) => {
    const userId = res.locals.userId as string;
    if (!isValidSubscription(req.body)) {
      return res.status(400).json({ error: 'Inscrição de notificação inválida.', code: 'INVALID_SUBSCRIPTION' });
    }
    try {
      await store.save(userId, { endpoint: req.body.endpoint, keys: req.body.keys });
      res.status(204).end();
    } catch (error) {
      console.error('Failed to save push subscription:', error);
      res.status(500).json({ error: 'Não foi possível salvar a inscrição de notificação.', code: 'PUSH_SUBSCRIBE_FAILED' });
    }
  });

  router.post('/unsubscribe', requireAuth, async (req, res) => {
    const userId = res.locals.userId as string;
    try {
      await store.remove(userId);
      res.status(204).end();
    } catch (error) {
      console.error('Failed to remove push subscription:', error);
      res.status(500).json({ error: 'Não foi possível remover a inscrição de notificação.', code: 'PUSH_UNSUBSCRIBE_FAILED' });
    }
  });

  return router;
}

function isValidCronSecret(provided: unknown, expected: string): boolean {
  if (typeof provided !== 'string' || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export function createReviewReminderRouter(db: Firestore, vapid: VapidConfig | null, cronSecret: string | undefined): Router {
  const router = Router();
  const store = new FirestorePushSubscriptionStore(db);

  router.post('/send-review-reminders', async (req, res) => {
    if (!cronSecret || !isValidCronSecret(req.headers['x-cron-secret'], cronSecret)) {
      return res.status(401).json({ error: 'Não autorizado.', code: 'CRON_UNAUTHORIZED' });
    }
    if (!vapid) {
      return res.status(503).json({ error: 'Notificações push não configuradas.', code: 'PUSH_UNAVAILABLE' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const subscriptions = await store.listAll();
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const { uid, subscription } of subscriptions) {
      if (subscription.lastReminderSentDate === today) {
        skipped += 1;
        continue;
      }

      try {
        const masterySnap = await db.collection('users').doc(uid).collection('data').doc('mastery').get();
        const items = (masterySnap.data()?.items as TopicMastery[] | undefined) ?? [];
        const pending = pendingReviewCount(items);
        if (pending === 0) {
          skipped += 1;
          continue;
        }

        await webPush.sendNotification(subscription, JSON.stringify({
          title: 'Revisões pendentes na JUJU',
          body: pending === 1
            ? 'Você tem 1 tópico urgente esperando revisão hoje.'
            : `Você tem ${pending} tópicos urgentes esperando revisão hoje.`,
          url: '/revisoes',
        }));
        await store.markSentToday(uid, today);
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error(`Failed to send review reminder to ${uid}:`, error);
        // A 404/410 from the push service means the subscription is dead
        // (browser data cleared, uninstalled, etc) — stop retrying it.
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await store.remove(uid).catch(() => undefined);
        }
      }
    }

    res.json({ sent, skipped, failed, total: subscriptions.length });
  });

  return router;
}
