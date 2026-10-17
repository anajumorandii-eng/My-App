# Evidências de validação

As imagens usam exclusivamente dados sintéticos de uma conta demonstrativa. Nenhum teste desta entrega consulta a conta de IA da usuária ou altera o roteamento produtivo.

## Comportamentos cobertos

- Sessão obrigatória antes de capturar e isolamento por UID autenticado.
- Encerramento impede novas capturas; exclusão não permite recriação por chamadas em andamento.
- Mesmo prompt nas duas gerações e nenhuma identidade de candidato na resposta ou exportação cega.
- Rubrica completa antes de revelar, preferência com empate/nenhuma e resultado posterior editável sem alterar notas iniciais.
- Recusa de candidatos repetidos, desconhecidos ou com configuração de endpoint arbitrário.
- Falhas por candidato, texto parcial no streaming e falha de persistência sem interromper o estudo.
- Prazo limitado da captura para não prender o estudo em caso de lentidão do banco.
- Relatório separa tela/tarefa/tipo de teste, identifica prompts distintos e exclui cache das médias de tempo.
- Exportação CSV neutraliza fórmulas; JSON preserva o histórico completo sujeito ao cegamento.
- A tela exige consentimento explícito e trata erro de autorização.

## Navegador

Chromium local, build de produção, autenticação e endpoints simulados. Verificações em 390×844, 834×1112 e 1366×900, com movimento reduzido. Capturas em `screenshots/`. Confirmação do fluxo de formulário, ocultação/revelação e resultado posterior por interação real no navegador. Isso valida a interface; não substitui um teste integrado com Firestore e gateway após publicar uma revisão de teste.

## Publicação

A implementação não foi mesclada nem implantada. A revisão publicada deve confirmar, com uma conta administrativa real, a identidade do Cloud Run no Firestore e uma geração de cada candidato. O catálogo inicial aproveita os modelos distintos já configurados no servidor. Um novo provedor exige conexão no gateway e configuração dos candidatos antes de entrar nas comparações.

## Reproduzir a verificação visual

Em um terminal, execute `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4173`. Em outro, execute `node scripts/verify-ai-evaluation.mjs`. O script aceita `CHROMIUM_PATH` para um Chromium já instalado e `CRIVO_PREVIEW_URL` para outra porta local. Recusa endereços externos, simula autenticação e API e salva as capturas sem acessar contas reais.

## Resultado local

- Checagem de tipos: `npm run lint`, concluída sem erros.
- Servidor e bibliotecas: 1.118 testes aprovados, usando os mesmos arquivos do comando `test:node`, com concorrência limitada a dois processos.
- Interface: 229 arquivos e 3.168 testes aprovados na etapa `test:vitest` da execução de `VITEST_MAX_WORKERS=4 npm test`.
- Build: `npm run build`, concluído; permanecem avisos de tamanho dos chunks de conteúdo já existentes.
- Navegador: script reproduzível concluído, sem erros de página e sem rolagem horizontal nos três tamanhos. Avaliação com empate, revelação e anotação posterior confirmadas.
