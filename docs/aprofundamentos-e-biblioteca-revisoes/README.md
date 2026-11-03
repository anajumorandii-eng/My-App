# PDFs de aprofundamento e biblioteca de revisões

## Compactação dos aprofundamentos

O exportador já compartilhava capa, sumário, fontes e paginação entre os dois
materiais, mas a organização compacta estava restrita às revisões. Agora os
aprofundamentos de matérias e de obras também usam esse fluxo: A4 vertical,
uma página por folha, margens de 14 mm, corpo original de 10,5 pt, intervalos
menores e sumário contínuo com o início do conteúdo. Não há redução de páginas
inteiras a imagens, nem reescrita ou exclusão de conteúdo.

| Exemplo de validação | Antes | Depois |
| --- | ---: | ---: |
| Cinemática Escalar, conteúdo editorial do projeto | 9 | 7 |
| Brasil Colônia, conteúdo editorial do projeto | 17 | 13 |
| Geometria, exemplo sintético com fórmulas, tabelas e diagrama | 4 | 3 |

Esses números são dos exemplos, não de arquivos da conta da estudante. Cada
comparação usou o mesmo HTML congelado nas duas versões. Todos os textos,
títulos, tabelas e SVGs permaneceram idênticos. Foram verificadas individualmente
as 25, 54 e seis entradas dos sumários contra a paginação final.

Todas as páginas foram verificadas como A4 vertical, com corpo físico de 10,5 pt
e capa idêntica pixel a pixel. Foram inspecionadas visualmente todas as sete,
13 e três páginas finais, incluindo fórmulas em linha e em tabelas. Um PDF de
revisão existente no fluxo de teste também foi exportado com os estilos anterior
e novo: suas sete páginas permaneceram idênticas pixel a pixel.

Exemplo público: [geometria antes](geometria-antes.pdf) e
[depois](geometria-depois.pdf). Métricas: [editoriais](resultados-editoriais.json)
e [geometria](resultados-geometria.json).

As regras valem para novas gerações pelo modelo compartilhado. PDFs arquivados
não são apagados, invalidados ou reescritos automaticamente. Capa e conteúdo
dos materiais salvos continuam preservados.

## Meus resumos de revisão

A nova biblioteca fica em `/meus-resumos-revisao`, no menu **Explorar**, junto
de **Meus aprofundamentos**. Ela reutiliza os componentes e o armazenamento
da biblioteca existente: busca sem acentos (incluindo recortes), filtros de
matéria/banca, ordenação, paginação de 12 itens e leitor separado.

O leitor permite exportar, excluir mediante confirmação e voltar à biblioteca
mantendo os filtros. **Editar configurações desta revisão** abre a criação com
a revisão salva e restaura tópicos, seleções e recortes, sem fazer outra chamada
de geração. As bibliotecas filtram tanto as listas quanto os links diretos por
tipo de material. Nenhum dado foi migrado, descartado ou misturado entre contas.

A criação ficou em uma coluna com um link para a biblioteca. O acesso rápido
anterior permanece em uma seção recolhida, sem ocupar uma coluna lateral.

O navegador validou a lista, paginação, busca, leitura e retorno com filtros em
1440×1000, 768×1024 e 390×844, sem rolagem horizontal. Os testes também cobrem
restauração para edição, exclusão preservando outros materiais, estado vazio e
links de tipo incorreto. Screenshots usam somente dados sintéticos:
[computador](biblioteca-desktop.png), [tablet](biblioteca-tablet.png),
[celular](biblioteca-mobile.png), [leitor](leitor-mobile.png) e
[criação](criacao-desktop.png).

Verificações concluídas: `npm run lint`, `npm test` (1.311 testes do servidor e
bibliotecas, 3.384 da interface; um ignorado pela configuração existente) e
`npm run build`. O build conserva os avisos de tamanho dos bundles.

## Arquivos e reprodução

- `src/lib/printStrategyGuide.ts` e `printStyles.ts`: extensão das regras compartilhadas.
- `src/views/Aprofundamentos.tsx`: biblioteca e leitor reutilizados para revisões.
- `src/views/ReviewSummaries.tsx`: link para biblioteca, abertura por chave e acesso rápido recolhido.
- `src/App.tsx`, `NucleoInstrumentalProductionLayout.tsx` e `NucleoInstrumentalPrototype.tsx`: rota e menu.
- Testes de impressão e das duas bibliotecas; fixtures e comparador em `scripts/`.

Com Vite na porta 3138, monte `studyPdfFixture.tsx` com a finalidade de
aprofundamento, ou `deepeningLayoutFixture.tsx`, e grave o HTML completo.
Compare com o exportador real:

```sh
CRIVO_LAYOUT_MATERIAL=deepening CRIVO_LAYOUT_BASE_REF=2dbc7853 \
  CRIVO_LAYOUT_OUTPUT=/tmp/aprofundamento-layout \
  node --import tsx scripts/validate-review-layout.mjs /caminho/fonte.html
python scripts/audit-review-layout.py /tmp/aprofundamento-layout
```

Esta entrega não faz merge nem publicação em produção.
