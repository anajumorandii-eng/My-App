# Implementação integral do Visual — contrato de cobertura

## Escopo

O requisito atual abrange **todos os capítulos e todas as matérias**. Nenhum capítulo pode desaparecer visualmente só porque ainda não recebeu uma prancha autoral específica.

Isso não autoriza declarar uma peça genérica como se fosse ilustração autoral. O sistema precisa distinguir honestamente o tipo de cobertura que cada capítulo recebeu.

## Hierarquia de cobertura

`visualCoverageFor()` classifica cada capítulo em exatamente uma categoria principal:

1. `illustrated-board` — prancha ilustrada específica;
2. `interactive-experiment` — mecanismo interativo ligado por ID exato;
3. `anchor-scene` — cena conceitual com lastro explícito no capítulo;
4. `instrument` — instrumento legítimo para a estrutura daquele conteúdo;
5. `fallback` — piso visual obrigatório baseado apenas na estrutura editorial real do capítulo.

O fallback não conta como prancha autoral. Ele existe para remover o estado visual vazio enquanto preserva a honestidade da cobertura.

## Piso obrigatório para 100% do catálogo

Todo capítulo sem visual dedicado recebe `TopicFallbackVisual`, que deve:

- manter identidade visual própria da matéria;
- exibir matéria, tópico e título reais;
- usar apenas títulos e estágios das seções reais do capítulo;
- permitir navegar pelas etapas pelo próprio visual;
- responder a mobile, teclado e movimento reduzido;
- nunca inventar gráfico, fórmula, mapa, mecanismo, cronologia ou relação científica para preencher espaço.

## Linguagem por matéria

A matéria define o universo visual. A implementação-base diferencia paleta, atmosfera e vocabulário de composição para Física, Química, Biologia, Matemática, História, Geografia, Literatura, Redação, Gramática, Entendimento de Texto, Língua Inglesa, Filosofia, Sociologia e Atualidades.

As cenas-âncora existentes também recebem identidade da matéria, em vez de usar a mesma marca d'água abstrata para todas.

## Auditoria

`scripts/auditVisualJourney.ts` deixa de reduzir tudo a um único campo `anchorScene`. O relatório mantém os campos legados para compatibilidade, mas passa a registrar `visualCoverage`, `dedicatedVisuals`, `fallbacks` e a distribuição por `visualKinds`.

A métrica correta é: **cobertura-base = 100% dos capítulos; cobertura dedicada = apenas os capítulos cuja categoria não é `fallback`.**

## Critério de pronto por capítulo

Um capítulo nunca fica sem experiência visual. Entretanto, somente deve ser anunciado como visual dedicado quando tiver board, experimento, cena ou instrumento validado para ele. O fallback é uma condição transitória e explícita para capítulos ainda sem artefato específico.

## Próxima profundidade

A cobertura integral não encerra a evolução artística. Os capítulos em `fallback` devem ser aprofundados por prioridade pedagógica, substituindo o piso editorial por pranchas, mecanismos ou instrumentos específicos quando houver representação conceitualmente defensável e testável.
