# Revisão visual integral do Crivo — 02/10/2026 (UTC)

O Crivo já possui uma base de interface reconhecível: papel quente, cartões com hierarquia, navegação consistente e várias representações específicas. O principal problema é a qualidade desigual das pranchas. Algumas explicam relações por meio de objetos e transformações; outras apresentam rótulos sobre formas genéricas ou desenhos que contradizem os valores calculados. Corrigir a fidelidade dessas representações deve preceder uma reforma estética geral.

A revisão recomenda **preservar o mecanismo central de 315 capítulos, ajustar 170 e redesenhar 128**. São recomendações fundamentadas na cena central, conteúdo atual, componentes e referências. “Manter” não significa aprovação editorial completa. “Redesenhar” pode significar substituir apenas a representação central: não exige refazer a tela inteira ou abandonar componentes compartilhados.

Nenhum código do aplicativo, progresso da estudante, dado remoto ou registro de aprovação editorial foi alterado nesta revisão. Foram acrescentados documentos, inventário e evidências selecionadas. As alterações de código/dependências/conteúdo feitas anteriormente continuam no workspace.

## Estado e critérios usados

- Repositório `anajumorandii-eng/My-App`, branch `main`, base `6cbc94cdb46048d00947db136ae529e1c6ef41af`; revisão da build **local**, incluindo as alterações previamente autorizadas. Não é uma certificação da versão publicada remotamente.
- Contrato [Padrão visual obrigatório](visual/PADRAO-VISUAL-OBRIGATORIO.md) e cinco [referências aprovadas](visual-personalizado/referencias-aprovadas/): cena que explique o mecanismo de cada capítulo; papel editorial no claro/lousa no escuro; tipografia expressiva; diagnóstico rastreável; interação significativa; acessibilidade e responsividade.
- Catálogo extraído da aplicação atual, com 613 IDs únicos, conteúdo aprofundado e seleção efetiva de board/instrumento/cena/experimento. Auditorias antigas serviram como contexto, sem reaproveitamento automático dos vereditos.
- Execução sem login, em modo demonstração; não foram reutilizados histórico particular, tokens ou credenciais nas evidências. Estados que dependem de autenticação, catálogo remoto ou dados administrativos têm limites próprios.

## Cobertura efetivamente realizada

| Área | Cobertura | Limite |
|---|---|---|
| Capítulos | 613 IDs, sem omissões ou duplicatas; 3.678 configurações: 390/768/1440 px × claro/escuro | Caderno, efeitos mínimos, movimento reduzido |
| Inspeção visual dos capítulos | 1.226 capturas centrais claras, celular/desktop, vistas em mosaicos e ampliadas nos casos suspeitos; fonte e conteúdo confrontados por ID | São recortes centrais; não todas as seções, estados ou painéis. Newton teve captura desktop completa suplementar |
| Modos de estudo | Abertura de Explorar/Testar/Reconstruir e primeiro botão visível por capítulo | Não prova correção de cada resposta, persistência, diagnóstico, todos os sliders ou arraste/teclado |
| Telas principais | 28 rotas; 224 configurações: 360/390/768/1440 px × claro/escuro; 112 capturas | Primeiro viewport e estado disponível em demonstração; formulários não foram enviados |
| Acessibilidade | 56 varreduras WCAG A/AA: celular escuro e desktop claro, todas as 28 rotas | Ferramenta automática não substitui leitor de tela, teclado integral ou avaliação humana |
| Personalização | Cinco fundos aplicados/persistidos localmente no celular; painel medido em quatro larguras; menu aberto/fechado | Não matriz de todas as combinações de paletas/fundos/matérias |
| Movimento padrão | Hoje em celular claro e desktop escuro, efeitos completos; Fotossíntese em celular claro com movimento e desktop escuro com redução | Renderização e inspeção representativas; não varredura temporal de todas as animações |
| Primeira visita e busca | Onboarding 360×640/390×844; busca 390/1440, Tab e Esc; menu móvel | Navegação real em Chromium, sem certificação em Safari ou aparelho físico |
| Rotas adicionais | Galeria, detalhe de obra e três aliases do protótipo | Detalhe de obra disponível apenas como estado de falha do catálogo sem login; aliases redirecionam para Hoje |

