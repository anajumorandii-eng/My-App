# Resolução das pendências e continuação da qualidade — 05/11/2026

As dez pendências originais foram conferidas visualmente nas provas e chaves públicas, com hashes iguais aos do manifesto. O banco mantém 5.553 registros; o recorte ENEM mantém 1.440 posições, 1.430 válidas e dez anuladas. IDs, chaves, status e explicações foram preservados.

## Classificação fiel sem inventar uma grade pronta

A grade de estudo permanece com 105 tópicos e 612 capítulos. O catálogo **de questões** acrescenta cinco tópicos e nove recortes próprios, em `src/data/questionOnlyTopics.json`. Eles não criam aulas ou resumos e aparecem no treino como assuntos complementares. As estatísticas e os links de prática reconhecem seus nomes.

|Questão amarela|Matéria|Tópico / recorte correto|
|---|---|---|
|2018/52|Filosofia|Filosofia Helenística / Epicurismo e Moderação dos Desejos|
|2022/61|Filosofia|Filosofia Helenística / Estoicismo e Moderação das Paixões|
|2018/60|Filosofia|Introdução à Filosofia / Atitude Filosófica e Questionamento|
|2019/87|Filosofia|Filosofia Política Moderna / Maquiavel: Moral e Eficácia Política|
|2018/11 e 2023/43|Educação Física|Cultura Corporal e Esporte / Valores Olímpicos e Paralímpicos|
|2019/8|Educação Física|Cultura Corporal e Esporte / Esporte e Mídia|
|2019/18|Educação Física|Cultura Corporal e Esporte / Esportivização de Práticas Corporais|
|2022/18|Educação Física|Cultura Corporal e Esporte / Práticas Corporais de Aventura|
|2019/31|Educação Física|Corpo, Saúde e Imagem Corporal / Transtornos da Imagem Corporal|

A evidência por item está em `scripts/data/enem-resolucao-taxonomia-2026-11-05.json`, com posição canônica, página, URLs, hashes da prova/chave, resposta, classificação anterior e adiamento histórico. Os arquivos de 04/11 permanecem históricos; a fila ativa tem zero desses dez adiamentos. O validador distingue os dez adiamentos históricos da contagem ativa.

## Qualidade do conteúdo e das figuras

Foram corrigidas 24 questões, com 70 mudanças de campos autorizados: alternativas textuais ou fórmulas recuperadas, referências corretas a estruturas/gráficos, cinco rodapés removidos e três glifos privados da fonte Symbol corrigidos. As duas fórmulas de 2025/159, antes transcritas de forma idêntica, preservam os deslocamentos distintos `T − 5` e `T − 5/2`.

A inspeção dos pixels encontrou problemas que contagens ou hashes isolados não detectam:

- 2021/94 tinha somente a estrutura C. Quatro recortes completos restituem A, B, D e E, com as letras; C permanece intacta.
- 2021/154 tinha um gráfico cortado e alternativas sem letras. Cinco recortes completos substituem os anteriores, preservando o quadro de contexto.
- 2020/108 tinha as cinco trajetórias, mas as letras A–E haviam ficado fora do recorte. O novo recorte inclui letras, setas e trajetórias.
- 2021/155 tinha gráficos incompletos e textos extraídos de eixos usados como alternativas. Cinco recortes originais completos agora acompanham referências visuais explícitas.

São 15 novas imagens isoladas, sem páginas inteiras, com transparência, letras, dimensões, coordenadas e SHA-256 registrados no manifesto. As referências passam de 908 para 912; imagens antigas foram desassociadas, sem apagar os arquivos originais. Todas as novas imagens passaram pela checagem de marca-d'água, com OCR em português e controle positivo sintético para comprovar o detector.

As transições exatas estão em `scripts/data/enem-correcao-transcricao-2026-11-05.json`. A aplicação é idempotente, recusa conteúdo diferente tanto do original conferido quanto da correção e permite somente campos explícitos. Os hashes de revisões anteriores permanecem preservados; a validação aceita apenas as transições aprovadas.

O extrator também foi ajustado: os glifos privados verificados são normalizados somente nas fontes Symbol/ SymbolMT; rodapés institucionais completos são removidos apenas na margem inferior; caixas conferidas preservam letras e gráficos completos, com exclusões pontuais de fragmentos da coluna vizinha. A extração completa de 2020/D2 e 2021/D2 mantém 90 questões por caderno, sem alertas, e recompõe as figuras dos quatro casos acima.

## O que ainda não foi validado integralmente

A nova auditoria estrutural percorre as 1.440 posições e não encontra caracteres ilegíveis, rodapés institucionais anexados, alternativas textuais duplicadas ou referências visuais sem nenhum arquivo. Isso **não** comprova que todas as imagens restantes estejam completas: 60 questões com alternativas visuais não conferidas nesta entrega continuam em `qualidade-conteudo.json`, como fila de revisão, sem serem declaradas defeitos.

A fila de classificação mantém 78 ressalvas anteriores, distintas da fila visual. O catálogo atualizado tem 110 tópicos e 621 recortes, incluindo os complementares; oito tópicos e 257 recortes não têm questão válida neste corpus. A correção expõe lacunas antes mascaradas, em vez de criar cobertura artificial. A ampliação por outras aplicações é uma etapa posterior e deve partir dessas lacunas e das bancas escolhidas.

Não houve migração de tentativas históricas ou gravação de Firestore remoto. O progresso é preservado por ID; não se afirma que documentos editados individualmente em uma fonte remota tenham sido migrados.

## Reprodução

```bash
npm run audit:enem-review
npm run audit:enem
npm run audit:enem-content
npx tsx scripts/aplicar-reclassificacao-enem.mts
npx tsx scripts/import-enem-complete.ts
python3 scripts/test_enem_page_boundaries.py
python3 scripts/test_enem_symbol_glyphs.py
```

Reclassificação e importação devem propor zero alterações depois da integração. Relatórios de incidência, planilha e dados de prioridades foram regenerados com as classificações corrigidas e o método estatístico existente.

## Verificação da entrega

Lint e build concluídos; 1.353 testes de servidor/bibliotecas e 3.412 de interface aprovados (um teste de paginação depende da configuração específica de Chromium). Três cenários de navegador cobriram seis questões cada, em 390, 834 e 1440 px, com temas claro/escuro: filtros dos novos assuntos, carregamento e transparência das imagens, fórmulas restauradas e largura da página. As capturas finais foram inspecionadas. A extração completa dos dois cadernos de controle preservou as caixas conferidas das novas figuras.

A comparação integral antes/depois encontrou 33 registros distintos alterados: dez classificações e 24 correções de conteúdo, com uma sobreposição. IDs, ordem do banco, gabaritos, status das anuladas e explicações ficaram intactos.
