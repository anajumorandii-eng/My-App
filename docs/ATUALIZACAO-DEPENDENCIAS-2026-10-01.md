# Atualização de dependências — 01/10/2026

Mudanças locais em `main`, sobre `6cbc94cdb46048d00947db136ae529e1c6ef41af`, após nova conferência de `origin/main`. Esta etapa sucede a [primeira rodada da retomada](RETOMADA-PROGRESSO-CARREGAMENTO-2026-10-01.md).

## Escopo

Atualizadas as dependências dentro dos intervalos já autorizados pelo `package.json`, sem migração das versões principais de React, Express, Firebase, Vite ou TypeScript. O lockfile registra as versões efetivamente instaladas. Os mínimos de Firebase, Firebase Admin, Undici e jsdom foram elevados para manter as correções numa resolução futura.

| Dependência | Antes | Depois |
| --- | --- | --- |
| Firebase | 12.18.0 | 12.19.0 |
| Firebase Admin | 14.3.0 | 14.5.0 |
| Undici direto | 7.29.0 | 7.30.0 |
| jsdom | 30.0.1 | 30.1.1 |
| Undici de jsdom | 8.10.0 | 8.11.2 |
| React / React DOM | 19.2.8 | 19.3.0 |
| brace-expansion 2.x | 2.1.4 | 2.1.7 |

A versão nova do Firebase Admin requer Node >=22. As dependências de desenvolvimento resolvidas nesta instalação têm requisitos mais estritos: usar Node 22.22.2+, 24.15.0+ ou 26+; Node 22.23.3 foi utilizado nas verificações de integração. Docker e CI existentes seguem a versão atual de Node 22.

## Dependências transitivas

O Firestore cliente 4.17.2 ainda declara `@grpc/grpc-js ~1.9.0`. Foi aplicado um override limitado a `@firebase/firestore`, usando gRPC 1.14.5. O Firebase Admin já recebe essa versão naturalmente. A sugestão automática de rebaixar Firebase para 9.14.0 não foi aplicada.

O Storage 8.2.0 ainda recebe gaxios 6, que depende de uuid 9. Foi aplicado um override limitado a `gaxios@6`, usando uuid 11.1.1. Essa versão preserva o carregamento CommonJS e a função `v4` usada por gaxios para gerar limites multipart.

Reavaliar os overrides quando os pacotes fornecedores corrigirem os próprios intervalos. São substituições além dos intervalos transitivos declarados; as verificações de integração abaixo reduzem o risco, mas não cobrem todas as operações dos SDKs.

## Verificações

- Auditoria npm: 12 dependências afetadas (6 altas, 6 moderadas) antes; zero vulnerabilidades conhecidas após a atualização, conforme a base consultada nesta data.
- Instalação limpa com `npm ci --no-audit --no-fund`, em diretório temporário separado: aprovada.
- TypeScript e build de produção: aprovados.
- Suíte completa: 779 testes Node e 760 testes Vitest aprovados (1.539 no total), com zero falhas.
- Auth e Firestore em emuladores de projeto `demo-crivo-deps`: criação de usuário, verificação de token pelo Admin, leitura pelo cliente de documento gravado pelo Admin, transação cliente e consulta Admin de gravação cliente aprovadas.
- HTTP local: multipart de gaxios com o uuid substituído e requisição por Undici aprovados.
- Chromium: busca por mitose, carregamento do catálogo sob demanda, navegação por teclado para Caderno e tela Hoje em celular aprovados. Questões, Resumos, Visual, Redação e Perfil abertos em 1366 px e 390 px: dez verificações sem exceções de página ou transbordamento horizontal.

Evidências locais fora do repositório: `/workspace/crivo-audit/dependencias-telas.json`, `/workspace/crivo-audit/carregamento.json` e logs temporários `crivo-deps-*`. Nenhuma credencial ou exportação do histórico pessoal integra estes documentos.

## Limites e continuidade

As verificações de SDK usam dados sintéticos em emuladores locais. Não validam OAuth interativo no aparelho, Calendar, Drive, IA remota ou upload real em Storage. O build mantém avisos de tamanho dos chunks de Visual e do corpus de resumos; a redução anterior do bundle principal permanece.

A estudante confirmou que o domínio baixo corresponde ao início do uso. Não recalcular, limpar ou migrar seu histórico com base nessa observação. A consulta autorizada ao histórico foi somente leitura.

As mudanças permanecem locais, sem publicação. Próximas prioridades: revisão das representações visuais e seus critérios de qualidade; recuperação fiel dos enunciados pendentes de Fuvest 2025; continuação editorial dos resumos. A matriz de presença não equivale à aprovação pedagógica das representações.
