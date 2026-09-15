# Cenas-âncora de Humanidades e Linguagens — desenho

Data: 15/09/2026 · Base: `cc73342` · Aprovado pela usuária em 15/09/2026.

## Problema

Sete matérias não têm nenhuma cena-âncora: Geografia (63 capítulos), Redação
(58), História (49), Literatura (37), Filosofia (35), Sociologia (27) e
Gramática (26). São 295 capítulos em zero. O catálogo inteiro tem 613 capítulos
e 61 cenas, concentradas em Matemática (33), Física (13), Biologia (8) e
Química (7).

A tentativa anterior de fechar essa lacuna, `8d62f5b`, falhou e foi removida em
`cc73342`. O modo da falha está registrado em `06-correcao-personalizacao.md`:
desenhos genéricos rotulados com fragmentos dos títulos dos capítulos, curvas
sem significado quantitativo, fórmulas associadas ao tópico errado, animações
que ignoravam movimento reduzido, e um auditor que devolvia `topicVisual: true`
para todos os registros sem avaliar nada disso.

Este desenho estende a cobertura sem reabrir aquela porta.

## Decisões

| Decisão | Escolha |
|---|---|
| Unidade de autoria | Famílias de cena, com dados escritos à mão por capítulo |
| Garantia de veracidade | Citação obrigatória, verificada por teste automático |
| Ordem de execução | Uma matéria inteira por vez, Filosofia primeiro como prova |
| Movimento | Toda cena anima por `motion/react`, sem exceção |

Alternativas descartadas: 295 componentes únicos (custo inviável no ritmo real
de autoria) e cobertura só dos capítulos prioritários com lacuna declarada nos
demais (não atende ao requisito de cobrir todos os tópicos). Revisão humana
obrigatória por lote foi descartada pela usuária em favor do portão automático.

## Arquitetura

Módulo novo `src/views/topic-scenes/`, irmão de `topic-experiments/`. **Não** é
extensão de `registry.ts`: aquele registro casa por palavra-chave
(`keywords.every(k => text.includes(k))`), que é o mecanismo capaz de fazer uma
prancha vazar para o capítulo errado. O vínculo aqui é por **ID exato de
capítulo**, como `topic-experiments/catalog.ts` já faz.

```
src/views/topic-scenes/
  families/<Familia>.tsx     desenho puro, props tipadas, sem conhecer capítulo
  data/<materia>.ts          entradas escritas à mão, uma por capítulo
  sceneFor.ts                id exato → entrada | null
  lastro.test.ts             portão do conteúdo
  movimento.test.ts          portão do movimento
```

Separação de responsabilidades: a família não sabe de capítulo e o dado não sabe
desenhar. Trocar o SVG de uma família não pode alterar nenhuma afirmação;
corrigir uma afirmação não pode quebrar o desenho.

### As famílias são descobertas, não decretadas

A lista de famílias não é fixada neste documento. A primeira tarefa da Fase 1 é
ler os 35 capítulos de Filosofia em `deepSummaryContent.json` e deixar as
estruturas conceituais emergirem do material. Se Filosofia pedir quatro
famílias, são quatro. Capítulos que não couberem em nenhuma família existente
ficam com a lacuna honesta — forçar encaixe é a versão elegante do erro de
`8d62f5b`.

Famílias novas em fases posteriores só nascem quando uma matéria pedir uma
estrutura que as existentes não representam, e isso vira nota no documento de
cobertura, não acréscimo silencioso.

### Toda família é um componente animado

Nenhuma cena é um desenho estático. Cada família anima por `motion/react` e
consome o hook compartilhado de movimento, o mesmo padrão das onze experiências
atuais:

```ts
function useInkMotion() {
  const reduced = useReducedMotion();
  return { duration: reduced ? 0 : MOTION_DURATION.entrance, ease: MOTION_EASE };
}
```

A animação precisa mostrar a **transição entre os estados** que a cena ensina: o
critério que muda, o argumento que avança, a escala que se abre. Movimento
decorativo de entrada não cumpre a exigência. Sem animação infinita; movimento
reduzido tem duração zero.

## Os dois portões

### Portão do conteúdo — `lastro.test.ts`

Cada afirmação carrega a seção de origem e um trecho literal do capítulo:

```ts
{ chapterId: 'summary-filosofia-a-alegoria-da-linha-dividida-e-o-conhecimento',
  family: 'escala-de-graus',
  items: [
    { label: 'eikasia',
      claim: 'imagens e sombras; o grau mais distante do inteligível',
      section: 'A linha e seus segmentos',
      quote: 'o primeiro, a eikasia (imaginação ou conjectura)' } ] }
```

