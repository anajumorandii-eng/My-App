import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequireFirebaseAuth, requireAdmin } from "../auth/firebaseAuth";
import { type AddressInfo } from "node:net";
import {
  CoverImageService,
  validateCoverContext,
  buildCoverImagePrompt,
  createCoverImageRouter,
} from "./coverImages";

const imageBytes = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
  "base64",
);
const context = {
  subject: "Literatura",
  work: "A vida não é útil",
  board: "UNICAMP",
};

test('elaboração aprovada alcança capa, contracapa e livreto em todas as matérias', () => {
 for(const subject of ['Biologia','Matemática','Física','Química','Geografia','História','Literatura','Português','Gramática','Inglês','Redação','Filosofia','Sociologia']) {
  for(const side of ['front','back','spread'] as const) {
   const prompt=buildCoverImagePrompt({subject,topic:'Tema específico',side});
   assert.match(prompt,/ELABORATED CRIVO ATLAS/);
   assert.match(prompt,/LIVING CRIVO ATLAS/);
   assert.match(prompt,/meaningful motion or transformation/);
   assert.match(prompt,/near the inner frame/);
   assert.match(prompt,/LIGHTNESS AND MARGINS/);
   assert.match(prompt,/VIVID PIGMENT AND COLOR FIDELITY/);
   assert.match(prompt,/Low-opacity washes belong to the margins, not the protagonists/);
   assert.match(prompt,/almost-transparent watercolor/);
   assert.match(prompt,/foreground, middle ground and fine background studies/);
   assert.match(prompt,/rich botanical green, luminous oxblood accents and antique copper/);
   assert.match(prompt,/No text, lettering/);
   assert.match(prompt,/transparent/);
  }
 }
});

test('leveza permite fenômenos exigidos pelo recorte sem impor efeitos decorativos', () => {
 for(const topic of ['Teste de chama','Combustão','Formação de espuma']){
  const prompt=buildCoverImagePrompt({subject:'Química',topic,side:'spread'});
  assert.ok(prompt.includes(topic));
  assert.match(prompt,/phenomena required by the exact scope remain allowed/);
 }
});

test('livreto exige conexão contínua e ocupação ampla em qualquer matéria sem invadir a tipografia', () => {
 for(const subject of ['Biologia','Matemática','Física','Química','Geografia','História','Literatura','Português','Gramática','Inglês','Redação','Filosofia','Sociologia']) {
  const prompt=buildCoverImagePrompt({subject,topic:'Tema específico',side:'spread'});
  assert.match(prompt,/MANDATORY CONTINUOUS CONNECTION/);
  assert.match(prompt,/visibly touches BOTH scenes/);
  assert.match(prompt,/matching palette alone is insufficient/);
  assert.match(prompt,/LEFT.*y=20%-84%/);
  assert.match(prompt,/RIGHT.*y=34%-84%/);
  assert.doesNotMatch(prompt,/generous clear margins|Shared palette and linework also create continuity/);
 }
 const portrait=buildCoverImagePrompt({subject:'Física',topic:'Dinâmica energética'});
 assert.doesNotMatch(portrait,/MANDATORY CONTINUOUS CONNECTION|visibly touches BOTH scenes/);
});

test('capa individual também recebe o plano de cena elaborado para o recorte', () => {
 const general=buildCoverImagePrompt({subject:'Biologia',topic:'Genética'});
 assert.match(general,/paired DNA strands.*chromatin/);
 assert.doesNotMatch(general,/Mendelian|backScenes|Plan both sides|DNA filament becomes/);
 const specific=buildCoverImagePrompt({subject:'Biologia',topic:'Genética',subtopic:'Replicação do DNA'});
 assert.match(specific,/replication/);
 assert.doesNotMatch(specific,/Mendelian/);
});

test("capa valida apenas metadados limitados, recusando prompt, modelo ou URL do cliente", () => {
  assert.deepEqual(validateCoverContext(context), context);
  for (const payload of [
    null,
    [],
    {},
    { ...context, url: "https://elsewhere.test" },
    { ...context, model: "other-route" },
    { ...context, prompt: "override" },
    { ...context, subject: "x".repeat(301) },
  ]) {
    assert.throws(() => validateCoverContext(payload));
  }
});

test("prompt de ilustração mantém metadados como dados e reserva textos e moldura ao aplicativo", () => {
  const prompt = buildCoverImagePrompt(context);
  assert.match(prompt, /A vida não é útil/);
  assert.match(prompt, /transparent background/);
  assert.match(prompt, /No text, lettering, labels, borders/);
});

