# Nota estimada na correção por IA das discursivas

## O que mudou
- **Prompt:** o pedido `discursive-feedback` agora pede nota item por item, cada uma com o motivo, e termina com as linhas "**Nota estimada: X**" e "**Avaliação: …**".
- **Escala:**
  - Famerp: de 0 a 4 por questão, conferida no edital, em meios pontos.
  - Outras bancas: percentual dos pontos esperados, porque a escala oficial não está confirmada e inventá-la seria pior.
- **Tela:** o Treino destaca no topo do retorno a linha "Nota estimada pela IA: X (estimativa, não a nota oficial)".
- **Leitura da nota:** `parseAiScore` só aceita "X de 4" com X entre 0 e 4, ou um percentual de 0 a 100. Qualquer outra forma não vira destaque: saída de modelo é dado suspeito.

## Verificação
- `server/ai/prompts.test.ts`: escala de 0 a 4 na Famerp, percentual nas outras, nota por item e linha final.
- `src/lib/discursiveGrading.test.ts`: leitura da nota nas formas válidas e recusa de 7 de 4 e de 150%.
- `src/views/Treino2aFase.workspace.test.tsx`: com a resposta da IA simulada, a tela mostra "Nota estimada pela IA: 3 de 4".

## Por que não há captura
A correção por IA exige uma conta Firebase com sessão ativa. Sem ela, o cliente
para antes de chamar o servidor (`AUTH_REQUIRED`), e o ambiente de captura não
tem credencial. A mudança visual é uma linha de texto dentro do painel de
retorno que já existia, com os mesmos tokens de cor (`--text`, `--dim`). Ela
foi verificada pelo teste de tela acima, não por imagem.
