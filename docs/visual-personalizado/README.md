# CRIVO Visual personalizado

Este diretório registra a análise, a direção visual, a implementação e a
validação da reconstrução da aba Visual. O objetivo é impedir que decisões
importantes fiquem apenas em conversas ou em imagens soltas.

## Princípio de produto

> **Matéria define o universo visual e suas leis de movimento. Tópico define o
> artefato. Estado pedagógico define o comportamento.**

A tela deve permitir compreender, testar e reconstruir relações. Ela não é uma
coleção de fluxogramas decorativos.

## Documentos

- [`01-auditoria.md`](./01-auditoria.md) — diagnóstico do que foi encontrado no repositório.
- [`02-direcao-visual.md`](./02-direcao-visual.md) — gramática visual e matriz matéria/tópico.
- [`03-registro-de-implementacao.md`](./03-registro-de-implementacao.md) — mudanças efetuadas e contratos preservados.
- [`04-validacao.md`](./04-validacao.md) — testes, navegadores, tamanhos e evidências visuais.
- [`referencias-aprovadas/`](./referencias-aprovadas/) — cinco telas enviadas pela usuária em 14/09/2026 e tratadas como referência visual autoritativa desta etapa.
- [`screenshots/`](./screenshots/) — telas geradas durante a validação.

## Fontes de verdade relacionadas

- `docs/visual/README.md`: especificação funcional e pedagógica original.
- `docs/visual/assets/README.md`: transcrição das referências visuais aprovadas.
- `.claude/design-reference/nucleo-instrumental/APPROVED.md`: regra central,
  paletas e movimento por matéria.
- `src/design-system/crivoSubjects.ts`: perfis e paletas de matérias.
- `src/lib/visualStudy.ts`: estados, relações, correção e intervenção mínima.

## Estado atual

- [x] Auditoria da implementação disponível no GitHub.
- [x] Comparação com a referência aprovada.
- [x] As cinco telas aprovadas foram versionadas junto da análise.
- [x] Prancha editorial própria por matéria e palavras-chave do tópico.
- [x] Movimento específico nos artefatos, com redução de movimento respeitada.
- [x] Arrastar e soltar no modo Reconstruir, preservando clique e teclado.
- [x] Capturas finais de Física, Biologia, História, tema escuro e mobile.
- [x] Revisão visual final lado a lado com as referências aprovadas.
