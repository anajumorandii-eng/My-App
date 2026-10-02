# Quinto lote: matemática e acesso aos controles

Base: `b61b0518`, após a integração da PR #244. Branch: `fix/matematica-probabilidades-sequencias`. Escopo: 13 capítulos e cinco telas; sem alteração do histórico real, dependências, registro de cobertura ou aprovação editorial.

## Correções

| Capítulo | Relação demonstrada |
|---|---|
| O Problema do Grupo | Os números acompanham a posição de cada pessoa selecionada. |
| Operações com Probabilidades | Dez resultados equiprováveis: quatro em A, três em B, interseção 0–3 e união 7−interseção. B fica dentro de A quando todos os seus resultados são compartilhados. A área dos círculos não mede probabilidade; os resultados numerados permitem contagem. |
| Eventos Disjuntos e Eventos Independentes | Disjunção sem sobreposição; independência com P(A)=P(B)=0,5 e P(A∩B)=0,25. A legenda identifica o desenho como qualitativo. |
| Relações Trigonométricas em Polígonos | O raio circunscrito muda na mesma escala do triângulo, mantendo todos os vértices na circunferência. |
| Outras Razões Trigonométricas | A inclinação do triângulo acompanha θ e tan θ. |
| O Universo Tridimensional | Duas retas mudam entre paralelas, concorrentes e reversas. Nas reversas, os segmentos pertencem aos planos separados desenhados. |
| Introdução ao Estudo Analítico das Cônicas | Cone duplo com vértice comum: hipérbole corta duas folhas, parábola usa plano paralelo à geratriz e elipse corta uma folha. Trata-se da seção meridiana que identifica a orientação do corte, não uma renderização tridimensional da curva de interseção. |
| Funções Bijetoras | Quatro elementos alcançam realmente duas, três ou quatro imagens; bijeção exige quatro imagens distintas. |
| Progressão Aritmética | Todos os termos permanecem visíveis para r de −3 a 6. |
| Progressão Geométrica | Uma única transformação linear representa os termos para q de −2 a 4, inclusive zero e sinais alternados, sem saturar valores maiores. |
| Lugar Geométrico e Equação da Circunferência | Nota de comparação com o raio afastada das graduações. |
| Distância entre um Ponto e uma Reta | Nota do pé da perpendicular afastada das graduações. |
| A Geometria dos Números Complexos | Nota do módulo afastada das graduações. |

PA e PG exibem os limites da escala usada em cada estado e a linha zero. Essa escala adapta o enquadramento entre estados, mas preserva as relações entre todos os valores dentro de cada estado.

As notas “centro” e “conjugado” também receberam proteção contra graduações e nome do ponto. O cabeçalho compartilhado dos instrumentos analíticos conserva uma casa decimal, inclusive em zero: a apresentação variável anterior alternava a classe de tamanho da condição e deslocava a figura durante o arraste. As coordenadas e leituras matemáticas continuam as mesmas.

Podcast passa a identificar episódio e estado do botão de áudio. Treino da 2ª Fase identifica iniciar/pausar/reiniciar cronômetro. Tutor identifica tópico, capítulo, bancas e envio. Redação identifica a banca. Administração de Conteúdo distingue seus seis seletores e confina os campos à coluna móvel, removendo o mínimo intrínseco imposto pelas opções longas.

## Regressões e revisão

Os testes dirigidos observaram falhas antes das correções. A revisão independente identificou a contenção B⊆A e os segmentos fora dos planos; ambas receberam testes geométricos e correção antes da validação final. Os testes contam pertencimento por distância real ao círculo, imagens pelos destinos e contenção por polígono convexo. A inspeção das capturas e estados extremos levou às regressões adicionais de margem dos numerais, nomes dos pontos, outras notas e estabilidade do cabeçalho durante o arraste.

Verificações de navegador realizadas em Chromium de produção:

- Matriz de dez configurações: 360/390/768/1440 px em claro/escuro com movimento reduzido, mais celular claro e desktop escuro com movimento padrão. São 440 estados de matemática, operação por Home/End e 50 aberturas das cinco telas com regras `button-name` e `select-name`, sem alertas dessas regras ou rolagem horizontal.
- Na versão com as proteções finais: 240 estados das notas (inicial e nove pares de coordenadas por capítulo/tamanho/tema) e 32 estados dos numerais de probabilidade. Os limites são medidos por caixas reais dos textos; as notas não sobrepõem graduações nem o nome do ponto, e os numerais permanecem inteiros nas respectivas regiões.
- Seis arrastes em celular claro/desktop escuro conferem o ponto sob o ponteiro; o cronômetro funciona por teclado e os seletores das outras abas do Tutor têm nomes. O cabeçalho mantém exatamente a mesma altura entre coordenadas iniciais e zero: 198,109375 px no celular e 147,4375 px no desktop.
- 66 capturas versionadas: cenas iniciais/extremas, cinco telas e cabeçalho antes/depois. As capturas dos diagramas registram as mudanças de geometria/legendas; as quatro capturas do cabeçalho registram também o ajuste final de apresentação.

A matriz ampla passou antes dos últimos ajustes de margem/notas/cabeçalho; os testes dirigidos posteriores conferem especificamente essas mudanças finais. Os 13 cenários de Playwright foram executados em grupos, não em uma única execução integral. A checagem de nomes de controles não constitui certificação integral de acessibilidade.

Validação definitiva: **1.652 testes aprovados**, com zero falhas — 787 Node e 865 Vitest em 143 arquivos. TypeScript e build de produção aprovados. Os 47 testes dirigidos incluem as regressões acima e os dois casos preexistentes do instrumento final de matemática. Matriz de cobertura conferida sem alterar seus registros; `git diff --check` limpo.

## Limites

As cinco telas são inspecionadas nos estados disponíveis sem autenticação; fixtures dos testes exercitam outros estados de controles. Não foram enviados áudios, solicitações ao tutor, correções de redação, cadastros ou migrações administrativas. A revisão dos outros achados do inventário e a aprovação editorial integral continuam pendentes.
