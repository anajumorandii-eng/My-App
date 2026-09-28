# Demais telas do menu (28/09/2026)

Continua o doc 50. Com Hoje, Plano, Estudar, Questões e Resumos revisados, a
Ana Júlia autorizou seguir para o resto do menu ("Pode continuar").

## Como foi feito

Em vez de abrir tela por tela no escuro, primeiro uma varredura no navegador das
20 rotas restantes, no iPad e no celular. Para cada uma:

- breadcrumb e selo do topo;
- palavras em inglês no texto;
- altura da página;
- rolagem lateral;
- erros de página.

Nenhuma rota teve rolagem lateral nem erro de página. O que apareceu foi o
mesmo conjunto de defeitos das primeiras telas, repetido.

## O que se repetia

### Paleta fixa no contêiner (19 telas)

Dezenove telas pintavam o próprio contêiner com a paleta de uma matéria
escolhida no código, e a variável vencia a cor do ambiente:

- **Caderno de Erros** em História;
- **Perfil** em Matemática;
- **Conexões** em Filosofia;
- **Laboratório** em Química;
- **Podcast** em História;
- **Redação** em Português;
- as demais em Matemática.

Agora a cor vem do ambiente em todas.

- **Telas com uma matéria em foco de verdade** registram o ambiente dela, como
  o Hoje e a Sessão: Diagnóstico, Prioridades, Revisões (pelo filtro), Treino
  de 2ª fase (pela questão aberta) e Tutor.
- **Onde a paleta sobrava em abas e selos ativos,** o fundo sólido com texto
  escuro virou tom do acento com o texto do tema. O fundo sólido falhava em
  contraste no claro, o mesmo defeito do selo da Fuvest nos Resumos.

### Inglês e nomes internos

| Tela | Antes | Agora |
| --- | --- | --- |
| Revisões, Flashcards, Treino de 2ª fase | "PRACTICE" | "Estudar" |
| Obras, Obras obrigatórias, Obra, Podcast, Tutor | "LIBRARY" | "Biblioteca" |
| Diagnóstico | "105 tópicos monitorados · Crivo Diagnostic" | "105 tópicos no diagnóstico" |
| Caderno de Erros | "1 erros mapeados · Crivo Cognitivo" | "1 erro registrado" (com plural certo) |
| Evolução | "domínio geral: 33% · Crivo Telemetria" | "domínio geral: 33%" |
| Podcast | "87 episódios · Crivo Audio" | "87 episódios" |
| Reta final | "335h líquidas estimadas · Crivo Roteiro" | "335h líquidas estimadas" |
| Treino de 2ª fase | "49 questões disponíveis · Crivo Discursivo" | "49 questões disponíveis" |
| Tutor | "Crivo Socrático · Biologia" | "Biologia · <tópico escolhido>" |
| Redação | "ateliê de escrita · Crivo Redação" | "critérios de N bancas" |
| Obras | "perfil type · catálogo ativo" | "N obras no catálogo" |
| Flashcards | "baralhos integrados · Crivo" | Removido: não havia dado nenhum por trás. |
| Estratégias | "heurísticas ativas · Crivo Tático" | Removido, pelo mesmo motivo. |

### Índigo herdado (cerca de 95 usos em 10 arquivos)

`indigo-*` era o acento do tema antigo: botão principal, link, item escolhido,
em Flashcards, nos painéis de evolução, na Agenda, nas telas de admin e no
formulário do Visual.

Nenhum uso distingue um estado de outro (conferido), então a escala inteira
virou tons do acento do ambiente. No Tailwind 4 as classes leem
`--color-indigo-*`, e trocar a escala uma vez cobre todos os usos. Os tons
escuros param em 62% do acento, como o botão principal, para o texto branco
continuar legível.

Contraste medido no navegador depois da troca:

| Onde | Claro | Escuro |
| --- | --- | --- |
| Botões "Ir para os resumos", "Salvar semana" | 5,1:1 | 5,1:1 |
| "Adicionar janela" (Agenda) | 6,6:1 | 2,7:1 → corrigido |
| "Medicina · prioridade Fuvest" (Evolução) | 4,5:1 | 3,9:1 → corrigido |

- Três painéis de resumo e a Agenda usavam `text-indigo-600` sem variante
  escura; ganharam `dark:text-indigo-300`.
- "Remover janela", em `red-700` no escuro, ganhou `dark:text-red-400`.

## Defeitos próprios de cada tela

- **Revisões: página de 24.033 px.**
  - A fila de 105 cartões abria inteira. Ela já vem ordenada por urgência; agora
    mostra 10 por vez, e a página inicial tem 2.921 px.
  - A aba "Todas" caía no azul de Matemática, o mesmo defeito que as Questões
    tinham; o Treino de 2ª fase também. As duas passam ao estado ativo do design
    system.
  - A barra ao lado de "Domínio: 20%" mostrava um "100%" sem dizer o que media:
    é a urgência da revisão, e agora está escrito. As cores da barra viraram os
    tokens de status.
- **Podcast: 8.145 px.** Os 87 episódios abriam de uma vez; agora 12 por vez, na
  ordem que a faixa de duração escolhida já definia. A página inicial tem
  1.674 px.
- **Obras.** Com o catálogo vazio, a tela dizia "Nenhuma obra encontrada com
  esse filtro", mandando mexer num filtro que não tinha culpa. Agora separa
  catálogo vazio de filtro sem resultado.
- **Biblioteca do Visual.** No claro, o nome da matéria saía na cor viva sobre
  o cartão creme: 1,8:1 a 2,1:1. Com o tom escurecido, 6,2:1 a 6,9:1.

## O que não é do app

A Agenda mostra "02:40 PM" nos campos de horário porque o navegador de teste
roda em inglês. O campo de horário segue o idioma do aparelho; num iPad em
português ele mostra 14:40.

## Conferência

- As telas alteradas no iPad e no celular, claro e escuro, com as fontes reais.
  Os mosaicos estão em `screenshots/revisao-telas-2026-09-28/demais-telas/`.
- **Testes:** `Revisoes.ui.test.tsx` é novo e cobre a fila em lotes (10, depois
  12).
- `npm run lint` limpo; `npm test` verde (719 node:test e 754 vitest);
  `npm run build` sem erro.
