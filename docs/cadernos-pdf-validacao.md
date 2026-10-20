# Cadernos de aprofundamento: geração e paginação

Correção de 20/10/2026, baseada em `98ee082` de `anajumorandii-eng/My-App`.

## Causas e correção

- O índice aceitava parágrafos em negrito e perdia os níveis originais do Markdown. Agora aceita títulos e `summary`, exclui títulos internos a listas/tabelas/citações e usa dois níveis semânticos. Os IDs são colocados no próprio título, evitando um destino na página anterior.
- O índice era uma lista numerada sem páginas e tinha altura mínima de uma página. Agora flui em páginas com margens próprias, sem numeração de itens; o título acompanha o início da lista, e uma seção principal acompanha seu primeiro subtítulo.
- Uma largura fixa ancestral de 210 mm em páginas de índice mais estreitas fazia o Chromium reduzir todo o PDF. A raiz agora usa `display: contents`, preservando dimensões e tamanho tipográfico.
- O serviço renderiza o HTML, lê os destinos internos com PDF.js, preenche as páginas e renderiza novamente até estabilizar. O PDF entregue é o resultado integral da última renderização; nenhuma página é recortada ou remontada.
- Desktop e iPad recebem o mesmo arquivo preparado no servidor. A impressão passa pela abertura desse arquivo, com opção de salvar/compartilhar. Isso exige o serviço `/api/study-pdf`, já autenticado e disponível na imagem Docker do projeto.
- Contêineres extensos podem continuar entre páginas. Parágrafos têm órfãs/viúvas; títulos e introduções acompanham o conteúdo seguinte. Tabelas pequenas e etapas curtas são mantidas juntas; tabelas grandes fluem entre linhas com cabeçalho repetido. Linhas maiores que a área útil permitem fragmentação. Fórmulas e figuras preservam sua unidade; figuras têm limites de tamanho proporcionais à página.
- A família efetiva do corpo no ambiente Linux original era Liberation Serif, via fallback de Times New Roman. Os quatro estilos foram incorporados ao projeto, com sua licença, para estabilizar métricas entre sistemas. Pesos, tamanhos, cores e fontes próprias da capa foram mantidos. A matemática continua pelo MathML nativo existente.
- Parágrafos existentes são respeitados. Frases podem ser separadas em transições discursivas explícitas, sem limites de caracteres ou reescrita. Elementos de matemática e ênfase permanecem intactos. O prompt exige títulos Markdown, etapas em listas e parágrafos por ideia. Atributos `start` de listas ordenadas são preservados.

## Materiais e verificação

Os cadernos pessoais gerados pela IA não estão versionados. Os casos de referência usam todos os capítulos editoriais disponíveis dos tópicos, na ordem do catálogo, com identificação desse propósito na capa. O teste de estresse acrescenta material sintético explicitamente identificado.

| Arquivo | Páginas | Entradas |
| --- | ---: | ---: |
| `historia-brasil-colonia-fuvest.pdf` | 17 | 54 |
| `fisica-cinematica-escalar-fuvest.pdf` | 9 | 25 |
| `tabelas-textos-longos.pdf` | 30 | 105 |

Foram inspecionadas visualmente todas as 56 páginas, incluindo fórmulas com frações/índices/expoentes e alinhamento, diagrama com legenda, tabela de 95 linhas, fontes longas e índice com várias páginas. A inspeção automática compara integralmente o texto editorial e sua ordem (normalizando espaços e removendo apenas o rodapé), confere destinos e números impressos de todas as entradas, fontes incorporadas e limites de página. A tabela mantém a sequência de registros e repete cabeçalhos.

Fontes encontradas: LiberationSerif, LiberationSerif-Bold, Cormorant Garamond, Playfair Display e CambriaMath para os símbolos matemáticos no Chrome/Windows usado nesta validação. O servidor Linux conserva suas fontes matemáticas complementares instaladas. Não houve validação em dispositivo iPad físico ou no servidor de produção.

## Reprodução

1. `npm ci`
2. Iniciar Vite em `127.0.0.1:3138`.
3. Definir `CHROMIUM_PATH` para o executável Chromium/Chrome local.
4. `node --import tsx scripts/validate-study-pdf.mjs`
5. Com PyMuPDF e Pillow disponíveis, `python scripts/inspect-study-pdf.py`.

Artefatos locais: `output/study-pdf/`, incluindo PDFs, imagens de cada página, folhas de contato, resultados e logs. Não se deve publicar nessa pasta dados privados de cadernos pessoais.

Verificações executadas: checagem TypeScript, compilação de produção, 31 testes focados de componentes e 7 testes de servidor/parágrafos, incluindo renderização real, bloqueio de scripts/rede e convergência do índice extenso. A suíte completa foi tentada; possui dependências de materiais brutos e recursos fora do checkout reduzido, além de falhas por tempo limite na execução paralela. Não é apresentada como integralmente aprovada.
