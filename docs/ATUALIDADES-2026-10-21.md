# Atualidades — materiais Anglo 2026

Atualização da biblioteca de Resumos do CRIVO com a pasta fornecida pela estudante:
https://drive.google.com/drive/folders/1P6YUH6aZUf_A63WcceZKt4Cw-YMcU59j

## Escopo editorial

A pasta contém 40 PDFs, entre apostilas e slides, correspondentes a 22 aulas:
01–12, 18–24 e 26–28. Não há materiais das aulas 13–17 e 25 na pasta consultada;
nenhum conteúdo foi inventado para preencher essa numeração.

Foram acrescentados 21 dossiês autorais a `interactiveSummaries`, mantendo o
capítulo `atu-cop30-belem` para a aula 07. O catálogo passa de 613 a 634 resumos,
com 22 de Atualidades. Cada novo dossiê oferece cinco seções A.T.U.A.L., três
profundidades de leitura, duas situações de prática comentadas, pergunta de
recuperação, elementos de avaliação e transferência. As práticas não são
questões oficiais de vestibular. As orientações por banca são didáticas, sem
alegação de incidência estatística desses assuntos.

A aula 07 acrescenta Antropoceno, transição energética e o balanço publicado
pela presidência da COP30 em março de 2026. Os IDs das seis seções anteriores
e da recuperação de COP30 permanecem estáveis; os trechos novos recebem IDs
próprios. Não houve mudança de chaves de armazenamento ou formato de progresso.

## Fontes e recortes

`src/data/currentAffairs/anglo2026.json` contém sínteses próprias, não transcrições.
`sources2026.json` guarda somente referências aos arquivos da pasta. Os PDFs,
extrações e imagens de página não foram adicionados ao repositório público.
O acesso aos links continua sujeito às permissões do Drive da estudante.

A data 21/10/2026 identifica a revisão dos materiais fornecidos e das fontes
complementares citadas; os capítulos não se apresentam como boletins completos
da situação nessa data. Previsões sazonais, totais de vítimas, composição variável
dos BRICS e desfechos militares não confirmados não foram promovidos a dados
atuais. Os capítulos explicitam seus recortes e distinguem descrição, hipótese,
interpretação e fases de processos jurídicos.

Conferências e correções relevantes:

- Irã: o registro da ONU de 28/02/2026 situa a escalada nessa data, em contraste
  com 02/02 nos slides. Esse pronunciamento ainda não confirmava a morte do líder
  supremo; não foi usado como confirmação posterior de morte ou sucessão.
- Venezuela: o registro da ONU confirma a intervenção e captura em 03/01/2026.
  Remoção de liderança não é apresentada como prova de democratização.
- Foz do Amazonas: a licença anunciada em 20/10/2025 é de perfuração exploratória,
  sem inferência de autorização automática para produção comercial.
- Antropoceno: a decisão IUGS/ICS de 2024 sobre a escala formal é distinguida do
  conceito e da evidência sobre transformação humana do sistema Terra.
- COP30: decisões de 2025 e compromisso de desenvolver roteiros pela presidência,
  documentado em 19/03/2026, são diferenciados. A referência da UNFCCC para as
  13 decisões financeiras foi acrescentada diretamente.
- Taiwan: apoio à capacidade de autodefesa não foi descrito como garantia militar
  automática; a República da China não foi apresentada como criada em 1949.
- Ucrânia: Euromaidan em 2013 e queda do governo em 2014 são distinguidos;
  o Memorando de Budapeste não é descrito como tratado de defesa dos cinco
  membros permanentes do Conselho.

As URLs documentais correspondentes estão nas fontes dos resumos. A composição
histórica da grade das outras 13 matérias não foi alterada.

## Verificação

O teste `src/lib/currentAffairsCatalog.test.ts` verifica publicação das 22 aulas,
referências aos 40 arquivos, integridade do catálogo, profundidades, vínculos da
recuperação e preservação dos IDs publicados de COP30.

Esta entrega atualiza conteúdo. Os novos capítulos não receberam cenas ou
instrumentos visuais próprios; a interface segue o tratamento existente para
capítulos sem ilustração autoral, sem emprestar a cena de COP30 a outros temas.

Conferências locais: lint, build de produção, testes específicos do catálogo,
regeneração da matriz e do inventário de qualidade e teste de continuidade
editorial. No Chromium, a biblioteca mostrou os 22 capítulos; dossiês abriram
no desktop e em 390 px sem erro de JavaScript ou transbordamento horizontal.
Uma resposta de recuperação foi avaliada e seu histórico persistiu após reload.

Os 21 novos IDs também foram cadastrados no catálogo de ícones decorativos do
Visual, com objetos e rótulos correspondentes aos temas. Ícone decorativo não
é contado como cena, prancha ou instrumento; as 21 pendências de ilustração
continuam explicitadas na matriz.
