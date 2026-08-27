# Corpus Completo de Resumos Interativos — desenho

## Objetivo

Transformar toda a grade curricular fornecida pela usuária em resumos interativos completos para as 11 matérias: Biologia, Física, Geografia, História, Língua Inglesa, Redação, Gramática, Literatura, Entendimento de Texto, Matemática e Química.

O resultado deve manter uma experiência única de estudo no catálogo atual: leitura em três níveis, recuperação ativa, progresso persistido, revisão espaçada, Caderno de Erros e painel de evolução.

## Princípios de publicação

- Cada tópico curricular corresponde a exatamente um `InteractiveSummary`.
- Um tópico só entra no catálogo quando tiver conteúdo completo e fonte interna resolvível.
- Não haverá entradas vazias, placeholders ou rótulos “em preparação”.
- IDs publicados são permanentes. O resumo existente de Eutrofização mantém `bio-ecologia-eutrofizacao` e seus IDs internos compatíveis.
- Conteúdo incerto, reconstruído ou apoiado em fonte incompleta recebe aviso explícito.
- Afirmações sobre incidência, banca ou fase só aparecem quando sustentadas pelos materiais internos estruturados.

## Decomposição

O corpus será entregue em 11 lotes, na ordem da grade enviada:

1. Biologia
2. Física
3. Geografia
4. História
5. Língua Inglesa
6. Redação
7. Gramática
8. Literatura
9. Entendimento de Texto
10. Matemática
11. Química

Cada matéria tem especificação e plano próprios, mas todos consomem os contratos desta especificação-mãe. Dentro de uma matéria, arquivos são divididos por frente quando isso reduz o tamanho e mantém fronteiras curriculares claras. O lote aprovado de Ecologia é a primeira entrega de Biologia e permanece válido.

## Fontes e extração

As apostilas em `materiais brutos/` são as fontes conceituais primárias. O pipeline existente de OCR e separação de capítulos será executado uma vez por matéria. Saídas completas de OCR permanecem em `/tmp` e não são versionadas.

O repositório conserva somente:

- o inventário tipado de cada material;
- arquivo, capítulo e intervalo de páginas observados;
- o conteúdo autoral dos resumos;
- testes de integridade do catálogo.

Questões discursivas, estratégias de resolução, roteiros e demais dados internos podem complementar a aplicação em prova quando o tópico é inequivocamente correspondente. Quando um capítulo falhar na extração automática, a execução procura o título e páginas contíguas manualmente nos quatro volumes da matéria. Um tópico só é declarado bloqueado depois de esgotar as apostilas e os materiais estruturados internos correspondentes.

## Contrato pedagógico comum

Todo resumo contém:

- título e tópico idênticos à grade, salvo normalização ortográfica necessária;
- visão geral e pré-requisitos;
- nível `rapida`, com intuição, mapa causal ou distinções centrais;
- nível `aprofundamento`, com conceitos, mecanismos, relações e aplicações;
- nível `prova`, com exercício ou situação de transferência e estratégia de resposta;
- ao menos uma pergunta de recuperação ativa vinculada a uma seção;
- elementos esperados verificáveis, dica e pergunta de transferência;
- uma ou mais fontes resolvíveis.

Os resumos privilegiam explicação causal, comparação, modelagem, interpretação e aplicação. Perguntas não se limitam a repetir definições quando o tópico permite raciocínio de ordem superior.

## Adaptações por área

- Ciências da Natureza e Matemática incluem mecanismos, representações, relações quantitativas e análise de erro quando pertinentes.
- Humanidades incluem temporalidade, espacialidade, agentes, processos, evidências e disputa interpretativa, separando fato de interpretação.
- Inglês e Entendimento de Texto trabalham estratégias de leitura sobre gêneros e fenômenos linguísticos, sem reproduzir textos protegidos extensos.
- Gramática usa exemplos autorais curtos e análise contextual, não listas isoladas de regras.
- Literatura distingue contexto, forma, procedimentos estéticos, obras/autores e leitura comparativa; trechos protegidos permanecem breves e apenas quando necessários.
- Redação converte cada tópico em orientação acionável, exemplo autoral, diagnóstico de erro e exercício de aplicação.

## Arquitetura de dados

Cada matéria exporta arrays tipados de módulos focados, agregados por um arquivo de índice da matéria. `interactiveSummaries.ts` concatena os onze catálogos sem conhecer detalhes das frentes.

`SummaryMaterial` e `SummarySource` recebem metadados opcionais de capítulo e páginas para apostilas. O validador do catálogo passa a verificar:

- IDs únicos de resumo, seção e pergunta;
- pergunta vinculada a seção existente;
- fonte interna presente no inventário;
- localização válida para fonte de apostila;
- presença dos níveis `rapida`, `aprofundamento` e `prova`;
- uma pergunta de recuperação ativa e uma fonte por resumo;
- cobertura exata da grade publicada em cada lote.

Os contratos de progresso não mudam. IDs anteriores continuam resolvendo links e históricos persistidos.

## Interface

A tela atual de Resumos permanece o ponto único de acesso. Filtros por matéria, texto, banca, fase e domínio continuam funcionando. O aumento do catálogo pode exigir agrupamento ou paginação apenas se medições demonstrarem problema de desempenho ou navegação; isso não será antecipado sem evidência.

Testes acessíveis cobrem busca, filtro, abertura, troca dos três modos, recuperação ativa e links profundos. Nenhuma matéria ganha uma interface paralela.

## Estratégia de entrega e verificação

Cada matéria segue TDD e termina em um estado utilizável e verificável. Dentro dela:

1. extrair e curar proveniência;
2. escrever contrato de cobertura que falha;
3. produzir resumos por frente;
4. validar catálogo e interface;
5. executar testes, TypeScript e build;
6. versionar a entrega antes da matéria seguinte.

Ao final do corpus, uma auditoria global compara a lista literal fornecida pela usuária com o catálogo, detectando ausências, duplicatas e tópicos adicionais. A conclusão só pode ser declarada quando a auditoria global, os testes, o TypeScript e o build terminarem com sucesso ou quando um bloqueio factual de fonte tiver sido explicitamente aceito pela usuária.

## Falhas e retomada

Artefatos temporários de OCR podem ser regenerados. O inventário e os módulos por matéria permitem retomar sem reescrever lotes concluídos. Uma falha em um tópico não corrompe nem remove resumos publicados; a execução registra a evidência da falha, tenta outras fontes internas e segue trabalhando em tópicos independentes antes de avaliar se existe bloqueio real.

## Fora de escopo

- geração de conteúdo por IA durante o uso do aplicativo;
- editor administrativo para autoria de resumos;
- cópia integral das apostilas ou de obras protegidas;
- reformulação visual ampla da tela de Resumos;
- alteração destrutiva do histórico de progresso;
- tópicos que não constam na grade fornecida pela usuária.
