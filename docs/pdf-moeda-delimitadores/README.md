# Moeda e delimitadores matemáticos no PDF

Um valor em reais com cifrão literal podia abrir matemática inline até o próximo valor monetário do mesmo parágrafo. Isso consumia as alternativas intermediárias e produzia uma linha sem quebra. No PDF de Funções relatado, a linha larga também fazia Chromium reduzir o documento inteiro: o fundo de largura fixa da capa encolhia, enquanto o título se recentrava no espaço disponível.

A normalização agora protege valores em reais e separa os delimitadores de matemática em bloco em linhas próprias. Código permanece literal. Nenhum texto salvo é reescrito e a integração de imagens permanece inalterada.

Regressões cobrem alternativas entre dois valores monetários, fórmula multilinha com delimitadores colados, preservação da prosa posterior e código literal. Uma reprodução sintética foi renderizada em Chromium com o exportador real: a capa voltou à escala normal, o título ficou dentro da moldura e as alternativas permaneceram em texto. O arquivo pessoal enviado foi usado apenas na investigação e não está versionado.

PDFs existentes permanecem como foram salvos. Uma nova exportação aplica a correção ao mesmo texto de origem; não recupera automaticamente prosa que já esteja ausente no texto salvo.
