# Correção guiada das discursivas (Treino de 2ª fase): evidências visuais

Tela: `/treino-2a-fase?banca=Famerp`, questão "Ciclo de máquina térmica no
diagrama P × V" (Famerp 2026). Capturas em Chromium (Playwright) com
critérios marcados como completo, parcial e faltou, e com o motivo de cada
ponto perdido.

| Captura | Tema | Viewport | Rolagem horizontal | Erros de console |
| --- | --- | --- | --- | --- |
| `guia-celular.png`, `correcao-celular.png` | claro | 390×844 | 0 | 0 |
| `guia-desktop.png`, `correcao-desktop.png` | escuro | 1366×900 | 0 | 0 |
| `guia-ipad.png`, `correcao-ipad.png` | claro | 834×1112 | 0 | 0 |

## Análise

- **Guia:** "Como corrigir uma dissertativa" aparece antes da resposta ser
  revelada, fechado por padrão.
- **Correção:** cada critério do corretor tem três estados (Completo, Parcial,
  Faltou), com cor e ícone, e não só cor. Parcial e Faltou abrem "Onde perdeu o
  ponto?", e o botão de salvar só libera quando todo ponto perdido tem um
  motivo.
- **Nota:** a nota estimada é atualizada a cada marcação (2,5 de 4 no cenário
  capturado) e vem com o aviso de que a banca não publica a divisão interna.
- **Celular:** a primeira captura mostrou o cartão estourando a largura. A
  causa era o texto longo nas opções do `<select>` e o `fieldset` sem
  `min-width: 0`. Agora a opção traz só o rótulo, e a explicação aparece
  abaixo do seletor. Recapturado sem estouro.
- **Captura:** o cabeçalho fixo foi ocultado durante a captura. No celular,
  a barra inferior fixa aparece por cima de parte do painel na captura de
  elemento; na tela real, a rolagem a afasta.
