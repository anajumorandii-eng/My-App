# Obras: leitura, análise, comparação e revisão

O catálogo apresenta um roteiro de estudo em blocos de 20, 40 ou 60 minutos, para uma unidade ou passagem. Os passos articulam localização/edição, leitura, análise, conferência e recuperação. Os roteiros de FUVEST e Unicamp são didáticos e devem ser confrontados com o comando e as fontes institucionais; não representam frequência prevista ou pontuação oficial.

Cada obra com dossiê oferece **Laboratório de leitura**. A estudante escolhe unidade e passagem, escreve contexto → voz → indício → procedimento → efeito → relação com a obra e só então revela o comentário publicado. A primeira resposta é preservada para comparação com uma reescrita. Na recuperação sem consulta, o trecho e o comentário ficam ocultos, e o seletor usa apenas localização/índice, sem antecipar o recurso formal.

A comparação escolhe uma segunda obra e uma passagem publicada, usando o mesmo eixo: voz, tempo/memória, espaço/relações sociais, forma/linguagem ou conflito/posição do leitor. As duas edições e localizações ficam explícitas. Critérios pedem um indício de cada obra, aproximação, diferença e limite da inferência. A transferência propõe uma mudança hipotética de voz/ordem, sem atribuí-la a uma versão real do livro.

O laboratório restringe seus modelos a unidades com guia publicado e passagens publicadas dessas unidades, inclusive quando o restante da tela está em modo de revisão editorial. Não altera o estado de publicação dos dossiês nem cria novas citações, páginas ou teses específicas de uma obra. Os recortes ativos do catálogo e os links de lista oficial orientam a seleção; as outras unidades podem servir como leitura complementar.

Fichas são salvas somente neste navegador, separadas por conta, obra, edição, unidade e passagem. Comparações incluem também segunda obra, sua edição/passagem e eixo. Trocar seleções preserva as respostas já escritas; alternar abas mantém o laboratório montado depois da primeira abertura. Falha de salvamento deixa o texto aberto e edição posterior retira a confirmação anterior. A autoavaliação não alimenta domínio ou conclusão de leitura automaticamente; a leitura é registrada na aba própria.

Validação cobre os 18 dossiês existentes, gates editoriais, recuperação sem indícios antecipados, conta/edição, respostas entre abas, comparação por eixo e descarte de carregamento atrasado. O catálogo continua usando o acesso normal ao Firestore; o laboratório não introduz catálogo fictício nem contorna autenticação.

## Resumos aprofundados e estratégias por obra

A área de Estratégias oferece a aba **Por obra**, com os 18 títulos que possuem dossiê no repositório. Cada roteiro tem procedimentos específicos de leitura e resolução, equívocos de interpretação a evitar e adaptação didática da resposta para FUVEST ou Unicamp. Oferecer treino para uma banca não afirma que a obra integra sua lista: o ciclo e o recorte continuam sendo conferidos nas fontes e requisitos do catálogo.

Cada página de obra inclui **Resumo aprofundado** e **Estratégias**. O resumo acrescenta três eixos de síntese específicos do título, reúne a análise integral publicada e permite selecionar uma unidade para estudar seu resumo, observações formais e passagens comentadas. Cada passagem preserva contexto, recurso, efeito, relação com o conjunto e localização na edição de referência. Unidades sem cartão publicado informam essa ausência. Recortes de contos, agrupamentos didáticos e a distinção entre ensaio, poesia e narrativa permanecem explícitos.

As novas sínteses em `src/data/workStudyGuides.ts` são paráfrases didáticas dos módulos de introdução e análise já publicados, sem novas citações ou referências de paginação. A função `getWorkStudyGuide` exige ambos os módulos publicados e filtra unidades e cartões novamente, inclusive no modo de revisão. Não altera o estado editorial dos dossiês nem atribui às sínteses uma revisão humana inexistente. A bibliografia e os limites das pesquisas continuam na aba Fontes.

Links diretos usam `?aba=resumo`, `?aba=estrategias` e `?aba=fontes`. A troca de aba mantém os demais parâmetros, inclusive o modo de revisão, e preserva o laboratório montado. Resumos e estratégias podem ser impressos ou salvos como PDF pelo navegador. A impressão inclui a análise recolhida e a unidade selecionada, remove seletores e mantém o estado da tela original.
