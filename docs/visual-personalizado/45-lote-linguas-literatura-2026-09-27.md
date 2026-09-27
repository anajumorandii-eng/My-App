# Lote de Línguas e Literatura — conferência e análise (27/09/2026)

Registro exigido pela regra de entrega do padrão visual
(`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`). A auditoria de origem é a
`35-auditoria-geral-linguas-literatura.md`.

As capturas estão em `screenshots/lote-linguas-literatura-2026-09-27/`:

- `esteticas/`: as três facetas de cada estética;
- `autores/`: os seis autores;
- `cenas/`: os quatro capítulos que dividiam a paisagem;
- `gramatica-ingles/`: os nove capítulos com defeito de layout.

A aprovação editorial de cada prancha é da Ana Júlia. Este documento é só a
conferência técnica.

## Literatura: 22 estéticas desenhadas como três retângulos iguais

O `LiteraryTraitBoard` desenhava três cartões com nome e nota, iguais do
Barroco à poesia concreta. Agora cada faceta tem um desenho próprio
(`LiteraryFacetIcons.tsx`), tirado do rótulo e da nota que o lab já tinha.
Alguns exemplos:

- a coluna, o fogo e o gelo da antítese e a caravela de Camões;
- o claro-escuro sob a cruz da Contrarreforma, e palavra contra ideia no
  cultismo e no conceptismo;
- o triângulo da Inconfidência e o campo idealizado do Arcadismo;
- o triângulo meio-raça-momento e a fileira de casas coladas de O Cortiço;
- o vaso, a gema lapidada e o alvo dos modernistas no Parnasianismo;
- a palavra em grade e as torres de Brasília na poesia concreta;
- os três planos simultâneos de Vestido de Noiva;
- o cálice da canção censurada.

Dois desenhos da primeira versão foram trocados. Eles afirmavam o que o lab
não diz:

- **O baobá da África lusófona.** A nota nomeia Mia Couto e Agualusa, não uma
  árvore. Virou dois livros com "África".
- **A caveira da poesia romântica.** O mal do século não está na nota da
  faceta. Virou o caminho que a nota descreve, "indianismo a denúncia": da
  pena à corrente partida.

O texto subiu de 9,5 para 13 a 14. A nota caía para cerca de 7 px efetivos
no celular.

## Autores: seis fichas idênticas

Antes, Machado, Graciliano, Drummond, João Cabral, Clarice e Guimarães Rosa
tinham a mesma seta, engrenagem e livro. Agora cada fileira traz o emblema da
própria nota:

- **Machado:** a virada de 1881 e o narrador com "?".
- **Drummond:** a pedra no meio do caminho.
- **João Cabral:** o esquadro do poeta engenheiro e as sete sílabas da
  redondilha.
- **Clarice:** a estrela de A Hora da Estrela.
- **Guimarães Rosa:** o interlocutor mudo do monólogo.

A nota subiu de 10 para 13.

## Quatro capítulos com dois desenhos

A função `Landscape` só olhava se o id continha "contemporanea". Com isso,
dois pares de capítulos dividiam o mesmo desenho, pixel a pixel:

- Romance de 30 e poesia de 1960-1980 tinham a mesma montanha, porta e cerca;
- poesia contemporânea e prosa contemporânea tinham o mesmo megafone e folha.

Agora cada capítulo tem a própria cena, com um quadro por item:

- **Romance de 30:** o cenário pitoresco num cartão-postal, contra a terra
  que determina a vida.
- **Poesia de 1960-1980:** a palavra dispersa do concretismo; a grade que
  vira a página longa do Poema Sujo; a xícara e o corpo de Adélia.
- **Poesia contemporânea:** vozes sem centro; o microfone do slam; o poema que
  sai sem passar pela editora.
- **Prosa contemporânea:** fragmentos e o "eu" da autoficção; o jornal colado
  ao ensaio; as mensagens.

## Gramática e Inglês: defeitos de layout

- **`WideRelationScene`, 16 capítulos de Gramática.** A legenda, a frase e o
  texto da caixa direita eram uma linha só de SVG. A legenda vazava dos dois
  lados do quadro em 13 capítulos. Agora os três quebram na largura.
- **Sintagma nominal.** Com quatro palavras, cada caixa tinha 57 de largura e
  "propostas" invadia a vizinha. As caixas agora são mais largas e a fonte é
  menor.
- **Aspecto verbal** ("estudava × está estudando × estudou") e **vírgula**
  ("restrição: somente os que estudaram"): rótulos afastados e quebrados.
- **Inglês, certeza modal** (earthquakes, hurricanes, stem-cells): "esperado"
  e "categórico" se tocavam; agora estão afastados e com tamanho explícito.
- **Inglês, viruses:** o exemplo e a leitura saíam do quadro; os dois quebram.

## Como foi conferido

- **Estéticas e autores:** todas as facetas foram percorridas nos 28
  capítulos, em 1440 claro e 390 escuro. A captura achou "plana" × "redonda"
  e "palavra" × "ideia" colados; os dois foram separados.
- **Os quatro capítulos da antiga paisagem:** cada item em 1440, com
  movimento reduzido.
- **Teste novo** (`LiteraryScenes.test.tsx`):
  - toda estética tem um desenho por faceta;
  - nenhum desenho se repete entre os 66;
  - as seis fichas de autor diferem mesmo depois de removido todo o texto.
- **Varredura** (1440 claro e 390 escuro):
  - antes: Gramática com 12 achados em 52 combinações e Inglês com 6 em 34;
  - depois: 0 em Gramática (26 capítulos), Inglês (17) e Literatura (37).
- **Teste ajustado.** O teste da vírgula procurava um único elemento com
  "todos os alunos". A legenda agora quebra em duas linhas e o alcance aparece
  sozinho também na cena, então o teste passou a aceitar mais de um.

## Pendente

- Aprovação editorial das cenas acima.
