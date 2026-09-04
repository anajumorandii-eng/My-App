# Conexão com o Google (agenda e Drive)

Passo a passo para a integração funcionar em produção. Só é preciso fazer uma
vez; depois disso a autorização de cada aluna sobrevive a recargas e à
expiração do access token, porque o refresh token fica guardado no servidor.

Domínio de produção:

```
https://my-app-git-150170824812.southamerica-east1.run.app
```

## 1. Google Cloud Console — cliente OAuth

Em **APIs & Services → Credentials → OAuth 2.0 Client IDs**, no cliente do tipo
*Web application* (o mesmo do `GOOGLE_CLIENT_ID`), cadastre:

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
GOOGLE_CLIENT_ID=<client id>
GOOGLE_CLIENT_SECRET=<secret, via Secret Manager>
```

Sem `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`, as rotas de
`/api/oauth/google` respondem `503 GOOGLE_OAUTH_UNAVAILABLE` e a tela de
Conexões avisa que a integração não está configurada naquele ambiente — o
resto do app continua funcionando normalmente.

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
