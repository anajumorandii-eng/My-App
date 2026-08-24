import { Firestore } from 'firebase-admin/firestore';

export interface PushSubscriptionJson {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

interface StoredSubscription extends PushSubscriptionJson {
  lastReminderSentDate?: string;
}

export class FirestorePushSubscriptionStore {
  constructor(private readonly db: Firestore) {}

  private ref(uid: string) {
    return this.db.collection('users').doc(uid).collection('data').doc('pushSubscription');
  }

  async save(uid: string, subscription: PushSubscriptionJson): Promise<void> {
    await this.ref(uid).set(subscription, { merge: true });
  }

  async remove(uid: string): Promise<void> {
    await this.ref(uid).delete();
  }

  // Personal-scale app: a handful of users at most, so a plain fan-out read
  // is simpler and avoids requiring a manual Firestore collection-group
  // index (which a `collectionGroup('data')` query would need here).
  async listAll(): Promise<Array<{ uid: string; subscription: StoredSubscription }>> {
    const userDocs = await this.db.collection('users').listDocuments();
    const subscriptions = await Promise.all(userDocs.map(async (userDoc) => {
      const snapshot = await this.ref(userDoc.id).get();
      if (!snapshot.exists) return null;
      return { uid: userDoc.id, subscription: snapshot.data() as StoredSubscription };
    }));
    return subscriptions.filter((entry): entry is { uid: string; subscription: StoredSubscription } => entry !== null);
  }

  async markSentToday(uid: string, date: string): Promise<void> {
    await this.ref(uid).set({ lastReminderSentDate: date }, { merge: true });
  }
}
