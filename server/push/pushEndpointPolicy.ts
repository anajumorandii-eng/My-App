// O endpoint de uma inscrição de push é uma URL que o servidor vai chamar. O
// web-push só confere que ele é uma string e faz um https.request para o host
// que vier, e as regras do Firestore deixam o navegador escrever direto em
// users/{uid}/data/pushSubscription — então nem a rota /subscribe é a única
// porta de entrada. Sem esta lista, qualquer aluna logada fazia o servidor
// enviar o corpo cifrado e o JWT VAPID para um host à escolha dela.
//
// Só entram os serviços de push dos navegadores que a aluna realmente usa.
// Se um navegador novo aparecer, o aviso do envio traz o host recusado e a
// correção é acrescentar uma linha aqui.
const PUSH_HOSTS = new Set([
  'fcm.googleapis.com', // Chrome, Edge, Brave, Opera, Samsung Internet
  'updates.push.services.mozilla.com', // Firefox
]);

// Sufixo sempre com o ponto de fronteira: 'evilnotify.windows.com' termina em
// 'notify.windows.com' mas não é subdomínio dele.
const PUSH_HOST_SUFFIXES = [
  '.notify.windows.com', // WNS, Edge no Windows
  '.push.apple.com', // Safari (web.push.apple.com)
];

// Endpoints reais passam de 200 caracteres, mas ficam bem abaixo disto.
const MAX_ENDPOINT_LENGTH = 2048;

function isPushServiceHost(hostname: string): boolean {
  return PUSH_HOSTS.has(hostname) || PUSH_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

/**
 * Devolve o endpoint na forma canônica se ele aponta para um serviço de push
 * conhecido, ou null.
 *
 * O que segue para o web-push precisa ser o valor devolvido, nunca a string
 * crua: a decisão é tomada com a API WHATWG e o web-push lê o endpoint com o
 * url.parse legado. A forma canônica não tem barra invertida nem credenciais
 * que os dois leiam de jeito diferente, então o host aprovado aqui é o host
 * que ele vai contatar.
 */
export function safePushEndpoint(endpoint: unknown): string | null {
  if (typeof endpoint !== 'string' || endpoint.length === 0 || endpoint.length > MAX_ENDPOINT_LENGTH) return null;

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;
  if (url.username || url.password) return null;
  // A API WHATWG devolve porta vazia para a 443 padrão.
  if (url.port) return null;
  if (!isPushServiceHost(url.hostname)) return null;

  return url.href;
}
