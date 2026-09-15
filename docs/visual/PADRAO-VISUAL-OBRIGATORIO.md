# Padrão visual obrigatório da aba Visual

Este documento registra a decisão explícita da Ana Júlia em 14/09/2026. Ele é
um contrato de produto e revisão. Nenhuma prancha, refatoração ou geração em
lote pode sair deste padrão.

## Referências vinculantes

As cinco imagens originais estão versionadas em
`docs/visual-personalizado/referencias-aprovadas/`. Elas definem a qualidade e
o comportamento esperados no desktop e no celular.

## Composição

1. Cada matéria e tópico recebe uma cena autoral que explique seu mecanismo.
   Trocar somente a cor, o título ou um glifo sobre uma estrutura genérica não
   conta como personalização.
2. O fenômeno, objeto, sistema ou relação central organiza a prancha. Fórmulas,
   gráficos, setas, cronologias e diagramas aparecem quando esclarecem aquele
   conteúdo específico.
3. A linguagem visual usa papel editorial quente no tema claro e lousa escura
   no tema escuro, com tipografia expressiva, anotações manuais e hierarquia
   forte. A densidade pode ser alta, mas a leitura precisa permanecer clara.
4. Um capítulo sem representação fiel mostra que precisa de prancha autoral.
   É proibido reutilizar uma ilustração de outro assunto para preencher espaço.

## Interação e diagnóstico

- Explorar, Testar e Reconstruir permanecem funcionais e alimentam a mesma
  evidência usada pelo Caderno de Erros.
- Selecionar um conceito abre diagnóstico rastreável. O inspetor fica lateral
  no desktop e se comporta como painel inferior no celular.
- Reconstrução aceita arrastar e soltar e oferece alternativa equivalente por
  clique e teclado.
- Zoom, pan ou navegação espacial entram quando a escala da prancha exigir.
- Estado pedagógico e matéria têm papéis visuais distintos; decoração nunca
  pode parecer diagnóstico.

## Movimento

Use Framer Motion, por meio de `motion/react`, para explicar mecanismo,
transição, seleção e causalidade. Movimento ornamental repetitivo não atende ao
padrão. Toda experiência deve respeitar `prefers-reduced-motion` e continuar
completa e compreensível de forma estática.

## Responsividade e acessibilidade

- Validar 360–390 px, tablet e desktop em navegador real.
- Não permitir rolagem horizontal da página.
- Preservar foco visível, nomes acessíveis, ordem de leitura e operação por
  teclado.
- Controles fixos não podem cobrir o conteúdo acionável.
- Tema claro e escuro precisam manter contraste e a mesma informação.

## Regra de entrega

Antes de enviar uma mudança visual: executar TypeScript, testes e build; abrir
as telas em navegador real; testar interação, movimento, redução de movimento,
responsividade, temas, console e rede; salvar as capturas e a análise no
repositório. Uma resposta HTTP ou testes unitários sozinhos não aprovam a tela.

O registro de pranchas autorais fica em
`src/views/visual-boards/registry.ts`. Toda nova entrada precisa de componente
próprio e cobertura que prove que ela alcança o capítulo correto sem casar com
outra matéria.
