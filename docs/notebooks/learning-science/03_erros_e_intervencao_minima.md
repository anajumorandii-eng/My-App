# Erros e intervenção mínima eficaz

## FATO DO PRODUTO — taxonomia de erro

O parser em `src/lib/errorDiagnosis.ts` aceita:

- conceptual;
- concept_confusion;
- interpretation;
- data_selection;
- strategy;
- calculation;
- prerequisite;
- insufficient_justification;
- time;
- attention.

O Caderno de Erros também preserva `unknown` quando a estudante não sabe por que errou. A IA não pode transformar incerteza em “fato confirmado”.

## FATO DO PRODUTO — confiança do diagnóstico

Diagnóstico gerado por IA só pode sair como confiança baixa ou média. Confiança alta/confirmada depende de validação humana.

Saída de modelo é tratada como dado suspeito:
- JSON é validado;
- tipos inválidos são rebaixados;
- confiança inflada é reduzida;
- fallback sempre existe.

## FATO DO PRODUTO — catálogo de intervenções

O código reconhece intervenções como:

- recuperação ativa;
- questão guiada;
- comparação de conceitos;
- microbloco de pré-requisito;
- questão de aplicação;
- revisão curta;
- aula completa.

A presença de “aula completa” como uma opção entre várias permite implementar a lógica de **intervenção mínima eficaz**: não usar a intervenção mais cara quando uma menor pode resolver a lacuna.

## FATO DO PRODUTO — relato do estudante

O fluxo de erro pergunta “o que aconteceu no raciocínio?”. A lógica atual considera o relato do estudante evidência importante para separar causas que podem produzir a mesma alternativa errada.

## HIPÓTESE PEDAGÓGICA CENTRAL

Uma resposta errada é sintoma, não diagnóstico.

O notebook deve investigar evidência para:
- error classification;
- feedback explicativo;
- worked examples;
- fading/scaffolding;
- comparação de conceitos;
- correção de misconceptions;
- prática guiada;
- pré-requisitos;
- transferência após correção.

## QUESTÕES DE PESQUISA

- Quais categorias de erro são pedagogicamente acionáveis?
- Quando análise detalhada do erro supera simplesmente tentar outra questão?
- Qual intervenção é suficiente para cada tipo de erro?
- Quando uma lacuna de pré-requisito deve bloquear conteúdo posterior?
- Como distinguir erro de atenção de falta de domínio sem depender apenas de autorrelato?
- Como confirmar que a intervenção resolveu o erro em vez de apenas melhorar a questão imediatamente seguinte?

## Fontes no repositório

- `src/lib/errorDiagnosis.ts`
- `src/views/Erros.tsx`
- `src/views/Questoes.tsx`
- `CLAUDE.md`
