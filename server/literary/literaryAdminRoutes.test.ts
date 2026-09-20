import assert from 'node:assert/strict';
import test from 'node:test';
import { FakeFirestore } from '../testing/fakeFirestore';
import { withApp, sendJson } from '../testing/httpTestServer';
import { createLiteraryAdminRouter } from './literaryAdminRoutes';
import { SEED_EXAM_REQUIREMENTS, SEED_WORKS } from './seedCatalog';

const BASE = '/api/admin/literary';

const OBRA = { slug: 'dom-casmurro', title: 'Dom Casmurro', author: 'Machado de Assis', genre: 'romance', language: 'pt-BR' };

async function withLiterary(db: FakeFirestore, run: (baseUrl: string) => Promise<void>) {
  await withApp((app) => {
    app.use(BASE, createLiteraryAdminRouter(db.asFirestore()));
  }, run);
}

async function codigo(res: Response): Promise<string> {
  return ((await res.json()) as { code: string }).code;
}

test('cadastrar obra exige slug, título, autor, gênero e idioma e grava com id novo', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    for (const faltando of ['slug', 'title', 'author', 'genre', 'language']) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/works`, { ...OBRA, [faltando]: undefined });
      assert.equal(res.status, 400, faltando);
      assert.equal(await codigo(res), 'INVALID_WORK');
    }
    assert.equal(db.store.size, 0);

    const res = await sendJson(baseUrl, 'POST', `${BASE}/works`, OBRA);
    const obra = await res.json() as { id: string };
    assert.match(obra.id, /^[0-9a-f-]{36}$/);
    assert.deepEqual(db.store.get(`literaryWorks/${obra.id}`), { ...OBRA, id: obra.id });
  });
});

test('o seed grava as obras e as exigências do catálogo em um único lote', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', `${BASE}/seed`);
    assert.deepEqual(await res.json(), { works: SEED_WORKS.length, examRequirements: SEED_EXAM_REQUIREMENTS.length });
    assert.equal(db.commits, 1);
    assert.equal(db.store.size, SEED_WORKS.length + SEED_EXAM_REQUIREMENTS.length);

    await sendJson(baseUrl, 'POST', `${BASE}/seed`);
    assert.equal(db.store.size, SEED_WORKS.length + SEED_EXAM_REQUIREMENTS.length, 'rodar de novo não duplica');
  });
});

test('enviar edição sem arquivo ou sem status de direitos é 400 antes de qualquer acesso', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    for (const corpo of [{}, { fileBase64: 'AAAA' }, { rightsStatus: 'dominio_publico' }]) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/editions`, corpo);
      assert.equal(res.status, 400);
      assert.equal(await codigo(res), 'INVALID_EDITION');
    }
  });
});

test('enviar edição de uma obra que não existe é 404 e não grava nada', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', `${BASE}/works/nao-existe/editions`, { fileBase64: 'AAAA', rightsStatus: 'dominio_publico' });
    assert.equal(res.status, 404);
    assert.equal(await codigo(res), 'WORK_NOT_FOUND');
    assert.equal(db.store.size, 0);
  });
});

test('a URL de leitura de uma edição inexistente é 404', async () => {
  await withLiterary(new FakeFirestore(), async (baseUrl) => {
    const res = await sendJson(baseUrl, 'GET', `${BASE}/works/w1/editions/e1/read-url`);
    assert.equal(res.status, 404);
    assert.equal(await codigo(res), 'EDITION_NOT_FOUND');
  });
});

test('auditar aceita só os quatro status conhecidos', async () => {
  const db = new FakeFirestore().seed('literaryWorks/w1/editions/e1', { id: 'e1', workId: 'w1', integrityStatus: 'pending', extractionStatus: 'pending' });
  await withLiterary(db, async (baseUrl) => {
    for (const corpo of [{ integrityStatus: 'aprovado' }, { extractionStatus: 'ok' }]) {
      const res = await sendJson(baseUrl, 'PATCH', `${BASE}/works/w1/editions/e1/audit`, corpo);
      assert.equal(res.status, 400);
      assert.equal(await codigo(res), 'INVALID_STATUS');
    }
    assert.equal(db.store.get('literaryWorks/w1/editions/e1')?.integrityStatus, 'pending');

    const ok = await sendJson(baseUrl, 'PATCH', `${BASE}/works/w1/editions/e1/audit`, { integrityStatus: 'verified', pdfPageCount: 120 });
    assert.equal(ok.status, 200);
    assert.deepEqual(db.store.get('literaryWorks/w1/editions/e1'), {
      id: 'e1', workId: 'w1', integrityStatus: 'verified', extractionStatus: 'pending', pdfPageCount: 120,
    });
  });
});

