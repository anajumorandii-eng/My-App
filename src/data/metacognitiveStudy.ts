/** Perguntas de autoexplicação por área: orientam observação, não diagnosticam uma pessoa. */
export const metacognitivePrompts: Record<string, string[]> = {
  Matemática: ['Que representação torna as condições visíveis: desenho, tabela, equação ou gráfico? Por que a escolhi?', 'Quais restrições tornam meu passo válido? Consigo criar um caso em que a mesma regra não se aplica?'],
  Física: ['Que sistema e modelo estou usando? O que estou idealizando e que interação explica a mudança?', 'Consigo representar a situação, justificar o sentido das grandezas e conferir unidades sem só substituir números?'],
  Química: ['Consigo ligar o que observo à explicação em partículas e à representação simbólica?', 'Que conservação, condição de equilíbrio ou mecanismo sustenta meu raciocínio? O que mudaria se a condição fosse outra?'],
  Biologia: ['Consigo explicar o mecanismo entre estrutura, processo e função, em vez de apenas lembrar nomes?', 'Em que escala estou pensando e que mudança no sistema testaria minha explicação? Que limite ou exceção reconheço?'],
  História: ['Que agentes, relações e temporalidades sustentam minha interpretação? Estou confundindo sequência com causa?', 'O que a fonte permite afirmar e o que estou inferindo? Que evidência me faria rever a explicação?'],
  Geografia: ['Em que escala espacial e temporal a relação faz sentido? Como mapa, gráfico ou indicador altera minha leitura?', 'Estou demonstrando uma relação causal ou apenas percebendo uma distribuição? Que dado falta para distinguir as duas?'],
  Português: ['Que indício do texto sustenta minha leitura? Consigo explicar como a construção linguística produz esse sentido?', 'Qual interpretação concorrente considerei e que marca do texto permite escolhê-la ou recusá-la?'],
  Literatura: ['Quem fala, de que posição, com que limites? Que escolha formal produz o efeito que estou atribuindo à passagem?', 'Consigo ligar a passagem ao conjunto sem confundir autora, narrador e personagem? Qual outra leitura preciso testar?'],
  Redação: ['Minha tese responde ao problema? Qual é a ponte entre a evidência e a conclusão, além de apenas citar repertório?', 'Que objeção um leitor poderia fazer? Como reformular o argumento para enfrentá-la sem fugir do tema?'],
  Inglês: ['Que pistas sintáticas, lexicais e contextuais sustentam minha inferência, sem traduzir palavra por palavra?', 'Consigo explicar a função de uma expressão no texto e dizer onde ainda dependo de uma suposição?'],
  Filosofia: ['Qual é a tese, quais são as premissas e como a conclusão decorre delas?', 'Que objeção ou contraexemplo testa esse argumento? Sei reconstruí-lo sem apenas citar o nome do filósofo?'],
  Sociologia: ['Como o conceito relaciona experiência individual, instituição e estrutura social neste caso?', 'Que evidência sustenta minha explicação e que limite impede transformar um caso em regra universal?'],
};
