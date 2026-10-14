/** Roteiros de treino autorais, sem atribuir cenas, citações ou teses a uma obra. */
export const literaryAnalysisCriteria = [
  'Localiza a passagem na unidade e identifica a voz sem confundir autor e narrador/eu lírico/personagem.',
  'Aponta um indício textual e descreve um procedimento formal, não apenas um tema.',
  'Explica como o procedimento produz um efeito de leitura.',
  'Relaciona a parte ao conjunto e delimita o que o trecho permite concluir.',
];
export const literaryComparisonAxes = [
  { id: 'voz', title: 'Voz e perspectiva', question: 'Quem enuncia e o que cada perspectiva permite perceber ou deixa de fora? Compare uma escolha de voz, não apenas autores.' },
  { id: 'tempo', title: 'Tempo e memória', question: 'Como o tempo é organizado e que efeito essa organização produz? Distinga tempo dos acontecimentos de ordem da narração ou disposição dos versos.' },
  { id: 'espaco', title: 'Espaço e relações sociais', question: 'Como a composição do espaço torna relações sociais perceptíveis? Mostre uma operação formal em cada passagem, em vez de equiparar cenários.' },
  { id: 'forma', title: 'Forma, imagem e linguagem', question: 'Como uma imagem, repetição, ritmo, sintaxe ou contraste organiza o sentido? A mesma palavra pode cumprir funções diferentes nas duas obras.' },
  { id: 'conflito', title: 'Conflito e posição do leitor', question: 'Que tensão cada passagem constrói e como o leitor é levado a avaliá-la? Explique a mediação da voz e da forma, sem atribuir intenção ao autor por suposição.' },
];
export const literaryBoardTraining = {
  FUVEST: ['Leia o comando e estabeleça um problema de leitura. Em alternativa, confira se cada afirmação tem apoio no trecho e na obra.', 'Explique a relação entre forma e sentido: voz, composição, imagens, ritmo, tempo, ironia ou contraste devem realizar a análise.', 'Na resposta aberta, dê a conclusão e sustente-a com evidência. Contexto histórico complementa a leitura, sem substituir o exame da passagem.'],
  UNICAMP: ['Separe os itens do comando: identificar, explicar, relacionar e comparar exigem operações diferentes.', 'Localize o indício textual necessário para cada item e descreva o procedimento que o organiza.', 'Explique o efeito e retome o pedido. Em comparação, use o mesmo critério nas duas fontes e justifique a diferença.'],
};
export function literaryStudyBlock(minutes: 20 | 40 | 60) {
  const times = minutes === 20 ? [4, 8, 5, 3] : minutes === 40 ? [8, 16, 10, 6] : [12, 24, 15, 9];
  return [{ minutes: times[0], task: 'Localize a unidade, o contexto e a edição. Leia ou releia uma passagem selecionada.' }, { minutes: times[1], task: 'Escreva indício → recurso → efeito → relação com a obra. Se a unidade ainda não foi lida, concentre o bloco na leitura.' }, { minutes: times[2], task: 'Confira a análise publicada e reescreva o ponto que ficou apenas em resumo ou rótulo.' }, { minutes: times[3], task: 'Oculte a ficha e recupere a relação de memória. Formule uma comparação ou transferência para outro trecho.' }];
}
