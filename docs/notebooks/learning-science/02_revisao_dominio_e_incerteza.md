# Revisão, domínio e incerteza

## FATO DO PRODUTO — repetição espaçada

`src/lib/spacedRepetition.ts` implementa um agendamento no estilo SM-2.

Estado padrão:
- fator de facilidade inicial: 2,5;
- primeiro intervalo: 1 dia;
- segundo intervalo: 6 dias;
- fator mínimo: 1,3.

A qualidade da lembrança é representada em escala 0–5. Resultado abaixo de 3 reinicia a sequência; resultado 3+ aumenta o intervalo.

## FATO DO PRODUTO — diferentes evidências têm pesos diferentes

Mapeamentos atuais:

- resposta objetiva correta → qualidade 4;
- resposta objetiva errada → qualidade 1;
- verificação “não consegui” → 2;
- “com ajuda” → 3;
- consegui sozinho → 4;
- autoavaliação discursiva fraco/mediano/forte → 2/3/5.

Autoavaliação discursiva positiva tem ganho de domínio limitado a no máximo +2 pontos por tentativa, porque o código a trata como evidência mais fraca que uma resposta objetivamente corrigida.

## FATO DO PRODUTO — atualização de domínio

A cada resultado, o sistema ajusta:
- `level`;
- `uncertainty`;
- `errorSignals`;
- `lastReviewed`;
- intervalo;
- fator de facilidade;
- contagem de revisões.

No estado atual:
- qualidade 4–5 aumenta domínio em +5;
- qualidade 3 aumenta +1;
- qualidade abaixo de 3 reduz -4.

Esses deltas são **heurísticas do produto**, não equivalentes a uma medida psicométrica validada.

## FATO DO PRODUTO — urgência de revisão

`src/lib/reviewUrgency.ts` converte atraso e erros recentes em urgência 0–100.

- no dia previsto: base 60;
- cada dia altera a base em 6 pontos;
- erro recente adiciona 8 pontos por sinal, até 40;
- revisão é considerada pendente quando a urgência passa de 50.

## FATO DO PRODUTO — confiança

`src/lib/confidence.ts` converte incerteza em:
- alta;
- moderada;
- baixa;
- dados insuficientes.

O estado inicial muito incerto deve aparecer como “dados insuficientes”, não como falsa confiança baixa.

## HIPÓTESES A VALIDAR

1. O SM-2 é adequado como ponto de partida para tópicos amplos, não apenas itens/cartões?
2. Resposta correta deve sempre equivaler à mesma qualidade, independentemente de tempo, pistas ou dificuldade?
3. O mesmo esquema de atualização serve para Matemática, Biologia, Literatura e Redação?
4. Erros recentes devem antecipar revisão no mesmo grau para todos os tipos de erro?
5. Autoavaliação deve alterar domínio diretamente ou apenas informar confiança/metacognição?
6. Qual evidência é suficiente para declarar domínio estável e evitar revisão desnecessária?

## Fontes no repositório

- `src/lib/spacedRepetition.ts`
- `src/lib/reviewUrgency.ts`
- `src/lib/confidence.ts`
- `src/types.ts`
