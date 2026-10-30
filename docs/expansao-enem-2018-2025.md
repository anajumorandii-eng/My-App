# ENEM 2018–2025: dois dias completos

O corpus contém **1.440 posições de prova**: 180 por ano, com 90 por dia.
São os cadernos amarelos da aplicação regular impressa (CD2/CD5), com a
opção **Inglês** nas questões 01–05. Espanhol, cores equivalentes, aplicação
digital, PPL e reaplicações não são somados novamente.

Os gabaritos definitivos registram **10 anuladas**. Elas permanecem acessíveis
em Questões, identificadas e sem possibilidade de resposta, comentário por
alternativa ou alteração de domínio. Os demais fluxos de treino recebem apenas
questões válidas: **1.430 itens** deste corpus.

O banco completo passa de 4.191 para **5.553 registros**, preservando os IDs das
78 questões ENEM anteriores. São **1.362 novos registros**, incluindo as dez
anuladas. O manifesto relaciona a numeração canônica amarela ao ID existente;
registros anteriormente transcritos de outra cor mantêm sua fonte e seu número
histórico, sem criar uma segunda questão.

## Extração e fontes

`scripts/data/enem-completo-2018-2025/manifest.json` registra os 32 documentos
de prova/gabarito com URLs e hashes SHA-256, as 1.440 posições, a equivalência
dos IDs e os recortes com página, coordenadas e hash.

Foram usados os PDFs oficiais identificados hospedados no espelho do
[Curso Objetivo](https://www.curso-objetivo.br/vestibular/resolucao-comentada/enem.aspx).
O acesso direto aos PDFs do INEP retornou HTTP 503 durante a sessão.
O dia 2 de 2020 exige o caminho `2020/presencial/2dia/` nesse espelho.
Os gabaritos são pareados por **ano, dia e cor**, e não pelo número de uma
questão proveniente de outra versão.

A extração usa a camada nativa de texto. Corrige a codificação de fontes dos
PDFs antigos, preserva expoentes, textos compartilhados e divide páginas com
duas colunas ou trechos de largura inteira. Frações e expressões cujo arranjo
tipográfico não pode ser representado por texto simples são conservadas também
em recortes de imagem com suas letras de alternativa.

As **931 figuras** publicadas ficam em `public/question-media/enem-completo/`.
São recortes isolados de imagens, gráficos, tabelas, esquemas e expressões.
**Não são páginas de prova**. O suporte branco exterior é removido com
transparência; cores, fotografias e regiões internas que fazem parte da
informação original são preservadas. Elementos nativos de texto não viram
imagens de parágrafos. O anúncio puramente tipográfico de 2019/07 é conservado
como texto, sem seu papel texturizado.
Todos os arquivos são exportados em WebP com canal alpha e uma margem exterior
transparente. Não se apagam regiões de informação internas às fotografias.

A conferência combina validação estrutural de todos os itens e inspeção visual
de amostras e casos problemáticos. Não é uma revisão humana individual integral
de todos os enunciados. O manifesto distingue classificações editoriais
preexistentes, registros preservados e sugestões de classificação por
similaridade lexical. As sugestões de 2018–2023 não são rotuladas como revisão
editorial manual. `medium` é uma estimativa de integração, sem calibração TRI.

## Comentários por IA

O botão **Resolução por etapas** chama `/api/ai/question-explanation` com o ID
da questão e o ID da alternativa marcada. O servidor busca o enunciado,
alternativas, gabarito e figuras no banco, substituindo esses campos fornecidos
pelo cliente pelos dados conferidos. Só lê imagens locais sob `question-media`;
não resolve URLs arbitrárias enviadas pela estudante.

OmniRoute mantém a tarefa `question-explanation` no modelo profundo configurado
(`AI_DEEP_MODEL`/`OMNIROUTE_MODEL`). JSON, streaming e fallback preservam as
imagens. Gemini recebe as mesmas figuras em `inlineData`. Na imagem de produção,
o servidor lê os arquivos de `dist`, conforme o Dockerfile; em desenvolvimento,
lê `public`. Um comentário que chega depois da troca de questão é descartado.

As questões sem comentário editorial prévio mostram o gabarito como referência;
a resolução detalhada é gerada sob demanda. Não se atribui um comentário
genérico ao INEP nem se apresentam comentários de IA como já revisados.
Os testes de roteamento usam provedores simulados; não certificam a
disponibilidade ou a capacidade de visão da configuração remota em produção.

## Reproduzir

1. Baixar os PDFs pareados para uma pasta de trabalho como
   `work/enem-full/ANO-DIA-exam.pdf` e `ANO-DIA-key.pdf`.
2. Instalar as dependências de `scripts/requirements-content.txt`.
3. Exportar o catálogo atual para `work/enem-full/topics.json` e executar
   `python scripts/extract-enem-complete.py work/enem-full`.
4. Executar `python scripts/assemble-enem-complete.py work/enem-full`.
5. Copiar somente os recortes referenciados no manifesto para
   `public/question-media/enem-completo/`.
6. Simular com `npx tsx scripts/import-enem-complete.ts`; usar `--write` para
   aplicar após validar os artefatos. A escrita do banco é atômica.

Reimportar o lote completo acrescenta zero registros. O importador anterior do
lote de 64 questões também continua reaplicável, preservando figuras derivadas.

## Verificação

- 1.282 testes Node aprovados; um teste ignorado pela suíte.
- 73 testes de interface aprovados; TypeScript e build aprovados.
- As 1.440 posições foram conferidas quanto a cobertura e gabarito pareado.
- Os 931 arquivos foram decodificados e verificados quanto a dimensões,
  integridade e canal alpha. Nenhuma referência de mídia ficou ausente.
- Reimportações dos dois lotes acrescentam zero registros. Os 4.191 registros
  anteriores preservam conteúdo e IDs, com atualização apenas de figuras
  derivadas nas questões correspondentes.
- O acesso ao banco e às imagens foi exercitado também a partir de `dist`,
  incluindo numeração canônica e rejeição de comentário por alternativa anulada.
