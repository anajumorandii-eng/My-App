import assert from 'node:assert/strict';
import test from 'node:test';
import { parse as legacyParse } from 'node:url';
import { safePushEndpoint } from './pushEndpointPolicy';

const ENDPOINTS_REAIS = [
  ['Chrome/Edge/Brave/Samsung (FCM)', 'https://fcm.googleapis.com/fcm/send/dXNlcjpmY20tdG9rZW4'],
  ['Firefox (autopush)', 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABk'],
  ['Windows (WNS)', 'https://wns2-par02p.notify.windows.com/w/?token=BQYAAAB'],
  ['Safari (APNs web)', 'https://web.push.apple.com/QGxyzABC'],
] as const;

for (const [nome, endpoint] of ENDPOINTS_REAIS) {
  test(`aceita e devolve intacto o endpoint de ${nome}`, () => {
    assert.equal(safePushEndpoint(endpoint), endpoint);
  });
}

test('devolve a forma canônica, não a string crua que o navegador mandou', () => {
  assert.equal(
    safePushEndpoint('HTTPS://FCM.GoogleAPIs.com:443/fcm/send/abc'),
    'https://fcm.googleapis.com/fcm/send/abc',
  );
});

const RECUSADOS: Array<[string, unknown]> = [
  ['http em vez de https', 'http://fcm.googleapis.com/fcm/send/abc'],
  ['host que não é serviço de push', 'https://evil.example.com/fcm/send/abc'],
  ['nome permitido como prefixo de outro domínio', 'https://fcm.googleapis.com.evil.example.com/x'],
  ['sufixo permitido sem o ponto de fronteira', 'https://evilnotify.windows.com/x'],
  ['apex do sufixo, que não é host de push', 'https://notify.windows.com/x'],
  ['host permitido no lugar do usuário (userinfo)', 'https://fcm.googleapis.com@evil.example.com/x'],
  ['barra invertida escondendo o host real', 'https://evil.example.com\\@fcm.googleapis.com/x'],
  ['credenciais embutidas em host permitido', 'https://user:senha@fcm.googleapis.com/x'],
  ['porta diferente da 443', 'https://fcm.googleapis.com:8443/x'],
  ['IPv4 de loopback', 'https://127.0.0.1/x'],
  ['IPv4 do serviço de metadados da nuvem', 'https://169.254.169.254/latest/meta-data'],
  ['IPv6 de loopback', 'https://[::1]/x'],
  ['localhost', 'https://localhost/x'],
  ['metadados internos do Google Cloud por nome', 'https://metadata.google.internal/computeMetadata/v1/'],
  ['esquema ftp', 'ftp://fcm.googleapis.com/x'],
  ['esquema javascript', 'javascript:alert(1)'],
  ['texto que não é URL', 'isso não é uma url'],
  ['string vazia', ''],
  ['endpoint absurdamente longo', `https://fcm.googleapis.com/fcm/send/${'a'.repeat(2100)}`],
  ['undefined', undefined],
  ['null', null],
  ['número', 42],
  ['objeto', {}],
];

for (const [nome, endpoint] of RECUSADOS) {
  test(`recusa: ${nome}`, () => {
    assert.equal(safePushEndpoint(endpoint), null);
  });
}

// O web-push lê o endpoint com o url.parse legado, não com a API WHATWG que
// a política usa para decidir. Por isso o que segue para ele é a forma
// canônica, e este teste prova que os dois leitores concordam sobre o host
// dela — inclusive quando a string crua tinha uma barra invertida ou um '#'.
test('o url.parse legado do web-push enxerga o mesmo host que a política aprovou', () => {
  const crus = [
    ...ENDPOINTS_REAIS.map(([, endpoint]) => endpoint),
    'https://fcm.googleapis.com\\@evil.example.com/x',
    'https://fcm.googleapis.com#@evil.example.com/x',
    'https://fcm.googleapis.com/fcm/send/a?b=@evil.example.com',
  ];

  // url.parse é a API deprecada (DEP0169) que o web-push usa; chamá-la aqui
  // é o objetivo do teste, então o aviso de deprecação não diz nada de novo.
  const avisosAntes = process.noDeprecation;
  process.noDeprecation = true;
  try {
    for (const cru of crus) {
      const canonico = safePushEndpoint(cru);
      assert.notEqual(canonico, null, `deveria aceitar: ${cru}`);
      assert.equal(legacyParse(canonico as string).hostname, new URL(canonico as string).hostname, `parsers divergem em: ${cru}`);
      assert.match(new URL(canonico as string).hostname, /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9-]+\.notify\.windows\.com|web\.push\.apple\.com)$/);
    }
  } finally {
    process.noDeprecation = avisosAntes;
  }
});
