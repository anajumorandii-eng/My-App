# Sexto lote — Biologia e Química

Data: 02/10/2026 (UTC). Este lote parte do estado posterior à incorporação das PRs #242–#245 e trata somente os seis casos científicos ainda registrados no parecer de Biologia/Química. Não altera autenticação, histórico de estudo, domínio, chaves de persistência nem dados do Firestore.

## Revisão científica e correções

| Capítulo | Antes | Representação deste lote |
|---|---|---|
| Segunda Lei de Mendel | O estado inicial era o quadro monohíbrido 3:1. | O estado inicial é `AaBb × AaBb`, com quatro gametas por genitor e contagem fenotípica 9:3:3:1. A ressalva sobre ligação gênica permanece. |
| Segunda Lei de Mendel e Interação Gênica | Reutilizava as quatro classes do dihibridismo sem representar interação. | A epistasia recessiva dupla é uma via de duas etapas: `A_` forma o intermediário e `B_` forma o pigmento. Apenas `A_B_` conclui a via; as demais sete combinações convergem no fenótipo sem pigmento, produzindo 9:7. |
| Sangue e Imunologia | A prancha se limitava à compatibilidade ABO. | A cena contrapõe imunização ativa e passiva: antígeno, seleção clonal, anticorpos próprios e memória na vacina; anticorpos prontos, ação imediata, duração temporária e ausência de memória no soro. O apoio diferencia leucócitos, hemácias, plaquetas e imunidade inata. |
| Termoquímica II | Exibia Lei de Hess, conteúdo associado ao capítulo I. | Exibe `ΔG = ΔH − TΔS`, o critério `ΔG < 0`, o equilíbrio em `ΔG = 0`, o peso da temperatura para `ΔS > 0` e a distinção entre espontaneidade e velocidade. |
| Composição Química Celular: Carboidratos e Lipídios | Os quatro estados eram apenas de carboidratos. | O quarto estado agora representa triglicerídeo e fosfolipídio, relacionando glicerol/ácidos graxos, reserva energética e anfipatia de membrana; o texto mostrado tem lastro no resumo do próprio capítulo. |
| Interpretando Reações Orgânicas | O rótulo `Br` da adição tocava o limite direito do `viewBox`. | Carbono e bromo foram reposicionados e o rótulo ganhou âncora central, mantendo o símbolo inteiro dentro do desenho. |

## Evidência automatizada

- Testes de prancha verificam o estado inicial dihíbrido, a via 9:7, a comparação vacina/soro e a associação de Termoquímica II a Gibbs, recusando Lei de Hess nesse capítulo.
- O contrato das cenas de fenômeno verifica que cada rótulo de carboidratos/lipídios tem desenho e lastro textual válidos.
- O teste de Química Orgânica verifica posição e âncora do bromo.
- TypeScript, build e as suítes completas Node/Vitest foram executados antes do commit.

## Revisão em navegador real e reparos

A revisão seguinte utilizou o Chromium já instalado no ambiente cloud e encontrou quatro bloqueios que os testes iniciais não cobriam:

- Gibbs usava variáveis `--mf-*` e estilos com escopo de `MechanismFrame`, ausentes na nova cena. Eixos, reta e ponto de equilíbrio agora usam as cores da própria prancha. Os rótulos também foram afastados da reta.
- Imunologia aplicava classes de grupos a formas individuais, deixando círculos pretos e conectores sem traço. As formas da cena agora recebem estilos próprios, e os conectores usam a cor da prancha.
- As duas legendas de lipídios colidiam e invadiam o quadro vizinho. Cada molécula agora tem três linhas curtas, separadas e contidas no quadro.
- `MechanismExpansion.test.tsx` ainda esperava Hess e controles de movimento no capítulo II. Agora valida a fórmula de Gibbs, equilíbrio, distinção entre espontaneidade e velocidade e ausência de controles na cena estática; as demais cenas continuam testando movimento.

`tests/e2e/science-review.spec.ts` verifica traços visíveis, preenchimentos das células, troca entre vacina e soro, ausência de colisão das legendas e contenção no quadro. São 24 casos: três cenas × duas larguras (390 e 1440 px) × dois temas × duas preferências de movimento. Os testes de regressão foram observados falhando antes dos reparos.

Para executar com o Chromium do sistema, sem baixar navegadores:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test tests/e2e/science-review.spec.ts --project=desktop
```

O caminho é opcional. Sem ele, o projeto desktop continua usando o navegador padrão do Playwright. Com Chromium do sistema, a gravação de vídeo fica desligada para não exigir o ffmpeg privado do Playwright; traces continuam disponíveis. A suíte define suas próprias larguras, mesmo quando executada no projeto desktop.

## Capturas após os reparos

Seis capturas em `revisao-navegador/` registram as três cenas corrigidas em 390 px/tema claro e 1440 px/tema escuro, com movimento reduzido. O estado de lipídios está selecionado e, no celular, a figura foi deslizada para mostrar esse quadro. A rolagem interna é parte da interface; não foi removida para a captura.

- [Gibbs — celular claro](revisao-navegador/quimica-termoquimica-ii-390-light.png)
- [Gibbs — desktop escuro](revisao-navegador/quimica-termoquimica-ii-1440-dark.png)
- [Imunologia — celular claro](revisao-navegador/biologia-sangue-e-imunologia-390-light.png)
- [Imunologia — desktop escuro](revisao-navegador/biologia-sangue-e-imunologia-1440-dark.png)
- [Lipídios — celular claro](revisao-navegador/biologia-composicao-quimica-celular-carboidratos-e-lipidios-390-light.png)
- [Lipídios — desktop escuro](revisao-navegador/biologia-composicao-quimica-celular-carboidratos-e-lipidios-1440-dark.png)

Esta revisão valida os reparos técnicos do lote. Não altera estados de aprovação editorial de outros capítulos nem certifica toda a aplicação em todos os navegadores. Nenhum login, UID, histórico real, chave de persistência ou dado do Firestore foi alterado.
