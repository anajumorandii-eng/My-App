# Inspeção visual dos 613 capítulos

Direção solicitada: moderna, bonita e funcional, com objetos em relevo relacionados ao conteúdo de cada capítulo. O catálogo tem **613 capítulos de 14 matérias**, todos com uma representação principal já existente.

## O que esta entrega modifica

- Associação explícita entre cada ID do currículo e seu objeto: 152 modelos de órgãos, organismos, sólidos, instrumentos, mapas, estruturas de linguagem e objetos históricos. Capítulos próximos podem compartilhar o objeto apropriado; não são 613 esculturas diferentes.
- Ícones com estética 3D: volumes vetoriais, materiais, bisel e sombra. São leves e estáticos; a interação continua nos cartões, conceitos e figuras. Não são novos modelos WebGL.
- Mesmo objeto na biblioteca, no cabeçalho da cena e na raiz do mapa de conceitos. Os ícones das etapas continuam expressando a função pedagógica da etapa.
- Cabeçalhos com hierarquia editorial, cor da matéria e maior presença do objeto; molduras, sombras e espaçamento coerentes com o visual aprovado.
- Botões, seletores, controles deslizantes e abertura do percurso com altura mínima de 44 px; foco de teclado visível.
- Partes não selecionadas de figuras de Biologia e Química mais legíveis, preservando o destaque da seleção e os estados realmente ocultos. Estruturas de seis capítulos de Química Orgânica acima da legenda, com espaço suficiente para ler as fórmulas.
- Títulos longos da biblioteca completos no celular, com a identificação da matéria menor que o título.
- Percurso de conceitos disponível em Explorar em todas as matérias. A seleção abre o mesmo inspetor e encerra o foco ampliado para que ele seja acessível. Selecionar não registra domínio nem cria evidência de aprendizado.

## Critérios usados na inspeção

1. Correspondência entre objeto, título e assunto; figuras científicas devem continuar explicando o mecanismo.
2. Hierarquia, espaçamento, contraste da seleção e leitura nos fundos claro e escuro.
3. Ausência de rolagem horizontal da página; pranchas largas conservam a navegação interna e a escala legível.
4. Controles utilizáveis por toque e teclado; ampliação, Escape, seleção de conceitos e modos Testar/Reconstruir funcionando.
5. Sem ornamentação animada em loop. A preferência de movimento reduzido é respeitada.

## Limites da verificação

A inspeção visual cobre a abertura de cada cena, em desktop claro e celular escuro, e seus controles. As folhas de contato permitem conferir os 613 capítulos individualmente. Os testes de interação complementam as capturas. Isso não substitui uma aprovação pedagógica formal de cada texto, nem executa todas as combinações numéricas possíveis de cada simulador.

Os mecanismos e conteúdos já adequados foram preservados. Não houve troca arbitrária de gráficos, esquemas ou simuladores por ilustrações decorativas. O inventário formal de aprovação pedagógica permanece com seus estados anteriores.

## Evidências

- [Índice dos 613 capítulos](INDICE.md): links para as 77 folhas de contato finais, lidas individualmente na inspeção.
- [Resultado por capítulo](resultado-613.json): objeto escolhido, ajustes, comparações e verificações de interação.
- [Galeria dos 152 modelos](GALERIA.md) e [exemplos ampliados de antes/depois](EXEMPLOS.md).
- [Acessibilidade](acessibilidade.json), [biblioteca](biblioteca.json) e [verificação de código](verificacao.json).
- [Guia para continuar e repetir a inspeção](CONTINUIDADE.md).

A rodada final tem **1.226 capturas/verificações aprovadas**: todos os 613 capítulos em desktop claro (1440 × 1100) e celular escuro (360 × 1100). Cada cena abriu sua representação nativa; a página não apresentou rolagem horizontal nem erro de execução. Os controles visíveis foram conferidos para detectar alvos abaixo de 40 px; botões, seletores, deslizantes, abertura do percurso e escolhas de sólidos têm mínimo de 44 px no CSS. O marcador pequeno do rádio faz parte do rótulo clicável maior.

A seleção de conceitos por teclado e o acesso ao inspetor passaram nos **613 capítulos em tablet de 834 px**. Em 14 capítulos representativos, um de cada matéria, foram conferidos **84 estados** de foco e responsividade e realizadas **28 verificações axe**, sem violações detectadas nessa amostra. A biblioteca passou nos filtros das 14 matérias nos dois temas, com os objetos corretos em todos os cartões.

Três capturas iniciais do tema escuro mostravam carregamento e foram descartadas como comparação: Língua — um Sistema Complexo; O Estado Gasoso; A Dissertação no Vestibular: Mitos e Verdades. A rotina passou a esperar a representação nativa. As capturas finais desses capítulos foram refeitas. Lotes interrompidos por perda de contexto ou pressão de memória também foram repetidos; as falhas de execução não foram convertidas em aprovação.

Verificação de código concluída: `npm run lint`, suíte completa `npm test` (**943 testes de servidor/bibliotecas + 1.409 de interface = 2.352**) e `npm run build`, todos com saída 0. A última suíte completa usou dois processos de interface (`VITEST_MAX_WORKERS=2`) após encerrar os lotes do navegador.

## Cobertura do catálogo

| Matéria | Capítulos |
|---|---:|
| Física | 85 |
| Atualidades | 1 |
| Biologia | 72 |
| Geografia | 63 |
| História | 49 |
| Língua Inglesa | 17 |
| Redação | 58 |
| Gramática | 26 |
| Literatura | 37 |
| Entendimento de Texto | 12 |
| Matemática | 83 |
| Química | 48 |
| Filosofia | 35 |
| Sociologia | 27 |
| **Total** | **613** |

