# Podcast personalizado do CRIVO

A aba `/podcast` permite criar episódios a partir dos resumos editoriais do CRIVO, de material colado pela estudante ou de conceitos gerais de um tema. As fontes são identificadas na transcrição; sem material selecionado, a interface informa que o episódio explica conceitos gerais.

## Personalização

- Uma ou duas pessoas, com vozes distintas e papéis de explicação, curiosidade ou análise.
- Duração planejada de 2 a 15 minutos, que determina a extensão solicitada ao roteirista; o tempo efetivo depende da fala e das pausas.
- Conversa, aula, revisão ou perguntas e respostas; conhecimento inicial, ritmo, tom, foco de vestibular e instruções da estudante.
- Até três resumos, com limite de 12.000 caracteres para o conjunto de materiais. Material acima do limite é recusado com orientação, sem truncamento silencioso.

## Geração e reprodução

O roteiro é transmitido como rascunho e só se torna reproduzível quando a geração termina. Diálogos usam os identificadores internos `Host1:` e `Host2:`, associados às vozes na síntese. Falhas não disponibilizam o rascunho como episódio concluído.

A síntese divide o roteiro em trechos de até 1.800 caracteres, preservando os falantes. Os WAV PCM retornados são unidos em um único arquivo, validando o formato e atualizando o cabeçalho. O cache do servidor inclui texto, vozes, participantes, ritmo e tom. A interface informa o progresso e permite cancelar; respostas antigas não substituem a seleção atual.

O player oferece pausa, posição, avanço e retorno de 15 segundos, velocidade, transcrição, fontes e download de áudio e roteiro. A falha na voz natural é exibida para permitir nova tentativa.

## Persistência

As preferências são gravadas por atualização parcial no perfil, após uma leitura válida. Os episódios pessoais ficam em `users/{uid}/podcasts/{id}`, com roteiro, configuração, fontes identificadas e data. A biblioteca pagina os registros em lotes de 30. A confirmação de gravação não bloqueia a reprodução; sincronização pendente e erros são mostrados separadamente. A troca de conta limpa conteúdo e áudio da sessão anterior.

## Validação e requisito de serviço

Testes cobrem personalização do prompt, validação de opções, associação de duas vozes, cache, segmentação e união WAV, cancelamento, erros, controles, gravação pendente, paginação e isolamento entre contas. A checagem de navegador está em `artifacts/podcast/browser-report.json`, com capturas em telas de 390, 834 e 1440 pixels.

A geração exige autenticação e serviço de IA configurado. A voz usa Google Cloud Text-to-Speech por padrão (`PODCAST_TTS_PROVIDER=google-cloud`). No Cloud Run, autentica pela conta de serviço da revisão usando Application Default Credentials, sem chave JSON. Configure `GOOGLE_CLOUD_PROJECT` com o projeto que tem a API e o faturamento habilitados. A geração de roteiro continua usando o serviço de IA configurado no app.

O catálogo vem de `GET /v1/voices` e mostra apenas vozes com suporte a `pt-BR`. Cada participante tem seleção e prévia própria. A síntese usa `POST /v1/text:synthesize`, LINEAR16 e 24 kHz; cada fala é sintetizada separadamente e os WAV são unidos com pausas. Vozes antigas são reconciliadas com o catálogo disponível. Episódios salvos também permitem usar explicitamente as vozes atuais do painel.

Requisições iguais simultâneas compartilham a síntese, e falas concluídas ficam em cache mesmo se uma fala seguinte falhar. Cada trecho tem prazo total de 140 segundos e cancelamento quando a conexão fecha. O catálogo não consome a cota diária de geração de áudio. O modo anterior pode ser selecionado com `PODCAST_TTS_PROVIDER=gemini`, exigindo `GEMINI_API_KEY`.

Esta sessão não recebeu credenciais Google: a consulta real retornou ausência de Application Default Credentials. Os testes usam um cliente controlado; disponibilidade e qualidade sonora precisam ser verificadas na revisão do Cloud Run que possui a identidade autorizada.

## Publicação no Cloud Run

Após atualizar o checkout com o código validado, execute no Cloud Shell, na raiz do repositório:

```sh
gcloud run deploy my-app-git \
  --source . \
  --project gen-lang-client-0346381323 \
  --region southamerica-east1 \
  --update-env-vars PODCAST_TTS_PROVIDER=google-cloud,GOOGLE_CLOUD_PROJECT=gen-lang-client-0346381323
```

O comando reconstrói a aplicação a partir do código e mantém as demais variáveis e a conta de serviço existente. Após a implantação, entre no CRIVO, abra Podcast, ouça duas prévias e gere um episódio curto com duas vozes distintas. Confirme reprodução completa, transcrição e download. Se o catálogo falhar, consulte os logs da nova revisão para distinguir credenciais, API, faturamento e permissões.
