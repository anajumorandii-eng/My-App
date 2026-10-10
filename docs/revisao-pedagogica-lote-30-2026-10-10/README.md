# Revisão pedagógica: lote de 30 capítulos

A rodada examina as cinco seções e a recuperação de 30 capítulos novos de História, com inspeção das cenas ativas e consulta seletiva a fontes. Corrige também quatro capítulos já examinados em Brasil Colônia: Montagem, Crise, Interiorização e a legenda de Palmares em Dinâmica Interna.

São 34 capítulos com correções, 32 objetos de conteúdo aprofundado alterados em relação à main após #297 e 25 recuperações reformuladas ou adicionadas. As demais 580 entradas permanecem idênticas à main atual; os três capítulos já corrigidos em #297 são preservados. IDs de capítulo/material preservados; a revisão editorial sobe uma unidade somente nos 32 objetos alterados, solicitando nova leitura.

## Achados e comportamento corrigido

- Império: atribuições do Poder Moderador, sucessão portuguesa, Sexagenários (60 anos e serviços até 65), Questão Religiosa, maioridade/coroação e cronologia cafeeira.
- República e Vargas: Deodoro em vinte dias, Primeira República desde 1889, alianças sem alternância automática, voto de 1932, financiamento da CSN, Plano Cohen, instrumentos repressivos, legalização do PCB e Plano de Metas/Brasília.
- Regime Militar e América: hipóteses do habeas corpus, anistia e interpretações, vigência da revogação do AI-5, posse de Sarney, Texas, Cuba e etapas do Plano Real.
- História mundial: Viena/Waterloo, Bernstein/SPD, Berlim, alianças e neutralidade italiana, cronologia fascista, Wannsee, Bandung/Belgrado, Varsóvia e rendição japonesa.
- Brasil Colônia: coexistência de formas de coerção, tráfico e aldeamentos; transferência da capital com múltiplos fatores; propostas anteriores de transferência da Corte; marcos de Palmares.
- Perguntas de recuperação passam a cobrar conteúdo ensinado; novas recuperações em Estado Novo, Revolução Francesa e Revolução Industrial. Citações e legendas acompanham as correções.

## Cobertura e pendências

A primeira passagem pedagógica cumulativa chega a **39/613**, restando **574**. Os nove capítulos do primeiro lote e os 30 desta rodada continuam com pendências documentais e/ou de estados interativos; não são 39 aprovações. O inventário formal permanece em **81 em validação, 532 não revisados e zero aprovados**.

O [registro por capítulo](revisao.json) discrimina escopo, fontes, acesso aberto/indexado e pendências. Fontes externas não foram todas lidas integralmente. O avaliador usa palavras-chave e não certifica precisão semântica de negações ou cronologia.

Awesome Design MD (referências Claude e Miro) orienta clareza, relações explícitas, controles e preservação da identidade do Crivo. Em Montagem, são preservados os fatores contextualizados e a coexistência regional já integrados em #297; em Brasil Atual, selecionar fatores destaca fontes, sem declarar uma explicação incompleta pela ausência de uma seleção.

## Verificação

O CI executa os testes Node e Vitest, o arquivo de continuidade editorial, lint, build e E2E usuais. Nesta rodada o teste de continuidade cobre 30 respostas-modelo, regressões cronológicas e lastro das cenas. O fluxo também verifica **17 capítulos com ilustrações alteradas em 204 combinações** (390/834/1366 px, claro/escuro, movimento reduzido/normal), incluindo os recortes e controles previstos no roteiro HG. Os checks do commit final da PR são a evidência de execução; não se reivindica nova inspeção visual manual nem nova matriz integral de 7.356 casos.
