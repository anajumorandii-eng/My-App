# Login Google em mycrivo.com

O domínio já consta nos authorizedDomains do Firebase. Em 05/11/2026,
https://mycrivo.com/__/auth/handler ainda retornava o HTML do aplicativo.

O servidor agora encaminha /__/auth para os helpers do projeto Firebase,
antes dos cabeçalhos que impedem iframes. A configuração do frontend aceita
VITE_FIREBASE_AUTH_DOMAIN; o domínio padrão do aplicativo agora é mycrivo.com.
A chave da conta de serviço não deve entrar no repositório nem no frontend.

## Ativação

1. No Google Cloud, projeto gen-lang-client-0346381323, abrir APIs e serviços >
   Credenciais. Selecionar o cliente OAuth usado pelo provedor Google do Firebase:
   `150170824812-0d1kjsmra0kt0ctqr93kjbmlqs64d37m.apps.googleusercontent.com`.
2. Acrescentar a URI de redirecionamento autorizada
   `https://mycrivo.com/__/auth/handler`, preservando as existentes.
3. Publicar o servidor com o proxy. Conferir que /__/auth/iframe e
   /__/auth/handler retornam os helpers do Firebase, sem cair no index.html.
4. Reconstruir e publicar o frontend. O arquivo firebase-applet-config.json já
   define mycrivo.com. VITE_FIREBASE_AUTH_DOMAIN permite sobrescrever no build.
5. Testar login Google, saída e novo login em Safari/iPhone, incluindo o retorno
   de redirect. Conferir o domínio na seleção de conta e o usuário autenticado.

Para voltar, reconstruir com VITE_FIREBASE_AUTH_DOMAIN=gen-lang-client-0346381323.firebaseapp.com.
O cadastro de redirect do cliente OAuth não é alterado pela API de configuração
do Firebase. Deve ser concluído na credencial OAuth antes de ativar a variável.
