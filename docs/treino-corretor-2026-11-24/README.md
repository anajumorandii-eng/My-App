# Treino de 2ª fase: "O que o corretor confere" (Famerp), evidências visuais

Tela: `/treino-2a-fase?banca=Famerp`, na questão "Ciclo de máquina térmica no
diagrama P × V" (Famerp 2026), depois de clicar em "Revelar gabarito comentado".
Capturas do painel da resposta em navegador real (Chromium via Playwright),
depois de `npm run lint`, `npm test` e `npm run build`.

| Captura | Tema | Viewport | Rolagem horizontal | Erros de console | Requisições falhas |
| --- | --- | --- | --- | --- | --- |
| `treino-claro-desktop.png` | claro | 1366×900 | 0 | 0 | 0 |
| `treino-claro-ipad.png` | claro | 834×1112 | 0 | 0 | 0 |
| `treino-claro-celular.png` | claro | 390×844 | 0 | 0 | 0 |
| `treino-claro-celular-movimento-reduzido.png` | claro, `prefers-reduced-motion` | 390×844 | 0 | 0 | 0 |
| `treino-escuro-desktop.png` | escuro | 1366×900 | 0 | 0 | 0 |
| `treino-escuro-ipad.png` | escuro | 834×1112 | 0 | 0 | 0 |
| `treino-escuro-celular.png` | escuro | 390×844 | 0 | 0 | 0 |

## Análise

- **Estrutura:** a seção nova fica dentro do painel que já existia, abaixo da
  resposta esperada e separada por um fio. Há um bloco por item, com a letra
  do enunciado.
- **Responsividade:** no celular, o texto quebra dentro do painel sem
  rolagem horizontal, e cada caixa de conferência fica alinhada ao início da
  linha.
- **Temas:** a seção usa as mesmas cores do painel (verde do gabarito e
  `--dim` para a nota de fonte), legíveis nos dois temas.
- **Movimento:** não há animação nova. Com movimento reduzido, a captura é
  idêntica à normal.
- **Captura:** o cabeçalho fixo foi ocultado e o painel foi rolado até o topo,
  porque a barra inferior fixa do celular cobria o fim do painel numa captura
  de elemento.
