# Quinto lote visual — plano de execução

**Objetivo:** corrigir achados pendentes de matemática e acesso aos controles em um lote publicável por PR.

**Arquitetura:** preservar os instrumentos e modelos existentes; ligar seus parâmetros à geometria real e associar rótulos aos controles. Os três grupos independentes compartilham somente a validação final.

**Tecnologias:** React, TypeScript, SVG, Vitest, Playwright/Chromium.

**Especificação:** `docs/REVISAO-VISUAL-INTEGRAL-2026-10-02.md`, parecer de Matemática e `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`.

## Restrições

- Base `b61b0518`; branch `fix/matematica-probabilidades-sequencias`, conforme autorização atual da estudante.
- Sem escrita no histórico real, alteração de chaves de progresso, dependências ou cobertura editorial.
- Validar 360/390, tablet e desktop, claro/escuro, movimento normal/reduzido e teclado.
- Executar compilação e navegador separadamente pelo limite de memória.
- Publicar PR automaticamente; não realizar merge.

## Grupos e verificações

1. `RemainingMathInstrument.tsx` e testes: grupo com números centrados, união com cardinalidade correta, disjunção sem interseção, independência com interseção produto, raio circunscrito proporcional, ângulo trigonométrico real, relações espaciais distintas, cortes do cone consistentes e bijeção com número real de imagens.
   - [x] Observar regressões falharem antes das correções.
   - [x] Corrigir cada causa e verificar sua geometria e leitura nos extremos.
2. `SequenceInstrument.tsx`, CSS/testes e `AnalyticInstrument.tsx`/testes: PA/PG inteiras visíveis com escala afim, sem saturação; notas analíticas afastadas das graduações.
   - [x] Observar regressões de recorte, saturação e sobreposição.
   - [x] Validar sinais, razão zero, extremos e movimento do ponto por teclado.
3. `Podcast`, `Treino2aFase`, `Tutor`, `Redacao`, `AdminConteudo` e testes: nomes de ações identificam contexto/estado; selects têm rótulos; formulário administrativo cabe no celular.
   - [x] Observar falhas de nomes acessíveis antes de associar os campos.
   - [x] Validar estados disponíveis sem autenticação e formulários com fixtures em testes, sem acionar serviços reais.
4. Integração: suíte geral, lint e build; navegador de produção verificando SVG, nomes acessíveis e limites; capturas e relatório.
   - [x] Revisar mudanças com uma segunda leitura independente.
   - [x] Rodar verificações e registrar resultados e limitações.
   - [ ] Commit, push, PR e checks remotos.

## Foco de revisão

- Interseção zero e imagens repetidas devem mudar a estrutura, não apenas a legenda.
- Valores negativos/zero da PG devem manter os termos e escala matematicamente fiéis.
- Reversas devem explicitar profundidade; interseção aparente da projeção não é encontro espacial.
- Parábola deve usar plano paralelo à geratriz; hipérbole deve cortar as duas folhas.
- Nenhum rótulo, nome de controle ou ajuste móvel pode mudar operações de persistência ou conteúdo autenticado.
