# Plano de continuidade — análise de incidência

Retomada em 22/10/2026: PR conferida aberta em rascunho, sem merge, head f0fd5f5d.
ENEM2024, UNESP2025 e UNIFESP2022 concluídos nesta retomada. Agregação e integração das 16 edições disponíveis concluídas; classificações restantes adiadas pela usuária.
Branch: `codex/expansao-incidencia-2017-2026`. PR: #351, em rascunho.
A recuperação inicial da PR #350 já foi integrada à main.

## Escopo de publicação atualizado pela usuária

A instrução posterior “ignora por agora essa etapa. usa o que tem” adiou as
classificações restantes e autorizou agregar/integrar as **16 edições completas
existentes (1.653 registros, 34 cadernos)**. Esta decisão substitui, para esta
publicação, a condição original de esperar as 20 edições. As quatro edições
adiadas são UNESP2026 e ENEM2021–2023: não entram no gerador, denominadores,
recorrência nem exemplos publicados. Não classificado não é zero.

- ENEM: 2024–2025, 362 registros, quatro cadernos.
- UNESP: 2022–2025, 556 registros, dez cadernos; formatos 2022/2023 separados.
- FAMERP: 2022–2026, 505 registros, dez cadernos.
- UNIFESP: 2022–2026, 230 registros, dez cadernos; reaplicação válida de2024.
- FUVEST e Unicamp preservadas; ranking pessoal FUVEST mantém2022–2026.

O gerador usa uma lista explícita de edições completas e declara também os anos
planejados. Não detecta arquivos parciais como completos nem preenche lacunas.
O teste ativo dos corpus deve exigir16/34/1653 nesta publicação. O teste proposto
original de20/43/2323 fica em `pendencias/` para uma expansão futura.

Rascunho adicional preservado: `rascunhos/unesp-2026-parcial.json`,45 fichas
objetivas01–45. As90 objetivas foram lidas e páginas2–38 vistas; faltam redigir
46–90, ler/classificar as37 unidades de segunda fase, revisar e auditar. Há uma
ressalva a registrar emQ54: a alternativaE contrapõe radar a sensores que “não
operam com ondas eletromagnéticas”, mas sensores ópticos também as utilizam;
a vantagem pretendida é a menor limitação por nebulosidade em micro-ondas.
Rascunho totalmente fora das entradas e exports do gerador.

Agregação e integração concluídas; resultados e limites da validação em
`VALIDACAO-INTEGRACAO.md`. Não fazer merge automático.

## Entregue e preservado

FUVEST: primeira fase 2017–2026, segunda fase 2022–2026; 1.135 registros em
20 cadernos, com 898 objetivas válidas. Comparação entre 2017–2021 e
2022–2026 implementada, downloads e auditorias salvos. Ranking pessoal mantém
as 15 coortes recentes. Não refazer essa classificação.

As outras bancas têm **16 edições completas, 1.653 registros**, com
integração na interface e publicação de seus corpus agregados:

| Banca | Edições completas | Registros completos | Pendências |
|---|---|---:|---|
| FAMERP | 2022–2026 | 505 | Sem pendência de integração |
| UNIFESP | 2022–2026 | 230 | Sem pendência de integração |
| UNESP | 2022–2025 | 556 | Classificar 2026 |
| ENEM | 2024–2025 | 362 | Classificar 2021–2023 |

Arquivos completos: `scripts/data/board-incidence/BANCA/ANO.json`.
Auditorias: `docs/estudos-2026/incidencia-multibancas/auditoria-*.md`.
Fontes de todos os 43 cadernos, hashes, páginas e versões identificadas:
`fontes-descobertas-2021-2026.json`. Os arquivos completos passaram pela
validação estrutural, taxonômica e conferência de fontes no checkpoint.

## Rascunhos preservados, fora do gerador

- `rascunhos/enem-2024-parcial.json`: rascunho histórico superado. Edição
  completa em `scripts/data/board-incidence/enem/2024.json`, 181 fichas,
  chave CD2 Inglês/CD5 pareada e anulação102 preservada. Auditoria própria
  registra releitura D2, figuras, revisão editorial D1 e 23 ressalvas.
- `rascunhos/unesp-2025-parcial.json`: rascunho histórico superado. Edição
  completa em `scripts/data/board-incidence/unesp/2025.json`, 127 unidades
  90/24/12+R, auditoria própria, fontes e chave objetiva conferidas.

