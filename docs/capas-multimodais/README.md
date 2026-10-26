# Ilustrações pelo transporte multimodal do gateway

O catálogo do gateway pode anunciar um modelo de imagem cuja rota aceita seja `/chat/completions`, enquanto `/images/generations` o rejeita. Uma chamada direta ao provedor não comprova a disponibilidade dessa rota através do gateway.

## Implementação

`AI_IMAGE_TRANSPORT=images` mantém o comportamento anterior, inclusive quando a variável não existe. `AI_IMAGE_TRANSPORT=chat` envia o mesmo pedido visual e os mesmos metadados ao endpoint multimodal com `modalities: ["text", "image"]`. O modelo continua sendo selecionado por `AI_IMAGE_MODEL`. As credenciais de cliente e o endereço continuam herdando a configuração do gateway; tokens OAuth do provedor ficam no gateway.

A resposta multimodal é lida em `choices[0].message.images[0].image_url.url`. Apenas PNG ou JPEG incorporados são aceitos. O servidor confere a codificação, o tamanho e as dimensões; não busca URLs retornadas nem aceita SVG. O navegador mantém o limite de tamanho e a verificação do contexto do material. Os limites de tempo, cota, autenticação e frequência existentes são preservados. Não há fallback automático de transporte, repetição de geração nem alteração das rotas de texto. Transporte inválido desabilita a operação.

A validação técnica não equivale a aprovação visual: uma amostra de Química desenhou um quadriculado no fundo, e a de Literatura inseriu letras apesar do pedido sem texto. Por isso a rota não foi ativada como padrão.

JPEG não oferece transparência. O enquadramento e a cor de fundo devem ser considerados ao comparar com a rota de imagens; não se promete equivalência visual entre provedores. A diagramação e a tipografia continuam sendo desenhadas pelo Crivo.

## Validação

- TypeScript sem erros; 1.251 testes do servidor aprovados (um ignorado) e 3.339 testes de interface aprovados em 258 arquivos.

- Chamada real ao gateway: a rota multimodal retornou imagem; a rota exclusiva de imagens rejeitou o mesmo modelo.
- Três chamadas reais usando o serviço do Crivo e seu pedido visual: Matemática/Ângulos na circunferência, Química/Deslocamento do equilíbrio e Literatura/Narrador e construção das personagens.
- Testes do servidor cobrem transporte explícito, autenticação, metadados, PNG/JPEG, tamanho/dimensões, imagem ausente, conteúdo ativo, URL remota e transporte inválido.
- Teste da preparação do PDF confirma que o JPEG é incorporado sem perder capa e sumário.
- Chromium decodificou a imagem real, o renderizador do servidor exportou um PDF de três páginas e a capa foi conferida visualmente no PDF rasterizado.

Evidências sintéticas: [PDF](evidencias/capa.pdf) e [primeira página](evidencias/capa-pagina-1.png). Nenhuma credencial ou material pessoal integra a entrega.

Esta PR adiciona compatibilidade, sem trocar o transporte ou o modelo em produção. A configuração ativa do Cloud Run foi preservada durante os testes. Ativar a nova rota exige que este código esteja implantado e que transporte e modelo sejam configurados em conjunto.

## Arquivos

- `.env.example`
- `server.ts`
- `server/ai/coverImages.ts`
- `server/ai/coverImages.test.ts`
- `src/components/DeepeningPdf.tsx`
- `src/components/DeepeningPdf.test.tsx`
- `src/lib/printCoverContext.ts`
- `docs/impressao-aquarela/README.md`
- Este relatório e suas evidências.
