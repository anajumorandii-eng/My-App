# Correções de travamentos e persistência — 07/10/2026

Base: `bef2de0d`, após a integração da PR #279. A gravação privada serviu para observar a retomada da tela Hoje; ela e seus quadros não fazem parte desta entrega.

## Correções

- A agenda lia a grade semanal e a exceção duas vezes e aguardava o Google Calendar antes das leituras. Agora faz as três operações em paralelo, consulta cada documento uma vez e limita a operação completa do calendário a cinco segundos, incluindo autenticação e leitura da resposta. Falhas mantêm a grade salva com aviso.
- O Hoje reutiliza os dados de domínio e objetivos já carregados pelo plano diário, eliminando duas instâncias de hooks e suas leituras.
- Os catálogos de instrumentos e pranchas mantêm seus IDs e decisões de cobertura, mas carregam apenas a implementação exibida. O catálogo de Literatura foi separado do componente sem alterar textos ou estados editoriais. O chunk principal de Visual passou de aproximadamente 2.787 kB para 1.818 kB minificados, redução de cerca de 35%; os instrumentos selecionados continuam sendo baixados separadamente.
- Dispositivos de toque deixam de usar ruído fractal no papel, fundos presos à rolagem e filtros de transparência nos painéis, topo e trilho. O caderno mantém cores e rabiscos, com superfícies opacas.
- Perfil e objetivos isolam dados por UID e bloqueiam gravações antes de uma leitura confirmada. Gravam patches, confirmam o salvamento e serializam operações. Uma falha restaura os valores confirmados somente nos campos cuja revisão ainda pertence àquela operação, preservando edições posteriores, inclusive valores repetidos.
- Resumos sincronizam operações por capítulo em transações, com pendências duráveis por UID e recibos de aplicação. Duas abas preservam capítulos distintos; operações offline voltam após recarregar; caches antigos de capítulos ausentes na nuvem são recuperados. Recibos impedem reaplicações atrasadas e duplicadas. Campos opcionais `undefined` das respostas são removidos antes da gravação no Firestore.
- A leitura de obras cancela respostas antigas ao trocar obra ou conta, retenta o catálogo após autenticação e limpa o progresso no logout. Desmarcar um capítulo omite a data de conclusão. Gravações aguardam confirmação, exibem erros e restauram o estado anterior quando falham.
- Segredos internos são comparados pelo tamanho dos buffers UTF-8. Cabeçalhos inválidos não lançam exceções; indisponibilidade do banco nas rotas de lembretes e ingestão produz 503. Texto e podcast compartilham a mesma cota diária também no modo em memória.
- KaTeX usa uma única versão corrigida, incluindo dependências transitivas.
- E2E verifica a interface atual, sem expectativas do núcleo removido nem asserções tautológicas de movimento. Artefatos ficam fora da árvore observada pelo Vite. O CI passa a verificar navegação e retomada na build de produção.

## Verificação

| Verificação | Resultado |
| --- | --- |
| `npm run lint` | sem erros de tipos |
| `npm test` | 934 testes Node + 1.389 testes Vitest; 2.323 passando |
| `npm run build` | concluído |
| Playwright na build de produção | 8 testes passando; Hoje, primeira dobra, temas, movimento reduzido, rotas e iPad em paisagem |
| Navegação em 390, 834, 1180 e 1366 px | sem erros de JavaScript ou overflow horizontal; abertura da explicação funciona |
| `npm run visual:matrix` | 13 testes passando; matriz existente sem diferenças |
| `npm audit` | nenhuma vulnerabilidade conhecida apontada |
| Revisão independente | achados corrigidos com regressões; sem problemas bloqueantes restantes |

Os testes usam dados de demonstração ou fixtures sintéticas. A mídia privada e dados reais de estudo não foram publicados.

## Limites e acompanhamento

O modo iPad foi exercitado no Chromium com toque; não houve execução em um iPad físico com Safari. As gravações do Firestore foram validadas com transações simuladas, sem teste de integração em uma conta de produção. Isso não demonstra o desaparecimento de todo travamento possível no dispositivo real.

O corpus completo de resumos continua em um chunk de aproximadamente 3.980 kB minificados. Os recibos de sincronização acrescentam um documento por operação; ainda não há política automática de retenção. A entrega não altera o conteúdo editorial nem suas aprovações.

As correções são entregues em branch e pull request. A publicação depende de integração e implantação; não há merge automático nesta entrega.
