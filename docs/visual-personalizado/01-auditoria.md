# 01 — Auditoria da implementação encontrada

## Versão examinada

- Base: `origin/claude/app-updates-mgyedd`.
- Commit inicial da auditoria: `2954ce9`.
- Implementação funcional original: `5631028`.
- Primeira revisão de direção visual: `5e13500`.
- Inclusão de glifos vetoriais: `2954ce9`.

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

1. Todos os tópicos recebiam a mesma topologia de cinco caixas alternadas em
   torno de uma linha vertical.
2. A matéria mudava principalmente paleta e um glifo pequeno no medalhão.
3. O tópico não produzia um objeto visual reconhecível. Termodinâmica, óptica e
   mecânica compartilhavam praticamente a mesma prancha.
4. A reconstrução era apresentada como grupos de botões; a instrução da
   referência aprovada pedia manipulação direta de peças.
5. A animação estava concentrada na entrada dos nós. Ela não comunicava o
   mecanismo estudado.
6. O conceito central era tipográfico, enquanto a referência aprovada usava um
   sistema científico ilustrado como centro da compreensão.

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

