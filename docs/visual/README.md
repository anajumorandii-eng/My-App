# CRIVO Visual

## Visão

Visual é uma aba própria do CRIVO dedicada a compreender relações, testar
recuperação e reconstruir conexões. Ela não é um gerador de mapas decorativos: é
uma superfície de aprendizagem visual integrada ao diagnóstico, aos resumos, às
questões, ao caderno de erros e ao Motor de Eficiência.

O princípio é:

> Mapa para compreender relações. Recuperação ativa para consolidar. Questões
> para provar domínio.

## Problema que resolve

Estudantes frequentemente acumulam textos e tarefas sem perceber quais relações
estruturam um assunto. O Visual transforma um conteúdo em uma prancha
explorável, evidencia pré-requisitos e permite testar se a estudante consegue
reconstruir o vínculo sem consultar a resposta.

O sistema deve ajudar a decidir o que fazer, adiar ou não fazer. Um mapa
dominado pode ser recolhido e deixa de ocupar a revisão atual. Uma lacuna
pequena deve gerar uma intervenção pequena, em vez de recomendar novamente o
capítulo inteiro.

## Experiência principal

1. A estudante entra na aba Visual a partir de Estudar, Resumos ou de uma
   recomendação da tela Hoje.
2. Seleciona uma disciplina, tópico ou resumo.
3. Explora nós, relações, exemplos, pré-requisitos e aplicações.
4. Passa para Testar, que oculta ou pergunta por relações decisivas.
5. Passa para Reconstruir, escolhendo ou reorganizando os elos do mapa.
6. Recebe feedback imediato e uma explicação do diagnóstico.
7. A evidência atualiza o domínio, a confiança e a próxima ação recomendada.

## Modos

### Explorar

Leitura ativa da prancha. O conteúdo aparece em camadas: conceito, mecanismo,
representação, aplicação e relação com outros nós. A estudante pode selecionar
um nó, abrir o inspetor, consultar o trecho do resumo relacionado e ocultar
ramos já dominados.

### Testar

Recuperação sem consulta. O sistema remove ou desfoca partes importantes,
apresenta perguntas curtas e registra a qualidade da resposta. A interface não
deve transformar o modo em um quiz genérico: o objeto da avaliação é a relação
entre conceitos.

### Reconstruir

A estudante recompõe uma conexão ausente, escolhe o pré-requisito correto ou
reorganiza a sequência de um processo. A resposta deve ser normalizada antes da
avaliação para evitar falsos erros de capitalização ou acentuação.

## Estados pedagógicos

Os nós não usam apenas “sei” e “não sei”. O estado pode ser:

- não avaliado;
- reconhece;
- compreende;
- aplicação instável;
- aplica;
- transfere;
- possível regressão.

Todo diagnóstico também possui confiança baixa, moderada ou alta. Uma única
questão errada gera indício, não certeza. Dados insuficientes devem provocar uma
nova evidência diagnóstica.

## Semântica visual do CRIVO

- marfim quente `#FBF8F2`: superfície clara e ambiente de estudo;
- verde-floresta `#10251F`: estrutura, navegação e âncoras;
- vinho `#852636`: lacuna, atenção prioritária e ação crítica;
- âmbar/dourado: recomendação, prioridade e orientação;
- azul/índigo: seleção, informação e operação de aprendizagem;
- verde vivo: domínio sustentado, sucesso e progresso;
- cinzas quentes: não avaliado e estado neutro.

O modo escuro preserva o ambiente do produto: vinho à esquerda, preto no centro
e verde profundo à direita. Não é uma simples inversão para preto.

## Responsividade

- Desktop: canvas amplo, navegação do CRIVO à esquerda e inspetor contextual à
  direita.
- Mobile vertical: canvas em coluna, cabeçalho compacto, ações inferiores e
  inspetor como bottom sheet.
- Mobile horizontal: prancha panorâmica, ferramentas compactas e painel
  contextual recolhível.
- Abaixo de 900 px, o menu lateral segue o padrão de gaveta existente.
- Abaixo de 560 px, controles longos usam rolagem horizontal ou campos
  agrupados.

## Integrações

O mapa é ligado ao mesmo contexto de estudo, e não salvo como uma imagem
independente:

```text
Resumo → Visual → Testar → Reconstruir → evidência → domínio → próxima ação
```

As integrações previstas são:

- `summaryId`, disciplina, tópico e capítulo;
- seções dos resumos e perguntas de recuperação;
- domínio de 0 a 4 e histórico de evidências;
- repetição espaçada e revisões;
- questões e padrões recorrentes de erro;
- Tutor Socrático para aprofundamento contextual;
- telemetria de exploração, teste, reconstrução e discordância.

## Motor adaptativo

A priorização deve ser híbrida:

```text
Dados → regras determinísticas → histórico → candidatos → IA contextual →
ranking → explicação → decisão da estudante
```

Para cada ação potencial, considerar impacto, necessidade, urgência, incidência
na prova, deficiência, recorrência, transferência, pré-requisitos e
probabilidade de aprendizagem em relação a tempo, energia, atenção, atrito,
esforço e custo de oportunidade.

Toda recomendação relevante mostra “Por que isso?”. A estudante pode selecionar
“Discordo”, registrar que ainda não estudou ou pedir nova evidência. A IA
recomenda; a estudante decide.

## Intervenção mínima eficaz

Antes de recomendar uma revisão ampla, o CRIVO procura a menor lacuna que
explica o problema. Exemplo: se a estudante compreende a definição de derivada,
mas não reconstrói a condição de continuidade, o próximo passo é testar essa
conexão específica, não rever todo o capítulo de Cálculo.

## Grafo de pré-requisitos

Os nós devem suportar relações de pré-requisito, causa, consequência, contraste,
aplicação e transferência. Quando um nó apresenta dificuldade, o sistema
investiga os elos anteriores antes de classificar o assunto inteiro como fraco.

## Transparência e evidência

Cada nó selecionado deve informar:

- estado atual;
- confiança;
- evidências que sustentam o diagnóstico;
- relações afetadas;
- próxima ação;
- possibilidade de discordância.

O visual deve distinguir fato, hipótese e recomendação. Uma hipótese de baixa
confiança aparece como hipótese, nunca como fato.

## Direção visual consolidada

A direção aprovada combina a riqueza da prancha ilustrada com a reconstrução
ativa. A ilustração pertence ao material de estudo; menus, botões, tipografia de
interface, ícones e navegação continuam obedecendo ao shell existente do CRIVO.

- títulos: Newsreader/Georgia;
- interface: Inter;
- metadados: tipografia monoespaciada e caixa-alta;
- superfícies: quentes, com cantos de 16 px;
- movimento: `motion/react`, com entradas suaves, zoom, seleção, expansão e
  feedback sem excesso ornamental.

## Arquivos da implementação

- `src/views/Visual.tsx`: tela e modos de estudo;
- `src/views/Visual.css`: composição responsiva e estados visuais;
- `src/lib/visualStudy.ts`: tipos e regras do mapa;
- `src/lib/visualStudy.test.ts`: testes das regras de reconstrução;
- `src/views/Visual.test.tsx`: testes da interação da tela.

## Referências visuais

As imagens e variações produzidas durante a concepção ficam em
[`assets/`](./assets/). Os nomes originais `exec-*.png` são preservados para
manter rastreabilidade entre a conversa e os estudos visuais;
`architecture-options.png` e `architecture-options.svg` registram a comparação
inicial de arquiteturas.

Essas imagens são referências de direção, não fontes de verdade para tokens. A
implementação deve sempre seguir o design system real do CRIVO.