As capturas das telas foram refeitas com contextos separados por tema e conferência de `html.dark`/`is-light`, para evitar atribuir estados transitórios da troca de tema à interface final. A barra inferior que aparece sobre parte dos recortes de capítulos resulta da rolagem feita pelo capturador; esse efeito isolado não foi tratado como defeito do aplicativo.

Não houve falha de navegação dos 613 capítulos, exceção JavaScript de página ou imagem quebrada no mecanismo central. Houve um erro de atributo SVG em Solidariedade, detalhado abaixo. Duas páginas de capítulo apresentam overflow confirmado; ausência de overflow nas demais não aprova a representação.

## Resultado por matéria

| Matéria | Capítulos | Preservar mecanismo | Ajustar | Redesenhar |
|---|---:|---:|---:|---:|
| Física | 85 | 38 | 35 | 12 |
| Matemática | 83 | 55 | 28 | 0 |
| Biologia | 72 | 68 | 2 | 2 |
| Química | 48 | 46 | 1 | 1 |
| Geografia | 63 | 62 | 1 | 0 |
| História | 49 | 46 | 3 | 0 |
| Filosofia | 35 | 0 | 12 | 23 |
| Sociologia | 27 | 0 | 13 | 14 |
| Redação | 58 | 0 | 15 | 43 |
| Atualidades | 1 | 0 | 0 | 1 |
| Gramática | 26 | 0 | 25 | 1 |
| Língua Inglesa | 17 | 0 | 11 | 6 |
| Literatura | 37 | 0 | 12 | 25 |
| Entendimento de Texto | 12 | 0 | 12 | 0 |
| **Total** | **613** | **315** | **170** | **128** |

A gravidade do inventário considera também o descumprimento do contrato de representação: uma ficha genérica que não explica o mecanismo pode receber prioridade alta de produto sem ser um erro científico. Não interpretar os 128 redesenhos como 128 bugs de execução. Diagramas com mecanismo válido e exemplo específico foram preservados mesmo quando compartilham a mesma infraestrutura.

## Prioridade 1 — corrigir desenhos que podem ensinar relações incorretas

**Física:** Reflexão Plana coloca os raios em lados opostos do espelho; Refração inverte o sentido tangencial ao atravessar a interface; Reflexão Esférica não posiciona/representa corretamente a imagem real; o lançamento de carga em campo magnético uniforme usa trajetória em S; Trabalho da Força de Pressão do Gás mostra um retângulo solto sem a curva/eixos/região sob p(V). Fórmulas numéricas corretas não corrigem esses desenhos.

Fontes: [OpticsInstrument](../src/views/visual-instruments/OpticsInstrument.tsx), [MagnetismInstrument](../src/views/visual-instruments/MagnetismInstrument.tsx), [ThermoInstrument](../src/views/visual-instruments/ThermoInstrument.tsx). Evidências: [Reflexão Plana](visual-integral-2026-10-02/screenshots/reflexao-plana.jpg) e [Refração](visual-integral-2026-10-02/screenshots/refracao.jpg). Os outros casos estão no inventário de Física.

**Matemática:** Sistemas de Equações informa (6,4), mas as retas desenhadas se cruzam em (5,5); Determinantes não altera adequadamente a área/orientação; Eventos Disjuntos mostra círculos sobrepostos apesar de P(A∩B)=0; ângulos rotulados e figuras de triângulo retângulo/semelhança não correspondem à geometria. Outras Razões Trigonométricas, Universo Tridimensional e Cônicas também precisam ligar o parâmetro à forma correta. Testes dirigidos adicionais confirmaram recorte dos nós da PA em razão=6 e desenho de bijeção incompatível com “imagens=2”.

