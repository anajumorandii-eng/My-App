# Expansão Motion — 25/09/2026

## Base e preservação

Continuação da reconstrução das cenas em um repositório Git independente:
`C:\Users\Ana Julia\Documents\CRIVO\My-App`. Arquivos modificados e não
rastreados de `C:\wt-crivo-motion-rebuild` copiados e comparados por SHA-256;
origem preservada. Novos arquivos e evidências ficam no perfil Ana Júlia.

A main foi consultada em `d641b5b`: melhorias de movimento reduzido, pausa dos
ícones e medidores elétricos já integradas foram incorporadas pelo merge
`bc30287`. Conflito apenas no documento de continuidade, preservando ambos
os relatos. Dependências reutilizadas por junction para
`C:\wt-crivo-ecology-review\node_modules`; cache da prévia em `.scratch/vite-cache`.
Isso não migra o perfil interno do Codex nem as credenciais do Windows.

## Sete capítulos

| ID | Mecanismo |
| --- | --- |
| `summary-fisica-equacao-fundamental-da-ondulatoria` | Corda: perfil propagante, ponto oscilante, frequência e amplitude. |
| `summary-fisica-ondulatoria-ondas-eletromagneticas` | Campos E e B normalizados, transversais e em perspectiva. |
| `summary-fisica-ondulatoria-som-e-suas-propriedades` | Compressões e rarefações; partículas oscilam longitudinalmente. |
| `summary-quimica-termoquimica-i` | Perfil de entalpia, barreira de ativação e sentido do calor. |
| `summary-quimica-termoquimica-ii` | Lei de Hess: caminhos distintos, mesmo saldo. |
| `summary-quimica-evolucao-dos-modelos-atomicos` | Espalhamento alfa e níveis discretos do hidrogênio. |
| `summary-biologia-coracao-e-vasos-sanguineos` | Seis trechos ligam cavidades, pulmões e corpo. |

Lote anterior recuperado antes do commit. Nesta retomada, o elétron de Bohr
deixou de percorrer energias intermediárias: aparece somente em níveis
permitidos. Corrigida a coordenada inicial de uma trajetória alfa. Legendas
ampliadas abaixo de 600 px. Atlas anatômico e controles vasculares preservados.

## Evidências e limites

- `screenshots/mecanismos-expansao-2026-09-25/audit.json`: 56 verificações,
  sete capítulos × quatro larguras (360, 390, 768, 1440) × dois temas, sem
  overflow horizontal. 28 capturas de página em 390 e 1440 px.
- Após ampliar as legendas, as 14 capturas móveis foram atualizadas; em
  390 px, nos dois temas, nenhum texto saiu do SVG. Bohr também conferido
  no estado alternativo móvel. Estados selecionados podem variar entre as
  capturas e a primeira rodada de medições.
- Avanço da onda por teclado, início e pausa conferidos. Endotermia, caminho
  direto de Hess, Bohr e circulação pulmonar selecionados no navegador.
- Testar e Reconstruir abrem os fluxos na circulação, sem enviar respostas
  ou alterar progresso. Console consultado sem erros/avisos; atlas carregado.
- Movimento reduzido coberto por teste de componente nos sete capítulos.
  Ferramenta de navegador sem emulação dessa preferência: QA visual pendente.
- Medições e capturas não equivalem a aprovação estética ou QA completo de
  todos os estados em todas as larguras.

## Verificação técnica

- `npm run lint` e `npm run build` aprovados; aviso existente de chunks >500 kB.
- Suíte completa Vitest: 558 aprovados e uma falha do inventário executado
  durante sua atualização. Após regenerar o JSON, repetição específica de
  `visualQuality.test.ts` e `MechanismExpansion.test.tsx`: 14/14 aprovados.
  Nenhum outro teste da suíte completa falhou.
- `npm test`: Node 705/706; uma falha em `summaryCatalog.test.ts` por 14 PDFs
  de apostilas ausentes no checkout. Sem substitutos ou enfraquecimento do
  teste. Suíte de interface executada separadamente. Logs locais em `.scratch/`.

## Continuidade

Entrega aprovada pela usuária para commit em 25/09/2026. O status técnico
permanece em validação até completar as verificações pendentes; essa aprovação
não foi estendida automaticamente aos demais capítulos do catálogo.

**22 em validação, 591 sem revisão e zero aprovados**. Não representa conclusão
das 613 cenas. IDs e artefatos ativos em `fila-finalizacao-613.csv`; sequência
e critérios em [plano-finalizacao-613.md](plano-finalizacao-613.md).

Próximo lote: Física e Química, conferindo representação ativa e fontes antes
de alterar cada capítulo. Sem substituições genéricas por cor/título. Não
aprovar por presença de animação ou CI. Alterações locais, sem push/publicação.