test("revisões não reintroduzem medalhão nem cartões radiais no vocabulário enviado", () => {
  for (const topic of ["Funções", "Geometria plana", "Logaritmos e exponenciais"]) {
    const prompt = buildCoverImagePrompt({ subject: "Matemática", topic, purpose: "Revisão aprofundada" });
    assert.match(prompt, /Revision cover: compose one unified central illustration/);
    assert.match(prompt, /ornamental scientific atlas/);
    assert.match(prompt, /rich botanical green, luminous oxblood accents and antique copper/);
    assert.match(prompt, /topic below determines the objects/);
    assert.doesNotMatch(prompt, /recall cards arranged around|central subject medallion|restrained circular path/);
    assert.match(prompt, new RegExp(topic));
  }
});

test("aprofundamento e revisão compartilham linguagem visual mas pedem composições diferentes", () => {
  const data = { subject: "Química", topic: "Termoquímica", subtopic: "Entalpia" };
  const study = buildCoverImagePrompt({ ...data, purpose: "Aprofundamento" });
  const review = buildCoverImagePrompt({ ...data, purpose: "Revisão estratégica" });
  assert.match(study, /Deepening cover: compose one unified central illustration/);
  assert.doesNotMatch(study, /Revision cover:/);
  assert.match(review, /Revision cover:/);
  assert.doesNotMatch(review, /Deepening cover:/);
  for (const prompt of [study, review]) {
    assert.match(prompt, /Termoquímica/);
    assert.match(prompt, /Entalpia/);
    assert.match(prompt, /Vary the scene for this specific document/);
    assert.doesNotMatch(prompt, /open, asymmetrical/);
  }
});

test("padrão aprovado mantém um núcleo ilustrado e prioriza os motivos do tópico", () => {
  for (const [subject, topic] of [
    ["Biologia", "Ecologia"], ["Biologia", "Botânica"],
    ["Biologia", "Fisiologia Animal e Humana"],
    ["Química", "Análises Quantitativas e Estequiometria"],
    ["Matemática", "Geometria Plana"],
  ]) {
    const prompt = buildCoverImagePrompt({subject, topic, purpose: "Revisão estratégica"});
    assert.ok(prompt.includes(topic));
    assert.match(prompt, /one rich cohesive central cluster/);
    assert.match(prompt, /specific topic takes precedence/);
    assert.match(prompt, /not a generic DNA, microscope and plant-cell emblem/);
    assert.doesNotMatch(prompt, /compact illustrated field|open, asymmetrical/);
  }
});

test("gera uma única imagem no endpoint de imagens com autenticação apenas no servidor", async () => {
  let request: { url?: string; init?: RequestInit } = {};
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1/",
    apiKey: "private-client-key",
    model: "cover-image-route",
    fetch: async (url, init) => {
      request = { url: String(url), init };
      return Response.json({
        data: [{ b64_json: imageBytes.toString("base64") }],
      });
    },
  });
  const result = await service.generate(context);
  assert.equal(request.url, "https://gateway.test/v1/images/generations");
  assert.equal(
    (request.init!.headers as Record<string, string>).Authorization,
    "Bearer private-client-key",
  );
  const body = JSON.parse(String(request.init!.body));
  assert.equal(body.model, "cover-image-route");
  assert.equal(body.n, 1);
  assert.equal(body.background, "transparent");
  assert.equal(body.response_format, "b64_json");
  assert.equal(
    result.dataUrl,
    `data:image/png;base64,${imageBytes.toString("base64")}`,
  );
  assert.ok(!JSON.stringify(result).includes("private-client-key"));
});

test("recusa URL remota e conteúdo ativo em vez de buscá-los com a credencial do gateway", async () => {
  for (const item of [
    { url: "https://elsewhere.test/image" },
    { b64_json: Buffer.from('<svg onload="alert(1)"/>').toString("base64") },
  ]) {
    let calls = 0;
    const service = new CoverImageService({
      baseUrl: "https://gateway.test/v1",
      apiKey: "private-client-key",
      model: "cover-image-route",
      fetch: async () => {
        calls++;
        return Response.json({ data: [item] });
      },
    });
    await assert.rejects(service.generate(context));
    assert.equal(calls, 1);
  }
});

