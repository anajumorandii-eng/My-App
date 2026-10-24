# Geração de revisão interrompida por atualização de arquivos

Ao escolher o material e tocar em Gerar resumo de revisão, a interface podia voltar à Fila de revisões sem explicar a interrupção. Reproduzido no build de produção com 404 na primeira requisição de examEvidenceCases, carregado ao montar as fontes, antes da chamada de IA.

O handler global de vite:preloadError recarregava a página para buscar os arquivos do novo deploy. O recurso e a seleção existiam apenas em memória. Antes dessa recarga, agora emite um evento síncrono de preservação: a central registra recurso e destino na URL, e a revisão registra matéria, tópico, capítulo, opções e resumo aberto em sessão isolada por conta. A cópia vale cinco minutos e é consumida na montagem.

Depois da atualização, a mesma tela reabre com as escolhas e um aviso para repetir a geração. Não há nova chamada automática de IA. Textos já salvos podem ser reabertos e exportados pelo fluxo existente. Não houve alteração dos prompts, capas, conteúdo ou renderizador PDF.

A preservação é melhor esforço quando o navegador bloqueia armazenamento. Não recupera resposta parcial de IA ainda não salva nem corrige problemas independentes de autenticação, rede, IA ou armazenamento do PDF.

## Evidências antes da indisponibilidade do ambiente

- Dois testes de regressão falharam antes e passaram depois: recurso e seleção.
- Dezenove testes focados passaram, incluindo conta isolada, expiração, dados inválidos e resumo salvo.
- Reprodução em navegador após a correção: resumos-banca, profundidade aprofundada e segunda fase preservadas, com aviso. Antes: fila, sem alerta.
- Fluxo sintético em 390 e 834 px: texto leva ao PDF automático, matemática e respostas recolhidas.
- HTML desse fluxo renderizado no Chromium real: quatro páginas, capa, índice, matemática e gabarito separado na última página.
- Build inicial passou. Os 1.232 testes de servidor/bibliotecas passaram. A suíte completa e as verificações finais foram iniciadas, mas o ambiente ficou indisponível antes de confirmar seus resultados.

## Ponto de retomada

Envio imediato solicitado pela estudante devido ao limite da sessão. Arquivos reconstruídos a partir da alteração preparada e da base f12d47d9 pela conexão GitHub, pois o workspace ficou indisponível antes do push. Validar novamente lint, npm test com CHROMIUM_PATH=/usr/bin/chromium e npm run build antes de integrar. Não apresentar a suíte integral como aprovada.

Não houve acesso à conta da estudante nem chamada à IA de produção. A reprodução confirma esse caminho de falha, não a ausência de outros problemas na sessão original.
