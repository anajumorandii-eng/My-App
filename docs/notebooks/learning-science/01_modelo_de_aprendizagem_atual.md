# Modelo de aprendizagem atual do CRIVO

## FATO DO PRODUTO — unidade básica

O CRIVO representa cada tópico com `TopicMastery` em `src/types.ts`. O estado contém:

- `level`: domínio de 0 a 100;
- `uncertainty`: incerteza de 0 a 1;
- `lastReviewed`: última evidência/revisão;
- `errorSignals`: sinais recentes de erro;
- `origin`: origem do domínio (`demo`, `seed`, `diagnostic`, `observed`);
- estado de repetição espaçada: `easeFactor`, `intervalDays`, `reviewCount`.

Isso permite que o produto diferencie “não temos evidência” de “temos evidência de domínio baixo”.

## FATO DO PRODUTO — origem da evidência

`src/lib/masteryOrigin.ts` evita inferir domínio apenas pelo fato de existir uma conta. O CRIVO distingue:

- dado de demonstração;
- estado inicial sem diagnóstico;
- estimativa originada do diagnóstico;
- evidência observada em estudo/revisão.

Essa distinção é importante porque um número de domínio sem origem conhecida pode parecer mais preciso do que realmente é.

## FATO DO PRODUTO — diagnóstico

A tela `/diagnostico` combina:

- auto-relato;
- opção explícita “não sei”;
- questões objetivas;
- questões discursivas;
- recorte por capítulo quando há itens suficientes;
- fallback transparente quando o banco do capítulo é pequeno.

O diagnóstico persiste rascunho da sessão para não descartar progresso durante carregamento ou interrupção.

## FATO DO PRODUTO — ação após evidência

O Motor de Eficiência em `src/lib/efficiencyEngine.ts` usa domínio, urgência de revisão, erros recorrentes, energia e relevância da prova para ordenar ações.

Tipos de ação atuais:
- teoria;
- prática;
- análise de erro;
- revisão.

## HEURÍSTICA DE PRODUTO

O ranking atual usa pesos internos:

- lacuna de aprendizagem: 40%;
- urgência de revisão: 30%;
- sinais de erro: 30%;
- multiplicadores posteriores de energia e foco de prova.

Esses pesos são uma decisão de produto. O repositório não contém evidência científica demonstrando que 40/30/30 é a combinação ótima.

## Princípio que deve orientar pesquisa

A pergunta para qualquer mecanismo é:

**“Isso aumenta aprendizado real ou apenas ocupa tempo?”**

O notebook deve procurar evidências que ajudem a substituir pesos e regras arbitrárias por decisões melhor justificadas, sem transformar literatura científica em automatismo universal.

## Fontes no repositório

- `src/types.ts`
- `src/lib/masteryOrigin.ts`
- `src/lib/confidence.ts`
- `src/views/Diagnostico.tsx`
- `src/lib/efficiencyEngine.ts`