O teste percorre todas as entradas e exige que `quote` apareça literalmente na
seção citada *daquele* capítulo, normalizando caixa e espaço em branco, nunca
acento. Sem correspondência, o teste falha e o build para.

Em runtime, `sceneFor` devolve `null` para qualquer capítulo sem entrada válida
e a tela volta ao aviso de lacuna. **Falha fechada**: nunca uma cena frouxa.

Fonte de verdade para o lastro: `src/data/deepSummaryContent.json`, que tem
conteúdo aprofundado real para os 295 capítulos das sete matérias, cinco seções
cada, unido ao capítulo por matéria e tópico.

### Portão do movimento — `movimento.test.ts`

Percorre os arquivos de `families/` e reprova qualquer um que não importe
`motion/react`, que não consuma o hook de movimento, ou que declare
`repeat: Infinity`.

## Fases

Cada fase entrega a matéria fechada e verificada antes da próxima.

| Fase | Matéria | Capítulos |
|---|---|---|
| 1 | Filosofia — a prova | 35 |
| 2 | Sociologia | 27 |
| 3 | História | 49 |
| 4 | Geografia | 63 |
| 5 | Literatura | 37 |
| 6 | Gramática | 26 |
| 7 | Redação | 58 |

O plano de implementação que sai deste desenho cobre **apenas a Fase 1**. Cada
fase seguinte ganha seu próprio plano, escrito depois que a anterior fechou e
com o que ela ensinou.

### Os cinco passos da Fase 1

1. Ler os 35 capítulos e derivar as famílias que o material pede, registrando em
   documento o capítulo que originou cada família e os que não couberam em
   nenhuma.
2. Escrever os componentes de família, com teste próprio por família (props →
   desenho, sem capítulo envolvido).
3. Escrever `data/filosofia.ts`, entrada por entrada, cada afirmação com seção e
   trecho literal.
4. Ligar em `sceneFor` e no fluxo de Explorar: mesmo slot das experiências
   atuais, mantém estado ao trocar de etapa, some em Testar.
5. Verificar e capturar.

## Correção do auditor, junto da Fase 1

`06-correcao-personalizacao.md` registra que `scripts/auditVisualJourney.ts`
devolvia `topicVisual: true` para todos os registros sem avaliar nada. O contador
de `anchorScenes` de `docs/visual-personalizado/04-cobertura-percurso.json` passa
a contar **apenas entradas que passam no lastro**. Sem isso o relatório volta a
certificar cena que não existe — e é esse relatório que declara uma fase
terminada.

## Verificação por fase

Toda ela executada antes de declarar a fase concluída:

- `lastro.test.ts` verde sobre todas as entradas da matéria.
- `movimento.test.ts` verde.
- Testes de família e de comportamento: seleção, comparação, estado.
- Teclado: toda interação acionável, com estado acessível (`aria-pressed`, como
  nas experiências atuais).
- Movimento reduzido: duração zero via token, sem animação infinita.
- Navegador real: amostra em desktop escuro e celular claro, sem overflow
  horizontal, console limpo. Capturas em `docs/visual-personalizado/screenshots/`.
- `npm run lint` (`tsc --noEmit`), `npm test` e build de produção.

## Limites declarados

1. **O portão do conteúdo não pega leitura equivocada.** Ele prova que a
   afirmação tem origem no texto do capítulo certo, não que a interpretação
   esteja correta. Uma leitura errada construída com as palavras certas passa. A
   usuária optou por não ter revisão humana obrigatória no caminho; o risco fica
   registrado aqui e no documento de cobertura.
2. **O portão do movimento é estático.** Garante que a família anima pelo
   caminho certo, não que a animação escolhida seja a pedagogicamente certa.
   Isso permanece julgamento de quem desenha, verificado na revisão visual das
   capturas.
3. **Capítulos da mesma família se parecem entre si.** É a troca aceita ao
   preferir famílias a 295 componentes únicos.
4. **Os 613 tópicos continuam sem prancha autoral individual.** O documento de
   cobertura vai continuar dizendo isso, como diz hoje.

## Referências no repositório

- `src/views/topic-experiments/catalog.ts` — vínculo por ID exato, o padrão a seguir.
- `src/views/topic-experiments/TopicExperiment.tsx` — as onze cenas existentes.
- `src/views/visual-boards/registry.ts` — o casamento por palavra-chave a **não** estender.
- `src/data/deepSummaryContent.json` — fonte do lastro.
- `docs/visual-personalizado/06-correcao-personalizacao.md` — o modo da falha anterior.
- `docs/visual-personalizado/04-cobertura-percurso.json` — relatório de cobertura.
