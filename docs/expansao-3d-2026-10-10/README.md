# Verificação integral e expansão espacial — 10/10/2026

Esta entrega amplia **16 capítulos** com modelos próprios do assunto, rotação por arraste/toque, setas e Home, controles com alvos de 44 px e descrição textual. Os capítulos com processos têm reprodução finita, pausa e controle de etapa; movimento reduzido entrega o estado completo. A câmera não modifica grandezas físicas. São projeções SVG de coordenadas tridimensionais, integradas aos instrumentos existentes.

Base conferida: `origin/main` em `cb8452253ce6706690db3e0e9826562a1c756b14`, posterior à integração da PR #299. Trabalho em checkout isolado; mudanças locais do checkout anterior preservadas.

## Capítulos desta parte

| Área | Capítulo | ID |
| --- | --- | --- |
| Biologia | Membranas Celulares | `summary-biologia-membranas-celulares` |
| Biologia | Ácidos Nucleicos | `summary-biologia-acidos-nucleicos` |
| Física | Campo Magnético devido à Corrente em Fio Reto e Espira: Descrição Vetorial e Aplicações | `summary-fisica-campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes` |
| Física | Força Magnética e Análise de Lançamentos de Cargas em um Campo Magnético Uniforme | `summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme` |
| Física | Ondulatória: Ondas Eletromagnéticas | `summary-fisica-ondulatoria-ondas-eletromagneticas` |
| Geografia | Coordenadas Geográficas | `summary-geografia-coordenadas-geograficas` |
| Geografia | Movimentos da Terra | `summary-geografia-movimentos-da-terra` |
| Matemática | Cubos e Paralelepípedos | `summary-matematica-cubos-e-paralelepipedos` |
| Matemática | Prismas | `summary-matematica-prismas` |
| Matemática | Pirâmides | `summary-matematica-piramides` |
| Matemática | Sólidos de Revolução | `summary-matematica-solidos-de-revolucao` |
| Matemática | Razões entre Volumes de Sólidos | `summary-matematica-razoes-entre-volumes-de-solidos` |
| Química | Ligações Químicas e Alotropia | `summary-quimica-ligacoes-quimicas-e-alotropia` |
| Química | Geometria Molecular | `summary-quimica-geometria-molecular` |
| Química | Polaridade das Ligações e das Moléculas | `summary-quimica-polaridade-das-ligacoes-e-das-moleculas` |
| Química | Isomeria | `summary-quimica-isomeria` |

Os sólidos mantêm medidas e relações de volume; moléculas mantêm ângulos e pares eletrônicos. Isomeria permite cis/trans e imagem especular. A membrana compartilha o mesmo ciclo 3 Na⁺/2 K⁺ do mecanismo original. A trajetória magnética mantém as relações entre velocidade, força e campo; fio e espira explicitam o sentido da corrente. Ondas mantêm E e B em fase, perpendiculares entre si e à propagação. Terra usa os cálculos existentes de declinação e duração do dia, com eixo físico fixo de 23,44°. Diamante e grafite representam redes, sem tratar todo composto covalente como molécula isolada.

Os modelos explicam suas simplificações: fragmentos de rede, dimensões fora de escala, globo sem continentes, marcador de latitude sem longitude urbana real e espira qualitativa. A proteína da membrana não afirma reproduzir a conformação molecular da ATPase.

## Verificação e evidências

