# Revisão do AJ Motion Lab

## Parecer

A direção mais promissora é **Canvas cinético**: ela deixa a relação entre controle, fenômeno e próxima ação mais direta. Eu não levaria as três direções visuais para o produto. “Sistema modular” e “Campo cromático” servem como estudos de linguagem, mas acrescentam mudanças de composição e cor sem esclarecer melhor o conteúdo.

## O que eu mudaria primeiro

### 1. Transformar o gráfico em explicação, não apenas reação

Hoje o controle altera a curva ou as partículas, mas a estudante ainda precisa deduzir o que mudou. A visualização deveria indicar, no próprio desenho:

- o parâmetro manipulado;
- o ponto ou região que mudou;
- a relação causal em uma frase curta;
- a unidade e uma escala legível nos eixos, quando houver.

Na função exponencial, por exemplo, eu mostraria `a > 1`, marcaria dois intervalos comparáveis e destacaria como a variação cresce entre eles. Isso conecta gesto, evidência visual e conceito.

### 2. Fazer cada matéria ter uma interação própria

O mesmo controle horizontal funciona como demonstração, mas nivela fenômenos diferentes. A interação deveria representar a ação intelectual de cada tema:

- **Matemática:** alterar a base e comparar valores ou taxas em dois intervalos;
- **Biologia:** adicionar nutrientes em etapas e acompanhar algas, luz e oxigênio como uma cadeia causal;
- **Química:** perturbar concentração, pressão ou temperatura e prever o deslocamento antes de revelá-lo.

A interface pode manter a mesma casca, mas o instrumento precisa mudar quando muda o fenômeno.

### 3. Trocar leitura passiva por previsão e contraste

Antes de atualizar a simulação, eu pediria uma previsão curta: “a curva fica mais íngreme ou mais plana?”. Depois do gesto, mostraria o contraste entre previsão e resultado. O botão final também deveria dizer o que acontecerá — por exemplo, **Responder 2 questões sobre crescimento** — em vez de “Começar atividade”.

### 4. Reduzir a competição de navegação

Há dois seletores no topo da experiência: direção visual e matéria. No produto, a direção visual não é uma decisão da estudante e deve desaparecer. A matéria pode permanecer, mas como contexto de uma fila de estudo, não como uma vitrine de três demos desconectadas.

### 5. Dar significado aos indicadores de prioridade

“Esta é sua prioridade agora” e “Prioridade atualizada” parecem personalizados, mas a tela não apresenta a evidência usada para essa decisão. Eu incluiria uma justificativa verificável, como “você errou 2 relações deste tema ontem”, e evitaria atualizar tempo ou prioridade apenas em função da posição do controle.

## Ajustes de interface e acessibilidade

- Declarar o documento como `lang="pt-BR"` em vez de inglês.
- Dar nome programático aos grupos de botões com `role="group"` ou `fieldset`/`legend`.
- Associar explicitamente o `output` ao controle e anunciar mudanças conceituais sem transformar cada movimento do slider em ruído para leitor de tela.
- Exibir foco visível também nos botões específicos do protótipo, sem depender apenas das regras globais do contêiner.
- Tornar a manipulação direta do gráfico operável por teclado ou tratá-la como alternativa ao slider, deixando isso claro nas instruções.
- Não comunicar reagentes e produtos somente por forma e cor; incluir rótulos próximos às duas regiões.
- No celular, manter visualização e explicação causal próximas. A coluna de controles não deve empurrar o fenômeno principal para muito abaixo da dobra.

## Direção recomendada

Eu consolidaria o protótipo em uma única tela baseada no **Canvas cinético**, com esta sequência:

1. contexto da prioridade e sua evidência;
2. pergunta de previsão;
3. instrumento manipulável específico do fenômeno;
4. anotação visual do que mudou e por quê;
5. microquestão de verificação;
6. próxima ação explícita e curta.

O resultado preserva o ponto forte do artefato — aprender manipulando — e remove o que hoje parece demonstração estética: três skins, métricas sem origem e movimento sem uma pergunta pedagógica clara.
