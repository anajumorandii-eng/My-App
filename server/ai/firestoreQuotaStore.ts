import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { DailyQuotaResult, DailyQuotaStore } from './rateLimit';

export class FirestoreDailyQuotaStore implements DailyQuotaStore {
  constructor(private readonly db: Firestore) {}

  async consume(userId: string, date: string, maxRequests: number): Promise<DailyQuotaResult> {
    const ref = this.db.collection('aiQuotaDays').doc(date).collection('users').doc(userId);
    return this.db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const count = (snapshot.data()?.count as number | undefined) ?? 0;
      if (count >= maxRequests) return { allowed: false, remaining: 0 };

      transaction.set(ref, {
        count: count + 1,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
      return { allowed: true, remaining: Math.max(0, maxRequests - count - 1) };
    });
  }
}
