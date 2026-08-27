# Resumos Interativos de Ecologia — desenho

## Objetivo

Produzir o primeiro lote da grade curricular fornecida pela usuária: os 11 tópicos de Ecologia do 1º semestre de Biologia. A entrega deve ampliar o catálogo existente com conteúdo estudável, rastreável e compatível com leitura, recuperação ativa, revisão espaçada, Caderno de Erros e painel de evolução.

## Escopo do lote

O lote contém exatamente:

1. Introdução à Ecologia
2. Dinâmica de populações
3. Espécies invasoras e controle biológico
4. Sucessão ecológica
5. Ciclos biogeoquímicos: ciclo do carbono
6. Ciclo do nitrogênio
7. Ciclo hidrológico e poluição da água
8. Eutrofização
9. Poluição do ar
10. Biomagnificação
11. Poluição: aquecimento global, POPs e biorremediação

O resumo `bio-ecologia-eutrofizacao` já publicado permanece com o mesmo ID. Ele será auditado contra as mesmas fontes do lote e ajustado apenas quando houver correção factual ou melhoria necessária para manter o padrão pedagógico. Os outros dez tópicos recebem IDs permanentes e inéditos.

## Fontes e rastreabilidade

A fonte conceitual primária são os quatro PDFs internos `materiais brutos/Biologia (v1) 1.pdf` a `materiais brutos/Biologia (v1) 4.pdf`. A implementação primeiro localizará as páginas ou capítulos correspondentes a cada tópico. Materiais estruturados já existentes em `src/data`, como questões discursivas e estratégias de banca, poderão complementar a aplicação em prova quando houver correspondência inequívoca.

Cada resumo declarará ao menos uma fonte resolvível no inventário `summaryMaterials`. O inventário registrará o arquivo e, quando a extração permitir, a faixa de páginas ou identificação do capítulo. Conteúdo não sustentado pelas fontes internas não será apresentado como fato. Questões reconstruídas ou fontes incompletas conservarão aviso explícito de incerteza.

## Estrutura pedagógica

Cada tópico será uma unidade independente do tipo `InteractiveSummary`, com:

- visão geral e pré-requisitos;
- uma seção rápida de intuição ou mapa mental;
- seções de aprofundamento que expliquem conceitos e mecanismos;
- aplicação contextual ou experimental;
- seção de estratégia de prova, sem atribuir incidência a uma banca quando a fonte não sustentar essa atribuição;
- ao menos uma pergunta de recuperação ativa ligada a uma seção, com elementos esperados, dica e pergunta de transferência.

O texto deve privilegiar relações causais, comparação de conceitos e interpretação de situações. Listas de definições desconectadas não satisfazem o padrão. Tópicos amplos podem ter mais seções, mas continuam usando os três níveis atuais: `rapida`, `aprofundamento` e `prova`.

## Arquitetura e integração

O conteúdo do lote ficará em um módulo próprio de dados para evitar ampliar excessivamente `interactiveSummaries.ts` ou `expandedInteractiveSummaries.ts`. O catálogo principal apenas importa e concatena o novo lote. Não haverá novo mecanismo de progresso nem alteração dos IDs já persistidos.

O contrato de fontes será estendido somente com metadados opcionais necessários à rastreabilidade de PDFs, preservando compatibilidade com materiais existentes. O validador continuará rejeitando IDs duplicados, seções duplicadas, perguntas sem seção e fontes internas desconhecidas.

## Sequência de produção

`Introdução à Ecologia` será implementado primeiro como resumo de referência. Após validar estrutura, renderização e testes, o mesmo contrato será aplicado aos outros nove resumos inéditos e à auditoria de Eutrofização. Essa validação inicial não cria uma segunda aprovação de produto: ela é um checkpoint técnico dentro do lote aprovado.

## Falhas e estados incompletos

Um tópico só entra no catálogo quando tiver conteúdo e fonte resolvível. Extração ausente, capítulo não localizado ou conflito entre materiais mantém o tópico fora do catálogo e gera uma pendência explícita no relatório de implementação; não será criada entrada vazia ou “em preparação”. Falha em um tópico não deve bloquear a preservação dos resumos válidos já publicados.

## Testes e validação

O trabalho seguirá TDD. Testes de catálogo observarão que:

- os dez novos IDs são únicos e o ID de Eutrofização é preservado;
- todos os 11 tópicos aparecem uma única vez no conjunto final;
- cada pergunta aponta para uma seção existente;
- cada fonte interna resolve no inventário;
- os três níveis pedagógicos estão representados em cada resumo;
- nenhuma entrada vazia ou provisória é publicada.

Testes de interface verificarão que um resumo novo pode ser localizado por disciplina e texto, aberto e navegado nos três modos sem quebrar os fluxos existentes. Ao final serão executados os testes direcionados, a suíte completa de testes, a checagem TypeScript e o build.

## Fora de escopo

Este lote não produz Ecologia do 2º semestre, outras frentes de Biologia ou as demais disciplinas. Também não adiciona geração automática por IA em tempo de uso, editor administrativo de resumos ou placeholders para toda a grade. Esses itens poderão ser tratados em lotes posteriores depois que o padrão de Ecologia estiver validado.