Não mover rascunhos para a pasta de classificação completa antes de concluir
as fichas e a auditoria. Não preencher lacunas por inferência.

## Plano original de expansão (etapas de classificação restantes adiadas)

1. Conferir branch/PR e os arquivos salvos; preservar alterações posteriores.
2. ENEM2024 e UNESP2025 concluídos a partir dos rascunhos, sem repetir trabalho
   já documentado. Salvar cada edição completa e sua auditoria.
3. UNIFESP2022 concluída; UNESP2026 e ENEM2021–2023 adiados pela usuária. Em uma retomada, classificar a partir das fontes
   inventariadas; Inglês no ENEM. Não expandir Unicamp nesta tarefa.
4. Concluído: rótulos harmonizados e casos de confiança média/baixa revistos conforme auditorias.
5. Concluído nesta publicação autorizada com16 arquivos completos:
   `node --import tsx scripts/buildBoardIncidence.ts`.
   O gerador exige todas as edições da lista explícita atual e valida todas as bancas antes de publicar exports. Os anos adiados permanecem na janela planejada, sem denominador.
6. Concluído: `ExamIncidenceExplorer` integrado na view de Prioridades e substituídas as
   amostras antigas das quatro bancas em `examEvidence.ts`, sem duplicação;
   Unicamp existente e janela recente FUVEST preservadas.
7. Teste ativo `src/lib/boardIncidenceCorpus.test.ts` adaptado ao escopo
   autorizado16/34/1653, incluindo cobertura ausente, formatos separados,
   reaplicaçãoUNIFESP2024, redação sem chave objetiva e Inglês/anulaçõesENEM.
   A proposta original20/43/2323 permanece em `pendencias/` para expansão futura.
8. Lint, testes, build e QA desktop/celular executados; fontes, downloads,
   filtros e estados sem cobertura validados. Resultados e eventuais ressalvas
   em `VALIDACAO-INTEGRACAO.md`; descrição da PR atualizada com escopo final.
   Não fazer merge automático.

## Decisões de fonte que devem permanecer

- UNESP2022: primeira fase de Biológicas para Medicina, aplicação14/11/2021;
  não misturar com Exatas/Humanas. Segunda fase2022/2023 é objetiva60+R;
  2024–2026 tem dias discursivos separados em grupos próprios.
- UNIFESP2024: usar específicos da reaplicação07/02/2024, caderno004. A prova
  original cancelada e os atos ficam apenas como documentação, sem duplicar20
  questões. Q07 tem redação química ambígua e Q18 está sem medida angular
  legível no PDF consultado; não inventar ângulo ou solução numérica.
- ENEM: amarelo D1CD2/D2CD5; somente Inglês nas opcionais. Em2025,
  115/121/178 anuladas; em2024,102. Preservar no arquivo e excluir da frequência.
- Espelhos discursivos públicos não localizados ficam com URL/hash nulos e
  limitação explícita. Não atribuir à redação o gabarito objetivo.
- Fonte espelhada não deve ser apresentada como domínio oficial. O inventário
  registra a proveniência. PDFs/imagens/textos extraídos permanecem no scratch;
  o Git conserva fontes, hashes, classificações e auditorias.

## Verificações históricas e ferramentas preservadas

FUVEST: lint e build aprovados; suíte completa com1.190 testes Node aprovados
(um ignorado) e3.276 testes de interface em248arquivos. Chromium desktop e
celular passou: largura390sem vazamento, CSV200, cobertura ausente explícita,
Medicina60/60. Detalhes em `../fuvest-incidencia/expansao-2017-2026.md`.

No checkpoint, os13 JSON completos passaram novamente pelo validador de
estrutura, IDs, páginas, estratégias e correspondência de fontes.
O teste dos corpus ainda não produzidos foi preservado como texto, sem
introduzir testes ativos que dependam de arquivos inexistentes.

Scratch da sessão, caso o ambiente seja mantido:
`/workspace/work/board-source-discovery/` (PDFs/textos e manifesto local),
`/workspace/work/board-incidence/` (rascunhos, leituras, validações),
`/workspace/work/fuvest-expansion/` (QA e logs). Os dados editoriais necessários
à retomada estão versionados; as fontes podem ser baixadas pelos links/hashes.

No checkpoint anterior, a repetição adicional da suíte foi interrompida a pedido de encerramento imediato. Esse registro é histórico. Os resultados da integração atual, conectada ao runtime, estão em `VALIDACAO-INTEGRACAO.md`.
