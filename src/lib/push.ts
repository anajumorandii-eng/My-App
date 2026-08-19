import { getFirebaseIdToken } from './auth';

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function authedFetch(path: string, init?: RequestInit): Promise<Response> {
  const idToken = await getFirebaseIdToken();
  if (!idToken) throw new Error('Entre na sua conta para gerenciar notificações.');
  return fetch(path, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${idToken}` },
  });
}

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return (await registration?.pushManager.getSubscription()) ?? null;
}

export async function enableReviewReminders(): Promise<void> {
  if (!isPushSupported()) throw new Error('Notificações push não são suportadas neste navegador.');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permissão de notificação negada.');

  const keyResponse = await fetch('/api/push/vapid-public-key');
  if (!keyResponse.ok) throw new Error('Notificações push não estão configuradas no servidor.');
  const { publicKey } = await keyResponse.json() as { publicKey: string };

  const registration = await navigator.serviceWorker.register('/sw.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  try {
    const response = await authedFetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!response.ok) throw new Error('Não foi possível salvar a inscrição de notificação.');
  } catch (error) {
    // Keep the browser subscription and the server record in sync: if the
    // server never learned about this subscription, don't leave the
    // browser (and thus getCurrentPushSubscription()) reporting it as
    // active — the daily reminder job would never actually reach this user.
    await subscription.unsubscribe().catch(() => undefined);
    throw error;
  }
}

export async function disableReviewReminders(): Promise<void> {
  const subscription = await getCurrentPushSubscription();
  await subscription?.unsubscribe();
  await authedFetch('/api/push/unsubscribe', { method: 'POST' }).catch(() => undefined);
}
