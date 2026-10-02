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

## Limitações da evidência visual

O contêiner desta execução não contém Chromium em `/opt/pw-browsers`, nos caches do usuário nem no sistema. Por isso não foi possível produzir capturas novas ou certificar navegador real, temas, larguras e movimento reduzido nesta rodada. A validação de DOM/SVG e o build não substituem aprovação visual/editorial. Os seis registros permanecem em validação até inspeção em navegador real; nenhum outro capítulo é promovido a aprovado.