- Inventário: **613 IDs únicos em 14 matérias**, correspondentes entre catálogo, cobertura e ícones; 8 experimentos, 43 pranchas, 375 instrumentos, 187 cenas, zero fallback.
- Navegador na base: **1.226 registros**, cobrindo todos os 613 capítulos em 360 px/escuro/movimento reduzido e 1440 px/claro/movimento normal. Não equivale a 12 configurações para todos os capítulos.
- Expansão: 12 capítulos em 12 configurações (360/834/1440 px × claro/escuro × reduzido/normal), **144 verificações**; quatro capítulos complementares em outras **48 verificações**. Verificações de teclado, restauração, arraste real, toque em celular/tablet, parâmetros, controles, overflow, IDs de SVG e erros de execução. Resultados consolidados em `validacao.json`.
- Outros sete capítulos de Atualidades/Química Orgânica: 28 verificações, após correções de estilos carregados de forma implícita, contraste e semântica acessível.
- Lógica: **961 testes aprovados**. Interface: **187 arquivos / 1.536 testes**, executados em lotes; lotes afetados revalidados. Ver o resultado final consolidado em `ui-batches-summary.json`.
- TypeScript, build de produção, integridade da fila e `git diff --check`: verificação final realizada. Build mantém avisos de tamanho de chunks preexistentes.
- Lighthouse, snapshot de Isomeria em 360 px: acessibilidade 100 e boas práticas 100. Resultado limitado a essa tela; SEO 60, com descrição/robots pendentes. `lighthouse-final.json` não certifica todas as rotas.

As primeiras capturas integrais reutilizaram um rodapé que esperava 15 IDs; o manifesto corrigido confirma os 613 registros sem alterar os registros originais. No primeiro teste do DNA, o capturador precisava abrir “Dupla-hélice 3D”; o seletor foi corrigido. No globo das estações, o teste revelou clipping de um estilo histórico das figuras; a largura específica foi corrigida antes da repetição. As evidências originais permanecem no diretório local, com os resultados iniciais preservados. Houve uma falha de tempo no teste de Visual sob carga; a repetição isolada e a repetição do lote estão documentadas.

## Continuidade e limites editoriais

A auditoria técnica e a expansão desta parte **não aprovam editorialmente os 613 capítulos**. O registro formal continua com 81 em validação e 532 não revisados, sem promover aprovação automaticamente. A primeira passagem pedagógica está documentada para 69 capítulos: 49 de História e 20 de Geografia; outros **544** permanecem na lista `pending.csv`.

A fila histórica mantém 43 achados a revalidar, 255 tratados e 315 mecanismos preservados. A contagem de resumos profundos foi reconciliada: 612 registros, com 42 na revisão 1, 489 na 2, 78 na 3 e 3 na 4. O validador agora reconhece revisão 4. Essa reconciliação não trata os 42 resumos de Redação pendentes.

`candidatos.json` é uma triagem lexical de 95 possíveis necessidades espaciais, com falsos positivos possíveis; **não é uma lista de 95 lacunas confirmadas**. Os IDs atendidos nesta parte estão marcados sem aprovação editorial. Próxima etapa: confrontar os demais candidatos com o mecanismo e a fonte do capítulo, priorizando os que realmente exigem geometria espacial. Manter diagramas próprios de causalidade, mapas e oficinas onde três dimensões não acrescentem compreensão. Usar `capitulos-3d.json` para evitar refazer os 16 atendidos.

## Integração e ferramentas

GitHub foi utilizado para conferir repositório, PR integrada e CI. Chrome DevTools/ECC forneceu Lighthouse; Playwright executou a matriz de navegação. As skills locais de design review e motion foundations orientaram acessibilidade, interação e reprodução finita. **Design & Motion Kit não estava disponível entre os plugins encontrados**, portanto esta entrega não afirma tê-lo executado.

Seis capturas históricas com `?` no nome foram renomeadas para ASCII para permitir checkout no Windows; hashes idênticos, sem alterar as imagens. `windows-renames.json` registra o mapeamento. Nenhum PDF, texto extraído ou dado de licenciamento novo foi incluído. Arquivos de teste existentes foram recuperados diretamente de Git apenas no checkout isolado.

Scripts de captura: `browser-integral.cjs`, `browser-3d.cjs` e `browser-3d-complementar.cjs`, com parâmetros locais de navegador/URL/pasta de evidências. Instalar dependências do projeto e executar contra o build em preview na porta 3008. As capturas selecionadas em `captures/` são exemplos; a matriz completa permanece em `C:/crivo-audit-evidence-20261010/`.