Fontes: [AlgebraInstrument](../src/views/visual-instruments/AlgebraInstrument.tsx), [PlanarGeometryInstrument](../src/views/visual-instruments/PlanarGeometryInstrument.tsx), [AnalyticInstrument](../src/views/visual-instruments/AnalyticInstrument.tsx). Evidência: [Sistemas](visual-integral-2026-10-02/screenshots/sistemas.jpg). Detalhamento e fontes precisas por caso: [Matemática](visual-integral-2026-10-02/matematica.md).

**Biologia/Química:** Interação Gênica reaproveita a prancha mendeliana sem representar a interação/epistasia tratada no capítulo; Sangue e Imunologia usa somente ABO; Termoquímica II abre Lei de Hess, enquanto o conteúdo atual trata de entropia e Gibbs. Esse último é descompasso de associação, não uma afirmação de que o desenho da Lei de Hess esteja errado. Fontes e recortes: [Biologia/Química](visual-integral-2026-10-02/bio-quimica.md).

## Prioridade 2 — resolver cortes e acesso aos controles

| Problema confirmado | Evidência | Correção recomendada |
|---|---|---|
| Personalizar fica 27 px fora da borda esquerda em 360 e 390 px | [Captura](visual-integral-2026-10-02/screenshots/personalizar-celular.jpg); x=−27, largura328/358 | Ancorar o painel dentro do viewport móvel. `right:0` relativo ao botão não basta |
| Independência do Brasil provoca overflow grande | Navegação limpa390: documento869px; seção850px; viewport interno820px | Fazer a prancha caber ou confinar a navegação espacial ao contêiner, com indicação e acesso por teclado |
| Administração de Conteúdo provoca overflow | [Captura](visual-integral-2026-10-02/screenshots/admin-conteudo-celular.jpg); documento495px em390; select/input474px | Remover o mínimo intrínseco dos campos/grid e assegurar largura disponível |
| Competências de Redação extravasa2px | documento392px em390; borda392,22px | Corrigir dimensionamento/box-sizing da prancha e jornada |
| Br em Reações Orgânicas fica cortado | Fonte QuimicaOrganica: x211 em viewBox220; observado em768/1440 nos dois temas | Ajustar margem e ancoragem do rótulo |
| Notas/legendas pequenas | Colonização~6px; Mineração6,5px; alguns rótulos de Literatura | Redistribuir a informação para leitura móvel, em vez de reduzir tudo proporcionalmente |

Fonte do painel: [ambiente-tecnologico.css](../src/design-system/css/ambiente-tecnologico.css), regra `.vs-personalizar-painel`. Fonte do formulário: [AdminConteudo](../src/views/AdminConteudo.tsx). Detalhes e medições: [telas.json](visual-integral-2026-10-02/telas.json).

## Prioridade 3 — acessibilidade e leitura

As 56 varreduras apontaram 95 ocorrências, correspondentes a **68 combinações distintas de rota/regra/alvo**: 44 de contraste, 15 de nome de botão e 9 de nome de select. Há alertas em15 das 28 rotas. A contagem inclui o estado administrativo sem login; não equivale a 68 componentes únicos, pois componentes compartilhados podem aparecer em mais de uma tela.

- Agenda escura: textos auxiliares com contraste3,67:1, abaixo de4,5:1. [Captura](visual-integral-2026-10-02/screenshots/agenda-escuro.jpg).
- Botão principal claro em Hoje/Sessão:4,09:1; badges/botões de Recuperação/Erros:3,74:1. Corrigir os tokens e usos locais que geram esses pares, sem escurecer toda a interface indiscriminadamente.
- Podcast:12 botões de reprodução sem nome acessível; Treino2ªFase:2; Tutor:1. Os ícones precisam identificar a ação e, quando apropriado, o episódio/estado.
- Redação: seletor de banca sem nome; Tutor:2 seletores; Administração de Conteúdo:6. Relacionar rótulo visível ao campo.
- **Busca rápida:** após Tab, o foco sai do modal para a página de fundo em390/1440. Esc, nessa situação, não fecha a busca; a tecla é tratada somente dentro do diálogo. Também não retorna foco ao botão de origem. Conter o foco enquanto `aria-modal=true`, tratar o fechamento e restaurar o foco.
- Onboarding ficou dentro do viewport nos dois tamanhos testados; menu móvel abriu e fechou pelo botão interno; os cinco fundos foram aplicados e lembrados localmente.

