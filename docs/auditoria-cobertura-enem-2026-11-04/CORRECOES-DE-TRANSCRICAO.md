# Correções de transcrição após a revisão editorial

A revisão de classificação foi mesclada na PR #412. Esta etapa corrige exclusivamente conteúdo extraído incorretamente das fontes públicas: 15 questões, sem alteração de IDs, classificações, gabaritos ou progresso.

## Causa e correções

O extrator mantinha a última questão aberta ao encontrar uma página de proposta ou rascunho de redação. O texto era concatenado à alternativa E e os recortes da página eram associados à questão anterior. Foram conferidos visualmente os PDFs e as imagens afetadas:

- Oito alternativas receberam indevidamente a proposta de redação: questão 45 de 2018–2022 e 2024–2025; questão canônica amarela 28 de 2023, preservada de um caderno azul.
- Cinco alternativas da questão 90 receberam a folha final de rascunho: 2019–2022 e 2024.
- A alternativa A da questão 59 de 2019 foi substituída pelo marcador de figura apesar de ser texto: “Falsificação de teses.”.
- As cinco alternativas da questão 106 do segundo dia de 2018 continham `kȍ` no lugar da unidade `kΩ`, confirmada na página 6.

Foram removidas 21 associações indevidas de imagens: propostas, rascunhos, logotipos e um cabeçalho de área. O manifesto passa de 929 para 908 referências de mídia. Os arquivos originais permanecem disponíveis; nenhuma figura legítima foi apagada. O texto-base “Traduzindo o juridiquês” e a pintura da questão seguinte de 2025 permanecem associados às questões corretas.

## Proteção do fluxo

O extrator agora identifica páginas autônomas de redação antes de atribuir texto ou imagens e encerra a questão anterior. Páginas com cabeçalho real de questão são preservadas, mesmo quando citam uma proposta de redação.

As correções estão em `scripts/data/enem-correcao-transcricao-2026-11-04.json`, com fonte, hash do PDF, páginas, evidência visual e valores exatos antes/depois. A importação compartilha a aplicação dessas transições: reaplicar é idempotente; conteúdo diferente tanto do original conferido quanto da correção é rejeitado, exigindo nova revisão.

Os hashes da revisão editorial anterior permanecem imutáveis. A validação aceita somente a transição explicitamente registrada para cada questão. O hash global em `revisao-editorial-resumo.json` é o retrato histórico da PR #412, anterior a estas correções; os hashes individuais e os hashes atualizados de entrada em `auditoria.json` registram esta etapa.

## Verificação

- Reconstrução reversa de cada uma das 15 correções, comparação dos hashes e equivalência entre banco e lote de importação.
- IDs, fontes e gabaritos conferidos contra o manifesto; campos não autorizados são rejeitados.
- Detector executado sobre as páginas dos oito cadernos do primeiro dia; extração completa de 2019 e 2025 com 90 questões, sem avisos, sem vazamento de redação/rascunho e com a figura legítima de 2025 preservada.
- Testes de idempotência, divergência de conteúdo e separação de páginas; auditoria com zero violações e zero divergências entre lote e banco.

A cobertura e as pendências taxonômicas permanecem as documentadas na revisão editorial. Esta etapa não altera documentos remotos do Firestore nem comprova que não existam outros problemas semânticos no corpus.