test("erro do gateway não expõe o corpo nem a chave e não aciona rota de conversação", async () => {
  let calls = 0;
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "private-client-key",
    model: "cover-image-route",
    fetch: async () => {
      calls++;
      return new Response("private-client-key upstream secret", {
        status: 403,
      });
    },
  });
  await assert.rejects(
    service.generate(context),
    (error: Error) => !/private-client-key|upstream secret/.test(error.message),
  );
  assert.equal(calls, 1);
});

test("sem configuração não tenta gerar e exige modelo de imagens explícito no servidor", async () => {
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "private-client-key",
  });
  assert.equal(service.isConfigured, false);
  await assert.rejects(service.generate(context));
});

test("aborta a chamada que excede o tempo limite", async () => {
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    timeoutMs: 10,
    fetch: async (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init!.signal!.addEventListener(
          "abort",
          () => reject(new DOMException("Timeout", "AbortError")),
          { once: true },
        );
      }),
  });
  // A timer keeps the test process alive while AbortSignal.timeout is unreferenced.
  const keepAlive = setInterval(() => {}, 100);
  try {
    await assert.rejects(service.generate(context));
  } finally {
    clearInterval(keepAlive);
  }
});

test("rota devolve capacidade e imagem, valida antes da cota e bloqueia geração não configurada", async () => {
  let consumed = 0;
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    fetch: async () =>
      Response.json({ data: [{ b64_json: imageBytes.toString("base64") }] }),
  });
  const app = express();
  app.use(express.json());
  app.use(
    "/cover",
    createCoverImageRouter(service, (_req, _res, next) => {
      consumed++;
      next();
    }),
  );
  app.use(
    "/disabled",
    createCoverImageRouter(new CoverImageService({}), (_req, _res, next) => {
      consumed++;
      next();
    }),
  );
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/cover`;
  try {
    assert.deepEqual(await (await fetch(base)).json(), { enabled: true });
    assert.deepEqual(
      await (await fetch(base.replace("/cover", "/disabled"))).json(),
      { enabled: false },
    );
    assert.equal(
      (
        await fetch(base.replace("/cover", "/disabled"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context),
        })
      ).status,
      503,
    );
    assert.equal(consumed, 0);
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...context, model: "override" }),
        })
      ).status,
      400,
    );
    assert.equal(consumed, 0);
    const response = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
    });
    assert.equal(response.status, 200);
    assert.equal(consumed, 1);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(
      ((await response.json()) as { dataUrl: string }).dataUrl,
      /^data:image\/png;base64,/,
    );
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("limita o tamanho da resposta antes de analisar JSON", async () => {
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    fetch: async () => new Response(new Uint8Array(9 * 1024 * 1024 + 1)),
  });
  await assert.rejects(service.generate(context), /tamanho permitido/);
});

test("corpos malformados, PNG truncado e dimensões excessivas não são aceitos", async () => {
  const huge = Buffer.from(imageBytes);
  huge.writeUInt32BE(10000, 16);
  for (const response of [
    () => new Response("{"),
    () => Response.json(null),
    () =>
      Response.json({
        data: [{ b64_json: imageBytes.subarray(0, 24).toString("base64") }],
      }),
    () => Response.json({ data: [{ b64_json: huge.toString("base64") }] }),
  ]) {
    const service = new CoverImageService({
      baseUrl: "https://gateway.test/v1",
      apiKey: "key",
      model: "cover-image-route",
      fetch: async () => response(),
    });
    await assert.rejects(service.generate(context));
  }
});

test("autenticação e administração verificadas bloqueiam geração antes de atingir o gateway", async () => {
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = "admin@example.test";
  let calls = 0;
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    fetch: async () => {
      calls++;
      return Response.json({
        data: [{ b64_json: imageBytes.toString("base64") }],
      });
    },
  });
  const app = express();
  app.use(express.json());
  app.use(
    "/cover",
    createRequireFirebaseAuth({
      verifyIdToken: async (token) => ({
        uid: "uid",
        email: token === "admin" ? "admin@example.test" : "other@example.test",
        email_verified: token !== "unverified",
      }),
    }),
    requireAdmin,
    createCoverImageRouter(service, (_req, _res, next) => next()),
  );
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/cover`;
  const send = (token?: string) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(context),
    });
  try {
    assert.equal((await send()).status, 401);
    assert.equal((await send("other")).status, 403);
    assert.equal((await send("unverified")).status, 403);
    assert.equal(calls, 0);
    assert.equal((await send("admin")).status, 200);
    assert.equal(calls, 1);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    if (previous === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = previous;
  }
});