Fontes: [BuscaRapida](../src/views/visual-boards/BuscaRapida.tsx), [Podcast](../src/views/Podcast.tsx), [Treino2aFase](../src/views/Treino2aFase.tsx), [Redacao](../src/views/Redacao.tsx), [Tutor](../src/views/Tutor.tsx). Os nós, pares de cor e testes de foco estão em `telas.json`.

## Prioridade 4 — cena própria e integração editorial

**Inglês:** Hurricanes e Stem Cells mostram terremoto/aftershocks; Global Warming e Probiotics mostram sono/memória; Digital Technology usa exemplo de patógeno. Taxonomy and Terminology abre ônibus/Maya, sem o recorte de classificação/terminologia do conteúdo. O mecanismo linguístico pode ser válido, mas o exemplo de outro tema não atende ao contrato. [Exemplo de Global Warming](visual-integral-2026-10-02/screenshots/ingles-aquecimento-global.jpg); fonte [EnglishInstrument](../src/views/visual-instruments/EnglishInstrument.tsx).

**Filosofia/Sociologia:** há pilares, cadeias e degraus específicos, além de círculos. O problema não é uma única família repetida em tudo. Nietzsche, Sócrates e Hegel usam dois círculos que trocam lugar sem explicitar genealogia, diálogo/aporia ou transformação dialética. Materialismo Histórico nomeia “efeito de retorno”, mas não o representa efetivamente. O Meio-termo aparece em escada, sugerindo avanço ao excesso em vez de discriminação contextual entre vícios. [Nietzsche](visual-integral-2026-10-02/screenshots/nietzsche.jpg); detalhes por ID em [Humanas/Redação](visual-integral-2026-10-02/humanas-redacao.md).

**Redação:** cenas novas de coerência interna, concessão, refutação e intervenção foram reconhecidas e preservadas com ajustes. Introdução/conclusão/estrutura ainda usam quem lê/voz/função/efeito; coesão/dados/revisão usam fonte A→leitura→texto sem mostrar o vínculo textual ou o dado correspondente. Os16 capítulos de domínio/repertório trocam ícone e legenda sobre LENTE→TESE/EIXO→TESE. Precisam de um exemplo completo, consequência e transformação que expliquem o próprio tópico.

**Literatura:** vários cartões distinguem movimentos/nomes por emblemas, mas não mostram como procedimento literário altera um trecho, ponto de vista, forma ou sentido.25 capítulos precisam de representação central nova. Naturalismo, Elementos da Narrativa e Poesia Concreta já oferecem relações/arranjos específicos e receberam ajuste, não condenação automática de todos os cartões. Gramática possui transformações legítimas de frases; os25 ajustes preservam esse mecanismo e pedem integração editorial. Funções Sintáticas Nominais/Vocativo precisa corrigir o recorte em relação ao conteúdo. [Linguagens](visual-integral-2026-10-02/linguagens.md).

**COP30:** separar registro/contexto/avaliação é útil, mas três folhas com linhas não representam atores, Belém, decisões e limites do caso datado. A cena precisa expor essas relações.

A regra de produto é substituir o preenchimento genérico por uma representação fiel ou explicitar que a prancha ainda precisa de autoria. Uma troca global de cor, fonte ou fundo não resolve esse conjunto. O sistema de papel/cartões e os exemplos bem resolvidos podem servir de base; [Hoje](visual-integral-2026-10-02/screenshots/hoje-celular.jpg), [Newton completo](visual-integral-2026-10-02/screenshots/newton-desktop.jpg) e [Fotossíntese](visual-integral-2026-10-02/screenshots/fotossintese-celular.jpg) são pontos de partida, sujeitos aos ajustes registrados.

