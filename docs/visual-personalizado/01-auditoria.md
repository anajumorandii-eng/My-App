# 01 — Auditoria da implementação encontrada

## Versão examinada

- Base final auditada: `origin/main` em `02d0464`.
- A `main` já continha o registro de pranchas autorais e 26 componentes
  específicos para Biologia, Física, Química e Matemática.
- A integração foi refeita sobre essa base para preservar todas as pranchas
  que chegaram à `main` enquanto a análise estava em andamento.

O trabalho foi aberto numa worktree separada para preservar as alterações não
relacionadas presentes no checkout principal.

## O que já funcionava

- biblioteca de capítulos com busca e filtro;
- URL por `summaryId`;
- modos Explorar, Testar e Reconstruir;
- leitura do mesmo progresso usado pelos resumos;
- sete estados pedagógicos e confiança;
- correção graduada de reconstrução;
- intervenção mínima eficaz;
- inspetor com evidências e discordância;
- responsividade básica e `prefers-reduced-motion`;
- testes das regras e das jornadas principais.

## Por que o resultado ainda parecia básico

1. A cobertura autoral ainda não incluía As Leis de Newton, uma das referências
   visuais enviadas pela usuária.
2. A reconstrução era apresentada como grupos de botões; a instrução da
   referência aprovada pedia manipulação direta de peças.
3. As referências e as decisões ainda não estavam versionadas no mesmo lugar
   que o código e as evidências de navegador.

## Dependências encontradas

O projeto já possui React 19, `motion`, KaTeX, Recharts, Lucide e Playwright.
Não há dependência direta de React Flow, Cytoscape, D3, Mermaid ou ELK. A
primeira etapa mantém o SVG autoral existente para evitar inserir uma aparência
genérica e uma dependência antes de provar necessidade.

## Recursos locais relevantes

- `graphify`: disponível como skill e CLI para construir grafos conceituais.
- `imagegen`: disponível para ilustrações científicas específicas.
- `visualize`: disponível para prévias interativas antes da integração.
- ECC `motion-patterns`, `frontend-design-direction`, `frontend-a11y` e
  `browser-qa`.
- UI UX Pro Max para sistema visual e revisão de consistência.
