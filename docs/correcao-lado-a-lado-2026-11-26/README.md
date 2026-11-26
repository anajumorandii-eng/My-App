# Correção por IA: "Como você fez" ao lado de "Como deveria ter feito"

Pedido da estudante: comparar lado a lado a resposta dela com a resposta nota
máxima.

## O que mudou
- `splitIdealAnswer` (`src/lib/discursiveGrading.ts`) separa a seção
  "## Resposta nota máxima" do restante da correção. A seção vai até o próximo
  título ou até a linha da nota.
- No Treino, abaixo da correção, aparecem duas colunas: **Como você fez**, com
  o texto dela, e **Como deveria ter feito**, com a resposta nota máxima, em
  verde.
- Em telas de 768px ou mais as colunas ficam lado a lado (`md:grid-cols-2`);
  no celular, empilham. Cada coluna tem `min-w-0` para não estourar a largura.
- A seção sai do texto corrido da correção, para não aparecer duas vezes.

## Verificação
- `discursiveGrading.test.ts`: separação com título seguinte, com a seção no
  fim (até a nota) e sem a seção.
- Teste de tela do Treino, com a IA simulada: a comparação mostra a resposta
  dela e a ideal, e o título não se repete no texto.

## Por que não há captura
A correção por IA exige sessão Firebase, que o ambiente de captura não tem; o
cliente para antes do servidor (`AUTH_REQUIRED`). As duas colunas usam os
tokens já usados nos painéis vizinhos (`--line`, `--status-success`, `--text`).
