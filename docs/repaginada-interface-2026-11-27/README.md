# Repaginada da interface — lote 1

A estudante pediu uma revisão do app inteiro, a partir de um exemplo: na página
de Erros, um cartão grande dizia "Nenhum erro de resumo neste filtro" e não
servia para nada.

Capturas em Chromium (Playwright), sem login, nos temas claro e escuro e no
celular (390×844): erros, flashcards, evolução, revisões, obras e questões.
Todas sem rolagem horizontal e sem erros de console.

## O que mudou

- **Fundo Caderno mais discreto.** Os cartões do mapa mental decorativo e o
  emblema central ficavam por cima de títulos e abas. Agora o mapa aparece só
  nas margens, com opacidade menor e uma máscara que limpa o centro.
- **Erros dos resumos.** Sem nenhum erro registrado, o painel não aparece. Com
  filtro vazio, mostra uma linha curta em vez de um cartão. O painel foi para
  depois da lista principal do Caderno.
- **Obras.** Sem conta, o catálogo falhava e mostrava só "0 obras". Agora o
  selo diz "catálogo indisponível" e a caixa de erro explica que é preciso
  entrar e que as obras também estão em Flashcards de Obras.
- **Tokens do tema.** Visual, Flashcards, sessão de flashcards, painel de
  progresso e de revisões dos resumos usavam cores fixas (zinc, indigo), que
  não seguiam os fundos Caderno e Papel. Agora usam `--surface`, `--line`,
  `--dim` e `--action-primary`.

## Próximos lotes

- A área vazia grande da fila de Revisões.
- Os avisos repetidos de modo demonstração.