test('auditar uma edição que não existe é 404 e não cria documento', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'PATCH', `${BASE}/works/w1/editions/fantasma/audit`, { integrityStatus: 'verified' });
    assert.equal(res.status, 404);
    assert.equal(await codigo(res), 'EDITION_NOT_FOUND');
    assert.equal(db.store.size, 0);
  });
});

test('segmentar exige obra e edição existentes e uma fonte em PDF', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    const semObra = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/editions/e1/segment`);
    assert.equal(semObra.status, 404);
    assert.equal(await codigo(semObra), 'WORK_NOT_FOUND');

    db.seed('literaryWorks/w1', { id: 'w1', genre: 'romance' });
    const semEdicao = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/editions/e1/segment`);
    assert.equal(semEdicao.status, 404);
    assert.equal(await codigo(semEdicao), 'EDITION_NOT_FOUND');

    db.seed('literaryWorks/w1/editions/e1', { id: 'e1', workId: 'w1', sourceFileId: 'literary-works/w1/e1.docx' });
    const naoPdf = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/editions/e1/segment`);
    assert.equal(naoPdf.status, 400);
    assert.equal(await codigo(naoPdf), 'UNSUPPORTED_SOURCE_FORMAT');
  });
});

test('exigência de banca precisa de todos os campos e vale por padrão como ativa', async () => {
  const db = new FakeFirestore();
  const exigencia = {
    board: 'Fuvest', examCycle: '2027', officialListUrl: 'https://www.fuvest.br/lista',
    officiallyVerifiedAt: '2026-08-01', requiredScope: 'obra inteira',
  };
  await withLiterary(db, async (baseUrl) => {
    for (const faltando of Object.keys(exigencia)) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/exam-requirements`, { ...exigencia, [faltando]: undefined });
      assert.equal(res.status, 400, faltando);
      assert.equal(await codigo(res), 'INVALID_REQUIREMENT');
    }
    assert.equal(db.store.size, 0);

    const res = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/exam-requirements`, exigencia);
    const criada = await res.json() as { id: string; active: boolean; workId: string };
    assert.equal(criada.active, true);
    assert.equal(criada.workId, 'w1');
    assert.ok(db.store.has(`literaryWorks/w1/examRequirements/${criada.id}`));
  });
});

test('cadastrar unidades recusa lista vazia ou que não é lista', async () => {
  await withLiterary(new FakeFirestore(), async (baseUrl) => {
    for (const corpo of [{}, { units: [] }, { units: 'x' }]) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/units`, corpo);
      assert.equal(res.status, 400);
      assert.equal(await codigo(res), 'INVALID_UNITS');
    }
  });
});

test('uma unidade inválida derruba o lote inteiro: nada é gravado', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/units`, {
      units: [
        { title: 'Capítulo 1', type: 'chapter', order: 1, pdfStartPage: 5, pdfEndPage: 9 },
        { title: 'Sem páginas', type: 'chapter', order: 2 },
      ],
    });
    assert.equal(res.status, 400);
    assert.equal(await codigo(res), 'INVALID_UNIT');
    assert.equal(db.store.size, 0);
    assert.equal(db.commits, 0);
  });
});

test('unidades válidas são gravadas com os padrões, e ordem 0 é aceita', async () => {
  const db = new FakeFirestore();
  await withLiterary(db, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', `${BASE}/works/w1/units`, {
      units: [{ title: 'Prólogo', type: 'chapter', order: 0, pdfStartPage: 1, pdfEndPage: 3 }],
    });
    assert.equal(res.status, 200);
    const [salva] = await res.json() as Array<Record<string, unknown>>;
    assert.equal(salva.requiredByExam, true);
    assert.equal(salva.extractionConfidence, 'medium');
    assert.equal(salva.workId, 'w1');
    assert.deepEqual(db.store.get(`literaryWorks/w1/units/${String(salva.id)}`), salva);
  });
});

test('listar unidades devolve na ordem do campo order', async () => {
  const db = new FakeFirestore()
    .seed('literaryWorks/w1/units/u3', { id: 'u3', order: 3 })
    .seed('literaryWorks/w1/units/u1', { id: 'u1', order: 1 })
    .seed('literaryWorks/w1/units/u2', { id: 'u2', order: 2 })
    .seed('literaryWorks/w2/units/u9', { id: 'u9', order: 0 });

  await withLiterary(db, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'GET', `${BASE}/works/w1/units`);
    assert.deepEqual(((await res.json()) as { id: string }[]).map((u) => u.id), ['u1', 'u2', 'u3']);
  });
});
