# Expansão dos visuais do CRIVO

Data: 2026-09-23  
Estado: desenho aprovado em conversa; especificação para revisão da Ana Júlia

## Objetivo e contrato

Expandir a aba Visual para que cada um dos 613 capítulos tenha uma representação
que ensine sua relação central, sem avançar um capítulo isolado por rodada.
Entregar por lotes de mecanismos afins, preservando a identidade de cada matéria,
o conteúdo do capítulo e os modos Explorar, Testar e Reconstruir.

São vinculantes `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`, as cinco imagens em
`docs/visual-personalizado/referencias-aprovadas/` e o princípio registrado no
README do projeto visual: matéria define universo e movimento; tópico define
artefato; estado pedagógico define comportamento. Trocar título, cor, glifo ou
texto sobre o mesmo desenho não transforma um visual em representação própria.

## Base verificada e limitação da matriz atual

Na `main` `35e2b27`, a matriz gerada registra 613 capítulos: 11 experimentos,
43 pranchas, 373 instrumentos, 186 cenas e nenhuma lacuna técnica. Os 186
capítulos classificados como cena usam 16 identificadores de artefato, vários
compartilhados por dezenas de capítulos. Os instrumentos têm IDs quase sempre
exclusivos, mas parte deles usa um componente e um controle comuns com
configurações diferentes. **ID exclusivo e rota acessível não atestam qualidade.**

A PR #202 acrescenta Biomagnificação e um ajuste à cena de respiração; enquanto
ela estiver aberta, sua mudança deve ser integrada à base do trabalho de
implementação sem duplicar ou sobrescrever seus componentes. Este documento
não considera a PR mesclada.

## Decisão de desenho

Adotar famílias de **mecanismos verificáveis**, com configuração semântica
específica por capítulo e componentes de renderização compartilhados somente
quando a mesma relação causal ou espacial realmente se repete. A configuração
descreve o objeto, as partes, relações, estados e consequências, além das
fontes do próprio capítulo. O componente determina geometria e movimento;
os dados determinam o mecanismo que o aluno manipula.

Alternativas descartadas:

- Uma prancha implementada do zero por capítulo preservaria liberdade visual,
  mas tornaria lenta a expansão e difícil a manutenção de 613 casos.
- Reaproveitar oito diagramas genéricos com nomes diferentes aumentaria rápido
  a contagem de cobertura e contrariaria o padrão obrigatório.

Uma família não é uma licença para reutilizar a mesma topologia sem critério.
Se dois capítulos exigirem relações diferentes, usam configurações e formas
distintas ou componentes específicos. Exemplos: projeção cartográfica exige
deformação espacial, sucessão ecológica exige mudança na comunidade ao longo
do tempo, e biomagnificação exige concentração ao longo da cadeia trófica.

## Inventário e classificação de qualidade

Adicionar uma auditoria versionada derivada dos mesmos 613 IDs de
`interactiveSummaries`. Cada linha contém `chapterId`, matéria, artefato
primário resolvido, família de mecanismo, relação que o aluno deve explicar,
estado de revisão, evidência visual e observações. Estados:

1. `nao-revisado`: existe rota, mas ninguém avaliou a fidelidade do artefato.
2. `insuficiente`: forma ou interação não ensina a relação do capítulo.
3. `em-validacao`: implementação existe; falta algum teste ou inspeção visual.
4. `aprovado`: passou conteúdo, interação, responsividade, temas e acessibilidade.

O estado inicial não pode ser inferido da contagem atual de pranchas ou IDs.
Registrar também defeitos concretos e prioridade, sem chamar os 613 de
aprovados por terem rota. O relatório gera totais por matéria, tipo de artefato,
estado de revisão e família, mais uma lista de pendências rastreáveis.

## Organização do código

- Preservar `visualCandidates` e a arbitragem exclusiva de uma representação
  primária por capítulo. Experimento, prancha e instrumento existentes não
  perdem prioridade automaticamente para uma cena nova.
- Criar famílias em arquivos separados dentro de `src/views/` por mecanismo,
  com registro de ID exato e configuração tipada por capítulo. Reutilizar
  `SceneEntry` e seu lastro em seção/trecho quando servir; adicionar campos
  tipados apenas quando um mecanismo precisar de topologia, posição, escala
  ou estados próprios. Nunca selecionar um desenho por palavra-chave solta.
- Manter a configuração próxima da família e o conteúdo vinculado ao capítulo.
  Uma visualização só entra no registro se for possível apontar quais relações
  e estados de seu capítulo ela materializa. Novos componentes que precisem
  de um fluxo incompatível com `TopicScene` entram como instrumento ou prancha,
  mantendo o mesmo contrato de `Visual.tsx`.
