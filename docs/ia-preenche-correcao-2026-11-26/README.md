# Correção por IA preenche a correção guiada

**Pedido da estudante:** que a marcação critério por critério (Completo, Parcial, Faltou e onde perdeu o ponto) fosse feita pela correção, e não por ela.

## O que mudou

**Pedido à IA**
- Nas discursivas com a lista do corretor, o pedido `discursive-feedback` leva os critérios numerados ("a1: …", "b2: …").
- O prompt pede, depois da nota, um bloco JSON com o veredito e o "onde" de cada critério, nos tipos do Caderno de Erros.

**Leitura da resposta**
- `parseCriteriaVerdicts` lê esse bloco sem nunca lançar erro.
- Descarta id desconhecido, veredito fora da lista e "onde" inválido.
- `stripCriteriaBlock` tira o bloco do texto exibido, inclusive enquanto o fluxo ainda chega.

**Tela**
- A correção guiada abre já marcada, com o aviso "A correção por IA marcou N de M critérios… Confira cada um no que você escreveu e ajuste o que discordar antes de salvar".
- A estudante confere e salva. A IA sugere, mas quem confirma é ela, pela regra do Caderno de Erros de que hipótese da IA não é fato.

**Acessibilidade**
- O seletor "Onde perdeu o ponto?" ganhou `aria-label` próprio. Antes, a explicação mostrada abaixo dele entrava no nome acessível.

## Verificação
- `server/ai/prompts.test.ts`: critérios numerados e pedido do bloco JSON, que não aparece quando não há critérios.
- `src/lib/discursiveGrading.test.ts`: leitura válida, descarte do inválido, bloco quebrado e remoção do bloco durante o streaming.
- `src/views/Treino2aFase.workspace.test.tsx`, com a resposta da IA simulada:
  - o payload leva os critérios;
  - o JSON não aparece no texto;
  - a correção abre marcada, com "Conta ou unidade" no critério que faltou;
  - a tentativa é salva com a marcação.

## Por que não há captura
A correção por IA exige sessão Firebase, que o ambiente de captura não tem. O
cliente para antes de chamar o servidor (`AUTH_REQUIRED`). O componente da
correção guiada é o mesmo das capturas em
`docs/correcao-guiada-discursivas-2026-11-26/`; a mudança visual é um aviso de
uma linha acima dos critérios, com os tokens já usados ali.
