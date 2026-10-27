# Crivo — contexto da integração de imagens, PDFs e revisões

Atualizado em 27/10/2026, por leitura do código e das PRs no GitHub. A
configuração de provedor foi conferida em produção em 25/10/2026; não houve
nova consulta ao Cloud Run nesta atualização, nem geração real.

Distinguir sempre: código integrado na `main`; publicação registrada em PR;
configuração efetivamente conferida no servidor ativo.

## 1. Provedor e nomes legados

Não assumir que o provedor atual é OmniRoute. Houve troca de provedor, mas o
código e as variáveis mantiveram os nomes antigos.

Caminho confirmado em 25/10/2026: Crivo → `ia.mycrivo.com` → serviço de
geração configurado por trás desse endereço. O modelo enviado era
`gpt-image-2`. Para confirmar o provedor final, consultar a configuração do
serviço em `ia.mycrivo.com`.

Nem o prefixo `OMNIROUTE_*`, nem o domínio, nem o identificador do modelo
comprovam sozinhos qual fornecedor atende à chamada.

## 2. Variáveis

Em `server.ts`:

```
baseUrl: process.env.AI_IMAGE_BASE_URL || process.env.OMNIROUTE_BASE_URL
apiKey:  process.env.AI_IMAGE_API_KEY  || process.env.OMNIROUTE_API_KEY
model:   process.env.AI_IMAGE_MODEL
```

Em produção (25/10/2026): `AI_IMAGE_MODEL=gpt-image-2`; `AI_IMAGE_BASE_URL` e
`AI_IMAGE_API_KEY` não substituíam os legados; `OMNIROUTE_BASE_URL` apontava
para `ia.mycrivo.com`; `OMNIROUTE_API_KEY` usava referência de segredo.

Não trocar endereço, recriar credenciais nem configurar outro provedor por
causa dos nomes. Conferir antes o destino efetivo. Nunca expor chaves.
`AI_PROVIDER` (texto) é independente da integração de imagens.

## 3. Fluxo de imagens na main

`src/components/DeepeningPdf.tsx` → `POST /api/cover-illustrations` →
`CoverImageService` → `POST {baseUrl}/images/generations`.

Contrato compatível com a API de imagens da OpenAI (compatibilidade não
identifica o fornecedor). Corpo: `model`, `prompt`, `n: 1`,
`size: "1024x1536"`, `background: "transparent"`, `output_format: "png"`,
`response_format: "b64_json"`. O backend lê `data[0].b64_json` e devolve
`{ dataUrl: "data:image/png;base64,..." }` — é a ilustração gerada, não imagem
fixa do banco.

A main valida PNG (tamanho e dimensões); não aceita JPEG multimodal. O serviço
de imagens tem timeout próprio de 150 s; o limite de 900 s do Cloud Run não o
altera.

## 4. Arquivos principais

- `server.ts` — configura e registra a rota de imagens.
- `server/ai/coverImages.ts` — prompt, chamada e validação da imagem.
- `src/lib/printCoverSpec.ts` — composição por assunto e tipo de material.
- `src/lib/printCoverContext.ts` — dados que personalizam a capa.
- `src/components/DeepeningPdf.tsx` — coordena ilustração, preparação e PDF.
- `src/lib/printCoverArt.ts` — capas padrão de contingência.
- `server/http/studyPdf.ts` — renderiza o PDF com Chromium (não gera ilustração).
- `src/components/AiTextRenderer.tsx` — renderiza conteúdo e normaliza matemática.
- `src/lib/printStyles.ts` — apresentação do documento exportado.
- `src/lib/aiClient.ts` — streaming de texto e confirmação final.
- `docs/revisoes-timeout-streaming.md` — corte pelo limite do Cloud Run.

## 5. Capas (PR #367, integrada e publicada)

Direção visual por matéria, tópico e subtópico: o recorte mais específico
orienta o motivo principal. Preservar:

