# Caderno de Erros: abrir o erro e agir sobre ele

A estudante apontou que o Caderno não deixava fazer nada: os cartões não
abriam, não levavam à questão e não tinham ação.

Capturas em Chromium (Playwright), sem login, com um erro de demonstração
aberto (dados de `mockData`, já presentes no repositório):

| Captura | Tema | Viewport | Rolagem horizontal | Erros de console |
| --- | --- | --- | --- | --- |
| `erro-aberto-ipad.png` | claro | 834×1112 | 0 | 0 |
| `erro-aberto-desktop.png` | escuro | 1366×900 | 0 | 0 |
| `erro-aberto-celular.png` | claro | 390×844 | 0 | 0 |

## O que o cartão faz agora

- **Abrir erro / Fechar:** o cabeçalho do cartão é um botão (`aria-expanded`), e o link de revisita (`/erros?registro=…`) já abre o erro direto.
- **A questão:** nas discursivas, mostra o enunciado e o item em que ela perdeu ponto.
- **O que a banca esperava:** o critério perdido e a resposta esperada do item.
- **O que você escreveu:** a resposta dela. Os erros da correção guiada passam a guardá-la em `evidence`.
- **Diagnóstico:**
  - "Foi isso mesmo" confirma.
  - "Foi outro tipo" deixa trocar o tipo.
  - "Não sei o motivo" volta para `unknown`, com confiança baixa.
  - O campo de relato guarda o que ela pensou na hora.
  - "Explicar este erro com IA" gera a explicação a qualquer momento.
- **O que fazer agora:**
  - "Refazer esta questão" abre a questão no Treino (`?questao=`); nas objetivas, vira "Treinar questões deste tópico".
  - "Marcar como superado" tira o erro dos ativos sem apagá-lo, e dá para voltar.
- **Ativos e Superados:** abas acima da lista.
- **Rótulo de confiança:** "diagnóstico ainda não confirmado" substitui "hipótese da IA, não confirmada", porque esses erros são diagnóstico dela, não da IA.

## Correção feita pela captura

Os botões do detalhe saíam como texto solto, porque a classe `ni-button` não tem estilo nesta tela. Eles passaram a usar o estilo de botão das outras telas.
