import { Firestore } from 'firebase-admin/firestore';
import { WorkUnit, EvidenceCard, ContentModule, CriticalSource, ContentModuleType, ExamBoard } from '../../src/types/literaryWorks';

// Separado de apostilaReferenceStore.ts de propósito (ver seção 8 do
// roteiro): obras exigem edição, unidade, paginação, direitos e camada de
// evidência mais rigorosos — aqui a recuperação só devolve conteúdo
// 'published', nunca rascunho ainda não validado editorialmente.
export class LiteraryReferenceStore {
  constructor(private readonly db: Firestore) {}

  async getWorkUnits(workId: string): Promise<WorkUnit[]> {
    const snap = await this.db.collection('literaryWorks').doc(workId).collection('units').orderBy('order').get();
    return snap.docs.map((d) => d.data() as WorkUnit);
  }

  async getPublishedEvidenceForUnit(workId: string, unitId: string): Promise<EvidenceCard[]> {
    const snap = await this.db
      .collection('literaryWorks').doc(workId).collection('evidenceCards')
      .where('unitId', '==', unitId)
      .where('editorialStatus', '==', 'published')
      .get();
    return snap.docs.map((d) => d.data() as EvidenceCard);
  }

  async getPublishedContentModule(workId: string, moduleType: ContentModuleType, opts?: { unitId?: string; board?: ExamBoard }): Promise<ContentModule | null> {
    let query = this.db
      .collection('literaryWorks').doc(workId).collection('contentModules')
      .where('moduleType', '==', moduleType)
      .where('editorialStatus', '==', 'published') as FirebaseFirestore.Query;
    if (opts?.unitId) query = query.where('unitId', '==', opts.unitId);
    if (opts?.board) query = query.where('board', '==', opts.board);
    const snap = await query.limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as ContentModule;
  }

  async getCriticalSources(sourceIds: string[]): Promise<CriticalSource[]> {
    if (sourceIds.length === 0) return [];
    const refs = sourceIds.map((id) => this.db.collection('criticalSources').doc(id));
    const snaps = await this.db.getAll(...refs);
    return snaps.filter((s) => s.exists).map((s) => s.data() as CriticalSource);
  }
}
