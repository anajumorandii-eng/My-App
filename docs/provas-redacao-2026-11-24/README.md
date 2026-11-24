# Aba Redação da teoria por banca (Famerp): evidências visuais

Tela: `/provas/famerp/teoria?parte=redacao`, com o modelo de 2024 aberto.
Capturas feitas em navegador real (Chromium via Playwright) sobre o servidor
de desenvolvimento, depois de `npm run lint`, `npm test` e `npm run build`.

| Captura | Tema | Viewport | Rolagem horizontal | Erros de console | Requisições falhas |
| --- | --- | --- | --- | --- | --- |
| `redacao-claro-desktop.png` | claro | 1366×900 | 0 | 0 | 0 |
| `redacao-claro-ipad.png` | claro | 834×1112 | 0 | 0 | 0 |
| `redacao-claro-celular.png` | claro | 390×844 | 0 | 0 | 0 |
| `redacao-claro-celular-movimento-reduzido.png` | claro, `prefers-reduced-motion` | 390×844 | 0 | 0 | 0 |
| `redacao-escuro-desktop.png` | escuro | 1366×900 | 0 | 0 | 0 |
| `redacao-escuro-ipad.png` | escuro | 834×1112 | 0 | 0 | 0 |
| `redacao-escuro-celular.png` | escuro | 390×844 | 0 | 0 | 0 |

## Análise

- **Interação:** clicar no título de um tema abre só aquele modelo (um `details`
  aberto por captura). As abas de parte da prova mostram a Redação selecionada,
  e a fileira de matérias não aparece, porque Redação não tem matéria.
- **Responsividade:** no desktop e no iPad, o parágrafo e o que ele garante na
  grade ficam lado a lado (3:2), separados por um fio. No celular, a lista
  desce para baixo do parágrafo, sem rolagem horizontal.
- **Temas:** os painéis usam `.ni-panel` e tokens; texto e fio têm contraste
  nos dois temas. Nenhuma cor fixa foi adicionada.
- **Movimento:** a tela não tem animação própria. Com movimento reduzido, a
  captura é idêntica à normal.
- **Captura:** o cabeçalho fixo foi ocultado só durante a captura, porque numa
  imagem de página inteira ele aparecia no meio da folha e traz as iniciais da
  conta. No celular aparece o link "Pular para o conteúdo", que é o atalho de
  acessibilidade visível ao receber foco depois do clique, e não um defeito.
