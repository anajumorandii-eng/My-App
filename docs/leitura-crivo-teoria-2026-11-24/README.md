# Leitura Crivo na teoria por banca: evidências visuais

Cada card da teoria por banca (objetiva e discursivas) e cada redação-modelo
ganharam o botão "Leitura Crivo", que abre o conteúdo no leitor que o app já
usa nos resumos e nas obras. Capturas em Chromium real (Playwright), depois de
`npm run lint` e `npm test`.

| Captura | Tela | Viewport | Seções no índice | Respostas abertas | Erros de console |
| --- | --- | --- | --- | --- | --- |
| `leitura-disc-desktop.png` e `-2` | Química, "Pilhas, baterias, eletrólise e corrosão" | 1366×900 | 19 | 0 | 0 |
| `leitura-redacao-celular.png` e `-2` | Redação 2024, "Racismo ambiental no Brasil" | 390×844 | 5 | 0 | 0 |

## Análise

- **Índice:** o índice sai dos títulos do card ("Como a Famerp cobra", "O
  mecanismo", os subtítulos numerados, "Fórmulas", "Armadilhas") e permite
  pular direto para cada parte.
- **Capa:** a matéria, a banca e o propósito ("Guia de estudo das
  discursivas", "Redação-modelo comentada") vêm dos atributos `data-print-*`
  do card.
- **Sem entregar resposta:** a resolução dos exemplos e a resposta-modelo do
  treino discursivo levam `data-review-answer-key` e continuam fechadas na
  leitura, como na tela. Nenhuma estava aberta nas capturas.
- **Fora da leitura:** o link de treino fica de fora (`data-reader-exclude`),
  porque não faz sentido num caderno de consulta.
- **Celular:** no celular, o leitor mostra o título, a capa e o conteúdo em
  coluna única, sem rolagem horizontal.
