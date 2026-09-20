import type { Firestore } from 'firebase-admin/firestore';

type Data = Record<string, unknown>;

// Mesmo limite do Firestore de verdade. Sem ele, um teste passaria com um
// batch que a produção recusaria.
const MAX_BATCH_OPERATIONS = 500;

/**
 * Firestore em memória, só com o subconjunto que os roteadores usam: documentos
 * aninhados, get/set(merge)/delete, where com '==', orderBy, batch e a listagem
 * de uma coleção. Um documento fica em store sob o caminho completo
 * ('questions/q1' ou 'literaryWorks/w1/editions/e1').
 */
export class FakeFirestore {
  readonly store = new Map<string, Data>();
  commits = 0;

  seed(path: string, data: Data): this {
    this.store.set(path, structuredClone(data));
    return this;
  }

  collection(path: string): FakeCollection {
    return new FakeCollection(this, path);
  }

  batch() {
    const operations: Array<() => void> = [];
    return {
      set: (ref: FakeDoc, data: Data) => {
        operations.push(() => this.store.set(ref.path, structuredClone(data)));
      },
      commit: async () => {
        if (operations.length > MAX_BATCH_OPERATIONS) {
          throw new Error(`batch com ${operations.length} operações; o limite do Firestore é ${MAX_BATCH_OPERATIONS}`);
        }
        operations.forEach((operation) => operation());
        this.commits += 1;
      },
    };
  }

  asFirestore(): Firestore {
    return this as unknown as Firestore;
  }
}

class FakeDoc {
  constructor(private readonly db: FakeFirestore, readonly path: string) {}

  get id(): string {
    return this.path.split('/').pop() as string;
  }

  collection(sub: string): FakeCollection {
    return new FakeCollection(this.db, `${this.path}/${sub}`);
  }

  async get() {
    const data = this.db.store.get(this.path);
    return { exists: data !== undefined, id: this.id, data: () => (data === undefined ? undefined : structuredClone(data)) };
  }

  async set(data: Data, options?: { merge?: boolean }): Promise<void> {
    const current = this.db.store.get(this.path);
    this.db.store.set(this.path, structuredClone(options?.merge ? { ...current, ...data } : data));
  }

  async delete(): Promise<void> {
    this.db.store.delete(this.path);
  }
}

class FakeCollection {
  constructor(
    private readonly db: FakeFirestore,
    readonly path: string,
    private readonly filters: Array<[string, unknown]> = [],
    private readonly orderField?: string,
  ) {}

  doc(id: string): FakeDoc {
    return new FakeDoc(this.db, `${this.path}/${id}`);
  }

  where(field: string, operator: string, value: unknown): FakeCollection {
    if (operator !== '==') throw new Error(`FakeFirestore só implementa '==', recebeu '${operator}'`);
    return new FakeCollection(this.db, this.path, [...this.filters, [field, value]], this.orderField);
  }

  orderBy(field: string): FakeCollection {
    return new FakeCollection(this.db, this.path, this.filters, field);
  }

  async get() {
    const prefix = `${this.path}/`;
    let entries = [...this.db.store.entries()]
      .filter(([key]) => key.startsWith(prefix) && !key.slice(prefix.length).includes('/'))
      .filter(([, data]) => this.filters.every(([field, value]) => data[field] === value));

    const field = this.orderField;
    if (field) {
      entries = entries.sort(([, a], [, b]) => Number(a[field]) - Number(b[field]));
    }

    const docs = entries.map(([key, data]) => ({ id: key.slice(prefix.length), data: () => structuredClone(data) }));
    return { docs, empty: docs.length === 0 };
  }
}
