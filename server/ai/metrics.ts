import { FieldValue, Firestore } from 'firebase-admin/firestore';
import { AiTask, AiUsage } from './types';

export interface AiMetric {
  task: AiTask;
  model?: string;
  usage?: AiUsage;
  estimatedCostUsd?: number;
  durationMs: number;
  status: number;
  cached?: boolean;
  fallback?: boolean;
}

export interface AiMetricsRecorder { record(metric: AiMetric): Promise<void> }

export class FirestoreAiMetricsRecorder implements AiMetricsRecorder {
  constructor(private readonly db: Firestore) {}

  async record(metric: AiMetric): Promise<void> {
    const date = new Date().toISOString().slice(0, 10);
    const key = `${metric.task}__${(metric.model ?? 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const ref = this.db.collection('aiMetricDays').doc(date).collection('segments').doc(key);
    await ref.set({
      task: metric.task,
      model: metric.model ?? 'unknown',
      requests: FieldValue.increment(1),
      failures: FieldValue.increment(metric.status >= 400 ? 1 : 0),
      cached: FieldValue.increment(metric.cached ? 1 : 0),
      fallbacks: FieldValue.increment(metric.fallback ? 1 : 0),
      promptTokens: FieldValue.increment(metric.usage?.promptTokens ?? 0),
      completionTokens: FieldValue.increment(metric.usage?.completionTokens ?? 0),
      totalTokens: FieldValue.increment(metric.usage?.totalTokens ?? 0),
      estimatedCostUsd: FieldValue.increment(metric.estimatedCostUsd ?? 0),
      totalDurationMs: FieldValue.increment(metric.durationMs),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }
}
