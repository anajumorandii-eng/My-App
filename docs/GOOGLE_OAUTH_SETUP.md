# Conexão com o Google (agenda e Drive)

Passo a passo para a integração funcionar em produção. Só é preciso fazer uma
vez; depois disso a autorização de cada aluna sobrevive a recargas e à
expiração do access token, porque o refresh token fica guardado no servidor.

Domínio de produção:

```
https://my-app-git-150170824812.southamerica-east1.run.app
```

## 1. Google Cloud Console — cliente OAuth

Em **APIs & Services → Credentials → OAuth 2.0 Client IDs**, o cliente a editar
é o **JUJU** — o criado à mão para o app. NÃO use o "Web client (auto created by
Google Service)": aquele é do Firebase Authentication, cuida do login, tem os
redirect URIs dele apontando para `<projeto>.firebaseapp.com/__/auth/handler` e
pode ser reescrito pelo Firebase sem aviso. Os dois convivem sem conflito — o do
Firebase responde por quem a aluna é, o JUJU pela autorização de ler agenda e
Drive.

No **JUJU**, cadastre:

**Authorized redirect URIs** — precisa bater caractere por caractere com o que
o servidor monta em `${APP_URL}/api/oauth/google/callback`:

```
https://my-app-git-150170824812.southamerica-east1.run.app/api/oauth/google/callback
http://localhost:3000/api/oauth/google/callback
```

**Authorized JavaScript origins:**

```
https://my-app-git-150170824812.southamerica-east1.run.app
http://localhost:3000
```

Sem o redirect URI cadastrado, o Google recusa a autorização com
`redirect_uri_mismatch` antes mesmo de mostrar a tela de consentimento.

## 2. Google Cloud Console — tela de consentimento

Em **APIs & Services → OAuth consent screen**, os escopos pedidos são:

```
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/drive.readonly
```

Enquanto a tela estiver em modo **Testing**, só contas listadas em *Test users*
conseguem autorizar — e o refresh token expira em 7 dias, o que faz a conexão
cair sozinha. Para a autorização durar, publique a tela de consentimento.

Confirme também que a **Google Calendar API** e a **Google Drive API** estão
habilitadas em *APIs & Services → Enabled APIs*.

## 3. Firebase — domínios autorizados

Em **Authentication → Settings → Authorized domains**, o domínio precisa estar
na lista, senão o login falha com `auth/unauthorized-domain`:

```
my-app-git-150170824812.southamerica-east1.run.app
```

## 4. Variáveis do serviço no Cloud Run

`APP_URL` é o que compõe o redirect URI: se não bater com o cadastrado no passo
1, a autorização falha.

```
APP_URL=https://my-app-git-150170824812.southamerica-east1.run.app
GOOGLE_CLIENT_ID=<client id do JUJU>
GOOGLE_CLIENT_SECRET=<client secret do JUJU, via Secret Manager>
```

Sem `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`, as rotas de
`/api/oauth/google` respondem `503 GOOGLE_OAUTH_UNAVAILABLE` e a tela de
Conexões avisa que a integração não está configurada naquele ambiente — o
resto do app continua funcionando normalmente.

## Diagnóstico

Antes de investigar qualquer outra coisa, abra:

```
https://my-app-git-150170824812.southamerica-east1.run.app/api/health
```

A resposta diz o que a revisão que está no ar realmente enxerga:

```json
{
  "status": "ok",
  "googleOAuth": {
    "configured": true,
    "hasClientId": true,
    "hasClientSecret": true,
    "redirectUri": "https://.../api/oauth/google/callback"
  }
}
```

Como ler:

- **`configured: false`** — a revisão em tráfego não recebeu as variáveis.
  `hasClientId` e `hasClientSecret` dizem qual das duas falta. Editar as
  variáveis no Cloud Run só vale a partir de uma nova revisão implantada.
- **`redirectUri` diferente do cadastrado no cliente JUJU** — é isso que causa
  `redirect_uri_mismatch`. O valor tem que bater caractere por caractere,
  inclusive quanto a barra no final. Ele vem de `APP_URL`.
- **`configured: true` e o `redirectUri` correto** — a configuração está certa
  e o problema é outro; procure nos logs do Cloud Run por `Failed to start
  Google OAuth` ou `Google OAuth callback failed`.

O mesmo diagnóstico sai no log de arranque do serviço, como um evento
`google_oauth_config` — útil pra comparar revisões no Logs Explorer.

## 5. Conferir

Depois do deploy, em **Conexões**:

1. "Conectar com Google" leva à tela de consentimento do Google.
2. Ao voltar, os compromissos do dia e os arquivos recentes aparecem.
3. **Recarregue a página**: a conexão continua de pé. Era exatamente isso que
   não acontecia antes — o access token vivia só na memória da aba.

Se algo falhar, o callback devolve a aluna para `/conexoes?google=<motivo>`, e
a tela traduz o motivo numa mensagem. Os motivos possíveis estão em
`src/lib/googleConnection.ts`.

## Onde as credenciais ficam

O refresh token vai para `googleOAuthGrants/{uid}` e os states de uso único
para `googleOAuthStates/{nonce}` — as duas coleções na raiz do Firestore, sem
regra de acesso, o que faz o padrão de negar tudo valer para qualquer cliente.
Só o Admin SDK, a partir do servidor, alcança essas coleções. É por isso que
elas não moram em `users/{uid}/...`, onde as regras dão à própria aluna leitura
da subárvore inteira — e o refresh token ficaria exposto ao navegador dela.

Para desconectar, `DELETE /api/oauth/google` revoga o token no Google e apaga a
concessão. Se a aluna revogar o acesso direto na Conta Google dela, a primeira
renovação seguinte falha com `invalid_grant`, o servidor apaga a concessão
sozinho e a tela volta a oferecer "Conectar".
