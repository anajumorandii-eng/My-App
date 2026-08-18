import webPush from 'web-push';

export interface VapidConfig {
  publicKey: string;
  privateKey: string;
  subject: string;
}

export function loadVapidConfig(env: NodeJS.ProcessEnv = process.env): VapidConfig | null {
  const publicKey = env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = env.VAPID_PRIVATE_KEY?.trim();
  const subject = env.VAPID_SUBJECT?.trim();
  if (!publicKey || !privateKey || !subject) return null;
  return { publicKey, privateKey, subject };
}

export function configureWebPush(config: VapidConfig): void {
  webPush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
}

export { webPush };
