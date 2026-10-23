# Correção da extração AS1 — Geometria Plana

Data: 2026-10-22.

O recorte antigo começava com `Dq MO NKrAO` e `Open Save Rec Play exe Prefs`,
texto de interface capturado no OCR. Não se trata de delimitadores de LaTeX.

A fonte recuperada no Drive é **Geometria plana — ângulos e simetrias — volume 1**:
https://drive.google.com/file/d/1LY2wYXIO2vQnoq5yunu4jFe7BR2sIx1k/view

O arquivo `src/data/reviewed-apostilas/geometria-plana.json` registra o SHA-256
original, os intervalos do PDF e a paginação impressa de cada recorte. A interface
exibe somente texto e fórmulas, sem imagens das páginas ou números de página.

Foram conferidos nas imagens os recortes de introdução à geometria plana,
ângulos em triângulos, polígonos e circunferências. São trechos conceituais
selecionados; não representam a transcrição integral dos quatro volumes nem
incluem exercícios que dependem de figuras. Outros capítulos não recebem esses
recortes por aproximação.

O OCR em português foi usado como rascunho. As expressões foram recompostas e
conferidas visualmente: em particular, `(n−2)·180°` não pode ser lido como uma
soma, e as divisões dos ângulos de polígonos regulares mantêm o denominador `n`.
As fórmulas são guardadas em LaTeX e renderizadas pelo mesmo KaTeX dos guias.

Novas gerações usam o recorte conferido incluído no aplicativo antes da leitura
da referência antiga no Firestore. Guias antigos exibem o texto corrigido no
AS1 e informam que a explicação já gerada precisa ser refeita. Nenhuma resposta
antiga é reescrita silenciosamente, e nenhuma conta do usuário é alterada.

A alteração exige publicação do aplicativo e servidor para alcançar produção;
não depende de sobrescrever manualmente a coleção `apostilaReferencias`.
