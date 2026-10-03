# Briefing para o Claude — evolução do Motion Lab

## Tarefa

Evolua o artefato **AJ Motion Lab** para uma experiência educacional interativa do **CRIVO**, em português do Brasil.

Trabalhe no artefato existente, não entregue apenas uma análise, lista de sugestões ou documentação. Ao final, apresente a versão funcional e descreva objetivamente o que foi alterado.

## Objetivo pedagógico

A estudante deve percorrer esta sequência:

> **prever → manipular → observar → explicar → verificar**

A interação precisa ensinar uma relação causal. Movimento e mudança de cor só devem aparecer quando ajudarem a estudante a entender o mecanismo.

## Direção visual

Use o **Canvas cinético** como única direção do produto final.

Remova o seletor entre “Canvas cinético”, “Sistema modular” e “Campo cromático”. Essas opções eram explorações de design, não decisões que a estudante deva tomar.

Preserve uma aparência editorial, instrumental e sóbria:

- superfícies claras e bem delimitadas;
- tipografia legível e hierarquia forte;
- uma cor de destaque por estado;
- anotações diretamente sobre ou ao lado do fenômeno;
- movimento curto, explicativo e compatível com movimento reduzido;
- versão escura e layout móvel coerentes com a mesma estrutura.

## Estrutura da tela

Organize a experiência nesta ordem:

1. **Prioridade explicada** — tema recomendado e evidência que originou a recomendação;
2. **Previsão** — uma pergunta curta antes de liberar o instrumento;
3. **Instrumento do fenômeno** — controle manipulável específico para o assunto;
4. **Explicação causal** — anotação visual e cadeia de relações atualizadas pelo controle;
5. **Verificação rápida** — uma microquestão sobre o mecanismo observado;
6. **Próxima ação** — botão explícito, como “Responder 2 questões sobre crescimento”.

O instrumento permanece bloqueado até a estudante escolher uma previsão. A próxima ação permanece bloqueada até ela responder corretamente à verificação.

## Fenômenos obrigatórios

Implemente três experiências dentro da mesma casca de interface. A troca de matéria deve trocar o instrumento e o raciocínio, não apenas as cores ou os textos.

### Matemática — função exponencial

- Controle: base `a` em uma faixa válida acima de 1.
- Visualização: curva com eixos e escala legíveis.
- Marque dois intervalos iguais no eixo x.
- Evidencie que os aumentos verticais são diferentes.
- Pergunta de previsão: o que acontece quando a base aumenta?
- Relação causal: `base aumenta → fator por intervalo aumenta → curva fica mais íngreme`.
- Verificação: por que o segundo intervalo cresce mais?

### Biologia — eutrofização

- Controle: entrada de nutrientes em etapas.
- Visualização: quantidade de algas e oxigênio dissolvido.
- Mostre a cadeia inteira, não apenas partículas aumentando.
- Pergunta de previsão: o que tende a acontecer com o oxigênio após a entrada de nutrientes?
- Relação causal: `nutrientes ↑ → algas ↑ → matéria orgânica/decomposição ↑ → O₂ ↓`.
- Verificação: quem intensifica o consumo de oxigênio nessa etapa?

### Química — equilíbrio químico

- Controle: perturbação pela adição de reagente.
- Visualização: reagentes e produtos identificados textualmente.
- Explicite que equilíbrio significa velocidades iguais, não quantidades iguais.
- Pergunta de previsão: para qual sentido o sistema responde ao adicionar reagente?
- Relação causal: `reagente adicionado → velocidade direta aumenta → formação de produto aumenta até novo equilíbrio`.
- Verificação: o que se iguala no equilíbrio químico?

## Personalização verificável

Toda afirmação de prioridade deve mostrar sua origem. Use exemplos claros, como:

- “2 erros recentes nesta relação”;
- “na última resposta, faltou ligar decomposição ao consumo de oxigênio”;
- “1 previsão trocada nesta semana”.

O controle da simulação não pode alterar artificialmente o histórico, a prioridade ou o tempo recomendado. Esses dados representam evidências anteriores da estudante.

## Interação e feedback

- Registre qualquer previsão sem revelar imediatamente se ela está correta.
- Depois da manipulação, mostre o contraste entre previsão e resultado.
- Atualize a anotação e a cadeia causal conforme o controle muda.
- Em resposta incorreta, aponte qual relação deve ser revista; evite feedback genérico.
- Em resposta correta, confirme o mecanismo compreendido e libere a próxima ação.
- Use unidades, escalas e rótulos próximos ao elemento correspondente.
- Garanta que a interação continue compreensível sem animação.

## Acessibilidade obrigatória

- Documento em `lang="pt-BR"`.
- Controles nativos e operáveis por teclado.
- Foco visível em todos os elementos interativos.
- `label` e `output` associados ao slider.
- Grupos de alternativas com `fieldset` e `legend`, ou semântica equivalente.
- Mudanças conceituais anunciadas em uma região `aria-live` sem anunciar cada pequeno movimento do slider.
- SVG com título e descrição atualizados para cada fenômeno.
- Informação nunca comunicada apenas por cor, forma ou movimento.
- Alvos de toque com no mínimo 44 × 44 px.
- Respeito a `prefers-reduced-motion`.

## Responsividade

No desktop, contexto e instrumento podem aparecer lado a lado. No celular:

- use uma única coluna;
- mantenha previsão, fenômeno e explicação próximos;
- evite que uma coluna longa de controles esconda a visualização abaixo da dobra;
- permita rolagem horizontal somente no seletor compacto de fenômenos;
- faça a ação final ocupar a largura disponível.

## Restrições

- Produza um artefato autocontido, sem dependências externas obrigatórias.
- Não use dados fictícios como se fossem dados reais sem rotulá-los como demonstração.
- Não crie três skins do mesmo slider; cada matéria exige comportamento próprio.
- Não use movimento decorativo contínuo.
- Não encerre a entrega em wireframe: a interação deve funcionar.
- Todo texto visível para a estudante deve estar em português do Brasil.

## Critérios de aceite

A entrega só está concluída quando for possível verificar todos estes pontos:

- [ ] Existe uma única direção visual, baseada no Canvas cinético.
- [ ] Matemática, Biologia e Química possuem instrumentos conceitualmente diferentes.
- [ ] Cada tema apresenta uma justificativa verificável para a prioridade.
- [ ] A previsão é obrigatória antes da manipulação.
- [ ] A visualização mostra uma cadeia causal textual.
- [ ] A microquestão fornece feedback específico.
- [ ] A próxima ação só é liberada após uma resposta correta.
- [ ] Teclado, foco, leitor de tela e movimento reduzido foram considerados.
- [ ] A experiência funciona em desktop e celular.
- [ ] Não há erro no console durante o fluxo completo dos três temas.

## Entrega esperada

Entregue:

1. o artefato funcional atualizado;
2. um resumo curto das decisões tomadas;
3. os fluxos que você testou em cada matéria;
4. qualquer limitação real que ainda permaneça.