- Atualizar `artifactId.ts` e a matriz gerada quando uma cena específica
  substituir a família genérica. IDs de artefato continuam distintos de
  qualidade aprovada.
- Isolar CSS por família; evitar ampliar os overrides de `Visual.css`. Carregar
  famílias novas sob demanda conforme o visual crescer, preservando o acesso
  direto a `/visual?summary=<id>` e a recuperação de rotas após deploy.

## Lotes e ordem

| Lote | Escopo | Entrega verificável |
| --- | --- | --- |
| 0. Fundação | 613 capítulos | Auditoria de qualidade, critérios e relatório reproduzível; matriz de cobertura técnica preservada. |
| 1. Ciências da Natureza | Física 85, Biologia 72, Química 48 | Agrupar por mecanismos físicos, biológicos e químicos; revisar cenas e instrumentos existentes, elevar os insuficientes por subconjuntos testáveis. |
| 2. Matemática e Geografia | Matemática 83, Geografia 63 | Gráficos, construções, transformações e relações espaciais específicos; revisão da geometria e cartografia em mobile. |
| 3. Humanidades | História 49, Filosofia 35, Sociologia 27, Atualidades 1 | Relações históricas, argumentos, instituições e escalas com evidência do texto, sem fluxo universal indiscriminado. |
| 4. Linguagens | Redação 58, Literatura 37, Gramática 26, Inglês 17, Entendimento de Texto 12 | Estrutura de texto, leitura e escolhas linguísticas observáveis no próprio material. |
| 5. Fechamento | Todos os 613 | Reavaliar cada linha, revisar amostra e exceções por dispositivo/tema, fechar apenas estados aprovados com evidência. |

Cada lote pode sair em PRs menores por famílias afins para revisão, mas seu
progresso é medido sobre **todos** os capítulos do escopo, inclusive os
instrumentos existentes. Nenhum lote se declara completo só porque os itens
`scene` foram substituídos. Os 613 capítulos permanecem navegáveis durante
toda a migração.

## Comportamento pedagógico e acesso

Explorar deve revelar o mecanismo e a consequência da seleção. Testar faz uma
pergunta cuja resposta depende da relação mostrada. Reconstruir exige que o
aluno refaça uma relação, com alternativa a arrastar por clique e teclado.
Os três modos continuam usando o estado e a evidência atuais de `visualStudy`;
as famílias novas não criam um segundo diagnóstico independente. A imagem
continua compreensível sem movimento; transições explicam mudança e respeitam
`prefers-reduced-motion`. Rótulos acessíveis nomeiam fenômeno, seleção e
resultado, e o foco é visível.

## Critérios de aceite por capítulo e por lote

Para marcar um capítulo `aprovado`, registrar:

- uma pergunta e a relação central lastreadas no conteúdo do capítulo;
- objeto, variáveis e consequências observáveis no visual, com geometria ou
  organização que corresponda ao fenômeno, e não só novo texto;
- interação que altera o estado mostrado e preserva os modos de estudo;
- teclado, nomes acessíveis, movimento reduzido, temas claro e escuro;
- inspeção real em 360–390 px, tablet e desktop, sem overflow da página,
  clipping, erro de console do app ou falha de rede; capturas versionadas;
- testes de conteúdo/interação e de seleção por ID exato; TypeScript e build.

Testes de família cobrem sua topologia e estados; testes de registro impedem
casamento com outro capítulo. Revisão visual cobre cada variante geométrica,
e uma amostra de capítulos por variante; exceções e capítulos reprovados são
inspecionados individualmente. A auditoria guarda o que foi de fato conferido
para não equiparar amostra a aprovação automática de todos os capítulos.

## Riscos e contenção

- **Escala:** priorizar mecanismos por impacto e agrupar código, mas manter
  revisão de conteúdo por capítulo. Relatar totais aprovados e pendentes.
- **Regressão:** acrescentar componentes sem mexer na casca de `Visual` em
  paralelo; integrar PRs sobre a `main` atual e verificar a matriz gerada.
- **Conteúdo incorreto:** configs e valores vêm do capítulo; não gerar
  diagramas automaticamente a partir de título, nem inventar números.
- **Build e browser:** o checkout esparso omite `public/` e faz sete testes
  completos falharem por arquivos ausentes. Materializar os arquivos para a
  execução integral ou registrar esse limite. Prévias protegidas da Vercel
  não contam como inspeção visual se o navegador não puder abri-las; usar
  ambiente autenticado acessível ou validação local antes de aprovar.