## Movimento, diagnóstico e estados ainda não certificados

A prancha Equação do Fabricante/Associação de Lentes começa sem os raios no estado estático reduzido: tempo0 e traçado oculto não explicam o mecanismo sem reprodução. Solidariedade registra erro SVG `rx="undefined"`; corrigir atributo inicial explícito e conferir o estado estático.

Os testes gerais abriram os três modos de cada capítulo, mas o primeiro botão frequentemente seleciona um estado já ativo. Isso não permite declarar que todos os controles, valores extremos, erros de resposta, diagnósticos, arraste, teclado e gravação no Caderno de Erros estão corretos. A matriz de estado pedagógico e persistência permanece uma validação funcional separada.

As telas Obras/Detalhe de Obra e Administração foram vistas em estados disponíveis sem login. A ausência de conteúdo remoto nesse contexto não foi classificada como bug visual de produção. Não se certificaram catálogo carregado, formulários administrativos preenchidos, integrações reais, modais após submissão ou a aparência com todo o histórico particular sincronizado. As referências completas de inspetor/diagnóstico e tema escuro por 613 capítulos também não receberam aprovação editorial nesta rodada.

## Ordem recomendada para execução

1. Corrigir os diagramas científicos/matemáticos incorretos e associações de conteúdo trocadas; validar imagem **e** valor nos estados inicial/extremos.
2. Corrigir painel Personalizar, overflows, legendas cortadas, nomes de controles, foco da busca e pares de contraste.
3. Redesenhar por assunto os128mecanismos centrais inadequados; priorizar Inglês com tema trocado e a rotina de estudo mais usada, seguida de Redação/Filosofia/Literatura.
4. Integrar as cenas ao papel/lousa, tipografia e anotações das referências, preservando os 315 mecanismos pertinentes e aproveitando componentes de infraestrutura.
5. Validar pranchas completas em360/390, tablet/desktop, dois temas, movimento/redução, teclado/arraste e estados pedagógicos; apresentar um lote concreto para aprovação da estudante antes de ampliar sua linguagem aos demais capítulos.

## Inventário e evidências

- [Inventário completo JSON](visual-integral-2026-10-02/capitulos.json):613 entradas, recomendação, gravidade, justificativas, fontes, inspeções, flags e limites por ID.
- [Planilha CSV](visual-integral-2026-10-02/capitulos.csv).
- [Telas e acessibilidade](visual-integral-2026-10-02/telas.json).
- Pareceres: [Física](visual-integral-2026-10-02/fisica.md), [Matemática](visual-integral-2026-10-02/matematica.md), [Biologia/Química](visual-integral-2026-10-02/bio-quimica.md), [Geografia/História](visual-integral-2026-10-02/geo-historia.md), [Humanas/Redação](visual-integral-2026-10-02/humanas-redacao.md), [Linguagens](visual-integral-2026-10-02/linguagens.md).
- Capturas selecionadas versionáveis: `docs/visual-integral-2026-10-02/screenshots/`. Não contêm imagens de apostilas ou histórico privado.
- Pacote local completo de evidências e galeria filtrável: `/workspace/crivo-visual-review-2026-10-02/index.html`. Inclui capturas, scripts da revisão e registros brutos; os caminhos de imagens do inventário referem-se a esse pacote. Não é uma página publicada.

Flags automáticas de colisão, tamanho de texto e clipping são suspeitas: várias cenas mantêm grupos SVG inativos, que geram falsos positivos sem o cálculo de opacidade ancestral. Somente casos confirmados na imagem/fonte foram promovidos a achados. A classificação é uma recomendação de revisão, não atualização dos registros de qualidade ou aprovação editorial do aplicativo.