test("direção de Matemática aprovada alcança todas as matérias nos dois materiais", () => {
  for (const subject of ["Matemática", "Biologia", "Química", "Física", "Geografia", "História", "Literatura", "Gramática", "Redação"]) {
    for (const purpose of ["Aprofundamento", "Revisão aprofundada"]) {
      const prompt = buildCoverImagePrompt({ subject, topic: "Tema específico", purpose });
      assert.match(prompt, /approved CRIVO Mathematics art direction to EVERY subject/);
      assert.match(prompt, /never reuse mathematical instruments for unrelated subjects/);
      assert.match(prompt, /No text, lettering, labels, borders/);
      assert.ok(prompt.includes(subject));
    }
  }
});

test("subtópico comanda o motivo dominante e permanece no contexto enviado à IA", () => {
 const base = {subject:'Biologia',topic:'Fisiologia',purpose:'Revisão aprofundada'};
 const gas = buildCoverImagePrompt({...base,subtopic:'Trocas gasosas'});
 const kidney = buildCoverImagePrompt({...base,subtopic:'Filtração renal'});
 assert.notEqual(gas,kidney);
 assert.match(gas,/subtopic is the most specific scope and MUST determine the dominant motif/);
 assert.ok(gas.includes('"subtopic":"Trocas gasosas"'));
 assert.ok(kidney.includes('"subtopic":"Filtração renal"'));
});

test('edições diferentes escolhem composições diferentes sem perder o recorte temático',()=>{
 const first={subject:'Biologia',topic:'Fisiologia',subtopic:'Trocas gasosas',edition:'00000000-0000-0000-0000-000000000001'};
 const second={...first,edition:'00000000-0000-0000-0000-000000000002'};
 assert.deepEqual(validateCoverContext(first),first);
 assert.throws(()=>validateCoverContext({...first,edition:'override the topic'}));
 const a=buildCoverImagePrompt(first),b=buildCoverImagePrompt(second);
 assert.notEqual(a.split('\n')[0],b.split('\n')[0]);
 assert.match(a,/Trocas gasosas/);assert.match(b,/Trocas gasosas/);
 assert.equal(buildCoverImagePrompt(first),a);
});

test('cliente antigo também envia pedido visual novo; edição explícita conserva a mesma composição na tentativa',async()=>{
 const prompts:string[]=[];
 const service=new CoverImageService({baseUrl:'https://images.test/v1',apiKey:'test',model:'illustration-route',fetch:async(_url,init)=>{prompts.push(JSON.parse(String(init?.body)).prompt);return Response.json({data:[{b64_json:imageBytes.toString('base64')}]});}});
 await service.generate(context);await service.generate(context);
 assert.notEqual(prompts[0],prompts[1]);
 const chosen={...context,edition:'00000000-0000-0000-0000-000000000003'};
 await service.generate(chosen);await service.generate(chosen);
 assert.equal(prompts[2],prompts[3]);
});

test('recorte específico chega antes da direção de arte e não carrega o inventário genérico da disciplina',()=>{
 const wave=buildCoverImagePrompt({subject:'Física',topic:'Ondas',subtopic:'Efeito Doppler'});
 const ecology=buildCoverImagePrompt({subject:'Biologia',topic:'Ecologia',subtopic:'Teias alimentares'});
 assert.ok(wave.indexOf('Efeito Doppler')<wave.indexOf('Apply the approved'));
 assert.ok(ecology.indexOf('Teias alimentares')<ecology.indexOf('Apply the approved'));
 assert.doesNotMatch(wave,/pendulum, prism, lenses, a spring-mass apparatus/);
 assert.doesNotMatch(ecology,/leaf specimens, a cell, DNA and microscopy/);
});

test('pedido de Português contém orientação própria antes da estética e evita personificações', () => {
  for (const purpose of ['Aprofundamento','Revisão aprofundada']) {
    const prompt=buildCoverImagePrompt({subject:'Português',topic:'Gramática',subtopic:'Orações subordinadas',purpose});
    assert.ok(prompt.indexOf('Sentence structure') < prompt.indexOf('Apply the approved'));
    assert.match(prompt,/Do not depict any woman, man/);
    assert.match(prompt,/textual relationship is the subject/);
    assert.match(prompt,/every supporting object can be justified/);
    assert.match(prompt,/No text, lettering, labels, borders/);
  }
});

 test('contracapa é uma segunda cena complementar, com escopo e transparência preservados',()=>{
 const payload={subject:'Geografia',topic:'Climatologia e Problemas Socioambientais',side:'back'};
 assert.deepEqual(validateCoverContext(payload),payload);
 assert.throws(()=>validateCoverContext({...payload,side:'anything'}));
 const prompt=buildCoverImagePrompt(validateCoverContext(payload));
 assert.match(prompt,/ONLY a new BACK COVER/);assert.match(prompt,/never the same image, mirrored image/);
 assert.match(prompt,/Brazilian watershed landscape/);assert.match(prompt,/without another globe or weather instruments/);
 assert.match(prompt,/transparent background/);assert.match(prompt,/No text, lettering/);
 for(const subject of ['Matemática','Biologia','Literatura','Português']){
  const scoped=buildCoverImagePrompt({subject,topic:'Tópico selecionado',subtopic:'Recorte específico',side:'back'});
  assert.match(scoped,/Recorte específico/);assert.match(scoped,/quoted subtopic always takes precedence/);
 }
 });