- Uma ilustração personalizada por arquivo novo, gerada junto do material.
- Composições distintas: Aprofundamento vertical e desenvolvida; Revisão
  compacta, com a mesma identidade.
- Aquarela e gravura fina, identidade gráfica própria.
- Não trocar geração individual por capas fixas por matéria.
- Pedir ilustração por padrão na exportação sem PDF salvo, inclusive pela
  biblioteca; reaproveitar PDF salvo ao abrir ou baixar.
- Capa padrão como contingência; preservar o texto concluído se capa ou PDF
  falharem; ao repetir só o PDF, reaproveitar a ilustração já preparada.

O app desenha títulos e moldura; o serviço recebe pedido de ilustração sem
texto nem moldura. A integração ainda pode falhar.

## 6. Autenticação, limites e infraestrutura

A rota de imagens exige autenticação administrativa. Havia limite de três
pedidos de capa por janela, mais quota diária — revalidar antes de alterar;
tentativas rápidas podem receber 429.

Cloud Run: serviço `my-app-git`, região `southamerica-east1`. Memória do
contêiner do app ampliada para 2 GiB após encerramentos por falta de memória
em `/api/study-pdf`. PR #375: limite total de requisição em 900 s (diferente
dos limites de inatividade e dos timeouts internos).

## 7. Falhas já identificadas (não confundir)

- **Capa — 429 e 502.** 502 genérico não identifica a causa no serviço final.
  Capa padrão no PDF não significa que a personalização funcionou.
- **PDF — falta de memória.** Motivou os 2 GiB.
- **Fórmulas — "undefined" e texto posterior sumindo.** `$$` colado a fórmula
  multilinha consumia o texto seguinte. Corrigido na PR #368 (delimitadores em
  linha própria; moeda em reais não confundida com matemática, o que também
  alargava o conteúdo e deslocava a capa). Não cobre todo LaTeX inválido.
- **Fórmulas no PDF.** PR #369: CSS e fontes matemáticas incorporados, espera
  da renderização, radicais preservados, expressões largas ajustadas,
  normalização de Unicode só na matemática.
- **Revisão — "resposta vazia".** PR #374: leitor de streaming reconhece
  confirmação final com CRLF ou sem separador final. Transmissão interrompida
  continua erro; texto parcial não vira revisão concluída.
- **Revisões longas cortadas em 300 s.** PR #375: limite em 900 s, cancelamento
  propagado ao provedor, resultado final ausente tratado, sem cache de parcial,
  sem escrita em conexão encerrada, `X-Request-Id`. HTTP 200 inicial não
  comprova conclusão.

## 8. Investigação matemática

A branch local `fix/formulas-revisao-undefined` foi superada pelas PRs #368 e
#369. Não reaplicá-la sobre a main; conferir o código integrado primeiro. Novo
exemplo com erro ainda deve ser investigado.

## 9. Revisões

PR #366: até quatro tópicos da mesma matéria, capítulo por tópico. PR #369:
seleção e conferência do escopo, persistência dos recortes, direcionamento de
fontes/exemplos/exercícios, configurações sob demanda, biblioteca ao lado em
telas largas. Banca, fase e profundidade continuam comandando o material.

## 10. Não considerar entregue

- **PR #371 (rota multimodal, `AI_IMAGE_TRANSPORT=chat`)** — fechada sem
  integração. Não configurar essa variável.
- **PR #376 (figuras científicas nos resumos)** — aberta em 27/10/2026.
  Figuras desenhadas localmente de dados estruturados; não usa o gerador de
  capas.

## 11. Antes de alterar qualquer coisa

- Conferir main, PRs abertas e publicações recentes.
- Distinguir provedor final, gateway e nomes legados.
- Revalidar a configuração ativa quando a tarefa depender dela.
- PR integrada não é PR implantada; HTTP 200 de streaming não é conclusão.
- Não misturar falha de ilustração, memória do PDF e erro de matemática.
- Preservar conteúdo concluído e arquivos salvos; não sobrescrever outra sessão.
- Não expor credenciais.
