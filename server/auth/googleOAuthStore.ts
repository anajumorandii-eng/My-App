import { randomBytes } from 'node:crypto';
import { Firestore } from 'firebase-admin/firestore';

/**
 * O refresh token do Google é a credencial mais sensível do app: com ele se lê
 * a agenda e o Drive da aluna sem nenhuma outra prova de identidade. Por isso
 * ele NÃO mora em users/{uid}/... — as regras do Firestore dão à própria aluna
 * leitura e escrita naquela subárvore inteira, e o token ficaria exposto ao
 * navegador. Estas duas coleções são de nível raiz e não têm regra nenhuma,
 * então o padrão do Firestore (negar tudo) vale pra qualquer cliente: só o
 * Admin SDK, daqui do servidor, alcança.
 */

export interface GoogleOAuthGrant {
  refreshToken: string;
  scope: string;
  googleEmail?: string;
  connectedAt: string;
  updatedAt: string;
}

export interface GoogleOAuthState {
  uid: string;
  returnTo: string;
  expiresAt: number;
}

const STATE_TTL_MS = 10 * 60_000;

export class FirestoreGoogleOAuthStore {
  constructor(private readonly db: Firestore) {}

  private grantRef(uid: string) {
    return this.db.collection('googleOAuthGrants').doc(uid);
  }

  private stateRef(nonce: string) {
    return this.db.collection('googleOAuthStates').doc(nonce);
  }

  async saveGrant(uid: string, grant: GoogleOAuthGrant): Promise<void> {
    await this.grantRef(uid).set(grant);
  }

  async getGrant(uid: string): Promise<GoogleOAuthGrant | null> {
    const snapshot = await this.grantRef(uid).get();
    return snapshot.exists ? (snapshot.data() as GoogleOAuthGrant) : null;
  }

  async deleteGrant(uid: string): Promise<void> {
    await this.grantRef(uid).delete();
  }

  /**
   * O state liga o retorno do Google à aluna que começou a conexão. É de uso
   * único e expira: sem isso, um link forjado pro /callback poderia ligar a
   * conta Google de um terceiro ao cadastro de quem clicasse.
   */
  async createState(uid: string, returnTo: string, now: number = Date.now()): Promise<string> {
    const nonce = randomBytes(32).toString('base64url');
    await this.stateRef(nonce).set({ uid, returnTo, expiresAt: now + STATE_TTL_MS });
    return nonce;
  }

  async consumeState(nonce: string, now: number = Date.now()): Promise<GoogleOAuthState | null> {
    const ref = this.stateRef(nonce);
    const snapshot = await ref.get();
    if (!snapshot.exists) return null;
    // Lê antes de apagar: depois do delete o snapshot não é mais a fonte de
    // nada que se queira reler.
    const state = snapshot.data() as GoogleOAuthState;
    await ref.delete();
    return state.expiresAt > now ? state : null;
  }
}