test('livreto solicita uma única arte panorâmica contínua com capa e contracapa planejadas juntas',async()=>{
 const input={subject:'Geografia',topic:'Climatologia e Problemas Socioambientais',side:'spread' as const};
 assert.deepEqual(validateCoverContext(input),input);
 const prompt=buildCoverImagePrompt(input);assert.match(prompt,/ONE SINGLE PAIRED COVER/);assert.match(prompt,/TWO DISTINCT TALL VERTICAL COMPOSITIONS/);assert.match(prompt,/x=2.5%-49%, y=20%-84%/);assert.match(prompt,/untrusted data/);
 let calls=0;
 const wide=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAAKklEQVR4nGNgGAWjYIABo1Fm6P+BdADTQFo+6oBRB4w6YNQBo2AUDAoAAAS6AgP2cc2iAAAAAElFTkSuQmCC','base64');
 const service=new CoverImageService({baseUrl:'https://gateway.test/v1',apiKey:'private-test-key',model:'cover-image-route',fetch:async(_url,init)=>{
  calls++;const body=JSON.parse(String(init?.body));assert.equal(body.n,1);assert.equal(body.size,'1536x1024');assert.equal(body.background,'transparent');assert.equal(body.prompt,prompt.replace(JSON.stringify(input),JSON.stringify({...input,edition:'c8d8a3ac-3a14-4ea3-8e88-e177de5cebf5'})));
  return Response.json({data:[{b64_json:wide.toString('base64')}]});
 }});
 await service.generate({...input,edition:'c8d8a3ac-3a14-4ea3-8e88-e177de5cebf5'});assert.equal(calls,1);
 const portrait=new CoverImageService({baseUrl:'https://gateway.test/v1',apiKey:'private-test-key',model:'cover-image-route',fetch:async()=>Response.json({data:[{b64_json:imageBytes.toString('base64')}]})});
 await assert.rejects(portrait.generate(input),/panorâmico/);
});

test('capas de população e urbanização não recebem a cena de climatologia como exemplo',()=>{
 for(const side of ['back','spread'] as const){
  const prompt=buildCoverImagePrompt({subject:'Geografia',topic:'Geografia da População e Urbana do Brasil',side});
  assert.match(prompt,/urban neighborhoods|urban fabric/);
  assert.match(prompt,/population|demograph/);
  assert.doesNotMatch(prompt,/Brazilian watershed|lush Brazilian watershed|globe IN ITS ANTIQUE BRASS/);
 }
});
test('o recorte específico decide as duas cenas, sem herdar o exemplo de clima do tópico amplo',()=>{
 const prompt=buildCoverImagePrompt({subject:'Geografia',topic:'Climatologia e população',subtopic:'Migrações internas no Brasil',side:'spread'});
 assert.match(prompt,/migration/);
 assert.doesNotMatch(prompt,/Brazilian watershed|globe IN ITS ANTIQUE BRASS/);
});
test('cenas de outras disciplinas não recebem inventários de geografia',()=>{
 for(const context of [
  {subject:'Português',topic:'Orações subordinadas'},
  {subject:'Literatura',topic:'Literatura contemporânea'},
  {subject:'Biologia',topic:'Trocas gasosas'},
  {subject:'Física',topic:'Efeito Doppler'},
  {subject:'Matemática',topic:'Semelhança de triângulos'},
 ])for(const side of ['back','spread'] as const){
  const prompt=buildCoverImagePrompt({...context,side});
  assert.doesNotMatch(prompt,/Brazilian watershed|For Climatologia|For climatology|globe IN ITS ANTIQUE BRASS/);
  assert.ok(prompt.includes(context.topic));
  assert.match(prompt,/exact.*scope/);
 }
});
